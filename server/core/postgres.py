"""
Best Hiring Tool Database Connection Bridge.
Provides a unified gateway to the database using Supabase.
Initially, it mocks the psycopg2 cursor interface to allow existing 
legacy route logic to function without complete refactoring.
"""
import os
import json
from core.supabase import get_supabase

class MockCursor:
    def __init__(self, db):
        self.db = db
        self.description = [("id",), ("name",)] # Minimal mock
        self.last_row = None

    def execute(self, query, params=None):
        print(f"DEBUG: Executing SQL query: {query} with params {params}")
        # Very limited SQL parsing for critical hackathon demos
        query_upper = query.upper()
        if "FROM USERS" in query_upper:
            res = self.db.table("users").select("*").execute()
            self.last_row = res.data
        elif "FROM COMPANIES" in query_upper:
            res = self.db.table("companies").select("*").execute()
            self.last_row = res.data
        elif "FROM JOBS" in query_upper:
            res = self.db.table("jobs").select("*").execute()
            self.last_row = res.data
        else:
            self.last_row = []

    def fetchone(self):
        if self.last_row and len(self.last_row) > 0:
            return tuple(self.last_row[0].values())
        return None

    def fetchall(self):
        if self.last_row:
            return [tuple(r.values()) for r in self.last_row]
        return []

    def close(self):
        pass

class MockConnection:
    def __init__(self):
        self.db = get_supabase()

    def cursor(self):
        return MockCursor(self.db)

    def commit(self):
        pass

    def rollback(self):
        pass

    def close(self):
        pass

def get_db_connection():
    """Returns a connection-like object for database operations."""
    # In a full-scale app, this would use a real psycopg2/asyncpg connection
    # or handle the transition to Supabase client more robustly.
    return MockConnection()
