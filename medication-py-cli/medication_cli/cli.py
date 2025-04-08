import click
import json
import sys
from .supabase_client import supabase
from typing import Dict, List, Optional, Any

@click.group()
def cli():
    """Medication Database CLI Tool"""
    pass

@cli.command('import')
@click.argument('file', type=click.Path(exists=True))
def import_drug(file):
    """Import drug data from a JSON file"""
    try:
        with open(file, 'r') as f:
            drug_data = json.load(f)
        
        result = import_drug_with_relationships(drug_data)
        if result:
            click.echo(f"Successfully imported {drug_data.get('name')} with ID: {result}")
        else:
            click.echo(f"Failed to import {drug_data.get('name')}")
    except Exception as e:
        click.echo(f"Error: {e}", err=True)
        sys.exit(1)

@cli.command('add_drug')
@click.argument('name')
@click.option('--generic', help='Generic name of the drug')
@click.option('--drug-class', help='Drug class/category')
@click.option('--description', help='Brief description of the drug')
@click.option('--otc', is_flag=True, help='Is this drug available over the counter?')
def add_drug(name, generic, drug_class, description, otc):
    """Add a basic drug entry by name"""
    try:
        # Create a basic drug record
        drug_data = {
            "name": name,
            "slug": name.lower().replace(" ", "-"),
            "generic_name": generic,
            "drug_class": drug_class,
            "description": description,
            "prescription_only": not otc
        }
        
        # Insert into medications table
        response = supabase.table("medications").insert(drug_data).execute()
        
        if response.data and len(response.data) > 0:
            drug_id = response.data[0]["id"]
            click.echo(f"Successfully added {name} with ID: {drug_id}")
        else:
            click.echo(f"Failed to add {name}")
    except Exception as e:
        click.echo(f"Error: {e}", err=True)
        sys.exit(1)

@cli.command('search')
@click.argument('query')
@click.option('--limit', default=10, help='Maximum number of results to return')
def search_medications(query, limit):
    """Search medications by name"""
    try:
        response = supabase.table("medications").select("*").ilike("name", f"%{query}%").limit(limit).execute()
        
        if response.data:
            click.echo(f"Found {len(response.data)} medications:")
            for med in response.data:
                click.echo(f"- {med['name']}")
        else:
            click.echo("No medications found matching your query.")
    except Exception as e:
        click.echo(f"Error: {e}", err=True)
        sys.exit(1)

@cli.command('get')
@click.argument('name')
def get_medication(name):
    """Get detailed information about a medication"""
    try:
        response = supabase.table("medications").select("*").ilike("name", name).limit(1).execute()
        
        if response.data and len(response.data) > 0:
            med = response.data[0]
            click.echo(f"\n{med['name']} Details:")
            click.echo(f"Generic Name: {med.get('generic_name', 'N/A')}")
            click.echo(f"Drug Class: {med.get('drug_class', 'N/A')}")
            click.echo(f"Description: {med.get('description', 'N/A')}")
            click.echo(f"Prescription Only: {'Yes' if med.get('prescription_only') else 'No'}")
        else:
            click.echo(f"No medication found with the name '{name}'.")
    except Exception as e:
        click.echo(f"Error: {e}", err=True)
        sys.exit(1)

@cli.command('export')
@click.argument('name')
@click.option('--output', '-o', type=click.Path(), help='Output file path (defaults to medication-name.json)')
def export_medication(name, output):
    """Export medication data to a JSON file"""
    try:
        # Get medication data
        response = supabase.table("medications").select("*").ilike("name", name).limit(1).execute()
        
        if not response.data or len(response.data) == 0:
            click.echo(f"No medication found with the name '{name}'.")
            return
            
        medication = response.data[0]
        
        # Convert to the format expected by the import function
        export_data = {
            "name": medication.get("name"),
            "slug": name.lower().replace(" ", "-"),
            "consumer_info": medication.get("description"),
            "side_effects": medication.get("side_effects"),
            "dosage": medication.get("dosage"),
            "pregnancy": medication.get("pregnancy"),
            "breastfeeding": medication.get("breastfeeding"),
            "classification": medication.get("drug_class"),
            "drug_class": medication.get("drug_class"),
            "generic": medication.get("generic_name"),
            "otc": not medication.get("prescription_only", False),
            "interactions": {
                "major": medication.get("interaction_classifications", {}).get("major", []),
                "moderate": medication.get("interaction_classifications", {}).get("moderate", []),
                "minor": medication.get("interaction_classifications", {}).get("minor", []),
                "unknown": [],
                "food_interactions": medication.get("food_interactions", []),
                "condition_interactions": medication.get("condition_interactions", []),
                "therapeutic_duplications": medication.get("therapeutic_duplications", [])
            }
        }
        
        # Determine output filename
        if not output:
            output = f"{name.lower().replace(' ', '-')}.json"
            
        # Write to file
        with open(output, 'w') as f:
            json.dump(export_data, f, indent=2)
            
        click.echo(f"Exported medication data to {output}")
    except Exception as e:
        click.echo(f"Error: {e}", err=True)
        sys.exit(1)

