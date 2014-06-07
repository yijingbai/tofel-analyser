from django.conf.urls import patterns, url, include
from views import *
from apiview import *
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'questions', QuestionViewSet)

urlpatterns = patterns('views',
    url(r'^api/method$', Method.as_view()),
    url(r'^api/', include(router.urls)),
)
