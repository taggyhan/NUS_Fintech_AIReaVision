Property Price Prediction Model
===============================

This repository contains a machine learning model designed to predict property prices based on various property features in Singapore. The model uses extensive feature engineering and preprocessing to optimize predictions.

Features
--------

The model uses the following input features for predictions:

-   Property Type: Categorical (0 for Apartment, 1 for Condominium)
-   Bedrooms: Numeric
-   Bathrooms: Numeric
-   Size: Numeric (in square feet)
-   Age: Numeric (years)
-   Years Left: Numeric (calculated as Leasehold - Age)
-   Number of Amenities: Numeric
-   Latitude and Longitude: Numeric (calculated from address)
-   District: One-hot encoded (District_1 to District_28)
-   Geohash Target Mean: Numeric (mean target variable per geohash)

Model and StandardScaler
------------------------

Download the pretrained model and the `StandardScaler` object from the provided links:

-   Model link: [Download Model](https://drive.google.com/file/d/1RQWkeXulEfwPFtIGi4vxkJsgXSohcAUF/view?usp=sharing)
-   StandardScaler link: [Download StandardScaler](https://drive.google.com/file/d/1-1zIsoZpRvZloJy0zsb1Br7m6Nh7jSIl/view?usp=sharing)

Usage
-----

### 1\. Load the Model and StandardScaler


```
import joblib

model = joblib.load('model_filename.pkl') #or whatever the name is
scaler = joblib.load('scaler_filename.pkl')`
```
### 2\. Geocoding Addresses

Convert addresses into latitude and longitude for processing. This can be done using the following functions:



`from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter
import pandas as pd

# Function to apply geocoding
```
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

        print(f"Processed and saved chunk {i+1}/{num_chunks} (rows {start_idx} to {end_idx})")`
```

### 3\. Encoding and Scaling Features

After geocoding, encode and scale your input features as follows:


```
# Assuming df is your DataFrame loaded with addresses

process_addresses(df)

# Encode geohash and target encode
import geohash2

def encode_geohash(df, lat_col='Latitude', lon_col='Longitude', precision=5):
    df['geohash'] = df.apply(lambda x: geohash2.encode(x[lat_col], x[lon_col], precision=precision), axis=1)
    return df

def target_encode_geohash(df, target_col):
    geohash_target_mean = df.groupby('geohash')[target_col].mean().reset_index(name='geohash_target_mean')
    df = df.merge(geohash_target_mean, how='left', on='geohash')
    return df

df = encode_geohash(df)
df = target_encode_geohash(df, target_col='Asking Price')

# Scale numeric features
numeric_cols = ['Bedrooms', 'Bathrooms', 'Size', 'Age', 'Years_Left', 'No. of Amenities', 'geohash_target_mean']
df[numeric_cols] = scaler.transform(df[numeric_cols])`
```
### 4\. Scale Numeric Features

Before using the model for predictions, it's crucial to scale the numeric features to ensure that the model performs optimally. This is done using `StandardScaler` from Scikit-Learn.


```

import joblib
import pandas as pd

# Assuming df is your DataFrame and selecting numeric columns for scaling
numeric_cols = ['Bedrooms', 'Bathrooms', 'Size', 'Age', 'Years_Left',
                'No. of Amenities', 'geohash_target_mean']

# remember that scaler was built before

# Fit and transform the data
df[numeric_cols] = scaler.fit_transform(df[numeric_cols])

# Save the scaler for future use
joblib.dump(scaler, "scaler.joblib")`
```
This step ensures that the numeric features are normalized, making the training process more stable and improving the performance of most algorithms by equalizing the range of the data features.

### 5\. Prepare Model Inputs

Ensure that all required input features are correctly formatted and included in the DataFrame before making predictions. The machine learning model requires the following features:

-   Property Type (Categorical)
-   Bedrooms (Numeric)
-   Bathrooms (Numeric)
-   Size (Numeric)
-   Age (Numeric)
-   Years Left (Numeric)
-   Number of Amenities (Numeric)
-   Districts 1-28 (One-hot Encoded)
-   Geohash Target Mean (Numeric)

Each district should be represented as a separate column (e.g., `District_1`, `District_2`, etc.), where each column is a binary flag indicating whether the property is in that district.

### 6\. Load and Use the Model for Predictions

After preprocessing and scaling the data, load the trained machine learning model to make predictions:


```
import joblib

# Load the model
model = joblib.load('model_filename.pkl')

# Assuming that df is prepared with all necessary columns
predictions = model.predict(df)
```
# Print the predictions
```
print("Predicted Prices:", predictions)`
```
