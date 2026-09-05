import { useEffect, useMemo, useState } from "react";

import {BarChart3,Loader2,LineChart,ScatterChart} from "lucide-react";

import {getDatasetData} from "../services/api";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart as RechartsLineChart,
    Line,
    ScatterChart as RechartsScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

function generateChartRecommendations(columns, data) {

    const recommendations = [];

    const numericColumns = columns.filter(
        (column) =>
            data.some(
                (row) =>
                    typeof row[column] === "number"
            )
    );

    const categoricalColumns = columns.filter(
        (column) =>
            !numericColumns.includes(column)
    );



    categoricalColumns.forEach(
        (categorical) => {

            numericColumns.forEach(
                (numeric) => {

                    recommendations.push({

                        type: "bar",

                        xColumn: categorical,

                        yColumn: numeric,

                        title:
                            `${categorical} vs ${numeric}`,

                        reason:
                            `Compare ${numeric} across different ${categorical} categories.`,

                        priority: 2

                    });

                }
            );

        }
    );


    

    for (
        let i = 0;
        i < numericColumns.length;
        i++
    ) {

        for (
            let j = i + 1;
            j < numericColumns.length;
            j++
        ) {

            const x =
                numericColumns[i];

            const y =
                numericColumns[j];


            recommendations.push({

                type: "scatter",

                xColumn: x,

                yColumn: y,

                title:
                    `${x} vs ${y}`,

                reason:
                    `Explore the relationship between ${x} and ${y}.`,

                priority: 1

            });

        }

    }




    recommendations.sort(
        (a, b) =>
            a.priority - b.priority
    );


    return recommendations.slice(
        0,
        6
    );
}


