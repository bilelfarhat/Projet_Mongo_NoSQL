from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Configurer CORS pour permettre les interactions avec le frontend

# Connexion à MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["library-db"]

# Collections MongoDB
books_collection = db["books"]  # Livres
subscribers_collection = db["subscribers"]  # Abonnés
borrowers_collection = db["borrowers"]  # Emprunteurs

def serialize_book(book):
    book['_id'] = str(book['_id'])
    return book

@app.route('/')
def home():
    return 'Welcome to the Library API!'    

# Route pour récupérer tous les livres
@app.route('/books', methods=['GET'])
def get_books():
    books = list(books_collection.find({}))
    return jsonify([serialize_book(b) for b in books]), 200

# Route pour récupérer un livre par ID
@app.route('/books/<book_id>', methods=['GET'])
def get_book(book_id):
    book = books_collection.find_one({"_id": ObjectId(book_id)})
    if not book:
        return jsonify({"error": "Book not found"}), 404
    return jsonify(serialize_book(book)), 200








@app.route('/books', methods=['POST'])
def add_book():
    data = request.json

    # Vérification des champs requis
    required_fields = ["title", "author", "year", "quantity"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"'{field}' is required."}), 400

    # Vérification du type des champs
    if not isinstance(data['title'], str):
        return jsonify({"error": "'title' must be a string."}), 400

    if not isinstance(data['author'], str):
        return jsonify({"error": "'author' must be a string."}), 400

    if not isinstance(data['year'], int):
        return jsonify({"error": "'year' must be an integer."}), 400

    if not isinstance(data['quantity'], int):
        return jsonify({"error": "'quantity' must be an integer."}), 400

    # Vérification si le livre existe déjà
    existing_book = books_collection.find_one({"title": data["title"], "author": data["author"]})
    if existing_book:
        return jsonify({"error": "Book with this title and author already exists."}), 409

    # Insertion du livre
    books_collection.insert_one(data)
    return jsonify({"message": "Book added successfully"}), 201


# Route pour mettre à jour un livre
@app.route('/books/<book_id>', methods=['PUT'])
def update_book(book_id):
    data = request.json
    if "quantity" not in data:
        return jsonify({"error": "Invalid input, 'quantity' is required."}), 400

    result = books_collection.update_one({"_id": ObjectId(book_id)}, {"$set": data})
    if result.matched_count == 0:
        return jsonify({"error": "Book not found"}), 404
    return jsonify({"message": "Book updated successfully"}), 200

