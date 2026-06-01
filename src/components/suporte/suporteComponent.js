// FACHADA DE OUVIDORIA: Define e exporta o componente visual responsável por desenhar a tela de suporte e o histórico de sugestões.
export const suporteComponent = {
  
  // CONSTRUTOR DA INTERFACE: Função de desenho que recebe a div alvo do HTML, a lista de chamados do banco e o gatilho de envio da visão.
  renderizar(containerAlvo, listaChamados, callbackDispararEnvio) {
    
    if (!containerAlvo) return; // Trava de segurança: se o espaço físico sumiu da página por falha do navegador, aborta para não travar o app.
    
    containerAlvo.innerHTML = ''; // Limpa resíduos ou lixos visuais anteriores para garantir uma plotagem limpa da nova tela.

    // Criamos o contêiner mestre que vai organizar o layout em formato de duas colunas (Formulário à esquerda, Histórico à direita).
    const painelSuporteDistribuidor = document.createElement('div');
    painelSuporteDistribuidor.style.cssText = 'width: 100%; display: flex; gap: 25px; flex-wrap: wrap; animation: fadeIn 0.2s ease-in-out;';

    // ==========================================
    // COLUNA ESQUERDA: O FORMULÁRIO DE CAPTURA
    // ==========================================
    const colunaFormulario = document.createElement('div');
    colunaFormulario.style.cssText = 'flex: 1; min-width: 320px; background: white; padding: 25px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; height: fit-content;';
    colunaFormulario.innerHTML = `
      <h3 style="font-size: 14px; font-weight: bold; color: #1e293b; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px;">💡 Sugerir Melhoria ou Reportar Erro</h3>
      <p style="font-size: 12px; color: #64748b; margin-bottom: 20px;">Sua ideia vai direto para o painel de evolução do gestor.</p>

      <form id="form-envio-suporte-saas">
        <div style="margin-bottom: 15px;">
          <label style="display: block; font-size: 12px; font-weight: bold; color: #475569; margin-bottom: 5px;">Título Resumido da Ideia/Bug</label>
          <input type="text" id="suporte-titulo" required placeholder="Ex: Adicionar PIX nos meios de recebimento" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
        </div>

        <div style="margin-bottom: 15px;">
          <label style="display: block; font-size: 12px; font-weight: bold; color: #475569; margin-bottom: 5px;">Módulo Afetado do CRM</label>
          <select id="suporte-modulo" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; background: white;">
            <option value="crm">🗂️ CRM Comercial (Kanban/Planilha)</option>
            <option value="acordos">🤝 Esteira de Acordos & Parcelas</option>
            <option value="dashboard">📊 Dashboard BI & Analytics</option>
            <option value="geral">⚙️ Configurações / Geral do App</option>
          </select>
        </div>

        <div style="margin-bottom: 20px;">
          <label style="display: block; font-size: 12px; font-weight: bold; color: #475569; margin-bottom: 5px;">Explique detalhadamente sua Sugestão/Problema</label>
          <textarea id="suporte-descricao" required rows="5" placeholder="Descreva o impacto dessa mudança no seu dia a dia de cobrança..." style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; resize: vertical; font-family: inherit;"></textarea>
        </div>

        <button type="submit" style="background: #2563eb; color: white; border: none; padding: 12px; border-radius: 6px; font-weight: bold; font-size: 13px; width: 100%; cursor: pointer; transition: background 0.2s; box-shadow: 0 4px 6px -1px rgba(37,99,235,0.2);">
          🚀 Protocolar Sugestão de Melhoria
        </button>
      </form>
    `;

    // ==========================================
    // COLUNA DIREITA: O HISTÓRICO DE CHAMADOS
    // ==========================================
    const colunaHistorico = document.createElement('div');
    colunaHistorico.style.cssText = 'flex: 1.5; min-width: 350px; display: flex; flex-direction: column; gap: 15px;';
    
    // Título superior fixo da lista de sugestões.
    const tituloLista = document.createElement('h4');
    tituloLista.style.cssText = 'font-size: 13px; font-weight: bold; color: #475569; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;';
    tituloLista.innerText = `📋 Meus Chamados Protocolados (${listaChamados.length})`;
    colunaHistorico.appendChild(tituloLista);

    // UX TRATAMENTO DE DESERTO: Se o usuário ainda não enviou nenhuma melhoria, desenha uma mensagem amigável de incentivo.
    if (listaChamados.length === 0) {
      const caixaVazia = document.createElement('div');
      caixaVazia.style.cssText = 'background: white; padding: 40px; border-radius: 8px; text-align: center; border: 1px dashed #cbd5e1; color: #94a3b8; font-size: 13px; font-style: italic;';
      caixaVazia.innerText = 'Nenhuma sugestão enviada por você até o momento. Ajude-nos a construir um CRM melhor! 🎉';
      colunaHistorico.appendChild(caixaVazia);
    } else {
      // LAÇO DE ACORDOS E PEDIDOS: Passa por cada chamado retornado do Firebase e desenha um card corporativo com selos coloridos.
      listaChamados.forEach(chamado => {
        const cardChamado = document.createElement('div');
        cardChamado.style.cssText = 'background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 2px rgba(0,0,0,0.02); display: flex; flex-direction: column; gap: 8px;';

        // LOGICA DE COLORIZAÇÃO DOS STATUS (SEMAFORO INDUSTRIAL): Define a cor da pílula conforme o andamento do processo na nuvem.
        let seloColoridoCss = '';
        let textoStatusExibicao = '';

        if (chamado.statusProgresso === 'analise') {
          seloColoridoCss = 'background: #fff7ed; color: #c2410c; border: 1px solid #ffedd5;';
          textoStatusExibicao = '⏳ Em Análise';
        } else if (chamado.statusProgresso === 'aprovado') {
          seloColoridoCss = 'background: #eff6ff; color: #1d4ed8; border: 1px solid #dbeafe;';
          textoStatusExibicao = '🚀 Aprovado para Desenvolvimento';
        } else if (chamado.statusProgresso === 'implementado') {
          seloColoridoCss = 'background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0;';
          textoStatusExibicao = ' Pronto no Sistema!';
        }

        cardChamado.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; flex-wrap: wrap;">
            <div>
              <span style="font-size: 10px; font-weight: bold; background: #f1f5f9; color: #475569; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; border: 1px solid #cbd5e1;">🎯 Módulo: ${chamado.modulo.toUpperCase()}</span>
              <h5 style="font-size: 14px; font-weight: bold; color: #1e293b; margin-top: 5px;">${chamado.titulo}</h5>
            </div>
            <span style="${seloColoridoCss} padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; white-space: nowrap;">${textoStatusExibicao}</span>
          </div>

          <p style="font-size: 12px; color: #334155; line-height: 1.4; margin: 3px 0;">${chamado.descricao}</p>
          
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #94a3b8; border-top: 1px dashed #f1f5f9; padding-top: 8px; margin-top: 4px;">
            <span>Por: <strong>${chamado.autorNome}</strong></span>
            <span>📅 Enviado em ${chamado.dataCriacao}</span>
          </div>

          <!-- BALÃO DE RETORNO DA GESTÃO: Se você escreveu um feedback no Firebase para o operador, brota uma caixinha de diálogo cinza elegante -->
          ${chamado.respostaGestao ? `
            <div style="background: #f8fafc; border-left: 3px solid #64748b; padding: 10px; border-radius: 4px; font-size: 12px; margin-top: 5px;">
              <strong style="color: #475569;">💬 Resposta da Diretoria:</strong>
              <p style="color: #334155; font-style: italic; margin-top: 2px;">"${chamado.respostaGestao}"</p>
            </div>
          ` : ''}
        `;

        colunaHistorico.appendChild(cardChamado); // Enfileira o cartão de chamados montado dentro do painel da direita.
      });
    }

    // Une as duas colunas estruturadas dentro do painel mestre e injeta no container visível.
    painelSuporteDistribuidor.appendChild(colunaFormulario);
    painelSuporteDistribuidor.appendChild(colunaHistorico);
    containerAlvo.appendChild(painelSuporteDistribuidor);

    // ==========================================
    // INTERCEPTADOR DE SUBMIT (ENVIO DO FORMULÁRIO)
    // ==========================================
    document.getElementById('form-envio-suporte-saas').addEventListener('submit', async (e) => {
      e.preventDefault(); // Trava a página impedindo-a de atualizar e perder os dados digitados em tempo de execução.

      const pacoteChamadoFormulario = { // Organiza os textos extraídos das caixas de texto.
        titulo: document.getElementById('suporte-titulo').value,
        modulo: document.getElementById('suporte-modulo').value,
        descricao: document.getElementById('suporte-descricao').value
      };

      // Dispara o callback da visão. Se o Firebase der o carimbo de sucesso, limpa os campos para uma próxima melhoria.
      const sucessoNaGravacao = await callbackDispararEnvio(pacoteChamadoFormulario);
      if (sucessoNaGravacao) {
        document.getElementById('form-envio-suporte-saas').reset(); // Limpa as caixas de texto deixando o formulário virgem novamente.
      }
    });
  } // Encerra a função principal de renderização.
}; // Encerra a exportação do componente suporteComponent.