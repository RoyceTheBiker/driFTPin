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

This is not something that is normally done but can be helpful in micro and test environments.
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

## Ajax JSON PUT & POST
jQuery put and post doesn't support sending JSON as an object. The JSON can be stringified to send and parsed in the backend, but the **$.ajax** function is used to send the JSON as an object.

### POST
```javascript
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
```

The backend uses a model class **Item** to deserialize the object.

```python
class Item(BaseModel):
  name: str
  title: str
  quantity: str

def newItem(self, item: Item):
  # Using the formatted string Python can deserialize JSON data using the = after the variable name
  self.log.info(f"newItem {item=}")
  table = TinyDB("driFTPin.json").table("items")
  table.insert({
    "name": item.name,
    "title": item.title,
    "quantity": item.quantity
  })
  return "ok"
```

### PUT
PUT works almost the same as POST but to update an existing entry it needs to use a key filed to match.
This PUT uses the **name** field to update the entry. To locate the entry that needs to be updated,
the **Query()** function is used to match the name field.

```python
def updateItem(self, item: Item):
  table = TinyDB("driFTPin.json").table("items")
  table.update({
    "title": item.title,
    "quantity": item.quantity
  }, Query().name == item.name)
  return "ok"
```