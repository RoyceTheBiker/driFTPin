class Settings {

  constructor() {
    console.log('load active page list');
    $.getJSON('/settings', (settingsData) => {

    });
  }

  loadSettings() {
    console.time('loadSettings');
    $.get('/static/settings.html', (pageData) => {
      $('#contentDiv').html(pageData);

      this.loadData( () => {
        console.timeEnd('loadSettings');
      });
    });
  }

  loadData(callback) {
    $.getJSON('/settings', (settingData) => {
      console.log('settingsData %s', JSON.stringify(settingData));
      $('.settingsRow').remove();
      settingData.forEach( (sD, index, array) => {
        let tRD = '<tr class="settingsRow"><td>' + sD.key + '</td>';
        tRD += '<td>' + sD.group + '</td>';
        if((sD.value === 0) || (sD.value === 1)) {
          tRD += '<td><div id="slider-' + sD.key + '" ';
          tRD += 'class="mx-5 ui-slider ui-corner-all ui-slider-horizontal ';
          tRD += 'ui-widget ui-widget-content" data-value="' + sD.value + '"></td></tr>';

        } else {
          tRD += '<td>' + sD.value + '</td></tr>';
        }

        $('#settingsTable tr:last').after(tRD);

        if(index === array.length - 1) {
          console.log('set the slider up');
          $('.ui-slider').each( (idx, elm) => {
            $(elm).children('.ui-state-default').css('background-color: #dea;');

            console.log('elm data value %s', $(elm).data('value'));
            $(elm).slider({
              range: false,
              min: 0, 
              max: 1,
              value: $(elm).data('value'),
              slide: function (event, ui) {
                console.log('slide %s %d', event.target.id, ui.value);

                $.ajax({
                  url: '/setting',
                  type: 'POST',
                  data: JSON.stringify( {'key': event.target.id.split('-')[1], 'value': ui.value, 'group': 'Feature' } ),
                  contentType: 'application/json; charset=utf-8',
                  dataType: 'json',
                  success: () => {
                    console.log('saved'); 
                  }
                });
              }
            });
          });
        }
      });
    });
  }
}

let settings = new Settings();
