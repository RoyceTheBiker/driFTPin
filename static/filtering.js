class Items {
  itemData = [];
  constructor() {}

  editItem(itemName) {
    let selectedItem = this.itemData.find( (i) => i.name === itemName);
    $.get('/static/itemEdit.html', (pageData) => {
      $('#dialogDiv').html(pageData);
      $('#dialogTittle').html('Edit ' + itemName);
      $('#modalDialog')[0].showModal();
      $('.inputBox').removeClass('noElement');
      $('#inputLabel').html('Name:');
      $('#inputBox').prop('disabled', true);
      $('#inputBox').val(itemName);
      $('#inputLabel2').html('Description:');
      $('#inputBox2').val(selectedItem.description);
      $('#inputBox2').prop('placeholder', 'new description');
      $('#inputLabel3').html('Quantity:');
      $('#inputBox3').val(selectedItem.quantity);
      $('#inputBox3').prop('placeholder', '7');
      buttonAction = () => {
        // if the ok button is clicked this happens
        $.ajax({
          url: '/item',
          type: 'PUT',
          data: JSON.stringify({
            'name': $('#inputBox').val(),
            'description': $('#inputBox2').val(),
            'quantity': $('#inputBox3').val()
          }),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function () {
            items.loadData();
          },
          error: () => {
            console.error('Dang!');
          }
        });

      };
    })
  }

  loadData(callback) {
    $.getJSON('/items', (jsonData) => {
      let rowIndex = 0;
      this.itemData = jsonData;
      // blank the table
      $('.itemsTableRow').remove();
      jsonData.forEach( (jD, index, array) => {
        const oddRowClass = (rowIndex++ & 1) ? 'row-odd' : 'row-even';
        $('#itemsTable tr:last').after('<tr class="' + oddRowClass +
          ' itemsTableRow" onclick="items.editItem(\'' + jD.name + '\')"><td>' + jD.name + '</td><td>' + jD.description +
          '</td><td>' + jD.quantity + '</td></tr>');
        if(index === array.length - 1) {
          callback();
        }
      });
    });
  }

  loadItemsTable() {
    console.time('loadItemsTable');
    $.get('/static/items.html', (pageData) => {
      $('#contentDiv').html(pageData);
      this.loadData(() => {
        console.timeEnd('loadItemsTable');
      });
    });
  }
}

let items = new Items();