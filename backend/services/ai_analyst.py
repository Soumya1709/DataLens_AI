import pandas as pd

import os

from dotenv import load_dotenv
from google import genai
import time


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

load_dotenv()


GEMINI_API_KEY = os.getenv(
    "GEMINI_API_KEY"
)

if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is not configured."
    )


client = genai.Client(
    api_key=GEMINI_API_KEY
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

def generate_ai_analysis(prompt):
    """
    Send the analysis prompt to Gemini
    and return the generated response.
    """

    max_attempts = 3

    for attempt in range(max_attempts):

        try:

            response = client.models.generate_content(
                model="gemini-3.6-flash",
                contents=prompt
            )

            if not response.text:
                raise RuntimeError(
                    "Gemini returned an empty response."
                )

            return response.text

        except Exception as e:

            error_message = str(e)

            # Retry temporary server/capacity errors
            if (
                "503" in error_message
                or "UNAVAILABLE" in error_message
            ):

                if attempt < max_attempts - 1:

                    wait_time = (
                        2 ** attempt
                    )

                    print(
                        f"Gemini temporarily unavailable. "
                        f"Retrying in {wait_time} seconds..."
                    )

                    time.sleep(wait_time)

                    continue

            raise RuntimeError(
                f"AI analysis failed: {error_message}"
            )

    raise RuntimeError(
        "AI analysis failed after multiple attempts."
    )
        
if __name__ == "__main__":

    test_prompt = """
    You are a data analyst.

    Give me a one-sentence explanation
    of why data quality is important.
    """

    result = generate_ai_analysis(
        test_prompt
    )

    print("\nGemini response:\n")
    print(result)
