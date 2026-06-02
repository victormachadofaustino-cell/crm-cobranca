import { dbService } from "./services/dbService"; // [Dev Sênior] Liga o cabo de fibra óptica do front-end com as funções de salvar e buscar dados na nuvem do Firebase. // Liga as funções de salvar e buscar dados na internet.
import { headerComponent } from "./components/header/molduraHeader"; // [Dev Sênior] Conecta o módulo do cabeçalho profissional que gerencia a barra fixa superior e os menus do sistema. // Conecta a barra superior fixa e menus do sistema.
import { funilConfigComponent } from "./components/funilconfig"; // [Dev Sênior] Conecta o componente da engrenagem que abre o modal de criar e deletar colunas do funil. // Conecta a engrenagem que edita as colunas do Kanban.
import { cardGestaoComponent } from "./components/cardGestao/cardGestaoComponent"; // [Dev Sênior] Conecta a central de comando 360 que abre o prontuário completo e histórico do devedor. // Conecta a central de comando 360 do histórico do cliente.
import { dashboardComponent } from "./components/dashboard"; // [Dev Sênior] Conecta o motor de Business Intelligence (BI) encarregado de calcular e desenho os gráficos macros. // Conecta os gráficos e indicators macros de Business Intelligence.
import { acordosComponent } from "./components/acordos/acordosComponent"; // [Dev Sênior] Conecta a esteira financeira que monitora o fluxo de caixa parcelado e liquidações de boletos. // Conecta a esteira de controladoria financeira e parcelamentos.
import { crmVisaoKanban } from "./views/crmVisaoKanban"; // [Dev Sênior] Conecta a visão especialista em desenhar o tabuleiro com raias cinzas e cartões brancos na tela. // Conecta o desenhador das raias do tabuleiro Kanban na tela.
import { crmVisaoTabela } from "./views/crmVisaoTabela"; // [Dev Sênior] Conecta a visão especialista em transformar os mesmos dados em uma planilha de faturamento executiva. // Conecta o desenhador da planilha executiva comercial.
import { authComponent } from "./components/auth/authComponent"; // [Dev Sênior] Ativa o visual de portaria com tela dividida para preenchimento de login e cadastro corporativo. // Ativa a tela dividida de portaria de login corporativo.
import { authVisao } from "./views/authVisao"; // [Dev Sênior] Ativa o validador lógico que checa os crachás digitais e gerencia os tokens de entrada no Google Cloud. // Ativa o validador lógico de crachás e tokens de acesso.
import { tarefasComponent } from "./components/tarefas/tarefasComponent"; // [Dev Sênior] Conecta o construtor da agenda que projeta os Big Numbers de produtividade e a grade de prazos. // Conecta o construtor visual da agenda de tarefas na tela.
import { tarefasVisao } from "./views/tarefasVisao"; // [Dev Sênior] Conecta o garimpeiro lógico que vasculha o Firebase para minerar os afazeres do operador ativo. // Conecta o garimpeiro lógico de afazeres do operador no Firebase.
import { suporteComponent } from "./components/suporte/suporteComponent"; // [Dev Sênior] Conecta o visual da ouvidoria interna para coleta de formulários e caixas de sugestões de melhorias. // Conecta o visual da ouvidoria interna e caixas de sugestões.
import { suporteVisao } from "./views/suporteVisao"; // [Dev Sênior] Conecta o ouvinte reativo que salva as ideias e gerencia a privacidade de administradores e operadores. // Conecta o ouvinte que salva as ideias de melhorias na nuvem.

// NOTA DE ARQUITETURA: O import antigo do 'kanbanComponent' foi terminantemente removido daqui, pois o arquivo foi desmembrado com sucesso por você! // Lembra o programador de que o componente antigo do Kanban foi desmembrado.

