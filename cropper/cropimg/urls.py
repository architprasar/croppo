

from django.urls import path, include
from . import views

urlpatterns = [

    path('/collectimage', views.collectimage, name="collectimage"),

]
