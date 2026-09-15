# Mini-Trello

Mini-Trello is a simple task management web application built using Django. It allows users to create tasks, manage their task status, assign tasks to team members, and manage team members.

## Features

- Create new tasks
- Add task title and description
- Assign tasks to team members
- Move tasks between To Do, In Progress, and Done
- Delete tasks with confirmation
- Create and manage a team
- Add team members using name and email
- View team members
- Delete team members
- Assign tasks using a team member dropdown
- Responsive user interface

## Technologies Used

- Python
- Django
- HTML5
- CSS3
- JavaScript
- SQLite
- PostgreSQL
- GitHub
- Render

## Project Structure

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
        │   ├── 0001_initial.py
        │   └── 0002_person.py
        │
        ├── templates/
        │   └── tasks/
        │       └── index.html
        │
        └── static/
            └── tasks/
                ├── style.css
                └── app.js

## Application Workflow

### Task Management

The application provides three task stages:

1. To Do
2. In Progress
3. Done

Users can:

- Create a task
- Add a title and description
- Assign a team member
- Move a task to the next stage
- Move a task to the previous stage
- Delete a task

### Team Management

Users can create and manage their team from the `Create Your Team` option.

Team members can be added using:

- Name
- Email

Added team members are stored in the database and displayed in the team list.

Users can also delete team members when required.

### Task Assignment

While creating a task, the `Assigned To` dropdown displays the available team members.

The selected team member is stored with the task and displayed on the task card.

## Database

The application uses SQLite for local development.

PostgreSQL is used for the production deployment on Render.

The project uses Django migrations for creating and updating database tables.

The main database models are:

### Task

- id
- title
- description
- status
- assigned_to
- created_at

### Person

- id
- name
- email
- created_at

## REST API

### Task APIs

GET all tasks:

    GET /api/tasks/

Create a task:

    POST /api/tasks/

Update task status:

    PATCH /api/tasks/<id>/

Update complete task:

    PUT /api/tasks/<id>/

Delete a task:

    DELETE /api/tasks/<id>/

### Team APIs

Get all team members:

    GET /api/people/

Add a team member:

    POST /api/people/

Delete a team member:

    DELETE /api/people/<id>/

## Local Setup

### 1. Clone the Repository

    git clone https://github.com/Jahanvi-Yadav/Mini-Trello-Django.git

### 2. Open the Project

    cd Mini-Trello-Django

### 3. Create Virtual Environment

    python -m venv venv

### 4. Activate Virtual Environment

For Windows:

    venv\Scripts\activate

### 5. Install Dependencies

    pip install -r requirements.txt

### 6. Run Database Migrations

    python manage.py migrate

### 7. Start the Development Server

    python manage.py runserver

Open the application in the browser:

    http://127.0.0.1:8000/

## Deployment

The application is deployed using Render.

### Build Command

    bash build.sh

### Start Command

    gunicorn minitrello.wsgi:application

The production database is PostgreSQL and is connected using the `DATABASE_URL` environment variable.

The production environment uses `DEBUG=False`.

## GitHub Repository

https://github.com/Jahanvi-Yadav/Mini-Trello-Django

## Author

Jahanvi Yadav
