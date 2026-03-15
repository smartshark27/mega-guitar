# Mega Guitar Project

This project is a web-based guitar tab viewer built with Next.js and a Python-based tab converter.

## Project Structure

- `src/app`: Next.js application (App Router).
- `data/tabs`: JSON files containing song tabs.
- `data/schemas`: JSON schemas for data validation.
- `converter/`: Python scripts to convert raw text tabs to structured JSON.

## Foundational Mandates

- **Data Integrity:** All tab JSON files in `data/tabs` must strictly adhere to the `data/schemas/tab_schema.json`.
- **Styling:** Prefer Vanilla CSS for styling as per global mandates for new components, unless existing styles dictate otherwise.
- **Python Scripts:** Ensure `requirements.txt` in the `converter/` directory is updated if new dependencies are added to `tab_converter.py`.

## Technical Standards

- **TypeScript:** Use strict typing for all new files in `src/`.
- **Next.js:** Use Server Components by default; use `'use client'` only when necessary for interactivity.
- **Testing:** When modifying the converter, verify with sample tabs in `converter/rawtabs/`.
