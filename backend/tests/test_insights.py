import pandas as pd

from services.insights import (
    generate_missing_value_insights,
    generate_duplicate_insights,
    generate_correlation_insights,
    generate_outlier_insights,
    generate_categorical_insights,
    generate_insights
)


def test_missing_value_insights():

    df = pd.DataFrame({
        "Age": [
            20,
            None,
            None,
            30
        ]
    })

    result = generate_missing_value_insights(df)

    assert len(result) == 1

    assert result[0]["type"] == "missing_values"

    assert result[0]["column"] == "Age"


def test_duplicate_insights():

    df = pd.DataFrame({
        "Name": [
            "A",
            "B",
            "B",
            "C"
        ]
    })

    result = generate_duplicate_insights(df)

    assert len(result) == 1

    assert result[0]["type"] == "duplicates"

    assert "duplicate" in (
        result[0]["message"].lower()
    )


def test_correlation_insights():

    df = pd.DataFrame({
        "Sales": [
            100,
            200,
            300,
            400,
            500
        ],

        "Profit": [
            10,
            20,
            30,
            40,
            50
        ]
    })

    result = generate_correlation_insights(df)

    assert len(result) == 1

    assert result[0]["type"] == "correlation"

    assert result[0]["correlation"] == 1.0


def test_outlier_insights():

    df = pd.DataFrame({
        "Sales": [
            100,
            110,
            105,
            115,
            1000
        ]
    })

    result = generate_outlier_insights(df)

    assert len(result) == 1

    assert result[0]["type"] == "outliers"

    assert result[0]["outlier_count"] == 1


def test_categorical_insights():

    df = pd.DataFrame({
        "City": [
            "Delhi",
            "Delhi",
            "Delhi",
            "Delhi",
            "Mumbai"
        ]
    })

    result = generate_categorical_insights(df)

    assert len(result) == 1

    assert result[0]["type"] == (
        "category_distribution"
    )


def test_generate_all_insights():

    df = pd.DataFrame({
        "Sales": [
            100,
            200,
            300,
            400,
            500
        ],

        "Profit": [
            10,
            20,
            30,
            40,
            50
        ],

        "City": [
            "Delhi",
            "Delhi",
            "Delhi",
            "Mumbai",
            "Delhi"
        ]
    })

    result = generate_insights(df)

    assert isinstance(result, list)

    assert len(result) > 0