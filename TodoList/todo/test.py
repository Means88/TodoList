from __future__ import unicode_literals

from django.test import TestCase
from django.contrib.auth.models import User
from todo.models import Todo
import json


class TodoTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test', password='pwd')
        response = self.client.post('/api-token-auth/', {
            'username': 'test',
            'password': 'pwd',
        })
        data = json.loads(response.content)
        self.token = data['token']

    def test_crud_todo(self):
        # create
        response = self.client.post('/api/todo/', {
            'title': 'title',
            'content': 'content',
        })
        self.assertEqual(401, response.status_code)

        response = self.client.post('/api/todo/', {
            'title': 'title',
            'content': 'content',
        }, HTTP_AUTHORIZATION='Token %s' % self.token)
        self.assertEqual(201, response.status_code)
        self.assertEqual(1, Todo.objects.count())
        todo = json.loads(response.content)

        # list
        response = self.client.get('/api/todo/')
        self.assertEqual(401, response.status_code)

        response = self.client.get('/api/todo/', HTTP_AUTHORIZATION='Token %s' % self.token)
        self.assertEqual(200, response.status_code)
        data = json.loads(response.content)
        self.assertEqual(1, len(data))

        # retrieve
        response = self.client.get('/api/todo/%s/' % todo['id'], HTTP_AUTHORIZATION='Token %s' % self.token)
        self.assertEqual(200, response.status_code)
        data = json.loads(response.content)
        self.assertEqual('title', data['title'])
        self.assertEqual('content', data['content'])
        self.assertTrue('created_at' in data)
        self.assertTrue('updated_at' in data)

        # update
        response = self.client.patch('/api/todo/%s/' % todo['id'], json.dumps({
            'title': 'title2',
        }), HTTP_AUTHORIZATION='Token %s' % self.token, content_type='application/json')
        self.assertEqual(200, response.status_code)
        todo = Todo.objects.all()[0]
        self.assertEqual('title2', todo.title)

        # delete
        response = self.client.delete('/api/todo/%s/' % todo.id, HTTP_AUTHORIZATION='Token %s' % self.token)
        self.assertEqual(204, response.status_code)
        self.assertEqual(0, Todo.objects.count())
