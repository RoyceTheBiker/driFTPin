class Pagination {
  currentPage = 0;
  rangeStart = 0;
  rangeSize = 10;

  constructor() {}

  loadData(callback) {
    $.getJSON('/items', (jsonData) => {
      let rowIndex = 0;
      this.itemData = jsonData;
      // blank the table
      $('.itemsTableRow').remove();
      jsonData.forEach( (jD, index, array) => {
        const oddRowClass = (rowIndex++ & 1) ? 'row-odd' : 'row-even';
        $('#itemsTable tr:last').after('<tr class="' + oddRowClass +
          ' itemsTableRow" onclick="items.editItem(\'' + jD.name + '\')"><td>' + jD.name + '</td><td>' + jD.title +
          '</td><td>' + jD.quantity + '</td></tr>');
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

}

let pagination = new Pagination();