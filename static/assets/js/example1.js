var labelType, useGradients, nativeTextSupport, animate;

(function () {
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

    $.getJSON("/api/knowledgetree/368", function (data) {
        console.log(data);
        //init RGraph
        var rgraph = new $jit.RGraph({
            //Where to append the visualization
            injectInto: 'infovis',
            //Optional: create a background canvas that plots
            //concentric circles.
            background: {
                CanvasStyles: {
                    strokeStyle: '#555'
                }
            },
            //Add navigation capabilities:
            //zooming by scrolling and panning.
            Navigation: {
                enable: true,
                panning: true,
                zooming: 10
            },
            //Set Node and Edge styles.
            Node: {
                color: '#ddeeff'
            },

            Edge: {
                color: '#C17878',
                lineWidth: 1.5
            },

            onBeforeCompute: function (node) {
                //Add the relation list in the right column.
                //This list is taken from the data property of each JSON node.
            },

            //Add the name of the node in the correponding label
            //and a click handler to move the graph.
            //This method is called once, on label creation.
            onCreateLabel: function (domElement, node) {
                domElement.innerHTML = 'r';
                domElement.onclick = function () {
                    rgraph.onClick(node.id, {
                        onComplete: function () {
                            console.log("done");
                        }
                    });
                };
            },
            //Change some label dom properties.
            //This method is called each time a label is plotted.
            onPlaceLabel: function (domElement, node) {
                var style = domElement.style;
                style.display = '';
                style.cursor = 'pointer';

                if (node._depth <= 1) {
                    style.fontSize = "0.8em";
                    style.color = "#ccc";

                } else if (node._depth == 2) {
                    style.fontSize = "0.7em";
                    style.color = "#494949";

                } else {
                    style.display = 'none';
                }

                var left = parseInt(style.left);
                var w = domElement.offsetWidth;
                style.left = (left - w / 2) + 'px';
            }
        });
        //load JSON data
        rgraph.loadJSON(data);
        //trigger small animation
        rgraph.graph.eachNode(function (n) {
            var pos = n.getPos();
            pos.setc(-200, -200);
        });
        rgraph.compute('end');
        rgraph.fx.animate({
            modes: ['polar'],
            duration: 2000
        });
        //end

    });



}


$(function () {
    init();
    console.log('hello');
});