$(function(){

    $("#section1").accwizard({});
    $("#section2").accwizard({});
    $("#section3").accwizard({});

    var mseNames = $("#legalSizeData").data("msenames");
    var mseSingleLists = $("#legalSizeData").data("msesinglelists");
    var mseComp = $("#legalSizeData").data("msecomp");
    var scenarios = $("#legalSizeData").data("scenarios");
    
    if(scenarios == null || scenarios.length  == 0){
        alert('Error, could not get data for Legal Size Comparison');
    }else{
        //console.log(scenario);
        drawChart(mseNames,mseSingleLists,mseComp,scenarios);
    }
});