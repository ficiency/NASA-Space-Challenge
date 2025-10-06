import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

try:
    from statsmodels.tsa.arima.model import ARIMA
    from statsmodels.tsa.seasonal import seasonal_decompose
    from statsmodels.tsa.stattools import adfuller
    from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
    ARIMA_AVAILABLE = True
except ImportError:
    ARIMA_AVAILABLE = False
    print("⚠️ statsmodels no disponible. Instala con: pip install statsmodels")

class ARIMAPredictor:
    """
    Clase para predicción usando modelos ARIMA
    """
    
    def __init__(self, data_file="data/processed/processed_ndvi_data.csv"):
        """
        Inicializa el predictor ARIMA
        
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
        print("📊 Cargando datos para modelo ARIMA...")
        
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
    
    def prepare_time_series(self, region):
        """
        Prepara serie temporal para una región específica
        
        Args:
            region (str): Nombre de la región
            
        Returns:
            pd.Series: Serie temporal con índice de fecha
        """
        region_data = self.data[self.data['Region'] == region].copy()
        region_data = region_data.sort_values('Date')
        
        # Crear serie temporal
        ts_data = region_data.set_index('Date')['NDVI']
        
        # Reindexar para fechas consecutivas
        date_range = pd.date_range(start=ts_data.index.min(), 
                                 end=ts_data.index.max(), 
                                 freq='16D')
        
        ts_data = ts_data.reindex(date_range)
        ts_data = ts_data.interpolate(method='linear')
        
        return ts_data
    
    def test_stationarity(self, ts_data):
        """
        Prueba de estacionariedad usando ADF test
        
        Args:
            ts_data (pd.Series): Serie temporal
            
        Returns:
            dict: Resultados del test
        """
        result = adfuller(ts_data.dropna())
        
        return {
            'ADF Statistic': result[0],
            'p-value': result[1],
            'Critical Values': result[4],
            'is_stationary': result[1] < 0.05
        }
    
    def make_stationary(self, ts_data):
        """
        Hace la serie temporal estacionaria
        
        Args:
            ts_data (pd.Series): Serie temporal
            
        Returns:
            tuple: (serie_estacionaria, diferencia_aplicada)
        """
        # Aplicar diferenciación hasta que sea estacionaria
        diff_count = 0
        current_ts = ts_data.copy()
        
        while diff_count < 3:  # Máximo 3 diferenciaciones
            adf_result = self.test_stationarity(current_ts)
            
            if adf_result['is_stationary']:
                break
                
            current_ts = current_ts.diff().dropna()
            diff_count += 1
        
        return current_ts, diff_count
    
    def find_best_arima_params(self, ts_data, max_p=3, max_d=2, max_q=3):
        """
        Encuentra los mejores parámetros ARIMA usando AIC
        
        Args:
            ts_data (pd.Series): Serie temporal
            max_p (int): Máximo valor de p
            max_d (int): Máximo valor de d
            max_q (int): Máximo valor de q
            
        Returns:
            tuple: (p, d, q) mejores parámetros
        """
        best_aic = float('inf')
        best_params = (0, 0, 0)
        
        print(f"🔍 Buscando mejores parámetros ARIMA...")
        
        for p in range(max_p + 1):
            for d in range(max_d + 1):
                for q in range(max_q + 1):
                    try:
                        model = ARIMA(ts_data, order=(p, d, q))
                        fitted_model = model.fit()
                        
                        if fitted_model.aic < best_aic:
                            best_aic = fitted_model.aic
                            best_params = (p, d, q)
                            
                    except:
                        continue
        
        print(f"✓ Mejores parámetros: ARIMA{best_params}, AIC={best_aic:.2f}")
        return best_params
    
    def fit_arima_model(self, region, auto_params=True):
        """
        Ajusta modelo ARIMA para una región
        
        Args:
            region (str): Nombre de la región
            auto_params (bool): Si usar parámetros automáticos
            
        Returns:
            dict: Modelo ajustado y métricas
        """
        print(f"\n📊 Ajustando modelo ARIMA para {region}...")
        
        ts_data = self.prepare_time_series(region)
        
        # Dividir en entrenamiento y prueba
        train_size = int(len(ts_data) * 0.8)
        train_data = ts_data[:train_size]
        test_data = ts_data[train_size:]
        
        # Hacer estacionaria la serie
        stationary_data, diff_count = self.make_stationary(train_data)
        
        if auto_params:
            # Encontrar mejores parámetros automáticamente
            p, d, q = self.find_best_arima_params(stationary_data)
            d += diff_count  # Ajustar d por las diferenciaciones aplicadas
        else:
            # Usar parámetros por defecto
            p, d, q = 1, 1, 1
        
        # Ajustar modelo ARIMA
        try:
            model = ARIMA(train_data, order=(p, d, q))
            fitted_model = model.fit()
            
            # Predicciones en el conjunto de prueba
            predictions = fitted_model.forecast(steps=len(test_data))
            
            # Calcular métricas
            mae = np.mean(np.abs(test_data.values - predictions))
            mse = np.mean((test_data.values - predictions) ** 2)
            rmse = np.sqrt(mse)
            mape = np.mean(np.abs((test_data.values - predictions) / test_data.values)) * 100
            
            metrics = {
                'MAE': mae,
                'MSE': mse,
                'RMSE': rmse,
                'MAPE': mape,
                'AIC': fitted_model.aic,
                'BIC': fitted_model.bic
            }
            
            print(f"  ✓ Parámetros: ARIMA({p},{d},{q})")
            print(f"  ✓ RMSE: {rmse:.4f}")
            print(f"  ✓ MAPE: {mape:.2f}%")
            print(f"  ✓ AIC: {fitted_model.aic:.2f}")
            
            return {
                'model': fitted_model,
                'metrics': metrics,
                'params': (p, d, q),
                'train_data': train_data,
                'test_data': test_data,
                'predictions': predictions
            }
            
        except Exception as e:
            print(f"  ❌ Error ajustando modelo: {e}")
            return None
    
    def predict_future(self, region, periods=12):
        """
        Predice valores futuros usando modelo ARIMA
        
        Args:
            region (str): Nombre de la región
            periods (int): Número de períodos a predecir
            
        Returns:
            pd.DataFrame: Predicciones futuras
        """
        print(f"\n🔮 Prediciendo {periods} períodos futuros para {region}...")
        
        # Ajustar modelo con todos los datos disponibles
        ts_data = self.prepare_time_series(region)
        
        # Hacer estacionaria
        stationary_data, diff_count = self.make_stationary(ts_data)
        
        # Encontrar mejores parámetros
        p, d, q = self.find_best_arima_params(stationary_data)
        d += diff_count
        
        # Ajustar modelo final
        model = ARIMA(ts_data, order=(p, d, q))
        fitted_model = model.fit()
        
        # Predicciones futuras
        future_predictions = fitted_model.forecast(steps=periods)
        
        # Crear fechas futuras
        last_date = ts_data.index[-1]
        future_dates = pd.date_range(start=last_date + timedelta(days=16), 
                                   periods=periods, 
                                   freq='16D')
        
        # Crear DataFrame con predicciones
        predictions_df = pd.DataFrame({
            'Date': future_dates,
            'Predicted_NDVI': future_predictions,
            'Region': region,
            'Model': 'ARIMA',
            'Params': f"ARIMA({p},{d},{q})"
        })
        
        print(f"  ✓ Predicciones generadas para {periods} períodos")
        
        return predictions_df
    
    def predict_all_regions(self, periods=12):
        """
        Predice NDVI para todas las regiones usando ARIMA
        
        Args:
            periods (int): Número de períodos a predecir
            
        Returns:
            pd.DataFrame: Predicciones para todas las regiones
        """
        print(f"\n🎯 Prediciendo NDVI para todas las regiones usando ARIMA...")
        
        all_predictions = []
        all_metrics = {}
        
        for region in self.data['Region'].unique():
            print(f"\nProcesando región: {region}")
            
            # Ajustar modelo y obtener métricas
            model_result = self.fit_arima_model(region)
            
            if model_result is not None:
                all_metrics[region] = model_result['metrics']
                
                # Generar predicciones futuras
                future_predictions = self.predict_future(region, periods)
                all_predictions.append(future_predictions)
        
        # Combinar todas las predicciones
        if all_predictions:
            combined_predictions = pd.concat(all_predictions, ignore_index=True)
            
            print(f"\n✅ Predicciones ARIMA completadas para {len(all_predictions)} regiones")
            
            return {
                'predictions': combined_predictions,
                'metrics': all_metrics
            }
        else:
            print("❌ No se pudieron generar predicciones")
            return None
    
    def export_predictions(self, predictions, output_file="data/predictions/ndvi_predictions_arima.csv"):
        """
        Exporta las predicciones a un archivo CSV
        
        Args:
            predictions (pd.DataFrame): DataFrame con predicciones
            output_file (str): Nombre del archivo de salida
        """
        predictions.to_csv(output_file, index=False)
        print(f"✓ Predicciones ARIMA exportadas a: {output_file}")
        
        return output_file

def main():
    """
    Función principal para ejecutar el predictor ARIMA
    """
    if not ARIMA_AVAILABLE:
        print("❌ statsmodels no está disponible. Instala con:")
        print("pip install statsmodels")
        return
    
    print("🔮 PREDICTOR ARIMA - MONTERREY")
    print("="*50)
    
    # Crear instancia del predictor
    predictor = ARIMAPredictor()
    
    try:
        # Cargar datos
        predictor.load_data()
        
        # Predicciones usando ARIMA
        print("\n" + "="*50)
        print("PREDICCIONES USANDO MODELO ARIMA")
        print("="*50)
        
        arima_results = predictor.predict_all_regions(periods=12)
        
        if arima_results is not None:
            predictor.export_predictions(arima_results['predictions'])
            
            # Resumen de métricas
            print("\n" + "="*50)
            print("RESUMEN DE MÉTRICAS ARIMA")
            print("="*50)
            
            for region, metrics in arima_results['metrics'].items():
                print(f"  {region}: RMSE={metrics['RMSE']:.4f}, MAPE={metrics['MAPE']:.2f}%, AIC={metrics['AIC']:.2f}")
        
        print("\n" + "="*50)
        print("✅ PREDICCIONES ARIMA COMPLETADAS")
        print("="*50)
        
    except Exception as e:
        print(f"❌ Error durante la predicción ARIMA: {e}")
        raise

if __name__ == "__main__":
    main()
