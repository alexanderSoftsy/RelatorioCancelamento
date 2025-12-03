// Este script usa a variável 'urlBase' que está no arquivo comum.js

$(document).ready(function() {
    // 1. Segurança: Verifica se o usuário está logado
    // Se não tiver o item 'sessao_valida' gravado, manda de volta pro login
    var sessao = localStorage.getItem('sessao_valida');
    if (sessao !== 'sim') {
        window.location.href = "index.html";
        return;
    }

    // 2. Botão Sair (Limpa a sessão e volta pro login)
    $("#btnSair").click(function() {
        localStorage.removeItem('sessao_valida');
        window.location.href = "index.html";
    });

    // 3. Botão Exportar Excel
    $("#btnExport").click(function() {
        let table = document.getElementsByTagName("table")[0];
        if (table) {
            TableToExcel.convert(table, {
                name: `Relatorio_Cancelados.xlsx`,
                sheet: { name: 'Dados' }
            });
        } else {
            alert("Faça uma busca primeiro para gerar dados.");
        }
    });

    // 4. Ação do Formulário de Busca
    $("#formBusca").submit(function(e) {
        e.preventDefault(); // Evita que a página recarregue
        
        var dtInicio = $("#dtIni").val();
        var dtFim = $("#dtFim").val();

        if (!dtInicio || !dtFim) {
            alert("Por favor, preencha as duas datas.");
            return;
        }
        
        // Chama a função que busca no backend
        carregarRelatorio(dtInicio, dtFim);
    });
});

function carregarRelatorio(dtIni, dtFim) {
    $("#loading").fadeIn();
    $("#tabelaContainer").empty();

    // Monta a URL final usando a urlBase que veio do comum.js
    // Vai ficar algo como: /api-relatorio-cancelamento/relatorio
    var urlApi = urlBase + "relatorio";
    
    console.log("Chamando API em: " + urlApi);

    $.ajax({
        type: "GET",
        url: urlApi,
        data: {
            dtIni: dtIni,
            dtFim: dtFim
        },
        success: function(listaDeAlunos) {
            // Se a lista vier vazia ou nula
            if (!listaDeAlunos || listaDeAlunos.length === 0) {
                $("#loading").fadeOut();
                $("#tabelaContainer").html('<div class="alert alert-warning text-center m-3">Nenhum registro encontrado neste período.</div>');
                return;
            }

            // Se houver dados, monta a tabela
            montarTabela(listaDeAlunos);
            $("#loading").fadeOut();
        },
        error: function(xhr) {
            $("#loading").fadeOut();
            console.error("Erro na API:", xhr);
            alert("Erro ao buscar dados. Verifique se a API 'api-relatorio-cancelamento' está rodando e se o caminho está correto.");
        }
    });
}

function montarTabela(dados) {
    // Mapeia as colunas do JSON (que vem do Java) para o HTML
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

    // Cria a tabela usando o plugin tableSortable
    $('#tabelaContainer').tableSortable({
        data: dados,
        columns: colunas,
        searchField: '#searchField',
        rowsPerPage: 10,
        pagination: true,
        tableClass: 'table table-hover table-striped table-bordered',
        onPaginationChange: function(nextPage, setPage) {
            setPage(nextPage);
        }
    });
}