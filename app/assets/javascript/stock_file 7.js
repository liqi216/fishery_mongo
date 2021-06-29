$(function() {

	$("input[name='defaultfile']").click(function(event) {
		 var cnfrm = confirm('Are you sure ? You want to set this file as default ? This may take a few minutes.');
             if(cnfrm == true){

             	$("#mask").addClass('lmask');

             	var fileid = $(this).data('fileid');
             	var sfid = $(this).data('sfid');
             	var ssb_msy = $(this).data('ssbmsy');
             	var f_msy = $(this).data('fmsy');
				 console.log(fileid);
				 var defaultBtn = this;
             	$.ajax({
		            cache: false,
		            url: 'http://gomredsnappermsetool.fiu.edu:8000/defaultFile',
		            crossDomain: true,
		            type: "POST",
		            dataType: "json",
		            data: JSON.stringify({"file_id":fileid,"store_path":"/home/msedata/","ssb_msy":ssb_msy,"f_msy":f_msy}),
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

							},
				        });
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						$("#mask").removeClass('lmask');
						alert("Error setting stock file as default");
						defaultBtn.checked = false;
						location.reload();
					}
		        });

             }else{
                 return false;
             }
	});
})
