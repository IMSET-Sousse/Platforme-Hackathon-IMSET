from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TagViewSet, DefiViewSet

router = DefaultRouter()
router.register(r'tags', TagViewSet)
router.register(r'defis', DefiViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 