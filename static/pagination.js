class Pagination {
  currentPage = 0;
  pageCount = 0;
  recordCount = 0;
  rangeStart = 0;
  rangeSize = 10;
  sorting = '';

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

  sortBy(field, direction) {
    if(this.sorting) {
      $('#' + this.sorting).removeClass('sorting');
      $('#' + this.sorting).addClass('notsorting');
    }
    if(this.sorting === field + '_' + direction) {
      // Turn sorting off and reload the table
      this.sorting = '';
    } else {
      this.sorting = field + '_' + direction;
      $('#' + this.sorting).removeClass('notsorting');
      $('#' + this.sorting).addClass('sorting');
    }
    console.time('sort by');
    this.loadData( () => {
      console.timeEnd('sort by');
    })
  }

  loadData(callback) {
    let requestArgs = '?rangeStart=' + this.rangeStart;
    requestArgs += '&rangeEnd=' + (this.rangeStart + this.rangeSize);
    if(this.sorting) {
      requestArgs += '?sorting=' + this.sorting;
    }
    $.getJSON('/words' + requestArgs, (jsonData) => {
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
        let newRow = '<tr class="' + oddRowClass + ' pageTableRow"><td>' + jD.word + '</td>';
        newRow += '<td>' + jD.len + '</td><td>' + jD.vowels + '</td></tr>';
        $('#pageTable tr:last').after(newRow);
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
