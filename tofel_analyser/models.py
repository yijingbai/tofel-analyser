from django.db import models

class Grade(models.model):
    testpaper = model.CharField(max_length=1000)
    qnumber = model.IntegerField()
    qtype = model.CharField(max_length=1000)
    grade = model.FloatField()
    createtime = models.DateTimeField(auto_now=True, auto_now_add=True)



