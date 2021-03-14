"""ETM URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from django.urls import path

from ETM import settings
from . import views
from ETMApp import views as ETMApp

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', ETMApp.index, name='index'),
    path('login', ETMApp.login, name='login'),
    path('tryLogin', ETMApp.try_login, name='try_login'),
    path('signup', ETMApp.signup, name='signup'),
    path('trySignup', ETMApp.try_signup, name='try_signup'),
    path('play/<slug:url>', ETMApp.lobby, name='lobby'),
    path('game', ETMApp.game, name='game'),
    path('disconnect', ETMApp.disconnect, name='disconnect'),

    path('createGame', ETMApp.create_game, name='create_game')
]
if not settings.DEBUG:
    urlpatterns += [
        url(r'^static/(?P<path>.*)$', 'django.views.static.serve',
            {'document_root': settings.STATIC_ROOT}),
    ]