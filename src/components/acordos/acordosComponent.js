// IMPORTAÇÃO DE SEGURANÇA: Traz os novos sub-módulos especialistas fatiados que vão desenhar cada pedaço da tela.
import { graficoFluxoCaixa } from "./graficoFluxoCaixa"; // Sub-módulo responsável por processar as datas e desenhar o gráfico de barras. [cite: 680]
import { tabelaPropostas } from "./tabelaPropostas"; // Sub-módulo responsável por renderizar a grade de linhas de clientes. [cite: 681]
import { modalIntervencao } from "./modalIntervencao"; // Sub-módulo responsável por inflar o pop-up de baixas e injeção de juros manuais. [cite: 682]

export const acordosComponent = { // Define e exporta o objeto principal para manter a compatibilidade linear com o arquivo maestro app.js. [cite: 683]
  renderizar(elementoContainer, cobrancas, callbackSalvarParcelas) { // Função mestre que inicia a montagem do painel de controladoria de caixa. [cite: 684]
    
    elementoContainer.innerHTML = ''; // Limpa terminantemente qualquer resíduo visual ou lixo eletrônico anterior de dentro do container. [cite: 684, 685]
    elementoContainer.style.display = 'block'; // Força o bloco que estava oculto no CRM a se tornar visível e ativo na área de trabalho. [cite: 685, 686]

    // CORREÇÃO DE BUG OCULTO DE SINTAXE: Substituída a palavra inteira 'cobranca' pela letra 'c' para harmonizar os ponteiros de dízimas do filtro. [cite: 687]
    const cardsComProposta = cobrancas.filter(c => // Inicia uma filtragem na lista do banco de dados para capturar apenas os clientes elegíveis com propostas. [cite: 688]
      c.proposta && // Crivo 1: Garante que o devedor possui uma proposta financeira estruturada em andamento. [cite: 688]
      (c.status === 'negociacao' || c.status === 'acordo' || c.status === 'finalizado') && // Crivo 2: Confere se o cliente está estacionado nas colunas corretas do funil. [cite: 688]
      ((Array.isArray(c.planoParcelas) && c.planoParcelas.length > 0) || (Array.isArray(c.proposta?.parcelasSimuladas) && c.proposta.parcelasSimuladas.length > 0)) // Crivo 3: Valida se o cronograma de faturas existe no plano definitivo ou simulado, blindando o Vite. [cite: 688]
    ); // Encerra a peneira de seleção de acordos. [cite: 688]

    // TEMPLATE BASE DO MAESTRO: Desenha apenas o cabeçalho fixo da página e cria as "gavetas vazias" (IDs) onde os sub-módulos vão se injetar. [cite: 689]
    elementoContainer.innerHTML = `
      <div style="margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;"> 
        <h3 style="font-size: 16px; font-weight: bold; color: #1e293b; margin: 0;">🤝 Esteira de Acordos & Controladoria de Parcelas</h3> 
        <p style="font-size: 12px; color: #64748b; margin: 4px 0 0 0;">Gerencie o fluxo de caixa parcelado, acompanhe gráficos de receita em tempo real e faça interventions diretas nas propostas.</p> 
      </div> 

      <div id="casulo-grafico-fluxo-caixa"></div>

      <div id="casulo-tabela-propostas-carteira"></div>

      <div id="casulo-modal-intervencao-flutuante"></div>
    `; // Injeta a moldura visual e cria os espaços vazios identificados por IDs para os submódulos entrarem. [cite: 690, 691]

    // Captura os pontos físicos de injeção recém-criados no HTML acima para despachar as ordens aos especialistas. [cite: 692]
    const containerGrafico = document.getElementById('casulo-grafico-fluxo-caixa'); // Captura a área destinada para o preenchimento do gráfico analítico. [cite: 693]
    const containerTabela = document.getElementById('casulo-tabela-propostas-carteira'); // Captura a área destinada para a planilha de linhas. [cite: 693]
    const containerModal = document.getElementById('casulo-modal-intervencao-flutuante'); // Captura a área destinada para a janela do pop-up. [cite: 694]

    // ORDEM 1: Ordena ao sub-módulo do gráfico que faça a leitura analítica das datas e plote as barras empilhadas no topo da tela. [cite: 695]
    graficoFluxoCaixa.renderizar(containerGrafico, cardsComProposta); // Invoca o desenho imediato do gráfico de fluxo de caixa mensal somado. [cite: 696]

    // ORDEM 2: Ordena ao sub-módulo de listagem que preencha a tabela de linhas com os nomes dos clientes elegíveis da esteira. [cite: 696]
    tabelaPropostas.renderizar(containerTabela, cardsComProposta, (idCardClicado) => { // Desenha as colunas de faturamento e ouve o clique do mouse nas linhas. [cite: 697]
      
      // AÇÃO DO CLIQUE OPERACIONAL: Quando o faturamento clica na linha do cliente, o maestro localiza a ficha completa dele na carteira. [cite: 697]
      const fichaClienteLocalizada = cardsComProposta.find(c => c.id === idCardClicado); // Garimpa a lista em busca da ID idêntica do devedor selecionado. [cite: 697]
      
      if (fichaClienteLocalizada) { // Se a ficha do devedor foi localizada perfeitamente no cofre de memória ram da máquina. [cite: 697]
        
        // ORDEM 3: Invoca o especialista do mini-modal e ordena que ele infle a janela pop-up na tela com as regras de travas, reaberturas e juros reativos. [cite: 697, 698]
        modalIntervencao.renderizar(containerModal, fichaClienteLocalizada, (idGravado, pacoteModificadoControladoria) => { // Infla o modal de alteração de datas e valores do boleto. [cite: 698]
          
          // RE-ENCADEAMENTO DE PERSISTÊNCIA: Recebe o pacote complexo pós-baixa (com os juros e o saldo do Kanban recalculados) e repassa para gravação definitiva em app.js. [cite: 698]
          callbackSalvarParcelas(idGravado, pacoteModificadoControladoria); // Dispara a sincronização de baixa e recalcula os totalizadores de colunas do Kanban. [cite: 698]
        }); // Encerra a chamada visual do portal do modal flutuante. [cite: 698, 699]
      } // Encerra a validação da ficha de segurança contra elementos nulos. [cite: 699]
    }); // Encerra o gatilho reativo de cliques da planilha de propostas. [cite: 700]
  } // Encerra a função principal de renderização do componente de Acordos e Controladoria. [cite: 700]
}; // Encerra a exportação do objeto mestre acordosComponent. [cite: 701]