$(function() {

	$("input[name='defaultfile']").click(function(event) {
		 var cnfrm = confirm('Are you sure ? You want to set this file as default ?');
             if(cnfrm == true){

             	$("#mask").addClass('lmask');

             	var fileid = $(this).data('fileid');
             	var sfid = $(this).data('sfid');
             	var ssb_msy = $(this).data('ssbmsy');
             	var f_msy = $(this).data('fmsy');
             	console.log(fileid);

             	$.ajax({
		            cache: false,
		            url: 'http://localhost:8000/defaultFile',
		            crossDomain: true,
		            type: "POST",
		            dataType: "json",
		            data: JSON.stringify({"file_id":fileid,"store_path":"~/msedata/","ssb_msy":ssb_msy,"f_msy":f_msy}),
		            success: function(data)
		            {
		                 $("#mask").removeClass('lmask');
		                 $.ajax({
				            cache: false,
				            url: $SCRIPT_ROOT+'/prostepview/setDefault/'+sfid,
				            type: "PUT",
				            dataType: "json",
				            data: {},
				            success: function(data)
				            {

				            }
				        });
		            }
		        });

             }else{
                 return false;
             }
	});
})
