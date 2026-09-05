import { useEffect, useState } from "react";

import {BarChart3,Calculator,Tag,AlertCircle,GitCompare,Loader2} from "lucide-react";

import {getProfile} from "../services/api";


function ProfilingPanel({ file,profile, setProfile }) {


    const [loading, setLoading] =useState(false);

    const [error, setError] = useState(null);


    useEffect(() => {

        if (!file) {
            return;
        }


        const loadProfile = async () => {

            try {

                setLoading(true);

                setError(null);

                const data =
                    await getProfile(file);

                setProfile(data);

            } catch (err) {

                console.error(err);

                setError(
                    err.response?.data?.detail ||
                    "Unable to generate data profile."
                );

            } finally {

                setLoading(false);

            }
        };


        loadProfile();

    }, [file]);


    if (!file) {
        return null;
    }


    return (

        <section className="mt-10">

            <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">

                    <BarChart3
                        size={21}
                        className="text-gray-700"
                    />

                </div>

                <div>

                    <h2 className="text-2xl font-semibold text-gray-900">
                        Data Profile
                    </h2>

                    <p className="text-sm text-gray-500">
                        Statistical analysis of your dataset
                    </p>

                </div>

            </div>


            {loading && (

                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-5 text-gray-600 shadow-sm">

                    <Loader2
                        size={20}
                        className="animate-spin"
                    />

                    Generating data profile...

                </div>

            )}


            {error && (

                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

                    {error}

                </div>

            )}


            {profile && (

                <div className="space-y-6">

                    <NumericStatistics
                        data={
                            profile.numeric_statistics
                        }
                    />


                    <CategoricalStatistics
                        data={
                            profile.categorical_statistics
                        }
                    />


                    <OutlierAnalysis
                        data={
                            profile.outliers
                        }
                    />


                    <CorrelationAnalysis
                        data={
                            profile.correlations
                        }
                    />

                </div>

            )}

        </section>
    );
}

