class Items {
  constructor() {}

  newItem() {
    console.log('show popup for a new item');
  }

  loadData() {
    $.getJSON('/items', (jsonData) => {
      let rowIndex = 0;
      jsonData.forEach( (jD) => {
        const oddRowClass = (rowIndex++ & 1) ? 'row-odd' : 'row-even';
        $('#itemsTable tr:last').after('<tr class="' + oddRowClass +
          ' jsonFilesRow"><td>' + jD.name + '</td><td>' + jD.title +
          '</td><td>' + jD.quantity + '</td></tr>');
      });
    });
  }
}

let items = new Items();