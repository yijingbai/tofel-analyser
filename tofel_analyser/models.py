from django.db import models


class Article(models.Model):
    """
    Article Model
    """
    atitle = models.CharField(max_length=1000, blank=True)
    afrom = models.CharField(max_length=1000, blank=True)
    anumber = models.CharField(max_length=1000, blank=True)
    atype = models.CharField(max_length=1000, blank=True)
    argument = models.CharField(max_length=1000, blank=True)
    duration = models.TimeField(blank=True, null=True)
    user = models.CharField(max_length=1000, blank=True, null=True)
    createtime = models.DateTimeField(auto_now=True, auto_now_add=True)

    def __unicode__(self):
        return u"""
            Article {}:
                afrom: {}
                anumber: {}
                atype: {}
                argument: {}
                duration: {}
                createtime: {}
        """.format(self.id, self.afrom, self.anumber, self.atype,
            self.argument, self.duration, self.createtime)


class paragraph(models.Model):
    """
    paragraph Model
    """
    pnumber = models.CharField(max_length=1000, blank=True)
    usage = models.CharField(max_length=1000, blank=True)
    createtime = models.DateTimeField(auto_now=True, auto_now_add=True, blank=True)
    article = models.ForeignKey(Article, related_name="paras")

    def __unicode__(self):
        return u"""
            Paragraph {}:
                pnumber: {}
                usage: {}
                createtime: {}
                article: {}
        """.format(self.id, self.pnumber, self.usage, self.createtime, self.article)


class Question(models.Model):
    """
        Question Model to record the grade.
    """
    qfrom = models.CharField(max_length=1000, blank=True)
    qnumber = models.IntegerField(blank=True)
    qtype = models.CharField(max_length=1000, blank=True)
    grade = models.IntegerField(blank=True)
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
    order = models.CharField(max_length=1000, blank=True)
    type = models.CharField(max_length=1000, blank=True)
    content = models.CharField(max_length=1000, blank=True)
    note = models.CharField(max_length=1000, blank=True)
    question = models.ForeignKey(Question, related_name="options")
    createtime = models.DateTimeField(auto_now=True, auto_now_add=True)

    def __unicode__(self):
        return u"""
            Option {}:
                order: {}
                type: {}
                content: {}
                note: {}
                question: {}
                createtime: {}
        """.format(self.id, self.order, self.type, self.content,
            self.note, self.question, self.createtime)


