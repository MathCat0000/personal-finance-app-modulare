export function paginationControls(result, viewName) {
  return `<div class="pagination" aria-label="Pagination">
    <button type="button" class="btn btn--secondary" data-page-view="${viewName}" data-page="${result.currentPage - 1}" ${result.hasPrev ? "" : "disabled"}>Prev</button>
    <span>Page ${result.currentPage} of ${result.totalPages}</span>
    <button type="button" class="btn btn--secondary" data-page-view="${viewName}" data-page="${result.currentPage + 1}" ${result.hasNext ? "" : "disabled"}>Next</button>
  </div>`;
}
