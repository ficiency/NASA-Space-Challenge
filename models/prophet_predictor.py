import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

try:
    from prophet import Prophet
    PROPHET_AVAILABLE = True
except ImportError:
    PROPHET_AVAILABLE = False
    print("⚠️ Prophet no disponible. Instala con: pip install prophet")

class ProphetPredictor:
    """
    Clase para predicción usando modelos Prophet
    """
    
    def __init__(self, data_file="data/processed/processed_ndvi_data.csv"):
        """
        Inicializa el predictor Prophet
        
        Args:
            data_file (str): Archivo CSV con datos procesados
        """
        self.data_file = data_file
        self.data = None
        self.models = {}
        self.predictions = {}
        
    def load_data(self):
        """
        Carga los datos procesados
        """
        print("📊 Cargando datos para modelo Prophet...")
        
        try:
            self.data = pd.read_csv(self.data_file)
            self.data['Date'] = pd.to_datetime(self.data['Date'])
            self.data = self.data.sort_values(['Region', 'Date'])
            
            print(f"✓ Datos cargados: {len(self.data)} registros")
            print(f"✓ Período: {self.data['Date'].min()} a {self.data['Date'].max()}")
            
            return self.data
            
        except Exception as e:
            print(f"❌ Error cargando datos: {e}")
            raise
    
    def prepare_prophet_data(self, region):
        """
        Prepara datos en formato Prophet para una región específica
        
        Args:
            region (str): Nombre de la región
            
        Returns:
            pd.DataFrame: Datos en formato Prophet (ds, y)
        """
        region_data = self.data[self.data['Region'] == region].copy()
        region_data = region_data.sort_values('Date')
        
        # Crear DataFrame en formato Prophet
        prophet_data = pd.DataFrame({
            'ds': region_data['Date'],  # Prophet requiere columna 'ds' para fechas
            'y': region_data['NDVI']    # Prophet requiere columna 'y' para valores
        })
        
        # Reindexar para fechas consecutivas
        date_range = pd.date_range(start=prophet_data['ds'].min(), 
                                 end=prophet_data['ds'].max(), 
                                 freq='16D')
        
        prophet_data = prophet_data.set_index('ds').reindex(date_range)
        prophet_data = prophet_data.interpolate(method='linear')
        prophet_data = prophet_data.reset_index()
        prophet_data.columns = ['ds', 'y']
        
        return prophet_data
    
    def fit_prophet_model(self, region, seasonality_mode='additive'):
        """
        Ajusta modelo Prophet para una región
        
        Args:
            region (str): Nombre de la región
            seasonality_mode (str): Modo de estacionalidad ('additive' o 'multiplicative')
            
        Returns:
            dict: Modelo ajustado y métricas
        """
        print(f"\n📊 Ajustando modelo Prophet para {region}...")
        
        prophet_data = self.prepare_prophet_data(region)
        
        # Dividir en entrenamiento y prueba
        train_size = int(len(prophet_data) * 0.8)
        train_data = prophet_data[:train_size]
        test_data = prophet_data[train_size:]
        
        # Configurar modelo Prophet
        model = Prophet(
            seasonality_mode=seasonality_mode,
            yearly_seasonality=True,
            weekly_seasonality=False,  # Deshabilitar estacionalidad semanal
            daily_seasonality=False,   # Deshabilitar estacionalidad diaria
            changepoint_prior_scale=0.05,  # Sensibilidad a cambios de tendencia
            seasonality_prior_scale=10.0,   # Sensibilidad a estacionalidad
            holidays_prior_scale=10.0,      # Sensibilidad a días festivos
            interval_width=0.95             # Intervalo de confianza
        )
        
        # Ajustar modelo
        try:
            model.fit(train_data)
            
            # Predicciones en el conjunto de prueba
            future_test = model.make_future_dataframe(periods=len(test_data), freq='16D')
            forecast_test = model.predict(future_test)
            
            # Obtener predicciones para el período de prueba
            test_predictions = forecast_test['yhat'].tail(len(test_data))
            
            # Calcular métricas
            mae = np.mean(np.abs(test_data['y'].values - test_predictions.values))
            mse = np.mean((test_data['y'].values - test_predictions.values) ** 2)
            rmse = np.sqrt(mse)
            mape = np.mean(np.abs((test_data['y'].values - test_predictions.values) / test_data['y'].values)) * 100
            
            metrics = {
                'MAE': mae,
                'MSE': mse,
                'RMSE': rmse,
                'MAPE': mape
            }
            
            print(f"  ✓ Modo de estacionalidad: {seasonality_mode}")
            print(f"  ✓ RMSE: {rmse:.4f}")
            print(f"  ✓ MAPE: {mape:.2f}%")
            
            return {
                'model': model,
                'metrics': metrics,
                'train_data': train_data,
                'test_data': test_data,
                'predictions': test_predictions,
                'forecast': forecast_test
            }
            
        except Exception as e:
            print(f"  ❌ Error ajustando modelo: {e}")
            return None
    
    def predict_future(self, region, periods=12, seasonality_mode='additive'):
        """
        Predice valores futuros usando modelo Prophet
        
        Args:
            region (str): Nombre de la región
            periods (int): Número de períodos a predecir
            seasonality_mode (str): Modo de estacionalidad
            
        Returns:
            pd.DataFrame: Predicciones futuras
        """
        print(f"\n🔮 Prediciendo {periods} períodos futuros para {region} usando Prophet...")
        
        # Preparar datos
        prophet_data = self.prepare_prophet_data(region)
        
        # Configurar modelo Prophet
        model = Prophet(
            seasonality_mode=seasonality_mode,
            yearly_seasonality=True,
            weekly_seasonality=False,
            daily_seasonality=False,
            changepoint_prior_scale=0.05,
            seasonality_prior_scale=10.0,
            holidays_prior_scale=10.0,
            interval_width=0.95
        )
        
        # Ajustar modelo con todos los datos
        model.fit(prophet_data)
        
        # Crear DataFrame futuro
        future = model.make_future_dataframe(periods=periods, freq='16D')
        
        # Generar predicciones
        forecast = model.predict(future)
        
        # Obtener solo las predicciones futuras
        future_predictions = forecast.tail(periods)
        
        # Crear DataFrame con predicciones
        predictions_df = pd.DataFrame({
            'Date': future_predictions['ds'],
            'Predicted_NDVI': future_predictions['yhat'],
            'Lower_Bound': future_predictions['yhat_lower'],
            'Upper_Bound': future_predictions['yhat_upper'],
            'Region': region,
            'Model': 'Prophet',
            'Seasonality_Mode': seasonality_mode
        })
        
        print(f"  ✓ Predicciones generadas para {periods} períodos")
        print(f"  ✓ Intervalo de confianza: 95%")
        
        return predictions_df
    
    def predict_all_regions(self, periods=12, seasonality_mode='additive'):
        """
        Predice NDVI para todas las regiones usando Prophet
        
        Args:
            periods (int): Número de períodos a predecir
            seasonality_mode (str): Modo de estacionalidad
            
        Returns:
            dict: Predicciones para todas las regiones
        """
        print(f"\n🎯 Prediciendo NDVI para todas las regiones usando Prophet...")
        print(f"📊 Modo de estacionalidad: {seasonality_mode}")
        
        all_predictions = []
        all_metrics = {}
        
        for region in self.data['Region'].unique():
            print(f"\nProcesando región: {region}")
            
            # Ajustar modelo y obtener métricas
            model_result = self.fit_prophet_model(region, seasonality_mode)
            
            if model_result is not None:
                all_metrics[region] = model_result['metrics']
                
                # Generar predicciones futuras
                future_predictions = self.predict_future(region, periods, seasonality_mode)
                all_predictions.append(future_predictions)
        
        # Combinar todas las predicciones
        if all_predictions:
            combined_predictions = pd.concat(all_predictions, ignore_index=True)
            
            print(f"\n✅ Predicciones Prophet completadas para {len(all_predictions)} regiones")
            
            return {
                'predictions': combined_predictions,
                'metrics': all_metrics
            }
        else:
            print("❌ No se pudieron generar predicciones")
            return None
    
    def compare_seasonality_modes(self, region, periods=12):
        """
        Compara diferentes modos de estacionalidad para una región
        
        Args:
            region (str): Nombre de la región
            periods (int): Número de períodos a predecir
            
        Returns:
            dict: Comparación de modos de estacionalidad
        """
        print(f"\n⚖️ Comparando modos de estacionalidad para {region}...")
        
        modes = ['additive', 'multiplicative']
        results = {}
        
        for mode in modes:
            print(f"\nProbando modo: {mode}")
            
            # Ajustar modelo
            model_result = self.fit_prophet_model(region, mode)
            
            if model_result is not None:
                # Generar predicciones futuras
                future_predictions = self.predict_future(region, periods, mode)
                
                results[mode] = {
                    'metrics': model_result['metrics'],
                    'predictions': future_predictions
                }
        
        return results
    
    def export_predictions(self, predictions, output_file="data/predictions/ndvi_predictions_prophet.csv"):
        """
        Exporta las predicciones a un archivo CSV
        
        Args:
            predictions (pd.DataFrame): DataFrame con predicciones
            output_file (str): Nombre del archivo de salida
        """
        predictions.to_csv(output_file, index=False)
        print(f"✓ Predicciones Prophet exportadas a: {output_file}")
        
        return output_file

