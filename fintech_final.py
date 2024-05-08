import pandas as pd
import numpy as np
import seaborn as sns                       #visualisation
import matplotlib.pyplot as plt             #visualisation
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.linear_model import LinearRegression
# Split data into training and testing sets
from sklearn.model_selection import train_test_split
import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import mean_squared_error
import os
sns.set(color_codes=True)
file_name = "Fintech project\merged_sale_data_updated1.csv"
df = pd.read_csv(file_name,encoding='latin-1')
#implementing this gives me an issue with dimensions
# Q1 = df.quantile(0.25)
# Q3 = df.quantile(0.75)
# IQR = Q3 - Q1
# print(IQR)
# columns_to_check = ['Area (SQFT)', 'Unit Price ($ PSF)']
# df_filtered = df[~((df[columns_to_check] < (Q1 - 1.5 * IQR)) | (df[columns_to_check] > (Q3 + 1.5 * IQR))).any(axis=1)]
# df = df_filtered
categorical_features = ['Type of Sale', 'Type of Area', 'Market Segment', 'Property Type']
# Apply one-hot encoding
encoder = OneHotEncoder(handle_unknown='error')  # Or choose a suitable missing value strategy
encoded_data = encoder.fit_transform(df[categorical_features])
# Create a DataFrame from encoded data
individual_rows = []
encoded_data_array = encoded_data.toarray()  
for row in encoded_data_array:
    row_data = row.tolist()
    individual_rows.append(row_data)
df_encoded_individual = pd.DataFrame(individual_rows, columns=encoder.get_feature_names_out(categorical_features))

# Feature Scaling (Numerical Features)
numerical_features = ['Transacted Price ($)', 'Area (SQFT)', 'Unit Price ($ PSF)']
scaler = StandardScaler()
df[numerical_features] = scaler.fit_transform(df[numerical_features])

# Combine with 'Reference Quarter'
final_data = pd.concat([df_encoded_individual, df[['Reference Quarter', 'Area (SQFT)', 'Unit Price ($ PSF)', 'Remaining Lease', 'Postal District_x']]], axis=1)
features_to_use = ['Area (SQFT)', 'Unit Price ($ PSF)', 
                   'Remaining Lease', 'Postal District_x'] + df_encoded_individual.columns.tolist()
df_encoded = final_data[features_to_use]
df_temp = df_encoded.drop("Unit Price ($ PSF)", axis = 1, inplace = False)
X_train, X_test, y_train, y_test = train_test_split(df_temp, df['Transacted Price ($)'], test_size=0.2, random_state=42)

# Train the model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions on test set
y_pred = model.predict(X_test)
print(y_pred)

from sklearn.metrics import r2_score
r2 = r2_score(y_test, y_pred)
print("R-squared:", r2)
imputer = SimpleImputer(strategy='mean')


# Combine encoded data with numerical features
# encoded_data = np.hstack((encoded_data, df_temp['Postal District_x']))
# X = torch.tensor(encoded_data, dtype=torch.float32)
# y = torch.tensor(df['Transacted Price ($)'].values, dtype=torch.float32)
categorical_features = ['Type of Sale', 'Type of Area', 'Market Segment', 'Property Type']
numerical_features = ['Area (SQFT)', 'Unit Price ($ PSF)', 'Remaining Lease', 'Postal District_x']

# Apply one-hot encoding to categorical features
encoder = OneHotEncoder(handle_unknown='error')
encoded_data = encoder.fit_transform(df[categorical_features])

# Convert encoded data to DataFrame
encoded_df = pd.DataFrame(encoded_data.toarray(), columns=encoder.get_feature_names_out(categorical_features))

# Combine encoded features with numerical features and other columns
final_data = pd.concat([encoded_df, df[numerical_features], df['Transacted Price ($)']], axis=1)

# Define features to use for training the model
features_to_use = numerical_features + encoded_df.columns.tolist()

# Prepare X (input features) and y (target variable)
X = final_data[features_to_use].values
y = final_data['Transacted Price ($)'].values
# Split data into train and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
X_train = torch.tensor(X_train, dtype=torch.float32)
X_test = torch.tensor(X_test, dtype=torch.float32)
y_train = torch.tensor(y_train, dtype=torch.float32)
y_test = torch.tensor(y_test, dtype=torch.float32)
# Define the neural network model
class Net(nn.Module):
    def __init__(self, input_size):
        super(Net, self).__init__()
        self.fc1 = nn.Linear(input_size, 128)
        self.fc2 = nn.Linear(128, 64)
        self.fc3 = nn.Linear(64, 1)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.2)  # Define dropout layer to reduce overfitting

    def forward(self, x):
        x = self.relu(self.fc1(x))
        x = self.dropout(x)  
        x = self.relu(self.fc2(x))
        x = self.dropout(x)  
        x = self.fc3(x)
        return x


# Evaluate the model
model.eval()
with torch.no_grad():
    test_outputs = model(X_test)
    test_loss = criterion(test_outputs.squeeze(), y_test)
    print(f"Test Loss: {test_loss.item()}")
class Net(nn.Module):
    def __init__(self, input_size):
        super(Net, self).__init__()
        self.fc1 = nn.Linear(input_size, 128)
        self.fc2 = nn.Linear(128, 64)
        self.fc3 = nn.Linear(64, 1)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.2)  # Dropout layer to reduce overfitting

    def forward(self, x):
        x = self.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.relu(self.fc2(x))
        x = self.dropout(x)
        x = self.fc3(x)
        return x


# Instantiate the model
model = Net(input_size=X_train.shape[1])

# Define loss function and optimizer
criterion = nn.MSELoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)
scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', factor=0.5, patience=5, verbose=True)

# Training loop
epochs = 50
best_test_loss = float('inf')

for epoch in range(epochs):
    model.train()
    optimizer.zero_grad()
    outputs = model(X_train)
    loss = criterion(outputs.squeeze(), y_train)
    loss.backward()
    optimizer.step()
    scheduler.step(loss)

    # Print training loss
    print(f"Epoch {epoch+1}/{epochs}, Loss: {loss.item()}")

    # Evaluate the model on validation data
    model.eval()
    with torch.no_grad():
        test_outputs = model(X_test)
        test_loss = criterion(test_outputs.squeeze(), y_test)
        print(f"Test Loss: {test_loss.item()}")

        # Save the best model based on validation loss
        if test_loss < best_test_loss:
            best_test_loss = test_loss
            torch.save(model.state_dict(), 'best_model.pth')    

