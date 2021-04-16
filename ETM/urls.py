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
from django.conf.urls.static import static
from . import views
from ETMApp import views as etm_app

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('', etm_app.index, name='index'),
    path('login', etm_app.login, name='login'),
    path('tryLogin', etm_app.try_login, name='try_login'),
    path('signup', etm_app.signup, name='signup'),
    path('trySignup', etm_app.try_signup, name='try_signup'),
    path('disconnect', etm_app.disconnect, name='disconnect'),
    path('createGame', etm_app.create_game, name='create_game'),
    path('play/<slug:url>', etm_app.play, name='play'),
    path('history', etm_app.history, name='history'),
    path('history/<slug:url_game>/', etm_app.history_game, name='history_game'),
    path('history/<slug:url_game>/<slug:url_conversation>', etm_app.history_game_conversation,
         name='history_game_conversation'),
    path('view/<slug:url_game>.pdf', etm_app.view_game, name='view_game'),
    path('about', etm_app.about, name='about'),

    path('admin_debug', etm_app.admin_debug, name='admin_debug'),  # for debug, left on production on purpose

    # TODO REMOVE
    # path('base_game', ETMApp.base_game, name='base_game'),

]
if not settings.DEBUG:
    urlpatterns += [
        url(r'^static/(?P<path>.*)$', 'django.views.static.serve',
            {'document_root': settings.STATIC_ROOT}),
    ]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
