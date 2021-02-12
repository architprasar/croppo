from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import img
import json
@csrf_exempt
def api(request):
    
    if request.method == "POST":
        if request.FILES.get('file') != "":
            print("notempty")
            profile = img()
           
            profile.image = request.FILES.get('file')
            
            j=request.POST['cdata']
            data = json.loads(j)
            
            
            profile.save(data)
            response = {'status': '1'}
            return JsonResponse(response)
        else:
            print("empty")
            response = {'status': '404'}
            return JsonResponse(response)
    else:
        return HttpResponse("<center><h1>ERROR 404<br/>PAGE NOT FOUND</h1></center>")



