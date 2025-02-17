# driFTPin
This is an example project for creating a backend using FastAPI & TinyDB with Python.

FastAPI is a backend framework. TinyDB is a NoSQL library for local database storage.

This is an example project of a micro full-stack using these backend tools as a backend framework much like
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

<!-- vscode-markdown-toc -->
* 1. [Links](#Links)
* 2. [Installing](#Installing)
* 3. [Starting The Backend](#StartingTheBackend)
	* 3.1. [Starting With Uvicorn](#StartingWithUvicorn)
	* 3.2. [Starting With FastAPI](#StartingWithFastAPI)
* 4. [Open The Page](#OpenThePage)
* 5. [FastAPI Swagger](#FastAPISwagger)
* 6. [Front Loader](#FrontLoader)
* 7. [Modal Popup Box](#ModalPopupBox)
* 8. [Ajax JSON PUT & POST](#AjaxJSONPUTPOST)
	* 8.1. [POST](#POST)
	* 8.2. [PUT](#PUT)
* 9. [Sample Data](#SampleData)
* 10. [Pagination For Fast Loading](#PaginationForFastLoading)
* 11. [Filtering Data](#FilteringData)
* 12. [Mapping Data](#MappingData)
* 13. [Router Endpoints In A Class](#RouterEndpoints)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

##  1. <a name='Links'></a>Links
Project homepage on [SiliconTao.com](https://silicontao.com/main/marquis/article/RoyceTheBiker/driFTPin)

Project repository on [GitLab](https://gitlab.com/SiliconTao-open-source/driFTPin)


##  2. <a name='Installing'></a>Installing
The installation requires a setup of the Python environment.

```bash
python3 -m venv .venv
source .venv/bin/activate
.venv/bin/pip install tinydb uvicorn "fastapi[standard]"
```

##  3. <a name='StartingTheBackend'></a>Starting The Backend
There are two ways to start it depending on preference. Only one is needed, they both start the service but
they each have a different way of showing output. Try them both and use the one that works best for your needs.


###  3.1. <a name='StartingWithUvicorn'></a>Starting With Uvicorn
[Uvicorn](https://www.uvicorn.org/) handles TCP connections much like [NodeJS](https://nodejs.org/en) is for ExpressJS.
Starting uvicorn will start the FastAPI service.
```bash
./.venv/bin/python3 -m uvicorn main:app --reload
```

###  3.2. <a name='StartingWithFastAPI'></a>Starting With FastAPI
FastAPI is a backend framework much like [ExpressJS](https://expressjs.com/) is for NodeJS.
Starting FastAPI will start uvicorn.

```bash
./.venv/bin/python3 -m fastapi dev main.py
```

##  4. <a name='OpenThePage'></a>Open The Page
Once the backend has started, open your web browser to [http://127.0.0.1:8000](http://127.0.0.1:8000)

##  5. <a name='FastAPISwagger'></a>FastAPI Swagger
FastAPI automagically generates a Rest interface at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

# Code Blocks

##  6. <a name='FrontLoader'></a>Front Loader
This JavaScript function dynamically loads JS files with a timestamp to prevent browser caching. Once all the JS files have been loaded the callback resumes the start up of the page.

This is not normally done but can be helpful in micro and test environments.

[index.js](static/index.js)
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

##  7. <a name='ModalPopupBox'></a>Modal Popup Box
A popup box is helpful to interact with the user without leaving the current page.

This popup box can be altered to get different information from the user.

The HTML remains hidden on the loaded page to be activated by JavaScript when needed.

[index.html](static/index.html)
```html
<dialog id="modalDialog">
  <div id="dialogDiv">Greetings, one and all!</div>
  <form method="dialog">
    <button onclick="if(buttonAction) { buttonAction(); }">OK</button>
    <button id="cancelButton">Cancel</button>
  </form>
</dialog>
```

[index.js](static/index.js) also uses the popup box but this is the minimal code needed to use it.

[about.js](static/about.js)
```javascript
about() {
  $('#dialogDiv').html('This is driFTPin');
  $('#modalDialog')[0].showModal();
  buttonAction = () => {
    // if the ok button is clicked this happens
    alert('button action');
  };
}
```

##  8. <a name='AjaxJSONPUTPOST'></a>Ajax JSON PUT & POST
jQuery put and post doesn't support sending JSON as an object. The JSON can be stringified to send and parsed in the backend, but the **$.ajax** function is used to send the JSON as an object.

###  8.1. <a name='POST'></a>POST
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

###  8.2. <a name='PUT'></a>PUT
PUT works almost the same as POST but to update an existing entry it needs to use a key field to match.
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

##  9. <a name='SampleData'></a>Sample Data
Sample data is created and saved to the **driFTPin.json** file.

The ``items`` table lets the user enter three values and update the entries.

[database.py](database.py)
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
def sampleWordsFromCode(self, readDir: str = "", recursionLimit: int = 2):
  # Use a set to only add unique values
  words = set([])
  if not recursionLimit > 0:
    return words

  for entry in listdir(path=readDir):
    if isfile(readDir + "/" + entry):
      for nE in self.readIdentifiers(readDir + "/" +entry):
        words.add(nE)

    if isdir(readDir + "/" + entry):
      for nE in self.sampleWordsFromCode(readDir + "/" + entry, recursionLimit - 1):
        words.add(nE)

  return words

def readIdentifiers(self, pathFile: str):
  # Use a set to only add unique values
  returnSet = set([])
  with open(pathFile, "r") as readFile:
    try:
      for line in readFile:
        for ident in re.split('[^a-zA-Z]', line):
          # Only words longer than 4 letters
          if len(ident) > 4:
            returnSet.add(ident)

    # Don't error if file is not readable text, like png and xcf files.
    except Exception:
      pass

  return returnSet
```

##  10. <a name='PaginationForFastLoading'></a>Pagination For Fast Loading
Viewing large tables is slow and can quickly overwhelm users with too much information.

Pagination allows viewing smaller amounts of data page by page.

The logic of Pagination is simple, define the range limits, start, size, and end; and keep track of the current page. Recalculate when navigating to another page.

In this example, the Python operator **lambda** is used to sort the objects. Python ``sort()`` works on simple list entries, but cannot be used here on objects.
The lambda operator builds a function in line with the given arguments. In this example, the argument sets the sort key on the element value for ``word``.

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

##  11. <a name='FilteringData'></a>Filtering Data
The filtering example shows how two optional fields can be sent to the backend to create a custom filter.

In this code, the **lambda** operator creates a function to return True if the entry is to be included or False if the entry is to be removed from the set.

[database.py](database.py)
```python
# Build a generic filter function using the lambda operator
def buildFilter(self, fieldName, filterText):
    return lambda dataSet: True if filterText.lower() in dataSet[fieldName].lower() else False

def getFilteredItems(self, nameFilter: str = None, descriptionFilter: str = None):
  table = TinyDB("driFTPin.json").table("items")
  allReturnData = table.all()

  if nameFilter:
      allReturnData = list(filter(self.buildFilter("name", nameFilter), allReturnData))

  if descriptionFilter:
      allReturnData = list(filter(self.buildFilter("description", descriptionFilter), allReturnData))

  return allReturnData
```

##  12. <a name="MappingData"></a>Mapping Data
The **map** iterates over an array and returns a new array. This example uses map to transform the [dict](https://www.w3schools.com/python/python_datatypes.asp) **items** to add a new key and value to each element.

[database.py](database.py)
```python
# Check the quantity and set the status field
def checkQuantity(self, srcObj):
  orderStatus = "Re-order" if int(srcObj["quantity"]) < 10 else "In stock"
  srcObj.update({ "status": orderStatus})
  return srcObj

def getMappedItems(self):
  table = TinyDB("driFTPin.json").table("items")
  allReturnData = list(map(self.checkQuantity, table.all()))
  return allReturnData
```

##  13. <a name="RouterEndpoints"></a>Router Endpoints In A Class
The [main.py](main.py) only has two endpoints to serve the static frontend files.

```python
@app.get("/")
async def read_index():
  return FileResponse('static/index.html')

@app.get("/static/{fileName}")
@app.get("/static/{folderName}/{fileName}")
async def read_static(fileName: str, folderName: str = None):
  return serve_file("static", fileName, folderName)
```

With most of the endpoints in this example being database-related, it is better for code readability and maintenance to have the endpoints in the [database.py](database.py) class. This is done using the APIRouter class that is part of FastAPI.

```python
self.router = APIRouter()
self.router.add_api_route("/filteredItems", self.getFilteredItems, methods=["GET"])
self.router.add_api_route("/mappedItems", self.getMappedItems, methods=["GET"])
self.router.add_api_route("/items", self.getItems, methods=["GET"])
self.router.add_api_route("/item", self.newItem, methods=["POST"])
self.router.add_api_route("/item", self.updateItem, methods=["PUT"])
self.router.add_api_route("/words", self.getWords, methods=["GET"])
```

Each endpoint is assigned to a member inside the **Database** class.

The endpoint ``/items`` is assigned to multiple members because they each have a distinct method associated with it.

With the endpoints defined in the class, the [main.py](main.py) must add the instances router to the main app once the class is instantiated.

```python
dBase = Database("Database", log)
app.include_router(dBase.router)
```