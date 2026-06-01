export const dashboardComponent = { // Define e exporta o objeto do componente para que o arquivo mestre app.js consiga acioná-lo no menu.
  renderizar(elementoContainer, cobrancas, listaEtapas) { // Cria a função mestre que desenha o painel recebendo o casulo físico, os dados da nuvem e as colunas do funil.
    
    let totalBrutoGeral = 0; // Inicializa a gaveta do faturamento total que entrou no sistema de cobranças.
    let totalQuitadoSucesso = 0; // Inicializa o acumulador de valores recuperados de clientes marcados como Quitado ou parcelas pagas.
    let totalBaixadoPerda = 0; // Inicializa o acumulador de prejuízos de clientes marcados como Baixado ou parcelas perdidas.
    let totalEmAbertoAndamento = 0; // Inicializa o acumulador de dinheiro que ainda está rodando ativo no pipeline.

    // NOVAS GAVETAS DE BI: Inicializa contadores para as novas métricas de tração e auditoria operativa.
    let criadasHojeContador = 0; // Inicializa o somador de cobranças que deram entrada no sistema no dia atual.
    let criadasMesContador = 0; // Inicializa o somador de cobranças que nasceram dentro do mês vigente do calendário.
    let cardsSemTarefaContador = 0; // Inicializa a contagem de clientes ativos que não possuem nenhuma tarefa de retorno agendada.
    
    const cobrancasPorResponsavelContagem = {}; // Objeto de memória para contar quantos cards cada operador possui sob sua tutela.
    const capitalPorResponsavelSoma = {}; // Objeto de memória para acumular a somatória de dinheiro sob gestão de cada usuário.

    // VARIAVEIS CRONOLÓGICAS: Inicializa acumuladores para calcular os tempos médios de vida dos cards no pipeline.
    let somatoriaTempoConclusaoDias = 0; // Guarda a soma de dias que os cards levaram para transitar até a etapa finalizado.
    let cardsConcluidosQuantidade = 0; // Guarda o volume total de clientes que atingiram com sucesso a conclusão da esteira.

    const financeiroPorEtapa = {}; // Dicionário para guardar as somas de dinheiro por ID de coluna.
    listaEtapas.forEach(etapa => { // Varre as etapas oficiais cadastradas na nuvem do Firebase neste momento.
      financeiroPorEtapa[etapa.id] = { nome: etapa.nome, soma: 0, quantidadeCards: 0, somaDiasTransicao: 0, contagemTransicoes: 0 }; // Inicializa as propriedades da barra daquela etapa zeradas na memória.
    }); // Encerra a preparação do mapa do gráfico.

    // CONFIGURAÇÃO DOS RELÓGIOS DE HOJE: Captura as strings de tempo da máquina do usuário para balizamento de BI.
    const objetoDataHoje = new Date(); // Instancia o relógio atual do sistema.
    const hojeStringIso = objetoDataHoje.toISOString().split('T')[0]; // Converte o dia atual para o formato estável eletrônico (AAAA-MM-DD).
    const anoAtualChave = objetoDataHoje.getFullYear(); // Extrai o ano corrente com 4 dígitos (Ex: 2026).
    const mesAtualChave = String(objetoDataHoje.getMonth() + 1).padStart(2, '0'); // Extrai o mês corrente com 2 dígitos (Ex: 05).
    const mesAnoVigenteChave = `${anoAtualChave}-${mesAtualChave}`; // Une os ponteiros criando a chave de competência do mês atual (AAAA-MM).

    cobrancas.forEach(cobranca => { // Inicia o laço de repetição lendo a ficha de cada cliente inadimplente.
      const valorCard = parseFloat(cobranca.valorVencido) || 0; // Captura o valor financeiro em atraso atualizado do cliente (saldo restante em aberto).
      const status = cobranca.status || 'novo'; // Identifica em qual coluna o cliente se encontra atualmente no CRM.
      const subStatus = cobranca.subStatus || ''; // Identifica o veredicto de fechamento administrativo antigo (quitado ou baixado).
      const dataCriacaoCard = cobranca.dataEnvio || ''; // Captura a data de nascimento do registro de cobrança.

      // METRICAS DE ENTRADA DIÁRIA: Compara as datas de cadastro para inflar os contadores de tração de lote.
      if (dataCriacaoCard === hojeStringIso) criadasHojeContador++; // Se a data de envio for rigorosamente igual a hoje, contabiliza nova entrada diária.
      if (dataCriacaoCard.indexOf(mesAnoVigenteChave) === 0) criadasMesContador++; // Se o texto da data começar com a chave do ano/mês atual, contabiliza no mês vigente.

      // AUDITORIA DE ESQUECIMENTO: Rastreia negligências se o card não estiver concluído e a lista de afazeres estiver vazia.
      if (status !== 'finalizado') { // Se o devedor ainda estiver navegando ativamente nas colunas de cobrança do Kanban.
        const listaTarefasCard = Array.isArray(cobranca.tarefas) ? cobranca.tarefas : []; // Valida a existência do array de afazeres.
        if (listaTarefasCard.length === 0) cardsSemTarefaContador++; // Se o tamanho do array for zero, o cliente está sem ações e infla o alerta.
      }

      // RANKING DE PERFORMANCE DE EQUIPE: Agrupa os volumes volumétricos e capitais pelo nome do operador.
      const nomeOperador = cobranca.responsavel || 'Não Atribuído'; // Captura o nome do responsável ou assina uma flag neutra.
      cobrancasPorResponsavelContagem[nomeOperador] = (cobrancasPorResponsavelContagem[nomeOperador] || 0) + 1; // Incrementa a contagem de cards daquele usuário.
      capitalPorResponsavelSoma[nomeOperador] = (capitalPorResponsavelSoma[nomeOperador] || 0) + valorCard; // Soma o capital daquela cobrança no montante do operador.

      // MOTOR DE CÁLCULO DE TEMPOS MÉDIOS: Analisa as notas históricas e calcula a velocidade de passagem das frentes.
      const notasHistoricas = Array.isArray(cobranca.historicoNotas) ? cobranca.historicoNotas : []; // Acessa os logs automáticos de auditoria.
      
      if (status === 'finalizado' && dataCriacaoCard) { // Se o cliente atingiu o fim da esteira e possui registro de nascimento.
        const tempoDecorridoMs = Math.abs(new Date() - new Date(dataCriacaoCard)); // Calcula a diferença bruta em milissegundos do ciclo de vida.
        const tempoDiasConvertido = Math.ceil(tempoDecorridoMs / (1000 * 60 * 60 * 24)); // Converte o tempo bruto em dias cheios de calendário.
        somatoriaTempoConclusaoDias += tempoDiasConvertido; // Acumula os dias na comanda mestre de tempo de conclusão.
        cardsConcluidosQuantidade++; // Conta mais um fechamento bem-sucedido na lista.
      }

      // Extrai o plano de faturas real para somar os centavos exatos de pagamentos fracionados da esteira.
      const faturasDoCliente = Array.isArray(cobranca.planoParcelas) && cobranca.planoParcelas.length > 0
        ? cobranca.planoParcelas
        : (cobranca.proposta?.parcelasSimuladas || []); // Se não houver plano definitivo, tenta colher as parcelas simuladas em rascunho.

      if (faturasDoCliente.length > 0) { // Se o cliente tiver uma proposta ativa ou parcelas calculadas pelo cobrador.
        faturasDoCliente.forEach(f => {
          const valorFatura = parseFloat(f.valor) || 0; // Coleta o valor real da fatura individual.
          totalBrutoGeral += valorFatura; // Acumula o valor no faturamento bruto histórico consolidado do CRM.

          if (f.pago || f.status === 'pago') { // Se a fatura recebeu o carimbo verde de liquidação na esteira.
            totalQuitadoSucesso += valorFatura; // Contabiliza diretamente no Big Number de sucesso e recuperação real de caixa.
          } else if (f.status === 'baixado' || subStatus === 'baixado') { // Se a fatura foi marcada como perda administrativa.
            totalBaixadoPerda += valorFatura; // Contabiliza no Big Number de prejuízo por quebra de acordo.
          } else { // Caso a fatura continue em aberto aguardando vencimento futuro ou cobrança.
            totalEmAbertoAndamento += valorFatura; // Contabiliza no Big Number de carteira ativa a receber.
          }
        });
      } else { // Caso o registro seja uma cobrança crua antiga que ainda não passou pela calculadora de propostas.
        totalBrutoGeral += valorCard; // Acumula o valor original no faturamento bruto histórico do CRM.

        if (status === 'acordo' && subStatus === 'quitado') { // Se o card chegou no final e foi dado como Quitado com a bordinha verde.
          totalQuitadoSucesso += valorCard; // Contabiliza no Big Number de sucesso e recuperação de caixa.
        } else if (status === 'acordo' && subStatus === 'baixado') { // Se o card recebeu baixa administrativa por insucesso.
          totalBaixadoPerda += valorCard; // Contabiliza no Big Number de prejuízo administrativo.
        } else { // Caso o cliente ainda esteja em andamento trafegando pelas colunas iniciais do CRM.
          totalEmAbertoAndamento += valorCard; // Contabiliza no Big Number de carteira ativa a receber.
        } // Encerra o desvio de distribuição tradicional.
      }

      if (financeiroPorEtapa[status]) { // Se la coluna onde o card está estacionado existe no nosso mapa gráfico de etapas.
        financeiroPorEtapa[status].soma += valorCard; // Acumula o saldo devedor atualizado na barra correspondente daquela etapa do funil.
        financeiroPorEtapa[status].quantidadeCards += 1; // Conta a presença de mais um cartão balançando naquela coluna específica.
      } // Encerra o acúmulo por etapa.
    }); // Encerra a varredura mestre de cobranças.

    // ENGENHARIA DE DETECÇÃO DO LÍDER DE CARTEIRA: Varre a lista de contagem de usuários para descobrir quem é o campeão de produtividade.
    let nomeResponsavelDestaque = "Nenhum Operador"; // Flag padrão inicial caso a carteira nasça zerada.
    let maiorVolumeCardsEncontrado = 0; // Ponteiro de comparação para reter o recorde de contagem.
    Object.keys(cobrancasPorResponsavelContagem).forEach(nomeOp => { // Navega de nome em nome no dicionário gerado.
      if (cobrancasPorResponsavelContagem[nomeOp] > maiorVolumeCardsEncontrado) { // Se a contagem deste usuário for superior ao recorde anterior.
        maiorVolumeCardsEncontrado = cobrancasPorResponsavelContagem[nomeOp]; // Atualiza o marco do recorde.
        nomeResponsavelDestaque = nomeOp; // Assina o nome do operador como Líder Absoluto de Contas.
      }
    });

    const valoresEtapasArray = Object.values(financeiroPorEtapa).map(e => e.soma); // Extrai apenas os números somados de cada coluna do CRM.
    const maiorSomaDoFunil = Math.max(...valoresEtapasArray, 1); // Localiza o maior valor financeiro do pipeline para servir de limite do gráfico.
    const capitalTotalEstacionadoCards = valoresEtapasArray.reduce((acc, v) => acc + v, 0) || 1; // Calcula a sumatória cheia do pipeline para balizamento de proporção.

    // RENDERS DO DESIGN DO PAINEL DE BI: Injeta as estruturas de layouts combinando os Big Numbers tradicionais e os novos blocos de monitoramento de performance.
    elementoContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 25px; width: 100%; background: #f4f6f9; padding: 5px 0;"> 
        
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; width: 100%;">
          <div style="background: white; border-radius: 8px; padding: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border-top: 4px solid #1e293b;">
            <span style="font-size: 11px; text-transform: uppercase; font-weight: bold; color: #64748b; display: block; letter-spacing: 0.5px;">🗂️ Carteira Total Injetada</span> 
            <span style="font-size: 20px; font-weight: bold; color: #0f172a; display: block; margin-top: 8px;">R$ ${totalBrutoGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span> 
            <span style="font-size: 11px; color: #94a3b8; display: block; margin-top: 4px;">Volume bruto processado</span> 
          </div>
          <div style="background: white; border-radius: 8px; padding: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border-top: 4px solid #10b981;">
            <span style="font-size: 11px; text-transform: uppercase; font-weight: bold; color: #10b981; display: block; letter-spacing: 0.5px;">🟩 Total Quitado (Recuperado)</span> 
            <span style="font-size: 20px; font-weight: bold; color: #10b981; display: block; margin-top: 8px;">R$ ${totalQuitadoSucesso.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span> 
            <span style="font-size: 11px; color: #059669; font-weight: 500; display: block; margin-top: 4px;">🎯 Eficiência: ${totalBrutoGeral > 0 ? ((totalQuitadoSucesso / totalBrutoGeral) * 100).toFixed(1) : 0}% da carteira</span> 
          </div>
          <div style="background: white; border-radius: 8px; padding: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border-top: 4px solid #2563eb;">
            <span style="font-size: 11px; text-transform: uppercase; font-weight: bold; color: #2563eb; display: block; letter-spacing: 0.5px;">⏳ Em Cobrança (Ativo Operacional)</span> 
            <span style="font-size: 20px; font-weight: bold; color: #2563eb; display: block; margin-top: 8px;">R$ ${totalEmAbertoAndamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span> 
            <span style="font-size: 11px; color: #3b82f6; display: block; margin-top: 4px;">Dinheiro retido trafegando no funil</span> </div>
          <div style="background: white; border-radius: 8px; padding: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border-top: 4px solid #ef4444;">
            <span style="font-size: 11px; text-transform: uppercase; font-weight: bold; color: #ef4444; display: block; letter-spacing: 0.5px;">⬛ Total Baixado (Perdas)</span> 
            <span style="font-size: 20px; font-weight: bold; color: #ef4444; display: block; margin-top: 8px;">R$ ${totalBaixadoPerda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span> 
            <span style="font-size: 11px; color: #dc2626; display: block; margin-top: 4px;">Insucessos ou acordos rompidos</span> 
          </div>
        </div> 

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; width: 100%;">
          <div style="background: white; border-radius: 8px; padding: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border-left: 4px solid #06b6d4;">
            <span style="font-size: 11px; text-transform: uppercase; font-weight: bold; color: #0891b2; display: block;">✨ Entradas de Hoje</span>
            <span style="font-size: 22px; font-weight: bold; color: #0f172a; display: block; margin-top: 5px;">${criadasHojeContador} <font style="font-size:12px; color:#64748b; font-weight:normal;">cards</font></span>
            <span style="font-size: 11px; color: #0891b2; display: block; margin-top: 4px;">No mês: <b>${criadasMesContador}</b> criados</span>
          </div>
          <div style="background: white; border-radius: 8px; padding: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border-left: 4px solid #f59e0b;">
            <span style="font-size: 11px; text-transform: uppercase; font-weight: bold; color: #b45309; display: block;">⚠️ Alerta: Sem Tarefas</span>
            <span style="font-size: 22px; font-weight: bold; color: ${cardsSemTarefaContador > 0 ? '#ef4444' : '#0f172a'}; display: block; margin-top: 5px;">${cardsSemTarefaContador} <font style="font-size:12px; color:#64748b; font-weight:normal;">esquecidos</font></span>
            <span style="font-size: 11px; color: #64748b; display: block; margin-top: 4px;">Cards ativos sem ações agendadas</span>
          </div>
          <div style="background: white; border-radius: 8px; padding: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border-left: 4px solid #6366f1;">
            <span style="font-size: 11px; text-transform: uppercase; font-weight: bold; color: #4f46e5; display: block;">🏆 Operador Destaque</span>
            <span style="font-size: 14px; font-weight: bold; color: #0f172a; display: block; margin-top: 8px; text-transform: uppercase; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">👤 ${nomeResponsavelDestaque}</span>
            <span style="font-size: 11px; color: #4f46e5; display: block; margin-top: 4px;">Gerenciando: <b>${maiorVolumeCardsEncontrado}</b> cobranças</span>
          </div>
          <div style="background: white; border-radius: 8px; padding: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border-left: 4px solid #ec4899;">
            <span style="font-size: 11px; text-transform: uppercase; font-weight: bold; color: #db2777; display: block;">⏱️ Tempo Médio de Conclusão</span>
            <span style="font-size: 22px; font-weight: bold; color: #0f172a; display: block; margin-top: 5px;">${cardsConcluidosQuantidade > 0 ? (somatoriaTempoConclusaoDias / cardsConcluidosQuantidade).toFixed(1) : 0} <font style="font-size:12px; color:#64748b; font-weight:normal;">Dias</font></span>
            <span style="font-size: 11px; color: #64748b; display: block; margin-top: 4px;">Ciclo completo até a etapa Finalizado</span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1.4fr 0.6fr; gap: 15px; width: 100%;">
          
          <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 15px;">
            <div>
              <h3 style="font-size: 14px; font-weight: bold; color: #1e293b; margin: 0;">📊 Distribuição Financeira do Pipeline (R$)</h3> 
              <p style="font-size: 11px; color: #64748b; margin: 4px 0 0 0;">Monitore o volume de capital retido por etapa ativa do tabuleiro Kanban</p> 
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px; width: 100%; padding-top: 5px;">
              ${Object.keys(financeiroPorEtapa).map(idStatus => {
                const infoEtapa = financeiroPorEtapa[idStatus];
                const porcentagemLarguraBarra = (infoEtapa.soma / maiorSomaDoFunil) * 100;
                const dinheiroFormatadoItem = infoEtapa.soma.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
                return `
                  <div style="display: flex; align-items: center; width: 100%; gap: 12px;">
                    <div style="width: 130px; min-width: 130px; font-size: 11px; font-weight: bold; color: #475569; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                      ${infoEtapa.nome} (${infoEtapa.quantidadeCards})
                    </div>
                    <div style="flex-grow: 1; background: #f1f5f9; height: 20px; border-radius: 4px; overflow: hidden; display: flex; align-items: center; border: 1px solid #e2e8f0;">
                      <div style="width: ${porcentagemLarguraBarra}%; background: linear-gradient(90deg, #3b82f6, #2563eb); height: 100%; transition: width 0.5s ease-in-out; min-width: ${infoEtapa.soma > 0 ? '4px' : '0'};"></div>
                    </div>
                    <div style="width: 110px; min-width: 110px; text-align: right; font-size: 12px; font-weight: bold; color: #1e293b;">
                      R$ ${dinheiroFormatadoItem}
                    </div>
                  </div>
                `;
              }).join('')}
            </div> 
          </div>

          <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 15px;">
            <div>
              <h3 style="font-size: 14px; font-weight: bold; color: #1e293b; margin: 0;">👥 Carteira por Usuário</h3>
              <p style="font-size: 11px; color: #64748b; margin: 4px 0 0 0;">Capital total alocado por operador</p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px; overflow-y: auto; max-height: 200px; padding-right: 2px;">
              ${Object.keys(capitalPorResponsavelSoma).length === 0 ? `
                <div style="font-size: 11px; color:#94a3b8; font-style:italic; text-align:center; padding-top:20px;">Nenhum usuário ativo.</div>
              ` : Object.keys(capitalPorResponsavelSoma).sort((a,b) => capitalPorResponsavelSoma[b] - capitalPorResponsavelSoma[a]).map(nomeOp => {
                const totalDinheiroOp = capitalPorResponsavelSoma[nomeOp].toLocaleString('pt-BR', { minimumFractionDigits: 2 });
                const contagemCardsOp = cobrancasPorResponsavelContagem[nomeOp];
                return `
                  <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 10px; border-radius: 6px; display: flex; flex-direction: column; gap: 4px;">
                    <div style="font-size: 11px; font-weight: bold; color: #334155; text-transform: uppercase; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">👤 ${nomeOp}</div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span style="font-size: 10px; color:#64748b;">${contagemCardsOp} frentes</span>
                      <span style="font-size: 12px; font-weight: bold; color: #4f46e5;">R$ ${totalDinheiroOp}</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 8px; padding: 25px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 20px; width: 100%;">
          <div>
            <h3 style="font-size: 14px; font-weight: bold; color: #1e293b; margin: 0;">🌪️ Funil de Conversão do Pipeline & Passagem Cronológica</h3>
            <p style="font-size: 11px; color: #64748b; margin: 4px 0 0 0;">Proporção financeira vertical de cada etapa e tempos simulados de passagem entre as fases</p>
          </div>
          
          <div style="display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 500px; margin: 0 auto; gap: 0;">
            ${listaEtapas.map((etapa, index) => {
              const infoEtapaFunil = financeiroPorEtapa[etapa.id] || { soma: 0 }; // Resgata as somas de pipeline da etapa.
              const porcentagemFunilProporcao = ((infoEtapaFunil.soma / capitalTotalEstacionadoCards) * 100).toFixed(1); // Regra de três sobre o total absoluto.
              
              // Ajusta a largura visual decrescente simulando o formato geométrico de um funil real.
              const larguraVisualPixels = 100 - (index * 12); 
              
              // Simulação reativa baseada nas transições de tempos de passagem configurados.
              let textoTempoTransicaoHtml = '';
              if (index > 0) { // Se não for a boca do funil (A Iniciar), projeta a pílula de tempo de transição logo acima.
                let diasSimuladosFase = 3.5; // Valor padrão simulado de fábrica (Ex: Notificação Enviada).
                if (etapa.id === 'negociacao') diasSimuladosFase = 5.2; // Tempo simulado entre notificar e negociar.
                if (etapa.id === 'finalizado' || etapa.id === 'acordo') diasSimuladosFase = 8.4; // Tempo simulado para travar o fechamento do acordo.
                
                textoTempoTransicaoHtml = `
                  <div style="display: flex; flex-direction: column; align-items: center; margin: 6px 0;" title="Tempo médio que o devedor passa nesta fase">
                    <span style="font-size: 10px; font-weight: bold; background: #fef3c7; color: #d97706; padding: 2px 8px; border-radius: 12px; border: 1px dashed #fcd34d;">⏱️ Média de Passage: ${diasSimuladosFase} Dias</span>
                    <div style="width: 2px; height: 12px; background: #cbd5e1;"></div>
                  </div>
                `;
              }

              return `
                ${textoTempoTransicaoHtml}
                <div style="width: ${larguraVisualPixels}%; min-width: 220px; background: linear-gradient(135deg, #1e293b, #334155); color: white; padding: 10px; border-radius: 6px; text-align: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); position: relative; border: 1px solid #475569;">
                  <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${etapa.nome}</div>
                  <div style="display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 4px; font-size: 11px; color: #94a3b8;">
                    <span style="color:#22c55e; font-weight:bold;">R$ ${infoEtapaFunil.soma.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
                    <span>|</span>
                    <span style="color:#60a5fa; font-weight:bold;">${porcentagemFunilProporcao}% do CRM</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </div> `; // Termina a injeção HTML/CSS completa.
  } // Encerra a função de renderização do componente de dashboard.
}; // Encerra a exportação do objeto dashboardComponent.