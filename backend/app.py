from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)  # Configurer CORS pour permettre les interactions avec le frontend

# Connexion à MongoDB
client = MongoClient("mongodb://127.0.0.1:27017/")
db = client["library_db"]

# Collections MongoDB
books_collection = db["books"]  # Livres
subscribers_collection = db["subscribers"]  # Abonnés
borrowers_collection = db["borrowers"]  # Emprunteurs

# Route pour récupérer tous les livres
@app.route('/books', methods=['GET'])
def get_books():
    books = list(books_collection.find({}, {"_id": 0}))
    return jsonify(books), 200

# Route pour ajouter un livre
@app.route('/books', methods=['POST'])
def add_book():
    data = request.json
    if "title" not in data or "author" not in data or "year" not in data:
        return jsonify({"error": "Invalid input, 'title', 'author', and 'year' are required."}), 400

    # Vérifier si le livre existe déjà
    existing_book = books_collection.find_one({"title": data["title"], "author": data["author"]})
    if existing_book:
        return jsonify({"error": "Book with this title and author already exists."}), 409

    books_collection.insert_one(data)
    return jsonify({"message": "Book added successfully"}), 201

# Route pour supprimer un livre
@app.route('/books/<title>', methods=['DELETE'])
def delete_book(title):
    result = books_collection.delete_one({"title": title})
    if result.deleted_count == 0:
        return jsonify({"error": "Book not found"}), 404
    return jsonify({"message": "Book deleted successfully"}), 200

# Route pour mettre à jour un livre
@app.route('/books/<title>', methods=['PUT'])
def update_book(title):
    data = request.json
    result = books_collection.update_one({"title": title}, {"$set": data})
    if result.matched_count == 0:
        return jsonify({"error": "Book not found"}), 404
    return jsonify({"message": "Book updated successfully"}), 200

# Route pour récupérer tous les abonnés
@app.route('/subscribers', methods=['GET'])
def get_subscribers():
    subscribers = list(subscribers_collection.find({}, {"_id": 0}))
    return jsonify(subscribers), 200

# Route pour ajouter un abonné
@app.route('/subscribers', methods=['POST'])
def add_subscriber():
    data = request.json
    if "name" not in data or "email" not in data:
        return jsonify({"error": "Invalid input, 'name' and 'email' are required."}), 400

    # Vérifier si un abonné avec cet email existe déjà
    existing_subscriber = subscribers_collection.find_one({"email": data["email"]})
    if existing_subscriber:
        return jsonify({"error": "Subscriber with this email already exists."}), 409

    subscribers_collection.insert_one(data)
    return jsonify({"message": "Subscriber added successfully"}), 201

# Route pour supprimer un abonné
@app.route('/subscribers/<email>', methods=['DELETE'])
def delete_subscriber(email):
    result = subscribers_collection.delete_one({"email": email})
    if result.deleted_count == 0:
        return jsonify({"error": "Subscriber not found"}), 404
    return jsonify({"message": "Subscriber deleted successfully"}), 200


# Route pour mettre à jour un abonné
@app.route('/subscribers/<email>', methods=['PUT'])
def update_subscriber(email):
    data = request.json
    # Vérifier que les champs requis sont présents
    if "name" not in data or "email" not in data:
        return jsonify({"error": "Invalid input, 'name' and 'email' are required."}), 400
    
    # Mettre à jour l'abonné dans la collection
    result = subscribers_collection.update_one({"email": email}, {"$set": data})
    
    if result.matched_count == 0:
        return jsonify({"error": "Subscriber not found"}), 404
    
    return jsonify({"message": "Subscriber updated successfully"}), 200


# Route pour récupérer tous les emprunts
@app.route('/borrowers', methods=['GET'])
def get_borrowers():
    borrowers = list(borrowers_collection.find({}, {"_id": 0}))
    return jsonify(borrowers), 200

# Route pour ajouter un emprunt
@app.route('/borrowers', methods=['POST'])
def add_borrower():
    data = request.json
    if "book_title" not in data or "subscriber_email" not in data or "borrow_date" not in data:
        return jsonify({"error": "Invalid input, 'book_title', 'subscriber_email', and 'borrow_date' are required."}), 400

    # Vérifier si le livre existe
    book = books_collection.find_one({"title": data["book_title"]})
    if not book:
        return jsonify({"error": "Book not found"}), 404

    # Vérifier si l'abonné existe
    subscriber = subscribers_collection.find_one({"email": data["subscriber_email"]})
    if not subscriber:
        return jsonify({"error": "Subscriber not found"}), 404

    borrowers_collection.insert_one(data)
    return jsonify({"message": "Borrower added successfully"}), 201

# Route pour supprimer un emprunt
@app.route('/borrowers/<borrower_id>', methods=['DELETE'])
def delete_borrower(borrower_id):
    result = borrowers_collection.delete_one({"_id": borrower_id})
    if result.deleted_count == 0:
        return jsonify({"error": "Borrower not found"}), 404
    return jsonify({"message": "Borrower deleted successfully"}), 200

# Route pour mettre à jour un emprunt
@app.route('/borrowers/<borrower_id>', methods=['PUT'])
def update_borrower(borrower_id):
    data = request.json
    # Vérifier que les champs requis sont présents
    if "book_title" not in data or "subscriber_email" not in data or "borrow_date" not in data:
        return jsonify({"error": "Invalid input, 'book_title', 'subscriber_email', and 'borrow_date' are required."}), 400
    
    # Mettre à jour l'emprunteur dans la collection
    result = borrowers_collection.update_one({"_id": borrower_id}, {"$set": data})
    
    if result.matched_count == 0:
        return jsonify({"error": "Borrower not found"}), 404
    
    return jsonify({"message": "Borrower updated successfully"}), 200


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
