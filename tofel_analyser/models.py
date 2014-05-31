from django.db import models

class Grade(models.Model):
    """
        Grade Model to record the grade.
    """
    qfrom = models.CharField(max_length=1000)
    qnumber = models.IntegerField()
    qtype = models.CharField(max_length=1000)
    grade = models.FloatField()
    fullgrade = models.FloatField()
    createtime = models.DateTimeField(auto_now=True, auto_now_add=True)

