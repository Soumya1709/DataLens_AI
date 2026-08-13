import pandas as pd

def get_missing_analysis(df:pd.DataFrame):
    """
    Returns missing values count and percentage for each column.
    """
    
    total_rows=len(df)
    analysis=[]
    for column in df.columns:
        missing_count=int(df[column].isna().sum())
        
        missing_percentage=(
            (missing_count/total_rows)*100
            if total_rows > 0
            else 0
        )
        
        analysis.append({
            "column":column,
            "missing_count":missing_count,
            "missing_percentage":round(missing_percentage,2)
        })
    return analysis

def get_duplicate_analysis(df:pd.DataFrame):
      """
      Returns duplicate row count and percentage.
      """
      total_rows=len(df)
      duplicate_count=int(df.duplicated().sum())
      duplicate_percentage=(
          (duplicate_count/total_rows)*100
          if total_rows > 0
          else 0
      )
      return{
          "duplicate_rows":duplicate_count,
          "duplicate_percentage":duplicate_percentage
      }
      
def detect_column_types(df: pd.DataFrame):
    """
    Classify columns into different data types.
    """

    numeric_columns = []
    categorical_columns = []
    datetime_columns = []
    boolean_columns = []

    for column in df.columns:

        if pd.api.types.is_bool_dtype(df[column]):
            boolean_columns.append(column)

        elif pd.api.types.is_numeric_dtype(df[column]):
            numeric_columns.append(column)

        elif pd.api.types.is_datetime64_any_dtype(df[column]):
            datetime_columns.append(column)

        else:
            categorical_columns.append(column)

    return {
        "numeric": numeric_columns,
        "categorical": categorical_columns,
        "datetime": datetime_columns,
        "boolean": boolean_columns
    }
    
def generate_cleaning_recommendations(df: pd.DataFrame):
    """
    Generate rule-based cleaning recommendations.
    """

    recommendations = []

    column_types = detect_column_types(df)

    numeric_columns = column_types["numeric"]
    categorical_columns = column_types["categorical"]

    for column in df.columns:

        missing_count = int(
            df[column].isna().sum()
        )

        if missing_count == 0:
            continue

        if column in numeric_columns:

            recommendations.append({
                "column": column,
                "issue": "missing_values",
                "count": missing_count,
                "recommendation": (
                    "Fill missing values using median"
                )
            })

        elif column in categorical_columns:

            recommendations.append({
                "column": column,
                "issue": "missing_values",
                "count": missing_count,
                "recommendation": (
                    "Fill missing values using mode"
                )
            })

        else:

            recommendations.append({
                "column": column,
                "issue": "missing_values",
                "count": missing_count,
                "recommendation": (
                    "Review missing values manually"
                )
            })

    duplicate_count = int(
        df.duplicated().sum()
    )

    if duplicate_count > 0:

        recommendations.append({
            "column": None,
            "issue": "duplicate_rows",
            "count": duplicate_count,
            "recommendation": (
                "Remove duplicate rows"
            )
        })

    return recommendations


def fill_missing_values(
    df: pd.DataFrame,
    column: str,
    method: str
):
    """
    Fill missing values using mean, median or mode.
    """

    if column not in df.columns:
        raise ValueError(f"Column '{column}' does not exist.")

    if method == "mean":

        if not pd.api.types.is_numeric_dtype(df[column]):
            raise ValueError(
                f"Mean can only be used on numeric column '{column}'."
            )

        value = df[column].mean()
        df[column] = df[column].fillna(value)

    elif method == "median":

        if not pd.api.types.is_numeric_dtype(df[column]):
            raise ValueError(
                f"Median can only be used on numeric column '{column}'."
            )

        value = df[column].median()
        df[column] = df[column].fillna(value)

    elif method == "mode":

        mode_values = df[column].mode()

        if mode_values.empty:
            raise ValueError(
                f"Cannot determine mode for column '{column}'."
            )

        value = mode_values.iloc[0]

        df[column] = df[column].fillna(value)

    else:

        raise ValueError(
            "Invalid method. Use mean, median or mode."
        )

    return df


def remove_duplicates(df: pd.DataFrame):
    """
    Removes duplicate rows.
    """

    return df.drop_duplicates().reset_index(drop=True)


def convert_column_type(
    df: pd.DataFrame,
    column: str,
    target_type: str
):
    """
    Converts a column to a requested data type.
    """

    if column not in df.columns:
        raise ValueError(f"Column '{column}' does not exist.")

    if target_type == "numeric":

        df[column] = pd.to_numeric(
            df[column],
            errors="coerce"
        )

    elif target_type == "string":

        df[column] = df[column].astype("string")

    elif target_type == "datetime":

        df[column] = pd.to_datetime(
            df[column],
            errors="coerce"
        )

    elif target_type == "boolean":

        df[column] = df[column].astype("boolean")

    else:

        raise ValueError(
            "Invalid target type."
        )

    return df


def get_dataset_summary(df: pd.DataFrame):
    """
    Returns basic dataset quality statistics.
    """

    return {
        "rows": int(len(df)),
        "columns": int(len(df.columns)),
        "missing_values": int(df.isna().sum().sum()),
        "duplicate_rows": int(df.duplicated().sum())
    }
    
