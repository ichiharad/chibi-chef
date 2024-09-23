import json
from flask import Flask, jsonify, request, abort
from google.cloud import firestore
from vertexai.language_models import TextEmbeddingInput, TextEmbeddingModel
from google.cloud.firestore_v1.vector import Vector
from google.cloud.firestore_v1.base_vector_query import DistanceMeasure
import requests
import vertexai
from vertexai.preview.generative_models import GenerationConfig, GenerativeModel, Image, Part
from flask_cors import CORS
import os
import uuid
from datetime import datetime


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["https://nimble-equator-435502-q9.web.app", "https://nimble-equator-435502-q9.firebaseapp.com"]}})


# Initialize Firestore client
dbname = os.environ.get('FIRESTORE_DB_NAME')
db = firestore.Client(database=dbname) if dbname else firestore.Client()

RECIPES_COLLECTION = 'recipes'
REFRIGERATOR_COLLECTION = 'refrigerator'

## Gemini APIs
vertexai.init(project="nimble-equator-435502-q9", location="us-central1")

def embed_text(text: str, task: str = "SEMANTIC_SIMILARITY", model_name: str = "text-multilingual-embedding-preview-0409"):
    """Embeds a single text with a pre-trained, foundational model."""
    model = TextEmbeddingModel.from_pretrained(model_name)
    input_text = TextEmbeddingInput(text, task)
    embedding = model.get_embeddings([input_text])[0]
    return embedding.values

def import_recipe_from_url(url):
    """Import a recipe from a URL"""    
    html_content = get_html_content(url)
    
    recipe_schema = {
        "type": "object",
        "properties": {
            "name": {"type": "string"},
            "ingredients": {"type": "string"},
            "steps": {"type": "string"},
            "description": {"type": "string"},
            "steps_for_child": {"type": "string"}
        },
        "required": ["name", "ingredients", "steps", "description", "steps_for_child"]
    }


    model = GenerativeModel('gemini-1.5-pro-001')

    prompt = f"""
    あなたは料理レシピを子供向けにアレンジする専門家です。
    以下のHTMLコンテンツからレシピ情報を抽出し、子供用のレシピを追加して、指定されたJSONスキーマに従ってフォーマットしてください。
    通常のレシピ（steps)はHTMLコンテンツのそのままとし、子供用のレシピ(steps_for_child)は以下の条件にしたがって作成してください。

    1. 難しい漢字や表現を平易なものに置き換える
    2. 一度に複数工程を進めるのではなく、できる限り分割する
    3. 各手順を簡潔かつ具体的に説明する
    4. 各手順の材料の箇所には材料の数量（例: 豚こま 100g）を併記する
    5. 各手順の材料の箇所にはA, Bのようにまとめず、すべての材料を記載する
    
    HTML content:
    {html_content}
    
    JSONスキーマ:
    {json.dumps(recipe_schema, indent=2)}

    例:
        "name": "レシピ名",
        "ingredients": "材料1, 材料2, 材料3",
        "steps": "ステップ1\nステップ2\nステップ3",
        "description": "レシピの説明",
        "steps_for_child": "子供向けのステップ1\n子供向けのステップ2\n子供向けのステップ3"
    
    
    注意:
    - 'ingredients' は材料をカンマ区切りの文字列にしてください。
    - 'steps' と 'steps_for_child' は各ステップを改行（\n）で区切ってください。
    - 'steps' は大人用にHTMLコンテンツのそのままのレシピを記述してください。各ステップに項番はつけないでください。
    - 'steps_for_child' は子供向けに簡略化した手順を記述してください。各ステップに項番はつけないでください。
    """

    config = GenerationConfig(
        response_mime_type="application/json", response_schema = recipe_schema
    )

    try:
        response = model.generate_content(prompt, generation_config=config)
        print(response.text)
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': 'Failed to generate recipe data'}), 500
    try:
        recipe_data = json.loads(response.text)
    except json.JSONDecodeError:
        return jsonify({'error': 'Failed to parse recipe data'}), 500

    return recipe_data

def get_html_content(url):
    """Get HTML content from a given URL"""
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.text
    except requests.RequestException as e:
        print(f"An error occurred: {e}")
        return None