@cli.command('api')
@click.option('--host', default='0.0.0.0', help='Host to run the API server on')
@click.option('--port', default=5000, help='Port to run the API server on')
@click.option('--debug', is_flag=True, help='Run in debug mode')
def start_api_server(host, port, debug):
    """Start the Flask API server"""
    try:
        from .api import start_api
        click.echo(f"Starting API server on http://{host}:{port}")
        start_api(host=host, port=port, debug=debug)
    except ImportError as e:
        click.echo("Error: Flask or Flask-RESTful not installed. Install with 'pip install flask flask-restful'")
        sys.exit(1)
    except Exception as e:
        click.echo(f"Error starting API server: {e}", err=True)
        sys.exit(1)

def import_drug_with_relationships(drug_data: Dict[str, Any]) -> Optional[str]:
    """Import a drug and its relationships into the Supabase database"""
    try:
        # 1. Insert core drug data
        base_fields = {
            "name": drug_data.get("name"),
            "slug": drug_data.get("slug"),
            "consumer_info": drug_data.get("consumer_info"),
            "side_effects": drug_data.get("side_effects"),
            "dosage": drug_data.get("dosage"),
            "pregnancy": drug_data.get("pregnancy"),
            "breastfeeding": drug_data.get("breastfeeding"),
            "classification": drug_data.get("classification"),
            "drug_class": drug_data.get("drug_class"),
            "generic": drug_data.get("generic"),
            "otc": drug_data.get("otc")
        }
        
        response = supabase.table("drugs").insert(base_fields).execute()
        
        if not response.data or len(response.data) == 0:
            print('Failed to insert drug')
            return None
        
        drug_id = response.data[0]["id"]
        print(f"Successfully inserted drug with ID: {drug_id}")
        
        # 2. Insert interactions if they exist
        interactions = drug_data.get("interactions", {})
        
        interaction_levels = ["major", "moderate", "minor", "unknown"]
        for level in interaction_levels:
            level_interactions = interactions.get(level, [])
            
            for interaction in level_interactions:
                try:
                    supabase.table("drug_interactions").insert({
                        "drug_id": drug_id,
                        "level": level,
                        "interaction": interaction
                    }).execute()
                except Exception as e:
                    print(f"Warning: Could not insert {level} interaction '{interaction}': {e}")
        
        # 3. Insert food interactions
        food_interactions = interactions.get("food_interactions", [])
        for food in food_interactions:
            try:
                supabase.table("food_interactions").insert({
                    "drug_id": drug_id,
                    "description": food
                }).execute()
            except Exception as e:
                print(f"Warning: Could not insert food interaction '{food}': {e}")
        
        # 4. Insert condition interactions
        condition_interactions = interactions.get("condition_interactions", [])
        for condition in condition_interactions:
            try:
                supabase.table("condition_interactions").insert({
                    "drug_id": drug_id,
                    "description": condition
                }).execute()
            except Exception as e:
                print(f"Warning: Could not insert condition interaction '{condition}': {e}")
        
        # 5. Insert therapeutic duplications
        therapeutic_duplications = interactions.get("therapeutic_duplications", [])
        for dup in therapeutic_duplications:
            try:
                supabase.table("therapeutic_duplications").insert({
                    "drug_id": drug_id,
                    "description": dup
                }).execute()
            except Exception as e:
                print(f"Warning: Could not insert therapeutic duplication '{dup}': {e}")
        
        # 6. Insert imprints if they exist
        imprints = drug_data.get("imprints", [])
        for imprint in imprints:
            try:
                supabase.table("drug_imprints").insert({
                    "drug_id": drug_id,
                    "imprint_code": imprint.get("imprint_code"),
                    "image_url": imprint.get("image_url"),
                    "description": imprint.get("description")
                }).execute()
            except Exception as e:
                print(f"Warning: Could not insert imprint code '{imprint.get('imprint_code')}': {e}")
        
        # 7. Insert international names if they exist
        international_names = drug_data.get("international_names", [])
        for int_name in international_names:
            try:
                supabase.table("international_names").insert({
                    "drug_id": drug_id,
                    "country": int_name.get("country"),
                    "name": int_name.get("name")
                }).execute()
            except Exception as e:
                print(f"Warning: Could not insert international name '{int_name.get('name')}' for {int_name.get('country')}: {e}")
        
        return drug_id
    
    except Exception as e:
        print(f"Error importing drug: {e}")
        return None

if __name__ == '__main__':
    cli()
