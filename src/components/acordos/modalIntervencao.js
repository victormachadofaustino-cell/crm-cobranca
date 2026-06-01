export const modalIntervencao = { // Define e exporta o submódulo especialista em gerenciar as travas, baixas e estornos no mini-modal de propostas.
  renderizar(containerModal, fichaCobranca, callbackSalvarNuvem) { // Função de desenho que recebe o casulo invisível do HTML, a ficha do devedor e a comanda de gravação do Maestro.
    
    // Cria uma cópia volátil local das faturas priorizando o plano parcelas definitivo ou simulações ativas.
    let faturasProposta = Array.isArray(fichaCobranca.planoParcelas) && fichaCobranca.planoParcelas.length > 0 
      ? [...fichaCobranca.planoParcelas] 
      : (fichaCobranca.proposta?.parcelasSimuladas ? [...fichaCobranca.proposta.parcelasSimuladas] : []);

    const construirCorpoModal = () => { // Sub-rotina interna responsável por desenhar e atualizar os elementos do portal flutuante sem perder o sincronismo.
      containerModal.innerHTML = `
        <!-- Fundo escurecido (Overlay) para dar foco total e isolamento visual ao mini-modal na tela do CRM -->
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 3000; padding: 20px;">
          <!-- Caixa física do modal com rolagem interna protegida e sombra projetada -->
          <div style="background: white; border-radius: 10px; width: 100%; max-width: 650px; max-height: 80vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2);">
            
            <!-- Cabeçalho do Pop-up com identificação do cliente em caixa alta -->
            <div style="padding: 15px 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <h4 style="margin: 0; font-size: 14px; font-weight: bold; color: #1e293b; text-transform: uppercase;">⚡ Proposta Comercial: ${fichaCobranca.cliente}</h4>
                <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b;">Parcelas pagas trancam a digitação automaticamente. Reabra se necessário.</p>
              </div>
              <button id="btn-fechar-pop-esteira" style="background: none; border: none; font-size: 22px; cursor: pointer; color: #94a3b8; font-weight: bold;">&times;</button>
            </div>
            
            <!-- Miolo rolável contendo o cronograma de parcelas e os cadeados de auditoria -->
            <div style="padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${faturasProposta.map((f, i) => {
                  const liquidada = f.pago || f.status === 'pago'; // Flag booleana reativa que valida se o boleto já está quitado.
                  return `
                    <div style="display: flex; justify-content: space-between; align-items: center; background: ${liquidada ? '#ecfdf5' : '#f8fafc'}; border: 1px solid ${liquidada ? '#a7f3d0' : '#e2e8f0'}; padding: 8px 12px; border-radius: 6px; gap: 10px; font-size: 12px;">
                      <span style="font-weight: 600; color: #475569;">P. ${f.numero}</span>
                      
                      <!-- CADEADO VISUAL DA DATA: Se a parcela estiver liquidada, injeta disabled e bloqueia o calendário -->
                      <input type="date" class="mod-esteira-data" data-index="${i}" ${liquidada ? 'disabled' : ''} value="${f.vencimento}" style="padding: 4px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 11px; font-weight: 600; color: #334155;">
                      
                      <!-- CADEADO VISUAL DO VALOR: Se o dinheiro já entrou no caixa, tranca o campo numérico contra rasuras de juros -->
                      <div style="display: flex; align-items: center; gap: 2px;">
                        <span style="font-size: 11px; color: #64748b; font-weight: bold;">R$</span>
                        <input type="number" step="0.01" class="mod-esteira-valor" data-index="${i}" ${liquidada ? 'disabled' : ''} value="${f.valor}" style="width: 85px; padding: 4px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 11px; font-weight: bold; text-align: right; color: #1e293b;">
                      </div>
                      
                      <!-- REVERSIBILIDADE BINÁRIA: Chaveia dinamicamente exibindo o estorno amigável ou o botão de recebimento -->
                      <div style="width: 130px; text-align: right;">
                        ${liquidada ? `
                          <button type="button" class="btn-reabrir-fatura-esteira" data-index="${i}" style="background: #fff; color: #64748b; border: 1px solid #cbd5e1; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; cursor: pointer; transition: background 0.2s;">↩️ Reabrir Parcela</button>
                        ` : `
                          <button type="button" class="btn-baixa-esteira-efetivar" data-index="${i}" style="background: #10b981; color: white; border: none; padding: 4px 12px; border-radius: 4px; font-size: 10px; font-weight: bold; cursor: pointer;">✓ Dar Baixa</button>
                        `}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Rodapé de Ações de Fechamento e Confirmação de Auditoria -->
            <div style="padding: 15px 20px; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; gap: 10px;">
              <button type="button" id="btn-voltar-pop-esteira" style="background: white; border: 1px solid #cbd5e1; color: #475569; padding: 6px 15px; border-radius: 4px; font-size: 12px; font-weight: bold; cursor: pointer;">Voltar</button>
              <button type="button" id="btn-gravar-pop-esteira" style="background: #2563eb; color: white; border: none; padding: 6px 18px; border-radius: 4px; font-size: 12px; font-weight: bold; cursor: pointer;">💾 Gravar e Atualizar Fluxo</button>
            </div>
          </div>
        </div>
      `; // Conclui o desenho estrutural do portal flutuante de controle financeiro.

      // Vincula os trincos visuais para destruir o modal da tela caso o operador clique em fechar ou voltar.
      document.getElementById('btn-fechar-pop-esteira').addEventListener('click', () => { containerModal.innerHTML = ''; });
      document.getElementById('btn-voltar-pop-esteira').addEventListener('click', () => { containerModal.innerHTML = ''; });

      // Escuta a digitação de acréscimo de juros e joga de forma volátil no nosso array local de faturas.
      containerModal.querySelectorAll('.mod-esteira-valor').forEach(inputV => {
        inputV.addEventListener('change', (ev) => {
          const indexAlvo = parseInt(ev.target.getAttribute('data-index'));
          faturasProposta[indexAlvo].valor = parseFloat(ev.target.value) || 0; // Armazena a alteração monetária na linha.
        });
      });

      // Escuta a alteração de calendário nas datas de vencimento e joga de forma volátil no array local.
      containerModal.querySelectorAll('.mod-esteira-data').forEach(inputD => {
        inputD.addEventListener('change', (ev) => {
          const indexAlvo = parseInt(ev.target.getAttribute('data-index'));
          faturasProposta[indexAlvo].vencimento = ev.target.value; // Sincroniza a string estável de prazo.
        });
      });

      // Captura o clique de baixa do boleto aplicando o carimbo de recebimento e gerando o log de dia nacional.
      containerModal.querySelectorAll('.btn-baixa-esteira-efetivar').forEach(btnB => {
        btnB.addEventListener('click', (ev) => {
          const indexAlvo = parseInt(ev.target.getAttribute('data-index'));
          const dataRelogio = new Date(); // Captura o relógio exato da operação de arrecadação.
          
          faturasProposta[indexAlvo].pago = true; // Seta eletronicamente o recebimento como verdadeiro.
          faturasProposta[indexAlvo].status = 'pago'; // Padroniza o texto linear de conformidade.
          faturasProposta[indexAlvo].dataPagamento = dataRelogio.toLocaleDateString('pt-BR'); // Carimba com o formato clássico brasileiro (DD/MM/AAAA).
          
          construirCorpoModal(); // Força o redesenho instantâneo da tela mudando a linha para verde e ativando o cadeado de tranca.
        });
      });

      // PORTAL DE REVERSIBILIDADE: Limpa as marcas de pagamento caso o operador clique em Reabrir Parcela, destravando a linha na mesma hora.
      containerModal.querySelectorAll('.btn-reabrir-fatura-esteira').forEach(btnReab => {
        btnReab.addEventListener('click', (ev) => {
          const indexAlvo = parseInt(ev.target.getAttribute('data-index'));
          faturasProposta[indexAlvo].pago = false; // Estorna a flag de recebimento voltando para falso.
          faturasProposta[indexAlvo].status = 'a_vencer'; // Restaura a descrição clássica de pendente em aberto.
          faturasProposta[indexAlvo].dataPagamento = ''; // Apaga permanentemente o carimbo cronológico antigo de liquidação.
          
          construirCorpoModal(); // Redesenha o modal liberando os inputs de valor e data para novas digitações.
        });
      });

      // DESPACHO EM LOTE UNIFICADO: Consolida as mudanças e faz a redução de saldo no card do Kanban reativamente.
      document.getElementById('btn-gravar-pop-esteira').addEventListener('click', async () => {
        const somatoriaTotalProposta = faturasProposta.reduce((acc, f) => acc + (f.valor || 0), 0); // Soma os valores cheios para atualizar a calculadora.

        // REGRA REATIVA DE ABATIMENTO: Filtra e soma o valor FINANCEIRO que continua em aberto para deduzir das colunas do Kanban.
        const saldoRestanteEmAberto = faturasProposta.reduce((acc, f) => acc + (f.pago ? 0 : (f.valor || 0)), 0);

        // Estrutura o pacote complexo unificado injetando o abatimento de saldo para o app.js disparar de uma só vez na nuvem.
        const pacoteConsolidadoMudanca = {
          planoParcelas: faturasProposta, // Atualiza as linhas da esteira financeira.
          valorVencido: parseFloat(saldoRestanteEmAberto.toFixed(2)), // Reduz o saldo devedor principal do card no tabuleiro do Kanban.
          valor: parseFloat(saldoRestanteEmAberto.toFixed(2)), // Sincroniza o totalizador financeiro de topo de coluna.
          proposta: {
            ...(fichaCobranca.proposta || {}), // Preserva parâmetros colaterais de fábrica estáveis.
            parcelasSimuladas: faturasProposta, // Sincroniza os inputs espelhados com a aba Proposta.
            valorCobrado: parseFloat(somatoriaTotalProposta.toFixed(2)) // Atualiza o totalizador de contrato fechado.
          }
        };

        // Dispara a chamada entregando o pacote completo para a gravação definitiva na nuvem do Firebase através do Maestro.
        callbackSalvarNuvem(fichaCobranca.id, pacoteConsolidadoMudanca); 
        containerModal.innerHTML = ''; // Limpa e encerra a exibição do mini-modal flutuante.
      });
    };

    construirCorpoModal(); // Inicializa a abertura da janela de auditoria e intervenções em tempo real.
  } // Encerra a sub-função de renderização de pop-ups.
}; // Encerra a exportação do objeto especialista modalIntervencao.