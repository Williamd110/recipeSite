const { SentenceTransformer } = require('sentence-transformers');

// Load the embedding model
const modelName = process.env.MODEL_NAME || 'all-mpnet-base-v2';
const model = new SentenceTransformer(modelName);

async function embedText(text) {
  // Convert text into embeddings
  return model.encode(text);
}

module.exports = { embedText };