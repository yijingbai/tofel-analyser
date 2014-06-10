var labelType, useGradients, nativeTextSupport, animate;

(function() {
    var ua = navigator.userAgent,
        iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
        typeOfCanvas = typeof HTMLCanvasElement,
        nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
        textSupport = nativeCanvasSupport && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
    //I'm setting this based on the fact that ExCanvas provides text support for IE
    //and that as of today iPhone/iPad current text support is lame
    labelType = (!nativeCanvasSupport || (textSupport && !iStuff)) ? 'Native' : 'HTML';
    nativeTextSupport = labelType == 'Native';
    useGradients = nativeCanvasSupport;
    animate = !(iStuff || !nativeCanvasSupport);
})();



function init() {
    //init data
    //By defining properties with the dollar sign ($)
    //in nodes and edges we can override the global configuration
    //properties for nodes and edges.
    //In this case we use "$type" and "$dim" properties to override
    //the type of the node to be plotted and its dimension.
    var json;

    $.getJSON("/api/knowledgegraph/3550", function(data) {
        json = data;
        console.log(data);
        //init Hypertree
        var ht = new $jit.Hypertree({
            //id of the visualization container
            injectInto: 'infovis',
            //By setting overridable=true,
            //Node and Edge global properties can be
            //overriden for each node/edge.
            Node: {
                overridable: true,
                'transform': false,
                color: "#f00"
            },

            Edge: {
                overridable: true,
                color: "#088"
            },
            //calculate nodes offset
            offset: 0.2,
            //Change the animation transition type
            transition: $jit.Trans.Back.easeOut,
            //animation duration (in milliseconds)
            duration: 1000,
            //Add Tips
            Tips: {
                enable: true,
                onShow: function(tip, node) {
                    //count connections
                    var count = 0;
                    node.eachAdjacency(function() {
                        count++;
                    });
                    //display node info in tooltip
                    tip.innerHTML = "<div class=\"tip-title\">" + node.name + "</div>" + "<div class=\"tip-text\"><b>connections:</b> " + count + "</div>";
                }
            },

            //This method is called right before plotting an
            //edge. This method is useful for adding individual
            //styles to edges.
            onBeforePlotLine: function(adj) {
                //Set random lineWidth for edges.
                if (!adj.data.$lineWidth)
                    adj.data.$lineWidth = Math.random() * 7 + 1;
            },

            onBeforeCompute: function(node) {
                // Log.write("centering");
            },
            //Attach event handlers on label creation.
            onCreateLabel: function(domElement, node) {
                domElement.innerHTML = node.name;
                domElement.style.cursor = "pointer";
                domElement.style.fontSize = "0.8em";
                domElement.onclick = function() {
                    ht.onClick(node.id, {
                        hideLabels: false,
                        onComplete: function() {
                            ht.controller.onComplete();
                        }
                    });
                };
            },
            //This method is called when moving/placing a label.
            //You can add some positioning offsets to the labels here.
            onPlaceLabel: function(domElement, node) {
                var width = domElement.offsetWidth;
                var intX = parseInt(domElement.style.left);
                intX -= width / 2;
                domElement.style.left = intX + 'px';
            },

            onComplete: function() {
                // Log.write("done");

                //Make the relations list shown in the right column.
                var node = ht.graph.getClosestNodeToOrigin("current");
                var html = "<h4>" + node.name + "</h4><b>Connections:</b>";
                html += "<ul>";
                node.eachAdjacency(function(adj) {
                    var child = adj.nodeTo;
                    html += "<li>" + child.name + "</li>";
                });
                html += "</ul>";
                console.log(html);
            }
        });
        //load JSON graph.
        ht.loadJSON(json, 2);
        //compute positions and plot
        ht.refresh();
        //end
        ht.controller.onBeforeCompute(ht.graph.getNode(ht.root));
        ht.controller.onComplete();
    });
    //end

}


$(function() {
    init();
});