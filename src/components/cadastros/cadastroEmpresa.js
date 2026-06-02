// [Dev Sênior] Exporta o objeto especialista em tratar os dados cadastrais macros das empresas inadimplentes.
export const cadastroEmpresa = {

  // [Dev Sênior] Função que lê o saldo devedor e diz se a conta é de alta relevância ou comum para o CRM.
  tratarRelevancia(valorVencido) {
    const valorPuro = parseFloat(valorVencido) || 0; // Transforma o dado do banco em número decimal seguro para não dar bugs de leitura.
    
    if (valorPuro > 2000) { // Se o saldo em atraso da empresa for maior do que dois mil reais.
      return { classe: 'alta-relevancia', emoji: '🚀', texto: 'Alta Relevância' }; // Devolve o carimbo de foguete indicando prioridade total para o operador.
    } else if (valorPuro > 500) { // Se o saldo estiver na faixa intermediária entre quinhentos e dois mil reais.
      return { classe: 'media-relevancia', emoji: '📊', texto: 'Média Relevância' }; // Devolve o carimbo de gráfico indicando atenção padrão.
    } else { // Caso a dívida seja de pequeno valor, até quinhentos reais.
      return { classe: 'baixa-relevancia', emoji: '📉', texto: 'Pequeno Valor' }; // Devolve o carimbo de queda indicando carteira secundária.
    } // Encerra a checagem de faixas financeiras.
  }, // Encerra a função de relevância.

  // [Dev Sênior] Função de auditoria que descobre se o operador esqueceu o cliente parado na esteira sem ações.
  checarNegligencia(tarefas, status) {
    if (status === 'finalizado') { // Se o cliente já tiver passado por todo o processo e estiver na coluna de finalizados.
      return { esquecido: false, emoji: '✅', mensagem: 'Esteira Concluída' }; // Retorna que está tudo bem, pois contas encerradas não precisam de novos prazos.
    } // Encerra a checagem de fase final.

    const listaTarefas = Array.isArray(tarefas) ? tarefas : []; // Vacinador de segurança: se a lista de tarefas vier com defeito, transforma em uma bandeja vazia.
    
    if (listaTarefas.length === 0) { // Se o tamanho da lista de afazeres for rigorosamente igual a zero.
      return { esquecido: true, emoji: '⚠️', mensagem: 'Sem Tarefas Agendadas!' }; // Devolve o carimbo de alerta notificando esquecimento grave do operador.
    } // Encerra a checagem de bandeja vazia.

    return { esquecido: false, emoji: '📅', mensagem: 'Ações em Dia' }; // Se houver lembretes na fila, retorna que o devedor está com o cronograma em dia.
  }, // Encerra a função de negligência.

  // [Dev Sênior] Função cronológica que calcula a idade do processo na mesa de cobrança até o dia de hoje (2026).
  calcularTempoLote(dataEnvio) {
    if (!dataEnvio) return { dias: 0, statusTempo: 'recente', texto: 'Data Ausente' }; // Trava de proteção: se a conta não tiver data de entrada, aborta o cálculo de segurança.
    
    const dataCriacao = new Date(dataEnvio); // Converte a string de texto estável do banco em um objeto de calendário do navegador.
    const dataHoje = new Date(); // Captura o relógio e o dia exato de hoje do sistema do computador.
    
    const diferencaMilissegundos = Math.abs(dataHoje - dataCriacao); // Calcula a diferença bruta de tempo convertendo os dias em milissegundos de máquina.
    const diasCorridos = Math.ceil(diferencaMilissegundos / (1000 * 60 * 60 * 24)); // Realiza a divisão matemática para transformar o tempo bruto em dias de calendário cheios.

    if (diasCorridos > 30) { // Se o processo estiver rodando na mesa há mais de trinta dias seguidos.
      return { dias: diasCorridos, statusTempo: 'critico', emoji: '🚨', texto: 'Temperatura Crítica' }; // Devolve o carimbo de sirene vermelha exigindo intervenção imediata.
    } // Encerra a checagem de tempo crítico.

    return { dias: diasCorridos, statusTempo: 'recente', emoji: '⚡', texto: 'Atraso Recente' }; // Caso contrário, devolve o carimbo de raio indicando que o lote ainda é novo no CRM.
  } // Encerra a função de cálculo de tempo.
}; // Sela por completo o objeto especialista cadastroEmpresa.