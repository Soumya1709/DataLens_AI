import { useState } from "react";

import {MessageCircle,Send,Loader2,AlertCircle,Sparkles} from "lucide-react";

import {askDataQuestion} from "../services/api";
import {getErrorMessage} from "../utils/errorUtils";


function AskData({ file }) {

    const [question, setQuestion] =useState("");

    const [answer, setAnswer] =useState("");

    const [loading, setLoading] =useState(false);

    const [error, setError] =useState(null);

    const [messages, setMessages] =useState([]);


    const handleAsk = async () => {

        if (!file) {
            return;
        }


        if (!question.trim()) {
            setError(
                "Please enter a question."
            );

            return;
        }


        try {

            setLoading(true);

            setError(null);

            setAnswer("");


            const result =
    await askDataQuestion(
        file,
        question,
        messages
    );


    setAnswer(
        result.answer
    );


    setMessages(
        (previousMessages) => [
            ...previousMessages,

            {
                role: "user",
                content: question
            },

            {
                role: "assistant",
                content: result.answer
            }
        ]
    );


    setQuestion("");


                setAnswer(
                    result.answer
                );

                } catch (err) {

        console.error(err);

        setError(
            getErrorMessage(
                err,
                "Unable to answer your question."
            )
        );

    }finally {

                setLoading(false);

            }

        };


        const handleKeyDown = (event) => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                handleAsk();

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

                    <MessageCircle
                        size={21}
                        className="text-[#D9A441]"
                    />

                </div>


                <div>

                    <h2 className="font-display text-3xl font-semibold text-[#F3ECDD]">
                        Ask Your Data
                    </h2>

                    <p className="text-sm text-[#B8AC93]">
                        Ask questions about your dataset in natural language
                    </p>

                </div>

            </div>


            {/* Main Card */}

            <div className="rounded-xl border border-[#3A2F1D] bg-[#221B12] p-6 shadow-sm">

                {/* Question */}

                <div>

                    <label className="mb-2 block text-sm font-medium text-[#B8AC93]">

                        Your Question

                    </label>


                    <textarea
                        value={question}
                        onChange={(event) =>
                            setQuestion(
                                event.target.value
                            )
                        }
                        onKeyDown={handleKeyDown}
                        placeholder="e.g. What is the strongest relationship in my dataset?"
                        rows={3}
                        className="w-full resize-none rounded-lg border border-[#3A2F1D] bg-[#17130D] px-4 py-3 text-sm text-[#F3ECDD] outline-none placeholder:text-[#8F8368] focus:border-[#D9A441]"
                    />

                </div>


                {/* Ask Button */}

                <div className="mt-3 flex justify-end">

                    <button
                        type="button"
                        onClick={handleAsk}
                        disabled={
                            loading ||
                            !question.trim()
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-[#D9A441] px-5 py-2.5 text-sm font-medium text-[#17130D] transition hover:bg-[#C2933A] disabled:cursor-not-allowed disabled:opacity-50"
                    >

                        {loading ? (

                            <>

                                <Loader2
                                    size={17}
                                    className="animate-spin"
                                />

                                Thinking...

                            </>

                        ) : (

                            <>

                                <Send size={17} />

                                Ask AI

                            </>

                        )}

                    </button>

                </div>


                {/* Error */}

                {error && (

                    <div className="mt-4 flex gap-3 rounded-lg border border-[#3A2F1D] bg-[#2A2116] p-4">

                        <AlertCircle
                            size={19}
                            className="shrink-0 text-[#D9A441]"
                        />

                        <p className="text-sm text-[#B8AC93]">
                            {error}
                        </p>

                    </div>

                )}


                {/* Answer */}

                {answer && !loading && (

                    <div className="mt-6 border-t border-[#3A2F1D] pt-6">

                        <div className="mb-3 flex items-center gap-2">

                            <Sparkles
                                size={18}
                                className="text-[#D9A441]"
                            />

                            <h3 className="font-display font-semibold text-[#F3ECDD]">
                                DataLens AI
                            </h3>

                        </div>


                        <div className="rounded-lg bg-[#2A2116] p-5">

                            <p className="whitespace-pre-wrap text-sm leading-7 text-[#D8CFBB]">

                                {answer}

                            </p>

                        </div>

                    </div>

                )}

            </div>


            {/* Example Questions */}

            <div className="mt-4">

                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[#B8AC93]">
                    Try asking
                </p>


                <div className="flex flex-wrap gap-2">

                    {[
                        "What is the strongest relationship in my dataset?",
                        "What data quality problems should I fix first?",
                        "What is the average Age?",
                        "Which visualization would be useful?"
                    ].map(
                        (example) => (

                            <button
                                key={example}
                                type="button"
                                onClick={() =>
                                    setQuestion(
                                        example
                                    )
                                }
                                className="rounded-full border border-[#3A2F1D] bg-[#221B12] px-3 py-2 text-xs text-[#B8AC93] transition hover:border-[#5C4E33] hover:text-[#F3ECDD]"
                            >

                                {example}

                            </button>

                        )
                    )}

                </div>

            </div>

        </section>
    );
}


export default AskData;