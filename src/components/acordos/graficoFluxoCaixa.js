export const graficoFluxoCaixa = { // Define e exporta o submódulo especializado em processar e renderizar o gráfico analítico de previsão de recebíveis.
  renderizar(containerGrafico, cardsComProposta) { // Função de desenho que recebe o casulo físico do HTML e as cobranças filtradas pelo Maestro.
    
    containerGrafico.innerHTML = ''; // Limpa qualquer vestígio ou desenho de gráfico gerado anteriormente para uma plotagem limpa.
    const fluxoMensalAcumulado = {}; // Cria uma gaveta de memória vazia para agrupar e acumular os valores financeiros divididos por Mês/Ano.

    // LAÇO DE COMPETÊNCIA: Varre cliente por cliente que possui proposta ativa para extrair as faturas e calcular os blocos de cores.
    cardsComProposta.forEach(c => { // Inicia uma varredura passando de cliente em cliente que possui propostas válidas registradas na carteira.
      // CORRIGIDO: Adicionado o ponto de interrogação de proteção (?.) antes de acessar parcelasSimuladas, impedindo que o CRM quebre se o cliente não tiver nenhuma proposta inicial salva.
      const parcelasAlvo = Array.isArray(c.planoParcelas) && c.planoParcelas.length > 0 
        ? c.planoParcelas 
        : (c.proposta?.parcelasSimuladas || []); // Se a gaveta de propostas estiver ausente, assume uma lista vazia de segurança para o Vite não travar.

      // Varre fatura por fatura do cliente atual para empilhar os valores no mês correspondente do calendário.
      parcelasAlvo.forEach(p => { // Entra no extrato do cliente ativo e analisa cada um dos boletos emitidos para ele.
        if (!p.vencimento) return; // Trava de segurança contra parcelas corrompidas que porventura nasceram sem data definida.
        
        const partesData = p.vencimento.split('-'); // Fatia a string eletrônica estável (AAAA-MM-DD) separando ano, mês e dia.
        const mesAnoChave = `${partesData[1]}/${partesData[0]}`; // Funde as fatias estruturando o rótulo nacional de competência (Ex: 06/2026).

        if (!fluxoMensalAcumulado[mesAnoChave]) { // Se este mês específico ainda não tiver sido mapeado ou criado na nossa gaveta de acúmulo.
          fluxoMensalAcumulado[mesAnoChave] = { pago: 0, vencido: 0, aVencer: 0 }; // Inicializa as três pílulas financeiras zeradas para o mês atual.
        } // Encerra o bloco de criação do objeto de memória mensal.

        const hojeString = new Date().toISOString().split('T')[0]; // Captura o dia de hoje exato do relógio do computador no formato estável.
        const estaLiquidado = p.pago || p.status === 'pago'; // Valida de forma booleana se a parcela já recebeu baixa definitiva de pagamento.

        if (estaLiquidado) { // Se o boleto analisado já estiver com o dinheiro reconhecido e quitado pelo operador.
          fluxoMensalAcumulado[mesAnoChave].pago += (p.valor || 0); // Soma o valor no bloco verde de dinheiro liquidado em caixa.
        } else if (p.vencimento < hojeString) { // Caso a data de vencimento da parcela seja menor do que o dia de hoje no calendário.
          fluxoMensalAcumulado[mesAnoChave].vencido += (p.valor || 0); // Soma o valor no bloco vermelho de quebra de acordo (Inadimplência).
        } else { // Se o boleto estiver com o vencimento projetado para datas futuras no relógio do sistema.
          fluxoMensalAcumulado[mesAnoChave].aVencer += (p.valor || 0); // Soma o valor no bloco amarelo de previsão de receita futura (A Vencer).
        } // Fim do bloco de decisões de segmentação de cores de auditoria.
      }); // Conclui a análise de boletos individuais do devedor selecionado.
    }); // Finaliza a varredura global passando por toda a carteira de acordos.

    // Ordena os meses gerados na memória em ordem cronológica de calendário para que as barras horizontais não nasçam bagunçadas.
    const mesesOrdenados = Object.keys(fluxoMensalAcumulado).sort((a, b) => { // Coleta as chaves de texto criadas e aciona o organizador alfabético-numérico.
      const pA = a.split('/'), pB = b.split('/'); // Quebra os rótulos de mês e ano para comparação matemática de datas.
      return new Date(pA[1], pA[0] - 1) - new Date(pB[1], pB[0] - 1); // Retorna a diferença organizando a linha do tempo do gráfico.
    }); // Finaliza a ordenação linear dos meses.

    // INJEÇÃO HTML RESPONSIVA: Fabrica a estrutura física do contêiner do gráfico de barras empilhadas em CSS Inline.
    containerGrafico.innerHTML = `
      <div style="background: white; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin-bottom: 25px; box-shadow: 0 1px 2px rgba(0,0,0,0.01);">
        <h4 style="font-size: 13px; font-weight: bold; color: #475569; margin: 0 0 15px 0;">📊 Previsão Protetiva de Fluxo de Caixa (Mensal Somado)</h4>
        
        ${mesesOrdenados.length === 0 ? `
          <div style="text-align: center; color: #94a3b8; font-size: 13px; padding: 20px 0; font-style: italic;">Nenhuma proposta ativa localizada no funil para geração de gráficos.</div>
        ` : `
          <div style="display: flex; gap: 15px; align-items: flex-end; justify-content: space-around; min-height: 150px; padding-top: 15px; overflow-x: auto;">
            ${mesesOrdenados.map(mes => {
              const dadosMes = fluxoMensalAcumulado[mes]; // Resgata os acúmulos de Pago, Vencido e A Vencer do mês atual.
              const totalMes = dadosMes.pago + dadosMes.vencido + dadosMes.aVencer || 1; // Calcula a sumatória cheia do mês para servir de base de escala.
              
              // Regra de três matemática que projeta a porcentagem física exata que cada pílula de cor ocupará dentro da barra de 110px.
              const pctPago = (dadosMes.pago / totalMes) * 100; // Define o tamanho proporcional em pixel da cor verde.
              const pctVencido = (dadosMes.vencido / totalMes) * 100; // Define o tamanho proporcional em pixel da cor vermelha.
              const pctAVencer = (dadosMes.aVencer / totalMes) * 100; // Define o tamanho proporcional em pixel da cor amarela.

              return `
                <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; min-width: 65px; max-width: 90px;">
                  <div style="width: 100%; font-size: 9px; font-weight: bold; text-align: center; color: #64748b;">R$ ${totalMes.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</div>
                  
                  <div style="width: 28px; height: 110px; background: #f1f5f9; border-radius: 4px; display: flex; flex-direction: column-reverse; overflow: hidden; border: 1px solid #cbd5e1;">
                    <div style="height: ${pctPago}%; background: #10b981;" title="Pago: R$ ${dadosMes.pago.toLocaleString('pt-BR')}"></div> 
                    <div style="height: ${pctVencido}%; background: #ef4444;" title="Vencido: R$ ${dadosMes.vencido.toLocaleString('pt-BR')}"></div> 
                    <div style="height: ${pctAVencer}%; background: #f59e0b;" title="A Vencer: R$ ${dadosMes.aVencer.toLocaleString('pt-BR')}"></div> 
                  </div>
                  <span style="font-size: 11px; font-weight: bold; color: #334155;">${mes}</span>
                </div>
              `; // Constrói o bloco completo contendo os valores faturados no topo, a barra tricolor dinâmica e o mês de referência embaixo.
            }).join('')}
          </div>
          
          <div style="display: flex; gap: 15px; margin-top: 15px; justify-content: center; font-size: 11px; font-weight: 600;">
            <div style="display: flex; align-items: center; gap: 4px;"><span style="width: 12px; height: 12px; background: #10b981; border-radius: 3px;"></span><span style="color: #065f46;">🟩 PAGOS</span></div>
            <div style="display: flex; align-items: center; gap: 4px;"><span style="width: 12px; height: 12px; background: #f59e0b; border-radius: 3px;"></span><span style="color: #b45309;">🟨 A VENCER</span></div>
            <div style="display: flex; align-items: center; gap: 4px;"><span style="width: 12px; height: 12px; background: #ef4444; border-radius: 3px;"></span><span style="color: #991b1b;">🟥 VENCIDOS</span></div>
          </div>
        `}
      </div>
    `; // Conclui com sucesso a injeção responsiva do painel gráfico reativo.
  } // Encerra a sub-função de renderização analítica.
}; // Encerra a exportação do objeto especialista graficoFluxoCaixa.