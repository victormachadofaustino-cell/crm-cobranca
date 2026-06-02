export const tabelaPropostas = { // Define e exporta o submódulo especialista em renderizar e monitorar a grade de dados dos clientes com propostas.
  renderizar(containerTabela, cardsComProposta, callbackLinhaClicada) { // Função de desenho que recebe a gaveta física do HTML, a lista filtrada de devedores e a ação de clique do Maestro.
    
    // INICIALIZAÇÃO DE MEMÓRIA DE SEGURANÇA: Garante que as chaves de filtragem financeira da gaveta lateral existam para prevenir quebras assíncronas.
    if (!window.filtrosGavetaAcordosAtivos) { // Se o controle de filtros de acordos ainda não tiver sido instanciado na memória global do navegador.
      window.filtrosGavetaAcordosAtivos = { estadoTitulo: '', meioRecebimento: '' }; // Inicializa os seletores financeiros em branco por padrão de fábrica.
    } // Encerra a checagem da janela de memória.

    containerTabela.innerHTML = ''; // Esvazia resíduos ou listagens anteriores dentro do bloco para uma plotagem limpa e sem duplicações.

    // MOTOR DA PENEIRA FINANCEIRA REATIVA: Filtra o array original cruzando os dados das faturas com os critérios selecionados na gaveta lateral.
    const cardsComPropostaFiltrados = cardsComProposta.filter(cobranca => { // Inicia a filtragem passando de cliente em cliente da esteira de propostas.
      const faturasDoPlano = Array.isArray(cobranca.planoParcelas) ? cobranca.planoParcelas : []; // Captura a esteira de parcelas reais da retaguarda de caixa.
      const subStatusGeral = cobranca.subStatus || ''; // Resgata o status de encerramento geral do devedor no fluxo comercial.

      // FILTRAGEM REATIVA 1: Validação do Estado do Título (Pago, A Vencer ou Vencido)
      if (window.filtrosGavetaAcordosAtivos.estadoTitulo) { // Se o operador tiver selecionado alguma opção na caixinha de filtro de estados da gaveta.
        const filtroEstado = window.filtrosGavetaAcordosAtivos.estadoTitulo; // Captura o termo de busca financeira selecionado na sessão atual.
        
        if (filtroEstado === 'pago') { // Se o faturamento quer ver apenas faturas liquidadas no banco.
          const possuiParcelaPaga = faturasDoPlano.some(f => f.pago || f.status === 'pago'); // Varre o plano em busca de ao menos um carimbo verde de sucesso.
          if (!possuiParcelaPaga) return false; // Ignora o cliente na listagem caso ele não tenha nenhuma fatura baixada em dinheiro real.
        }
        else if (filtroEstado === 'aberto') { // Se o operador selecionou para monitorar faturas pendentes ou a vencer.
          const possuiParcelaAberta = faturasDoPlano.some(f => !f.pago && f.status !== 'pago' && f.status !== 'baixado' && subStatusGeral !== 'baixado'); // Busca por parcelas limpas em aberto.
          if (!possuiParcelaAberta) return false; // Esconde o cliente se todas as faturas dele já estiverem encerradas ou quitadas.
        }
        else if (filtroEstado === 'atraso') { // Se o foco for rastrear acordos rompidos ou boletos que estouraram o prazo.
          if (subStatusGeral === 'baixado') return true; // Se o veredicto final do card foi "Baixado Perda", mantém visível no alerta de quebra.
          const possuiParcelaVencida = faturasDoPlano.some(f => { // Inicia uma varredura interna nos boletos emitidos para este cliente.
            if (f.pago || f.status === 'pago' || f.status === 'baixado') return false; // Pula boletos já resolvidos ou desconsiderados.
            const hojeString = new Date().toISOString().split('T')[0]; // CORRIGIDO: Captura o dia de hoje em formato de texto para evitar erros de fusos horários do Objeto Date.
            return f.vencimento < hojeString; // CORRIGIDO: Compara as datas de forma textual estrita, blindando o sistema contra falhas de servidores externos.
          });
          if (!possuiParcelaVencida) return false; // Oclui a linha se o cliente estiver rigorosamente em dia com os prazos.
        }
      }

      // FILTRAGEM REATIVA 2: Validação pelo Meio de Recebimento (Boleto, Crédito ou Débito)
      if (window.filtrosGavetaAcordosAtivos.meioRecebimento) { // Se houver um meio de recebimento preferencial selecionado no painel da gaveta.
        const filtroMeio = window.filtrosGavetaAcordosAtivos.meioRecebimento.toLowerCase().trim(); // Padroniza a string de busca em caixa baixa e remove espaços vazios.
        const possuiMeioProposta = faturasDoPlano.some(f => (f.formaPagamento || '').toLowerCase().trim().includes(filtroMeio)); // Verifica se a forma de pagamento bate com a selecionada.
        if (!possuiMeioProposta) return false; // Esconde a linha caso nenhuma parcela use o meio bancário desejado.
      }

      return true; // Mantém o cliente visível na planilha executiva caso passe com sucesso por todas as peneiras.
    }); // Fim do filtro elástico de devedores.

    // INJEÇÃO DA MOLDURA DA GRADE: Caso a esteira esteja deserta após os filtros, exibe mensagem neutra; caso contrário, monta o esqueleto estrutural da tabela.
    containerTabela.innerHTML = `
      ${cardsComPropostaFiltrados.length === 0 ? `
        <div style="text-align: center; color: #94a3b8; font-size: 13px; padding: 40px 0; font-style: italic;"> Nenhuma cobrança com proposta ativa localizada no momento com os filtros aplicados. </div> 
      ` : `
        <div style="overflow-x: auto; width: 100%; background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; box-shadow: 0 1px 2px rgba(0,0,0,0.01);"> 
          <h4 style="font-size: 13px; font-weight: bold; color: #475569; margin: 0 0 12px 0;">📋 Carteira Activa de Acordos & Propostas</h4>
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 13px;"> 
            <thead> 
              <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; color: #475569; font-weight: bold;"> 
                <th style="padding: 10px;">Código</th> 
                <th style="padding: 10px;">Nome do Cliente</th> 
                <th style="padding: 10px;">Etapa Atual</th> 
                <th style="padding: 10px;">Valor Total do Acordo</th> 
                <th style="padding: 10px; text-align: center;">Ações Operacionais de Caixa</th> 
              </tr> 
            </thead> 
            <tbody id="linhas-físicas-tabela-acordos"></tbody> </table> 
        </div> `}
    `; // Encerra a injeção da carcaça base da planilha de acordos.

    if (cardsComPropostaFiltrados.length === 0) return; // Interrompe o script de forma segura caso o deserto esteja vazio, poupando processamento.

    const corpoTabelaFisico = document.getElementById('linhas-físicas-tabela-acordos'); // Captura a área interna recém-criada da tabela para iniciar a injeção.

    // LAÇO DE RENDERIZAÇÃO: Percorre o array de cartões filtrados injetando linha por linha na grade de faturamento.
    cardsComPropostaFiltrados.forEach(cobranca => { // Passa montando o visual linha por linha dos clientes capturados.
      const linhaTr = document.createElement('tr'); // Fabrica uma linha de tabela (tr) física em tempo de execução.
      linhaTr.className = 'linha-cliente-esteira-acordos'; // Assina a linha com uma classe de controle comum para capturar os cliques.
      linhaTr.setAttribute('data-id', cobranca.id); // Atribui à tag o identificador exclusivo do registro para auditoria.
      linhaTr.style.cssText = 'border-bottom: 1px solid #e2e8f0; cursor: pointer; transition: background 0.1s;'; // Estiliza com cursor de clique e transição suave de fundo.
      
      // Formata o valor bruto reativo somado na proposta para o padrão de leitura nacional com milhar e centavam.
      const valorTotalFormatado = (cobranca.proposta?.valorCobrado || cobranca.valorVencido || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
      const statusSeguro = (cobranca.status || 'novo').toUpperCase(); // CORRIGIDO: Adicionada proteção com opcional encadeado para evitar quebras se o status estiver em branco.
      
      linhaTr.innerHTML = `
        <td style="padding: 12px; font-weight: 600; color: #64748b;">${cobranca.codigo}</td> 
        <td style="padding: 12px; font-weight: bold; color: #1e293b; text-transform: uppercase;">${cobranca.cliente}</td> 
        <td style="padding: 12px;"><span style="background: #f1f5f9; color: #475569; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: bold; border: 1px solid #cbd5e1;">${statusSeguro}</span></td> 
        <td style="padding: 12px; font-weight: bold; color: #10b981;">R$ ${valorTotalFormatado}</td> 
        <td style="padding: 12px; text-align: center;">
            <button type="button" style="background: #2563eb; color: white; border: none; padding: 5px 12px; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer;">⚡ Intervir / Ver Proposta</button>
        </td> 
      `; // Conclui a montagem interna das células da linha com dados de ID, Razão Social e os botões de ação rápida.
      
      corpoTabelaFisico.appendChild(linhaTr); // Fixa o bloco completo construído dentro do corpo da tabela visível no navegador.
    }); // Fim do loop de criação de linhas.

    // MONITOR DE GATILHOS INTERNOS: Escuta os cliques nas linhas geradas e encaminha o ID de forma limpa para o callback do Maestro.
    corpoTabelaFisico.querySelectorAll('.linha-cliente-esteira-acordos').forEach(linhaElemento => { // Seleciona todos os elementos criados na esteira.
      linhaElemento.addEventListener('click', (e) => { // Cria um ouvinte para interceptar o clique do mouse do operador.
        const idCapturado = linhaElemento.getAttribute('data-id'); // Resgata o ID único assinado na linha clicada.
        callbackLinhaClicada(idCapturado); // Dispara a notificação enviando o identificador para a moldura mestre abrir o mini-modal.
      }); // Fim do escutador de cliques.
    }); // Fim do laço de monitoramento.
  } // Encerra a função de preenchimento da grade.
}; // Encerra a exportação do submódulo tabelaPropostas.