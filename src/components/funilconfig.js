export const funilConfigComponent = { // Define e exporta o módulo de configuração do funil para que possa ser gerenciado pelo arquivo maestro app.js.
  renderizar(elementoContainer, listaEtapas, callbackSalvar) { // Cria a função que desenha a tela de configuração recebendo o local físico, os nomes atuais das colunas e a ação de salvar.
    
    const etapasLocais = Array.isArray(listaEtapas) ? JSON.parse(JSON.stringify(listaEtapas)) : []; // Cria uma cópia isolada na memória das etapas para podermos alterar livremente antes de salvar na nuvem.
    
    elementoContainer.innerHTML = ` <div id="modal-config-funil" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 2000; padding: 10px;"> <div style="background: white; padding: 30px; border-radius: 8px; width: 100%; max-width: 550px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); max-height: 90vh; display: flex; flex-direction: column;"> <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0; flex-shrink: 0;"> <h3 style="color: #1e293b; font-size: 18px; margin: 0;">⚙️ Personalizar Etapas do Funil</h3> <button id="btn-fechar-config" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #94a3b8;">&times;</button> </div> <p style="font-size: 13px; color: #64748b; margin-bottom: 15px; flex-shrink: 0;">Crie, edite ou apague as etapas do seu processo de cobrança com total autonomia. Adicione quantas colunas forem necessárias para a sua jornada.</p> <div id="lista-etapas-config" style="overflow-y: auto; flex-grow: 1; margin-bottom: 15px; padding-right: 5px;"></div> <div style="margin-bottom: 15px; flex-shrink: 0;"> <button type="button" id="btn-adicionar-etapa" style="background-color: #f1f5f9; color: #1e293b; padding: 10px; border: 2px dashed #cbd5e1; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 13px; width: 100%; text-align: center; transition: all 0.2s;">+ Adicionar Nova Etapa</button> </div> <div style="display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #e2e8f0; padding-top: 15px; flex-shrink: 0;"> <button type="button" id="btn-cancelar-config" style="background-color: #64748b; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px;">Cancelar</button> <button type="button" id="btn-salvar-funil-geral" style="background-color: #2563eb; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px;">Salvar Alterações</button> </div> </div> </div> <div id="modal-confirmacao-exclusao" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: none; justify-content: center; align-items: center; z-index: 3000; padding: 10px;"> <div style="background: white; padding: 25px; border-radius: 8px; width: 100%; max-width: 400px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);"> <h4 style="color: #991b1b; font-size: 16px; margin-bottom: 12px;">⚠️ Deseja excluir esta etapa do Funil?</h4> <p style="font-size: 13px; color: #475569; margin-bottom: 15px;">Ao confirmar a remoção, a coluna sumirá do seu painel Kanban. Certifique-se de mover os clientes desta coluna antes.</p> <label style="display: flex; align-items: flex-start; gap: 8px; font-size: 12px; color: #1e293b; cursor: pointer; margin-bottom: 20px; user-select: none;"> <input type="checkbox" id="chk-ciente-exclusao" style="margin-top: 2px;"> <span>Entendo que ao excluir não conseguirei recuperar a informação de forma direta nesta tela.</span> </label> <div style="display: flex; justify-content: flex-end; gap: 10px;"> <button type="button" id="btn-cancelar-exclusao-tela" style="background-color: #cbd5e1; color: #334155; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600;">Cancelar</button> <button type="button" id="btn-confirmar-exclusao-permanente" disabled style="background-color: #ef4444; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: not-allowed; font-size: 12px; font-weight: 600; opacity: 0.5;">Excluir permanentemente</button> </div> </div> </div> `; // Injeta o código HTML e CSS estrutural do modal principal e da janela oculta de confirmação de lixeira.

    const listaContainer = document.getElementById('lista-etapas-config'); // Localiza o container interno rolável onde as linhas de etapas serão desenhadas.
    const btnAdicionar = document.getElementById('btn-adicionar-etapa'); // Localiza o botão tracejado de criar etapas.
    const modalExclusao = document.getElementById('modal-confirmacao-exclusao'); // Captura a janela secreta de confirmação de exclusão.
    const chkCiente = document.getElementById('chk-ciente-exclusao'); // Captura a caixinha de checação de termos de risco.
    const btnConfirmarExclusao = document.getElementById('btn-confirmar-exclusao-permanente'); // Captura o botão vermelho de exclusão permanente.
    
    let indexParaExcluir = null; // Cria uma variável de controle para registrar qual linha do array o usuário deseja deletar quando clica na lixeira.

    const desenharEtapasLocais = () => { // Cria a rotina interna que passa desenhando as caixas de texto com base no estado atual da memória do app.
      listaContainer.innerHTML = ''; // Limpa a listagem anterior para evitar duplicações visuais durante a montagem da tela.
      
      etapasLocais.forEach((etapa, idx) => { // Inicia uma varredura passando etapa por etapa do nosso array dinâmico de colunas.
        const linha = document.createElement('div'); // Cria um bloco de linha HTML para envolver os comandos daquela etapa específica.
        linha.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-bottom: 10px; background: #f8fafc; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px;'; // Aplica o design de card cinza claro com bordas finas.
        linha.innerHTML = ` <span style="font-size: 12px; color: #94a3b8; font-weight: bold; width: 20px;">#${idx + 1}</span> <input type="text" class="input-nome-etapa" data-index="${idx}" value="${etapa.nome}" required style="flex-grow: 1; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 13px; color: #1e293b;"> <button type="button" class="btn-deletar-etapa" data-index="${idx}" title="Excluir Etapa" style="background: none; border: none; color: #94a3b8; cursor: pointer; padding: 6px; display: flex; align-items: center; justify-content: center; border-radius: 4px; transition: all 0.2s;"> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events: none;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg> </button> `; // Desenha o número da etapa, a caixa de texto com o nome e o botão de lixeira correspondente.
        listaContainer.appendChild(linha); // Insere o card da linha montada fisicamente dentro do painel rolável do modal.
      }); // Encerra a varredura das etapas.

      document.querySelectorAll('.btn-deletar-etapa').forEach(btn => { // Localiza todas as lixeiras recém-desenhadas na página.
        btn.addEventListener('mouseenter', (e) => e.currentTarget.style.color = '#ef4444'); // Pinta a lixeira de vermelho quando o mouse entra nela para indicar aviso de exclusão.
        btn.addEventListener('mouseleave', (e) => e.currentTarget.style.color = '#94a3b8'); // Devolve a cor cinza discreta original quando o mouse se afasta do botão.
        btn.addEventListener('click', (e) => { // Configura o monitor do clique na lixeira para disparar o protocolo de segurança.
          indexParaExcluir = parseInt(e.currentTarget.getAttribute('data-index')); // Captura a numeração exata da etapa escolhida para exclusão sem riscos.
          chkCiente.checked = false; // Força a caixinha de visto de responsabilidade a iniciar totalmente limpa e desmarcada.
          btnConfirmarExclusao.disabled = true; // Mantém o botão final vermelho de exclusão travado por segurança contra cliques acidentais.
          btnConfirmarExclusao.style.cursor = 'not-allowed'; // Modifica o mouse para o símbolo de proibido em cima do botão bloqueado.
          btnConfirmarExclusao.style.opacity = '0.5'; // Ofusca o brilho do botão reforçando visualmente o impedimento do comando.
          modalExclusao.style.display = 'flex'; // Abre a janela preta de confirmação crítica exigindo a validação humana.
        }); // Encerra o monitoramento da lixeira.
      }); // Encerra a vinculação das lixeiras.

      document.querySelectorAll('.input-nome-etapa').forEach(input => { // Localiza todas as caixas de digitação de nomes de etapas.
        input.addEventListener('input', (e) => { // Monitora cada letra que o usuário digita ou apaga dentro da caixinha.
          const idx = parseInt(e.target.getAttribute('data-index')); // Descobre qual linha do array o usuário está editando naquele exato momento.
          etapasLocais[idx].nome = e.target.value; // Atualiza o nome da etapa na memória provisória com as letras digitadas.
        }); // Encerra a escuta do input.
      }); // Encerra a vinculação dos inputs.
    }; // Encerra a função interna de desenho das linhas.

    desenharEtapasLocais(); // Executa o desenho imediato das etapas originais assim que o modal de configurações se abre na tela.

    btnAdicionar.addEventListener('click', () => { // Escuta o clique no botão tracejado de "+ Adicionar Nova Etapa".
      const novoId = `etapa_${Date.now()}`; // Cria um identificador eletrônico único inviolável baseado nos milissegundos exatos do relógio do computador.
      etapasLocais.push({ id: novoId, nome: 'Nova Etapa' }); // Adiciona uma nova ficha de coluna na memória provisória com o nome temporário 'Nova Etapa'.
      desenharEtapasLocais(); // Reexecuta o desenho completo da tela fazendo a nova linha nascer de forma reativa na lista.
      listaContainer.scrollTop = listaContainer.scrollHeight; // Rola a barra vertical de forma automática para o final para mostrar o novo campo criado.
    }); // Encerra o monitoramento do botão de inserção.

    chkCiente.addEventListener('change', (e) => { // Escuta o clique de marcação na caixinha do termo de responsabilidade de dados.
      if (e.target.checked) { // Se o usuário marcou o visto confirmando que leu e aceita as consequências do descarte.
        btnConfirmarExclusao.disabled = false; // Destrava e libera o botão vermelho de exclusão permanente para receber cliques.
        btnConfirmarExclusao.style.cursor = 'pointer'; // Modifica o ponteiro do mouse para a mãozinha indicando que a ação está autorizada.
        btnConfirmarExclusao.style.opacity = '1'; // Devolve o brilho total e a cor vermelha viva ao botão.
      } else { // Caso o usuário desmarque o visto ou desista do termo.
        btnConfirmarExclusao.disabled = true; // Bloqueia o botão vermelho novamente na hora.
        btnConfirmarExclusao.style.cursor = 'not-allowed'; // Retorna o mouse para o símbolo de proibido.
        btnConfirmarExclusao.style.opacity = '0.5'; // Ofusca o botão reforçando a impossibilidade do comando.
      } // Encerra a checação da caixinha.
    }); // Encerra a escuta do checkbox.

    document.getElementById('btn-confirmar-exclusao-permanente').addEventListener('click', () => { // Escuta o clique no botão vermelho liberado.
      if (indexParaExcluir !== null) { // Garante que existe uma numeração de linha guardada para ser removida com precisão.
        etapasLocais.splice(indexParaExcluir, 1); // Remove cirurgicamente aquela linha específica de dentro do nosso array de memória provisória.
        indexParaExcluir = null; // Zera a variável de controle liberando-a para futuros comandos de lixeira.
        modalExclusao.style.display = 'none'; // Esconde a janela de aviso crítico da tela do navegador.
        desenharEtapasLocais(); // Redesenha a lista do funil atualizada sem a linha que foi triturada pela lixeira.
      } // Encerra a checação de precisão.
    }); // Encerra a escuta da confirmação de exclusão.

    document.getElementById('btn-cancelar-exclusao-tela').addEventListener('click', () => { // Escuta o clique no botão de cancelar da lixeira.
      modalExclusao.style.display = 'none'; // Fecha e oculta a janela vermelha de perigo preservando a etapa intacta na lista.
      indexParaExcluir = null; // Limpa a variável de controle por segurança.
    }); // Encerra a escuta do cancelamento da lixeira.

    const fecharModal = () => { // Cria o comando que limpa o container removendo o modal da tela.
      elementoContainer.innerHTML = ''; // Esvazia o conteúdo do container físico deixando ele limpo novamente.
    }; // Encerra a função de fechamento.

    document.getElementById('btn-fechar-config').addEventListener('click', fecharModal); // Fecha as configurações se clicar no 'X' superior abandonando rascunhos.
    document.getElementById('btn-cancelar-config').addEventListener('click', fecharModal); // Fecha as configurações se clicar no botão cinza de cancelar descartando rascunhos.

    document.getElementById('btn-salvar-funil-geral').addEventListener('click', () => { // Monitora o clique no botão azul principal de "Salvar Alterações".
      const inputs = document.querySelectorAll('.input-nome-etapa'); // Coleta todas as caixas de texto de etapas ativas na tela para verificação.
      let valido = true; // Cria uma bandeira lógica assumindo que o formulário está preenchido corretamente.
      
      inputs.forEach(i => { // Passa caixinha por caixinha validando se o usuário deixou alguma etapa sem nome.
        if (!i.value.trim()) { // Se encontrar alguma etapa vazia ou preenchida apenas com espaços em branco.
          valido = false; // Derruba a bandeira lógica classificando o formulário como inválido.
          i.style.borderColor = '#ef4444'; // Pinta as bordas daquela caixa de vermelho para alertar o erro de digitação.
        } else { // Caso a caixa possua um termo válido digitado.
          i.style.borderColor = '#cbd5e1'; // Mantém as bordas na cor cinza neutra padrão de conformidade.
        } // Encerra a validação da caixa.
      }); // Encerra a passagem pelos inputs.

      if (!valido) { // Se a bandeira de validação foi derrubada por campos em branco.
        alert('Por favor, preencha os nomes de todas as etapas antes de salvar!'); // Exibe um alerta de segurança avisando que não é permitido criar colunas sem nome.
        return; // Aborta imediatamente o salvamento blindando o banco de dados.
      } // Encerra o movimento de bloqueio de segurança.

      callbackSalvar(etapasLocais); // Dispara a função mestre (callback) enviando o array completo expandido e editado para o arquivo app.js gravar no Firebase.
      fecharModal(); // Fecha e limpa o painel de configurações deixando a tela do seu CRM livre novamente.
    }); // Encerra o monitoramento do clique do botão de salvamento geral.
  } // Encerra a função principal de renderização do componente de parametrização dinâmica do funil.
}; // Encerra a exportação do objeto estrutural do componente funilConfig.