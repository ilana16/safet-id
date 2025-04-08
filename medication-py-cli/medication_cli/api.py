
from flask import Flask, request
from flask_restful import Resource, Api, reqparse
import json
from .supabase_client import supabase

app = Flask(__name__)
api = Api(app)

class MedicationList(Resource):
    def get(self):
        try:
            # Get query parameter for search
            query = request.args.get('query', '')
            limit = request.args.get('limit', 10, type=int)
            
            if query:
                # Perform search
                response = supabase.table("medications").select("*").ilike("name", f"%{query}%").limit(limit).execute()
            else:
                # Get all medications (with limit)
                response = supabase.table("medications").select("*").limit(limit).execute()
                
            return response.data, 200
        except Exception as e:
            return {"error": str(e)}, 500
    
    def post(self):
        try:
            # Parse request data
            parser = reqparse.RequestParser()
            parser.add_argument('name', required=True, help="Name is required")
            parser.add_argument('generic_name')
            parser.add_argument('drug_class')
            parser.add_argument('description')
            parser.add_argument('prescription_only', type=bool)
            args = parser.parse_args()
            
            # Create medication data
            drug_data = {
                "name": args['name'],
                "slug": args['name'].lower().replace(" ", "-"),
                "generic_name": args.get('generic_name', None),
                "drug_class": args.get('drug_class', None),
                "description": args.get('description', None),
                "prescription_only": args.get('prescription_only', True)
            }
            
            # Insert into medications table
            response = supabase.table("medications").insert(drug_data).execute()
            
            if response.data and len(response.data) > 0:
                return {"id": response.data[0]["id"], "message": f"Successfully added {args['name']}"}, 201
            else:
                return {"error": f"Failed to add {args['name']}"}, 400
        except Exception as e:
            return {"error": str(e)}, 500

class MedicationDetail(Resource):
    def get(self, medication_id):
        try:
            response = supabase.table("medications").select("*").eq("id", medication_id).limit(1).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0], 200
            else:
                return {"error": "Medication not found"}, 404
        except Exception as e:
            return {"error": str(e)}, 500
    
    def delete(self, medication_id):
        try:
            response = supabase.table("medications").delete().eq("id", medication_id).execute()
            
            if response.data and len(response.data) > 0:
                return {"message": "Medication deleted successfully"}, 200
            else:
                return {"error": "Failed to delete medication or medication not found"}, 404
        except Exception as e:
            return {"error": str(e)}, 500
            
    def put(self, medication_id):
        try:
            # Parse request data
            parser = reqparse.RequestParser()
            parser.add_argument('name')
            parser.add_argument('generic_name')
            parser.add_argument('drug_class')
            parser.add_argument('description')
            parser.add_argument('prescription_only', type=bool)
            args = parser.parse_args()
            
            # Create update data (only include provided fields)
            update_data = {}
            
            if args['name']:
                update_data["name"] = args['name']
                update_data["slug"] = args['name'].lower().replace(" ", "-")
                
            if args['generic_name'] is not None:
                update_data["generic_name"] = args['generic_name']
                
            if args['drug_class'] is not None:
                update_data["drug_class"] = args['drug_class']
                
            if args['description'] is not None:
                update_data["description"] = args['description']
                
            if args['prescription_only'] is not None:
                update_data["prescription_only"] = args['prescription_only']
            
            # Don't proceed if no fields to update
            if not update_data:
                return {"error": "No fields provided for update"}, 400
                
            # Update medication in database
            response = supabase.table("medications").update(update_data).eq("id", medication_id).execute()
            
            if response.data and len(response.data) > 0:
                return {"message": "Medication updated successfully", "medication": response.data[0]}, 200
            else:
                return {"error": "Failed to update medication or medication not found"}, 404
        except Exception as e:
            return {"error": str(e)}, 500

# Add API routes
api.add_resource(MedicationList, '/medications')
api.add_resource(MedicationDetail, '/medications/<string:medication_id>')

def start_api(host='0.0.0.0', port=5000, debug=False):
    app.run(host=host, port=port, debug=debug)
