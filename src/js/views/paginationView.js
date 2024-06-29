import View from "./view";
import icons from "url:../../img/icons.svg";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", (e) => {
      e.preventDefault();
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currPage = this._data.page;
    const totalPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    //1st page , other pages
    if (currPage === 1 && totalPages > currPage) {
      return this._getNextPageButtonHTML(currPage, totalPages);
    }
    //middle page
    if (currPage !== 1 && totalPages > currPage) {
      return `${this._getPrevPageButtonHTML(
        currPage,
        totalPages
      )} ${this._getNextPageButtonHTML(currPage, totalPages)}`;
    }
    //last page
    if (currPage === totalPages && totalPages > 1) {
      return this._getPrevPageButtonHTML(currPage, totalPages);
    }
    //1st page , no other pages
    return "";
  }

  _getPrevPageButtonHTML(currPage, totalPages) {
    return `
        <button data-goto="${
          currPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1} / ${totalPages}</span>
        </button>
    `;
  }

  _getNextPageButtonHTML(currPage, totalPages) {
    return `
        <button data-goto="${
          currPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1} / ${totalPages}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
    `;
  }
}

export default new PaginationView();
