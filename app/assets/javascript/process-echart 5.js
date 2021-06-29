/*******************************Initilaize charts*******************************/
//Essential figures
var totalCatch = echarts.init(document.getElementById('totalCatch-chart'));
var catchPlot = echarts.init(document.getElementById('catch-plot'));
var ssbPlot = echarts.init(document.getElementById('ssb-plot'));
var commCatchPlot = echarts.init(document.getElementById('commCatch-plot'));
var forHireCatchPlot = echarts.init(document.getElementById('forhireCatch-plot'));
var privateCatchPlot = echarts.init(document.getElementById('privateCatch-plot'));
var fedForhireLength = echarts.init(document.getElementById('fedForhireLength-plot'));
var statePrivLength = echarts.init(document.getElementById('statePrivLength-plot'));
var kobeChart1 = echarts.init(document.getElementById('kobe-plot'));
var recruitmentPlot = echarts.init(document.getElementById('recruitment-plot'));
//Other detailed figures
var bioChart1 = echarts.init(document.getElementById('bio-chart-1'));
var sprChart1 = echarts.init(document.getElementById('spr-chart-1'));
var hireChart1 = echarts.init(document.getElementById('hire-chart'));
var privateChart1 = echarts.init(document.getElementById('private-chart'));
var fChart1 = echarts.init(document.getElementById('f-chart-1'));
var ssbEChart1 = echarts.init(document.getElementById('ssbE-chart'));
var ssbWChart1 = echarts.init(document.getElementById('ssbW-chart'));
var ssbGulfChart = echarts.init(document.getElementById('ssbGulf-plot'));
var alCatchPlot = echarts.init(document.getElementById('al-Catch-chart'));
var alSeasonPlot = echarts.init(document.getElementById('al-seas-length-chart'));
var flCatchPlot = echarts.init(document.getElementById('fl-Catch-chart'));
var flSeasonPlot = echarts.init(document.getElementById('fl-seas-length-chart'));
var laCatchPlot = echarts.init(document.getElementById('la-Catch-chart'));
var laSeasonPlot = echarts.init(document.getElementById('la-seas-length-chart'));
var msCatchPlot = echarts.init(document.getElementById('ms-Catch-chart'));
var msSeasonPlot = echarts.init(document.getElementById('ms-seas-length-chart'));
var txCatchPlot = echarts.init(document.getElementById('tx-Catch-chart'));
var txSeasonPlot = echarts.init(document.getElementById('tx-seas-length-chart'));

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

