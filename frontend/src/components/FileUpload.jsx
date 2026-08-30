import {Upload,FileSpreadsheet} from "lucide-react";
import { useState } from "react";


function FileUpload({file,onFileChange,onUpload,loading}) {

    const [isDragging, setIsDragging] =
    useState(false);

    const [uploadError, setUploadError] =
    useState(null);

    const validateFile = (file) => {

    if (!file) {
        return "Please select a file.";
    }


    const allowedExtensions = [
        ".csv",
        ".xlsx",
        ".xls"
    ];


    const fileName =
        file.name.toLowerCase();


    const isValidType =
        allowedExtensions.some(
            (extension) =>
                fileName.endsWith(extension)
        );


    if (!isValidType) {

        return (
            "Unsupported file type. " +
            "Please upload CSV or Excel."
        );

    }


    const maxSize =
        10 * 1024 * 1024;


    if (file.size > maxSize) {

        return (
            "File is too large. " +
            "Maximum allowed size is 10 MB."
        );

    }


    return null;
};

const handleFile = (selectedFile) => {

    const validationError =
        validateFile(selectedFile);


    if (validationError) {

        setUploadError(
            validationError
        );

        return;

    }


    setUploadError(null);


    // Keep your existing upload logic here
    handleUpload(selectedFile);
};

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                <FileSpreadsheet
                    size={34}
                    className="text-gray-700"
                />
            </div>

            <h2 className="text-2xl font-semibold text-gray-900">
                Upload your dataset
            </h2>

            <p className="mt-2 text-gray-500">
                Analyze CSV or Excel files with DataLens AI
            </p>

            <label className="mx-auto mt-6 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50">

                <Upload size={18} />

                Choose File

                        <input
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            id="dataset-upload"
            onChange={(event) => {

                const selectedFile =
                    event.target.files?.[0];

                handleFile(
                    selectedFile
                );

            }}
        />

            </label>

            {file && (

                <p className="mt-4 text-sm text-gray-500">
                    Selected:{" "}
                    <span className="font-medium text-gray-800">
                        {file.name}
                    </span>
                </p>

            )}

            <button
                onClick={onUpload}
                disabled={!file || loading}
                className="mt-6 rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {loading
                    ? "Uploading..."
                    : "Upload Dataset"
                }
            </button>

        </div>
    );
}


export default FileUpload;