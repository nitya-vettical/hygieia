# Importing libraries
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import pickle
import os

# Download nltk resources
nltk.download('punkt')
nltk.download('stopwords')

# Load dataset
data = pd.read_csv('aitrainingmodel/Symptom2Disease.csv')
data.drop(columns=["Unnamed: 0"], inplace=True)

# Separate features and labels
labels = data['label']
symptoms = data['text']

# Text Preprocessing
stop_words = set(stopwords.words('english'))

def preprocess_text(text):
    words = word_tokenize(text.lower())
    words = [word for word in words if word.isalpha() and word not in stop_words]
    return ' '.join(words)

# Preprocess all symptoms
preprocessed_symptoms = symptoms.apply(preprocess_text)

# TF-IDF Vectorization
tfidf_vectorizer = TfidfVectorizer(max_features=1500)
tfidf_features = tfidf_vectorizer.fit_transform(preprocessed_symptoms).toarray()

# Split into training and test sets
X_train, X_test, y_train, y_test = train_test_split(tfidf_features, labels, test_size=0.2, random_state=42)

# Train KNN model
knn_classifier = KNeighborsClassifier(n_neighbors=7)
knn_classifier.fit(X_train, y_train)

# Evaluate
print(f"Training Accuracy: {accuracy_score(y_train, knn_classifier.predict(X_train)):.4f}")
print(f"Test Accuracy: {accuracy_score(y_test, knn_classifier.predict(X_test)):.4f}")
print(classification_report(y_test, knn_classifier.predict(X_test)))

# Make sure models directory exists
os.makedirs('models', exist_ok=True)

# Save the fitted model
with open('models/knn_model.pkl', 'wb') as model_file:
    pickle.dump(knn_classifier, model_file)

# Save the fitted vectorizer
with open('models/tfidf_vectorizer.pkl', 'wb') as vec_file:
    pickle.dump(tfidf_vectorizer, vec_file)

# Optional: example prediction
example_symptom = "My skin is very sensitive and reacts easily to changes in temperature or humidity."
preprocessed_example = preprocess_text(example_symptom)
example_vector = tfidf_vectorizer.transform([preprocessed_example])
example_prediction = knn_classifier.predict(example_vector)
print(f"Example prediction: {example_prediction[0]}")
