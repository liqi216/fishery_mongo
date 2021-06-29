$(function(){

    $("#basicRun").accwizard({});
    $("#otherFigures").accwizard({});
    
    var scenario = $("#basicRunData").data('scenario');
    if(scenario == null || scenario.length == 0){
        alert('Error, could not get data for Basic Run');
    }else{
        //console.log(scenario);
        drawChart(scenario.resultlist);
    }
    
})