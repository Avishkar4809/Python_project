"""
Python Flask Web Application
A modern, lightweight, full-featured Python website.
"""

from flask import Flask, render_template, request, jsonify
import sys
import platform
import os
import time
from datetime import datetime

app = Flask(__name__)

# Start timestamp for uptime calculation
START_TIME = time.time()

# In-memory storage for demonstration (Tasks / Notes board)
ITEMS = [
    {
        "id": 1,
        "title": "Explore Python Web Development",
        "category": "Learning",
        "created_at": "10:30 AM",
        "completed": True
    },
    {
        "id": 2,
        "title": "Build dynamic web app with Flask & Jinja2",
        "category": "Project",
        "created_at": "11:15 AM",
        "completed": False
    },
    {
        "id": 3,
        "title": "Test REST APIs and responsive UI",
        "category": "Testing",
        "created_at": "12:00 PM",
        "completed": False
    }
]

@app.route("/")
def home():
    """Renders the landing page."""
    return render_template("index.html")

@app.route("/about")
def about():
    """Renders the about page with environment details."""
    system_details = {
        "python_version": sys.version.split()[0],
        "platform": f"{platform.system()} {platform.release()} ({platform.machine()})",
        "flask_version": "3.1.3",
        "server_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    return render_template("about.html", sys_info=system_details)

# --- REST API ENDPOINTS ---

@app.route("/api/system-stats", methods=["GET"])
def system_stats():
    """Returns dynamic system diagnostics."""
    uptime_seconds = int(time.time() - START_TIME)
    hours, remainder = divmod(uptime_seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    uptime_str = f"{hours}h {minutes}m {seconds}s"

    return jsonify({
        "status": "online",
        "python_version": sys.version.split()[0],
        "platform": platform.platform(),
        "uptime": uptime_str,
        "total_items": len(ITEMS),
        "timestamp": datetime.now().strftime("%I:%M:%S %p")
    })

@app.route("/api/items", methods=["GET"])
def get_items():
    """Returns the list of items."""
    return jsonify(ITEMS)

@app.route("/api/items", methods=["POST"])
def add_item():
    """Adds a new item."""
    data = request.get_json(silent=True) or {}
    title = data.get("title", "").strip()
    category = data.get("category", "General").strip()

    if not title:
        return jsonify({"error": "Item title cannot be empty"}), 400

    new_item = {
        "id": int(time.time() * 1000),
        "title": title,
        "category": category if category else "General",
        "created_at": datetime.now().strftime("%I:%M %p"),
        "completed": False
    }
    ITEMS.insert(0, new_item)
    return jsonify(new_item), 201

@app.route("/api/items/<int:item_id>/toggle", methods=["POST"])
def toggle_item(item_id):
    """Toggles item completed state."""
    for item in ITEMS:
        if item["id"] == item_id:
            item["completed"] = not item["completed"]
            return jsonify(item)
    return jsonify({"error": "Item not found"}), 404

@app.route("/api/items/<int:item_id>", methods=["DELETE"])
def delete_item(item_id):
    """Deletes an item by id."""
    global ITEMS
    initial_len = len(ITEMS)
    ITEMS = [item for item in ITEMS if item["id"] != item_id]
    if len(ITEMS) < initial_len:
        return jsonify({"success": True, "deleted_id": item_id})
    return jsonify({"error": "Item not found"}), 404

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print("=" * 50)
    print(f"  🐍 Python Flask Server is running on: http://127.0.0.1:{port}")
    print(f"  📁 Serving from: {os.path.dirname(os.path.abspath(__file__))}")
    print(f"  ⚡ Press Ctrl + C to stop")
    print("=" * 50)
    app.run(host="127.0.0.1", port=port, debug=True)
