from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

# Path to the JSON file
DATA_FILE = "data.json"

# Load data from the JSON file (if it exists)
def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as file:
            return json.load(file)
    else:
        # Default data if the file doesn't exist
        return {
            "enrolled_clubs": [],
            "available_clubs": ["Cultural_Club", "Robotics_Club", "Debate_Club", "Football_Club", "Computer_Club"],
            "upcoming_events": [
                {"event": "Robotics Workshop", "date": "2025-03-10"},
                {"event": "Coding Hackathon", "date": "2025-03-15"},
                {"event": "Music Concert", "date": "2025-03-20"}
            ]
        }

# Save data to the JSON file
def save_data(data):
    with open(DATA_FILE, "w") as file:
        json.dump(data, file, indent=4)

# Load initial data
data = load_data()

# Routes
@app.route("/enrolled-clubs", methods=["GET"])
def get_enrolled_clubs():
    return jsonify({"enrolled_clubs": data["enrolled_clubs"]})

@app.route("/upcoming-events", methods=["GET"])
def get_upcoming_events():
    return jsonify(data["upcoming_events"])

@app.route("/club-suggestions", methods=["POST"])
def get_club_suggestions():
    request_data = request.json
    preferences = request_data.get("preferences", [])

    suggested_clubs = [
        club for club in preferences
        if club in data["available_clubs"] and club not in data["enrolled_clubs"]
    ]

    return jsonify({"suggested_clubs": suggested_clubs})

@app.route("/join-club", methods=["POST"])
def join_club():
    request_data = request.json
    club = request_data.get("club")

    if club and club not in data["enrolled_clubs"] and club in data["available_clubs"]:
        data["enrolled_clubs"].append(club)  # Add the club to the enrolled_clubs list
        save_data(data)  # Save the updated data to the JSON file
        return jsonify({"message": "Club joined successfully", "enrolled_clubs": data["enrolled_clubs"]})
    
    return jsonify({"message": "Already enrolled or invalid club"}), 400

if __name__ == "__main__":
    app.run(debug=True)