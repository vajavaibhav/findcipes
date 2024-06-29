import { API_KEY, API_URL, RESULTS_PER_PAGE } from "./config";
import { getJSON, sendJSON } from "./helper.js";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

const getRecipeObject = (data) => {
  let { recipe } = data.data;
  return {
    id: recipe.id,
    cookingTime: recipe.cooking_time,
    imageUrl: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async (id) => {
  try {
    const data = await getJSON(`${API_URL}${id}?key=${API_KEY}`);
    state.recipe = getRecipeObject(data);
    const isBookmarked = state.bookmarks.some((bookmark) => {
      return bookmark.id === id;
    });
    if (isBookmarked) state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async (query) => {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        imageUrl: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = (page = state.search.page) => {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = (newServings) => {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (newServings * ing.quantity) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const saveBookmarks = () => {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = (recipe) => {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  saveBookmarks();
};

export const removeBookmark = (id) => {
  const index = state.bookmarks.findIndex((val) => val.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  saveBookmarks();
};

const getBookmarks = () => {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
};
getBookmarks();

export const uploadRecipe = async (newRec) => {
  try {
    const ingredients = Object.entries(newRec)
      .filter((val) => val[0].startsWith("ingredient") && val[1] !== "")
      .map((val) => {
        const ingArr = val[1].replaceAll(" ", "").split(",");
        if (ingArr.length !== 3)
          throw new Error("Wrong Ingredient format, please try again");
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const newRecipe = {
      title: newRec.title,
      cooking_time: +newRec.cookingTime,
      publisher: newRec.publisher,
      servings: +newRec.servings,
      source_url: newRec.sourceUrl,
      image_url: newRec.image,
      ingredients,
    };
    const data = await sendJSON(`${API_URL}?key=${API_KEY}`, newRecipe);
    const recipe = getRecipeObject(data);
    state.recipe = recipe;
    addBookmark(recipe);
  } catch (err) {
    throw err;
  }
};
