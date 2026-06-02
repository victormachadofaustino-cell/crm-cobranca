// IMPORTAÇÃO DE SEGURANÇA: Traz os novos sub-módulos especialistas fatiados que vão desenhar cada pedaço da tela.
import { graficoFluxoCaixa } from "./graficoFluxoCaixa"; // Sub-módulo responsável por processar as datas e desenhar o gráfico de barras.
import { tabelaPropostas } from "./tabelaPropostas"; // Sub-módulo responsável por renderizar a grade de linhas de clientes.
import { modalIntervencao } from "./modalIntervencao"; // Sub-módulo responsável por inflar o pop-up de baixas e injeção de juros manuais.

export const acordosComponent = { // Define e exporta o objeto principal para manter a compatibilidade linear com o arquivo maestro app.js.
  renderizar(elementoContainer, cobrancas, callbackSalvarParcelas) { // Função mestre que inicia a montagem do painel de controladoria de caixa.
    
    elementoContainer.innerHTML = ''; // Limpa terminantemente qualquer resíduo visual ou lixo eletrônico anterior de dentro do container.
    elementoContainer.style.display = 'block'; // Força o bloco que estava oculto no CRM a se tornar visível e ativo na área de trabalho.

    // CORREÇÃO DE PRESERVAÇÃO DE DADOS: O crivo agora aceita exibir os cards que estão nas colunas financeiras mesmo que eles não possuam propostas ativas iniciadas no Firestore.
    const dadosCobrancasSeguras = Array.isArray(cobrancas) ? cobrancas : []; // Vacinador de dados contra retornos nulos.
    const cardsComProposta = dadosCobrancasSeguras.filter(c => { // Inicia a filtragem na lista do banco de dados.
      const statusValido = c.status === 'negociacao' || c.status === 'acordo' || c.status === 'finalizado'; // Crivo 1: Confere se o cliente cumpre as nomenclaturas das colunas.
      
      return statusValido; // Retorna verdadeiro liberando o cartão para a planilha caso ele esteja estacionado nas fases financeiras do funil.
    }); // Encerra a peneira de seleção de acordos.

    // TEMPLATE BASE DO MAESTRO: Desenha apenas o cabeçalho fixo da página e cria as "gavetas vazias" (IDs) onde os sub-módulos vão se injetar.
    elementoContainer.innerHTML = `
      <div style="margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;"> 
        <h3 style="font-size: 16px; font-weight: bold; color: #1e293b; margin: 0;">🤝 Esteira de Acordos & Controladoria de Parcelas</h3> 
        <p style="font-size: 12px; color: #64748b; margin: 4px 0 0 0;">Gerencie o fluxo de caixa parcelado, acompanhe gráficos de receita em tempo real e faça interventions diretas nas propostas.</p> 
      </div> 

      <div id="casulo-grafico-fluxo-caixa"></div>

      <div id="casulo-tabela-propostas-carteira"></div>

      <div id="casulo-modal-intervencao-flutuante"></div>
    `; // Injeta a moldura visual e cria os espaços vazios identificados por IDs para os submódulos entrarem.

    // Captura os pontos físicos de injeção recém-criados no HTML acima para despachar as ordens aos especialistas.
    const containerGrafico = document.getElementById('casulo-grafico-fluxo-caixa'); // Captura a área destinada para o preenchimento do gráfico analítico.
    const containerTabela = document.getElementById('casulo-tabela-propostas-carteira'); // Captura a área destinada para a planilha de linhas.
    const containerModal = document.getElementById('casulo-modal-intervencao-flutuante'); // Captura a área destinada para a janela do pop-up.

    // ORDEM 1: Ordena ao sub-módulo do gráfico que faça a leitura analítica das datas e plote as barras empilhadas no topo da tela.
    graficoFluxoCaixa.renderizar(containerGrafico, cardsComProposta); // Invoca o desenho imediato do gráfico de fluxo de caixa mensal somado.

    // ORDEM 2: Ordena ao sub-módulo de listagem que preencha a tabela de linhas com os nomes dos clientes elegíveis da esteira.
    tabelaPropostas.renderizar(containerTabela, cardsComProposta, (idCardClicado) => { // Desenha as colunas de faturamento e ouve o clique do mouse nas linhas.
      
      // AÇÃO DO CLIQUE OPERACIONAL: Quando o faturamento clica na linha do cliente, o maestro localiza a ficha completa dele na carteira.
      const fichaClienteLocalizada = cardsComProposta.find(c => c.id === idCardClicado); // Garimpa a lista em busca da ID idêntica do devedor selecionado.
      
      if (fichaClienteLocalizada) { // Se a ficha do devedor foi localizada perfeitamente no cofre de memória ram da máquina.
        
        // ORDEM 3: Invoca o especialista do mini-modal e ordena que ele infle a janela pop-up na tela com as regras de travas, reaberturas e juros reativos.
        modalIntervencao.renderizar(containerModal, fichaClienteLocalizada, (idGravado, pacoteModificadoControladoria) => { // Infla o modal de alteração de datas e valores do boleto.
          
          // RE-ENCADEAMENTO DE PERSISTÊNCIA: Recebe o pacote complexo pós-baixa (com os juros e o saldo do Kanban recalculados) e repassa para gravação definitiva em app.js.
          callbackSalvarParcelas(idGravado, pacoteModificadoControladoria); // Dispara a sincronização de baixa e recalcula os totalizadores de colunas do Kanban.
        }); // Encerra a chamada visual do portal do modal flutuante.
      } // Encerra a validação da ficha de segurança contra elementos nulos.
    }); // Encerra o gatilho reativo de cliques da planilha de propostas.
  } // Encerra a função principal de renderização do componente de Acordos e Controladoria.
}; // Encerra a exportação do objeto mestre acordosComponent.