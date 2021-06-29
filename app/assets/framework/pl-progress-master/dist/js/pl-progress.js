/*
 *  pl-progress-bar - v0.5.2
 *  Progress bar add-on for P-loading.
 *  https://github.com/joseshiru/pl-progress
 *
 *  Made by Jose Zuniga
 *  Under MIT License
 */
( function( $ ) {
    "use strict";

    $.fn.ploading.addOns.plprogress = function( api ) {
        var addOnTask = {};
        var addOnAction = {};
        var $pluginElement = api.$pluginElement;
        var pluginSettings = api.pluginSettings;

        addOnTask.defineActions = function() {
            addOnAction.defineMarkup = function() {
                pluginSettings.containerHTML = "<div>";
                pluginSettings.containerClass = "p-loading-container pl-progress-spinner-container";
                pluginSettings.spinnerClass = "pl-progress-spinner";
                pluginSettings.spinnerHTML = "<progress max='100' value='0'></progress>";
            };

            addOnAction.addNewActions = function() {

                api.pluginPublicAction.updateProgress = function() {
                    var hideAfterValue = pluginSettings.hideAfter ? true : false;
                    var currentProgress = pluginSettings.progress;

                    if ( pluginSettings.action === "updateProgress" ) {
                        api.pluginPublicAction.show();
                    }

                    $pluginElement.find( ".pl-progress-spinner" ).prop( "value", api.pluginSettings.progress );

                    if ( hideAfterValue &&  pluginSettings.hideAfter >= currentProgress ) {
                        api.pluginPublicAction.hide();
                    }
                };
            };

            addOnAction.updateApi = function() {
                api.pluginSettings = pluginSettings;
            };
        };

        addOnTask.initialize = function() {
            addOnTask.defineActions();
            addOnAction.defineMarkup();
            addOnAction.addNewActions();
            addOnAction.updateApi();
        };

        addOnTask.initialize();

        return api;
    };

} )( jQuery );
