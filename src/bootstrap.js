spa.init(function(){
    spa.$cache.$styleSheets = [];
    
    // spa.$cache.$style = jQuery('<style id=spa-components-css \>');
    
    spa.EventBase.subscribe("__dom-content-loaded-start", function(){
        /* $cache stuff */
        spa.$cache.$loader = jQuery('#spa-loader-holder');
        spa.$cache.$body = jQuery('body');
        
        // spa.$cache.$style.appendTo('head');

        var $head = $('head');
        var $styleSheets = spa.$cache.$styleSheets
        for (var idx = $styleSheets.length; idx--;){
            $head.append($styleSheets[idx]);
        }
        
        spa.Shell.$container = jQuery(spa.Shell.defaultContainerSelector);
        jQuery(window).on( "popstate", function( event ) {
            spa.EventBase.publish("load-shell", {
                "path": window.location.pathname,
                "isHistory": false
            });
        } );

        spa.$cache.$body.on('click', '.ajax-link', function(event){
            event.preventDefault();
            spa.EventBase.publish("load-shell", {
                "path": jQuery(this).attr('href'),
                "isHistory": true
            });
            return false;
        });
        
    });

    spa.EventBase.subscribe("__spa-ready", function(){
        /* 
            load the first route 
        */
        jQuery.holdReady(false);
        spa.EventBase.publish("load-shell", {
            "path": window.location.pathname,
            "isHistory": false
        });
    });

    spa.EventBase.subscribe("load-shell", function(data){

        spa.Router.resolver(data.path, data.isHistory);

        spa.$cache.$loader.hide();
        spa.Shell.$container.show();
    });

    (function(){
        var buildTaskCount = spa.buildTaskCount;

        spa.EventBase.subscribe("__dom-content-loaded-end", function(data){
            if (buildTaskCount === 0){
                spa.EventBase.publish("__spa-ready");
            }
        });
        spa.EventBase.subscribe("spa-build-task-complete", function(data){
            buildTaskCount--;
            if (buildTaskCount === 0){
                spa.EventBase.publish("__spa-ready");
            }
        });
    }());

});