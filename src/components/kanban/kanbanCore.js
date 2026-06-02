import { cardComponent } from "./cardComponent"; // [Dev Sênior] Importa o componente que sabe desenhar o visual individual de cada cartão branco na tela. // CORRIGIDO: GPS ajustado para importar o alfaiate visual dos cartões na mesma pasta local do desmembramento, eliminando o erro 500.
import { kanbanFiltros } from "./kanbanFiltros"; // [Dev Sênior] Importa a peneira lógica modular que checa se o cliente atende aos filtros da direita. // CORRIGIDO: GPS ajustado para importar a peneira de filtros na mesma pasta local do desmembramento, alinhando a planilha e o Kanban.
import { cadastroEmpresa } from "../cadastros/cadastroEmpresa"; // [Dev Sênior] CORREÇÃO DO ERRO 500: Ajustado o GPS de localização de arquivos para o Vite achar a pasta de cadastros sem travar o motor do servidor.

export const kanbanComponent = { // [Dev Sênior] Define e exporta o objeto mestre modular do Kanban para que o arquivo mestre app.js consiga gerenciar o tabuleiro.
  renderizar(cobrancas, elementoContainers, callbackBotaoAvancar, callbackCliqueCard, callbackMudarSubStatus) { // [Dev Sênior] Cria a função mestre que desenha o painel recebendo os dados da nuvem, os containers físicos e as ações de clique e fechamento.
    
    // INICIALIZAÇÃO DE MEMÓRIA DE SEGURANÇA: Garante a existência do objeto global de filtros da gaveta para evitar quebras de inicialização assíncronas.
    if (!window.filtrosGavetaCrmAtivos) { // [Dev Sênior] Se a gaveta de filtros rápidos da direita nunca tiver sido aberta ou configurada na sessão atual.
      window.filtrosGavetaCrmAtivos = { responsavel: '', faixaValor: '', nivelAtraso: '', semTarefas: false }; // [Dev Sênior] Registra a estrutura limpa de fábrica na sessão para evitar panes de leitura.
    } // [Dev Sênior] Encerra o bloco de segurança.

    const contadores = {}; // [Dev Sênior] Inicia o objeto de contadores vazio para ser montado de forma reativa sem travar em colunas ou fases fixas engessadas.
    const somasFinanceiras = {}; // [Dev Sênior] Cria um objeto para acumular a somatória em dinheiro de cada etapa do funil de cobrança.
    
    Object.keys(elementoContainers).forEach(status => { // [Dev Sênior] Passa olhando cada uma das colunas que existem de verdade no banco de dados neste momento.
      contadores[status] = 0; // [Dev Sênior] Inicializa o contador daquela coluna específica zerado para começarmos o recálculo do painel.
      somasFinanceiras[status] = 0; // [Dev Sênior] Inicializa a somatória de dinheiro em zero para cada coluna mapeada no CRM.
    }); // [Dev Sênior] Encerra o ciclo de criação dos contadores reativos.
    
    Object.values(elementoContainers).forEach(c => c.innerHTML = ''); // [Dev Sênior] Passa limpando o conteúdo antigo de todas as colunas da tela para evitar que os cartões fiquem duplicados.

    // GARANTE QUE AS COBRANÇAS ENTREREM COMO ARRAY: Evita quebras caso o Firebase retorne um valor nulo inicial.
    const listaCobrancasSegura = Array.isArray(cobrancas) ? cobrancas : []; // [Dev Sênior] Vacinador de dados: garante que o laço rode sobre uma lista legítima de array, impedindo travamentos.

    listaCobrancasSegura.forEach((cobranca) => { // [Dev Sênior] Inicia uma varredura passando de cliente em cliente da lista enviada pelo banco de dados.
      const status = cobranca.status || 'novo'; // [Dev Sênior] Identifica em qual etapa o cliente está ou define 'novo' (A Iniciar) caso esteja sem nenhuma coluna definida.
      
      // ==========================================
      // ATIVAÇÃO DA PENEIRA MODULAR (SUBMÓDULO FILTROS)
      // ==========================================
      if (kanbanFiltros.validar(cobranca, status) === false) { // [Dev Sênior] Consulta a peneira modularizada para julgar os filtros da gaveta lateral.
        return; // [Dev Sênior] Interrompe a execução e pula o desenho deste card se o submódulo apontar que ele violou as regras da gaveta lateral.
      } // [Dev Sênior] Encerra o bloco do filtro.

      if (elementoContainers[status]) { // [Dev Sênior] Verifica se a coluna física correspondente àquele status realmente existe na tela do navegador.
        const valorCardNum = parseFloat(cobranca.valorVencido) || 0; // [Dev Sênior] Coleta o saldo devedor principal para cálculo de faixas e somas de topo.
        
        contadores[status]++; // [Dev Sênior] Soma mais 1 unidade no contador numérico da coluna onde este cartão será inserido.
        somasFinanceiras[status] += valorCardNum; // [Dev Sênior] Acumula matematicamente o valor vencido deste card filtrado no totalizador financeiro da coluna.
        
        // ==========================================
        // ACOPLAMENTO DO NOVO MOTOR CADASTRO EMPRESA
        // ==========================================
        const metaRelevancia = cadastroEmpresa.tratarRelevancia(cobranca.valorVencido); // [Dev Sênior] Aciona o motor para carimbar se a empresa é de alta importância ou pequeno valor.
        const metaNegligencia = cadastroEmpresa.checarNegligencia(cobranca.tarefas, status); // [Dev Sênior] Aciona o motor para rastrear se este cliente foi esquecido sem lembretes de retorno.
        const metaTempoLote = cadastroEmpresa.calcularTempoLote(cobranca.dataEnvio); // [Dev Sênior] Aciona o motor para medir a temperatura e os dias corridos do processo em atraso.

        // [Dev Sênior] Injeta os carimbos calculados pela nossa central de triagem direto na ficha temporária do cliente.
        cobranca.metaInfo = { relevancia: metaRelevancia, negligencia: metaNegligencia, tempo: metaTempoLote }; // [Dev Sênior] Guarda o pacote limpo de dados dentro da cobrança atual.

        // ==========================================
        // ATIVAÇÃO DO ALFAIATE VISUAL (SUBMÓDULO CARD)
        // ==========================================
        const cardFisico = cardComponent.criar(cobranca, status, callbackCliqueCard, callbackMudarSubStatus); // [Dev Sênior] Invoca a fabricação do cartão premium customizado com bordinhas, cliques e novos metadados de cadastro.
        
        elementoContainers[status].appendChild(cardFisico); // [Dev Sênior] Pega o cartão totalmente desenhado pelo submódulo e o insere fisicamente dentro da respectiva coluna do CRM na tela.
      } // [Dev Sênior] Encerra a verificação de existência da coluna física.
    }); // [Dev Sênior] Encerra a varredura passando pela lista completa de clientes inadimplentes.

    Object.keys(elementoContainers).forEach(statusChave => { // [Dev Sênior] Inicia uma varredura passando coluna por coluna mapeada no sistema.
      const colunaAlvo = elementoContainers[statusChave].parentElement; // [Dev Sênior] Captura a estrutura da pasta cinza de fundo que envolve a lista de cartões.
      
      if (colunaAlvo) { // [Dev Sênior] Se a coluna de destino estiver renderizada no HTML de verdade e acessível na árvore.
        colunaAlvo.addEventListener('dragover', (e) => { // [Dev Sênior] Monitora o evento de quando um cartão flutuante passa por cima desta coluna cinza.
          e.preventDefault(); // [Dev Sênior] Comando obrigatório do HTML5 para desbloquear o container e habilitar a ação de soltar objetos ali dentro.
          colunaAlvo.style.backgroundColor = '#e2e8f0'; // [Dev Sênior] Adiciona uma cor de fundo cinza mais escura servindo de guia visual de mira pro cobrador.
        }); // [Dev Sênior] Encerra o monitoramento do cartão passando por cima.

        colunaAlvo.addEventListener('dragleave', () => { // [Dev Sênior] Monitora quando o cartão sai da área superior da coluna sem ser solto ali dentro.
          colunaAlvo.style.backgroundColor = '#f1f5f9'; // [Dev Sênior] Devolve a cor original cinza claro de descanso padrão de CRM.
        }); // [Dev Sênior] Encerra o monitoramento do cartão saindo de cima da coluna.

        colunaAlvo.addEventListener('drop', (e) => { // [Dev Sênior] Captura o momento exato em que o operador larga o clique do mouse e solta o cartão dentro da nova coluna cinza.
          e.preventDefault(); // [Dev Sênior] Impede comportamentos indesejados nativos de abertura de links ou downloads do navegador.
          colunaAlvo.style.backgroundColor = '#f1f5f9'; // [Dev Sênior] Reseta o visual da coluna para a cor cinza de descanso original.
          
          const idCapturado = e.dataTransfer.getData('text/plain'); // [Dev Sênior] Resgata o ID único do cliente que estava guardado na memória oculta do mouse.
          const statusOrigem = e.dataTransfer.getData('origem-status'); // [Dev Sênior] Resgata o nome da coluna de onde o cliente veio antes de ser arrastado.
          
          if (idCapturado && statusOrigem !== statusChave) { // [Dev Sênior] Verificação de segurança: se o ID foi extraído com sucesso e você jogou o card em uma coluna diferente da de origem.
            callbackBotaoAvancar(idCapturado, statusOrigem, statusChave); // [Dev Sênior] Reaproveita o callback passando o ID, a origem e o destino real para o app.js sincronizar com o Firebase.
          } // [Dev Sênior] Encerra a checação de segurança do drop.
        }); // [Dev Sênior] Encerra o monitoramento da soltura do cartão.
      } // [Dev Sênior] Encerra a checação do container cinza.
    }); // [Dev Sênior] Encerra a injeção dos ouvintes de soltura nas colunas.

    Object.keys(contadores).forEach(status => { // [Dev Sênior] Inicia um ciclo passando por cada uma das chaves de status do nosso objeto contador.
      const elementoContador = document.getElementById(`count-${status}`); // [Dev Sênior] Localiza o pequeno círculo do contador no cabeçalho da coluna correspondente pelo ID.
      if (elementoContador) { // [Dev Sênior] Se encontrar o totalizador físico montado na página.
        const dinheiroFormatado = (somasFinanceiras[status] || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 }); // [Dev Sênior] Converte a somatória de juros e parcelas da coluna para o padrão brasileiro de leitura com centavos.
        
        const paiH2 = elementoContador.parentElement; // [Dev Sênior] Localiza a tag H2 que abraça o nome da etapa e a pílula de valores.
        if (paiH2) { // [Dev Sênior] Se a tag H2 estiver acessível na árvore da página.
          paiH2.style.display = 'flex'; // [Dev Sênior] Força o cabeçalho a se comportar como um alinhador Flexbox horizontal nativo.
          paiH2.style.justifyContent = 'space-between'; // [Dev Sênior] Cola o texto da etapa na extrema esquerda e joga os valores na extrema direita da raia.
          paiH2.style.alignItems = 'center'; // [Dev Sênior] Alinha os centros dos textos na vertical para um visual simétrico perfeito.
          paiH2.style.width = '100%'; // [Dev Sênior] Garante a ocupação total da largura interna da coluna cinza.
          paiH2.style.fontSize = '12px'; // [Dev Sênior] Reduz milimetricamente a fonte do nome para garantir que termos longos caibam inteiros lado a lado sem estouros.
          paiH2.style.fontFamily = 'sans-serif'; // [Dev Sênior] Uniformiza a fonte do título.
          paiH2.style.color = '#334155'; // [Dev Sênior] Aplica o cinza escuro no texto do título da etapa.
        } // [Dev Sênior] Encerra a estilização da tag H2.

        elementoContador.innerText = `${contadores[status]} • R$ ${dinheiroFormatado}`; // [Dev Sênior] Reescreve o rótulo interno fundindo a quantidade de cards com o saldo em dinheiro da coluna.
        elementoContador.style.backgroundColor = '#e2e8f0'; // [Dev Sênior] Aplica um fundo cinza de pílula arredondada moderna atrás dos saldos.
        elementoContador.style.color = '#475569'; // [Dev Sênior] Coloca uma cor de fonte sóbria corporativa nos números.
        elementoContador.style.borderRadius = '20px'; // [Dev Sênior] Estica o círculo transformando-o em uma tag oval elegante devido ao tamanho do texto de valores.
        elementoContador.style.fontSize = '10px'; // [Dev Sênior] Reduz a fonte interna da pílula de valores para garantir o encaixe linear absoluto sem estouros.
        elementoContador.style.padding = '4px 10px'; // [Dev Sênior] Compacta as margens internas de preenchimento da pílula de saldos.
        elementoContador.style.whiteSpace = 'nowrap'; // [Dev Sênior] Bloqueia terminantemente o navegador de tentar quebrar os valores para uma linha de baixo.
        elementoContador.style.fontWeight = '700'; // [Dev Sênior] Define o peso em negrito pesado para as métricas dos contadores.
      } // [Dev Sênior] Encerra a verificação do elemento.
    }); // [Dev Sênior] Encerra a atualização de cabeçalhos.
  } // [Dev Sênior] Encerra a função principal de renderização do componente de Kanban.
}; // [Dev Sênior] Encerra a exportação do objeto de controle kanbanComponent.