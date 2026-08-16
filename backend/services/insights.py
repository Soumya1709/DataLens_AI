import pandas as pd

from services.profiler import (get_numeric_statistics,get_categorical_statistics,detect_outliers,get_correlations)


def generate_missing_value_insights(
    df: pd.DataFrame
):
    """
    Generate insights about missing values.
    """

    insights = []

    total_rows = len(df)

    if total_rows == 0:
        return insights

    for column in df.columns:

        missing_count = int(
            df[column].isna().sum()
        )

        if missing_count == 0:
            continue

        missing_percentage = (
            missing_count / total_rows
        ) * 100

        if missing_percentage >= 50:

            severity = "high"

            message = (
                f"'{column}' has "
                f"{missing_percentage:.1f}% "
                "missing values. "
                "This column requires attention."
            )

        elif missing_percentage >= 20:

            severity = "medium"

            message = (
                f"'{column}' has "
                f"{missing_percentage:.1f}% "
                "missing values."
            )

        else:

            severity = "low"

            message = (
                f"'{column}' has "
                f"{missing_percentage:.1f}% "
                "missing values."
            )

        insights.append({
            "type": "missing_values",
            "severity": severity,
            "column": column,
            "message": message
        })

    return insights


def generate_duplicate_insights(
    df: pd.DataFrame
):
    """
    Generate insights about duplicate rows.
    """

    insights = []

    duplicate_count = int(
        df.duplicated().sum()
    )

    if duplicate_count == 0:
        return insights

    total_rows = len(df)

    duplicate_percentage = (
        duplicate_count / total_rows
    ) * 100

    if duplicate_percentage >= 20:

        severity = "high"

    elif duplicate_percentage >= 5:

        severity = "medium"

    else:

        severity = "low"

    insights.append({
        "type": "duplicates",
        "severity": severity,
        "column": None,
        "message": (
            f"The dataset contains "
            f"{duplicate_count} duplicate "
            f"rows ({duplicate_percentage:.1f}%)."
        )
    })

    return insights


def generate_correlation_insights(
    df: pd.DataFrame
):
    """
    Generate insights from strong correlations.
    """

    insights = []

    correlations = get_correlations(df)

    processed_pairs = set()

    for column in correlations:

        for other_column in correlations[column]:

            if column == other_column:
                continue

            pair = tuple(
                sorted(
                    [column, other_column]
                )
            )

            if pair in processed_pairs:
                continue

            processed_pairs.add(pair)

            correlation = correlations[
                column
            ][other_column]

            if correlation is None:
                continue

            if abs(correlation) >= 0.8:

                if correlation > 0:

                    relationship = (
                        "strong positive"
                    )

                else:

                    relationship = (
                        "strong negative"
                    )

                insights.append({
                    "type": "correlation",
                    "severity": "info",
                    "column": column,
                    "related_column": other_column,
                    "correlation": correlation,
                    "message": (
                        f"'{column}' and "
                        f"'{other_column}' have "
                        f"a {relationship} "
                        f"correlation "
                        f"({correlation:.2f})."
                    )
                })

    return insights


def generate_outlier_insights(
    df: pd.DataFrame
):
    """
    Generate insights about outliers.
    """

    insights = []

    outliers = detect_outliers(df)

    for column, information in outliers.items():

        count = information[
            "outlier_count"
        ]

        if count == 0:
            continue

        total_values = (
            df[column]
            .dropna()
            .shape[0]
        )

        if total_values == 0:
            continue

        percentage = (
            count / total_values
        ) * 100

        if percentage >= 10:

            severity = "high"

        elif percentage >= 5:

            severity = "medium"

        else:

            severity = "low"

        insights.append({
            "type": "outliers",
            "severity": severity,
            "column": column,
            "outlier_count": count,
            "message": (
                f"'{column}' contains "
                f"{count} potential outlier(s) "
                f"({percentage:.1f}% of "
                "non-missing values)."
            )
        })

    return insights


def generate_categorical_insights(
    df: pd.DataFrame
):
    """
    Generate insights about dominant
    categorical values.
    """

    insights = []

    statistics = (
        get_categorical_statistics(df)
    )

    for column, information in statistics.items():

        percentage = information[
            "percentage"
        ]

        if percentage >= 70:

            insights.append({
                "type": "category_distribution",
                "severity": "medium",
                "column": column,
                "message": (
                    f"'{column}' is highly "
                    f"dominated by "
                    f"'{information['most_frequent']}', "
                    f"which represents "
                    f"{percentage:.1f}% of "
                    "non-missing values."
                )
            })

    return insights


def generate_insights(
    df: pd.DataFrame
):
    """
    Generate all rule-based insights
    for a dataset.
    """

    insights = []

    insights.extend(
        generate_missing_value_insights(df)
    )

    insights.extend(
        generate_duplicate_insights(df)
    )

    insights.extend(
        generate_correlation_insights(df)
    )

    insights.extend(
        generate_outlier_insights(df)
    )

    insights.extend(
        generate_categorical_insights(df)
    )

    return insights