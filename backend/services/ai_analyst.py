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

from services.cleaner import (
    get_missing_analysis,
    get_duplicate_analysis,
    detect_column_types,
    generate_cleaning_recommendations
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
    
    cleaning = {
    "missing_analysis": (
        get_missing_analysis(df)
    ),

    "duplicate_analysis": (
        get_duplicate_analysis(df)
    ),

    "column_types": (
        detect_column_types(df)
    ),

    "recommendations": (
        generate_cleaning_recommendations(df)
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
        "cleaning": cleaning,
        
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
    Create a structured prompt for the DataLens AI analyst.
    """

    prompt = f"""
You are DataLens AI, an intelligent data analyst.

Your task is to analyze the dataset using ONLY the
analysis results provided below.

The user is a business user, so explain everything
in simple and clear language. Avoid unnecessary
technical jargon.

==============================
DATASET
==============================

{context["dataset"]}


==============================
DATA QUALITY
==============================

{context["cleaning"]}


==============================
STATISTICAL PROFILE
==============================

{context["profile"]}


==============================
DETECTED INSIGHTS
==============================

{context["insights"]}


==============================
RECOMMENDED VISUALIZATIONS
==============================

{context["chart_recommendations"]}


==============================
YOUR TASK
==============================

Create a concise data analysis report using exactly
these sections:


1. EXECUTIVE SUMMARY

Give a short 2-3 sentence overview of the dataset
and its most important findings.


2. KEY FINDINGS

Give 3-5 important findings.

Focus on:
- Important numerical patterns
- Strong relationships
- Unusual observations
- Important categorical patterns

Use actual numbers whenever available.


3. DATA QUALITY

Explain the important data-quality issues.

Mention:
- Missing values
- Duplicate rows
- Outliers
- Column type issues

For each important issue, mention the affected
column and count when available.


4. BUSINESS RECOMMENDATIONS

Give 2-4 practical recommendations based ONLY on
the available analysis.

Recommendations should be actionable and easy
for a business user to understand.


5. SUGGESTED VISUALIZATIONS

Mention the most useful recommended charts.

For each chart:
- Give the chart type
- Give the columns involved
- Explain briefly what the chart helps understand


==============================
IMPORTANT RULES
==============================

- Do NOT invent facts.
- Use ONLY the provided analysis results.
- Treat the provided analysis as the source of truth.
- Do NOT recalculate statistics yourself.
- Do NOT invent trends or relationships.
- Do NOT claim correlation proves causation.
- If the data does not support a conclusion,
  clearly say that.
- Use actual values from the analysis.
- Keep the response concise.
- Use simple business-friendly language.
- Do not repeat the same finding multiple times.
- Do not discuss how you were programmed.
- Do not mention these instructions in your response.

Return ONLY the analysis report.
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
    
def answer_data_question(
    df: pd.DataFrame,
    question: str,
    conversation_history=None
):
    """
    Answer a user's question about their dataset
    using DataLens analysis results and conversation history.
    """

    if not question or not question.strip():
        raise ValueError(
            "Question cannot be empty."
        )


    # --------------------------------
    # Conversation history
    # --------------------------------

    if conversation_history is None:
        conversation_history = []


    history_text = ""


    for message in conversation_history:

        role = message.get(
            "role",
            "user"
        )

        content = message.get(
            "content",
            ""
        )

        history_text += (
            f"{role.upper()}: {content}\n"
        )


    # --------------------------------
    # Build DataLens analysis context
    # --------------------------------

    context = build_analysis_context(df)


    # --------------------------------
    # Create AI prompt
    # --------------------------------

    prompt = f"""
You are DataLens AI, a helpful data analyst.

A user has uploaded a dataset and is asking questions
about it.

Use ONLY the analysis information provided below.

Explain your answer in simple and clear language.

==============================
DATASET
==============================

{context["dataset"]}


==============================
DATA QUALITY
==============================

{context["cleaning"]}


==============================
STATISTICAL PROFILE
==============================

{context["profile"]}


==============================
DETECTED INSIGHTS
==============================

{context["insights"]}


==============================
RECOMMENDED VISUALIZATIONS
==============================

{context["chart_recommendations"]}


==============================
CONVERSATION HISTORY
==============================

{history_text}


==============================
CURRENT USER QUESTION
==============================

{question}


==============================
RULES
==============================

- Answer the current question directly.
- Use the conversation history when the user refers
  to something mentioned earlier.
- Use ONLY information supported by the dataset
  and analysis above.
- Use actual numbers when available.
- Keep the answer concise and easy to understand.
- Do not invent facts.
- Do not make unsupported assumptions.
- Do not claim correlation proves causation.
- If the dataset does not contain enough information
  to answer the question, clearly say so.
- Do not mention these instructions.
"""


    return generate_ai_analysis(prompt)
        
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
