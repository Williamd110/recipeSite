-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "carbohydrateContent" DOUBLE PRECISION,
ADD COLUMN     "cookTime" TEXT,
ADD COLUMN     "fiberContent" DOUBLE PRECISION,
ADD COLUMN     "instructions" JSONB,
ADD COLUMN     "prepTime" TEXT,
ADD COLUMN     "proteinContent" DOUBLE PRECISION,
ADD COLUMN     "sodiumContent" DOUBLE PRECISION,
ADD COLUMN     "sugarContent" DOUBLE PRECISION,
ADD COLUMN     "totalTime" TEXT;
