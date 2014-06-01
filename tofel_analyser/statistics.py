#encoding:utf-8
from models import *

class Statistics(object):
    """Tofel Grade Statistics"""
    def __init__(self):
        super(Statistics, self).__init__()

    def addGrade(grade):
        tofelgrade = Grade(**grade)
        tofelgrade.save()

    def getGradeTimeLine():
        grades = Grade.objects.all().order_by('-createtime')
        return grades

    def getGradeByType(type):
        grades = Grade.objects.filter(qtype=type)
        return grades

    def getGradeByTime(startTime, endTime):
        grades = Grade.objects.filter(createtime__gt=startTime, createtime__lt=endTime)
        return grades 