def recovnize_ingredients(image):
    """Recover ingredients from recipe data"""
    image_bytes = image.read()
    model = GenerativeModel('gemini-1.5-pro-001')

    response = model.generate_content(
        [
            "この画像に写っている食品をすべて特定しなさい。コンマで区切られた値として列挙しなさい。",
            Part.from_data(image_bytes, mime_type="image/jpeg")
        ],
        generation_config={
            "max_output_tokens": 1024,
            "temperature": 0,
            "top_p": 1,
        }
    )
    
    # 認識された食材をリストに変換
    recognized_ingredients = [item.strip() for item in response.text.split(',')]
    return recognized_ingredients



## Recipe APIs

@app.route('/api/recipes', methods=['GET'])
def get_all_recipes():
    """Get all recipes with their IDs"""
    recipes = db.collection(RECIPES_COLLECTION).stream()
    recipe_list = []
    for recipe in recipes:
        recipe_data = recipe.to_dict()
        recipe_data.pop('ingredients_embedding', None)
        recipe_list.append({'id': recipe.id, **recipe_data})
    return jsonify(recipe_list), 200

@app.route('/api/recipes/<recipe_id>', methods=['GET'])
def get_recipe_by_id(recipe_id):
    """Get a specific recipe by ID with its ID included"""
    recipe = db.collection(RECIPES_COLLECTION).document(recipe_id).get()
    if recipe.exists:
        recipe_data = recipe.to_dict()
        recipe_data['id'] = recipe.id
        recipe_data.pop('ingredients_embedding', None)
        return jsonify(recipe_data), 200
    else:
        return jsonify({'error': 'Recipe not found'}), 404

@app.route('/api/recipes', methods=['POST'])
def create_recipe():
    """Create a new recipe"""
    data = request.get_json()
    required_fields = ['name', 'ingredients', 'steps', 'description']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing fields in request body'}), 400

    steps_for_child = data.get('steps_for_child', '').strip()

    ingredients_embedding = embed_text(data['ingredients'])

    recipe_id = str(uuid.uuid4())
    db.collection(RECIPES_COLLECTION).document(recipe_id).set({
        'name': data['name'],
        'ingredients': data['ingredients'],
        'steps': data['steps'],
        'description': data['description'],
        'steps_for_child': steps_for_child,
        'created_at': firestore.SERVER_TIMESTAMP,
        'ingredients_embedding': Vector(ingredients_embedding)
    })
    return jsonify({'message': 'Recipe created', 'id': recipe_id}), 201

@app.route('/api/recipes/<recipe_id>', methods=['PUT'])
def update_recipe(recipe_id):
    """Update an existing recipe"""
    data = request.get_json()
    update_fields = {}
    for field in ['name', 'ingredients', 'steps', 'description', 'steps_for_child']:
        if field in data:
            update_fields[field] = data[field].strip() if isinstance(data[field], str) else data[field]

    if not update_fields:
        return jsonify({'error': 'No fields to update'}), 400

    recipe_ref = db.collection(RECIPES_COLLECTION).document(recipe_id)
    if not recipe_ref.get().exists:
        return jsonify({'error': 'Recipe not found'}), 404

    recipe_ref.update(update_fields)
    return jsonify({'message': 'Recipe updated'}), 200

@app.route('/api/recipes/<recipe_id>', methods=['DELETE'])
def delete_recipe(recipe_id):
    """Delete a recipe"""
    recipe_ref = db.collection(RECIPES_COLLECTION).document(recipe_id)
    if not recipe_ref.get().exists:
        return jsonify({'error': 'Recipe not found'}), 404

    recipe_ref.delete()
    return jsonify({'message': 'Recipe deleted'}), 200

@app.route('/api/recipes/import', methods=['POST'])
def import_recipe_route():
    data = request.get_json()
    if 'url' not in data:
        return jsonify({'error': 'URL is required'}), 400

    recipe_data = import_recipe_from_url(data['url'])
    
    ingredients_embedding = embed_text(recipe_data['ingredients'])

    recipe_id = str(uuid.uuid4())
    db.collection(RECIPES_COLLECTION).document(recipe_id).set({
        **recipe_data,
        'source_url': data['url'],
        'created_at': firestore.SERVER_TIMESTAMP,
        'ingredients_embedding': Vector(ingredients_embedding)
    })

    return jsonify({'message': 'Recipe imported', 'id': recipe_id}), 201


