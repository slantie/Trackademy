import pandas as pd
import re

def process_result_dataframe(df: pd.DataFrame) -> list[dict]:
    # Drop empty rows from the beginning (where exam number is blank)
    df = df.dropna(subset=df.columns[:2])
    
    # Extract and clean first-row headers
    raw_headers = df.iloc[0].tolist()
    raw_headers = [str(col) if pd.notna(col) else "" for col in raw_headers]
    
    # Ensure unique column names
    unique_headers = []
    seen = {}
    for col in raw_headers:
        if col == "":
            col = "Unnamed"
        if col in seen:
            seen[col] += 1
            col = f"{col}.{seen[col]}"
        else:
            seen[col] = 0
        unique_headers.append(col)

    df.columns = unique_headers
    df = df[1:].reset_index(drop=True)
    df = df.fillna("")
    df = df[df['EXAM NO.'] != "EXAM NO."]

    # Regex for subject code pattern
    subject_pattern = r"^[A-Z]{2}\d{3}[A-Z]?-N\s\(\d+\)$"

    # Match and merge subject code + next column
    matched_columns = [col for col in df.columns if re.match(subject_pattern, str(col))]
    matched_indices = [df.columns.get_loc(col) for col in matched_columns]
    columns = df.columns.tolist()

    for i in matched_indices:
        if i + 1 < len(columns):
            subject_col = columns[i]
            next_col = columns[i + 1]
            df[subject_col] = df[subject_col].astype(str) + " " + df[next_col].astype(str)
            df.drop(next_col, axis=1, inplace=True)

    # Rename specific academic metric columns
    cols = df.columns.tolist()
    if "CURRENT SEMESTER" in cols:
        current_idx = cols.index("CURRENT SEMESTER")
        df.rename(columns={
            cols[current_idx]: "Current CR.ER.",
            cols[current_idx + 1]: "Current GP",
            cols[current_idx + 2]: "SPI"
        }, inplace=True)

    if "CUMMULATIVE" in df.columns:
        cumulative_idx = df.columns.get_loc("CUMMULATIVE")
        df.rename(columns={
            df.columns[cumulative_idx]: "Cumulative CR.ER.",
            df.columns[cumulative_idx + 1]: "Cumulative GP",
            df.columns[cumulative_idx + 2]: "CPI"
        }, inplace=True)

    # Clean and normalize subject grades
    def replace_invalid_grades(value):
        value = str(value).strip()
        if value == "":
            return "-"
        if "AB" in value:
            return "Absent"
        elif "ext" in value.replace(" ", "").lower():
            return "Failed External"
        elif "mid" in value.replace(" ", "").lower():
            return "Failed Mid Term"
        else:
            return value

    for col in df.columns:
        if re.match(subject_pattern, col):
            df[col] = df[col].apply(replace_invalid_grades)

    # Final cleanups
    df.replace("", "-", inplace=True)
    df.replace("--", "-", inplace=True)

    # Convert to dictionary
    return df.to_dict(orient='records')
