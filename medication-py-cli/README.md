
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

### Start the API server
```
medication-cli api
# Or specify host/port
medication-cli api --host 127.0.0.1 --port 8000 --debug
```

## RESTful API

The API provides the following endpoints:

### Get all medications
```
GET /medications
```

### Search medications
```
GET /medications?query=aspirin
```

### Get medication by ID
```
GET /medications/{medication_id}
```

### Add new medication
```
POST /medications
Content-Type: application/json

{
  "name": "Aspirin",
  "generic_name": "Acetylsalicylic Acid",
  "drug_class": "NSAID",
  "description": "Pain reliever and fever reducer",
  "prescription_only": false
}
```

### Update medication
```
PUT /medications/{medication_id}
Content-Type: application/json

{
  "name": "Aspirin",
  "generic_name": "Acetylsalicylic Acid",
  "drug_class": "NSAID",
  "description": "Updated description",
  "prescription_only": false
}
```

### Delete medication
```
DELETE /medications/{medication_id}
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
