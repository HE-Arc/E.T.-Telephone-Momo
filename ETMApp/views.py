from django.shortcuts import render

def index(request):
    return render(request, 'ETMApp/index.html')

def login(request):
    return render(request, 'ETMApp/login.html')

def signup(request):
    return render(request, 'ETMApp/signup.html')

def lobby(request):
    return render(request, 'ETMApp/lobby.html')

def game(request):
    return render(request, 'ETMApp/game.html')

def disconnect(request):
    pass
