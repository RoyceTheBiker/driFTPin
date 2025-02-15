# driFTPin
This is a fork of another backend using FastAPI & TinyDB that is actively being developed.
Check back often and expect frequent updates to this project.

This is an example project of a micro full-stack using these backend tools is a backend framework much like
 - [FastAPI](https://fastapi.tiangolo.com/)
 - [TinyDB](https://tinydb.readthedocs.io/en/latest/)
 - [Python](https://www.python.org/)

The frontend uses raw
 - [HTML](https://www.w3schools.com/html/)
 - [CSS](https://www.w3schools.com/css/)
 - [jQuery](https://www.w3schools.com/jQuery/)

For the frontend the term **raw** implies there is no generation step, files are served statically to the browser.
This is in contrast to a frontend like
[React](https://react.dev/) or
[Angular](https://angular.dev/)
that require compilation before sending to the browser.

Generated frontends like React and Angular are rich, dynamic, and feature-loaded to create faster, more engaging web pages to enhance user experience.
[driFTPin](https://gitlab.com/SiliconTao-open-source/driFTPin) gives you none of that 😂,
but you are free to expand on this open-source project and let me know what you have built.

## Installing
The installation requires a setup of the Python environment.

```bash
python3 -m venv .venv
source .venv/bin/activate
.venv/bin/pip install tinydb uvicorn "fastapi[standard]"
```

The source code is on [GitLab](https://gitlab.com/SiliconTao-open-source/driFTPin)

## Starting The Backend
There are two ways to start it depending on preference.


### Starting Uvicorn
[Uvicorn](https://www.uvicorn.org/) handles TCP connections much like [NodeJS](https://nodejs.org/en) is for ExpressJS.
Starting uvicorn will start the FastAPI service.
```bash
./.venv/bin/python3 -m uvicorn main:app --reload
```

### Starting FastAPI
FastAPI is a backend framework much like [ExpressJS](https://expressjs.com/) is for NodeJS.
Starting FastAPI will start uvicorn.


## Open The Page
Once the backend has started, open your web browser to [http://127.0.0.1:8000](http://127.0.0.1:8000)

## FastAPI Swagger
FastAPI automagically generates a Rest interface at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

# Code Blocks

## Front Loader
This JavaScript function dynamically loads JS files with a timestamp to prevent browser caching. Once all the JS files have been loaded the callback resumes the start up of the page.

This is not something that is normally done, but can be helpful in micro and test environments.
```javascript
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
```
