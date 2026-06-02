export const cardComponent = { // [Dev Sênior] Define e exporta o submódulo focado de forma estrita em cuidar da alfaiataria visual e cliques do cartão de cobrança. // Cria e exporta a caixinha de ferramentas especialista em modelar os cartões brancos dos devedores.
  criar(cobranca, status, callbackCliqueCard, callbackMudarSubStatus) { // [Dev Sênior] Método de fabricação que recebe o objeto do cliente e os plugues de controle do sistema. // Inicializa a função de fabricação recebendo os dados do devedor, a coluna atual e os gatilhos de clique.
    
    const card = document.createElement('div'); // [Dev Sênior] Fabrica uma caixinha (div) física em tempo de execução na memória do computador para ser o corpo do cartão. // Cria uma div nova em tempo de execução na memória do computador para ser o corpo físico do cartão.
    const valorCardNum = parseFloat(cobranca.valorVencido) || 0; // [Dev Sênior] Trata e isola o valor numérico de segurança para evitar que letras travem o cálculo da moeda. // Trata e converte o saldo devedor em um número decimal limpo pronto para formatação de moeda.
    const subStatus = cobranca.subStatus || ''; // [Dev Sênior] Resgata o texto descritivo de finalização (se a conta foi quitada ou baixada como perda). // Coleta o veredicto final de encerramento do cliente (se foi quitado ou baixado como prejuízo).

    // ESTILIZAÇÃO DO INVÓLUCRO (DESIGN PREMIUM): Fixa o padrão executivo de carteira branca, cantos arredondados e sombra sutil tridimensional. // Aplica o design executivo sóbrio.
    card.style.cssText = "background: #ffffff; padding: 16px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.02); margin-bottom: 12px; display: flex; flex-direction: column; gap: 8px; transition: transform 0.2s, box-shadow 0.2s; box-sizing: border-box; width: 100%; border: 1px solid #e2e8f0;"; // RECALIBRAGEM SÊNIOR: Suavizada a sombra para um efeito tridimensional fosco e adicionada uma borda fina cinza de alta tecnologia.

    // CALIBRAGEM DE PRIVILÉGIOS DE BORDAS INTERNES: Pinta a lateral do terno do devedor conforme a gravidade da situação. // Colore a lateral esquerda conforme o andamento.
    if (status === 'acordo' && subStatus === 'quitado') { // [Dev Sênior] Verifica se a cobrança chegou na última fase com o carimbo verde de recebimento integral.
      card.style.borderLeft = '4px solid #10b981'; // [Dev Sênior] Verde Esmeralda vibrante se o cliente pagou tudo e limpou o nome. // Pinta a lateral esquerda com verde esmeralda sóbrio indicando sucesso financeiro total.
    } else if (status === 'acordo' && subStatus === 'baixado') { // [Dev Sênior] Verifica se o card recebeu baixa administrativa por quebra ou desistência de parcelas.
      card.style.borderLeft = '4px solid #64748b'; // [Dev Sênior] Cinza Ardósia fosco para baixas de perda administrativa (desistência). // Pinta a lateral esquerda com cinza ardósia fosco indicando perda administrativa consolidada.
    } else { // [Dev Sênior] Caso o cliente ainda esteja navegando ativamente pelas colunas comerciais do pipeline.
      const mapaCoresBorda = { 'novo': '#0f172a', 'contato': '#f59e0b', 'negociacao': '#db2777', 'acordo': '#2563eb', 'insucesso': '#ef4444' }; // RECALIBRAGEM SÊNIOR: Tons mais sóbrios e fechados para as raias intermediárias do CRM.
      card.style.borderLeft = '4px solid ' + (mapaCoresBorda[status] || '#cbd5e1'); // [Dev Sênior] Aplica a cor da calha atual ou um cinza neutro caso seja uma coluna nova. // Fixa a cor correspondente à coluna atual ou um cinza neutro padrão na lateral.
    } // [Dev Sênior] Encerra o crivo de colorização lateral.
    
    card.style.cursor = 'grab'; // [Dev Sênior] Modifica o desenho do mouse para uma mão aberta, indicando visualmente que o card pode ser agarrado e arrastado. // Altera o ponteiro do mouse para uma mão aberta indicando que o objeto pode ser arrastado.
    card.draggable = true; // [Dev Sênior] Habilita a propriedade física nativa do navegador que deixa o bloco flutuar ao ser puxado. // Ativa as propriedades físicas do navegador que permitem arrastar o elemento na tela.
    
    // EXTRATOR DE DADOS DO NOVO MÓDULO: Puxa com segurança as métricas calculadas pelo nosso cadastro para montar o HTML do cartão.
    const metaEmpresa = cobranca.metaInfo || { relevancia: { emoji: '' }, negligencia: { esquecido: false }, tempo: { emoji: '', texto: '', dias: 0 } }; // [Dev Sênior] Resgata as chaves prevenindo erros se o Firebase atrasar.
    
    // Injeta opcionalmente uma pílula coral viva no topo do card caso a conta esteja esquecida e abandonada sem tarefas.
    const htmlBadgeNegligencia = metaEmpresa.negligencia.esquecido 
      ? `<span style="font-size: 9px; background: #fff1f2; color: #e11d48; border: 1px solid #ffe4e6; padding: 2px 6px; border-radius: 4px; font-weight: 800; letter-spacing: 0.3px;">Sem Ação ⚠️</span>`
      : ''; // [Dev Sênior] Deixa vazio se o cronograma de lembretes estiver rigorosamente em dia.

    // Injeta uma etiqueta cinza fosca detalhando os dias corridos de atraso cronológico do processo.
    const htmlBadgeIdadeLote = metaEmpresa.tempo.dias > 0
      ? `<span style="font-size: 9px; background: ${metaEmpresa.tempo.statusTempo === 'critico' ? '#fef2f2' : '#f8fafc'}; color: ${metaEmpresa.tempo.statusTempo === 'critico' ? '#dc2626' : '#64748b'}; border: 1px solid ${metaEmpresa.tempo.statusTempo === 'critico' ? '#fee2e2' : '#e2e8f0'}; padding: 2px 6px; border-radius: 4px; font-weight: 700;">${metaEmpresa.tempo.emoji} ${metaEmpresa.tempo.dias} dias</span>`
      : ''; // [Dev Sênior] Oculta do card se a contagem for zero.

    // [Dev Sênior] Injeta a carcaça de textos combinando os novos alertas de foguete, esquecimento e semáforo industrial de prazos.
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; box-sizing: border-box;">
        <div style="display: flex; align-items: center; gap: 4px; font-size: 10px; color: #475569; background: #f1f5f9; padding: 3px 8px; border-radius: 4px; font-weight: 700; font-family: system-ui, -apple-system, sans-serif; text-transform: uppercase; border: 1px solid #e2e8f0;">
          <span>${status === 'acordo' ? (subStatus ? subStatus : 'FECHADO') : 'EM CURSO'}</span> 
        </div>
        ${htmlBadgeNegligencia}
        <span style="font-size: 14px; color: #0f172a; font-weight: 800; font-family: system-ui, -apple-system, sans-serif; letter-spacing: -0.3px; display: flex; align-items: center; gap: 4px;">R$ ${valorCardNum.toLocaleString('pt-BR', {minimumFractionDigits: 2})} ${metaEmpresa.relevancia.emoji}</span>
      </div>

      <h3 style="font-size: 13px; font-weight: 700; color: #1e293b; margin: 4px 0; line-height: 1.4; text-transform: uppercase; font-family: system-ui, -apple-system, sans-serif; text-align: left;">${cobranca.cliente}</h3>

      <div style="font-size: 11px; color: #64748b; margin: 0; display: flex; align-items: center; gap: 6px; font-family: system-ui, -apple-system, sans-serif; width: 100%; justify-content: space-between; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 4px;">
          <span style="background: #f8fafc; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 10px; color: #64748b; border: 1px solid #e2e8f0;">ID: ${cobranca.codigo}</span>
          <span style="display: flex; align-items: center; gap: 3px; font-weight: 600; color: #475569;">👤 ${cobranca.responsavel || 'Não alocado'}</span>
        </div>
        ${htmlBadgeIdadeLote}
      </div>

      ${status === 'acordo' ? `
        <div style="margin-top: 4px; padding-top: 8px; border-top: 1px dashed #cbd5e1; width: 100%; box-sizing: border-box;" onclick="event.stopPropagation();">
          <label style="display: block; font-size: 10px; font-weight: 700; color: #475569; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; font-family: system-ui, -apple-system, sans-serif; text-align: left;">Veredicto de Fechamento:</label>
          <select class="select-sub-status" data-id="${cobranca.id}" style="width: 100%; padding: 6px; font-size: 11px; border: 1px solid #cbd5e1; border-radius: 4px; background: white; font-weight: 700; color: #334155; cursor: pointer; outline: none; font-family: system-ui, -apple-system, sans-serif;">
            <option value="" ${subStatus === '' ? 'selected' : ''}>⏳ Selecione o Desfecho...</option>
            <option value="quitado" ${subStatus === 'quitado' ? 'selected' : ''}>🟩 [QUITADO] Sucesso Financeiro</option>
            <option value="baixado" ${subStatus === 'baixado' ? 'selected' : ''}>⬛ [BAIXADO] Perda / Insucesso</option>
          </select>
        </div>
      ` : ''}
    `; // [Dev Sênior] Encerra a injeção modular, formatando as pílulas simetricamente nas margens do card comercial.

    // ACIONADORES DE MICROINTERAÇÕES DE MOVIMENTO: Levanta levemente o card e aumenta a sombra quando o mouse passa por cima. // Liga as reatividades de mouse.
    card.addEventListener('mouseenter', () => { card.style.transform = 'translateY(-1px)'; card.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)'; card.style.borderColor = '#cbd5e1'; }); // Efeito de elevação. // Levanta 1px no foco do mouse e ativa um contorno cinza escuro sutil.
    card.addEventListener('mouseleave', () => { card.style.transform = 'translateY(0)'; card.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.02)'; card.style.borderColor = '#e2e8f0'; }); // Retorna ao estado de descanso. // Devolve a cor branca original de fábrica ao afastar o mouse.

    // ACIONADOR DE CLIQUES DE EXPANSÃO (CENTRAL 360): Abre os detalhes do devedor ao clicar no card, mas ignora se o clique for no menu de seleção. // Ouve cliques de tela.
    card.addEventListener('click', (e) => { // Intercepta o clique na superfície branca do elemento.
      if (e.target.classList.contains('select-sub-status')) return; // Filtro de segurança: se clicou no select, não abre a tela gigante por trás. // Se o clique ocorreu dentro da caixinha do menu suspenso, aborta a abertura do prontuário 360.
      callbackCliqueCard(cobranca); // Dispara a abertura do histórico 360 do cliente. // Dispara a abertura do prontuário rico do devedor na tela.
    }); // Encerra o monitor de cliques.

    // MÓDULO INTERNO DO DRAGSTART: Amarra eletronicamente a ID do devedor no ponteiro do mouse ao começar a arrastar. // Liga as reatividades do arrastar.
    card.addEventListener('dragstart', (e) => { // Intercepta o segundo exato em que o operador começa a arrastar o card.
      card.style.cursor = 'grabbing'; // Altera o mouse para uma mão fechada firme de transporte. // Altera o cursor para uma mão fechada indicando firmeza de transporte.
      e.dataTransfer.setData('text/plain', cobranca.id); // Guarda o código da dívida na área de transferência invisível do clique. // Prende a ID exclusiva do devedor na área oculta de transferência do mouse.
      e.dataTransfer.setData('origem-status', status); // Guarda a coluna de onde o cartão está se descolando agora. // Prende o ID da coluna de origem na memória invisível do mouse.
    }); // Encerra o monitor de início de arrastes.

    card.addEventListener('dragend', () => { card.style.cursor = 'grab'; }); // Devolve o cursor de mão aberta quando o operador solta o clique. // Devolve o cursor de mão aberta quando o clique é solto pelo operador.

    // GATILHO REATIVO DO SELECT DO RODAPÉ: Ouve a mudança de veredicto e despacha direto para o Firebase. // Liga the reatividades do combo do rodapé.
    const menuSelect = card.querySelector('.select-sub-status'); // Procura o menu suspenso dentro do bloco atual. // Procura pela caixa de seleção de encerramento dentro deste card.
    if (menuSelect) { // Se o menu estiver renderizado (cards na fase de acordo). // Se a caixa do menu estiver desenhada (apenas na calha final de acordos).
      menuSelect.addEventListener('change', (e) => { // Captura o momento em que o cobrador altera a opção. // Monitora quando o faturamento chaveia as opções do combo.
        callbackMudarSubStatus(cobranca.id, e.target.value); // Dispara a gravação do substatus (quitado/baixado) na nuvem. // Dispara a atualização imediata do desfecho direto na nuvem do Firebase.
      }); // Encerra a escuta do combo.
    } // Encerra o crivo de presença do combo.

    return card; // Devolve a caixinha do devedor totalmente costurada e pronta para o Kanban colar na raia cinza. // Entrega o elemento estruturado pronto para a calha do Kanban colar na tela.
  } // Encerra o método de fabricação.
}; // Encerra a caixinha de ferramentas especialista.