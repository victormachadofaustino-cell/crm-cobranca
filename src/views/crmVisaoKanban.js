import { kanbanComponent } from "../components/kanban/kanbanCore"; // Importa o motor mestre que desenha e posiciona os cartões brancos nas raias. // Traz a lógica de distribuição mestre dos cartões dentro das colunas cinzas da tela.

export const crmVisaoKanban = { // Define e exporta o novo submódulo isolado focado em construir as colunas dinâmicas do CRM. // Cria e exporta o módulo especialista em moldar e posicionar o tabuleiro do Kanban.
  reconstruir(boardContainer, estruturaEtapas, dadosCobrancasGlobais, inputFiltroKanban, abrirCentralGestao360, dbService) { // Cria a função de montagem que recebe os contêineres do HTML, as etapas da nuvem e as chaves de dados globais. // Método maestro que redesenha as colunas limpando a tela e atualizando os cartões brancos.
    
    boardContainer.innerHTML = ''; // Limpa completamente a estrutura anterior de colunas cinzas para evitar sobreposições na tela do navegador. // Esvazia o painel do tabuleiro antigo para desenho das novas colunas limpas sem duplicações.
    const elementoContainersDinamicos = {}; // Inicializa o mapeamento dinâmico para amarrar os contêineres de cartões das novas fases. // Cria uma lista vazia para catalogar as áreas onde os cartões serão encaixados.
    const selectModalCadastro = document.getElementById('statusInicial'); // Localiza o menu de cascata que fica oculto dentro do modal de cadastro de novas dívidas. // Localiza o menu suspenso de fases oculto no formulário de inclusão de títulos.

    if (selectModalCadastro) selectModalCadastro.innerHTML = ''; // Limpa as linhas antigas de fases do cadastro para sincronizar com os novos adjustments da engrenagem. // Esvazia preventivamente as opções do menu suspenso de cadastro de títulos.

    // GARANTE QUE AS ETAPAS ENTREREM COMO ARRAY: Evita quebras de loop caso o Firebase atrase o retorno das raias. // Evita travamentos de leitura.
    const etapasSeguras = Array.isArray(estruturaEtapas) ? estruturaEtapas : []; // Proteção sênior: se o Firebase falhar ou atrasar, converte a lista em um array vazio para não quebrar a tela. // Vacinador de dados: converte a lista em uma bandeja vazia se a nuvem atrasar os retornos.

    // NOVO INJETOR DE ESTILO OCULTO: Injetamos uma regra de CSS na tela para sumir com as barras de scroll mantendo a rolagem ativa.
    const estiloScrollInvisivel = document.createElement('style'); // Cria um elemento de folha de estilo dinâmico no navegador.
    estiloScrollInvisivel.innerHTML = `
      .cards-container::-webkit-scrollbar { display: none; } /* Esconde a barra de rolagem em navegadores baseados em Chrome, Edge e Safari */
      .cards-container { -ms-overflow-style: none; scrollbar-width: none; } /* Esconde a barra de rolagem no navegador Firefox e Internet Explorer antigos */
    `; // Escreve as regras de camuflagem invisível para as barras de rolagem da classe especificada.
    document.head.appendChild(estiloScrollInvisivel); // Anexa o comando invisível diretamente no cérebro (cabeçalho head) da página html.

    etapasSeguras.forEach(etapa => { // Inicia uma varredura passando etapa por etapa da lista carregada da nuvem do Firebase. // Passa montando calha por calha com base nas fases registradas no Firebase.
        const colunaHtml = document.createElement('div'); // Fabrica uma div física estrutural para o navegador desenhar a raia cinza. // Fabrica um bloco de divisão física novo para ser a calha cinza de fundo.
        colunaHtml.className = 'column'; // Applies os estilos CSS de fábrica que desenham o fundo cinza arredondado com sombra. // Assina o bloco novo com a classe padrão de controle de colunas.
        
        colunaHtml.style.cssText = "background: #f1f5f9; padding: 16px; border-radius: 12px; display: flex; flex-direction: column; gap: 12px; min-width: 280px; max-width: 320px; flex: 1; box-sizing: border-box; border: 1px solid #e2e8f0; height: calc(100vh - 160px);"; // Injeção de estilo em linha para garantir calhas cinzas fixas na altura útil do monitor do usuário.
        colunaHtml.setAttribute('data-status', etapa.id); // Aplica a assinatura eletrônica do status para que os cartões saibam onde entrar. // Grava o ID eletrônico da coluna na etiqueta física do bloco para o arrastar-e-soltar.
        
        // AJUSTE CIRÚRGICO DE UX: Removemos o preenchimento de margem direita (padding-right) para o layout ficar 100% limpo, já que a barra física sumiu.
        colunaHtml.innerHTML = ` <h2 style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 700; color: #334155; margin: 0; text-transform: uppercase; font-family: system-ui, -apple-system, sans-serif; width: 100%; letter-spacing: 0.5px;"><span>${etapa.nome}</span> <span class="column-count" id="count-${etapa.id}" style="font-size: 11px; font-weight: bold; background: #e2e8f0; color: #475569; padding: 2px 8px; border-radius: 20px; white-space: nowrap;">0</span></h2> <div class="cards-container" id="container-${etapa.id}" style="display: flex; flex-direction: column; gap: 8px; flex-grow: 1; height: 100%; overflow-y: auto;"></div> `; // Cria a caixa interna de cartões com rolagem ativa e máscara invisível contra barras cinzas feias.
        
        boardContainer.appendChild(colunaHtml); // Anexa fisicamente a coluna cinza montada direto dentro do painel do CRM Kanban. // Fixa a calha cinza estruturada na tela dentro do contêiner mestre do Kanban.

        elementoContainersDinamicos[etapa.id] = document.getElementById(`container-${etapa.id}`); // Registra o casulo de cartões interno da coluna atual no mapeamento de renderização. // Captura e cataloga o espaço interno da calha destinado a empilhar os cartões brancos.

        if (selectModalCadastro) { // Se o modal pop-up de cadastro estiver presente no documento da página. // Se o formulário de inclusão de novos títulos estiver disponível na folha.
            const opcao = document.createElement('option'); // Fabrica uma linha de opção em branco para o menu suspenso. // Fabrica uma linha nova de opção para preenchimento de caixa de seleção.
            opcao.value = etapa.id; // Vincula a chave de status de destino que será gravada no banco de dados. // Define o ID da coluna como o valor interno que será enviado ao Firebase.
            opcao.text = etapa.nome; // Vincula o nome legível que o operador vai enxergar na lista suspensa do formulário. // Define o nome limpo da etapa como o texto visível da lista suspensa.
            selectModalCadastro.appendChild(opcao); // Envia o item configurado para dentro da caixa de seleção do modal de inclusão. // Insere o item configurado dentro da caixa de seleção do formulário.
        } // Encerra o sincronismo do menu de cascata. // Fecha o bloco de preenchimento do menu de seleção.
    }); // Encerra o laço de reconstrução reativa de colunas cinzas. // Conclui o loop de desenho das calhas comerciais de fundo.

    const ordemIdsEtapas = etapasSeguras.map(e => e.id); // Cria a sequência exata de códigos das colunas para controle do botão avançar sequencial. // Memoriza em linha a ordem exata de IDs das calhas para a navegação.

    const textoFiltro = inputFiltroKanban ? inputFiltroKanban.value.toLowerCase().trim() : ''; // Coleta o termo de busca digitado transformando-o em letras minúsculas limpas. // Coleta a digitação da caixa de pesquisa superior limpando espaçamentos.
    
    // PRESERVAÇÃO E PROTEÇÃO REATIVA: Sincroniza a caixa de busca com a memória da nova Gaveta Lateral de Filtros para evitar quebras ou furos de relatórios. // Garante refinação estável.
    const dadosCobrancasSeguras = Array.isArray(dadosCobrancasGlobais) ? dadosCobrancasGlobais : []; // Proteção contra dados nulos: garante que a lista de devedores seja um array legítimo. // Garante a conversão em bandeja estável se os dados do Firebase vierem corrompidos.
    const dadosFiltradosProntos = dadosCobrancasSeguras.filter(cobranca => { // Passa uma peneira na gaveta global isolando as cobranças da busca. // Inicia a filtragem textual confrontando as letras com a ficha do devedor.
        if (!textoFiltro) return true; // Se a caixa superior estiver vazia, autoriza o avanço do card para a próxima peneira interna do kanbanComponent. // Se não houver texto digitado, concede passe livre imediato para a próxima triagem.
        const nomeCliente = (cobranca.cliente || '').toLowerCase(); // Puxa a Razão Social em letras minúsculas protegendo contra valores nulos. // Puxa a razão social tratada em letras minúsculas contra panes.
        const codigoCliente = (cobranca.codigo || '').toString().toLowerCase(); // Puxa o código numérico da conta convertendo para texto estável. // Converte o código numérico do devedor para texto de segurança em caixa baixa.
        return nomeCliente.includes(textoFiltro) || codigoCliente.includes(textoFiltro); // Filtra casando os caracteres com a razão social ou código. // Retorna verdadeiro se os caracteres baterem com o nome ou código da conta.
    }); // Encerra o filtro de pesquisa unificado do Kanban. // Fecha a peneira de digitação de topo.

    // DESPACHO DOS CARTÕES FILTRADOS: Invoca a plotagem dos cartões enviando a lista refinada e respeitando os comandos combinados de cabeçalho da gaveta lateral drawer. // Dispara a plotagem dos cards.
    kanbanComponent.renderizar(dadosFiltradosProntos, elementoContainersDinamicos, async (id, statusParametro1, statusParametro2) => { // Dispara a plotagem dos cartões brancos distribuindo-os nas respectivas colunas cinzas. // Ordena ao motor mestre do Kanban que plote os cards dentro dos casulos cinzas.
        if (statusParametro2 !== undefined) { // Se o terceiro parâmetro vier preenchido, o gatilho foi um movimento de arrastar e soltar (Drop) livre. // Se o destino foi informado, a ação foi um arrastar-e-soltar livre.
            await dbService.atualizarCamposCobranca(id, { status: statusParametro2 }); // Sobrescreve o status no Firebase colando o cartão na coluna exata onde o operador o soltou. // Grava o novo status fixando o cartão reativamente na calha onde foi solto.
        } else { // Caso o terceiro parâmetro venha nulo, o operador clicou no botão clássico de avanço linear. // Se veio em branco, a ação foi um clique no botão de avanço linear.
            await dbService.avancarStatus(id, statusParametro1, ordemIdsEtapas); // Executa o motor que move a conta uma coluna para o lado direito do funil sequencial. // Aciona o motor que empurra o cliente uma calha para o lado direito do funil.
        } // Encerra o desvio de movimentação do pipeline. // Fecha o bloco de decisões de movimentos.
    }, (cobrancaSelecionada) => { // Gatilho acionado ao clicar em cima da superfície do cartão branco do devedor. // Monitora o toque na superfície branca do card.
        abrirCentralGestao360(cobrancaSelecionada); // Encaminha os dados da cobrança para a abertura da Central 360 no arquivo maestro. // Despacha a ficha rica para o arquivo mestre abrir o prontuário 360 na tela.
    }, async (idCardFinalizado, veredictoEscolhido) => { // Gatilho acionado ao mudar o veredicto final do combo no rodapé do cartão. // Monitora a alteração do desfecho no rodapé do card.
        await dbService.atualizarCamposCobranca(idCardFinalizado, { subStatus: veredictoEscolhido }); // Registra cirurgicamente o substatus de liquidação na nuvem do Firebase. // Salva cirurgicamente the baixa financeira (quitado/baixado) no Firebase.
    }); // Conclui a montagem do tabuleiro Kanban desafogado. // Encerra a chamada do renderizador de cartões do Kanban.
  } // Encerra a função principal de reconstrução. // Fecha o método maestro de reconstrução de calhas.
}; // Encerra a exportação do módulo crmVisaoKanban. // Fecha o objeto estrutural especialista do Kanban.