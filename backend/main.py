import io

import pandas as pd

from fastapi import (
    FastAPI,
    UploadFile,
    File,
    HTTPException
)
from services.cleaner import (
    get_missing_analysis,
    get_duplicate_analysis,
    detect_column_types,
    generate_cleaning_recommendations,
    fill_missing_values,
    remove_duplicates,
    convert_column_type,
    get_dataset_summary
)

from services.profiler import (
    get_numeric_statistics,
    get_categorical_statistics,
    detect_outliers,
    get_correlations
)


app = FastAPI(
    title="DataLens AI",
    description="AI-powered data analytics platform",
    version="1.0.0"
)


@app.get("/")
def root():

    return {
        "message": "DataLens AI API is running 🚀"
    }


def load_dataframe(filename: str, contents: bytes):

    try:

        if filename.lower().endswith(".csv"):

            return pd.read_csv(
                io.BytesIO(contents)
            )

        elif filename.lower().endswith(
            (".xlsx", ".xls")
        ):

            return pd.read_excel(
                io.BytesIO(contents)
            )

        else:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Unsupported file type. "
                    "Upload CSV or Excel."
                )
            )

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=f"Unable to read file: {str(e)}"
        )


@app.post("/api/upload")
async def upload_file(
    file: UploadFile = File(...)
):

    contents = await file.read()

    df = load_dataframe(
        file.filename,
        contents
    )

    return {
        "filename": file.filename,

        "rows": len(df),

        "columns": len(df.columns),

        "column_names": df.columns.tolist(),

        "missing_values": (
            df.isna()
            .sum()
            .to_dict()
        ),

        "duplicate_rows": int(
            df.duplicated().sum()
        ),

        "numeric_columns": (
            df.select_dtypes(
                include="number"
            )
            .columns
            .tolist()
        ),

        "categorical_columns": (
            df.select_dtypes(
                include="object"
            )
            .columns
            .tolist()
        )
    }
    
@app.post("/api/clean/recommendations")
async def cleaning_recommendations(
    file: UploadFile = File(...)
):

    contents = await file.read()

    df = load_dataframe(
        file.filename,
        contents
    )

    return {
        "filename": file.filename,

        "missing_analysis": (
            get_missing_analysis(df)
        ),

        "duplicate_analysis": (
            get_duplicate_analysis(df)
        ),

        "column_types": (
            detect_column_types(df)
        ),

        "recommendations": (
            generate_cleaning_recommendations(df)
        )
    }
    
@app.post("/api/profile")
async def profile_dataset(
    file: UploadFile = File(...)
):

    contents = await file.read()

    df = load_dataframe(
        file.filename,
        contents
    )

    return {
        "filename": file.filename,

        "dataset": {
            "rows": int(len(df)),
            "columns": int(len(df.columns))
        },

        "numeric_statistics": (
            get_numeric_statistics(df)
        ),

        "categorical_statistics": (
            get_categorical_statistics(df)
        ),

        "outliers": (
            detect_outliers(df)
        ),

        "correlations": (
            get_correlations(df)
        )
    }


@app.post("/api/clean")
async def clean_dataset(
    file: UploadFile = File(...),

    operations: str = "{}"
):

    contents = await file.read()

    df = load_dataframe(
        file.filename,
        contents
    )

    import json

    try:

        operations_data = json.loads(
            operations
        )

    except json.JSONDecodeError:

        raise HTTPException(
            status_code=400,
            detail="Invalid operations JSON."
        )

    before = get_dataset_summary(df)

    changes = []

    fill_operations = operations_data.get(
        "fill_missing",
        []
    )

    for operation in fill_operations:

        column = operation.get("column")
        method = operation.get("method")

        try:

            missing_before = int(
                df[column].isna().sum()
            )

            df = fill_missing_values(
                df,
                column,
                method
            )

            changes.append(
                f"Filled {missing_before} "
                f"missing values in '{column}' "
                f"using {method}."
            )

        except Exception as e:

            raise HTTPException(
                status_code=400,
                detail=str(e)
            )

    if operations_data.get(
        "remove_duplicates",
        False
    ):

        duplicate_count = int(
            df.duplicated().sum()
        )

        df = remove_duplicates(df)

        changes.append(
            f"Removed {duplicate_count} "
            "duplicate rows."
        )


    type_operations = operations_data.get(
        "convert_types",
        []
    )

    for operation in type_operations:

        column = operation.get("column")
        target_type = operation.get(
            "target_type"
        )

        try:

            df = convert_column_type(
                df,
                column,
                target_type
            )

            changes.append(
                f"Converted '{column}' "
                f"to {target_type}."
            )

        except Exception as e:

            raise HTTPException(
                status_code=400,
                detail=str(e)
            )

    after = get_dataset_summary(df)

    return {
        "before": before,

        "after": after,

        "changes": changes,

        "preview": (
            df.head(5)
            .fillna("")
            .to_dict(
                orient="records"
            )
        )
    }