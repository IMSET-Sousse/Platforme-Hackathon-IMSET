from rest_framework import serializers
from .models import Tag, Defi, Team

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class DefiSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    tags_ids = serializers.PrimaryKeyRelatedField(
        many=True, 
        write_only=True,
        queryset=Tag.objects.all(),
        source='tags',
        required=False
    )
    
    class Meta:
        model = Defi
        fields = ['id', 'title', 'description', 'difficulty', 'tags', 'tags_ids', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation.pop('tags_ids', None)
        return representation

class DefiListSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    
    class Meta:
        model = Defi
        fields = ['id', 'title', 'difficulty', 'tags', 'created_at']

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'repository_link', 'leader', 'members', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class TeamListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'name', 'leader', 'created_at']