# Route pour supprimer un livre
@app.route('/books/<book_id>', methods=['DELETE'])
def delete_book(book_id):
    result = books_collection.delete_one({"_id": ObjectId(book_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Book not found"}), 404
    return jsonify({"message": "Book deleted successfully"}), 200

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

# Route pour vérifier l'existence d'un abonné par email
@app.route('/subscribers/<email>', methods=['GET'])
def check_subscriber(email):
    subscriber = subscribers_collection.find_one({"email": email})
    if subscriber:
        return jsonify({"exists": True}), 200
    return jsonify({"exists": False}), 404

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

def serialize_borrower(borrower):
    borrower['_id'] = str(borrower['_id'])
    return borrower

# Récupérer un emprunt par ID
@app.route('/borrowers/<borrower_id>', methods=['GET'])
def get_borrower(borrower_id):
    borrower = borrowers_collection.find_one({"_id": ObjectId(borrower_id)})
    if not borrower:
        return jsonify({"error": "Borrower not found"}), 404
    return jsonify(serialize_borrower(borrower)), 200

# Récupérer tous les emprunts
@app.route('/borrowers', methods=['GET'])
def get_borrowers():
    borrowers = list(borrowers_collection.find({}))
    return jsonify([serialize_borrower(b) for b in borrowers]), 200

@app.route('/borrowers', methods=['POST'])
def add_borrower():
    try:
        # Récupérer les données de la requête
        data = request.json
        print(f"Data received: {data}")  # Log des données reçues

        # Vérifier la présence des champs requis
        if "book_title" not in data or "subscriber_email" not in data or "borrow_start_date" not in data or "borrow_end_date" not in data:
            print("Invalid input data")  # Log de l'erreur
            return jsonify({"error": "Invalid input"}), 400

        # Vérifier la disponibilité du livre
        book = books_collection.find_one({"title": data["book_title"]})
        if not book:
            return jsonify({"error": "Book not found"}), 404

        # Vérifier que 'quantity' est bien un entier
        try:
            quantity = int(book["quantity"])  # Assurez-vous que quantity est un entier
            if quantity <= 0:
                print(f"Book not available: {data['book_title']}")  # Log du livre non disponible
                return jsonify({"error": "Book not available"}), 400
        except ValueError:
            print(f"Invalid quantity for book: {data['book_title']}")  # Log de l'erreur
            return jsonify({"error": "Invalid quantity format"}), 400

        # Vérifier les dates
        from datetime import datetime
        borrow_start = datetime.strptime(data["borrow_start_date"], "%Y-%m-%d")
        borrow_end = datetime.strptime(data["borrow_end_date"], "%Y-%m-%d")
        if borrow_end < borrow_start:
            return jsonify({"error": "Borrow end date cannot be earlier than borrow start date"}), 400

        # Ajouter l'emprunteur à la collection des emprunteurs
        borrowers_collection.insert_one(data)

        # Réduire la quantité du livre
        books_collection.update_one({"title": data["book_title"]}, {"$inc": {"quantity": -1}})

        return jsonify({"message": "Borrower added successfully"}), 201

    except Exception as e:
        # Log de l'exception
        print(f"Error while adding borrower: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500





# Mettre à jour un emprunt
@app.route('/borrowers/<borrower_id>', methods=['PUT'])
def update_borrower(borrower_id):
    data = request.json
    result = borrowers_collection.update_one({"_id": ObjectId(borrower_id)}, {"$set": data})
    if result.matched_count == 0:
        return jsonify({"error": "Borrower not found"}), 404
    return jsonify({"message": "Borrower updated successfully"}), 200

# Supprimer un emprunt
@app.route('/borrowers/<borrower_id>', methods=['DELETE'])
def delete_borrower(borrower_id):
    borrower = borrowers_collection.find_one({"_id": ObjectId(borrower_id)})
    if not borrower:
        return jsonify({"error": "Borrower not found"}), 404
    
    # Récupérer le titre du livre emprunté
    book_title = borrower["book_title"]
    
    # Supprimer l'emprunt de la collection des emprunteurs
    result = borrowers_collection.delete_one({"_id": ObjectId(borrower_id)})
    
    if result.deleted_count == 0:
        return jsonify({"error": "Borrower not found"}), 404
    
    # Augmenter la quantité du livre dans la collection des livres
    books_collection.update_one({"title": book_title}, {"$inc": {"quantity": 1}})
    
    return jsonify({"message": "Borrower deleted successfully, book quantity updated"}), 200

# Route pour mettre à jour la quantité d'un livre
@app.route('/books/update-quantity', methods=['PUT'])
def update_book_quantity():
    data = request.json
    if "book_title" not in data or "quantity_change" not in data:
        return jsonify({"error": "'book_title' and 'quantity_change' are required."}), 400
    
    # Trouver le livre par son titre
    book = books_collection.find_one({"title": data["book_title"]})
    if not book:
        return jsonify({"error": "Book not found"}), 404
    
    # Mettre à jour la quantité du livre
    new_quantity = book["quantity"] + data["quantity_change"]
    
    # Vérifier si la nouvelle quantité est valide
    if new_quantity < 0:
        return jsonify({"error": "Quantity cannot be negative"}), 400
    
    # Mettre à jour la quantité dans la base de données
    books_collection.update_one({"title": data["book_title"]}, {"$set": {"quantity": new_quantity}})
    
    return jsonify({"message": "Book quantity updated successfully"}), 200


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)