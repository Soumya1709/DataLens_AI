import {
    ShieldCheck,
    AlertTriangle,
    CheckCircle,
    XCircle
} from "lucide-react";

import {
    calculateHealthScore
} from "../utils/analysisUtils";


function DataHealth({
    uploadData,
    profile,
    recommendations
}) {

    if (!uploadData) {
        return null;
    }


    const missingCount = Object.values(
        uploadData.missing_values || {}
    ).reduce(
        (total, count) =>
            total + Number(count),
        0
    );


    const duplicateRows =
        Number(
            uploadData.duplicate_rows || 0
        );


    const outlierCount = Object.values(
        profile?.outliers || {}
    ).reduce(
        (total, column) =>
            total +
            Number(
                column.outlier_count || 0
            ),
        0
    );


    const score =
    calculateHealthScore(
        uploadData,
        profile
    );

    let scoreLabel;

    if (score >= 90) {

        scoreLabel = "Excellent";

    } else if (score >= 75) {

        scoreLabel = "Good";

    } else if (score >= 50) {

        scoreLabel = "Needs Attention";

    } else {

        scoreLabel = "Poor";

    }


    return (

        <section className="mt-10">

            {/* Header */}

            <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">

                    <ShieldCheck
                        size={21}
                        className="text-gray-700"
                    />

                </div>

                <div>

                    <h2 className="text-2xl font-semibold text-gray-900">
                        Data Health
                    </h2>

                    <p className="text-sm text-gray-500">
                        Overall quality of your dataset
                    </p>

                </div>

            </div>


            {/* Main Card */}

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

                    {/* Score */}

                    <div className="flex flex-col items-center justify-center">

                        <div className="flex h-32 w-32 items-center justify-center rounded-full border-8 border-gray-200">

                            <div className="text-center">

                                <p className="text-4xl font-bold text-gray-900">
                                    {score}
                                </p>

                                <p className="text-xs text-gray-500">
                                    / 100
                                </p>

                            </div>

                        </div>


                        <p className="mt-4 font-semibold text-gray-900">
                            {scoreLabel}
                        </p>

                    </div>


                    {/* Progress */}

                    <div className="flex flex-col justify-center md:col-span-2">

                        <div className="mb-2 flex items-center justify-between">

                            <span className="text-sm font-medium text-gray-700">
                                Data Quality
                            </span>

                            <span className="text-sm font-semibold text-gray-900">
                                {score}%
                            </span>

                        </div>


                        <div className="h-3 overflow-hidden rounded-full bg-gray-100">

                            <div
                                className="h-full rounded-full bg-gray-900 transition-all duration-500"
                                style={{
                                    width: `${score}%`
                                }}
                            />

                        </div>


                        <p className="mt-3 text-sm text-gray-500">

                            The score is based on missing values,
                            duplicate rows, and detected outliers.

                        </p>

                    </div>

                </div>


                {/* Quality Checks */}

                <div className="mt-8 grid grid-cols-1 gap-3 border-t border-gray-200 pt-6 md:grid-cols-3">

                    {/* Missing */}

                    <HealthCheck
                        title="Missing Values"
                        count={missingCount}
                        good={missingCount === 0}
                    />


                    {/* Duplicates */}

                    <HealthCheck
                        title="Duplicate Rows"
                        count={duplicateRows}
                        good={duplicateRows === 0}
                    />


                    {/* Outliers */}

                    <HealthCheck
                        title="Outliers"
                        count={outlierCount}
                        good={outlierCount === 0}
                    />

                </div>

            </div>

        </section>
    );
}


function HealthCheck({
    title,
    count,
    good
}) {

    return (

        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">

            <div className="flex items-center gap-3">

                {good ? (

                    <CheckCircle
                        size={20}
                        className="text-gray-700"
                    />

                ) : (

                    <AlertTriangle
                        size={20}
                        className="text-gray-700"
                    />

                )}


                <div>

                    <p className="text-sm font-medium text-gray-900">
                        {title}
                    </p>

                    <p className="text-xs text-gray-500">

                        {good
                            ? "No issues detected"
                            : `${count} issue${count !== 1 ? "s" : ""} detected`
                        }

                    </p>

                </div>

            </div>


            {good ? (

                <CheckCircle
                    size={18}
                    className="text-gray-700"
                />

            ) : (

                <XCircle
                    size={18}
                    className="text-gray-700"
                />

            )}

        </div>
    );
}


export default DataHealth;