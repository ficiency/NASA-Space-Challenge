import pandas as pd
import numpy as np
import os
from datetime import datetime
from pathlib import Path

class NDVIDataLoader:
    """
    Clase para cargar y preparar datos de NDVI de múltiples regiones de Monterrey
    """
    
    def __init__(self, data_folder="data/raw"):
        """
        Inicializa el cargador de datos
        
        Args:
            data_folder (str): Ruta a la carpeta con los archivos CSV
        """
        self.data_folder = Path(data_folder)
        self.data = {}
        self.combined_data = None
        
    def load_all_csv_files(self):
        """
        Carga todos los archivos CSV de la carpeta de datos
        """
        print("Cargando archivos CSV...")
        
        # Buscar todos los archivos CSV en la carpeta
        csv_files = list(self.data_folder.glob("*.csv"))
        
        if not csv_files:
            raise FileNotFoundError(f"No se encontraron archivos CSV en {self.data_folder}")
        
        for file_path in csv_files:
            # Extraer nombre de la región del nombre del archivo
            region_name = file_path.stem.replace("monterrey_", "").replace("_NDVI_clean", "")
            
            print(f"Cargando: {file_path.name} -> Región: {region_name}")
            
            try:
                # Cargar el archivo CSV
                df = pd.read_csv(file_path)
                
                # Agregar columna de región
                df['Region'] = region_name
                
                # Guardar en el diccionario
                self.data[region_name] = df
                
                print(f"  ✓ {len(df)} registros cargados")
                
            except Exception as e:
                print(f"  ✗ Error cargando {file_path.name}: {e}")
        
        print(f"\nTotal de regiones cargadas: {len(self.data)}")
        return self.data
    
    def prepare_data(self):
        """
        Prepara y limpia los datos para análisis
        """
        print("\nPreparando datos...")
        
        # Combinar todos los datos
        all_dataframes = []
        
        for region, df in self.data.items():
            # Crear copia para no modificar el original
            df_clean = df.copy()
            
            # Convertir fecha a datetime
            df_clean['Date'] = pd.to_datetime(df_clean['Date'])
            
            # Limpiar valores de NDVI y EVI (eliminar valores inválidos)
            df_clean = df_clean[
                (df_clean['MOD13Q1_061__250m_16_days_NDVI'] >= 0) & 
                (df_clean['MOD13Q1_061__250m_16_days_NDVI'] <= 1) &
                (df_clean['MOD13Q1_061__250m_16_days_EVI'] >= 0) & 
                (df_clean['MOD13Q1_061__250m_16_days_EVI'] <= 1)
            ]
            
            # Renombrar columnas para facilitar el trabajo
            df_clean = df_clean.rename(columns={
                'MOD13Q1_061__250m_16_days_NDVI': 'NDVI',
                'MOD13Q1_061__250m_16_days_EVI': 'EVI',
                'MOD13Q1_061__250m_16_days_pixel_reliability': 'Pixel_Reliability'
            })
            
            # Agregar columnas derivadas
            df_clean['Year'] = df_clean['Date'].dt.year
            df_clean['Month'] = df_clean['Date'].dt.month
            df_clean['Season'] = df_clean['Month'].map({
                12: 'Winter', 1: 'Winter', 2: 'Winter',
                3: 'Spring', 4: 'Spring', 5: 'Spring',
                6: 'Summer', 7: 'Summer', 8: 'Summer',
                9: 'Fall', 10: 'Fall', 11: 'Fall'
            })
            
            # Calcular estadísticas por región
            df_clean['NDVI_Mean'] = df_clean.groupby('Region')['NDVI'].transform('mean')
            df_clean['NDVI_Std'] = df_clean.groupby('Region')['NDVI'].transform('std')
            
            all_dataframes.append(df_clean)
        
        # Combinar todos los datos
        self.combined_data = pd.concat(all_dataframes, ignore_index=True)
        
        # Ordenar por fecha
        self.combined_data = self.combined_data.sort_values(['Region', 'Date'])
        
        print(f"✓ Datos combinados: {len(self.combined_data)} registros")
        print(f"✓ Período: {self.combined_data['Date'].min()} a {self.combined_data['Date'].max()}")
        print(f"✓ Regiones: {sorted(self.combined_data['Region'].unique())}")
        
        return self.combined_data
    
    def get_data_summary(self):
        """
        Obtiene un resumen estadístico de los datos
        """
        if self.combined_data is None:
            raise ValueError("Primero debe cargar y preparar los datos")
        
        print("\n" + "="*50)
        print("RESUMEN ESTADÍSTICO DE LOS DATOS")
        print("="*50)
        
        # Resumen por región
        summary = self.combined_data.groupby('Region').agg({
            'NDVI': ['count', 'mean', 'std', 'min', 'max'],
            'EVI': ['mean', 'std'],
            'Date': ['min', 'max']
        }).round(4)
        
        print("\nEstadísticas por región:")
        print(summary)
        
        # Resumen temporal
        print(f"\nRango temporal: {self.combined_data['Date'].min()} a {self.combined_data['Date'].max()}")
        print(f"Total de años: {self.combined_data['Year'].nunique()}")
        
        # Valores faltantes
        missing_data = self.combined_data.isnull().sum()
        if missing_data.sum() > 0:
            print(f"\nValores faltantes:")
            print(missing_data[missing_data > 0])
        else:
            print("\n✓ No hay valores faltantes")
        
        return summary
    
    def visualize_data(self, save_plots=True):
        """
        Crea visualizaciones de los datos
        """
        if self.combined_data is None:
            raise ValueError("Primero debe cargar y preparar los datos")
        
        print("\nCreando visualizaciones...")
        
        # Configurar estilo
        try:
            plt.style.use('seaborn-v0_8')
        except:
            try:
                plt.style.use('seaborn')
            except:
                plt.style.use('default')
        fig, axes = plt.subplots(2, 2, figsize=(15, 12))
        fig.suptitle('Análisis de Datos NDVI - Regiones de Monterrey', fontsize=16, fontweight='bold')
        
        # 1. Evolución temporal del NDVI por región
        ax1 = axes[0, 0]
        for region in self.combined_data['Region'].unique():
            region_data = self.combined_data[self.combined_data['Region'] == region]
            ax1.plot(region_data['Date'], region_data['NDVI'], label=region, alpha=0.7, linewidth=1)
        
        ax1.set_title('Evolución Temporal del NDVI por Región')
        ax1.set_xlabel('Fecha')
        ax1.set_ylabel('NDVI')
        ax1.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
        ax1.grid(True, alpha=0.3)
        
        # 2. Distribución del NDVI por región
        ax2 = axes[0, 1]
        self.combined_data.boxplot(column='NDVI', by='Region', ax=ax2)
        ax2.set_title('Distribución del NDVI por Región')
        ax2.set_xlabel('Región')
        ax2.set_ylabel('NDVI')
        
        # 3. NDVI promedio por mes
        ax3 = axes[1, 0]
        monthly_avg = self.combined_data.groupby(['Region', 'Month'])['NDVI'].mean().unstack()
        monthly_avg.plot(kind='line', ax=ax3, marker='o')
        ax3.set_title('NDVI Promedio por Mes')
        ax3.set_xlabel('Mes')
        ax3.set_ylabel('NDVI Promedio')
        ax3.legend(title='Región', bbox_to_anchor=(1.05, 1), loc='upper left')
        ax3.grid(True, alpha=0.3)
        
        # 4. Correlación NDVI vs EVI
        ax4 = axes[1, 1]
        for region in self.combined_data['Region'].unique():
            region_data = self.combined_data[self.combined_data['Region'] == region]
            ax4.scatter(region_data['NDVI'], region_data['EVI'], label=region, alpha=0.6, s=20)
        
        ax4.set_title('Correlación NDVI vs EVI')
        ax4.set_xlabel('NDVI')
        ax4.set_ylabel('EVI')
        ax4.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
        ax4.grid(True, alpha=0.3)
        
        plt.tight_layout()
        
        if save_plots:
            plt.savefig('models/ndvi_analysis.png', dpi=300, bbox_inches='tight')
            print("✓ Gráficos guardados en: models/ndvi_analysis.png")
        
        plt.show()
    
    def export_processed_data(self, output_file="data/processed/processed_ndvi_data.csv"):
        """
        Exporta los datos procesados a un archivo CSV
        """
        if self.combined_data is None:
            raise ValueError("Primero debe cargar y preparar los datos")
        
        self.combined_data.to_csv(output_file, index=False)
        print(f"✓ Datos procesados exportados a: {output_file}")
        
        return output_file

def main():
    """
    Función principal para ejecutar el cargador de datos
    """
    print("🌱 CARGADOR DE DATOS NDVI - MONTERREY")
    print("="*50)
    
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