function VisualizationPanel({ file }) {

    const [dataset, setDataset] =useState(null);

    const [chartType, setChartType] =useState("bar");

    const [xColumn, setXColumn] =useState("");

    const [yColumn, setYColumn] =useState("");

    const [loading, setLoading] =useState(false);

    const [error, setError] = useState(null);

    const recommendations =
    useMemo(() => {

        if (!dataset) {
            return [];
        }

        return generateChartRecommendations(
            dataset.columns,
            dataset.data
        );

    }, [dataset]);



    useEffect(() => {

        if (!file) {
            return;
        }


        const loadDataset = async () => {

            try {

                setLoading(true);

                setError(null);

                const data =
                    await getDatasetData(file);

                setDataset(data);


                if (data.columns?.length > 0) {

                    setXColumn(
                        data.columns[0]
                    );
                }


                if (data.columns?.length > 1) {

                    const numericColumn =
                        data.columns.find(
                            (column) =>
                                data.data.some(
                                    (row) =>
                                        typeof row[column] ===
                                        "number"
                                )
                        );

                    setYColumn(
                        numericColumn ||
                        data.columns[1]
                    );
                }

            } catch (err) {

                console.error(err);

                setError(
                    err.response?.data?.detail ||
                    "Unable to load dataset for visualization."
                );

            } finally {

                setLoading(false);

            }
        };


        loadDataset();

    }, [file]);


    const numericColumns = useMemo(() => {

        if (!dataset?.data) {
            return [];
        }


        return dataset.columns.filter(
            (column) =>
                dataset.data.some(
                    (row) =>
                        typeof row[column] === "number"
                )
        );

    }, [dataset]);


    const chartData = useMemo(() => {

        if (
            !dataset?.data ||
            !xColumn ||
            !yColumn
        ) {
            return [];
        }


        if (chartType === "scatter") {

            return dataset.data
                .map((row) => ({

                    x: Number(
                        row[xColumn]
                    ),

                    y: Number(
                        row[yColumn]
                    )

                }))
                .filter(
                    (item) =>
                        Number.isFinite(item.x) &&
                        Number.isFinite(item.y)
                );

        }


        if (chartType === "line") {

            return dataset.data
                .map((row) => ({

                    name: String(
                        row[xColumn] ?? ""
                    ),

                    value: Number(
                        row[yColumn]
                    )

                }))
                .filter(
                    (item) =>
                        item.name !== "" &&
                        Number.isFinite(item.value)
                );

        }


        return dataset.data
            .map((row) => ({

                name: String(
                    row[xColumn] ?? ""
                ),

                value: Number(
                    row[yColumn]
                )

            }))
            .filter(
                (item) =>
                    item.name !== "" &&
                    Number.isFinite(item.value)
            );

    }, [
        dataset,
        chartType,
        xColumn,
        yColumn
    ]);


    if (!file) {
        return null;
    }


    return (

        <section className="mt-10">

            {/* Header */}

            <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">

                    <BarChart3
                        size={21}
                        className="text-gray-700"
                    />

                </div>

                <div>

                    <h2 className="text-2xl font-semibold text-gray-900">
                        Data Visualization
                    </h2>

                    <p className="text-sm text-gray-500">
                        Explore relationships and patterns in your data
                    </p>

                </div>

            </div>


            {/* Loading */}

            {loading && (

                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-5 text-gray-600 shadow-sm">

                    <Loader2
                        size={20}
                        className="animate-spin"
                    />

                    Loading dataset...

                </div>

            )}


            {/* Error */}

            {error && (

                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

                    {error}

                </div>

            )}


            {/* Visualization */}

            {dataset && !loading && (

                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

                    {recommendations.length > 0 && (

    <div className="border-b border-gray-200 p-5">

        <div className="mb-4">

            <h3 className="text-lg font-semibold text-gray-900">
                Recommended Visualizations
            </h3>

            <p className="mt-1 text-sm text-gray-500">
                Based on the types of columns in your dataset
            </p>

        </div>


        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

            {recommendations.map(
                (recommendation, index) => (

                    <button
                        key={index}
                        type="button"
                        onClick={() => {

                            setChartType(
                                recommendation.type
                            );

                            setXColumn(
                                recommendation.xColumn
                            );

                            setYColumn(
                                recommendation.yColumn
                            );

                        }}
                        className="group rounded-xl border border-gray-200 bg-gray-50 p-4 text-left transition hover:border-gray-400 hover:bg-white"
                    >

                        <div className="flex items-start justify-between gap-3">

                            <div>

                                <p className="font-semibold text-gray-900">

                                    {index === 0 && (
                                        <span className="mr-2">
                                            ⭐
                                        </span>
                                    )}

                                    {recommendation.title}

                                </p>


                                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">

                                    {recommendation.type ===
                                    "bar"
                                        ? "Bar Chart"
                                        : "Scatter Plot"
                                    }

                                </p>

                            </div>


                            <span className="text-gray-400 transition group-hover:translate-x-1">

                                →

                            </span>

                        </div>


                        <p className="mt-3 text-sm leading-5 text-gray-500">

                            {recommendation.reason}

                        </p>

                    </button>

                )
            )}

        </div>

    </div>

)}

                    {/* Controls */}

                    <div className="grid grid-cols-1 gap-4 border-b border-gray-200 p-5 md:grid-cols-3">

                        {/* Chart Type */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">

                                Chart Type

                            </label>

                            <select
                                value={chartType}
                                onChange={(event) =>
                                    setChartType(
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-500"
                            >

                                <option value="bar">
                                    Bar Chart
                                </option>

                                <option value="line">
                                    Line Chart
                                </option>

                                <option value="scatter">
                                    Scatter Plot
                                </option>

                            </select>

                        </div>


                        {/* X Axis */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">

                                X Axis

                            </label>

                            <select
                                value={xColumn}
                                onChange={(event) =>
                                    setXColumn(
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-500"
                            >

                                {dataset.columns.map(
                                    (column) => (

                                        <option
                                            key={column}
                                            value={column}
                                        >
                                            {column}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* Y Axis */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">

                                Y Axis

                            </label>

                            <select
                                value={yColumn}
                                onChange={(event) =>
                                    setYColumn(
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-500"
                            >

                                {numericColumns.map(
                                    (column) => (

                                        <option
                                            key={column}
                                            value={column}
                                        >
                                            {column}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                    </div>


                    {/* Chart */}

                    <div className="p-5">

                        {chartData.length === 0 ? (

                            <div className="flex min-h-[350px] items-center justify-center rounded-lg bg-gray-50 text-center text-sm text-gray-500">

                                Not enough numeric data available
                                for this chart.

                            </div>

                        ) : (

                            <div className="h-[400px] w-full">

                                {chartType === "bar" && (

                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >

                                        <BarChart
                                            data={chartData}
                                            margin={{
                                                top: 20,
                                                right: 20,
                                                left: 10,
                                                bottom: 50
                                            }}
                                        >

                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                            />

                                            <XAxis
                                                dataKey="name"
                                                angle={-35}
                                                textAnchor="end"
                                                height={70}
                                            />

                                            <YAxis />

                                            <Tooltip />

                                            <Legend />

                                            <Bar
                                                dataKey="value"
                                                name={yColumn}
                                                fill="#374151"
                                                radius={[
                                                    4,
                                                    4,
                                                    0,
                                                    0
                                                ]}
                                            />

                                        </BarChart>

                                    </ResponsiveContainer>

                                )}


                                {chartType === "line" && (

                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >

                                        <RechartsLineChart
                                            data={chartData}
                                            margin={{
                                                top: 20,
                                                right: 20,
                                                left: 10,
                                                bottom: 50
                                            }}
                                        >

                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                            />

                                            <XAxis
                                                dataKey="name"
                                                angle={-35}
                                                textAnchor="end"
                                                height={70}
                                            />

                                            <YAxis />

                                            <Tooltip />

                                            <Legend />

                                            <Line
                                                type="monotone"
                                                dataKey="value"
                                                name={yColumn}
                                                stroke="#374151"
                                                strokeWidth={2}
                                                dot
                                            />

                                        </RechartsLineChart>

                                    </ResponsiveContainer>

                                )}


                                {chartType === "scatter" && (

                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >

                                        <RechartsScatterChart
                                            margin={{
                                                top: 20,
                                                right: 20,
                                                bottom: 30,
                                                left: 10
                                            }}
                                        >

                                            <CartesianGrid />

                                            <XAxis
                                                type="number"
                                                dataKey="x"
                                                name={xColumn}
                                            />

                                            <YAxis
                                                type="number"
                                                dataKey="y"
                                                name={yColumn}
                                            />

                                            <Tooltip
                                                cursor={{
                                                    strokeDasharray:
                                                        "3 3"
                                                }}
                                            />

                                            <Legend />

                                            <Scatter
                                                name={`${xColumn} vs ${yColumn}`}
                                                data={chartData}
                                                fill="#374151"
                                            />

                                        </RechartsScatterChart>

                                    </ResponsiveContainer>

                                )}

                            </div>

                        )}

                    </div>


                    {/* Chart information */}

                    <div className="border-t border-gray-200 px-5 py-4">

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">

                            <span>
                                <strong className="text-gray-800">
                                    X:
                                </strong>{" "}
                                {xColumn}
                            </span>

                            <span>
                                <strong className="text-gray-800">
                                    Y:
                                </strong>{" "}
                                {yColumn}
                            </span>

                            <span>
                                <strong className="text-gray-800">
                                    Points:
                                </strong>{" "}
                                {chartData.length}
                            </span>

                        </div>

                    </div>

                </div>

            )}

        </section>
    );
}


export default VisualizationPanel;