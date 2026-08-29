import { useState } from "react";

import {
    Bot,
    Loader2,
    Sparkles,
    AlertCircle
} from "lucide-react";

import {
    getAIAnalysis
} from "../services/api";


function AIAnalyst({ file }) {

    const [analysis, setAnalysis] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState(null);


    const handleAnalysis = async () => {

        if (!file) {
            return;
        }


        try {

            setLoading(true);

            setError(null);

            setAnalysis("");


            const result =
                await getAIAnalysis(file);


            setAnalysis(
                result.analysis
            );

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.detail ||
                "Unable to generate AI analysis."
            );

        } finally {

            setLoading(false);

        }

    };


    if (!file) {
        return null;
    }


    return (

        <section className="mt-10">

            {/* Header */}

            <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">

                    <Bot
                        size={21}
                        className="text-gray-700"
                    />

                </div>


                <div>

                    <h2 className="text-2xl font-semibold text-gray-900">
                        AI Analyst
                    </h2>

                    <p className="text-sm text-gray-500">
                        Get an AI-powered explanation of your data
                    </p>

                </div>

            </div>


            {/* Main Card */}

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                {/* Intro */}

                {!analysis && !loading && !error && (

                    <div className="text-center">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">

                            <Sparkles
                                size={25}
                                className="text-gray-700"
                            />

                        </div>


                        <h3 className="mt-4 text-lg font-semibold text-gray-900">

                            Let DataLens analyze your dataset

                        </h3>


                        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500">

                            Gemini will explain the important findings,
                            data-quality issues, recommendations, and
                            useful visualizations.

                        </p>


                        <button
                            type="button"
                            onClick={handleAnalysis}
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                        >

                            <Sparkles size={17} />

                            Analyze with AI

                        </button>

                    </div>

                )}


                {/* Loading */}

                {loading && (

                    <div className="flex flex-col items-center justify-center py-12">

                        <Loader2
                            size={30}
                            className="animate-spin text-gray-700"
                        />


                        <p className="mt-4 font-medium text-gray-900">

                            Analyzing your dataset...

                        </p>


                        <p className="mt-1 text-sm text-gray-500">

                            This may take a few seconds.

                        </p>

                    </div>

                )}


                {/* Error */}

                {error && (

                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">

                        <div className="flex gap-3">

                            <AlertCircle
                                size={20}
                                className="shrink-0 text-gray-700"
                            />


                            <div>

                                <p className="font-medium text-gray-900">
                                    AI analysis failed
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    {error}
                                </p>

                            </div>

                        </div>


                        <button
                            type="button"
                            onClick={handleAnalysis}
                            className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                        >

                            Try Again

                        </button>

                    </div>

                )}


                {/* AI Result */}

                {analysis && !loading && (

                    <div>

                        <div className="mb-5 flex items-center justify-between border-b border-gray-200 pb-4">

                            <div className="flex items-center gap-2">

                                <Sparkles
                                    size={19}
                                    className="text-gray-700"
                                />

                                <h3 className="font-semibold text-gray-900">

                                    DataLens AI Analysis

                                </h3>

                            </div>


                            <button
                                type="button"
                                onClick={handleAnalysis}
                                className="text-sm font-medium text-gray-600 hover:text-gray-900"
                            >

                                Analyze Again

                            </button>

                        </div>


                        <div className="whitespace-pre-wrap text-sm leading-7 text-gray-700">

                            {analysis}

                        </div>

                    </div>

                )}

            </div>

        </section>
    );
}


export default AIAnalyst;