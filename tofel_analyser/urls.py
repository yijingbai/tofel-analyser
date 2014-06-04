from django.conf.urls import patterns, url, include
from views import *
from apiview import *
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'metas', MetaViewSet)

urlpatterns = patterns('views',
    # url(r'^$', index),
    url(r'^createtask$', CreateTask),
    url(r'^createmart$', CreateMart),
    url(r'^viewtask$', ViewTask),
    url(r'^viewmart$', ViewMart),
    url(r'^viewinstances/(?P<taskid>.*)$', ViewInstances),
    url(r'^api/tasks$', Tasks.as_view()),
    url(r'^api/marts$', Marts.as_view()),
    url(r'^api/instances/(?P<taskid>.*)$', Instances.as_view()),
    url(r'^api/method$', Method.as_view()),
    url(r'^api/', include(router.urls)),
    url(r'^api/meta/(?P<tableid>.*)$', Metas.as_view()),
        #test
    url(r'^do$',Main),
    url(r'^submit$',Submit),
    url(r'^instance$',CheckStatus),
    # url(r'^test$',test),
)
