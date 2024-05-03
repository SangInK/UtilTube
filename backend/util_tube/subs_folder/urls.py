from django.urls import path
from . import views

urlpatterns = [
    path("folder/<int:pk>", views.folder.as_view()),
    path("folders/", views.folders.as_view()),
]
