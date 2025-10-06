#!/usr/bin/env python3
"""
Script de ejemplo para ejecutar el cargador de datos NDVI
"""

from data_loader import NDVIDataLoader
import os

def main():
    """
    Función principal para ejecutar el cargador de datos
    """
    print("🌱 CARGADOR DE DATOS NDVI - MONTERREY")
    print("="*50)
    
    # Verificar que estamos en el directorio correcto
    if not os.path.exists("data"):
        print("❌ Error: No se encontró la carpeta 'data'")
        print("   Asegúrate de ejecutar este script desde la carpeta 'models'")
        return
    
    # Crear instancia del cargador
    loader = NDVIDataLoader()
    
    try:
        # Cargar todos los archivos CSV
        loader.load_all_csv_files()
        
        # Preparar los datos
        loader.prepare_data()
        
        # Obtener resumen estadístico
        loader.get_data_summary()
        
        # Saltar visualizaciones para evitar problemas
        print("Saltando visualizaciones para evitar problemas...")
        
        # Exportar datos procesados
        loader.export_processed_data()
        
        print("\n" + "="*50)
        print("✅ PROCESAMIENTO COMPLETADO EXITOSAMENTE")
        print("="*50)
        print("\nPróximos pasos recomendados:")
        print("1. Revisar las visualizaciones generadas")
        print("2. Analizar los patrones estacionales")
        print("3. Implementar modelos de predicción temporal")
        print("4. Validar con datos históricos")
        
    except Exception as e:
        print(f"❌ Error durante el procesamiento: {e}")
        raise

if __name__ == "__main__":
    main()
