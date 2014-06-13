#encoding:utf-8
from models import *


class Statistics(object):
    """Tofel Grade Statistics"""
    def __init__(self):
        super(Statistics, self).__init__()

    def addQuestion(self, question):
        """
        add Tofel wrong question
        """
        tofelQuestion = Question(**question)
        tofelQuestion.save()

    def getQuestionTimeLine(self, startTime=None, endTime=None):
        """
        添加时间轴
        """
        if startTime is None or endTime is None:
            Questions = Question.objects.all().order_by('createtime')
            return Questions
        Questions = Question.objects.filter(createtime__gt=startTime, createtime_lt=endTime).order_by('createtime')    
        return Questions

    def getQuestionByType(self, type, startTime=None, endTime=None):
        """
        Get Question By Type.
        """
        if startTime is None or endTime is None:
            Questions = Question.objects.filter(qtype=type)
            return Questions
        Questions = Question.objects.filter(qtype=type, createtime__gt=startTime, createtime_lt=endTime)
        return Questions

    def getQuestionByQfromList(self, fromlist):
        Questions = Question.objects.filter(qfrom__in=fromlist)
        return Questions

    def getQuestionByQfromRange(self, startFrom, endFrom):
        fromlist = []
        for i in range(startFrom, endFrom + 1):
            fromlist.append('tpo' + i)
        Questions = getQuestionByQfromList(fromlist)
        return Questions

    
