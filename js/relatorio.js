// A variável 'urlBase' vem do arquivo comum.js (carregado antes no HTML)
// Variável global para armazenar todos os dados para exportação
var listaGlobal = [];

$(document).ready(function() {
    // 1. Segurança: Verifica login
    var sessao = localStorage.getItem('sessao_valida');
    if (sessao !== 'sim') {
        window.location.href = "index.html";
        return;
    }

    // 2. Botão Sair
    $("#btnSair").click(function() {
        localStorage.removeItem('sessao_valida');
        window.location.href = "index.html";
    });

    // 3. Botão Exportar Excel (Usa a listaGlobal completa)
    $("#btnExport").click(function() {
        if (!listaGlobal || listaGlobal.length === 0) {
            alert("Não há dados para exportar. Faça uma busca primeiro.");
            return;
        }
        exportarDadosCompletos(listaGlobal);
    });

    // 4. Botão Buscar
    $("#formBusca").submit(function(e) {
        e.preventDefault();
        
        // Pega os valores (podem vir vazios, sem problema)
        var dtInicio = $("#dtIni").val();
        var dtFim = $("#dtFim").val();

        // Chama a função de carga. O Java vai tratar se as datas vierem vazias.
        carregarRelatorio(dtInicio, dtFim);
    });
});

function carregarRelatorio(dtIni, dtFim) {
    $("#loading").fadeIn();
    $("#tabelaContainer").empty();

    var urlApi = urlBase + "relatorio";
    console.log("Buscando em:", urlApi, "Inicio:", dtIni, "Fim:", dtFim);

    $.ajax({
        type: "GET",
        url: urlApi,
        data: {
            dtIni: dtIni, // Se estiver vazio, o jQuery envia vazio
            dtFim: dtFim
        },
        success: function(dados) {
            // Guarda os dados na variável global para o Excel usar depois
            listaGlobal = dados;

            if (!dados || dados.length === 0) {
                $("#loading").fadeOut();
                $("#tabelaContainer").html('<div class="alert alert-warning text-center m-3">Nenhum registro encontrado.</div>');
                return;
            }

            montarTabela(dados);
            $("#loading").fadeOut();
        },
        error: function(xhr) {
            $("#loading").fadeOut();
            console.error("Erro:", xhr);
            alert("Erro ao buscar dados. Verifique se a API está respondendo.");
        }
    });
}

function montarTabela(dados) {
    var colunas = {
        ra: 'RA',
        nome: 'Nome do Aluno',
        email: 'E-mail',
        telefone: 'Telefone',
        curso: 'Curso',
        serie: 'Série',
        polo: 'Polo',
        cdUnidade: 'Unid.',
        dtSolicitacao: 'Data Solicit.'
    };

    $('#tabelaContainer').tableSortable({
        data: dados,
        columns: colunas,
        searchField: '#searchField',
        rowsPerPage: 25,  // Exibe 25 linhas por vez
        pagination: true,
        tableClass: 'table table-hover table-striped table-bordered',
        onPaginationChange: function(nextPage, setPage) {
            setPage(nextPage);
        }
    });
}

// Função auxiliar para criar uma tabela invisível com TODOS os dados e exportar
function exportarDadosCompletos(dados) {
    // Cria um elemento table em memória
    var table = document.createElement("table");
    
    // Cabeçalho
    var thead = table.createTHead();
    var row = thead.insertRow();
    // Cabeçalhos que aparecerão no Excel
    var headers = ["RA", "Nome", "E-mail", "Telefone", "Curso", "Série", "Polo", "Unidade", "Data Solicit."];
    headers.forEach(text => {
        var th = document.createElement("th");
        th.innerText = text;
        row.appendChild(th);
    });

    // Corpo da tabela
    var tbody = table.createTBody();
    dados.forEach(item => {
        var r = tbody.insertRow();
        // A ordem aqui deve bater com o cabeçalho acima
        r.insertCell().innerText = item.ra || "";
        r.insertCell().innerText = item.nome || "";
        r.insertCell().innerText = item.email || "";
        r.insertCell().innerText = item.telefone || "";
        r.insertCell().innerText = item.curso || "";
        r.insertCell().innerText = item.serie || "";
        r.insertCell().innerText = item.polo || "";
        r.insertCell().innerText = item.cdUnidade || "";
        r.insertCell().innerText = item.dtSolicitacao || "";
    });

    // Chama a biblioteca para converter esse elemento criado
    TableToExcel.convert(table, {
        name: `Relatorio_Completo_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`,
        sheet: { name: 'Relatório Completo' }
    });
}