// FACHADA DE OUVIDORIA: Define e exporta o componente visual responsável por desenhar a tela de suporte e o histórico de sugestões.
export const suporteComponent = {
  
  // CONSTRUTOR DA INTERFACE: Função de desenho que recebe a div alvo do HTML, a lista de chamados do banco e o gatilho de envio da visão.
  renderizar(containerAlvo, listaChamados, callbackDispararEnvio) {
    
    if (!containerAlvo) return; // [Dev Sênior] Trava de segurança: se o espaço físico sumiu da página por falha do navegador, aborta para não travar o app.
    
    containerAlvo.innerHTML = ''; // [Dev Sênior] Limpa resíduos ou lixos visuais anteriores para garantir uma plotagem limpa da nova tela.

    // Criamos o contêiner mestre que vai organizar o layout em formato de duas colunas (Formulário à esquerda, Histórico à direita).
    const painelSuporteDistribuidor = document.createElement('div'); // [Dev Sênior] Fabrica o elemento de divisão que servirá de casulo distribuidor na tela.
    painelSuporteDistribuidor.style.cssText = 'width: 100%; display: flex; gap: 25px; flex-wrap: wrap; animation: fadeIn 0.2s ease-in-out;'; // [Dev Sênior] Configura o barramento flexível horizontal com espaçamento simétrico e animação leve de surgimento.

    // ==========================================
    // COLUNA ESQUERDA: O FORMULÁRIO DE CAPTURA
    // ==========================================
    const colunaFormulario = document.createElement('div'); // [Dev Sênior] Fabrica a caixa física da coluna esquerda para abrigar o formulário.
    colunaFormulario.style.cssText = 'flex: 1; min-width: 320px; background: white; padding: 25px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; height: fit-content;'; // [Dev Sênior] Aplica o design executivo de bloco branco com contornos cinza suave e sombra tridimensional fosca.
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
    `; // [Dev Sênior] Injeta a estrutura de capturas contendo o campo de título, o seletor de módulos e a caixa grande de descrições detalhadas.

    // ==========================================
    // COLUNA DIREITA: O HISTÓRICO DE CHAMADOS
    // ==========================================
    const colunaHistorico = document.createElement('div'); // [Dev Sênior] Fabrica a caixa física da coluna direita para abrigar a linha do tempo de chamados enviados.
    colunaHistorico.style.cssText = 'flex: 1.5; min-width: 350px; display: flex; flex-direction: column; gap: 15px;'; // [Dev Sênior] Configura a proporção ligeiramente maior da planilha horizontal para comportar os textos longos.
    
    // Título superior fixo da lista de sugestões.
    const tituloLista = document.createElement('h4'); // [Dev Sênior] Cria a tag de cabeçalho da listagem de históricos.
    tituloLista.style.cssText = 'font-size: 13px; font-weight: bold; color: #475569; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;'; // [Dev Sênior] Estiliza em caixa alta sóbria cinza corporativo.
    tituloLista.innerText = `📋 Meus Chamados Protocolados (${listaChamados.length})`; // [Dev Sênior] Escreve o rótulo fundindo a quantidade reativa de melhorias salvas no banco.
    colunaHistorico.appendChild(tituloLista); // [Dev Sênior] Fixa o título no topo interno da coluna direita de históricos.

    // UX TRATAMENTO DE DESERTO: Se o usuário ainda não enviou nenhuma melhoria, desenha uma mensagem amigável de incentivo.
    if (listaChamados.length === 0) { // [Dev Sênior] Condicional: se o tamanho do array vindo do Firebase for estritamente igual a zero.
      const caixaVazia = document.createElement('div'); // [Dev Sênior] Fabrica uma div vazia de aviso neutro.
      caixaVazia.style.cssText = 'background: white; padding: 40px; border-radius: 8px; text-align: center; border: 1px dashed #cbd5e1; color: #94a3b8; font-size: 13px; font-style: italic;'; // [Dev Sênior] Estiliza com bordas tracejadas e fonte em itálico de descanso de tela.
      caixaVazia.innerText = 'Nenhuma sugestão enviada por você até o momento. Ajude-nos a construir um CRM melhor! 🎉'; // [Dev Sênior] Mensagem amigável de incentivo de uso.
      colunaHistorico.appendChild(caixaVazia); // [Dev Sênior] Anexa o aviso de esteira limpa na coluna direita.
    } else { // [Dev Sênior] Caso existam chamados ou sugestões técnicas registradas na nuvem.
      // LAÇO DE ACORDOS E PEDIDOS: Passa por cada chamado retornado do Firebase e desenha um card corporativo com selos coloridos.
      listaChamados.forEach(chamado => { // [Dev Sênior] Abre uma repetição passando de registro em registro de chamado extraído da nuvem.
        const cardChamado = document.createElement('div'); // [Dev Sênior] Fabrica o elemento de bloco que servirá de invólucro para a sugestão atual.
        cardChamado.style.cssText = 'background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 2px rgba(0,0,0,0.02); display: flex; flex-direction: column; gap: 8px;'; // [Dev Sênior] Aplica fundo branco premium com cantos suavizados e sombra leve tridimensional deCRM de mercado.

        // LOGICA DE COLORIZAÇÃO DOS STATUS (SEMAFORO INDUSTRIAL): Define a cor da pílula conforme o andamento do processo na nuvem.
        let seloColoridoCss = ''; // [Dev Sênior] Inicializa a variável de estilo em linha oculta.
        let textoStatusExibicao = ''; // [Dev Sênior] Inicializa a variável de rótulo de texto explicativo.

        if (chamado.statusProgresso === 'analise') { // [Dev Sênior] Se o chamado estiver na fase inicial de triagem na mesa do faturamento.
          seloColoridoCss = 'background: #fff7ed; color: #c2410c; border: 1px solid #ffedd5;'; // [Dev Sênior] Injeta cores laranja pastel indicadoras de atenção.
          textoStatusExibicao = '⏳ Em Análise'; // [Dev Sênior] Carimba o aviso de pendente.
        } else if (chamado.statusProgresso === 'aprovado') { // [Dev Sênior] Se o gestor aprovou a sugestão para desenvolvimento técnico.
          seloColoridoCss = 'background: #eff6ff; color: #1d4ed8; border: 1px solid #dbeafe;'; // [Dev Sênior] Injeta cores azuis royal indicadoras de avanço de roadmap.
          textoStatusExibicao = '🚀 Aprovado para Desenvolvimento'; // [Dev Sênior] Carimba o aviso de aprovado.
        } else if (chamado.statusProgresso === 'implementado') { // [Dev Sênior] CORREÇÃO VISUAL: Se a melhoria já foi codada e colocada em produção real no CRM.
          seloColoridoCss = 'background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0;'; // [Dev Sênior] Injeta cores verde esmeralda indicadoras de sucesso.
          textoStatusExibicao = '✅ Pronto no Sistema!'; // [Dev Sênior] HIGIENIZADO: Adicionado o emoji de visto verde corrigindo o texto de exibição do card.
        } // [Dev Sênior] Encerra a árvore de decisões do semáforo industrial de status.

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

          ${chamado.respostaGestao ? `
            <div style="background: #f8fafc; border-left: 3px solid #64748b; padding: 10px; border-radius: 4px; font-size: 12px; margin-top: 5px;">
              <strong style="color: #475569;">💬 Resposta da Diretoria:</strong>
              <p style="color: #334155; font-style: italic; margin-top: 2px;">"${chamado.respostaGestao}"</p>
            </div>
          ` : ''}
        `; // [Dev Sênior] Injeta a carcaça interna com as informações estruturadas de autor, módulo e os balões opcionais de respostas da gestão.

        colunaHistorico.appendChild(cardChamado); // [Dev Sênior] Enfileira o cartão de chamados montado dentro do painel da direita.
      }); // [Dev Sênior] Encerra o laço de repetição de chamados.
    } // [Dev Sênior] Encerra o desvio condicional de exibição de históricos.

    // Une as duas colunas estruturadas dentro do painel mestre e injeta no container visível.
    painelSuporteDistribuidor.appendChild(colunaFormulario); // [Dev Sênior] Fixa o braço esquerdo de formulários dentro do distribuidor geral flexbox.
    painelSuporteDistribuidor.appendChild(colunaHistorico); // [Dev Sênior] Fixa o braço direito de cartões dentro do distribuidor geral flexbox.
    containerAlvo.appendChild(painelSuporteDistribuidor); // [Dev Sênior] Deságua o layout completo unificado na div reservada da tela do site.

    // ==========================================
    // INTERCEPTADOR DE SUBMIT (ENVIO DO FORMULÁRIO)
    // ==========================================
    document.getElementById('form-envio-suporte-saas').addEventListener('submit', async (e) => { // [Dev Sênior] Grampeia o gatilho de submit quando o operador clica para submeter os textos.
      e.preventDefault(); // [Dev Sênior] Trava a página impedindo-a de atualizar e perder os dados digitados em tempo de execução.

      const pacoteChamadoFormulario = { // [Dev Sênior] Organiza os textos extraídos das caixas de texto.
        titulo: document.getElementById('suporte-titulo').value, // [Dev Sênior] Puxa a string de título resumido digitado.
        modulo: document.getElementById('suporte-modulo').value, // [Dev Sênior] Puxa a chave de texto do módulo afetado selecionado.
        descricao: document.getElementById('suporte-descricao').value // [Dev Sênior] Puxa o bloco longo descritivo da ideia.
      }; // [Dev Sênior] Fecha o pacote básico do formulário de ouvidoria.

      // Dispara o callback da visão. Se o Firebase der o carimbo de sucesso, limpa os campos para uma próxima melhoria.
      const sucessoNaGravacao = await callbackDispararEnvio(pacoteChamadoFormulario); // [Dev Sênior] Envia as descrições para processamento assíncrono na nuvem via comanda do app.js.
      if (sucessoNaGravacao) { // [Dev Sênior] Se o Firestore devolver as chaves de gravação de sucesso em tempo de execução.
        document.getElementById('form-envio-suporte-saas').reset(); // [Dev Sênior] Limpa as caixas de texto deixando o formulário virgem novamente.
      } // [Dev Sênior] Encerra o crivo de sucesso de escrita.
    }); // [Dev Sênior] Encerra o ouvinte de cliques do botão de envio.
  } // [Dev Sênior] Encerra a função principal de renderização.
}; // [Dev Sênior] Encerra a exportação do componente suporteComponent.