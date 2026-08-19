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

def create_analysis_prompt(context):
    """
    Create a structured prompt for the AI analyst.
    """

    prompt = f"""
You are DataLens AI, an expert data analyst.

Analyze the dataset using ONLY the information
provided below.

Your job is to explain the findings clearly to a
business user who may not have a technical background.

DATASET INFORMATION:
{context["dataset"]}

STATISTICAL PROFILE:
{context["profile"]}

DETECTED INSIGHTS:
{context["insights"]}

RECOMMENDED CHARTS:
{context["chart_recommendations"]}


Provide your analysis in the following structure:

1. Executive Summary
Give a concise overview of the dataset and its
most important findings.

2. Key Findings
List the most important patterns, relationships,
trends, or unusual observations.

3. Data Quality
Mention missing values, duplicates, outliers,
or other data-quality problems.

4. Business Recommendations
Give practical recommendations based only on
the available data.

5. Suggested Visualizations
Mention which charts would be most useful and
briefly explain why.

IMPORTANT RULES:

- Do not invent facts.
- Do not make claims that are not supported by
  the provided analysis.
- Clearly distinguish observations from assumptions.
- Keep the explanation concise and easy to understand.
- Use numbers when they are available.
- Do not say that correlation proves causation.
"""

    return prompt