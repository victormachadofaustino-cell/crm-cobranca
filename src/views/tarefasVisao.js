// CONTROLADOR DE PRODUTIVIDADE: Define e exporta o submódulo responsável por garimpar, filtrar e organizar a agenda de trabalho do operador.
export const tarefasVisao = { // Cria e exporta a caixinha de ferramentas que vai gerenciar a lógica das tarefas.

  // O GARIMPEIRO DO BANCO: Função que vasculha todas as cobranças e monta a lista unificada de tarefas baseada no usuário logado.
  organizarFilaTrabalho(dadosCobrancasGlobais, usuarioLogado) { // Inicia o motor que recebe a lista do banco de dados e o operador logado.
    
    // Lista vazia que vai armazenar todas as tarefas individuais encontradas durante a varredura.
    const todasAsTarefasAgrupadas = []; // Fabrica a bandeja vazia para ir jogando os afazeres encontrados.
    
    // Captura o relógio do computador no segundo exato da execução e zera as horas para comparar apenas os dias do calendário.
    const hoje = new Date(); // Pega a data e a hora exata deste segundo no computador.
    hoje.setHours(0, 0, 0, 0); // Limpa as horas, minutos e segundos para fazermos uma comparação justa apenas pelos dias.

    // LAÇO DE VARREDURA: Passa de empresa em empresa dentro da nossa gaveta global de cobranças recebidas do Firebase.
    dadosCobrancasGlobais.forEach(cobranca => { // Inicia o passeio abrindo ficha por ficha de devedor que veio lá do servidor do Google.
      
      // Verifica se o card daquela empresa possui alguma lista de afazeres criada; se não tiver, pula para o próximo cliente.
      const listaTarefasCard = Array.isArray(cobranca.tarefas) ? cobranca.tarefas : []; // Garante que temos uma lista válida para vasculhar sem travar.

      // Passa por cada tarefazinha anotada dentro da ficha desse cliente específico.
      listaTarefasCard.forEach(tarefa => { // Abre o caderno de lembretes internos daquele cliente específico e lê linha por linha.
        
        // FILTRO DE GOVERNANÇA: Só captura a tarefa se ela estiver sob a responsabilidade do operador logado ou se não tiver responsável definido.
        const ehResponsavel = !tarefa.responsavel || tarefa.responsavel.toLowerCase().trim() === usuarioLogado.nome.toLowerCase().trim(); // Checa se o lembrete pertence ao Victor.
        
        if (ehResponsavel) { // Se a tarefa for sua ou estiver livre para qualquer operador assumir, entra aqui.
          // Prepara a data de vencimento da tarefa para fazermos a classificação matemática de prazos.
          const dataVencimentoTarefa = new Date(tarefa.data); // CORREÇÃO SÊNIOR: Lê a chave real '.data' que a tela salvou no banco de dados.
          dataVencimentoTarefa.setHours(0, 0, 0, 0); // Zera as horas do prazo do devedor para bater com o nosso relógio zerado de hoje.

          let classificacaoPrazo = 'futura'; // Rótulo padrão para tarefas com prazos longos. // Cria uma etiqueta dizendo temporariamente que a tarefa é para os próximos dias.

          // TESTE DO CALENDÁRIO: Classifica a urgência da tarefa comparando a data dela com o dia de hoje.
          if (tarefa.concluida) { // Checa se o operador já clicou no botão de feito ou concluído nesta tarefa.
            classificacaoPrazo = 'concluida'; // Se já foi checada pelo operador, vai para a pasta de resolvidos. // Muda a etiqueta para arquivada/concluída.
          } else if (dataVencimentoTarefa.getTime() < hoje.getTime()) { // Compara os milissegundos para ver se o prazo expirou antes de hoje.
            classificacaoPrazo = 'atrasada'; // Se o prazo era antes de hoje e não foi marcada como feita, vira alerta vermelho. // Carimba como tarefa atrasada de urgência máxima.
          } else if (dataVencimentoTarefa.getTime() === hoje.getTime()) { // Verifica se os dias do calendário batem rigorosamente no dia atual.
            classificacaoPrazo = 'hoje'; // Se o prazo expira no dia atual, entra na prioridade do dia. // Carimba como tarefa prioritária para executar no turno de hoje.
          }

          // Injeta a tarefa enriquecida na nossa lista mestre, trazendo junto o ID e o Nome do Cliente para o operador saber de quem é o boleto.
          todasAsTarefasAgrupadas.push({ // Joga o relatório completo e mastigado desse lembrete dentro da nossa bandeja mestre.
            idCobrancaRaiz: cobranca.id, // CORREÇÃO SÊNIOR: Alinhado para 'idCobrancaRaiz' para o clique do botão da planilha não dar erro de leitura.
            clienteNome: cobranca.cliente, // CORREÇÃO SÊNIOR: Salva como 'clienteNome' para que a tabela exiba perfeitamente a Razão Social.
            codigoCliente: cobranca.codigo, // Salva o código numérico essencial de identificação. // Copia o ID interno de controle da conta.
            etapaAtual: cobranca.status, // Informa em qual coluna do Kanban o cliente está estacionado. // Lembra a fase do funil comercial da empresa.
            
            // Dados originais da tarefa salvos pelo operador.
            idTarefa: tarefa.id, // Identificador eletrônico da própria tarefa. // Copia a identidade eletrônica desse lembrete específico.
            tarefaDescricao: tarefa.texto || 'Ação de cobrança sem título', // CORREÇÃO SÊNIOR: Lê '.texto' do banco e entrega como 'tarefaDescricao' para o visor.
            dataLimite: tarefa.data, // CORREÇÃO SÊNIOR: Lê '.data' do banco e entrega como 'dataLimite' para evitar panes de divisão de strings.
            urgencia: tarefa.urgencia || 'normal', // Nível de impacto (baixa, normal, alta). // Preserva o nível de criticidade do atendimento comercial.
            statusPrazo: classificacaoPrazo // O veredicto do relógio calculado acima (atrasada, hoje, futura, concluida). // Grava o resultado final da triagem do relógio.
          });
        }
      });
    });

    // RETORNO ESTRUTURADO: Entrega o relatório completo com a contagem exata e as filas divididas por caixas de prioridade para o componente desenhar.
    return { // Devolve para o arquivo maestro do CRM o resultado completo da varredura com os totais calculados.
      filaCompleta: todasAsTarefasAgrupadas, // Entrega a bandeja contendo todas as linhas de afazeres formatadas.
      totalAtrasadas: todasAsTarefasAgrupadas.filter(t => t.statusPrazo === 'atrasada').length, // Conta quantos cards da bandeja receberam o carimbo de atrasados.
      totalHoje: todasAsTarefasAgrupadas.filter(t => t.statusPrazo === 'hoje').length, // Conta quantos cards precisam obrigatoriamente de atendimento no dia atual.
      totalFuturas: todasAsTarefasAgrupadas.filter(t => t.statusPrazo === 'futura').length, // Conta o volume de compromissos confortáveis agendados para a frente.
      totalConcluidas: todasAsTarefasAgrupadas.filter(t => t.statusPrazo === 'concluida').length // Conta as tarefas finalizadas com sucesso histórico.
    };
  } // Encerra a lógica de garimpo.
}; // Encerra a exportação da visão de tarefas.