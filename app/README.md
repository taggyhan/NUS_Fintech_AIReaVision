# How to run the app?
## Frontend
1. Install Expo Go on your mobile device.
2. Clone the repository to your local machine: https://github.com/hzxnancy/appForm.git
3. Install dependencies `npm install`
4. Run app: `npx expo start`
5. Scan the Expo Go QR Code in the terminal to view the app
## Backend
1. Download [model](https://drive.google.com/file/d/1RQWkeXulEfwPFtIGi4vxkJsgXSohcAUF/view) and rename to `model.joblib`
2. Download [scaler](https://drive.google.com/file/d/1-1zIsoZpRvZloJy0zsb1Br7m6Nh7jSIl/view) and rename to `scaler.joblib`
3. Place both `model.joblib` and `scaler.joblib` in the backend folder
4. Run `FLASK_APP=backend/index.py flask run`
![telegram-cloud-photo-size-5-6199650310000066313-y](https://github.com/hzxnancy/appForm/assets/48405651/a95ea44f-ea50-4170-b3e8-af8300acd70f)
Should see something like the above^
