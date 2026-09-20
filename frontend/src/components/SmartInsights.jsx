import {Lightbulb,AlertTriangle,TrendingDown,TrendingUp,CheckCircle} from "lucide-react";


function SmartInsights({uploadData,profile}) {

    if (!uploadData) {
        return null;
    }


    const insights = [];

    const missingValues =
        uploadData.missing_values || {};


    Object.entries(missingValues).forEach(
        ([column, count]) => {

            if (Number(count) > 0) {

                insights.push({

                    type: "warning",

                    icon: AlertTriangle,

                    title:
                        `${column} has missing values`,

                    description:
                        `${count} missing value${count !== 1 ? "s" : ""} detected in the ${column} column. Consider cleaning this column before analysis.`

                });

            }

        }
    );

    const duplicateRows =
        Number(
            uploadData.duplicate_rows || 0
        );


    if (duplicateRows > 0) {

        insights.push({

            type: "warning",

            icon: AlertTriangle,

            title:
                "Duplicate rows detected",

            description:
                `${duplicateRows} duplicate row${duplicateRows !== 1 ? "s" : ""} were found in the dataset. Removing duplicates may improve analysis accuracy.`

        });

    }

    const outliers =
        profile?.outliers || {};


    Object.entries(outliers).forEach(
        ([column, data]) => {

            const count =
                Number(
                    data.outlier_count || 0
                );


            if (count > 0) {

                insights.push({

                    type: "warning",

                    icon: AlertTriangle,

                    title:
                        `Outliers detected in ${column}`,

                    description:
                        `${count} potential outlier${count !== 1 ? "s" : ""} detected in the ${column} column.`

                });

            }

        }
    );

    const correlations =
        profile?.correlations || {};


    const processedPairs =
        new Set();


    Object.entries(correlations).forEach(
        ([columnA, values]) => {

            Object.entries(values).forEach(
                ([columnB, value]) => {

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


                    const correlation =
                        Number(value);


                    const absoluteCorrelation =
                        Math.abs(
                            correlation
                        );


                    if (
                        absoluteCorrelation >=
                        0.7
                    ) {

                        let direction;

                        let Icon;


                        if (
                            correlation > 0
                        ) {

                            direction =
                                "positive";

                            Icon =
                                TrendingUp;

                        } else {

                            direction =
                                "negative";

                            Icon =
                                TrendingDown;

                        }


                        insights.push({

                            type: "insight",

                            icon: Icon,

                            title:
                                `${columnA} and ${columnB} have a strong ${direction} relationship`,

                            description:
                                `The correlation between ${columnA} and ${columnB} is ${correlation.toFixed(3)}. This indicates a strong ${direction} relationship in this dataset.`

                        });

                    }

                }
            );

        }
    );


    if (insights.length === 0) {

        insights.push({

            type: "success",

            icon: CheckCircle,

            title:
                "No major issues detected",

            description:
                "The dataset does not currently show significant missing values, duplicates, outliers, or strong correlations."

        });

    }


    return (

        <section className="mt-10">

            {/* Header */}

            <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2A2116]">

                    <Lightbulb
                        size={21}
                        className="text-[#D9A441]"
                    />

                </div>

                <div>

                    <h2 className="font-display text-3xl font-semibold text-[#F3ECDD]">
                        Smart Insights
                    </h2>

                    <p className="text-sm text-[#B8AC93]">
                        Important findings detected from your dataset
                    </p>

                </div>

            </div>


            {/* Insights */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                {insights.map(
                    (insight, index) => {

                        const Icon =
                            insight.icon;


                        return (

                            <div
                                key={index}
                                className="rounded-xl border border-[#3A2F1D] bg-[#221B12] p-5 shadow-sm"
                            >

                                <div className="flex gap-4">

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2A2116]">

                                        <Icon
                                            size={20}
                                            className="text-[#D9A441]"
                                        />

                                    </div>


                                    <div>

                                        <h3 className="font-display font-semibold text-[#F3ECDD]">

                                            {insight.title}

                                        </h3>


                                        <p className="mt-2 text-sm leading-6 text-[#B8AC93]">

                                            {insight.description}

                                        </p>

                                    </div>

                                </div>

                            </div>

                        );

                    }
                )}

            </div>

        </section>
    );
}


export default SmartInsights;