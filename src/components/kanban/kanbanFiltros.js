export const kanbanFiltros = { // [Dev Sênior] Define e exporta o submódulo focado de forma estrita em isolar as peneiras e triagens de dados da gaveta lateral.
  validar(cobranca, status) { // [Dev Sênior] Método mestre que julga se a cobrança atende aos critérios ativos na sessão retornando verdadeiro ou falso.
    
    const filtros = window.filtrosGavetaCrmAtivos; // [Dev Sênior] Resgata o objeto global de filtros gerenciado pelo Drawer do cabeçalho.
    if (!filtros) return true; // [Dev Sênior] Trava de segurança: se a gaveta nunca foi aberta ou configurada, concede passe livre imediato para o cartão aparecer.

    // ==========================================
    // PADRONIZAÇÃO DE VARIÁVEIS INTERNAS PARA FILTRAGEM RIGOROSA
    // ==========================================
    const responsavelCard = (cobranca.responsavel || 'Não informado').toLowerCase().trim(); // [Dev Sênior] Isola o nome do operador dono do card em caixa baixa, eliminando espaços extras.
    const valorCardNum = parseFloat(cobranca.valorVencido) || 0; // [Dev Sênior] Converte o saldo devedor principal para float monetário puro para cálculos matemáticos.
    const listaTarefas = Array.isArray(cobranca.tarefas) ? cobranca.tarefas : []; // [Dev Sênior] Valida se a lista de tarefas é um array legítimo ou inicia uma lista vazia de segurança.

    // ==========================================
    // 1. PENEIRA DE OPERADOR (FILTRO "MEU DIA" / RESPONSÁVEL)
    // ==========================================
    if (filtros.responsavel && filtros.responsavel.trim() !== "") { // [Dev Sênior] Se a gaveta de filtros exigir o rastreamento de um funcionário específico.
        if (!responsavelCard.includes(filtros.responsavel.toLowerCase().trim())) { // [Dev Sênior] Se o nome do operador amarrado ao card não contiver o termo buscado na gaveta.
            return false; // [Dev Sênior] Reprova imediatamente o cartão, ocultando-o da raia do Kanban ou da linha da planilha.
        } // [Dev Sênior] Encerra o bloqueio do operador.
    } // [Dev Sênior] Encerra o filtro de responsável.

    // ==========================================
    // 2. PENEIRA DE CAPITAL (FAIXAS FINANCEIRAS DE VALORES)
    // ==========================================
    if (filtros.faixaValor) { // [Dev Sênior] Se a diretoria ativou a triagem por faixas de valores em aberto no pipeline.
        if (filtros.faixaValor === 'baixa' && valorCardNum > 500) return false; // [Dev Sênior] Barra o devedor na tela se o saldo dele ultrapassar R$ 500.
        if (filtros.faixaValor === 'media' && (valorCardNum <= 500 || valorCardNum > 2000)) return false; // [Dev Sênior] Barra o devedor se o saldo dele fugir do intervalo intermediário de R$ 500 a R$ 2.000.
        if (filtros.faixaValor === 'alta' && valorCardNum <= 2000) return false; // [Dev Sênior] Barra o devedor se o montante dele for de pequeno ou médio porte (abaixo de R$ 2.000).
    } // [Dev Sênior] Encerra o filtro de faixas financeiras.

    // ==========================================
    // 3. PENEIRA DE IDADE DO LOTE (TEMPERATURA DO ATRASO)
    // ==========================================
    if (filtros.nivelAtraso) { // [Dev Sênior] Se o operador ativou o termômetro de tempo de inadimplência crônica no sistema.
        const dataCadastroOriginal = new Date(cobranca.dataEnvio || new Date()); // [Dev Sênior] Coleta a certidão de data de nascimento da dívida registrada no Firebase.
        const diferencaEmDias = Math.ceil(Math.abs(new Date() - dataCadastroOriginal) / (1000 * 60 * 60 * 24)); // [Dev Sênior] Subtrai os milissegundos de calendário entre hoje e a criação da dívida, convertendo em dias corridos.
        
        if (filtros.nivelAtraso === 'recente' && diferencaEmDias > 30) return false; // [Dev Sênior] Descarta carteiras antigas com mais de 1 mês de idade se a busca for por atrasos novos.
        if (filtros.nivelAtraso === 'critico' && diferencaEmDias <= 30) return false; // [Dev Sênior] Descarta inadimplências novas de curto prazo se a busca for por contas críticas antigas.
    } // [Dev Sênior] Encerra o filtro de nível cronológico de atraso.

    // ==========================================
    // 4. PENEIRA DE NEGLIGÊNCIA (CONTAS SEM TAREFAS AGENDADAS)
    // ==========================================
    // [Dev Sênior] CORREÇÃO DE ESCOPO: Ajustado cirurgicamente de 'status' para 'cobranca.status' para colher a propriedade real da ficha do devedor e evitar travamentos na tela.
    if (filtros.semTarefas && cobranca.status !== 'finalizado' && listaTarefas.length > 0) { // [Dev Sênior] Se a chave para caçar contas abandonadas no CRM estiver ligada pelo operador.
        return false; // [Dev Sênior] Oclui a linha se o devedor já possuir ações ou contatos planejados, deixando na tela exclusivamente as contas esquecidas sem tarefas.
    } // [Dev Sênior] Encerra o filtro de negligência operativa.

    return true; // [Dev Sênior] Sucesso absoluto: o devedor cruzou todas as barreiras de auditoria com sucesso e está autorizado a ser impresso na interface.
  } // [Dev Sênior] Encerra o método mestre validar.
}; // [Dev Sênior] Encerra a exportação do objeto de controle kanbanFiltros.