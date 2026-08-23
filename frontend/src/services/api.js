import axios from "axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

export const uploadDataset = async (file) => {

    const formData = new FormData();

    formData.append("file", file);

    const response = await API.post(
        "/api/upload",
        formData
    );

    return response.data;
};

export const getAIAnalysis = async (file) => {

    const formData = new FormData();

    formData.append("file", file);

    const response = await API.post(
        "/api/ai-analysis",
        formData
    );

    return response.data;
};

export default API;