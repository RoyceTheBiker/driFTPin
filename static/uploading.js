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

  downloadFile(filename) {
    console.log('download filename %s', filename);
    $('#download_anchor').attr( {target: '_blank', href: '/download/' + filename });

  }

  loadData(callback) {
    console.log('loadData(');
    $.getJSON('/uploaded', (jsonData) => {
      jsonData.forEach( (jD, index, array) => {
        console.log('append to fileCards %s', jD.filename);
        let e = $('<div class="fileCard" onclick="uploading.downloadFile(\'' +  jD.filename +
          '\')"><div class="title">' + jD.filename + '</div><div class="sizeInfo">size: ' +
          jD.size + ' bytes</div><div class="typeInfo">type: ' + jD.type + '</div></div>')
        $('#fileCards').append(e);
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
      this.loadData(() => {
        console.timeEnd('loadUploadingTable');
      });
    });
  }
}

let uploading = new Uploading();