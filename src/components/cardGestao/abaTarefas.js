// Define e exporta o sub-módulo responsável por processar e listar as agendas e históricos de atendimento.
export const abaTarefas = { // Cria e exporta o objeto mestre que guarda as telas da agenda e de anotações do sistema.
  renderizar(containerAbaConteudo, dadosLocais, abaAtiva, callbackRecarregarAba) { // Inicia a função de desenho recebendo a div da tela, os dados da cobrança e o comando de recarga.
    
    containerAbaConteudo.innerHTML = ''; // Limpa os resíduos visuais anteriores da aba para plotagem limpa e sem duplicações. // Apaga o conteúdo antigo da aba para redesenhar do zero sem duplicar botões.

    if (abaAtiva === 'tarefas') { // Caso o operador esteja visualizando a aba reativa de Tarefas e Lembretes operacionais. // Se o usuário clicou para assistir o painel de prazos e compromissos.
        containerAbaConteudo.innerHTML = ` <div style="background: white; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 15px; flex-shrink: 0; display: flex; flex-direction: column; gap: 10px;"> <h4 style="font-size: 13px; font-weight: bold; color: #1e293b; margin: 0;">➕ Agendar Próxima Ação / Tarefa</h4> <div style="display: flex; gap: 8px;"> <input type="text" id="nova-tarefa-texto" placeholder="Ex: Ligar para negociar juros da parcela..." style="flex-grow: 1; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 13px;"> <input type="date" id="nova-tarefa-data" style="padding: 5px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 13px; color: #334155;"> <button type="button" id="btn-adicionar-tarefa-lista" style="background: #2563eb; color: white; border: none; padding: 6px 15px; border-radius: 4px; font-weight: bold; font-size: 12px; cursor: pointer;">Criar</button> </div> </div> <div id="lista-tarefas-rolavel" style="overflow-y: auto; flex-grow: 1; display: flex; flex-direction: column; gap: 8px; padding-right: 5px;"></div> `; // Injeta o formulário compacto de agendamentos e o miolo de rolagem inteligente. // Desenha na tela a caixa de texto do lembrete, o calendário eletrônico e o botão azul de criar.

        const listaTarefas = document.getElementById('lista-tarefas-rolavel'); // Captura a área de injeção física de lembretes criada acima. // Localiza o bloco rolável onde as tarefas salvas serão empilhadas.
        if (dadosLocais.tarefas.length === 0) { // Se a agenda deste devedor estiver totalmente limpa na nuvem. // Se o tamanho da lista de afazeres desse cliente for igual a zero.
            listaTarefas.innerHTML = `<div style="text-align: center; color: #94a3b8; font-size: 13px; padding-top: 40px; font-style: italic;">Nenhuma tarefa agendada para esta cobrança.</div>`; // Mensagem de conformidade de rotinas cumpridas. // Escreve um aviso discreto informando que o devedor está sem pendências.
        } else { // Caso existam prazos pendentes de ações de cobrança. // Se houver lembretes salvos na ficha desse cliente.
            dadosLocais.tarefas.forEach((tarefa, index) => { // Laço de repetição varrendo afazer por afazer do array de lembretes. // Passa lendo tarefa por tarefa guardada na ficha do devedor atual.
                const item = document.createElement('div'); // Fabrica o bloco de linha para preenchimento. // Cria um pequeno bloco de card branco para desenhar o afazer.
                item.style.cssText = 'background: white; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 2px rgba(0,0,0,0.02);'; // Estilização arredondada com sombra leve de repouso. // Aplica o visual de bordas arredondadas e sombra suave no card.
                
                // NOVA ADIÇÃO DE UX E AUDITORIA: Trata se o card possui os novos carimbos de histórico blindados de criação para exibição no visor. // Identifica quem foi o autor original do agendamento.
                const criadorOriginal = tarefa.criadoPor || 'Sistema'; // Resgata o nome do operador que deu origem à ordem ou assina como padrão de segurança. // Busca o operador que assinou o lembrete ou carimba como automação.
                const dataHoraCriacao = tarefa.dataCriacao || 'Histórico de Lote'; // Resgata o minuto inalterável de registro da ação. // Coleta o carimbo de data/hora antigo ou define uma flag de migração.

                item.innerHTML = ` 
                  <div style="display: flex; flex-direction: column; gap: 4px; max-width: 80%;"> 
                    <span style="font-size: 13px; color: #1e293b; font-weight: 500;">${tarefa.texto}</span> 
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                      <span style="font-size: 11px; color: #ef4444; font-weight: bold;">📅 Prazo Limite: ${tarefa.data.split('-').reverse().join('/')}</span> 
                      <span style="font-size: 10px; color: #94a3b8; font-style: italic;">📌 Agendado por ${criadorOriginal} em ${dataHoraCriacao}</span> </div>
                  </div> 
                  <button type="button" class="btn-concluir-tarefa-filho" data-index="${index}" style="background: #f1f5f9; color: #475569; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer; transition: all 0.2s;">✓ Concluir</button> 
                `; // Injeta a descrição, o prazo invertido brasileiro, os carimbos inalteráveis de log e o gatilho de cumprimento de rotina. // Plota o texto da ação, inverte a data americana para o padrão nacional (DD/MM/AAAA) e desenha o botão de Concluir.
                listaTarefas.appendChild(item); // Fixa o afazer configurado na listagem vertical da tela. // Cola o bloco da tarefa pronto dentro do painel visível.
            });

            listaTarefas.querySelectorAll('.btn-concluir-tarefa-filho').forEach(btn => { // Captura os botões de conclusão das linhas geradas. // Localiza todos os botões de conclusão desenhados na tela.
                btn.addEventListener('click', (e) => { // Intercepta a baixa do lembrete cumprido pelo operador. // Ouve o clique do mouse para dar baixa no compromisso.
                    const idx = parseInt(e.target.getAttribute('data-index')); // Localiza a posição numérica exata do item na lista da dívida. // Descobre qual linha o usuário quer riscar da comanda.
                    dadosLocais.tarefas.splice(idx, 1); // Remove cirurgicamente a linha da memória da sessão eliminando o peso morto. // Corta o lembrete de dentro do array temporário da memória ram.
                    callbackRecarregarAba(); // Recarrega a sub-tela de afazeres reativamente limpando o registro cumprido. // Atualiza os blocos da tela apagando a linha que foi resolvida.
                });
            });
        }

        document.getElementById('btn-adicionar-tarefa-lista').addEventListener('click', () => { // Monitora a criação unificada de novos lembretes no clique do botão azul. // Ouve o clique do botão azul de criar nova tarefa.
            const txt = document.getElementById('nova-tarefa-texto').value.trim(); // Coleta e limpa espaços vazios na descrição do plano de ação. // Puxa o texto digitado na caixa e limpa espaçamentos extras.
            const data = document.getElementById('nova-tarefa-data').value; // Coleta a data do calendário físico. // Captura os números do dia selecionado no calendário.

            if (!txt || !data) { // Blindagem contra agendamentos fantasmas ou sem data de controle definida. // Se o texto estiver vazio ou o calendário em branco, bloqueia.
                alert('Por favor, preencha a descrição da tarefa e selecione uma data para agendamento!'); // Alerta de segurança. // Abre uma caixinha de aviso exigindo o preenchimento dos dados.
                return; // Aborta a operação protegendo a integridade dos relatórios futuros da carteira. // Interrompe o salvamento para não poluir o banco de dados.
            } // Encerra validação.

            // REGRA DE MERCADO ADICIONADA: Calcula e gera de forma fixa e estável os carimbos inalteráveis no milissegundo de injeção da tarefa. // Cria a marcação cronológica da ação.
            const dataAtual = new Date(); // Captura o relógio interno do computador. // Instancia o relógio atual do sistema.
            const diaBR = dataAtual.toLocaleDateString('pt-BR'); // Separa o dia no arranjo nacional DD/MM/AAAA. // Converte o dia atual para o formato brasileiro de escrita.
            const horaBR = dataAtual.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); // Isola as horas e minutos (HH:MM). // Filtra o relógio para pegar apenas horas e minutos (Ex: 14:30).
            const carimboCriacao = `${diaBR} às ${horaBR}`; // Une os fragmentos criando o log definitivo (Ex: 31/05/2026 às 19:55). // Funde os textos gerando o carimbo estável de auditoria.

            // Empurra a nova tarefa estruturada injetando o carimbo estável do relógio e o nome do usuário logado dinâmico por segurança de auditoria. // Insere o lote no array.
            dadosLocais.tarefas.push({ // Adiciona o novo bloco estruturado de lembrete dentro da nossa lista da sessão.
                texto: txt, // Salva a descrição exata digitada pelo cobrador.
                data: data, // Grava a data do prazo limite escolhida no calendário.
                criadoPor: dadosLocais.responsavel || "Victor Faustino", // CORREÇÃO SÊNIOR: Atribui o nome do operador real da carteira ao invés de fixar um texto estático.
                dataCriacao: carimboCriacao // Assina inalteravelmente com la minutagem eletrônica de entrada. // Carimba a minutagem imutável da criação.
            }); 

            callbackRecarregarAba(); // Redesenha a lista fazendo o novo agendamento brilhar na tela com os carimbos consolidados instantaneamente. // Recarrega a aba exibindo o novo lembrete criado reativamente.
        });

    } else if (abaAtiva === 'anotacoes') { // Caso o operador alterne o visor para a aba de Histórico de Conversas e Atendimentos ricos. // Se o usuário escolheu olhar o diário de conversas com o devedor.
        containerAbaConteudo.innerHTML = ` <div style="background: white; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 15px; flex-shrink: 0; display: flex; flex-direction: column; gap: 8px;"> <h4 style="font-size: 13px; font-weight: bold; color: #1e293b; margin: 0;">📝 Registrar Nova Interação / Conversa com o Cliente</h4> <textarea id="nova-nota-texto" rows="3" placeholder="Digite aqui o resumo da ligação, o acordo de parcelamento firmado ou a desculpa enviada pelo devedor..." style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 13px; resize: none;"></textarea> <div style="display: flex; justify-content: flex-end;"> <button type="button" id="btn-registrar-nota-lista" style="background: #10b981; color: white; border: none; padding: 6px 15px; border-radius: 4px; font-weight: bold; font-size: 12px; cursor: pointer;">Registrar Anotação</button> </div> </div> <div id="lista-notas-cronologica-rolavel" style="overflow-y: auto; flex-grow: 1; display: flex; flex-direction: column; gap: 10px; padding-right: 5px;"></div> `; // Injeta o campo de texto rico de logs e o contêiner de linha do tempo cronológica. // Desenha a caixa de texto grande de interações e o botão verde de salvar.

        const listaNotas = document.getElementById('lista-notas-cronologica-rolavel'); // Captura a área de injeção da linha do tempo física vertical. // Localiza a div onde a linha do tempo das conversas ficará ancorada.
        const notasExibicao = dadosLocais.historicoNotas.length > 0  // Checa se o devedor possui notas de ligações antigas.
          ? [...dadosLocais.historicoNotas] // Se possuir notas, faz uma cópia limpa do lote para exibição na tela.
          : [{ conteudo: "Lote antigo de cobrança importado para o CRM", dataHora: dadosLocais.dataEnvio || "Histórico de Origem" }]; // Garante suporte estável retroativo de logs a contas antigas importadas. // Cria uma nota de segurança padrão caso a carteira venha de lotes passados.

        if (notasExibicao.length === 0) { // Checação de segurança estrutural. // Se o array de históricos estiver vazio após o crivo.
            listaNotas.innerHTML = `<div style="text-align: center; color: #94a3b8; font-size: 13px; padding-top: 40px; font-style: italic;">Nenhum histórico ou nota registrada para este devedor até o momento.</div>`; // Mensagem de linha do tempo limpa. // Escreve um aviso informando que não há registros de conversas.
        } else { // Caso existam notas gravadas ou logs de transição automáticos gerados pelo sistema. // Se houverem conversas salvas no diário de bordo.
            [...notasExibicao].reverse().forEach((nota) => { // Clona e inverte o lote fazendo os atendimentos mais frescos surgirem sempre no topo da linha do tempo. // Inverte a ordem das notas para que a conversa mais recente apareça no topo da folha.
                const blocoNota = document.createElement('div'); // Fabrica o bloco de card da nota. // Fabrica um bloco de card com contorno vertical verde.
                blocoNota.style.cssText = 'background: white; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px; border-left: 4px solid #10b981; box-shadow: 0 1px 2px rgba(0,0,0,0.02);'; // Design elegante com borda sólida verde indicadora de nota oficial. // Aplica o visual de bordinha verde chamativa na lateral esquerda do bloco.
                blocoNota.innerHTML = ` <div style="display: flex; justify-content: space-between; font-size: 11px; color: #64748b; font-weight: 600; margin-bottom: 6px; background: #f8fafc; padding: 2px 6px; border-radius: 4px;"> <span>⏱️ Registro de Atendimento</span> <span>${nota.dataHora}</span> </div> <p style="font-size: 13px; color: #334155; margin: 0; white-space: pre-line; line-height: 1.5;">"${nota.conteudo}"</p> `; // Injeta o cabeçalho com o relógio de auditoria e a descrição rica da conversa. // Plota o carimbo de tempo do telefonema e a anotação rica feita pelo operador entre aspas.
                listaNotas.appendChild(blocoNota); // Fixa a nota estruturada na linha do tempo vertical rolável da tela. // Anexa a anotação formatada no painel vertical de relatórios.
            });
        }

        document.getElementById('btn-registrar-nota-lista').addEventListener('click', () => { // Intercepta a criação de novas anotações de conversas ricas no clique do botão verde. // Ouve o clique do botão verde de registrar anotação.
            const conteudoTxt = document.getElementById('nova-nota-texto').value.trim(); // Captura o resumo de texto digitado removendo espaçamentos quebrados falsos. // Puxa o resumo digitado pelo cobrador limpando quebras falsas.

            if (!conteudoTxt) { // Trava de segurança contra salvamentos vazios ou desinteressados. // Se o operador clicou no botão com a caixa grande de texto vazia, bloqueia.
                alert('Por favor, digite o resumo do atendimento antes de salvar a anotação!'); // Alerta a interface. // Abre o aviso instruindo a preencher o resumo do telefonema.
                return; // Aborta imediatamente o salvamento blindando o banco contra notas fantasmas. // Interrompe o processo e cancela a escrita na nuvem.
            } // Encerra validação.

            const agora = new Date(); // Registra as configurações de calendário do computador do operador no exato segundo. // Captura as configurações de data/hora do sistema do operador.
            const dataFormatada = agora.toLocaleDateString('pt-BR'); // Converte a data automática para o formato clássico nacional (DD/MM/AAAA). // Formata o dia no formato brasileiro DD/MM/AAAA.
            const horaFormatada = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); // Filtra o relógio para horas e minutos precisos (HH:MM). // Filtra o relógio para isolar horas e minutos exatos.
            const carimboDataHora = `${dataFormatada} às ${horaFormatada}`; // Mescla criando o carimbo oficial de auditoria da nota. // Une os textos criando o carimbo imutável de log do CRM.

            dadosLocais.historicoNotas.push({ conteudo: conteudoTxt, dataHora: carimboDataHora }); // Empurra a nova anotação estruturada para a memória provisória. // Salva a nova anotação dentro da lista de históricos na memória da máquina.
            callbackRecarregarAba(); // Recarrega o painel direito redesenhando a linha do tempo com a nova conversa brilhando no topo da lista. // Atualiza a linha do tempo na tela exibindo a nova conversa no topo da folha reativamente.
        });
    }
  } // Encerra a renderização unificada de tarefas e notas.
}; // Encerra a exportação do sub-módulo de abas clássicas.