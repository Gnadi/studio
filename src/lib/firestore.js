// /home/gnadi/entwicklung/git/studio/src/lib/firestore.js
import {
    collection,
    query,
    getDocs,
    doc,
    addDoc,
    deleteDoc,
    writeBatch,
    orderBy,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "./clientApp";

// Helper to get a reference to a user's "meals" subcollection
const getMealsCollectionRef = (userId) => collection(db, 'users', userId, 'meals');

/**
 * Saves a new meal to the user's history in Firestore.
 * This is the function you'll call to save a new meal.
 *
 * @param {string} userId The ID of the currently authenticated user.
 * @param {object} mealData The meal data to save. Should match the StoredMeal type from types.ts, but without the 'id'.
 * @returns {Promise<string>} The ID of the newly created meal document.
 */
export async function saveMealToHistory(userId, mealData) {
    if (!userId) {
        throw new Error("User ID is required to save a meal.");
    }
    if (!mealData || typeof mealData !== 'object') {
        throw new Error("Valid meal data must be provided.");
    }

    try {
        const mealsCollection = getMealsCollectionRef(userId);
        // addDoc creates a new document with an auto-generated ID
        const mealDocument = await addDoc(mealsCollection, {
            ...mealData,
            userId: userId, // Storing userId for better security rules and queries
            createdAt: serverTimestamp(), // Use a server-side timestamp for consistency
        });
        console.log("Meal saved with ID: ", mealDocument.id);
        return mealDocument.id;
    } catch (error) {
        console.error("Error saving meal to Firestore:", error);
        // Re-throw a more user-friendly error for the UI to catch
        throw new Error("Failed to save meal. Please try again.");
    }
}

/**
 * Fetches all meals for a given user, ordered by date.
 * @param {string} userId The ID of the user whose meals to fetch.
 * @returns {Promise<Array<object>>} An array of meal objects, including their Firestore ID.
 */
export async function getMealHistory(userId) {
    if (!userId) {
        console.warn("No user ID provided to getMealHistory.");
        return [];
    }
    const mealsCollection = getMealsCollectionRef(userId);
    // Order by the 'date' field in descending order to show the newest first
    const q = query(mealsCollection, orderBy("date", "desc"));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));
}

/**
 * Deletes a specific meal from a user's history.
 * @param {string} userId The ID of the user.
 * @param {string} mealId The ID of the meal to delete.
 * @returns {Promise<void>}
 */
export async function deleteMealFromHistory(userId, mealId) {
    if (!userId || !mealId) {
        throw new Error("User ID and Meal ID are required for deletion.");
    }
    const mealDocRef = doc(db, 'users', userId, 'meals', mealId);
    await deleteDoc(mealDocRef);
}

/**
 * Deletes all meals for a given user using a batch operation.
 * @param {string} userId The ID of the user whose history to clear.
 * @returns {Promise<void>}
 */
export async function clearAllMealHistory(userId) {
    if (!userId) {
        throw new Error("User ID is required to clear history.");
    }
    const mealsCollection = getMealsCollectionRef(userId);
    const querySnapshot = await getDocs(mealsCollection);

    if (querySnapshot.empty) {
        return; // Nothing to delete
    }

    // Use a batch write for efficiency and to ensure all deletions succeed or fail together
    const batch = writeBatch(db);
    querySnapshot.forEach(doc => {
        batch.delete(doc.ref);
    });

    await batch.commit();
}