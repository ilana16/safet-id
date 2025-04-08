
# Medication Database CLI

A Python CLI tool for interacting with the medication database.

## Installation

1. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Install the package in development mode:
   ```
   pip install -e .
   ```

## Usage

### Import a drug
```
medication-cli import drug_data.json
```

### Search medications
```
medication-cli search aspirin
```

### Get medication details
```
medication-cli get "Acetaminophen"
```

### Export medication to JSON
```
medication-cli export "Aspirin" -o aspirin.json
```

## Environment Variables

Create a `.env` file with your Supabase credentials:
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

## Integration with JavaScript Application

This CLI tool connects to the same Supabase database as the JavaScript application.
Any data created or modified by the Python CLI will be immediately accessible to your
JavaScript application.
