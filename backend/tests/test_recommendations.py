import pandas as pd

from services.recommendations import (
    get_dataset_summary,
    recommend_chart_for_column,
    recommend_relationship_charts,
    get_chart_recommendations,
    generate_dataset_recommendations
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


def test_dataset_summary():

    df = create_test_dataframe()

    result = get_dataset_summary(df)

    assert result["rows"] == 5

    assert result["columns"] == 3

    assert result["numeric_columns"] == 2

    assert result["categorical_columns"] == 1

    assert result["missing_values"] == 0

    assert result["duplicate_rows"] == 0


def test_numeric_column_recommendation():

    df = create_test_dataframe()

    result = recommend_chart_for_column(
        df,
        "Sales"
    )

    assert len(result) == 1

    assert result[0]["chart_type"] == "histogram"

    assert result[0]["column"] == "Sales"


def test_categorical_column_recommendation():

    df = create_test_dataframe()

    result = recommend_chart_for_column(
        df,
        "Product"
    )

    chart_types = [
        item["chart_type"]
        for item in result
    ]

    assert "bar" in chart_types

    assert "pie" in chart_types


def test_relationship_recommendations():

    df = create_test_dataframe()

    result = recommend_relationship_charts(df)

    chart_types = [
        item["chart_type"]
        for item in result
    ]

    assert "scatter" in chart_types

    assert "bar" in chart_types


def test_all_chart_recommendations():

    df = create_test_dataframe()

    result = get_chart_recommendations(df)

    assert isinstance(
        result,
        list
    )

    assert len(result) > 0


def test_complete_recommendations():

    df = create_test_dataframe()

    result = (
        generate_dataset_recommendations(
            df
        )
    )

    assert "summary" in result

    assert "recommended_charts" in result

    assert result["summary"]["rows"] == 5

    assert len(
        result["recommended_charts"]
    ) > 0