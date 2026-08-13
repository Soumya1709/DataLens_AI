import pandas as pd

from services.cleaner import (
    get_missing_analysis,
    get_duplicate_analysis,
    fill_missing_values,
    remove_duplicates,
    convert_column_type,
    get_dataset_summary
)


def create_test_dataframe():

    return pd.DataFrame({
        "Name": ["A", "B", "B", "C"],
        "Age": [20, 25, 25, None],
        "City": ["Delhi", "Mumbai", "Mumbai", None]
    })


def test_missing_analysis():

    df = create_test_dataframe()

    result = get_missing_analysis(df)

    age = next(
        item for item in result
        if item["column"] == "Age"
    )

    assert age["missing_count"] == 1


def test_duplicate_analysis():

    df = create_test_dataframe()

    result = get_duplicate_analysis(df)

    assert result["duplicate_rows"] == 1


def test_median_fill():

    df = create_test_dataframe()

    df = fill_missing_values(
        df,
        "Age",
        "median"
    )

    assert df["Age"].isna().sum() == 0


def test_mode_fill():

    df = create_test_dataframe()

    df = fill_missing_values(
        df,
        "City",
        "mode"
    )

    assert df["City"].isna().sum() == 0


def test_remove_duplicates():

    df = create_test_dataframe()

    cleaned = remove_duplicates(df)

    assert len(cleaned) == 3


def test_convert_type():

    df = create_test_dataframe()

    df = convert_column_type(
        df,
        "Age",
        "numeric"
    )

    assert pd.api.types.is_numeric_dtype(
        df["Age"]
    )


def test_dataset_summary():

    df = create_test_dataframe()

    summary = get_dataset_summary(df)

    assert summary["rows"] == 4
    assert summary["columns"] == 3