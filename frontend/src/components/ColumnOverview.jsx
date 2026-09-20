function ColumnOverview({ data }) {

    if (!data) {
        return null;
    }


    return (

        <section className="mt-10">

            <h2 className="font-display mb-5 text-2xl font-semibold text-[#F3ECDD]">
                Column Overview
            </h2>

            <div className="overflow-hidden rounded-xl border border-[#3A2F1D] bg-[#221B12] shadow-sm">

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
                                        ? "border-b border-[#2E2417]"
                                        : ""
                                }`}
                            >

                                <span className="font-medium text-[#F3ECDD]">
                                    {column}
                                </span>

                                <span className="rounded-full bg-[#2A2116] px-3 py-1 text-xs font-medium text-[#D9A441]">
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