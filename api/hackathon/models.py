from django.db import models

# Create your models here.

class Tag(models.Model):
    name = models.CharField(max_length=32, unique=True)
    
    def __str__(self):
        return self.name


class Defi(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]
    
    title = models.CharField(max_length=64)
    description = models.TextField()
    tags = models.ManyToManyField(Tag, related_name='defis')
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='medium')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title


class Team(models.Model):
    name = models.CharField(max_length=64)
    description = models.TextField()
    repository_link = models.URLField()
    leader = models.CharField(max_length=100)  # GitHub login of the team leader
    members = models.JSONField(default=list)  # Store list of objects with login and avatar for team members
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
