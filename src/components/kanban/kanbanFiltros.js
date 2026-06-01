export const kanbanFiltros = { // Define e exporta o submódulo focado de forma estrita em isolar as peneiras e triagens de dados da gaveta lateral.
  validar(cobranca, status) { // Método mestre que julga se a cobrança atende aos critérios ativos na sessão retornando verdadeiro ou falso.
    
    const filtros = window.filtrosGavetaCrmAtivos; // Resgata o objeto global de filtros gerenciado pelo Drawer do cabeçalho.
    if (!filtros) return true; // Trava de segurança: se a gaveta nunca foi aberta ou configurada, concede passe livre imediato para o cartão aparecer.

    // ==========================================
    // PADRONIZAÇÃO DE VARIÁVEIS INTERNAS PARA FILTRAGEM RIGOROSA
    // ==========================================
    const responsavelCard = (cobranca.responsavel || 'Não informado').toLowerCase().trim(); // Isola o nome do operador dono do card em caixa baixa, eliminando espaços extras.
    const valorCardNum = parseFloat(cobranca.valorVencido) || 0; // Converte o saldo devedor principal para float monetário puro para cálculos matemáticos.
    const listaTarefas = Array.isArray(cobranca.tarefas) ? cobranca.tarefas : []; // Valida se a lista de tarefas é um array legítimo ou inicia uma lista vazia de segurança.

    // ==========================================
    // 1. PENEIRA DE OPERADOR (FILTRO "MEU DIA" / RESPONSÁVEL)
    // ==========================================
    if (filtros.responsavel && filtros.responsavel.trim() !== "") { // Se a gaveta de filtros exigir o rastreamento de um funcionário específico.
        if (!responsavelCard.includes(filtros.responsavel.toLowerCase().trim())) { // Se o nome do operador amarrado ao card não contiver o termo buscado na gaveta.
            return false; // Reprova imediatamente o cartão, ocultando-o da raia do Kanban ou da linha da planilha.
        } // Encerra o bloqueio do operador.
    } // Encerra o filtro de responsável.

    // ==========================================
    // 2. PENEIRA DE CAPITAL (FAIXAS FINANCEIRAS DE VALORES)
    // ==========================================
    if (filtros.faixaValor) { // Se a diretoria ativou a triagem por faixas de valores em aberto no pipeline.
        if (filtros.faixaValor === 'baixa' && valorCardNum > 500) return false; // Barra o devedor na tela se o saldo dele ultrapassar R$ 500.
        if (filtros.faixaValor === 'media' && (valorCardNum <= 500 || valorCardNum > 2000)) return false; // Barra o devedor se o saldo dele fugir do intervalo intermediário de R$ 500 a R$ 2.000.
        if (filtros.faixaValor === 'alta' && valorCardNum <= 2000) return false; // Barra o devedor se o montante dele for de pequeno ou médio porte (abaixo de R$ 2.000).
    } // Encerra o filtro de faixas financeiras.

    // ==========================================
    // 3. PENEIRA DE IDADE DO LOTE (TEMPERATURA DO ATRASO)
    // ==========================================
    if (filtros.nivelAtraso) { // Se o operador ativou o termômetro de tempo de inadimplência crônica no sistema.
        const dataCadastroOriginal = new Date(cobranca.dataEnvio || new Date()); // Coleta a certidão de data de nascimento da dívida registrada no Firebase.
        const diferencaEmDias = Math.ceil(Math.abs(new Date() - dataCadastroOriginal) / (1000 * 60 * 60 * 24)); // Subtrai os milissegundos de calendário entre hoje e a criação da dívida, convertendo em dias corridos.
        
        if (filtros.nivelAtraso === 'recente' && diferencaEmDias > 30) return false; // Descarta carteiras antigas com mais de 1 mês de idade se a busca for por atrasos novos.
        if (filtros.nivelAtraso === 'critico' && diferencaEmDias <= 30) return false; // Descarta inadimplências novas de curto prazo se a busca for por contas críticas antigas.
    } // Encerra o filtro de nível cronológico de atraso.

    // ==========================================
    // 4. PENEIRA DE NEGLIGÊNCIA (CONTAS SEM TAREFAS AGENDADAS)
    // ==========================================
    if (filtros.semTarefas && status !== 'finalizado' && listaTarefas.length > 0) { // Se a chave para caçar contas abandonadas no CRM estiver ligada pelo operador.
        return false; // Oclui a linha se o devedor já possuir ações ou contatos planejados, deixando na tela exclusivamente as contas esquecidas sem tarefas.
    } // Encerra o filtro de negligência operativa.

    return true; // Sucesso absoluto: o devedor cruzou todas as barreiras de auditoria com sucesso e está autorizado a ser impresso na interface.
  } // Encerra o método mestre validar.
}; // Encerra a exportação do objeto de controle kanbanFiltros.