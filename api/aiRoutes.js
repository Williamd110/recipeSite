const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { embedText } = require('./models/embeddingModel');
const router = express.Router();

const prisma = new PrismaClient();

// Endpoint to search recipes by ingredients
router.post('/search', async (req, res) => {
  try {
    const { ingredients } = req.body;

    // Embed user input
    const userEmbedding = await embedText(ingredients);

    // Fetch recipes from the database
    const recipes = await prisma.recipe.findMany();

    // Embed recipe ingredients and calculate similarity
    const results = [];
    for (const recipe of recipes) {
      const recipeEmbedding = await embedText(recipe.ingredients.join(', '));
      const similarity = cosineSimilarity(userEmbedding, recipeEmbedding);
      results.push({ recipe, similarity });
    }

    // Sort by similarity
    results.sort((a, b) => b.similarity - a.similarity);

    res.status(200).json(results.slice(0, 5)); // Return top 5 results
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to search recipes' });
  }
});

function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a ** 2, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b ** 2, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

module.exports = router;
