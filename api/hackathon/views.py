from django.shortcuts import render
from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from .models import Tag, Defi
from .serializers import TagSerializer, DefiSerializer, DefiListSerializer

# Create your views here.

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

class DefiViewSet(viewsets.ModelViewSet):
    queryset = Defi.objects.all().prefetch_related('tags')
    serializer_class = DefiSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['difficulty', 'tags']
    search_fields = ['title', 'description']
    ordering_fields = ['title', 'created_at', 'difficulty']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return DefiListSerializer
        return DefiSerializer
    
    @action(detail=False, methods=['get'])
    def by_difficulty(self, request):
        difficulty = request.query_params.get('level', None)
        if difficulty not in ['easy', 'medium', 'hard']:
            return Response(
                {"error": "Invalid difficulty level. Choose from 'easy', 'medium', or 'hard'"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        defis = Defi.objects.filter(difficulty=difficulty)
        serializer = self.get_serializer(defis, many=True)
        return Response(serializer.data)
