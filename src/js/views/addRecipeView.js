import View from "./view";

class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");
  _overlay = document.querySelector(".overlay");
  _window = document.querySelector(".add-recipe-window");
  _addRecipeBtn = document.querySelector(".nav__btn--add-recipe");
  _closeRecipeBtn = document.querySelector(".btn--close-modal");

  _successMessage = "Recipe was successfully created and added to bookmarks :)";

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerCloseWindow();
  }

  toggleHiddenClass() {
    this._window.classList.toggle("hidden");
    this._overlay.classList.toggle("hidden");
  }

  _addHandlerShowWindow() {
    this._addRecipeBtn.addEventListener(
      "click",
      this.toggleHiddenClass.bind(this)
    );
  }

  _addHandlerCloseWindow() {
    this._closeRecipeBtn.addEventListener(
      "click",
      this.toggleHiddenClass.bind(this)
    );
    this._overlay.addEventListener("click", this.toggleHiddenClass.bind(this));
  }

  addHandlerUploadRecipe(handler) {
    this._parentElement.addEventListener("submit", (e) => {
      e.preventDefault();
      const dataArr = [...new FormData(this._parentElement)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
