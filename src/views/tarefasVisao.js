// CONTROLADOR DE PRODUTIVIDADE: Define e exporta o submódulo responsável por garimpar, filtrar e organizar a agenda de trabalho do operador.
export const tarefasVisao = {

  // O GARIMPEIRO DO BANCO: Função que vasculha todas as cobranças e monta a lista unificada de tarefas baseada no usuário logado.
  organizarFilaTrabalho(dadosCobrancasGlobais, usuarioLogado) {
    
    // Lista vazia que vai armazenar todas as tarefas individuais encontradas durante a varredura.
    const todasAsTarefasAgrupadas = []; 
    
    // Captura o relógio do computador no segundo exato da execução e zera as horas para comparar apenas os dias do calendário.
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // LAÇO DE VARREDURA: Passa de empresa em empresa dentro da nossa gaveta global de cobranças recebidas do Firebase.
    dadosCobrancasGlobais.forEach(cobranca => {
      
      // Verifica se o card daquela empresa possui alguma lista de afazeres criada; se não tiver, pula para o próximo cliente.
      const listaTarefasCard = Array.isArray(cobranca.tarefas) ? cobranca.tarefas : [];

      // Passa por cada tarefazinha anotada dentro da ficha desse cliente específico.
      listaTarefasCard.forEach(tarefa => {
        
        // FILTRO DE GOVERNANÇA: Só captura a tarefa se ela estiver sob a responsabilidade do operador logado ou se não tiver responsável definido.
        const ehResponsavel = !tarefa.responsavel || tarefa.responsavel.toLowerCase().trim() === usuarioLogado.nome.toLowerCase().trim();
        
        if (ehResponsavel) {
          // Prepara a data de vencimento da tarefa para fazermos a classificação matemática de prazos.
          const dataVencimentoTarefa = new Date(tarefa.dataPrazo);
          dataVencimentoTarefa.setHours(0, 0, 0, 0);

          let classificacaoPrazo = 'futura'; // Rótulo padrão para tarefas com prazos longos.

          // TESTE DO CALENDÁRIO: Classifica a urgência da tarefa comparando a data dela com o dia de hoje.
          if (tarefa.concluida) {
            classificacaoPrazo = 'concluida'; // Se já foi checada pelo operador, vai para a pasta de resolvidos.
          } else if (dataVencimentoTarefa.getTime() < hoje.getTime()) {
            classificacaoPrazo = 'atrasada'; // Se o prazo era antes de hoje e não foi marcada como feita, vira alerta vermelho.
          } else if (dataVencimentoTarefa.getTime() === hoje.getTime()) {
            classificacaoPrazo = 'hoje'; // Se o prazo expira no dia atual, entra na prioridade do dia.
          }

          // Injeta a tarefa enriquecida na nossa lista mestre, trazendo junto o ID e o Nome do Cliente para o operador saber de quem é o boleto.
          todasAsTarefasAgrupadas.push({
            idCobranca: cobranca.id, // Guarda o ID do cliente para sabermos para onde mandar o clique depois.
            nomeCliente: cobranca.cliente, // Salva a Razão Social para desenhar na tabela da agenda.
            codigoCliente: cobranca.codigo, // Salva o código numérico essencial de identificação.
            etapaAtual: cobranca.status, // Informa em qual coluna do Kanban o cliente está estacionado.
            
            // Dados originais da tarefa salvos pelo operador.
            idTarefa: tarefa.id, // Identificador eletrônico da própria tarefa.
            titulo: tarefa.titulo || 'Ação de cobrança sem título', // Texto descritivo (Ex: "Ligar para o financeiro cobrar o canhoto").
            dataPrazo: tarefa.dataPrazo, // Data limite formatada em texto.
            urgencia: tarefa.urgencia || 'normal', // Nível de impacto (baixa, normal, alta).
            statusPrazo: classificacaoPrazo // O veredicto do relógio calculado acima (atrasada, hoje, futura, concluida).
          });
        }
      });
    });

    // RETORNO ESTRUTURADO: Entrega o relatório completo com a contagem exata e as filas divididas por caixas de prioridade para o componente desenhar.
    return {
      filaCompleta: todasAsTarefasAgrupadas,
      totalAtrasadas: todasAsTarefasAgrupadas.filter(t => t.statusPrazo === 'atrasada').length,
      totalHoje: todasAsTarefasAgrupadas.filter(t => t.statusPrazo === 'hoje').length,
      totalFuturas: todasAsTarefasAgrupadas.filter(t => t.statusPrazo === 'futura').length,
      totalConcluidas: todasAsTarefasAgrupadas.filter(t => t.statusPrazo === 'concluida').length
    };
  } // Encerra a lógica de garimpo.
}; // Encerra a exportação da visão de tarefas.