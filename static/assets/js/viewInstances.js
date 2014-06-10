$(function() {



    $('pre code').each(function(i, e) {
        hljs.highlightBlock(e)
    });


    InstanceView = Backbone.View.extend({
        tagName: "div",
        className: "row",
        template: _.template($('#item-instance').html()),

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },

        render: function() {
            var jsondata = this.model.toJSON();
            if (jsondata['start_time'] != null) {
                jsondata['start_time'] = jsondata['start_time'].replace('T', ' ');
            }
            if (jsondata['end_time'] != null) {
                jsondata['end_time'] = jsondata['end_time'].replace('T', ' ');
            }
            this.$el.html(this.template(jsondata));
            return this;
        },
    });

    var taskid = $('#taskid').html();
    var instancelist = new Instances({
        taskid: taskid
    });


    instancelist.fetch({
        success: function(collection, response, options) {
            collection.each(function(instance) {
                var view = new InstanceView({
                    model: instance
                });
                $(".content").append(view.render().el);
                $('pre code').each(function(i, e) {
                    hljs.highlightBlock(e)
                });

                $(".example").TimeCircles({
                    "bg_width": 1.0,
                    "fg_width": 0.1,
                    "circle_bg_color": "#e8e8e8",
                    'time': {
                        'Days': {
                            show: false
                        },
                        'Hours': {
                            'text': '小时'
                        },
                        'Minutes': {
                            'text': '分',
                            'color': '#0aa699'
                        },
                        'Seconds': {
                            'text': '秒'
                        }
                    }
                });


                if (instance.get('status') != 10) {
                    $(".example").TimeCircles().stop();
                };

                // $('#startTask' + task.id).submit(function(event) {
                //     event.preventDefault();
                //     var startForm = $('#startTask' + task.id).serializeJson();
                //     submitData('get', '/api/method', startForm, function(msg) {
                //         console.log(msg);
                //     });
                //     console.log(startForm);
                // });

            });
        }
    });

});