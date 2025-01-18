from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer

app = Flask(__name__)

# Load the embedding model
model = SentenceTransformer('all-mpnet-base-v2')

@app.route('/embed', methods=['POST'])
def embed():
    try:
        # Get input text from the request
        data = request.json
        text = data.get('text', [])
        if not text:
            return jsonify({'error': 'No text provided'}), 400

        # Generate embeddings
        embeddings = model.encode(text)
        return jsonify({'embeddings': embeddings.tolist()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
