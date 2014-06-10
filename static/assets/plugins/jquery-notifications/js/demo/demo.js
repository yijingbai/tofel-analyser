$(function() {

    var loc = ['top'];
    var style = 'flat';


    var update = function() {
        var classes = 'messenger-fixed';

        for (var i = 0; i < loc.length; i++)
            classes += ' messenger-on-' + loc[i];

        $.globalMessenger({
            extraClasses: classes,
            theme: style
        });
        Messenger.options = {
            extraClasses: classes,
            theme: style
        };

    };

    update();

});