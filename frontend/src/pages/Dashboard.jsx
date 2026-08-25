import { useState } from "react";

import {uploadDataset,getAIAnalysis} from "../services/api";

import FileUpload from "../components/FileUpload";

import DatasetSummary from "../components/DatasetSummary";

import ColumnOverview from "../components/ColumnOverview";
import CleaningPanel from "../components/CleaningPanel";


function Dashboard() {

    const [file, setFile] =
        useState(null);

    const [uploadData, setUploadData] =
        useState(null);

    const [aiAnalysis, setAIAnalysis] =
        useState(null);

    const [loading, setLoading] =
        useState(false);


    const handleFileChange = (event) => {

        const selectedFile =
            event.target.files[0];

        setFile(selectedFile);

        setUploadData(null);

        setAIAnalysis(null);
    };


    const handleUpload = async () => {

        if (!file) {
            return;
        }

        try {

            setLoading(true);

            const data =
                await uploadDataset(file);

            setUploadData(data);

        } catch (error) {

            console.error(error);

            alert(
                "Unable to upload dataset."
            );

        } finally {

            setLoading(false);
        }
    };


    const handleAIAnalysis = async () => {

        if (!file) {
            return;
        }

        try {

            setLoading(true);

            const data =
                await getAIAnalysis(file);

            setAIAnalysis(
                data.analysis
            );

        } catch (error) {

            console.error(error);

            alert(
                "Unable to generate AI analysis."
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <main className="min-h-screen bg-gray-50">

            <div className="mx-auto max-w-6xl px-5 py-12">

                {/* Hero */}

                <header className="mb-10 text-center">

                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        DataLens AI
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
                        Turn your data into meaningful
                        insights with AI-powered analytics.
                    </p>

                </header>


                {/* Upload */}

                <FileUpload
                    file={file}
                    onFileChange={
                        handleFileChange
                    }
                    onUpload={
                        handleUpload
                    }
                    loading={loading}
                />


                {/* Dataset information */}

                {uploadData && (

                    <>

                        <DatasetSummary
                            data={uploadData}
                        />

                        <ColumnOverview
                            data={uploadData}
                        />

                        <CleaningPanel
                           file={file}
                        />


                        <div className="mt-8 flex justify-center">

                            <button
                                onClick={
                                    handleAIAnalysis
                                }
                                disabled={loading}
                                className="rounded-lg bg-gray-900 px-7 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading
                                    ? "Analyzing..."
                                    : "Analyze with AI"
                                }
                            </button>

                        </div>

                    </>
                )}


                {/* AI Preview */}

                {aiAnalysis && (

                    <section className="mt-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                        <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                            AI Analysis
                        </h2>

                        <pre className="whitespace-pre-wrap leading-7 text-gray-600">
                            {aiAnalysis}
                        </pre>

                    </section>

                )}

            </div>

        </main>
    );
}


export default Dashboard;