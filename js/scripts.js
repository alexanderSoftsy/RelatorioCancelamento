
function scroll_to_class(element_class, removed_height) {
	var scroll_to = $(element_class).offset().top - removed_height;
	if($(window).scrollTop() != scroll_to) {
		$('html, body').stop().animate({scrollTop: scroll_to}, 0);
	}
}

function bar_progress(progress_line_object, direction) {
	var number_of_steps = progress_line_object.data('number-of-steps');
	var now_value = progress_line_object.data('now-value');
	var new_value = 0;
	if(direction == 'right') {
		new_value = now_value + ( 100 / number_of_steps );
	}
	else if(direction == 'left') {
		new_value = now_value - ( 100 / number_of_steps );
	}
	progress_line_object.attr('style', 'width: ' + new_value + '%;').data('now-value', new_value);
}

jQuery(document).ready(function() {
	
    /*
        Fullscreen background
    
    $.backstretch("resources/assets/img/backgrounds/1.jpg");
    
    $('#top-navbar-1').on('shown.bs.collapse', function(){
    	$.backstretch("resize");
    });
    $('#top-navbar-1').on('hidden.bs.collapse', function(){
    	$.backstretch("resize");
    });*/
    
    /*
        Form
    */
    $('.f1 fieldset:first').fadeIn('slow');
    
    $('.f1 input[type="text"], .f1 input[type="tel"], .f1 input[type="password"], .f1 textarea , .f1 select').on('focus', function() {
    	$(this).removeClass('input-error');
    });
    
    
    
    // previous step
    $('.f1 .btn-previous').on('click', function() {
    	// navigation steps / progress steps
    	var current_active_step = $(this).parents('.f1').find('.f1-step.active');
    	var progress_line = $(this).parents('.f1').find('.f1-progress-line');
    	
    	$(this).parents('fieldset').fadeOut(400, function() {
    		// change icons
    		current_active_step.removeClass('active').prev().removeClass('activated').addClass('active');
    		// progress bar
    		bar_progress(progress_line, 'left');
    		// show previous step
    		$(this).prev().fadeIn();
    		// scroll window to beginning of the form
			scroll_to_class( $('.f1'), 20 );
    	});
    });
    
 // submit
    $('.f1').on('submit', function(e) {
    	
//    	var next_step = true;
    	
    	// fields validation
    	$(this).find('input[type="text"], input[type="password"], textarea , select, input[type="checkbox"], input[type="tel"]').each(function() {
    		if($(this).attr('id') == "contrato" && $(this).is(':checked') == false){
    			e.preventDefault();
    			$("#textoContrato").attr('style','color:indianred');
    			$("#erroContrato").show();
//    			next_step = false;
    		}
    		
    		if( $(this).val() == "" && this.id != 'nomeSocial' && this.id != 'complemento' ) {
    			e.preventDefault();
    			$(this).addClass('input-error');
//    			next_step = false;
    		}
    		else {
    			$(this).removeClass('input-error');
    			if($(this).attr('id') == "contrato" && $(this).is(':checked') == true){
    				$("#textoContrato").attr('style','');
        			$("#erroContrato").hide();
    			}
    		}
    	});
    	// fields validation
//    	if(next_step){
//    		return;
//    	}
    });
    
});
