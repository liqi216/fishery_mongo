$(function() {

	    $.ajax({
	    	url: $SCRIPT_ROOT+'/prostepview/getVisitors',
	    	type: 'get',
	    	dataType: 'JSON',
	    	data: {},
	    })
	    .done(function(result) {

	    	$('#vistors_count').easy_number_animate({
			  start_value: 0,
			  end_value: result.login_count,
			  duration: 1000,
			  delimiter: ','
			});
			$('#registed_count').easy_number_animate({
			  start_value: 0,
			  end_value: result.registed_count,
			  duration: 1000,
			  delimiter: ','
			});
			$('#mse_count').easy_number_animate({
			  start_value: 0,
			  end_value: result.mse_count,
			  duration: 1000,
			  delimiter: ','
			});

	    })

})
