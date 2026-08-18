import pandas as pd

from services.ai_analyst import (
    build_analysis_context
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


def test_build_analysis_context():

    df = create_test_dataframe()

    result = build_analysis_context(df)

    assert "dataset" in result

    assert "profile" in result

    assert "insights" in result

    assert "chart_recommendations" in result


def test_dataset_information():

    df = create_test_dataframe()

    result = build_analysis_context(df)

    assert result["dataset"]["rows"] == 5

    assert result["dataset"]["columns"] == 3

    assert "Sales" in (
        result["dataset"]["column_names"]
    )


def test_profile_information():

    df = create_test_dataframe()

    result = build_analysis_context(df)

    assert "numeric_statistics" in (
        result["profile"]
    )

    assert "Sales" in (
        result["profile"]["numeric_statistics"]
    )


def test_chart_recommendations():

    df = create_test_dataframe()

    result = build_analysis_context(df)

    assert len(
        result["chart_recommendations"]
    ) > 0