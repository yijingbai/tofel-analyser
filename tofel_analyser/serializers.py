#encoding:utf-8

from rest_framework import serializers
from models import *


class QuestionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Question
        fields = ('id', 'qfrom', 'qnumber', 'qtype', 'grade', 'createtime')


class ParagraphSerializer(serializers.HyperlinkedModelSerializer):
    
    class Meta:
        model = paragraph
        fields = ('id', 'pnumber', 'usage', 'createtime', 'article')


class ArticleSerializer(serializers.HyperlinkedModelSerializer):
    paras = ParagraphSerializer(many=True)
    class Meta:
        model = Article
        fields = ('id', 'atitle', 'afrom', 'anumber', 'atype','argument','duration','user','createtime', 'paras')
        depth = 1


