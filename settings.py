from fastapi import APIRouter
from tinydb import TinyDB, Query
import logging
from pydantic import BaseModel
from typing import Optional
from os.path import os

class Settings:
    def __init__(self, name: str, log: logging):
        self.log = log
        self.log.info("Settings")
        self.name = name

        self.router = APIRouter()
        self.router.add_api_route("/settings", self.getSettings, methods=["GET"])
        self.router.add_api_route("/setting", self.setSetting, methods=["POST"])

        if not os.path.isfile("settings.json"):
            self.buildDB()

    def buildDB(self):
        self.addSetting("DriFTPin Info", "Display")
        self.addSetting("nothingToSeeHere", "Display", 0)
        self.addSetting("Items")
        self.addSetting("Pagination")
        self.addSetting("Filtering")
        self.addSetting("Mapping")
        self.addSetting("Uploading")
        self.addSetting("About")

    def addSetting(self, saveSet: str, group: Optional[str] = None, value: Optional[int] = None):
        table = TinyDB("settings.json").table("settings")
        table.insert({ "key": saveSet, "value": value if not value == None else 1, "group": "Feature" if group == None else group })

    def getSettings(self):

        table = TinyDB("settings.json").table("settings")

        # Never do this in PROD. Some settings must be hidden from the public.
        return table.all() 

    class SettingKV(BaseModel):
        key: Optional[str] = None
        value: Optional[int] = None
        group: Optional[str] = None

    def setSetting(self, setting_values: SettingKV):
        self.log.info(f"setSetting {setting_values=}")
        self.log.info("value " + str(setting_values.value))
        # Look for pre-existing setting by finding key name
        # If found update it, if not create a new entry.
        table = TinyDB("settings.json").table("settings")
        entry = table.search(Query().key == setting_values.key)
        self.log.info("look for key")
        if entry and entry[0]:
            entry[0]["value"] = setting_values.value
            if setting_values.group:
                entry[0]["group"] = setting_values.group

            self.log.info("update Setting")
            table.update({
                "value": entry[0]["value"],
                "group": entry[0]["group"]},
                Query().key == setting_values.key)
                 
        else:
            self.log.info("insert into Settings")
            table.insert(setting_values)

