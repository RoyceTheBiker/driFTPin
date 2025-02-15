class Items {
  itemData = [];
  constructor() {}

  newItem() {
    $.get('/static/itemEdit.html', (pageData) => {
      $('#dialogDiv').html(pageData);
      $('#dialogTittle').html('New Item');
      $('#modalDialog')[0].showModal();
      $('.inputBox').removeClass('noElement');
      $('#inputLabel').html('Name:');
      $('#inputBox').val('');
      $('#inputBox').prop('placeholder', 'new name');
      $('#inputLabel2').html('Title:');
      $('#inputBox2').val('');
      $('#inputBox2').prop('placeholder', 'new title');
      $('#inputLabel3').html('Quantity:');
      $('#inputBox3').val('');
      $('#inputBox3').prop('placeholder', '7');
      buttonAction = () => {
        // if the ok button is clicked this happens
        $.ajax({
          url: '/item',
          type: 'POST',
          data: JSON.stringify({
            'name': $('#inputBox').val(),
            'title': $('#inputBox2').val(),
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
      }
    })
  }

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
      $('#inputLabel2').html('Title:');
      $('#inputBox2').val(selectedItem.title);
      $('#inputBox2').prop('placeholder', 'new title');
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
            'title': $('#inputBox2').val(),
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

  loadData() {
    $.getJSON('/items', (jsonData) => {
      let rowIndex = 0;
      this.itemData = jsonData;
      // blank the table
      $('.itemsTableRow').remove();
      jsonData.forEach( (jD) => {
        const oddRowClass = (rowIndex++ & 1) ? 'row-odd' : 'row-even';
        $('#itemsTable tr:last').after('<tr class="' + oddRowClass +
          ' itemsTableRow" onclick="items.editItem(\'' + jD.name + '\')"><td>' + jD.name + '</td><td>' + jD.title +
          '</td><td>' + jD.quantity + '</td></tr>');
      });
    });
  }


}

let items = new Items();