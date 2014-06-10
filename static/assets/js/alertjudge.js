$(function () {


    trace = arbor.etc.trace
    objmerge = arbor.etc.objmerge
    objcopy = arbor.etc.objcopy
    var parse = Parseur().parse

    var HalfViz = function (elt) {
        var dom = $(elt)

        sys = arbor.ParticleSystem(2600, 512, 0.5)
        sys.renderer = Renderer("#viewport") // our newly created renderer will have its .init() method called shortly by sys...
        sys.screenPadding(20)

        var _ed = dom.find('#editor')
        var _code = dom.find('textarea')
        var _canvas = dom.find('#viewport').get(0)
        var _grabber = dom.find('#grabber')

        var _updateTimeout = null
        var _current = null // will be the id of the doc if it's been saved before
        var _editing = false // whether to undim the Save menu and prevent navigating away
        var _failures = null

        var that = {
            dashboard: Dashboard("#dashboard", sys),
            io: IO("#editor .io"),
            init: function () {

                $(window).resize(that.resize)
                that.resize()
                that.updateLayout(Math.max(1, $(window).width() - 340))

                _code.keydown(that.typing)
                _grabber.bind('mousedown', that.grabbed)

                $(that.io).bind('get', that.getDoc)
                $(that.io).bind('clear', that.newDoc)
                return that
            },

            getDoc: function (e) {
                $.getJSON('library/' + e.id + '.json', function (doc) {

                    // update the system parameters
                    if (doc.sys) {
                        sys.parameters(doc.sys)
                        that.dashboard.update()
                    }

                    // modify the graph in the particle system
                    _code.val(doc.src)
                    that.updateGraph()
                    that.resize()
                    _editing = false
                })

            },

            newDoc: function () {
                var lorem = "; some example nodes\nhello {color:red, label:HELLO}\nworld {color:orange}\n\n; some edges\nhello -> world {color:yellow}\nfoo -> bar {weight:5}\nbar -> baz {weight:2}"

                _code.val(lorem).focus()
                $.address.value("")
                that.updateGraph()
                that.resize()
                _editing = false
            },

            updateGraph: function (e) {
                var src_txt = _code.val()
                var network = parse(src_txt)
                $.each(network.nodes, function (nname, ndata) {
                    if (ndata.label === undefined) ndata.label = nname
                })
                sys.merge(network)
                _updateTimeout = null
            },

            resize: function () {
                var w = $(window).width() - 40
                var x = w - _ed.width()
                that.updateLayout(x)
                sys.renderer.redraw()
            },

            updateLayout: function (split) {
                var w = dom.width()
                var h = _grabber.height()
                var split = split || _grabber.offset().left
                var splitW = _grabber.width()
                _grabber.css('left', split)
                var edW = w - split
                var edH = h
                _ed.css({
                    width: edW,
                    height: edH
                })
                if (split > w - 20) _ed.hide()
                else _ed.show()
                var canvW = split - splitW
                var canvH = h
                _canvas.width = canvW
                _canvas.height = canvH
                sys.screenSize(canvW, canvH)

                _code.css({
                    height: h - 20,
                    width: edW - 4,
                    marginLeft: 2
                })
            },

            grabbed: function (e) {
                $(window).bind('mousemove', that.dragged)
                $(window).bind('mouseup', that.released)
                return false
            },
            dragged: function (e) {
                var w = dom.width()
                that.updateLayout(Math.max(10, Math.min(e.pageX - 10, w)))
                sys.renderer.redraw()
                return false
            },
            released: function (e) {
                $(window).unbind('mousemove', that.dragged)
                return false
            },
            typing: function (e) {
                var c = e.keyCode
                if ($.inArray(c, [37, 38, 39, 40, 16]) >= 0) {
                    return
                }

                if (!_editing) {
                    $.address.value("")
                }
                _editing = true

                if (_updateTimeout) clearTimeout(_updateTimeout)
                _updateTimeout = setTimeout(that.updateGraph, 900)
            }
        }

        return that.init()
    }



        function fileFormatResult(file) {
            return file.path + file.name;
        }

        function fileFormatSelection(file, container) {
            return file.name;
        }

    $('#judgeinput').select2({
        placeholder: "请选择一个输入文件",
        id: function (object) {
            return object.name;
        },
        ajax: {
            url: "/api/getResultFileByType/correlation",
            dataType: "json",
            data: function (term, page) {
                return {
                    q: term
                };
            },
            results: function (data, page) {
                return {
                    results: data.data
                };
            }
        },
        formatResult: fileFormatResult,
        formatSelection: fileFormatSelection
    });

    $('#ipinputfile').select2({
        placeholder: "请选择一个输入文件",
        id: function (object) {
            return object.name;
        },
        ajax: {
            url: "/api/getResultFileByType/redundancy",
            dataType: "json",
            data: function (term, page) {
                return {
                    q: term
                };
            },
            results: function (data, page) {
                return {
                    results: data.data
                };
            }
        },
        formatResult: fileFormatResult,
        formatSelection: fileFormatSelection
    });

    // var colorArray = ['95cde5', 'db8e3c', 'c6531e', 'ffe35f'];

    $("#judgeform").submit(
        formSubmitGenerator('#judgeform', "#PageOpenTimer", '/api/startJudge', '#reduceresult', 'Reduce结果为空', 2, 'data', 'reduce', function (msg) {
            console.log(msg);
            $('#code').html('');
            var colorindex = 0
            for (var d in msg.data.reduce) {
                var connection = msg.data.reduce[d][1];
                var alertlist = connection.split('->');
                var leftalert = alertlist[0].split(',');
                var rightalert = alertlist[1].split(',');
                var leftnode = leftalert[0] + leftalert[3] + leftalert[5] + leftalert[7];
                var rightnode = rightalert[0] + rightalert[3] + rightalert[5] + rightalert[7];
                $('#code').append(leftnode + '->' + rightnode + '\n');
                $('#code').append(leftnode + '{color:#db8e3c}' + '\n');
                $('#code').append(rightnode + '{color:#db8e3c}' + '\n');
            }

            $('#netgraph').css('display', '')
            var mcp = HalfViz("#halfviz")
            mcp.updateGraph()

            $(".superbox").html('');
            $("#graphtitle").html('时间决策结果图');
            $("#graphresult").attr('style', 'display:"');
            var imageTemplate = _.template("<div class='superbox-list'><a href='<%= imagehref %>' data-lightbox='<%= imageid %>'><img src='<%= imagehref %>' data-img='<%= imagehref %>' alt='' class='superbox-img' / ><center><span class='semi-bold'><%= name %></span></center></div>");
            for (var g in msg.data.graph) {
                splits = msg.data.graph[g].split('/');
                var image = imageTemplate({
                    'imagehref': msg.data.graph[g],
                    'imageid': msg.data.graph[g],
                    'name': splits[splits.length - 1]
                });
                $(".superbox").append(image);
            }

        }));
    $("#ipjudgeform").submit(formSubmitGenerator('#ipjudgeform', "#PageOpenTimer", '/api/startIPJudge', '#reduceresult', 'Reduce结果为空', 2, 'data', 'reduce', function (msg) {
        console.log(msg);
        $(".superbox").html('');
        $("#graphtitle").html('IP决策结果图');
        $("#graphresult").attr('style', 'display:""');
        var imageTemplate = _.template("<div class='superbox-list'><a href='<%= imagehref %>' data-lightbox='<%= imageid %>'><img src='<%= imagehref %>' data-img='<%= imagehref %>' alt='' class='superbox-img' / ><center><span class='semi-bold'><%= name %></span></center></div>");
        for (var g in msg.data.graph) {
            splits = msg.data.graph[g].split('/');
            var image = imageTemplate({
                'imagehref': msg.data.graph[g],
                'imageid': msg.data.graph[g],
                'name': splits[splits.length - 1]
            });
            $(".superbox").append(image);
        }

    }));

})