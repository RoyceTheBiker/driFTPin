from fastapi import APIRouter
from tinydb import TinyDB, Query
import logging
import os
from pydantic import BaseModel

class Database:
  def __init__(self, name: str, log: logging):
      # Empty constructor needs a pass
      #pass

      self.log = log
      self.log.info("Database")
      self.name = name

      if not os.path.isfile("driFTPin.json"):
        db = TinyDB("driFTPin.json")
        self.log.info('Make new DB file')
        table = db.table("items")
        table.insert({ "name": "Red Ball", "title": "Apple", "quantity": 6})
        table.insert({ "name": "Tall Bush", "title": "Tree", "quantity": 200})
        table.insert({ "name": "Green Stick", "title": "Pickle", "quantity": 3})
        table.insert({ "name": "Orange", "title": "An orange", "quantity": 12})
        table.insert({ "name": "Yellow Stick", "title": "Banana", "quantity": 1})
        db.close()

      self.router = APIRouter()
      self.router.add_api_route("/items", self.getItems, methods=["GET"])
      self.router.add_api_route("/item", self.newItem, methods=["POST"])
      # self.router.add_api_route("/item", self.updateItem, methods=["PUT"])

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

  # def updateItem(self, item: Item):
  #   table = TinyDB("driFTPin.json").table("items")
  #   table.update(item, Query().name == item.name)
  #   return "ok"

