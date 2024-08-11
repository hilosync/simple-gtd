from rest_framework.routers import DefaultRouter
from .views import APIViewSet

router = DefaultRouter()
router.register(r'api', APIViewSet, basename='api')

urlpatterns = router.urls