// Função utilitária para pegar parâmetros da URL
function getSearchParams(k){
    var p={};
    location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){p[k]=v})
    return k?p[k]:p;
}

// Variáveis globais de data
var dataInicio = '';
var dataFim = '';

// --- CONFIGURAÇÃO DA API ---

// (A) Localhost (Comentado)
// var urlBase = "http://localhost:8080/api-relatorio-cancelamento/";

// (B) Produção (ATIVA - Aponta para o servidor da Sumaré)
var urlBase = "https://api-relatorios.sumare.edu.br/api-relatorio-cancelamento/";

// (C) Automático (COMENTADO para não estragar a URL de produção acima)
// var pathName = window.location.pathname;
// var contexto = pathName.substring(0, pathName.indexOf("/", 2)); 
// var urlBase = (contexto === "" || contexto === "/") ? "/" : contexto + "/";

console.log("URL Base definida em comum.js:", urlBase);