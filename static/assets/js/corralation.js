$(function () {

    function fileFormatResult(file) {
        return file.path + file.name;
    }

    function fileFormatSelection(file, container) {
        return file.name;
    }

    $('#inputfile').select2({
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

    jsPlumb.ready(function () {

        var color = "gray";

        var instance = jsPlumb.getInstance({
            // notice the 'curviness' argument to this Bezier curve.  the curves on this page are far smoother
            // than the curves on the first demo, which use the default curviness value.
            Connector: ["Bezier", {
                curviness: 50
            }],
            DragOptions: {
                cursor: "pointer",
                zIndex: 2000
            },
            PaintStyle: {
                strokeStyle: color,
                lineWidth: 2
            },
            EndpointStyle: {
                radius: 0.1,
                fillStyle: color
            },
            HoverPaintStyle: {
                strokeStyle: "#ec9f2e"
            },
            EndpointHoverStyle: {
                fillStyle: "#ec9f2e"
            },
            Container: "chart-demo2"
        });

        // suspend drawing and initialise.
        instance.doWhileSuspended(function () {
            // declare some common values:
            var arrowCommon = {
                foldback: 0.7,
                fillStyle: color,
                width: 14
            },
                // use three-arg spec to create two different arrows with the common values:
                overlays = [
                    ["Arrow", {
                            location: 1
                        },
                        arrowCommon
                    ],
                    ["Label", {
                        label: "FOO",
                        id: "label",
                        cssClass: "aLabel"
                    }]
                ];

            // add endpoints, giving them a UUID.
            // you DO NOT NEED to use this method. You can use your library's selector method.
            // the jsPlumb demos use it so that the code can be shared between all three libraries.
            var windows = jsPlumb.getSelector(".chart-demo .window");

            var result = instance.connect({
                'source': 'chartWindow1',
                'target': 'chartWindow2',
                'anchor': ['Left', 'Right'],
                overlays: overlays
            });
            result.getOverlay("label").setLabel('con');

            var result = instance.connect({
                'source': 'chartWindow1',
                'target': 'chartWindow4',
                'anchor': ['Left', 'Right'],
                overlays: overlays
            });
            result.getOverlay("label").setLabel('con');
            var result = instance.connect({
                'source': 'chartWindow1',
                'target': 'chartWindow6',
                'anchor': ['Left', 'Right'],
                overlays: overlays
            });
            result.getOverlay("label").setLabel('con');
            result.getOverlay("label").setLabel('con');
            var result = instance.connect({
                'source': 'chartWindow3',
                'target': 'chartWindow5',
                'anchor': ['Left', 'Right'],
                overlays: overlays
            });
            result.getOverlay("label").setLabel('con');
            instance.draggable(windows);

        });

    });

    $("#corraltionform").submit(
        formSubmitGenerator('#corraltionform', "#PageOpenTimer", '/api/startCorrelation', '#reduceresult', 'Reduce结果为空', 2, 'data', 'table', function (msg) {
            $("#chart-demo2").fadeOut('fast');
            $("#graphtitle").html('关联结果图');
            var obj = eval("(" + msg.data + ")");
            // console.log(graphobject);
            var graph = obj.graph
            var graphPanelTemplate = _.template("<div class='demo chart-demo' id='chart-demo' style='height:<%= panelheight%>'></div>");
            var windowTemplate = _.template("<div class='window' style='top:<%= ptop %>em; left:<%= pleft %>em;' id='window<%= windowid %>'><%= time %><br /><%= msg %><br /><%= srcip %>:<%= srcport%><br /><%= dstip %>:<%= dstport%></div>");

            windowheight = 0;
            for (var gindex in graph) {
                var group = graph[gindex];
                windowheight += group.value.length * 7;
                windowheight += 2;
            }
            console.log(windowheight);

            $('#graphpanel').append(graphPanelTemplate({
                'panelheight': windowheight + 'em;'
            }));
            var topvalue = 0;
            var windowid = 1;
            var connectDict = {};
            for (var gindex in graph) {
                var group = graph[gindex];
                var keypadding = (group.value.length * 7 - 7) / 2 + topvalue;
                var alertlist = group.key.split(',');
                var datetime = alertlist[0];
                var seg_id = alertlist[1];
                var rev_id = alertlist[2];
                var msg = alertlist[3];
                var protocol = alertlist[4];
                var srcip = alertlist[5];
                var srcport = alertlist[6];
                var dstip = alertlist[7];
                var dstport = alertlist[8];
                var windowdom = windowTemplate({
                    'ptop': keypadding,
                    'pleft': 5,
                    'windowid': windowid,
                    'time': datetime,
                    'msg': msg,
                    'srcip': srcip,
                    'srcport': srcport,
                    'dstip': dstip,
                    'dstport': dstport
                });
                $('#chart-demo').append(windowdom);
                var leftwindowid = windowid;
                connectDict['window' + leftwindowid] = []
                windowid++;
                for (var windex in group.value) {
                    var window = group.value[windex];
                    var alertlist = window.split(',');
                    var datetime = alertlist[0];
                    var seg_id = alertlist[1];
                    var rev_id = alertlist[2];
                    var msg = alertlist[3];
                    var protocol = alertlist[4];
                    var srcip = alertlist[5];
                    var srcport = alertlist[6];
                    var dstip = alertlist[7];
                    var dstport = alertlist[8];
                    var windowdom = windowTemplate({
                        'ptop': topvalue,
                        'pleft': 30,
                        'windowid': windowid,
                        'time': datetime,
                        'msg': msg,
                        'srcip': srcip,
                        'srcport': srcport,
                        'dstip': dstip,
                        'dstport': dstport
                    });
                    $('#chart-demo').append(windowdom);
                    connectDict['window' + leftwindowid].push('window' + windowid);
                    topvalue += 7;
                    windowid++;
                }
                topvalue += 2;
            }

            var connectionarray = [];

            jsPlumb.ready(function () {

                var color = "gray";

                var instance = jsPlumb.getInstance({
                    // notice the 'curviness' argument to this Bezier curve.  the curves on this page are far smoother
                    // than the curves on the first demo, which use the default curviness value.
                    Connector: ["Bezier", {
                        curviness: 50
                    }],
                    DragOptions: {
                        cursor: "pointer",
                        zIndex: 2000
                    },
                    PaintStyle: {
                        strokeStyle: color,
                        lineWidth: 2
                    },
                    EndpointStyle: {
                        radius: 0.1,
                        fillStyle: color
                    },
                    HoverPaintStyle: {
                        strokeStyle: "#ec9f2e"
                    },
                    EndpointHoverStyle: {
                        fillStyle: "#ec9f2e"
                    },
                    Container: "chart-demo"
                });

                // suspend drawing and initialise.
                instance.doWhileSuspended(function () {
                    // declare some common values:
                    var arrowCommon = {
                        foldback: 0.7,
                        fillStyle: color,
                        width: 14
                    },
                        // use three-arg spec to create two different arrows with the common values:
                        overlays = [
                            ["Arrow", {
                                    location: 1
                                },
                                arrowCommon
                            ],
                            ["Label", {
                                label: "FOO",
                                id: "label",
                                cssClass: "aLabel"
                            }]
                        ];

                    // add endpoints, giving them a UUID.
                    // you DO NOT NEED to use this method. You can use your library's selector method.
                    // the jsPlumb demos use it so that the code can be shared between all three libraries.
                    var windows = jsPlumb.getSelector(".chart-demo .window");

                    for (var source in connectDict) {
                        for (var dindex in connectDict[source]) {
                            var result = instance.connect({
                                'source': source,
                                'target': connectDict[source][dindex],
                                'anchor': ['Left', 'Right'],
                                overlays: overlays
                            });
                            connectionarray.push(result);
                            result.getOverlay("label").setLabel('con');
                        }
                    }

                    instance.draggable(windows);

                });

            });
        })
    )



});