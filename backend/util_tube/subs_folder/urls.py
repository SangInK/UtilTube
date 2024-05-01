from django.urls import path
from . import views

urlpatterns = [
    path('', views.view.as_view()),
]
