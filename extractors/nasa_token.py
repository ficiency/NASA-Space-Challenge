import requests
import os 
from dotenv import load_dotenv
load_dotenv()
user = os.getenv("NASA_USER")
password = os.getenv("NASA_PASSWORD")

# solicitar token AppEEARS
r = requests.post(
    "https://appeears.earthdatacloud.nasa.gov/api/login",
    auth=(user, password)
)
print(r.json())