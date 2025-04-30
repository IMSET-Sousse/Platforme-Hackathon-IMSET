from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TagViewSet, DefiViewSet, TeamViewSet

router = DefaultRouter()
router.register(r'tags', TagViewSet)
router.register(r'defis', DefiViewSet)
router.register(r'teams', TeamViewSet)

urlpatterns = [
    path('', include(router.urls)),
]