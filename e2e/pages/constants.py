import os

# in ms, here 30 seconds
E2E_TIMEOUT: float = float(os.getenv("E2E_TIMEOUT", 30000))
E2E_URL: str = os.getenv("E2E_URL", "localhost:5173")
E2E_USERNAME: str = os.getenv("E2E_USERNAME", "Adi")
E2E_PASSWORD: str = os.getenv("E2E_PASSWORD", "1234")
