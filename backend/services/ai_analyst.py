import pandas as pd

from services.profiler import (
    get_numeric_statistics,
    get_categorical_statistics,
    detect_outliers,
    get_correlations
)

from services.insights import (
    generate_insights
)

from services.recommendations import (
    generate_dataset_recommendations
)


def build_analysis_context(
    df: pd.DataFrame
):
    """
    Combine all DataLens analysis results
    into one structured context for the AI.
    """

    profile = {
        "numeric_statistics": (
            get_numeric_statistics(df)
        ),

        "categorical_statistics": (
            get_categorical_statistics(df)
        ),

        "outliers": (
            detect_outliers(df)
        ),

        "correlations": (
            get_correlations(df)
        )
    }

    insights = generate_insights(df)

    recommendations = (
        generate_dataset_recommendations(df)
    )

    context = {
        "dataset": {
            "rows": int(len(df)),
            "columns": int(len(df.columns)),
            "column_names": df.columns.tolist()
        },

        "profile": profile,

        "insights": insights,

        "chart_recommendations": (
            recommendations[
                "recommended_charts"
            ]
        )
    }

    return context