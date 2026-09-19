# 📊 DataLens AI

> **Turn Data Into Insights — Automatically.**

DataLens AI is an AI-powered data analytics platform that transforms raw CSV and Excel datasets into meaningful insights through automated data profiling, quality analysis, visualization recommendations, statistical analysis, and conversational AI.

Instead of manually exploring a dataset using multiple tools, DataLens AI provides an end-to-end workflow for understanding, analyzing, visualizing, and asking questions about your data in one place.

---

## ✨ Features

### 📁 Dataset Upload
- Upload CSV, XLSX, and XLS files
- File type validation
- File size validation
- Drag-and-drop upload support
- User-friendly upload states and error handling

### 🔍 Automated Dataset Profiling
Automatically analyzes your dataset and provides:

- Dataset dimensions
- Column information
- Data types
- Missing values
- Duplicate rows
- Numeric statistics
- Categorical statistics
- Correlations
- Outlier detection

### 🧹 Data Quality Analysis
Identify potential data-quality issues before performing analysis.

DataLens AI detects:

- Missing values
- Duplicate records
- Outliers
- Data-type related issues
- Potential cleaning requirements

It also provides automated cleaning recommendations.

### 💡 Smart Insights
DataLens AI analyzes the dataset and generates meaningful insights based on:

- Statistical patterns
- Missing values
- Correlations
- Outliers
- Categorical distributions
- Dataset characteristics

### 📈 Automatic Visualization Recommendations
Instead of manually deciding which chart to use, DataLens AI recommends suitable visualizations based on the structure and characteristics of the dataset.

Examples include:

- Bar charts
- Histograms
- Scatter plots
- Correlation visualizations
- Distribution charts
- Categorical comparisons

### 🤖 AI Analyst
Use Gemini-powered AI analysis to generate a structured analytical report containing:

1. Executive Summary
2. Key Findings
3. Data Quality
4. Business Recommendations
5. Suggested Visualizations

### 💬 Ask Your Data
Interact with your dataset using natural language.

For example:

> "What is the average Age?"

> "Which department has the highest average salary?"

> "What data quality problems should I fix first?"

DataLens AI maintains conversation history so follow-up questions can be asked naturally.

### 📄 PDF Report Generation
Generate a downloadable PDF report containing:

- Dataset overview
- Data quality information
- Statistical profile
- Smart insights
- AI-generated analysis

### 🎨 Responsive Dashboard
The interface is designed to work across:

- Desktop
- Tablet
- Mobile

The dashboard includes responsive layouts, loading states, error handling, navigation, and empty states.

---

# 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │        User          │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   React Frontend     │
                         │  Tailwind CSS + Vite │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     FastAPI API      │
                         └──────────┬───────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
                ▼                   ▼                   ▼
        ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
        │  Profiling   │    │   Cleaning   │    │   Insights   │
        └──────┬───────┘    └──────┬───────┘    └──────┬───────┘
               │                   │                   │
               └───────────────────┼───────────────────┘
                                   │
                                   ▼
                         ┌──────────────────────┐
                         │  Visualization      │
                         │   Recommendations   │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      Gemini AI       │
                         │     AI Analyst       │
                         │    Ask Your Data     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    PDF Report        │
                         └──────────────────────┘