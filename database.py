from fastapi import APIRouter
from tinydb import TinyDB, Query
import logging
import re
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
    self.router.add_api_route("/items", self.getItems, methods=["GET"])
    self.router.add_api_route("/item", self.newItem, methods=["POST"])
    self.router.add_api_route("/item", self.updateItem, methods=["PUT"])

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

  def buildSampleDB(self):
    db = TinyDB("driFTPin.json")
    self.log.info('Make new DB file')
    table = db.table("items")
    table.insert({ "name": "Red Ball", "title": "Apple", "quantity": 6})
    table.insert({ "name": "Tall Bush", "title": "Tree", "quantity": 200})
    table.insert({ "name": "Green Stick", "title": "Pickle", "quantity": 3})
    table.insert({ "name": "Orange", "title": "An orange", "quantity": 12})
    table.insert({ "name": "Yellow Stick", "title": "Banana", "quantity": 1})
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

  def updateItem(self, item: Item):
    table = TinyDB("driFTPin.json").table("items")
    table.update({
      "title": item.title,
      "quantity": item.quantity
    }, Query().name == item.name)
    return "ok"

