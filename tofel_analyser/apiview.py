#encoding:utf-8
from serializers import *
from rest_framework.views import APIView
from customViewSets import *
from models import *
from serializers import *
import sys
import os
from rest_framework import viewsets

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

#导入celery worker tasks
sys.path.append(os.path.join(BASE_DIR,"../"))
# from worker import tasks


class Tasks(APIView):
    def get(self, request, format=None):
        """
        Return a list of all tasks.
        """
        result = SerializeManager(Task.objects.all(),"task")
        return Response(returnSuccess(result.serialize()))

    def post(self, request, *args, **kwargs):
        result = SerializeManager(request.DATA,"task")
        return Response(result.deserialize())


class Metas(APIView):
    def get(self, request, format=None, *args, **kwargs):
        taskid = kwargs.get("tableid", "")
        if not taskid:
            return Response(returnError("MartTable id is null"))
        result = meta_definition.objects.filter(table_id=kwargs['tableid'])
        ser = MetaDefinitionSerializer(result)
        return Response(ser.data)



class Marts(APIView):
    def get(self, request, format=None):
        """
        Return a list of all tasks.
        """
        result = SerializeManager(MartTable.objects.all(),"mart")
        return Response(returnSuccess(result.serialize()))

    def post(self, request, *args, **kwargs):
        result = SerializeManager(request.DATA,"mart")
        return Response(result.deserialize())

class Method(APIView):
    """
    """
    def get(self, request, format=None):
        optype = request.GET.get("optype","")
        id = request.GET.get("id","").strip()
        if not optype:
            return Response(returnError("optype is null"))
        elif not id:
            return Response(returnError("id is null"))
        if optype == "start":
            #启动一个任务
            task = Task.objects.get(id=id)
            if not task:
                return Response(returnError("task is not exist"))
            instance = Instance(task=task)
            print instance
            instance.save()
            codetype = task.codetype
            if codetype == "pyspark":
                # celery_task = tasks.do_pyspark.delay(instance.id)
                pass
            if codetype == "hql":
                #TODO
                pass
            #创建一个运行实例
            # instance.celery_worker_id = celery_task.id
            instance.celery_worker_id = 1
            instance.save()
            return Response(returnSuccess(instance.id))
        elif optype == "stop":
            #停止一个任务
            pass



class Instances(APIView):
    def get(self, request, format=None, *args, **kwargs):
        """
        Return a Instance list of task-(id).
        """
        print kwargs
        taskid = kwargs.get("taskid", "")
        if not taskid:
            return Response(returnError("Task id is null"))
        result = Instance.objects.filter(task__id__exact=taskid)
        ser = InstanceSerializer(result)
        return Response(returnSuccess(ser.data))


class MetaViewSet(viewsets.ModelViewSet):
    queryset = meta_definition.objects.all()
    serializer_class = MetaDefinitionSerializer



# class TaskViewSet(WrapModelViewSet):
#     queryset = Task.objects.all()
#     serializer_class = TaskSerializer


# class EventTableViewSet(WrapModelViewSet):
#     queryset = EventTable.objects.all()
#     serializer_class = EventTableSerializer


# class MartTableViewSet(WrapModelViewSet):
#     queryset = MartTable.objects.all()
#     serializer_class = MartTableSerializer


# class ResultFileViewSet(WrapModelViewSet):
#     queryset = ResultFile.objects.all()
#     serializer_class = ResultFileSerializer


# class MetadefinitionViewSet(WrapModelViewSet):
#     queryset = meta_definition.objects.all()
#     serializer_class = metadefinitionSerializer
