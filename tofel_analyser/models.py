from django.db import models

class Question(models.Model):
    """
        Question Model to record the grade.
    """
    qfrom = models.CharField(max_length=1000)
    qnumber = models.IntegerField()
    qtype = models.CharField(max_length=1000)
    grade = models.IntegerField()
    createtime = models.DateTimeField(auto_now=True, auto_now_add=True)

    def __unicode__(self):
        return u"""
            Question {}:
                qfrom: {}
                qnumber: {}
                qtype: {}
                grade: {}
                createtime: {}
        """.format(self.id, self.qfrom, self.qnumber, self.qtype, self.grade, self.createtime)