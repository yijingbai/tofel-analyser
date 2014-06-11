from django.db import models


class Article(models.Model):
    """
    Article Model
    """
    afrom = models.CharField(max_length=1000)
    anumber = models.CharField(max_length=1000)
    atype = models.CharField(max_length=1000)
    argument = models.CharField(max_length=1000)
    duration = models.TimeField()
    createtime = models.DateTimeField(auto_now=True, auto_now_add=True)


class paragraph(models.Model):
    """
    paragraph Model
    """
    pnumber = models.CharField(max_length=1000)
    usage = models.CharField(max_length=1000)
    createtime = models.DateTimeField(auto_now=True, auto_now_add=True)
    article = models.ForeignKey(Article, related_name="paras")


class Question(models.Model):
    """
        Question Model to record the grade.
    """
    qfrom = models.CharField(max_length=1000)
    qnumber = models.IntegerField()
    qtype = models.CharField(max_length=1000)
    grade = models.IntegerField()
    article = models.ForeignKey(Article, related_name="questions")
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


class Option(models.Model):
    """
        Option of question
    """
    order = models.CharField(max_length=1000)
    type = models.CharField(max_length=1000)
    content = models.CharField(max_length=1000)
    note = models.CharField(max_length=1000)
    question = models.ForeignKey(Question, related_name="options")
    createtime = models.DateTimeField(auto_now=True, auto_now_add=True)


