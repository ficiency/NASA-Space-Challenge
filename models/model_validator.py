import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

class ModelValidator:
    """
    Clase para validar modelos de predicción con datos históricos
    """
    
    def __init__(self):
        """
        Inicializa el validador de modelos
        """
        self.historical_data = None
        self.predictions = {}
        self.validation_results = {}
        
    def load_data(self):
        """
        Carga datos históricos y predicciones
        """
        print("📊 Cargando datos para validación...")
        
        try:
            # Cargar datos históricos
            self.historical_data = pd.read_csv("data/processed/processed_ndvi_data.csv")
            self.historical_data['Date'] = pd.to_datetime(self.historical_data['Date'])
            
            # Cargar predicciones de diferentes modelos
            self.predictions = {
                'linear': pd.read_csv("data/predictions/ndvi_predictions_linear.csv"),
                'seasonal': pd.read_csv("data/predictions/ndvi_predictions_seasonal.csv"),
                'prophet_additive': pd.read_csv("data/predictions/ndvi_predictions_prophet_additive.csv"),
                'prophet_multiplicative': pd.read_csv("data/predictions/ndvi_predictions_prophet_multiplicative.csv")
            }
            
            # Convertir fechas en predicciones
            for model_name, pred_data in self.predictions.items():
                pred_data['Date'] = pd.to_datetime(pred_data['Date'])
            
            print(f"✓ Datos históricos: {len(self.historical_data)} registros")
            for model_name, pred_data in self.predictions.items():
                print(f"✓ Predicciones {model_name}: {len(pred_data)} registros")
            
            return True
            
        except Exception as e:
            print(f"❌ Error cargando datos: {e}")
            return False
    
    def create_historical_validation_set(self, region, validation_periods=12):
        """
        Crea un conjunto de validación usando datos históricos
        
        Args:
            region (str): Nombre de la región
            validation_periods (int): Número de períodos para validación
            
        Returns:
            tuple: (datos_entrenamiento, datos_validacion)
        """
        region_data = self.historical_data[self.historical_data['Region'] == region].copy()
        region_data = region_data.sort_values('Date')
        
        # Tomar los últimos períodos como conjunto de validación
        validation_data = region_data.tail(validation_periods)
        training_data = region_data[:-validation_periods]
        
        return training_data, validation_data
    
    def validate_model_performance(self, region, model_name, validation_periods=12):
        """
        Valida el rendimiento de un modelo específico para una región
        
        Args:
            region (str): Nombre de la región
            model_name (str): Nombre del modelo
            validation_periods (int): Número de períodos para validación
            
        Returns:
            dict: Métricas de validación
        """
        print(f"\n🔍 Validando {model_name} para {region}...")
        
        # Obtener datos de validación históricos
        training_data, validation_data = self.create_historical_validation_set(region, validation_periods)
        
        # Obtener predicciones del modelo
        model_predictions = self.predictions[model_name]
        region_predictions = model_predictions[model_predictions['Region'] == region]
        
        # Alinear fechas de validación con predicciones
        validation_dates = validation_data['Date'].values
        prediction_dates = region_predictions['Date'].values
        
        # Encontrar predicciones que coincidan con fechas de validación
        aligned_predictions = []
        aligned_actual = []
        
        for val_date in validation_dates:
            # Buscar predicción más cercana en fecha
            time_diffs = np.abs((prediction_dates - val_date).astype('timedelta64[D]'))
            closest_idx = np.argmin(time_diffs)
            
            if time_diffs[closest_idx] <= timedelta(days=8):  # Tolerancia de ±8 días
                aligned_predictions.append(region_predictions.iloc[closest_idx]['Predicted_NDVI'])
                aligned_actual.append(validation_data[validation_data['Date'] == val_date]['NDVI'].iloc[0])
        
        if len(aligned_predictions) == 0:
            print(f"  ⚠️ No se encontraron predicciones alineadas para {region}")
            return None
        
        # Calcular métricas
        actual = np.array(aligned_actual)
        predicted = np.array(aligned_predictions)
        
        mae = np.mean(np.abs(actual - predicted))
        mse = np.mean((actual - predicted) ** 2)
        rmse = np.sqrt(mse)
        mape = np.mean(np.abs((actual - predicted) / actual)) * 100
        
        # Métricas adicionales
        r2 = 1 - (np.sum((actual - predicted) ** 2) / np.sum((actual - np.mean(actual)) ** 2))
        
        # Dirección de la predicción (tendencia)
        actual_trend = np.mean(np.diff(actual))
        predicted_trend = np.mean(np.diff(predicted))
        trend_direction_correct = np.sign(actual_trend) == np.sign(predicted_trend)
        
        metrics = {
            'MAE': mae,
            'MSE': mse,
            'RMSE': rmse,
            'MAPE': mape,
            'R2': r2,
            'Trend_Direction_Correct': trend_direction_correct,
            'Actual_Trend': actual_trend,
            'Predicted_Trend': predicted_trend,
            'Samples_Used': len(aligned_predictions)
        }
        
        print(f"  ✓ RMSE: {rmse:.4f}")
        print(f"  ✓ MAPE: {mape:.2f}%")
        print(f"  ✓ R²: {r2:.4f}")
        print(f"  ✓ Tendencia correcta: {trend_direction_correct}")
        print(f"  ✓ Muestras usadas: {len(aligned_predictions)}")
        
        return metrics
    
    def validate_all_models(self, validation_periods=12):
        """
        Valida todos los modelos para todas las regiones
        
        Args:
            validation_periods (int): Número de períodos para validación
        """
        print(f"\n🎯 VALIDANDO TODOS LOS MODELOS")
        print("="*60)
        print(f"Períodos de validación: {validation_periods}")
        
        regions = self.historical_data['Region'].unique()
        models = list(self.predictions.keys())
        
        validation_results = {}
        
        for region in regions:
            print(f"\n📍 Región: {region}")
            validation_results[region] = {}
            
            for model_name in models:
                metrics = self.validate_model_performance(region, model_name, validation_periods)
                if metrics is not None:
                    validation_results[region][model_name] = metrics
        
        self.validation_results = validation_results
        return validation_results
    
    def generate_validation_report(self):
        """
        Genera un reporte de validación completo
        """
        print(f"\n📋 REPORTE DE VALIDACIÓN DE MODELOS")
        print("="*60)
        
        if not self.validation_results:
            print("❌ No hay resultados de validación disponibles")
            return
        
        # Resumen por modelo
        print("\n📊 RESUMEN POR MODELO:")
        model_summary = {}
        
        for region, models in self.validation_results.items():
            for model_name, metrics in models.items():
                if model_name not in model_summary:
                    model_summary[model_name] = {
                        'RMSE': [],
                        'MAPE': [],
                        'R2': [],
                        'Trend_Correct': [],
                        'Samples': []
                    }
                
                model_summary[model_name]['RMSE'].append(metrics['RMSE'])
                model_summary[model_name]['MAPE'].append(metrics['MAPE'])
                model_summary[model_name]['R2'].append(metrics['R2'])
                model_summary[model_name]['Trend_Correct'].append(metrics['Trend_Direction_Correct'])
                model_summary[model_name]['Samples'].append(metrics['Samples_Used'])
        
        # Calcular promedios por modelo
        for model_name, stats in model_summary.items():
            avg_rmse = np.mean(stats['RMSE'])
            avg_mape = np.mean(stats['MAPE'])
            avg_r2 = np.mean(stats['R2'])
            trend_accuracy = np.mean(stats['Trend_Correct']) * 100
            total_samples = np.sum(stats['Samples'])
            
            print(f"\n  🔮 {model_name.upper()}:")
            print(f"    RMSE promedio: {avg_rmse:.4f}")
            print(f"    MAPE promedio: {avg_mape:.2f}%")
            print(f"    R² promedio: {avg_r2:.4f}")
            print(f"    Precisión de tendencia: {trend_accuracy:.1f}%")
            print(f"    Total muestras: {total_samples}")
        
        # Ranking de modelos
        print(f"\n🏆 RANKING DE MODELOS POR PRECISIÓN:")
        model_rankings = []
        
        for model_name, stats in model_summary.items():
            avg_rmse = np.mean(stats['RMSE'])
            avg_mape = np.mean(stats['MAPE'])
            avg_r2 = np.mean(stats['R2'])
            
            # Score compuesto (menor es mejor)
            composite_score = (avg_rmse * 0.4) + (avg_mape * 0.3) + ((1 - avg_r2) * 0.3)
            
            model_rankings.append({
                'model': model_name,
                'composite_score': composite_score,
                'rmse': avg_rmse,
                'mape': avg_mape,
                'r2': avg_r2
            })
        
        # Ordenar por score compuesto
        model_rankings.sort(key=lambda x: x['composite_score'])
        
        for i, ranking in enumerate(model_rankings, 1):
            print(f"  {i}. {ranking['model'].upper()}: Score={ranking['composite_score']:.4f}")
        
        # Análisis por región
        print(f"\n📍 ANÁLISIS POR REGIÓN:")
        for region, models in self.validation_results.items():
            print(f"\n  {region}:")
            
            # Encontrar mejor modelo para esta región
            best_model = None
            best_rmse = float('inf')
            
            for model_name, metrics in models.items():
                if metrics['RMSE'] < best_rmse:
                    best_rmse = metrics['RMSE']
                    best_model = model_name
            
            print(f"    Mejor modelo: {best_model.upper()} (RMSE={best_rmse:.4f})")
            
            # Mostrar métricas de todos los modelos
            for model_name, metrics in models.items():
                print(f"    {model_name}: RMSE={metrics['RMSE']:.4f}, MAPE={metrics['MAPE']:.2f}%, R²={metrics['R2']:.4f}")
    
    def identify_model_strengths_weaknesses(self):
        """
        Identifica fortalezas y debilidades de cada modelo
        """
        print(f"\n💡 ANÁLISIS DE FORTALEZAS Y DEBILIDADES")
        print("="*60)
        
        if not self.validation_results:
            return
        
        # Analizar patrones en los resultados
        model_performance = {}
        
        for region, models in self.validation_results.items():
            for model_name, metrics in models.items():
                if model_name not in model_performance:
                    model_performance[model_name] = {
                        'rmse_values': [],
                        'mape_values': [],
                        'r2_values': [],
                        'trend_accuracy': []
                    }
                
                model_performance[model_name]['rmse_values'].append(metrics['RMSE'])
                model_performance[model_name]['mape_values'].append(metrics['MAPE'])
                model_performance[model_name]['r2_values'].append(metrics['R2'])
                model_performance[model_name]['trend_accuracy'].append(metrics['Trend_Direction_Correct'])
        
        # Análisis de cada modelo
        for model_name, stats in model_performance.items():
            print(f"\n🔮 {model_name.upper()}:")
            
            rmse_std = np.std(stats['rmse_values'])
            mape_std = np.std(stats['mape_values'])
            r2_std = np.std(stats['r2_values'])
            trend_accuracy = np.mean(stats['trend_accuracy']) * 100
            
            print(f"  📈 Consistencia RMSE: {rmse_std:.4f} (menor es mejor)")
            print(f"  📈 Consistencia MAPE: {mape_std:.4f} (menor es mejor)")
            print(f"  📈 Consistencia R²: {r2_std:.4f} (menor es mejor)")
            print(f"  📈 Precisión de tendencia: {trend_accuracy:.1f}%")
            
            # Identificar fortalezas y debilidades
            avg_rmse = np.mean(stats['rmse_values'])
            avg_mape = np.mean(stats['mape_values'])
            avg_r2 = np.mean(stats['r2_values'])
            
            print(f"  💪 Fortalezas:")
            if avg_rmse < 0.01:
                print(f"    - Excelente precisión (RMSE={avg_rmse:.4f})")
            if avg_mape < 5:
                print(f"    - Bajo error porcentual (MAPE={avg_mape:.2f}%)")
            if avg_r2 > 0.8:
                print(f"    - Excelente ajuste (R²={avg_r2:.4f})")
            if trend_accuracy > 80:
                print(f"    - Buena predicción de tendencias ({trend_accuracy:.1f}%)")
            
            print(f"  ⚠️ Debilidades:")
            if avg_rmse > 0.05:
                print(f"    - Error alto (RMSE={avg_rmse:.4f})")
            if avg_mape > 10:
                print(f"    - Error porcentual alto (MAPE={avg_mape:.2f}%)")
            if avg_r2 < 0.5:
                print(f"    - Ajuste pobre (R²={avg_r2:.4f})")
            if trend_accuracy < 60:
                print(f"    - Predicción de tendencias pobre ({trend_accuracy:.1f}%)")
    
    def export_validation_results(self, output_file="data/predictions/model_validation_results.csv"):
        """
        Exporta los resultados de validación a un archivo CSV
        """
        if not self.validation_results:
            print("❌ No hay resultados de validación para exportar")
            return
        
        # Crear DataFrame con resultados
        results_data = []
        
        for region, models in self.validation_results.items():
            for model_name, metrics in models.items():
                results_data.append({
                    'Region': region,
                    'Model': model_name,
                    'RMSE': metrics['RMSE'],
                    'MAPE': metrics['MAPE'],
                    'R2': metrics['R2'],
                    'Trend_Direction_Correct': metrics['Trend_Direction_Correct'],
                    'Actual_Trend': metrics['Actual_Trend'],
                    'Predicted_Trend': metrics['Predicted_Trend'],
                    'Samples_Used': metrics['Samples_Used']
                })
        
        results_df = pd.DataFrame(results_data)
        results_df.to_csv(output_file, index=False)
        
        print(f"✓ Resultados de validación exportados a: {output_file}")
        return output_file

def main():
    """
    Función principal para ejecutar la validación
    """
    print("🔍 VALIDADOR DE MODELOS - MONTERREY")
    print("="*60)
    
    # Crear instancia del validador
    validator = ModelValidator()
    
    try:
        # Cargar datos
        if not validator.load_data():
            return
        
        # Validar todos los modelos
        validation_results = validator.validate_all_models(validation_periods=12)
        
        # Generar reporte de validación
        validator.generate_validation_report()
        
        # Análisis de fortalezas y debilidades
        validator.identify_model_strengths_weaknesses()
        
        # Exportar resultados
        validator.export_validation_results()
        
        print("\n" + "="*60)
        print("✅ VALIDACIÓN COMPLETADA EXITOSAMENTE")
        print("="*60)
        print("\nRecomendaciones:")
        print("1. Usar el modelo con mejor score compuesto para predicciones")
        print("2. Considerar el contexto específico de cada región")
        print("3. Monitorear el rendimiento en tiempo real")
        print("4. Actualizar modelos periódicamente con nuevos datos")
        
    except Exception as e:
        print(f"❌ Error durante la validación: {e}")
        raise

if __name__ == "__main__":
    main()
