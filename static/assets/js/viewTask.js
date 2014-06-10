$(function() {
    TaskView = Backbone.View.extend({
        tagName: "div",
        className: "row",
        template: _.template($('#item-task').html()),

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
    });



    tasklist.fetch({
        success: function(collection, response, options) {
            collection.each(function(task) {
                var view = new TaskView({
                    model: task
                });
                $(".content").append(view.render().el);
                $('pre code').each(function(i, e) {
                    hljs.highlightBlock(e)
                });
                $('#startTask' + task.id).submit(function(event) {
                    event.preventDefault();
                    var startForm = $('#startTask' + task.id).serializeJson();
                    startForm['end_time'] = "";
                    console.log(startForm);
                    submitData('get', '/api/method', startForm, function(msg) {
                        Messenger().post({
                            message: "启动Task" + task.id + "成功!点击<a href='viewinstances/" + task.id + "'>此处</a>查看Instance列表",
                            showCloseButton: true
                        });

                    });
                });

            });
        },
        error: function(collection, response, options) {

        }
    });

    $('.disk-usage').easyPieChart({
        lineWidth: 12,
        barColor: '#7dc6ec',
        trackColor: '#e5e9ec',
        scaleColor: false
    });
});