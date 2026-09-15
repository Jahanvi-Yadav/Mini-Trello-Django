from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    # Django admin panel.
    path("admin/", admin.site.urls),

    # All Mini-Trello page and API URLs.
    path("", include("tasks.urls")),
]
