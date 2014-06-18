#encoding:utf-8
from serializers import *
from rest_framework.views import APIView
from customViewSets import *
from models import *
from serializers import *
import sys
import os
from rest_framework import viewsets

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

#导入celery worker tasks
sys.path.append(os.path.join(BASE_DIR,"../"))
# from worker import tasks

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

