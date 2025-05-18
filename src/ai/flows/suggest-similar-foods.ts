'use server';
/**
 * @fileOverview Suggest similar foods to the ones identified in the photo.
 *
 * - suggestSimilarFoods - A function that handles the suggestion of similar foods.
 * - SuggestSimilarFoodsInput - The input type for the suggestSimilarFoods function.
 * - SuggestSimilarFoodsOutput - The return type for the suggestSimilarFoods function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSimilarFoodsInputSchema = z.object({
  identifiedFoods: z
    .array(z.string())
    .describe('The food items identified in the photo.'),
});
export type SuggestSimilarFoodsInput = z.infer<typeof SuggestSimilarFoodsInputSchema>;

const SuggestSimilarFoodsOutputSchema = z.object({
  suggestedFoods: z
    .array(z.string())
    .describe('A list of similar food items that could be in the photo.'),
});
export type SuggestSimilarFoodsOutput = z.infer<typeof SuggestSimilarFoodsOutputSchema>;

export async function suggestSimilarFoods(
  input: SuggestSimilarFoodsInput
): Promise<SuggestSimilarFoodsOutput> {
  return suggestSimilarFoodsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSimilarFoodsPrompt',
  input: {schema: SuggestSimilarFoodsInputSchema},
  output: {schema: SuggestSimilarFoodsOutputSchema},
  prompt: `You are a helpful assistant that suggests similar food items to a list of identified foods in a meal.

  Given the following list of food items:
  {{#each identifiedFoods}}- {{{this}}}
  {{/each}}

  Suggest other food items that might be part of the same meal.
  Return a JSON array of strings, where each string is the name of a food item.
  Do not include the original food items in the returned array.
  Be concise.
  `,
});

const suggestSimilarFoodsFlow = ai.defineFlow(
  {
    name: 'suggestSimilarFoodsFlow',
    inputSchema: SuggestSimilarFoodsInputSchema,
    outputSchema: SuggestSimilarFoodsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
