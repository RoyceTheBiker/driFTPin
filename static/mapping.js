class Mapping {
  itemData = [];
  constructor() {}

  loadData(callback) {
    console.log('loadData(');
    $.getJSON('/mappedItems', (jsonData) => {
      let rowIndex = 0;
      // blank the table
      $('.mappedTableRow').remove();
      jsonData.forEach( (jD, index, array) => {
        const oddRowClass = (rowIndex++ & 1) ? 'row-odd' : 'row-even';
        $('#mappedTable tr:last').after('<tr class="' + oddRowClass +
          ' filteredTableRow"><td>' + jD.name + '</td><td>' + jD.description +
          '</td><td>' + jD.quantity + '</td><td>' + jD.status + '</td></tr>');
        if(index === array.length - 1) {
          if(callback) {
            callback();
          }
        }
      });
    });
  }

  loadMappingTable() {
    console.time('loadMappingTable');
    $.get('/static/mapping.html', (pageData) => {
      $('#contentDiv').html(pageData);

      // Set the change event for the filter input boxes
      $('#nameFilter').on('input', () => {
        this.loadData();
      });
      $('#descriptionFilter').on('input', () => {
        this.loadData();
      });


      this.loadData(() => {
        console.timeEnd('loadMappingTable');
      });
    });
  }
}

let mapping = new Mapping();