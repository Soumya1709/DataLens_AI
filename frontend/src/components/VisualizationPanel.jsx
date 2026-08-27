import { useEffect, useMemo, useState } from "react";

import {
    BarChart3,
    Loader2,
    LineChart,
    ScatterChart
} from "lucide-react";

import {
    getDatasetData
} from "../services/api";

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


function VisualizationPanel({ file }) {

    const [dataset, setDataset] =
        useState(null);

    const [chartType, setChartType] =
        useState("bar");

    const [xColumn, setXColumn] =
        useState("");

    const [yColumn, setYColumn] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState(null);


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