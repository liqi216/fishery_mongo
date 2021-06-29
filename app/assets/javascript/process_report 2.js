$(function() {
    if(document.getElementById('colorChart') != null){
        var colorChart = echarts.init(document.getElementById('colorChart'));
    }

    var ruleChart = echarts.init(document.getElementById('ruleChart'));
    var current_f_ratio = $('#step1_id').data('current_f_ratio');
    var current_ssb_ratio = $('#step1_id').data('current_ssb_ratio');
    var start_projection = $('#start_projection').find("input").val() || "2016";
	start_projection = start_projection.substring(0,4);

    var colorChartOption = {
		color:[
		    '#1e90ff'
    	],
		tooltip : {
				trigger: 'item',
				formatter:function(params){
					if(params.seriesName === start_projection)
						return params.data;
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
		series : [
			{
				name:start_projection,
				type:'scatter',
				data:[[current_ssb_ratio,current_f_ratio]],
				itemStyle:{
					normal:{
						label:{
						show:true,
						position:'right',
							formatter:function(params){
								return params.seriesName;
							}
						}
					}
				},
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

    var ruleChartOption = {
    	    color:['#87cefa'],
		    tooltip : {
		        trigger: 'axis',
		        formatter:function(params){
		        	return params.data;
		        }
		    },
		    xAxis : [
		        {
		          type : 'value',
		          min:0,
		          max:2,
		          name:'SSB',
		          splitNumber:2,
		          axisLabel:{show:false},
		          axisTick:{show:false},
		          splitLine:{show:false},


		        }
		    ],
		    yAxis : [
		        {
		          type : 'value',
		          name:'F',
		          min:0.03,
		          max:0.08,
              interval:0.0001,
		          axisLabel:{
		            show:true,
		            formatter: function(value){
		              if(value==0.0588) return 'MFMT';
		            }
		          },
		          axisTick:{show:false},
		          splitLine:{show:false},
		        }
		    ],
		    series : [
		        {
		          type:'line',
		          data:[[0,0.0500],[2,0.0500]],
              symbol:function(value){
                  if(value[0] == 0){
                    return "none";
                  }
		          },
		          markLine:{
		          	symbol:['none','arrow'],
		          	itemStyle:{normal:{color:'#dc143c'}},
		          	data:[
		          		[
		          		  {name:'',xAxis:0,yAxis:0.0500},
		          		  {name:'',xAxis:2,yAxis:0.0500},
		          		],
		          		[
		          		  {name:'',xAxis:1,yAxis:0.0550},
		          		  {name:'',xAxis:1,yAxis:0.0500},
		          		],
		          		[
		          		  {name:'',xAxis:1,yAxis:0.0450},
		          		  {name:'',xAxis:1,yAxis:0.0500},
		          		]
		          	],
		          },
		          itemStyle:{
  		          normal:{
  		              areaStyle: {type: 'default'}
  		            }
              },
              label:{show:true}
            },
            {
		          type:'line',
		          data:[[0,0.0588],[2,0.0588]],
		          label:{show:true},
              symbol:function(value){
                  if(value[0] == 0){
                    return "none";
                  }
		          },
            },
          ]
        };

    if(document.getElementById('colorChart') != null){
		var xMax = 2;
		var yMax = 2;

		xMax = Math.max(xMax,current_ssb_ratio);
		yMax = Math.max(yMax,current_f_ratio);

		xMax = xMax * 1.2;
		yMax = yMax * 1.2;

		//Adjust sqaure areas to fit point
		colorChartOption.series[1].data = [[0,Math.round(yMax)],[1,Math.round(yMax)]];
		colorChartOption.series[2].data = [[0,1],[1,1]] ;
		colorChartOption.series[3].data = [[1,Math.round(yMax)],[Math.round(xMax),Math.round(yMax)]];
		colorChartOption.series[4].data = [[1,1],[Math.round(xMax),1]];
        colorChart.setOption(colorChartOption);
    }
    ruleChart.setOption(ruleChartOption);

    $('#ex1').slider({

		formatter: function(value) {

			ruleChartOption.series[0].data=[];
    		ruleChartOption.series[0].data.push([0,value]);
    		ruleChartOption.series[0].data.push([2,value]);
    		ruleChartOption.series[0].markLine.data[0][0].yAxis=value;
    		ruleChartOption.series[0].markLine.data[0][1].yAxis=value;
    		ruleChartOption.series[0].markLine.data[1][0].yAxis=value+0.005;
    		ruleChartOption.series[0].markLine.data[1][1].yAxis=value;
    		ruleChartOption.series[0].markLine.data[2][0].yAxis=value-0.005;
    		ruleChartOption.series[0].markLine.data[2][1].yAxis=value;
    		ruleChart.setOption(ruleChartOption);
    		//$("#bio_f_percent").val(parseFloat(value/0.75).toPrecision(3));

			return 'Current value: ' + value;
		}
	});

    var chartdata;
	$.ajax({
    	url: $SCRIPT_ROOT+'/prostepview/getMesResult/'+$("#step1_id").data("step1id"),
    	type: 'get',
    	dataType: 'JSON',
    	data: {},
    })
    .done(function(result) {
    	chartdata = result.resultlist;
    })
    .always(function(result){
    	drawChart(chartdata);
    })

    $("#btnReport").on('click', function(event) {
    	event.preventDefault();
    	$("#mask").addClass('lmask');

      //if the parameter has changed from the global settings value,
      //change color of text to red, to highlight the change
      function checkChange(doc, changes, key){
        if(changes.has(key)){
          doc.setTextColor(255,0,0);
        }
      }

    var changes = new Set();
    $.ajax({
      url: $SCRIPT_ROOT + '/prostepview/trackChanges/' + $("#step1_id").data("step1id"),
      type: 'get',
      dataType: 'JSON',
      data:{},
    }).done(function(data) {
          for(let i = 0; i < data.changes.length; i++){
            changes.add(data.changes[i]);
          }

          $.ajax({
      	    	url: $SCRIPT_ROOT+'/prostepview/getMesInput/'+$("#step1_id").data("step1id"),
      	    	type: 'get',
      	    	dataType: 'JSON',
      	    	data: {},
      	    }).done(function(res) {
				var result = res.result;
				var info = res.info;	

				if(!info.hasMseResult){
					//notfiy user that there is no result yet
					$("#mask").removeClass('lmask');
					$('#noResultModal').modal('toggle');
					return;
				}

				var totalCatchImgData = totalCatch.getDataURL();
				var catchPlotImgData = catchPlot.getDataURL();
				var ssbPlotImgData = ssbPlot.getDataURL();
				var commCatchPlotImgData = commCatchPlot.getDataURL();
				var forHireCatchPlotImgData = forHireCatchPlot.getDataURL();
				var privateCatchPlotImgData = privateCatchPlot.getDataURL();
				var fedForhireLengthImgData = fedForhireLength.getDataURL();
				var statePrivLengthImgData = statePrivLength.getDataURL();
				var kobeChart1ImgData = kobeChart1.getDataURL();
				var recruitmentPlotImgData = recruitmentPlot.getDataURL();

				var bioChart1ImgData = bioChart1.getDataURL();
				var sprChart1ImgData = sprChart1.getDataURL();
				var hireChart1ImgData = hireChart1.getDataURL();
				var privateChart1ImgData = privateChart1.getDataURL();
				var fChart1ImgData = fChart1.getDataURL();
				var ssbEChart1ImgData = ssbEChart1.getDataURL();
      	    	var ssbWChart1ImgData = ssbWChart1.getDataURL();
				var ssbGulfChartImgData = ssbGulfChart.getDataURL();
				var alCatchPlotImgData = alCatchPlot.getDataURL();
				var alSeasonPlotImgData = alSeasonPlot.getDataURL();
				var flCatchPlotImgData = flCatchPlot.getDataURL();
				var flSeasonPlotImgData = flSeasonPlot.getDataURL();
				var laCatchPlotImgData = laCatchPlot.getDataURL();
				var laSeasonPlotImgData = laSeasonPlot.getDataURL();
				var msCatchPlotImgData = msCatchPlot.getDataURL();
				var msSeasonPlotImgData = msSeasonPlot.getDataURL();
				var txCatchPlotImgData = txCatchPlot.getDataURL();
				var txSeasonPlotImgData = txSeasonPlot.getDataURL();

				var colorChartImgData = colorChart.getDataURL();
      	    	var ruleChartImgData = ruleChart.getDataURL();

				var doc = new jsPDF('p', 'pt', 'a4', false);

      		    var pageHeight= doc.internal.pageSize.height;
      			doc.setFontSize(36);
				doc.text('MSE Report', 200, 80);
				doc.setFontSize(12);
				doc.text("Scenario: "+ info.scenario,50,120);
				doc.text("Created By: "+ info.created_by,50,135);
				doc.text("Last modified: " + info.last_modified,50,150);
				doc.text("Notes: " + info.description, 50, 165);
			//Essential Figures
				doc.setFontSize(20);
				doc.text("Essential Figures:",50 ,250);
				doc.addImage(totalCatchImgData, 'jpg', 50, 300,500, 350, undefined, 'none');
				doc.addPage();
				doc.addImage(catchPlotImgData, 'jpg', 50,50,500,350,undefined, 'none');
				doc.addImage(ssbPlotImgData, 'jpg', 50,450,500,350,undefined, 'none');
				doc.addPage();
				doc.addImage(commCatchPlotImgData, 'jpg', 50,50,500,350,undefined, 'none');
				doc.addImage(forHireCatchPlotImgData, 'jpg', 50,450,500,350,undefined, 'none');
				doc.addPage();
				doc.addImage(privateCatchPlotImgData, 'jpg', 50,50,500,350,undefined, 'none');
				doc.addImage(fedForhireLengthImgData, 'jpg', 50,450,500,350,undefined, 'none');
				doc.addPage();
				doc.addImage(statePrivLengthImgData, 'jpg', 50,50,500,350,undefined, 'none');
				doc.addImage(kobeChart1ImgData, 'jpg', 50,450,500,350,undefined, 'none');
				doc.addPage();
				doc.addImage(recruitmentPlotImgData, 'jpg', 50,50,500,350,undefined, 'none');
			//Other Detailed Figures
				doc.addPage();
				doc.text("Other Detailed Figures:",50 ,120);
				doc.addImage(bioChart1ImgData, 'jpg', 50, 200,500, 350, undefined, 'none');
				doc.addPage();
				doc.addImage(sprChart1ImgData, 'jpg', 50,50,500,350,undefined, 'none');
				doc.addImage(hireChart1ImgData, 'jpg', 50,450,500,350,undefined, 'none');
				doc.addPage();
				doc.addImage(privateChart1ImgData, 'jpg', 50,50,500,350,undefined, 'none');
				doc.addImage(fChart1ImgData, 'jpg', 50,450,500,350,undefined, 'none');
				doc.addPage();
				doc.addImage(ssbEChart1ImgData, 'jpg', 50,50,500,350,undefined, 'none');
				doc.addImage(ssbWChart1ImgData, 'jpg', 50,450,500,350,undefined, 'none');
				doc.addPage();
				doc.addImage(ssbGulfChartImgData, 'jpg', 50,50,500,350,undefined, 'none');
				doc.addImage(alCatchPlotImgData, 'jpg', 50,450,500,350,undefined, 'none');
				doc.addPage();
				doc.addImage(alSeasonPlotImgData, 'jpg', 50,50,500,350,undefined, 'none');
				doc.addImage(flCatchPlotImgData, 'jpg', 50,450,500,350,undefined, 'none');
				doc.addPage();
				doc.addImage(flSeasonPlotImgData, 'jpg', 50,50,500,350,undefined, 'none');
				doc.addImage(laCatchPlotImgData, 'jpg', 50,450,500,350,undefined, 'none');
				doc.addPage();
				doc.addImage(laSeasonPlotImgData, 'jpg', 50,50,500,350,undefined, 'none');
				doc.addImage(msCatchPlotImgData, 'jpg', 50,450,500,350,undefined, 'none');
				doc.addPage();
				doc.addImage(msSeasonPlotImgData, 'jpg', 50,50,500,350,undefined, 'none');
				doc.addImage(txCatchPlotImgData, 'jpg', 50,450,500,350,undefined, 'none');
				doc.addPage();
				doc.addImage(txSeasonPlotImgData, 'jpg', 50,50,500,350,undefined, 'none');

				
			 	doc.addPage();
		 		var ypos = 70;  
				doc.setFontSize(23);
				doc.text('Inputs', 250, ypos);

			  //Stock Assessment Model Input
			  	doc.setFontSize(20);
      		    doc.text('Stock Assessment Model Input', 50, ypos+=40);
				doc.setFontSize(10);
      		    if(result.stock1_model_type==1){
      		    	doc.text('Model type: Stock Synthesis 3', 90, ypos+=20);
      		    }else if(result.stock1_model_type==2){
      		    	doc.text('Model type: Virtual Population Analysis', 90, ypos+=20);
      		    }else{
      		    	doc.text('Model type: Statistical-catch-at-age', 90, ypos+=20);
      		    }
      		    if(result.stock1_input_file_type==1){
      		    	doc.text('Input File: Official Stock Assessment Model', 90, ypos+=20);
      		    }else{
      		    	doc.text('Input File: Self-defined Model', 90, ypos+=20);
				}
				  
      		//General Inputs
      		    //Section font size
      		    doc.setFontSize(20);
      		    doc.text('General Inputs', 50, ypos+=40)
      		    //aritcle font size
      		    doc.setFontSize(10);
      		    if(result.time_step=='Y'){
      		    	doc.text('Time Step: 1 year', 90, ypos+=20);
      		    }else{
      		    	doc.text('Time Step: half year', 90, ypos+=20);
      		    }
      		    doc.text('Start Projection: 2016-01-01', 90, ypos+=20);
              	checkChange(doc, changes, "short_term_mgt");
      		    doc.text('Stock Assessment Frequency: '+result.short_term_mgt+' Years', 90, ypos+=20);
              	doc.setTextColor(0);
              	checkChange(doc, changes, "long_term_mgt");
      		    doc.text('Forward Projection: '+result.long_term_mgt+' Years', 90, ypos+=20);
              	doc.setTextColor(0);
      		    doc.text('Last Age in the Plus Group: '+result.last_age, 90, ypos+=20);
				// doc.text('Mixing Pattern: No mixing', 90, ypos+=20);
				checkChange(doc, changes, "no_of_interations");
      		    doc.text('Uncertainty: '+result.no_of_interations + ' iterations', 90, ypos+=20);
				doc.setTextColor(0); 
				checkChange(doc, changes, "sample_size"); 
				doc.text('Observational Error for Initial Distribution: '+result.sample_size + ' effective sample size', 90, ypos+=20);
				doc.setTextColor(0);
				checkChange(doc, changes, "observ_err_EW_stock"); 
				doc.text('Observational Error for Recruitment Ratio between East and West Stocks: '+result.observ_err_EW_stock + ' effective sample size', 90, ypos+=20);
				doc.setTextColor(0);
				checkChange(doc,changes,"rnd_seed_setting");  
				if(result.rnd_seed_setting==1){
					doc.text("Random Seed Setting: Use Seconds of the System's Clock", 90, ypos+=20);
				}else if (result.rnd_seed_setting==2){
      		    	doc.text('Random Seed Setting: Default Seed CSV', 90, ypos+=20);
      		    }else{
      		    	doc.text('Random Seed Setting: Self-defined CSV', 90, ypos+=20);
      		    }
				doc.setTextColor(0);

		//Mixing Pattern
				doc.setFontSize(20);
				doc.text('Mixing Pattern', 50, ypos+=40);
				doc.setFontSize(10);
				doc.text('No mixing', 90, ypos+=20);
				doc.text('Constant', 90, ypos+=20);
				doc.text('Stock 1 to 1: 50%', 100, ypos+=20);
				doc.text('Stock 2 to 1: 50%', 220, ypos);
				doc.text('Stock 1 to 2: 50%', 100, ypos+=20);
				doc.text('Stock 2 to 2: 50%', 220, ypos);


      	//Initial Population
      		    //Section font size
      		    doc.setFontSize(20);
      		    doc.text('Initial Population', 50, ypos+=40);
      		    doc.setFontSize(10);
              	checkChange(doc, changes, "ip_cv_1");
      		    doc.text('Stock 1 Population CV (Normal Dist.): '+result.ip_cv_1, 90, ypos+=20);
              	doc.setTextColor(0);
              	checkChange(doc, changes, "ip_cv_2");
      		    doc.text('Stock 2 Population CV (Normal Dist.): '+result.ip_cv_2, 90, ypos+=20);
              	doc.setTextColor(0);
      		    doc.text('Stock mean: see Table-1 below', 90, ypos+=20);

      	//Biological Parameter
      		    //Section font size
      		    doc.setFontSize(20);
      		    doc.text('Biological Parameters', 50, ypos+=40)
      		    doc.setFontSize(10);
      		    doc.text('Stock Weight-at-age & Fecundity: see Table-2 below', 90, ypos+=20);

        //Natural Mortality
      		    //Section font size
      		    doc.setFontSize(20);
      		    doc.text('Natural Mortality', 50, ypos+=40)
      		    doc.setFontSize(10);
              	checkChange(doc, changes, "nm_m");
      		    if(result.nm_m=='h'){
      		    	doc.text('High M', 90, ypos+=20);
      		    }else if(result.nm_m=='l'){
      		    	doc.text('Low M', 90, ypos+=20);
      		    }else{
      		    	doc.text('Current M', 90, ypos+=20);
      		    }
              	doc.setTextColor(0);
              	checkChange(doc,changes,"nm_cv_1");
      		    doc.text('CV for East Stock Population(Log-normal Dist.): '+result.nm_cv_1, 90, ypos+=20);
              	doc.setTextColor(0);
              	checkChange(doc,changes,"nm_cv_2");
      		    doc.text('CV for West Stock Population(Log-normal Dist.): '+result.nm_cv_1, 90, ypos+=20);
              	doc.setTextColor(0);
      		    doc.text('Mean M for Stock: see Table-3 below', 90, ypos+=20);

              //table1
      		    doc.addPage();
      		    doc.setFontSize(10);
      		    doc.text('Table-1:',90,80);
      		    var tableIP = $('#table-ibParam').clone();
				tableIP.css("font-size", "10px");
				tableIP[0].deleteTFoot();
				tableIP[0].removeAttribute("hidden");
      		    doc.fromHTML(tableIP[0].outerHTML,90,90);

              //table2
      		    doc.addPage();
      		    doc.setFontSize(10);
      		    doc.text('Table-2:',90,80);
      		    var tableBP = $('#table-bioParam').clone();
				tableBP.css("font-size", "10px");
				tableBP[0].deleteTFoot(0);
				tableBP[0].removeAttribute("hidden");
      		    doc.fromHTML(tableBP[0].outerHTML,90,90);

              //table3
      		    doc.addPage();
      		    doc.setFontSize(10);
      		    doc.text('Table-3:',90,80);
      		    var tableNM = $('#table-mortality').clone();
				tableNM.css("font-size", "10px");
				tableNM[0].deleteTFoot();
				tableNM[0].removeAttribute("hidden");
      		    doc.fromHTML(tableNM[0].outerHTML,90,90);

      	 //Recruitment
				doc.addPage();
				ypos = 80;
      		    doc.setFontSize(20);
      		    doc.text('Recruitment', 50, ypos)
      		    doc.setFontSize(10);
              	checkChange(doc,changes,"simple_spawning");
              	doc.text('Fraction before Spawning: '+result.simple_spawning + ' years', 90, ypos+=20);
              	doc.setTextColor(0);
              	checkChange(doc,changes,"cvForRecu");
      		    doc.text('CV for Recruitment(Log-normal Dist.): '+result.cvForRecu, 90, ypos+=20);
				doc.setTextColor(0);
				checkChange(doc,changes,"stock1_amount");
      		    doc.text(result.stock1_amount+'% to East Stock, '+result.stock2_amount+'% to West Stock ', 90, ypos+=20);
              	doc.setTextColor(0);
      		    if(result.recruitTypeStock1==1){
      		    	doc.text('From Historical: ', 90, ypos+=20);
      		    	if(result.fromHisStock1==1){
      		    		doc.text('Include Years before 1984: ', 100, ypos+=20);
      		    		doc.text('Historical R(1000s): ', 110, ypos+=20);
      				    if(result.historySt1_early==1){
      			    		doc.text('Mean: '+result.hst1_mean_early, 120, ypos+=20);
      				    }else if(result.historySt1_early==2){
                    		doc.setTextColor(255,0,0);
      			    		doc.text('Other Percentile ' +result.hst1_other_early+ "%: "+result.hst1_cal_early, 120, ypos+=20);
                    		doc.setTextColor(0);
      				    }
      			    }else{
      			    	doc.text('Exclude Years before 1984: ', 100, ypos+=20);
      		    		doc.text('Historical R(1000s): ', 110, ypos+=20);
      				    if(result.historySt1==1){
      			    		doc.text('Mean: '+result.hst1_mean, 120, ypos+=20);
      				    }else if(result.historySt1==2){
                    		doc.setTextColor(255,0,0);
      			    		doc.text('Other Percentile ' +result.hst1_other+ "%: "+result.hst1_cal, 120, ypos+=20);
                    		doc.setTextColor(0);
      				    }
      			    }
      		    }else{
      		    	doc.text('From Formula: ', 90, ypos+=20);
      		    	if(result.formulaStock1==1){
      		    		doc.text('Modified Beverton-Holt Model:', 100, ypos+=20);
      		    		if(result.fromFmlStock1==1){
      			    		doc.text('R0 Include Years Before 1984:', 110, ypos+=20);
                    		checkChange(doc,changes,"fml1MbhmR0_early");
      			    		doc.text('R0 :'+result.fml1MbhmR0_early + ' (1000s)', 120, ypos+=20);
                    		doc.setTextColor(0);
      				    }else {
      				    	doc.text('R0 Exclude Years Before 1984: ', 110, ypos+=20);
                    		checkChange(doc,changes,"fml1MbhmR0");
      				    	doc.text('R0 :'+result.fml1MbhmR0 + ' (1000s)', 120, ypos+=20);
                    		doc.setTextColor(0);
      			    	}
                  		checkChange(doc,changes,"fml1MbhmSSB0");
      			    	doc.text('SSB0 :'+result.fml1MbhmSSB0 + ' (1000 eggs)', 110, ypos+=20);
                 		doc.setTextColor(0);
                  		checkChange(doc,changes,"fml1MbhmSteep");
      			    	doc.text('Steepness(h) :'+result.fml1MbhmSteep, 110, ypos+=20);
                 		doc.setTextColor(0);
      			    }
      		    }

      		//Management Options I
      		    //Section font size
      		    doc.setFontSize(20);
      		    doc.text('Management Options I', 50, ypos+=50);
				doc.setFontSize(10);
				checkChange(doc, changes, "mg1_cv");
      		    doc.text('CV for Implementation Uncertainty: '+result.mg1_cv, 90, ypos+=20);
              	doc.setTextColor(0);
      		    doc.text('Biological Reference Points:', 90, ypos+=20);
      		    doc.text('SSB(MSY)'+": "+result.bio_catch_mt/1000+" (1000 eggs)", 100, ypos+=20);
		  	    doc.text('F(MSY)'+": "+result.bio_f_percent, 100, ypos+=20);
				var isSimple = $("#step1_id").data("simple");
				if(isSimple === "False"){
      		       doc.text('Fisheries Status: ', 90, ypos+=20);
				   doc.addImage(colorChartImgData, 'jpg', 100, ypos+=10,280, 180, undefined, 'none');
				   doc.text('Harvest Control Rule: ', 90, ypos+=190);
				}else{
					doc.text('Harvest Control Rule: ', 90, ypos+=20);
				}
              	checkChange(doc, changes, "harvest_level");
      		    if(result.hrt_harvest_rule=='CC'){
      	    		doc.text('Constant C: '+result.harvest_level, 100, ypos+=20);
      		    }else {
      		    	doc.text('Constant F: '+result.harvest_level, 100, ypos+=20);
      	    	}
              	doc.setTextColor(0);
      		    doc.addImage(ruleChartImgData, 'jpg', 100, ypos+=10,280, 180, undefined, 'none');

      	// 	//Management Options II
      		    //Section font size
      		 	doc.addPage();
				doc.setFontSize(20);
				ypos = 80;
      		    doc.text('Management Options II', 50, ypos)
      		    doc.setFontSize(10);

              //Allocation among Sectors
      		    doc.text('Allocation among Sectors:', 90, ypos+=20);
              	checkChange(doc, changes, "sec_recreational");
      		    doc.text('Recreational: '+result.sec_recreational+'%', 100, ypos+=20);
      		    doc.text('Commercial: '+result.sec_commercial+'%', 100, ypos+=20);
              	doc.setTextColor(0);

              //Allocation among Recreational Components
      		    doc.text('Allocation among Recreational Components:', 90, ypos+=20);
              	checkChange(doc, changes, "sec_hire");
      		    doc.text('Federal For-hire: '+result.sec_hire+'%', 100, ypos+=20);
      		    doc.text('Private Angling: '+result.sec_private+'%', 100, ypos+=20);
				doc.setTextColor(0);
				  
			  //Allocation among Private Angling Fleets
				doc.text('Allocation among Private Angling Fleets:', 90, ypos+=20);
				doc.text('Private Angling East: '+result.p_e+'%', 100, ypos+=20);
				doc.text('Private Angling West: '+result.p_w+'%', 100, ypos+=20);
				doc.setTextColor(0);

              //Allocation among Federal For-hire Fleets
      		    doc.text('Allocation among Federal For-hire Fleets:', 90, ypos+=20);
              	checkChange(doc, changes, "sec_headboat");
      		    doc.text('Federal For-hire East: '+result.sec_headboat+'%', 100, ypos+=20);
      		    doc.text('Federal For-hire West: '+result.sec_charterboat+'%', 100, ypos+=20);
              	doc.setTextColor(0);

              //Probability of Overfishing
      		    doc.text('Probability of Overfishing (OFL -> ABC):', 90, ypos+=20);
              	checkChange(doc, changes, "sec_pstar");
      		    doc.text('P*: '+result.sec_pstar+'%', 100, ypos+=20);
              	doc.setTextColor(0);

              //Acceptable Catch Target (ACT) Buffer
      		    doc.text('Acceptable Catch Target (ACT) Buffer:', 90, ypos+=20);
              	checkChange(doc, changes, "sec_act_com");
      		    doc.text('For the Commercial Sector: '+result.sec_act_com+'%', 100, ypos+=20);
              	doc.setTextColor(0);
				checkChange(doc, changes, "sec_act_hire");
      		    doc.text('For the Federal For-hire Component: '+result.sec_act_hire+'%', 100, ypos+=20);
              	doc.setTextColor(0);  
				checkChange(doc, changes, "sec_act_pri");
      		    doc.text('For the Private Angling Component: '+result.sec_act_pri+'%', 100, ypos+=20);
              	doc.setTextColor(0);
              	

      		//Management Options III
      		    //Section font size
      		    doc.setFontSize(20);
      		    doc.text('Management Options III', 50, ypos+=50)
      		    doc.setFontSize(10);
      		    doc.text('Regulations:', 90, ypos+=20);

              //Legal Size
      		    doc.text('Legal Size:', 100, ypos+=20);
             	checkChange(doc, changes, "mg3_commercial");
      		    doc.text('Minimum Legal Size for Commercial Fleets: '+result.mg3_commercial+' inch', 110, ypos+=20);
				doc.setTextColor(0);
				checkChange(doc, changes, "mg3_recreational");
      		    doc.text('Minimum Legal Size for Recreational Fleets: '+result.mg3_recreational+' inch', 110, ypos+=20);
              	doc.setTextColor(0);

              //Bag Limit for Recreational Fleets
      		    doc.text('Bag Limit for Recreational Fleets:', 100, ypos+=20);
              	checkChange(doc, changes, "mg3_forhire");
      		    doc.text('For Federal For-hire Fleets: '+result.mg3_forhire+' # of fish per bag', 110, ypos+=20);
				doc.setTextColor(0);
				checkChange(doc, changes, "mg3_private");
      		    doc.text('For Private Angling Fleets: '+result.mg3_private+' # of fish per bag', 110, ypos+=20);
              	doc.setTextColor(0);
      		    doc.text('(Hint: will scale the catch rate)', 100, ypos+=20);
			
			//Management Options IV
				doc.addPage()
				ypos = 80;
				doc.setFontSize(20);
			    doc.text('Management Options IV', 50, ypos)
			    doc.setFontSize(10);
      		    doc.text('Release Mortality:', 90, ypos+=20);
              	checkChange(doc, changes, "mg3_rec_east_open");
      		    doc.text('Recreational Stock1 Open: '+result.mg3_rec_east_open+'%', 100, ypos+=20);
				doc.setTextColor(0);
				checkChange(doc, changes, "mg3_rec_east_closed");
				doc.text('Recreational Stock1 Closed: '+result.mg3_rec_east_closed+'%', 320, ypos);
				doc.setTextColor(0);
				checkChange(doc, changes, "mg3_rec_west_open");
      		    doc.text('Recreational Stock2 Open: '+result.mg3_rec_west_open+'%', 100, ypos+=20);
				doc.setTextColor(0);
				checkChange(doc, changes, "mg3_rec_west_closed");
				doc.text('Recreational Stock2 Closed: '+result.mg3_rec_west_closed+'%', 320, ypos);
				doc.setTextColor(0);
				checkChange(doc, changes, "mg3_comhard_east_open");
      		    doc.text('Commercial Vertical Line Stock1 Open: '+result.mg3_comhard_east_open+'%', 100, ypos+=20);
				doc.setTextColor(0);
				checkChange(doc, changes, "com_stock1_closed");
				doc.text('Commercial Stock1 Closed: '+result.com_stock1_closed+'%', 320, ypos);
				doc.setTextColor(0);
				checkChange(doc, changes, "mg3_comhard_west_open");
      		    doc.text('Commercial Vertical Line Stock2 Open: '+result.mg3_comhard_west_open+'%',100,ypos+=20);
				doc.setTextColor(0);
				checkChange(doc, changes, "com_stock2_closed");
				doc.text('Commercial Stock2 Closed: '+result.com_stock2_closed+'%', 320, ypos);
				doc.setTextColor(0);
				checkChange(doc, changes, "mg3_comlong_east_open");
      		    doc.text('Commercial Long Line Stock1 Open: '+result.mg3_comlong_east_open+'%', 100, ypos+=20);
				doc.setTextColor(0);
				checkChange(doc, changes, "mg3_comlong_west_open");
      		    doc.text('Commercial Long Line Stock2 Open: '+result.mg3_comlong_west_open+'%', 100, ypos+=20);
              	doc.setTextColor(0);

      		// //Management Options V
      		    //Section font size
      		    doc.setFontSize(20);
      		    doc.text('Management Options V', 50, ypos+=50);
			 	doc.setFontSize(10);
				doc.text('Recreational Sector Options for ACT', 90, ypos+=20);
				doc.text('Catch Rate', 100, ypos+=20);
				checkChange(doc, changes,'mg3_forhire');
				var multip = result.mg3_forhire/2;
				doc.text('Federal For-hire Multiplier: ' + result.mg3_forhire + ' / 2 = ' + multip + ' fish per bag',110,ypos+=20);
				doc.setTextColor(0);
				checkChange(doc, changes,'base_fed_forhire');
				doc.text('Base Federal For-hire Catch Rate: ' + result.base_fed_forhire + ' lb/day', 110, ypos+=20);
				doc.setTextColor(0);
				checkChange(doc, changes,'est_fed_forhire');
				doc.text('Est. Federal For-hire Catch Rate: ' + result.est_fed_forhire + ' lb/day', 110, ypos+=20);
				doc.setTextColor(0);
				checkChange(doc, changes,'mg3_private');
				multip = result.mg3_private/2;
				doc.text('Private Angling Multiplier: ' + result.mg3_private + ' / 2 = ' + multip + ' fish per bag',110,ypos+=30);
				doc.setTextColor(0);
				checkChange(doc, changes,'base_AL_private');
				doc.text('Base AL Private Angling Catch Rate: ' + result.base_AL_private + ' lb/day', 110, ypos+=20);
				doc.setTextColor(0);
				checkChange(doc, changes,'est_AL_private');
				doc.text('Est. AL Private Angling Catch Rate: ' + result.est_AL_private + ' lb/day', 110, ypos+=20);
				doc.setTextColor(0);
				checkChange(doc, changes,'base_FL_private');
				doc.text('Base FL Private Angling Catch Rate: ' + result.base_FL_private + ' lb/day', 110, ypos+=30);
				doc.setTextColor(0);
				checkChange(doc, changes,'est_FL_private');
				doc.text('Est. FL Private Angling Catch Rate: ' + result.est_FL_private + ' lb/day', 110, ypos+=20);
				doc.setTextColor(0);
				checkChange(doc, changes,'base_LA_private');
				doc.text('Base LA Private Angling Catch Rate: ' + result.base_LA_private + ' lb/day', 110, ypos+=30);
				doc.setTextColor(0);
				checkChange(doc, changes,'est_LA_private');
				doc.text('Est. LA Private Angling Catch Rate: ' + result.est_LA_private + ' lb/day', 110, ypos+=20);
				doc.setTextColor(0);
				checkChange(doc, changes,'base_MS_private');
				doc.text('Base MS Private Angling Catch Rate: ' + result.base_MS_private + ' lb/day', 110, ypos+=30);
				doc.setTextColor(0);
				checkChange(doc, changes,'est_MS_private');
				doc.text('Est. MS Private Angling Catch Rate: ' + result.est_MS_private + ' lb/day', 110, ypos+=20);
				doc.setTextColor(0);
				checkChange(doc, changes,'base_MS_forhire');
				doc.text('Base MS For-hire Catch Rate: ' + result.base_MS_forhire + ' lb/day', 110, ypos+=20);
				doc.setTextColor(0);
				checkChange(doc, changes,'est_MS_forhire');
				doc.text('Est. MS For-hire Catch Rate: ' + result.est_MS_forhire + ' lb/day', 110, ypos+=20);
				doc.setTextColor(0);
				checkChange(doc, changes,'base_TX_private');
				doc.text('Base TX Private Angling Catch Rate in Federal Water: ' + result.base_TX_private + ' lb/day', 110, ypos+=30);
				doc.setTextColor(0);
				checkChange(doc, changes,'est_TX_private');
				doc.text('Est. TX Private Angling Catch Rate in Federal Water: ' + result.est_TX_private + ' lb/day', 110, ypos+=20);
				doc.setTextColor(0);
				checkChange(doc, changes,'base_TX_forhire');
				doc.text('Base TX Private Angling Catch Rate in State Water: ' + result.base_TX_forhire + ' lb/day', 110, ypos+=20);
				doc.setTextColor(0);
				checkChange(doc, changes,'est_TX_forhire');
				doc.text('Est. TX Private Angling Catch Rate in State Water: ' + result.est_TX_forhire + ' lb/day', 110, ypos+=20);
				doc.setTextColor(0);

				doc.addPage();
				ypos = 80;
				doc.text('Season Length', 100, ypos);
				doc.text('Federal For-hire Component', 110, ypos+=20);
				checkChange(doc, changes,'season_fed_forhire');
				if(result.season_fed_forhire==1){
					doc.text('Season Length is Determined by ACT', 120, ypos+=20);
				}else{
					doc.text('ACT is Determined by Inputs - No Buffers', 120, ypos+=20);
					doc.setTextColor(0);
					checkChange(doc, changes,'fed_forhire_length');
					doc.text('Federal For-hire Season Length: '+result.fed_forhire_length + ' days', 130, ypos+=20);
					doc.setTextColor(0);
				}
				doc.text('State For-hire Component and Private Angling in State Water', 110, ypos+=30);
				checkChange(doc, changes,'MS_forhire_length');
				doc.text('MS For-hire Season Length: ' + result.MS_forhire_length + ' days', 120, ypos+=20);
				doc.setTextColor(0);
				checkChange(doc, changes,'TX_forhire_length');
				doc.text('TX Private Angling Season Length in State Water: ' + result.TX_forhire_length + ' days', 120, ypos+=20);
				doc.setTextColor(0);
				doc.text('Private Angling Component', 110, ypos+=30);
				checkChange(doc, changes,'season_private');
				if(result.season_private == 1){
					doc.text('Season Lengths are Determined by ACT',120,ypos+=20);
					doc.setTextColor(0);
				}else{
					doc.text('ACT is Determined by Inputs - No Buffers',120,ypos+=20);
					doc.setTextColor(0);
					checkChange(doc, changes,'AL_private_length');
					doc.text('AL Private Angling Season Length: ' +result.AL_private_length + ' days' ,130,ypos+=20);
					doc.setTextColor(0);
					checkChange(doc, changes,'FL_private_length');
					doc.text('FL Private Angling Season Length: ' +result.FL_private_length + ' days' ,130,ypos+=20);
					doc.setTextColor(0);
					checkChange(doc, changes,'LA_private_length');
					doc.text('LS Private Angling Season Length: ' +result.LA_private_length + ' days' ,130,ypos+=20);
					doc.setTextColor(0);
					checkChange(doc, changes,'MS_private_length');
					doc.text('MS Private Angling Season Length: ' +result.MS_private_length + ' days' ,130,ypos+=20);
					doc.setTextColor(0);
					checkChange(doc, changes,'TX_private_length');
					doc.text('TX Private Angling Season Length in Federal Water: ' +result.TX_private_length + ' days' ,130,ypos+=20);
					doc.setTextColor(0);
				}

			//Management VI
				doc.setFontSize(20);
			    doc.text('Management Options VI', 50, ypos+=50);
				doc.setFontSize(10);
				doc.text('Penalty & Carryover',90,ypos+=20);  
				doc.text('Penalty - If the actual landing exceeds ACT',100,ypos+=20); 
				checkChange(doc, changes,'penalty_switch');
				if(result.penalty_switch == 0){
					doc.text('No Penalty', 110, ypos+=20);
				}else{
					doc.text("The exceeded catch will be deduced from the next year, but make sure the actual landing", 110, ypos+=20);
					doc.text("doesn't exceed 95% of the OFL.", 110, ypos+=15);
				}
				doc.setTextColor(0);
				doc.text("Carryover - If ACT isn't fully harvested",100,ypos+=20); 
				checkChange(doc, changes,'carryover_switch');
				if(result.carryover_switch == 0){
					doc.text('No Carryover', 110, ypos+=20);
				}else if(result.carryover_switch == 1){
					doc.text("Carryover to the same state next year, but make sure the actual landing doesn't exceed 95%", 110, ypos+=20);
					doc.text("of the OFL.", 110, ypos+=15);
				}else{
					doc.text("Carryover to the same state next year, but make sure the actual landing doesnt exceed 50%", 110, ypos+=20);
					doc.text("of the difference between ABC and OFL.", 110, ypos+=15);
				}
				doc.setTextColor(0);
			//Management VII
				doc.setFontSize(20);
			    doc.text('Management Options VII', 50, ypos+=50);
				doc.setFontSize(10);
				doc.text('Private Angling Quota Among States',90,ypos+=20); 
				checkChange(doc, changes,'alabama');
				doc.text('Alabama: ' + result.alabama + '%',100, ypos+=20);
				doc.setTextColor(0);
				checkChange(doc, changes,'florida');
				doc.text('Florida: ' + result.florida + '%',100, ypos+=20);
				doc.setTextColor(0);
				checkChange(doc, changes,'louisiana');
				doc.text('Louisiana: ' + result.louisiana + '%',100, ypos+=20);
				doc.setTextColor(0);
				checkChange(doc, changes,'mississippi');
				doc.text('Mississippi: ' + result.mississippi + '%',100, ypos+=20);
				doc.setTextColor(0);
				checkChange(doc, changes,'texas');
				doc.text('Texas: ' + result.texas + '%',100, ypos+=20);
				doc.setTextColor(0);

      		    doc.save( 'MSE_single_' + info.created_by + "_" + info.scenario+'.pdf');

      	    }).always(function(result){
      	    	$("#mask").removeClass('lmask');
      	    });
    });


    	/* Act on the event */

    });



})
