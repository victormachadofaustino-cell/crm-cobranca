import { authVisao } from "../../views/authVisao"; // Importa o cérebro da autenticação para permitir o encerramento seguro de sessões de operadores.

export const botoesAcao = { // Define e exporta o submódulo focado em isolar as ações e interações dos botões de controle e perfil do topo direito.
  renderizar(containerDireito, usuarioLogado, callbackEngrenagem, callbackMenu, callbackAplicarFiltros) { // CORRIGIDO: Adicionado o quinto parâmetro callbackAplicarFiltros na assinatura da função para receber as ordens de reatividade do app.js sem quebras.
    
    // MONTAGEM DOS ÍCONES DA DIREITA: Injeta os desenhos matemáticos vetoriais dos botões, incluindo o novo botão de Funil, e o círculo com as iniciais do operador.
    containerDireito.innerHTML = `
      <!-- Botão de Upload de Planilhas Comerciais em lote -->
      <button class="nav-link-icon" id="btn-upload-planilha" data-modulo="upload" title="Upload de Planilha de Cobrança" style="background: none; border: none; cursor: pointer; padding: 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <path d="M12 3v12"></path>
        </svg>
      </button>

      <!-- NOVO BOTÃO DE FUNIL DA GAVETA LATERAL: Adicionado fisicamente para permitir a abertura do painel de filtros rápidos do CRM de correr -->
      <button id="btn-global-filtro-casca" title="Abrir Filtros Avançados" style="background: none; border: none; cursor: pointer; padding: 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
      </button>

      <!-- Botão de Engrenagem de Configurações das Raia do Funil Kanban -->
      <button id="btn-config-funil" title="Configurar Funil de Cobrança" style="background: none; border: none; cursor: pointer; padding: 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </button>

      <!-- Círculo e Avatar com as iniciais do operador em azul executivo -->
      <div id="btn-perfil-usuario" title="Clique para Sair / Desconectar com Segurança" style="width: 36px; height: 36px; background-color: #2563eb; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; cursor: pointer; border: 2px solid #ffffff; box-shadow: 0 4px 6px -1px rgba(37,99,235,0.3); text-transform: uppercase; font-family: sans-serif; transition: all 0.2s;">
        ${usuarioLogado.iniciais || 'U'}
      </div>
    `; // Injeta os SVGs vetoriais da linha superior e vincula as iniciais dinâmicas.

    const btnConfig = document.getElementById('btn-config-funil'); // Localiza o botão circular da engrenagem no documento.
    btnConfig.addEventListener('mouseenter', () => btnConfig.style.backgroundColor = '#f1f5f9'); // Cria um preenchimento cinza sutil atrás do ícone circular quando o mouse entra.
    btnConfig.addEventListener('mouseleave', () => btnConfig.style.backgroundColor = 'transparent'); // Limpa a cor cinza devolvendo a transparência nativa ao afastar o ponteiro.

    const btnUpload = document.getElementById('btn-upload-planilha'); // Localiza o botão circular do upload de planilhas.
    btnUpload.addEventListener('mouseenter', () => btnUpload.style.backgroundColor = '#f1f5f9'); // Cria o mesmo preenchimento cinza sutil por microinteração de UX.
    btnUpload.addEventListener('mouseleave', () => btnUpload.style.backgroundColor = 'transparent'); // Retorna à transparência original ao afastar o mouse.

    const btnFiltro = document.getElementById('btn-global-filtro-casca'); // [Dev Sênior] Localiza o novo botão de funil recém-injetado na árvore de elementos.
    btnFiltro.addEventListener('mouseenter', () => btnFiltro.style.backgroundColor = '#f1f5f9'); // [Dev Sênior] Aplica o realce de foco cinza claro no mouseover.
    btnFiltro.addEventListener('mouseleave', () => btnFiltro.style.backgroundColor = 'transparent'); // [Dev Sênior] Reseta para transparente ao afastar o mouse.

    const btnPerfil = document.getElementById('btn-perfil-usuario'); // Localiza o círculo visual das iniciais do operador logado.
    btnPerfil.addEventListener('mouseenter', () => btnPerfil.style.transform = 'scale(1.05)'); // Aplica um microefeito de crescimento suave ao passar o mouse.
    btnPerfil.addEventListener('mouseleave', () => btnPerfil.style.transform = 'scale(1)'); // Retorna o tamanho original do botão do avatar quando o ponteiro se afasta.

    btnConfig.addEventListener('click', (e) => { // Monitora os cliques efetuados em cima do botão circular da engrenagem.
        callbackEngrenagem(); // Aciona a rota estratégica mestre abrindo o modal de personalização de colunas ativas.
    }); // Encerra o monitoramento da engrenagem.

    btnUpload.addEventListener('click', (e) => { // Intercepta o clique do mouse no atalho de importações em lote de planilhas.
        const moduloAlvo = btnUpload.getAttribute('data-modulo'); // Captura a string de rota "upload" gravada na tag.
        
        document.querySelectorAll('.nav-link').forEach(l => { // Varre os links de texto do visor esquerdo limpando marcas de seleção azul ativas.
            l.style.color = '#64748b'; // Apaga o link pintando com o cinza padrão fosco de repouso.
            l.style.fontWeight = '500'; // Remove a espessura de negrito das letras.
            l.style.borderBottom = 'none'; // Elimina a barra de borda sólida inferior azul.
        }); // Encerra a higienização reativa de links.
        
        callbackMenu(moduloAlvo); // Dispara a chamada enviando a rota para o maestro app.js trocar as telas de trabalho.
    }); // Encerra o monitoramento do upload.

    // ATUALIZAÇÃO DA PORTARIA (DIRETRIZ DE SEGURANÇA): Monitora o clique no círculo de iniciais para oferecer o encerramento seguro do turno de cobrança.
    document.getElementById('btn-perfil-usuario').addEventListener('click', () => { 
        const confirmarSaidaTurno = confirm(`Olá, ${usuarioLogado.nome}.\nDeseja encerrar sua sessão e bloquear esta mesa de cobrança com segurança?`); // Abre a caixa de decisão no monitor do operador.
        if (confirmarSaidaTurno) { // Se o funcionário clicar no botão de confirmação.
            authVisao.efetuarLogout(); // Executa o desligamento eletrônico limpando a memória do LocalStorage e reiniciando a tela no modo de Login.
        } // Encerra a árvore de decisões do logout.
    }); // Encerra a escuta do perfil do usuário e encerramento de turnos.
  } // Encerra a renderização de botoesAcao.
}; // Encerra a exportação do objeto botoesAcao.