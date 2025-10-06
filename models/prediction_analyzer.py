import pandas as pd
import numpy as np
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

class PredictionAnalyzer:
    """
    Clase para analizar las predicciones generadas
    """
    
    def __init__(self):
        """
        Inicializa el analizador de predicciones
        """
        self.linear_predictions = None
        self.seasonal_predictions = None
        self.historical_data = None
        
    def load_predictions(self):
        """
        Carga las predicciones generadas
        """
        print("📊 Cargando predicciones...")
        
        try:
            # Cargar predicciones lineales
            self.linear_predictions = pd.read_csv("data/predictions/ndvi_predictions_linear.csv")
            self.linear_predictions['Date'] = pd.to_datetime(self.linear_predictions['Date'])
            
            # Cargar predicciones estacionales
            self.seasonal_predictions = pd.read_csv("data/predictions/ndvi_predictions_seasonal.csv")
            self.seasonal_predictions['Date'] = pd.to_datetime(self.seasonal_predictions['Date'])
            
            # Cargar datos históricos para comparación
            self.historical_data = pd.read_csv("data/processed/processed_ndvi_data.csv")
            self.historical_data['Date'] = pd.to_datetime(self.historical_data['Date'])
            
            print(f"✓ Predicciones lineales: {len(self.linear_predictions)} registros")
            print(f"✓ Predicciones estacionales: {len(self.seasonal_predictions)} registros")
            print(f"✓ Datos históricos: {len(self.historical_data)} registros")
            
            return True
            
        except Exception as e:
            print(f"❌ Error cargando predicciones: {e}")
            return False
    
    def analyze_prediction_trends(self):
        """
        Analiza las tendencias en las predicciones
        """
        print("\n🔍 ANÁLISIS DE TENDENCIAS EN PREDICCIONES")
        print("="*60)
        
        # Análisis por región
        regions = self.linear_predictions['Region'].unique()
        
        for region in regions:
            print(f"\n📍 Región: {region}")
            
            # Predicciones lineales
            linear_region = self.linear_predictions[self.linear_predictions['Region'] == region]
            linear_start = linear_region['Predicted_NDVI'].iloc[0]
            linear_end = linear_region['Predicted_NDVI'].iloc[-1]
            linear_change = linear_end - linear_start
            linear_change_pct = (linear_change / linear_start) * 100
            
            # Predicciones estacionales
            seasonal_region = self.seasonal_predictions[self.seasonal_predictions['Region'] == region]
            seasonal_start = seasonal_region['Predicted_NDVI'].iloc[0]
            seasonal_end = seasonal_region['Predicted_NDVI'].iloc[-1]
            seasonal_change = seasonal_end - seasonal_start
            seasonal_change_pct = (seasonal_change / seasonal_start) * 100
            
            # Datos históricos recientes
            historical_region = self.historical_data[self.historical_data['Region'] == region]
            historical_recent = historical_region['NDVI'].tail(5).mean()
            
            print(f"  📈 Método Lineal:")
            print(f"    Inicio: {linear_start:.4f}")
            print(f"    Fin: {linear_end:.4f}")
            print(f"    Cambio: {linear_change:+.4f} ({linear_change_pct:+.2f}%)")
            
            print(f"  🔄 Método Estacional:")
            print(f"    Inicio: {seasonal_start:.4f}")
            print(f"    Fin: {seasonal_end:.4f}")
            print(f"    Cambio: {seasonal_change:+.4f} ({seasonal_change_pct:+.2f}%)")
            
            print(f"  📊 Histórico reciente: {historical_recent:.4f}")
            
            # Comparar con histórico
            linear_vs_hist = abs(linear_end - historical_recent) / historical_recent * 100
            seasonal_vs_hist = abs(seasonal_end - historical_recent) / historical_recent * 100
            
            print(f"  🎯 Desviación del histórico:")
            print(f"    Lineal: {linear_vs_hist:.2f}%")
            print(f"    Estacional: {seasonal_vs_hist:.2f}%")
    
    def analyze_seasonal_patterns(self):
        """
        Analiza los patrones estacionales en las predicciones
        """
        print("\n🌿 ANÁLISIS DE PATRONES ESTACIONALES")
        print("="*60)
        
        # Agregar información temporal
        self.seasonal_predictions['Month'] = self.seasonal_predictions['Date'].dt.month
        self.seasonal_predictions['Season'] = self.seasonal_predictions['Month'].map({
            12: 'Winter', 1: 'Winter', 2: 'Winter',
            3: 'Spring', 4: 'Spring', 5: 'Spring',
            6: 'Summer', 7: 'Summer', 8: 'Summer',
            9: 'Fall', 10: 'Fall', 11: 'Fall'
        })
        
        # Análisis por región y estación
        seasonal_analysis = self.seasonal_predictions.groupby(['Region', 'Season'])['Predicted_NDVI'].agg(['mean', 'std', 'min', 'max']).round(4)
        
        print("\n📅 Predicciones estacionales por región:")
        print(seasonal_analysis)
        
        # Identificar picos estacionales
        print("\n🔝 Picos estacionales identificados:")
        for region in self.seasonal_predictions['Region'].unique():
            region_data = self.seasonal_predictions[self.seasonal_predictions['Region'] == region]
            monthly_avg = region_data.groupby('Month')['Predicted_NDVI'].mean()
            
            max_month = monthly_avg.idxmax()
            min_month = monthly_avg.idxmin()
            
            print(f"  {region}: Máximo en mes {max_month} ({monthly_avg[max_month]:.4f}), "
                  f"Mínimo en mes {min_month} ({monthly_avg[min_month]:.4f})")
    
    def compare_prediction_methods(self):
        """
        Compara los dos métodos de predicción
        """
        print("\n⚖️ COMPARACIÓN DE MÉTODOS DE PREDICCIÓN")
        print("="*60)
        
        # Combinar predicciones para comparación
        comparison = pd.merge(
            self.linear_predictions,
            self.seasonal_predictions,
            on=['Date', 'Region'],
            suffixes=('_linear', '_seasonal')
        )
        
        # Calcular diferencias
        comparison['Difference'] = comparison['Predicted_NDVI_seasonal'] - comparison['Predicted_NDVI_linear']
        comparison['Difference_pct'] = (comparison['Difference'] / comparison['Predicted_NDVI_linear']) * 100
        
        # Análisis por región
        print("\n📊 Diferencias entre métodos por región:")
        for region in comparison['Region'].unique():
            region_data = comparison[comparison['Region'] == region]
            
            avg_diff = region_data['Difference'].mean()
            avg_diff_pct = region_data['Difference_pct'].mean()
            max_diff = region_data['Difference'].max()
            min_diff = region_data['Difference'].min()
            
            print(f"  {region}:")
            print(f"    Diferencia promedio: {avg_diff:+.4f} ({avg_diff_pct:+.2f}%)")
            print(f"    Rango: {min_diff:+.4f} a {max_diff:+.4f}")
            
            # Determinar qué método predice valores más altos
            if avg_diff > 0:
                print(f"    → Método estacional predice valores más altos")
            else:
                print(f"    → Método lineal predice valores más altos")
    
    def analyze_future_scenarios(self):
        """
        Analiza escenarios futuros basados en las predicciones
        """
        print("\n🔮 ANÁLISIS DE ESCENARIOS FUTUROS")
        print("="*60)
        
        # Obtener predicciones para 2025
        predictions_2025 = self.seasonal_predictions[
            self.seasonal_predictions['Date'].dt.year == 2025
        ].copy()
        
        predictions_2025['Month'] = predictions_2025['Date'].dt.month
        
        # Análisis por región
        print("\n📈 Predicciones para 2025 por región:")
        for region in predictions_2025['Region'].unique():
            region_data = predictions_2025[predictions_2025['Region'] == region]
            
            # Estadísticas anuales
            annual_avg = region_data['Predicted_NDVI'].mean()
            annual_max = region_data['Predicted_NDVI'].max()
            annual_min = region_data['Predicted_NDVI'].min()
            annual_std = region_data['Predicted_NDVI'].std()
            
            print(f"  {region}:")
            print(f"    Promedio anual: {annual_avg:.4f}")
            print(f"    Máximo: {annual_max:.4f}")
            print(f"    Mínimo: {annual_min:.4f}")
            print(f"    Variabilidad: {annual_std:.4f}")
            
            # Comparar con datos históricos
            historical_region = self.historical_data[self.historical_data['Region'] == region]
            historical_avg = historical_region['NDVI'].mean()
            
            change_vs_historical = (annual_avg - historical_avg) / historical_avg * 100
            
            print(f"    Cambio vs histórico: {change_vs_historical:+.2f}%")
            
            # Interpretación
            if change_vs_historical > 5:
                print(f"    🌱 Tendencia: Aumento significativo de vegetación")
            elif change_vs_historical < -5:
                print(f"    🏗️ Tendencia: Disminución significativa de vegetación")
            else:
                print(f"    📊 Tendencia: Estabilidad en la vegetación")
    
    def generate_summary_report(self):
        """
        Genera un reporte resumen de las predicciones
        """
        print("\n📋 REPORTE RESUMEN DE PREDICCIONES")
        print("="*60)
        
        # Estadísticas generales
        print("\n📊 Estadísticas generales:")
        print(f"  Período de predicción: {self.linear_predictions['Date'].min()} a {self.linear_predictions['Date'].max()}")
        print(f"  Regiones analizadas: {len(self.linear_predictions['Region'].unique())}")
        print(f"  Períodos predichos: {len(self.linear_predictions) // len(self.linear_predictions['Region'].unique())}")
        
        # Mejores y peores regiones para predicción
        print("\n🏆 Ranking de regiones por estabilidad:")
        
        # Calcular variabilidad en predicciones estacionales
        variability = self.seasonal_predictions.groupby('Region')['Predicted_NDVI'].std().sort_values()
        
        for i, (region, std) in enumerate(variability.items(), 1):
            print(f"  {i}. {region}: Variabilidad = {std:.4f}")
        
        # Recomendaciones
        print("\n💡 Recomendaciones:")
        print("  1. Las regiones con menor variabilidad son más predecibles")
        print("  2. El método estacional captura mejor los patrones estacionales")
        print("  3. El método lineal es mejor para tendencias a largo plazo")
        print("  4. Las predicciones deben validarse con datos reales")
        
        # Próximos pasos
        print("\n🚀 Próximos pasos sugeridos:")
        print("  1. Implementar modelos más avanzados (LSTM, Prophet)")
        print("  2. Validar predicciones con datos reales")
        print("  3. Crear visualizaciones interactivas")
        print("  4. Desarrollar sistema de alertas tempranas")

def main():
    """
    Función principal para ejecutar el análisis
    """
    print("🔍 ANALIZADOR DE PREDICCIONES NDVI")
    print("="*60)
    
    # Crear instancia del analizador
    analyzer = PredictionAnalyzer()
    
    try:
        # Cargar predicciones
        if not analyzer.load_predictions():
            return
        
        # Ejecutar análisis
        analyzer.analyze_prediction_trends()
        analyzer.analyze_seasonal_patterns()
        analyzer.compare_prediction_methods()
        analyzer.analyze_future_scenarios()
        analyzer.generate_summary_report()
        
        print("\n" + "="*60)
        print("✅ ANÁLISIS COMPLETADO EXITOSAMENTE")
        print("="*60)
        
    except Exception as e:
        print(f"❌ Error durante el análisis: {e}")
        raise

if __name__ == "__main__":
    main()
