$(function(){

    $("#section1").accwizard({});
    $("#section2").accwizard({});
    $("#section3").accwizard({});

    var mseNames = $("#allocationData").data("msenames");
    var mseSingleLists = $("#allocationData").data("msesinglelists");
    var mseComp = $("#allocationData").data("msecomp");
    var scenarios = $("#allocationData").data("scenarios");
    
    if(scenarios == null || scenarios.length  == 0){
        alert('Error, could not get data for Allocation Comparison');
    }else{
        drawChart(mseNames,mseSingleLists,mseComp,scenarios);
    }
});