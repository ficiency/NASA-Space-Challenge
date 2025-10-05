# NASA Space Challenge
Major League Hacking 2025

## Configuración Inicial

### 1. Crear cuenta en NASA Earthdata
1. Ve a [https://urs.earthdata.nasa.gov/home](https://urs.earthdata.nasa.gov/home)
2. Crea una cuenta nueva

### 2. Autorizar AppEEARS
1. Ve a **Applications > Authorized Apps**
2. Busca **AppEEARS** y habilítala

### 3. Configurar variables de entorno
1. Crea un archivo `.env` en la raíz del proyecto
2. Agrega tu username y password de NASA Earthdata:

```env
NASA_USER=tu_usuario_aqui
NASA_PASSWORD=tu_password_aqui
NASA_TOKEN=
```

### 4. Obtener token de AppEEARS
1. Ejecuta el script para obtener tu token:
```bash
python nasa_token.py
```

2. En los logs, copia el token que aparece
3. Pégalo en el archivo `.env` en la llave `NASA_TOKEN`

### 5. Extraer datos
Una vez configurado el token, puedes ejecutar:

```bash
# Para datos de fenología (MCD12Q2) 
python data_extraction_mcd12q2.py

# Para datos de NDVI (MOD13Q1)
python data_extraction_ndvi.py
```

Estos scripts solicitarán los datos a la base de datos de NASA AppEEARS para las coordenadas de Monterrey, México.

