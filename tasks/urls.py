from django.urls import path
from . import views

urlpatterns = [
    # Main Mini-Trello page.
    path("", views.board_page, name="board"),

    # REST-style task API.
    path("api/tasks/", views.task_list_create, name="task-list-create"),
    path("api/tasks/<int:task_id>/", views.task_detail, name="task-detail"),
]
