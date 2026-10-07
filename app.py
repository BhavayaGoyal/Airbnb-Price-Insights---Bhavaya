from flask import Flask, request, jsonify 
from flask_cors import CORS 
import pandas as pd 
import numpy as np
import joblib


model = joblib.load("../models/airbnb_price_model.pkl")
preprocessor = joblib.load("../models/airbnb_preprocessor.pkl")

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    input_data = pd.DataFrame([{
        "RoomType":data["RoomType"],
        "City":data["City"],
        "Bedrooms":data["Bedrooms"],
        "Bathrooms": data["Bathrooms"],
        "Beds": data["Beds"],
        "PersonCapacity": data["PersonCapacity"]
    }])

    processedData = preprocessor.transform(input_data)
    logPred = model.predict(processedData)[0]
    predPrice = np.exp(logPred)-1

    return jsonify({
        "predicted_price":round(float(predPrice),2)
    })





if __name__ == "__main__":
    app.run(debug=True)