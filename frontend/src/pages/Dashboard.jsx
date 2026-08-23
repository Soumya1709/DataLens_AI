import { useState } from "react";

import {uploadDataset,getAIAnalysis} from "../services/api";


function Dashboard() {

    const [file, setFile] = useState(null);

    const [uploadData, setUploadData] =
        useState(null);

    const [aiAnalysis, setAIAnalysis] =
        useState(null);

    const [loading, setLoading] =
        useState(false);


    const handleFileChange = (event) => {

        setFile(
            event.target.files[0]
        );
    };


    const handleUpload = async () => {

        if (!file) {

            alert(
                "Please select a CSV or Excel file."
            );

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

            alert(
                "Please upload a dataset first."
            );

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

        <div>

            <h1>
                DataLens AI
            </h1>

            <p>
                AI-powered data analytics
            </p>


            <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={
                    handleFileChange
                }
            />


            <button
                onClick={handleUpload}
                disabled={loading}
            >
                Upload Dataset
            </button>


            <button
                onClick={handleAIAnalysis}
                disabled={loading}
            >
                Analyze with AI
            </button>


            {uploadData && (

                <div>

                    <h2>
                        Dataset Summary
                    </h2>

                    <p>
                        Rows:{" "}
                        {uploadData.rows}
                    </p>

                    <p>
                        Columns:{" "}
                        {uploadData.columns}
                    </p>

                    <p>
                        Duplicate Rows:{" "}
                        {uploadData.duplicate_rows}
                    </p>

                </div>
            )}


            {aiAnalysis && (

                <div>

                    <h2>
                        AI Analysis
                    </h2>

                    <pre>
                        {aiAnalysis}
                    </pre>

                </div>
            )}

        </div>
    );
}


export default Dashboard;