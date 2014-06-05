#encoding:utf-8

from rest_framework import serializers
from models import *


class QuestionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Question
        fields = ('id', 'qfrom', 'qnumber', 'qtype', 'grade', 'createtime')
