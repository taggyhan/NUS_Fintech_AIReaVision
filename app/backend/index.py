import json
import numpy as np
import pandas as pd
import joblib
from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter
import geohash2
from flask import Flask, render_template, request
from scipy.spatial import cKDTree
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)

@app.route("/")
def home():
    return "Hello world"

@app.route("/predict", methods=["POST"])
def predict():
    address = request.json['address']
    name = request.json['name']
    property_type = int(request.json['type'])
    bedrooms = int(request.json['bedrooms'])
    bathrooms = int(request.json['bathrooms'])
    size = int(request.json['size'])
    age = int(request.json['age'])
    tenure = int(request.json['tenure'])
    years_left = int(tenure) - int(age)
    units = request.json['units']
    districts = int(request.json['district'])
    amenities = int(request.json['amenities'])

    # Create dataframe
    data = [[property_type, bedrooms, bathrooms, size, age, years_left, amenities, districts, address]] 
    cols = ['Property Type', 'Bedrooms', 'Bathrooms', 'Size', 'Age', 'Years_Left', 'No. of Amenities', 'Districts', 'Address']    
    df = pd.DataFrame(data, columns=cols)

    for i in range(1, 29):
        df[f'District_{i}'] = 0
    df[f'District_{districts}'] = 1
    df.drop(columns=['Districts'], inplace=True)

    # Handle address column
    def geocode_address(addr, geocode):
        try:
            location = geocode(f"{addr}, Singapore")
            if location and 'Singapore' in location.address:
                return pd.Series([location.latitude, location.longitude])
            else:
                return pd.Series([None, None])
        except Exception as e:
            return pd.Series([None, None])

    # Function to process chunks of addresses
    def process_addresses(df, chunk_size=1000):
        geolocator = Nominatim(user_agent="NUS_project")
        geocode = RateLimiter(geolocator.geocode, min_delay_seconds=1)
        num_chunks = (len(df) // chunk_size) + (1 if len(df) % chunk_size != 0 else 0)
        for i in range(num_chunks):
            start_idx = i * chunk_size
            end_idx = start_idx + chunk_size
            chunk = df.iloc[start_idx:end_idx]
            chunk[['Latitude', 'Longitude']] = chunk['Address'].apply(lambda x: geocode_address(x, geocode))
            chunk.to_csv(f'geocoded_addresses_{start_idx}_{end_idx}.csv', index=False)
            # print(f"Processed and saved chunk {i+1}/{num_chunks} (rows {start_idx} to {end_idx})")

    process_addresses(df)
    df = pd.read_csv("geocoded_addresses_0_1000.csv")

    def add_spatial_density(df, radius=0.0005):  # Adjust the radius based on your geographic context
        # Convert latitude and longitude to radians for use in KDTree (which assumes spherical earth)
        coords = np.radians(df[['Latitude', 'Longitude']].values)
        tree = cKDTree(coords)
        
        # Query the KDTree to count neighbors within the specified radius
        counts = tree.query_ball_point(coords, radius, return_length=True)
        
        # Add the counts as a new column to the dataframe
        df['spatial_density'] = counts
        return df

    df = add_spatial_density(df)

    # Scale numerical columns
    scaler = joblib.load('backend/scaler.joblib')
    numeric_cols = ['Bedrooms', 'Bathrooms', 'Size', 'Age', 'Years_Left', 'No. of Amenities', 'spatial_density']
    df[numeric_cols] = scaler.transform(df[numeric_cols])
    df.drop(columns=['Address', 'Latitude', 'Longitude'], inplace=True)

    # Use the model for predictions
    model = joblib.load('backend/model.joblib')
    predictions = model.predict(df)
    print(f"Predictions: {predictions[0]}")
    return {"predictions": predictions[0]}

if __name__ == "__main__":
    app.run(debug=True)