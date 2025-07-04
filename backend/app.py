from flask import Flask, request, jsonify, render_template_string, redirect, url_for, session
from flask_pymongo import PyMongo
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)

# --- SESSION & CORS CONFIG FOR CROSS-ORIGIN AUTH ---
# Use HTTPS and correct SameSite policy for production/cloud (like Render)
app.config.update(
    SESSION_COOKIE_SAMESITE="None",   # allow cross-site cookies
    SESSION_COOKIE_SECURE=True        # required for SameSite=None (only send cookie over HTTPS)
)
# Allow both local and deployed frontend origins
CORS(app, supports_credentials=True, origins=[
    "http://localhost:3001",
    "https://cookwithlove-frontend.onrender.com/"
])

mongo_uri = os.environ["MONGO_URI"]
app.config["MONGO_URI"] = mongo_uri
app.secret_key = os.getenv("SECRET_KEY", "supersecret")
mongo = PyMongo(app)

def logged_in():
    return "username" in session

def get_current_user():
    return session.get("username")

# ----------------- API: User Authentication -----------------
@app.route("/api/register", methods=["POST"])
def api_register():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return jsonify({"error": "Username and password required!"}), 400
    if mongo.db.users.find_one({"username": username}):
        return jsonify({"error": "Username already exists!"}), 400
    hashed_pw = generate_password_hash(password, method="pbkdf2:sha256")
    mongo.db.users.insert_one({"username": username, "password": hashed_pw})
    return jsonify({"message": "User registered successfully!"})

@app.route("/api/login", methods=["POST"])
def api_login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    user = mongo.db.users.find_one({"username": username})
    if user and check_password_hash(user["password"], password):
        session["username"] = username
        return jsonify({"message": "Logged in!", "username": username})
    return jsonify({"error": "Invalid credentials!"}), 401

@app.route("/api/logout", methods=["POST"])
def api_logout():
    session.pop("username", None)
    return jsonify({"message": "Logged out!"})

@app.route("/api/me", methods=["GET"])
def api_me():
    if not logged_in():
        return jsonify({"username": None})
    return jsonify({"username": get_current_user()})

# ----------------- API: Recipe CRUD -----------------

@app.route("/api/recipes", methods=["GET"])
def api_list_recipes():
    recipes = list(mongo.db.recipes.find())
    for recipe in recipes:
        recipe["_id"] = str(recipe["_id"])
    return jsonify(recipes)

@app.route("/api/recipes", methods=["POST"])
def api_add_recipe():
    if not logged_in():
        return jsonify({"error": "Not logged in"}), 401
    data = request.json
    title = data.get("title")
    ingredients = data.get("ingredients")
    instructions = data.get("instructions")
    image_url = data.get("image_url", "")
    author = get_current_user()
    if not title or not ingredients or not instructions:
        return jsonify({"error": "All fields are required!"}), 400
    if isinstance(ingredients, str):
        ingredients = [i.strip() for i in ingredients.split(",") if i.strip()]
    recipe = {
        "title": title,
        "ingredients": ingredients,
        "instructions": instructions,
        "author": author,
        "image_url": image_url
    }
    res = mongo.db.recipes.insert_one(recipe)
    recipe["_id"] = str(res.inserted_id)
    return jsonify(recipe), 201

@app.route("/api/recipes/<recipe_id>", methods=["PUT"])
def api_edit_recipe(recipe_id):
    if not logged_in():
        return jsonify({"error": "Not logged in"}), 401
    data = request.json
    title = data.get("title")
    ingredients = data.get("ingredients")
    instructions = data.get("instructions")
    image_url = data.get("image_url", "")
    if not title or not ingredients or not instructions:
        return jsonify({"error": "All fields are required!"}), 400
    if isinstance(ingredients, str):
        ingredients = [i.strip() for i in ingredients.split(",") if i.strip()]
    mongo.db.recipes.update_one(
        {"_id": ObjectId(recipe_id)},
        {"$set": {
            "title": title,
            "ingredients": ingredients,
            "instructions": instructions,
            "image_url": image_url
        }}
    )
    return jsonify({"message": "Recipe updated!"})

@app.route("/api/recipes/<recipe_id>", methods=["DELETE"])
def api_delete_recipe(recipe_id):
    if not logged_in():
        return jsonify({"error": "Not logged in"}), 401
    mongo.db.recipes.delete_one({"_id": ObjectId(recipe_id)})
    return jsonify({"message": "Recipe deleted!"})

@app.route("/api/recipes/<recipe_id>", methods=["GET"])
def api_get_recipe(recipe_id):
    recipe = mongo.db.recipes.find_one({"_id": ObjectId(recipe_id)})
    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404
    recipe["_id"] = str(recipe["_id"])
    return jsonify(recipe)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050)