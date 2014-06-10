$(function() {
    MartView = Backbone.View.extend({
        tagName: "div",
        className: "row",
        template: _.template($('#item-mart').html()),

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
    });

    MetaView = Backbone.View.extend({
        tagName: "tr",
        template: _.template($('#item-meta').html()),

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
    });


    metalist.fetch({
        success: function(collection, response, options) {
            console.log(collection);
        }
    })

    martlist.fetch({
        success: function(collection, response, options) {
            collection.each(function(mart) {
                var view = new MartView({
                    model: mart
                });
                $(".content").append(view.render().el);

                var tablemetalist = new TableMetas({
                    'tableid': mart.get('id')
                });
                tablemetalist.fetch({
                    success: function(tablemetac, response, options) {
                        console.log(tablemetac);
                        tablemetac.each(function(m) {

                            var mview = new MetaView({
                                model: m
                            });
                            $("#metacontent" + mart.get('id')).append(mview.render().el);
                        });
                    }
                });

                $('pre code').each(function(i, e) {
                    hljs.highlightBlock(e)
                });
            });
        }
    });

});