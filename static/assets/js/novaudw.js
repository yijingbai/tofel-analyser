$(function() {

    Task = Backbone.Model.extend({
        defaults: function() {
            return {
                ename: 'english name',
                cname: 'chinese name'
            };
        },
        url: '/api/tasks'
    });

    Instance = Backbone.Model.extend({});
    Mart = Backbone.Model.extend({});
    Meta = Backbone.Model.extend({});


    Tasks = Backbone.Collection.extend({
        url: '/api/tasks',
        parse: function(response) {
            return response.data;
        },
        model: Task
    });
    tasklist = new Tasks;
    Metas = Backbone.Collection.extend({
        url: '/api/metas/',
        parse: function(response) {
            return response.data;
        },
        model: Meta
    });

    Marts = Backbone.Collection.extend({
        url: '/api/marts',
        parse: function(response) {
            return response.data;
        },
        model: Mart
    })

    martlist = new Marts;
    metalist = new Metas;

    Instances = Backbone.Collection.extend({
        initialize: function(options) {
            this.taskid = options.taskid;
        },
        url: function() {
            return '/api/instances/' + this.taskid;
        },
        model: Instance,
        parse: function(response) {
            return response.data;
        }
    });

    TableMetas = Backbone.Collection.extend({
        initialize: function(options) {
            this.tableid = options.tableid;
        },
        url: function() {
            return '/api/meta/' + this.tableid;
        },
        model: Meta,
    });

});