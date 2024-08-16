from rest_framework.routers import DefaultRouter
from .views import TodoViewSet
from django.urls import include, path


router = DefaultRouter()
router.register(r'api', TodoViewSet, basename='api')

urlpatterns = router.urls

urlpatterns = [
    path('', include(router.urls)),
]