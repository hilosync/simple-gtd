from rest_framework.routers import DefaultRouter
from .views import APIViewSet
from django.urls import path


router = DefaultRouter()
router.register(r'api', APIViewSet, basename='api')

urlpatterns = router.urls

from .views import todos

urlpatterns = [
    path('todos/', todos),
]