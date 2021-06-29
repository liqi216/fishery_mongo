
$(function() {


	$("input[name='propublic']").on('change', function(e) {
		  console.log("Boxes checked: " + $("input[name='propublic']:checked").length );
		  var btn = $(this);
			var id = $(this).data("proid");
	 		$.ajax({
	             cache: false,
	             url: $SCRIPT_ROOT+'/prostepview/propublic/'+id,
	             type: "PUT",
	             dataType: "json",
	             data: {"public":btn.prop('checked'),"confirm":"false"},
	             success: function(data){
								 if(data.status==1){
										 console.log("save process_public successfully");
								 }else if (data.status == 3){
									 btn.bootstrapToggle('off');
									 ab_alert("Can only make three public!");
								 }else{
									 //status 2 means warn user that they are about to reach limit
									 $('#myConfirmModal').modal('toggle');
									 //if user confirms
									 $( "#confirmPublicBtn" ).click(function() {
										 $.ajax({
											 cache:false,
											 url: $SCRIPT_ROOT+'/prostepview/propublic/'+id,
											 type: "PUT",
											 dataType: "json",
											 data: {"public":btn.prop('checked'),"confirm":"true"},
											 success: function(data){
												 if(data.status == 1){
													 console.log("save process_public successfully");
												 }
											 }
										 });
									 });

									 //If user chooses to cancel
									 $("#cancelPublicBtn").click(function(){
											btn.bootstrapToggle('off');
									 });
								 }
							 }
	         });

		 console.log('public: ' + $(this).prop('checked'));

	});


	//not used, kept just in case

	$("input[name='prosimple']").change(function(event) {
		console.log('simple: ' + $(this).prop('checked'));
		$.ajax({
            cache: false,
            url: $SCRIPT_ROOT+'/prostepview/prosimple/'+$(this).data("proid"),
            type: "PUT",
            dataType: "json",
            data: {"simple":$(this).prop('checked')},
            success: function(data)
            {
                 if(data.status=1){
                     console.log("save process_simple successfully");
                 }
            }
        });
	});



	// Adds tooltip to scenario name link,  used this for testing out tooltip
	var links = $("tr").find('td:nth-child(2)').find('a');
	links.attr('data-toggle', 'tooltip');
	links.attr('data-original-title', 'Click to view scenario steps');

	$(document).ready(function(){
		$('[data-toggle="tooltip"]').tooltip();
	});




})
