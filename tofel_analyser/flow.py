#encoding:utf-8
import datetime
from models import *


class SummaryFlow(object):
    """
    The class to manage the summary flow.
    """

    def __init__(self):
        super(SummaryFlow, self).__init__()
        self.startReadingTime = {}

    def addArticle(self, articlearg):
        """
        Add a new article to read.
        """
        a = Article(**articlearg)
        a.save()
        return a

    def startReading(self, article):
        """
        Start reading an article.
        """
        self.startReadingTime[article.id] = datetime.datetime.now()

    def endReading(self, article):
        """
        End reading an article.
        """
        del self.startReadingTime[article.id]






