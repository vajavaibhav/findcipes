import View from "./view";
import previewView from "./previewView";

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage =
    "Sorry! No results found with your searched query, please try searching different recipe";
  _successMessage = "";

  _generateMarkup() {
    return this._data
      .map((result) => previewView.render(result, false))
      .join("");
  }
}

export default new ResultsView();
