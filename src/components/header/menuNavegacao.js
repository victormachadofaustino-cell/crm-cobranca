export const menuNavegacao = { // Define e exporta o submódulo focado de forma estrita em cuidar da barra de navegação esquerda.
  renderizar(containerEsquerdo, callbackMenu) { // Cria a função que injeta as abas e ouve suas interações textuais.
    
    // MONTAGEM DOS LINKS DE MÓDULOS: Altera o título para DOCULOC com tipografia branca premium e simplifica o botão operacional para apenas "CRM".
    containerEsquerdo.innerHTML = `
      <div style="cursor: pointer;">
        <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 900; letter-spacing: -0.5px; font-family: sans-serif;">DOCULOC</h1> </div>
      <nav style="display: flex; gap: 15px; align-items: center;">
        <button class="nav-link" data-modulo="dashboard" style="background: none; border: none; color: #64748b; font-weight: 500; font-size: 14px; cursor: pointer; padding: 5px 10px;">Dashboard</button>
        <button class="nav-link active" data-modulo="crm" style="background: none; border: none; color: #2563eb; font-weight: bold; font-size: 14px; cursor: pointer; padding: 5px 10px; border-bottom: 2px solid #2563eb;">CRM</button>
        <button class="nav-link" data-modulo="relatorios" style="background: none; border: none; color: #64748b; font-weight: 500; font-size: 14px; cursor: pointer; padding: 5px 10px;">Relatórios</button>
        <button class="nav-link" data-modulo="acordos" style="background: none; border: none; color: #64748b; font-weight: 500; font-size: 14px; cursor: pointer; padding: 5px 10px;">Acordos</button>
        <!-- NOVO ACESSO VISUAL: Insere o botão de tarefas unificadas diretamente na grade de ferramentas do menu superior -->
        <button class="nav-link" data-modulo="tarefas" style="background: none; border: none; color: #64748b; font-weight: 500; font-size: 14px; cursor: pointer; padding: 5px 10px;">Minhas Tarefas</button>
        <!-- NOVO ACESSO VISUAL: Insere o botão de ouvidoria e suporte técnico para coleta de melhorias com o time -->
        <button class="nav-link" data-modulo="suporte" style="background: none; border: none; color: #64748b; font-weight: 500; font-size: 14px; cursor: pointer; padding: 5px 10px;">Suporte Técnico</button>
      </nav>
    `; // Injeta os links de módulos (Dashboard, CRM, Relatórios, Acordos, Tarefas e Suporte) aplicando a classe de destaque inicial na aba CRM.

    document.querySelectorAll('.nav-link').forEach(link => { // Localiza individualmente cada uma das abas de texto inseridas na barra.
      link.addEventListener('click', (e) => { // Configura o monitor de cliques individuais nas abas do sistema.
        const moduloAlvo = e.target.getAttribute('data-modulo'); // Captura a rota em texto eletrônico assinada na tag do link clicado.
        
        document.querySelectorAll('.nav-link').forEach(l => { // Executa uma varredura limpando a seleção visual de todas as abas inativas.
          l.style.color = '#64748b'; // Reseta a cor das letras devolvendo o tom cinza de repouso padrão.
          l.style.fontWeight = '500'; // Remove o negrito da fonte retornando à espessura normal.
          l.style.borderBottom = 'none'; // Elimina a linha horizontal sólida inferior azul das abas desmarcadas.
        }); // Encerra a higienização do menu.

        e.target.style.color = '#2563eb'; // Destaca a aba clicada pintando o texto com o azul oficial de atividade.
        e.target.style.fontWeight = 'bold'; // Engrossa o texto para fornecer feedback de leitura imediato ao cobrador.
        e.target.style.borderBottom = '2px solid #2563eb'; // Desenha o traço azul inferior confirmando visualmente a ativação do módulo.
        
        callbackMenu(moduloAlvo); // Dispara a notificação enviando a rota escolhida para o maestro app.js chavear o layout em segundo plano.
      }); // Encerra o ouvinte de cliques del link.
    }); // Encerra a vinculação das abas de navegação textuais.
  } // Encerra a renderização do menuNavegacao.
}; // Encerra a exportação do objeto menuNavegacao.