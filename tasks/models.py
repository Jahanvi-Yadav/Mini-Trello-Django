from django.db import models

class Person(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.email})"

class Task(models.Model):
    """
    Database model for one Mini-Trello task.

    Each task has:
    - title
    - description
    - status
    - assigned_to
    """

    STATUS_CHOICES = [
        ("todo", "To Do"),
        ("in_progress", "In Progress"),
        ("done", "Done"),
    ]

    title = models.CharField(max_length=150)
    description = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="todo",
    )
    assigned_to = models.CharField(
        max_length=100,
        blank=True,
        default="",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """Show the task title in Django admin."""
        return self.title
