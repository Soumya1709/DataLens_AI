import pandas as pd

from services.profiler import (
    get_numeric_statistics,
    get_categorical_statistics,
    detect_outliers,
    get_correlations
)


def create_test_dataframe():

    return pd.DataFrame({
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
            "Mumbai",
            "Mumbai",
            "Delhi",
            "Delhi"
        ]
    })


def test_numeric_statistics():

    df = create_test_dataframe()

    result = get_numeric_statistics(df)

    assert "Sales" in result

    assert result["Sales"]["count"] == 5

    assert result["Sales"]["mean"] == 300

    assert result["Sales"]["median"] == 300


def test_categorical_statistics():

    df = create_test_dataframe()

    result = get_categorical_statistics(df)

    assert "City" in result

    assert result["City"]["unique_values"] == 2

    assert result["City"]["most_frequent"] == "Delhi"


def test_outlier_detection():

    df = pd.DataFrame({
        "Sales": [
            100,
            110,
            105,
            115,
            1000
        ]
    })

    result = detect_outliers(df)

    assert "Sales" in result

    assert result["Sales"][
        "outlier_count"
    ] == 1


def test_correlations():

    df = create_test_dataframe()

    result = get_correlations(df)

    assert "Sales" in result

    assert "Profit" in result["Sales"]

    assert result["Sales"]["Sales"] == 1.0

    assert result["Sales"]["Profit"] == 1.0