function drawChart(chartdata){

	//init
	var totalCatch_data = [];
	var totalCatch_xAxisData = [];

	var totalSSB_data = [];
	var totalSSB_xAxisData = [];

	var catchStack_xAxisData = [];
	var catchStack_comm_data = [];
	var catchStack_forhire_data = [];
	var catchStack_private_data = [];

	var ssbStack_xAxisData = [];
	var ssbStack_E_data = [];
	var ssbStack_W_data = [];

	var commStack_xAxiData = [];
	var commStack_E_data = [];
	var commStack_W_data = [];

	var forhireStack_xAxisData = [];
	var forhireStack_E_data = [];
	var forhireStack_W_data = [];

	var privateStack_xAxisData = [];
	var privateStack_E_data = [];
	var privateStack_W_data = [];

	var fed_forhire_xAxisData = [];
	var fed_forhire_low_data = [];
	var fed_forhire_median_data = [];
	var fed_forhire_high_data = [];

	var state_source_data = [];
	var state_private_xAxistData = ['year'];
	var state_AL_data = ['AL'];
	var state_FL_data = ['FL'];
	var state_LA_data = ['LA'];
	var state_MS_data = ['MS'];
	var state_TX_data = ['*TX'];
	

    var kobe_median_data = [];
	var start_projection = $('#start_projection').find("input").val() || "2016";
	start_projection = start_projection.substring(0,4);
	
	var recrStack_xAxisData = [];
	var recrStack_E_data = [];
	var recrStack_W_data = [];

	//init part 2
	var comm_xAxisData = [];
    var comm_low_data = [];
    var comm_median_data = [];
    var comm_high_data = [];

    var recr_xAxisData = [];
    var recr_low_data = [];
    var recr_median_data = [];
    var recr_high_data = [];

    var hire_xAxisData = [];
    var hire_low_data = [];
    var hire_median_data = [];
    var hire_high_data = [];

    var private_xAxisData = [];
    var private_low_data = [];
    var private_median_data = [];
	var private_high_data = [];
	
	var f_xAxisData = [];
    var f_low_data = [];
    var f_median_data = [];
    var f_high_data = [];

    var ssbGulf_xAxisData = [];
    var ssbGulf_low_data = [];
    var ssbGulf_median_data = [];
    var ssbGulf_high_data = [];

    var ssbE_xAxisData = [];
    var ssbE_low_data = [];
    var ssbE_median_data = [];
    var ssbE_high_data = [];

    var ssbW_xAxisData = [];
    var ssbW_low_data = [];
    var ssbW_median_data = [];
	var ssbW_high_data = [];

	var  AL_catch_xAxisData = [];
    var  AL_catch_low_data = [];
    var  AL_catch_median_data = [];
	var  AL_catch_high_data = [];

	var  AL_seas_xAxisData = [];
    var  AL_seas_low_data = [];
    var  AL_seas_median_data = [];
	var  AL_seas_high_data = [];

	var  FL_catch_xAxisData = [];
    var  FL_catch_low_data = [];
    var  FL_catch_median_data = [];
	var  FL_catch_high_data = [];

	var  FL_seas_xAxisData = [];
    var  FL_seas_low_data = [];
    var  FL_seas_median_data = [];
	var  FL_seas_high_data = [];

	var  LA_catch_xAxisData = [];
    var  LA_catch_low_data = [];
    var  LA_catch_median_data = [];
	var  LA_catch_high_data = [];

	var  LA_seas_xAxisData = [];
    var  LA_seas_low_data = [];
    var  LA_seas_median_data = [];
	var  LA_seas_high_data = [];

	var  MS_catch_xAxisData = [];
    var  MS_catch_low_data = [];
    var  MS_catch_median_data = [];
	var  MS_catch_high_data = [];

	var  MS_seas_xAxisData = [];
    var  MS_seas_low_data = [];
    var  MS_seas_median_data = [];
	var  MS_seas_high_data = [];

	var  TX_catch_xAxisData = [];
    var  TX_catch_low_data = [];
    var  TX_catch_median_data = [];
	var  TX_catch_high_data = [];

	var  TX_seas_xAxisData = [];
    var  TX_seas_low_data = [];
    var  TX_seas_median_data = [];
	var  TX_seas_high_data = [];
	
	//Total Catch & Total SSB
	var totalCatchOption = {

		// Make gradient line here
		visualMap: [{
			show: false,
			type: 'continuous',
			seriesIndex: 0,
			min: 3800,
			max: 5200
		}, {
			show: false,
			type: 'continuous',
			seriesIndex: 1,
			min: 800000000000,
			max: 1500000000000
		}],


		title: [{
			left: 'center',
			text: 'Total Catch'
		},{
			top: '55%',
			left: 'center',
			text: 'Total SSB'
		}],
		tooltip: {
			trigger: 'axis'
		},
		xAxis: [{
			data: []
		}, {
			data: [],
			gridIndex: 1
		}],
		yAxis: [{
			splitLine: {show: false},
			name: 'Catch(1000 lb)',
			max: function (value) {
				var newVal = value.max * 1.2;
				return Math.round(newVal/1000)*1000
			}
		}, {
			splitLine: {show: false},
			name:'SSB(1000 eggs)',
			gridIndex: 1,
			axisLabel: {
				formatter: function (value){
					return toScientific(value);
				}
			},
			max: function (value) {
				var newVal = value.max * 1.2;
				return Math.round(newVal/1e+11)*1e+11
			}
		}],
		grid: [{
			bottom: '60%'
		}, {
			top: '65%',
		}],
		series: [{
			type: 'line',
			showSymbol: false,
			data: []
		}, {
			type: 'line',
			showSymbol: false,
			data: [],
			xAxisIndex: 1,
			yAxisIndex: 1
		}]
	};

	//Catch: Commercial, For-hire, Private
	var catchPlotOption = {
		title: {
			text: 'Catch: Commercial, For-hire, Private'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				label: {
					backgroundColor: '#6a7985'
				}
			}
		},
		legend: {
			data: ['Commercial','For-hire','Private'],
			align:'right',
			padding: [40, 20]
		},
		grid: {
			left: '7%',
			right: '4%',
			bottom: '3%',
			top:'15%',
			containLabel: true
		},
		xAxis: [
			{
				type: 'category',
				boundaryGap: false,
				data: []
			}
		],
		yAxis: [
			{
				type: 'value',
				name:'Catch(1000 lb)',
				max: function (value) {
					var newVal = value.max * 1.2;
					return Math.round(newVal/1000)*1000
				}
			}
		],
		series: [
			{
				name: 'Private',
				type: 'line',
				stack: '1',
				areaStyle: {},
				data: []
			},
			{
				name: 'For-hire',
				type: 'line',
				stack: '1',
				areaStyle: {},
				data: []
			},
			{
				name: 'Commercial',
				type: 'line',
				stack: '1',
				// label: {
				// 	normal: {
				// 		show: true,
				// 		position: 'top'
				// 	}
				// },
				areaStyle: {},
				data: []
			}
		]
	};


	//SSB: East & West
	var ssbOption = {
		title: {
			text: 'SSB: East & West'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				label: {
					backgroundColor: '#6a7985'
				}
			}
		},
		legend: {
			data: ['East','West'],
			align:'right',
			padding: [40, 20]
		},
		grid: {
			left: '7%',
			right: '4%',
			bottom: '3%',
			top:'15%',
			containLabel: true
		},
		xAxis: [
			{
				type: 'category',
				boundaryGap: false,
				data: []
			}
		],
		yAxis: [
			{
				type: 'value',
				name:'SSB(1000 eggs)',
				axisLabel: {
					formatter: function (value){
						return toScientific(value);
					}
				},
				max: function (value) {
					var newVal = value.max * 1.2;
					return Math.floor(newVal/1e+11)*1e+11;
				}
			}
		],
		series: [
			{
				name: 'West',
				type: 'line',
				stack: '1',
				areaStyle: {},
				data: [],
				color:'#d48265'
			},
			{
				name: 'East',
				type: 'line',
				stack: '1',
				// label: {
				// 	normal: {
				// 		show: true,
				// 		position: 'top'
				// 	}
				// },
				areaStyle: {},
				data: [],
				color:'#91c7ae'
			}
		]
	};

	//Commercial Catch: East & West
	var commCatchOption = {
		title: {
			text: 'Commercial Catch: East & West'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				label: {
					backgroundColor: '#6a7985'
				}
			}
		},
		legend: {
			data: ['East','West'],
			align:'right',
			padding: [40, 20]
		},
		grid: {
			left: '7%',
			right: '4%',
			bottom: '3%',
			top:'15%',
			containLabel: true
		},
		xAxis: [
			{
				type: 'category',
				boundaryGap: false,
				data: []
			}
		],
		yAxis: [
			{
				type: 'value',
				name:'Catch(1000 lb)',
				max: function (value) {
					var newVal = value.max * 1.2;
					return Math.round(newVal/1000)*1000
				}
			}
		],
		series: [
			{
				name: 'West',
				type: 'line',
				stack: '1',
				areaStyle: {},
				data: [],
				color:'#C27485'
			},
			{
				name: 'East',
				type: 'line',
				stack: '1',
				// label: {
				// 	normal: {
				// 		show: true,
				// 		position: 'top'
				// 	}
				// },
				areaStyle: {},
				data: [],
				color:'#512E5F'
			}
		]
	};

	//For-hire Catch: East & West
	var forhireCatchOption = {
		title: {
			text: 'For-hire Catch: East & West'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				label: {
					backgroundColor: '#6a7985'
				}
			}
		},
		legend: {
			data: ['East','West'],
			align:'right',
			padding: [40, 20]
		},
		grid: {
			left: '7%',
			right: '4%',
			bottom: '3%',
			top:'15%',
			containLabel: true
		},
		xAxis: [
			{
				type: 'category',
				boundaryGap: false,
				data: []
			}
		],
		yAxis: [
			{
				type: 'value',
				name:'Catch(1000 lb)',
				max: function (value) {
					var newVal = value.max * 1.2;
					return Math.round(newVal/100)*100
				}
			}
		],
		series: [
			{
				name: 'West',
				type: 'line',
				stack: '1',
				areaStyle: {},
				data: [],
				color:'#bda29a'
			},
			{
				name: 'East',
				type: 'line',
				stack: '1',
				// label: {
				// 	normal: {
				// 		show: true,
				// 		position: 'top'
				// 	}
				// },
				areaStyle: {},
				data: [],
				color:'#6e7074'
			}
		]
	};

	//Private Angling Catch: East & West
	var privateCatchOption = {
		title: {
			text: 'Private Angling Catch: East & West'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				label: {
					backgroundColor: '#6a7985'
				}
			}
		},
		legend: {
			data: ['East','West'],
			align:'right',
			padding: [40, 20]
		},
		grid: {
			left: '7%',
			right: '4%',
			bottom: '3%',
			top:'15%',
			containLabel: true
		},
		xAxis: [
			{
				type: 'category',
				boundaryGap: false,
				data: []
			}
		],
		yAxis: [
			{
				type: 'value',
				name:'Catch(1000 lb)',
				max: function (value) {
					var newVal = value.max * 1.2;
					return Math.round(newVal/100)*100
				}
			}
		],
		series: [
			{
				name: 'West',
				type: 'line',
				stack: '1',
				areaStyle: {},
				data: [],
				color:'#546570'
			},
			{
				name: 'East',
				type: 'line',
				stack: '1',
				// label: {
				// 	normal: {
				// 		show: true,
				// 		position: 'top'
				// 	}
				// },
				areaStyle: {},
				data: [],
				color:'#c4ccd3'
			}
		]
	};

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

	//Federal For-hire Season Length
	var fedForhire_option = {
		title:{
			text:"Federal For-hire Season Length"
		},
		xAxis: {
			type: 'category',
			data: []
		},
		yAxis: {
			type: 'value',
			name:'Season Length(days)',
			max: function (value) {
				var newVal = value.max * 1.2;
				return Math.round(newVal/10)*10
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
			type: 'bar'
		},
			// getErrorOption([120, 200, 150, 80,90])
		]
	};


	//State Private Angling Season Length
	var statePrivLength_option = {
		title:[
			{
				text:'State Private Angling Season Length'
			}
		],
		legend: {top:'10%'},
		tooltip: {
			trigger: 'axis',
			showContent: false
		},
		dataset: {
			source: [
				['year'],
				['AL'],
				['FL'],
				['LA'],
				['*TX'],
				['MS']
			]
		},
		xAxis: {type: 'category'},
		yAxis: {
			gridIndex: 0,
			name:'Season Length(days)',
			max: function (value) {
				var newVal = value.max * 1.2;
				return Math.round(newVal/10)*10
			}
		},
		grid: [
			{top: '60%'},
		
		],
		series: [
			{type: 'line', smooth: true, seriesLayoutBy: 'row'},
			{type: 'line', smooth: true, seriesLayoutBy: 'row'},
			{type: 'line', smooth: true, seriesLayoutBy: 'row'},
			{type: 'line', smooth: true, seriesLayoutBy: 'row'},
			{type: 'line', smooth: true, seriesLayoutBy: 'row'},
			{
				type: 'pie',
				id: 'pie',
				radius: '30%',
				center: ['50%', '35%'],
				label: {
					formatter: '{b}: {@2016} ({d}%)'
				},
				encode: {
					itemName: 'year',
					value: '2016',
					tooltip: '2016'
				}
			}
		]
	};

	statePrivLength.on('updateAxisPointer', function (event) {
		var xAxisInfo = event.axesInfo[0];
		if (xAxisInfo) {
			var dimension = xAxisInfo.value + 1;
			statePrivLength.setOption({
				series: {
					id: 'pie',
					label: {
						formatter: '{b}: {@[' + dimension + ']} ({d}%)'
					},
					encode: {
						value: dimension,
						tooltip: dimension
					}
				}
			});
		}
	});
	
	kobe_option = {
    title: {
	        text: 'Kobe Plot'
	},
    color:[
		    '#1e90ff'
    ],
    tooltip : {
	        trigger: 'item',
	        formatter:function(params){
				if(params.seriesName === "dataPoints")
	        	    return (params.dataIndex + parseInt(start_projection)) + '</br>' + params.data;
	        }
	},
    xAxis: {
        min:0,
        interval:0.5,
        type: 'value',
		name: '{a|SSB / SSB} {b|SPR26}',
        nameTextStyle:{
			//for subscript
            rich: {
                a: {
                    padding:[13,0,20,0],
                },
                b:{
                    verticalAlign:'bottom',
                    padding:[11,0],
                    fontSize:9
                }
            },
            
        },
        nameLocation:'middle',        
    },
    yAxis: {
        min:0,
        interval:0.5,
        type: 'value',
        splitLine:{show:false},
		name: '{a|F / F} {b|SPR26}',
        nameTextStyle:{
			//for subscript
            rich: {
                a: {
                    padding:[13,0,20,0],
                },
                b:{
                    verticalAlign:'bottom',
                    padding:[11,0],
                    fontSize:9
                }
            },
            
        },
		nameLocation:'middle',

    },
    series: [
        {
            name:'dataPoints',
            type: 'line',
            itemStyle:{
				normal:{
					label:{
						show:true,
						position:'right',
						formatter:function(params){
							if(params.dataIndex == 0){
								return 2016;
							}else if(params.dataIndex == 19){
								return 2035;
							}else{
								return '';
							}
						}
					}
				}
			},
            data: [],
            markLine:{
					symbol:'none',
					itemStyle:{normal:{color:'black'}},
					data:[
						{
							name: 'MFMT',
							yAxis: 1
						},{
						    name:'MSST',
						    xAxis: 0.5
						}
					],
					label:{
						formatter: '{b}'
					},
					precision: 4
			},
        },
        {
            type: 'line',
            smooth: 0.6,
            symbol: 'none',
            lineStyle: {
                color: 'none',
            },
            areaStyle: {
                color:'red',
                opacity:0.8
            },
            data: [
                 [0,2],
                 [1,2],
            ]
        },
        {
            type: 'line',
            smooth: 0.6,
            symbol: 'none',
            lineStyle: {
                color: 'none',
            },
            areaStyle: {
                color:'#D87C46',
                opacity:1
            },
            data: [
                 [0,1],
                 [1,1],
            ]
        },
        {
            type: 'line',
            smooth: 0.6,
            symbol: 'none',
            lineStyle: {
                color: 'none',
            },
            areaStyle: {
                color:'#A4BC43',
                opacity:1
            },
            data: [
                 [1,2],
                 [2,2],
            ]
        },
        {
            type: 'line',
            smooth: 0.6,
            symbol: 'none',
            lineStyle: {
                color: 'none',
            },
            areaStyle: {
                color:'rgb(77, 255, 0,0.5)',
                opacity:1
            },
            data: [
                 [1,1],
                 [2,1],
            ]
        },
        
        
    ]
};

	
	//Recruitment: East & West
	var recruitmentOption = {
		title: {
			text: 'Recruitment: East & West'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				label: {
					backgroundColor: '#6a7985'
				}
			}
		},
		legend: {
			data: ['East','West'],
			align:'right',
			padding: [40, 20]
		},
		grid: {
			left: '9%',
			right: '4%',
			bottom: '3%',
			top:'15%',
			containLabel: true
		},
		xAxis: [
			{
				type: 'category',
				boundaryGap: false,
				data: []
			}
		],
		yAxis: [
			{
				type: 'value',
				name:'Recruitment(1000s)',
				max: function (value) {
					var newVal = value.max * 1.2;
					return Math.round(newVal/10000)*10000
				}
			}
		],
		series: [
			{
				name: 'West',
				type: 'line',
				stack: '1',
				areaStyle: {},
				data: [],
				color:'#0E6251'
			},
			{
				name: 'East',
				type: 'line',
				stack: '1',
				// label: {
				// 	normal: {
				// 		show: true,
				// 		position: 'top'
				// 	}
				// },
				areaStyle: {},
				data: [],
				color:'#A3E4D7'
			}
		]
	};
	/* Other detailed figures */
	//Commercial Catch
	var	comm_option = {
	    title: {
	        text: 'Commercial Catch'
	    },
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
                type: 'cross',
                animation: false,
                label: {
                    backgroundColor: '#ccc',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    textStyle: {
                        color: '#222'
                    }
                }
            },
            formatter: function (params) {
                return params[0].axisValue + '<br />' + params[2].seriesName+" : "+params[2].value+ '<br />' + params[1].seriesName+" : "+params[1].value+ '<br />'+ params[0].seriesName+" : " + params[0].value;
            }
	    },
	    legend: {
	        data:['F_std','HL_E','HL_W'],
	        show:false,
	    },
	    grid: {
	        left: '7%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis: {
	        type: 'category',
	        boundaryGap: false,
	        data: [],
	    },
	    yAxis: {
	        type: 'value',
			name: 'Catch(1000 lb)',
			max: function (value) {
				var newVal = value.max * 1.2;
				return Math.round(newVal/1000)*1000
			}
	    },
	    series: [
	        {
	            name:'Lower 2.5%',
	            type:'line',
	            stack: '1',
	            lineStyle: {
	                normal: {
	                    opacity: 0
	                }
	            },
	            symbol: 'none',
	            data:[],
	        },
	        {
	            name:'Median',
	            type:'line',
	            lineStyle: {
	                normal: {

	                }
	            },
	            showSymbol: false,
	            data:[]
	        },
	        {
	            name:'Upper 97.5%',
	            type:'line',
	            stack: '1',
	            lineStyle: {
	                normal: {
	                    opacity: 0
	                }
	            },
	            areaStyle: {
	                normal: {
	                    color: '#ccc',
	                    shadowColor: 'rgba(0, 0, 0, 0.5)',
	                }
	            },
	            data:[],
	            symbol: 'none'

	        }
	    ]
	};

	//Recreational Catch
	var recr_option = {
	    title: {
	        text: 'Recreational Catch'
	    },
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
                type: 'cross',
                animation: false,
                label: {
                    backgroundColor: '#ccc',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    textStyle: {
                        color: '#222'
                    }
                }
            },
            formatter: function (params) {
                return params[0].axisValue + '<br />' + params[2].seriesName+" : "+params[2].value+ '<br />' + params[1].seriesName+" : "+params[1].value+ '<br />'+ params[0].seriesName+" : " + params[0].value;
            }
	    },
	    legend: {
	        data:['F_std','HL_E','HL_W'],
	        show:false,
	    },
	    grid: {
	        left: '7%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis: {
	        type: 'category',
	        boundaryGap: false,
	        data: [],
	    },
	    yAxis: {
	        type: 'value',
			name: 'Catch(1000 lb)',
			max: function (value) {
				var newVal = value.max * 1.2;
				return Math.round(newVal/1000)*1000
			}
	    },
	    series: [
	        {
	            name:'Lower 2.5%',
	            type:'line',
	            stack: '1',
	            lineStyle: {
	                normal: {
	                    opacity: 0
	                }
	            },
	            symbol: 'none',
	            data:[],
	        },
	        {
	            name:'Median',
	            type:'line',
	            lineStyle: {
	                normal: {

	                }
	            },
	            showSymbol: false,
	            data:[]
	        },
	        {
	            name:'Upper 97.5%',
	            type:'line',
	            stack: '1',
	            lineStyle: {
	                normal: {
	                    opacity: 0
	                }
	            },
	            areaStyle: {
	                normal: {
	                    color: '#ccc',
	                    shadowColor: 'rgba(0, 0, 0, 0.5)',
	                }
	            },
	            data:[],
	            symbol: 'none'

	        }
	    ]
	};

	//For Hire Catch
	var hire_option = {
	    title: {
	        text: 'For Hire Catch'
	    },
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
                type: 'cross',
                animation: false,
                label: {
                    backgroundColor: '#ccc',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    textStyle: {
                        color: '#222'
                    }
                }
            },
            formatter: function (params) {
                return params[0].axisValue + '<br />' + params[2].seriesName+" : "+params[2].value+ '<br />' + params[1].seriesName+" : "+params[1].value+ '<br />'+ params[0].seriesName+" : " + params[0].value;
            }
	    },
	    legend: {
	        data:['F_std','HL_E','HL_W'],
	        show:false,
	    },
	    grid: {
	        left: '7%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis: {
	        type: 'category',
	        boundaryGap: false,
	        data: [],
	    },
	    yAxis: {
	        type: 'value',
			name: 'Catch(1000 lb)',
			max: function (value) {
				var newVal = value.max * 1.2;
				return Math.round(newVal/100)*100
			}
	    },
	    series: [
	        {
	            name:'Lower 2.5%',
	            type:'line',
	            stack: '1',
	            lineStyle: {
	                normal: {
	                    opacity: 0
	                }
	            },
	            symbol: 'none',
	            data:[],
	        },
	        {
	            name:'Median',
	            type:'line',
	            lineStyle: {
	                normal: {

	                }
	            },
	            showSymbol: false,
	            data:[]
	        },
	        {
	            name:'Upper 97.5%',
	            type:'line',
	            stack: '1',
	            lineStyle: {
	                normal: {
	                    opacity: 0
	                }
	            },
	            areaStyle: {
	                normal: {
	                    color: '#ccc',
	                    shadowColor: 'rgba(0, 0, 0, 0.5)',
	                }
	            },
	            data:[],
	            symbol: 'none'

	        }
	    ]
	};

	//Private Catch
	var private_option = {
	    title: {
	        text: 'Private Catch'
	    },
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
                type: 'cross',
                animation: false,
                label: {
                    backgroundColor: '#ccc',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    textStyle: {
                        color: '#222'
                    }
                }
            },
            formatter: function (params) {
                return params[0].axisValue + '<br />' + params[2].seriesName+" : "+params[2].value+ '<br />' + params[1].seriesName+" : "+params[1].value+ '<br />'+ params[0].seriesName+" : " + params[0].value;
            }
	    },
	    legend: {
	        data:['F_std','HL_E','HL_W'],
	        show:false,
	    },
	    grid: {
	        left: '7%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis: {
	        type: 'category',
	        boundaryGap: false,
	        data: [],
	    },
	    yAxis: {
	        type: 'value',
			name: 'Catch(1000 lb)',
			max: function (value) {
				var newVal = value.max * 1.2;
				return Math.round(newVal/1000)*1000
			}
	    },
	    series: [
	        {
	            name:'Lower 2.5%',
	            type:'line',
	            stack: '1',
	            lineStyle: {
	                normal: {
	                    opacity: 0
	                }
	            },
	            symbol: 'none',
	            data:[],
	        },
	        {
	            name:'Median',
	            type:'line',
	            lineStyle: {
	                normal: {

	                }
	            },
	            showSymbol: false,
	            data:[]
	        },
	        {
	            name:'Upper 97.5%',
	            type:'line',
	            stack: '1',
	            lineStyle: {
	                normal: {
	                    opacity: 0
	                }
	            },
	            areaStyle: {
	                normal: {
	                    color: '#ccc',
	                    shadowColor: 'rgba(0, 0, 0, 0.5)',
	                }
	            },
	            data:[],
	            symbol: 'none'

	        }
	    ]
	};

	//General Fishing Mortality
	var f_option = {
	    title: {
	        text: 'General Fishing Mortality'
	    },
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
                type: 'cross',
                animation: false,
                label: {
                    backgroundColor: '#ccc',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    textStyle: {
                        color: '#222'
                    }
                }
            },
            formatter: function (params) {
                return params[0].axisValue + '<br />' + params[2].seriesName+" : "+params[2].value+ '<br />' + params[1].seriesName+" : "+params[1].value+ '<br />'+ params[0].seriesName+" : " + params[0].value;
            }
	    },
	    legend: {
	        data:['F_std','HL_E','HL_W'],
	        show:false,
	    },
	    grid: {
	        left: '11%',
	        right: '7%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis: {
	        type: 'category',
	        boundaryGap: false,
	        data: [],
	    },
	    yAxis: {
	        type: 'value',
			name: 'General Fishing Mortality',
			max: function (value) {
				var newVal = value.max * 1.2;
				return Number(newVal.toFixed(2));
			}
	    },
	    series: [
	        {
	            name:'Lower 2.5%',
	            type:'line',
	            stack: '1',
	            lineStyle: {
	                normal: {
	                    opacity: 0
	                }
	            },
	            symbol: 'none',
	            data:[],
	        },
	        {
	            name:'Median',
	            type:'line',
	            lineStyle: {
	                normal: {

	                }
	            },
	            showSymbol: false,
	            data:[]
	        },
	        {
	            name:'Upper 97.5%',
	            type:'line',
	            stack: '1',
	            lineStyle: {
	                normal: {
	                    opacity: 0
	                }
	            },
	            areaStyle: {
	                normal: {
	                    color: '#ccc',
	                    shadowColor: 'rgba(0, 0, 0, 0.5)',
	                }
	            },
	            data:[],
	            symbol: 'none'

			},
			{
				name:'f(msy)',
				type:'line',
				data:[],
				showSymbol:false,
				markLine:{
					symbol:['none','arrow'],
					itemStyle:{normal:{color:'#dc143c'}},
					data:[
						{
							name: 'FMSY',
							yAxis: 0.0588
						}
					],
					symbol:'none',
					label:{
						formatter: '{b} \n {c}'
					},
					precision: 4
				},
			}
	    ]
	};

	

	//SSB East
	var ssbE_option = {
	    title: {
	        text: 'SSB in Stock1'
	    },
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
                type: 'cross',
                animation: false,
                label: {
                    backgroundColor: '#ccc',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    textStyle: {
                        color: '#222'
                    }
                }
            },
            formatter: function (params) {
                return params[0].axisValue + '<br />' + params[2].seriesName+" : "+params[2].value+ '<br />' + params[1].seriesName+" : "+params[1].value+ '<br />'+ params[0].seriesName+" : " + params[0].value;
            }
	    },
	    legend: {
	        data:['F_std','HL_E','HL_W'],
	        show:false,
	    },
	    grid: {
	        left: '7%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis: {
	        type: 'category',
	        boundaryGap: false,
	        data: [],
	    },
	    yAxis: {
	        type: 'value',
			name: 'SSB(1000 eggs)',
			axisLabel: {
				formatter: function (value){
					return toScientific(value);
				}
			},
			max: function (value) {
				var newVal = value.max * 1.2;
				return Math.round(newVal/1e+11)*1e+11;
			}
	    },
	    series: [
	        {
	            name:'Lower 2.5%',
	            type:'line',
	            stack: '1',
	            lineStyle: {
	                normal: {
	                    opacity: 0
	                }
	            },
	            symbol: 'none',
	            data:[],
	        },
	        {
	            name:'Median',
	            type:'line',
	            lineStyle: {
	                normal: {

	                }
	            },
	            showSymbol: false,
	            data:[]
	        },
	        {
	            name:'Upper 97.5%',
	            type:'line',
	            stack: '1',
	            lineStyle: {
	                normal: {
	                    opacity: 0
	                }
	            },
	            areaStyle: {
	                normal: {
	                    color: '#ccc',
	                    shadowColor: 'rgba(0, 0, 0, 0.5)',
	                }
	            },
	            data:[],
	            symbol: 'none'

	        }
	    ]
	};

	//SSB West
	var ssbW_option = {
	    title: {
	        text: 'SSB in Stock2'
	    },
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
                type: 'cross',
                animation: false,
                label: {
                    backgroundColor: '#ccc',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    textStyle: {
                        color: '#222'
                    }
                }
            },
            formatter: function (params) {
                return params[0].axisValue + '<br />' + params[2].seriesName+" : "+params[2].value+ '<br />' + params[1].seriesName+" : "+params[1].value+ '<br />'+ params[0].seriesName+" : " + params[0].value;
            }
	    },
	    legend: {
	        data:['F_std','HL_E','HL_W'],
	        show:false,
	    },
	    grid: {
	        left: '7%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis: {
	        type: 'category',
	        boundaryGap: false,
	        data: [],
	    },
	    yAxis: {
	        type: 'value',
			name: 'SSB(1000 eggs)',
			axisLabel: {
				formatter: function (value){
					return toScientific(value);
				}
			},
			max: function (value) {
				var newVal = value.max * 1.2;
				return Math.round(newVal/1e+11)*1e+11;
			}
	    },
	    series: [
	        {
	            name:'Lower 2.5%',
	            type:'line',
	            stack: '1',
	            lineStyle: {
	                normal: {
	                    opacity: 0
	                }
	            },
	            symbol: 'none',
	            data:[],
	        },
	        {
	            name:'Median',
	            type:'line',
	            lineStyle: {
	                normal: {

	                }
	            },
	            showSymbol: false,
	            data:[]
	        },
	        {
	            name:'Upper 97.5%',
	            type:'line',
	            stack: '1',
	            lineStyle: {
	                normal: {
	                    opacity: 0
	                }
	            },
	            areaStyle: {
	                normal: {
	                    color: '#ccc',
	                    shadowColor: 'rgba(0, 0, 0, 0.5)',
	                }
	            },
	            data:[],
	            symbol: 'none'

	        }
	    ]
	};

	//SSB for the Gulf
	var ssbGulf_option = {
	    title: {
	        text: 'Total SSB'
	    },
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
                type: 'cross',
                animation: false,
                label: {
                    backgroundColor: '#ccc',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    textStyle: {
                        color: '#222'
                    }
                }
            },
            formatter: function (params) {
                return params[0].axisValue + '<br />' + params[2].seriesName+" : "+params[2].value+ '<br />' + params[1].seriesName+" : "+params[1].value+ '<br />'+ params[0].seriesName+" : " + params[0].value;
            }
	    },
	    legend: {
	        data:['F_std','HL_E','HL_W'],
	        show:false,
	    },
	    grid: {
	        left: '7%',
	        right: '15%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis: {
	        type: 'category',
	        boundaryGap: false,
	        data: [],
	    },
	    yAxis: {
	        type: 'value',
			name: 'SSB(1000 eggs)',
			axisLabel: {
				formatter: function (value){
					return toScientific(value);
				}
			},
			max: function (value) {
				var newVal = value.max * 1.2;
				return Math.round(newVal/1e+11)*1e+11;
			}
	    },
	    series: [
	        {
	            name:'Lower 2.5%',
	            type:'line',
	            stack: '1',
	            lineStyle: {
	                normal: {
	                    opacity: 0
	                }
	            },
	            symbol: 'none',
	            data:[],
	        },
	        {
	            name:'Median',
	            type:'line',
	            lineStyle: {
	                normal: {

	                }
	            },
	            showSymbol: false,
	            data:[]
	        },
	        {
	            name:'Upper 97.5%',
	            type:'line',
	            stack: '1',
	            lineStyle: {
	                normal: {
	                    opacity: 0
	                }
	            },
	            areaStyle: {
	                normal: {
	                    color: '#ccc',
	                    shadowColor: 'rgba(0, 0, 0, 0.5)',
	                }
	            },
	            data:[],
	            symbol: 'none'

			},
			{
				name:'ssb(msy)',
				type:'line',
				data:[],
				showSymbol:false,
				markLine:{
					symbol:['none','arrow'],
					itemStyle:{normal:{color:'#dc143c'}},
					data:[
						{
							name: 'SSBMSY',
							yAxis: 1.23e+12
						}
					],
					symbol:'none',
					label:{
						formatter: function (params){
							return params.data.name + '\n' + toScientific(params.value);
						}
					},
				},
			}
	    ]
	};

	//AL Private Angling Catch
	var al_catch_option = {
		title: {
			text: 'AL Private Angling Catch'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				animation: false,
				label: {
					backgroundColor: '#ccc',
					borderColor: '#aaa',
					borderWidth: 1,
					shadowBlur: 0,
					shadowOffsetX: 0,
					shadowOffsetY: 0,
					textStyle: {
						color: '#222'
					}
				}
			},
			formatter: function (params) {
				return params[0].axisValue + '<br />' + params[2].seriesName+" : "+params[2].value+ '<br />' + params[1].seriesName+" : "+params[1].value+ '<br />'+ params[0].seriesName+" : " + params[0].value;
			}
		},
		legend: {
			data:['F_std','HL_E','HL_W'],
			show:false,
		},
		grid: {
			left: '7%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: [],
		},
		yAxis: {
			type: 'value',
			name: 'Catch(1000 lb)',
			max: function (value) {
				var newVal = value.max * 1.2;
				return Math.round(newVal/100)*100;
			}
		},
		series: [
			{
				name:'Lower 2.5%',
				type:'line',
				stack: '1',
				lineStyle: {
					normal: {
						opacity: 0
					}
				},
				symbol: 'none',
				data:[],
			},
			{
				name:'Median',
				type:'line',
				lineStyle: {
					normal: {

					}
				},
				showSymbol: false,
				data:[]
			},
			{
				name:'Upper 97.5%',
				type:'line',
				stack: '1',
				lineStyle: {
					normal: {
						opacity: 0
					}
				},
				areaStyle: {
					normal: {
						color: '#ccc',
						shadowColor: 'rgba(0, 0, 0, 0.5)',
					}
				},
				data:[],
				symbol: 'none'

			}
		]
	};

	//AL Private Angling Season Length
	var al_season_option = {
		title: {
			text: 'AL Private Angling Season Length'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				animation: false,
				label: {
					backgroundColor: '#ccc',
					borderColor: '#aaa',
					borderWidth: 1,
					shadowBlur: 0,
					shadowOffsetX: 0,
					shadowOffsetY: 0,
					textStyle: {
						color: '#222'
					}
				}
			},
			formatter: function (params) {
				return params[0].axisValue + '<br />' + params[2].seriesName+" : "+params[2].value+ '<br />' + params[1].seriesName+" : "+params[1].value+ '<br />'+ params[0].seriesName+" : " + params[0].value;
			}
		},
		legend: {
			data:['F_std','HL_E','HL_W'],
			show:false,
		},
		grid: {
			left: '9%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: [],
		},
		yAxis: {
			type: 'value',
			name: 'Season Length(days)',
			max: function (value) {
				var newVal = value.max * 1.2;
				return Math.round(newVal/10)*10;
			}
		},
		series: [
			{
				name:'Lower 2.5%',
				type:'line',
				stack: '1',
				lineStyle: {
					normal: {
						opacity: 0
					}
				},
				symbol: 'none',
				data:[],
			},
			{
				name:'Median',
				type:'line',
				lineStyle: {
					normal: {

					}
				},
				showSymbol: false,
				data:[]
			},
			{
				name:'Upper 97.5%',
				type:'line',
				stack: '1',
				lineStyle: {
					normal: {
						opacity: 0
					}
				},
				areaStyle: {
					normal: {
						color: '#ccc',
						shadowColor: 'rgba(0, 0, 0, 0.5)',
					}
				},
				data:[],
				symbol: 'none'

			}
		]
	};

	//FL Private Angling Catch
	var fl_catch_option = {
		title: {
			text: 'FL Private Angling Catch'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				animation: false,
				label: {
					backgroundColor: '#ccc',
					borderColor: '#aaa',
					borderWidth: 1,
					shadowBlur: 0,
					shadowOffsetX: 0,
					shadowOffsetY: 0,
					textStyle: {
						color: '#222'
					}
				}
			},
			formatter: function (params) {
				return params[0].axisValue + '<br />' + params[2].seriesName+" : "+params[2].value+ '<br />' + params[1].seriesName+" : "+params[1].value+ '<br />'+ params[0].seriesName+" : " + params[0].value;
			}
		},
		legend: {
			data:['F_std','HL_E','HL_W'],
			show:false,
		},
		grid: {
			left: '7%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: [],
		},
		yAxis: {
			type: 'value',
			name: 'Catch(1000 lb)',
			max: function (value) {
				var newVal = value.max * 1.2;
				return Math.round(newVal/1000)*1000;
			}
		},
		series: [
			{
				name:'Lower 2.5%',
				type:'line',
				stack: '1',
				lineStyle: {
					normal: {
						opacity: 0
					}
				},
				symbol: 'none',
				data:[],
			},
			{
				name:'Median',
				type:'line',
				lineStyle: {
					normal: {

					}
				},
				showSymbol: false,
				data:[]
			},
			{
				name:'Upper 97.5%',
				type:'line',
				stack: '1',
				lineStyle: {
					normal: {
						opacity: 0
					}
				},
				areaStyle: {
					normal: {
						color: '#ccc',
						shadowColor: 'rgba(0, 0, 0, 0.5)',
					}
				},
				data:[],
				symbol: 'none'

			}
		]
	};

	//FL Private Angling Season Length
	var fl_season_option = {
		title: {
			text: 'FL Private Angling Season Length'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				animation: false,
				label: {
					backgroundColor: '#ccc',
					borderColor: '#aaa',
					borderWidth: 1,
					shadowBlur: 0,
					shadowOffsetX: 0,
					shadowOffsetY: 0,
					textStyle: {
						color: '#222'
					}
				}
			},
			formatter: function (params) {
				return params[0].axisValue + '<br />' + params[2].seriesName+" : "+params[2].value+ '<br />' + params[1].seriesName+" : "+params[1].value+ '<br />'+ params[0].seriesName+" : " + params[0].value;
			}
		},
		legend: {
			data:['F_std','HL_E','HL_W'],
			show:false,
		},
		grid: {
			left: '9%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: [],
		},
		yAxis: {
			type: 'value',
			name: 'Season Length(days)',
			max: function (value) {
				var newVal = value.max * 1.2;
				return Math.round(newVal/10)*10;
			}
		},
		series: [
			{
				name:'Lower 2.5%',
				type:'line',
				stack: '1',
				lineStyle: {
					normal: {
						opacity: 0
					}
				},
				symbol: 'none',
				data:[],
			},
			{
				name:'Median',
				type:'line',
				lineStyle: {
					normal: {

					}
				},
				showSymbol: false,
				data:[]
			},
			{
				name:'Upper 97.5%',
				type:'line',
				stack: '1',
				lineStyle: {
					normal: {
						opacity: 0
					}
				},
				areaStyle: {
					normal: {
						color: '#ccc',
						shadowColor: 'rgba(0, 0, 0, 0.5)',
					}
				},
				data:[],
				symbol: 'none'

			}
		]
	};

	//LA Private Angling Catch
	var la_catch_option = {
		title: {
			text: 'LA Private Angling Catch'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				animation: false,
				label: {
					backgroundColor: '#ccc',
					borderColor: '#aaa',
					borderWidth: 1,
					shadowBlur: 0,
					shadowOffsetX: 0,
					shadowOffsetY: 0,
					textStyle: {
						color: '#222'
					}
				}
			},
			formatter: function (params) {
				return params[0].axisValue + '<br />' + params[2].seriesName+" : "+params[2].value+ '<br />' + params[1].seriesName+" : "+params[1].value+ '<br />'+ params[0].seriesName+" : " + params[0].value;
			}
		},
		legend: {
			data:['F_std','HL_E','HL_W'],
			show:false,
		},
		grid: {
			left: '7%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: [],
		},
		yAxis: {
			type: 'value',
			name: 'Catch(1000 lb)',
			max: function (value) {
				var newVal = value.max * 1.2;
				return Math.round(newVal/100)*100;
			}
		},
		series: [
			{
				name:'Lower 2.5%',
				type:'line',
				stack: '1',
				lineStyle: {
					normal: {
						opacity: 0
					}
				},
				symbol: 'none',
				data:[],
			},
			{
				name:'Median',
				type:'line',
				lineStyle: {
					normal: {

					}
				},
				showSymbol: false,
				data:[]
			},
			{
				name:'Upper 97.5%',
				type:'line',
				stack: '1',
				lineStyle: {
					normal: {
						opacity: 0
					}
				},
				areaStyle: {
					normal: {
						color: '#ccc',
						shadowColor: 'rgba(0, 0, 0, 0.5)',
					}
				},
				data:[],
				symbol: 'none'

			}
		]
	};

	//LA Private Angling Season Length
	var la_season_option = {
		title: {
			text: 'LA Private Angling Season Length'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				animation: false,
				label: {
					backgroundColor: '#ccc',
					borderColor: '#aaa',
					borderWidth: 1,
					shadowBlur: 0,
					shadowOffsetX: 0,
					shadowOffsetY: 0,
					textStyle: {
						color: '#222'
					}
				}
			},
			formatter: function (params) {
				return params[0].axisValue + '<br />' + params[2].seriesName+" : "+params[2].value+ '<br />' + params[1].seriesName+" : "+params[1].value+ '<br />'+ params[0].seriesName+" : " + params[0].value;
			}
		},
		legend: {
			data:['F_std','HL_E','HL_W'],
			show:false,
		},
		grid: {
			left: '9%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: [],
		},
		yAxis: {
			type: 'value',
			name: 'Season Length(days)',
			max: function (value) {
				var newVal = value.max * 1.2;
				return Math.round(newVal/10)*10;
			}
		},
		series: [
			{
				name:'Lower 2.5%',
				type:'line',
				stack: '1',
				lineStyle: {
					normal: {
						opacity: 0
					}
				},
				symbol: 'none',
				data:[],
			},
			{
				name:'Median',
				type:'line',
				lineStyle: {
					normal: {

					}
				},
				showSymbol: false,
				data:[]
			},
			{
				name:'Upper 97.5%',
				type:'line',
				stack: '1',
				lineStyle: {
					normal: {
						opacity: 0
					}
				},
				areaStyle: {
					normal: {
						color: '#ccc',
						shadowColor: 'rgba(0, 0, 0, 0.5)',
					}
				},
				data:[],
				symbol: 'none'

			}
		]
	};

	//MS Private Angling Catch
	var ms_catch_option = {
		title: {
			text: 'MS Private Angling Catch'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				animation: false,
				label: {
					backgroundColor: '#ccc',
					borderColor: '#aaa',
					borderWidth: 1,
					shadowBlur: 0,
					shadowOffsetX: 0,
					shadowOffsetY: 0,
					textStyle: {
						color: '#222'
					}
				}
			},
			formatter: function (params) {
				return params[0].axisValue + '<br />' + params[2].seriesName+" : "+params[2].value+ '<br />' + params[1].seriesName+" : "+params[1].value+ '<br />'+ params[0].seriesName+" : " + params[0].value;
			}
		},
		legend: {
			data:['F_std','HL_E','HL_W'],
			show:false,
		},
		grid: {
			left: '7%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: [],
		},
		yAxis: {
			type: 'value',
			name: 'Catch(1000 lb)',
			max: function (value) {
				var newVal = value.max * 1.2;
				return Math.round(newVal/100)*100;
			}
		},
		series: [
			{
				name:'Lower 2.5%',
				type:'line',
				stack: '1',
				lineStyle: {
					normal: {
						opacity: 0
					}
				},
				symbol: 'none',
				data:[],
			},
			{
				name:'Median',
				type:'line',
				lineStyle: {
					normal: {

					}
				},
				showSymbol: false,
				data:[]
			},
			{
				name:'Upper 97.5%',
				type:'line',
				stack: '1',
				lineStyle: {
					normal: {
						opacity: 0
					}
				},
				areaStyle: {
					normal: {
						color: '#ccc',
						shadowColor: 'rgba(0, 0, 0, 0.5)',
					}
				},
				data:[],
				symbol: 'none'

			}
		]
	};

	//MS Private Angling Season Length
	var ms_season_option = {
		title: {
			text: 'MS Private Angling Season Length'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				animation: false,
				label: {
					backgroundColor: '#ccc',
					borderColor: '#aaa',
					borderWidth: 1,
					shadowBlur: 0,
					shadowOffsetX: 0,
					shadowOffsetY: 0,
					textStyle: {
						color: '#222'
					}
				}
			},
			formatter: function (params) {
				return params[0].axisValue + '<br />' + params[2].seriesName+" : "+params[2].value+ '<br />' + params[1].seriesName+" : "+params[1].value+ '<br />'+ params[0].seriesName+" : " + params[0].value;
			}
		},
		legend: {
			data:['F_std','HL_E','HL_W'],
			show:false,
		},
		grid: {
			left: '9%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: [],
		},
		yAxis: {
			type: 'value',
			name: 'Season Length(days)',
			max: function (value) {
				var newVal = value.max * 1.2;
				return Math.round(newVal/10)*10;
			}
		},
		series: [
			{
				name:'Lower 2.5%',
				type:'line',
				stack: '1',
				lineStyle: {
					normal: {
						opacity: 0
					}
				},
				symbol: 'none',
				data:[],
			},
			{
				name:'Median',
				type:'line',
				lineStyle: {
					normal: {

					}
				},
				showSymbol: false,
				data:[]
			},
			{
				name:'Upper 97.5%',
				type:'line',
				stack: '1',
				lineStyle: {
					normal: {
						opacity: 0
					}
				},
				areaStyle: {
					normal: {
						color: '#ccc',
						shadowColor: 'rgba(0, 0, 0, 0.5)',
					}
				},
				data:[],
				symbol: 'none'

			}
		]
	};

	//TX Private Angling Season Length in Federal Water
	var tx_catch_option = {
		title: {
			text: 'TX Private Angling Season Length in Federal Water'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				animation: false,
				label: {
					backgroundColor: '#ccc',
					borderColor: '#aaa',
					borderWidth: 1,
					shadowBlur: 0,
					shadowOffsetX: 0,
					shadowOffsetY: 0,
					textStyle: {
						color: '#222'
					}
				}
			},
			formatter: function (params) {
				return params[0].axisValue + '<br />' + params[2].seriesName+" : "+params[2].value+ '<br />' + params[1].seriesName+" : "+params[1].value+ '<br />'+ params[0].seriesName+" : " + params[0].value;
			}
		},
		legend: {
			data:['F_std','HL_E','HL_W'],
			show:false,
		},
		grid: {
			left: '7%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: [],
		},
		yAxis: {
			type: 'value',
			name: 'Catch(1000 lb)',
			max: function (value) {
				var newVal = value.max * 1.2;
				return Math.round(newVal/10)*10;
			}
		},
		series: [
			{
				name:'Lower 2.5%',
				type:'line',
				stack: '1',
				lineStyle: {
					normal: {
						opacity: 0
					}
				},
				symbol: 'none',
				data:[],
			},
			{
				name:'Median',
				type:'line',
				lineStyle: {
					normal: {

					}
				},
				showSymbol: false,
				data:[]
			},
			{
				name:'Upper 97.5%',
				type:'line',
				stack: '1',
				lineStyle: {
					normal: {
						opacity: 0
					}
				},
				areaStyle: {
					normal: {
						color: '#ccc',
						shadowColor: 'rgba(0, 0, 0, 0.5)',
					}
				},
				data:[],
				symbol: 'none'

			}
		]
	};

	//TX Private Angling Season Length in Federal Water
	var tx_season_option = {
		title: {
			text: 'TX Private Angling Season Length in Federal Water'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				animation: false,
				label: {
					backgroundColor: '#ccc',
					borderColor: '#aaa',
					borderWidth: 1,
					shadowBlur: 0,
					shadowOffsetX: 0,
					shadowOffsetY: 0,
					textStyle: {
						color: '#222'
					}
				}
			},
			formatter: function (params) {
				return params[0].axisValue + '<br />' + params[2].seriesName+" : "+params[2].value+ '<br />' + params[1].seriesName+" : "+params[1].value+ '<br />'+ params[0].seriesName+" : " + params[0].value;
			}
		},
		legend: {
			data:['F_std','HL_E','HL_W'],
			show:false,
		},
		grid: {
			left: '9%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: [],
		},
		yAxis: {
			type: 'value',
			name: 'Season Length(days)',
			max: function (value) {
				var newVal = value.max * 1.2;
				return Math.round(newVal/10)*10;
			}
		},
		series: [
			{
				name:'Lower 2.5%',
				type:'line',
				stack: '1',
				lineStyle: {
					normal: {
						opacity: 0
					}
				},
				symbol: 'none',
				data:[],
			},
			{
				name:'Median',
				type:'line',
				lineStyle: {
					normal: {

					}
				},
				showSymbol: false,
				data:[]
			},
			{
				name:'Upper 97.5%',
				type:'line',
				stack: '1',
				lineStyle: {
					normal: {
						opacity: 0
					}
				},
				areaStyle: {
					normal: {
						color: '#ccc',
						shadowColor: 'rgba(0, 0, 0, 0.5)',
					}
				},
				data:[],
				symbol: 'none'

			}
		]
	};

	totalCatch.setOption(totalCatchOption);
	catchPlot.setOption(catchPlotOption);
	ssbPlot.setOption(ssbOption);
	commCatchPlot.setOption(commCatchOption);
	forHireCatchPlot.setOption(forhireCatchOption);
	privateCatchPlot.setOption(privateCatchOption);
	fedForhireLength.setOption(fedForhire_option);
	statePrivLength.setOption(statePrivLength_option);
	kobeChart1.setOption(kobe_option);
	recruitmentPlot.setOption(recruitmentOption);

	//Other detailed figures
	bioChart1.setOption(comm_option);
	sprChart1.setOption(recr_option);
	hireChart1.setOption(hire_option);
	privateChart1.setOption(private_option);
	fChart1.setOption(f_option);
	ssbGulfChart.setOption(ssbGulf_option);
	ssbEChart1.setOption(ssbE_option);
	ssbWChart1.setOption(ssbW_option);
	alCatchPlot.setOption(al_catch_option);
	alSeasonPlot.setOption(al_season_option);
	flCatchPlot.setOption(fl_catch_option);
	flSeasonPlot.setOption(fl_season_option);
	laCatchPlot.setOption(la_catch_option);
	laSeasonPlot.setOption(la_season_option);
	msCatchPlot.setOption(ms_catch_option);
	msSeasonPlot.setOption(ms_season_option);
	txCatchPlot.setOption(tx_catch_option);
	txSeasonPlot.setOption(tx_season_option);


	//add data to each graph
    if(chartdata){
    	try {
	        chartdata = JSON.parse(chartdata);
	    } catch (e) {
	    }

		//start essential figures data
		$.each(chartdata,function(index, el) {
        	totalCatch_xAxisData.push(el.year);
			totalCatch_data.push(el.total_catch_median);
			totalSSB_xAxisData.push(el.year);
			totalSSB_data.push(el.total_SSB_median);
		});
		
		totalCatchOption.xAxis[0].data = totalCatch_xAxisData;
		totalCatchOption.series[0].data = totalCatch_data;
		totalCatchOption.xAxis[1].data = totalSSB_xAxisData;
		totalCatchOption.series[1].data = totalSSB_data;
		totalCatch.setOption(totalCatchOption);
		
		$.each(chartdata,function(index, el) {
        	catchStack_xAxisData.push(el.year);
			catchStack_comm_data.push(el.comm_catch_mean);
			catchStack_forhire_data.push(el.Forhire_catch_mean);
			catchStack_private_data.push(el.Private_catch_mean);
        });
        catchPlotOption.xAxis[0].data = catchStack_xAxisData;
        catchPlotOption.series[0].data = catchStack_private_data;
        catchPlotOption.series[1].data = catchStack_forhire_data;
        catchPlotOption.series[2].data = catchStack_comm_data;
		catchPlot.setOption(catchPlotOption);

		$.each(chartdata,function(index, el) {
        	ssbStack_xAxisData.push(el.year);
			ssbStack_E_data.push(el.SSB_1_mean);
			ssbStack_W_data.push(el.SSB_2_mean);
        });
        ssbOption.xAxis[0].data = ssbStack_xAxisData;
        ssbOption.series[0].data = ssbStack_W_data;
        ssbOption.series[1].data = ssbStack_E_data;
		ssbPlot.setOption(ssbOption);

		$.each(chartdata,function(index, el) {
        	commStack_xAxiData.push(el.year);
			commStack_E_data.push(el.comm_catch_1_mean);
			commStack_W_data.push(el.comm_catch_2_mean);
        });
        commCatchOption.xAxis[0].data = commStack_xAxiData;
        commCatchOption.series[0].data = commStack_W_data;
        commCatchOption.series[1].data = commStack_E_data;
		commCatchPlot.setOption(commCatchOption);

		$.each(chartdata,function(index, el) {
        	forhireStack_xAxisData.push(el.year);
			forhireStack_E_data.push(el.Forhire_catch_1_mean);
			forhireStack_W_data.push(el.Forhire_catch_2_mean);
        });
        forhireCatchOption.xAxis[0].data = forhireStack_xAxisData;
        forhireCatchOption.series[0].data = forhireStack_W_data;
        forhireCatchOption.series[1].data = forhireStack_E_data;
		forHireCatchPlot.setOption(forhireCatchOption);

		$.each(chartdata,function(index, el) {
        	privateStack_xAxisData.push(el.year);
			privateStack_E_data.push(el.Private_catch_1_mean);
			privateStack_W_data.push(el.Private_catch_2_mean);
        });
        privateCatchOption.xAxis[0].data = privateStack_xAxisData;
        privateCatchOption.series[0].data = privateStack_W_data;
        privateCatchOption.series[1].data = privateStack_E_data;
		privateCatchPlot.setOption(privateCatchOption);

		$.each(chartdata,function(index, el) {
        	fed_forhire_xAxisData.push(el.year);
			fed_forhire_low_data.push(el.true_fed_forhire_season_length_025);
			fed_forhire_median_data.push(el.true_fed_forhire_season_length_median);
			fed_forhire_high_data.push(el.true_fed_forhire_season_length_975);
		});
        fedForhire_option.xAxis.data = fed_forhire_xAxisData;
        fedForhire_option.series[0].data = fed_forhire_median_data;
		fedForhire_option.series.push(getErrorOption(fed_forhire_low_data, fed_forhire_high_data));
		fedForhireLength.setOption(fedForhire_option);

		$.each(chartdata,function(index, el) {
        	state_private_xAxistData.push(el.year.toString());
			state_AL_data.push(el.true_private_AL_season_length_median);
			state_FL_data.push(el.true_private_FL_season_length_median);
			state_LA_data.push(el.true_private_LA_season_length_median);
			state_MS_data.push(el.true_private_MS_season_length_median);
			state_TX_data.push(el.true_private_TX_season_length_median);
		});

		state_source_data.push(state_private_xAxistData);
		state_source_data.push(state_AL_data);
		state_source_data.push(state_FL_data);
		state_source_data.push(state_LA_data);
		state_source_data.push(state_MS_data);
		state_source_data.push(state_TX_data);
		statePrivLength_option.dataset.source = state_source_data;
		statePrivLength.setOption(statePrivLength_option);

		var xMax = 2;
		var yMax = 2;
	    $.each(chartdata,function(index, el) {
			kobe_median_data.push([el.SSB_total_ratio_median,el.F_general_ratio_median]);
			xMax = Math.max(xMax,el.SSB_total_ratio_median)
			yMax = Math.max(yMax,el.F_general_ratio_median)
		});
		xMax = xMax * 1.2;
		yMax = yMax * 1.2;
		kobe_option.series[0].data = kobe_median_data;
		//Adjust colored areas to fit all points
		kobe_option.series[1].data = [[0,Math.round(yMax)],[1,Math.round(yMax)]];
		kobe_option.series[2].data = [[0,1],[1,1]] ;
		kobe_option.series[3].data = [[1,Math.round(yMax)],[Math.round(xMax),Math.round(yMax)]];
		kobe_option.series[4].data = [[1,1],[Math.round(xMax),1]];

		kobeChart1.setOption(kobe_option);

		$.each(chartdata,function(index, el) {
        	recrStack_xAxisData.push(el.year);
			recrStack_E_data.push(el.R_1_mean);
			recrStack_W_data.push(el.R_2_mean);
        });
        recruitmentOption.xAxis[0].data = recrStack_xAxisData;
        recruitmentOption.series[0].data = recrStack_W_data;
        recruitmentOption.series[1].data = recrStack_E_data;
		recruitmentPlot.setOption(recruitmentOption);

		//start other figures data
        $.each(chartdata,function(index, el) {
        	comm_xAxisData.push(el.year);
			comm_low_data.push(el.comm_catch_025);
			comm_median_data.push(el.comm_catch_median);
			comm_high_data.push(el.comm_catch_975);
        });
        comm_option.xAxis.data = comm_xAxisData;
        comm_option.series[0].data = comm_low_data;
        comm_option.series[1].data = comm_median_data;
        comm_option.series[2].data = comm_high_data;
		bioChart1.setOption(comm_option);

        $.each(chartdata,function(index, el) {
        	recr_xAxisData.push(el.year);
			recr_low_data.push(el.recr_catch_025);
			recr_median_data.push(el.recr_catch_median);
			recr_high_data.push(el.recr_catch_975);
        });

        recr_option.xAxis.data = recr_xAxisData;
        recr_option.series[0].data = recr_low_data;
        recr_option.series[1].data = recr_median_data;
        recr_option.series[2].data = recr_high_data;
		sprChart1.setOption(recr_option);

		$.each(chartdata,function(index, el) {
        	hire_xAxisData.push(el.year);
			hire_low_data.push(el.Forhire_catch_025);
			hire_median_data.push(el.Forhire_catch_median);
			hire_high_data.push(el.Forhire_catch_975);
        });

        hire_option.xAxis.data = hire_xAxisData;
        hire_option.series[0].data = hire_low_data;
        hire_option.series[1].data = hire_median_data;
        hire_option.series[2].data = hire_high_data;
		hireChart1.setOption(hire_option);

		$.each(chartdata,function(index, el) {
        	private_xAxisData.push(el.year);
			private_low_data.push(el.Private_catch_025);
			private_median_data.push(el.Private_catch_median);
			private_high_data.push(el.Private_catch_975);
        });

        private_option.xAxis.data = private_xAxisData;
        private_option.series[0].data = private_low_data;
        private_option.series[1].data = private_median_data;
        private_option.series[2].data = private_high_data;
		privateChart1.setOption(private_option);

		$.each(chartdata,function(index, el) {
        	f_xAxisData.push(el.year);
			f_low_data.push(el.F_general_025);
			f_median_data.push(el.F_general_median);
			f_high_data.push(el.F_general_975);
        });
        f_option.xAxis.data = f_xAxisData;
        f_option.series[0].data = f_low_data;
        f_option.series[1].data = f_median_data;
        f_option.series[2].data = f_high_data;
       	fChart1.setOption(f_option);

		$.each(chartdata,function(index, el) {
        	ssbGulf_xAxisData.push(el.year);
			ssbGulf_low_data.push(el.SSB_total_025);
			ssbGulf_median_data.push(el.SSB_total_median);
			ssbGulf_high_data.push(el.SSB_total_975);
        });

        ssbGulf_option.xAxis.data = ssbGulf_xAxisData;
        ssbGulf_option.series[0].data = ssbGulf_low_data;
        ssbGulf_option.series[1].data = ssbGulf_median_data;
        ssbGulf_option.series[2].data = ssbGulf_high_data;
		ssbGulfChart.setOption(ssbGulf_option);

		$.each(chartdata,function(index, el) {
        	ssbE_xAxisData.push(el.year);
			ssbE_low_data.push(el.SSB_1_025);
			ssbE_median_data.push(el.SSB_1_median);
			ssbE_high_data.push(el.SSB_1_975);
        });

        ssbE_option.xAxis.data = ssbE_xAxisData;
        ssbE_option.series[0].data = ssbE_low_data;
        ssbE_option.series[1].data = ssbE_median_data;
        ssbE_option.series[2].data = ssbE_high_data;
		ssbEChart1.setOption(ssbE_option);

		$.each(chartdata,function(index, el) {
        	ssbW_xAxisData.push(el.year);
			ssbW_low_data.push(el.SSB_2_025);
			ssbW_median_data.push(el.SSB_2_median);
			ssbW_high_data.push(el.SSB_2_975);
        });

        ssbW_option.xAxis.data = ssbW_xAxisData;
        ssbW_option.series[0].data = ssbW_low_data;
        ssbW_option.series[1].data = ssbW_median_data;
        ssbW_option.series[2].data = ssbW_high_data;
		ssbWChart1.setOption(ssbW_option);

		$.each(chartdata,function(index, el) {
        	AL_catch_xAxisData.push(el.year);
			AL_catch_low_data.push(el.true_private_AL_catch_025);
			AL_catch_median_data.push(el.true_private_AL_catch_median);
			AL_catch_high_data.push(el.true_private_AL_catch_975);
		});
		
		al_catch_option.xAxis.data = AL_catch_xAxisData;
        al_catch_option.series[0].data = AL_catch_low_data;
        al_catch_option.series[1].data = AL_catch_median_data;
        al_catch_option.series[2].data = AL_catch_high_data;
		alCatchPlot.setOption(al_catch_option);

		$.each(chartdata,function(index, el) {
        	AL_seas_xAxisData.push(el.year);
			AL_seas_low_data.push(el.true_private_AL_season_length_025);
			AL_seas_median_data.push(el.true_private_AL_season_length_median);
			AL_seas_high_data.push(el.true_private_AL_season_length_975);
		});
		
		al_season_option.xAxis.data = AL_seas_xAxisData;
        al_season_option.series[0].data = AL_seas_low_data;
        al_season_option.series[1].data = AL_seas_median_data;
        al_season_option.series[2].data = AL_seas_high_data;
		alSeasonPlot.setOption(al_season_option);

		$.each(chartdata,function(index, el) {
        	FL_catch_xAxisData.push(el.year);
			FL_catch_low_data.push(el.true_private_FL_catch_025);
			FL_catch_median_data.push(el.true_private_FL_catch_median);
			FL_catch_high_data.push(el.true_private_FL_catch_975);
		});
		
		fl_catch_option.xAxis.data = FL_catch_xAxisData;
        fl_catch_option.series[0].data = FL_catch_low_data;
    	fl_catch_option.series[1].data = FL_catch_median_data;
        fl_catch_option.series[2].data = FL_catch_high_data;
		flCatchPlot.setOption(fl_catch_option);

		$.each(chartdata,function(index, el) {
        	FL_seas_xAxisData.push(el.year);
			FL_seas_low_data.push(el.true_private_FL_season_length_025);
			FL_seas_median_data.push(el.true_private_FL_season_length_median);
			FL_seas_high_data.push(el.true_private_FL_season_length_975);
		});
		
		fl_season_option.xAxis.data = FL_seas_xAxisData;
        fl_season_option.series[0].data = FL_seas_low_data;
        fl_season_option.series[1].data = FL_seas_median_data;
        fl_season_option.series[2].data = FL_seas_high_data;
		flSeasonPlot.setOption(fl_season_option);

		$.each(chartdata,function(index, el) {
        	LA_catch_xAxisData.push(el.year);
			LA_catch_low_data.push(el.true_private_LA_catch_025);
			LA_catch_median_data.push(el.true_private_LA_catch_median);
			LA_catch_high_data.push(el.true_private_LA_catch_975);
		});
		
		la_catch_option.xAxis.data = LA_catch_xAxisData;
        la_catch_option.series[0].data = LA_catch_low_data;
    	la_catch_option.series[1].data = LA_catch_median_data;
        la_catch_option.series[2].data = LA_catch_high_data;
		laCatchPlot.setOption(la_catch_option);

		$.each(chartdata,function(index, el) {
        	LA_seas_xAxisData.push(el.year);
			LA_seas_low_data.push(el.true_private_LA_season_length_025);
			LA_seas_median_data.push(el.true_private_LA_season_length_median);
			LA_seas_high_data.push(el.true_private_LA_season_length_975);
		});
		
		la_season_option.xAxis.data = LA_seas_xAxisData;
        la_season_option.series[0].data = LA_seas_low_data;
        la_season_option.series[1].data = LA_seas_median_data;
        la_season_option.series[2].data = LA_seas_high_data;
		laSeasonPlot.setOption(la_season_option);

		$.each(chartdata,function(index, el) {
        	MS_catch_xAxisData.push(el.year);
			MS_catch_low_data.push(el.true_private_MS_catch_025);
			MS_catch_median_data.push(el.true_private_MS_catch_median);
			MS_catch_high_data.push(el.true_private_MS_catch_975);
		});
		
		ms_catch_option.xAxis.data = MS_catch_xAxisData;
        ms_catch_option.series[0].data = MS_catch_low_data;
    	ms_catch_option.series[1].data = MS_catch_median_data;
        ms_catch_option.series[2].data = MS_catch_high_data;
		msCatchPlot.setOption(ms_catch_option);

		$.each(chartdata,function(index, el) {
        	MS_seas_xAxisData.push(el.year);
			MS_seas_low_data.push(el.true_private_MS_season_length_025);
			MS_seas_median_data.push(el.true_private_MS_season_length_median);
			MS_seas_high_data.push(el.true_private_MS_season_length_975);
		});
		
		ms_season_option.xAxis.data = MS_seas_xAxisData;
        ms_season_option.series[0].data = MS_seas_low_data;
        ms_season_option.series[1].data = MS_seas_median_data;
        ms_season_option.series[2].data = MS_seas_high_data;
		msSeasonPlot.setOption(ms_season_option);

		$.each(chartdata,function(index, el) {
        	TX_catch_xAxisData.push(el.year);
			TX_catch_low_data.push(el.true_private_TX_catch_025);
			TX_catch_median_data.push(el.true_private_TX_catch_median);
			TX_catch_high_data.push(el.true_private_TX_catch_975);
		});
		
		tx_catch_option.xAxis.data = TX_catch_xAxisData;
        tx_catch_option.series[0].data = TX_catch_low_data;
    	tx_catch_option.series[1].data = TX_catch_median_data;
        tx_catch_option.series[2].data = TX_catch_high_data;
		txCatchPlot.setOption(tx_catch_option);
		
		$.each(chartdata,function(index, el) {
        	TX_seas_xAxisData.push(el.year);
			TX_seas_low_data.push(el.true_private_TX_season_length_025);
			TX_seas_median_data.push(el.true_private_TX_season_length_median);
			TX_seas_high_data.push(el.true_private_TX_season_length_975);
		});
		
		tx_season_option.xAxis.data = TX_seas_xAxisData;
        tx_season_option.series[0].data = TX_seas_low_data;
        tx_season_option.series[1].data = TX_seas_median_data;
        tx_season_option.series[2].data = TX_seas_high_data;
		txSeasonPlot.setOption(tx_season_option)



	}

}

