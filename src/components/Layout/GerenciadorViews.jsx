// [Dev Sênior] Centraliza a lógica de alternância e visibilidade das telas/módulos do sistema.
import { dashboardComponent } from "../dashboard";
import { acordosComponent } from "../acordos/acordosComponent";
import { tarefasComponent } from "../tarefas/tarefasComponent";
import { tarefasVisao } from "../../views/tarefasVisao";
import { suporteComponent } from "../suporte/suporteComponent";
import { suporteVisao } from "../../views/suporteVisao";
import { crmVisaoKanban } from "../../views/crmVisaoKanban";
import { crmVisaoTabela } from "../../views/crmVisaoTabela";

export const GerenciadorViews = {
    // [Dev Sênior] Executa o chaveamento de blocos e monta o módulo selecionado limpando as telas antigas.
    chavearModulo: (
        moduloSelecionado, 
        contextoGlobais
    ) => {
        const {
            boardContainer,
            dadosCobrancasGlobais,
            estruturaEtapas,
            usuarioAtual,
            abrirCentralGestao360,
            dbService,
            visaoAtualAtiva,
            reconstruirInterfaceKanban,
            reconstruirInterfaceTabela
        } = contextoGlobais;

        // [Dev Sênior] Captura os containers de renderização física do index.html
        let containerDashboard = document.getElementById('app-dashboard-container');
        let containerTarefas = document.getElementById('app-tarefas-container');
        let containerSuporte = document.getElementById('app-suporte-container');
        const containerAcordos = document.getElementById('acordos-container');
        const tabelaContainer = document.getElementById('tabela-container');
        const alternadorContainer = document.getElementById('alternador-visao-container');
        
        const botaoNovaCobrancaFisico = document.getElementById('btn-nova-cobranca') || 
                                        document.querySelector('.btn-add-cobranca') || 
                                        document.getElementById('cobrancaForm')?.querySelector('button[type="submit"]')?.parentNode;
        const caixaFerramentasFiltroSuperior = document.getElementById('barra-ferramentas-filtros-global') || 
                                               alternadorContainer?.parentNode;

        // [Dev Sênior] Reseta a tela: esconde todos os blocos antes de exibir o alvo
        if (boardContainer) boardContainer.style.display = "none";
        if (tabelaContainer) tabelaContainer.style.display = "none";
        if (alternadorContainer) alternadorContainer.style.display = "none";
        if (containerAcordos) containerAcordos.style.display = "none";
        if (containerDashboard) containerDashboard.style.display = "none";
        if (containerTarefas) containerTarefas.style.display = "none";
        if (containerSuporte) containerSuporte.style.display = "none";

        // === 1. MÓDULO DASHBOARD (BI) ===
        if (moduloSelecionado === "dashboard") {
            if (botaoNovaCobrancaFisico && botaoNovaCobrancaFisico.style) botaoNovaCobrancaFisico.style.display = "none";
            if (caixaFerramentasFiltroSuperior && caixaFerramentasFiltroSuperior.style) {
                caixaFerramentasFiltroSuperior.style.display = "flex";
                caixaFerramentasFiltroSuperior.style.justifyContent = "flex-end";
            }
            if (!containerDashboard && boardContainer) {
                containerDashboard = document.createElement('div'); 
                containerDashboard.id = 'app-dashboard-container';
                boardContainer.parentNode.insertBefore(containerDashboard, boardContainer);
            }
            if (containerDashboard) {
                containerDashboard.style.display = "block";
                dashboardComponent.renderizar(containerDashboard, dadosCobrancasGlobais, estruturaEtapas);
            }
        } 
        
        // === 2. MÓDULO ACORDOS (CONTROLADORIA FIN.) ===
        else if (moduloSelecionado === "acordos") {
            if (botaoNovaCobrancaFisico && botaoNovaCobrancaFisico.style) botaoNovaCobrancaFisico.style.display = "none";
            if (caixaFerramentasFiltroSuperior && caixaFerramentasFiltroSuperior.style) {
                caixaFerramentasFiltroSuperior.style.display = "flex"; 
                caixaFerramentasFiltroSuperior.style.justifyContent = "flex-end";
            }
            if (containerAcordos) {
                containerAcordos.style.display = "block";
                acordosComponent.renderizar(containerAcordos, dadosCobrancasGlobais, async (idCard, novasParcelasOuObjeto) => { 
                    if (novasParcelasOuObjeto && typeof novasParcelasOuObjeto === 'object' && !Array.isArray(novasParcelasOuObjeto)) { 
                        await dbService.atualizarCamposCobranca(idCard, novasParcelasOuObjeto); 
                    } else { 
                        await dbService.atualizarCamposCobranca(idCard, { planoParcelas: novasParcelasOuObjeto }); 
                    } 
                });
            }
        } 
        
        // === 3. MÓDULO TAREFAS (AGENDA) ===
        else if (moduloSelecionado === "tarefas") {
            if (botaoNovaCobrancaFisico && botaoNovaCobrancaFisico.style) botaoNovaCobrancaFisico.style.display = "none";
            if (caixaFerramentasFiltroSuperior && caixaFerramentasFiltroSuperior.style) {
                caixaFerramentasFiltroSuperior.style.display = "flex"; 
                caixaFerramentasFiltroSuperior.style.justifyContent = "flex-end";
            }
            if (!containerTarefas && boardContainer) {
                containerTarefas = document.createElement('div'); 
                containerTarefas.id = 'app-tarefas-container';
                boardContainer.parentNode.insertBefore(containerTarefas, boardContainer);
            }
            if (containerTarefas) {
                containerTarefas.style.display = "block";
                const resumeFilaProcessada = tarefasVisao.organizarFilaTrabalho(dadosCobrancasGlobais, usuarioAtual);
                tarefasComponent.renderizar(containerTarefas, resumeFilaProcessada.filaCompleta, abrirCentralGestao360);
            }
        }
        
        // === 4. MÓDULO SUPORTE (OUVIDORIA SAAS) ===
        else if (moduloSelecionado === "suporte") {
            if (botaoNovaCobrancaFisico && botaoNovaCobrancaFisico.style) botaoNovaCobrancaFisico.style.display = "none";
            if (caixaFerramentasFiltroSuperior && caixaFerramentasFiltroSuperior.style) {
                caixaFerramentasFiltroSuperior.style.display = "flex"; 
                caixaFerramentasFiltroSuperior.style.justifyContent = "flex-end";
            }
            if (!containerSuporte && boardContainer) {
                containerSuporte = document.createElement('div'); 
                containerSuporte.id = 'app-suporte-container';
                boardContainer.parentNode.insertBefore(containerSuporte, boardContainer);
            }
            if (containerSuporte) {
                containerSuporte.style.display = "block";
                suporteVisao.escutarListaMelhorias(usuarioAtual, (listaRefinadaIdeas) => {
                    suporteComponent.renderizar(containerSuporte, listaRefinadaIdeas, async (pacoteNovoForm) => {
                        return await suporteVisao.enviarNovaMelhoria(pacoteNovoForm, usuarioAtual);
                    });
                });
            }
        }
        
        // === 5. MÓDULO NOVO CADASTRO (DISPARADOR GAVETA/MODAL) ===
        else if (moduloSelecionado === "cadastros") {
            window.moduloAtivoSistema = 'crm';
            if (alternadorContainer) alternadorContainer.style.display = "flex";
            if (botaoNovaCobrancaFisico && botaoNovaCobrancaFisico.style) botaoNovaCobrancaFisico.style.display = "block";
            if (caixaFerramentasFiltroSuperior && caixaFerramentasFiltroSuperior.style) {
                caixaFerramentasFiltroSuperior.style.display = "flex"; 
                caixaFerramentasFiltroSuperior.style.justifyContent = "space-between";
            }
            
            if (visaoAtualAtiva === 'kanban') {
                if (boardContainer) boardContainer.style.display = "flex"; 
                reconstruirInterfaceKanban();
            } else {
                if (tabelaContainer) tabelaContainer.style.display = "block"; 
                reconstruirInterfaceTabela();
            }
            if (typeof window.openModal === 'function') window.openModal();
        }
        
        // === 6. MÓDULO CRM PADRÃO (KANBAN / PLANILHA) ===
        else if (moduloSelecionado === "crm") {
            if (alternadorContainer) alternadorContainer.style.display = "flex";
            if (botaoNovaCobrancaFisico && botaoNovaCobrancaFisico.style) botaoNovaCobrancaFisico.style.display = "block";
            if (caixaFerramentasFiltroSuperior && caixaFerramentasFiltroSuperior.style) {
                caixaFerramentasFiltroSuperior.style.display = "flex"; 
                caixaFerramentasFiltroSuperior.style.justifyContent = "space-between";
            }

            if (visaoAtualAtiva === 'kanban') {
                if (boardContainer) boardContainer.style.display = "flex"; 
                reconstruirInterfaceKanban();
            } else {
                if (tabelaContainer) tabelaContainer.style.display = "block"; 
                reconstruirInterfaceTabela();
            }
        }
    }
};