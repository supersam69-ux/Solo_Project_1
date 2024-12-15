from flask import Flask, render_template, request
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import os

app = Flask(__name__)



def load_data(file_path):
    return pd.read_csv(file_path)

def train_and_recommend(stock_data):
    stock_data['Daily_Return'] = stock_data['Close'].pct_change(fill_method=None)

    stock_data['Grow'] = (stock_data['Daily_Return'] > 0).astype(int)

    stock_data.dropna(inplace=True)

    X = stock_data.drop(['Date', 'Grow', 'Daily_Return'], axis=1)
    y = stock_data['Grow']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    rf_classifier = RandomForestClassifier(n_estimators=100, random_state=42)

    rf_classifier.fit(X_train, y_train)

    predictions = rf_classifier.predict(X_test)

    accuracy = accuracy_score(y_test, predictions)

    if accuracy > 0.90:
        recommendation = "Excellent to buy, go for it!"
    elif accuracy >= 0.75:
        recommendation = "Best for buy"
    elif accuracy >= 0.50:
        recommendation = "Good for buy"
    else:
        recommendation = "Risky to buy"

    accuracy_percentage = accuracy * 100

    return recommendation, accuracy_percentage

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/recommendation', methods=['POST'])
def get_recommendation():
    stock_name = request.form['stock_name']
    
    csv_files = [file for file in os.listdir() if file.endswith('.csv')]

    matching_files = [file for file in csv_files if stock_name.lower() in file.lower()]

    if matching_files:
 
        if len(matching_files) > 1:
            return render_template('multiple_files.html', stock_name=stock_name, matching_files=matching_files)
        else:
            file_name = matching_files[0]

            stock_data = load_data(file_name)

            
            recommendation, accuracy_percentage = train_and_recommend(stock_data)

            return render_template('recommendation.html', stock_name=stock_name, recommendation=recommendation, accuracy_percentage=accuracy_percentage)
    else:
        return render_template('no_file_found.html', stock_name=stock_name)

if __name__ == '__main__':
    app.run(debug=True)


