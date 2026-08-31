import {
    Upload,
    FileSpreadsheet,
    AlertCircle,
    X
} from "lucide-react";

import { useState } from "react";


function FileUpload({
    file,
    onFileChange,
    onUpload,
    loading
}) {

    const [isDragging, setIsDragging] =
        useState(false);

    const [uploadError, setUploadError] =
        useState(null);


    const validateFile = (selectedFile) => {

        if (!selectedFile) {
            return "Please select a file.";
        }


        const allowedExtensions = [
            ".csv",
            ".xlsx",
            ".xls"
        ];


        const fileName =
            selectedFile.name.toLowerCase();


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


        if (selectedFile.size > maxSize) {

            return (
                "File is too large. " +
                "Maximum allowed size is 10 MB."
            );

        }


        return null;
    };


    const handleFile = (selectedFile) => {

        if (!selectedFile) {
            return;
        }


        const validationError =
            validateFile(selectedFile);


        if (validationError) {

            setUploadError(
                validationError
            );

            return;

        }


        setUploadError(null);


        // Send file to Dashboard
        onFileChange(selectedFile);
    };


    const handleDrop = (event) => {

        event.preventDefault();

        setIsDragging(false);


        const selectedFile =
            event.dataTransfer.files?.[0];


        handleFile(selectedFile);
    };


    const handleDragOver = (event) => {

        event.preventDefault();

        setIsDragging(true);

    };


    const handleDragLeave = (event) => {

        event.preventDefault();

        setIsDragging(false);

    };


    const handleRemove = () => {

        setUploadError(null);

        onFileChange(null);

    };


    return (

        <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm sm:p-10">

            {/* Icon */}

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">

                <FileSpreadsheet
                    size={34}
                    className="text-gray-700"
                />

            </div>


            {/* Heading */}

            <h2 className="text-2xl font-semibold text-gray-900">

                Upload your dataset

            </h2>


            <p className="mt-2 text-gray-500">

                Analyze CSV or Excel files with DataLens AI

            </p>


            {/* Drag and Drop Area */}

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                    mx-auto
                    mt-6
                    max-w-xl
                    rounded-xl
                    border-2
                    border-dashed
                    p-8
                    transition
                    ${
                        isDragging
                            ? "border-gray-900 bg-gray-100"
                            : "border-gray-300 bg-gray-50"
                    }
                `}
            >

                <div className="flex flex-col items-center">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">

                        <Upload
                            size={22}
                            className="text-gray-700"
                        />

                    </div>


                    <p className="mt-4 text-sm font-medium text-gray-900">

                        {isDragging
                            ? "Drop your file here"
                            : "Drag & drop your dataset here"
                        }

                    </p>


                    <p className="mt-1 text-sm text-gray-500">

                        or click the button below to browse

                    </p>


                    {/* File input */}

                    <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        id="dataset-upload"
                        className="hidden"
                        onChange={(event) => {

                            const selectedFile =
                                event.target.files?.[0];


                            handleFile(
                                selectedFile
                            );

                        }}
                    />


                    {/* Browse button */}

                    <label
                        htmlFor="dataset-upload"
                        className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >

                        <Upload size={17} />

                        Choose File

                    </label>


                    <p className="mt-3 text-xs text-gray-400">

                        CSV, XLSX or XLS · Maximum 10 MB

                    </p>

                </div>

            </div>


            {/* Error */}

            {uploadError && (

                <div className="mx-auto mt-4 flex max-w-xl items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 text-left">

                    <div className="flex items-center gap-3">

                        <AlertCircle
                            size={19}
                            className="shrink-0 text-gray-700"
                        />

                        <p className="text-sm text-gray-700">

                            {uploadError}

                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            setUploadError(null)
                        }
                        className="text-gray-400 hover:text-gray-700"
                    >

                        <X size={17} />

                    </button>

                </div>

            )}


            {/* Selected File */}

            {file && (

                <div className="mx-auto mt-5 flex max-w-xl items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">

                    <div className="flex items-center gap-3 text-left">

                        <FileSpreadsheet
                            size={20}
                            className="shrink-0 text-gray-700"
                        />


                        <div>

                            <p className="min-w-0 break-all text-sm font-medium text-gray-900">

                                {file.name}

                            </p>


                            <p className="text-xs text-gray-500">

                                {(
                                    file.size /
                                    1024 /
                                    1024
                                ).toFixed(2)} MB

                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={handleRemove}
                        disabled={loading}
                        className="rounded-md p-1.5 text-gray-400 transition hover:bg-white hover:text-gray-700 disabled:cursor-not-allowed"
                    >

                        <X size={18} />

                    </button>

                </div>

            )}


            {/* Upload Dataset */}

            <button
                type="button"
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