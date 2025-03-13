import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Embedding
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# Load dataset (Replace with actual dataset path)
df = pd.read_csv("datasets/disease_symptom_dataset.csv")

# Preprocess data
symptoms = df['Symptoms'].values
labels = df['Disease'].values

# Encode labels
label_encoder = LabelEncoder()
labels_encoded = label_encoder.fit_transform(labels)

# Tokenize symptoms
tokenizer = tf.keras.preprocessing.text.Tokenizer()
tokenizer.fit_on_texts(symptoms)
symptoms_seq = tokenizer.texts_to_sequences(symptoms)
symptoms_padded = tf.keras.preprocessing.sequence.pad_sequences(symptoms_seq)

# Split data
X_train, X_test, y_train, y_test = train_test_split(symptoms_padded, labels_encoded, test_size=0.2, random_state=42)

# Build LSTM model
model = Sequential([
    Embedding(input_dim=len(tokenizer.word_index)+1, output_dim=64, input_length=symptoms_padded.shape[1]),
    LSTM(64, return_sequences=True),
    LSTM(32),
    Dense(32, activation='relu'),
    Dense(len(label_encoder.classes_), activation='softmax')
])

# Compile model
model.compile(loss='sparse_categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

# Train model
model.fit(X_train, y_train, epochs=10, validation_data=(X_test, y_test))

# Save model
model.save("models/symptom_checker_model.h5")

print("Model training complete! Saved to models/symptom_checker_model.h5")
