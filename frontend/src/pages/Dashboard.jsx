import { useState } from "react";

import {
    uploadDataset,
    getAIAnalysis,
    exportReport
} from "../services/api";

import FileUpload from "../components/FileUpload";

import DatasetSummary from "../components/DatasetSummary";
import ColumnOverview from "../components/ColumnOverview";
import CleaningPanel from "../components/CleaningPanel";
import ProfilingPanel from "../components/ProfilingPanel";
import VisualizationPanel from "../components/VisualizationPanel";
import DataHealth from "../components/DataHealth";
import SmartInsights from "../components/SmartInsights";
import AnalysisOverview from "../components/AnalysisOverview";
import AIAnalyst from "../components/AIAnalyst";
import AskData from "../components/AskData";


function Dashboard() {

    const [file, setFile] =
        useState(null);

    const [uploadData, setUploadData] =
        useState(null);

    const [aiAnalysis, setAIAnalysis] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [profile, setProfile] =
        useState(null);


    const handleFileChange = (selectedFile) => {

        setFile(selectedFile);

        setUploadData(null);

        setAIAnalysis(null);

        setProfile(null);
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


    const handleReset = () => {

        setFile(null);

        setUploadData(null);

        setAIAnalysis(null);

        setProfile(null);
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


    const handleDownloadReport = async () => {

        if (!file) {
            return;
        }

        try {

            setLoading(true);

            const pdfBlob =
                await exportReport(
                    file,
                    aiAnalysis || ""
                );


            const url =
                window.URL.createObjectURL(
                    new Blob(
                        [pdfBlob],
                        {
                            type: "application/pdf"
                        }
                    )
                );


            const link =
                document.createElement("a");


            link.href = url;

            link.download =
                "DataLens_Report.pdf";


            document.body.appendChild(
                link
            );


            link.click();

            link.remove();


            window.URL.revokeObjectURL(
                url
            );


        } catch (error) {

            console.error(error);

            alert(
                "Unable to generate report."
            );


        } finally {

            setLoading(false);

        }
    };


    return (

        <main className="min-h-screen bg-gray-50">


            {/* Navbar */}

            <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">

                <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">

                    <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900">

                            <span className="text-sm font-bold text-white">
                                DL
                            </span>

                        </div>


                        <div>

                            <p className="font-semibold text-gray-900">
                                DataLens AI
                            </p>

                            <p className="hidden text-xs text-gray-500 sm:block">
                                Intelligent Data Analytics
                            </p>

                        </div>

                    </div>


                    <div className="flex items-center gap-2">

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                            AI Powered
                        </span>

                    </div>

                </div>

            </nav>


            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-5 sm:py-12">


                {/* Hero */}

                <header className="mb-10 text-center">

                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm">

                        <span className="h-2 w-2 rounded-full bg-gray-900"></span>

                        Intelligent Data Analytics

                    </div>


                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">

                        Turn Data Into Insights

                    </h1>


                    <p className="mx-auto mt-4 max-w-2xl text-lg leading-7 text-gray-500">

                        Upload your dataset, discover hidden patterns, analyze data with AI,
                        and generate actionable insights.

                    </p>

                </header>


                {/* Dashboard Navigation */}

                {uploadData && (

                    <div className="sticky top-[73px] z-40 mb-8 overflow-x-auto rounded-xl border border-gray-200 bg-white/95 p-2 shadow-sm backdrop-blur">

                        <div className="flex min-w-max items-center justify-center gap-1">

                            <a
                                href="#overview"
                                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                            >
                                Overview
                            </a>


                            <a
                                href="#data-quality"
                                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                            >
                                Data Quality
                            </a>


                            <a
                                href="#analysis"
                                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                            >
                                Analysis
                            </a>


                            <a
                                href="#ai-analysis"
                                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                            >
                                AI Analysis
                            </a>

                        </div>

                    </div>

                )}


                {/* Upload */}



<div className="mb-4">

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

</div>


{!uploadData && !file && (

    <div className="mt-4 text-center">

        <p className="text-sm font-medium text-gray-700">
            Start by uploading your dataset
        </p>

        <p className="mt-1 text-xs text-gray-500">
            DataLens AI will automatically profile, clean,
            visualize, and analyze your data.
        </p>

    </div>

)}


{file && !uploadData && !loading && (

    <div className="mt-4 text-center">

        <p className="text-sm font-medium text-gray-700">
            Your file is ready
        </p>

        <p className="mt-1 text-xs text-gray-500">
            Click the upload button above to start analyzing your dataset.
        </p>

    </div>

)}

                {/* Dataset Status */}

                {uploadData && (

                    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <div>

                                <p className="text-sm font-semibold text-gray-900">
                                    Dataset Status
                                </p>


                                <p className="mt-1 text-xs text-gray-500">
                                    Your dataset has been successfully processed.
                                </p>


                                <p className="mt-1 break-all text-xs text-gray-400">
                                    {file?.name}
                                </p>

                            </div>


                            <div className="flex flex-wrap gap-2">

                                <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">

                                    <span className="h-2 w-2 rounded-full bg-gray-700"></span>

                                    Dataset Loaded

                                </span>


                                <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">

                                    <span className="h-2 w-2 rounded-full bg-gray-700"></span>

                                    Analysis Ready

                                </span>


                                <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">

                                    <span className="h-2 w-2 rounded-full bg-gray-700"></span>

                                    AI Ready

                                </span>

                            </div>

                        </div>

                    </div>

                )}


                {/* Dataset Information */}

                {uploadData && (

                    <>


                        {/* Overview */}

                        <div id="overview">

                            <div className="mb-5 mt-8">

                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Dataset Overview
                                </p>


                                <h2 className="mt-1 text-xl font-semibold text-gray-900">
                                    Understand Your Dataset
                                </h2>

                            </div>


                            <DatasetSummary
                                data={uploadData}
                            />


                            <ColumnOverview
                                data={uploadData}
                            />

                        </div>


                        {/* Data Quality */}

                        <div id="data-quality">

                            <div className="mb-5 mt-12">

                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Data Quality
                                </p>


                                <h2 className="mt-1 text-xl font-semibold text-gray-900">
                                    Clean and Validate Your Data
                                </h2>

                            </div>


                            <CleaningPanel
                                file={file}
                            />


                            <ProfilingPanel
                                file={file}
                                profile={profile}
                                setProfile={setProfile}
                            />


                            <DataHealth
                                uploadData={uploadData}
                                profile={profile}
                            />

                        </div>


                        {/* Analysis */}

                        <div id="analysis">

                            <div className="mb-5 mt-12">

                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Data Analysis
                                </p>


                                <h2 className="mt-1 text-xl font-semibold text-gray-900">
                                    Discover Patterns and Insights
                                </h2>

                            </div>


                            <AnalysisOverview
                                uploadData={uploadData}
                                profile={profile}
                            />


                            <SmartInsights
                                uploadData={uploadData}
                                profile={profile}
                            />


                            <VisualizationPanel
                                file={file}
                            />

                        </div>


                        {/* AI Analysis */}

                        <div id="ai-analysis">

                            <div className="mb-5 mt-12">

                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Artificial Intelligence
                                </p>


                                <h2 className="mt-1 text-xl font-semibold text-gray-900">
                                    Analyze and Ask Your Data
                                </h2>

                            </div>


                            <AIAnalyst
                                file={file}
                            />


                            <AskData
                                file={file}
                            />

                        </div>


                        {/* Action Buttons */}

                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">


                            <button
                                onClick={handleAIAnalysis}
                                disabled={loading}
                                className="rounded-lg bg-gray-900 px-7 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                {loading
                                    ? "Analyzing..."
                                    : "Analyze with AI"
                                }

                            </button>


                            <button
                                onClick={handleReset}
                                disabled={loading}
                                className="rounded-lg border border-gray-300 bg-white px-7 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                Upload New Dataset

                            </button>


                            <button
                                type="button"
                                onClick={
                                    handleDownloadReport
                                }
                                disabled={
                                    !file ||
                                    loading
                                }
                                className="rounded-lg border border-gray-300 bg-white px-7 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                Download Report

                            </button>

                        </div>

                    </>

                )}


                {/* AI Preview */}

                {aiAnalysis && (

                   <section className="mt-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

    <div className="mb-5 flex items-center justify-between">

        <div>

            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                AI Generated
            </p>

            <h2 className="mt-1 text-2xl font-semibold text-gray-900">
                AI Analysis
            </h2>

        </div>


        <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
            Generated
        </span>

    </div>


    <div className="rounded-lg bg-gray-50 p-5">

        <pre className="whitespace-pre-wrap text-sm leading-7 text-gray-600">
            {aiAnalysis}
        </pre>

    </div>

</section>

                )}

            </div>

        </main>

    );
}


export default Dashboard;