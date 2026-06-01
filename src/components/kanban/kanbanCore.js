import { cardComponent } from "./cardComponent"; // CORRIGIDO: GPS ajustado para importar o alfaiate visual dos cartões na mesma pasta local do desmembramento, eliminando o erro 500.
import { kanbanFiltros } from "./kanbanFiltros"; // CORRIGIDO: GPS ajustado para importar a peneira de filtros na mesma pasta local do desmembramento, alinhando a planilha e o Kanban.

export const kanbanComponent = { // Define e exporta o objeto mestre modular do Kanban para que o arquivo mestre app.js consiga gerenciar o tabuleiro.
  renderizar(cobrancas, elementoContainers, callbackBotaoAvancar, callbackCliqueCard, callbackMudarSubStatus) { // Cria a função mestre que desenha o painel recebendo os dados da nuvem, os containers físicos e as ações de clique e fechamento.
    
    // INICIALIZAÇÃO DE MEMÓRIA DE SEGURANÇA: Garante a existência do objeto global de filtros da gaveta para evitar quebras de inicialização assíncronas.
    if (!window.filtrosGavetaCrmAtivos) { // Se a gaveta de filtros rápidos da direita nunca tiver sido aberta ou configurada na sessão atual.
      window.filtrosGavetaCrmAtivos = { responsavel: '', faixaValor: '', nivelAtraso: '', semTarefas: false }; // Registra a estrutura limpa de fábrica na sessão para evitar panes de leitura.
    } // Encerra o bloco de segurança.

    const contadores = {}; // Inicia o objeto de contadores vazio para ser montado de forma reativa sem travar em colunas ou fases fixas engessadas.
    const somasFinanceiras = {}; // Cria um objeto para acumular a somatória em dinheiro de cada etapa do funil de cobrança.
    
    Object.keys(elementoContainers).forEach(status => { // Passa olhando cada uma das colunas que existem de verdade no banco de dados neste momento.
      contadores[status] = 0; // Inicializa o contador daquela coluna específica zerado para começarmos o recálculo do painel.
      somasFinanceiras[status] = 0; // Inicializa a somatória de dinheiro em zero para cada coluna mapeada no CRM.
    }); // Encerra o ciclo de criação dos contadores reativos.
    
    Object.values(elementoContainers).forEach(c => c.innerHTML = ''); // Passa limpando o conteúdo antigo de todas as colunas da tela para evitar que os cartões fiquem duplicados.

    // GARANTE QUE AS COBRANÇAS ENTREREM COMO ARRAY: Evita quebras caso o Firebase retorne um valor nulo inicial.
    const listaCobrancasSegura = Array.isArray(cobrancas) ? cobrancas : []; // Vacinador de dados: garante que o laço rode sobre uma lista legítima de array, impedindo travamentos.

    listaCobrancasSegura.forEach((cobranca) => { // Inicia uma varredura passando de cliente em cliente da lista enviada pelo banco de dados.
      const status = cobranca.status || 'novo'; // Identifica em qual etapa o cliente está ou define 'novo' (A Iniciar) caso esteja sem nenhuma coluna definida.
      
      // ==========================================
      // ATIVAÇÃO DA PENEIRA MODULAR (SUBMÓDULO FILTROS)
      // ==========================================
      if (kanbanFiltros.validar(cobranca, status) === false) { // Consulta a peneira modularizada para julgar os filtros da gaveta lateral.
        return; // Interrompe a execução e pula o desenho deste card se o submódulo apontar que ele violou as regras da gaveta lateral.
      } // Encerra o bloqueio do filtro.

      if (elementoContainers[status]) { // Verifica se a coluna física correspondente àquele status realmente existe na tela do navegador.
        const valorCardNum = parseFloat(cobranca.valorVencido) || 0; // Coleta o saldo devedor principal para cálculo de faixas e somas de topo.
        
        contadores[status]++; // Soma mais 1 unidade no contador numérico da coluna onde este cartão será inserido.
        somasFinanceiras[status] += valorCardNum; // Acumula matematicamente o valor vencido deste card filtrado no totalizador financeiro da coluna.
        
        // ==========================================
        // ATIVAÇÃO DO ALFAIATE VISUAL (SUBMÓDULO CARD)
        // ==========================================
        const cardFisico = cardComponent.criar(cobranca, status, callbackCliqueCard, callbackMudarSubStatus); // Invoca a fabricação do cartão premium customizado com bordinhas e cliques.
        
        elementoContainers[status].appendChild(cardFisico); // Pega o cartão totalmente desenhado pelo submódulo e o insere fisicamente dentro da respectiva coluna do CRM na tela.
      } // Encerra a verificação de existência da coluna física.
    }); // Encerra a varredura passando pela lista completa de clientes inadimplentes.

    Object.keys(elementoContainers).forEach(statusChave => { // Inicia uma varredura passando coluna por coluna mapeada no sistema.
      const colunaAlvo = elementoContainers[statusChave].parentElement; // Captura a estrutura da pasta cinza de fundo que envolve a lista de cartões.
      
      if (colunaAlvo) { // Se a coluna de destino estiver renderizada no HTML de verdade e acessível na árvore.
        colunaAlvo.addEventListener('dragover', (e) => { // Monitora o evento de quando um cartão flutuante passa por cima desta coluna cinza.
          e.preventDefault(); // Comando obrigatório do HTML5 para desbloquear o container e habilitar a ação de soltar objetos ali dentro.
          colunaAlvo.style.backgroundColor = '#e2e8f0'; // Adiciona uma cor de fundo cinza mais escura servindo de guia visual de mira pro cobrador.
        }); // Encerra o monitoramento do cartão passando por cima.

        colunaAlvo.addEventListener('dragleave', () => { // Monitora quando o cartão sai da área superior da coluna sem ser solto ali dentro.
          colunaAlvo.style.backgroundColor = '#f1f5f9'; // Devolve a cor original cinza claro de descanso padrão de CRM.
        }); // Encerra o monitoramento do cartão saindo de cima da coluna.

        colunaAlvo.addEventListener('drop', (e) => { // Captura o momento exato em que o operador larga o clique do mouse e solta o cartão dentro da nova coluna cinza.
          e.preventDefault(); // Impede comportamentos indesejados nativos de abertura de links ou downloads do navegador.
          colunaAlvo.style.backgroundColor = '#f1f5f9'; // Reseta o visual da coluna para a cor cinza de descanso original.
          
          const idCapturado = e.dataTransfer.getData('text/plain'); // Resgata o ID único do cliente que estava guardado na memória oculta do mouse.
          const statusOrigem = e.dataTransfer.getData('origem-status'); // Resgata o nome da coluna de onde o cliente veio antes de ser arrastado.
          
          if (idCapturado && statusOrigem !== statusChave) { // Verificação de segurança: se o ID foi extraído com sucesso e você jogou o card em uma coluna diferente da de origem.
            callbackBotaoAvancar(idCapturado, statusOrigem, statusChave); // Reaproveita o callback passando o ID, a origem e o destino real para o app.js sincronizar com o Firebase.
          } // Encerra a checação de segurança do drop.
        }); // Encerra o monitoramento da soltura do cartão.
      } // Encerra a checação do container cinza.
    }); // Encerra a injeção dos ouvintes de soltura nas colunas.

    Object.keys(contadores).forEach(status => { // Inicia um ciclo passando por cada uma das chaves de status do nosso objeto contador.
      const elementoContador = document.getElementById(`count-${status}`); // Localiza o pequeno círculo do contador no cabeçalho da coluna correspondente pelo ID.
      if (elementoContador) { // Se encontrar o totalizador físico montado na página.
        const dinheiroFormatado = (somasFinanceiras[status] || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 }); // Converte a somatória de juros e parcelas da coluna para o padrão brasileiro de leitura com centavos.
        
        const paiH2 = elementoContador.parentElement; // Localiza a tag H2 que abraça o nome da etapa e a pílula de valores.
        if (paiH2) { // Se a tag H2 estiver acessível na árvore da página.
          paiH2.style.display = 'flex'; // Força o cabeçalho a se comportar como um alinhador Flexbox horizontal nativo.
          paiH2.style.justifyContent = 'space-between'; // Cola o texto da etapa na extrema esquerda e joga os valores na extrema direita da raia.
          paiH2.style.alignItems = 'center'; // Alinha os centros dos textos na vertical para um visual simétrico perfeito.
          paiH2.style.width = '100%'; // Garante a ocupação total da largura interna da coluna cinza.
          paiH2.style.fontSize = '12px'; // Reduz milimetricamente a fonte do nome para garantir que termos longos caibam inteiros lado a lado sem estouros.
          paiH2.style.fontFamily = 'sans-serif'; // Uniformiza a fonte do título.
          paiH2.style.color = '#334155'; // Aplica o cinza escuro no texto do título da etapa.
        } // Encerra a estilização da tag H2.

        elementoContador.innerText = `${contadores[status]} • R$ ${dinheiroFormatado}`; // Reescreve o rótulo interno fundindo a quantidade de cards com o saldo em dinheiro da coluna.
        elementoContador.style.backgroundColor = '#e2e8f0'; // Aplica um fundo cinza de pílula arredondada moderna atrás dos saldos.
        elementoContador.style.color = '#475569'; // Coloca uma cor de fonte sóbria corporativa nos números.
        elementoContador.style.borderRadius = '20px'; // Estica o círculo transformando-o em uma tag oval elegante devido ao tamanho do texto de valores.
        elementoContador.style.fontSize = '10px'; // Reduz a fonte interna da pílula de valores para garantir o encaixe linear absoluto sem estouros.
        elementoContador.style.padding = '4px 10px'; // Compacta as margens internas de preenchimento da pílula de saldos.
        elementoContador.style.whiteSpace = 'nowrap'; // Bloqueia terminantemente o navegador de tentar quebrar os valores para uma linha de baixo.
        elementoContador.style.fontWeight = '700'; // Define o peso em negrito pesado para as métricas dos contadores.
      } // Encerra a verificação do elemento.
    }); // Encerra a atualização de cabeçalhos.
  } // Encerra a função mestre de renderização do componente de Kanban.
}; // Encerra a exportação do objeto de controle kanbanComponent.