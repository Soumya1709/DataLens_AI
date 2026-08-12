from fastapi import FastAPI, UploadFile, File,HTTPException
import pandas as pd
import io

app=FastAPI(title="DataLens AI")

@app.get("/")
def root():
    return{
        "message":"DataLens AI is working"
    }
    
@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400,detail="Only CSV files are supported currently.")
    contents=await file.read()
    
    df=pd.read_csv(io.BytesIO(contents))
    
    missing_values=df.isnull().sum().to_dict()
    duplicate_rows=int(df.duplicated().sum())
    numeric_columns=df.select_dtypes(include="number").columns.tolist()
    categorical_columns=df.select_dtypes(include="object").columns.tolist()
    
    return{
        "filename":file.filename,
        "rows":len(df),
        "columns":len(df.columns),
        "column_names":df.columns.tolist(),
        "missing_values":missing_values,
        "duplicate_rows":duplicate_rows,
        "numeric_columns":numeric_columns,
        "categorical_columns":categorical_columns
    }