import pandas as pd

from services.visualizer import (
    get_bar_chart_data,
    get_line_chart_data,
    get_histogram_data,
    get_pie_chart_data,
    get_scatter_chart_data
)


def create_test_dataframe():

    return pd.DataFrame({
        "Product": [
            "Laptop",
            "Phone",
            "Laptop",
            "Tablet",
            "Phone"
        ],

        "Sales": [
            50000,
            30000,
            45000,
            25000,
            35000
        ],

        "Profit": [
            10000,
            5000,
            9000,
            4000,
            6000
        ]
    })


def test_bar_chart():

    df = create_test_dataframe()

    result = get_bar_chart_data(
        df,
        "Product"
    )

    assert result["chart_type"] == "bar"

    assert "Laptop" in result["labels"]

    assert 2 in result["values"]


def test_pie_chart():

    df = create_test_dataframe()

    result = get_pie_chart_data(
        df,
        "Product"
    )

    assert result["chart_type"] == "pie"

    assert len(result["labels"]) == 3


def test_histogram():

    df = create_test_dataframe()

    result = get_histogram_data(
        df,
        "Sales"
    )

    assert result["chart_type"] == "histogram"

    assert len(
        result["frequencies"]
    ) > 0


def test_line_chart():

    df = create_test_dataframe()

    result = get_line_chart_data(
        df,
        "Product",
        "Sales"
    )

    assert result["chart_type"] == "line"

    assert len(result["labels"]) == 5

    assert len(result["values"]) == 5


def test_scatter_chart():

    df = create_test_dataframe()

    result = get_scatter_chart_data(
        df,
        "Sales",
        "Profit"
    )

    assert result["chart_type"] == "scatter"

    assert len(result["x_values"]) == 5

    assert len(result["y_values"]) == 5