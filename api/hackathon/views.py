from django.shortcuts import render
from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from .models import Tag, Defi, Team
from .serializers import TagSerializer, DefiSerializer, DefiListSerializer, TeamSerializer, TeamListSerializer

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

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'leader', 'members']
    ordering_fields = ['name', 'created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return TeamListSerializer
        return TeamSerializer
    
    @action(detail=False, methods=['get'])
    def by_leader(self, request):
        leader = request.query_params.get('github_login', None)
        if not leader:
            return Response(
                {"error": "GitHub login is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        teams = Team.objects.filter(leader=leader)
        serializer = self.get_serializer(teams, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_member(self, request):
        login = request.query_params.get('github_login', None)
        if not login:
            return Response(
                {"error": "GitHub login is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Find teams where the login appears in any member's login field
        teams = Team.objects.all()
        member_teams = [team for team in teams if any(member.get('login') == login for member in team.members)]
        serializer = self.get_serializer(member_teams, many=True)
        return Response(serializer.data)
