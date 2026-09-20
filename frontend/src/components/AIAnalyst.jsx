import { useState } from "react";
import {getErrorMessage} from "../utils/errorUtils";


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
            getErrorMessage(
                err,
                "Unable to generate AI analysis."
            )
        );

    }finally {

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

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2A2116]">

                    <Bot
                        size={21}
                        className="text-[#D9A441]"
                    />

                </div>


                <div>

                    <h2 className="font-display text-3xl font-semibold text-[#F3ECDD]">
                        AI Analyst
                    </h2>

                    <p className="text-sm text-[#B8AC93]">
                        Get an AI-powered explanation of your data
                    </p>

                </div>

            </div>


            {/* Main Card */}

            <div className="rounded-xl border border-[#3A2F1D] bg-[#221B12] p-6 shadow-sm">

                {/* Intro */}

                {!analysis && !loading && !error && (

                    <div className="text-center">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#2A2116]">

                            <Sparkles
                                size={25}
                                className="text-[#D9A441]"
                            />

                        </div>


                        <h3 className="font-display mt-4 text-lg font-semibold text-[#F3ECDD]">

                            Let DataLens analyze your dataset

                        </h3>


                        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#B8AC93]">

                            Gemini will explain the important findings,
                            data-quality issues, recommendations, and
                            useful visualizations.

                        </p>


                        <button
                            type="button"
                            onClick={handleAnalysis}
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#D9A441] px-5 py-2.5 text-sm font-medium text-[#17130D] transition hover:bg-[#C2933A]"
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
                            className="animate-spin text-[#D9A441]"
                        />


                        <p className="mt-4 font-medium text-[#F3ECDD]">

                            Analyzing your dataset...

                        </p>


                        <p className="mt-1 text-sm text-[#B8AC93]">

                            This may take a few seconds.

                        </p>

                    </div>

                )}


                {/* Error */}

                {error && (

                    <div className="rounded-lg border border-[#3A2F1D] bg-[#2A2116] p-5">

                        <div className="flex gap-3">

                            <AlertCircle
                                size={20}
                                className="shrink-0 text-[#D9A441]"
                            />


                            <div>

                                <p className="font-medium text-[#F3ECDD]">
                                    AI analysis failed
                                </p>

                                <p className="mt-1 text-sm text-[#B8AC93]">
                                    {error}
                                </p>

                            </div>

                        </div>


                        <button
                            type="button"
                            onClick={handleAnalysis}
                            className="mt-4 rounded-lg bg-[#D9A441] px-4 py-2 text-sm font-medium text-[#17130D] hover:bg-[#C2933A]"
                        >

                            Try Again

                        </button>

                    </div>

                )}


                {/* AI Result */}

                {analysis && !loading && (

                    <div>

                        <div className="mb-5 flex items-center justify-between border-b border-[#3A2F1D] pb-4">

                            <div className="flex items-center gap-2">

                                <Sparkles
                                    size={19}
                                    className="text-[#D9A441]"
                                />

                                <h3 className="font-display font-semibold text-[#F3ECDD]">

                                    DataLens AI Analysis

                                </h3>

                            </div>


                            <button
                                type="button"
                                onClick={handleAnalysis}
                                className="text-sm font-medium text-[#B8AC93] hover:text-[#F3ECDD]"
                            >

                                Analyze Again

                            </button>

                        </div>


                        <div className="whitespace-pre-wrap text-sm leading-7 text-[#D8CFBB]">

                            {analysis}

                        </div>

                    </div>

                )}

            </div>

        </section>
    );
}


export default AIAnalyst;