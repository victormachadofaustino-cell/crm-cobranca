import { kanbanFiltros } from "../components/kanban/kanbanFiltros"; // Importa a peneira lógica modularizada para a planilha e o Kanban usarem os mesmos critérios da gaveta lateral, eliminando o erro 500[cite: 1363, 1411].

export const crmVisaoTabela = { // Define e exporta o novo submódulo isolado responsável por gerenciar e alimentar a visualização de planilha executiva[cite: 1772].
  reconstruir(corpoTabela, dadosCobrancasGlobais, estruturaEtapas, inputFiltroKanban, abrirCentralGestao360) { // Cria a função que recebe as linhas do HTML e roda as regras de filtragem planilhada[cite: 1773].
    
    if (!corpoTabela) return; // Trava de segurança: se a div protetora sumiu da página por falha de renderização, aborta a execução na hora[cite: 1774].
    corpoTabela.innerHTML = ''; // Higieniza a planilha limpando as linhas antigas para prevenir duplicações visuais em tela[cite: 1775].

    // INICIALIZAÇÃO DE GAVETA GLOBAL: Garante que o objeto de filtros da gaveta lateral lateral exista em memória para não gerar panes de leitura assíncronas[cite: 1776].
    if (!window.filtrosGavetaCrmAtivos) { // Se a gaveta de filtros rápidos da direita nunca tiver sido aberta ou configurada na sessão[cite: 1776].
      window.filtrosGavetaCrmAtivos = { responsavel: '', faixaValor: '', nivelAtraso: '', semTarefas: false }; // Registra chaves neutras padrão de fábrica na sessão[cite: 1777, 1778].
    } // Encerra a checação de segurança do filtro global.

    const textoFiltro = inputFiltroKanban ? inputFiltroKanban.value.toLowerCase().trim() : ''; // Coleta os termos livres digitados na caixa superior de pesquisa, limpando espaços[cite: 1778, 1779].
    
    // FILTRAGEM UNIFICADA: Passa um pente fino cruzando as buscas textuais da barra e as seleções de combinações da gaveta lateral[cite: 1780].
    const dadosCobrancasSeguras = Array.isArray(dadosCobrancasGlobais) ? dadosCobrancasGlobais : []; // Vacinador de dados: garante que o filtro rode sobre uma lista real de array, evitando crashes[cite: 1781].
    const dadosFiltradosProntos = dadosCobrancasSeguras.filter(cobranca => { // Inicia o filtro passando de devedor em devedor para testar as regras[cite: 1782].
      
      // 1. PENEIRA DA CAIXA TEXTUAL (CÓDIGO OU CLIENTE): Valida a digitação de topo tradicional do CRM[cite: 1782].
      if (textoFiltro) { // Se o operador digitou alguma letra na caixa de busca superior[cite: 1782].
        const clienteNome = (cobranca.cliente || '').toLowerCase(); // Puxa a razão social em caixa baixa de segurança[cite: 1782].
        const codigoCliente = (cobranca.codigo || '').toString().toLowerCase(); // Puxa o código convertendo o número para texto estável[cite: 1782].
        const atendeTexto = clienteNome.includes(textoFiltro) || codigoCliente.includes(textoFiltro); // Checa correspondência de chaves de texto[cite: 1782, 1783].
        if (!atendeTexto) return false; // Descartável imediatamente se não bater com a digitação informada[cite: 1783].
      } // Encerra o crivo do texto digitado.

      // 2. ADAPTADOR REATIVO DA GAVETA LATERAL: Invoca a central inteligente de filtros do Kanban para validar o devedor[cite: 1376].
      const status = cobranca.status || 'novo'; // Resgata o status ou define a coluna padrão inicial do devedor no funil[cite: 1785, 1786].
      return kanbanFiltros.validar(cobranca, status); // Invoca a validação centralizada e responde se a linha do devedor atende aos critérios do Drawer[cite: 1376, 1412].
    }); // Encerra o filtro de pesquisa combinado da planilha[cite: 1805].

    if (dadosFiltradosProntos.length === 0) { // Se nenhum cliente corresponder aos filtros de digitação ou de gaveta ativos no momento[cite: 1806].
        corpoTabela.innerHTML = `<tr><td colspan="6" style="padding: 30px; text-align: center; color: #94a3b8; font-style: italic; font-family: sans-serif; background-color: #f8fafc;">Nenhuma cobrança localizada nesta pesquisa planilhada.</td></tr>`; // Injeta uma linha cinza com aviso de planilha deserta[cite: 1807].
        return; // Interrompe o fluxo de desenho poupando processamento do computador[cite: 1808].
    } // Encerra o tratamento de deserto da lista.

    const etapasSeguras = Array.isArray(estruturaEtapas) ? estruturaEtapas : []; // Vacinador de etapas para evitar panes de busca cruzada[cite: 1809, 1810].

    dadosFiltradosProntos.forEach(cobranca => { // Laço de repetição navegando de cliente em cliente da lista filtrada para montagem da grade[cite: 1811].
        const linhaTr = document.createElement('tr'); // Fabrica uma linha de planilha (tr) dinamicamente[cite: 1811].
        linhaTr.style.cssText = "border-bottom: 1px solid #e2e8f0; transition: background-color 0.15s; background-color: #ffffff;"; // Injeta de fábrica a divisória cinza fina e prepara as transições reativas[cite: 1811].
        
        const valorFormatado = (cobranca.valorVencido || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 }); // Converte o saldo devedor em dinheiro brasileiro com centavos precisos[cite: 1811, 1812].
        const objetoEtapaAtual = etapasSeguras.find(e => e.id === cobranca.status) || { nome: 'A Iniciar' }; // Procura na estrutura qual o nome real da coluna do funil onde a conta está estacionada[cite: 1812].
        
        linhaTr.innerHTML = `
            <td style="padding: 14px 12px; font-weight: 600; color: #64748b; font-family: sans-serif;">${cobranca.codigo}</td> 
            <td style="padding: 14px 12px; font-weight: 700; color: #0f172a; text-transform: uppercase; font-family: sans-serif; text-align: left;">${cobranca.cliente}</td> 
            <td style="padding: 14px 12px; color: #475569; font-weight: 500; font-family: sans-serif; text-align: left;">👤 ${cobranca.responsavel || 'Não alocado'}</td> 
            <td style="padding: 14px 12px; font-weight: 800; color: #ef4444; font-family: sans-serif; text-align: left;">R$ ${valorFormatado}</td> 
            <td style="padding: 14px 12px; text-align: left;">
                <span style="background: #f1f5f9; color: #334155; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; border: 1px solid #cbd5e1; font-family: sans-serif; text-transform: uppercase;">${objetoEtapaAtual.nome}</span> 
            </td>
            <td style="padding: 14px 12px; text-align: right;">
                <button class="btn-abrir-360-tabela-filho" data-id="${cobranca.id}" style="background: #2563eb; color: white; border: none; padding: 6px 14px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px; transition: background 0.2s; font-family: sans-serif;">👁️ Ver Detalhes</button> 
            </td>
        `; // Conclui a estruturação de dados daquela linha da planilha com tipografia premium DOCULOC.

        // MICROINTERAÇÃO REATIVA DE HOVER: Destaca a linha inteira da planilha com um fundo cinza confortável ao passar o mouse.
        linhaTr.addEventListener('mouseenter', () => { linhaTr.style.backgroundColor = '#f8fafc'; }); // Altera a cor de fundo no hover do mouse.
        linhaTr.addEventListener('mouseleave', () => { linhaTr.style.backgroundColor = '#ffffff'; }); // Retorna à cor branca nativa de descanso.
        
        corpoTabela.appendChild(linhaTr); // Fixa a linha estruturada direto dentro do corpo visível da tabela na página[cite: 1822].
    }); // Encerra a varredura das linhas planilhadas.

    document.querySelectorAll('.btn-abrir-360-tabela-filho').forEach(botao => { // Localiza os botões azuis "Ver Detalhes" das linhas geradas[cite: 1822].
        // MICROINTERAÇÃO DO BOTÃO: Altera o tom do azul real para marinho quando o mouse focar no gatilho de visualização[cite: 1822].
        botao.addEventListener('mouseenter', () => { botao.style.background = '#1d4ed8'; }); // Escurece o tom do botão azul no hover[cite: 1822].
        botao.addEventListener('mouseleave', () => { botao.style.background = '#2563eb'; }); // Devolve o tom original azul royal[cite: 1823].

        botao.addEventListener('click', (e) => { // Captura o clique do mouse focado em inspecionar os logs do cliente[cite: 1823].
            const idCard = e.target.getAttribute('data-id'); // Resgata o ID único daquela cobrança específica[cite: 1823].
            const cobrancaEncontrada = dadosCobrancasSeguras.find(c => c.id === idCard); // Procura a ficha completa do devedor na gaveta de memória local[cite: 1823].
            if (cobrancaEncontrada) abrirCentralGestao360(cobrancaEncontrada); // Dispara a abertura unificada da Central 360 do mestre[cite: 1823, 1824].
        }); // Encerra o escuta do clique do botão.
    }); // Encerra a amarração operacional das ações da planilha[cite: 1825].
  } // Encerra a função principal de reconstrução de planilhas[cite: 1825].
}; // Encerra a exportação do módulo crmVisaoTabela[cite: 1826].