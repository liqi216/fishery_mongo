/****************************Initilaize charts*****************************/
var catchChart = echarts.init(document.getElementById('catchChart'));
var SSBGulfChart = echarts.init(document.getElementById('SSBGulf'));
var catch20Chart = echarts.init(document.getElementById('catch20'));
var annualCatch20Chart = echarts.init(document.getElementById('annualCatch20'));
var terminalChart = echarts.init(document.getElementById('terminalChart'));
var lowestChart = echarts.init(document.getElementById('lowestChart'));
var percentGreenChart = echarts.init(document.getElementById('percentGreen'));
var radarChart_1 = echarts.init(document.getElementById('radarChart_1'));
var totalDiscardsChart = echarts.init(document.getElementById('totalDiscardsChart'));
var varDiscardsChart = echarts.init(document.getElementById('varDiscardsChart'));

var commCatchChart = echarts.init(document.getElementById('commCatchChart'));
var fedCatchChart = echarts.init(document.getElementById('fedCatchChart'));
var privateCatchChart = echarts.init(document.getElementById('privateCatchChart'));
var SSBGulfFirstChart = echarts.init(document.getElementById('SSBGulfFirst_Chart'));
var SSBGulfLastChart = echarts.init(document.getElementById('SSBGulfLast_Chart'));
var barRotationChart_1 = echarts.init(document.getElementById('barRotationChart_1'));
var stateCatchFirstChart = echarts.init(document.getElementById('stateCatchFirst_Chart'));
var stateCatchLastChart = echarts.init(document.getElementById('stateCatchLast_Chart'));
var stateSeasLastChart = echarts.init(document.getElementById('stateSeasLast_Chart'));
var stateSeasFirstChart = echarts.init(document.getElementById('stateSeasFirst_Chart'));
var catchFirstChart = echarts.init(document.getElementById('catchFirst_Chart'));
var catchLastChart = echarts.init(document.getElementById('catchLast_Chart'));
var commDiscardsChart = echarts.init(document.getElementById('commDiscardsChart'));
var recrDiscardsChart = echarts.init(document.getElementById('recrDiscardsChart'));

var commRadarChart = echarts.init(document.getElementById('commRadarChart'));
var recrRadarChart = echarts.init(document.getElementById('recrRadarChart'));

//https://www.cnblogs.com/zhxuxu/p/10634392.html
//function to return scientific notation of value
function toScientific(value) {
	var res = value.toString ();                                            
	var numN1 = 0; 
	var numN2 = 1;
	var num1 = 0;
	var num2 = 0;
	var t1 = 1;
	for (var k = 0; k <res.length; k ++) {
		if (res [k] == ".")
		   t1 = 0;
		if (t1)
		   num1 ++;
		else
		   num2 ++;                                                                                              
	}
												   
	if (Math.abs (value) <1 && res.length> 4)
	{
		for (var i = 2; i <res.length; i ++) {                                              
			if (res [i] == "0") {
				numN2 ++;
			} else if (res [i] == ".")
				continue;
			else
				break;
		}
		var v = parseFloat (value);                                                
		v = v * Math.pow (10, numN2);
		return v.toString () + "e-" + numN2;
	} else if (num1> 4)
	{
		if (res [0] == "-")
			numN1 = num1-2;
		else
			numN1 = num1-1;
		var v = parseFloat (value);                                                
		v = v / Math.pow (10, numN1);
		if (num2> 4)
			v = v.toFixed (4);
		return v.toString () + "e+" + numN1;
	} else
		return parseFloat (value);                                                                                  
}


