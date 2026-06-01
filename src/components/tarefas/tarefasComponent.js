export const tarefasComponent = { // Define e exporta o objeto mestre responsável por desenhar a interface visual e os Big Numbers da Agenda de Tarefas.
  renderizar(elementoContainer, filaProcessada, abrirCentral360) { // Função principal de plotagem que recebe o espaço físico do HTML, os dados minerados e o gatilho da Central 360.
    
    if (!elementoContainer) return; // Trava de segurança: se o bloco de injeção sumiu da página por falha de carregamento, aborta a execução na hora.

    // ESCUDO DE DADOS (TRAVA DE SEGURANÇA): Garante que se a fila vier nula, indefinida ou corrompida do Firebase, o sistema a converte em uma lista vazia e segura, impedindo o erro fatal de crash do forEach.
    const filaSegura = Array.isArray(filaProcessada) ? filaProcessada : []; 

    elementoContainer.innerHTML = ""; // Limpa conteúdos ou resíduos anteriores do bloco para garantir uma renderização limpa e isolada.

    // VARIÁVEIS DE ACÚMULO OPERACIONAL: Gavetas matemáticas para contar o status cronológico dos afazeres do funcionário logado.
    let totalAtrasadas = 0; // Inicializa o contador de pendências vencidas de curto ou longo prazo.
    let totalHoje = 0; // Inicializa o contador de compromissos com vencimento para o dia atual.
    let totalFuturas = 0; // Inicializa o contador de lembretes planejados para os próximos dias do mês.

    const dataHojeIso = new Date().toISOString().split("T")[0]; // Captura o calendário atual do computador e isola no formato padrão de banco de dados (AAAA-MM-DD).

    // PROCESSAMENTO CRONOLÓGICO: Varre a fila segura de trabalho para computar o volume exato de cada indicador de performance.
    filaSegura.forEach(tarefa => { // Inicia o laço de repetição passando por cada compromisso mapeado no sistema.
      const dataLimite = tarefa.dataLimite || tarefa.dataFim || dataHojeIso; // Resgata a data de corte estipulada para a ação comercial.
      if (dataLimite < dataHojeIso) { // Condicional: se a data da tarefa for menor do que o dia atual.
        totalAtrasadas++; // Incrementa o volume de alertas vermelhos de atraso.
      } else if (dataLimite === dataHojeIso) { // Condicional: se o compromisso estiver agendado exatamente para o dia corrente.
        totalHoje++; // Incrementa a fila de urgência do dia atual.
      } else { // Caso o prazo de execução esteja confortável para o futuro.
        totalFuturas++; // Incrementa o balanço de planejamento futuro.
      } // Encerra a checagem de calendário.
    }); // Termina a varredura estatística.

    const painelGeral = document.createElement("div"); // Fabrica o bloco de divisão mestre que servirá de casulo para acomodar a mesa de produtividade completa.
    painelGeral.style.cssText = "width: 100%; display: flex; flex-direction: column; gap: 25px; margin: 0 auto; box-sizing: border-box;"; // Configura as margens internas e o espaçamento simétrico de 25 pixels entre os blocos.

    let htmlMesa = ""; // Inicializa uma variável de texto vazia na memória para soldar as tags estruturais por concatenação estável.

    // ==========================================
    // 1. GRADE DE INDICADORES (BIG NUMBERS DA AGENDA)
    // ==========================================
    htmlMesa += "<div style='display: flex; gap: 20px; width: 100%; box-sizing: border-box;'>"; // Abre a linha flexível horizontal que alinha as caixas de contagem.

    // CARD DE ALERTA: Tarefas Críticas Atrasadas (Indicador Vermelho)
    htmlMesa += "  <div style='flex: 1; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border-left: 5px solid #ef4444; text-align: left;'>"; // Injeta a caixinha branca com borda lateral esquerda vermelha de perigo.
    htmlMesa += "    <div style='font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;'>Acoes Atrasadas</div>"; // Título do indicador crítico de faturamento.
    htmlMesa += "    <div style='font-size: 28px; font-weight: 800; color: #ef4444; margin-top: 5px;'>" + totalAtrasadas + "</div>"; // Exibe o número de contas paradas com prazo estourado.
    htmlMesa += "  </div>"; // Fecha o indicador de atraso.

    // CARD DE FOCO: Compromissos Para Hoje (Indicador Azul)
    htmlMesa += "  <div style='flex: 1; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border-left: 5px solid #2563eb; text-align: left;'>"; // Injeta a caixinha branca com borda lateral esquerda azul de prioridade máxima.
    htmlMesa += "    <div style='font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;'>Fila de Hoje</div>"; // Título do indicador operacional diário.
    htmlMesa += "    <div style='font-size: 28px; font-weight: 800; color: #2563eb; margin-top: 5px;'>" + totalHoje + "</div>"; // Exibe o montante numérico de contatos planejados para o turno atual.
    htmlMesa += "  </div>"; // Fecha o indicador do dia.

    // CARD DE PLANEJAMENTO: Atividades Futuras (Indicador Cinza)
    htmlMesa += "  <div style='flex: 1; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border-left: 5px solid #64748b; text-align: left;'>"; // Injeta a caixinha branca com borda lateral esquerda cinza neutra de retaguarda.
    htmlMesa += "    <div style='font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;'>Planejado Prox. Dias</div>"; // Título do indicador de previsibilidade operativa.
    htmlMesa += "    <div style='font-size: 28px; font-weight: 800; color: #64748b; margin-top: 5px;'>" + totalFuturas + "</div>"; // Exibe o volume de lembretes futuros já agendados na esteira comercial.
    htmlMesa += "  </div>"; // Encerra a linha horizontal dos Big Numbers.
    htmlMesa += "</div>"; // Fecha o contêiner mestre dos cards estatísticos.

    // ==========================================
    // 2. PAINEL DE CONTROLE (TABELA DA FILA DE TRABALHO)
    // ==========================================
    htmlMesa += "<div style='background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); padding: 20px; box-sizing: border-box; width: 100%;'>"; // Abre o bloco protetor da planilha interna da agenda.
    htmlMesa += "  <h3 style='font-size: 16px; font-weight: 800; color: #0f172a; margin: 0 0 15px 0; text-align: left;'>Linha Cronologica de Atividades Pendentes</h3>"; // Título descritivo da grade de produção.
    
    htmlMesa += "  <div style='overflow-x: auto; width: 100%;'>"; // Ativa a barra de rolagem horizontal nativa de segurança para o layout não quebrar em telas estreitas.
    htmlMesa += "    <table style='width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;'>"; // Inicializa a tag da tabela zerando as bordas e collapse cinzas de fábrica.
    htmlMesa += "      <thead>"; // Abre o contêiner de cabeçalho com os nomes das colunas da planilha.
    htmlMesa += "        <tr style='border-bottom: 2px solid #e2e8f0; color: #475569; font-weight: 700;'>"; // Cria a linha de cabeçalho com contorno cinza reforçado na base.
    htmlMesa += "          <th style='padding: 12px 10px;'>Cliente / Razao Social</th>"; // Coluna que identificará a empresa inadimplente vinculada à ação.
    htmlMesa += "          <th style='padding: 12px 10px;'>Acao Comercial Agendada</th>"; // Coluna que exibirá os textos de anotações e lembretes criados pelo operador.
    htmlMesa += "          <th style='padding: 12px 10px;'>Data Limite</th>"; // Coluna que exibirá o prazo fatal de execução da tarefa.
    htmlMesa += "          <th style='padding: 12px 10px; text-align: right;'>Acoes</th>"; // Coluna destinada a ancorar o botão de intervenção e abertura de histórico.
    htmlMesa += "        </tr>"; // Fecha a linha de títulos.
    htmlMesa += "      </thead>"; // Encerra o topo protetor da tabela.
    
    htmlMesa += "      <tbody id='corpo-tabela-agenda-unificada'>"; // Injeta a tag de corpo com um ID fixo exclusivo para o laço de repetição anexar as linhas de dados.
    
    if (filaSegura.length === 0) { // Condicional de UX: Se a esteira operativa do operador ativo estiver totalmente limpa e sem pendências.
      htmlMesa += "        <tr><td colspan='4' style='padding: 30px; text-align: center; color: #64748b; background-color: #f8fafc; border-radius: 8px;'>🎉 Excelente! Voce nao possui nenhuma tarefa ou cobranca pendente na sua fila.</td></tr>"; // Adiciona uma linha cinza com mensagem amigável de sucesso.
    } // Encerra o tratamento de deserto.

    htmlMesa += "      </tbody>"; // Fecha o fechamento do corpo dinâmico.
    htmlMesa += "    </table>"; // Encerra a tag estrutural da tabela.
    htmlMesa += "  </div>"; // Fecha a div de proteção contra estouros laterais de layout.
    htmlMesa += "</div>"; // Fecha o bloco branco de suporte da tabela.

    painelGeral.innerHTML = htmlMesa; // Deságua a carcaça da planilha e os cards de contadores calculados direto na memória da div mestre do painel.
    elementoContainer.appendChild(painelGeral); // Fixa todo o esqueleto estrutural da agenda dentro do visor da tela ativa do navegador.

    // ==========================================
    // 3. LAÇO REATIVO DE MONTAGEM DE LINHAS DA AGENDA
    // ==========================================
    const corpoTabelaDinamico = elementoContainer.querySelector("#corpo-tabela-agenda-unificada"); // Puxa cirurgicamente a tag tbody recém-fixada na tela para começarmos a montagem das linhas.
    
    if (corpoTabelaDinamico) { // Verifica se a ancoragem de linhas foi localizada com sucesso no HTML visível do navegador.
      filaSegura.forEach(item => { // Inicia laço varrendo item por item da nossa lista vacinada contra falhas.
        const linhaTr = document.createElement("tr"); // Fabrica uma linha física de planilha eletrônica em tempo de execução no computador.
        linhaTr.style.borderBottom = "1px solid #e2e8f0"; // Desenha a divisória cinza fina clássica de tabelas executivas na base da linha.

        const dataLimiteItem = item.dataLimite || item.dataFim || dataHojeIso; // Resgata o prazo de vencimento do compromisso.
        let corData = "#475569"; // Cor padrão de fábrica estável cinza escuro para datas confortáveis futuras.
        let pesoData = "500"; // Peso de fonte médio padrão para leitura comum.

        if (dataLimiteItem < dataHojeIso) { // Condicional: Se o prazo de execução da tarefa estourou em relação ao dia de hoje.
          corData = "#ef4444"; // Altera a cor do texto do calendário para vermelho vivo de urgência crítica.
          pesoData = "700"; // Engrossa a fonte para negrito pesado capturando o olho do operador na hora.
        } else if (dataLimiteItem === dataHojeIso) { // Condicional: Se a atividade vence no exato turno de trabalho atual.
          corData = "#2563eb"; // Pinta a data com o azul Royal oficial de atendimento imediato.
          pesoData = "700"; // Aplica o negrito de atenção máxima.
        } // Encerra o painel condicional de cores cronológicas.

        // Converte de forma amigável a exibição da data para o formato brasileiro (DD/MM/AAAA) fatiando os traços da string ISO.
        const partesData = dataLimiteItem.split("-"); // Divide a data pelo traço separando as partes de ano, mês e dia.
        const dataFormatadaBr = partesData.length === 3 ? partesData[2] + "/" + partesData[1] + "/" + partesData[0] : dataLimiteItem; // Rearranja as fatias unindo-as com barras invertidas tradicionais.

        let htmlLinha = ""; // Inicializa a string que acumulará as células (tds) da linha atual.
        htmlLinha += "  <td style='padding: 14px 10px; font-weight: 700; color: #0f172a; text-transform: uppercase;'>"; // Célula 1: Abertura e estilo do bloco nominal do devedor.
        htmlLinha += "    " + (item.clienteNome || item.cliente || "Empresa nao identificada"); // Carrega a Razão Social protegendo o sistema contra dados em branco.
        htmlLinha += "  </td>"; // Fecha a primeira célula.
        htmlLinha += "  <td style='padding: 14px 10px; color: #334155; max-width: 400px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;'>"; // Célula 2: Texto de apoio com corte visual sutil.
        htmlLinha += "    " + (item.tarefaDescricao || item.descricao || "Contato de rotina com o devedor administrativo"); // Carrega a descrição da atividade em andamento.
        htmlLinha += "  </td>"; // Fecha a segunda célula.
        htmlLinha += "  <td style='padding: 14px 10px; color: " + corData + "; font-weight: " + pesoData + ";'>" + dataFormatadaBr + "</td>"; // Célula 3: Data formatada herdando a cor e o peso calculados pelo cronômetro.
        htmlLinha += "  <td style='padding: 14px 10px; text-align: right;'>"; // Célula 4: Abertura da gaveta alinhada à direita para o botão de comando.
        htmlLinha += "    <button class='btn-intervir-agenda' data-id='" + item.idCobrancaRaiz + "' style='background: #f1f5f9; color: #2563eb; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 700; font-size: 12px; cursor: pointer; transition: all 0.2s;'>Intervir 360</button>"; // Cria o botão cinza claro minimalista com texto azul.
        htmlLinha += "  </td>"; // Fecha a célula de ações.

        linhaTr.innerHTML = htmlLinha; // Deságua as células construídas para dentro da linha TR.
        corpoTabelaDinamico.appendChild(linhaTr); // Fixa a linha preenchida e formatada diretamente no corpo oficial da planilha de tarefas em tela.
      }); // Termina a inserção reativa das linhas de afazeres.

      // ==========================================
      // 4. CAPTURA DOS CLIQUES E AMARRAÇÃO COM A CENTRAL 360
      // ==========================================
      corpoTabelaDinamico.querySelectorAll(".btn-intervir-agenda").forEach(botao => { // Localiza todos os botões "Intervir 360" recém-fixados na grade.
        botao.addEventListener("click", (e) => { // Grampeia o clique do mouse em cima do respectivo botão azul.
          const idCobrancaAlvo = e.target.getAttribute("data-id"); // Puxa o ID da cobrança original que deixamos guardado no carimbo de dados do botão.
          const listaReferenciaGlobais = window.dadosCobrancasGlobaisRaiz || []; // Puxa a gaveta de sustentação pública da janela do navegador.
          const cobrancaFichaRicaEncontrada = listaReferenciaGlobais.find(c => c.id === idCobrancaAlvo); // Procura a pasta do cliente através do ID eletrônico.
          
          if (cobrancaFichaRicaEncontrada) { // Se a ficha rica do devedor for localizada com sucesso na memória ram.
            abrirCentral360(cobrancaFichaRicaEncontrada); // Invoca a abertura da Central de Gestão 360 do arquivo app.js, abrindo o histórico do cliente em tela.
          } else { // Caso a ficha não seja encontrada por atrasos de sincronização com a nuvem do Firebase.
            alert("Aviso Operacional: Carregando atualizacoes do Firebase... Tente novamente em um segundo."); // Emite um aviso discreto instruindo o operador.
          } // Encerra o fluxo de busca.
        }); // Fecha o ouvinte de clique do botão.
      }); // Termina o monitoramento de ações dos botões.
    } // Encerra a montagem dinâmica das linhas da planilha.
  } // Encerra a função principal de renderização do componente de Tarefas.
}; // Encerra a exportação do objeto de controle tarefasComponent.