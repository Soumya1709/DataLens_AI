import {Upload,FileSpreadsheet} from "lucide-react";


function FileUpload({file,onFileChange,onUpload,loading}) {

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
                    onChange={onFileChange}
                    className="hidden"
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