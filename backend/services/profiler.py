import pandas as pd

def get_numeric_statistics(df:pd.DataFrame):
    """
    Generate statistical information for numeric columns.
    """
    
    numeric_df=df.select_dtypes(include="number")
    statistics={}
    for column in numeric_df.columns:
        series=numeric_df[column].dropna()
        
        if series.empty:
            continue
        statistics[column]={
            "count":int(series.count()),
            "mean":round(float(series.mean()),2),
            "median":round(float(series.median()),2),
            "min":round(float(series.min()),2),
            "max":round(float(series.max()),2),
            "std":round(float(series.std()),2),
            "q1":round(float(series.quantile(0.25)),2),
            "q1":round(float(series.quantile(0.75)),2),
            
            
        }
        return statistics
    
def get_categorical_statistics(df:pd.DataFrame):
    """
    Generate statistics for categorical columns.
    """
    categorical_df=df.select_dtypes(include=["object","category"])
    statistics={}
    
    for column in categorical_df.columns:
        series=categorical_df[column].dropna()
        
        if series.empty:
            continue
        value_counts=series.value_counts()
        
        most_frequent=value_counts.index[0]
        frequency=int(value_counts.iloc[0])
        
        percentage=(frequency/len(series))*100
        
        statistics[column]={
            "unique_values":int(series.nunique()),
            "most_frequent":str(most_frequent),
            "frequency":frequency,
            "percentage":round(percentage,2)
        }
        return statistics
    
    
def detect_outliers(
    df: pd.DataFrame
):
    """
    Detect outliers using the IQR method.
    """

    numeric_df = df.select_dtypes(
        include="number"
    )

    outliers = {}

    for column in numeric_df.columns:

        series = numeric_df[column].dropna()

        if series.empty:
            continue

        q1 = series.quantile(0.25)
        q3 = series.quantile(0.75)

        iqr = q3 - q1

        lower_bound = (
            q1 - 1.5 * iqr
        )

        upper_bound = (
            q3 + 1.5 * iqr
        )

        outlier_values = series[
            (series < lower_bound)
            | (series > upper_bound)
        ]

        outliers[column] = {
            "outlier_count": int(
                len(outlier_values)
            ),

            "lower_bound": round(
                float(lower_bound),
                2
            ),

            "upper_bound": round(
                float(upper_bound),
                2
            )
        }

    return outliers

def get_correlations(
    df: pd.DataFrame
):
    """
    Calculate correlations between
    numeric columns.
    """

    numeric_df = df.select_dtypes(
        include="number"
    )

    if numeric_df.shape[1] < 2:
        return {}

    correlation_matrix = (
        numeric_df.corr()
    )

    correlations = {}

    for column in correlation_matrix.columns:

        correlations[column] = {}

        for other_column in (
            correlation_matrix.columns
        ):

            value = correlation_matrix.loc[
                column,
                other_column
            ]

            if pd.isna(value):
                correlations[column][
                    other_column
                ] = None

            else:
                correlations[column][
                    other_column
                ] = round(
                    float(value),
                    3
                )

    return correlations