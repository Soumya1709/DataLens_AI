import pandas as pd


def get_dataset_summary(df: pd.DataFrame):
    """
    Generate a high-level summary of the dataset.
    """

    numeric_columns = df.select_dtypes(
        include="number"
    ).columns.tolist()

    categorical_columns = df.select_dtypes(
        include=["object", "category"]
    ).columns.tolist()

    missing_values = int(
        df.isna().sum().sum()
    )

    duplicate_rows = int(
        df.duplicated().sum()
    )

    return {
        "rows": int(len(df)),
        "columns": int(len(df.columns)),
        "numeric_columns": len(numeric_columns),
        "categorical_columns": len(
            categorical_columns
        ),
        "missing_values": missing_values,
        "duplicate_rows": duplicate_rows
    }


def recommend_chart_for_column(
    df: pd.DataFrame,
    column: str
):
    """
    Recommend suitable charts for a single column.
    """

    if column not in df.columns:
        raise ValueError(
            f"Column '{column}' does not exist."
        )

    series = df[column].dropna()

    if series.empty:
        return []

    recommendations = []

   
    if pd.api.types.is_numeric_dtype(series):

        recommendations.append({
            "chart_type": "histogram",
            "column": column,
            "reason": (
                f"'{column}' is numeric, so a "
                "histogram can show its distribution."
            )
        })

        return recommendations

    
    unique_count = series.nunique()

    recommendations.append({
        "chart_type": "bar",
        "column": column,
        "reason": (
            f"'{column}' is categorical, so "
            "a bar chart can compare category frequencies."
        )
    })

    if unique_count <= 6:

        recommendations.append({
            "chart_type": "pie",
            "column": column,
            "reason": (
                f"'{column}' has only "
                f"{unique_count} categories, making "
                "a pie chart suitable for showing proportions."
            )
        })

    return recommendations


def recommend_relationship_charts(
    df: pd.DataFrame
):
    """
    Recommend charts for relationships
    between columns.
    """

    recommendations = []

    numeric_columns = df.select_dtypes(
        include="number"
    ).columns.tolist()

    categorical_columns = df.select_dtypes(
        include=["object", "category"]
    ).columns.tolist()

   
    if len(numeric_columns) >= 2:

        x_column = numeric_columns[0]
        y_column = numeric_columns[1]

        recommendations.append({
            "chart_type": "scatter",
            "x_column": x_column,
            "y_column": y_column,
            "reason": (
                f"'{x_column}' and '{y_column}' "
                "are numeric columns, so a scatter "
                "plot can show their relationship."
            )
        })

    
    if categorical_columns and numeric_columns:

        category = categorical_columns[0]
        numeric = numeric_columns[0]

        recommendations.append({
            "chart_type": "bar",
            "column": category,
            "value_column": numeric,
            "reason": (
                f"'{category}' can be compared "
                f"against '{numeric}' using a bar chart."
            )
        })

    return recommendations


def get_chart_recommendations(
    df: pd.DataFrame
):
    """
    Generate all suitable chart recommendations.
    """

    recommendations = []

    
    for column in df.columns:

        column_recommendations = (
            recommend_chart_for_column(
                df,
                column
            )
        )

        recommendations.extend(
            column_recommendations
        )

   
    recommendations.extend(
        recommend_relationship_charts(df)
    )

    return recommendations


def generate_dataset_recommendations(
    df: pd.DataFrame
):
    """
    Generate complete dataset analysis
    recommendations.
    """

    return {
        "summary": get_dataset_summary(df),

        "recommended_charts": (
            get_chart_recommendations(df)
        )
    }