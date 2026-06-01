import { kanbanComponent } from "../components/kanban/kanbanCore"; // CORRIGIDO: Ajustado o GPS para importar o motor de raias a partir do seu novo local físico correto kanbanCore.js, eliminando o erro 500[cite: 195].

export const crmVisaoKanban = { // Define e exporta o novo submódulo isolado focado em construir as colunas dinâmicas do CRM[cite: 195].
  reconstruir(boardContainer, estruturaEtapas, dadosCobrancasGlobais, inputFiltroKanban, abrirCentralGestao360, dbService) { // Cria a função de montagem que recebe os contêineres do HTML, as etapas da nuvem e as chaves de dados globais[cite: 195, 297].
    
    boardContainer.innerHTML = ''; // Limpa completamente a estrutura anterior de colunas cinzas para evitar sobreposições na tela do navegador[cite: 206, 297].
    const elementoContainersDinamicos = {}; // Inicializa o mapeamento dinâmico para amarrar os contêineres de cartões das novas fases.
    const selectModalCadastro = document.getElementById('statusInicial'); // Localiza o menu de cascata que fica oculto dentro do modal de cadastro de novas dívidas[cite: 311].

    if (selectModalCadastro) selectModalCadastro.innerHTML = ''; // Limpa as linhas antigas de fases do cadastro para sincronizar com os novos adjustments da engrenagem.

    // GARANTE QUE AS ETAPAS ENTREREM COMO ARRAY: Evita quebras de loop caso o Firebase atrase o retorno das raias.
    const etapasSeguras = Array.isArray(estruturaEtapas) ? estruturaEtapas : []; // Proteção sênior: se o Firebase falhar ou atrasar, converte a lista em um array vazio para não quebrar a tela.

    etapasSeguras.forEach(etapa => { // Inicia uma varredura passando etapa por etapa da lista carregada da nuvem do Firebase[cite: 209].
        const colunaHtml = document.createElement('div'); // Fabrica uma div física estrutural para o navegador desenhar a raia cinza.
        colunaHtml.className = 'column'; // Applies os estilos CSS de fábrica que desenham o fundo cinza arredondado com sombra.
        colunaHtml.setAttribute('data-status', etapa.id); // Aplica a assinatura eletrônica do status para que os cartões saibam onde entrar.
        colunaHtml.innerHTML = ` <h2>${etapa.nome} <span class="column-count" id="count-${etapa.id}">0</span></h2> <div class="cards-container" id="container-${etapa.id}"></div> `; // Desenha o título com o rótulo do nome da etapa e a pílula oval de saldos zerada.
        boardContainer.appendChild(colunaHtml); // Anexa fisicamente a coluna cinza montada direto dentro do painel do CRM Kanban[cite: 206].

        elementoContainersDinamicos[etapa.id] = document.getElementById(`container-${etapa.id}`); // Registra o casulo de cartões interno da coluna atual no mapeamento de renderização.

        if (selectModalCadastro) { // Se o modal pop-up de cadastro estiver presente no documento da página[cite: 308].
            const opcao = document.createElement('option'); // Fabrica uma linha de opção em branco para o menu suspenso[cite: 311].
            opcao.value = etapa.id; // Vincula a chave de status de destino que será gravada no banco de dados[cite: 311].
            opcao.text = etapa.nome; // Vincula o nome legível que o operador vai enxergar na lista suspensa do formulário.
            selectModalCadastro.appendChild(opcao); // Envia o item configurado para dentro da caixa de seleção do modal de inclusão[cite: 311].
        } // Encerra o sincronismo do menu de cascata.
    }); // Encerra o laço de reconstrução reativa de colunas cinzas.

    const ordemIdsEtapas = etapasSeguras.map(e => e.id); // Cria a sequência exata de códigos das colunas para controle do botão avançar sequencial.

    const textoFiltro = inputFiltroKanban ? inputFiltroKanban.value.toLowerCase().trim() : ''; // Coleta o termo de busca digitado transformando-o em letras minúsculas limpas[cite: 206].
    
    // PRESERVAÇÃO E PROTEÇÃO REATIVA: Sincroniza a caixa de busca com a memória da nova Gaveta Lateral de Filtros para evitar quebras ou furos de relatórios.
    const dadosCobrancasSeguras = Array.isArray(dadosCobrancasGlobais) ? dadosCobrancasGlobais : []; // Proteção contra dados nulos: garante que a lista de devedores seja um array legítimo[cite: 210].
    const dadosFiltradosProntos = dadosCobrancasSeguras.filter(cobranca => { // Passa uma peneira na gaveta global isolando as cobranças da busca[cite: 210].
        if (!textoFiltro) return true; // Se a caixa superior estiver vazia, autoriza o avanço do card para a próxima peneira interna do kanbanComponent.
        const nomeCliente = (cobranca.cliente || '').toLowerCase(); // Puxa a Razão Social em letras minúsculas protegendo contra valores nulos[cite: 311].
        const codigoCliente = (cobranca.codigo || '').toString().toLowerCase(); // Puxa o código numérico da conta convertendo para texto estável[cite: 311].
        return nomeCliente.includes(textoFiltro) || codigoCliente.includes(textoFiltro); // Filtra casando os caracteres com a razão social ou código.
    }); // Encerra o filtro de pesquisa unificado do Kanban.

    // DESPACHO DOS CARTÕES FILTRADOS: Invoca a plotagem dos cartões enviando a lista refinada e respeitando os comandos combinados de cabeçalho da gaveta lateral drawer.
    kanbanComponent.renderizar(dadosFiltradosProntos, elementoContainersDinamicos, async (id, statusParametro1, statusParametro2) => { // Dispara a plotagem dos cartões brancos distribuindo-os nas respectivas colunas cinzas[cite: 190, 210].
        if (statusParametro2 !== undefined) { // Se o terceiro parâmetro vier preenchido, o gatilho foi um movimento de arrastar e soltar (Drop) livre.
            await dbService.atualizarCamposCobranca(id, { status: statusParametro2 }); // Sobrescreve o status no Firebase colando o cartão na coluna exata onde o operador o soltou[cite: 188, 249].
        } else { // Caso o terceiro parâmetro venha nulo, o operador clicou no botão clássico de avanço linear.
            await dbService.avancarStatus(id, statusParametro1, ordemIdsEtapas); // Executa o motor que move a conta uma coluna para o lado direito do funil sequencial[cite: 188].
        } // Encerra o desvio de movimentação do pipeline.
    }, (cobrancaSelecionada) => { // Gatilho acionado ao clicar em cima da superfície do cartão branco do devedor.
        abrirCentralGestao360(cobrancaSelecionada); // Encaminha os dados da cobrança para a abertura da Central 360 no arquivo maestro[cite: 257, 297].
    }, async (idCardFinalizado, veredictoEscolhido) => { // Gatilho acionado ao mudar o veredicto final do combo no rodapé do cartão.
        await dbService.atualizarCamposCobranca(idCardFinalizado, { subStatus: veredictoEscolhido }); // Registra cirurgicamente o substatus de liquidação na nuvem do Firebase[cite: 188, 249].
    }); // Conclui a montagem do tabuleiro Kanban desafogado.
  } // Encerra a função principal de reconstrução[cite: 297].
}; // Encerra a exportação do módulo crmVisaoKanban[cite: 195].