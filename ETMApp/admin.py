from django.contrib import admin
from ETMApp.models import *
# Register your models here.

admin.site.register(Author)

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    pass