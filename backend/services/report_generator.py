from io import BytesIO

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle
)
from reportlab.lib import colors


def generate_pdf_report(
    filename,
    upload_data,
    profile=None,
    insights=None,
    ai_analysis=None
):
    """
    Generate a DataLens AI analysis report as a PDF.
    """

    buffer = BytesIO()


    document = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )


    styles = getSampleStyleSheet()

    title_style = styles["Title"]

    heading_style = styles["Heading2"]

    normal_style = styles["BodyText"]


    story = []

    story.append(
        Paragraph(
            "DataLens AI — Analysis Report",
            title_style
        )
    )

    story.append(
        Spacer(1, 12)
    )


    story.append(
        Paragraph(
            f"Dataset: {filename}",
            normal_style
        )
    )

    story.append(
        Spacer(1, 20)
    )

    story.append(
        Paragraph(
            "1. Dataset Overview",
            heading_style
        )
    )

    story.append(
        Spacer(1, 8)
    )


    rows = upload_data.get(
        "rows",
        upload_data.get(
            "dataset",
            {}
        ).get("rows", 0)
    )


    columns = upload_data.get(
        "columns",
        upload_data.get(
            "dataset",
            {}
        ).get("columns", 0)
    )


    overview_data = [
        ["Metric", "Value"],
        ["Rows", str(rows)],
        ["Columns", str(columns)]
    ]


    table = Table(
        overview_data,
        colWidths=[
            2.5 * inch,
            2.5 * inch
        ]
    )


    table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("PADDING", (0, 0), (-1, -1), 6)
        ])
    )


    story.append(table)

    story.append(
        Spacer(1, 20)
    )

    story.append(
        Paragraph(
            "2. Data Quality",
            heading_style
        )
    )

    story.append(
        Spacer(1, 8)
    )


    missing_values = upload_data.get(
        "missing_values",
        {}
    )


    duplicate_rows = upload_data.get(
        "duplicate_rows",
        0
    )


    story.append(
        Paragraph(
            f"Duplicate rows: {duplicate_rows}",
            normal_style
        )
    )


    story.append(
        Spacer(1, 6)
    )


    story.append(
        Paragraph(
            "Missing values:",
            normal_style
        )
    )


    for column, count in missing_values.items():

        story.append(
            Paragraph(
                f"• {column}: {count}",
                normal_style
            )
        )


    story.append(
        Spacer(1, 20)
    )

    if profile:

        story.append(
            Paragraph(
                "3. Statistical Profile",
                heading_style
            )
        )

        story.append(
            Spacer(1, 8)
        )


        numeric_statistics = profile.get(
            "numeric_statistics",
            {}
        )


        for column, stats in numeric_statistics.items():

            story.append(
                Paragraph(
                    f"<b>{column}</b>",
                    normal_style
                )
            )


            for key, value in stats.items():

                story.append(
                    Paragraph(
                        f"• {key}: {value}",
                        normal_style
                    )
                )


            story.append(
                Spacer(1, 8)
            )

    if insights:

        story.append(
            Paragraph(
                "4. Smart Insights",
                heading_style
            )
        )

        story.append(
            Spacer(1, 8)
        )


        if isinstance(
            insights,
            list
        ):

            for insight in insights:

                story.append(
                    Paragraph(
                        f"• {insight}",
                        normal_style
                    )
                )

        else:

            story.append(
                Paragraph(
                    str(insights),
                    normal_style
                )
            )


        story.append(
            Spacer(1, 20)
        )

    if ai_analysis:

        story.append(
            Paragraph(
                "5. AI Analysis",
                heading_style
            )
        )

        story.append(
            Spacer(1, 8)
        )


        formatted_analysis = (
            str(ai_analysis)
            .replace(
                "\n",
                "<br/>"
            )
        )


        story.append(
            Paragraph(
                formatted_analysis,
                normal_style
            )
        )

    document.build(
        story
    )


    buffer.seek(0)

    return buffer