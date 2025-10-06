# BloomWatch: An Earth Observation Application for Global Flowering Phenology

![BloomWatch Demo](assets/demo.gif)

## 🌸 About the Project

BloomWatch is a comprehensive web application developed for the **NASA Space Challenge 2025** that monitors flowering phenology in Monterrey, Mexico, using satellite data to help people with allergies, health organizations, and families with allergic children better manage respiratory health.

### 🎯 The Challenge

This project was developed for the [BloomWatch: An Earth Observation Application for Global Flowering Phenology](https://www.spaceappschallenge.org/2025/challenges/bloomwatch-an-earth-observation-application-for-global-flowering-phenology/) challenge, which aims to create tools that help communities understand and predict flowering patterns to improve health outcomes.

### 💡 Our Motivation

Both team members suffer from allergies, as do many of our loved ones. This personal connection to the problem drove us to develop a web application that we ourselves would use and benefit from. We understand the daily struggles of allergy sufferers and the importance of being able to anticipate and prepare for high pollen periods.

## 🚀 What We Built

BloomWatch combines satellite data analysis with an intuitive web interface to:

- **Monitor blooming patterns** across 9 regions of Monterrey using NDVI and MCD12Q2 satellite data
- **Predict allergen levels** based on flowering phenology and vegetation health
- **Provide health alerts** for allergy-prone individuals and families
- **Visualize data** through interactive maps and real-time dashboards
- **Track seasonal patterns** to help users plan ahead

## 🛠️ Technology Stack

### Backend & Data Processing
- **Python 3.x** - Core data processing and analysis
- **Pandas & NumPy** - Data manipulation and analysis
- **Scikit-learn** - Machine learning models
- **Statsmodels** - Statistical analysis and ARIMA modeling
- **Prophet** - Time series forecasting
- **TensorFlow** - Deep learning capabilities
- **Matplotlib & Seaborn** - Data visualization

### Frontend
- **React 19** - Modern web application framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Leaflet & React-Leaflet** - Interactive mapping
- **Recharts** - Data visualization components
- **Vite** - Fast development and building

### Data Sources
- **NASA Earthdata** - Primary satellite data source
- **AppEEARS API** - Data extraction and processing
- **MCD12Q2** - Phenology data (2005-2024)
- **MOD13Q1** - NDVI vegetation data (2005-2024)

## 📁 Project Structure

```
NASA-Space-Challenge/
├── app/
│   └── frontend/                 # React web application
│       ├── src/
│       │   ├── components/       # React components
│       │   │   ├── Dashboard.tsx
│       │   │   ├── BloomMap.tsx
│       │   │   ├── BloomingFlowers.tsx
│       │   │   ├── HealthAlerts.tsx
│       │   │   ├── SeasonalInsights.tsx
│       │   │   └── Sidebar.tsx
│       │   ├── App.tsx
│       │   └── main.tsx
│       └── package.json
├── extractors/                   # Data extraction from NASA APIs
│   ├── data_extraction_ndvi.py   # NDVI data extraction
│   ├── data_extraction_mcd12q2.py # Phenology data extraction
│   ├── nasa_token.py            # NASA authentication
│   └── datasets/                # Raw satellite data
│       ├── MCD12Q2/            # Phenology datasets by region
│       └── NDVI/               # Vegetation index datasets
├── models/                      # Machine learning and analysis
│   ├── data_loader.py          # Data processing pipeline
│   ├── ndvi_predictor.py       # Basic prediction models
│   ├── arima_predictor.py      # ARIMA time series modeling
│   ├── prophet_predictor.py    # Prophet forecasting
│   ├── model_validator.py      # Model validation and metrics
│   ├── prediction_analyzer.py  # Prediction analysis tools
│   ├── data/
│   │   ├── raw/               # Original satellite data
│   │   ├── processed/         # Cleaned and combined data
│   │   └── predictions/       # Generated predictions
│   └── requirements.txt
└── README.md
```

## 🔬 Methods & Data Analysis

### Satellite Data Processing
- **NDVI Analysis**: Normalized Difference Vegetation Index to measure vegetation health
- **Phenology Tracking**: MCD12Q2 data for flowering season detection
- **Multi-region Coverage**: 9 strategic points across Monterrey
- **Temporal Coverage**: 20 years of historical data (2005-2024)

### Machine Learning Models
1. **Linear Regression**: Baseline predictions with seasonal adjustments
2. **ARIMA Models**: Advanced time series forecasting with auto-regression
3. **Prophet**: Facebook's forecasting tool for seasonal patterns
4. **Ensemble Methods**: Combining multiple models for improved accuracy

### Key Findings
- **9 regions analyzed** with 4,149 total data points
- **Peak bloom periods**: Generally October (month 10)
- **Lowest vegetation**: February-March (months 2-3)
- **Regional variations**: Sureste region shows highest NDVI (0.7469), Centro lowest (0.0852)
- **Model performance**: Linear models achieve 2-3% MAPE error rates

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+
- NASA Earthdata account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/NASA-Space-Challenge.git
   cd NASA-Space-Challenge
   ```

2. **Set up NASA API access**
   ```bash
   cd extractors
   # Follow instructions in extractors/README.md to configure NASA tokens
   ```

3. **Install Python dependencies**
   ```bash
   cd models
   pip install -r requirements.txt
   ```

4. **Install frontend dependencies**
   ```bash
   cd app/frontend
   npm install
   ```

### Running the Application

1. **Extract satellite data** (first time only)
   ```bash
   cd extractors
   python data_extraction_ndvi.py
   python data_extraction_mcd12q2.py
   ```

2. **Process and analyze data**
   ```bash
   cd models
   python run_data_loader.py
   python ndvi_predictor.py
   python arima_predictor.py
   python prophet_predictor.py
   ```

3. **Start the web application**
   ```bash
   cd app/frontend
   npm run dev
   ```

4. **Open your browser** to `http://localhost:5173`

## 🎯 Features

### Interactive Dashboard
- Real-time bloom monitoring across Monterrey
- Health alerts and pollen level indicators
- Seasonal insights and historical patterns
- Temperature and humidity tracking

### Geographic Visualization
- Interactive map with 9 Monterrey regions
- Color-coded bloom intensity levels
- Species-specific information per region
- Weather data integration

### Health Alerts System
- Pollen level warnings
- Allergy risk assessments
- Preventive recommendations
- Historical pattern analysis

### Data Analytics
- 20-year historical analysis
- Predictive modeling for future blooms
- Regional comparison tools
- Seasonal trend identification

## 📊 Results & Impact

### Data Coverage
- **4,149 data points** across 9 regions
- **20 years** of satellite observations
- **Zero missing values** in processed dataset
- **Real-time updates** every 16 days

### Model Performance
- **Linear models**: 2-3% MAPE error rate
- **ARIMA models**: Captures seasonal patterns effectively
- **Prophet models**: Handles holiday effects and trends
- **Ensemble approach**: Improved accuracy through model combination

### Health Impact
- **Early warning system** for allergy sufferers
- **Regional specificity** for targeted health advice
- **Seasonal planning** for outdoor activities
- **Educational tool** for understanding local ecology

## 🔮 Future Enhancements

- **Real-time API integration** with weather services
- **Mobile application** for on-the-go access
- **Machine learning improvements** with more sophisticated models
- **Expansion to other cities** beyond Monterrey
- **Integration with health tracking apps**
- **Community reporting** for citizen science contributions

## 👥 Team

This project was developed by a passionate team of developers who personally understand the challenges of living with allergies. Our goal was to create a tool that would genuinely help people like us and our families manage their health better.

## 📄 License

This project is developed for the NASA Space Challenge 2025 and is available under the MIT License.

## 🙏 Acknowledgments

- **NASA Earthdata** for providing satellite data access
- **AppEEARS team** for data extraction tools
- **React and Python communities** for excellent open-source tools
- **Monterrey residents** for inspiration and real-world application

---

*Built with ❤️ for allergy sufferers everywhere*
