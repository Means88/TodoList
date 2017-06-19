from rest_framework import viewsets, response, status
from .models import Todo
from .serializers import TodoSerializer


class TodoViewset(viewsets.ModelViewSet):
    serializer_class = TodoSerializer

    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        todo = Todo.objects.create(user=request.user, **serializer.validated_data)
        return response.Response(self.get_serializer(todo).data, status=status.HTTP_201_CREATED)
