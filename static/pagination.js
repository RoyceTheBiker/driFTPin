class Pagination {
  currentPage = 0;
  pageCount = 0;
  recordCount = 0;
  rangeStart = 0;
  rangeSize = 10;

  constructor() {}

  goToPage(pageNumber) {
    if((pageNumber < 0) || (pageNumber >= this.pageCount)) {
      return;
    }
    // Open the inspection view and watch the console to see page loading times
    console.time('goToPage');
    this.rangeStart = pageNumber * this.rangeSize;
    this.loadData( () => {
      console.timeEnd('goToPage');
    });
  }

  loadData(callback) {
    $.getJSON('/words?rangeStart=' + this.rangeStart + '&rangeEnd=' + (this.rangeStart + this.rangeSize), (jsonData) => {
      this.currentPage = jsonData.pagination.currentPage;
      this.pageCount = jsonData.pagination.pageCount;
      this.recordCount = jsonData.pagination.recordCount;
      $('#currentPage').html('Page ' + (this.currentPage + 1) + ' of ' + this.pageCount);

      let rowIndex = 0;
      this.itemData = jsonData;
      // blank the table
      $('.pageTableRow').remove();
      jsonData.data.forEach( (jD, index, array) => {
        const oddRowClass = (rowIndex++ & 1) ? 'row-odd' : 'row-even';
        $('#pageTable tr:last').after('<tr class="' + oddRowClass +
          ' pageTableRow"><td>' + jD.word + '</td></tr>');
        if(index === array.length - 1) {
          callback();
        }
      });
    });
  }

  loadPageableTable() {
    console.time('loadPageableTable');
    $.get('/static/pagination.html', (pageData) => {
      $('#contentDiv').html(pageData);
      this.loadData(() => {
        console.timeEnd('loadPageableTable');
      });
    });
  }

  getCurrentPage() {
    return this.currentPage;
  }

  getPageCount() {
    console.log('get page count %s', this.pageCount);
    return this.pageCount;
  }
}

let pagination = new Pagination();