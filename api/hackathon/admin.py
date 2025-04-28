from django.contrib import admin
from .models import Tag, Defi

class TagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

class DefiAdmin(admin.ModelAdmin):
    list_display = ('title', 'difficulty', 'display_tags', 'created_at', 'updated_at')
    list_filter = ('difficulty', 'tags', 'created_at')
    search_fields = ('title', 'description')
    filter_horizontal = ('tags',)
    readonly_fields = ('created_at', 'updated_at')
    
    def display_tags(self, obj):
        return ", ".join([tag.name for tag in obj.tags.all()])
    
    display_tags.short_description = 'Tags'

admin.site.register(Tag, TagAdmin)
admin.site.register(Defi, DefiAdmin)
