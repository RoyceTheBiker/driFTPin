class About {
  constructor() {
    console.log('This is the about JavaScript');
  }

  sayHello() {
    console.log('Hello from the about.js file');
  }

  about() {
    $('#dialogDiv').html('This is driFTPin');
    $('#modalDialog')[0].showModal();
    buttonAction = () => {
      // if the ok button is clicked this happens
      alert('button action');
    };
  }
}

let about = new About();