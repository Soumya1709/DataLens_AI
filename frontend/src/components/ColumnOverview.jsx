function ColumnOverview({ data }) {

    if (!data) {
        return null;
    }


    return (

        <section className="mt-10">

            <h2 className="mb-5 text-2xl font-semibold text-gray-900">
                Column Overview
            </h2>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                {data.column_names.map(
                    (column, index) => {

                        const isNumeric =
                            data.numeric_columns?.includes(
                                column
                            );

                        return (

                            <div
                                key={column}
                                className={`flex items-center justify-between px-5 py-4 ${
                                    index !==
                                    data.column_names.length - 1
                                        ? "border-b border-gray-100"
                                        : ""
                                }`}
                            >

                                <span className="font-medium text-gray-800">
                                    {column}
                                </span>

                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                    {isNumeric
                                        ? "Numeric"
                                        : "Categorical"
                                    }
                                </span>

                            </div>
                        );
                    }
                )}

            </div>

        </section>
    );
}


export default ColumnOverview;