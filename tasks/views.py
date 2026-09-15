import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from django.views.decorators.http import require_http_methods

from .models import Task


def board_page(request):
    """Render the main Mini-Trello board."""
    return render(request, "tasks/index.html")


def task_to_dict(task):
    """
    Convert a Task model object into a simple JSON dictionary.

    This keeps the API response easy for a beginner to understand.
    """
    return {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "status": task.status,
        "assigned_to": task.assigned_to,
        "created_at": task.created_at.isoformat(),
    }


@require_http_methods(["GET", "POST"])
def task_list_create(request):
    """
    GET  -> Return all tasks.
    POST -> Create a new task.
    """

    if request.method == "GET":
        tasks = Task.objects.all().order_by("-created_at")
        data = [task_to_dict(task) for task in tasks]
        return JsonResponse(data, safe=False)

    # Read JSON sent by JavaScript/Postman.
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON."}, status=400)

    title = body.get("title", "").strip()
    description = body.get("description", "").strip()
    assigned_to = body.get("assigned_to", "").strip()

    # Title and description are required by the project requirements.
    if not title or not description:
        return JsonResponse(
            {"error": "Title and description are required."},
            status=400,
        )

    task = Task.objects.create(
        title=title,
        description=description,
        assigned_to=assigned_to,
    )

    return JsonResponse(task_to_dict(task), status=201)


@require_http_methods(["PUT", "PATCH", "DELETE"])
def task_detail(request, task_id):
    """
    PUT   -> Replace task information.
    PATCH -> Update selected task information, mainly status.
    DELETE -> Delete a task.
    """

    task = get_object_or_404(Task, id=task_id)

    if request.method == "DELETE":
        task.delete()
        return JsonResponse({"message": "Task deleted successfully."})

    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON."}, status=400)

    # PATCH is mainly used by the UI when moving a card.
    if "status" in body:
        new_status = body["status"]

        if new_status not in dict(Task.STATUS_CHOICES):
            return JsonResponse({"error": "Invalid status."}, status=400)

        task.status = new_status

    # PUT can also update title, description and assigned_to.
    if request.method == "PUT":
        title = body.get("title", "").strip()
        description = body.get("description", "").strip()

        if not title or not description:
            return JsonResponse(
                {"error": "Title and description are required."},
                status=400,
            )

        task.title = title
        task.description = description
        task.assigned_to = body.get("assigned_to", "").strip()

    task.save()

    return JsonResponse(task_to_dict(task))