function drawChart(mseNames,mseSingleLists,mseComp,scenarios){

    //console.log(scenarios);

    var yearsxAxis = ['Year'];

    //Section 1
    var catch_data = [];

    var ssbGulf_data = [];

    var catch20_data = [];
    var catch20_high_data = [];
    var catch20_low_data = [];

    var annualCatch20_data = [];
    var annualCatch20_high_data = [];
    var annualCatch20_low_data = [];

    var terminalSSB_data = [];
    var terminalSSB_high_data = [];
    var terminalSSB_low_data = [];

    var lowestSSB_data = [];
    var lowestSSB_high_data = [];
    var lowestSSB_low_data = [];

    var percentGreen_data = [];

    var radar_data_1 = [];

    var totalDiscards_data = [];
    var totalDiscards_low_data = [];
    var totalDiscards_high_data = [];

    var varDiscards_data = [];
    var varDiscards_low_data = [];
    var varDiscards_high_data = [];

    //Section 2
    var commCatch_data = [];

    var fedCatch_data = [];

    var privateCatch_data = [];

    var ssb_first_data = [];
    var ssb_first_low_data = [];
    var ssb_first_high_data = [];

    var ssb_last_data = [];
    var ssb_last_low_data = [];
    var ssb_last_high_data = [];

    var fed_first_data = [];
    var private_first_data = [];
    var fed_last_data = [];
    var private_last_data = [];

    var alCatch_first_data = [];
    var flCatch_first_data = [];
    var laCatch_first_data = [];
    var msCatch_first_data = [];
    var txCatch_first_data = [];

    var alCatch_last_data = [];
    var flCatch_last_data = [];
    var laCatch_last_data = [];
    var msCatch_last_data = [];
    var txCatch_last_data = [];

    var alSeas_first_data = [];
    var flSeas_first_data = [];
    var laSeas_first_data = [];
    var msSeas_first_data = [];
    var txSeas_first_data = [];

    var alSeas_last_data = [];
    var flSeas_last_data = [];
    var laSeas_last_data = [];
    var msSeas_last_data = [];
    var txSeas_last_data = [];

    var catchFirst_data = [];
    var catchFirst_low_data = [];
    var catchFirst_high_data = [];

    var catchLast_data = [];
    var catchLast_low_data = [];
    var catchLast_high_data = [];

    //Section 3
    var commDiscards_data = [];

    var recrDiscards_data = [];

    var commRadar_data = [];

    var recrRadar_data = [];



    //error bar rendering
    function renderItem(params, api) {
        var xValue = api.value(0);
        var highPoint = api.coord([xValue, api.value(1)]);
        var lowPoint = api.coord([xValue, api.value(2)]);
        var halfWidth = api.size([1, 0])[0] * 0.1;
        var style = api.style({
            stroke: api.visual('color'),
            fill: null
        });

        return {
            type: 'group',
            children: [{
                type: 'line',
                shape: {
                    x1: highPoint[0] - halfWidth, y1: highPoint[1],
                    x2: highPoint[0] + halfWidth, y2: highPoint[1]
                },
                style: style
            }, {
                type: 'line',
                shape: {
                    x1: highPoint[0], y1: highPoint[1],
                    x2: lowPoint[0], y2: lowPoint[1]
                },
                style: style
            }, {
                type: 'line',
                shape: {
                    x1: lowPoint[0] - halfWidth, y1: lowPoint[1],
                    x2: lowPoint[0] + halfWidth, y2: lowPoint[1]
                },
                style: style
            }]
        };
    }

    //get error bar option using the input data
    function getErrorOption(low,high){
        var error =[];
        for(var i = 0; i < low.length; i++){
            error.push([
                    i,
                    low[i],   //low
                    high[i]   //high
            ]);
        }

        var errorOption = {
            type: 'custom',
            name: 'error',
            color:'black',
            itemStyle: {
                    normal: {
                            borderWidth: 1.5
                    }
            },
            renderItem: renderItem,
            encode: {
                    x: 0,
                    y: [1, 2]
            },
            data: error,
            z: 100
        }
        return errorOption;
    }

    //Essential Figures, Section 1
    //Total Catch
    var catchOption = {
        title:{
            text:'Total Catch'
        },
        legend: {
            padding: [40, 20]
        },
        tooltip: {
            trigger: 'axis',
            showContent: true
        },
        dataset: {
            source: []
        },
        xAxis: {type: 'category'},
        yAxis: {
            gridIndex: 0,
            name:'Catch(1000 lb)',
            max: function (value) {
                var newVal = value.max * 1.2;
                return Math.round(newVal/1000)*1000
            }
        },
        grid:{
            bottom:'20%',
            top:'15%'
        },
        series: []
    }

    //SSB for the Gulf
    var SSBGulfOption = {
        title:{
            text:'SSB for the Gulf'
        },
        legend: {
            padding: [40, 20]
        },
        tooltip: {
            trigger: 'axis',
            showContent: true
        },
        dataset: {
            source: []
        },
        xAxis: {type: 'category'},
        yAxis: {
            name:'SSB(1000 eggs)',
            max: function (value) {
                var newVal = value.max * 1.2;
                return Math.round(newVal/1e+11)*1e+11;
            },
            axisLabel: {
                formatter: function (value){
                    return toScientific(value);
                }
            }
        },
        grid:{
            bottom:'20%',
            top:'15%'
        },
        series: []
    }


    //Catch for 20-Year Management
    var catch20option = {
        title:{
            text:'Catch for 20-Year Management'
        },
        xAxis: {
            type: 'category',
            data: mseNames,
            axisLabel:{
                rotate:30,
            }
        },
        yAxis: {
            type: 'value',
            name:'Catch(1000 lb)',
            max: function (value) {
                var newVal = value.max * 1.2;
                return Math.round(newVal/10000)*10000;
            },
        },
        grid:{
            left:'15%'
        },
        tooltip : {
            trigger: 'axis',
            formatter:function(params){
                return params[0].axisValue + '</br>Upper 97.5%: ' + params[1].data[2] + '</br>Median: ' + params[0].data + '</br>Lower 2.5%: ' + params[1].data[1];
            }
        },
        series: [{
            data: [],
            type: 'bar',
            color:'orange'
        }]
    };

    //Annual Catch Variation, 20-Year Management
    var annualCatch20option = {
        title:{
            text:'Annual Catch Variation, 20-Year Management'
        },
        xAxis: {
            type: 'category',
            data: mseNames,
            axisLabel:{
                rotate:30,
            }
        },
        yAxis: {
            type: 'value',
            name:'Catch(1000 lb)',
            max: function (value) {
                var newVal = value.max * 1.2;
                return Number(newVal.toFixed(2));
            },
        },
        grid:{
            left:'15%'
        },
        tooltip : {
            trigger: 'axis',
            formatter:function(params){
                return params[0].axisValue + '</br>Upper 97.5%: ' + params[1].data[2] + '</br>Median: ' + params[0].data + '</br>Lower 2.5%: ' + params[1].data[1];
            }
        },
        series: [{
            data: [],
            type: 'bar',
            color:'green'
        }]
    };

    //Terminal SSB after 20-Year Management
    var terminalSSBOption = {
        title:{
            text:'Terminal SSB after 20-Year Management'
        },
        xAxis: {
            type: 'category',
            data: mseNames,
            axisLabel:{
                rotate:30,
            }
        },
        yAxis: {
            type: 'value',
            name:'SSB(1000 eggs)',
            max: function (value) {
                var newVal = value.max * 1.2;
                return Math.round(newVal/1e+12)*1e+12;
            },
            axisLabel: {
                formatter: function (value){
                    return toScientific(value);
                }
            }
        },
        tooltip : {
            trigger: 'axis',
            formatter:function(params){
                return params[0].axisValue + '</br>Upper 97.5%: ' + params[1].data[2] + '</br>Median: ' + params[0].data + '</br>Lower 2.5%: ' + params[1].data[1];
            }
        },
        series: [{
            data: [],
            type: 'bar',
            color:'#43B7BC'
        }]
    };

    //Lowest SSB during 20-Year Management
    var lowestSSBOption = {
        title:{
            text:'Lowest SSB during 20-Year Management'
        },
        xAxis: {
            type: 'category',
            data: mseNames,
            axisLabel:{
                rotate:30,
            }
        },
        yAxis: {
            type: 'value',
            name:'SSB(1000 eggs)',
            max: function (value) {
                var newVal = value.max * 1.2;
                return Math.round(newVal/1e+12)*1e+12;
            },
            axisLabel: {
                formatter: function (value){
                    return toScientific(value);
                }
            }
        },
        tooltip : {
            trigger: 'axis',
            formatter:function(params){
                return params[0].axisValue + '</br>Upper 97.5%: ' + params[1].data[2] + '</br>Median: ' + params[0].data + '</br>Lower 2.5%: ' + params[1].data[1];
            }
        },
        series: [{
            data: [],
            type: 'bar',
            color:'#304481'
        }]
    };

    //Percentage to Green
    var percentGreen_option = {
        title:{
            text:'Percentage to Green'
        },
        xAxis: {
            type: 'category',
            data: mseNames,
            axisLabel:{
                rotate:30,
            }
        },
        yAxis: {
            type: 'value',
            name:'',
            max: function (value) {
                var newVal = value.max * 1.2;
                return Number(newVal.toFixed(1));
            },
        },
        tooltip : {
            trigger: 'axis',
        },
        series: [{
            data: [],
            type: 'bar',
            color:'#643081'
        }]
    };

    var radarOption_1 = {
        title: {
            text: ''
        },
        tooltip: {},
        legend: {
            data: mseNames,
            left:'0',
            top:'0',
        },
        radar: {
            // shape: 'circle',
            name: {
                textStyle: {
                    color: '#fff',
                    backgroundColor: '#999',
                    borderRadius: 3,
                    padding: [3, 5]
            }
            },
            indicator: [
            { name: 'Annual Catch Variation 20-Year Management', max: .40},
            { name: 'Catch for 20-Year Management', max: 250000},
            { name: 'Terminal SSB after 20-Year Management', max: 2e+12},
            { name: 'Lowest SSB during 20-Year Management', max: 1e+12},
            { name: 'Percentage to Green', max: 1},
            ]
        },
        series: [{
            name: 'Radar Chart',
            type: 'radar',
            data : []
        }]
    };

    //Total Discards
    var totalDiscards_option = {
        title:{
            text:'Discard for 20-Year Management'
        },
        xAxis: {
            type: 'category',
            data: mseNames,
            axisLabel:{
                rotate:30,
            }
        },
        yAxis: {
            type: 'value',
            name:'Discard(1000 lb)',
            max: function (value) {
                var newVal = value.max * 1.2;
                return Math.round(newVal/10000)*10000;
            },
        },
        grid:{
            left:'15%'
        },
        tooltip : {
            trigger: 'axis',
            formatter:function(params){
                return params[0].axisValue + '</br>Upper 97.5%: ' + params[1].data[2] + '</br>Median: ' + params[0].data + '</br>Lower 2.5%: ' + params[1].data[1];
            }
        },
        series: [{
            data: [],
            type: 'bar'
        }]
    };

    //var Discards
    var varDiscards_option = {
        title:{
            text:'Annual Discard Variation, 20-Year Management'
        },
        xAxis: {
            type: 'category',
            data: mseNames,
            axisLabel:{
                rotate:30,
            }
        },
        yAxis: {
            type: 'value',
            name:'Standard Deviation(1000 lb)',
            max: function (value) {
                var newVal = value.max * 1.2;
                return Number(newVal.toFixed(1));
            },
        },
        grid:{
            left:'15%'
        },
        tooltip : {
            trigger: 'axis',
            formatter:function(params){
                return params[0].axisValue + '</br>Upper 97.5%: ' + params[1].data[2] + '</br>Median: ' + params[0].data + '</br>Lower 2.5%: ' + params[1].data[1];
            }
        },
        series: [{
            data: [],
            type: 'bar',
            color:'#B2AFB4'
        }]
    };


    //Other Detailed Figures, Section 2
    //Commercial Catch
    var commCatchOption = {
        title:{
            text:'Commercial Catch'
        },
        legend: {
            padding: [40, 20]
        },
        tooltip: {
            trigger: 'axis',
            showContent: true
        },
        dataset: {
            source: []
        },
        xAxis: {type: 'category'},
        yAxis: {
            name:'Catch(1000 lb)',
            max: function (value) {
                var newVal = value.max * 1.2;
                return Math.round(newVal/1000)*1000
            }
        },
        grid:{
            bottom:'20%',
            top:'15%'
        },
        series: []
    }

    //Federal For-hire Catch
    var fedCatchOption = {
        title:{
            text:'Federal For-hire Catch'
        },
        legend: {
            padding: [40, 20]
        },
        tooltip: {
            trigger: 'axis',
            showContent: true
        },
        dataset: {
            source: []
        },
        xAxis: {type: 'category'},
        yAxis: {
            name:'Catch(1000 lb)',
            max: function (value) {
                var newVal = value.max * 1.2;
                return Math.round(newVal/100)*100
            }
        },
        grid:{
            bottom:'20%',
            top:'15%'
        },
        series: []
    }

    //Private Angling Catch
    var privateCatchOption = {
        title:{
            text:'Private Angling Catch'
        },
        legend: {
            padding: [40, 20]
        },
        tooltip: {
            trigger: 'axis',
            showContent: true
        },
        dataset: {
            source: []
        },
        xAxis: {type: 'category'},
        yAxis: {
            name:'Catch(1000 lb)',
            max: function (value) {
                var newVal = value.max * 1.2;
                return Math.round(newVal/100)*100
            }
        },
        grid:{
            bottom:'20%',
            top:'15%'
        },
        series: []
    }

    //SSB for the Gulf, Ave of First 5-Year
    var ssbfirst_option = {
        title:{
            text:'SSB for the Gulf, Ave of First 5-Year'
        },
        xAxis: {
            type: 'category',
            data: mseNames,
            axisLabel:{
                rotate:30,
            }
        },
        yAxis: {
            type: 'value',
            name:'SSB(1000 eggs)',
            // max: function (value) {
            // 	var newVal = value.max * 1.2;
            // 	console.log(Math.round(newVal/1e+12)*1e+12);
            // 	return Math.round(newVal/1e+12)*1e+12;
            // },
            axisLabel: {
                formatter: function (value){
                    return toScientific(value);
                }
            }
        },
        tooltip : {
            trigger: 'axis',
            formatter:function(params){
                return params[0].axisValue + '</br>Upper 97.5%: ' + params[1].data[2] + '</br>Median: ' + params[0].data + '</br>Lower 2.5%: ' + params[1].data[1];
            }
        },
        series: [{
            data: [],
            type: 'bar',
            color:'#D53E75'
        }]
    };

    //SSB for the Gulf, Ave of Last 5-Year
    var ssbLast_option = {
        title:{
            text:'SSB for the Gulf, Ave of Last 5-Year'
        },
        xAxis: {
            type: 'category',
            data: mseNames,
            axisLabel:{
                rotate:30,
            }
        },
        yAxis: {
            type: 'value',
            name:'SSB(1000 eggs)',
            max: function (value) {
                var newVal = value.max * 1.2;
                return Math.round(newVal/1e+12)*1e+12;
            },
            axisLabel: {
                formatter: function (value){
                    return toScientific(value);
                }
            }
        },
        tooltip : {
            trigger: 'axis',
            formatter:function(params){
                return params[0].axisValue + '</br>Upper 97.5%: ' + params[1].data[2] + '</br>Median: ' + params[0].data + '</br>Lower 2.5%: ' + params[1].data[1];
            }
        },
        series: [{
            data: [],
            type: 'bar',
            color:'#52D552'
        }]
    };

    //Bar Label rotation 1
    var barLabelOption_1 = {
        color: ['#003366', '#006699', '#4cabce', '#e5323e'],
        title:{
            text:'Catches for Federal For-hire and Private Angling Sectors in the First 5 Years'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            padding: [50,20],
            width:'80%'
        },
        grid:{
            top:'20%',
            //bottom:'23%'   
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {show: false},
                axisLabel:{
                    rotate:30,
                },
                data: mseNames
            }
        ],
        yAxis: [
            {
                type: 'value',
                name:'Catch(1000 lb)',
                max: function (value) {
                    var newVal = value.max * 1.2;
                    return Math.round(newVal/100)*100;
                },
            }
        ],
        series: [
            {
                name: 'Federal For-hire Catch, Ave of First 5-Year',
                type: 'bar',
                barGap: 0,
                data: []
            },
            {
                name: 'Private Angling Catch, Ave of First 5-Year',
                type: 'bar',
                data: []
            },
            {
                name: 'Federal For-hire Catch, Ave of Last 5-Year',
                type: 'bar',
                data: []
            },
            {
                name: 'Private Angling Catch, Ave of Last 5-Year',
                type: 'bar',
                data: []
            }
        ]
        
    };

    //State Private Angling Catch, Ave First 5-Year
    var stateCatchFirst_option = {
        color: ['#003366', '#006699', '#4cabce', '#e5323e','#EF9A9A'],
        title:{
            text:'State Private Angling Catch, Ave First 5-Year'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            padding: [40,20],
            //width:'80%'
        },
        grid:{
            top:'12%',
            //bottom:'23%'   
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {show: false},
                axisLabel:{
                    rotate:30,
                },
                data: mseNames
            }
        ],
        yAxis: [
            {
                type: 'value',
                name:'Catch(1000 lb)',
                max: function (value) {
                    var newVal = value.max * 1.2;
                    return Math.round(newVal/100)*100;
                },
            }
        ],
        series: [
            {
                name: 'AL',
                type: 'bar',
                barGap: 0,
                data: []
            },
            {
                name: 'FL',
                type: 'bar',
                data: []
            },
            {
                name: 'LA',
                type: 'bar',
                data: []
            },
            {
                name: 'MS',
                type: 'bar',
                data: []
            },
            {
                name: 'TX',
                type: 'bar',
                data: []
            }
        ]
        
    };

    //State Private Angling Catch, Ave Last 5-Year
    var stateCatchLast_option = {
        color: ['#003366', '#006699', '#4cabce', '#e5323e','#EF9A9A'],
        title:{
            text:'State Private Angling Catch, Ave Last 5-Year'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            padding: [40,20],
            //width:'80%'
        },
        grid:{
            top:'12%',
            //bottom:'23%'   
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {show: false},
                axisLabel:{
                    rotate:30,
                },
                data: mseNames
            }
        ],
        yAxis: [
            {
                type: 'value',
                name:'Catch(1000 lb)',
                max: function (value) {
                    var newVal = value.max * 1.2;
                    return Math.round(newVal/100)*100;
                },
            }
        ],
        series: [
            {
                name: 'AL',
                type: 'bar',
                barGap: 0,
                data: []
            },
            {
                name: 'FL',
                type: 'bar',
                data: []
            },
            {
                name: 'LA',
                type: 'bar',
                data: []
            },
            {
                name: 'MS',
                type: 'bar',
                data: []
            },
            {
                name: 'TX',
                type: 'bar',
                data: []
            }
        ]
        
    };

    //State Private Angling Season Length, Ave First 5-Year
    var stateSeasFirst_option = {
        color: ['#003366', '#006699', '#4cabce', '#e5323e','#EF9A9A'],
        title:{
            text:'State Private Angling Season Length, Ave First 5-Year'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            padding: [40,20],
            //width:'80%'
        },
        grid:{
            top:'12%',
            //bottom:'23%'   
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {show: false},
                axisLabel:{
                    rotate:30,
                },
                data: mseNames
            }
        ],
        yAxis: [
            {
                type: 'value',
                name:'Season Length(days)',
                max: function (value) {
                    var newVal = value.max * 1.2;
                    return Math.round(newVal/10)*10;
                },
            }
        ],
        series: [
            {
                name: 'AL',
                type: 'bar',
                barGap: 0,
                data: []
            },
            {
                name: 'FL',
                type: 'bar',
                data: []
            },
            {
                name: 'LA',
                type: 'bar',
                data: []
            },
            {
                name: 'MS',
                type: 'bar',
                data: []
            },
            {
                name: '*TX',
                type: 'bar',
                data: []
            }
        ]
        
    };

    //State Private Angling Season Length, Ave Last 5-Year
    var stateSeasLast_option = {
        color: ['#003366', '#006699', '#4cabce', '#e5323e','#EF9A9A'],
        title:{
            text:'State Private Angling Season Length, Ave Last 5-Year'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            padding: [40,20],
            //width:'80%'
        },
        grid:{
            top:'12%',
            //bottom:'23%'   
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {show: false},
                axisLabel:{
                    rotate:30,
                },
                data: mseNames
            }
        ],
        yAxis: [
            {
                type: 'value',
                name:'Season Length(days)',
                max: function (value) {
                    var newVal = value.max * 1.2;
                    return Math.round(newVal/10)*10;
                },
            }
        ],
        series: [
            {
                name: 'AL',
                type: 'bar',
                barGap: 0,
                data: []
            },
            {
                name: 'FL',
                type: 'bar',
                data: []
            },
            {
                name: 'LA',
                type: 'bar',
                data: []
            },
            {
                name: 'MS',
                type: 'bar',
                data: []
            },
            {
                name: '*TX',
                type: 'bar',
                data: []
            }
        ]
        
    };

    //Catch, Ave of First 5-Year
    var catchFirst_option = {
        title:{
            text:'Catch, Ave of First 5-Year'
        },
        xAxis: {
            type: 'category',
            data: mseNames,
            axisLabel:{
                rotate:30,
            }
        },
        yAxis: {
            type: 'value',
            name:'Catch(1000 lb)',
            max: function (value) {
                var newVal = value.max * 1.2;
                return Math.round(newVal/1000)*1000;
            },
        },
        tooltip : {
            trigger: 'axis',
            formatter:function(params){
                return params[0].axisValue + '</br>Upper 97.5%: ' + params[1].data[2] + '</br>Median: ' + params[0].data + '</br>Lower 2.5%: ' + params[1].data[1];
            }
        },
        series: [{
            data: [],
            type: 'bar',
            color:'#D5BD52'
        }]
    };

    //Catch, Ave of Last 5-Year
    var catchLast_option = {
        title:{
            text:'Catch, Ave of Last 5-Year'
        },
        xAxis: {
            type: 'category',
            data: mseNames,
            axisLabel:{
                rotate:30,
            }
        },
        yAxis: {
            type: 'value',
            name:'Catch(1000 lb)',
            max: function (value) {
                var newVal = value.max * 1.2;
                return Math.round(newVal/1000)*1000;
            },
        },
        tooltip : {
            trigger: 'axis',
            formatter:function(params){
                return params[0].axisValue + '</br>Upper 97.5%: ' + params[1].data[2] + '</br>Median: ' + params[0].data + '</br>Lower 2.5%: ' + params[1].data[1];
            }
        },
        series: [{
            data: [],
            type: 'bar',
            color:'#D59452'
        }]
    };

    //Commercial Discards
    var commDiscards_option = {
        title:{
            text:'Discards'
        },
        legend: {
            padding: [40, 20]
        },
        tooltip: {
            trigger: 'axis',
            showContent: true
        },
        dataset: {
            source: []
        },
        xAxis: {type: 'category'},
        yAxis: {
            gridIndex: 0,
            name:'Discard(1000 lb)',
            max: function (value) {
                var newVal = value.max * 1.2;
                return Math.round(newVal/100)*100
            }
        },
        grid:{
            bottom:'20%',
            top:'15%'
        },
        series: []
    }

    //Annual Discard/Allocation Ratio
    var recrDiscards_option = {
        title:{
            text:'Annual Discard/Allocation Ratio'
        },
        legend: {
            padding: [40, 20]
        },
        tooltip: {
            trigger: 'axis',
            showContent: true
        },
        dataset: {
            source: []
        },
        xAxis: {type: 'category'},
        yAxis: {
            gridIndex: 0,
            name:'Discard/Allocation',
            max: function (value) {
                var newVal = value.max * 1.2;
                return Math.round(newVal/100)*100
            }
        },
        grid:{
            bottom:'20%',
            top:'15%'
        },
        series: []
    }

    //Section 3
    //Commercial Sector
    var commRadar_option = {
        title: {
            text: 'Commercial Sector'
        },
        tooltip: {},
        legend: {
            data: mseNames,
            top:'6%'
        },
        radar: {
            center: ['50%', '50%'],
            radius:'65%',
            // shape: 'circle',
            name: {
                textStyle: {
                    color: '#fff',
                    backgroundColor: '#999',
                    borderRadius: 3,
                    padding: [3, 5]
            }
            },
            indicator: [
            { name: 'Commercial Catch Variation 20-Year Management'},
            { name: 'Commercial Catch First 5-Year'},
            { name: 'Commercial Catch Last 5-Year'},
            { name: 'SSB of the Gulf Last 5-Year'},
            { name: 'Probability to Green'},
            { name: 'Commercial Discards/Allocation,\n20-Year Management'},
            ]
        },
        series: [{
            name: 'Radar Chart',
            type: 'radar',
            data : []
        }]
    };

    //Recreational Sector
    var recrRadar_option = {
        title: {
            text: 'Recreational Sector'
        },
        tooltip: {},
        legend: {
            data: mseNames,
            top:'6%'
        },
        radar: {
            center: ['50%', '50%'],
            radius:'65%',
            // shape: 'circle',
            name: {
                textStyle: {
                    color: '#fff',
                    backgroundColor: '#999',
                    borderRadius: 3,
                    padding: [3, 5]
            }
            },
            indicator: [
            { name: 'Recreational Catch Variation 20-Year Management'},
            { name: 'Federal For-hire Catch First 5-Year'},
            { name: 'Private Angling Catch First 5-Year'},
            { name: 'Federal For-hire Catch Last 5-Year'},
            { name: 'Private Angling Catch Last 5-Year'},
            { name: 'SSB of the Gulf Last 5-Year'},
            { name: 'Probability to Green'},
            { name: 'Recreational Discards/Allocation, \n20-Year Management'},
            ]
        },
        series: [{
            name: 'Radar Chart',
            type: 'radar',
            data : []
        }]
    };


    /*****************************Get data for charts and set option ******************************/

    /*****Section 1*****/

    var series = [];
    //for each scenario
    for(let i = 0; i < mseNames.length; i++){
        var temp = [];
        temp.push(mseNames[i]);

        //for each year
        $.each(mseSingleLists[i],function(index, el) {
            if(i ==0){
                
                yearsxAxis.push(el.year);
            }
            temp.push(el.total_catch_median);
        });

        if(i == 0){
            catch_data.push(yearsxAxis);
        }
        catch_data.push(temp);
        series.push({type: 'line', smooth: true, seriesLayoutBy: 'row'});
    }
    catchOption.dataset.source = catch_data;
    catchOption.series = series;
    catchChart.setOption(catchOption);

    series = [];
    //for each scenario
    for(let i = 0; i < mseNames.length; i++){
        var temp = [];
        temp.push(mseNames[i]);

        //for each year
        $.each(mseSingleLists[i],function(index, el) {
            temp.push(el.total_SSB_median);
        });

        if(i == 0){
            ssbGulf_data.push(yearsxAxis);
        }
        ssbGulf_data.push(temp);
        series.push({type: 'line', smooth: true, seriesLayoutBy: 'row'});
    }
    SSBGulfOption.dataset.source = ssbGulf_data;
    SSBGulfOption.series = series;
    SSBGulfChart.setOption(SSBGulfOption);

    $.each(mseComp,function(index, el) {
        catch20_data.push(el.total_catch_mean_MSEcomp);
        catch20_high_data.push(el.total_catch_upper_MSEcomp);
        catch20_low_data.push(el.total_catch_lower_MSEcomp);
    });
    catch20option.series[0].data = catch20_data;
    catch20option.series.push(getErrorOption(catch20_low_data,catch20_high_data));
    catch20Chart.setOption(catch20option);

    $.each(mseComp,function(index, el) {
        annualCatch20_data.push(el.catch_var_mean_MSEcomp);
        annualCatch20_high_data.push(el.catch_var_upper_MSEcomp);
        annualCatch20_low_data.push(el.catch_var_lower_MSEcomp);
    });
    annualCatch20option.series[0].data = annualCatch20_data;
    annualCatch20option.series.push(getErrorOption(annualCatch20_low_data,annualCatch20_high_data));
    annualCatch20Chart.setOption(annualCatch20option);

    $.each(mseComp,function(index, el) {
        terminalSSB_data.push(el.terminal_SSB_mean_MSEcomp);
        terminalSSB_high_data.push(el.terminal_SSB_upper_MSEcomp);
        terminalSSB_low_data.push(el.terminal_SSB_lower_MSEcomp);
    });
    terminalSSBOption.series[0].data = terminalSSB_data;
    terminalSSBOption.series.push(getErrorOption(terminalSSB_low_data,terminalSSB_high_data));
    terminalChart.setOption(terminalSSBOption);

    $.each(mseComp,function(index, el) {
        lowestSSB_data.push(el.lowest_SSB_mean_MSEcomp);
        lowestSSB_high_data.push(el.lowest_SSB_upper_MSEcomp);
        lowestSSB_low_data.push(el.lowest_SSB_lower_MSEcomp);
    });
    lowestSSBOption.series[0].data = lowestSSB_data;
    lowestSSBOption.series.push(getErrorOption(lowestSSB_low_data,lowestSSB_high_data));
    lowestChart.setOption(lowestSSBOption);

    $.each(mseComp,function(index, el) {
        percentGreen_data.push(el.percent_green_MSEcomp);
    });
    percentGreen_option.series[0].data = percentGreen_data;
    percentGreenChart.setOption(percentGreen_option);

    var catchMax = 0;
    var annualCatchMax = 0;
    var terminalSSBsMax = 0;
    var lowestSSBsMax = 0;
    var percentGreenMax = 0;
    let i = 0;
    $.each(mseComp,function(index, el) {
        var seriesData = {};
        seriesData.name = mseNames[i];
        seriesData.value = [];
        seriesData.value.push(el.catch_var_MSEcomp_median);
        seriesData.value.push(el.total_catch_MSEcomp_median);
        seriesData.value.push(el.terminal_SSB_MSEcomp_median);
        seriesData.value.push(el.lowest_SSB_MSEcomp_median);
        seriesData.value.push(el.percent_green_MSEcomp);

        catchMax = Math.max(catchMax, el.total_catch_MSEcomp_median);
        annualCatchMax = Math.max(annualCatchMax, el.catch_var_MSEcomp_median);
        terminalSSBsMax = Math.max(terminalSSBsMax, el.terminal_SSB_MSEcomp_median);
        lowestSSBsMax = Math.max(lowestSSBsMax, el.lowest_SSB_MSEcomp_median);
        percentGreenMax = Math.max(percentGreenMax, el.percent_green_MSEcomp);

        i++;

        radar_data_1.push(seriesData);
    });

    catchMax = catchMax * 1.2;
    annualCatchMax = annualCatchMax * 1.2;
    terminalSSBsMax = terminalSSBsMax * 1.2;
    lowestSSBsMax = lowestSSBsMax * 1.2;
    percentGreenMax = percentGreenMax * 1.2;
    radarOption_1.series[0].data = radar_data_1;
    radarOption_1.radar.indicator[0].max = annualCatchMax.toFixed(2);;
    radarOption_1.radar.indicator[1].max = catchMax;
    radarOption_1.radar.indicator[2].max = terminalSSBsMax;
    radarOption_1.radar.indicator[3].max = lowestSSBsMax;
    radarOption_1.radar.indicator[4].max = percentGreenMax.toFixed(2);
    radarChart_1.setOption(radarOption_1);

    $.each(mseComp,function(index, el) {
        totalDiscards_data.push(el.total_discards_mean_MSEcomp);
        totalDiscards_high_data.push(el.total_discards_upper_MSEcomp);
        totalDiscards_low_data.push(el.total_discards_lower_MSEcomp);
    });
    totalDiscards_option.series[0].data = totalDiscards_data;
    totalDiscards_option.series.push(getErrorOption(totalDiscards_low_data,totalDiscards_high_data));
    totalDiscardsChart.setOption(totalDiscards_option);

    $.each(mseComp,function(index, el) {
        varDiscards_data.push(el.discards_var_mean_MSEcomp);
        varDiscards_high_data.push(el.discards_var_upper_MSEcomp);
        varDiscards_low_data.push(el.discards_var_lower_MSEcomp);
    });
    varDiscards_option.series[0].data = varDiscards_data;
    varDiscards_option.series.push(getErrorOption(varDiscards_low_data,varDiscards_high_data));
    varDiscardsChart.setOption(varDiscards_option);

    /*****Section 2*****/

    series = [];
    //for each scenario
    for(let i = 0; i < mseNames.length; i++){
        var temp = [];
        temp.push(mseNames[i]);

        //for each year
        $.each(mseSingleLists[i],function(index, el) {
            temp.push(el.comm_catch_median);
        });

        if(i == 0){
            commCatch_data.push(yearsxAxis);
        }
        commCatch_data.push(temp);
        series.push({type: 'line', smooth: true, seriesLayoutBy: 'row'});
    }
    commCatchOption.dataset.source = commCatch_data;
    commCatchOption.series = series;
    commCatchChart.setOption(commCatchOption);

    series = [];
    //for each scenario
    for(let i = 0; i < mseNames.length; i++){
        var temp = [];
        temp.push(mseNames[i]);

        //for each year
        $.each(mseSingleLists[i],function(index, el) {
            temp.push(el.Forhire_catch_median);
        });

        if(i == 0){
            fedCatch_data.push(yearsxAxis);
        }
        fedCatch_data.push(temp);
        series.push({type: 'line', smooth: true, seriesLayoutBy: 'row'});
    }
    fedCatchOption.dataset.source = fedCatch_data;
    fedCatchOption.series = series;
    fedCatchChart.setOption(fedCatchOption);

    series = [];
    //for each scenario
    for(let i = 0; i < mseNames.length; i++){
        var temp = [];
        temp.push(mseNames[i]);

        //for each year
        $.each(mseSingleLists[i],function(index, el) {
            temp.push(el.Private_catch_median);
        });

        if(i == 0){
            privateCatch_data.push(yearsxAxis);
        }
        privateCatch_data.push(temp);
        series.push({type: 'line', smooth: true, seriesLayoutBy: 'row'});
    }
    privateCatchOption.dataset.source = privateCatch_data;
    privateCatchOption.series = series;
    privateCatchChart.setOption(privateCatchOption);

    $.each(mseComp,function(index, el) {
        ssb_first_data.push(el.total_SSB_first5mean_mean);
        ssb_first_high_data.push(el.total_SSB_first5mean_upper);
        ssb_first_low_data.push(el.total_SSB_first5mean_lower);
    });
    ssbfirst_option.series[0].data = ssb_first_data;
    ssbfirst_option.series.push(getErrorOption(ssb_first_low_data,ssb_first_high_data));
    SSBGulfFirstChart.setOption(ssbfirst_option);

    $.each(mseComp,function(index, el) {
        ssb_last_data.push(el.total_SSB_last5mean_mean);
        ssb_last_high_data.push(el.total_SSB_last5mean_upper);
        ssb_last_low_data.push(el.total_SSB_last5mean_lower);
    });
    ssbLast_option.series[0].data = ssb_last_data;
    ssbLast_option.series.push(getErrorOption(ssb_last_low_data,ssb_last_high_data));
    SSBGulfLastChart.setOption(ssbLast_option);

    $.each(mseComp,function(index, el) {
        fed_first_data.push(el.Forhire_catch_first5mean);
        private_first_data.push(el.Private_catch_first5mean);
        fed_last_data.push(el.Forhire_catch_last5mean);
        private_last_data.push(el.Private_catch_last5mean);
    });
    barLabelOption_1.series[0].data = fed_first_data;
    barLabelOption_1.series[1].data = private_first_data;
    barLabelOption_1.series[2].data = fed_last_data;
    barLabelOption_1.series[3].data = private_last_data;
    barRotationChart_1.setOption(barLabelOption_1);

    $.each(mseComp,function(index, el) {
        alCatch_first_data.push(el.true_private_AL_catch_first5mean);
        flCatch_first_data.push(el.true_private_FL_catch_first5mean);
        laCatch_first_data.push(el.true_private_LA_catch_first5mean);
        msCatch_first_data.push(el.true_private_MS_catch_first5mean);
        txCatch_first_data.push(el.true_private_TX_catch_first5mean);
    });
    stateCatchFirst_option.series[0].data = alCatch_first_data;
    stateCatchFirst_option.series[1].data = flCatch_first_data;
    stateCatchFirst_option.series[2].data = laCatch_first_data;
    stateCatchFirst_option.series[3].data = msCatch_first_data;
    stateCatchFirst_option.series[4].data = txCatch_first_data;
    stateCatchFirstChart.setOption(stateCatchFirst_option);

    $.each(mseComp,function(index, el) {
        alCatch_last_data.push(el.true_private_AL_catch_last5mean);
        flCatch_last_data.push(el.true_private_FL_catch_last5mean);
        laCatch_last_data.push(el.true_private_LA_catch_last5mean);
        msCatch_last_data.push(el.true_private_MS_catch_last5mean);
        txCatch_last_data.push(el.true_private_TX_catch_last5mean);
    });
    stateCatchLast_option.series[0].data = alCatch_last_data;
    stateCatchLast_option.series[1].data = flCatch_last_data;
    stateCatchLast_option.series[2].data = laCatch_last_data;
    stateCatchLast_option.series[3].data = msCatch_last_data;
    stateCatchLast_option.series[4].data = txCatch_last_data;
    stateCatchLastChart.setOption(stateCatchLast_option);

    $.each(mseComp,function(index, el) {
        alSeas_first_data.push(el.true_private_AL_season_length_first5mean);
        flSeas_first_data.push(el.true_private_FL_season_length_first5mean);
        laSeas_first_data.push(el.true_private_LA_season_length_first5mean);
        msSeas_first_data.push(el.true_private_MS_season_length_first5mean);
        txSeas_first_data.push(el.true_private_TX_season_length_first5mean);
    });
    stateSeasFirst_option.series[0].data = alSeas_first_data;
    stateSeasFirst_option.series[1].data = flSeas_first_data;
    stateSeasFirst_option.series[2].data = laSeas_first_data;
    stateSeasFirst_option.series[3].data = msSeas_first_data;
    stateSeasFirst_option.series[4].data = txSeas_first_data;
    stateSeasFirstChart.setOption(stateSeasFirst_option);

    $.each(mseComp,function(index, el) {
        alSeas_last_data.push(el.true_private_AL_season_length_last5mean);
        flSeas_last_data.push(el.true_private_FL_season_length_last5mean);
        laSeas_last_data.push(el.true_private_LA_season_length_last5mean);
        msSeas_last_data.push(el.true_private_MS_season_length_last5mean);
        txSeas_last_data.push(el.true_private_TX_season_length_last5mean);
    });
    stateSeasLast_option.series[0].data = alSeas_last_data;
    stateSeasLast_option.series[1].data = flSeas_last_data;
    stateSeasLast_option.series[2].data = laSeas_last_data;
    stateSeasLast_option.series[3].data = msSeas_last_data;
    stateSeasLast_option.series[4].data = txSeas_last_data;
    stateSeasLastChart.setOption(stateSeasLast_option);

    $.each(mseComp,function(index, el) {
        catchFirst_data.push(el.total_catch_first5mean_mean);
        catchFirst_high_data.push(el.total_catch_first5mean_upper);
        catchFirst_low_data.push(el.total_catch_first5mean_lower);
    });
    catchFirst_option.series[0].data = catchFirst_data;
    catchFirst_option.series.push(getErrorOption(catchFirst_low_data,catchFirst_high_data));
    catchFirstChart.setOption(catchFirst_option);

    $.each(mseComp,function(index, el) {
        catchLast_data.push(el.total_catch_last5mean_mean);
        catchLast_high_data.push(el.total_catch_last5mean_upper);
        catchLast_low_data.push(el.total_catch_last5mean_lower);
    });
    catchLast_option.series[0].data = catchLast_data;
    catchLast_option.series.push(getErrorOption(catchLast_low_data,catchLast_high_data));
    catchLastChart.setOption(catchLast_option);

    series = [];
    //for each scenario
    for(let i = 0; i < mseNames.length; i++){
        var temp = [];
        temp.push(mseNames[i]);
        
        $.each(mseComp[i].comm_discards_median,function(index, el) {
            temp.push(el);
        });

        if(i == 0){
            commDiscards_data.push(yearsxAxis);
        }
        commDiscards_data.push(temp);
        series.push({type: 'line', smooth: true, seriesLayoutBy: 'row'});
    }
    commDiscards_option.dataset.source = commDiscards_data;
    commDiscards_option.series = series;
    commDiscardsChart.setOption(commDiscards_option);

    series = [];
    //for each scenario
    for(let i = 0; i < mseNames.length; i++){
        var temp = [];
        temp.push(mseNames[i]);
        
        $.each(mseComp[i].recr_discards_median,function(index, el) {
            temp.push(el);
        });

        if(i == 0){
            recrDiscards_data.push(yearsxAxis);
        }
        recrDiscards_data.push(temp);
        series.push({type: 'line', smooth: true, seriesLayoutBy: 'row'});
    }
    recrDiscards_option.dataset.source = recrDiscards_data;
    recrDiscards_option.series = series;
    recrDiscardsChart.setOption(recrDiscards_option);

    /*****Section 3*****/
    var comm_varMax = 0;
    var commFirstMax = 0;
    var commLastMax = 0;
    var SSBLastMax = 0;
    var percentGreenMax = 0;
    var commDisallMax = 0;
    i = 0;
    $.each(mseComp,function(index, el) {
        var seriesData = {};
        seriesData.name = mseNames[i];
        seriesData.value = [];
        seriesData.value.push(el.comm_catch_var_MSEcomp);
        seriesData.value.push(el.comm_catch_first5mean_MSEcomp);
        seriesData.value.push(el.comm_catch_last5mean_MSEcomp);
        seriesData.value.push(el.total_SSB_last5mean_MSEcomp);
        seriesData.value.push(el.percent_green_MSEcomp);
        seriesData.value.push(el.comm_disalloratio_ave20_MSEcomp);
        
        comm_varMax = Math.max(comm_varMax, el.comm_catch_var_MSEcomp);
        commFirstMax = Math.max(commFirstMax, el.comm_catch_first5mean_MSEcomp);
        commLastMax = Math.max(commLastMax, el.comm_catch_last5mean_MSEcomp);
        SSBLastMax = Math.max(SSBLastMax, el.total_SSB_last5mean_MSEcomp);
        percentGreenMax = Math.max(percentGreenMax, el.percent_green_MSEcomp);
        commDisallMax = Math.max(commDisallMax, el.comm_disalloratio_ave20_MSEcomp);

        i++;

        commRadar_data.push(seriesData);
    });

    comm_varMax = comm_varMax * 1.2;
    commFirstMax = commFirstMax * 1.2;
    commLastMax = commLastMax * 1.2;
    SSBLastMax = SSBLastMax * 1.2;
    percentGreenMax = percentGreenMax * 1.2;
    commDisallMax = commDisallMax * 1.2;
    commRadar_option.series[0].data = commRadar_data;
    commRadar_option.radar.indicator[0].max = comm_varMax.toFixed(2);
    commRadar_option.radar.indicator[1].max = commFirstMax;
    commRadar_option.radar.indicator[2].max = commLastMax;
    commRadar_option.radar.indicator[3].max = SSBLastMax;
    commRadar_option.radar.indicator[4].max = percentGreenMax.toFixed(2);
    commRadar_option.radar.indicator[5].max = commDisallMax.toFixed(2);
    commRadarChart.setOption(commRadar_option);

    var recr_varMax = 0;
    var forhireFirstMax = 0;
    var privateFirstMax = 0;
    var forhireLastMax = 0;
    var privateLastMax = 0;
    var SSBLastMax = 0;
    var percentGreenMax = 0;
    var recrDisallMax = 0;
    i = 0;
    $.each(mseComp,function(index, el) {
        var seriesData = {};
        seriesData.name = mseNames[i];
        seriesData.value = [];
        seriesData.value.push(el.recr_catch_var_MSEcomp);
        seriesData.value.push(el.Forhire_catch_first5mean_MSEcomp);
        seriesData.value.push(el.Private_catch_first5mean_MSEcomp);
        seriesData.value.push(el.Forhire_catch_last5mean_MSEcomp);
        seriesData.value.push(el.Private_catch_last5mean_MSEcomp);
        seriesData.value.push(el.total_SSB_last5mean_MSEcomp);
        seriesData.value.push(el.percent_green_MSEcomp);
        seriesData.value.push(el.recr_disalloratio_ave20_MSEcomp);
        
        recr_varMax = Math.max(recr_varMax, el.recr_catch_var_MSEcomp);
        forhireFirstMax = Math.max(forhireFirstMax, el.Forhire_catch_first5mean_MSEcomp);
        privateFirstMax = Math.max(privateFirstMax, el.Private_catch_first5mean_MSEcomp);
        forhireLastMax = Math.max(forhireLastMax, el.Forhire_catch_last5mean_MSEcomp);
        privateLastMax = Math.max(privateLastMax, el.Private_catch_last5mean_MSEcomp);
        SSBLastMax = Math.max(SSBLastMax, el.total_SSB_last5mean_MSEcomp);
        percentGreenMax = Math.max(percentGreenMax, el.percent_green_MSEcomp);
        recrDisallMax = Math.max(recrDisallMax, el.recr_disalloratio_ave20_MSEcomp);

        i++;

        recrRadar_data.push(seriesData);
    });

    recr_varMax = recr_varMax * 1.2;
    forhireFirstMax = forhireFirstMax * 1.2;
    privateFirstMax = privateFirstMax * 1.2;
    forhireLastMax = forhireLastMax * 1.2;
    privateLastMax = privateLastMax * 1.2;
    SSBLastMax = SSBLastMax * 1.2;
    percentGreenMax = percentGreenMax * 1.2;
    recrDisallMax = recrDisallMax * 1.2;
    recrRadar_option.series[0].data = recrRadar_data;
    recrRadar_option.radar.indicator[0].max = recr_varMax.toFixed(2);
    recrRadar_option.radar.indicator[1].max = forhireFirstMax;
    recrRadar_option.radar.indicator[2].max = privateFirstMax;
    recrRadar_option.radar.indicator[3].max = forhireLastMax;
    recrRadar_option.radar.indicator[4].max = privateLastMax;
    recrRadar_option.radar.indicator[5].max = SSBLastMax;
    recrRadar_option.radar.indicator[6].max = percentGreenMax;
    recrRadar_option.radar.indicator[7].max = recrDisallMax;
    recrRadarChart.setOption(recrRadar_option);
}



