// Global place holder for the modal dialog box
let buttonAction = () => { }

/**
 * Front Loader dynamically loads JS files
 * with a timestamp to prevent caching.
 */
function frontLoader(callback) {
  let scripts = [];

  // Add JS files to be loaded. The js file extension is appended
  scripts.push({ name: 'about', done: false });
  scripts.push({ name: 'items', done: false });

  scripts.forEach((s) => {
    let bodyScript = document.createElement('script');
    bodyScript.type = 'text/javascript';
    bodyScript.src = '/static/' + s.name + '.js?' + Date.now();
    bodyScript.addEventListener('load', () => {
      let allDone = true;
      scripts.forEach( (sSet, i, a) => {
        if(sSet.name === s.name) {
          sSet.done = true;
        } else {
          if(sSet.done === false) {
            allDone = false;
          }
        }
        if(i === a.length - 1) {
          if(allDone === true) {
            callback();
          }
        }
      })
    });
    document.head.appendChild(bodyScript);
  });
}

function setupIndex() {

  frontLoader(() => {
    console.log('after all the JavaScript files are loaded, do this stuff...');

    // Scroll to top of page on load
    $(document).scrollTop(0);
    about.sayHello();

    items.loadItemsTable();
  });
}
