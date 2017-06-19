# coding=utf-8
from rest_framework import viewsets, response, status
from rest_framework.decorators import list_route
from django.contrib.auth.models import User
from user.serializers import UserSerializer, LoginSerializer, RegisterSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()

    def get_serializer_class(self):
        if self.action == 'login':
            return LoginSerializer
        elif self.action == 'register':
            return RegisterSerializer
        return UserSerializer

    @list_route(methods=['POST'])
    def login(self, request):
        pass

    @list_route(methods=['POST'])
    def register(self, request):
        serializer = self.get_serializer(request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        confirm_password = serializer.validated_data['confirm_password']

        if User.objects.filter(username=username).exists():
            return response.Response({'detail': u'该用户名已存在'}, status=status.HTTP_409_CONFLICT)
        if password != confirm_password:
            return response.Response({'detail': u'两次输入密码不一致'}, status=status.HTTP_400_BAD_REQUEST)

        User.objects.create_user(username=username, password=password)
        return response.Response({'detail': u'注册成功'})
