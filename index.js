$(document).ready(function() { 
    var validaSessao = localStorage.getItem('valido');
    if (validaSessao != 'sim'){ 
        
        window.location.href="index.html"
    }
    
 
    $('.bg-loading').fadeOut();
  });

$("#telaInicial").click(function (){    
        window.location.href="index.html"
  });

