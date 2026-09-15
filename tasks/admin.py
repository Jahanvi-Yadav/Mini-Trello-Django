from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    """Simple admin configuration for Task."""

    list_display = ("id", "title", "status", "assigned_to", "created_at")
    list_filter = ("status",)
    search_fields = ("title", "description", "assigned_to")
