import sys
import os

# Add project root to path
sys.path.append(os.getcwd())

try:
    from portal.main import app
    print("SUCCESS: FastAPI App initialized successfully without import errors.")
except Exception as e:
    print(f"FAILURE: App initialization failed: {e}")
    import traceback
    traceback.print_exc()
