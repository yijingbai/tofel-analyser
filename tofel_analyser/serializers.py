#encoding:utf-8

from rest_framework import serializers
from models import *
import json


class TaskSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False)
    ename = serializers.CharField(max_length=1000)
    cname = serializers.CharField(max_length=2000)
    creator = serializers.CharField(max_length=1000)
    desc = serializers.CharField(max_length=2000)
    cron = serializers.CharField(max_length=200)
    param = serializers.CharField(max_length=3000, required=False)
    codetype = serializers.CharField(max_length=100)
    code = serializers.CharField(max_length=3000)
    updatetime = serializers.DateTimeField(required=False)

    def restore_object(self, attrs, instance=None):
        """
        Given a dictionary of deserialized field values, either update
        an existing model instance, or create a new model instance.
        """
        if instance is not None:
            instance.ename = attrs.get('ename', instance.ename)
            instance.cname = attrs.get('cname', instance.cname)
            instance.creator = attrs.get('creator', instance.creator)
            instance.desc = attrs.get('desc', instance.desc)
            instance.cron = attrs.get('cron', instance.cron)
            instance.param = attrs.get('creator', instance.param)
            instance.codetype = attrs.get('codetype', instance.codetype)
            instance.code = attrs.get('code', instance.code)
            return instance
        return Task(**attrs)

#Mart表序列化

class MartSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False)
    ename = serializers.CharField(max_length=1000)
    cname = serializers.CharField(max_length=2000)
    frequency = serializers.CharField(max_length=1000)
    desc = serializers.CharField(max_length=2000)
    task = serializers.IntegerField()
    manager = serializers.CharField(max_length=20)
    code = serializers.CharField(required=False)
    updatetime = serializers.DateTimeField(required=False)

    def restore_object(self, attrs, instance=None):
        """
        Given a dictionary of deserialized field values, either update
        an existing model instance, or create a new model instance.
        """

        if instance is not None:
            instance.ename = attrs.get('ename', instance.ename)
            instance.cname = attrs.get('cname', instance.cname)
            instance.desc = attrs.get('desc', instance.desc)
            instance.type = attrs.get('type', instance.type)
            instance.rule = attrs.get('rule', instance.rule)
            instance.meaning = attrs.get('meaning', instance.meaning)
            instance.legal = attrs.get('legal', instance.legal)
            instance.table_type = attrs.get('table_type', instance.table_type)
            instance.table_id = attrs.get('table_id', instance.table_id)
            return instance
        obj = MartTable(**attrs)
        print obj.ename
        print obj.cname
        print obj.desc
        return obj

classdict = {
        "task": TaskSerializer,
        "mart": MartSerializer,
    }


class SerializeManager():
    def __init__(self, msg, objtype):
        #objtype 区分数据类型，mart, event, table, file
        self.objtype = objtype
        if str(type(msg)) == "<type 'dict'>":
            self.msgdict = msg
        elif str(type(msg)) == "<class 'django.db.models.query.QuerySet'>":
            self.msgset = msg

    def serialize(self):
        s = classdict[self.objtype](self.msgset)
        output = s.data
        for o, t in zip(output, self.msgset):
            o['tags'] = t.tags.names()
        return output

    def deserialize(self):
        inputdict = self.msgdict
        tags = None
        if 'tags' in inputdict:
            tags = inputdict.get('tags')
        del inputdict['tags']
        if self.objtype == "task":
            res = TaskSerializer(data=inputdict)
            if res.is_valid():
                res.save()
                for tag in tags:
                    res.object.tags.add(tag)
                output = res.data
                output['tags'] = tags
                return output

            else:
                return res.errors
        elif self.objtype == "instance":
            res = TaskSerializer(instance, data=inputdict, partial=True)
            if res.is_valid():
                res.save()
                if tags is not None:
                    res.object.tags.clear()
                    for tag in tags:
                        res.object.tags.add(tag)
                    output = res.data
                    output['tags'] = tags
                    return output
            else:
                return res.errors
        elif self.objtype == "mart":
            res = MartSerializer(data=inputdict)
            if res.is_valid():
                res.save()
                for tag in tags:
                    res.object.tags.add(tag)
                output = res.data
                output['tags'] = tags
                return output

            else:
                return res.errors


class InstanceSerializer(serializers.ModelSerializer):
    end_time = serializers.DateTimeField(required=False)
    class Meta:
        model = Instance
        fields = ('id', 'task', 'start_time', 'end_time', 'celery_worker_id', 'status', 'stdout', 'stderr')
        depth = 1



class TaskSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False)
    ename = serializers.CharField(max_length=1000)
    cname = serializers.CharField(max_length=2000)
    creator = serializers.CharField(max_length=1000)
    desc = serializers.CharField(max_length=2000)
    cron = serializers.CharField(max_length=200)
    param = serializers.CharField(max_length=3000, required=False)
    codetype = serializers.CharField(max_length=100)
    code = serializers.CharField(max_length=3000)
    updatetime = serializers.DateTimeField(required=False)

    def restore_object(self, attrs, instance=None):
        """
        Given a dictionary of deserialized field values, either update
        an existing model instance, or create a new model instance.
        """
        if instance is not None:
            instance.ename = attrs.get('ename', instance.ename)
            instance.cname = attrs.get('cname', instance.cname)
            instance.creator = attrs.get('creator', instance.creator)
            instance.desc = attrs.get('desc', instance.desc)
            instance.cron = attrs.get('cron', instance.cron)
            instance.param = attrs.get('creator', instance.param)
            instance.codetype = attrs.get('codetype', instance.codetype)
            instance.code = attrs.get('code', instance.code)
            return instance
        return Task(**attrs)


class MetaDefinitionSerializer(serializers.ModelSerializer):
    desc = serializers.CharField(required=False)
    type = serializers.CharField(required=False)
    rule = serializers.CharField(required=False)
    meaning = serializers.CharField(required=False)
    legal = serializers.CharField(required=False)
    testrule = serializers.CharField(required=False)
    table_id = serializers.IntegerField(required=False)
    class Meta:
        model = meta_definition
        fields = ('id', 'ename', 'cname', 'desc', 'type', 'rule', 'meaning', 'legal', 'testrule', 'table_id')



# class EventTableSerializer(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = EventTable
#         fields = ('ename', 'cname', 'frequency', 'manager', 'desc', 'tags', 'etlurl', 'createquery', 'updatetime')


# class MartTableSerializer(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = MartTable
#         fields = ('ename', 'cname', 'frequency ', 'manager', 'desc', 'hqltask', 'createquery', 'tags', 'updatetime')


# class ResultFileSerializer(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = ResultFile
#         fields = ('hdfspath',  'cname',  'ename',  'manager',  'desc',  'hqltask',  'tags',  'frequency',  'delimiter',  'updatetime')


# class metadefinitionSerializer(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = meta_definition
#         fields = ('ename',  'cname',  'desc',  'type',  'rule',  'meaning',  'legal',  'testrule',  'tableid',  'updatetime')
