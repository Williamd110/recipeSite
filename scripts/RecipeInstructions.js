const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const csv = require('csv-parser');

const prisma = new PrismaClient();

function cleanInstructions(instructionString) {
  // Remove the `c(` prefix and trailing `)`
  const cleaned = instructionString.replace(/^c\(|\)$/g, '');
  // Split by commas and trim spaces/quotes
  const instructionsArray = cleaned
    .split('","') // Split by the comma separator (inside the quotes)
    .map((item) => item.replace(/^"|"$/g, '').trim()); // Remove leading/trailing quotes
  return instructionsArray; // Return as an array
}

async function seedRecipes() {
  const recipes = [];
  fs.createReadStream('./recipes.csv') 
    .pipe(csv())
    .on('data', (row) => {
      recipes.push({
        title: row.Name,
        description: row.Description,
        cookTime: row.CookTime,
        prepTime: row.PrepTime,
        totalTime: row.TotalTime,
        instructions: cleanInstructions(row.RecipeInstructions), // Clean and parse instructions
        sodiumContent: parseFloat(row.SodiumContent) || null,
        proteinContent: parseFloat(row.ProteinContent) || null,
        sugarContent: parseFloat(row.SugarContent) || null,
        fiberContent: parseFloat(row.FiberContent) || null,
        carbohydrateContent: parseFloat(row.CarbohydrateContent) || null,
        userId: 1, // Placeholder for user association
      });
    })
    .on('end', async () => {
      try {
        await prisma.recipe.createMany({ data: recipes });
        console.log('Recipes imported successfully!');
      } catch (error) {
        console.error('Error importing recipes:', error);
      } finally {
        process.exit();
      }
    });
}

seedRecipes();