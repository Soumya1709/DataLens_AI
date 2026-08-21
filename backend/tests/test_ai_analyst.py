import pandas as pd

from services.ai_analyst import (
    build_analysis_context,
    create_analysis_prompt,
    generate_ai_analysis
)


def create_test_dataframe():

    return pd.DataFrame({
        "Product": [
            "Laptop",
            "Phone",
            "Laptop",
            "Tablet",
            "Phone"
        ],

        "Sales": [
            50000,
            30000,
            45000,
            25000,
            35000
        ],

        "Profit": [
            10000,
            5000,
            9000,
            4000,
            6000
        ]
    })


def test_build_analysis_context():

    df = create_test_dataframe()

    result = build_analysis_context(df)

    assert "dataset" in result

    assert "profile" in result

    assert "insights" in result

    assert "chart_recommendations" in result


def test_dataset_information():

    df = create_test_dataframe()

    result = build_analysis_context(df)

    assert result["dataset"]["rows"] == 5

    assert result["dataset"]["columns"] == 3

    assert "Sales" in (
        result["dataset"]["column_names"]
    )


def test_profile_information():

    df = create_test_dataframe()

    result = build_analysis_context(df)

    assert "numeric_statistics" in (
        result["profile"]
    )

    assert "Sales" in (
        result["profile"]["numeric_statistics"]
    )


def test_chart_recommendations():

    df = create_test_dataframe()

    result = build_analysis_context(df)

    assert len(
        result["chart_recommendations"]
    ) > 0
    
def test_create_analysis_prompt():

    df = create_test_dataframe()

    context = build_analysis_context(df)

    prompt = create_analysis_prompt(
        context
    )

    assert isinstance(
        prompt,
        str
    )

    assert "DataLens AI" in prompt

    assert "Executive Summary" in prompt

    assert "Key Findings" in prompt

    assert "Data Quality" in prompt

    assert "Business Recommendations" in prompt

    assert "Suggested Visualizations" in prompt

    assert "Sales" in prompt

    assert "Profit" in prompt
    
def test_generate_ai_analysis(monkeypatch):

    def fake_generate_content(
        model,
        contents
    ):

        class FakeResponse:

            text = "This is a test AI analysis."

        return FakeResponse()

    monkeypatch.setattr(
        "services.ai_analyst.client.models.generate_content",
        fake_generate_content
    )

    result = generate_ai_analysis(
        "Analyze this test dataset."
    )

    assert isinstance(
        result,
        str
    )

    assert result == (
        "This is a test AI analysis."
    )
    
def test_generate_ai_analysis_empty_response(
    monkeypatch
):

    def fake_generate_content(
        model,
        contents
    ):

        class FakeResponse:

            text = ""

        return FakeResponse()

    monkeypatch.setattr(
        "services.ai_analyst.client.models.generate_content",
        fake_generate_content
    )

    try:

        generate_ai_analysis(
            "Test prompt"
        )

        assert False, (
            "Expected RuntimeError"
        )

    except RuntimeError as e:

        assert (
            "empty response"
            in str(e).lower()
        )