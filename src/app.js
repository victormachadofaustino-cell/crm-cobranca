import { dbService } from "./services/dbService"; // Liga o cabo de fibra óptica do front-end com as funções de salvar e buscar dados na nuvem do Firebase.
import { headerComponent } from "./components/header/molduraHeader"; // Conecta o módulo do cabeçalho profissional que gerencia a barra fixa superior e os menus do sistema.
import { funilConfigComponent } from "./components/funilconfig"; // Conecta o componente da engrenagem que abre o modal de criar e deletar colunas do funil.
import { cardGestaoComponent } from "./components/cardGestao/cardGestaoComponent"; // Conecta a central de comando 360 que abre o prontuário completo e histórico do devedor.
import { dashboardComponent } from "./components/dashboard"; // Conecta o motor de Business Intelligence (BI) encarregado de calcular e desenhar os gráficos macros.
import { acordosComponent } from "./components/acordos/acordosComponent"; // Conecta a esteira financeira que monitora o fluxo de caixa parcelado e liquidações de boletos.
import { crmVisaoKanban } from "./views/crmVisaoKanban"; // Conecta a visão especialista em desenhar o tabuleiro com raias cinzas e cartões brancos na tela.
import { crmVisaoTabela } from "./views/crmVisaoTabela"; // Conecta a visão especialista em transformar os mesmos dados em uma planilha de faturamento executiva.
import { authComponent } from "./components/auth/authComponent"; // Ativa o visual de portaria com tela dividida para preenchimento de login e cadastro corporativo.
import { authVisao } from "./views/authVisao"; // Ativa o validador lógico que checa os crachás digitais e gerencia os tokens de entrada no Google Cloud.
import { tarefasComponent } from "./components/tarefas/tarefasComponent"; // Conecta o construtor da agenda que projeta os Big Numbers de produtividade e a grade de prazos.
import { tarefasVisao } from "./views/tarefasVisao"; // Conecta o garimpeiro lógico que vasculha o Firebase para minerar os afazeres do operador ativo.
import { suporteComponent } from "./components/suporte/suporteComponent"; // Conecta o visual da ouvidoria interna para coleta de formulários e caixas de sugestões de melhorias.
import { suporteVisao } from "./views/suporteVisao"; // Conecta o ouvinte reativo que salva as ideias e gerencia a privacidade de administradores e operadores.

// NOTA DE ARQUITETURA: O import antigo do 'kanbanComponent' foi terminantemente removido daqui, pois o arquivo foi desmembrado com sucesso por você!

