import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

class NDVIPredictor:
    """
    Clase para análisis temporal y predicción de datos NDVI
    """
    
    def __init__(self, data_file="data/processed/processed_ndvi_data.csv"):
        """
        Inicializa el predictor con los datos procesados
        
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
        print("📊 Cargando datos procesados...")
        
        try:
            self.data = pd.read_csv(self.data_file)
            self.data['Date'] = pd.to_datetime(self.data['Date'])
            self.data = self.data.sort_values(['Region', 'Date'])
            
            print(f"✓ Datos cargados: {len(self.data)} registros")
            print(f"✓ Período: {self.data['Date'].min()} a {self.data['Date'].max()}")
            print(f"✓ Regiones: {sorted(self.data['Region'].unique())}")
            
            return self.data
            
        except Exception as e:
            print(f"❌ Error cargando datos: {e}")
            raise
    
    def analyze_temporal_patterns(self):
        """
        Analiza patrones temporales en los datos
        """
        print("\n🔍 Analizando patrones temporales...")
        
        if self.data is None:
            raise ValueError("Primero debe cargar los datos")
        
        # Análisis de tendencias por región
        print("\n📈 Tendencias temporales por región:")
        trends = {}
        
        for region in self.data['Region'].unique():
            region_data = self.data[self.data['Region'] == region].copy()
            region_data = region_data.sort_values('Date')
            
            # Calcular tendencia usando correlación con tiempo
            time_numeric = pd.to_numeric(region_data['Date'])
            trend = region_data['NDVI'].corr(time_numeric)
            trends[region] = trend
            
            print(f"  {region}: Tendencia = {trend:.4f}")
        
        # Análisis estacional
        print("\n🌿 Análisis estacional:")
        seasonal_analysis = self.data.groupby(['Region', 'Season'])['NDVI'].agg(['mean', 'std']).round(4)
        print(seasonal_analysis)
        
        # Análisis mensual
        print("\n📅 Análisis mensual:")
        monthly_analysis = self.data.groupby(['Region', 'Month'])['NDVI'].mean().unstack().round(4)
        print(monthly_analysis)
        
        # Identificar estacionalidad
        print("\n🔄 Patrones estacionales identificados:")
        for region in self.data['Region'].unique():
            region_data = self.data[self.data['Region'] == region]
            monthly_avg = region_data.groupby('Month')['NDVI'].mean()
            
            # Encontrar meses con mayor y menor NDVI
            max_month = monthly_avg.idxmax()
            min_month = monthly_avg.idxmin()
            
            print(f"  {region}: Máximo en mes {max_month} ({monthly_avg[max_month]:.4f}), "
                  f"Mínimo en mes {min_month} ({monthly_avg[min_month]:.4f})")
        
        return trends, seasonal_analysis, monthly_analysis
    
    def prepare_time_series_data(self, region, target_column='NDVI'):
        """
        Prepara datos de serie temporal para una región específica
        
        Args:
            region (str): Nombre de la región
            target_column (str): Columna objetivo para predicción
            
        Returns:
            pd.Series: Serie temporal con índice de fecha
        """
        region_data = self.data[self.data['Region'] == region].copy()
        region_data = region_data.sort_values('Date')
        
        # Crear serie temporal con índice de fecha
        ts_data = region_data.set_index('Date')[target_column]
        
        # Reindexar para tener fechas consecutivas (llenar gaps con interpolación)
        date_range = pd.date_range(start=ts_data.index.min(), 
                                 end=ts_data.index.max(), 
                                 freq='16D')  # Cada 16 días
        
        ts_data = ts_data.reindex(date_range)
        ts_data = ts_data.interpolate(method='linear')
        
        return ts_data
    
    def calculate_forecast_metrics(self, actual, predicted):
        """
        Calcula métricas de evaluación del modelo
        
        Args:
            actual (array): Valores reales
            predicted (array): Valores predichos
            
        Returns:
            dict: Diccionario con métricas
        """
        mae = np.mean(np.abs(actual - predicted))
        mse = np.mean((actual - predicted) ** 2)
        rmse = np.sqrt(mse)
        mape = np.mean(np.abs((actual - predicted) / actual)) * 100
        
        return {
            'MAE': mae,
            'MSE': mse,
            'RMSE': rmse,
            'MAPE': mape
        }
    
    def simple_linear_trend_prediction(self, region, periods=12):
        """
        Predicción simple usando tendencia lineal
        
        Args:
            region (str): Nombre de la región
            periods (int): Número de períodos a predecir
            
        Returns:
            dict: Predicciones y métricas
        """
        print(f"\n📊 Predicción lineal para {region}...")
        
        ts_data = self.prepare_time_series_data(region)
        
        # Dividir en entrenamiento y prueba
        train_size = int(len(ts_data) * 0.8)
        train_data = ts_data[:train_size]
        test_data = ts_data[train_size:]
        
        # Ajustar modelo lineal
        x = np.arange(len(train_data))
        y = train_data.values
        
        # Regresión lineal simple
        coeffs = np.polyfit(x, y, 1)
        trend_line = np.poly1d(coeffs)
        
        # Predicciones
        train_predictions = trend_line(x)
        
        # Predicciones futuras
        future_x = np.arange(len(train_data), len(train_data) + periods)
        future_predictions = trend_line(future_x)
        
        # Calcular métricas
        metrics = self.calculate_forecast_metrics(train_data.values, train_predictions)
        
        # Crear fechas futuras
        last_date = ts_data.index[-1]
        future_dates = pd.date_range(start=last_date + timedelta(days=16), 
                                   periods=periods, 
                                   freq='16D')
        
        predictions_df = pd.DataFrame({
            'Date': future_dates,
            'Predicted_NDVI': future_predictions,
            'Region': region
        })
        
        return {
            'predictions': predictions_df,
            'metrics': metrics,
            'trend_coeffs': coeffs
        }
    
    def seasonal_naive_prediction(self, region, periods=12):
        """
        Predicción usando método naive estacional
        
        Args:
            region (str): Nombre de la región
            periods (int): Número de períodos a predecir
            
        Returns:
            dict: Predicciones y métricas
        """
        print(f"\n🔄 Predicción estacional naive para {region}...")
        
        ts_data = self.prepare_time_series_data(region)
        
        # Dividir en entrenamiento y prueba
        train_size = int(len(ts_data) * 0.8)
        train_data = ts_data[:train_size]
        test_data = ts_data[train_size:]
        
        # Calcular patrón estacional (promedio por mes)
        train_df = pd.DataFrame({'Date': train_data.index, 'NDVI': train_data.values})
        train_df['Month'] = train_df['Date'].dt.month
        
        seasonal_pattern = train_df.groupby('Month')['NDVI'].mean()
        
        # Predicciones usando patrón estacional
        train_predictions = []
        for date in train_data.index:
            month = date.month
            train_predictions.append(seasonal_pattern[month])
        
        # Predicciones futuras
        last_date = ts_data.index[-1]
        future_dates = pd.date_range(start=last_date + timedelta(days=16), 
                                   periods=periods, 
                                   freq='16D')
        
        future_predictions = []
        for date in future_dates:
            month = date.month
            future_predictions.append(seasonal_pattern[month])
        
        # Calcular métricas
        metrics = self.calculate_forecast_metrics(train_data.values, train_predictions)
        
        predictions_df = pd.DataFrame({
            'Date': future_dates,
            'Predicted_NDVI': future_predictions,
            'Region': region
        })
        
        return {
            'predictions': predictions_df,
            'metrics': metrics,
            'seasonal_pattern': seasonal_pattern
        }
    
    def predict_all_regions(self, method='linear', periods=12):
        """
        Predice NDVI para todas las regiones
        
        Args:
            method (str): Método de predicción ('linear' o 'seasonal')
            periods (int): Número de períodos a predecir
            
        Returns:
            dict: Predicciones para todas las regiones
        """
        print(f"\n🎯 Prediciendo NDVI para todas las regiones usando método {method}...")
        
        all_predictions = []
        all_metrics = {}
        
        for region in self.data['Region'].unique():
            print(f"\nProcesando región: {region}")
            
            if method == 'linear':
                result = self.simple_linear_trend_prediction(region, periods)
            elif method == 'seasonal':
                result = self.seasonal_naive_prediction(region, periods)
            else:
                raise ValueError(f"Método {method} no soportado")
            
            all_predictions.append(result['predictions'])
            all_metrics[region] = result['metrics']
            
            print(f"  ✓ RMSE: {result['metrics']['RMSE']:.4f}")
            print(f"  ✓ MAPE: {result['metrics']['MAPE']:.2f}%")
        
        # Combinar todas las predicciones
        combined_predictions = pd.concat(all_predictions, ignore_index=True)
        
        return {
            'predictions': combined_predictions,
            'metrics': all_metrics
        }
    
    def export_predictions(self, predictions, output_file="data/predictions/ndvi_predictions.csv"):
        """
        Exporta las predicciones a un archivo CSV
        
        Args:
            predictions (pd.DataFrame): DataFrame con predicciones
            output_file (str): Nombre del archivo de salida
        """
        predictions.to_csv(output_file, index=False)
        print(f"✓ Predicciones exportadas a: {output_file}")
        
        return output_file

def main():
    """
    Función principal para ejecutar el predictor
    """
    print("🔮 PREDICTOR DE NDVI - MONTERREY")
    print("="*50)
    
    # Crear instancia del predictor
    predictor = NDVIPredictor()
    
    try:
        # Cargar datos
        predictor.load_data()
        
        # Analizar patrones temporales
        trends, seasonal, monthly = predictor.analyze_temporal_patterns()
        
        # Predicciones usando método lineal
        print("\n" + "="*50)
        print("PREDICCIONES USANDO MÉTODO LINEAL")
        print("="*50)
        
        linear_results = predictor.predict_all_regions(method='linear', periods=12)
        predictor.export_predictions(linear_results['predictions'], "data/predictions/ndvi_predictions_linear.csv")
        
        # Predicciones usando método estacional
        print("\n" + "="*50)
        print("PREDICCIONES USANDO MÉTODO ESTACIONAL")
        print("="*50)
        
        seasonal_results = predictor.predict_all_regions(method='seasonal', periods=12)
        predictor.export_predictions(seasonal_results['predictions'], "data/predictions/ndvi_predictions_seasonal.csv")
        
        # Resumen de métricas
        print("\n" + "="*50)
        print("RESUMEN DE MÉTRICAS DE PREDICCIÓN")
        print("="*50)
        
        print("\nMétodo Lineal:")
        for region, metrics in linear_results['metrics'].items():
            print(f"  {region}: RMSE={metrics['RMSE']:.4f}, MAPE={metrics['MAPE']:.2f}%")
        
        print("\nMétodo Estacional:")
        for region, metrics in seasonal_results['metrics'].items():
            print(f"  {region}: RMSE={metrics['RMSE']:.4f}, MAPE={metrics['MAPE']:.2f}%")
        
        print("\n" + "="*50)
        print("✅ PREDICCIONES COMPLETADAS EXITOSAMENTE")
        print("="*50)
        print("\nArchivos generados:")
        print("- data/predictions/ndvi_predictions_linear.csv")
        print("- data/predictions/ndvi_predictions_seasonal.csv")
        
    except Exception as e:
        print(f"❌ Error durante la predicción: {e}")
        raise

if __name__ == "__main__":
    main()
