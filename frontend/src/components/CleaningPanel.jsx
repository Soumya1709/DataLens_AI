import { useEffect, useState } from "react";

import {AlertTriangle,Copy,Wrench,CheckCircle,Loader2} from "lucide-react";

import {getCleaningRecommendations,cleanDataset} from "../services/api";


function CleaningPanel({ file }) {

    const [recommendations, setRecommendations] =useState(null);

    const [fillOperations, setFillOperations] =useState([]);

    const [removeDuplicates, setRemoveDuplicates] =useState(false);

    const [result, setResult] =useState(null);

    const [loading, setLoading] =useState(false);

    const [error, setError] =useState(null);


    useEffect(() => {

        if (!file) {
            return;
        }

        const loadRecommendations =
            async () => {

                try {

                    setLoading(true);
                    setError(null);

                    const data =
                        await getCleaningRecommendations(
                            file
                        );

                    setRecommendations(data);

                } catch (err) {

                    console.error(err);

                    setError(
                        "Unable to load cleaning recommendations."
                    );

                } finally {

                    setLoading(false);
                }
            };


        loadRecommendations();

    }, [file]);


    const handleFillMethodChange = (
        column,
        method
    ) => {

        setFillOperations(
            (previous) => {

                if (!method) {

                    return previous.filter(
                        (operation) =>
                            operation.column !== column
                    );
                }


                const existing =
                    previous.find(
                        (operation) =>
                            operation.column === column
                    );


                if (existing) {

                    return previous.map(
                        (operation) =>
                            operation.column === column
                                ? {
                                    ...operation,
                                    method
                                }
                                : operation
                    );
                }


                return [
                    ...previous,
                    {
                        column,
                        method
                    }
                ];
            }
        );
    };


    const handleApplyCleaning = async () => {

        if (!file) {
            return;
        }


        try {

            setLoading(true);
            setError(null);
            setResult(null);


            const operations = {

                fill_missing:
                    fillOperations,

                remove_duplicates:
                    removeDuplicates,

                convert_types: []

            };


            const data =
                await cleanDataset(
                    file,
                    operations
                );


            setResult(data);

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.detail ||
                "Unable to clean dataset."
            );

        } finally {

            setLoading(false);
        }
    };


    if (!file) {
        return null;
    }


    const missingColumns =
        recommendations?.missing_analysis?.filter(
            (item) =>
                item.missing_count > 0
        ) || [];


    const duplicateRows =
        recommendations?.duplicate_analysis
            ?.duplicate_rows || 0;


    return (

        <section className="mt-10">

            <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2A2116]">

                    <Wrench
                        size={20}
                        className="text-[#D9A441]"
                    />

                </div>

                <div>

                    <h2 className="font-display text-3xl font-semibold text-[#F3ECDD]">
                        Data Cleaning
                    </h2>

                    <p className="text-sm text-[#B8AC93]">
                        Fix common data quality problems
                    </p>

                </div>

            </div>


            {loading && !recommendations && (

                <div className="flex items-center gap-2 rounded-xl border border-[#3A2F1D] bg-[#221B12] p-5 text-[#B8AC93]">

                    <Loader2
                        size={20}
                        className="animate-spin"
                    />

                    Analyzing data quality...

                </div>

            )}


            {error && (

                <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">

                    {error}

                </div>

            )}


            {recommendations && (

                <div className="space-y-5">

                    {/* Missing Values */}

                    <div className="rounded-xl border border-[#3A2F1D] bg-[#221B12] p-6 shadow-sm">

                        <div className="mb-5 flex items-center gap-3">

                            <AlertTriangle
                                size={20}
                                className="text-[#D9A441]"
                            />

                            <div>

                                <h3 className="font-display font-semibold text-[#F3ECDD]">
                                    Missing Values
                                </h3>

                                <p className="text-sm text-[#B8AC93]">
                                    Choose how to handle missing values
                                </p>

                            </div>

                        </div>


                        {missingColumns.length > 0 ? (

                            <div className="space-y-3">

                                {missingColumns.map(
                                    (item) => (

                                        <div
                                            key={item.column}
                                            className="flex flex-col gap-3 rounded-lg bg-[#2A2116] p-4 sm:flex-row sm:items-center sm:justify-between"
                                        >

                                            <div>

                                                <p className="font-medium text-[#F3ECDD]">
                                                    {item.column}
                                                </p>

                                                <p className="text-sm text-[#B8AC93]">

                                                    {item.missing_count}
                                                    {" "}
                                                    missing value
                                                    {item.missing_count !== 1
                                                        ? "s"
                                                        : ""
                                                    }

                                                    {" • "}

                                                    {item.missing_percentage}%

                                                </p>

                                            </div>


                                            <select
                                                value={
                                                    fillOperations.find(
                                                        (operation) =>
                                                            operation.column ===
                                                            item.column
                                                    )?.method || ""
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleFillMethodChange(
                                                        item.column,
                                                        event.target.value
                                                    )
                                                }
                                                className="rounded-lg border border-[#3A2F1D] bg-[#221B12] px-3 py-2 text-sm outline-none focus:border-[#D9A441]"
                                            >

                                                <option value="">
                                                    Don't change
                                                </option>

                                                <option value="mean">
                                                    Fill with Mean
                                                </option>

                                                <option value="median">
                                                    Fill with Median
                                                </option>

                                                <option value="mode">
                                                    Fill with Mode
                                                </option>

                                            </select>

                                        </div>

                                    )
                                )}

                            </div>

                        ) : (

                            <div className="flex items-center gap-2 rounded-lg bg-[#2A2116] p-4 text-sm text-[#B8AC93]">

                                <CheckCircle
                                    size={18}
                                />

                                No missing values detected.

                            </div>

                        )}

                    </div>


                    {/* Duplicate Rows */}

                    <div className="rounded-xl border border-[#3A2F1D] bg-[#221B12] p-6 shadow-sm">

                        <div className="flex items-center justify-between gap-5">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2A2116]">

                                    <Copy size={19} />

                                </div>

                                <div>

                                    <h3 className="font-display font-semibold text-[#F3ECDD]">
                                        Duplicate Rows
                                    </h3>

                                    <p className="text-sm text-[#B8AC93]">

                                        {duplicateRows}
                                        {" "}
                                        duplicate row
                                        {duplicateRows !== 1
                                            ? "s"
                                            : ""
                                        }

                                    </p>

                                </div>

                            </div>


                            {duplicateRows > 0 && (

                                <label className="flex cursor-pointer items-center gap-3">

                                    <input
                                        type="checkbox"
                                        checked={
                                            removeDuplicates
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setRemoveDuplicates(
                                                event.target.checked
                                            )
                                        }
                                        className="h-4 w-4"
                                    />

                                    <span className="text-sm font-medium text-[#D9A441]">
                                        Remove
                                    </span>

                                </label>

                            )}

                        </div>

                    </div>


                    {/* Apply Changes */}

                    <div className="flex justify-end">

                        <button
                            onClick={
                                handleApplyCleaning
                            }
                            disabled={
                                loading ||
                                (
                                    fillOperations.length === 0 &&
                                    !removeDuplicates
                                )
                            }
                            className="flex items-center gap-2 rounded-lg bg-[#D9A441] px-6 py-3 font-semibold text-[#17130D] transition hover:bg-[#C2933A] disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            {loading && (

                                <Loader2
                                    size={18}
                                    className="animate-spin"
                                />

                            )}

                            {loading
                                ? "Cleaning..."
                                : "Apply Changes"
                            }

                        </button>

                    </div>


                    {/* Cleaning Result */}

                    {result && (

                        <CleaningResult
                            result={result}
                        />

                    )}

                </div>

            )}

        </section>
    );
}


