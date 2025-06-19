//Estimate calories from photo
'use server';
/**
 * @fileOverview An AI agent that estimates calories from a photo of a meal.
 *
 * - estimateCaloriesFromPhoto - A function that handles the calorie estimation process.
 * - EstimateCaloriesFromPhotoInput - The input type for the estimateCaloriesFromPhoto function.
 * - EstimateCaloriesFromPhotoOutput - The return type for the estimateCaloriesFromPhoto function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateCaloriesFromPhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a meal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type EstimateCaloriesFromPhotoInput = z.infer<typeof EstimateCaloriesFromPhotoInputSchema>;

const FoodItemSchema = z.object({
  name: z.string().describe('The name of the food item.'),
  quantity: z.string().describe('The quantity of the food item (e.g., 1 slice, 1 cup, 100g).'),
  calories: z.number().describe('The estimated calorie count for the specified quantity.'),
  protein: z.number().describe('The estimated protein of this meal.'),
  carbs: z.number().describe('The estimated carbs of this meal.'),
  fats: z.number().describe('The estimated fats of this meal.'),
});

const EstimateCaloriesFromPhotoOutputSchema = z.object({
  foodItems: z.array(FoodItemSchema).describe('A list of food items identified in the photo and their estimated calorie counts.'),
  totalCalories: z.number().describe('The estimated total calorie count for the meal.'),
});
export type EstimateCaloriesFromPhotoOutput = z.infer<typeof EstimateCaloriesFromPhotoOutputSchema>;

export async function estimateCaloriesFromPhoto(input: EstimateCaloriesFromPhotoInput): Promise<EstimateCaloriesFromPhotoOutput> {
  return estimateCaloriesFromPhotoFlow(input);
}

const analyzeMealPrompt = ai.definePrompt({
  name: 'analyzeMealPrompt',
  input: {schema: EstimateCaloriesFromPhotoInputSchema},
  output: {schema: EstimateCaloriesFromPhotoOutputSchema},
  prompt: `You are an expert nutritionist and a highly accurate food recognition AI. Your task is to meticulously analyze the provided photo of a meal.

**Objective:**
Identify all individual food items present in the meal, estimate their quantities (in common measurable units), and provide a detailed nutritional breakdown for the *entire meal*.

**Specific Requirements:**
1.  **Food Item Identification:** List every distinct food item visible in the photo.
2.  **Estimated Quantities:** For each identified food item, provide a realistic estimated quantity. Use standard, easily understood units (e.g., grams, ounces, cups, pieces, slices, tablespoons). If a specific measurement isn't feasible from the image, state that it's an "approximate serving."
3.  **Calorie Count:** Provide an estimated calorie count for each individual food item, and then a total estimated calorie count for the entire meal.
4.  **Macronutrient Breakdown (Protein, Carbs, Fats):** For each individual food item, and for the total meal, provide the estimated grams of protein, carbohydrates (including fiber if distinguishable), and fats.
5.  **Preparation Method Consideration:** If the preparation method is visually discernible (e.g., fried, baked, steamed, roasted, grilled), include it as it significantly impacts nutritional values.
6.  **Similar Food Items/Portion Guidance:** When providing calorie and macronutrient estimations, specifically mention the type of "similar food item" you are basing your estimation on to ensure transparency and realism (e.g., "grilled chicken breast (skinless)", "cooked white rice", "steamed broccoli"). If the meal looks like a standard serving size for a particular item, you can mention that.
7.  **JSON Format:** Respond exclusively in a structured JSON format.

**Error Handling & Assumptions:**
* If a food item's quantity is very difficult to estimate from the photo, state this and provide a range or a typical serving size.
* Clearly state any necessary assumptions made due to image limitations (e.g., "assuming chicken is skinless and not heavily oiled").
* If an item is unidentifiable, state "Unidentifiable Item" and try to provide a general category if possible (e.g., "Unidentifiable green leafy vegetable").

  Respond in JSON format.

  Include similar food items in order to provide a realistic calorie estimation.

  Photo: {{media url=photoDataUri}}`,
});

const estimateCaloriesFromPhotoFlow = ai.defineFlow(
  {
    name: 'estimateCaloriesFromPhotoFlow',
    inputSchema: EstimateCaloriesFromPhotoInputSchema,
    outputSchema: EstimateCaloriesFromPhotoOutputSchema,
  },
  async input => {
    const {output} = await analyzeMealPrompt(input);
    return output!;
  }
);
