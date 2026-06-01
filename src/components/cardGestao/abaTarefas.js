export const abaTarefas = { // Define e exporta o sub-módulo responsável por processar e listar as agendas e históricos de atendimento.
  renderizar(containerAbaConteudo, dadosLocais, abaAtiva, callbackRecarregarAba) { // Cria a função que monta as caixas ricas e listagens horizontais de afazeres de caixa.
    
    containerAbaConteudo.innerHTML = ''; // Limpa os resíduos visuais anteriores da aba para plotagem limpa e sem duplicações.

    if (abaAtiva === 'tarefas') { // Caso o operador esteja visualizando a aba reativa de Tarefas e Lembretes operacionais.
        containerAbaConteudo.innerHTML = ` <div style="background: white; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 15px; flex-shrink: 0; display: flex; flex-direction: column; gap: 10px;"> <h4 style="font-size: 13px; font-weight: bold; color: #1e293b; margin: 0;">➕ Agendar Próxima Ação / Tarefa</h4> <div style="display: flex; gap: 8px;"> <input type="text" id="nova-tarefa-texto" placeholder="Ex: Ligar para negociar juros da parcela..." style="flex-grow: 1; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 13px;"> <input type="date" id="nova-tarefa-data" style="padding: 5px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 13px; color: #334155;"> <button type="button" id="btn-adicionar-tarefa-lista" style="background: #2563eb; color: white; border: none; padding: 6px 15px; border-radius: 4px; font-weight: bold; font-size: 12px; cursor: pointer;">Criar</button> </div> </div> <div id="lista-tarefas-rolavel" style="overflow-y: auto; flex-grow: 1; display: flex; flex-direction: column; gap: 8px; padding-right: 5px;"></div> `; // Injeta o formulário compacto de agendamentos e o miolo de rolagem inteligente.

        const listaTarefas = document.getElementById('lista-tarefas-rolavel'); // Captura a área de injeção física de lembretes criada acima.
        if (dadosLocais.tarefas.length === 0) { // Se a agenda deste devedor estiver totalmente limpa na nuvem.
            listaTarefas.innerHTML = `<div style="text-align: center; color: #94a3b8; font-size: 13px; padding-top: 40px; font-style: italic;">Nenhuma tarefa agendada para esta cobrança.</div>`; // Mensagem de conformidade de rotinas cumpridas.
        } else { // Caso existam prazos pendentes de ações de cobrança.
            dadosLocais.tarefas.forEach((tarefa, index) => { // Laço de repetição varrendo afazer por afazer do array de lembretes.
                const item = document.createElement('div'); // Fabrica o bloco de linha para preenchimento.
                item.style.cssText = 'background: white; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 2px rgba(0,0,0,0.02);'; // Estilização arredondada com sombra leve de repouso.
                
                // NOVA ADIÇÃO DE UX E AUDITORIA: Trata se o card possui os novos carimbos de histórico blindados de criação para exibição no visor.
                const criadorOriginal = tarefa.criadoPor || 'Sistema'; // Resgata o nome do operador que deu origem à ordem ou assina como padrão de segurança.
                const dataHoraCriacao = tarefa.dataCriacao || 'Histórico de Lote'; // Resgata o minuto inalterável de registro da ação.

                item.innerHTML = ` 
                  <div style="display: flex; flex-direction: column; gap: 4px; max-width: 80%;"> 
                    <span style="font-size: 13px; color: #1e293b; font-weight: 500;">${tarefa.texto}</span> 
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                      <span style="font-size: 11px; color: #ef4444; font-weight: bold;">📅 Prazo Limite: ${tarefa.data.split('-').reverse().join('/')}</span> 
                      <span style="font-size: 10px; color: #94a3b8; font-style: italic;">📌 Agendado por ${criadorOriginal} em ${dataHoraCriacao}</span> </div>
                  </div> 
                  <button type="button" class="btn-concluir-tarefa-filho" data-index="${index}" style="background: #f1f5f9; color: #475569; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer; transition: all 0.2s;">✓ Concluir</button> 
                `; // Injeta a descrição, o prazo invertido brasileiro, os carimbos inalteráveis de log e o gatilho de cumprimento de rotina.
                listaTarefas.appendChild(item); // Fixa o afazer configurado na listagem vertical da tela.
            });

            listaTarefas.querySelectorAll('.btn-concluir-tarefa-filho').forEach(btn => { // Captura os botões de conclusão das linhas geradas.
                btn.addEventListener('click', (e) => { // Intercepta a baixa do lembrete cumprido pelo operador.
                    const idx = parseInt(e.target.getAttribute('data-index')); // Localiza a posição numérica exata do item na lista da dívida.
                    dadosLocais.tarefas.splice(idx, 1); // Remove cirurgicamente a linha da memória da sessão eliminando o peso morto.
                    callbackRecarregarAba(); // Recarrega a sub-tela de afazeres reativamente limpando o registro cumprido.
                });
            });
        }

        document.getElementById('btn-adicionar-tarefa-lista').addEventListener('click', () => { // Monitora a criação unificada de novos lembretes no clique do botão azul.
            const txt = document.getElementById('nova-tarefa-texto').value.trim(); // Coleta e limpa espaços vazios na descrição do plano de ação.
            const data = document.getElementById('nova-tarefa-data').value; // Coleta a data do calendário físico.

            if (!txt || !data) { // Blindagem contra agendamentos fantasmas ou sem data de controle definida.
                alert('Por favor, preencha a descrição da tarefa e selecione uma data para agendamento!'); // Alerta de segurança.
                return; // Aborta a operação protegendo a integridade dos relatórios futuros da carteira.
            } // Encerra validação.

            // REGRA DE MERCADO ADICIONADA: Calcula e gera de forma fixa e estável os carimbos inalteráveis no milissegundo de injeção da tarefa.
            const dataAtual = new Date(); // Captura o relógio interno do computador.
            const diaBR = dataAtual.toLocaleDateString('pt-BR'); // Separa o dia no arranjo nacional DD/MM/AAAA.
            const horaBR = dataAtual.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); // Isola as horas e minutos (HH:MM).
            const carimboCriacao = `${diaBR} às ${horaBR}`; // Une os fragmentos criando o log definitivo (Ex: 31/05/2026 às 19:55).

            // Empurra a nova tarefa estruturada injetando o carimbo estável do relógio e o nome do usuário logado fixo "Victor Faustino" por segurança de auditoria.
            dadosLocais.tarefas.push({ 
                texto: txt, 
                data: data, 
                criadoPor: "Victor Faustino", // Assina inalteravelmente com o seu usuário reativo de sessão.
                dataCriacao: carimboCriacao // Assina inalteravelmente com a minutagem eletrônica de entrada.
            }); 

            callbackRecarregarAba(); // Redesenha a lista fazendo o novo agendamento brilhar na tela com os carimbos consolidados instantaneamente.
        });

    } else if (abaAtiva === 'anotacoes') { // Caso o operador alterne o visor para a aba de Histórico de Conversas e Atendimentos ricos.
        containerAbaConteudo.innerHTML = ` <div style="background: white; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 15px; flex-shrink: 0; display: flex; flex-direction: column; gap: 8px;"> <h4 style="font-size: 13px; font-weight: bold; color: #1e293b; margin: 0;">📝 Registrar Nova Interação / Conversa com o Cliente</h4> <textarea id="nova-nota-texto" rows="3" placeholder="Digite aqui o resumo da ligação, o acordo de parcelamento firmado ou a desculpa enviada pelo devedor..." style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 13px; resize: none;"></textarea> <div style="display: flex; justify-content: flex-end;"> <button type="button" id="btn-registrar-nota-lista" style="background: #10b981; color: white; border: none; padding: 6px 15px; border-radius: 4px; font-weight: bold; font-size: 12px; cursor: pointer;">Registrar Anotação</button> </div> </div> <div id="lista-notas-cronologica-rolavel" style="overflow-y: auto; flex-grow: 1; display: flex; flex-direction: column; gap: 10px; padding-right: 5px;"></div> `; // Injeta o campo de texto rico de logs e o contêiner de linha do tempo cronológica.

        const listaNotas = document.getElementById('lista-notas-cronologica-rolavel'); // Captura a área de injeção da linha do tempo física vertical.
        const notasExibicao = dadosLocais.historicoNotas.length > 0 
          ? [...dadosLocais.historicoNotas] 
          : [{ conteudo: "Lote antigo de cobrança importado para o CRM", dataHora: dadosLocais.dataEnvio || "Histórico de Origem" }]; // Garante suporte estável retroativo de logs a contas antigas importadas.

        if (notasExibicao.length === 0) { // Checação de segurança estrutural.
            listaNotas.innerHTML = `<div style="text-align: center; color: #94a3b8; font-size: 13px; padding-top: 40px; font-style: italic;">Nenhum histórico ou nota registrada para este devedor até o momento.</div>`; // Mensagem de linha do tempo limpa.
        } else { // Caso existam notas gravadas ou logs de transição automáticos gerados pelo sistema.
            [...notasExibicao].reverse().forEach((nota) => { // Clona e inverte o lote fazendo os atendimentos mais frescos surgirem sempre no topo da linha do tempo.
                const blocoNota = document.createElement('div'); // Fabrica o bloco de card da nota.
                blocoNota.style.cssText = 'background: white; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px; border-left: 4px solid #10b981; box-shadow: 0 1px 2px rgba(0,0,0,0.02);'; // Design elegante com borda sólida verde indicadora de nota oficial.
                blocoNota.innerHTML = ` <div style="display: flex; justify-content: space-between; font-size: 11px; color: #64748b; font-weight: 600; margin-bottom: 6px; background: #f8fafc; padding: 2px 6px; border-radius: 4px;"> <span>⏱️ Registro de Atendimento</span> <span>${nota.dataHora}</span> </div> <p style="font-size: 13px; color: #334155; margin: 0; white-space: pre-line; line-height: 1.5;">"${nota.conteudo}"</p> `; // Injeta o cabeçalho com o relógio de auditoria e a descrição rica da conversa.
                listaNotas.appendChild(blocoNota); // Fixa a nota estruturada na linha do tempo vertical rolável da tela.
            });
        }

        document.getElementById('btn-registrar-nota-lista').addEventListener('click', () => { // Intercepta a criação de novas anotações de conversas ricas no clique do botão verde.
            const conteudoTxt = document.getElementById('nova-nota-texto').value.trim(); // Captura o resumo de texto digitado removendo espaçamentos quebrados falsos.

            if (!conteudoTxt) { // Trava de segurança contra salvamentos vazios ou desinteressados.
                alert('Por favor, digite o resumo do atendimento antes de salvar a anotação!'); // Alerta a interface.
                return; // Aborta imediatamente o salvamento blindando o banco contra notas fantasmas.
            } // Encerra validação.

            const agora = new Date(); // Registra as configurações de calendário do computador do operador no exato segundo.
            const dataFormatada = agora.toLocaleDateString('pt-BR'); // Converte a data automática para o formato clássico nacional (DD/MM/AAAA).
            const horaFormatada = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); // Filtra o relógio para horas e minutos precisos (HH:MM).
            const carimboDataHora = `${dataFormatada} às ${horaFormatada}`; // Mescla criando o carimbo oficial de auditoria da nota.

            dadosLocais.historicoNotas.push({ conteudo: conteudoTxt, dataHora: carimboDataHora }); // Empurra a nova anotação estruturada para a memória provisória.
            callbackRecarregarAba(); // Recarrega o painel direito redesenhando a linha do tempo com a nova conversa brilhando no topo da lista.
        });
    }
  } // Encerra a renderização unificada de tarefas e notas.
}; // Encerra a exportação do sub-módulo de abas clássicas.