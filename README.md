# Mini-Trello

Mini-Trello is a simple task management web application where users can create, manage, move, delete, and assign tasks to team members.

## Features

- Create new tasks
- Add task title and description
- Assign tasks to team members
- Move tasks between To Do, In Progress, and Done
- Delete tasks with confirmation
- Create and manage team members
- Add team members using name and email
- Delete team members
- Assign tasks using a team member dropdown
- Responsive user interface

## Technologies Used

- Python
- Django
- HTML
- CSS
- JavaScript
- SQLite
- PostgreSQL
- GitHub
- Render

## Project Structure

```text
Mini-Trello-Django/
│
├── manage.py
├── requirements.txt
├── render.yaml
├── build.sh
├── .gitignore
├── README.md
│
├── minitrello/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
└── tasks/
    ├── admin.py
    ├── apps.py
    ├── models.py
    ├── urls.py
    ├── views.py
    │
    ├── migrations/
    │
    ├── templates/
    │   └── tasks/
    │       └── index.html
    │
    └── static/
        └── tasks/
            ├── style.css
            └── app.js

## 1. Run in PyCharm

Open the project folder in PyCharm.

Open the PyCharm Terminal and run:

```bash
python -m venv venv
```

Activate the virtual environment.

Windows:

```bash
venv\Scripts\activate
```

Install packages:

```bash
pip install -r requirements.txt
```

Create/update the database:

```bash
python manage.py migrate
```

Start the server:

```bash
python manage.py runserver
```

Open:

```text
http://127.0.0.1:8000/
```

## 2. Test the API

### Get all tasks

```text
GET /api/tasks/
```

### Create a task

```text
POST /api/tasks/
Content-Type: application/json
```

Example:

```json
{
  "title": "Design Database Schema",
  "description": "Create the database schema for the project.",
  "assigned_to": "Sarah"
}
```

New tasks automatically start in `todo`.

### Change status

```text
PATCH /api/tasks/1/
Content-Type: application/json
```

Example:

```json
{
  "status": "in_progress"
}
```

### Delete a task

```text
DELETE /api/tasks/1/
```

The browser UI already uses these API endpoints.

## 3. Database

For local development, Django uses SQLite automatically.

For Render, the project reads the `DATABASE_URL` environment variable and uses PostgreSQL when it is available.

This is important because a normal Render web service should not depend on a local SQLite file for permanent production data.

## 4. Deploy on Render

1. Push this project to GitHub.
2. Create a new Web Service on Render.
3. Connect your GitHub repository.
4. Render can use the included `render.yaml` blueprint.
5. If setting it manually, use:

Build Command:

```text
./build.sh
```

Start Command:

```text
gunicorn minitrello.wsgi:application
```

6. Add a PostgreSQL database on Render and connect its `DATABASE_URL` to the web service.
7. Deploy.
8. Open the generated Render URL on another phone/laptop.

## 5. Important Beginner Notes

### `models.py`
Defines the database table for tasks.

### `views.py`
Contains the Python backend logic and API endpoints.

### `urls.py`
Connects browser/API URLs to Python functions.

### `index.html`
Contains the page structure.

### `style.css`
Contains the UI design and responsive layout.

### `app.js`
Calls the Django API using `fetch()` and updates the page.

## API Endpoints Table

| Method | URL | Purpose |
|---|---|---|
| GET | `/api/tasks/` | Get all tasks |
| POST | `/api/tasks/` | Create a task |
| PUT | `/api/tasks/<id>/` | Replace a task |
| PATCH | `/api/tasks/<id>/` | Update task status |
| DELETE | `/api/tasks/<id>/` | Delete a task |

## Requirement Mapping

### Sprint 1
- Database schema: `tasks/models.py`
- Create API: `POST /api/tasks/`
- Read API: `GET /api/tasks/`
- Three-column frontend: `index.html` + `style.css`

### Sprint 2
- Update API: `PATCH` / `PUT`
- Delete API: `DELETE`
- Frontend integration: `app.js`
- Dynamic status movement and deletion: `app.js`

## Notes for GitHub

Do NOT upload:

- `venv/`
- `db.sqlite3`
- `__pycache__/`

The included `.gitignore` already handles these files.

## Notes for the Project Report

Take screenshots of:

1. Main Mini-Trello board
2. Create New Task modal
3. Board with tasks in different columns
4. A task after moving to another status
5. API response in Postman, if required
6. Render deployed application

The supplied requirements document asks for a project report and a compressed source-code archive with a README and dependency file.
