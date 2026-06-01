export const headerComponent = { // Define e exporta o módulo do cabeçalho global que gerencia o menu superior e a gaveta oculta de filtros.
  renderizar(headerContainer, usuarioAtual, callbackConfig, callbackChavearModulo, callbackAplicarFiltros) { // Função mestre calibrada para receber os 5 parâmetros incluindo a escuta de filtros de BI.
    
    headerContainer.innerHTML = ''; // Esvazia resíduos ou lixos visuais anteriores para uma plotagem limpa e segura do layout superior.
    
    // GUARDA DE SESSÃO: Armazena em memória qual o módulo está ativo para a gaveta saber quais campos desenhar quando for aberta.
    if (!window.moduloAtivoSistema) {
      window.moduloAtivoSistema = 'crm'; // Define que o sistema nasce por padrão na tela comercial do CRM.
    }

    // MONTAGEM DO HTML E CSS EM LINHA: Injeta a barra superior fixa e constrói a gaveta oculta na extrema direita com sua película invisível.
    headerContainer.innerHTML = `
      <div style="background: #1e293b; color: white; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); position: relative; z-index: 4000; width: 100%;">
        
        <div style="display: flex; align-items: center; gap: 25px;">
          <h1 style="font-size: 16px; font-weight: bold; margin: 0; color: #38bdf8; letter-spacing: 0.5px;">⚡ CRM COBRANÇA</h1>
          <nav style="display: flex; gap: 15px;">
            <button type="button" class="btn-menu-modulo" data-modulo="crm" style="background: ${window.moduloAtivoSistema === 'crm' ? '#334155' : 'none'}; border: none; color: white; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; cursor: pointer;">🗂️ CRM Comercial</button>
            <button type="button" class="btn-menu-modulo" data-modulo="acordos" style="background: ${window.moduloAtivoSistema === 'acordos' ? '#334155' : 'none'}; border: none; color: white; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; cursor: pointer;">🤝 Esteira Acordos</button>
            <button type="button" class="btn-menu-modulo" data-modulo="dashboard" style="background: ${window.moduloAtivoSistema === 'dashboard' ? '#334155' : 'none'}; border: none; color: white; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; cursor: pointer;">📊 Dashboard BI</button>
          </nav>
        </div>

        <div style="display: flex; align-items: center; gap: 15px;">
          <button type="button" id="btn-header-config-funil" style="background: none; border: none; color: #94a3b8; font-size: 16px; cursor: pointer; padding: 4px; transition: color 0.2s;">⚙️</button>
          
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="background: #0284c7; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 11px; font-weight: bold; border: 1px solid #0c4a6e;" title="Usuário Logado: ${usuarioAtual.nome}">
              ${usuarioAtual.iniciais}
            </div>
          </div>
        </div>
      </div>
    `; // Encerra a plotagem da casca protetora de navegação superior, respeitando os botões chumbados no index.html.

    // ELEMENTOS FÍSICOS CAPTURADOS: Conecta as variáveis diretamente às tags fixas estruturadas do index.html.
    const elementoGaveta = document.getElementById('gaveta-filtro-lateral-painel'); // Captura a janela de correr da direita.
    const elementoBackdrop = document.getElementById('backdrop-filtro-lateral'); // Captura a película invisível de clique fora.
    const mioloCampos = document.getElementById('miolo-campos-gaveta-dinamica'); // Captura o ninho interno de inputs dinâmicos.

    // SUB-ROTINA REATIVA CAMALEÃO: Constrói o layout interno da gaveta colhendo as chaves guardadas de cabeçalho.
    const reconstruirInputsGavetaLateral = () => {
      mioloCampos.innerHTML = ''; // Limpa os inputs antigos para evitar misturar filtros de telas paralelas.
      
      if (window.moduloAtivoSistema === 'crm') { // CENÁRIO A: Se o usuário estiver na tela de Kanban ou Planilha.
        if (!window.filtrosGavetaCrmAtivos) window.filtrosGavetaCrmAtivos = { responsavel: '', faixaValor: '', nivelAtraso: '', semTarefas: false }; // Cria a gaveta na sessão se vazia.
        
        mioloCampos.innerHTML = `
          <p style="font-size: 11px; color: #64748b; margin: 0 0 5px 0;">Combine filtros baseados nos cabeçalhos da planilha comercial:</p>
          <div>
            <label style="display: block; font-size: 11px; font-weight: bold; color: #475569; margin-bottom: 4px;">👤 Filtrar por Responsável</label>
            <input type="text" id="gaveta-input-responsavel" placeholder="Ex: Victor Faustino" value="${window.filtrosGavetaCrmAtivos.responsavel || ''}" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px;">
          </div>
          <div>
            <label style="display: block; font-size: 11px; font-weight: bold; color: #475569; margin-bottom: 4px;">💰 Faixa de Valor do Card</label>
            <select id="gaveta-select-faixavalor" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; background: white;">
              <option value="" ${window.filtrosGavetaCrmAtivos.faixaValor === '' ? 'selected' : ''}>Qualquer Valor</option>
              <option value="baixa" ${window.filtrosGavetaCrmAtivos.faixaValor === 'baixa' ? 'selected' : ''}>📉 Pequeno Valor (Até R$ 500)</option>
              <option value="media" ${window.filtrosGavetaCrmAtivos.faixaValor === 'media' ? 'selected' : ''}>📊 Médio Valor (R$ 500 a R$ 2.000)</option>
              <option value="alta" ${window.filtrosGavetaCrmAtivos.faixaValor === 'alta' ? 'selected' : ''}>🚀 Alta Relevância (+R$ 2.000)</option>
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 11px; font-weight: bold; color: #475569; margin-bottom: 4px;">⏳ Período de Inadimplência</label>
            <select id="gaveta-select-atraso" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; background: white;">
              <option value="" ${window.filtrosGavetaCrmAtivos.nivelAtraso === '' ? 'selected' : ''}>Qualquer Atraso</option>
              <option value="recente" ${window.filtrosGavetaCrmAtivos.nivelAtraso === 'recente' ? 'selected' : ''}>⚡ Atraso Recente (Até 30 dias)</option>
              <option value="critico" ${window.filtrosGavetaCrmAtivos.nivelAtraso === 'critico' ? 'selected' : ''}>🚨 Temperatura Crítica (+30 dias)</option>
            </select>
          </div>
          <label style="display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: bold; color: #c2410c; background: #fff7ed; padding: 8px; border-radius: 4px; border: 1px solid #ffedd5; margin-top: 5px; cursor: pointer;">
            <input type="checkbox" id="gaveta-check-semtarefas" ${window.filtrosGavetaCrmAtivos.semTarefas ? 'checked' : ''}> ⚠️ Mostrar apenas sem tarefas criadas
          </label>
        `;
      } else if (window.moduloAtivoSistema === 'acordos') { // CENÁRIO B: Se o operador estiver na Esteira de Controladorias e Parcelamentos.
        if (!window.filtrosGavetaAcordosAtivos) window.filtrosGavetaAcordosAtivos = { estadoTitulo: '', meioRecebimento: '' }; // Inicializa chaves financeiras na sessão.
        
        mioloCampos.innerHTML = `
          <p style="font-size: 11px; color: #64748b; margin: 0 0 5px 0;">Filtros específicos para a auditoria de faturamento e boletos:</p>
          <div>
            <label style="display: block; font-size: 11px; font-weight: bold; color: #475569; margin-bottom: 4px;">🟩 Estado do Título</label>
            <select id="gaveta-select-estadotitulo" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; background: white;">
              <option value="" ${window.filtrosGavetaAcordosAtivos.estadoTitulo === '' ? 'selected' : ''}>Todos os Boletos</option>
              <option value="pago" ${window.filtrosGavetaAcordosAtivos.estadoTitulo === 'pago' ? 'selected' : ''}>🟩 Liquidado / Caixa Baixado</option>
              <option value="aberto" ${window.filtrosGavetaAcordosAtivos.estadoTitulo === 'aberto' ? 'selected' : ''}>🟨 Pendente / A Vencer</option>
              <option value="atraso" ${window.filtrosGavetaAcordosAtivos.estadoTitulo === 'atraso' ? 'selected' : ''}>🟥 Acordo Quebrado / Vencido</option>
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 11px; font-weight: bold; color: #475569; margin-bottom: 4px;">💳 Meio de Recebimento</label>
            <select id="gaveta-select-meiorecebimento" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; background: white;">
              <option value="" ${window.filtrosGavetaAcordosAtivos.meioRecebimento === '' ? 'selected' : ''}>Qualquer Forma</option>
              <option value="Boleto" ${window.filtrosGavetaAcordosAtivos.meioRecebimento === 'Boleto' ? 'selected' : ''}>📄 Boleto Bancário</option>
              <option value="Crédito" ${window.filtrosGavetaAcordosAtivos.meioRecebimento === 'Crédito' ? 'selected' : ''}>💳 Cartão de Crédito</option>
              <option value="Débito" ${window.filtrosGavetaAcordosAtivos.meioRecebimento === 'Débito' ? 'selected' : ''}>🏦 Cartão de Débito</option>
            </select>
          </div>
        `;
      } else if (window.moduloAtivoSistema === 'dashboard') { // CENÁRIO C: Se o gestor estiver na aba de Analytics de BI.
        if (!window.filtrosGavetaDashboardAtivos) window.filtrosGavetaDashboardAtivos = { dataInicio: '', dataFim: '' };
        
        mioloCampos.innerHTML = `
          <p style="font-size: 11px; color: #64748b; margin: 0 0 5px 0;">FILTRO TEMPORAL: Restrinja os gráficos do Dashboard entre dois períodos:</p>
          <div>
            <label style="display: block; font-size: 11px; font-weight: bold; color: #475569; margin-bottom: 4px;">📅 Data de Início</label>
            <input type="date" id="gaveta-date-inicio" value="${window.filtrosGavetaDashboardAtivos.dataInicio || ''}" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; font-weight: 600; color: #334155;">
          </div>
          <div>
            <label style="display: block; font-size: 11px; font-weight: bold; color: #475569; margin-bottom: 4px;">📅 Data Limite Final</label>
            <input type="date" id="gaveta-date-fim" value="${window.filtrosGavetaDashboardAtivos.dataFim || ''}" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; font-weight: 600; color: #334155;">
          </div>
        `;
      }
      
      // Injeta o botão azul de confirmação no rodapé do painel curto lateral.
      mioloCampos.innerHTML += `
        <button type="button" id="btn-aplicar-filtros-gaveta" style="background: #2563eb; color: white; border: none; padding: 8px; border-radius: 4px; font-weight: bold; font-size: 12px; width: 100%; margin-top: auto; cursor: pointer; text-align: center; box-shadow: 0 2px 4px rgba(37,99,235,0.2);">💾 Aplicar Filtros no CRM</button>
      `;

      // Evento de clique para capturar os inputs, salvar na sessão global e fechar a gaveta aplicando reatividade.
      document.getElementById('btn-aplicar-filtros-gaveta').addEventListener('click', () => {
        if (window.moduloAtivoSistema === 'crm') { // Se a comanda for do CRM comercial.
          window.filtrosGavetaCrmAtivos.responsavel = document.getElementById('gaveta-input-responsavel').value;
          window.filtrosGavetaCrmAtivos.faixaValor = document.getElementById('gaveta-select-faixavalor').value;
          window.filtrosGavetaCrmAtivos.nivelAtraso = document.getElementById('gaveta-select-atraso').value;
          window.filtrosGavetaCrmAtivos.semTarefas = document.getElementById('gaveta-check-semtarefas').checked;
        } else if (window.moduloAtivoSistema === 'acordos') { // Se a comanda for do faturamento de parcelas.
          window.filtrosGavetaAcordosAtivos.estadoTitulo = document.getElementById('gaveta-select-estadotitulo').value;
          window.filtrosGavetaAcordosAtivos.meioRecebimento = document.getElementById('gaveta-select-meiorecebimento').value;
        } else if (window.moduloAtivoSistema === 'dashboard') { // Se a comanda for da auditoria de períodos do BI.
          window.filtrosGavetaDashboardAtivos.dataInicio = document.getElementById('gaveta-date-inicio').value;
          window.filtrosGavetaDashboardAtivos.dataFim = document.getElementById('gaveta-date-fim').value;
        }
        
        fecharGavetaFiltrosMecanismo(); // Desloca a gaveta lateral de volta para a margem oculta direita.
        if (callbackAplicarFiltros) callbackAplicarFiltros(); // Dispara o gatilho reativo no app.js para re-plotar e recalcular as tabelas e o Kanban na mesma hora!
      });
    };

    // ROTINAS DE DESLIZAMENTO DO DRAWER (CORREÇÃO SÊNIOR DE ERRO DE DIGITAÇÃO): Saneado o termo anterior para elementoGaveta.
    const abrirGavetaFiltrosMecanismo = () => {
      if (elementoGaveta && elementoBackdrop) { // Trava de proteção contra quebras em tempo de execução.
        reconstruirInputsGavetaLateral(); // Desenha dinamicamente os campos específicos com base na aba ativa.
        elementoGaveta.style.transform = 'translateX(0%)'; // Faz a gaveta deslizar suavemente para dentro do visor do CRM.
        elementoBackdrop.style.display = 'block'; // Ativa a película protetora de fundo bloqueando interferências secundárias.
      }
    };

    const fecharGavetaFiltrosMecanismo = () => {
      if (elementoGaveta && elementoBackdrop) { // Trava de segurança estrutural.
        elementoGaveta.style.transform = 'translateX(100%)'; // Move o painel lateral de volta para fora da tela na direita.
        elementoBackdrop.style.display = 'none'; // Desliga a película de fundo liberando a área de trabalho comum.
      }
    };

    // GATILHO DO CLIQUE FORA (DIRETRIZ ESTREITA): Intercepta o toque na película invisível e recolhe a gaveta lateral automaticamente.
    if (elementoBackdrop) elementoBackdrop.addEventListener('click', fecharGavetaFiltrosMecanismo);
    
    const btnFecharDireto = document.getElementById('btn-fechar-gaveta-direta'); // Captura o botão "X" interno do cabeçalho da gaveta.
    if (btnFecharDireto) btnFecharDireto.addEventListener('click', fecharGavetaFiltrosMecanismo);

    // CONEXÃO DO ÍCONE CHUMBADO NO HTML: Vincula a escuta de cliques do botão de filtro fixado no index.html.
    const btnFiltroFixoHtml = document.getElementById('btn-global-filtro-casca'); // Localiza o botão unificado com o desenho de funil.
    if (btnFiltroFixoHtml) btnFiltroFixoHtml.addEventListener('click', abrirGavetaFiltrosMecanismo);

    // Liga o gatilho da engrenagem para parametrizações do funil dinâmico.
    const btnConfigFunil = document.getElementById('btn-header-config-funil');
    if (btnConfigFunil) btnConfigFunil.addEventListener('click', () => { callbackConfig(); });

    // INTERCEPTADOR DOS MENUS DE NAVEGAÇÃO: Monitora as trocas de abas reconfigurando as cores e acionando o app.js.
    headerContainer.querySelectorAll('.btn-menu-modulo').forEach(botaoMenu => {
      botaoMenu.addEventListener('click', (e) => {
        const destinoModulo = botaoMenu.getAttribute('data-modulo'); // Captura qual aba foi clicada (crm, acordos ou dashboard).
        window.moduloAtivoSistema = destinoModulo; // Atualiza a flag na sessão do navegador.
        
        headerContainer.querySelectorAll('.btn-menu-modulo').forEach(btn => btn.style.backgroundColor = 'none'); // Reseta fundos.
        botaoMenu.style.backgroundColor = '#334155'; // Aplica o destaque cinza escuro de ativo no menu recém-clicado.

        fecharGavetaFiltrosMecanismo(); // Garante o fechamento da gaveta de forma preventiva ao mudar de página.
        callbackChavearModulo(destinoModulo); // Encaminha a instrução para o app.js ocultar ou exibir as telas do sistema.
      });
    });
  } // Encerra a função principal de desenho do cabeçalho mestre.
}; // Encerra a exportação do objeto de controle molduraHeader.