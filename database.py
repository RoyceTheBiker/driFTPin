from fastapi import APIRouter, UploadFile
from tinydb import TinyDB, Query
import logging
import re
import math
from os import listdir
from os.path import isfile, isdir, os
from pydantic import BaseModel

class Database:
  def __init__(self, name: str, log: logging):
    # Empty constructor needs a pass
    #pass

    self.log = log
    self.log.info("Database")
    self.name = name

    if not os.path.isfile("driFTPin.json"):
      self.buildSampleDB()

    self.router = APIRouter()
    self.router.add_api_route("/filteredItems", self.getFilteredItems, methods=["GET"])
    self.router.add_api_route("/mappedItems", self.getMappedItems, methods=["GET"])
    self.router.add_api_route("/items", self.getItems, methods=["GET"])
    self.router.add_api_route("/item", self.newItem, methods=["POST"])
    self.router.add_api_route("/item", self.updateItem, methods=["PUT"])
    self.router.add_api_route("/words", self.getWords, methods=["GET"])

  # Check the quantity and set the status field
  def checkQuantity(self, srcObj):
    orderStatus = "Re-order" if int(srcObj["quantity"]) < 10 else "In stock"
    srcObj.update({ "status": orderStatus})
    return srcObj

  def getMappedItems(self):
    table = TinyDB("driFTPin.json").table("items")
    allReturnData = list(map(self.checkQuantity, table.all()))
    return allReturnData


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


  # This reads the source code files to get identifiers to build a sample DB with
  def sampleWordsFromCode(self, readDir: str = "./"):
    # Use a set to only add unique values
    words = set([])
    for entry in listdir(path=readDir):
      if isfile(entry):
        for nE in self.readIdentifiers(entry):
          words.add(nE)

      if isdir(entry):
        self.log.debug("sample dir")
        self.sampleWordsFromCode(entry)

    return words

  def readIdentifiers(self, pathFile: str):
    # Use a set to only add unique values
    returnSet = set([])
    self.log.debug(f"readIdentifiers {pathFile}")
    with open(pathFile, "r") as readFile: 
      try:
        for line in readFile:
          for ident in re.split('[^a-zA-Z]', line):
            # Only words longer than 4 letters
            if len(ident) > 4:
              returnSet.add(ident)

      # Don't error if file is not readable text, like png and xcf files.
      except:
        pass

    return returnSet

  def buildSampleDB(self):
    db = TinyDB("driFTPin.json")
    self.log.info('Make new DB file')
    table = db.table("items")
    table.insert({ "name": "Milk", "description": "Dairy", "quantity": 6})
    table.insert({ "name": "Cheese", "description": "Dairy", "quantity": 20})
    table.insert({ "name": "Eggs", "description": "Poultry", "quantity": 3})
    table.insert({ "name": "Orange Juice", "description": "Juice", "quantity": 12})
    table.insert({ "name": "Banana", "description": "Fruit", "quantity": 1})

    table.insert({ "name": "Pork", "description": "Meat", "quantity": 8})
    table.insert({ "name": "Beef", "description": "Meat", "quantity": 15})
    table.insert({ "name": "Fish", "description": "Meat", "quantity": 13})
    table.insert({ "name": "Chicken", "description": "Poultry Meat", "quantity": 17})
    table.insert({ "name": "Turkey", "description": "Poultry Meat", "quantity": 4})

    table = db.table("words")
    index = 0
    for w in self.sampleWordsFromCode("./"):
      table.insert({ "id": index, "word": w})
      index += 1

    db.close()
    self.log.info(f"Sample DB has been built. The 'words' table contains {index} entries.")

  def getItems(self):
    table = TinyDB("driFTPin.json").table("items")
    return table.all()

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

  def updateItem(self, item: Item):
    table = TinyDB("driFTPin.json").table("items")
    table.update({
      "description": item.description,
      "quantity": item.quantity
    }, Query().name == item.name)
    return "ok"

  def fileSaved(self, formData: UploadFile):
    table = TinyDB("driFTPin.json").table("uploads")
    table.insert({ "filename": formData.filename, "size": formData.size, "type": formData.content_type})

  def getSavedFiles(self):
    table = TinyDB("driFTPin.json").table("uploads")
    return table.all()

  def lookupFile(self, filename: str):
    if filename:
      table = TinyDB("driFTPin.json").table("uploads")
      fileEntry = table.search(Query().filename == filename)
      if fileEntry and fileEntry[0]:
        return fileEntry[0]["filename"]
      else:
        return None
