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

            <h2 className="mb-5 text-2xl font-semibold text-gray-900">
                Dataset Overview
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {cards.map((card) => {

                    const Icon = card.icon;

                    return (

                        <div
                            key={card.title}
                            className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                        >

                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100">
                                <Icon
                                    size={21}
                                    className="text-gray-700"
                                />
                            </div>

                            <div>

                                <p className="text-sm text-gray-500">
                                    {card.title}
                                </p>

                                <h3 className="mt-1 text-2xl font-bold text-gray-900">
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