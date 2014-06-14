#encoding:utf-8

from rest_framework import serializers
from models import *


class QuestionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Question
        fields = ('id', 'qfrom', 'qnumber', 'qtype', 'grade', 'createtime')


class ArticleSerializer(serializers.HyperlinkedModelSerializer):
    paras = serializers.HyperlinkedRelatedField(many=True)
    class Meta:
        model = Article
        fields = ('id', 'atitle', 'afrom', 'anumber', 'atype','argument','duration','user','createtime', 'paras')
        depth = 1


class ParagraphSerializer(serializers.HyperlinkedModelSerializer):
    
    class Meta:
        model = paragraph
        fields = ('id', 'pnumber', 'usage', 'createtime', 'article')
