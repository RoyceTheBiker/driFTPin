from database import Database
from settings import Settings
from fastapi import FastAPI, HTTPException, UploadFile
from starlette.responses import FileResponse
import logging
from os import listdir
from os.path import isfile, isdir
from pathlib import Path

log = logging.getLogger("uvicorn")
log.setLevel(logging.DEBUG)

description = """
driFTPin full-stack example project using FastAPI & TinyDB
"""

# https://fastapi.tiangolo.com/tutorial/metadata/#license-identifier
app = FastAPI(title="driFTPin Web Portal", description=description)
dBase = Database("Database", log)
app.include_router(dBase.router)

settings = Settings("Settings", log)
app.include_router(settings.router)

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


@app.post("/uploadFile")
async def uploadFile(formData: UploadFile):
  try:
    Path("uploads").mkdir(parents=True, exist_ok=True, mode=0o700)
    with open("uploads/" + formData.filename, 'wb') as f:
      f.write(await formData.read())
      f.close()
    dBase.fileSaved(formData)
  except Exception as e:
    log.error(f"uploadFile {e=}")
    raise HTTPException(status_code=500, detail='Something went wrong')

  return {"message": f"Successfully uploaded {formData.filename}"}

@app.get("/uploaded")
async def getUploaded():
  return dBase.getSavedFiles()

@app.get("/download/{filename}")
async def getFile(filename: str):
  try:
    qualifiedFilename = dBase.lookupFile(filename)
    # Only allow downloading of a file that was previously uploaded.
    if qualifiedFilename:
      return FileResponse('uploads/' + qualifiedFilename)
    else:
      raise HTTPException(status_code=404, detail="File not found")

  except Exception as error:
    log.error(f"File download {error}")
