// Global place holder for the modal dialog box
let buttonAction = () => { }

/**
 * Front Loader dynamically loads JS files
 * with a timestamp to prevent caching.
 */
function frontLoader(callback) {
  let scripts = [];

  // Add JS files to be loaded. The js file extension is appended
  scripts.push('about');
  scripts.push('items');
  scripts.push('pagination');
  scripts.push('filtering');
  scripts.push('mapping');
  scripts.push('uploading');
  scripts.push('settings');

  let sequenceLoader = (scriptUri) => {
    let bodyScript = document.createElement('script');
    bodyScript.type = 'text/javascript';
    bodyScript.src = '/static/' + scriptUri + '.js?' + Date.now();
    bodyScript.addEventListener('load', () => {
      if(scripts.length > 0) {
        sequenceLoader(scripts.shift());
      } else {
        callback();
      }
    });
    document.head.appendChild(bodyScript);
  }
  sequenceLoader(scripts.shift());
}

function setupIndex() {

  frontLoader(() => {
    console.log('after all the JavaScript files are loaded, do this stuff...');

    // Scroll to top of page on load
    $(document).scrollTop(0);
    about.sayHello();

    // get settings and only show active features
    $.getJSON('/settings', (settingData) => {
      let loadPage = null;
      let loadDisplay = null;
      settingData.forEach( (sD, index, array) => {
        if(sD.group === 'Feature') {
          if(sD.value === 0) {
            $('#featureButton-' + sD.key).addClass('noElement');
          } else {
            $('#featureButton-' + sD.key).removeClass('noElement');
            if(!loadPage) {
              loadPage = sD.key;
            }
          }
        }
        if(sD.group === 'Display') {
          if((sD.value === 1) && (!loadDisplay)) {
            loadDisplay = sD.key;
          }
        }
      });
      if(loadDisplay) {
        $.get('static/' + loadDisplay + '.html', (pageData) => {
          $('#driFTPinInfo').html(pageData);
        });
      }
    });

    items.loadItemsTable();
  });
}
