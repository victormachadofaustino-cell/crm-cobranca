export const abaProposta = { // Define e exporta o sub-módulo responsável por isolar a calculadora de propostas de acordos comerciais.
  renderizar(containerAbaConteudo, dadosLocais, callbackRecarregarAba) { // Cria a função de desenho que monta o assistente financeiro de juros descontos e parcelas.
    
    containerAbaConteudo.innerHTML = ''; // Esvazia resíduos visuais anteriores da aba para plotagem limpa e segura.

    // Inicializa propriedades de controle do primeiro vencimento na memória caso o registro seja novo.
    if (!dadosLocais.proposta.dataPrimeiroVencimento) {
      dadosLocais.proposta.dataPrimeiroVencimento = new Date().toISOString().split('T')[0]; // Define a data de hoje como o vencimento padrão inicial.
    }

    // NOVA FUNÇÃO INTERNA: Limpa textos formatados em moeda (Ex: 1.500,50) transformando-os em números decimais puros para o motor de cálculo.
    const limparMoedaParaNumero = (valorTexto) => {
      if (typeof valorTexto !== 'string') return parseFloat(valorTexto) || 0; // Se o valor já for um número puro na comanda, preserva sua integridade decimal.
      const textoLimpo = valorTexto.replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, ''); // Apaga pontos de milhar, inverte a vírgula por ponto e descarta letras.
      return parseFloat(textoLimpo) || 0; // Devolve o número decimal puro pronto para os cálculos matemáticos da comanda.
    };

    const calcularValoresPropostaInterno = () => { // Realiza o cálculo matemático volátil de descontos ou acréscimos na proposta sem travar a nuvem.
        const original = dadosLocais.valorVencido; // Resgata o saldo vencido bruto original da dívida do devedor.
        const modificador = parseFloat(dadosLocais.proposta.valorModificador) || 0; // Captura o número digitado na caixa modificadora.
        
        if (dadosLocais.proposta.tipoModificador === 'R$') { // Se o cobrador optou por aplicar um abatimento fixo em dinheiro direto.
            dadosLocais.proposta.valorCobrado = original + modificador; // Soma ou subtrai o valor informado diretamente no saldo bruto.
        } else { // Caso o cobrador selecione o modificador de porcentagem.
            dadosLocais.proposta.valorCobrado = original + (original * (modificador / 100)); // Calcula a fração em porcentagem e aplica sobre o montante bruto da conta.
        }
        dadosLocais.proposta.valorCobrado = parseFloat(dadosLocais.proposta.valorCobrado.toFixed(2)); // Arredonda o valor cobrado final para duas casas decimais precisas.
        simularParcelasDoPlanoInterno(); // Aciona o recálculo do lote de faturas e boletos automáticos.
    };

    const simularParcelasDoPlanoInterno = () => { // Divide os valores em boletos e assina o status inicial de "A Vencer".
        const total = dadosLocais.proposta.valorCobrado; // Coleta o valor cobrado consolidado com descontos.
        const qtd = parseInt(dadosLocais.proposta.qtdParcelas) || 1; // Coleta a quantidade de faturas desejada pelo cobrador.
        const valorParcelaBase = parseFloat((total / qtd).toFixed(2)); // Divide o saldo igualmente entre as parcelas arredondando os centavos.
        
        // REGRA DE SEGURANÇA UX: Se o usuário já tiver alterado manualmente as parcelas, não sobrescrevemos tudo para não apagar a digitação ativa dele, a menos que a quantidade mude.
        if (dadosLocais.proposta.parcelasSimuladas && dadosLocais.proposta.parcelasSimuladas.length === qtd) {
            return; // Interrompe a geração automática se a quantidade de linhas na tela for a mesma, preservando as edições do cobrador.
        }

        dadosLocais.proposta.parcelasSimuladas = []; // Esvazia o lote de simulações anteriores da memória provisória.
        
        // Ponto de partida do calendário: usa a data informada para a primeira parcela.
        const dataBasePartida = new Date(dadosLocais.proposta.dataPrimeiroVencimento);

        for (let i = 1; i <= qtd; i++) { // Roda um laço de repetição travado no número de faturas escolhidas.
            const dataVencimentoCalculada = new Date(dataBasePartida); // Cria uma nova cópia do calendário.
            dataVencimentoCalculada.setDate(dataBasePartida.getDate() + ((i - 1) * 30)); // Despacha os vencimentos somando saltos de 30 em 30 dias de forma sequencial.
            const dataIso = dataVencimentoCalculada.toISOString().split('T')[0]; // Converte o calendário para a string padrão eletrônica de armazenamento (AAAA-MM-DD).

            dadosLocais.proposta.parcelasSimuladas.push({ // Empurra a parcela estruturada para dentro do nosso array local de fechamento.
                numero: i, // Número de ordem da fatura (1, 2, 3...)
                valor: i === qtd ? parseFloat((total - (valorParcelaBase * (qtd - 1))).toFixed(2)) : valorParcelaBase, // Ajuste técnico: desconta a dízima na última parcela para fechar com o saldo cheio.
                vencimento: dataIso, // Salva o vencimento calculado da fatura.
                pago: false, // Inicia a propriedade boleto pago como falsa aguardando recebimento de caixa.
                status: 'a_vencer' // Assina todas as parcelas da proposta em negociação activa com o status padrão "A Vencer".
            });
        }
    };

    // Formata o valor bruto do modificador de entrada para exibição amigável com milhares e centavos nacionais.
    const valorModificadorFormatado = (dadosLocais.proposta.valorModificador || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    containerAbaConteudo.innerHTML = `
      <div style="background: white; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; display: flex; flex-direction: column; gap: 15px; height: 100%; overflow-y: auto;">
        <h4 style="font-size: 14px; font-weight: bold; color: #1e293b; margin: 0; border-bottom: 1px dashed #cbd5e1; padding-bottom: 5px;">🤝 Simular Proposta Cadastral (Em Andamento)</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
                <label style="display: block; font-size: 11px; font-weight: bold; color: #475569; margin-bottom: 4px;">Valor Vencido Original (R$)</label>
                <input type="text" disabled value="R$ ${dadosLocais.valorVencido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; background: #f1f5f9; color: #64748b; font-weight: 600;">
            </div>
            <div>
                <label style="display: block; font-size: 11px; font-weight: bold; color: #475569; margin-bottom: 4px;">Aplicar Desconto/Acréscimo</label>
                <div style="display: flex; gap: 4px;">
                    <select id="prop-tipo-modificador" style="padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; font-weight: bold; background: white;">
                        <option value="R$" ${dadosLocais.proposta.tipoModificador === 'R$' ? 'selected' : ''}>R$</option>
                        <option value="%" ${dadosLocais.proposta.tipoModificador === '%' ? 'selected' : ''}>%</option>
                    </select>
                    <input type="text" id="prop-valor-modificador" value="${valorModificadorFormatado}" placeholder="Ex: -50,00" style="flex-grow: 1; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; font-weight: 600;"> 
                </div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
                <label style="display: block; font-size: 11px; font-weight: bold; color: #475569; margin-bottom: 4px;">Valor Total Cobrado (R$)</label>
                <input type="text" id="prop-valor-cobrado" disabled value="R$ ${dadosLocais.proposta.valorCobrado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 13px; background: #f8fafc; color: #10b981; font-weight: bold;">
            </div>
            <div>
                <label style="display: block; font-size: 11px; font-weight: bold; color: #475569; margin-bottom: 4px;">Forma de Pagamento</label>
                <select id="prop-forma" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; background: white; font-weight: 600;">
                    <option value="A vista" ${dadosLocais.proposta.formaPagamento === 'A vista' ? 'selected' : ''}>💰 À Vista</option>
                    <option value="Parcelado" ${dadosLocais.proposta.formaPagamento === 'Parcelado' ? 'selected' : ''}>📅 Parcelado</option>
                </select>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
                <label style="display: block; font-size: 11px; font-weight: bold; color: #475569; margin-bottom: 4px;">Tipo de Recebimento</label>
                <select id="prop-tipo" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; background: white; font-weight: 600;">
                    <option value="Boleto" ${dadosLocais.proposta.tipoPagamento === 'Boleto' ? 'selected' : ''}>📄 Boleto Bancário</option>
                    <option value="Crédito" ${dadosLocais.proposta.tipoPagamento === 'Crédito' ? 'selected' : ''}>💳 Cartão de Crédito</option>
                    <option value="Débito" ${dadosLocais.proposta.tipoPagamento === 'Débito' ? 'selected' : ''}>🏦 Cartão de Débito</option>
                </select>
            </div>
            <div id="wrapper-qtd-parcelas" style="display: ${dadosLocais.proposta.formaPagamento === 'Parcelado' ? 'block' : 'none'};">
                <label style="display: block; font-size: 11px; font-weight: bold; color: #475569; margin-bottom: 4px;">Quantidade de Parcelas</label>
                <input type="number" min="1" max="12" id="prop-qtd" value="${dadosLocais.proposta.qtdParcelas}" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; font-weight: bold;">
            </div>
        </div>

        <div id="wrapper-vencimento-inicial" style="display: ${dadosLocais.proposta.formaPagamento === 'Parcelado' ? 'block' : 'none'};">
            <label style="display: block; font-size: 11px; font-weight: bold; color: #475569; margin-bottom: 4px;">📅 Vencimento da 1ª Parcela</label>
            <input type="date" id="prop-primeiro-vencimento" value="${dadosLocais.proposta.dataPrimeiroVencimento}" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; font-weight: bold; color: #334155; background: #ffffff;">
        </div>

        <div id="prop-resultado-simulacao" style="display: ${dadosLocais.proposta.formaPagamento === 'Parcelado' ? 'flex' : 'none'}; flex-direction: column; gap: 6px; margin-top: 5px; border-top: 1px dashed #cbd5e1; padding-top: 10px;">
            <label style="font-size: 11px; font-weight: bold; color: #475569;">📋 Cronograma de Parcelas Ajustáveis:</label>
            <div style="display: flex; flex-direction: column; gap: 5px; max-height: 150px; overflow-y: auto; padding-right: 2px;">
                ${dadosLocais.proposta.parcelasSimuladas.map((p, index) => {
                    const estaFaturaPaga = p.pago || p.status === 'pago'; // Valida se esta fatura específica já recebeu baixa na esteira financeira.
                    const valorFaturaTela = (p.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); // Formata com milhares e centavos.
                    
                    return `
                    <div style="display: flex; justify-content: space-between; align-items: center; background: ${estaFaturaPaga ? '#ecfdf5' : '#f8fafc'}; border: 1px solid ${estaFaturaPaga ? '#a7f3d0' : '#e2e8f0'}; padding: 6px 10px; border-radius: 4px; font-size: 12px; gap: 10px;">
                        <span style="font-weight: 600; color: #475569; white-space: nowrap;">Parc. nº ${p.numero}</span>
                        <input type="date" class="input-data-parcela-item" data-index="${index}" ${estaFaturaPaga ? 'disabled' : ''} value="${p.vencimento}" style="padding: 4px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 11px; font-weight: 600; color: #334155;">
                        <div style="display: flex; align-items: center; gap: 2px;">
                          <span style="font-size: 11px; color: #64748b; font-weight: bold;">R$</span>
                          <input type="text" class="input-valor-parcela-item" data-index="${index}" ${estaFaturaPaga ? 'disabled' : ''} value="${valorFaturaTela}" style="width: 90px; padding: 4px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 11px; font-weight: bold; color: #1e293b; text-align: right;">
                        </div>
                        <span style="font-size: 9px; font-weight: bold; background: ${estaFaturaPaga ? '#10b981' : '#fef3c7'}; color: ${estaFaturaPaga ? '#ffffff' : '#92400e'}; padding: 2px 4px; border-radius: 4px; text-transform: uppercase; white-space: nowrap;">${estaFaturaPaga ? '🟩 PAGO' : '⏳ A Vencer'}</span>
                    </div>
                `}).join('')}
            </div>
        </div>
        
        <button type="button" id="btn-zerar-proposta" style="background: none; border: 1px dashed #ef4444; color: #ef4444; padding: 8px; border-radius: 6px; font-weight: bold; font-size: 12px; cursor: pointer; text-align: center; width: 100%; margin-top: auto; transition: background 0.2s;">🔄 Cancelar e Zerar Proposta Atual</button>
      </div>
    `; // Renderiza os campos de preenchimento e assina as escutas de input e seleção.

    // Monitora a caixa do primeiro vencimento para recalcular as datas em cadeia a partir do novo ponto de partida.
    if (dadosLocais.proposta.formaPagamento === 'Parcelado') {
        document.getElementById('prop-primeiro-vencimento').addEventListener('change', (e) => {
            dadosLocais.proposta.dataPrimeiroVencimento = e.target.value; // Salva a data base na sessão.
            dadosLocais.proposta.parcelasSimuladas = []; // Limpa o plano para forçar a regeneração das datas em saltos de 30 dias.
            calcularValoresPropostaInterno(); // Executa o cálculo cronológico.
            callbackRecarregarAba(); // Atualiza a aba redesenhando a grade com o novo calendário.
        });

        // Captura e amarra as alterações manuais feitas pelo cobrador diretamente nas datas das parcelas.
        containerAbaConteudo.querySelectorAll('.input-data-parcela-item').forEach(inputData => {
            inputData.addEventListener('change', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index')); // Localiza o número da linha correspondente.
                dadosLocais.proposta.parcelasSimuladas[idx].vencimento = e.target.value; // Grava de forma cirúrgica a nova data informada no telefone.
            });
        });

        // MÁSCARA FINANCEIRA NAS PARCELAS: Intercepta o desfoque (blur) do campo de valor da parcela, limpa o milhar e formata o padrão brasileiro.
        containerAbaConteudo.querySelectorAll('.input-valor-parcela-item').forEach(inputValor => {
            inputValor.addEventListener('blur', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index')); // Identifica a linha correspondente.
                dadosLocais.proposta.parcelasSimuladas[idx].valor = limparMoedaParaNumero(e.target.value); // Converte o texto em número decimal estável.
                
                // Recalcula o montante consolidado cobrado somando as linhas com os juros inseridos.
                const novoTotalSoma = dadosLocais.proposta.parcelasSimuladas.reduce((total, p) => total + (p.valor || 0), 0);
                dadosLocais.proposta.valorCobrado = parseFloat(novoTotalSoma.toFixed(2)); // Atualiza o total cobrado.
                
                callbackRecarregarAba(); // Redesenha a aba para formatar os valores digitados de forma limpa.
            });
        });
    }

    // REGRA DE MERCADO ADICIONADA: Configura a escuta de desfoque no input de juros/abatimento limpando e convertendo texto em número real.
    document.getElementById('prop-valor-modificador').addEventListener('blur', (e) => {
        dadosLocais.proposta.valorModificador = limparMoedaParaNumero(e.target.value); // Limpa as pontuações e converte.
        dadosLocais.proposta.parcelasSimuladas = []; // Reseta o cache para forçar a proporcionalidade matemática das parcelas.
        calcularValoresPropostaInterno(); // Dispara o recálculo volátil.
        callbackRecarregarAba(); // Redesenha a aba com os valores recalculados e formatados em milhar.
    });

    // NOVO EVENTO DE CONTROLE: Configura a limpeza total da proposta no clique do botão vermelho tracejado.
    document.getElementById('btn-zerar-proposta').addEventListener('click', () => {
        const confirmacaoReset = confirm("⚠️ CONTROLADORIA DE CAIXA:\nDeseja anular completamente a proposta simulada atual?\n\nEsta ação redefinirá os modificadores para zero e apagará o cronograma de parcelas construído.");
        if (confirmacaoReset) {
            dadosLocais.proposta = { 
                valorCobrado: dadosLocais.valorVencido, // Restaura o valor cobrado para o saldo devedor original puro.
                tipoModificador: 'R$', 
                valorModificador: 0, 
                formaPagamento: 'A vista', 
                tipoPagamento: 'Boleto', 
                qtdParcelas: 1, 
                parcelasSimuladas: [],
                dataPrimeiroVencimento: new Date().toISOString().split('T')[0]
            };
            callbackRecarregarAba(); // Redesenha a tela limpando as linhas e redefinindo a calculadora instantaneamente.
        }
    });

    document.getElementById('prop-tipo-modificador').addEventListener('change', (e) => { // Escuta a alteração do tipo de modificador (reais ou porcentagem).
        dadosLocais.proposta.tipoModificador = e.target.value; // Salva a escolha do operador na cópia da memória local.
        dadosLocais.proposta.parcelasSimuladas = []; // Limpa o plano para recalcular os montantes.
        calcularValoresPropostaInterno(); // Recalcula os saldos da tela de forma imediata.
        callbackRecarregarAba(); // Redesenha a aba para atualizar as descrições.
    });

    const atualizarLinhasSimulacaoDom = () => { // Sub-rotina interna de UX criada para re-plotar o cronograma de parcelas sem tirar o foco do cursor da caixa de texto modificadora.
        const containerSimula = document.getElementById('prop-resultado-simulacao'); // Localiza o bloco físico do cronograma.
        if (!containerSimula) return; // Trava de segurança.
        calcularValoresPropostaInterno(); // Recalcula a simulação de boletos.
        const mioloDiv = containerSimula.querySelector('div'); // Localiza o bloco de listagem interna.
        if (mioloDiv) { // Se o bloco interno estiver montado.
            mioloDiv.innerHTML = dadosLocais.proposta.parcelasSimuladas.map((p, index) => { // Re-plota a grade de parcelas atualizada com os novos inputs editáveis e máscaras aplicadas.
                const fPaga = p.pago || p.status === 'pago';
                const vFaturaFormatado = (p.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                
                return `
                  <div style="display: flex; justify-content: space-between; align-items: center; background: ${fPaga ? '#ecfdf5' : '#f8fafc'}; border: 1px solid ${fPaga ? '#a7f3d0' : '#e2e8f0'}; padding: 6px 10px; border-radius: 4px; font-size: 12px; gap: 10px;">
                      <span style="font-weight: 600; color: #475569; white-space: nowrap;">Parc. nº ${p.numero}</span>
                      <input type="date" class="input-data-parcela-item" data-index="${index}" ${fPaga ? 'disabled' : ''} value="${p.vencimento}" style="padding: 4px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 11px; font-weight: 600; color: #334155;">
                      <div style="display: flex; align-items: center; gap: 2px;">
                        <span style="font-size: 11px; color: #64748b; font-weight: bold;">R$</span>
                        <input type="text" class="input-valor-parcela-item" data-index="${index}" ${fPaga ? 'disabled' : ''} value="${vFaturaFormatado}" style="width: 90px; padding: 4px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 11px; font-weight: bold; color: #1e293b; text-align: right;">
                      </div>
                      <span style="font-size: 9px; font-weight: bold; background: ${fPaga ? '#10b981' : '#fef3c7'}; color: ${fPaga ? '#ffffff' : '#92400e'}; padding: 2px 4px; border-radius: 4px; text-transform: uppercase; white-space: nowrap;">${fPaga ? '🟩 PAGO' : '⏳ A Vencer'}</span>
                  </div>`;
            }).join(''); // Junta e renderiza linearmente.

            // Re-amarra os monitores de escuta reativa nos novos inputs injetados para evitar perda de dados na digitação em cadeia.
            mioloDiv.querySelectorAll('.input-data-parcela-item').forEach(inputData => {
                inputData.addEventListener('change', (evt) => {
                    const idx = parseInt(evt.target.getAttribute('data-index'));
                    dadosLocais.proposta.parcelasSimuladas[idx].vencimento = evt.target.value;
                });
            });
            mioloDiv.querySelectorAll('.input-valor-parcela-item').forEach(inputValor => {
                inputValor.addEventListener('blur', (evt) => {
                    const idx = parseInt(evt.target.getAttribute('data-index'));
                    dadosLocais.proposta.parcelasSimuladas[idx].valor = limparMoedaParaNumero(evt.target.value);
                    const nTotal = dadosLocais.proposta.parcelasSimuladas.reduce((t, prc) => t + (prc.valor || 0), 0);
                    dadosLocais.proposta.valorCobrado = parseFloat(nTotal.toFixed(2));
                    atualizarLinhasSimulacaoDom(); // Recarrega a sub-grade aplicando as formatações visuais nas linhas.
                });
            });
        }
    };

    document.getElementById('prop-forma').addEventListener('change', (e) => { // Escuta a troca de forma de pagamento (à vista ou parcelado).
        dadosLocais.proposta.formaPagamento = e.target.value; // Salva o termo na memória da sessão.
        dadosLocais.proposta.qtdParcelas = dadosLocais.proposta.formaPagamento === 'Parcelado' ? 3 : 1; // Ajusta para 3 parcelas automáticas ou força 1 se à vista.
        dadosLocais.proposta.parcelasSimuladas = []; // Reseta o array antigo para forçar uma nova montagem proporcional.
        calcularValoresPropostaInterno(); // Roda o cálculo financeiro volátil.
        callbackRecarregarAba(); // Recarrega o painel re-plotando as caixas ocultas de visto.
    });

    document.getElementById('prop-tipo').addEventListener('change', (e) => { // Monitora a escolha do tipo de documento financeiro.
        dadosLocais.proposta.tipoPagamento = e.target.value; // Grava a opção selecionada na estrutura local.
    });

    if (dadosLocais.proposta.formaPagamento === 'Parcelado') { // Se o campo de parcelamento estiver ativo em tela.
        document.getElementById('prop-qtd').addEventListener('input', (e) => { // Monitora o número de parcelas digitado pelo cobrador.
            dadosLocais.proposta.qtdParcelas = Math.max(1, parseInt(e.target.value) || 1); // Força a quantidade mínima a se manter em 1 para evitar erros de dízima por zero.
            dadosLocais.proposta.parcelasSimuladas = []; // Reseta o cache de simulação para construir a nova contagem de linhas.
            calcularValoresPropostaInterno(); // Recalcula a simulação.
            callbackRecarregarAba(); // Atualiza o cronograma completo de parcelas calculadas na tela.
        });
    }
    
    // Força a execução inicial na montagem da tela para garantir que o array local sempre nasça povoado e pronto para a digitação livre.
    if (dadosLocais.proposta.formaPagamento === 'Parcelado' && (!dadosLocais.proposta.parcelasSimuladas || dadosLocais.proposta.parcelasSimuladas.length === 0)) {
        calcularValoresPropostaInterno();
    }
  } // Encerra a função principal de renderização da aba Proposta.
}; // Encerra a exportação do objeto da calculadora de acordos.