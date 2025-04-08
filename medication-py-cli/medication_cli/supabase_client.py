
import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Get Supabase credentials
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://rlirtjxgwstjzraovntf.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsaXJ0anhnd3N0anpyYW92bnRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNTE0MTIsImV4cCI6MjA1OTYyNzQxMn0.GyUcMI0pyZ-1A6wJ5QZBG8EsFpiFW11Vy-zb2w_S2FA")

def get_client() -> Client:
    """Get a Supabase client instance."""
    return create_client(SUPABASE_URL, SUPABASE_KEY)

supabase = get_client()