## Refrigerator APIs

@app.route('/api/refrigerator', methods=['GET'])
def get_all_ingredients():
    """Get all ingredients in the refrigerator with their IDs"""
    ingredients = db.collection(REFRIGERATOR_COLLECTION).stream()
    ingredient_list = [{'id': ingredient.id, **ingredient.to_dict()} for ingredient in ingredients]
    sorted_ingredients = sorted(ingredient_list, key=lambda x: x['expiryDate'])
    return jsonify(sorted_ingredients), 200


@app.route('/api/refrigerator', methods=['POST'])
def add_ingredient():
    """Add a new ingredient to the refrigerator"""
    data = request.get_json()
    required_fields = ['name', 'expiryDate']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing fields in request body'}), 400

    try:
        expiry_date = datetime.strptime(data['expiryDate'], '%Y-%m-%d')
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

    ingredient_id = str(uuid.uuid4())
    db.collection(REFRIGERATOR_COLLECTION).document(ingredient_id).set({
        'name': data['name'],
        'expiryDate': data['expiryDate'],
        'added_at': firestore.SERVER_TIMESTAMP
    })
    return jsonify({'message': 'Ingredient added', 'id': ingredient_id}), 201

@app.route('/api/refrigerator/<ingredient_id>', methods=['PUT'])
def update_ingredient(ingredient_id):
    """Update an existing ingredient"""
    data = request.get_json()
    update_fields = {}
    for field in ['name', 'expiryDate']:
        if field in data:
            update_fields[field] = data[field].strip() if isinstance(data[field], str) else data[field]

    if not update_fields:
        return jsonify({'error': 'No fields to update'}), 400

    if 'expiryDate' in update_fields:
        try:
            datetime.strptime(update_fields['expiryDate'], '%Y-%m-%d')
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

    ingredient_ref = db.collection(REFRIGERATOR_COLLECTION).document(ingredient_id)
    if not ingredient_ref.get().exists:
        return jsonify({'error': 'Ingredient not found'}), 404

    ingredient_ref.update(update_fields)
    return jsonify({'message': 'Ingredient updated'}), 200

@app.route('/api/refrigerator/<ingredient_id>', methods=['DELETE'])
def delete_ingredient(ingredient_id):
    """Delete an ingredient from the refrigerator"""
    ingredient_ref = db.collection(REFRIGERATOR_COLLECTION).document(ingredient_id)
    if not ingredient_ref.get().exists:
        return jsonify({'error': 'Ingredient not found'}), 404

    ingredient_ref.delete()
    return jsonify({'message': 'Ingredient deleted'}), 200

@app.route('/api/refrigerator/recognize', methods=['POST'])
def recognize_ingredients_from_image():
    """Recognize ingredients from an uploaded image"""
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    image = request.files['image']
    recognized_ingredients = recovnize_ingredients(image)
    return jsonify({'recognizedIngredients': recognized_ingredients}), 200

## Recommendation API

@app.route('/api/recipes/recommendations', methods=['GET'])
def get_recommended_recipes():
    """Get recommended recipes based on refrigerator contents"""
    ingredients_snapshot = db.collection(REFRIGERATOR_COLLECTION).stream()
    available_ingredients = set()
    for ingredient in ingredients_snapshot:
        available_ingredients.add(ingredient.to_dict()['name'].lower())

    ingredients_text = ", ".join(available_ingredients)
    query_embedding = embed_text(ingredients_text)

    similar_recipes = db.collection(RECIPES_COLLECTION).find_nearest(
        vector_field="ingredients_embedding",
        query_vector=Vector(query_embedding),
        distance_measure=DistanceMeasure.COSINE,
        limit=5
    ).get()

    recipe_list = []
    for recipe in similar_recipes:
        recipe_data = recipe.to_dict()
        recipe_data.pop('ingredients_embedding', None)  # Remove ingredients_embedding
        recipe_list.append({'id': recipe.id, **recipe_data})
    return jsonify(recipe_list), 200

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))