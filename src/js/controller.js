import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarkView from "./views/bookmarkView.js";
import addRecipeView from "./views/addRecipeView.js";
import { MODAL_CLOSE_SEC } from "./config.js";

const controlRecipe = async () => {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());

    bookmarkView.update(model.state.bookmarks);

    await model.loadRecipe(id);
    const recipe = model.state.recipe;
    recipeView.render(recipe);
  } catch (err) {
    recipeView.renderErrorMessage();
  }
};

const controlSearchResults = async (query) => {
  try {
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();
    await model.loadSearchResults(query);
    resultsView.render(model.getSearchResultsPage(1));
    paginationView.render(model.state.search);
  } catch (err) {
    recipeView.renderErrorMessage();
  }
};

const controlPagination = (goToPage) => {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = (servings) => {
  model.updateServings(servings);
  const recipe = model.state.recipe;
  recipeView.update(recipe);
};

const controlUpdateBookmarks = () => {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);
  recipeView.update(model.state.recipe);
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = () => {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async (data) => {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(data);
    recipeView.render(model.state.recipe);
    addRecipeView.renderSuccessMessage();
    bookmarkView.render(model.state.bookmarks);
    window.history.pushState(null, "", `#${model.state.recipe.id}`);
    setTimeout(() => {
      addRecipeView.toggleHiddenClass();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderErrorMessage(err.message);
  }
};

const init = () => {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerUpdateBookmarks(controlUpdateBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUploadRecipe(controlAddRecipe);
};
init();