document.addEventListener("DOMContentLoaded", () => { // [Dev Sênior] Trava de segurança: obriga o navegador a carregar toda a estrutura HTML da página antes de ligar os cliques e botões. // Obriga o site a carregar todo o visual antes de ligar os botões.

    const form = document.getElementById('cobrancaForm'); // [Dev Sênior] Captura o formulário de cadastro de títulos para monitorar quando uma nova dívida der entrada no sistema. // Captura a caixa do formulário de inclusão de devedores.
    const headerContainer = document.getElementById('main-header'); // [Dev Sênior] Localiza o espaço físico reservado na parte superior do site para injetar a barra de navegação. // Localiza o contêiner físico destinado ao topo fixo do site.
    const boardContainer = document.getElementById('board'); // [Dev Sênior] Localiza o contêiner do tabuleiro Kanban para podermos ocultá-lo ou exibi-lo conforme a aba do menu. // Localiza o espaço reservado para desenhar o tabuleiro Kanban.

    const areaAuthCasulo = document.getElementById('auth-container'); // [Dev Sênior] Captura o bloco isolado da tela de login para controle estrito de portaria e bloqueio. // Captura o contêiner isolado de bloqueio da tela de login.
    const areaCrmLogado = document.getElementById('app-conteudo-logado'); // [Dev Sênior] Captura o bloco geral do CRM que abriga os relatórios e o painel operacional. // Captura o contêiner geral que abriga todo o painel operacional.

    let estruturaEtapas = []; // [Dev Sênior] Cria o array mestre que vai armazenar em memória ram o arranjo de colunas dinâmicas vindas do Firebase. // Cria o arranjo local na memória para listar as colunas dinâmicas.
    let dadosCobrancasGlobais = []; // [Dev Sênior] Cria a gaveta global de devedores para alimentar os gráficos e planilhas de forma rápida e sincronizada. // Cria a gaveta local de devedores para sincronizar planilhas e gráficos.
    let visaoAtualAtiva = 'kanban'; // [Dev Sênior] Registra se o usuário está assistindo as colunas do Kanban ou as linhas da planilha de faturamento. // Memoriza se o usuário está assistindo calhas Kanban ou linhas de planilha.

    let usuarioAtual = { nome: "Victor Faustino", iniciais: "VF" }; // [Dev Sênior] Ficha de fallback inicial de segurança que será substituída pelos dados do operador real logado. // Ficha provisória de sessão que será substituída pelo usuário real logado.

    window.dadosCobrancasGlobaisRaiz = []; // [Dev Sênior] Registra a gaveta pública de dados na janela do navegador para os submódulos compartilharem informações sem quebras. // Registra a gaveta pública de dados na janela aberta do navegador.

    const inicializarAplicacaoPosAutenticacao = (sessaoOperador) => { // [Dev Sênior] Função mestre de portaria que libera e liga os motores do CRM após o operador ser aceito no cofre do Google. // Libera o painel do CRM após o operador passar pela portaria com sucesso.
        usuarioAtual = sessaoOperador; // [Dev Sênior] Sincroniza os metadados da sessão com o operador real logado.
        
        if (areaAuthCasulo) areaAuthCasulo.style.display = 'none'; // [Dev Sênior] Esconde a tela de login removendo-a da visão.
        if (areaCrmLogado) areaCrmLogado.style.display = 'block'; // [Dev Sênior] Remove o bloqueio e exibe o painel operacional conectado.

        headerComponent.renderizar( // [Dev Sênior] Injeta a barra superior fixa configurando o menu unificado e o avatar de perfil de usuário. // Desenha o cabeçalho mestre passando os comandos de clique e dados de sessão.
            headerContainer, // [Dev Sênior] Entrega o contêiner físico onde o topo fixo de navegação deve morar.
            usuarioAtual, // [Dev Sênior] Passa as iniciais e nome do funcionário para desenhar o avatar.
            () => { // [Dev Sênior] Código executado no exato segundo em que o operador clica na engrenagem.
                let containerConfig = document.getElementById('app-config-container'); // [Dev Sênior] Localiza o espaço reservado para as configurações na tela.
                if (!containerConfig) { // [Dev Sênior] Se o bloco de configurações estiver ausente da árvore da página.
                    containerConfig = document.createElement('div'); // [Dev Sênior] Cria uma div nova dinamicamente para servir de casulo.
                    containerConfig.id = 'app-config-container'; // [Dev Sênior] Applies o ID fixo identificador do painel de parametrização.
                    document.body.appendChild(containerConfig); // [Dev Sênior] Fixa a nova div de forma invisível no final do corpo da página.
                } // [Dev Sênior] Encerra a criação preventiva do casulo de configurações.
                funilConfigComponent.renderizar(containerConfig, estruturaEtapas, async (novasEtapas) => { // [Dev Sênior] Plota o modal de parametrização de raias colhendo as edições do usuário.
                    await dbService.salvarEstruturaFunil(novasEtapas); // [Dev Sênior] Envia a lista de colunas updated para salvar no Firebase.
                }); // [Dev Sênior] Encerra a chamada reativa da parametrização do funil.
            }, // [Dev Sênior] Fecha o bloco reativo de cliques da engrenagem.
            (moduloSelecionado) => { // [Dev Sênior] Escuta os cliques do menu de abas e chaveia o layout ocultando ou exibindo as telas do sistema. // Gerencia as trocas de páginas ocultando ou exibindo os blocos do menu.
                let containerDashboard = document.getElementById('app-dashboard-container'); // [Dev Sênior] Localiza a div destinada aos gráficos analíticos macros de BI.
                let containerTarefas = document.getElementById('app-tarefas-container'); // [Dev Sênior] Localiza a div destinada à exibição da agenda de trabalho unificada.
                let containerSuporte = document.getElementById('app-suporte-container'); // [Dev Sênior] Localiza a div destinada à ouvidoria interna e caixa de sugestões.
                const containerAcordos = document.getElementById('acordos-container'); // [Dev Sênior] Captura a div protetora da esteira financeira e controladoria.
                const tabelaContainer = document.getElementById('tabela-container'); // [Dev Sênior] Captura a div da visualização planilhada tradicional comercial.
                const alternadorContainer = document.getElementById('alternador-visao-container'); // [Dev Sênior] Captura os interruptores superiores de chaveamento Kanban/Planilha.
                
                const botaoNovaCobrancaFisico = document.getElementById('btn-nova-cobranca') || document.querySelector('.btn-add-cobranca') || form?.querySelector('button[type="submit"]')?.parentNode; // [Dev Sênior] Localiza o botão de nova cobrança para aplicar travas visuais.
                const caixaFerramentasFiltroSuperior = document.getElementById('barra-ferramentas-filtros-global') || alternadorContainer?.parentNode; // [Dev Sênior] Localiza a barra superior de ferramentas de filtros rápidos.

                boardContainer.style.display = "none"; // [Dev Sênior] Apaga temporariamente o painel de colunas Kanban da tela.
                if (tabelaContainer) tabelaContainer.style.display = "none"; // [Dev Sênior] Oculta a visualização planilhada tradicional comercial.
                if (alternadorContainer) alternadorContainer.style.display = "none"; // [Dev Sênior] Oculta os interruptores de Kanban/Planilha da barra superior.
                if (containerAcordos) containerAcordos.style.display = "none"; // [Dev Sênior] Oculta a esteira de controladoria financeira da retaguarda de caixa.
                if (containerDashboard) containerDashboard.style.display = "none"; // [Dev Sênior] Oculta o painel de gráficos analíticos macro de BI.
                if (containerTarefas) containerTarefas.style.display = "none"; // [Dev Sênior] Oculta a mesa de trabalho da agenda de produção.
                if (containerSuporte) containerSuporte.style.display = "none"; // [Dev Sênior] Oculta the painel de ouvidoria interna e caixa de chamados.

                if (moduloSelecionado === "dashboard") { // [Dev Sênior] Se o usuário chavear para a página de estatísticas analíticas de BI.
                    if (botaoNovaCobrancaFisico && botaoNovaCobrancaFisico.style) botaoNovaCobrancaFisico.style.display = "none"; // [Dev Sênior] Oculta o botão de criar devedor por travas de governança.
                    if (caixaFerramentasFiltroSuperior && caixaFerramentasFiltroSuperior.style) { // [Dev Sênior] Ajusta o layout flexível da barra superior de ferramentas.
                        caixaFerramentasFiltroSuperior.style.display = "flex"; // [Dev Sênior] Ativa o modelo flexível para organização dos elements.
                        caixaFerramentasFiltroSuperior.style.justifyContent = "flex-end"; // [Dev Sênior] Joga os componentes de filtros temporais para o canto direito.
                    }
                    if (!containerDashboard) { // [Dev Sênior] Se o bloco de gráficos estiver ausente da estrutura do documento.
                        containerDashboard = document.createElement('div'); containerDashboard.id = 'app-dashboard-container'; // [Dev Sênior] Fabrica a div com ID fixo de sistema para abrigar as barras.
                        boardContainer.parentNode.insertBefore(containerDashboard, boardContainer); // [Dev Sênior] Injeta a div de BI de forma simétrica antes do bloco do Kanban.
                    }
                    containerDashboard.style.display = "block"; // [Dev Sênior] Exibe o painel analítico macro de BI na área de trabalho.
                    dashboardComponent.renderizar(containerDashboard, dadosCobrancasGlobais, estruturaEtapas); // [Dev Sênior] Invoca o desenho dos Big Numbers, funil vertical e gráficos de barras.
                } 
                else if (moduloSelecionado === "acordos") { // [Dev Sênior] Se o usuário acionar o portal de controladoria financeira de boletos.
                    if (botaoNovaCobrancaFisico && botaoNovaCobrancaFisico.style) botaoNovaCobrancaFisico.style.display = "none"; // [Dev Sênior] Oculta o botão de inclusão comercial por regras de perfil.
                    if (caixaFerramentasFiltroSuperior && caixaFerramentasFiltroSuperior.style) { // [Dev Sênior] Configura as ferramentas de alinhamento da barra superior.
                        caixaFerramentasFiltroSuperior.style.display = "flex"; caixaFerramentasFiltroSuperior.style.justifyContent = "flex-end"; // [Dev Sênior] Alinha e recua os seletores financeiros horizontalmente na direita.
                    }
                    if (containerAcordos) { // [Dev Sênior] Se a div protetora da controladoria de caixa estiver acessível.
                        containerAcordos.style.display = "block"; // [Dev Sênior] Abre e exibe a planilha executiva financeira de acordos.
                        acordosComponent.renderizar(containerAcordos, dadosCobrancasGlobais, async (idCard, novasParcelasOuObjeto) => { if (novasParcelasOuObjeto && typeof novasParcelasOuObjeto === 'object' && !Array.isArray(novasParcelasOuObjeto)) { await dbService.atualizarCamposCobranca(idCard, novasParcelasOuObjeto); } else { await dbService.atualizarCamposCobranca(idCard, { planoParcelas: novasParcelasOuObjeto }); } }); // [Dev Sênior] Renderiza a controladoria financeira salvando as baixas de faturas na nuvem.
                    }
                } 
                else if (moduloSelecionado === "tarefas") { // [Dev Sênior] Se o usuário chavear para a agenda de produção e produtividade.
                    if (botaoNovaCobrancaFisico && botaoNovaCobrancaFisico.style) botaoNovaCobrancaFisico.style.display = "none"; // [Dev Sênior] Oculta the botão de inclusão comercial.
                    if (caixaFerramentasFiltroSuperior && caixaFerramentasFiltroSuperior.style) { // [Dev Sênior] Fixa o alinhamento dos filtros na margem direita.
                        caixaFerramentasFiltroSuperior.style.display = "flex"; caixaFerramentasFiltroSuperior.style.justifyContent = "flex-end"; // [Dev Sênior] Fixa o alinhamento dos filtros na margem direita.
                    }
                    if (!containerTarefas) { // [Dev Sênior] Se a div de suporte da agenda unificada estiver ausente da folha.
                        containerTarefas = document.createElement('div'); containerTarefas.id = 'app-tarefas-container'; // [Dev Sênior] Fabrica o elemento de bloco dinâmico identificador com ID estável.
                        boardContainer.parentNode.insertBefore(containerTarefas, boardContainer); // [Dev Sênior] Insere o bloco da agenda antes do contêiner do Kanban de forma organizada.
                    }
                    containerTarefas.style.display = "block"; // [Dev Sênior] Torna a planilha da agenda visível na área operacional de trabalho.
                    const resumeFilaProcessada = tarefasVisao.organizarFilaTrabalho(dadosCobrancasGlobais, usuarioAtual); // [Dev Sênior] Invoca o garimpeiro lógico que vasculha e filtra os lembretes do Victor.
                    tarefasComponent.renderizar(containerTarefas, resumeFilaProcessada.filaCompleta, abrirCentralGestao360); // [Dev Sênior] Plota os indicadores numéricos e as lines de compromissos calculados.
                }
                else if (moduloSelecionado === "suporte") { // [Dev Sênior] Se o operador clicar para registrar ou ler chamados de ouvidoria.
                    if (botaoNovaCobrancaFisico && botaoNovaCobrancaFisico.style) botaoNovaCobrancaFisico.style.display = "none"; // [Dev Sênior] Esconde the gatilho de criação comercial por governança de layout.
                    if (caixaFerramentasFiltroSuperior && caixaFerramentasFiltroSuperior.style) { // [Dev Sênior] Organiza as extremidades da barra de ferramentas superior.
                        caixaFerramentasFiltroSuperior.style.display = "flex"; caixaFerramentasFiltroSuperior.style.justifyContent = "flex-end"; // [Dev Sênior] Joga os seletores de relatórios curtos para a margem direita.
                    }
                    if (!containerSuporte) { // [Dev Sênior] Se a div da central de ouvidoria estiver ausente no documento.
                        containerSuporte = document.createElement('div'); containerSuporte.id = 'app-suporte-container'; // [Dev Sênior] Fabrica o elemento de bloco dinamicamente para o módulo SaaS.
                        boardContainer.parentNode.insertBefore(containerSuporte, boardContainer); // [Dev Sênior] Anexa o bloco de ouvidoria de forma simétrica e alinhada antes do Kanban.
                    }
                    containerSuporte.style.display = "block"; // [Dev Sênior] Abre e exibe a central de envio de melhorias na interface.
                    suporteVisao.escutarListaMelhorias(usuarioAtual, (listaRefinadaIdeas) => { // [Dev Sênior] Ativa a escuta permanente da coleção de sugestões registradas.
                        suporteComponent.renderizar(containerSuporte, listaRefinadaIdeas, async (pacoteNovoForm) => { // [Dev Sênior] Renderiza as pílulas coloridas de andamento e o formulário de envio.
                            return await suporteVisao.enviarNovaMelhoria(pacoteNovoForm, usuarioAtual); // [Dev Sênior] Despacha as descrições da melhoria para gravação permanente na nuvem.
                        });
                    });
                }
                // NOVO ROTEADOR: Se o operador clicar na aba "Novo Cadastro" no topo direito do menu.
                else if (moduloSelecionado === "cadastros") { // [Dev Sênior] Intercepta o clique do controle remoto de abas unificadas.
                    window.moduloAtivoSistema = 'crm'; // [Dev Sênior] Força as dependências de layout a se manterem na árvore comercial mestre.
                    if (alternadorContainer) alternadorContainer.style.display = "flex"; // [Dev Sênior] Devolve os seletores Kanban/Planilha para o topo.
                    if (botaoNovaCobrancaFisico && botaoNovaCobrancaFisico.style) botaoNovaCobrancaFisico.style.display = "block"; // [Dev Sênior] Mantém ativo o botão de criação azul.
                    if (caixaFerramentasFiltroSuperior && caixaFerramentasFiltroSuperior.style) { // [Dev Sênior] Sincroniza o espaçamento original das ferramentas horizontais nas pontas.
                        caixaFerramentasFiltroSuperior.style.display = "flex"; caixaFerramentasFiltroSuperior.style.justifyContent = "space-between"; // [Dev Sênior] Mantém o alinhamento nas pontas.
                    }
                    
                    if (visaoAtualAtiva === 'kanban') { // [Dev Sênior] Se a chave apontar para o tabuleiro de cards.
                        boardContainer.style.display = "flex"; reconstruirInterfaceKanban(); // [Dev Sênior] Redesenha as calhas com dados vivos reativos.
                    } else { // [Dev Sênior] Se la visualização ativa for a planilha comercial.
                        if (tabelaContainer) tabelaContainer.style.display = "block"; reconstruirInterfaceTabela(); // [Dev Sênior] Abre a grade planilhada re-renderizando as linhas.
                    }
                    window.openModal(); // [Dev Sênior] DISPARO EXCLUSIVO: Infla na hora o pop-up de cadastros unificados de Empresas e Contatos na tela!
                }
                else if (moduloSelecionado === "crm") { // [Dev Sênior] Se o usuário reativar a aba principal do CRM Comercial de calhas.
                    if (alternadorContainer) alternadorContainer.style.display = "flex"; // [Dev Sênior] Devolve os botões de interruptores Kanban/Planilha ao topo fixo.
                    if (botaoNovaCobrancaFisico && botaoNovaCobrancaFisico.style) botaoNovaCobrancaFisico.style.display = "block"; // [Dev Sênior] Libera a micro-visualização do botão azul de cadastro comercial.
                    if (caixaFerramentasFiltroSuperior && caixaFerramentasFiltroSuperior.style) { // [Dev Sênior] Restaura o espaçamento esticado duplo original das ferramentas.
                        caixaFerramentasFiltroSuperior.style.display = "flex"; caixaFerramentasFiltroSuperior.style.justifyContent = "space-between"; // [Dev Sênior] Estica os filtros e o botão de inclusão comercial nas pontas.
                    }

                    if (visaoAtualAtiva === 'kanban') { // [Dev Sênior] Se o ponteiro interno indicar exibição em formato de raias Kanban.
                        boardContainer.style.display = "flex"; reconstruirInterfaceKanban(); // [Dev Sênior] Re-plota as raias cinzas com os cartões brancos dos devedores ativos.
                    } else { // [Dev Sênior] Se o operador preferir rodar a mesa no modelo planilhado.
                        if (tabelaContainer) tabelaContainer.style.display = "block"; reconstruirInterfaceTabela(); // [Dev Sênior] Abre a grade da planilha e plota as linhas executivas de faturamento.
                    }
                }
            }, // [Dev Sênior] Fecha o bloco distribuidor de abas de navegação de cabeçalho.
            () => { // [Dev Sênior] Código executado no segundo exato em que o usuário confirma filtros no Drawer.
                const containerDashboard = document.getElementById('app-dashboard-container'); // [Dev Sênior] Localiza o casulo que abriga os gráficos macros analíticos.
                const containerAcordos = document.getElementById('acordos-container'); // [Dev Sênior] Localiza o casulo que guarda the esteira financeira de caixa.
                const containerTarefas = document.getElementById('app-tarefas-container'); // [Dev Sênior] Localiza a div de suporte da agenda de produção.

                if (containerDashboard && containerDashboard.style.display === "block") { // [Dev Sênior] Se a página ativa no visor for o painel de BI de gráficos.
                    dashboardComponent.renderizar(containerDashboard, dadosCobrancasGlobais, estruturaEtapas); // [Dev Sênior] Redesenha as barras empilhadas considerando the filtros temporais da gaveta.
                } else if (containerAcordos && containerAcordos.style.display === "block") { // [Dev Sênior] Se a página ativa for a esteira de controle financeiro.
                    acordosComponent.renderizar(containerAcordos, dadosCobrancasGlobais, async (id, pac) => { await dbService.atualizarCamposCobranca(id, pac); }); // [Dev Sênior] Redesenha as faturas cruzando com os novos filtros rápidos aplicados.
                } else if (containerTarefas && containerTarefas.style.display === "block") { // [Dev Sênior] Se o operador estiver filtrando lembretes de tarefas ativas.
                    const resumeFilaFiltro = tarefasVisao.organizarFilaTrabalho(dadosCobrancasGlobais, usuarioAtual); // [Dev Sênior] Recalcula e refina cronologicamente os afazeres daquele usuário.
                    tarefasComponent.renderizar(containerTarefas, resumeFilaFiltro.filaCompleta, abrirCentralGestao360); // [Dev Sênior] Redesenha as linhas de prazos filtradas na agenda de produção.
                } else { // [Dev Sênior] Se o usuário estiver na calha principal de atendimento de clientes do CRM.
                    if (visaoAtualAtiva === 'kanban') reconstruirInterfaceKanban(); else reconstruirInterfaceTabela(); // [Dev Sênior] Redesenha imediatamente as raias ou linhas aplicando the triagens da gaveta.
                }
            } // [Dev Sênior] Fecha o bloco reativo de cliques de filtros de correr.
        ); // [Dev Sênior] Sela por completo a inicialização unificada do cabeçalho profissional.

        // CORREÇÃO EQUALIZADORA COMPLETA: As escutas reativas contínuas foram encapsuladas aqui dentro, garantindo que o sinal com a nuvem só ligue após o operador ter passado com sucesso pela portaria de login!
        dbService.escutarEstruturaFunil(async (etapasDoBanco) => { // [Dev Sênior] Ativa a escuta reativa em cima das raias cadastradas no Firestore.
            if (!etapasDoBanco) { await dbService.inicializarFunilSeVazio(); return; } // [Dev Sênior] Provisiona as 5 raias essenciais de fábrica se o banco for zerado.
            estruturaEtapas = etapasDoBanco; // [Dev Sênior] Sincroniza o array local com o arranjo de colunas vindo do servidor do Google.
            const containerDashboard = document.getElementById('app-dashboard-container'); // [Dev Sênior] Localiza the bloco físico reservado aos gráficos macros.
            const containerAcordos = document.getElementById('acordos-container'); // [Dev Sênior] Localiza the bloco físico reservado à esteira financeira de parcelas.
            const containerTarefas = document.getElementById('app-tarefas-container'); // [Dev Sênior] Localiza the bloco físico reservado à visualização planilhada de afazeres.
            if (containerDashboard && containerDashboard.style.display === "block") { dashboardComponent.renderizar(containerDashboard, dadosCobrancasGlobais, estruturaEtapas); } // [Dev Sênior] Atualiza os gráficos analíticos se a aba estiver ativa em tela.
            else if (containerAcordos && containerAcordos.style.display === "block") { acordosComponent.renderizar(containerAcordos, dadosCobrancasGlobais, async (id, pacoteOuFaturas) => { if (pacoteOuFaturas && typeof pacoteOuFaturas === 'object' && !Array.isArray(pacoteOuFaturas)) { await dbService.atualizarCamposCobranca(id, pacoteOuFaturas); } else { await dbService.atualizarCamposCobranca(id, { planoParcelas: pacoteOuFaturas }); } }); } // [Dev Sênior] Atualiza the controladoria financeira se as faturas estiverem expostas.
            else if (containerTarefas && containerTarefas.style.display === "block") { const res = tarefasVisao.organizarFilaTrabalho(dadosCobrancasGlobais, usuarioAtual); tarefasComponent.renderizar(containerTarefas, res.filaCompleta, abrirCentralGestao360); } // [Dev Sênior] Redesenha a agenda refinando os prazos reativamente.
            else { if (visaoAtualAtiva === 'kanban') reconstruirInterfaceKanban(); else reconstruirInterfaceTabela(); } // [Dev Sênior] Redesenha as calhas ou lines comerciais sincronizadas com as novas colunas.
        });

        dbService.escutarCobrancas((listaDeCobrancas) => { // [Dev Sênior] Liga o grampo eletrônico reativo na tabela inteira de devedores do Firebase.
            dadosCobrancasGlobais = listaDeCobrancas; // [Dev Sênior] Deságua as fichas vindas do Firestore na gaveta global de memória ram.
            window.dadosCobrancasGlobaisRaiz = listaDeCobrancas; // [Dev Sênior] Alimenta a gaveta pública de suporte para compartilhamento de cliques secundários.
            if (estruturaEtapas.length > 0) { // [Dev Sênior] Se as raias cinzas do funil já estiverem inicializadas e mapeadas no sistema.
                const containerDashboard = document.getElementById('app-dashboard-container'); // [Dev Sênior] Localiza the bloco físico dos gráficos de performance.
                const containerAcordos = document.getElementById('acordos-container'); // [Dev Sênior] Localiza the bloco físico das faturamentos da retaguarda de caixa.
                const containerTarefas = document.getElementById('app-tarefas-container'); // [Dev Sênior] Localiza the bloco físico da grade unificada de pendências.
                if (containerDashboard && containerDashboard.style.display === "block") { dashboardComponent.renderizar(containerDashboard, dadosCobrancasGlobais, estruturaEtapas); } // [Dev Sênior] Atualiza instantaneamente os Big Numbers and as barras analíticas de BI.
                else if (containerAcordos && (containerAcordos.style.display === "block" || document.getElementById('linhas-físicas-tabela-acordos'))) { acordosComponent.renderizar(containerAcordos, dadosCobrancasGlobais, async (id, pacoteOuFaturas) => { if (pacoteOuFaturas && typeof pacoteOuFaturas === 'object' && !Array.isArray(pacoteOuFaturas)) { await dbService.atualizarCamposCobranca(id, pacoteOuFaturas); } else { await dbService.atualizarCamposCobranca(id, { planoParcelas: pacoteOuFaturas }); } }); } // [Dev Sênior] Atualiza a controladoria de parcelas extinguindo telas em branco reativamente.
                else if (containerTarefas && containerTarefas.style.display === "block") { const res = tarefasVisao.organizarFilaTrabalho(dadosCobrancasGlobais, usuarioAtual); tarefasComponent.renderizar(containerTarefas, res.filaCompleta, abrirCentralGestao360); } // [Dev Sênior] Redesenha as linhas e prazos da agenda com dados vivos reativos.
                else { if (visaoAtualAtiva === 'kanban') reconstruirInterfaceKanban(); else reconstruirInterfaceTabela(); } // [Dev Sênior] Redesenha os cartões brancos movendo-os de raia dinamicamente de forma cega.
            } 
        });
    }; // [Dev Sênior] Fecha o bloco mestre de inicialização pós-autenticação.

    const sessaoExistente = authVisao.checarSessaoExistente(); // [Dev Sênior] Investiga silenciosamente se o cache possui um crachá de login ativo salvo.
    if (sessaoExistente) { // [Dev Sênior] Se a máquina contiver as credenciais válidas e ativas no histórico local.
        inicializarAplicacaoPosAutenticacao(sessaoExistente); // [Dev Sênior] Pula o formulário e abre direto o CRM operacional conectado com a nuvem.
    } else { // [Dev Sênior] Caso a máquina esteja desautenticada ou após encerramento manual de turnos de trabalho.
        if (areaCrmLogado) areaCrmLogado.style.display = 'none'; // [Dev Sênior] Oculta preventativemente as planilhas comerciais contra vazamento de dados.
        if (areaAuthCasulo) areaAuthCasulo.style.display = 'block'; // [Dev Sênior] Abre the portal dividido de portaria exigindo e-mail e senha do operador.
        authComponent.renderizar(areaAuthCasulo, (dadosFormularioBrutos) => { // [Dev Sênior] Desenha o formulário premium capturando as credenciais enviadas pelo usuário.
            authVisao.processarAutenticacao(dadosFormularioBrutos, (sessaoValidadaReal) => { // [Dev Sênior] Confere as credenciais enviadas contra the chaves de cofre do Firebase Authentication.
                inicializarAplicacaoPosAutenticacao(sessaoValidadaReal); // [Dev Sênior] Abre os portões digitais liberando o CRM com o crachá real aceito pela nuvem.
            }); // [Dev Sênior] Fecha o bloco de processing lógico de chaves de login.
        }); // [Dev Sênior] Fecha a chamada de renderização do componente de autenticação de portaria.
    } // [Dev Sênior] Sela o bloco da barreira inteligente de governança de acessos.

    const reconstruirInterfaceKanban = () => { crmVisaoKanban.reconstruir(boardContainer, estruturaEtapas, dadosCobrancasGlobais, '', abrirCentralGestao360, dbService); }; // [Dev Sênior] Atalho técnico que aciona o redesenho elástico das raias cinzas do Kanban.
    const reconstruirInterfaceTabela = () => { const corpoTabela = document.getElementById('linhas-tabela-kanban'); crmVisaoTabela.reconstruir(corpoTabela, dadosCobrancasGlobais, estruturaEtapas, '', abrirCentralGestao360); }; // [Dev Sênior] CORREÇÃO DE LOGÍSTICA: Higienizado o termo antigo substituindo por estruturaEtapas limpo para evitar telas em branco.

    const abrirCentralGestao360 = (cobrancaSelecionada) => { // [Dev Sênior] Abre o prontuário completo flutuante com múltiplos contatos, notas e prazos.
        let containerGestao = document.getElementById('app-card-gestao-container'); // [Dev Sênior] Procura pela div identificadora do modal na estrutura da folha.
        if (!containerGestao) { containerGestao = document.createElement('div'); containerGestao.id = 'app-card-gestao-container'; document.body.appendChild(containerGestao); } // [Dev Sênior] Fabrica e anexa the div do modal na base do site caso esteja ausente.
        cardGestaoComponent.renderizar(containerGestao, cobrancaSelecionada, estruturaEtapas, async (idModificado, dadosAtualizados) => { // [Dev Sênior] Desenha os campos editáveis e ouve as ordens de salvar ou deletar da retaguarda.
            if (dadosAtualizados === null) { await dbService.deletarCobranca(idModificado); } // [Dev Sênior] Comanda a destruição física irreversível do registro se os dados vierem nulos.
            else { await dbService.atualizarCamposCobranca(idModificado, dadosAtualizados); } // [Dev Sênior] Mescla e grava permanentemente as edições na pasta do cliente no Firestore.
        }); // [Dev Sênior] Fecha o bloco do ouvinte do modal do prontuário de gestão 360.
    }; // [Dev Sênior] Fecha a função mestre da central de comando 360 de clientes.

    const switchVisao = (visaoEscolhida) => { // [Dev Sênior] Alterna o layout comercial entre as calhas Kanban e as linhas planilhadas.
        const boardHtml = document.getElementById('board'); // [Dev Sênior] Captura the contêiner físico que abriga o tabuleiro Kanban.
        const tabelaHtml = document.getElementById('tabela-container'); const btnKanban = document.getElementById('btn-visao-kanban'); const btnTabela = document.getElementById('btn-visao-tabela'); // [Dev Sênior] Captura the div da planilha e os pequenos botões seletores de abas superiores.
        if (!boardHtml || !tabelaHtml) return; visaoAtualAtiva = visaoEscolhida; // [Dev Sênior] Cancela o processo se as divs sumirem por falha de carregamento estrutural.
        if (visaoEscolhida === 'kanban') { tabelaHtml.style.display = 'none'; boardHtml.style.display = 'flex'; if (btnKanban) btnKanban.style.backgroundColor = '#e2e8f0'; if (btnTabela) btnTabela.style.backgroundColor = 'white'; reconstruirInterfaceKanban(); } // [Dev Sênior] Oculta a tabela, ativa the calhas Kanban e destaca o seletor com fundo cinza.
        else { boardHtml.style.display = 'none'; tabelaHtml.style.display = 'block'; if (btnTabela) btnTabela.style.backgroundColor = '#e2e8f0'; if (btnKanban) btnKanban.style.backgroundColor = 'white'; reconstruirInterfaceTabela(); } // [Dev Sênior] Oculta the raias, exibe the planilha estruturada e destaca o seletor correspondente.
    }; // [Dev Sênior] Fecha o bloco do interruptor de layouts visuais de topo.
    window.switchVisao = switchVisao; // [Dev Sênior] Registra a função na janela pública global abrindo acesso para tags inline.

    window.openModal = () => { const modalInterno = document.getElementById('app-form-cadastro-modal-container') || document.getElementById('modal-cadastro-container') || document.getElementById('cobrancaForm')?.parentNode; if (modalInterno) modalInterno.style.display = 'block'; }; // [Dev Sênior] Altera o estilo de exibição tornando o formulário de cadastro visível na tela.
    window.closeModal = () => { const modalInterno = document.getElementById('app-form-cadastro-modal-container') || document.getElementById('modal-cadastro-container') || document.getElementById('cobrancaForm')?.parentNode; if (modalInterno) modalInterno.style.display = 'none'; }; // [Dev Sênior] Altera o estilo de exibição para escondido ocultando o formulário após the gravação.

    if (form) { // [Dev Sênior] Inicia a vigilância de gravação blindada contra erros de elementos nulos.
        form.addEventListener('submit', async (e) => { // [Dev Sênior] Intercepta o clique do botão de confirmação do formulário comercial.
            e.preventDefault(); // [Dev Sênior] Bloqueia a recarga cega nativa salvaguardando a estabilidade do servidor do Vite.
            const valorVencido = parseFloat(document.getElementById('valorVencido').value) || 0; const inputResponsavel = document.getElementById('acaoResponsavel').value.trim(); const selectStatus = document.getElementById('statusInicial').value; // [Dev Sênior] Extrai as strings preenchidas tratando o capital numericamente com floats precisos.
            const agora = new Date(); const dataNota = agora.toLocaleDateString('pt-BR'); const horaNota = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); const carimboAuditoria = `${dataNota} as ${horaNota}`; // [Dev Sênior] Instancia o relógio da máquina capturando o minuto exato para o carimbo de auditoria.
            
            const novaCobranca = { // [Dev Sênior] Fabrica o pacote mestre estruturado da dívida amarrando as chaves.
                responsavel: inputResponsavel || usuarioAtual.nome, // [Dev Sênior] Vincula o operador preenchido ou assina o nome de quem está trabalhando.
                codigo: document.getElementById('codigoCliente').value, // [Dev Sênior] Carrega o código numérico eletrônico preenchido.
                cliente: document.getElementById('clienteNome').value, // [Dev Sênior] Carrega a Razão Social ou nome completo da empresa inadimplente.
                dataEnvio: document.getElementById('dataEnvio').value || new Date().toISOString().split('T')[0], // [Dev Sênior] Coleta o prazo informado ou assume o dia de hoje no formato estável.
                valorVencido: valorVencido, // [Dev Sênior] Grava o capital vencido bruto principal informado.
                valorAVencer: 0, // [Dev Sênior] Zera a propriedade legada por conformidade de regras internas.
                valor: valorVencido, // [Dev Sênior] Sincroniza o capital com os totalizadores superiores de colunas do Kanban.
                status: selectStatus || 'novo', // [Dev Sênior] Encaixa o cartão na coluna selecionada ou força o nascimento em A Iniciar.
                statusInicial: selectStatus || 'novo', // [Dev Sênior] Memoriza a coluna de nascimento para auditorias e relatórios futuros.
                subStatus: '', // [Dev Sênior] Inicia the veredicto de encerramento em branco aguardando o final do fluxo.
                planoParcelas: [], // [Dev Sênior] Inicializa a esteira financeira de boletos vazia de fábrica.
                observacao: document.getElementById('observacaoText').value, // [Dev Sênior] Salva o texto descritivo curto digitado na observação.
                tarefas: [], // [Dev Sênior] Inicializa a comanda de lembretes e afazeres totalmente limpa.
                proposta: { // [Dev Sênior] Fabrica o mapa interno da calculadora de acordos comerciais de fábrica.
                    valorCobrado: valorVencido, // [Dev Sênior] Define que o saldo cobrado final inicial equivale ao total della dívida.
                    tipoModificador: 'R$', // [Dev Sênior] Escolhe a moeda de reais fixos por padrão de conformidade.
                    valorModificador: 0, // [Dev Sênior] Zera os juros ou descontos na largada.
                    formaPagamento: 'A vista', // [Dev Sênior] Força o desfecho inicial no modelo à vista.
                    tipoPagamento: 'Boleto', // [Dev Sênior] Adota o documento de boleto bancário como padrão inicial.
                    qtdParcelas: 1, // [Dev Sênior] Fixa a quantidade de boletos inicial em uma única fatura cheia.
                    parcelasSimuladas: [] // [Dev Sênior] Inicializa o cache de simulação vazio de fábrica.
                },
                historicoNotas: [ { conteudo: `Empresa criada para atendimento por ${usuarioAtual.nome}`, dataHora: carimboAuditoria } ] // [Dev Sênior] Injeta a primeira nota registrando eletronicamente o nascimento do lote.
            }; 
            
            try { // [Dev Sênior] Abre o escudo protetor contra panes de lentidão ou quedas bruscas de rede.
                await dbService.salvarCobranca(novaCobranca); // [Dev Sênior] Envia o pacote estruturado validador para gravação direta no Firestore.
                form.reset(); // [Dev Sênior] Limpa as caixas de textos do formulário após the confirmação de escrita.
                window.closeModal(); // [Dev Sênior] Oculta o pop-up de cadastro limpando a tela comercial de calhas.
            } catch (error) { // [Dev Sênior] Intercepta panes ou rejeições de regras enviadas pelo servidor do Google.
                alert('Erro ao salvar no banco profissional!'); // [Dev Sênior] Dispara o alerta notificando de que a gravação remota falhou.
            } // [Dev Sênior] Sela o bloco protetor de tratamento de erros.
        }); // [Dev Sênior] Fecha o monitor do gatilho de submits do formulário.
    } // [Dev Sênior] Fecha a barreira protetora que investiga a presença do formulário.

}); // [Dev Sênior] Fecha o monitor de carregamento da página HTML.