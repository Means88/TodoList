from rest_framework import serializers
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', )


class LoginSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password')


class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'confirm_password')