document.addEventListener("DOMContentLoaded", () => { // Trava de segurança: obriga o navegador a carregar toda a estrutura HTML da página antes de ligar os cliques e botões.

    const form = document.getElementById('cobrancaForm'); // Captura o formulário de cadastro de títulos para monitorar quando uma nova dívida der entrada no sistema.
    const headerContainer = document.getElementById('main-header'); // Localiza o espaço físico reservado na parte superior do site para injetar a barra de navegação.
    const boardContainer = document.getElementById('board'); // Localiza o contêiner do tabuleiro Kanban para podermos ocultá-lo ou exibi-lo conforme a aba do menu.
    const inputFiltroKanban = document.getElementById('input-filtro-kanban'); // Captura a caixa de texto de pesquisa superior para monitorar o filtro por digitação em tempo real.

    const areaAuthCasulo = document.getElementById('auth-container'); // Captura o bloco isolado da tela de login para controle estrito de portaria e bloqueio.
    const areaCrmLogado = document.getElementById('app-conteudo-logado'); // Captura o bloco geral do CRM que abriga os relatórios e o painel operacional.

    let estruturaEtapas = []; // Cria o array mestre que vai armazenar em memória ram o arranjo de colunas dinâmicas vindas do Firebase.
    let dadosCobrancasGlobais = []; // Cria a gaveta global de devedores para alimentar os gráficos e planilhas de forma rápida e sincronizada.
    let visaoAtualAtiva = 'kanban'; // Registra se o usuário está assistindo as colunas do Kanban ou as linhas da planilha de faturamento.

    let usuarioAtual = { nome: "Victor Faustino", iniciais: "VF" }; // Ficha de fallback inicial de segurança que será substituída pelos dados do operador real logado.

    window.dadosCobrancasGlobaisRaiz = []; // Registra a gaveta pública de dados na janela do navegador para os submódulos compartilharem informações sem quebras.

    const inicializarAplicacaoPosAutenticacao = (sessaoOperador) => { // Função mestre de portaria que libera e liga os motores do CRM após o operador ser aceito no cofre do Google.
        usuarioAtual = sessaoOperador; // Atualiza a comanda de sessão com o nome real, e-mail e ID exclusiva do funcionário autenticado.
        
        if (areaAuthCasulo) areaAuthCasulo.style.display = 'none'; // Esconde terminantemente as caixas de preenchimento de login e cadastro da tela.
        if (areaCrmLogado) areaCrmLogado.style.display = 'block'; // Remove o bloqueio visual e torna todo o painel do CRM visível no navegador.

        headerComponent.renderizar( // Injeta a barra superior fixa configurando o menu unificado e o avatar de perfil de usuário.
            headerContainer, // Entrega o contêiner físico onde o topo fixo de navegação deve ser montado.
            usuarioAtual, // Passa os metadados do funcionário logado para preencher o círculo de perfil com as iniciais corretas.
            () => { // Gatilho executado no clique da engrenagem para abrir as parametrizações de colunas customizáveis.
                let containerConfig = document.getElementById('app-config-container'); // Tenta localizar a div reservada para as configurações na página.
                if (!containerConfig) { // Se a div de configurações ainda não existir na estrutura da árvore do site.
                    containerConfig = document.createElement('div'); // Fabrica uma div de controle dinamicamente em tempo de execução.
                    containerConfig.id = 'app-config-container'; // Aplica o ID fixo de rascunho eletrônico na div criada.
                    document.body.appendChild(containerConfig); // Anexa a nova div de forma limpa no final do corpo do código da página.
                } // Encerra o crivo de criação do casulo temporário.
                funilConfigComponent.renderizar(containerConfig, estruturaEtapas, async (novasEtapas) => { // Desenha a lista de raias no modal liberando os botões de adicionar e lixeiras.
                    await dbService.salvarEstruturaFunil(novasEtapas); // Envia o novo arranjo de colunas editado para gravação permanente na nuvem do Firebase.
                }); // Encerra o gatilho reativo do painel de parametrização.
            }, // Encerra a configuração dos eventos da engrenagem.
            (moduloSelecionado) => { // Escuta os cliques do menu de abas e chaveia o layout ocultando ou exibindo as telas do sistema.
                let containerDashboard = document.getElementById('app-dashboard-container'); // Tenta localizar o espaço físico destinado aos gráficos analíticos.
                let containerTarefas = document.getElementById('app-tarefas-container'); // Tenta localizar o espaço físico destinado à agenda operativa.
                let containerSuporte = document.getElementById('app-suporte-container'); // Tenta localizar o espaço físico destinado à ouvidoria SaaS.
                const containerAcordos = document.getElementById('acordos-container'); // Captura a div protetora da esteira de parcelamentos e boletos.
                const tabelaContainer = document.getElementById('tabela-container'); // Captura a div protetora da planilha executiva de faturamentos.
                const alternadorContainer = document.getElementById('alternador-visao-container'); // Captura as chaves superiores de troca de visualização.
                
                const botaoNovaCobrancaFisico = document.getElementById('btn-nova-cobranca') || document.querySelector('.btn-add-cobranca') || form?.querySelector('button[type="submit"]')?.parentNode; // Localiza o botão físico de nova cobrança para aplicar travas.
                const caixaFerramentasFiltroSuperior = document.getElementById('barra-ferramentas-filtros-global') || alternadorContainer?.parentNode; // Localiza a barra de ferramentas de busca superior do CRM.

                boardContainer.style.display = "none"; // Executa rotina preventiva ocultando o painel de colunas Kanban.
                if (tabelaContainer) tabelaContainer.style.display = "none"; // Oculta a planilha executiva do CRM.
                if (alternadorContainer) alternadorContainer.style.display = "none"; // Oculta as chaves de comutação de visualização.
                if (containerAcordos) containerAcordos.style.display = "none"; // Oculta o portal de controladoria de parcelas.
                if (containerDashboard) containerDashboard.style.display = "none"; // Oculta a tela de gráficos e indicadores macros de BI.
                if (containerTarefas) containerTarefas.style.display = "none"; // Oculta a mesa de trabalho da agenda unificada.
                if (containerSuporte) containerSuporte.style.display = "none"; // Oculta o contêiner de chamados da caixa de ouvidoria.

                if (moduloSelecionado === "dashboard") { // Se o funcionário acionar a aba de estatísticas e inteligência de mercado.
                    if (botaoNovaCobrancaFisico && botaoNovaCobrancaFisico.style) botaoNovaCobrancaFisico.style.display = "none"; // Trava de governança: esconde o botão de cadastro comercial.
                    if (caixaFerramentasFiltroSuperior && caixaFerramentasFiltroSuperior.style) { // Verifica a existência da caixa de ferramentas.
                        caixaFerramentasFiltroSuperior.style.display = "flex"; // Configura o alinhamento como bloco flexível.
                        caixaFerramentasFiltroSuperior.style.justifyContent = "flex-end"; // Move os filtros de período para o canto superior direito da tela.
                    }
                    if (!containerDashboard) { // Se o bloco de gráficos analíticos ainda não tiver sido anexado na página.
                        containerDashboard = document.createElement('div'); containerDashboard.id = 'app-dashboard-container'; // Cria a div identificadora em tempo de execução.
                        boardContainer.parentNode.insertBefore(containerDashboard, boardContainer); // Insere o contêiner de maneira organizada na árvore estrutural.
                    }
                    containerDashboard.style.display = "block"; // Torna o painel de BI ativo e visível na área de trabalho.
                    dashboardComponent.renderizar(containerDashboard, dadosCobrancasGlobais, estruturaEtapas); // Invoca o processamento das barras empilhadas e pílulas de BI.
                } 
                else if (moduloSelecionado === "acordos") { // Se a diretoria selecionar o portal de faturamentos parcelados.
                    if (botaoNovaCobrancaFisico && botaoNovaCobrancaFisico.style) botaoNovaCobrancaFisico.style.display = "none"; // Oculta o botão de criar novos devedores comerciais.
                    if (caixaFerramentasFiltroSuperior && caixaFerramentasFiltroSuperior.style) { // Aplica o ajuste de layout na barra de ferramentas.
                        caixaFerramentasFiltroSuperior.style.display = "flex"; caixaFerramentasFiltroSuperior.style.justifyContent = "flex-end"; // Joga os seletores da gaveta curta para a direita.
                    }
                    if (containerAcordos) { // Se a div protetora da esteira de acordos estiver disponível.
                        containerAcordos.style.display = "block"; // Abre a interface financeira na tela.
                        acordosComponent.renderizar(containerAcordos, dadosCobrancasGlobais, async (idCard, novasParcelasOuObjeto) => { if (novasParcelasOuObjeto && typeof novasParcelasOuObjeto === 'object' && !Array.isArray(novasParcelasOuObjeto)) { await dbService.atualizarCamposCobranca(idCard, novasParcelasOuObjeto); } else { await dbService.atualizarCamposCobranca(idCard, { planoParcelas: novasParcelasOuObjeto }); } }); // Renderiza a controladoria disparando as escritas na nuvem do Firebase.
                    }
                } 
                else if (moduloSelecionado === "tarefas") { // NOVO CENÁRIO DE NAVEGAÇÃO: Caso o operador clique no botão de agenda unificada.
                    if (botaoNovaCobrancaFisico && botaoNovaCobrancaFisico.style) botaoNovaCobrancaFisico.style.display = "none"; // Oculta o botão de criar título de dívida.
                    if (caixaFerramentasFiltroSuperior && caixaFerramentasFiltroSuperior.style) { // Alinha a barra de ferramentas superiores.
                        caixaFerramentasFiltroSuperior.style.display = "flex"; caixaFerramentasFiltroSuperior.style.justifyContent = "flex-end"; // Mantém o recuo horizontal na direita.
                    }
                    if (!containerTarefas) { // Se o casulo que abriga a tabela de tarefas ainda não existir na página.
                        containerTarefas = document.createElement('div'); containerTarefas.id = 'app-tarefas-container'; // Fabrica a div com ID fixo de sistema.
                        boardContainer.parentNode.insertBefore(containerTarefas, boardContainer); // Anexa o bloco antes do contêiner do Kanban de forma rápida.
                    }
                    containerTarefas.style.display = "block"; // Ativa a exibição da mesa de produtividade e agendamentos.
                    const resumeFilaProcessada = tarefasVisao.organizarFilaTrabalho(dadosCobrancasGlobais, usuarioAtual); // Garimpa cronologicamente os afazeres daquele operador logado.
                    tarefasComponent.renderizar(containerTarefas, resumeFilaProcessada.filaCompleta, abrirCentralGestao360); // Plota os Big Numbers de tarefas enviando a sub-chave correta da fila.
                }
                else if (moduloSelecionado === "suporte") { // NOVO CENÁRIO DE NAVEGAÇÃO: Se o time acionar a ouvidoria interna e caixa de sugestões.
                    if (botaoNovaCobrancaFisico && botaoNovaCobrancaFisico.style) botaoNovaCobrancaFisico.style.display = "none"; // Bloqueia e oculta o botão de nova cobrança.
                    if (caixaFerramentasFiltroSuperior && caixaFerramentasFiltroSuperior.style) { // Alinha os seletores superiores.
                        caixaFerramentasFiltroSuperior.style.display = "flex"; caixaFerramentasFiltroSuperior.style.justifyContent = "flex-end"; // Fixa o alinhamento na direita.
                    }
                    if (!containerSuporte) { // Se o casulo físico do suporte técnico estiver ausente na árvore.
                        containerSuporte = document.createElement('div'); containerSuporte.id = 'app-suporte-container'; // Fabrica o elemento de bloco dinamicamente.
                        boardContainer.parentNode.insertBefore(containerSuporte, boardContainer); // Injeta o bloco de ouvidoria de forma simétrica no layout.
                    }
                    containerSuporte.style.display = "block"; // Torna o painel de suporte técnico visível na interface.
                    suporteVisao.escutarListaMelhorias(usuarioAtual, (listaRefinadaIdeas) => { // Ativa o monitoramento em tempo real de chamados gravados na nuvem.
                        suporteComponent.renderizar(containerSuporte, listaRefinadaIdeas, async (pacoteNovoForm) => { // Desenha os cards coloridos e o formulário de captura.
                            return await suporteVisao.enviarNovaMelhoria(pacoteNovoForm, usuarioAtual); // Salva o chamado diretamente na coleção correspondente do Firebase.
                        });
                    });
                }
                else if (moduloSelecionado === "crm") { // Se o operador clicar de volta na aba mestre do CRM Comercial.
                    if (alternadorContainer) alternadorContainer.style.display = "flex"; // Reativa a exibição dos interruptores de Kanban e Planilha no topo.
                    if (botaoNovaCobrancaFisico && botaoNovaCobrancaFisico.style) botaoNovaCobrancaFisico.style.display = "block"; // Libera o botão de cadastro comercial.
                    if (caixaFerramentasFiltroSuperior && caixaFerramentasFiltroSuperior.style) { // Restaura a simetria da barra de ferramentas.
                        caixaFerramentasFiltroSuperior.style.display = "flex"; caixaFerramentasFiltroSuperior.style.justifyContent = "space-between"; // Estica os componentes nas extremidades.
                    }

                    if (visaoAtualAtiva === 'kanban') { // Se a chave interna apontar para visualização em formato de calhas.
                        boardContainer.style.display = "flex"; reconstruirInterfaceKanban(); // Ativa o contêiner flexível e redesenha as colunas cinzas com cartões.
                    } else { // Se o operador preferir trabalhar no modelo de planilha executiva.
                        if (tabelaContainer) tabelaContainer.style.display = "block"; reconstruirInterfaceTabela(); // Ativa o bloco da tabela e plota as linhas com efeitos de hover.
                    }
                }
            }, // Encerra a escuta de cliques das abas principais do menu.
            () => { // GATILHO REATIVO DA GAVETA LATERAL: Função acionada no exato instante em que o cobrador clica em "Aplicar Filtros" dentro do Drawer da direita.
                const containerDashboard = document.getElementById('app-dashboard-container'); // Localiza o painel de BI.
                const containerAcordos = document.getElementById('acordos-container'); // Localiza o painel de acordos.
                const containerTarefas = document.getElementById('app-tarefas-container'); // Localiza a agenda.

                if (containerDashboard && containerDashboard.style.display === "block") { // Se o gestor estiver na tela de BI.
                    dashboardComponent.renderizar(containerDashboard, dadosCobrancasGlobais, estruturaEtapas); // Redesenha os gráficos aplicando os filtros de data.
                } else if (containerAcordos && containerAcordos.style.display === "block") { // Se faturamento estiver na esteira de parcelas.
                    acordosComponent.renderizar(containerAcordos, dadosCobrancasGlobais, async (id, pac) => { await dbService.atualizarCamposCobranca(id, pac); }); // Redesenha as propostas com os novos filtros de boletos.
                } else if (containerTarefas && containerTarefas.style.display === "block") { // REATIVIDADE DA AGENDA: Recalcula os lembretes caso a gaveta lateral seja operada ali dentro.
                    const resumoFilaFiltro = tarefasVisao.organizarFilaTrabalho(dadosCobrancasGlobais, usuarioAtual); // Garimpa as pendências novamente.
                    tarefasComponent.renderizar(containerTarefas, resumoFilaFiltro.filaCompleta, abrirCentralGestao360); // Redesenha a agenda enviando a sub-chave segura da fila.
                } else { // Caso o operador esteja na calha principal do CRM Comercial.
                    if (visaoAtualAtiva === 'kanban') reconstruirInterfaceKanban(); else reconstruirInterfaceTabela(); // Redesenha os cards ou as linhas re-filtradas na mesma hora.
                }
            } // Encerra a escuta de ações de aplicação da gaveta curta lateral.
        ); // Encerra a ativação oficial do cabeçalho da DOCULOC.

        dbService.escutarEstruturaFunil(async (etapasDoBanco) => { // Liga o vigia permanente nas parametrizações de colunas cadastradas no Firestore.
            if (!etapasDoBanco) { await dbService.inicializarFunilSeVazio(); return; } // Executa a inicialização de fábrica criando as 5 colunas caso o banco inicie zerado.
            estruturaEtapas = etapasDoBanco; // Sincroniza a comanda local com o arranjo e ordem de fases vindo do servidor.
            const containerDashboard = document.getElementById('app-dashboard-container'); // Localiza o painel de BI.
            const containerAcordos = document.getElementById('acordos-container'); // Localiza o painel de acordos.
            const containerTarefas = document.getElementById('app-tarefas-container'); // Localiza a agenda.
            if (containerDashboard && containerDashboard.style.display === "block") { dashboardComponent.renderizar(containerDashboard, dadosCobrancasGlobais, estruturaEtapas); } // Redesenha o BI.
            else if (containerAcordos && containerAcordos.style.display === "block") { acordosComponent.renderizar(containerAcordos, dadosCobrancasGlobais, async (id, pacoteOuFaturas) => { if (pacoteOuFaturas && typeof pacoteOuFaturas === 'object' && !Array.isArray(pacoteOuFaturas)) { await dbService.atualizarCamposCobranca(id, pacoteOuFaturas); } else { await dbService.atualizarCamposCobranca(id, { planoParcelas: pacoteOuFaturas }); } }); } // Redesenha os acordos.
            else if (containerTarefas && containerTarefas.style.display === "block") { const res = tarefasVisao.organizarFilaTrabalho(dadosCobrancasGlobais, usuarioAtual); tarefasComponent.renderizar(containerTarefas, res.filaCompleta, abrirCentralGestao360); } // Redesenha as tarefas.
            else { if (visaoAtualAtiva === 'kanban') reconstruirInterfaceKanban(); else reconstruirInterfaceTabela(); } // Atualiza e redesenha a tela comercial com as raias cinzas sincronizadas.
        });

        dbService.escutarCobrancas((listaDeCobrancas) => { // Grampeia a tabela de devedores na nuvem para monitorar alterações e disparar reatividade automática.
            dadosCobrancasGlobais = listaDeCobrancas; // Deságua as fichas vindas do servidor do Google na gaveta global de memória.
            window.dadosCobrancasGlobaisRaiz = listaDeCobrancas; // Mantém abastecida a gaveta pública de suporte para os cliques de intervenções e chamados.
            if (estruturaEtapas.length > 0) { // Se as colunas cinzas já estiverem carregadas na memória ram do computador.
                const containerDashboard = document.getElementById('app-dashboard-container'); // Localiza o painel de BI.
                const containerAcordos = document.getElementById('acordos-container'); // Localiza o painel de acordos.
                const containerTarefas = document.getElementById('app-tarefas-container'); // Localiza a agenda.
                if (containerDashboard && containerDashboard.style.display === "block") { dashboardComponent.renderizar(containerDashboard, dadosCobrancasGlobais, estruturaEtapas); } // Redesenha o BI.
                else if (containerAcordos && containerAcordos.style.display === "block") { acordosComponent.renderizar(containerAcordos, dadosCobrancasGlobais, async (id, pacoteOuFaturas) => { if (pacoteOuFaturas && typeof pacoteOuFaturas === 'object' && !Array.isArray(pacoteOuFaturas)) { await dbService.atualizarCamposCobranca(id, pacoteOuFaturas); } else { await dbService.atualizarCamposCobranca(id, { planoParcelas: pacoteOuFaturas }); } }); } // Redesenha os acordos.
                else if (containerTarefas && containerTarefas.style.display === "block") { const res = tarefasVisao.organizarFilaTrabalho(dadosCobrancasGlobais, usuarioAtual); tarefasComponent.renderizar(containerTarefas, res.filaCompleta, abrirCentralGestao360); } // Redesenha as tarefas.
                else { if (visaoAtualAtiva === 'kanban') reconstruirInterfaceKanban(); else reconstruirInterfaceTabela(); } // Redesenha de forma cega os cartões atualizados movendo-os nas calhas correspondentes.
            } 
        });
    }; // Encerra a sub-rotina de inicialização de fluxo seguro pós-login.

    const sessaoExistente = authVisao.checarSessaoExistente(); // Checa silenciosamente se a máquina local já possui um crachá de login ativo salvo no histórico do LocalStorage.
    if (sessaoExistente) { // Se a máquina possuir o crachá de sessão válido e salvo no cache do navegador.
        inicializarAplicacaoPosAutenticacao(sessaoExistente); // Pula o formulário de login abrindo direto o painel operacional conectado com a nuvem.
    } else { // Caso a máquina esteja desautenticada ou após encerramento manual de turnos.
        if (areaCrmLogado) areaCrmLogado.style.display = 'none'; // Trava de segurança: esconde as planilhas comerciais para evitar vazamento de dados confidenciais.
        if (areaAuthCasulo) areaAuthCasulo.style.display = 'block'; // Exibe o portal split screen de portaria exigindo as chaves do operador.
        authComponent.renderizar(areaAuthCasulo, (dadosFormularioBrutos) => { // Plota o formulário elegante capturando as credenciais enviadas.
            authVisao.processarAutenticacao(dadosFormularioBrutos, (sessaoValidadaReal) => { // Envia e confere e-mail e senha diretamente contra o cofre do Firebase Authentication.
                inicializarAplicacaoPosAutenticacao(sessaoValidadaReal); // Abre os portões do sistema liberando o CRM com as chaves reais aceitas.
            }); // Encerra a validação lógica de acessos.
        }); // Encerra o desenho inicial do portal unificado de acessos.
    } // Encerra a barreira inteligente de governança corporativa.

    const reconstruirInterfaceKanban = () => { crmVisaoKanban.reconstruir(boardContainer, estruturaEtapas, dadosCobrancasGlobais, inputFiltroKanban, abrirCentralGestao360, dbService); }; // Atalho técnico que chama a reconstrução reativa de raias do Kanban comercial.
    const reconstruirInterfaceTabela = () => { const corpoTabela = document.getElementById('linhas-tabela-kanban'); crmVisaoTabela.reconstruir(corpoTabela, dadosCobrancasGlobais, estruturaEtapas, inputFiltroKanban, abrirCentralGestao360); }; // Injeta as colunas oficiais limpas na grade.

    const abrirCentralGestao360 = (cobrancaSelecionada) => { // Abre o modal flutuante contendo todo o histórico, múltiplas linhas de contatos e lembretes do cliente selecionado.
        let containerGestao = document.getElementById('app-card-gestao-container'); // Tenta localizar a div identificadora do modal na estrutura.
        if (!containerGestao) { containerGestao = document.createElement('div'); containerGestao.id = 'app-card-gestao-container'; document.body.appendChild(containerGestao); } // Cria a div do modal na base do documento se ela for ausente.
        cardGestaoComponent.renderizar(containerGestao, cobrancaSelecionada, estruturaEtapas, async (idModificado, dadosAtualizados) => { // Desenha os campos editáveis na tela e ouve as ações de salvar ou deletar da retaguarda.
            if (dadosAtualizados === null) { await dbService.deletarCobranca(idModificado); } // Se os dados de retorno vierem vazios, comanda a destruição física do devedor na nuvem.
            else { await dbService.atualizarCamposCobranca(idModificado, dadosAtualizados); } // Caso contrário, mescla e grava as alterações na pasta do cliente no Firestore.
        }); // Encerra o ouvinte do prontuário 360 de gestão.
    }; // Encerra a função da Central de Gestão.

    const switchVisao = (visaoEscolhida) => { // Comuta o layout visual da mesa entre o painel de colunas e a planilha de faturamentos.
        const boardHtml = document.getElementById('board'); // Captura o Kanban.
        const tabelaHtml = document.getElementById('tabela-container'); const btnKanban = document.getElementById('btn-visao-kanban'); const btnTabela = document.getElementById('btn-visao-tabela'); // Captura os seletores de botões.
        if (!boardHtml || !tabelaHtml) return; visaoAtualAtiva = visaoEscolhida; // Trava de segurança: impede o processamento se os blocos sumirem da página por falha.
        if (visaoEscolhida === 'kanban') { tabelaHtml.style.display = 'none'; boardHtml.style.display = 'flex'; if (btnKanban) btnKanban.style.backgroundColor = '#e2e8f0'; if (btnTabela) btnTabela.style.backgroundColor = 'white'; reconstruirInterfaceKanban(); } // Se a escolha for Kanban, apaga a planilha, ativa o painel flexível e colore o seletor correspondente de cinza.
        else { boardHtml.style.display = 'none'; tabelaHtml.style.display = 'block'; if (btnTabela) btnTabela.style.backgroundColor = '#e2e8f0'; if (btnKanban) btnKanban.style.backgroundColor = 'white'; reconstruirInterfaceTabela(); } // Caso contrário, esconde as raias, exibe a tabela estruturada, inverte o destaque dos seletores e plota as linhas.
    }; // Encerra o interruptor de visualizações de topo.
    window.switchVisao = switchVisao; // Registra a função na janela pública global do navegador para destravar os disparos das tags inline do HTML.

    if (inputFiltroKanban) { inputFiltroKanban.addEventListener('input', () => { if (visaoAtualAtiva === 'kanban') reconstruirInterfaceKanban(); else reconstruirInterfaceTabela(); }); } // MONITOR DA CAIXA DE BUSCA: Filtra os cartões ou linhas por digitação em tempo real na aba comercial ativa.

    window.openModal = () => { const modalInterno = document.getElementById('app-form-cadastro-modal-container') || document.getElementById('modal-cadastro-container') || document.getElementById('cobrancaForm')?.parentNode; if (modalInterno) modalInterno.style.display = 'block'; }; // Localiza o bloco oculto de inclusão de títulos e altera o estilo para bloco tornando o modal visível na tela.
    window.closeModal = () => { const modalInterno = document.getElementById('app-form-cadastro-modal-container') || document.getElementById('modal-cadastro-container') || document.getElementById('cobrancaForm')?.parentNode; if (modalInterno) modalInterno.style.display = 'none'; }; // Altera o estilo do bloco de inclusão para escondido ocultando o modal após o término do processo.

    if (form) { // MONITOR DE ENVIO (CADASTRO DE COBRANÇAS): Totalmente protegido contra erros de elementos nulos no console do operador.
        form.addEventListener('submit', async (e) => { // Vigia o clique de envio do botão quando uma nova dívida for protocolada no sistema.
            e.preventDefault(); // Bloqueia a recarga cega nativa da página para não desmanchar os estados ativos do servidor local do Vite.
            const valorVencido = parseFloat(document.getElementById('valorVencido').value) || 0; const inputResponsavel = document.getElementById('acaoResponsavel').value.trim(); const selectStatus = document.getElementById('statusInicial').value; // Extrai e trata numericamente os valores preenchidos nas caixas de texto.
            const agora = new Date(); const dataNota = agora.toLocaleDateString('pt-BR'); const horaNota = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); const carimboAuditoria = `${dataNota} as ${horaNota}`; // Captura o relógio interno do computador para carimbar o histórico de auditoria inicial do devedor.
            
            const novaCobranca = { // Estrutura o pacote de dados do novo devedor amarrando as notas de histórico com crases legítimas para interpolação real na nuvem.
                responsavel: inputResponsavel || usuarioAtual.nome, // Vincula o nome do operador responsável informado ou assina o funcionário logado como dono da carteira.
                codigo: document.getElementById('codigoCliente').value, // Carrega o código identificador da conta informado.
                cliente: document.getElementById('clienteNome').value, // Carrega a Razão Social ou nome completo informado.
                dataEnvio: document.getElementById('dataEnvio').value || new Date().toISOString().split('T')[0], // Carrega o vencimento estipulado do lote ou assina a data de hoje como padrão.
                valorVencido: valorVencido, // Seta o saldo devedor principal em atraso digitado.
                valorAVencer: 0, // Inicia a propriedade legada de valores a vencer zerada por conformidade de regras.
                valor: valorVencido, // Sincroniza o montante financeiro inicial com os totalizadores superiores do Kanban.
                status: selectStatus || 'novo', // Encaixa o cliente na coluna escolhida ou força o nascimento na coluna padrão 'novo' (A Iniciar).
                statusInicial: selectStatus || 'novo', // Memoriza a coluna de nascimento para relatórios de auditoria futuros.
                subStatus: '', // Inicia o veredicto de encerramento em branco aguardando a finalização da esteira.
                planoParcelas: [], // Inicializa a esteira de parcelas vazia aguardando as simulações da calculadora.
                observacao: document.getElementById('observacaoText').value, // Salva o resumo curto descritivo digitado no ato de inclusão da conta.
                tarefas: [], // Inicializa a comanda de prazos e afazeres futura do cliente totalmente limpa.
                historicoNotas: [ { conteudo: `Empresa criada para atendimento por ${usuarioAtual.nome}`, dataHora: carimboAuditoria } ] // Injeta a primeira nota automática registrando a criação do lote no CRM.
            }; 
            
            try { // Abre o contêiner de segurança para escrita assíncrona na internet.
                await dbService.salvarCobranca(novaCobranca); // Aciona o despachante de banco enviando o pacote para gravação em tempo real na coleção "cobrancas" do Firestore.
                form.reset(); // Limpa completamente todas as caixas de digitação do formulário após a gravação de sucesso.
                window.closeModal(); // Invoca o fechamento eletrônico ocultando as caixas de cadastro da tela.
            } catch (error) { // Intercepta panes de queda de internet ou falta de privilégios de gravação.
                alert('Erro ao salvar no banco profissional!'); // Dispara um balão de aviso notificando a interface de que a escrita na nuvem falhou.
            } // Encerra o tratamento de erros operacionais.
        }); // Encerra o ouvinte de envio eletrônico.
    } // Encerra a trava de segurança que valida a existência física do formulário comercial.

}); // Encerra a escuta do carregamento do documento DOM.