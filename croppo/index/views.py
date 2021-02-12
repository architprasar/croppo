from django.shortcuts import render

# Create your views here.
def routapp(request):
    return render(request,'index.html')