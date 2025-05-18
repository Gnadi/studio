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
  prompt: `You are an expert nutritionist. Analyze the photo of the meal and identify the food items present, along with their estimated quantities and calorie counts.

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
