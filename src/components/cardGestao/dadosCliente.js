import { cadastroContatos } from "../cadastros/cadastroContatos"; // [Dev Sênior] Conecta as chaves do nosso novo motor centralizado de validações e máscaras eletrônicas de telefones e e-mails.

export const dadosCliente = { // [Dev Sênior] Define e exporta o sub-módulo responsável por gerenciar a lateral esquerda de dados essenciais da conta.
  renderizar(containerEsquerdo, dadosLocais, callbackSalvarNuvem, callbackFecharModal) { // [Dev Sênior] Função de renderização que recebe os elementos físicos do pai e as ações de salvamento permanente.
    
    // REGRA DE PO: Inicializa uma lista de múltiplos contatos na memória caso o card venha do Firebase apenas com a estrutura antiga de um contato único.
    if (!dadosLocais.contatos || !Array.isArray(dadosLocais.contatos)) { // [Dev Sênior] Verifica se o vetor de contatos múltiplos existe ou está corrompido na ficha do cliente.
      dadosLocais.contatos = dadosLocais.contato && dadosLocais.contato.nome ? [{ ...dadosLocais.contato }] : [{ nome: '', telefone: '', email: '', vinculo: 'proprio' }]; // [Dev Sênior] Clona o contato único legado na primeira prateleira ou cria uma estrutura limpa vazia.
    } // [Dev Sênior] Encerra o provisionamento preventivo de contatos.

    let cobrancaAberta = true; // [Dev Sênior] Cria uma variável de controle para registrar se a pasta financeira está expandida ou oculta.
    let contatoAberto = false; // [Dev Sênior] Cria uma variável de controle para registrar se a pasta de telefones de relacionamento está expandida ou oculta.

    // Função que limpa textos formatados em dinheiro transformando-os em números decimais puros para o banco de dados.
    const limparMoedaParaNumero = (valorTexto) => { // [Dev Sênior] Inicializa a calculadora que limpa pontos e vírgulas da moeda.
      if (typeof valorTexto !== 'string') return parseFloat(valorTexto) || 0; // [Dev Sênior] Se o valor já for numérico puro, preserva a sua integridade decimal.
      const textoLimpo = valorTexto.replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, ''); // [Dev Sênior] Apaga pontos de milhar, inverte a vírgula e limpa textos.
      return parseFloat(textoLimpo) || 0; // [Dev Sênior] Entrega o número decimal puro pronto para gravação e relatórios de pipeline.
    }; // [Dev Sênior] Encerra a limpeza de moeda.

    // [Dev Sênior] REMOVIDA A LOGAL LOCAL ANTIGA 'aplicarMascaraTelefone' PARA EVITAR DUPLICIDADE, POIS AGORA O SISTEMA CHAMA O MOTOR CENTRALIZADO DO CADASTROCONTATOS.

    // [Dev Sênior] REMOVIDA A LOGAL LOCAL ANTIGA 'validarSintaxeEmail' PARA GARANTIR GOVERNANÇA, DEIXANDO A CHECAGEM EXCLUSIVA COM O CADASTROCONTATOS.

    const atualizarLayoutEsquerdo = () => { // [Dev Sênior] Função interna mestre responsável por redesenhar os blocos e travar botões reativamente na interface.
      
      // Formata o valor bruto da carteira para a leitura visual monetária em português com centavos antes de colar na caixa.
      const valorFormatadoTela = (dadosLocais.valorVencido || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); // [Dev Sênior] Transforma o número puro em moeda nacional legível.

      containerEsquerdo.innerHTML = `
        <div style="border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; background: #ffffff; box-shadow: 0 1px 2px rgba(0,0,0,0.02);">
          <div id="gatilho-toggle-cobranca" style="background: #f8fafc; padding: 10px 15px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; border-bottom: ${cobrancaAberta ? '1px solid #cbd5e1' : 'none'}; user-select: none;">
            <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; margin: 0; font-weight: bold;">📋 Informações da Cobrança</h3>
            <span style="font-size: 14px; color: #94a3b8;">${cobrancaAberta ? '▲' : '▼'}</span> </div>
          
          <div id="corpo-secao-cobranca" style="padding: 15px; display: ${cobrancaAberta ? 'flex' : 'none'}; flex-direction: column; gap: 12px;">
              <div>
                  <label style="display: block; font-size: 11px; font-weight: bold; color: #475569; margin-bottom: 4px;">Responsável pela Cobrança</label>
                  <input type="text" id="gestao-responsavel" value="${dadosLocais.responsavel}" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 13px;">
              </div>
              <div>
                  <label style="display: block; font-size: 11px; font-weight: bold; color: #475569; margin-bottom: 4px;">Valor Vencido (R$)</label>
                  <input type="text" id="gestao-vencido" value="${valorFormatadoTela}" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 13px; color: #ef4444; font-weight: bold;">
              </div>
              <div>
                  <label style="display: block; font-size: 11px; font-weight: bold; color: #475569; margin-bottom: 4px;">Observações</label>
                  <textarea id="gestao-observacao" rows="2" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 13px; resize: none; line-height: 1.4;">${dadosLocais.observacao}</textarea>
              </div>
          </div>
        </div>

        <div style="border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; background: #ffffff; margin-top: 12px; box-shadow: 0 1px 2px rgba(0,0,0,0.02);">
          <div id="gatilho-toggle-contato" style="background: #f8fafc; padding: 10px 15px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; border-bottom: ${contatoAberto ? '1px solid #cbd5e1' : 'none'}; user-select: none;">
            <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; margin: 0; font-weight: bold;">📞 Informações de Contato</h3>
            <span style="font-size: 14px; color: #94a3b8;">${contatoAberto ? '▲' : '▼'}</span> </div>
          
          <div id="corpo-secao-contato" style="padding: 15px; display: ${contatoAberto ? 'flex' : 'none'}; flex-direction: column; gap: 12px; max-height: 280px; overflow-y: auto;">
              <div id="grade-lista-contatos-dinamica" style="display: flex; flex-direction: column; gap: 12px;">
                  ${dadosLocais.contatos.map((itemContato, idx) => `
                      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 6px; display: flex; flex-direction: column; gap: 8px; position: relative;">
                          ${dadosLocais.contatos.length > 1 ? `<button type="button" class="btn-remover-linha-contato" data-index="${idx}" style="position: absolute; top: 5px; right: 5px; background: none; border: none; color: #ef4444; font-size: 11px; cursor: pointer; font-weight: bold;" title="Remover contato">🗑️ Deletar</button>` : ''}
                          
                          <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 8px;">
                              <div>
                                  <label style="display: block; font-size: 10px; font-weight: bold; color: #64748b; margin-bottom: 2px;">Nome</label>
                                  <input type="text" class="input-dinamico-contato-nome" data-index="${idx}" maxlength="40" value="${itemContato.nome || ''}" placeholder="Ex: Maria" style="width: 100%; padding: 5px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px;">
                              </div>
                              <div>
                                  <label style="display: block; font-size: 10px; font-weight: bold; color: #64748b; margin-bottom: 2px;">Vínculo / Relacionamento</label>
                                  <select class="select-dinamico-contato-vinculo" data-index="${idx}" style="width: 100%; padding: 5px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; background: white; font-weight: 500; color: #334155;">
                                      <option value="proprio" ${itemContato.vinculo === 'proprio' ? 'selected' : ''}>👤 Próprio Devedor</option>
                                      <option value="socio" ${itemContato.vinculo === 'socio' ? 'selected' : ''}>💼 Sócio / Repres. Legal</option>
                                      <option value="conjuge" ${itemContato.vinculo === 'conjuge' ? 'selected' : ''}>🏠 Cônjuge / Parceiro(a)</option>
                                      <option value="familiar" ${itemContato.vinculo === 'familiar' ? 'selected' : ''}>👥 Familiar Próximo</option>
                                      <option value="colega" ${itemContato.vinculo === 'colega' ? 'selected' : ''}>🏢 Colega de Trabalho</option>
                                      <option value="terceiro" ${itemContato.vinculo === 'terceiro' ? 'selected' : ''}>📞 Terceiro Recado</option>
                                  </select>
                              </div>
                          </div>
                          
                          <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 8px;">
                              <div>
                                  <label style="display: block; font-size: 10px; font-weight: bold; color: #64748b; margin-bottom: 2px;">Telefone</label>
                                  <input type="text" class="input-dinamico-contato-telefone" data-index="${idx}" value="${itemContato.telefone || ''}" placeholder="(00) 00000-0000" style="width: 100%; padding: 5px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; font-weight: 600;">
                              </div>
                              <div>
                                  <label style="display: block; font-size: 10px; font-weight: bold; color: #64748b; margin-bottom: 2px;">E-mail Cadastral</label>
                                  <input type="text" class="input-dinamico-contato-email" data-index="${idx}" value="${itemContato.email || ''}" placeholder="nome@empresa.com" style="width: 100%; padding: 5px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; border-color: ${cadastroContatos.validarSintaxeEmail(itemContato.email) ? '#cbd5e1' : '#ef4444'}; background: ${cadastroContatos.validarSintaxeEmail(itemContato.email) ? '#ffffff' : '#fef2f2'};">
                              </div>
                          </div>
                      </div>
                  `).join('')}
              </div>
              <button type="button" id="btn-adicionar-nova-linha-contato" style="background: none; border: 1px dashed #2563eb; color: #2563eb; padding: 6px; border-radius: 4px; font-size: 12px; font-weight: bold; cursor: pointer; text-align: center; width: 100%; margin-top: 5px;">➕ Adicionar outro contato</button>
          </div>
        </div>

        <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e2e8f0; display: flex; gap: 10px; align-items: center;">
            <button type="button" id="btn-salvar-gestao-dados" style="flex: 2; background: #2563eb; color: white; padding: 10px; border: none; border-radius: 6px; font-weight: bold; font-size: 13px; cursor: pointer; text-align: center;">💾 Salvar Alterações</button>
            <button type="button" id="btn-excluir-cobranca-total" style="flex: 1; background: #fff; color: #ef4444; padding: 10px; border: 1px solid #fca5a5; border-radius: 6px; font-weight: 600; font-size: 12px; cursor: pointer; text-align: center; transition: background 0.2s;">❌ Excluir</button>
        </div>
      `; // [Dev Sênior] Fecha o modelo estrutural HTML da aba esquerda de dados.

      // Captura e vincula os listeners reativos para sincronismo das observações e operadores de caixa.
      document.getElementById('gestao-responsavel').addEventListener('input', (e) => { dadosLocais.responsavel = e.target.value.trim(); }); // [Dev Sênior] Ouve a digitação do operador dono da carteira.
      document.getElementById('gestao-observacao').addEventListener('input', (e) => { dadosLocais.observacao = e.target.value.trim(); }); // [Dev Sênior] Ouve as anotações fiscais digitadas na caixa grande.
      
      // Captura o desfoque (blur) do valor vencido re-formatando o input com pontos de milhares automáticos.
      document.getElementById('gestao-vencido').addEventListener('blur', (e) => { // [Dev Sênior] Intercepta a saída do cursor do campo de saldo devedor principal.
          dadosLocais.valorVencido = limparMoedaParaNumero(e.target.value); // [Dev Sênior] Executa o limpador numérico removendo os pontos para salvar no Firebase.
          atualizarLayoutEsquerdo(); // [Dev Sênior] Redesenha a lateral atualizando o visor.
      }); // [Dev Sênior] Fecha a escuta de valores.

      // Captura e injeta inteligência nos campos múltiplos de contatos em formato de lote.
      if (contatoAberto) { // [Dev Sênior] Só acopla as escutas na árvore se a pasta de telefones de relacionamento estiver aberta em tela.
          containerEsquerdo.querySelectorAll('.input-dinamico-contato-nome').forEach(input => { // [Dev Sênior] Varre as caixas de digitação de nomes dos contatos.
              input.addEventListener('input', (e) => { // [Dev Sênior] Ouve cada tecla digitada no nome.
                  const idx = parseInt(e.target.getAttribute('data-index')); // [Dev Sênior] Isola o ponteiro da linha correspondente.
                  dadosLocais.contatos[idx].nome = e.target.value; // [Dev Sênior] Salva o nome na linha certa do array.
              }); // [Dev Sênior] Encerra a comanda do nome.
          }); // [Dev Sênior] Encerra o mapeamento de nomes.

          containerEsquerdo.querySelectorAll('.input-dinamico-contato-telefone').forEach(input => { // [Dev Sênior] Varre as caixas de digitação de telefones.
              input.addEventListener('input', (e) => { // [Dev Sênior] Ouve cada algarismo digitado pelo cobrador.
                  const idx = parseInt(e.target.getAttribute('data-index')); // [Dev Sênior] Isola o ponteiro da linha correspondente.
                  e.target.value = cadastroContatos.higienizarTelefone(e.target.value); // [Dev Sênior] Aciona o motor centralizado para formatar e travar o telefone com o DDD e hífen reativamente.
                  dadosLocais.contatos[idx].telefone = e.target.value; // [Dev Sênior] Copia o número mascarado para a memória.
              }); // [Dev Sênior] Encerra a comanda do telefone.
          }); // [Dev Sênior] Encerra o mapeamento de telefones.

          containerEsquerdo.querySelectorAll('.input-dinamico-contato-email').forEach(input => { // [Dev Sênior] Varre as caixas de digitação de e-mails.
              input.addEventListener('input', (e) => { // [Dev Sênior] CORREÇÃO DE LOGÍSTICA: Trocado de 'blur' com re-renderização para 'input' direto na chave de memória para não quebrar o clique do botão de salvar.
                  const idx = parseInt(e.target.getAttribute('data-index')); // [Dev Sênior] Isola o ponteiro da linha correspondente.
                  dadosLocais.contatos[idx].email = e.target.value.trim(); // [Dev Sênior] Sincroniza o texto limpo na memória de forma silenciosa e estável.
                  
                  // [Dev Sênior] Executa o realce elástico pintando a caixa de vermelho inline caso o operador apague o arroba (@) sem dar crash na árvore.
                  if (cadastroContatos.validarSintaxeEmail(e.target.value.trim())) { // [Dev Sênior] Se o e-mail for válido.
                      e.target.style.borderColor = '#cbd5e1'; e.target.style.background = '#ffffff'; // [Dev Sênior] Devolve as cores brancas de repouso normais.
                  } else { // [Dev Sênior] Caso o e-mail esteja corrompido ou incompleto.
                      e.target.style.borderColor = '#ef4444'; e.target.style.background = '#fef2f2'; // [Dev Sênior] Pinta os contornos inline de vermelho de atenção.
                  } // [Dev Sênior] Encerra o semáforo de caixa.
              }); // [Dev Sênior] Encerra a comanda do e-mail.
          }); // [Dev Sênior] Encerra o mapeamento de e-mails.

          containerEsquerdo.querySelectorAll('.select-dinamico-contato-vinculo').forEach(select => { // [Dev Sênior] Varre as caixas de seleção suspensa de parentescos.
              select.addEventListener('change', (e) => { // [Dev Sênior] Ouve a troca de opção de relacionamento.
                  const idx = parseInt(e.target.getAttribute('data-index')); // [Dev Sênior] Isola o ponteiro da linha correspondente.
                  dadosLocais.contatos[idx].vinculo = e.target.value; // [Dev Sênior] Sincroniza a escolha de relacionamento.
              }); // [Dev Sênior] Encerra a comanda de vínculo.
          }); // [Dev Sênior] Encerra o mapeamento de vínculos.

          // Ouve o clique do botão tracejado azul fabricando uma nova linha de contato em branco na base da grade.
          document.getElementById('btn-adicionar-nova-linha-contato').addEventListener('click', () => { // [Dev Sênior] Monitora o clique no botão tracejado azul.
              dadosLocais.contatos.push({ nome: '', telefone: '', email: '', vinculo: 'terceiro' }); // [Dev Sênior] Povoa o lote com uma estrutura limpa vazia de recado.
              atualizarLayoutEsquerdo(); // [Dev Sênior] Redesenha abrindo a nova linha de inputs instantaneamente.
          }); // [Dev Sênior] Encerra o monitor de nova linha.

          // Ouve o clique no rótulo de lixeira vermelha apagando de vez aquela linha de contato específica.
          containerEsquerdo.querySelectorAll('.btn-remover-linha-contato').forEach(btnRem => { // [Dev Sênior] Varre as lixeiras vermelhas de contatos adicionados.
              btnRem.addEventListener('click', (e) => { // [Dev Sênior] Ouve o clique de descarte da linha.
                  const idx = parseInt(e.target.getAttribute('data-index')); // [Dev Sênior] Isola o ponteiro da linha correspondente.
                  dadosLocais.contatos.splice(idx, 1); // [Dev Sênior] Corta a linha selecionada do array provisório.
                  atualizarLayoutEsquerdo(); // [Dev Sênior] Redesenha atualizando a grade na tela.
              }); // [Dev Sênior] Encerra a lixeira.
          }); // [Dev Sênior] Encerra o mapeamento de lixeiras.
      } // [Dev Sênior] Encerra as travas de contatos abertos.

      // Amarra os cliques de expansão minimalistas das setas superiores.
      document.getElementById('gatilho-toggle-cobranca').addEventListener('click', () => { // [Dev Sênior] Ouve o clique na pasta de dados financeiros.
          cobrancaAberta = !cobrancaAberta; // [Dev Sênior] Alterna a exibição do bloco financeiro.
          atualizarLayoutEsquerdo(); // [Dev Sênior] Redesenha a tela colapsando o bloco.
      }); // [Dev Sênior] Encerra o colapsador financeiro.

      document.getElementById('gatilho-toggle-contato').addEventListener('click', () => { // [Dev Sênior] Ouve o clique na pasta de contatos de relacionamento.
          contatoAberto = !contatoAberto; // [Dev Sênior] Alterna a exibição da grade de contatos de relacionamento.
          atualizarLayoutEsquerdo(); // [Dev Sênior] Redesenha a tela abrindo as caixas.
      }); // [Dev Sênior] Encerra o colapsador de contatos.

      // Configura os efeitos visuais de hover no botão vermelho de exclusão total.
      const btnExcluir = document.getElementById('btn-excluir-cobranca-total'); // [Dev Sênior] Localiza o botão físico de lixeira de card do rodapé.
      btnExcluir.addEventListener('mouseenter', () => btnExcluir.style.backgroundColor = '#fef2f2'); // [Dev Sênior] Aplica fundo coral claro no mouseover.
      btnExcluir.addEventListener('mouseleave', () => btnExcluir.style.backgroundColor = 'transparent'); // [Dev Sênior] Reseta para transparente no mouseleave.

      btnExcluir.addEventListener('click', () => { // Protocolo rigoroso de segurança humana para descarte de devedor.
        const confirmacao = confirm(`⚠️ ATENÇÃO MÁXIMA AUDITORIA:\nDeseja deletar permanentemente a cobrança do cliente "${dadosLocais.cliente}"?\n\nEsta operação é irreversível e removerá todos os históricos, valores e tarefas associadas na nuvem do Firebase!`); // [Dev Sênior] Exige o visto de responsabilidade humana.
        if (confirmacao) { // [Dev Sênior] Se o operador confirmar a destruição da conta.
          callbackSalvarNuvem(dadosLocais.id, null); // [Dev Sênior] Envia o ID e status nulo autorizando a exclusão definitiva no Firebase.
          callbackFecharModal(); // [Dev Sênior] Descarta e fecha o modal limpando a tela.
        } // [Dev Sênior] Encerra o crivo.
      }); // [Dev Sênior] Encerra a lixeira master de rodapé.

      // Intercepta e processa o clique no botão azul "Salvar Alterações" consolidando os dados.
      document.getElementById('btn-salvar-gestao-dados').addEventListener('click', () => { // [Dev Sênior] Monitora o clique de confirmação do botão azul grande.
        
        // CRIVO CRÍTICO: Varre todas as linhas de e-mail salvas na memória local. Se houver alguma inválida (sem arroba @), cancela o salvamento usando o motor centralizado.
        const existeEmailCorrompido = dadosLocais.contatos.some(c => c.email && !cadastroContatos.validarSintaxeEmail(c.email)); // [Dev Sênior] Passa a peneira caçando formatos quebrados no vetor.
        if (existeEmailCorrompido) { // [Dev Sênior] Se a bandeira acusar e-mails rasgados ou sem arroba.
            alert('⚠️ TRAVA DE SEGURANÇA CADASTRAL:\nExistem e-mails com formatos inválidos na lista de contatos (Falta o caractere @ ou terminação .com)!\n\nPor favor, corrija os campos marcados em vermelho antes de tentar salvar as alterações.'); // [Dev Sênior] Alerta a interface.
            return; // [Dev Sênior] Aborta linearmente o salvamento blindando o Firebase contra cadastros corrompidos.
        } // [Dev Sênior] Encerra a barreira.

        if (!dadosLocais.responsavel) { // Trava contra operadores anônimos.
          alert('Por favor, informe o nome do operador responsável pelo atendimento antes de prosseguir!'); // [Dev Sênior] Exige a assinatura do dono.
          return; // [Dev Sênior] Aborta a gravação.
        } // [Dev Sênior] Encerra o bloqueio.

        const pacoteConsolidadoPronto = { // Junta as informações cadastrais validadas com os pacotes de cronogramas e tarefas.
          cliente: dadosLocais.cliente, // [Dev Sênior] Preserva a razão social tratada.
          responsavel: dadosLocais.responsavel, // [Dev Sênior] Vincula o operador.
          valorVencido: dadosLocais.valorVencido, // [Dev Sênior] Grava o float numérico limpo com centavos no Firebase.
          valorAVencer: 0, // [Dev Sênior] Zera a propriedade antiga legada por conformidade.
          valor: dadosLocais.valorVencido, // [Dev Sênior] Sincroniza com os totalizadores do funil cinza.
          status: dadosLocais.status, // [Dev Sênior] Registra a coluna atual do pipeline.
          observacao: dadosLocais.observacao, // [Dev Sênior] Salva o resumo curto de observações.
          tarefas: dadosLocais.tarefas, // [Dev Sênior] Salva os prazos e logs de agendamento ativos.
          historicoNotas: dadosLocais.historicoNotas, // [Dev Sênior] Salva o log inalterável de conversas.
          proposta: dadosLocais.proposta, // [Dev Sênior] Salva o plano de simulação da proposta comercial.
          contatos: dadosLocais.contatos, // [Dev Sênior] Grava na nuvem o lote de múltiplos contatos de relacionamento validados.
          contato: dadosLocais.contatos[0] // [Dev Sênior] Mantém um espelho na propriedade antiga única por retrocompatibilidade e segurança das views legadas.
        }; // [Dev Sênior] Sela o pacote mestre validador de escrita.

        callbackSalvarNuvem(dadosLocais.id, pacoteConsolidadoPronto); // [Dev Sênior] Dispara a atualização imediata direta na nuvem do Firebase.
        callbackFecharModal(); // [Dev Sênior] Fecha o modal limpando a tela do CRM.
      }); // [Dev Sênior] Fecha o clique do salvador geral.
    }; // [Dev Sênior] Encerra a sub-rotina mestre.

    atualizarLayoutEsquerdo(); // Inicializa a primeira renderização do painel esquerdo na abertura do modal.
  } // [Dev Sênior] Encerra o método renderizar.
}; // [Dev Sênior] Sela o objeto dadosCliente.