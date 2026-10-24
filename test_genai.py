import os
from pathlib import Path
from google import genai

# Load .env file from project root if present
env_file = Path(__file__).resolve().parent / ".env"
if env_file.exists():
    for raw_line in env_file.read_text().splitlines():
        line = raw_line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip())

# Initialize client using GEMINI_API_KEY from environment/.env
client = genai.Client()

response = client.models.generate_content(
    model="gemma-4-26b-a4b-it",
    contents="Roses are red...",
)

print(response.text)