function CleaningResult({ result }) {

    return (

        <div className="mt-8 space-y-5">

            <div className="flex items-center gap-2">

                <CheckCircle size={22} className="text-[#D9A441]" />

                <h3 className="font-display text-2xl font-semibold text-[#F3ECDD]">
                    Cleaning Complete
                </h3>

            </div>


            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <SummaryCard
                    title="Before Cleaning"
                    data={result.before}
                />

                <SummaryCard
                    title="After Cleaning"
                    data={result.after}
                />

            </div>


            {result.changes?.length > 0 && (

                <div className="rounded-xl border border-[#3A2F1D] bg-[#221B12] p-6 shadow-sm">

                    <h3 className="font-display mb-4 font-semibold text-[#F3ECDD]">
                        Changes Applied
                    </h3>

                    <div className="space-y-3">

                        {result.changes.map(
                            (change, index) => (

                                <div
                                    key={index}
                                    className="flex gap-3 text-sm text-[#B8AC93]"
                                >

                                    <CheckCircle
                                        size={18}
                                        className="mt-0.5 shrink-0"
                                    />

                                    <span>
                                        {change}
                                    </span>

                                </div>

                            )
                        )}

                    </div>

                </div>

            )}


            {result.preview?.length > 0 && (

                <div className="overflow-hidden rounded-xl border border-[#3A2F1D] bg-[#221B12] shadow-sm">

                    <div className="border-b border-[#3A2F1D] p-5">

                        <h3 className="font-display font-semibold text-[#F3ECDD]">
                            Cleaned Data Preview
                        </h3>

                    </div>


                    <div className="overflow-x-auto">

                        <table className="min-w-full text-left text-sm">

                            <thead className="bg-[#2A2116]">

                                <tr>

                                    {Object.keys(
                                        result.preview[0]
                                    ).map(
                                        (column) => (

                                            <th
                                                key={column}
                                                className="whitespace-nowrap px-5 py-3 font-semibold text-[#D9A441]"
                                            >
                                                {column}
                                            </th>

                                        )
                                    )}

                                </tr>

                            </thead>


                            <tbody>

                                {result.preview.map(
                                    (row, index) => (

                                        <tr
                                            key={index}
                                            className="border-t border-[#2E2417]"
                                        >

                                            {Object.keys(
                                                result.preview[0]
                                            ).map(
                                                (column) => (

                                                    <td
                                                        key={column}
                                                        className="whitespace-nowrap px-5 py-3 text-[#B8AC93]"
                                                    >
                                                        {String(
                                                            row[column] ?? ""
                                                        )}
                                                    </td>

                                                )
                                            )}

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            )}

        </div>
    );
}


function SummaryCard({
    title,
    data
}) {

    if (!data) {
        return null;
    }


    return (

        <div className="rounded-xl border border-[#3A2F1D] bg-[#221B12] p-6 shadow-sm">

            <h3 className="font-display mb-5 font-semibold text-[#F3ECDD]">
                {title}
            </h3>

            <div className="grid grid-cols-2 gap-4">

                <div className="rounded-lg bg-[#2A2116] p-4">

                    <p className="text-xs text-[#B8AC93]">
                        Rows
                    </p>

                    <p className="font-mono mt-1 text-xl font-bold text-[#F3ECDD]">
                        {data.rows}
                    </p>

                </div>


                <div className="rounded-lg bg-[#2A2116] p-4">

                    <p className="text-xs text-[#B8AC93]">
                        Columns
                    </p>

                    <p className="font-mono mt-1 text-xl font-bold text-[#F3ECDD]">
                        {data.columns}
                    </p>

                </div>


                <div className="rounded-lg bg-[#2A2116] p-4">

                    <p className="text-xs text-[#B8AC93]">
                        Missing
                    </p>

                    <p className="font-mono mt-1 text-xl font-bold text-[#F3ECDD]">
                        {data.missing_values}
                    </p>

                </div>


                <div className="rounded-lg bg-[#2A2116] p-4">

                    <p className="text-xs text-[#B8AC93]">
                        Duplicates
                    </p>

                    <p className="font-mono mt-1 text-xl font-bold text-[#F3ECDD]">
                        {data.duplicate_rows}
                    </p>

                </div>

            </div>

        </div>
    );
}


export default CleaningPanel;