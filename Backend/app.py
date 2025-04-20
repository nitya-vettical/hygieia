from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import os

app = Flask(__name__)
CORS(app)

# Load the model and vectorizer
model_path = os.path.join(os.path.dirname(__file__), 'models/knn_model.pkl')
vectorizer_path = os.path.join(os.path.dirname(__file__), 'models/tfidf_vectorizer.pkl')

with open(model_path, 'rb') as model_file:
    model = pickle.load(model_file)

with open(vectorizer_path, 'rb') as vectorizer_file:
    vectorizer = pickle.load(vectorizer_file)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        symptoms = data.get('symptoms', '')

        print(f"🔍 Received symptoms: {symptoms}")

        # Transform the input text using the loaded vectorizer
        symptoms_vectorized = vectorizer.transform([symptoms])
        print(f"✅ Vectorized input: {symptoms_vectorized}")

        # Make prediction
        prediction = model.predict(symptoms_vectorized)[0]
        print(f"🎯 Prediction result: {prediction}")

        return jsonify({
            'prediction': f"Based on your symptoms, you might have: {prediction}",
            'status': 'success'
        })

    except Exception as e:
        print("❌ Error during prediction:", e)
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500


if __name__ == '__main__':
    app.run(debug=True)