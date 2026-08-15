import pandas as pd


def get_bar_chart_data(
    df: pd.DataFrame,
    column: str,
    top_n: int = 10
):
    """
    Generate data for a bar chart
    based on value frequencies.
    """

    if column not in df.columns:
        raise ValueError(
            f"Column '{column}' does not exist."
        )

    counts = (
        df[column]
        .dropna()
        .value_counts()
        .head(top_n)
    )

    return {
        "chart_type": "bar",
        "column": column,
        "labels": [
            str(value)
            for value in counts.index
        ],
        "values": [
            int(value)
            for value in counts.values
        ]
    }


def get_line_chart_data(
    df: pd.DataFrame,
    x_column: str,
    y_column: str
):
    """
    Generate data for a line chart.
    """

    if x_column not in df.columns:
        raise ValueError(
            f"Column '{x_column}' does not exist."
        )

    if y_column not in df.columns:
        raise ValueError(
            f"Column '{y_column}' does not exist."
        )

    data = df[
        [x_column, y_column]
    ].dropna()

    return {
        "chart_type": "line",
        "x_column": x_column,
        "y_column": y_column,
        "labels": [
            str(value)
            for value in data[x_column]
        ],
        "values": [
            float(value)
            for value in data[y_column]
        ]
    }


def get_histogram_data(
    df: pd.DataFrame,
    column: str,
    bins: int = 10
):
    """
    Generate histogram bin data
    for a numeric column.
    """

    if column not in df.columns:
        raise ValueError(
            f"Column '{column}' does not exist."
        )

    if not pd.api.types.is_numeric_dtype(
        df[column]
    ):
        raise ValueError(
            f"Column '{column}' must be numeric."
        )

    series = df[column].dropna()

    if series.empty:
        return {
            "chart_type": "histogram",
            "column": column,
            "bins": [],
            "frequencies": []
        }

    frequencies, bin_edges = pd.cut(
        series,
        bins=bins,
        include_lowest=True,
        retbins=True
    )

    counts = (
        frequencies
        .value_counts()
        .sort_index()
    )

    return {
        "chart_type": "histogram",
        "column": column,
        "bins": [
            str(interval)
            for interval in counts.index
        ],
        "frequencies": [
            int(value)
            for value in counts.values
        ]
    }


def get_pie_chart_data(
    df: pd.DataFrame,
    column: str,
    top_n: int = 10
):
    """
    Generate data for a pie chart
    using categorical frequencies.
    """

    if column not in df.columns:
        raise ValueError(
            f"Column '{column}' does not exist."
        )

    counts = (
        df[column]
        .dropna()
        .value_counts()
        .head(top_n)
    )

    return {
        "chart_type": "pie",
        "column": column,
        "labels": [
            str(value)
            for value in counts.index
        ],
        "values": [
            int(value)
            for value in counts.values
        ]
    }


def get_scatter_chart_data(
    df: pd.DataFrame,
    x_column: str,
    y_column: str
):
    """
    Generate data for a scatter plot.
    """

    if x_column not in df.columns:
        raise ValueError(
            f"Column '{x_column}' does not exist."
        )

    if y_column not in df.columns:
        raise ValueError(
            f"Column '{y_column}' does not exist."
        )

    if not pd.api.types.is_numeric_dtype(
        df[x_column]
    ):
        raise ValueError(
            f"Column '{x_column}' must be numeric."
        )

    if not pd.api.types.is_numeric_dtype(
        df[y_column]
    ):
        raise ValueError(
            f"Column '{y_column}' must be numeric."
        )

    data = df[
        [x_column, y_column]
    ].dropna()

    return {
        "chart_type": "scatter",
        "x_column": x_column,
        "y_column": y_column,
        "x_values": [
            float(value)
            for value in data[x_column]
        ],
        "y_values": [
            float(value)
            for value in data[y_column]
        ]
    }