export const dadosCliente = { // Define e exporta o sub-módulo responsável por gerenciar a lateral esquerda de dados essenciais da conta.
  renderizar(containerEsquerdo, dadosLocais, callbackSalvarNuvem, callbackFecharModal) { // Função de renderização que recebe os elementos físicos do pai e as ações de salvamento permanente.
    
    // REGRA DE PO: Inicializa uma lista de múltiplos contatos na memória caso o card venha do Firebase apenas com a estrutura antiga de um contato único.
    if (!dadosLocais.contatos || !Array.isArray(dadosLocais.contatos)) {
      dadosLocais.contatos = dadosLocais.contato && dadosLocais.contato.nome ? [{ ...dadosLocais.contato }] : [{ nome: '', telefone: '', email: '', vinculo: 'proprio' }];
    }

    let cobrancaAberta = true; // Cria uma variável de controle para registrar se a pasta financeira está expandida ou oculta.
    let contatoAberto = false; // Cria uma variável de controle para registrar se a pasta de telefones de relacionamento está expandida ou oculta.

    // Função que limpa textos formatados em dinheiro transformando-os em números decimais puros para o banco de dados.
    const limparMoedaParaNumero = (valorTexto) => {
      if (typeof valorTexto !== 'string') return parseFloat(valorTexto) || 0; // Se o valor já for numérico puro, preserva a sua integridade decimal.
      const textoLimpo = valorTexto.replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, ''); // Apaga pontos de milhar, inverte a vírgula e limpa textos.
      return parseFloat(textoLimpo) || 0; // Entrega o número decimal puro pronto para gravação e relatórios de pipeline.
    };

    // Máscara eletrônica reativa que formata o telefone em tempo real com DDD e espaçamentos corretos enquanto o operador digita.
    const aplicarMascaraTelefone = (valorTexto) => {
      let digitosPuros = valorTexto.replace(/\D/g, ""); // Remove terminantemente qualquer letra, espaço ou símbolo mantendo apenas os números puros.
      if (digitosPuros.length > 11) digitosPuros = digitosPuros.slice(0, 11); // Limita e corta o texto se o cobrador tentar digitar mais do que 11 caracteres por segurança de dados.
      
      if (digitosPuros.length > 10) { // Se o número digitado possuir 11 dígitos, aplica o formato de celular moderno com o 9 na frente.
        return `(${digitosPuros.slice(0, 2)}) ${digitosPuros.slice(2, 7)}-${digitosPuros.slice(7)}`;
      } else if (digitosPuros.length > 6) { // Se possuir entre 7 e 10 dígitos, projeta o formato clássico de telefone fixo nacional.
        return `(${digitosPuros.slice(0, 2)}) ${digitosPuros.slice(2, 6)}-${digitosPuros.slice(6)}`;
      } else if (digitosPuros.length > 2) { // Se o operador estiver iniciando a digitação, fecha o parêntese do código de área de milhar.
        return `(${digitosPuros.slice(0, 2)}) ${digitosPuros.slice(2)}`;
      }
      return digitosPuros; // Retorna o texto formatado reativamente na tela.
    };

    // Motor de validação que verifica através de regras de internet se o e-mail inserido é real e possui o símbolo arroba e extensão.
    const validarSintaxeEmail = (emailTexto) => {
      if (!emailTexto) return true; // Se o campo estiver em branco, autoriza a validação neutra provisória.
      const regraExpressaoRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Monta o crivo eletrônico que exige caracteres válidos seguidos por @ e ponto.
      return regraExpressaoRegular.test(emailTexto); // Retorna verdadeiro se o e-mail for aprovado ou falso se faltarem os símbolos obrigatórios.
    };

    const atualizarLayoutEsquerdo = () => { // Função interna mestre responsável por redesenhar os blocos e travar botões reativamente na interface.
      
      // Formata o valor bruto da carteira para a leitura visual monetária em português com centavos antes de colar na caixa.
      const valorFormatadoTela = (dadosLocais.valorVencido || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
                                  <input type="text" class="input-dinamico-contato-email" data-index="${idx}" value="${itemContato.email || ''}" placeholder="nome@empresa.com" style="width: 100%; padding: 5px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; border-color: ${validarSintaxeEmail(itemContato.email) ? '#cbd5e1' : '#ef4444'}; background: ${validarSintaxeEmail(itemContato.email) ? '#ffffff' : '#fef2f2'};">
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
      `; // Conclui o desenho estrutural da coluna com o rodapé ombro a ombro configurado.

      // Captura e vincula os listeners reativos para sincronismo das observações e operadores de caixa.
      document.getElementById('gestao-responsavel').addEventListener('input', (e) => { dadosLocais.responsavel = e.target.value.trim(); });
      document.getElementById('gestao-observacao').addEventListener('input', (e) => { dadosLocais.observacao = e.target.value.trim(); });
      
      // Captura o desfoque (blur) do valor vencido re-formatando o input com pontos de milhares automáticos.
      document.getElementById('gestao-vencido').addEventListener('blur', (e) => {
          dadosLocais.valorVencido = limparMoedaParaNumero(e.target.value); // Converte o texto em float limpo.
          atualizarLayoutEsquerdo(); // Redesenha a lateral atualizando o visor.
      });

      // Captura e injeta inteligência nos campos múltiplos de contatos em formato de lote.
      if (contatoAberto) {
          containerEsquerdo.querySelectorAll('.input-dinamico-contato-nome').forEach(input => {
              input.addEventListener('input', (e) => {
                  const idx = parseInt(e.target.getAttribute('data-index'));
                  dadosLocais.contatos[idx].nome = e.target.value; // Salva o nome na linha certa do array.
              });
          });

          containerEsquerdo.querySelectorAll('.input-dinamico-contato-telefone').forEach(input => {
              input.addEventListener('input', (e) => {
                  const idx = parseInt(e.target.getAttribute('data-index'));
                  e.target.value = aplicarMascaraTelefone(e.target.value); // Formata e trava reativamente o telefone com o DDD.
                  dadosLocais.contatos[idx].telefone = e.target.value; // Copia para a memória.
              });
          });

          containerEsquerdo.querySelectorAll('.input-dinamico-contato-email').forEach(input => {
              input.addEventListener('blur', (e) => { // Executa a checação no momento em que o cobrador sai do campo.
                  const idx = parseInt(e.target.getAttribute('data-index'));
                  dadosLocais.contatos[idx].email = e.target.value.trim(); // Sincroniza o texto.
                  atualizarLayoutEsquerdo(); // Redesenha o bloco pintando a caixa de vermelho se faltar o arroba (@).
              });
          });

          containerEsquerdo.querySelectorAll('.select-dinamico-contato-vinculo').forEach(select => {
              select.addEventListener('change', (e) => {
                  const idx = parseInt(e.target.getAttribute('data-index'));
                  dadosLocais.contatos[idx].vinculo = e.target.value; // Sincroniza a escolha de relacionamento.
              });
          });

          // Ouve o clique do botão tracejado azul fabricando uma nova linha de contato em branco na base da grade.
          document.getElementById('btn-adicionar-nova-linha-contato').addEventListener('click', () => {
              dadosLocais.contatos.push({ nome: '', telefone: '', email: '', vinculo: 'terceiro' }); // Povoa o lote com uma estrutura limpa vazia.
              atualizarLayoutEsquerdo(); // Redesenha abrindo a nova linha de inputs instantaneamente.
          });

          // Ouve o clique no rótulo de lixeira vermelha apagando de vez aquela linha de contato específica.
          containerEsquerdo.querySelectorAll('.btn-remover-linha-contato').forEach(btnRem => {
              btnRem.addEventListener('click', (e) => {
                  const idx = parseInt(e.target.getAttribute('data-index'));
                  dadosLocais.contatos.splice(idx, 1); // Corta a linha selecionada do array provisório.
                  atualizarLayoutEsquerdo(); // Redesenha atualizando a grade na tela.
              });
          });
      }

      // Amarra os cliques de expansão minimalistas das setas superiores.
      document.getElementById('gatilho-toggle-cobranca').addEventListener('click', () => {
          cobrancaAberta = !cobrancaAberta; // Alterna a exibição do bloco financeiro.
          atualizarLayoutEsquerdo(); // Redesenha.
      });

      document.getElementById('gatilho-toggle-contato').addEventListener('click', () => {
          contatoAberto = !contatoAberto; // Alterna a exibição da grade de contatos de relacionamento.
          atualizarLayoutEsquerdo(); // Redesenha.
      });

      // Configura os efeitos visuais de hover no botão vermelho de exclusão total.
      const btnExcluir = document.getElementById('btn-excluir-cobranca-total'); 
      btnExcluir.addEventListener('mouseenter', () => btnExcluir.style.backgroundColor = '#fef2f2'); 
      btnExcluir.addEventListener('mouseleave', () => btnExcluir.style.backgroundColor = 'transparent'); 

      btnExcluir.addEventListener('click', () => { // Protocolo rigoroso de segurança humana para descarte de devedor.
        const confirmacao = confirm(`⚠️ ATENÇÃO MÁXIMA AUDITORIA:\nDeseja deletar permanentemente a cobrança do cliente "${dadosLocais.cliente}"?\n\nEsta operação é irreversível e removerá todos os históricos, valores e tarefas associadas na nuvem do Firebase!`); 
        if (confirmacao) { 
          callbackSalvarNuvem(dadosLocais.id, null); // Envia o ID e status nulo autorizando a exclusão definitiva.
          callbackFecharModal(); // Descarta o modal da tela.
        } 
      });

      // Intercepta e processa o clique no botão azul "Salvar Alterações" consolidando os dados.
      document.getElementById('btn-salvar-gestao-dados').addEventListener('click', () => {
        
        // CRIVO CRÍTICO: Varre todas as linhas de e-mail salvas na memória local. Se houver alguma inválida (sem arroba @), cancela o salvamento.
        const existeEmailCorrompido = dadosLocais.contatos.some(c => c.email && !validarSintaxeEmail(c.email));
        if (existeEmailCorrompido) {
            alert('⚠️ TRAVA DE SEGURANÇA CADASTRAL:\nExistem e-mails com formatos inválidos na lista de contatos (Falta o caractere @ ou terminação .com)!\n\nPor favor, corrija os campos marcados em vermelho antes de tentar salvar as alterações.');
            return; // Aborta linearmente o salvamento blindando o Firebase contra cadastros corrompidos.
        }

        if (!dadosLocais.responsavel) { // Trava contra operadores anônimos.
          alert('Por favor, informe o nome do operador responsável pelo atendimento antes de prosseguir!'); 
          return; 
        } 

        const pacoteConsolidadoPronto = { // Junta as informações cadastrais validadas com os pacotes de cronogramas e tarefas.
          cliente: dadosLocais.cliente, // Preserva a razão social tratada.
          responsavel: dadosLocais.responsavel, // Vincula o operador.
          valorVencido: dadosLocais.valorVencido, // Grava o float numérico limpo com centavos no Firebase.
          valorAVencer: 0, // Zera a propriedade antiga legada.
          valor: dadosLocais.valorVencido, // Sincroniza com os totalizadores do funil cinza.
          status: dadosLocais.status, // Registra a coluna atual do pipeline.
          observacao: dadosLocais.observacao, // Salva o resumo curto de observações.
          tarefas: dadosLocais.tarefas, // Salva os prazos e logs de agendamento ativos.
          historicoNotas: dadosLocais.historicoNotas, // Salva o log inalterável de conversas.
          proposta: dadosLocais.proposta, // Salva o plano de simulação da proposta comercial.
          contatos: dadosLocais.contatos, // Grava na nuvem o lote de múltiplos contatos de relacionamento validados.
          contato: dadosLocais.contatos[0] // Mantém um espelho na propriedade antiga única por retrocompatibilidade e segurança das views legadas.
        }; 

        callbackSalvarNuvem(dadosLocais.id, pacoteConsolidadoPronto); // Dispara a atualização imediata direta na nuvem do Firebase.
        callbackFecharModal(); // Fecha o modal limpando a tela do CRM.
      }); 
    };

    atualizarLayoutEsquerdo(); // Inicializa a primeira renderização do painel esquerdo na abertura do modal.
  } 
};