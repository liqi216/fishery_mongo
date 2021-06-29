$(function() {
	var mseNames = $("#cmpDiv").data("msenames");
    var mseSingleLists = $("#cmpDiv").data("msesinglelists");
    var mseComp = $("#cmpDiv").data("msecomp");
	var scenarios = $("#cmpDiv").data("scenarios");
	//parameters that are different between scenarios
	var differences = $("#cmpDiv").data("differences");

	//console.log(differences);
	
	drawChart(mseNames,mseSingleLists,mseComp,scenarios);

	//Create pdf for compare results
	$("#btnReport").on('click', function(event) {
		event.preventDefault();
		$("#mask").addClass('lmask');
		makeReport();
	});

	//if y pos is too low on page, add a new page and start at height 80
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
		doc.addImage(barRotationChart_1Img, 'jpg', 40, 50, 550, 370, undefined, 'none');
		doc.addImage(stateCatchFirst_ChartImg, 'jpg', 40, 450 ,550, 370, undefined, 'none');

		doc.addPage();
		doc.addImage(stateCatchLast_ChartImg, 'jpg', 40, 50, 550, 370, undefined, 'none');
		doc.addImage(stateSeasFirst_ChartImg, 'jpg', 40, 450 ,550, 370, undefined, 'none');

		doc.addPage();
		doc.addImage(stateSeasLast_ChartImg, 'jpg', 40, 50, 550, 370, undefined, 'none');
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
		//If the values for paramaeter are same between scenarios, just display the value
		//else display values for each scenario separately and highlight in red
		if(differences['stock1_input_file_type'] == null){
			if(scenarios[0].stock1_input_file_type==1){
				doc.text('Input File: Official Stock Assessment Model', 80, ypos=getY(doc,ypos,20));
			}else{
				doc.text('Input File: Self-defined Model', 80, ypos=getY(doc,ypos,20));
			}
		}else{
			doc.text('Input File:', 80 , ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0 ; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				if(scenarios[i].stock1_input_file_type==1){
					doc.text(name+ 'Official Stock Assessment Model', 90, ypos=getY(doc,ypos,20));
				}else{
					doc.text(name+ 'Self-defined Model', 90, ypos=getY(doc,ypos,20));
				}
			}
			doc.setTextColor(0);
		}
		

		//General Inputs
		doc.setFontSize(12);
		doc.setFontType("bold");
		doc.text('General Inputs', 50, ypos=getY(doc,ypos,40));
		doc.setFontSize(10);
		doc.setFontType("normal");
		doc.text('Time Step: 1 year', 80, ypos=getY(doc,ypos,20));
		doc.text('Start Projection: 2016-01-01', 80, ypos=getY(doc,ypos,20));
		if(differences['short_term_mgt'] == null){
			//values are same
			doc.text('Stock Assessment Frequency: ' + scenarios[0].short_term_mgt+' years', 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Stock Assessment Frequency: ', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].short_term_mgt+' years', 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}
		
		if(differences['long_term_mgt'] == null){
			//values are same
			doc.text('Forward Projection: '+scenarios[0].long_term_mgt+' years', 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Forward Projection: ', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].long_term_mgt+' years', 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}
	
		doc.text('Last Age in the Plus Group: '+scenarios[0].last_age, 80, ypos+=20);

		if(differences['no_of_interations'] == null){
			//values are same
			doc.text('Uncertainty: '+scenarios[0].no_of_interations+' iterations', 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Uncertainty: ', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].no_of_interations+' iterations', 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}

		if(differences['sample_size'] == null){
			//values are same
			doc.text('Observational Error for Initial Distribution: ' + scenarios[0].sample_size+' effective sample size', 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Observational Error for Initial Distribution: ', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].sample_size+' effective sample size', 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}

		if(differences['observ_err_EW_stock'] == null){
			//values are same
			doc.text('Observational Error for Recruitment Ratio between East and West Stocks: '+scenarios[0].observ_err_EW_stock+' effective sample size', 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Observational Error for Recruitment Ratio between East and West Stocks: ', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].observ_err_EW_stock+' effective sample size', 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}

		if(differences['rnd_seed_setting'] == null){
			//values are same
			var setting = scenarios[0].rnd_seed_setting;
			if(setting==1){
				doc.text("Random Seed Setting: Use Seconds of the System's Clock", 80, ypos=getY(doc,ypos,20));
			}else if (setting==2){
				doc.text('Random Seed Setting: Default Seed CSV', 80, ypos=getY(doc,ypos,20));
			}else{
				doc.text('Random Seed Setting: Self-defined CSV', 80, ypos=getY(doc,ypos,20));
			}
		}else{
			//values differ between scenarios
			doc.text('Random Seed Setting: ', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
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
			doc.setTextColor(0);
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

		if(differences['ip_cv_1'] == null){
			//values are same
			doc.text('Stock 1 Population CV (Normal Dist.): '+scenarios[0].ip_cv_1, 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Stock 1 Population CV (Normal Dist.): ', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+scenarios[i].ip_cv_1, 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}

		if(differences['ip_cv_2'] == null){
			//values are same
			doc.text('Stock 2 Population CV (Normal Dist.): '+scenarios[0].ip_cv_2, 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Stock 2 Population CV (Normal Dist.): ', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+scenarios[i].ip_cv_2, 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
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

		if(differences['nm_m'] == null){
			//values are same
			var nm_m = scenarios[0].nm_m;
			if(nm_m=='h'){
				doc.text('M: High', 80, ypos=getY(doc,ypos,20));
			}else if(nm_m=='l'){
				doc.text('M: Low', 80, ypos=getY(doc,ypos,20));
			}else{
				doc.text('M: Current', 80, ypos=getY(doc,ypos,20));
			}
		}else{
			//values differ between scenarios
			doc.text('M:', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
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
			doc.setTextColor(0);
		}

		if(differences['nm_cv_1'] == null){
			//values are same
			doc.text('CV for East Stock(Log-normal Dist.): '+scenarios[0].nm_cv_1, 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('CV for East Stock(Log-normal Dist.): ', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+scenarios[i].nm_cv_1, 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}

		if(differences['nm_cv_2'] == null){
			//values are same
			doc.text('CV for West Stock(Log-normal Dist.): '+scenarios[0].nm_cv_2, 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('CV for West Stock(Log-normal Dist.): ', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+scenarios[i].nm_cv_2, 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
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

		if(differences['simple_spawning'] == null){
			//values are same
			doc.text('Fraction Before Spawning: '+scenarios[0].simple_spawning+' years', 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Fraction Before Spawning:', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].simple_spawning+' years', 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}	

		if(differences['cvForRecu'] == null){
			//values are same
			doc.text('CV for Recruitment(Log-normal Dist.): '+scenarios[0].cvForRecu, 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('CV for Recruitment(Log-normal Dist.):', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].cvForRecu, 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}	
		
		if(differences['stock1_amount'] == null){
			//values are same
			doc.text(scenarios[0].stock1_amount+"% to East Stock\t" + scenarios[0].stock2_amount+"% to West Stock", 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('East & West Stock:', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].stock1_amount+"% to East Stock\t" + scenarios[i].stock2_amount+"% to West Stock", 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}

		if(differences['recruitTypeStock1'] == null && differences['fromHisStock1'] == null && differences['historySt1_early'] == null && differences['hst1_other_early'] == null
			&& differences['historySt1'] == null && differences['hst1_other'] == null && differences['fromFmlStock1'] == null ){
			//values are same
			if(scenarios[0].recruitTypeStock1 == 1){
				if(scenarios[0].fromHisStock1 == 1){
					doc.text("From Historical, Include Years Before 1984", 80, ypos=getY(doc,ypos,20));
					if(scenarios[0].historySt1_early == 1){
						doc.text("Mean: " + scenarios[0].hst1_mean_early, 90, ypos=getY(doc,ypos,20));
					}else{
						doc.text(scenarios[0].hst1_other_early + "%: "+ scenarios[0].hst1_cal_early, 90, ypos=getY(doc,ypos,20));
					}
				}else{
					doc.text("From Historical, Exclude Years Before 1984", 80, ypos=getY(doc,ypos,20));
					if(scenarios[0].historySt1 == 1){
						doc.text("Mean: " + scenarios[0].hst1_mean, 90, ypos=getY(doc,ypos,20));
					}else{
						doc.text(scenarios[0].hst1_other + "%: "+ scenarios[0].hst1_cal, 90, ypos=getY(doc,ypos,20));
					}
				}
				
			}else{
				if(scenarios[0].fromFmlStock1 == 1){
					doc.text("From Formula, R0 Include Years Before 1984", 80, ypos=getY(doc,ypos,20));
					doc.text("R0: " + scenarios[0].fml1MbhmR0_early + " (1000s)", 90, ypos=getY(doc,ypos,20));
				}else{
					doc.text("From Formula, R0 Exclude Years Before 1984", 80, ypos=getY(doc,ypos,20));
					doc.text("R0: " + scenarios[0].fml1MbhmR0 + " (1000s)", 90, ypos=getY(doc,ypos,20));
				}
				doc.text("SSB0: " + scenarios[0].fml1MbhmSSB0 + " (1000 eggs)", 90, ypos=getY(doc,ypos,20));
				doc.text("Steepness(h): " + scenarios[0].fml1MbhmSteep, 90, ypos=getY(doc,ypos,20));
			}
		}else{
			//values differ between scenarios
			doc.text('Recruitment:', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
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
			doc.setTextColor(0);
		}

		//Management Options I
		doc.setFontSize(12);
		doc.setFontType("bold");
		doc.text('Management Options I', 50, ypos=getY(doc,ypos,40));
		doc.setFontSize(10);
		doc.setFontType("normal");
		doc.text('SSB(MSY): ' + scenarios[0].bio_catch_mt/1000 + " (1000 eggs)", 80, ypos=getY(doc,ypos,20));
		doc.text('F(MSY): ' + scenarios[0].bio_f_percent, 80, ypos=getY(doc,ypos,20));

		if(differences['harvest_level'] == null){
			//values are same
			doc.text('Harvest Control Rule: Constant F: '+ scenarios[0].harvest_level, 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Harvest Control Rule: ', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ "Constant F: "+ scenarios[i].harvest_level, 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}	

		

		//Management Options II
		doc.setFontSize(12);
		doc.setFontType("bold");
		doc.text('Management Options II', 50, ypos=getY(doc,ypos,40));
		doc.setFontSize(10);
		doc.setFontType("normal");

		if(differences['sec_recreational'] == null){
			//values are same
			doc.text('Recreational: '+scenarios[0].sec_recreational + '%', 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Recreational:', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].sec_recreational + '%', 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}

		if(differences['sec_commercial'] == null){
			//values are same
			doc.text('Commercial: '+scenarios[0].sec_commercial+ '%', 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Commercial:', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].sec_commercial+ '%', 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}

		if(differences['sec_hire'] == null){
			//values are same
			doc.text('Federal For-hire: '+scenarios[0].sec_hire+ '%', 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Federal For-hire:', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].sec_hire+ '%', 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}

		if(differences['sec_private'] == null){
			//values are same
			doc.text('Private Angling: '+scenarios[0].sec_private+ '%', 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Private Angling:', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].sec_private+ '%', 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}

		doc.text('Allocation among Private Angling Fleets(Only used for demonstrating results)', 80, ypos=getY(doc,ypos,20));
		doc.text('Private Angling East: ' + scenarios[0].p_e+ '%', 90, ypos=getY(doc,ypos,20));
		doc.text('Private Angling West: ' + scenarios[0].p_w+ '%', 90, ypos=getY(doc,ypos,20));
		doc.text('Allocation among Federal For-hire Fleets(Only used for demonstrating results)', 80, ypos=getY(doc,ypos,20));
		doc.text('Federal For-hire East: ' + scenarios[0].sec_headboat+ '%', 90, ypos=getY(doc,ypos,20));
		doc.text('Federal For-hire West: ' + scenarios[0].sec_charterboat+ '%', 90, ypos=getY(doc,ypos,20));

		if(differences['sec_pstar'] == null){
			//values are same
			doc.text('Probability of Overfishing (OFL -> ABC): ' +scenarios[0].sec_pstar+ '%',80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Probability of Overfishing (OFL -> ABC):',80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].sec_pstar+ '%', 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}
		
		if(differences['sec_act_com'] == null){
			//values are same
			doc.text('Acceptable Catch Target For the Commercial Sector: '+scenarios[0].sec_act_com+ '%',80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Acceptable Catch Target For the Commercial Sector:',80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].sec_act_com+ '%', 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}
		
		if(differences['sec_act_hire'] == null){
			//values are same
			doc.text('Acceptable Catch Target For the Federal For-hire Component: ' +scenarios[0].sec_act_hire+ '%',80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Acceptable Catch Target For the Federal For-hire Component:',80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].sec_act_hire+ '%', 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}
		
		if(differences['sec_act_pri'] == null){
			//values are same
			doc.text('Acceptable Catch Target For the Private Angling Component: '+scenarios[0].sec_act_pri+ '%',80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Acceptable Catch Target For the Private Angling Component:',80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].sec_act_pri+ '%', 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}

		//Management Options III
		doc.setFontSize(12);
		doc.setFontType("bold");
		doc.text('Management Options III', 50, ypos=getY(doc,ypos,40));
		doc.setFontSize(10);
		doc.setFontType("normal");

		if(differences['mg3_commercial'] == null){
			//values are same
			doc.text('Minimum Legal Size for Commercial Fleets: '+scenarios[0].mg3_commercial + " inch", 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Minimum Legal Size for Commercial Fleets: ', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].mg3_commercial + " inch", 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}

		if(differences['mg3_recreational'] == null){
			//values are same
			doc.text('Minimum Legal Size for Recreational Fleets: '+scenarios[0].mg3_recreational + " inch", 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Minimum Legal Size for Recreational Fleets: ', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].mg3_recreational + " inch", 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}
		
		if(differences['mg3_forhire'] == null){
			//values are same
			doc.text('Bag Limit For Federal For-hire Fleets: '+scenarios[0].mg3_forhire + "  # of fish per bag", 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Bag Limit For Federal For-hire Fleets: ', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].mg3_forhire + "  # of fish per bag", 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}
		
		if(differences['mg3_private'] == null){
			//values are same
			doc.text('Bag Limit For Private Angling Fleets: '+scenarios[0].mg3_private + "  # of fish per bag", 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Bag Limit For Private Angling Fleets: ', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].mg3_private + "  # of fish per bag", 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}
		
		//Management Options IV
		doc.setFontSize(12);
		doc.setFontType("bold");
		doc.text('Management Options IV', 50, ypos=getY(doc,ypos,40));
		doc.setFontSize(10);
		doc.setFontType("normal");

		if(differences['mg3_rec_east_open'] == null){
			//values are same
			doc.text('Recreational Stock1 Open: '+scenarios[0].mg3_rec_east_open + "%", 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Recreational Stock1 Open: ', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].mg3_rec_east_open + "%", 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}

		if(differences['mg3_rec_east_closed'] == null){
			//values are same
			doc.text('Recreational Stock1 Closed: '+scenarios[0].mg3_rec_east_closed + "%", 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Recreational Stock1 Closed: ', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].mg3_rec_east_closed + "%", 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}

		if(differences['mg3_rec_west_open'] == null){
			//values are same
			doc.text('Recreational Stock2 Open: '+scenarios[0].mg3_rec_west_open + "%", 80, ypos=getY(doc,ypos,30));
		}else{
			//values differ between scenarios
			doc.text('Recreational Stock2 Open: ', 80, ypos=getY(doc,ypos,30));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].mg3_rec_west_open + "%", 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}

		if(differences['mg3_rec_west_closed'] == null){
			//values are same
			doc.text('Recreational Stock2 Closed: '+scenarios[0].mg3_rec_west_closed + "%", 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Recreational Stock2 Closed: ', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].mg3_rec_west_closed + "%", 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}
		
		if(differences['mg3_comhard_east_open'] == null){
			//values are same
			doc.text('Commercial Vertical Line Stock1 Open: '+scenarios[0].mg3_comhard_east_open + "%", 80, ypos=getY(doc,ypos,30));
		}else{
			//values differ between scenarios
			doc.text('Commercial Vertical Line Stock1 Open: ', 80, ypos=getY(doc,ypos,30));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].mg3_comhard_east_open + "%", 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}
		
		if(differences['mg3_comhard_west_open'] == null){
			//values are same
			doc.text('Commercial Vertical Line Stock2 Open: '+scenarios[0].mg3_comhard_west_open + "%", 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Commercial Vertical Line Stock2 Open: ', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].mg3_comhard_west_open + "%", 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}

		if(differences['mg3_comlong_east_open'] == null){
			//values are same
			doc.text('Commercial Long Line Stock1 Open: '+scenarios[0].mg3_comlong_east_open + "%", 80, ypos=getY(doc,ypos,30));
		}else{
			//values differ between scenarios
			doc.text('Commercial Long Line Stock1 Open: ', 80, ypos=getY(doc,ypos,30));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].mg3_comlong_east_open + "%", 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}

		if(differences['mg3_comlong_west_open'] == null){
			//values are same
			doc.text('Commercial Long Line Stock2 Open: '+scenarios[0].mg3_comlong_west_open + "%", 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Commercial Long Line Stock2 Open: ', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].mg3_comlong_west_open + "%", 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}
			
		if(differences['com_stock1_closed'] == null){
			//values are same
			doc.text('Commercial Stock1 Closed: '+ scenarios[0].com_stock1_closed + "%", 80, ypos=getY(doc,ypos,30));
		}else{
			//values differ between scenarios
			doc.text('Commercial Stock1 Closed: ', 80, ypos=getY(doc,ypos,30));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].com_stock1_closed + "%", 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}
		
		if(differences['com_stock2_closed'] == null){
			//values are same
			doc.text('Commercial Stock2 Closed: '+ scenarios[0].com_stock2_closed + "%", 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Commercial Stock2 Closed: ', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].com_stock2_closed + "%", 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}
		
		//Management Options V
		doc.setFontSize(12);
		doc.setFontType("bold");
		doc.text('Management Options V', 50, ypos=getY(doc,ypos,40));
		doc.setFontSize(10);
		doc.setFontType("normal");
		doc.text('Catch Rate', 80, ypos=getY(doc,ypos,20));

		if(differences['mg3_forhire'] == null){
			//values are same
			var multip = scenarios[0].mg3_forhire/2;
			doc.text('Federal For-hire Multiplier: '+ scenarios[0].mg3_forhire + ' / 2 = ' + multip + ' fish per bag', 90, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Federal For-hire Multiplier: ', 90, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				var multip = scenarios[i].mg3_forhire/2;
				doc.text(name+ scenarios[i].mg3_forhire + ' / 2 = ' + multip + ' fish per bag',100,ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}

		if(differences['base_fed_forhire'] == null){
			//values are same
			doc.text('Base Federal For-hire Catch Rate: '+ scenarios[0].base_fed_forhire + ' lb/day', 90, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Base Federal For-hire Catch Rate: ', 90, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].base_fed_forhire + ' lb/day',100,ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}
		
		if(differences['est_fed_forhire'] == null){
			//values are same
			doc.text('Est. Federal For-hire Catch Rate: '+ scenarios[0].est_fed_forhire + ' lb/day', 90, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Est. Federal For-hire Catch Rate', 90, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].est_fed_forhire + ' lb/day',100,ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}

		if(differences['mg3_private'] == null){
			//values are same
			var multip = scenarios[0].mg3_private/2;
			doc.text('Private Angling Multiplier: '+ scenarios[0].mg3_private + ' / 2 = ' + multip + ' fish per bag', 90, ypos=getY(doc,ypos,40));
		}else{
			//values differ between scenarios
			doc.text('Private Angling Multiplier: ', 90, ypos=getY(doc,ypos,40));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				var multip = scenarios[i].mg3_private/2;
				doc.text(name+ scenarios[i].mg3_private + ' / 2 = ' + multip + ' fish per bag',100,ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}
		
		if(differences['base_AL_private'] == null){
			//values are same
			doc.text('Base AL Private Angling Catch Rate: '+ scenarios[0].base_AL_private + ' lb/day', 90, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Base AL Private Angling Catch Rate:', 90, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].base_AL_private + ' lb/day',100,ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}

		if(differences['est_AL_private'] == null){
			//values are same
			doc.text('Est. AL Private Angling Catch Rate: '+ scenarios[0].est_AL_private + ' lb/day', 90, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Est. AL Private Angling Catch Rate:', 90, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].est_AL_private + ' lb/day',100,ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}
		
		if(differences['base_FL_private'] == null){
			//values are same
			doc.text('Base FL Private Angling Catch Rate: '+ scenarios[0].base_FL_private + ' lb/day', 90, ypos=getY(doc,ypos,40));
		}else{
			//values differ between scenarios
			doc.text('Base FL Private Angling Catch Rate:', 90, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].base_FL_private + ' lb/day',100,ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}
		
		if(differences['est_FL_private'] == null){
			//values are same
			doc.text('Est. FL Private Angling Catch Rate: '+ scenarios[0].est_FL_private + ' lb/day', 90, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Est. FL Private Angling Catch Rate:', 90, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].est_FL_private + ' lb/day',100,ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}
	
		if(differences['base_LA_private'] == null){
			//values are same
			doc.text('Base LA Private Angling Catch Rate: '+ scenarios[0].base_LA_private + ' lb/day', 90, ypos=getY(doc,ypos,40));
		}else{
			//values differ between scenarios
			doc.text('Base LA Private Angling Catch Rate:', 90, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].base_LA_private + ' lb/day',100,ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}
		
		if(differences['est_LA_private'] == null){
			//values are same
			doc.text('Est. LA Private Angling Catch Rate: '+ scenarios[0].est_LA_private + ' lb/day', 90, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Est. LA Private Angling Catch Rate:', 90, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].est_LA_private + ' lb/day',100,ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}
		
		if(differences['base_MS_private'] == null){
			//values are same
			doc.text('Base MS Private Angling Catch Rate: '+ scenarios[0].base_MS_private + ' lb/day', 90, ypos=getY(doc,ypos,40));
		}else{
			//values differ between scenarios
			doc.text('Base MS Private Angling Catch Rate:', 90, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].base_MS_private + ' lb/day',100,ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}
		
		if(differences['est_MS_private'] == null){
			//values are same
			doc.text('Est. MS Private Angling Catch Rate: '+ scenarios[0].est_MS_private + ' lb/day', 90, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Est. MS Private Angling Catch Rate:', 90, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].est_MS_private + ' lb/day',100,ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}

		if(differences['base_MS_forhire'] == null){
			//values are same
			doc.text('Base MS For-hire Catch Rate: '+ scenarios[0].base_MS_forhire + ' lb/day', 90, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Base MS For-hire Catch Rate: ', 90, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].base_MS_forhire + ' lb/day',100,ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}
		
		if(differences['est_MS_forhire'] == null){
			//values are same
			doc.text('Est. MS For-hire Catch Rate: '+ scenarios[0].est_MS_forhire + ' lb/day', 90, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Est. MS For-hire Catch Rate:', 90, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].est_MS_forhire + ' lb/day',100,ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}
		
		if(differences['base_TX_private'] == null){
			//values are same
			doc.text('Base TX Private Angling Catch Rate in Federal Water: '+ scenarios[0].base_TX_private + ' lb/day', 90, ypos=getY(doc,ypos,40));
		}else{
			//values differ between scenarios
			doc.text('Base TX Private Angling Catch Rate in Federal Water:', 90, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].base_TX_private + ' lb/day',100,ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}
		
		if(differences['est_TX_private'] == null){
			//values are same
			doc.text('Est. TX Private Angling Catch Rate in Federal Water: '+ scenarios[0].est_TX_private + ' lb/day', 90, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Est. TX Private Angling Catch Rate in Federal Water:', 90, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].est_TX_private + ' lb/day',100,ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}		
		
		if(differences['base_TX_forhire'] == null){
			//values are same
			doc.text('Base TX Private Angling Catch Rate in State Water: '+ scenarios[0].base_TX_forhire + ' lb/day', 90, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Base TX Private Angling Catch Rate in State Water: ', 90, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].base_TX_forhire + ' lb/day',100,ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}
		
		if(differences['est_TX_forhire'] == null){
			//values are same
			doc.text('Est. TX Private Angling Catch Rate in State Water: '+ scenarios[0].est_TX_forhire + ' lb/day', 90, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Est. TX Private Angling Catch Rate in State Water:', 90, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].est_TX_forhire + ' lb/day',100,ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}

		doc.text('Season Length', 80, ypos=getY(doc,ypos,40));
		doc.text('Federal For-hire Component:', 90, ypos=getY(doc,ypos,20));
		if(differences['season_fed_forhire'] == null && differences['fed_forhire_length'] == null ){
			//values are same
			if(scenarios[0].season_fed_forhire == 1){
				doc.text('Season Length is Determined by ACT',100,ypos=getY(doc,ypos,20));
			}else{
				doc.text('Federal For-hire Season Length: '+scenarios[0].fed_forhire_length + ' days',100,ypos=getY(doc,ypos,20));
			}
		}else{
			//values differ between scenarios
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				if(scenarios[i].season_fed_forhire == 1){
					doc.text(name+'Season Length is Determined by ACT',100,ypos=getY(doc,ypos,20));
				}else{
					doc.text(name+ scenarios[i].fed_forhire_length + ' days',100,ypos=getY(doc,ypos,20));
				}	
			}
			doc.setTextColor(0);
		}
		
		doc.text('State For-hire Component and Private Angling in State Water:', 90, ypos=getY(doc,ypos,20));
		if(differences['MS_forhire_length'] == null){
			//values are same
			doc.text('MS For-hire Season Length: '+ scenarios[0].MS_forhire_length + ' days', 100, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('MS For-hire Season Length:', 100, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].MS_forhire_length + ' days',110,ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}

		if(differences['TX_forhire_length'] == null){
			//values are same
			doc.text('TX Private Angling Season Length in State Water: '+ scenarios[0].TX_forhire_length + ' days', 100, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('TX Private Angling Season Length in State Water:', 100, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].TX_forhire_length + ' days',110,ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}
		
		doc.text('Private Angling Component:', 90, ypos=getY(doc,ypos,20));
		if(differences['season_private'] == null && differences['AL_private_length'] == null && differences['FL_private_length'] == null && differences['LA_private_length'] == null && differences['MS_private_length'] == null && differences['TX_private_length'] == null ){
			//values are same
			if(scenarios[0].season_private == 1){
				doc.text('Season Lengths are Determined by ACT',100,ypos=getY(doc,ypos,20));
			}else{
				doc.text('ACT is Determined by Inputs ',100,ypos=getY(doc,ypos,20));
				doc.text('AL Private Angling Season Length: '+scenarios[0].AL_private_length + ' days',110,ypos=getY(doc,ypos,20));
				doc.text('FL Private Angling Season Length: '+scenarios[0].FL_private_length + ' days',110,ypos=getY(doc,ypos,20));
				doc.text('LA Private Angling Season Length: '+scenarios[0].LA_private_length + ' days',110,ypos=getY(doc,ypos,20));
				doc.text('MS Private Angling Season Length: '+scenarios[0].MS_private_length + ' days',110,ypos=getY(doc,ypos,20));
				doc.text('TX Private Angling Season Length in Federal Water: '+scenarios[0].TX_private_length + ' days',110,ypos=getY(doc,ypos,20));
			}
		}else{
			//values differ between scenarios
			doc.setTextColor(255,0,0);
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
					doc.text('TX Private Angling Season Length in Federal Water: '+scenarios[i].TX_private_length + ' days',110,ypos=getY(doc,ypos,20));
				}
				
			}
			doc.setTextColor(0);
		}
		
		//Management Options VI
		doc.setFontSize(12);
		doc.setFontType("bold");
		doc.text('Management Options VI', 50, ypos=getY(doc,ypos,40));
		doc.setFontSize(10);
		doc.setFontType("normal");
		doc.text('Penalty', 80, ypos=getY(doc,ypos,20));

		if(differences['penalty_switch'] == null){
			//values are same
			if(scenarios[0].penalty_switch == 0){
				doc.text('No Penalty',90,ypos=getY(doc,ypos,20));
			}else{
				doc.text('The exceeded catch will be deduced from the next year, ',90,ypos=getY(doc,ypos,20));
				doc.text("but make sure the actual landing doesn't exceed 95% of the OFL.",90,ypos=getY(doc,ypos,15));
			}
		}else{
			//values differ between scenarios
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				if(scenarios[i].penalty_switch == 0){
					doc.text(name+ 'No Penalty',90,ypos=getY(doc,ypos,20));
				}else{
					doc.text(name+ 'The exceeded catch will be deduced from the next year, ',90,ypos=getY(doc,ypos,20));
					doc.text("but make sure the actual landing doesn't exceed 95% of the OFL.",110,ypos=getY(doc,ypos,15));
				}
				
			}
			doc.setTextColor(0);
		}

		doc.text('Carryover', 80, ypos=getY(doc,ypos,20));
		if(differences['carryover_switch'] == null){
			//values are same
			if(scenarios[0].carryover_switch == 0){
				doc.text('No Carryover',90,ypos=getY(doc,ypos,20));
			}else if(scenarios[0].carryover_switch == 1){
				doc.text("Carryover to the same state next year, but make sure the actual ",90,ypos=getY(doc,ypos,20));
				doc.text( "landing doesn't exceed 95% of the OFL.",90,ypos=getY(doc,ypos,15));
			}else{
				doc.text("Carryover to the same state next year, but make sure the actual ",90,ypos=getY(doc,ypos,20));
				doc.text("landing doesnt exceed 50% of the difference between ABC and OFL.",90,ypos=getY(doc,ypos,15));
			}
		}else{
			//values differ between scenarios
			doc.setTextColor(255,0,0);
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
			doc.setTextColor(0);
		}

		
	
		

		//Management Options VII
		doc.setFontSize(12);
		doc.setFontType("bold");
		doc.text('Management Options VII', 50, ypos=getY(doc,ypos,40));
		doc.setFontSize(10);
		doc.setFontType("normal");

			
		if(differences['alabama'] == null){
			//values are same
			doc.text('Alabama Private Angling Quota: '+scenarios[0].alabama + '%', 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Alabama Private Angling Quota among States: ', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].alabama + '%', 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}

		if(differences['florida'] == null){
			//values are same
			doc.text('Florida Private Angling Quota: '+scenarios[0].florida + '%', 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Florida Private Angling Quota among States: ', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].florida + '%', 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}

		if(differences['louisiana'] == null){
			//values are same
			doc.text('Louisiana Private Angling Quota: '+scenarios[0].louisiana + '%', 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Louisiana Private Angling Quota among States: ', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].louisiana + '%', 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}

		if(differences['mississippi'] == null){
			//values are same
			doc.text('Mississippi Private Angling Quota: '+scenarios[0].mississippi + '%', 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Mississippi Private Angling Quota among States: ', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].mississippi + '%', 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}

		if(differences['texas'] == null){
			//values are same
			doc.text('Texas Private Angling Quota: '+scenarios[0].texas + '%', 80, ypos=getY(doc,ypos,20));
		}else{
			//values differ between scenarios
			doc.text('Texas Private Angling Quota among States: ', 80, ypos=getY(doc,ypos,20));
			doc.setTextColor(255,0,0);
			for(let i = 0; i < mseNames.length; i++){
				var name = mseNames[i] + ": ";
				doc.text(name+ scenarios[i].texas + '%', 90, ypos=getY(doc,ypos,20));
			}
			doc.setTextColor(0);
		}
					
		await doc.save( 'Strategy Compare Results.pdf', {returnPromise:true}).then($("#mask").removeClass('lmask'));
	}

	function makeReport() {
		setTimeout(function() {
			getDoc();
		}, 1500);
	}
});
