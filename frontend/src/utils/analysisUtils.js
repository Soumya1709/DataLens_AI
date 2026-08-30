export const calculateHealthScore = (
    uploadData,
    profile
) => {

    if (!uploadData) {
        return 0;
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


    

    let score = 100;


    score -= Math.min(
        20,
        missingCount * 5
    );


    score -= Math.min(
        20,
        duplicateRows * 5
    );


    score -= Math.min(
        20,
        outlierCount * 5
    );


    return Math.max(
        0,
        score
    );
};