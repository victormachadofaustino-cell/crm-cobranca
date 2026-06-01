export const cardComponent = { // Define e exporta o submódulo focado de forma estrita em cuidar da alfaiataria visual e cliques do cartão de cobrança.
  criar(cobranca, status, callbackCliqueCard, callbackMudarSubStatus) { // Método de fabricação que recebe o objeto do cliente e os plugues de controle do sistema.
    
    const card = document.createElement('div'); // Fabrica uma caixinha (div) física em tempo de execução na memória do computador para ser o corpo do cartão[cite: 1].
    const valorCardNum = parseFloat(cobranca.valorVencido) || 0; // Trata e isola o valor numérico de segurança para evitar que letras travem o cálculo da moeda[cite: 1].
    const subStatus = cobranca.subStatus || ''; // Resgata o texto descritivo de finalização (se a conta foi quitada ou baixada como perda)[cite: 1].

    // ESTILIZAÇÃO DO INVÓLUCRO (DESIGN PREMIUM): Fixa o padrão executivo de carteira branca, cantos arredondados e sombra sutil tridimensional[cite: 1].
    card.style.cssText = "background: #ffffff; padding: 16px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03); margin-bottom: 12px; display: flex; flex-direction: column; gap: 8px; transition: transform 0.2s, box-shadow 0.2s; box-sizing: border-box; width: 100%;"; // Aplica o visual limpo do padrão DOCULOC[cite: 1].

    // CALIBRAGEM DE PRIVILÉGIOS DE BORDAS INTERNAS: Pinta a lateral do terno do devedor conforme a gravidade da situação[cite: 1].
    if (status === 'acordo' && subStatus === 'quitado') { 
      card.style.borderLeft = '4px solid #10b981'; // Verde Esmeralda vibrante se o cliente pagou tudo e limpou o nome[cite: 1].
    } else if (status === 'acordo' && subStatus === 'baixado') { 
      card.style.borderLeft = '4px solid #64748b'; // Cinza Ardósia fosco para baixas de perda administrativa (desistência)[cite: 1].
    } else {
      const mapaCoresBorda = { 'novo': '#0284c7', 'contato': '#f59e0b', 'negociacao': '#ec4899', 'acordo': '#3b82f6', 'insucesso': '#ef4444' }; // Dicionário de cores oficiais de cada fase[cite: 1].
      card.style.borderLeft = '4px solid ' + (mapaCoresBorda[status] || '#cbd5e1'); // Aplica a cor da calha atual ou um cinza neutro caso seja uma coluna nova[cite: 1].
    }
    
    card.style.cursor = 'grab'; // Modifica o desenho do mouse para uma mão aberta, indicando visualmente que o card pode ser agarrado e arrastado[cite: 1].
    card.draggable = true; // Habilita a propriedade física nativa do navegador que deixa o bloco flutuar ao ser puxado[cite: 1].
    
    // MODELAGEM DA CASCA VISUAL (INNER HTML): Estrutura as gavetas de texto com tipografia higienizada e alinhamentos simétricos[cite: 1].
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; box-sizing: border-box;">
        <div style="display: flex; align-items: center; gap: 5px; font-size: 11px; color: #0369a1; background: #e0f2fe; padding: 2px 6px; border-radius: 4px; font-weight: 600; font-family: sans-serif; text-transform: uppercase;">
          <span style="width: 6px; height: 6px; background: #0284c7; border-radius: 50%;"></span>
          <span>${status === 'acordo' ? (subStatus ? subStatus : 'FECHADO') : 'EM CURSO'}</span> </div>
        <span style="font-size: 14px; color: #0f172a; font-weight: 800; font-family: sans-serif;">R$ ${valorCardNum.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
      </div>

      <h3 style="font-size: 13px; font-weight: 700; color: #1e293b; margin: 4px 0; line-height: 1.4; text-transform: uppercase; font-family: sans-serif; text-align: left;">${cobranca.cliente}</h3>

      <div style="font-size: 12px; color: #64748b; margin: 0; display: flex; align-items: center; gap: 8px; font-family: sans-serif; width: 100%; justify-content: flex-start;">
        <span style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 11px; color: #475569;">ID: ${cobranca.codigo}</span>
        <span style="display: flex; align-items: center; gap: 3px; font-weight: 500;">👤 ${cobranca.responsavel || 'Não alocado'}</span>
      </div>

      ${status === 'acordo' ? `
        <div style="margin-top: 4px; padding-top: 8px; border-top: 1px dashed #cbd5e1; width: 100%; box-sizing: border-box;" onclick="event.stopPropagation();">
          <label style="display: block; font-size: 10px; font-weight: 700; color: #475569; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; font-family: sans-serif; text-align: left;">Veredicto de Fechamento:</label>
          <select class="select-sub-status" data-id="${cobranca.id}" style="width: 100%; padding: 6px; font-size: 11px; border: 1px solid #cbd5e1; border-radius: 4px; background: white; font-weight: 700; color: #334155; cursor: pointer; outline: none;">
            <option value="" ${subStatus === '' ? 'selected' : ''}>⏳ Selecione o Desfecho...</option>
            <option value="quitado" ${subStatus === 'quitado' ? 'selected' : ''}>🟩 [QUITADO] Sucesso Financeiro</option>
            <option value="baixado" ${subStatus === 'baixado' ? 'selected' : ''}>⬛ [BAIXADO] Perda / Insucesso</option>
          </select>
        </div>
      ` : ''}
    `; // Injeta os dados da conta, razão social, operador e o menu de veredicto caso a cobrança esteja na coluna de acordos[cite: 1].

    // ACIONADORES DE MICROINTERAÇÕES DE MOVIMENTO: Levanta levemente o card e aumenta a sombra quando o mouse passa por cima[cite: 1].
    card.addEventListener('mouseenter', () => { card.style.transform = 'translateY(-2px)'; card.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.05)'; }); // Efeito de elevação[cite: 1].
    card.addEventListener('mouseleave', () => { card.style.transform = 'translateY(0)'; card.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)'; }); // Retorna ao estado de descanso[cite: 1].

    // ACIONADOR DE CLIQUES DE EXPANSÃO (CENTRAL 360): Abre os detalhes do devedor ao clicar no card, mas ignora se o clique for no menu de seleção[cite: 1].
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('select-sub-status')) return; // Filtro de segurança: se clicou no select, não abre a tela gigante por trás[cite: 1].
      callbackCliqueCard(cobranca); // Dispara a abertura do histórico 360 do cliente[cite: 1].
    });

    // MÓDULO INTERNO DO DRAGSTART: Amarra eletronicamente a ID do devedor no ponteiro do mouse ao começar a arrastar[cite: 1].
    card.addEventListener('dragstart', (e) => {
      card.style.cursor = 'grabbing'; // Altera o mouse para uma mão fechada firme de transporte[cite: 1].
      e.dataTransfer.setData('text/plain', cobranca.id); // Guarda o código da dívida na área de transferência invisível do clique[cite: 1].
      e.dataTransfer.setData('origem-status', status); // Guarda a coluna de onde o cartão está se descolando agora[cite: 1].
    });

    card.addEventListener('dragend', () => { card.style.cursor = 'grab'; }); // Devolve o cursor de mão aberta quando o operador solta o clique[cite: 1].

    // GATILHO REATIVO DO SELECT DO RODAPÉ: Ouve a mudança de veredicto e despacha direto para o Firebase[cite: 1].
    const menuSelect = card.querySelector('.select-sub-status'); // Procura o menu suspenso dentro do bloco atual[cite: 1].
    if (menuSelect) { // Se o menu estiver renderizado (cards na fase de acordo)[cite: 1].
      menuSelect.addEventListener('change', (e) => { // Captura o momento em que o cobrador altera a opção[cite: 1].
        callbackMudarSubStatus(cobranca.id, e.target.value); // Dispara a gravação do substatus (quitado/baixado) na nuvem[cite: 1].
      });
    }

    return card; // Devolve a caixinha do devedor totalmente costurada e pronta para o Kanban colar na raia cinza[cite: 1].
  }
};