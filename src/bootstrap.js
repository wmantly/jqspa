spa.init(function(){
    spa.$cache.$styleSheets = spa.StyleSheets.create();
    
    spa.subscribe("__dom-content-loaded-start", function(){
        /* $cache stuff */
        spa.$cache.$loader = jQuery('#spa-loader-holder');
        spa.$cache.$body = jQuery('body');
        var args = [].slice.call(spa.$cache.$styleSheets);
        if(args.length){
            args.unshift(jQuery('head'));
            spa.$cache.$styleSheets.load.apply({}, args);
        }

        
        spa.Shell.$container = jQuery(spa.Shell.defaultContainerSelector);
        jQuery(window).on( "popstate", function( event ) {
            spa.publish("load-shell", {
                "path": window.location.pathname,
                "isHistory": false
            });
        } );

        spa.$cache.$body.on('click', '.ajax-link', function(event){
            event.preventDefault();
            spa.publish("load-shell", {
                "path": jQuery(this).attr('href'),
                "isHistory": true
            });
            return false;
        });
        
    });

    spa.subscribe("__spa-ready", function(){
        /* 
            load the first route 
        */
        jQuery.holdReady(false);
        spa.publish("load-shell", {
            "path": window.location.pathname,
            "isHistory": false
        });
    });

    spa.subscribe("load-shell", function(data){
        
        spa.Router.resolver(data.path, data.isHistory);

        spa.$cache.$loader.hide();
        spa.Shell.$container.show();
    });

    (function(){
        var buildTaskCount = spa.buildTaskCount;

        spa.subscribe("__dom-content-loaded-end", function(data){
            if (buildTaskCount === 0){
                spa.publish("__spa-ready");
            }
            buildTaskCount--;
        });
        spa.subscribe("spa-build-task-complete", function(data){
            if (buildTaskCount === 0){
                spa.publish("__spa-ready");
            }
            buildTaskCount--;
        });
    }());

});