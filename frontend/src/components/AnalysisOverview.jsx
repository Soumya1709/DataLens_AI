import {Database,Columns3,AlertTriangle,Copy,ShieldCheck} from "lucide-react";

import {calculateHealthScore} from "../utils/analysisUtils";


function AnalysisOverview({uploadData,profile}) {

    if (!uploadData) {
        return null;
    }


    const missingCount =
        Object.values(
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


    const outlierCount =
        Object.values(
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

    return (

        <section className="mt-8">

            <div className="mb-4">

                <h2 className="font-display text-2xl font-semibold text-[#F3ECDD]">
                    Analysis Overview
                </h2>

                <p className="text-sm text-[#B8AC93]">
                    Quick summary of your dataset
                </p>

            </div>


            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">


                {/* Rows */}

                <StatCard
                    icon={Database}
                    label="Rows"
                    value={uploadData.rows}
                />


                {/* Columns */}

                <StatCard
                    icon={Columns3}
                    label="Columns"
                    value={uploadData.columns}
                />


                {/* Missing */}

                <StatCard
                    icon={AlertTriangle}
                    label="Missing Values"
                    value={missingCount}
                />


                {/* Duplicates */}

                <StatCard
                    icon={Copy}
                    label="Duplicates"
                    value={duplicateRows}
                />


                {/* Health */}

                <StatCard
                    icon={ShieldCheck}
                    label="Health Score"
                    value={`${score}/100`}
                />

            </div>

        </section>
    );
}


function StatCard({icon: Icon,label,value}) {

    return (

        <div className="rounded-xl border border-[#3A2F1D] bg-[#221B12] p-5 shadow-sm">

            <div className="flex items-center justify-between">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2A2116]">

                    <Icon
                        size={18}
                        className="text-[#D9A441]"
                    />

                </div>

            </div>


            <p className="mt-4 text-sm text-[#B8AC93]">
                {label}
            </p>


            <p className="font-mono mt-1 text-2xl font-bold text-[#F3ECDD]">
                {value}
            </p>

        </div>
    );
}


export default AnalysisOverview;