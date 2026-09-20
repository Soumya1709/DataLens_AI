import {Database,Columns3,AlertTriangle,Copy} from "lucide-react";


function DatasetSummary({ data }) {

    if (!data) {
        return null;
    }


    const missingValues =
        Object.values(
            data.missing_values || {}
        ).reduce(
            (total, value) =>
                total + value,
            0
        );


    const cards = [
        {
            title: "Rows",
            value: data.rows,
            icon: Database
        },

        {
            title: "Columns",
            value: data.columns,
            icon: Columns3
        },

        {
            title: "Missing Values",
            value: missingValues,
            icon: AlertTriangle
        },

        {
            title: "Duplicate Rows",
            value: data.duplicate_rows,
            icon: Copy
        }
    ];


    return (

        <section className="mt-10">

            <h2 className="font-display mb-5 text-2xl font-semibold text-[#F3ECDD]">
                Dataset Overview
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {cards.map((card) => {

                    const Icon = card.icon;

                    return (

                        <div
                            key={card.title}
                            className="flex items-center gap-4 rounded-xl border border-[#3A2F1D] bg-[#221B12] p-5 shadow-sm"
                        >

                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#2A2116]">
                                <Icon
                                    size={21}
                                    className="text-[#D9A441]"
                                />
                            </div>

                            <div>

                                <p className="text-sm text-[#B8AC93]">
                                    {card.title}
                                </p>

                                <h3 className="font-mono mt-1 text-2xl font-bold text-[#F3ECDD]">
                                    {card.value}
                                </h3>

                            </div>

                        </div>
                    );
                })}

            </div>

        </section>
    );
}


export default DatasetSummary;