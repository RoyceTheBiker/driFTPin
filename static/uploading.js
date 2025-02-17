class Uploading {
  itemData = [];
  constructor() {}

  newUpload() {
    // Send a click event to the hidden input in index.html
    $('#uploadFileInput').click();
  }

  uploadFileEvent(fileName) {
    // Dynamically build a Form to send the file inside of
    let formData = new FormData();
    formData.append("formData", $("#uploadFileInput").prop("files")[0], fileName);
    formData.append("upload_file", true);

    $.ajax({
      type: 'POST',
      url: '/uploadFile',
      enctype: 'multipart/form-data',
      contentType: false,
      processData: false,
      cache: false,
      data: formData,
      success: function () {
        populateProjectsTable();
      },
      error: () => {
        console.error('Dang!');
      }
    });
  }

  loadData(callback) {
    console.log('loadData(');

    // if descFilter is set but nameFilter is not, change & to ?
    if(args) { args = args.replace(/^\&/, '?') }

    $.getJSON('/uploaded', (jsonData) => {
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

  loadUploadingTable() {
    console.time('loadUploadingTable');
    $.get('/static/uploading.html', (pageData) => {
      $('#contentDiv').html(pageData);

      // Set the change event for the filter input boxes
      $('#nameFilter').on('input', () => {
        this.loadData();
      });
      $('#descriptionFilter').on('input', () => {
        this.loadData();
      });


      this.loadData(() => {
        console.timeEnd('loadUploadingTable');
      });
    });
  }
}

let uploading = new Uploading();