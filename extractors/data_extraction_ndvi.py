import requests
import json
import os

# Usar token directamente del archivo .env
with open('.env', 'r') as f:
    for line in f:
        if line.startswith('NASA_TOKEN='):
            token = line.split('=')[1].strip()
            break

headers = {
    'Authorization': 'Bearer ' + token
}

# Crear múltiples tareas para cubrir toda la ciudad de Monterrey
# Definir puntos estratégicos en la ciudad
points = [
    {"name": "Centro", "lat": 25.6866, "lon": -100.3161},
    {"name": "Norte", "lat": 25.75, "lon": -100.3},
    {"name": "Sur", "lat": 25.6, "lon": -100.3},
    {"name": "Este", "lat": 25.6866, "lon": -100.2},
    {"name": "Oeste", "lat": 25.6866, "lon": -100.4},
    {"name": "Noreste", "lat": 25.75, "lon": -100.2},
    {"name": "Noroeste", "lat": 25.75, "lon": -100.4},
    {"name": "Sureste", "lat": 25.6, "lon": -100.2},
    {"name": "Suroeste", "lat": 25.6, "lon": -100.4}
]

# Crear tareas para cada punto
task_ids = []

for i, point in enumerate(points):
    task = {
        "task_type": "point",
        "task_name": f"monterrey_{point['name']}_ndvi_2005_2024",
        "params": {
            "dates": [
                {"startDate": "01-01-2005", "endDate": "12-31-2005"},
                {"startDate": "01-01-2006", "endDate": "12-31-2006"},
                {"startDate": "01-01-2007", "endDate": "12-31-2007"},
                {"startDate": "01-01-2008", "endDate": "12-31-2008"},
                {"startDate": "01-01-2009", "endDate": "12-31-2009"},
                {"startDate": "01-01-2010", "endDate": "12-31-2010"},
                {"startDate": "01-01-2011", "endDate": "12-31-2011"},
                {"startDate": "01-01-2012", "endDate": "12-31-2012"},
                {"startDate": "01-01-2013", "endDate": "12-31-2013"},
                {"startDate": "01-01-2014", "endDate": "12-31-2014"},
                {"startDate": "01-01-2015", "endDate": "12-31-2015"},
                {"startDate": "01-01-2016", "endDate": "12-31-2016"},
                {"startDate": "01-01-2017", "endDate": "12-31-2017"},
                {"startDate": "01-01-2018", "endDate": "12-31-2018"},
                {"startDate": "01-01-2019", "endDate": "12-31-2019"},
                {"startDate": "01-01-2020", "endDate": "12-31-2020"},
                {"startDate": "01-01-2021", "endDate": "12-31-2021"},
                {"startDate": "01-01-2022", "endDate": "12-31-2022"},
                {"startDate": "01-01-2023", "endDate": "12-31-2023"},
                {"startDate": "01-01-2024", "endDate": "12-31-2024"}
            ],
            "layers": [
                {
                    "product": "MOD13Q1.061",
                    "layer": "_250m_16_days_NDVI"
                },
                {
                    "product": "MOD13Q1.061",
                    "layer": "_250m_16_days_EVI"
                },
                {
                    "product": "MOD13Q1.061",
                    "layer": "_250m_16_days_VI_Quality"
                },
                {
                    "product": "MOD13Q1.061",
                    "layer": "_250m_16_days_pixel_reliability"
                }
            ],
            "coordinates": [{"latitude": point["lat"], "longitude": point["lon"]}],
            "output": {
                "format": {"type": "geotiff"},
                "projection": "geographic"
            }
        }
    }
    
    # Enviar tarea
    print(f"Enviando tarea {i+1}/9: {point['name']} ({point['lat']}, {point['lon']})")
    resp = requests.post(
        "https://appeears.earthdatacloud.nasa.gov/api/task",
        headers=headers,
        json=task
    )
    
    print(f"Status code: {resp.status_code}")
    if resp.status_code == 202:
        task_data = resp.json()
        task_ids.append({
            "name": point["name"],
            "task_id": task_data["task_id"],
            "status": task_data["status"]
        })
        print(f"Task ID: {task_data['task_id']}")
    else:
        print(f"Error: {resp.json()}")
    print("-" * 50)

print(f"\nTareas creadas exitosamente: {len(task_ids)}/9")
for task in task_ids:
    print(f"- {task['name']}: {task['task_id']}")

# Task IDs creados exitosamente
print(f"\n✓ {len(task_ids)} tareas creadas exitosamente")
