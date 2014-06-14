#encoding:utf-8

from rest_framework import serializers
from models import *


class QuestionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Question
        fields = ('id', 'qfrom', 'qnumber', 'qtype', 'grade', 'createtime')


class Article(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Article
        fields = ('id', 'atitle', 'afrom', 'anumber', 'atype','argument','duration','user','createtime')