def main():
    """
    Función principal para ejecutar el predictor Prophet
    """
    if not PROPHET_AVAILABLE:
        print("❌ Prophet no está disponible. Instala con:")
        print("pip install prophet")
        return
    
    print("🔮 PREDICTOR PROPHET - MONTERREY")
    print("="*50)
    
    # Crear instancia del predictor
    predictor = ProphetPredictor()
    
    try:
        # Cargar datos
        predictor.load_data()
        
        # Predicciones usando Prophet (modo aditivo)
        print("\n" + "="*50)
        print("PREDICCIONES USANDO PROPHET (MODO ADITIVO)")
        print("="*50)
        
        additive_results = predictor.predict_all_regions(periods=12, seasonality_mode='additive')
        
        if additive_results is not None:
            predictor.export_predictions(additive_results['predictions'], "data/predictions/ndvi_predictions_prophet_additive.csv")
            
            # Resumen de métricas
            print("\n" + "="*50)
            print("RESUMEN DE MÉTRICAS PROPHET (ADITIVO)")
            print("="*50)
            
            for region, metrics in additive_results['metrics'].items():
                print(f"  {region}: RMSE={metrics['RMSE']:.4f}, MAPE={metrics['MAPE']:.2f}%")
        
        # Predicciones usando Prophet (modo multiplicativo)
        print("\n" + "="*50)
        print("PREDICCIONES USANDO PROPHET (MODO MULTIPLICATIVO)")
        print("="*50)
        
        multiplicative_results = predictor.predict_all_regions(periods=12, seasonality_mode='multiplicative')
        
        if multiplicative_results is not None:
            predictor.export_predictions(multiplicative_results['predictions'], "data/predictions/ndvi_predictions_prophet_multiplicative.csv")
            
            # Resumen de métricas
            print("\n" + "="*50)
            print("RESUMEN DE MÉTRICAS PROPHET (MULTIPLICATIVO)")
            print("="*50)
            
            for region, metrics in multiplicative_results['metrics'].items():
                print(f"  {region}: RMSE={metrics['RMSE']:.4f}, MAPE={metrics['MAPE']:.2f}%")
        
        # Comparación de modos para la mejor región
        print("\n" + "="*50)
        print("COMPARACIÓN DE MODOS DE ESTACIONALIDAD")
        print("="*50)
        
        # Usar la región con mejor rendimiento (Noreste)
        best_region = "Noreste"
        comparison_results = predictor.compare_seasonality_modes(best_region, periods=12)
        
        if comparison_results:
            print(f"\nComparación para {best_region}:")
            for mode, result in comparison_results.items():
                metrics = result['metrics']
                print(f"  {mode.capitalize()}: RMSE={metrics['RMSE']:.4f}, MAPE={metrics['MAPE']:.2f}%")
        
        print("\n" + "="*50)
        print("✅ PREDICCIONES PROPHET COMPLETADAS")
        print("="*50)
        print("\nArchivos generados:")
        print("- data/predictions/ndvi_predictions_prophet_additive.csv")
        print("- data/predictions/ndvi_predictions_prophet_multiplicative.csv")
        
    except Exception as e:
        print(f"❌ Error durante la predicción Prophet: {e}")
        raise

if __name__ == "__main__":
    main()
