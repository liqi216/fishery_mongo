/*
 *  pl-progress-bar - v0.5.2
 *  Progress bar add-on for P-loading.
 *  https://github.com/joseshiru/pl-progress
 *
 *  Made by Jose Zuniga
 *  Under MIT License
 */
!function(a){"use strict";a.fn.ploading.addOns.plprogress=function(a){var b={},c={},d=a.$pluginElement,e=a.pluginSettings;return b.defineActions=function(){c.defineMarkup=function(){e.containerHTML="<div>",e.containerClass="p-loading-container pl-progress-spinner-container",e.spinnerClass="pl-progress-spinner",e.spinnerHTML="<progress max='100' value='0'></progress>"},c.addNewActions=function(){a.pluginPublicAction.updateProgress=function(){var b=!!e.hideAfter,c=e.progress;"updateProgress"===e.action&&a.pluginPublicAction.show(),d.find(".pl-progress-spinner").prop("value",a.pluginSettings.progress),b&&e.hideAfter>=c&&a.pluginPublicAction.hide()}},c.updateApi=function(){a.pluginSettings=e}},b.initialize=function(){b.defineActions(),c.defineMarkup(),c.addNewActions(),c.updateApi()},b.initialize(),a}}(jQuery);