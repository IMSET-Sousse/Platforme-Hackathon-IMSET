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
