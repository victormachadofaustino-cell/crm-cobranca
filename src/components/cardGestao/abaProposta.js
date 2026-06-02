export const abaProposta = { // Define e exporta o sub-módulo responsável por isolar a calculadora de propostas de acordos comerciais. [cite: 1176]
  renderizar(containerAbaConteudo, dadosLocais, callbackRecarregarAba) { // Cria a função de desenho que monta o assistente financeiro de juros descontos e parcelas. [cite: 1177]
    
    containerAbaConteudo.innerHTML = ''; // Esvazia resíduos visuais anteriores da aba para plotagem limpa e segura. [cite: 1178]

    // Inicializa propriedades de controle do primeiro vencimento na memória caso o registro seja novo. [cite: 1179]
    if (!dadosLocais.proposta.dataPrimeiroVencimento) { // Verifica se a data do primeiro boleto já está salva na memória. [cite: 1180]
      dadosLocais.proposta.dataPrimeiroVencimento = new Date().toISOString().split('T')[0]; // Define a data de hoje como o vencimento padrão inicial. [cite: 1180]
    } // Encerra a verificação preventiva de data inicial. [cite: 1182]

    // NOVO PARAMETRO DE INTELIGÊNCIA: Inicializa a taxa de juros mensal na memória caso não exista.
    if (dadosLocais.proposta.taxaJurosMensal === undefined) { // Checa se a propriedade de taxa de juros ao mês já nasceu na memória.
      dadosLocais.proposta.taxaJurosMensal = 0; // Configura o juro inicial em zero por cento de fábrica para não alterar acordos antigos.
    } // Encerra o provisionamento da nova taxa de juros.

    // NOVA FUNÇÃO INTERNA: Limpa textos formatados em moeda (Ex: 1.500,50) transformando-os em números decimais puros para o motor de cálculo. [cite: 1182]
    const limparMoedaParaNumero = (valorTexto) => { // Cria a rotina de limpeza de strings de moeda vinda dos inputs de tela. [cite: 1183]
      if (typeof valorTexto !== 'string') return parseFloat(valorTexto) || 0; // Se o valor já for um número puro na comanda, preserva sua integridade decimal. [cite: 1183]
      const textoLimpo = valorTexto.replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, ''); // Apaga pontos de milhar, inverte a vírgula por ponto e descarta letras. [cite: 1185]
      return parseFloat(textoLimpo) || 0; // Devolve o número decimal puro pronto para os cálculos matemáticos da comanda. [cite: 1186]
    }; // Encerra a higienização de moeda de texto. [cite: 1186]

    const calcularValoresPropostaInterno = () => { // Realiza o cálculo matemático volátil de descontos ou acréscimos na proposta sem travar a nuvem. [cite: 1187]
        const original = dadosLocais.valorVencido; // Resgata o saldo vencido bruto original da dívida do devedor. [cite: 1188]
        const modificador = parseFloat(dadosLocais.proposta.valorModificador) || 0; // Captura o número digitado na caixa modificadora. [cite: 1188]
        
        if (dadosLocais.proposta.tipoModificador === 'R$') { // Se o cobrador optou por aplicar um abatimento fixo em dinheiro direto. [cite: 1189]
            dadosLocais.proposta.valorCobrado = original + modificador; // Soma ou subtrai o valor informado diretamente no saldo bruto. [cite: 1190]
        } else { // Caso o cobrador selecione o modificador de porcentagem. [cite: 1191]
            dadosLocais.proposta.valorCobrado = original + (original * (modificador / 100)); // Calcula a fração em porcentagem e aplica sobre o montante bruto da conta. [cite: 1192]
        } // Encerra a comutação básica de modificadores fixos de entrada. [cite: 1193]
        
        dadosLocais.proposta.valorCobrado = parseFloat(dadosLocais.proposta.valorCobrado.toFixed(2)); // Arredonda o valor cobrado final para duas casas decimais precisas. [cite: 1193]
        simularParcelasDoPlanoInterno(); // Aciona o recálculo do lote de faturas e boletos automáticos com a nova inteligência de juros compostos. [cite: 1194]
    }; // Encerra a rotina de precificação inicial da proposta. [cite: 1195]

    const simularParcelasDoPlanoInterno = () => { // Divide os valores em boletos aplicando os juros ao mês se for parcelado. [cite: 1196]
        let total = dadosLocais.proposta.valorCobrado; // Coleta o valor de largada da proposta consolidado com descontos ou acréscimos fixos. [cite: 1197]
        const qtd = parseInt(dadosLocais.proposta.qtdParcelas) || 1; // Coleta a quantidade de faturas desejada pelo cobrador. [cite: 1197]
        const taxaMensalPct = parseFloat(dadosLocais.proposta.taxaJurosMensal) || 0; // Captura a nova taxa de juros mensais preenchida na tela.
        
        let valorParcelaBase = 0; // Inicializa a variável que vai armazenar o valor em reais de cada boleto emitido.

        // MÓDULO INTELIGENTE DE JUROS AO MÊS: Aplica a fórmula de amortização Price caso o acordo seja parcelado e possua taxa ativa.
        if (dadosLocais.proposta.formaPagamento === 'Parcelado' && taxaMensalPct > 0) { // Verifica se é um financiamento com taxa de juros ao mês ativa.
            const i = taxaMensalPct / 100; // Transforma a porcentagem digitada em formato decimal matemático de taxa (Ex: 1% vira 0.01).
            valorParcelaBase = parseFloat(((total * i) / (1 - Math.pow(1 + i, -qtd))).toFixed(2)); // Executa a fórmula de parcelas fixas compostas de mercado.
            total = parseFloat((valorParcelaBase * qtd).toFixed(2)); // Atualiza o valor final cobrado somando o acúmulo de juros gerado pelo tempo.
            dadosLocais.proposta.valorCobrado = total; // Sincroniza o total da proposta com o acumulado de juros do parcelamento.
        } else { // Caso seja pagamento à vista ou parcelado sem cobrança de juros mensais adicionais.
            valorParcelaBase = parseFloat((total / qtd).toFixed(2)); // Divide o saldo de forma comum igualmente entre os boletos. 
        } // Encerra o crivo do motor financeiro de amortização.

        // REGRA DE SEGURANÇA UX: Se o usuário já tiver alterado manualmente as parcelas, não sobrescrevemos tudo para não apagar a digitação ativa dele, a menos que a quantidade mude. [cite: 1200]
        if (dadosLocais.proposta.parcelasSimuladas && dadosLocais.proposta.parcelasSimuladas.length === qtd) { // Avalia estabilidade de linhas. [cite: 1201]
            return; // Interrompe a geração automática se a quantidade de linhas na tela for a mesma, preservando as edições do cobrador. [cite: 1201]
        } // Encerra a trava UX. [cite: 1203]

        dadosLocais.proposta.parcelasSimuladas = []; // Esvazia o lote de simulações anteriores da memória provisória. [cite: 1203]
        
        // Ponto de partida do calendário: usa a data informada para a primeira parcela. [cite: 1205]
        const dataBasePartida = new Date(dadosLocais.proposta.dataPrimeiroVencimento); // Instancia a data escolhida como primeiro vencimento. [cite: 1205]

        for (let i = 1; i <= qtd; i++) { // Roda um laço de repetição travado no número de faturas escolhidas. [cite: 1206]
            const dataVencimentoCalculada = new Date(dataBasePartida); // Cria uma nova cópia do calendário. [cite: 1207]
            dataVencimentoCalculada.setDate(dataBasePartida.getDate() + ((i - 1) * 30)); // Despacha os vencimentos somando saltos de 30 em 30 dias de forma sequencial. [cite: 1207]
            const dataIso = dataVencimentoCalculada.toISOString().split('T')[0]; // Converte o calendário para a string padrão eletrônica de armazenamento (AAAA-MM-DD). [cite: 1208]

            dadosLocais.proposta.parcelasSimuladas.push({ // Empurra a parcela estruturada para dentro do nosso array local de fechamento. [cite: 1210]
                numero: i, // Número de ordem da fatura (1, 2, 3...) [cite: 1210]
                valor: i === qtd ? parseFloat((total - (valorParcelaBase * (qtd - 1))).toFixed(2)) : valorParcelaBase, // Ajuste técnico: desconta a dízima na última parcela para fechar com o saldo cheio do financiamento. [cite: 1210]
                vencimento: dataIso, // Salva o vencimento calculado da fatura. [cite: 1210]
                pago: false, // Inicia a propriedade boleto pago como falsa aguardando recebimento de caixa. [cite: 1211]
                status: 'a_vencer' // Assina todas as parcelas da proposta em negociação activa com o status padrão "A Vencer". [cite: 1211]
            }); // Encerra a injeção do objeto de fatura individual. [cite: 1212]
        } // Encerra o loop gerador de faturas. [cite: 1212]
    }; // Encerra a simulação das parcelas. [cite: 1212]

    // Formata o valor bruto do modificador de entrada para exibição amigável com milhares e centavos nacionais. [cite: 1213]
    const valorModificadorFormatado = (dadosLocais.proposta.valorModificador || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); // Aplica máscara de reais no modificador de topo. [cite: 1213]

    // INJEÇÃO INTERFACE REATIVA: Plota o layout do modal injetando as caixas Grid e adicionando o novo campo de Juros ao Mês na barra. [cite: 1214]
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

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div id="wrapper-juros-mensais" style="display: ${dadosLocais.proposta.formaPagamento === 'Parcelado' ? 'block' : 'none'};">
                <label style="display: block; font-size: 11px; font-weight: bold; color: #c2410c; margin-bottom: 4px;">📈 Taxa de Juros ao Mês (%)</label>
                <input type="number" min="0" step="0.01" id="prop-juros-mensal" value="${dadosLocais.proposta.taxaJurosMensal || 0}" style="width: 100%; padding: 6px; border: 1px solid #fcd34d; border-radius: 4px; font-size: 12px; font-weight: bold; background: #fffbeb; color: #b45309;" placeholder="0.00">
            </div>
            <div id="wrapper-vencimento-inicial" style="display: ${dadosLocais.proposta.formaPagamento === 'Parcelado' ? 'block' : 'none'};">
                <label style="display: block; font-size: 11px; font-weight: bold; color: #475569; margin-bottom: 4px;">📅 Vencimento da 1ª Parcela</label>
                <input type="date" id="prop-primeiro-vencimento" value="${dadosLocais.proposta.dataPrimeiroVencimento}" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; font-weight: bold; color: #334155; background: #ffffff;">
            </div>
        </div>

        <div id="prop-resultado-simulacao" style="display: ${dadosLocais.proposta.formaPagamento === 'Parcelado' ? 'flex' : 'none'}; flex-direction: column; gap: 6px; margin-top: 5px; border-top: 1px dashed #cbd5e1; padding-top: 10px;">
            <label style="font-size: 11px; font-weight: bold; color: #475569;">📋 Cronograma de Parcelas Ajustáveis:</label>
            <div style="display: flex; flex-direction: column; gap: 5px; max-height: 150px; overflow-y: auto; padding-right: 2px;">
                ${dadosLocais.proposta.parcelasSimuladas.map((p, index) => {
                    const estaFaturaPaga = p.pago || p.status === 'pago'; // Valida se esta fatura específica já recebeu baixa na esteira financeira. [cite: 1247]
                    const valorFaturaTela = (p.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); // Formata com milhares e centavos. [cite: 1247]
                    
                    return `
                    <div style="display: flex; justify-content: space-between; align-items: center; background: ${estaFaturaPaga ? '#ecfdf5' : '#f8fafc'}; border: 1px solid ${estaFaturaPaga ? '#a7f3d0' : '#e2e8f0'}; padding: 6px 10px; border-radius: 4px; font-size: 12px; gap: 10px;">
                        <span style="font-weight: 600; color: #475569; white-space: nowrap;">Parc. nº ${p.numero}</span>
                        <input type="date" class="input-data-parcela-item" data-index="${index}" ${estaFaturaPaga ? 'disabled' : ''} value="${p.vencimento}" style="padding: 4px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 11px; font-weight: 600; color: #334155;">
                        <div style="display: flex; align-items: center; gap: 2px;">
                          <span style="font-size: 11px; color: #64748b; font-weight: bold;">R$</span>
                          <input type="text" class="input-valor-parcela-item" data-index="${index}" ${estaFaturaPaga ? 'disabled' : ''} value="${valorFaturaTela}" style="width: 90px; padding: 4px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 11px; font-weight: bold; color: #1e293b; text-align: right;">
                        </div>
                        <span style="font-size: 9px; font-weight: bold; background: ${estaFaturaPaga ? '#10b981' : '#fef3c7'}; color: ${estaFayerPaga ? '#ffffff' : '#92400e'}; padding: 2px 4px; border-radius: 4px; text-transform: uppercase; white-space: nowrap;">${estaFaturaPaga ? '🟩 PAGO' : '⏳ A Vencer'}</span>
                    </div>
                `}).join('')}
            </div>
        </div>
        
        <button type="button" id="btn-zerar-proposta" style="background: none; border: 1px dashed #ef4444; color: #ef4444; padding: 8px; border-radius: 6px; font-weight: bold; font-size: 12px; cursor: pointer; text-align: center; width: 100%; margin-top: auto; transition: background 0.2s;">🔄 Cancelar e Zerar Proposta Atual</button>
      </div>
    `; // [Dev Sênior] Fecha o template de injeção da folha calculadora.

    // Monitora a caixa do primeiro vencimento para recalcular as datas em cadeia a partir do novo ponto de partida. [cite: 1256]
    if (dadosLocais.proposta.formaPagamento === 'Parcelado') { // [Dev Sênior] Liga as travas reativas caso o modelo seja o de financiamento. [cite: 1257]
        document.getElementById('prop-primeiro-vencimento').addEventListener('change', (e) => { // Ouve as alterações de calendário do primeiro boleto. [cite: 1257]
            dadosLocais.proposta.dataPrimeiroVencimento = e.target.value; // Salva a data base na sessão. [cite: 1257]
            dadosLocais.proposta.parcelasSimuladas = []; // Limpa o plano para forçar a regeneração das datas em saltos de 30 dias. [cite: 1257]
            calcularValoresPropostaInterno(); // Executa o cálculo cronológico. [cite: 1257]
            callbackRecarregarAba(); // Atualiza a aba redesenhando a grade com o novo calendário. [cite: 1257]
        }); // Fecha a escuta de data base. [cite: 1258]

        // NOVO MONITOR DE JUROS MENSAL: Escuta as digitações de taxa ao mês e aciona os cálculos reativos.
        document.getElementById('prop-juros-mensal').addEventListener('change', (e) => { // Ouve o desfoque do campo de juros.
            dadosLocais.proposta.taxaJurosMensal = parseFloat(e.target.value) || 0; // Grava o float numérico na memória local.
            dadosLocais.proposta.parcelasSimuladas = []; // Reseta o cache de boletos antigos para forçar o recálculo Price.
            calcularValoresPropostaInterno(); // Executa a fórmula de juros compostos.
            callbackRecarregarAba(); // Redesenha a aba formatando os números.
        });

        // Captura e amarra as alterações manuais feitas pelo cobrador diretamente nas datas das parcelas. [cite: 1259]
        containerAbaConteudo.querySelectorAll('.input-data-parcela-item').forEach(inputData => { // Varre as datas individuais. [cite: 1260]
            inputData.addEventListener('change', (e) => { // Ouve as alterações inline. [cite: 1260]
                const idx = parseInt(e.target.getAttribute('data-index')); // Localiza o número da linha correspondente. [cite: 1260]
                dadosLocais.proposta.parcelasSimuladas[idx].vencimento = e.target.value; // Grava de forma cirúrgica a nova data informada no telefone. [cite: 1260]
            }); // Fecha a linha. [cite: 1260]
        }); // Fecha a varredura. [cite: 1260]

        // MÁSCARA FINANCEIRA NAS PARCELAS: Intercepta o desfoque (blur) do campo de valor da parcela, limpa o milhar e formata o padrão brasileiro. [cite: 1261]
        containerAbaConteudo.querySelectorAll('.input-valor-parcela-item').forEach(inputValor => { // Varre os valores inline. [cite: 1262]
            inputValor.addEventListener('blur', (e) => { // Ouve as digitações monetárias diretas nas parcelas. [cite: 1262]
                const idx = parseInt(e.target.getAttribute('data-index')); // Identifica a linha correspondente. [cite: 1262]
                dadosLocais.proposta.parcelasSimuladas[idx].valor = limparMoedaParaNumero(e.target.value); // Converte o texto em número decimal estável. [cite: 1262]
                
                // Recalcula o montante consolidado cobrado somando as linhas com os juros inseridos. [cite: 1263]
                const novoTotalSoma = dadosLocais.proposta.parcelasSimuladas.reduce((total, p) => total + (p.valor || 0), 0); // Soma os vetores. [cite: 1263]
                dadosLocais.proposta.valorCobrado = parseFloat(novoTotalSoma.toFixed(2)); // Atualiza o total cobrado. [cite: 1263]
                
                callbackRecarregarAba(); // Redesenha a aba para formatar os valores digitados de forma limpa. [cite: 1263]
            }); // Fecha a linha. [cite: 1264]
        }); // Fecha a varredura. [cite: 1264]
    } // Encerra as travas exclusivas do parcelado. [cite: 1265]

    // REGRA DE MERCADO ADICIONADA: Configura a escuta de desfoque no input de juros/abatimento limpando e convertendo texto em número real. [cite: 1265]
    document.getElementById('prop-valor-modificador').addEventListener('blur', (e) => { // Ouve as digitações de descontos fixos de topo. [cite: 1266]
        dadosLocais.proposta.valorModificador = limparMoedaParaNumero(e.target.value); // Limpa as pontuações e converte. [cite: 1266]
        dadosLocais.proposta.parcelasSimuladas = []; // Reseta o cache para forçar a proporcionalidade matemática das parcelas. [cite: 1266]
        calcularValoresPropostaInterno(); // Dispara o recálculo volátil. [cite: 1266]
        callbackRecarregarAba(); // Redesenha a aba com os valores recalculados e formatados em milhar. [cite: 1266]
    }); // Fecha o desfoque de topo. [cite: 1266]

    // NOVO EVENTO DE CONTROLE: Configura a limpeza total da proposta no clique do botão vermelho tracejado. [cite: 1267]
    document.getElementById('btn-zerar-proposta').addEventListener('click', () => { // Ouve a destruição da simulação. [cite: 1268]
        const confirmacaoReset = confirm("⚠️ CONTROLADORIA DE CAIXA:\nDeseja anular completamente a proposta simulada atual?\n\nEsta ação redefinirá os modificadores para zero e apagará o cronograma de parcelas construído."); // Caixa humana de aviso. [cite: 1268]
        if (confirmacaoReset) { // Se aceito o descarte. [cite: 1268]
            dadosLocais.proposta = { // Mescla limpando o dicionário de rascunhos. [cite: 1268]
                valorCobrado: dadosLocais.valorVencido, // Restaura o valor cobrado para o saldo devedor original puro. [cite: 1268]
                tipoModificador: 'R$', // Retorna à moeda fixada. [cite: 1269]
                valorModificador: 0, // Zera os acréscimos fixos. [cite: 1269]
                taxaJurosMensal: 0, // NOVA INTELIGÊNCIA: Zera as taxas mensais de financiamento no reset.
                formaPagamento: 'A vista', // Força o retorno ao padrão à vista. [cite: 1269]
                tipoPagamento: 'Boleto', // Força o documento boleto de fábrica. [cite: 1269]
                qtdParcelas: 1, // Limita a uma única fatura cheia. [cite: 1269]
                parcelasSimuladas: [], // Esvazia as linhas do cronograma. [cite: 1269]
                dataPrimeiroVencimento: new Date().toISOString().split('T')[0] // Seta a data de hoje. [cite: 1270]
            }; // Encerra o pacote de limpeza. [cite: 1270]
            callbackRecarregarAba(); // Redesenha a tela limpando as linhas e redefinindo a calculadora instantaneamente. [cite: 1270]
        } // Encerra a árvore de descarte. [cite: 1270]
    }); // Fecha a lixeira de rascunhos. [cite: 1271]

    document.getElementById('prop-tipo-modificador').addEventListener('change', (e) => { // Escuta a alteração do tipo de modificador (reais ou porcentagem). [cite: 1271]
        dadosLocais.proposta.tipoModificador = e.target.value; // Salva a escolha do operador na cópia da memória local. [cite: 1271]
        dadosLocais.proposta.parcelasSimuladas = []; // Limpa o plano para recalcular os montantes. [cite: 1271]
        calcularValoresPropostaInterno(); // Recalcula os saldos da tela de forma imediata. [cite: 1271]
        callbackRecarregarAba(); // Redesenha a aba para atualizar as descrições. [cite: 1271]
    }); // Fecha o combo modificador. [cite: 1271]

    const atualizarLinhasSimulacaoDom = () => { // Sub-rotina interna de UX criada para re-plotar o cronograma de parcelas sem tirar o foco do cursor da caixa de texto modificadora. [cite: 1272]
        const containerSimula = document.getElementById('prop-resultado-simulacao'); // Localiza o bloco físico do cronograma. [cite: 1273]
        if (!containerSimula) return; // Trava de segurança. [cite: 1273]
        calcularValoresPropostaInterno(); // Recalcula la simulação de boletos. [cite: 1273]
        const mioloDiv = containerSimula.querySelector('div'); // Localiza o bloco de listagem interna. [cite: 1274]
        if (mioloDiv) { // Se o bloco interno estiver montado. [cite: 1275]
            mioloDiv.innerHTML = dadosLocais.proposta.parcelasSimuladas.map((p, index) => { // Re-plota a grade de parcelas atualizada com os novos inputs editáveis e máscaras aplicadas. [cite: 1276]
                const fPaga = p.pago || p.status === 'pago'; // Checa carimbo de liquidação. [cite: 1276]
                const vFaturaFormatado = (p.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); // Aplica máscara inline. [cite: 1276]
                
                return `
                  <div style="display: flex; justify-content: space-between; align-items: center; background: ${fPaga ? '#ecfdf5' : '#f8fafc'}; border: 1px solid ${fPaga ? '#a7f3d0' : '#e2e8f0'}; padding: 6px 10px; border-radius: 4px; font-size: 12px; gap: 10px;">
                      <span style="font-weight: 600; color: #475569; white-space: nowrap;">Parc. nº ${p.numero}</span>
                      <input type="date" class="input-data-parcela-item" data-index="${index}" ${fPaga ? 'disabled' : ''} value="${p.vencimento}" style="padding: 4px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 11px; font-weight: 600; color: #334155;">
                      <div style="display: flex; align-items: center; gap: 2px;">
                        <span style="font-size: 11px; color: #64748b; font-weight: bold;">R$</span>
                        <input type="text" class="input-valor-parcela-item" data-index="${index}" ${fPaga ? 'disabled' : ''} value="${vFaturaFormatado}" style="width: 90px; padding: 4px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 11px; font-weight: bold; color: #1e293b; text-align: right;">
                      </div>
                      <span style="font-size: 9px; font-weight: bold; background: ${fPaga ? '#10b981' : '#fef3c7'}; color: ${fPaga ? '#ffffff' : '#92400e'}; padding: 2px 4px; border-radius: 4px; text-transform: uppercase; white-space: nowrap;">${fPaga ? '🟩 PAGO' : '⏳ A Vencer'}</span>
                  </div>`; // Junta as strings lineares. [cite: 1285]
            }).join(''); // Junta e renderiza linearmente. [cite: 1285]

            // Re-amarra os monitores de escuta reativa nos novos inputs injetados para evitar perda de dados na digitação em cadeia. [cite: 1285]
            mioloDiv.querySelectorAll('.input-data-parcela-item').forEach(inputData => { // Monitora as datas secundárias. [cite: 1285]
                inputData.addEventListener('change', (evt) => { // Intercepta alteração inline. [cite: 1286]
                    const idx = parseInt(evt.target.getAttribute('data-index')); // Puxa index. [cite: 1286]
                    dadosLocais.proposta.parcelasSimuladas[idx].vencimento = evt.target.value; // Salva o novo prazo inline. [cite: 1286]
                }); // Fecha o listener. [cite: 1286]
            }); // Fecha o laço. [cite: 1286]
            
            mioloDiv.querySelectorAll('.input-valor-parcela-item').forEach(inputValor => { // Monitora os valores secundários. [cite: 1286]
                inputValor.addEventListener('blur', (evt) => { // Intercepta desfoque inline. [cite: 1287]
                    const idx = parseInt(evt.target.getAttribute('data-index')); // Puxa index. [cite: 1287]
                    dadosLocais.proposta.parcelasSimuladas[idx].valor = limparMoedaParaNumero(evt.target.value); // Converte string em float limpo. [cite: 1287]
                    const nTotal = dadosLocais.proposta.parcelasSimuladas.reduce((t, prc) => t + (prc.valor || 0), 0); // Soma as linhas recalculadas. [cite: 1288]
                    dadosLocais.proposta.valorCobrado = parseFloat(nTotal.toFixed(2)); // Atualiza o saldo cobrado total mestre. [cite: 1288]
                    atualizarLinhasSimulacaoDom(); // Recarrega a sub-grade aplicando as formatações visuais nas linhas. [cite: 1288]
                }); // Fecha o listener. [cite: 1289]
            }); // Fecha o laço. [cite: 1289]
        } // Encerra a presença de mioloDiv. [cite: 1289]
    }; // Encerra a sub-rotina de UX do DOM. [cite: 1289]

    document.getElementById('prop-forma').addEventListener('change', (e) => { // Escuta a troca de forma de pagamento (à vista ou parcelado). [cite: 1290]
        dadosLocais.proposta.formaPagamento = e.target.value; // Salva o termo na memória da sessão. [cite: 1290]
        dadosLocais.proposta.qtdParcelas = dadosLocais.proposta.formaPagamento === 'Parcelado' ? 3 : 1; // Ajusta para 3 parcelas automáticas ou força 1 se à vista. [cite: 1290]
        dadosLocais.proposta.parcelasSimuladas = []; // Reseta o array antigo para forçar uma nova montagem proporcional. [cite: 1290]
        calcularValoresPropostaInterno(); // Roda o cálculo financeiro volátil. [cite: 1290]
        callbackRecarregarAba(); // Recarrega o painel re-plotando as caixas ocultas de visto. [cite: 1291]
    }); // Fecha o monitor de formas de pagamento. [cite: 1291]

    document.getElementById('prop-tipo').addEventListener('change', (e) => { // Monitora a escolha do tipo de documento financeiro. [cite: 1292]
        dadosLocais.proposta.tipoPagamento = e.target.value; // Grava a opção selecionada na estrutura local. [cite: 1292]
    }); // Fecha o monitor de tipo de boleto/cartões. [cite: 1292]

    if (dadosLocais.proposta.formaPagamento === 'Parcelado') { // Se o campo de parcelamento estiver ativo em tela. [cite: 1293]
        document.getElementById('prop-qtd').addEventListener('input', (e) => { // Monitora o número de parcelas digitado pelo cobrador. [cite: 1294]
            dadosLocais.proposta.qtdParcelas = Math.max(1, parseInt(e.target.value) || 1); // Força a quantidade mínima a se manter em 1 para evitar erros de dízima por zero. [cite: 1294]
            dadosLocais.proposta.parcelasSimuladas = []; // Reseta o cache de simulação para construir a nova contagem de linhas. [cite: 1294]
            calcularValoresPropostaInterno(); // Recalcula a simulação. [cite: 1294]
            callbackRecarregarAba(); // Atualiza o cronograma completo de parcelas calculadas na tela. [cite: 1295]
        }); // Fecha a escuta de quantidade de parcelas. [cite: 1296]
    } // Encerra a trava de quantidade de parcelas. [cite: 1296]
    
    // Força a execução inicial na montagem da tela para garantir que o array local sempre nasça povoado e pronto para a digitação livre. [cite: 1297]
    if (dadosLocais.proposta.formaPagamento === 'Parcelado' && (!dadosLocais.proposta.parcelasSimuladas || dadosLocais.proposta.parcelasSimuladas.length === 0)) { // Checa cache zerado de linhas. [cite: 1297]
        calcularValoresPropostaInterno(); // Inicia a carga dos boletos automáticos. [cite: 1298]
    } // Encerra a carga forçada de fábrica. [cite: 1298]
  } // Encerra a função principal de renderização da aba Proposta. [cite: 1298]
}; // Encerra a exportação do objeto da calculadora de acordos. [cite: 1300]