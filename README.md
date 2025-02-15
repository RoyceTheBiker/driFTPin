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

## Links
Project homepage on [SiliconTao.com](https://silicontao.com/main/marquis/article/RoyceTheBiker/driFTPin)

Project repository on [GitLab](https://gitlab.com/SiliconTao-open-source/driFTPin)


## Installing
The installation requires a setup of the Python environment.

```bash
python3 -m venv .venv
source .venv/bin/activate
.venv/bin/pip install tinydb uvicorn "fastapi[standard]"
```

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
[items.js](static/items.js)
```javascript
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
```

The backend uses a model class **Item** to deserialize the object.

[database.py](database.py)
```python
class Item(BaseModel):
  name: str
  description: str
  quantity: str

def newItem(self, item: Item):
  # Using the formatted string Python can deserialize JSON data using the = after the variable name
  self.log.info(f"newItem {item=}")
  table = TinyDB("driFTPin.json").table("items")
  table.insert({
    "name": item.name,
    "description": item.description,
    "quantity": item.quantity
  })
  return "ok"
```

### PUT
PUT works almost the same as POST but to update an existing entry it needs to use a key filed to match.
This PUT uses the **name** field to update the entry. To locate the entry that needs to be updated,
the **Query()** function is used to match the name field.

[database.py](database.py)
```python
def updateItem(self, item: Item):
  table = TinyDB("driFTPin.json").table("items")
  table.update({
    "description": item.description,
    "quantity": item.quantity
  }, Query().name == item.name)
  return "ok"
```

## Sample Data
Sample data is created and saved to the **driFTPin.json** file.

The ``items`` table lets the user enter three values and update the entries.
```python
db = TinyDB("driFTPin.json")
self.log.info('Make new DB file')
table = db.table("items")
table.insert({ "name": "Red Ball", "description": "Apple", "quantity": 6})
table.insert({ "name": "Tall Bush", "description": "Tree", "quantity": 200})
table.insert({ "name": "Green Stick", "description": "Pickle", "quantity": 3})
table.insert({ "name": "Orange", "description": "An orange", "quantity": 12})
table.insert({ "name": "Yellow Stick", "description": "Banana", "quantity": 1})
```


The ``words`` table is built from the source code in this project. The goal is to create a larger table to show how pagination works.

These methods navigate into the local directory and read identifiers (whole words) from the code then add those words to a ``set`` of unique entries.

[database.py](database.py)
```python
# This reads the source code files to get identifiers to build a sample DB with
def sampleWordsFromCode(self, readDir: str = "./"):
  # Use a set to only add unique values
  words = set([])
  for entry in listdir(path=readDir):
    if isfile(entry):
      for nE in self.readIdentifiers(entry):
        words.add(nE)

    if isdir(entry):
      self.sampleWordsFromCode(entry)

  return words

def readIdentifiers(self, pathFile: str):
  # Use a set to only add unique values
  returnSet = set([])
  with open(pathFile, "r") as readFile:
    for line in readFile:
      for ident in re.split('[^a-zA-Z]', line):
        # Only words longer than 4 letters
        if len(ident) > 4:
          returnSet.add(ident)
  return returnSet
```

## Pagination For Fast Loading
Viewing large tables is slow and can quickly overwhelm users with too much information.

Pagination allows viewing smaller amounts of data page by page.

The logic of Pagination is simple, define the range limits, start, size, and end; and keep track of the current page. Recalculate when navigating to another page.

In this example the Python operator **lambda** is used to sort the objects. Python ``sort()`` works on simple list entries, but cannot be used here on objects.
The lambda operator builds a function inline with given arguments. In this example the argument sets the sort key on the element value for ``word``.

The pagination method returns an object with two elements, ``pagination``, and ``data``.

[database.py](database.py)
```python
# Arguments of range start and end are optional and have default values if not given
def getWords(self, rangeStart: int = 0, rangeEnd: int = 10):
  table = TinyDB("driFTPin.json").table("words")
  allReturnData = sorted(table.all(), key = lambda k: k["word"])
  pageSize = rangeEnd - rangeStart
  returnObj = { "pagination": {
    "currentPage": math.ceil(rangeStart / pageSize),
    "pageCount": math.ceil(len(allReturnData) / pageSize),
    "recordCount": len(allReturnData)
  }, "data": allReturnData[rangeStart:rangeEnd] }

  return returnObj
```

[pagination.js](static/pagination.js)
```javascript
  goToPage(pageNumber) {
    if((pageNumber < 0) || (pageNumber >= this.pageCount)) {
      return;
    }
    // Open the inspection view and watch the console to see page loading times
    console.time('goToPage');
    this.rangeStart = pageNumber * this.rangeSize;
    this.loadData( () => {
      console.timeEnd('goToPage');
    });
  }

  loadData(callback) {
    $.getJSON('/words?rangeStart=' + this.rangeStart + '&rangeEnd=' + (this.rangeStart + this.rangeSize), (jsonData) => {
      this.currentPage = jsonData.pagination.currentPage;
      this.pageCount = jsonData.pagination.pageCount;
      this.recordCount = jsonData.pagination.recordCount;
      $('#currentPage').html('Page ' + (this.currentPage + 1) + ' of ' + this.pageCount);

      let rowIndex = 0;
      this.itemData = jsonData;
      // blank the table
      $('.pageTableRow').remove();
      jsonData.data.forEach( (jD, index, array) => {
        const oddRowClass = (rowIndex++ & 1) ? 'row-odd' : 'row-even';
        $('#pageTable tr:last').after('<tr class="' + oddRowClass +
          ' pageTableRow"><td>' + jD.word + '</td></tr>');
        if(index === array.length - 1) {
          callback();
        }
      });
    });
  }
  ```

