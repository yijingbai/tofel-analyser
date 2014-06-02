#encoding:utf-8
from models import *


class Statistics(object):
    """Tofel Grade Statistics"""
    def __init__(self):
        super(Statistics, self).__init__()

    def addGrade(self, grade):
        tofelgrade = Grade(**grade)
        tofelgrade.save()

    def getGradeTimeLine(self, startTime=None, endTime=None):
        if startTime is None or endTime is None:
            grades = Grade.objects.all().order_by('createtime')
            return grades
        grades = Grade.objects.filter(createtime__gt=startTime, createtime_lt=endTime).order_by('createtime')    
        return grades

    def getGradeByType(self, type, startTime=None, endTime=None):
        if startTime is None or endTime is None:
            grades = Grade.objects.filter(qtype=type)
            return grades
        grades = Grade.objects.filter(qtype=type, createtime__gt=startTime, createtime_lt=endTime)
        return grades

    def getGradeByQfromList(self, fromlist):
        grades = Grade.objects.filter(qfrom__in=fromlist)
        return grades

    def getGradeByQfromRange(self, startFrom, endFrom):
        fromlist = []
        for i in range(startFrom, endFrom + 1):
            fromlist.append('tpo' + i)
        grades = getGradeByQfromList(fromlist)
        return grades

    
