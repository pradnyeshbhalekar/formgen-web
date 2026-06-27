# FormGen

A web UI that converts JSON schemas into production-ready React JSX forms using the [pyformgen](https://pypi.org/project/pyformgen/) Python library.

## What it does

Paste a JSON schema describing your form fields — labels, types, placeholders, validation rules — and get copy-paste-ready React component code instantly.

**Supported field types:** `text`, `number`, `select`, `checkbox`, and more (via pyformgen).

## Getting started

```bash
# Install dependencies
npm install

# Set your backend URL
echo "VITE_BACKENDURI=http://localhost:8000" > .env

# Start dev server
npm run dev
```

The app expects a backend running at `VITE_BACKENDURI` with a `POST /generatedOutput` endpoint that accepts a JSON schema and returns `{ "jsx": "..." }`.

## Example schema

```json
{
  "first_name": {
    "label": "First Name",
    "type": "text",
    "placeholder": "Enter your first name",
    "required": true
  },
  "age": {
    "label": "Age",
    "type": "number",
    "min": 0,
    "required": true
  }
}
```

## Stack

- **Frontend:** React + Vite
- **Form generation:** [pyformgen](https://pypi.org/project/pyformgen/) (Python backend)

## Links

- [GitHub](https://github.com/pradnyeshbhalekar/formgen)
- [PyPI package](https://pypi.org/project/pyformgen/)
