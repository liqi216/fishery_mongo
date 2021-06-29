$(function() {
	var mseNames = $("#cmpDiv").data("msenames");
    var mseSingleLists = $("#cmpDiv").data("msesinglelists");
    var mseComp = $("#cmpDiv").data("msecomp");
	var scenarios = $("#cmpDiv").data("scenarios");
	var differences = $("#cmpDiv").data("differences");

	console.log(differences);
	
	drawChart(mseNames,mseSingleLists,mseComp,scenarios);

	//Create pdf for compare results
	$("#btnReport").on('click', function(event) {
		event.preventDefault();
		$("#mask").addClass('lmask');
		makeReport();
	});

	function getY(doc,ypos,addedHeight){
		if(ypos + addedHeight > 800){
			doc.addPage();
			return 80;
		}else{
			return ypos + addedHeight;
		}
	}

	async function getDoc(){
		
		var doc = new jsPDF('p', 'pt', 'a4', false);
		var catchChartImg = catchChart.getDataURL();
		var SSBGulfChartImg = SSBGulfChart.getDataURL();
		var catch20ChartImg = catch20Chart.getDataURL();
		var annualCatch20ChartImg = annualCatch20Chart.getDataURL();
		var terminalChartImg = terminalChart.getDataURL();
		var lowestSSBsImg = lowestChart.getDataURL();
		var percentGreenChartImg = percentGreenChart.getDataURL();
		var radarChart_1Img = radarChart_1.getDataURL();
		var totalDsicardsChartImg = totalDiscardsChart.getDataURL();
		var varDiscardsChartImg = varDiscardsChart.getDataURL();

		var commCatchChartImg = commCatchChart.getDataURL();
		var fedCatchChartImg = fedCatchChart.getDataURL();
		var privateCatchChartImg = privateCatchChart.getDataURL();
		var SSBGulfFirstChartImg = SSBGulfFirstChart.getDataURL();
		var SSBGulfLast_ChartImg = SSBGulfLastChart.getDataURL();
		var barRotationChart_1Img = barRotationChart_1.getDataURL();
		var stateCatchFirst_ChartImg = stateCatchFirstChart.getDataURL();
		var stateCatchLast_ChartImg = stateCatchLastChart.getDataURL();
		var stateSeasFirst_ChartImg = stateSeasFirstChart.getDataURL();
		var stateSeasLast_ChartImg = stateSeasLastChart.getDataURL();
		var catchFirstChartImg = catchFirstChart.getDataURL();
		var catchLastChartImg = catchLastChart.getDataURL();
		var commDiscardsChartImg = commDiscardsChart.getDataURL();
		var recrDiscardsChartImg = recrDiscardsChart.getDataURL();

		var commRadarChartImg = commRadarChart.getDataURL();
		var recrRadarChartImg = recrRadarChart.getDataURL();

		doc.setFontSize(20);
		doc.text('Strategy Compare Results', 160, 80);
		doc.setFontSize(18);
		doc.text('Essential Figures', 50, 150);
		doc.setFontSize(12);
		doc.text('Section 1: Basic Comparison', 50, 170);
		doc.addImage( catchChartImg, 'jpg', 50, 210,500, 450, undefined, 'none');

		doc.addPage();
		doc.addImage(SSBGulfChartImg, 'jpg', 50, 50, 490, 400, undefined, 'none');
		doc.addImage(catch20ChartImg, 'jpg', 120, 450 ,350, 350, undefined, 'none');

		doc.addPage();
		doc.addImage(annualCatch20ChartImg, 'jpg', 120, 50, 350, 350, undefined, 'none');
		doc.addImage(terminalChartImg, 'jpg', 120, 450 ,350, 350, undefined, 'none');

		doc.addPage();
		doc.addImage(lowestSSBsImg, 'jpg', 120, 50, 350, 350, undefined, 'none');
		doc.addImage(percentGreenChartImg, 'jpg', 120, 450 ,350, 350, undefined, 'none');

		doc.addPage();
		doc.addImage(radarChart_1Img, 'jpg', 50, 50, 500, 350, undefined, 'none');
		doc.addImage(totalDsicardsChartImg, 'jpg', 120, 450, 350, 350, undefined, 'none');

		doc.addPage();
		doc.addImage(varDiscardsChartImg, 'jpg', 120, 50, 350, 350, undefined, 'none');
		doc.setFontSize(18);
		doc.text('Other Detailed Figures', 50, 440);
		doc.setFontSize(12);
		doc.text('Section 2: Sector Comparison', 50, 460);
		doc.addImage( commCatchChartImg, 'jpg', 50, 480,490, 400, undefined, 'none');

		doc.addPage();
		doc.addImage(fedCatchChartImg, 'jpg', 50, 50, 490, 400, undefined, 'none');
		doc.addImage(privateCatchChartImg, 'jpg', 50, 450, 490, 400, undefined, 'none');

		doc.addPage();
		doc.addImage(SSBGulfFirstChartImg, 'jpg', 120, 50, 350, 350, undefined, 'none');
		doc.addImage(SSBGulfLast_ChartImg, 'jpg', 120, 450 ,350, 350, undefined, 'none');

		doc.addPage();
		doc.addImage(barRotationChart_1Img, 'jpg', 50, 50, 500, 370, undefined, 'none');
		doc.addImage(stateCatchFirst_ChartImg, 'jpg', 50, 450 ,500, 370, undefined, 'none');

		doc.addPage();
		doc.addImage(stateCatchLast_ChartImg, 'jpg', 50, 50, 500, 370, undefined, 'none');
		doc.addImage(stateSeasFirst_ChartImg, 'jpg', 50, 450 ,500, 370, undefined, 'none');

		doc.addPage();
		doc.addImage(stateSeasLast_ChartImg, 'jpg', 50, 50, 500, 370, undefined, 'none');
		doc.addImage(catchFirstChartImg, 'jpg', 120, 450 ,350, 350, undefined, 'none');

		doc.addPage();
		doc.addImage(catchLastChartImg, 'jpg', 120, 50, 350, 350, undefined, 'none');
		doc.addImage(commDiscardsChartImg, 'jpg', 50, 450 ,490, 400, undefined, 'none');

		doc.addPage();
		doc.addImage(recrDiscardsChartImg, 'jpg', 50, 50, 490, 400, undefined, 'none');
		doc.setFontSize(12);
		doc.text('Section 2: Within Sector Comparison', 50, 440);
		doc.addImage( commRadarChartImg, 'jpg', 50, 460,500, 350, undefined, 'none');

		doc.addPage();
		doc.addImage(recrRadarChartImg, 'jpg', 50, 50, 500, 350, undefined, 'none');

		//Show inputs for each scenario
		doc.addPage();

		//Stock Assessment Input
		var ypos = 70;  
		doc.setFontSize(23);
		doc.text('Inputs', 250, ypos);
		doc.setFontSize(12);
		doc.setFontType("bold");
		doc.text('Stock Assesment Model Input', 50, ypos=getY(doc,ypos,20));
		doc.setFontSize(10);
		doc.setFontType("normal");
		doc.text('Model Type: Stock Synthesis 3', 80 , ypos=getY(doc,ypos,20));
		doc.text('Input File:', 80 , ypos=getY(doc,ypos,20));
		for(let i = 0 ; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			if(scenarios[i].stock1_input_file_type==1){
				doc.text(name+ 'Official Stock Assessment Model', 90, ypos=getY(doc,ypos,20));
			}else{
				doc.text(name+ 'Self-defined Model', 90, ypos=getY(doc,ypos,20));
		  	}
		}

		//General Inputs
		doc.setFontSize(12);
		doc.setFontType("bold");
		doc.text('General Inputs', 50, ypos=getY(doc,ypos,40));
		doc.setFontSize(10);
		doc.setFontType("normal");
		doc.text('Time Step: 1 year', 80, ypos=getY(doc,ypos,20));
		doc.text('Start Projection: 2016-01-01', 80, ypos=getY(doc,ypos,20));
		doc.text('Stock Assessment Frequency: ', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].short_term_mgt+' Years', 90, ypos=getY(doc,ypos,20));
		}
		doc.text('Forward Projection: ', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].long_term_mgt+' Years', 90, ypos=getY(doc,ypos,20));
		}
		doc.text('Last Age in the Plus Group: '+scenarios[0].last_age, 80, ypos+=20);
		doc.text('Uncertainty: ', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].no_of_interations+' iterations', 90, ypos=getY(doc,ypos,20));
		}
		doc.text('Observational Error for Initial Distribution: ', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].sample_size+' effective sample size', 90, ypos=getY(doc,ypos,20));
		}
		doc.text('Observational Error for Recruitment Ratio between East and West Stocks: ', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].observ_err_EW_stock+' effective sample size', 90, ypos=getY(doc,ypos,20));
		}
		doc.text('Random Seed Setting: ', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			if(scenarios[i].rnd_seed_setting==1){
					doc.text(name+"Use Seconds of the System's Clock", 90, ypos=getY(doc,ypos,20));
				}else if (scenarios[i].rnd_seed_setting==2){
      		    	doc.text(name+'Default Seed CSV', 90, ypos=getY(doc,ypos,20));
      		    }else{
      		    	doc.text(name+'Self-defined CSV', 90, ypos=getY(doc,ypos,20));
      		    }
		}

		//Mixing Pattern
		doc.setFontSize(12);
		doc.setFontType("bold");
		doc.text('Mixing Pattern', 50, ypos=getY(doc,ypos,40));
		doc.setFontSize(10);
		doc.setFontType("normal");
		doc.text('No mixing', 80, ypos=getY(doc,ypos,20));
		doc.text('Constant', 80, ypos=getY(doc,ypos,20));
		doc.text('Stock 1 to 1: 50%', 90, ypos=getY(doc,ypos,20));
		doc.text('Stock 2 to 1: 50%', 210, ypos);
		doc.text('Stock 1 to 2: 50%', 90, ypos=getY(doc,ypos,20));
		doc.text('Stock 2 to 2: 50%', 210, ypos);

		//Initial Population
		doc.setFontSize(12);
		doc.setFontType("bold");
		doc.text('Initial Population', 50, ypos=getY(doc,ypos,40));
		doc.setFontSize(10);
		doc.setFontType("normal");
		doc.text('Stock 1 Population CV (Normal Dist.): ', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+scenarios[i].ip_cv_1, 90, ypos=getY(doc,ypos,20));
		}
		doc.text('Stock 2 Population CV (Normal Dist.): ', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+scenarios[i].ip_cv_2, 90, ypos=getY(doc,ypos,20));
		}

		//show tables if values differ 
		if(differences.iniPopu != null){
			for(let i = 0; i < mseNames.length; i++){
				doc.addPage();
				ypos = 80;
				var name = mseNames[i] + " - ";
				doc.text(name+"Initial Population" , 50, ypos);
				var cols = [ "Age", "Stock1 Mean(1000s)", "Stock2 Mean(1000s)"];
				var rows = [];
				$.each(scenarios[i].iniPopu, function(index,el){
					var curRow = [];
					curRow.push(el.age_1);
					curRow.push(el.stock_1_mean);
					curRow.push(el.stock_2_mean);
					rows.push(curRow);
				});
				
				doc.autoTable(cols, rows , {
					columnStyles: {
						process: {
							cellWidth : 50
						}
					},
					startY: ypos+=20,
				});
			}
		}
		
		//Biological Parameters
		//show tables if values differ 
		if(differences.bioParam != null){
			for(let i = 0; i < mseNames.length; i++){
				doc.addPage();
				ypos = 80;
				var name = mseNames[i] + " - ";
				if(i == 0){
					//add heading
					doc.setFontSize(12);
					doc.setFontType('bold');
					doc.text('Biological Parameters',50,ypos);
					doc.setFontSize(10);
					doc.setFontType('normal');
					ypos+=20;
				}
				doc.text(name+"Biological Parameters" , 50, ypos);
				var cols = [ "Age", "Stock 1 Weight-at-age (kg)", "Stock 1 Fecundity(# of eggs)","Stock 2 Weight-at-age (kg)","Stock 2 Fecundity(# of eggs)"];
				var rows = [];
				$.each(scenarios[i].bioParam, function(index,el){
					var curRow = [];
					curRow.push(el.age_1);
					curRow.push(el.weight_at_age_1);
					curRow.push(el.fec_at_age_1);
					curRow.push(el.weight_at_age_2);
					curRow.push(el.fec_at_age_2);
					rows.push(curRow);
				});
				
				doc.autoTable(cols, rows , {
					columnStyles: {
						process: {
							cellWidth : 50
						}
					},
					startY: ypos+=20,
				});
			}
		}

		if(differences.iniPopu || differences.bioParam){
			doc.addPage();
			ypos = 40;
		}
		
		//Natural Mortality
		doc.setFontSize(12);
		doc.setFontType("bold");
		doc.text('Natural Mortality', 50, ypos=getY(doc,ypos,40));
		doc.setFontSize(10);
		doc.setFontType("normal");
		doc.text('M:', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			if(scenarios[i].nm_m=='h'){
				doc.text(name+'High', 90, ypos=getY(doc,ypos,20));
			}else if(scenarios[i].nm_m=='l'){
				doc.text(name+'Low', 90, ypos=getY(doc,ypos,20));
			}else{
				doc.text(name+'Current', 90, ypos=getY(doc,ypos,20));
			}
		}

		//show tables if values differ 
		if(differences.mortality != null){
			for(let i = 0; i < mseNames.length; i++){
				doc.addPage();
				ypos = 80;
				var name = mseNames[i] + " - ";
				doc.text(name+"Natural Mortality" , 50, ypos);
				var cols = [ "Age", "Mean M for Stock 1 (year^-1)", "Mean M for Stock 2 (year^-1)"];
				var rows = [];
				$.each(scenarios[i].mortality, function(index,el){
					var curRow = [];
					curRow.push(el.age_1);
					curRow.push(el.mean_1);
					curRow.push(el.mean_2);
					rows.push(curRow);
				});
				
				doc.autoTable(cols, rows , {
					columnStyles: {
						process: {
							cellWidth : 50
						}
					},
					startY: ypos+=20,
				});
			}
		}

		if(differences.mortality){
			doc.addPage();
			ypos = 40;
		}

		//Recruitment
		doc.setFontSize(12);
		doc.setFontType("bold");
		doc.text('Recruitment', 50, ypos=getY(doc,ypos,40));
		doc.setFontSize(10);
		doc.setFontType("normal");
		doc.text('Fraction Before Spawnging:', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].simple_spawning+' years', 90, ypos=getY(doc,ypos,20));
		}
		doc.text('CV for Recruitment(Log-normal Dist.):', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].cvForRecu, 90, ypos=getY(doc,ypos,20));
		}
		doc.text('East & West Stock:', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].stock1_amount+"% to East Stock, ", 90, ypos=getY(doc,ypos,20));
			doc.text(scenarios[i].stock2_amount+"% to West Stock, ", 220, ypos);
		}
		doc.text('Recruitment:', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			if(scenarios[i].recruitTypeStock1 == 1){
				if(scenarios[i].fromHisStock1 == 1){
					doc.text(name+ "From Historical, Include Years Before 1984", 90, ypos=getY(doc,ypos,20));
					if(scenarios[i].historySt1_early == 1){
						doc.text("Mean: " + scenarios[i].hst1_mean_early, 110, ypos=getY(doc,ypos,20));
					}else{
						doc.text(scenarios[i].hst1_other_early + "%: "+ scenarios[i].hst1_cal_early, 110, ypos=getY(doc,ypos,20));
					}
				}else{
					doc.text(name+ "From Historical, Exclude Years Before 1984", 90, ypos=getY(doc,ypos,20));
					if(scenarios[i].historySt1 == 1){
						doc.text("Mean: " + scenarios[i].hst1_mean, 110, ypos=getY(doc,ypos,20));
					}else{
						doc.text(scenarios[i].hst1_other + "%: "+ scenarios[i].hst1_cal, 110, ypos=getY(doc,ypos,20));
					}
				}
				
			}else{
				if(scenarios[i].fromFmlStock1 == 1){
					doc.text(name+ "From Formula, R0 Include Years Before 1984", 90, ypos=getY(doc,ypos,20));
					doc.text("R0: " + scenarios[i].fml1MbhmR0_early + " (1000s)", 110, ypos=getY(doc,ypos,20));
				}else{
					doc.text(name+ "From Formula, R0 Exclude Years Before 1984", 90, ypos=getY(doc,ypos,20));
					doc.text("R0: " + scenarios[i].fml1MbhmR0 + " (1000s)", 110, ypos=getY(doc,ypos,20));
				}
				doc.text("SSB0: " + scenarios[i].fml1MbhmSSB0 + " (1000 eggs)", 110, ypos=getY(doc,ypos,20));
				doc.text("Steepness(h): " + scenarios[i].fml1MbhmSteep, 110, ypos=getY(doc,ypos,20));
			}
		}

		//Management Options I
		doc.setFontSize(12);
		doc.setFontType("bold");
		doc.text('Management Options I', 50, ypos=getY(doc,ypos,40));
		doc.setFontSize(10);
		doc.setFontType("normal");
		doc.text('SSB(MSY): ' + scenarios[0].bio_catch_mt/1000 + " (1000 eggs)", 80, ypos=getY(doc,ypos,20));
		doc.text('F(MSY): ' + scenarios[0].bio_f_percent, 80, ypos=getY(doc,ypos,20));
		doc.text('Harvest Control Rule: ', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ "Constant F: "+ scenarios[i].harvest_level, 90, ypos=getY(doc,ypos,20));
		}

		//Management Options II
		doc.setFontSize(12);
		doc.setFontType("bold");
		doc.text('Management Options II', 50, ypos=getY(doc,ypos,40));
		doc.setFontSize(10);
		doc.setFontType("normal");
		doc.text('Recreational:', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].sec_recreational + '%', 90, ypos=getY(doc,ypos,20));
		}
		doc.text('Commercial:', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].sec_commercial+ '%', 90, ypos=getY(doc,ypos,20));
		}
		doc.text('Federal For-hire:', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].sec_hire+ '%', 90, ypos=getY(doc,ypos,20));
		}
		doc.text('Private Angling:', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].sec_private+ '%', 90, ypos=getY(doc,ypos,20));
		}
		doc.text('Allocation among Private Angling Fleets(Only used for demonstrating results)', 80, ypos=getY(doc,ypos,20));
		doc.text('Private Angling East: ' + scenarios[0].p_e+ '%', 90, ypos=getY(doc,ypos,20));
		doc.text('Private Angling West: ' + scenarios[0].p_w+ '%', 90, ypos=getY(doc,ypos,20));
		doc.text('Allocation among Federal For-hire Fleets(Only used for demonstrating results)', 80, ypos=getY(doc,ypos,20));
		doc.text('Federal For-hire East: ' + scenarios[0].sec_headboat+ '%', 90, ypos=getY(doc,ypos,20));
		doc.text('Federal For-hire West: ' + scenarios[0].sec_charterboat+ '%', 90, ypos=getY(doc,ypos,20));
		doc.text('Probability of Overfishing (OFL -> ABC):',80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].sec_pstar+ '%', 90, ypos=getY(doc,ypos,20));
		}
		doc.text('Acceptable Catch Target For the Commercial Sector:',80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].sec_act_com+ '%', 90, ypos=getY(doc,ypos,20));
		}
		doc.text('Acceptable Catch Target For the Federal For-hire Component:',80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].sec_act_hire+ '%', 90, ypos=getY(doc,ypos,20));
		}
		doc.text('Acceptable Catch Target For the Private Angling Component:',80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].sec_act_pri+ '%', 90, ypos=getY(doc,ypos,20));
		}

		//Management Options III
		doc.setFontSize(12);
		doc.setFontType("bold");
		doc.text('Management Options III', 50, ypos=getY(doc,ypos,40));
		doc.setFontSize(10);
		doc.setFontType("normal");
		doc.text('Minimum Legal Size for Commercial Fleets: ', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].mg3_commercial + " inch", 90, ypos=getY(doc,ypos,20));
		}
		doc.text('Minimum Legal Size for Recreational Fleets: ', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].mg3_recreational + " inch", 90, ypos=getY(doc,ypos,20));
		}
		doc.text('Bag Limit For Federal For-hire Fleets: ', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].mg3_recreational + "  # of fish per bag", 90, ypos=getY(doc,ypos,20));
		}
		doc.text('Bag Limit For Private Angling Fleets: ', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].mg3_private + "  # of fish per bag", 90, ypos=getY(doc,ypos,20));
		}

		//Management Options IV
		doc.setFontSize(12);
		doc.setFontType("bold");
		doc.text('Management Options IV', 50, ypos=getY(doc,ypos,40));
		doc.setFontSize(10);
		doc.setFontType("normal");
		doc.text('Recreational Stock1 Open: ', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].mg3_rec_east_open + "%", 90, ypos=getY(doc,ypos,20));
		}
		doc.text('Recreational Stock1 Closed: ', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].mg3_rec_east_closed + "%", 90, ypos=getY(doc,ypos,20));
		}
		doc.text('Recreational Stock2 Open: ', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].mg3_rec_west_open + "%", 90, ypos=getY(doc,ypos,20));
		}
		doc.text('Recreational Stock2 Closed: ', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].mg3_rec_west_closed + "%", 90, ypos=getY(doc,ypos,20));
		}
		doc.text('Commercial Vertical Line Stock1 Open: ', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].mg3_comhard_east_open + "%", 90, ypos=getY(doc,ypos,20));
		}
		doc.text('Commercial Vertical Line Stock2 Open: ', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].mg3_comhard_west_open + "%", 90, ypos=getY(doc,ypos,20));
		}
		doc.text('Commercial Long Line Stock1 Open: ', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].mg3_comlong_east_open + "%", 90, ypos=getY(doc,ypos,20));
		}
		doc.text('Commercial Long Line Stock2 Open: ', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].mg3_comlong_west_open + "%", 90, ypos=getY(doc,ypos,20));
		}
		doc.text('Commercial Stock1 Closed: ', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].com_stock1_closed + "%", 90, ypos=getY(doc,ypos,20));
		}
		doc.text('Commercial Stock2 Closed: ', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].com_stock2_closed + "%", 90, ypos=getY(doc,ypos,20));
		}

		//Management Options V
		doc.setFontSize(12);
		doc.setFontType("bold");
		doc.text('Management Options V', 50, ypos=getY(doc,ypos,40));
		doc.setFontSize(10);
		doc.setFontType("normal");
		doc.text('Catch Rate', 80, ypos=getY(doc,ypos,20));
		
		doc.text('Federal For-hire Multiplier: ', 90, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			var multip = scenarios[i].mg3_forhire/2;
			doc.text(name+ scenarios[i].mg3_forhire + ' / 2 = ' + multip + ' fish per bag',100,ypos=getY(doc,ypos,20));
		}
		doc.text('Base Federal For-hire Catch Rate: ', 90, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].base_fed_forhire + ' lb/day',100,ypos=getY(doc,ypos,20));
		}
		doc.text('Est. Federal For-hire Catch Rate', 90, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].est_fed_forhire + ' lb/day',100,ypos=getY(doc,ypos,20));
		}
		doc.text('Private Angling Multiplier: ', 90, ypos=getY(doc,ypos,40));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			var multip = scenarios[i].mg3_private/2;
			doc.text(name+ scenarios[i].mg3_private + ' / 2 = ' + multip + ' fish per bag',100,ypos=getY(doc,ypos,20));
		}
		doc.text('Base AL Private Angling Catch Rate:', 90, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].base_AL_private + ' lb/day',100,ypos=getY(doc,ypos,20));
		}
		doc.text('Est. AL Private Angling Catch Rate:', 90, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].est_AL_private + ' lb/day',100,ypos=getY(doc,ypos,20));
		}
		doc.text('Base FL Private Angling Catch Rate:', 90, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].base_FL_private + ' lb/day',100,ypos=getY(doc,ypos,20));
		}
		doc.text('Est. FL Private Angling Catch Rate:', 90, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].est_FL_private + ' lb/day',100,ypos=getY(doc,ypos,20));
		}
		doc.text('Base LA Private Angling Catch Rate:', 90, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].base_LA_private + ' lb/day',100,ypos=getY(doc,ypos,20));
		}
		doc.text('Est. LA Private Angling Catch Rate:', 90, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].est_LA_private + ' lb/day',100,ypos=getY(doc,ypos,20));
		}
		doc.text('Base MS Private Angling Catch Rate:', 90, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].base_MS_private + ' lb/day',100,ypos=getY(doc,ypos,20));
		}
		doc.text('Est. MS Private Angling Catch Rate:', 90, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].est_MS_private + ' lb/day',100,ypos=getY(doc,ypos,20));
		}
		doc.text('Base MS For-hire Catch Rate: ', 90, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].base_MS_forhire + ' lb/day',100,ypos=getY(doc,ypos,20));
		}
		doc.text('Est. MS For-hire Catch Rate:', 90, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].est_MS_forhire + ' lb/day',100,ypos=getY(doc,ypos,20));
		}
		doc.text('Base TX Private Angling Catch Rate:', 90, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].base_TX_private + ' lb/day',100,ypos=getY(doc,ypos,20));
		}
		doc.text('Est. TX Private Angling Catch Rate:', 90, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].est_TX_private + ' lb/day',100,ypos=getY(doc,ypos,20));
		}
		doc.text('Base TX For-hire Catch Rate: ', 90, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].base_TX_forhire + ' lb/day',100,ypos=getY(doc,ypos,20));
		}
		doc.text('Est. TX For-hire Catch Rate:', 90, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].est_TX_forhire + ' lb/day',100,ypos=getY(doc,ypos,20));
		}

		doc.text('Season Length', 80, ypos=getY(doc,ypos,40));
		doc.text('Federal For-hire Season Length:', 90, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			if(scenarios[i].season_fed_forhire == 1){
				doc.text(name+'Season Length is Determined by ACT',100,ypos=getY(doc,ypos,20));
			}else{
				doc.text(name+ scenarios[i].fed_forhire_length + ' days',100,ypos=getY(doc,ypos,20));
			}	
		}
		doc.text('MS For-hire Season Length:', 90, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].MS_forhire_length + ' days',100,ypos=getY(doc,ypos,20));
		}
		doc.text('TX For-hire Season Length:', 90, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name+ scenarios[i].TX_forhire_length + ' days',100,ypos=getY(doc,ypos,20));
		}
		doc.text('Private Angling Component:', 90, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			if(scenarios[i].season_private == 1){
				doc.text(name+'Season Lengths are Determined by ACT',100,ypos=getY(doc,ypos,20));
			}else{
				doc.text(name+'ACT is Determined by Inputs ',100,ypos=getY(doc,ypos,20));
				doc.text('AL Private Angling Season Length: '+scenarios[i].AL_private_length + ' days',110,ypos=getY(doc,ypos,20));
				doc.text('FL Private Angling Season Length: '+scenarios[i].FL_private_length + ' days',110,ypos=getY(doc,ypos,20));
				doc.text('LA Private Angling Season Length: '+scenarios[i].LA_private_length + ' days',110,ypos=getY(doc,ypos,20));
				doc.text('MS Private Angling Season Length: '+scenarios[i].MS_private_length + ' days',110,ypos=getY(doc,ypos,20));
				doc.text('TX Private Angling Season Length: '+scenarios[i].TX_private_length + ' days',110,ypos=getY(doc,ypos,20));
			}
			
		}

		//Management Options VI
		doc.setFontSize(12);
		doc.setFontType("bold");
		doc.text('Management Options VI', 50, ypos=getY(doc,ypos,40));
		doc.setFontSize(10);
		doc.setFontType("normal");
		doc.text('Penalty', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			if(scenarios[i].penalty_switch == 0){
				doc.text(name+ 'No Penalty',90,ypos=getY(doc,ypos,20));
			}else{
				doc.text(name+ 'The exceeded catch will be deduced from the next year, ',90,ypos=getY(doc,ypos,20));
				doc.text("but make sure the actual landing doesn't exceed 95% of the OFL.",110,ypos=getY(doc,ypos,15));
			}
			
		}
		doc.text('Carryover', 80, ypos=getY(doc,ypos,20));
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			if(scenarios[i].carryover_switch == 0){
				doc.text(name+ 'No Carryover',90,ypos=getY(doc,ypos,20));
			}else if(scenarios[i].carryover_switch == 1){
				doc.text(name+ "Carryover to the same state next year, but make sure the actual ",90,ypos=getY(doc,ypos,20));
				doc.text( "landing doesn't exceed 95% of the OFL.",110,ypos=getY(doc,ypos,15));
			}else{
				doc.text(name+ "Carryover to the same state next year, but make sure the actual ",90,ypos=getY(doc,ypos,20));
				doc.text("landing doesnt exceed 50% of the difference between ABC and OFL.",110,ypos=getY(doc,ypos,15));
			}
			
		}

		//Management Options VII
		doc.setFontSize(12);
		doc.setFontType("bold");
		doc.text('Management Options VII', 50, ypos=getY(doc,ypos,40));
		doc.setFontSize(10);
		doc.setFontType("normal");
		doc.text(name+'Private Angling Quota among States: ', 80, ypos=getY(doc,ypos,20));	
		for(let i = 0; i < mseNames.length; i++){
			var name = mseNames[i] + ": ";
			doc.text(name, 90, ypos=getY(doc,ypos,20));	
			doc.text('AL: ' + scenarios[i].alabama + '%', 100, ypos=getY(doc,ypos,20));
			doc.text('FL: ' + scenarios[i].florida + '%', 100, ypos=getY(doc,ypos,20));	
			doc.text('LA: ' + scenarios[i].louisiana + '%', 100, ypos=getY(doc,ypos,20));	
			doc.text('MS: ' + scenarios[i].mississippi + '%', 100, ypos=getY(doc,ypos,20));	
			doc.text('TX: ' + scenarios[i].texas + '%', 100, ypos=getY(doc,ypos,20));		
		}
		
		
			
		await doc.save( 'Strategy Compare Results.pdf', {returnPromise:true}).then($("#mask").removeClass('lmask'));
	}

	function makeReport() {
		setTimeout(function() {
			getDoc();
		}, 1500);
	}
});
