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

export const getCleaningRecommendations = async (
    file
) => {

    const formData = new FormData();

    formData.append("file", file);

    const response = await API.post(
        "/api/clean/recommendations",
        formData
    );

    return response.data;
};

export const cleanDataset = async (
    file,
    operations
) => {

    const formData = new FormData();

    formData.append("file", file);

    formData.append(
        "operations",
        JSON.stringify(operations)
    );

    const response = await API.post(
        "/api/clean",
        formData
    );

    return response.data;
};

export const getProfile = async (file) => {

    const formData = new FormData();

    formData.append(
        "file",
        file
    );

    const response = await API.post(
        "/api/profile",
        formData
    );

    return response.data;
};

export default API;

export const getDatasetData = async (file) => {

    const formData = new FormData();

    formData.append(
        "file",
        file
    );

    const response = await API.post(
        "/api/data",
        formData
    );

    return response.data;
};

export const askDataQuestion = async (
    file,
    question,
    messages
) => {

    const formData = new FormData();

    formData.append(
        "file",
        file
    );

    formData.append(
        "question",
        question
    );
    
    formData.append(
        "history",
        JSON.stringify(messages)
    );

    const response = await API.post(
        "/api/ask-data",
        formData
    );


    return response.data;
};