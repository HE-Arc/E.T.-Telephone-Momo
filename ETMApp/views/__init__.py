from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login, logout
from django.shortcuts import redirect
from django.template.loader import get_template, render_to_string
from ETMApp.models import Conversation, Game
from django.core import serializers
from easy_pdf.rendering import render_to_pdf_response
from django.shortcuts import HttpResponse

from ETMApp.views.views_history import *
from ETMApp.views.views_login import *
from ETMApp.views.views_ETMApp import *
