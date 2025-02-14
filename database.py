from fastapi import APIRouter
from tinydb import TinyDB, Query
import logging
import math
from pydantic import BaseModel

class Database:
  def __init__(self, name: str, log: logging):
      # Empty constructor needs a pass
      #pass
      self.db = TinyDB("driFTPin.json")
      self.log = log
      self.log.info("Database")
      self.name = name
      self.router = APIRouter()
      self.router.add_api_route("/items", self.getItems, methods=["GET"])
      self.router.add_api_route("/item", self.newItem, methods=["POST"])
      self.router.add_api_route("/item", self.updateItem, methods=["PUT"])

  def getItems(self):
    table = self.db.table("items")
    return table.all()

  class Item(BaseModel):
    name: str
    title: str
    age: int

  def newItem(self, item: Item):
    # Using the formatted string Python can deserialize JSON data using the = after the variable name
    self.log.info(f"newItems {item=}")
    table = self.db.table("items")
    table.insert(item)

  def updateItem(self, item: Item):
    table = self.db.table("items")
    table.update(item, Query().name == item.name)
