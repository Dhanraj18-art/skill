const SUPABASE_URL = "https://bfnvumejiagsrzegwuqq.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmbnZ1bWVqaWFnc3J6ZWd3dXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MTY5ODIsImV4cCI6MjA4OTQ5Mjk4Mn0.1AIOCNZGSChd2iUsKnl19SSE4BXeRGe-GP0WdHlTMwA"

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
)
