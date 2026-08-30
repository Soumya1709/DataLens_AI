export const getErrorMessage = (
    error,
    defaultMessage = "Something went wrong."
) => {

    if (!error) {
        return defaultMessage;
    }


   
    const detail =
        error.response?.data?.detail;


    if (typeof detail === "string") {

        if (
            detail.includes("503") ||
            detail.includes("UNAVAILABLE")
        ) {

            return (
                "AI service is temporarily unavailable. " +
                "Please try again in a moment."
            );
        }


        if (
            detail.includes("Unsupported file type")
        ) {

            return (
                "Unsupported file type. " +
                "Please upload a CSV or Excel file."
            );
        }


        if (
            detail.includes("Unable to read file")
        ) {

            return (
                "The uploaded file could not be read. " +
                "Please check the file and try again."
            );
        }


        return detail;
    }


    
    if (!error.response) {

        return (
            "Unable to connect to the DataLens server. " +
            "Please check that the backend is running."
        );
    }


    
    if (
        error.response.status >= 500
    ) {

        return (
            "Something went wrong on the server. " +
            "Please try again."
        );
    }


    return defaultMessage;
};