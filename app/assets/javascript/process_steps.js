//For both simple and professional version management option page
$(function() {


	/*************************** Form validations *********************************/

	$("#form-stockassessment").validate({
		ignore:"input[type=file]",
		rules: {
	      // no quoting necessary
	      stock1_model_type:{
	      	required: true,
	      },
	    },
	    errorPlacement: function(error, element) {
		    error.appendTo( element.closest("div"));
		}
	});

	$("#form-generalinput").validate({
	 	ignore:"input[type=file]",
	    rules: {
	      // no quoting necessary
	      rnd_seed_setting:{
	      	required: true,
	       },
				short_term_mgt:{
					required:true,
					number:true,
					range:[2,5],
				},
				long_term_mgt:{
					required:true,
					number:true,
					range:[15,50],
				},
				no_of_interations:{
					required:true,
					number:true,
					range:[50,250],
				},
				sample_size:{
					required:true,
					number:true,
					range:[10,2000],
				},
				observ_err_EW_stock:{
					required:true,
					number:true
				},

	    },
	    errorPlacement: function(error, element) {
		    error.appendTo( element.closest("div") );
		}
	});

	$("#form-mixingpattern").validate({
	 	 rules: {
			  stock1_to_1:{
					required: true,
					number: true,
					range:[0,100],
				},
				stock1_to_2:{
					required: true,
					number: true,
					range:[0,100],
				},
				stock2_to_1:{
					required: true,
					number: true,
					range:[0,100],
				},
				stock2_to_2:{
					required: true,
					number: true,
					range:[0,100],
				},
	    },
	    errorPlacement: function(error, element) {
		    error.appendTo( element.closest(".form-group") );
		}
	});

	$("#form-ibParam").validate({
	 	 rules: {
			 ip_cv_1:{
				 required:true,
				 number: true,
				 step: 0.01,
				 range:[0.1,0.5],
			 },
			 ip_cv_2:{
				 required:true,
				 number: true,
				 step: 0.01,
				 range:[0.1,0.5],
			 },

	    },
	    errorPlacement: function(error, element) {
		    error.appendTo( element.closest(".form-group") );
		}
	});


	$("#form-naturalmortality").validate({
		rules: {
	      // no quoting necessary

	      nm_cv_1:{
	      	required: true,
	      	number:true,
	      },
	      nm_cv_2:{
	      	required: true,
	      	number:true,
	      	max:100,
	      },
	    },
	    errorPlacement: function(error, element) {
		    error.appendTo( element.closest(".form-group"));
		}
	});

	$("#form-recruitment").validate({
	    rules: {
	      // part1
	      recruitTypeStock1:{
	      	required: true,
	      },
				historySt1_early:{
					required:true,
				},
				historySt1:{
					required:true,
				},
				simple_spawning:{
	      	required: true,
	      	number:true,
	      },
				cvForRecu:{
					required:true,
					number: true,
					step: 0.01,
					range:[0.2,0.6]
				},
				stock1_amount:{
					required: true,
					number: true,
					range:[0,100]
				},
	      hst1_mean:{
	      	required: true,
	      	number:true,
	      	max:99999999,
	      },
	      hst1_other:{
	      	required: true,
	      	number:true,
					range: [0,100],
	      },
	      hst1_cal:{
	      	required: true,
	      	number:true,
	      	max:99999999,
	      },
	      hst1_mean_early:{
	      	required: true,
	      	number:true,
	      	max:99999999,
	      },
	      hst1_other_early:{
	      	required: true,
	      	number:true,
					range: [0,100],
	      },
	      hst1_cal_early:{
	      	required: true,
	      	number:true,
	      	max:99999999,
	      },
	      //part2
	      formulaStock1:{
	      	required: true,
	      },
	      fml1Bmalpha1:{
	      	required: true,
	      	number:true,
	      },
	      fml1Bmbeta1:{
	      	required: true,
	      	number:true,
	      },
	      fml1Rmalpha1:{
	      	required: true,
	      	number:true,
	      },
	      fml1Rmbeta1:{
	      	required: true,
	      	number:true,
	      },
	      fml1MbhmSSB0:{
	      	required: true,
	      	number:true,
	      },
	      fml1MbhmR0:{
	      	required: true,
	      	number:true,
	      },
	      fml1MbhmSteep:{
	      	required: true,
	      	number:true,
	      },
	      //part3
	      auto1R0:{
	      	required: true,
	      	number:true,
	      },
	      auto1h:{
	      	required: true,
	      	number:true,
	      },
	      auto1Rave:{
	      	required: true,
	      	number:true,
	      },
	      cv1Recruit:{
	      	required: true,
	      	number:true,
	      },
	    },
	    messages:{
	    	recruitTypeStock1:{
	    		//required: "Stock 1 recruit type is required",
	    	},
				historySt1_early:{
					required:"Please select mean or other"
				},
				historySt1:{
					required:"Please select mean or other"
				}

	    },
	    errorPlacement: function(error, element) {
	    	error.appendTo( element.closest("div") );
		}
	});

	$("#form-mgtopt1").validate({
		rules: {
	      // no quoting necessary
	      bio_biomass_points:{
	      	required: true,
	      	number:true,
	      },
	      bio_catch_mt:{
	      	required: true,
	      	number:true,
	      },
	      bio_f_percent:{
	      	required: true,
	      	number:true,
	      },
	      hrt_threshold1:{
	      	required: true,
	      	number:true,
	      },
	      hrt_threshold2:{
	      	required: true,
	      	number:true,
	      },
	      hst_catch_thh1:{
	      	required: true,
	      	number:true,
	      },
	      hst_catch_thh2:{
	      	required: true,
	      	number:true,
	      },
	      hst_f_thh1:{
	      	required: true,
	      	number:true,
	      },
	      hst_f_thh2:{
	      	required: true,
	      	number:true,
	      },
	      sec_recreational:{
	      	required: true,
	      	number:true,
	      	min:0,
	      	max:100,
	      },
	      sec_commercial:{
	      	required: true,
	      	number:true,
	      },
				mg1_cv:{
					required:true,
					number:true,
					step:0.01,
					range:[0,0.5],
				},
	    },
	    errorPlacement: function(error, element) {
		    error.appendTo( element.closest("div"));
		}
	});

	$("#form-mgtopt2").validate({
		rules: {
	      sec_recreational:{
					required:true,
					number:true,
					range:[0,100],
				},
				sec_hire:{
					required:true,
					number:true,
					range:[0,100],
				},
				sec_headboat:{
					required:true,
					number:true,
					range:[0,100],
				},
				sec_pstar:{
					required:true,
					number:true,
					range:[30,50],
				},
				sec_act_com:{
					required:true,
					number:true,
					range:[0,100],
				},
				sec_act_pri:{
					required:true,
					number:true,
					range:[0,100],
				},
				sec_act_hire:{
					required:true,
					number:true,
					range:[0,100],
				},
				p_e:{
					required: true,
					number:true,
					range:[0,100],
				},
				p_w:{
					required: true,
					number:true,
					range:[0,100],
				},
	    },
	    errorPlacement: function(error, element) {
		    error.appendTo( element.closest("div"));
		}
	});

	$('#form-mgtopt3').validate({
			rules:{
				mg3_commercial:{
					required: true,
					number:true,
					// range:[0,100],
				},
				mg3_recreational:{
					required: true,
					number:true,
					// range:[0,100],
				},
				mg3_forhire:{
					required: true,
					digits:true,
					range:[1,5],
				},
				mg3_private:{
					required: true,
					digits:true,
					range:[1,5],
				},
			},
			messages:{
				mg3_forhire:{
					digits: "Must be integer value",
				},
				mg3_private:{
					digits: "Must be integer value",
				},
			},
			errorPlacement: function(error, element) {
		    error.appendTo( element.closest("div"));
		  }
	});

		$("#form-mgtopt4").validate({
			rules: {
		      rec_east_open:{
						required:true,
						number:true,
						range:[0,100],
					},
					rec_east_closed:{
						required:true,
						number:true,
						range:[0,100],
					},
					rec_west_open:{
						required:true,
						number:true,
						range:[0,100],
					},
					rec_west_closed:{
						required:true,
						number:true,
						range:[0,100],
					},
					comhard_east_open:{
						required:true,
						number:true,
						range:[0,100],
					},
					com_stock2_closed:{
						required:true,
						number:true,
						range:[0,100],
					},
					comhard_west_open:{
						required:true,
						number:true,
						range:[0,100],
					},
					com_stock1_closed:{
						required:true,
						number:true,
						range:[0,100],
					},
					comlong_east_open:{
						required:true,
						number:true,
						range:[0,100],
					},
					comlong_west_open:{
						required:true,
						number:true,
						range:[0,100],
					},

					//cv validation
					rec_east_open_cv:{
						required:true,
						number:true,
						range:[0,60],
					},
					rec_east_closed_cv:{
						required:true,
						number:true,
						range:[0,60],
					},
					rec_west_open_cv:{
						required:true,
						number:true,
						range:[0,60],
					},
					rec_west_closed_cv:{
						required:true,
						number:true,
						range:[0,60],
					},
					comhard_east_open_cv:{
						required:true,
						number:true,
						range:[0,60],
					},
					com_stock2_closed_cv:{
						required:true,
						number:true,
						range:[0,60],
					},
					comhard_west_open_cv:{
						required:true,
						number:true,
						range:[0,60],
					},
					com_stock1_closed_cv:{
						required:true,
						number:true,
						range:[0,60],
					},
					comlong_east_open_cv:{
						required:true,
						number:true,
						range:[0,60],
					},
					comlong_west_open_cv:{
						required:true,
						number:true,
						range:[0,60],
					},
		    },
				messages:{
		    	rec_east_open_cv:{
		    		range: "CV must be between 0 and 60.",
		    	},
					rec_east_closed_cv:{
		    		range: "CV must be between 0 and 60.",
		    	},
					rec_west_open_cv:{
		    		range: "CV must be between 0 and 60.",
		    	},
					rec_west_closed_cv:{
		    		range: "CV must be between 0 and 60.",
		    	},
					comhard_east_open_cv:{
		    		range: "CV must be between 0 and 60.",
		    	},
					com_stock2_closed_cv:{
		    		range: "CV must be between 0 and 60.",
		    	},
					comhard_west_open_cv:{
		    		range: "CV must be between 0 and 60.",
		    	},
					com_stock1_closed_cv:{
		    		range: "CV must be between 0 and 60.",
		    	},
					comlong_east_open_cv:{
		    		range: "CV must be between 0 and 60.",
		    	},
					comlong_west_open_cv:{
		    		range: "CV must be between 0 and 60.",
		    	},

		    },
		    errorPlacement: function(error, element) {
			    error.appendTo( element.closest(".form-group"));
			}
		});

		$("#form-mgtopt5").validate({
			rules: {
		      base_fed_forhire:{
						required:true,
						number:true,
					},
					base_AL_private:{
						required:true,
						number:true,
					},
					base_FL_private:{
						required:true,
						number:true,
					},
					base_LA_private:{
						required:true,
						number:true,
					},
					base_MS_private:{
						required:true,
						number:true,
					},
					base_MS_forhire:{
						required:true,
						number:true,
					},
					base_TX_private:{
						required:true,
						number:true,
					},
					base_TX_forhire:{
						required:true,
						number:true,
					},
					fed_forhire_length:{
						required:true,
						number:true,
					},
					AL_private_length:{
						required:true,
						number:true,
					},
					FL_private_length:{
						required:true,
						number:true,
					},
					LA_private_length:{
						required:true,
						number:true,
					},
					MS_private_length:{
						required:true,
						number:true,
					},
					MS_forhire_length:{
						required:true,
						number:true,
					},
					TX_private_length:{
						required:true,
						number:true,
					},
					TX_forhire_length:{
						required:true,
						number:true,
					},
				},
	    errorPlacement: function(error, element) {
		    error.appendTo( element.closest("div"));
		  }
		});

		$('#form-mgtopt7').validate({
				rules:{
					alabama:{
						required: true,
						number:true,
						range:[0,100],
					},
					louisiana:{
						required: true,
						number:true,
						range:[0,100],
					},
					texas:{
						required: true,
						number:true,
						range:[0,100],
					},
					florida:{
						required: true,
						number:true,
						range:[0,100],
					},
					mississippi:{
						required: true,
						number:true,
						range:[0,100],
					},
				},
				errorPlacement: function(error, element) {
			    error.appendTo( element.closest("div"));
			  }
		});

		//Make sure the Recreational Quota Among states percentages add up to 100%
		function validateStateSum(){
			var sum = parseFloat($("#alabama").val()) + parseFloat($("#texas").val()) + parseFloat($("#florida").val()) + parseFloat($("#louisiana").val()) + parseFloat($("#mississippi").val());
			sum = Number(sum.toFixed(3));
			if( sum == 100 && parseFloat($("#texas").val()) >= 0){
				return true;
			}
			return false;
		}
			/*************************** Form validations end *********************************/



			/*********************** On Next step button click, save info ****************************/


	$("#process-part").accwizard({
		nextClasses: "btn btn-primary saveBtn",
		nextText: "Save Step",
		onNext:function(parent, panel){
			$panel = $(panel);
			if($panel.prop("id")=='generalinput'){

				if(!$("#form-generalinput").valid()){
					return false;
				}
				var short_term_mgt = $('input[name=short_term_mgt]', '#form-generalinput').val()||0;
				var long_term_mgt = $('input[name=long_term_mgt]', '#form-generalinput').val()||0;
				var num_of_interations = $('input[name=no_of_interations]', '#form-generalinput').val()||0;
				var sample_size = $('input[name=sample_size]', '#form-generalinput').val()||0;
				var observ_err_EW_stock = $('input[name=observ_err_EW_stock]', '#form-generalinput').val()||0;
				var rnd_seed_setting = $('input[name=rnd_seed_setting]:checked', '#form-generalinput').val()||"1";
				var isSimple = $("#step1_id").data("simple");
				if(isSimple != "True"){
					$.ajax({
			            cache: false,
			            url: $SCRIPT_ROOT+'/prostepview/step1/'+$("#step1_id").data("step1id"),
			            type: "PUT",
			            dataType: "json",
									contentType: 'application/json',
			            data: JSON.stringify({'short_term_mgt': short_term_mgt,'long_term_mgt': long_term_mgt, 'observ_err_EW_stock':observ_err_EW_stock,
											'no_of_interations':num_of_interations, 'sample_size': sample_size, 'rnd_seed_setting': rnd_seed_setting, 'isSimple':isSimple}),
			            success: function(data)
			            {
			                 if(data.status=1){
			                     console.log("save generalinput successfully");
			                 }
			            }
			        });
				}

			}else if($panel.prop("id") == 'mixingpattern'){

				if(!$("#form-mixingpattern").valid()){
					return false;
				}

			}else if($panel.prop("id")=='stockassessment'){

				if(!$("#form-stockassessment").valid()){
					return false;
				}
				var data = {};
				var stock1_input_file_type = $('input[name=stock1_input_file_type]:checked', '#form-stockassessment').val()||'1';
				$.ajax({
		            cache: false,
		            url: $SCRIPT_ROOT+'/prostepview/step3/'+$("#step1_id").data("step1id"),
		            type: "PUT",
		            dataType: "json",
		            data: {"stock1_input_file_type":stock1_input_file_type,//"stock1_filepath":stock1_filepath,
		            },
		            success: function(data)
		            {
		            	 if(data.status=1){
		                     console.log("save stockassessment successfully");
		                 }
		            }
		        });
			}else if($panel.prop("id")=='ibParam'){

				if(!$("#form-ibParam").valid()){
					return false;
				}
				var ip_cv_1 = parseFloat($("#ip_cv_1").val())||0;
				var ip_cv_2 = parseFloat($("#ip_cv_2").val())||0;

				$.ajax({
		            cache: false,
		            url: $SCRIPT_ROOT+'/prostepview/step4/'+$("#step1_id").data("step1id"),
		            type: "PUT",
		            dataType: "json",
		            contentType:"application/json",
		            data: JSON.stringify({"ip_cv_1":ip_cv_1,"ip_cv_2":ip_cv_2,"initPopu":$("#table-ibParam").bootstrapTable('getData')}),
		            success: function(data)
		            {
		                 if(data.status=1){
		                     console.log("save initial population successfully");
		                 }
		            }
		        });
			}else if($panel.prop("id")=='bioParam'){
				$.ajax({
		            cache: false,
		            url: $SCRIPT_ROOT+'/prostepview/step5/'+$("#step1_id").data("step1id"),
		            type: "PUT",
		            dataType: "json",
		            contentType:"application/json",
		            data: JSON.stringify($("#table-bioParam").bootstrapTable('getData')),
		            success: function(data)
		            {
		                 if(data.status=1){
		                     console.log("save biological parameters successfully");
		                 }
		            }
		        });
			}else if($panel.prop("id")=='naturalmortality'){
				if(!$("#form-naturalmortality").valid()){
					return false;
				}

				var inputdata = {};

				var nm_m = $('input[name=nm_m]:checked', '#form-naturalmortality').val()||'c';
				var nm_cv_1 = parseFloat($("#nm_cv_1").val())||0;
				var nm_cv_2 = parseFloat($("#nm_cv_2").val())||0;

					inputdata =JSON.stringify({"mortality_complexity":2,"nm_m":nm_m,"nm_cv_1":nm_cv_1,"nm_cv_2":nm_cv_2,
		            mortality:$("#table-mortality").bootstrapTable('getData')});
				$.ajax({
		            cache: false,
		            url: $SCRIPT_ROOT+'/prostepview/step6/'+$("#step1_id").data("step1id"),
		            type: "PUT",
		            dataType: "json",
		            contentType:"application/json",
		            data: inputdata,
		            success: function(data)
		            {
		                 if(data.status=1){
											 console.log("save natural mortality successfully");		                 }
		            }
		        });
			}else if($panel.prop("id")=='recruitment'){

				var data = {};
				if(!$("#form-recruitment").valid()){
					return false;
				};

				//stock1
				var simple_spawning = parseFloat($("#simple_spawning").val())||0;
				var cvForRecu = $("#cvForRecu").val()||0;
				var stock1_amount = $("#stock1_amount").val()||0;
				var stock2_amount = $("#stock2_amount").val()||0;
				var recruitTypeStock1 = $('input[name=recruitTypeStock1]:checked', '#form-recruitment').val()||'1';
				var fromHisStock1 = $('input[name=fromHisStock1]:checked', '#form-recruitment').val()||'0';

				var historySt1 = $('input[name=historySt1]:checked', '#form-recruitment').val()||'0';
				var hst1_mean = $("#hst1_mean").val()||0;
				var hst1_other = $('#hst1_other').val()||0;
				var hst1_cal = $('#hst1_cal:enabled').val()||0;
				var historySt1_early = $('input[name=historySt1_early]:checked', '#form-recruitment').val()||'0';
				var hst1_mean_early = $("#hst1_mean_early").val()||0;
				var hst1_other_early = $('#hst1_other_early').val()||0;
				var hst1_cal_early = $('#hst1_cal_early:enabled').val()||0;

				var formulaStock1 = $('input[name=formulaStock1]:checked', '#form-recruitment').val()||'0';
				var fromFmlStock1 = $('input[name=fromFmlStock1]:checked', '#form-recruitment').val()||'0';
				var fml1MbhmSSB0 = $("#fml1MbhmSSB0").val()||0;
				var fml1MbhmR0 = $("#fml1MbhmR0").val()||0;
				var fml1MbhmSteep = $("#fml1MbhmSteep").val()||0;
				var fml1MbhmR0_early = $("#fml1MbhmR0_early").val()||0;


				$.ajax({
		            cache: false,
		            url: $SCRIPT_ROOT+'/prostepview/step7/'+$("#step1_id").data("step1id"),
		            type: "PUT",
		            dataType: "json",
		            contentType:"application/json",
		            data: JSON.stringify({'simple_spawning':simple_spawning,'cvForRecu':cvForRecu,'stock1_amount':stock1_amount,'stock2_amount':stock2_amount,'recruitTypeStock1':recruitTypeStock1,'fromHisStock1':fromHisStock1
		        ,'historySt1':historySt1,'hst1_mean':hst1_mean,'hst1_other':hst1_other,'hst1_cal':hst1_cal
		        ,'historySt1_early':historySt1_early,'hst1_mean_early':hst1_mean_early,'hst1_other_early':hst1_other_early,'hst1_cal_early':hst1_cal_early
		        ,'formulaStock1':formulaStock1,'fromFmlStock1':fromFmlStock1,'fml1MbhmSSB0':fml1MbhmSSB0,'fml1MbhmR0':fml1MbhmR0,'fml1MbhmSteep':fml1MbhmSteep,'fml1MbhmR0_early':fml1MbhmR0_early}),
		            success: function(data)
		            {
		                 if(data.status=1){
		                     console.log("save recruitment successfully");
		                 }
		            }
		        });
			}else if($panel.prop("id")=='mgtopt1'){

				if(!$("#form-mgtopt1").valid()){
					return false;
				};
				var data = {};
				//var bio_biomass_points = $("#bio_biomass_points").val()||0;

				//var bio_harvest_radio = $('input[name=bio_harvest_radio]:checked', '#form-mgtopt1').val()||'C';
				var bio_catch_mt = $("#bio_catch_mt:enabled").val()||0;
				var bio_f_percent = $("#bio_f_percent:enabled").val()||0;
				var harvest_level = $("#ex1").val()||0.0588*0.75;
				var mg1_cv = $("#mg1_cv:enabled").val()||0;

				var hrt_harvest_rule = $('input[name=hrt_harvest_rule]:checked', '#form-mgtopt1').val()||'CF';
				var hrt_threshold1 = $("#hrt_threshold1").val()||0;
				var hrt_threshold2 = $("#hrt_threshold2").val()||0;

				var hrt_harvest_radio = $('input[name=hrt_harvest_radio]:checked', '#form-mgtopt1').val()||'C';
				var hst_catch_thh1 = $("#hst_catch_thh1:enabled").val()||0;
				var hst_catch_thh2 = $("#hst_catch_thh2:enabled").val()||0;
				var hst_f_thh1 = $("#hst_f_thh1:enabled").val()||0;
				var hst_f_thh2 = $('#hst_f_thh2:enabled').val()||0;

				$.ajax({
		            cache: false,
		            url: $SCRIPT_ROOT+'/prostepview/step8/'+$("#step1_id").data("step1id"),
		            type: "PUT",
		            dataType: "json",
		            contentType:"application/json",
		            data: JSON.stringify({'harvest_level':harvest_level,'mg1_cv':mg1_cv}),
		            success: function(data)
		            {
									console.log("save mgpt 1 successfully");
		            }
		        });
			}else if($panel.prop("id")=='mgtopt2'){

				if(!$("#form-mgtopt2").valid()){
					return false;
				};

				var sec_recreational = $("#sec_recreational").val()||0;
				var sec_commercial = $("#sec_commercial").val()||0;
				var sec_hire = $("#sec_hire").val()||0;
				var sec_private = $("#sec_private").val()||0;
				var sec_headboat = $("#sec_headboat").val()||0;
				var sec_charterboat = $("#sec_charterboat").val()||0;
				var sec_pstar = $("#sec_pstar").val()||0;
				var sec_act_com = $("#sec_act_com").val()||0;
				var sec_act_pri = $("#sec_act_pri").val()||0;
				var sec_act_hire = $("#sec_act_hire").val()||0;
				var p_e = $("#p_e").val()||0;
				var p_w = $("#p_w").val()||0;


				$.ajax({
		            cache: false,
		            url: $SCRIPT_ROOT+'/prostepview/step9/'+$("#step1_id").data("step1id"),
		            type: "PUT",
		            dataType: "json",
		            contentType:"application/json",
		            data: JSON.stringify({"sec_recreational":sec_recreational,"sec_commercial":sec_commercial
		        						,"sec_hire":sec_hire,"sec_private":sec_private
		        						,"sec_headboat":sec_headboat,"sec_charterboat":sec_charterboat
		        						,"sec_pstar":sec_pstar,"sec_act_com":sec_act_com
		        						,"sec_act_pri":sec_act_pri,"sec_act_hire":sec_act_hire
											  ,"p_e":p_e,"p_w":p_w}),
		            success: function(data)
		            {
									console.log("save mgpt 2 successfully");
		            }
		        });
			}else if($panel.prop("id")=='mgtopt3'){

				if(!$("#form-mgtopt3").valid()){
					return false;
				};
				var data = {};
				var mg3_commercial = $("#mg3_commercial").val()||0;
				var mg3_recreational = $("#mg3_recreational").val()||0;
				var mg3_forhire = $("#mg3_forhire").val()||0;
				var mg3_private = $("#mg3_private").val()||0;

				//Changes in forhire and private bag limit values in mgmt 3 must reflect in estaimates in mgmt 5
				$("#fed_multiplier").text(mg3_forhire||2);
				$("#private_multiplier").text(mg3_private||2);
				$("#fed_mult_result").text($("#fed_multiplier").text()/2);
				$("#private_mult_result").text($("#private_multiplier").text()/2);
				initCatchRate();

				//must also save these new changes to db
				var est_fed_forhire = $("#est_fed_forhire").val()||0;
				var est_AL_private = $("#est_AL_private").val()||0;
				var est_FL_private = $("#est_FL_private").val()||0;
				var est_LA_private = $("#est_LA_private").val()||0;
				var est_MS_private = $("#est_MS_private").val()||0;
				var est_MS_forhire = $("#est_MS_forhire").val()||0;
				var est_TX_private = $("#est_TX_private").val()||0;
				var est_TX_forhire = $("#est_TX_forhire").val()||0;


				$.ajax({
		            cache: false,
		            url: $SCRIPT_ROOT+'/prostepview/step10/'+$("#step1_id").data("step1id"),
		            type: "PUT",
		            dataType: "json",
		            contentType:"application/json",
		            data: JSON.stringify({'mg3_commercial':mg3_commercial,'mg3_recreational':mg3_recreational,'mg3_forhire':mg3_forhire,'mg3_private':mg3_private
										,'est_fed_forhire':est_fed_forhire,'est_AL_private':est_AL_private,'est_FL_private':est_FL_private,'est_LA_private':est_LA_private
										,'est_MS_private':est_MS_private,'est_MS_forhire':est_MS_forhire,'est_TX_private':est_TX_private,'est_TX_forhire':est_TX_forhire}),
		            success: function(data)
		            {
									console.log("Saved save mgpt 3 successfully");
		            }

				});

			}else if($panel.prop("id")=='mgtopt4'){
				if(!$("#form-mgtopt4").valid()){
					return false;
				}

				var	rec_east_open = $("#rec_east_open").val()||0;
				var	rec_east_closed = $("#rec_east_closed").val()||0;
				var	rec_west_open = $("#rec_west_open").val()||0;
				var	rec_west_closed = $("#rec_west_closed").val()||0;
				var	comhard_east_open = $("#comhard_east_open").val()||0;
				var	com_stock2_closed = $("#com_stock2_closed").val()||0;
				var	comhard_west_open = $("#comhard_west_open").val()||0;
				var	com_stock1_closed = $("#com_stock1_closed").val()||0;
				var	comlong_east_open = $("#comlong_east_open").val()||0;
				var	comlong_west_open = $("#comlong_west_open").val()||0;

				$.ajax({
		            cache: false,
		            url: $SCRIPT_ROOT+'/prostepview/step10_2/'+$("#step1_id").data("step1id"),
		            type: "PUT",
		            dataType: "json",
		            contentType:"application/json",
		            data: JSON.stringify({'rec_east_open':rec_east_open,'rec_east_closed':rec_east_closed
		        						,'rec_west_open':rec_west_open,'rec_west_closed':rec_west_closed,'comhard_east_open':comhard_east_open,'com_stock2_closed':com_stock2_closed
		        						,'comhard_west_open':comhard_west_open,'com_stock1_closed':com_stock1_closed,'comlong_east_open':comlong_east_open
		        						,'comlong_west_open':comlong_west_open}),
		            success: function(data)
		            {
									console.log("save mgpt 4 successfully");
		            }

		        });

			}else if($panel.prop("id")=='mgtopt5'){

				if(!$("#form-mgtopt5").valid()){
					return false;
				};

				var data = {};

				var base_fed_forhire = $("#base_fed_forhire").val()||0;
				var base_AL_private = $("#base_AL_private").val()||0;
				var base_FL_private = $("#base_FL_private").val()||0;
				var base_LA_private = $("#base_LA_private").val()||0;
				var base_MS_private = $("#base_MS_private").val()||0;
				var base_MS_forhire = $("#base_MS_forhire").val()||0;
				var base_TX_private = $("#base_TX_private").val()||0;
				var base_TX_forhire = $("#base_TX_forhire").val()||0;
				var est_fed_forhire = $("#est_fed_forhire").val()||0;
				var est_AL_private = $("#est_AL_private").val()||0;
				var est_FL_private = $("#est_FL_private").val()||0;
				var est_LA_private = $("#est_LA_private").val()||0;
				var est_MS_private = $("#est_MS_private").val()||0;
				var est_MS_forhire = $("#est_MS_forhire").val()||0;
				var est_TX_private = $("#est_TX_private").val()||0;
				var est_TX_forhire = $("#est_TX_forhire").val()||0;
				var season_fed_forhire = $("input[name=season_fed_forhire]:checked").val()||"1";
				var season_private = $("input[name=season_private]:checked").val()||"1";
				var fed_forhire_length = $("#fed_forhire_length").val()||0;
				var al_private_length = $("#AL_private_length").val()||0;
				var fl_private_length = $("#FL_private_length").val()||0;
				var la_private_length = $("#LA_private_length").val()||0;
				var ms_private_length = $("#MS_private_length").val()||0;
				var ms_forhire_length = $("#MS_forhire_length").val()||0;
				var tx_private_length = $("#TX_private_length").val()||0;
				var tx_forhire_length = $("#TX_forhire_length").val()||0;


				$.ajax({
		            cache: false,
		            url: $SCRIPT_ROOT+'/prostepview/step11/'+$("#step1_id").data("step1id"),
		            type: "PUT",
		            dataType: "json",
		            contentType:"application/json",
		            data: JSON.stringify({'base_fed_forhire':base_fed_forhire,'base_AL_private':base_AL_private,'base_FL_private':base_FL_private,'base_LA_private':base_LA_private
												,'base_MS_private':base_MS_private,'base_MS_forhire':base_MS_forhire,'base_TX_private':base_TX_private,'base_TX_forhire':base_TX_forhire
												,'est_fed_forhire':est_fed_forhire,'est_AL_private':est_AL_private,'est_FL_private':est_FL_private,'est_LA_private':est_LA_private
												,'est_MS_private':est_MS_private,'est_MS_forhire':est_MS_forhire,'est_TX_private':est_TX_private,'est_TX_forhire':est_TX_forhire
												,'season_fed_forhire':season_fed_forhire,'season_private':season_private,'fed_forhire_length':fed_forhire_length,'al_private_length':al_private_length
												,'fl_private_length':fl_private_length,'la_private_length':la_private_length,'ms_private_length':ms_private_length,'ms_forhire_length':ms_forhire_length
												,'tx_private_length':tx_private_length,'tx_forhire_length':tx_forhire_length
											}),
		            success: function(data)
		            {
		            	var bio_f_percent = $("#bio_f_percent:enabled").val()||0.0588;

		                 if(data.status=1){
		                     console.log("save mgt 5 successfully");
		                 }
		            }
		        });

			}else if($panel.prop("id")=='mgtopt6'){

				var penalty_switch = $("input[name='penalty_switch']:checked").val()||"1";
				var carryover_switch = $("input[name='carryover_switch']:checked").val()||"0";

				$.ajax({
					cache: false,
					url: $SCRIPT_ROOT+'/prostepview/step12/'+$("#step1_id").data("step1id"),
					type: "PUT",
					dataType: "json",
					contentType:"application/json",
					data: JSON.stringify({'penalty_switch':penalty_switch,'carryover_switch':carryover_switch}),
					success: function(data){
						if(data.status = 1){
							console.log("Save mgmt 6 successfully");
						}
					}
				});


			}else if($panel.prop("id")=='mgtopt7'){
				var validSum = validateStateSum();
				//check that inputs are valid
				if(!$("#form-mgtopt7").valid() || !validSum){
					if(!validSum){
						$("#states-error").removeAttr("hidden");
					}
					return false;
				};
				$("#states-error").attr("hidden", true);

				$("#mask").addClass('lmask');
				var alabama = $("#alabama").val()||0;
				var louisiana = $("#louisiana").val()||0;
				var mississippi = $("#mississippi").val()||0;
				var florida = $("#florida").val()||0;
				var texas = $("#texas").val()||0;

				$.ajax({
		            cache: false,
		            url: $SCRIPT_ROOT+'/prostepview/stateQuotas/'+$("#step1_id").data("step1id"),
		            type: "PUT",
		            dataType: "json",
		            contentType:"application/json",
		            data: JSON.stringify({'alabama':alabama,'louisiana':louisiana,"mississippi":mississippi,"florida":florida,"texas":texas}),
		            success: function(data)
		            {
									console.log("save mgmt 7 successfully");
									$.ajax({
										 cache: false,
										 url: 'http://gomredsnappermsetool.fiu.edu:8000/runmse',
										 crossDomain: true,
										 type: "POST",
										 dataType: "json",
										 data: JSON.stringify({"process_gen_id":$("#step1_id").data("step1id")}),
										 success: function(data)
										 {
													$("#mask").removeClass('lmask');
													drawChart(data);
													console.log("save mgmt 7 successfully");
										 },
										 error: function(XMLHttpRequest, textStatus, errorThrown) {
											$("#mask").removeClass('lmask');
											alert("Error running the model");
										}
								 });
		            }

		        });
			}
		}
	});

	$("#EssentialFigures").accwizard({});
	$("#otherFigures").accwizard({});
	/***************************** End process steps ********************************/


	/***************************** Initialization functions and change events ********************************/

	/*part 1 Stock Assessment Model Input 2 start*/

	$("#stock1_filepath").uploadFile({
		url: $SCRIPT_ROOT+'/prostepview/stock1file/'+$("#step1_id").data("step1id"),
	    maxFileCount: 1,                		   //上传文件个数（多个时修改此处
	    //allowedTypes: 'csv',  				       //允许上传的文件式
	    showFileSize: false,
	    showDone: false,                           //是否显示"Done"(完成)按钮
	    showDelete: true,                          //是否显示"Delete"(删除)按钮
	    showDownload:true,
	    statusBarWidth:600,
		downloadCallback:function(){
	        window.open($SCRIPT_ROOT+'/prostepview/stock1file/download/'+$("#step1_id").data("step1id"))
		},
	    onLoad: function(obj)
	    {
	    	var filename = $("#step1_id").data("stock1filename");
	    	var initfiles = setInterval(function(){
	    		if (typeof obj.createProgress !== "undefined") {
		    		filename&&obj.createProgress(filename);
		    		clearInterval(initfiles);
	    		}
	    	},3000)

	        //页面加载时，onLoad回调。如果有需要在页面初始化时显示（比如：文件修改时）的文件需要在此方法中处理
	                //createProgress方法可以创建一个已上传的文件
	    },
	    deleteCallback: function(data,pd)
	    {
	        //文件删除时的回调方法。
	        //如：以下ajax方法为调用服务器端删除方法删除服务器端的文件
	        $.ajax({
	            cache: false,
	            url: $SCRIPT_ROOT+'/prostepview/stock1file/'+$("#step1_id").data("step1id"),
	            type: "DELETE",
	            dataType: "json",
	            success: function(data)
	            {
	                if(!data){
	                    pd.statusbar.hide();        //删除成功后隐藏进度条等
	                 }else{
	                    console.log(data.message);  //打印服务器返回的错误信息
	                 }
	              }
	        });
	    },
	    onSuccess: function(files,data,xhr,pd)
	    {
	    	//$(".ajax-file-upload-statusbar").width("600px");
	        //上传成功后的回调方法。本例中是将返回的文件名保到一个hidden类开的input中，以便后期数据处理
	        // if(data&&data.code===0){
	        //     console.log(data);
	        // }
	    }
	});
/*
	$("#stock2_filepath").uploadFile({
		url: $SCRIPT_ROOT+'/prostepview/stock2file/'+$("#step1_id").data("step1id"),
	    maxFileCount: 1,                		   //上传文件个数（多个时修改此处
	    //allowedTypes: 'csv',  				       //允许上传的文件式
	    showFileSize: false,
	    showDone: false,                           //是否显示"Done"(完成)按钮
	    showDelete: true,                          //是否显示"Delete"(删除)按钮
	    showDownload:true,
	    statusBarWidth:600,
		downloadCallback:function(){
	        window.open($SCRIPT_ROOT+'/prostepview/stock2file/download/'+$("#step1_id").data("step1id"))
		},
	    onLoad: function(obj)
	    {
	    	var filename = $("#step1_id").data("stock2filename");
	    	if (typeof obj.createProgress !== "undefined") {
	    	 	filename&&obj.createProgress(filename);
	    	}
	        //页面加载时，onLoad回调。如果有需要在页面初始化时显示（比如：文件修改时）的文件需要在此方法中处理
	                //createProgress方法可以创建一个已上传的文件
	    },
	    deleteCallback: function(data,pd)
	    {
	        //文件删除时的回调方法。
	        //如：以下ajax方法为调用服务器端删除方法删除服务器端的文件
	        $.ajax({
	            cache: false,
	            url: $SCRIPT_ROOT+'/prostepview/stock2file/'+$("#step1_id").data("step1id"),
	            type: "DELETE",
	            dataType: "json",
	            success: function(data)
	            {
	                if(!data){
	                    pd.statusbar.hide();        //删除成功后隐藏进度条等
	                 }else{
	                    console.log(data.message);  //打印服务器返回的错误信息
	                 }
	              }
	        });
	    },
	    onSuccess: function(files,data,xhr,pd)
	    {
	    	//$(".ajax-file-upload-statusbar").width("600px");
	        //上传成功后的回调方法。本例中是将返回的文件名保到一个hidden类开的input中，以便后期数据处理
	        // if(data&&data.code===0){
	        //     console.log(data);
	        // }
	    }
	});
*/

		$('.stock1_input_file_type').on('click', '.selector', function(event) {
			event.preventDefault();
			/* Act on the event */
		});

		$("input[name='stock1_input_file_type']").on('change', function(event) {
			event.preventDefault();
			if($("input[name='stock1_input_file_type']:checked").val()==1){
				$('#stock1_upload_div').css('display','none');
			}else{
				$('#stock1_upload_div').css('display','block');
			}

		});

		$('#mt1FilePath').change(function () {
		    console.log(this.files[0].mozFullPath);
		});
	/*Stock Assessment Model Input 2 end*/

	/*General Inputs start */
    $('#start_projection').datetimepicker({
    	format:'YYYY-MM-DD',
    }).on('dp.change', function(e) {

    });

    $('#fishingStartDate').datetimepicker({
    	format:'YYYY-MM-DD',
    });

    $('#fishingEndDate').datetimepicker({
    	format:'YYYY-MM-DD',
    });

    $("#rnd_seed_file").uploadFile({
		url: $SCRIPT_ROOT+'/prostepview/rndSeedFile/'+$("#step1_id").data("step1id"),
	    //maxFileCount: 1,                		   //上传文件个数（多个时修改此处
	    allowedTypes: 'csv',  				       //允许上传的文件式
	    showFileSize: false,
	    showDone: false,                           //是否显示"Done"(完成)按钮
	    showDelete: true,                          //是否显示"Delete"(删除)按钮
	    showDownload:true,
	    statusBarWidth:600,
		downloadCallback:function(data){
	        window.open($SCRIPT_ROOT+'/prostepview/rndSeedFile/download/'+$("#step1_id").data("step1id")+"/"+data[0])
		},
	    onLoad: function(obj)
	    {
	    	var filenames = $("#step1_id").data("rndfiles");
	    	var initfiles = setInterval(function(){
	    		if (typeof obj.createProgress !== "undefined") {
		    		filenames.forEach(function(ele){
		    			obj.createProgress(ele);
		    		});
		    		clearInterval(initfiles);
	    		}
	    	},3000)

	    	//filename&&obj.createProgress(filename);
	        //页面加载时，onLoad回调。如果有需要在页面初始化时显示（比如：文件修改时）的文件需要在此方法中处理
	               //createProgress方法可以创建一个已上传的文件
	    },
	    deleteCallback: function(data,pd)
	    {
	        //文件删除时的回调方法。
	        //如：以下ajax方法为调用服务器端删除方法删除服务器端的文件
	        $.ajax({
	            cache: false,
	            url: $SCRIPT_ROOT+'/prostepview/rndSeedFile/'+$("#step1_id").data("step1id"),
	            type: "DELETE",
	            dataType: "json",
	            contentType:"application/json",
	            data:JSON.stringify({'filename':data[0]}),
	            success: function(data)
	            {
	                if(!data){
	                    pd.statusbar.hide();        //删除成功后隐藏进度条等
	                 }else{
	                    console.log(data.message);  //打印服务器返回的错误信息
	                 }
	              }
	        });
	    },
	    onSuccess: function(files,data,xhr,pd)
	    {
	    	//$(".ajax-file-upload-statusbar").width("600px");
	        //上传成功后的回调方法。本例中是将返回的文件名保到一个hidden类开的input中，以便后期数据处理
	        // if(data&&data.code===0){
	        //     console.log(data);
	        // }
	    }
	});

	$("input[name='rnd_seed_setting']").on('change', function(event) {
		event.preventDefault();
		if($("input[name='rnd_seed_setting']:checked").val()!=3){
			$('#seed_upload_div').css('display','none');
		}else{
			$('#seed_upload_div').css('display','block');
		}

	});

	//Simple version:
	$("button[name='runDefault']").on('click', function(e){
		e.preventDefault();
		$.ajax({
			url: $SCRIPT_ROOT + '/prostepview/trackChanges/' + $("#step1_id").data("step1id"),
			type: 'get',
			dataType: 'JSON',
			data:{},
		  }).done(function(data) {
			//check if the inputs are modified, if they are then ask the user if they want to reset to default values
			if(data.changes.length > 0){
				getUserConfirmation();
			}else{
				$("#mask").addClass('lmask');
				$.ajax({
					cache: false,
					url: 'http://gomredsnappermsetool.fiu.edu:8000/runmse',
					crossDomain: true,
					type: "POST",
					dataType: "json",
					data: JSON.stringify({"process_gen_id":$("#step1_id").data("step1id")}),
					success: function(data)
					{
							$("#mask").removeClass('lmask');
							drawChart(data);
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						$("#mask").removeClass('lmask');
						alert("Error running the model");
					}
				});
			}
		  });
	});

	function getUserConfirmation(){
		//ask user if they want to reset values to default
		$('#myConfirmModal').modal('toggle');
		//if user confirms
		$( "#confirmDefaultBtn" ).click(function() {
			$("#mask").addClass('lmask');
			$.ajax({
				cache: false,
				url: $SCRIPT_ROOT+'/prostepview/resetValues/'+$("#step1_id").data("step1id"),
				type: "PUT",
				dataType: "json",
				data:{},
				success: function(res){
					if(res.status == 1){
						//after values are reset, run the model
						console.log("reset values success");
						$.ajax({
							cache: false,
							url: 'http://gomredsnappermsetool.fiu.edu:8000/runmse',
							crossDomain: true,
							type: "POST",
							dataType: "json",
							data: JSON.stringify({"process_gen_id":$("#step1_id").data("step1id")}),
							success: function(data)
							{
									$("#mask").removeClass('lmask');
									drawChart(data);
									window.location.reload(false); 
							},
							error: function(XMLHttpRequest, textStatus, errorThrown) {
								$("#mask").removeClass('lmask');
								alert("Error running the model");
								window.location.reload(false); 
							}
						});
					}else{
						$("#mask").removeClass('lmask');
						alert("Error occured");
					}
				}
			});
		});
	}
	/*General Inputs end */


	/* Initial population start */
	function getIniPopu(){

        $("#mask").addClass('lmask');
        $.ajax({
	    	url: $SCRIPT_ROOT+'/prostepview/getIniPopuTableData/'+$("#step1_id").data("step1id"),
	    	type: 'get',
	    	dataType: 'JSON',
	    	data: {},
	    })
	    .done(function(result) {
			var inputdata=result.iniPopu||result;
			console.log(inputdata);
			$("#table-ibParam").bootstrapTable({
		    	//url: $SCRIPT_ROOT+'/processview/getTableData/',         //请求后台的URL（*）
		    	//dataType:'json',
		    	data:inputdata,
		        method: 'get',                      //请求方式（*）
		        toolbar: '#toolbar',                //工具按钮用哪个容器
		        striped: true,                      //是否显示行间隔色
		        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		        pagination: false,                   //是否显示分页（*）
		        sortable: false,                     //是否启用排序
		        sortOrder: "asc",                   //排序方式
		        //queryParams: ibParamTable.queryParams,//传递参数（*）
		        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
		        pageNumber:1,                       //初始化加载第一页，默认第一页
		        pageSize: 10,                       //每页的记录行数（*）
		        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
		        search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
		        strictSearch: true,
		        showColumns: false,                  //是否显示所有的列
		        showRefresh: false,                  //是否显示刷新按钮
		        minimumCountColumns: 2,             //最少允许的列数
		        clickToSelect: true,                //是否启用点击选中行
		        //height: 500,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
		        uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
		        showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
		        cardView: false,                    //是否显示详细视图
		        detailView: false,                   //是否显示父子表
		    	columns:[
		    		[
		    			{
		    				title:"Age",
		    				field:"age_1",
		    				editable:false,
		    			},
		    			{
		    				title:"Stock 1 Mean (1000s)",
		    				field:"stock_1_mean",
		    				editable: {
			                    type: 'text',
			                    title: 'Stock 1 Mean (1000s)',
			                    validate: function (v) {
			                        if (isNaN(v)) return 'Stock 1 mean must be number';
			                        var stockmean = parseFloat(v);
			                        if (stockmean <= 0) return 'Stock 1 mean must larger than 0';
				                		}
		                    }
		    			},
		    			{
		    				title:"Stock 2 Mean (1000s)",
		    				field:"stock_2_mean",
		    				editable: {
			                    type: 'text',
			                    title: 'Stock 2 Mean (1000s)',
			                    validate: function (v) {
			                        if (isNaN(v)) return 'Stock 2 mean must be number';
			                        var stockmean = parseFloat(v);
			                        if (stockmean <= 0) return 'Stock 2 mean must larger than 0';
				                	}
		                    }
		    			},
		    		],
		    	],
		    	onEditableSave: function (field, row, oldValue, $el) {
		    		// console.log(row);
		    		// $.ajax({
		      //           type: "post",
		      //           url: $SCRIPT_ROOT+"/prostepview/editTableData",
		      //           data: row,
		      //           dataType: 'json',
		      //       }).done(function(result) {
		      //       	console.log(result);
		      //       	if(result.status=='1'){
		      //       		alert('submit success');
		      //       	}
		      //       });
		    	},
		    });

	    })
	    .fail(function() {
	    	console.log("error");
	    })
	    .always(function() {
	    	console.log("complete");
	    	$("#mask").removeClass('lmask');
	    	$("#table-ibParam").parent('.bootstrap-table').css('margin-bottom', '30px');
	    });

	}
	/* Initial Population end */

	/* Biological Parameters start */
	function getBioParam(){

        $("#mask").addClass('lmask');
        $.ajax({
	    	url: $SCRIPT_ROOT+'/prostepview/getBioParamTableData/'+$("#step1_id").data("step1id"),
	    	type: 'get',
	    	dataType: 'JSON',
	    	data: {},
	    })
	    .done(function(result) {
	    	var inputdata=result.bioParam||result;
			$("#table-bioParam").bootstrapTable({
		    	//url: $SCRIPT_ROOT+'/processview/getTableData/',         //请求后台的URL（*）
		    	//dataType:'json',
		    	data:inputdata,
		        method: 'get',                      //请求方式（*）
		        toolbar: '#toolbar',                //工具按钮用哪个容器
		        striped: true,                      //是否显示行间隔色
		        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		        pagination: false,                   //是否显示分页（*）
		        sortable: false,                     //是否启用排序
		        sortOrder: "asc",                   //排序方式
		        //queryParams: ibParamTable.queryParams,//传递参数（*）
		        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
		        pageNumber:1,                       //初始化加载第一页，默认第一页
		        pageSize: 10,                       //每页的记录行数（*）
		        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
		        search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
		        strictSearch: true,
		        showColumns: false,                  //是否显示所有的列
		        showRefresh: false,                  //是否显示刷新按钮
		        minimumCountColumns: 2,             //最少允许的列数
		        clickToSelect: true,                //是否启用点击选中行
		        //height: 500,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
		        uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
		        showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
		        cardView: false,                    //是否显示详细视图
		        detailView: false,                   //是否显示父子表
		    	columns:[
		    		[
		    			{
		    				title:"Age",
		    				field:"age_1",
		    				editable:false,
		    			},
		    			{
		    				title:"Stock 1 Weight-at-age (kg)",
		    				field:"weight_at_age_1",
		    				editable: {
			                    type: 'text',
			                    title: 'Stock 1 Weight-at-age',
			                    validate: function (v) {
			                        if (isNaN(v)) return 'Stock 1 Weight-at-age must be number';
			                        var stockmean = parseFloat(v);
			                        if (stockmean <= 0) return 'Stock 1 Weight-at-age must larger than 0';
				                   }
		                    }
		    			},
		    			{
		    				title:"Stock 1 Fecundity</br>(# of eggs)",
		    				field:"fec_at_age_1",
		    				editable: {
			                    type: 'text',
			                    title: 'Stock 1 Fecundity',
			                    validate: function (v) {
			                        if (isNaN(v)) return 'Stock 1 Fecundity must be number';
			                        var stockmean = parseFloat(v);
			                        if (stockmean <= 0) return 'Stock 1 Fecundity must larger than 0';
				                  }
		                    }
		    			},
		    			{
		    				title:"Stock 2 Weight-at-age (kg)",
		    				field:"weight_at_age_2",
		    				editable: {
			                    type: 'text',
			                    title: 'Stock 2 Weight-at-age',
			                    validate: function (v) {
			                        if (isNaN(v)) return 'Stock 2 Weight-at-age must be number';
			                        var stockmean = parseFloat(v);
			                        if (stockmean <= 0) return 'Stock 2 Weight-at-age must larger than 0';
				                	}
		                    }
		    			},
		    			{
		    				title:"Stock 2 Fecundity</br>(# of eggs)",
		    				field:"fec_at_age_2",
		    				editable: {
			                    type: 'text',
			                    title: 'Stock 2 Fecundity',
			                    validate: function (v) {
			                        if (isNaN(v)) return 'Stock 2 Fecundity must be number';
			                        var stockmean = parseFloat(v);
			                        if (stockmean <= 0) return 'Stock 2 Fecundity must larger than 0';
				                	}
		                    }
		    			},
		    		],
		    	],
		    	onEditableSave: function (field, row, oldValue, $el) {
		    		// console.log(row);
		    		// $.ajax({
		      //           type: "post",
		      //           url: $SCRIPT_ROOT+"/prostepview/editTableData",
		      //           data: row,
		      //           dataType: 'json',
		      //       }).done(function(result) {
		      //       	console.log(result);
		      //       	if(result.status=='1'){
		      //       		alert('submit success');
		      //       	}
		      //       });
		    	},
		    });

	    })
	    .fail(function() {
	    	console.log("error");
	    })
	    .always(function() {
	    	console.log("complete");
	    	$("#mask").removeClass('lmask');
	    	$("#table-bioParam").parent('.bootstrap-table').css('margin-bottom', '30px');
	    });

	}
	/* 	Biological Parameters end	 */

	/* Natural Mortality start */


	function getMortality(){

        $("#mask").addClass('lmask');
        $.ajax({
	    	url: $SCRIPT_ROOT+'/prostepview/getMortalityTableData/'+$("#step1_id").data("step1id"),
	    	type: 'get',
	    	dataType: 'JSON',
	    	data: {},
	    })
	    .done(function(result) {
	    	var inputdata=result.mortality||result;
			$("#table-mortality").bootstrapTable({
		    	//url: $SCRIPT_ROOT+'/processview/getTableData/',         //请求后台的URL（*）
		    	//dataType:'json',
		    	data:inputdata,
		        method: 'get',                      //请求方式（*）
		        toolbar: '#toolbar',                //工具按钮用哪个容器
		        striped: true,                      //是否显示行间隔色
		        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		        pagination: false,                   //是否显示分页（*）
		        sortable: false,                     //是否启用排序
		        sortOrder: "asc",                   //排序方式
		        //queryParams: ibParamTable.queryParams,//传递参数（*）
		        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
		        pageNumber:1,                       //初始化加载第一页，默认第一页
		        pageSize: 10,                       //每页的记录行数（*）
		        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
		        search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
		        strictSearch: true,
		        showColumns: false,                  //是否显示所有的列
		        showRefresh: false,                  //是否显示刷新按钮
		        minimumCountColumns: 2,             //最少允许的列数
		        clickToSelect: true,                //是否启用点击选中行
		        //height: 500,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
		        uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
		        showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
		        cardView: false,                    //是否显示详细视图
		        detailView: false,                   //是否显示父子表
		    	columns:[
		    		[
		    			{
		    				title:"Age",
		    				field:"age_1",
		    				editable:false,
		    			},
		    			{
		    				title:"Mean M for Stock 1 (year<sup>-1</sup>)",
		    				field:"mean_1",
		    				editable: {
			                    type: 'text',
			                    title: 'Mean',
			                    validate: function (v) {
			                        if (isNaN(v)) return 'Mean must be number';
			                        var stockmean = parseFloat(v);
			                        if (stockmean <= 0) return 'Mean must larger than 0';
				                	}
		                    }
		    			},
		    			/*
		    			{
		    				title:"CV 1 (Log-normal Dist.)",
		    				field:"cv_mean_1",
		    				editable: {
			                    type: 'text',
			                    title: 'CV (Log-normal Dist.)',
			                    validate: function (v) {
			                        if (isNaN(v)) return 'CV must be number';
			                        var stockmean = parseFloat(v);
			                        if (stockmean <= 0) return 'CV must larger than 0';
				                }
		                    }
		    			},
		    			*/
		    			{
		    				title:"Mean M for Stock 2 (year<sup>-1</sup>)",
		    				field:"mean_2",
		    				editable: {
			                    type: 'text',
			                    title: 'Mean',
			                    validate: function (v) {
			                        if (isNaN(v)) return 'Mean must be number';
			                        var stockmean = parseFloat(v);
			                        if (stockmean <= 0) return 'Mean must larger than 0';
				                	}
		                    }
		    			},
		    		],
		    	],
		    	onEditableSave: function (field, row, oldValue, $el) {
		    		// console.log(row);
		    		// $.ajax({
		      //           type: "post",
		      //           url: $SCRIPT_ROOT+"/prostepview/editTableData",
		      //           data: row,
		      //           dataType: 'json',
		      //       }).done(function(result) {
		      //       	console.log(result);
		      //       	if(result.status=='1'){
		      //       		alert('submit success');
		      //       	}
		      //       });
		    	},
		    });

	    })
	    .fail(function() {
	    	console.log("error");
	    })
	    .always(function() {
	    	console.log("complete");
	    	$("#mask").removeClass('lmask');
	    	$("#table-mortality").parent('.bootstrap-table').css('margin-bottom', '30px');
	    });

	}

	/* Natural Mortality end */

	/* Recruitment start */
	function initRecrument(){

		//disbale everything but the From Historical and From Formula radio buttons
		$("#form-recruitment input[name='fromHisStock1'],input[name='fromFmlStock1'],input[name='historySt1'],input[name^='hst1'],"+
		"input[name='historySt1_early'],input[name^='hst1_early'],input[name='formulaStock1'], button[name='calc_btn'], input[name^='fml1']").prop('disabled','disabled').css("background-color", "");

		//if "From Historical" is checked
		if($("input[name='recruitTypeStock1']:checked").val()==1){

			//enable "Include Years Before" and "Exclude years Before" radio buttons
			$("#form-recruitment input[name='fromHisStock1']").prop('disabled','');
			//if "Include Years Before" is selceted by default, fix the checked value and enable the inner radio buttons
			if(!$("input[name='fromHisStock1']:checked").val()||$("input[name='fromHisStock1']:checked").val()==1){
				$("#hisin1984").prop('checked', true);
				$("input[name='historySt1_early']").prop('disabled','');
				initHistroySt('_early');
			}else{
				$("input[name='historySt1']").prop('disabled','');
				initHistroySt('');
			}

		}
		//if "From Formula" is checked
		else if($("input[name='recruitTypeStock1']:checked").val()==2){
			//remove button classes, enable inner radio buttons and inputs
			$("button[name='calc_btn']").removeClass("btn-primary");
			$("button[name='calc_btn']").addClass("btn-disable");
			$("#form-recruitment input[name='fromFmlStock1']").prop('disabled','');
			$("#form-recruitment input[name='formulaStock1']").prop('disabled','');
			$("input[name^='fml1Mbhm']").prop('readonly',true).prop('disabled','disabled').css('background-color', 'white');
			$("#fml1radioBHM").prop('checked', true);
			//check whether R0 "include years before" or "exclude years before" is currently checked
			if(!$("input[name='fromFmlStock1']:checked").val()||$("input[name='fromFmlStock1']:checked").val()==1){
				//before
				$("#fmlin1984").prop('checked', true);
				$("input[name='fml1MbhmR0']").prop('disabled','disabled').css('background-color', '');
				$("input[name='fml1MbhmR0_early']").prop('readonly',true).prop('disabled','disabled').css('background-color', 'white');
			}else if($("input[name='fromFmlStock1']:checked").val()==2){
				//after
				$("input[name='fml1MbhmR0']").prop('readonly',true).prop('disabled','disabled').css('background-color', 'white');
				$("input[name='fml1MbhmR0_early']").prop('disabled','disabled').css('background-color', '');
			}

		}

	}

	function initHistroySt(early){
		//diable all input
		$("input[name^='hst1']").prop('disabled','disabled').css('background-color', '');
		$("button[name='calc_btn']").prop('disabled', "disabled");
		$("button[name='calc_btn']").removeClass("btn-primary");
		$("button[name='calc_btn']").addClass("btn-disable");

			//enable input depending on radio button selected
		$("input[name='historySt1"+early+"']:checked").val()==1&&$("#hst1"+"_mean"+early).prop('readonly',true).css('background-color', 'white');

		//if other percentile is selected, enable input
		if($("input[name='historySt1"+early+"']:checked").val()==2){
			$("#hst1"+"_other"+early).prop('disabled',"");
			$("#hst1_cal"+early).prop('disabled',"");
			$("#hst_btn"+early).prop('disabled', "");
			$("#hst_btn"+early).removeClass("btn-disable");
			$("#hst_btn"+early).addClass("btn-primary");
		}
	}

	$("input[name='recruitTypeStock1']").on('change', function(event) {
		event.preventDefault();
		/* Act on the event */
		initRecrument();

	});

	$("input[name='fromHisStock1']").on('change', function(event) {
		event.preventDefault();
		//enable and disable corresponding set of radio buttons
		if($("input[name='fromHisStock1']:checked").val()==1){
			$("input[name='historySt1']").prop('disabled','disabled');
			$("input[name='historySt1_early']").prop('disabled','');
			initHistroySt("_early");
		}else if($("input[name='fromHisStock1']:checked").val()==2){
			$("input[name='historySt1']").prop('disabled','');
			$("input[name='historySt1_early']").prop('disabled','disabled');
			initHistroySt("");
		}

	});

	$("input[name='historySt1']").on('change', function(event) {
		initHistroySt('');
	});

	$("input[name='historySt1_early']").on('change', function(event) {
		initHistroySt('_early');
	});

	//auto calculate percentages from user input
	$('#stock1_amount').on('input',function(e) {
		cur_value = parseFloat($(this).val());
		if(cur_value>=0&&cur_value<=100){
			var result = 100 - cur_value;
			$('#stock2_amount').val(Number(result.toFixed(2)));
		}

	});

	//button to calculate other percentile
	$("button[name='calc_btn']").on('click', function(event) {
		var percentile = 0;
		var early = true;
		if(this.id === "hst_btn_early" && $("#form-recruitment").valid()){
			 percentile = $('#hst1_other_early').val();
			 early = true;
			 calcPercentile(early, percentile);
		}
		else if(this.id == "hst_btn" && $("#form-recruitment").valid()){
				percentile = $('#hst1_other').val();
				early = false;
				calcPercentile(early, percentile);
		}
		else{
			  $(this).closest("div").next("div").find("input").val(0);
		}
	});


	function calcPercentile(isEarly, percentile){
		$.ajax({
			cache: false,
			url: $SCRIPT_ROOT+'/prostepview/calc',
			type: "post",
			dataType: "json",
			contentType:"application/json",
			data: JSON.stringify({"early":isEarly,"percentile":percentile}),
			success: function(data)
			 {
				 if(isEarly){
						$("input[name='hst1_cal_early']").val(Number(data.result.toFixed(2)));
					}
				 else {
						$("input[name='hst1_cal']").val(Number(data.result.toFixed(2)));
				 }

			}
		});

	}

	$("input[name='fromFmlStock1']").on('change', function(event) {
		event.preventDefault();
		/* Act on the event */
		if($("input[name='fromFmlStock1']:checked").val()==1){
			$("input[name='fml1MbhmR0']").prop('disabled','disabled').css('background-color', '');
			$("input[name='fml1MbhmR0_early']").prop('readonly',true).prop('disabled','disabled').css('background-color', 'white');
		}else if($("input[name='fromFmlStock1']:checked").val()==2){
			$("input[name='fml1MbhmR0']").prop('readonly',true).prop('disabled','disabled').css('background-color', 'white');
			$("input[name='fml1MbhmR0_early']").prop('disabled','disabled').css('background-color', '');
		}
	});

	/* Recruitment end */

	/*	Management II start	*/

	$('#sec_recreational').on('input',function(e) {
		cur_value = parseFloat($(this).val());
		if(cur_value>=0&&cur_value<=100){
			var result = 100 - cur_value;
			$('#sec_commercial').val(Number(result.toFixed(2)));
		}

	});

	$('#sec_hire').on('input',function(e) {
		cur_value = parseFloat($(this).val());
		if(cur_value>=0&&cur_value<=100){
			var result = 100 - cur_value;
			$('#sec_private').val(Number(result.toFixed(2)));
		}

	});

	$('#sec_headboat').on('input',function(e) {
		cur_value = parseFloat($(this).val());
		if(cur_value>=0&&cur_value<=100){
			var result = 100 - cur_value;
			$('#sec_charterboat').val(Number(result.toFixed(2)));
		}

	});

	$('#p_e').on('input',function(e) {
		cur_value = parseFloat($(this).val());
		if(cur_value>=0&&cur_value<=100){
			var result = 100 - cur_value;
			$('#p_w').val(Number(result.toFixed(2)));
		}

	});


	/*	Management II end	*/

	/*	Management V  start	*/

	function initSeasonLength(){
		if($("input[name='season_fed_forhire']:checked").val()==1){
			$("#fed_forhire_length").prop('disabled','disabled');
		}else{
			$("#fed_forhire_length").prop('disabled','');
		}

		if($("input[name='season_private']:checked").val() == 1){
			$("#AL_private_length").prop('disabled','disabled');
			$("#FL_private_length").prop('disabled','disabled');
			$("#LA_private_length").prop('disabled','disabled');
			$("#MS_private_length").prop('disabled','disabled');
			$("#TX_private_length").prop('disabled','disabled');

		}else{
			$("#AL_private_length").prop('disabled','');
			$("#FL_private_length").prop('disabled','');
			$("#LA_private_length").prop('disabled','');
			$("#MS_private_length").prop('disabled','');
			$("#TX_private_length").prop('disabled','');
		}
	}

	//call this function when bag limits are changed in mgmt options 3, to set values of estimates
	function initCatchRate(){
		var list = $("button[name='estimateBtn']");

		for(let i = 0; i < list.length; i++){
			var $btn = $(list[i]);
			var multiplier_selector = $btn.data("multiplier");
			var multiplier = $("#" + multiplier_selector).text()/2;

			//get selector for input based on data attribute
			var base_selector= $btn.data("baseid");
			var estimate_selector= $btn.data("estid");

			//get base and estimate input elements
			var base_element = $("#"+base_selector);
			var estimate_element = $("#"+estimate_selector);

			//calculate estimate and display to user
			var result = multiplier * base_element.val();
			estimate_element.val(result);
		}
	}

	//button to calculate estimates on click
	$("button[name='estimateBtn']").on('click', function(event) {
		 var multiplier_selector = $(this).data("multiplier");
		 var multiplier = $("#" + multiplier_selector).text()/2;
		 //get selector for input based on data attribute
		 var base_selector= $(this).data("baseid");
		 var estimate_selector= $(this).data("estid");

		 //get base and estimate input elements
		 var base_element = $("#"+base_selector);
		 var estimate_element = $("#"+estimate_selector);

		 //calculate estimate and display to user
		 var result = multiplier * base_element.val();
		 estimate_element.val(result);
	});

	$("input[name='season_fed_forhire']").on('change', function(event){
		event.preventDefault();
		//Federal forhire component and private angling components must coordinate
		if($("input[name='season_fed_forhire']:checked").val()==1){
			$("#season_private_ACT").prop('checked', "true");
		}else{
			$("#season_private_input").prop('checked', "true");
		}

		initSeasonLength();
		
	});

	$("input[name='season_private']").on('change', function(event){
		event.preventDefault();
		//Federal forhire component and private angling components must coordinate
		if($("input[name='season_private']:checked").val() == 1){
			$("#season_fed_ACT").prop('checked', "true");
		}else{
			$("#season_fed_input").prop('checked', "true");
		}

		initSeasonLength();
	});

	/*	Management V end	*/


	/*	Management VII start	*/
	//auto calculate texas based on the rest of the states
	$("#alabama , #louisiana, #mississippi, #florida").on('input', function(event) {
			var sum = parseFloat($("#alabama").val()) + parseFloat($("#florida").val()) + parseFloat($("#louisiana").val()) + parseFloat($("#mississippi").val());
			sum = 100 - sum;
			sum = Number(sum.toFixed(3));
			$("#texas").val(sum);
			if(!validateStateSum()){
				$("#states-error").removeAttr("hidden");
			}else{
				$("#states-error").attr("hidden", true);
			}
	});
	/*	Management VII end	*/


	/*********************** Initialization **************************/
	//$("#start_projection").find("input").val(moment('2017-01-01').format('YYYY-MM-DD'));
	$(document).ready(function() {

		getIniPopu();
		getBioParam();
		getMortality();
		initRecrument();
		initCatchRate();
		initSeasonLength();

	});

  /*********************** Initialization End **************************/


	//



    /*let ibParamTable = new Object();
    //得到查询的参数
    ibParamTable.queryParams = function (params) {
        var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            limit: params.limit,   //页面大小
            offset: params.offset,  //页码
            departmentname: $("#txt_search_departmentname").val(),
            statu: $("#txt_search_statu").val()
        };
        //return temp;
    };*/

		//activate tooltips to elements that have the class "hints"
		$(document).ready(function(){
			$('[data-toggle="tooltip"]').tooltip();

			// //image appears in tooltip
			// $('#sec_pstar').tooltip({html: true, placement:'right'});

			var isSimple = $("#step1_id").data("simple");
			if(isSimple == "True"){
				$(".saveBtn:first").text("Next Step");
			}
		});

});
