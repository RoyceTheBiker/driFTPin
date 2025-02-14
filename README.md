# driFTPin

Source code is on [GitLab](https://gitlab.com/SiliconTao-open-source/driFTPin)

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