function NumericStatistics({ data }) {

    if (
        !data ||
        Object.keys(data).length === 0
    ) {

        return null;
    }


    return (

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

            <div className="flex items-center gap-3 border-b border-gray-200 p-5">

                <Calculator
                    size={20}
                    className="text-gray-700"
                />

                <div>

                    <h3 className="font-semibold text-gray-900">
                        Numeric Statistics
                    </h3>

                    <p className="text-sm text-gray-500">
                        Summary statistics for numerical columns
                    </p>

                </div>

            </div>


            <div className="overflow-x-auto">

                <table className="min-w-full text-left text-sm">

                    <thead className="bg-gray-50">

                        <tr>

                            <th className="px-5 py-3 font-semibold text-gray-700">
                                Column
                            </th>

                            <th className="px-5 py-3 font-semibold text-gray-700">
                                Count
                            </th>

                            <th className="px-5 py-3 font-semibold text-gray-700">
                                Mean
                            </th>

                            <th className="px-5 py-3 font-semibold text-gray-700">
                                Median
                            </th>

                            <th className="px-5 py-3 font-semibold text-gray-700">
                                Min
                            </th>

                            <th className="px-5 py-3 font-semibold text-gray-700">
                                Max
                            </th>

                            <th className="px-5 py-3 font-semibold text-gray-700">
                                Std
                            </th>

                            <th className="px-5 py-3 font-semibold text-gray-700">
                                Q1
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {Object.entries(data).map(
                            ([column, stats]) => (

                                <tr
                                    key={column}
                                    className="border-t border-gray-100"
                                >

                                    <td className="px-5 py-4 font-medium text-gray-900">
                                        {column}
                                    </td>

                                    <td className="px-5 py-4 text-gray-600">
                                        {stats.count}
                                    </td>

                                    <td className="px-5 py-4 text-gray-600">
                                        {stats.mean}
                                    </td>

                                    <td className="px-5 py-4 text-gray-600">
                                        {stats.median}
                                    </td>

                                    <td className="px-5 py-4 text-gray-600">
                                        {stats.min}
                                    </td>

                                    <td className="px-5 py-4 text-gray-600">
                                        {stats.max}
                                    </td>

                                    <td className="px-5 py-4 text-gray-600">
                                        {stats.std}
                                    </td>

                                    <td className="px-5 py-4 text-gray-600">
                                        {stats.q1}
                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

function CategoricalStatistics({ data}) {

    if (
        !data ||
        Object.keys(data).length === 0
    ) {

        return null;
    }


    return (

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

            <div className="flex items-center gap-3 border-b border-gray-200 p-5">

                <Tag
                    size={20}
                    className="text-gray-700"
                />

                <div>

                    <h3 className="font-semibold text-gray-900">
                        Categorical Statistics
                    </h3>

                    <p className="text-sm text-gray-500">
                        Distribution of categorical columns
                    </p>

                </div>

            </div>


            <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">

                {Object.entries(data).map(
                    ([column, stats]) => (

                        <div
                            key={column}
                            className="rounded-lg bg-gray-50 p-5"
                        >

                            <h4 className="font-semibold text-gray-900">
                                {column}
                            </h4>


                            <div className="mt-4 grid grid-cols-3 gap-3">

                                <div>

                                    <p className="text-xs text-gray-500">
                                        Unique
                                    </p>

                                    <p className="mt-1 font-semibold text-gray-900">
                                        {stats.unique_values}
                                    </p>

                                </div>


                                <div>

                                    <p className="text-xs text-gray-500">
                                        Most Frequent
                                    </p>

                                    <p className="mt-1 font-semibold text-gray-900">
                                        {stats.most_frequent}
                                    </p>

                                </div>


                                <div>

                                    <p className="text-xs text-gray-500">
                                        Frequency
                                    </p>

                                    <p className="mt-1 font-semibold text-gray-900">
                                        {stats.frequency}
                                    </p>

                                </div>

                            </div>


                            <p className="mt-4 text-sm text-gray-500">

                                Represents{" "}
                                <span className="font-semibold text-gray-800">
                                    {stats.percentage}%
                                </span>
                                {" "}
                                of the dataset.

                            </p>

                        </div>

                    )
                )}

            </div>

        </div>
    );
}

function OutlierAnalysis({data}) {

    if (
        !data ||
        Object.keys(data).length === 0
    ) {

        return null;
    }


    return (

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

            <div className="flex items-center gap-3 border-b border-gray-200 p-5">

                <AlertCircle
                    size={20}
                    className="text-gray-700"
                />

                <div>

                    <h3 className="font-semibold text-gray-900">
                        Outlier Detection
                    </h3>

                    <p className="text-sm text-gray-500">
                        Potential unusual values detected using IQR
                    </p>

                </div>

            </div>


            <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">

                {Object.entries(data).map(
                    ([column, stats]) => {

                        const hasOutliers =
                            stats.outlier_count > 0;


                        return (

                            <div
                                key={column}
                                className="rounded-lg bg-gray-50 p-5"
                            >

                                <div className="flex items-center justify-between">

                                    <h4 className="font-semibold text-gray-900">
                                        {column}
                                    </h4>


                                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700">

                                        {stats.outlier_count}
                                        {" "}
                                        outlier
                                        {stats.outlier_count !== 1
                                            ? "s"
                                            : ""
                                        }

                                    </span>

                                </div>


                                <div className="mt-4 grid grid-cols-2 gap-3">

                                    <div>

                                        <p className="text-xs text-gray-500">
                                            Lower Bound
                                        </p>

                                        <p className="mt-1 font-medium text-gray-800">
                                            {stats.lower_bound}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-xs text-gray-500">
                                            Upper Bound
                                        </p>

                                        <p className="mt-1 font-medium text-gray-800">
                                            {stats.upper_bound}
                                        </p>

                                    </div>

                                </div>


                                <p className="mt-4 text-sm text-gray-500">

                                    {hasOutliers
                                        ? "Potential outliers detected."
                                        : "No outliers detected."
                                    }

                                </p>

                            </div>

                        );
                    }
                )}

            </div>

        </div>
    );
}

function CorrelationAnalysis({
    data
}) {

    if (
        !data ||
        Object.keys(data).length === 0
    ) {

        return null;
    }


    const correlations = [];

    const processedPairs = new Set();


    Object.entries(data).forEach(
        ([columnA, values]) => {

            Object.entries(values).forEach(
                ([columnB, correlation]) => {

                    if (
                        columnA === columnB
                    ) {
                        return;
                    }


                    const pair = [
                        columnA,
                        columnB
                    ]
                        .sort()
                        .join("|");


                    if (
                        processedPairs.has(pair)
                    ) {
                        return;
                    }


                    processedPairs.add(pair);


                    correlations.push({
                        columnA,
                        columnB,
                        correlation
                    });

                }
            );

        }
    );


    return (

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

            <div className="flex items-center gap-3 border-b border-gray-200 p-5">

                <GitCompare
                    size={20}
                    className="text-gray-700"
                />

                <div>

                    <h3 className="font-semibold text-gray-900">
                        Correlation Analysis
                    </h3>

                    <p className="text-sm text-gray-500">
                        Relationships between numerical variables
                    </p>

                </div>

            </div>


            <div className="p-5">

                {correlations.length === 0 ? (

                    <p className="text-sm text-gray-500">
                        No correlations available.
                    </p>

                ) : (

                    <div className="space-y-3">

                        {correlations.map(
                            (item) => (

                                <div
                                    key={`${item.columnA}-${item.columnB}`}
                                    className="flex flex-col gap-3 rounded-lg bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                                >

                                    <div>

                                        <span className="font-medium text-gray-900">
                                            {item.columnA}
                                        </span>

                                        <span className="mx-2 text-gray-400">
                                            ↔
                                        </span>

                                        <span className="font-medium text-gray-900">
                                            {item.columnB}
                                        </span>

                                    </div>


                                    <div className="flex items-center gap-3">

                                        <span className="text-sm text-gray-500">
                                            Correlation
                                        </span>

                                        <span className="rounded-full bg-white px-3 py-1 font-semibold text-gray-900">

                                            {item.correlation}

                                        </span>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>
    );
}


export default ProfilingPanel;