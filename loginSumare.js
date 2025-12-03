var urlbase = 'https://api-relatorios.sumare.edu.br/api-rel-split'
$(document).ready(function() {
	localStorage.clear();
    $("#erro").hide();
});

$( "#btnLogin" ).click(function() {
	if($("#login").val() == null || $("#login").val() == undefined || $("#login").val() == ""
	 || $("#senha").val() == null || $("#senha").val() == undefined || $("#senha").val() == "")  
	{
		$("#erro").fadeIn();
	}
	else{
		$.ajax({
        	type: "GET",
        	url: urlbase + '/login/interno?login='+$("#login").val()+'&senha='+$("#senha").val(),
        }).done(function(data) {
			if(data!='N'){
                
            localStorage.setItem('valido','sim'); 
                
				window.location.href = "menu.html";
                        }
			else{
				$("#erro").fadeIn();
			}
		});
	}

});