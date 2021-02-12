from rest_framework import serializers
from .models import img


class imgserial(serializers.ModelSerializer):
    class Meta:
        model = img
        fields = '__all__'
