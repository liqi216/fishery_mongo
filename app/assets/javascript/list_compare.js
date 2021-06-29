// This js work is based on:
			// Copyright (c) 2014, Serge S. Koval and contributors. See AUTHORS
			// for more details.
			//

			//------------------------------------------------------
			// AdminActions holds methods to handle UI for actions
			//------------------------------------------------------
			var AdminActions = function() {
				var checkboxValues = JSON.parse(localStorage.getItem('checkboxValues')) || {};
				var $checkboxes = $(":checkbox");

				var chkAllFlag = false;
				var multiple = false;
				var single = false;
				var action_name = '';
				var action_url = '';
				var action_confirmation = '';
				var row_checked_class = 'success';
				var compareIds = [];
				var selected = numberSelected();  //initial count of number selected based on storage

				this.execute_multiple = function(name, confirmation) {
					multiple = true;
					action_name = name;
					action_confirmation = confirmation;
					//var selected = $('input.action_check:checked').size();

					for (var key in checkboxValues) {
						if (key != "check_all" && checkboxValues.hasOwnProperty(key)) {
							if(checkboxValues[key] == true){
							    compareIds.push(key);
							}
						}
					}


					if (selected == 0) {
						ab_alert('No row selected');
						return false;
					}

					if (selected < 4 ) {
						ab_alert('at least 4 rows must be selected');
						return false;
					}

					if (selected > 7) {
						ab_alert('No more than 7 row can be selected');
						return false;
                    }
                    

					form_submit();

				};

				this.execute_single = function(url, confirmation) {
					single = true;
					action_url = url;
					action_confirmation = confirmation;

					if (!!confirmation) {
						$('#modal-confirm').modal('show');
					}
					else {
						window.location.href = action_url;
                    }
                    
				};

				function form_submit() {
					// Update hidden form and submit it
					var form = $('#action_form');
					$('#action', form).val(action_name);

					$('input.submit', form).remove();
					// $('input.action_check:checked').each(function() {
					//     form.append($(this).clone());
					// });

                    var temp = $('input.action_check:checked')[0];
                    compareIds.forEach((id, i) => {
                      var element = temp.cloneNode( true );
                      element.id= id;
                      element.value = id;
                      element.className = 'submit';
                      console.log(element);
                      form.append(element);
                    });

                    
                    $('.action_check').prop('checked', false).trigger("change");
                    $('.action_check_all').prop('checked', false);
                    localStorage.removeItem("checkboxValues");
                    checkboxValues = {};

					form.submit();

					return false;
				}

				//----------------------------------------------------
				// Event for checkbox with class "action_check_all"
				// will check all checkboxes with class "action_check
				//----------------------------------------------------
				$('.action_check_all').click(function() {
                    $('.action_check').prop('checked', !chkAllFlag).trigger("change");

                    chkAllFlag = !chkAllFlag;

					selected = numberSelected();
                    $("#selectedCount").text(selected);
                    
				});

				//----------------------------------------------------
				// Event for checkbox with class "action_check"
				// will add class 'active' to row
				//----------------------------------------------------
				$('.action_check').change(function() {
                    //add or remove green highlight on row
					var thisClosest = $(this).closest('tr'),
					checked = this.checked;
                    $(this).closest('tr').add(thisClosest )[checked ? 'addClass' : 'removeClass'](row_checked_class);

                    //add scenario id to local storage to keep track of selected
                    checkboxValues[this.id] = this.checked;
                    localStorage.setItem("checkboxValues", JSON.stringify(checkboxValues));

                    //update selected number
					selected = numberSelected();
                    $("#selectedCount").text(selected);

				});

				//------------------------------------------
				// Event for modal OK button click (confirm.html)
				// will submit form or redirect
				//------------------------------------------
				$('#modal-confirm-ok').on('click', function(e) {
					if (multiple) {
						form_submit();
					}
					if (single) {
						window.location.href = action_url;
					}
				});

				//------------------------------------------
				// Event for modal show (confirm.html)
				// will replace modal inside text (div class modal-text) with confirmation text
				//------------------------------------------
				$('#modal-confirm').on('show.bs.modal', function(e) {
					if (multiple || single) {
						$('.modal-text').html(action_confirmation);
					}
				});


				//on load
				$.each(checkboxValues, function(key, value) {
					var $this = $("#" + key);
					$this.prop('checked',value);
					if($this.hasClass('action_check')){
						//if row is set checked in local storage, check it in the UI and add the selected class
						var checked = $this.prop('checked');
						var thisClosest = $this.closest('tr');
						$this.closest('tr').add(thisClosest )[checked ? 'addClass' : 'removeClass'](row_checked_class);
                    }
                    
					//set counter on UI
					$("#selectedCount").text(selected);
                });
                
                //if all are checked on page, check the check all input
                if($(".action_check:checked").length == $(".action_check").length){
                    $('.action_check_all').prop('checked', true);
                    chkAllFlag = true;
                }

				function numberSelected(){
					var selected = 0;
					for (var key in checkboxValues) {
						if (key != "check_all" && checkboxValues.hasOwnProperty(key)) {
							if(checkboxValues[key] == true){
								selected++;
							}
						}
					}
					return selected;
				}

			};
