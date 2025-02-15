class Filtering {
  itemData = [];
  constructor() {}

  loadData(callback) {
    console.log('loadData(');
    let nameFilter = ( $('#nameFilter').val() ) ? '?nameFilter='+$('#nameFilter').val() : '';
    let descFilter = ( $('#descriptionFilter').val() ) ? '&descriptionFilter='+$('#descriptionFilter').val() : '';

    // If either are set
    let args = '' + nameFilter + descFilter;

    // if descFilter is set but nameFilter is not, change & to ?
    if(args) { args = args.replace(/^\&/, '?') }

    $.getJSON('/filteredItems' + args, (jsonData) => {
      let rowIndex = 0;
      this.itemData = jsonData;
      // blank the table
      $('.filteredTableRow').remove();
      jsonData.forEach( (jD, index, array) => {
        const oddRowClass = (rowIndex++ & 1) ? 'row-odd' : 'row-even';
        $('#filteredTable tr:last').after('<tr class="' + oddRowClass +
          ' filteredTableRow"><td>' + jD.name + '</td><td>' + jD.description +
          '</td><td>' + jD.quantity + '</td></tr>');
        if(index === array.length - 1) {
          if(callback) {
            callback();
          }
        }
      });
    });
  }

  loadFilteringTable() {
    console.time('loadFilteringTable');
    $.get('/static/filtering.html', (pageData) => {
      $('#contentDiv').html(pageData);

      // Set the change event for the filter input boxes
      $('#nameFilter').on('input', () => {
        this.loadData();
      });
      $('#descriptionFilter').on('input', () => {
        this.loadData();
      });


      this.loadData(() => {
        console.timeEnd('loadFilteringTable');
      });
    });
  }
}

let filtering = new Filtering();