from database import Database
from fastapi import FastAPI, HTTPException
from starlette.responses import FileResponse
import logging
from os import listdir
from os.path import isfile, isdir

log = logging.getLogger("uvicorn")
log.setLevel(logging.DEBUG)

description = """
driFTPin full-stack example project using FastAPI & TinyDB
"""

# https://fastapi.tiangolo.com/tutorial/metadata/#license-identifier
app = FastAPI(title="driFTPin Web Portal", description=description)
dBase = Database("Database", log)
app.include_router(dBase.router)

# GET / loads index.html
@app.get("/")
async def read_index():
  return FileResponse('static/index.html')


@app.get("/static/{fileName}")
@app.get("/static/{folderName}/{fileName}")
async def read_static(fileName: str, folderName: str = None):
  return serve_file("static", fileName, folderName)



def serve_file(pathName: str, fileName: str, folderName: str = None):
  if folderName:
    fileName = folderName + "/" + fileName

  staticFiles = []
  for entry in listdir(path="static/"):
    if isfile("static/" + entry):
      staticFiles.append(entry)
    if isdir("static/" + entry):
      for sub in listdir(path="static/" + entry):
        if isfile("static/" + entry + "/" + sub):
          staticFiles.append(entry + "/" + sub)

  if fileName in staticFiles:
    return FileResponse('static/' + fileName)

  raise HTTPException(status_code=404, detail="Item not found")
