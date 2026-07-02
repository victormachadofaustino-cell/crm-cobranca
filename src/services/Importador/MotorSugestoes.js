// -> Conecta o motor de sugestões diretamente com as referências e chaves do banco de dados na nuvem.
import { db } from '../../config/firebase.js'; // -> Puxa a fiação de segurança e acesso do arquivo de configuração do Firebase.
// -> Puxa os comandos cirúrgicos do SDK do Firestore para consultar coleções de forma atômica.
import { collection, getDocs } from 'firebase/firestore'; // -> Traz do SDK do Google as engrenagens de leitura em lote para coleções NoSQL.

export class MotorSugestoes { // -> Declara a classe especialista encarregada de cruzar os dados do Excel com os do banco.

  constructor() { // -> Inicializa o construtor que prepara a memória ram do componente ao ser criado.
    this.cobrancasAtivasNoBanco = []; // -> Cria uma gaveta limpa em formato de lista para armazenar as cobranças vivas da nuvem.
  } // -> Encerra o construtor da classe.

  // 🔄 SINCRONIZAÇÃO EM BACKGROUND: Puxa o estado atual do Kanban para confrontar com o Excel
  async carregarFichasAtivasDoBanco() { // -> Declara a função assíncrona que lê as pastas de devedores salvas no servidor.
    const cobrancasCollectionRef = collection(db, "cobrancas"); // -> Cria uma rota de mira apontando direto para a coleção de cobranças.
    const snapshot = await getDocs(cobrancasCollectionRef); // -> Dispara o gatilho de leitura e aguarda o lote de documentos descer da nuvem.
    
    this.cobrancasAtivasNoBanco = []; // -> Limpa a lista local da memória para não misturar dados com cargas anteriores.
    
    snapshot.forEach((doc) => { // -> Abre um laço de repetição para inspecionar pasta por pasta de clientes retornada.
      const dadosFicha = doc.data(); // -> Copia o objeto de informações de dentro do documento NoSQL da vez.
      dadosFicha.id = doc.id; // -> Injeta o ID fixo do documento (que é o CNPJ) para o React não perder o rastreio.
      
      this.cobrancasAtivasNoBanco.push({ id: doc.id, ...dadosFicha }); // -> Guarda a ficha estruturada completa na nossa esteira interna de confrontação.
    }); // -> Encerra a varredura dos documentos do banco.
  } // -> Encerra a função de carga de fichas ativas.

  // 🧠 O CÉREBRO DO DE-PARA: Cruza as faturas e gera a árvore de sugestões agrupadas com os filhos para o operador
  async processarSugestoesDeCarga(dadosPlanilhaHigienizados, modoCarga = "aging") { // -> Motor mestre que recebe a planilha aberta e o modo de operação escolhido.
    await this.carregarFichasAtivasDoBanco(); // -> Invoca o carregador do banco para garantir que a foto do Kanban na memória está atualizada.
    
    const listaDeSugestoesFinais = []; // -> Cria o balde final onde jogaremos as decisões formatadas que abastecerão o modal.
    const mapaDevedoresAgrupados = {}; // -> Inicializa um dicionário em RAM para agrupar as NFs sob um mesmo cliente devedor.

    // =========================================================================================
    // ETAPA A: AGRUPAMENTO EM MEMÓRIA RAM DAS NOTAS FISCAIS DO EXCEL POR SOLDTO ÚNICO
    // =========================================================================================
    dadosPlanilhaHigienizados.forEach(reg => { // -> Roda um laço varrendo linha por linha as Notas Fiscais lidas do Excel.
      const chaveSoldTo = reg.soldTo; // -> Captura o código numérico da conta do devedor para usar como chave de unificação.
      
      if (!mapaDevedoresAgrupados[chaveSoldTo]) { // -> Se for a primeira vez que essa conta aparece na planilha:
        mapaDevedoresAgrupados[chaveSoldTo] = { // -> Inicializa a estrutura mestre do devedor com os dados cadastrais da linha.
          soldTo: reg.soldTo, // -> Grava o código da conta do cliente.
          cliente: reg.cliente, // -> Grava o nome ou Razão Social do devedor.
          cnpj: reg.cnpj, // -> Grava o CNPJ de 14 dígitos puros.
          local: reg.local, // -> Grava a cidade da praça de cobrança.
          regiao: reg.regiao, // -> Grava o estado de comarca.
          executivo: reg.executivo, // -> Grava o vendedor responsável da conta.
          titulosAReceber: [] // -> Cria o array de filhos que receberá as Notas Fiscais individuais abertas deste cliente.
        }; // -> Encerra o molde mestre.
      } // -> Fim da inicialização do grupo.
      
      mapaDevedoresAgrupados[chaveSoldTo].titulosAReceber.push({ // -> Anexa a Nota Fiscal da linha corrente na lista de títulos deste cliente.
        idTemporario: reg.idTemporario || `id_temp_${reg.referencia}`, // -> Repassa ou gera a ID exclusiva de flegagem cirúrgica por item.
        numDocumento: String(reg.numDocumento || ""), // -> Número do contrato ou documento convertido em texto seguro.
        referencia: reg.referencia, // -> Código de referência da Nota Fiscal.
        atribuicao: reg.atribuicao, // -> Tipo ou modalidade de faturamento da venda.
        dataDocumento: reg.dataDoc, // -> Data de emissão da Nota Fiscal.
        vencimentoLiquido: reg.vencimento, // -> Data de vencimento do título.
        valorNota: reg.montante, // -> Saldo flutuante numérico real do preço da nota.
        executivoVendas: reg.executivo // -> Vendedor dono da carteira.
      }); // -> Encerra o empilhamento da nota filha.
    }); // -> Encerra o laço de agrupamento da planilha.

    // =========================================================================================
    // ETAPA B: APLICAÇÃO DAS REGRAS OPERACIONAIS EM CADA SACOLA UNIFICADA
    // =========================================================================================
    for (const soldToKey of Object.keys(mapaDevedoresAgrupados)) { // -> Percorre grupo por grupo de devedor unificado na memória RAM.
      const devedorLote = mapaDevedoresAgrupados[soldToKey]; // -> Isola a sacola e a lista de Notas Fiscais do cliente da vez.
      const cardExistenteNoFirebase = this.cobrancasAtivasNoBanco.find(c => c.id === devedorLote.soldTo || c.cnpj === devedorLote.cnpj); // -> Caça na esteira do banco se esse cliente já tem card ativo.

      let acaoSugeridaRobo = "CRIAR"; // -> Define a ação inicial como criação de nova cobrança.
      let justificativaTexto = "Devedor inédito detectado na planilha. O sistema criará um novo card na primeira raia do Kanban."; // -> Prepara a frase descritiva para o operador.
      let raiaDestinoSugerida = "novo"; // -> Sugere o posicionamento inicial na calha cinza do funil.
      let idDocumentoDestino = devedorLote.soldTo; // -> Define a ID física de gravação do card como o próprio código SoldTo.

      if (modoCarga === "inicial") { // -> 🛡️ REGRA 1: Se o botão clicado foi de Carga Inicial, força a esteira a abrir novos caminhos nominais.
        if (cardExistenteNoFirebase) { // -> Se o cliente já existia no sistema:
          acaoSugeridaRobo = "RAMIFICAR_NOVO_CARD"; // -> Força a ramificação para não bagunçar ou sobrescrever o saldo antigo.
          idDocumentoDestino = `${devedorLote.soldTo}_INI_${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}`; // -> Gera uma ID nova datada para isolar este lote de faturamento.
          justificativaTexto = "Carga Inicial Manual: Este cliente já possui histórico. Foi gerada uma nova ramificação isolada para esta nova cobrança nominal."; // -> Alerta explicativo.
        } // -> Fim da checagem.
      } else { // -> 🛡️ REGRA 2: Se o botão for de Confronto de Extrato Aging Diário, roda a inteligência relacional de manutenção.
        if (cardExistenteNoFirebase) { // -> Caso localize o devedor ativo navegando no Kanban:
          const statusAtualDoCard = cardExistenteNoFirebase.status || "novo"; // -> Descobre em qual raia do funil o card está estacionado hoje.

          if (statusAtualDoCard === "conta_corrente") { // -> Se o cliente estiver na esteira ativa de Conta Corrente:
            acaoSugeridaRobo = "MESCLAR_CONTA_CORRENTE"; // -> Sugere a fusão e o acoplamento de saldos (Adicionar NFs).
            raiaDestinoSugerida = "conta_corrente"; // -> Mantém o card travado na calha de Conta Corrente.
            justificativaTexto = "Acúmulo de Saldo: Cliente ativo em Conta Corrente. As novas NFs marcadas serão adicionadas à sacola ativa deste card, atualizando o total."; // -> Alerta explicativo.
          } 
          else if (statusAtualDoCard === "acordo" || statusAtualDoCard === "cobranca") { // -> Se o cliente já tiver um Acordo Price formalizado e fechado:
            acaoSugeridaRobo = "RAMIFICAR_NOVO_CARD"; // -> Sugere ramificar para proteger o parcelamento antigo de resets.
            raiaDestinoSugerida = "novo"; // -> O novo bolo de Notas Fiscais adicionais nasce limpo na raia inicial para nova negociação.
            idDocumentoDestino = `${devedorLote.soldTo}_ADD_${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}`; // -> Gera uma ID secundária de acréscimo para não quebrar os boletos Price.
            justificativaTexto = "Atenção: Este cliente possui um Acordo Comercial Price trancado. As novas NFs adicionais criarão um novo card separado para triagem."; // -> Alerta explicativo.
          } 
          else { // -> Se o cliente estiver nas raias normais de cobrança em andamento (novo, contato, negociacao):
            acaoSugeridaRobo = "ATUALIZAR_ESTEIRA"; // -> Sinaliza a atualização comum de saldo da carteira.
            raiaDestinoSugerida = statusAtualDoCard; // -> Mantém o card exatamente na mesma raia onde o cobrador já está trabalhando o devedor.
            justificativaTexto = "Notas adicionais encontradas no extrato. O sistema acoplará os novos títulos flegados atualizando o saldo do card nesta raia."; // -> Alerta explicativo.
          }
        } // -> Fim da checagem de cards existentes para Aging.
      } // -> Fim do bloco de regras por modo de carga.

      listaDeSugestoesFinais.push({ // -> Aloca o mapa de sugestão completo na esteira de resultados da Mesa de Decisão.
        idUnicaLote: devedorLote.soldTo, // -> Define o código identificador do lote.
        idDocumentoAlvo: idDocumentoDestino, // -> Passa o caminho físico exato de gravação que o Firebase receberá.
        soldTo: devedorLote.soldTo, // -> Repassa a conta do cliente.
        cliente: devedorLote.cliente, // -> Repassa a Razão Social.
        cnpj: devedorLote.cnpj, // -> Repassa o CNPJ limpado.
        local: devedorLote.local, // -> Repassa o município.
        regiao: devedorLote.regiao, // -> Repassa o estado.
        executivo: devedorLote.executivo, // -> Repassa o vendedor.
        titulosAReceber: devedorLote.titulosAReceber, // -> Envia a lista contendo todas as faturas filhas abertas de forma unitária com seus IDs.
        cardHistoricoRef: cardExistenteNoFirebase || null, // -> Envia a ficha antiga do banco para cross-check e comparativos na tela.
        acaoSugerida: acaoSugeridaRobo, // -> Carimba o token identificador da decisão do robô.
        raiaSugerida: raiaDestinoSugerida, // -> Carimba para qual coluna do Kanban o registro deve ir.
        justificativa: justificativaTexto, // -> Envia o texto de justificativa que o operador lerá na tela.
        aprovadoPeloOperador: true // -> Inicializa a flag mestre ativada por padrão de governança.
      }); // -> Encerra o empilhamento da sugestão corporativa.
    } // -> Encerra o laço das sacolas agrupadas.

    // =========================================================================================
    // ETAPA C: RASTREADOR DE CONCILIAÇÃO AUTOMÁTICA (SUMIÇO DE NOTAS FISCAIS NO EXCEL AGING)
    // =========================================================================================
    if (modoCarga === "aging") { // -> A caça por sumiço de notas (baixas automáticas) só deve rodar se o modo for Confronto Aging Diário.
      this.cobrancasAtivasNoBanco.forEach(cardBanco => { // -> Abre uma varredura passando o pente fino em todos os cards ativos no cofre NoSQL.
        // 🛠️ GENERALIZAÇÃO DE SINAL: Monitona qualquer card active que possua notas fiscais abertas e ainda não esteja finalizado
        if (cardBanco.status !== "finalizado" && cardBanco.titulos && Array.isArray(cardBanco.titulos)) { // -> Filtra cards elegíveis na esteira.
          cardBanco.titulos.forEach(tituloSalvo => { // -> Visita uma por uma cada Nota Fiscal que está cobrando desse cliente na nuvem.
            if (tituloSalvo.referencia) { // -> Verifica se a nota possui código de referência válido.
              
              // -> Checa dinamicamente se essa Nota Fiscal sumiu da listagem do novo arquivo Excel Aging carregado
              const notaFiscalContinuaNaPlanilha = dadosPlanilhaHigienizados.some(reg => String(reg.referencia).trim().toUpperCase() === String(tituloSalvo.referencia).trim().toUpperCase()); // -> Retorna true se a nota ainda constar no arquivo.

              if (!notaFiscalContinuaNaPlanilha) { // -> 🚨 DETECTADO SUMIÇO (SALDO MENOR): Se a nota sumiu no extrato do cliente, acusa o pagamento automático!
                listaDeSugestoesFinais.push({ // -> Cria uma linha especial de decisão de liquidação na Mesa de Triagem.
                  idUnicaLote: `BAIXA_${cardBanco.id}_${tituloSalvo.referencia}`, // -> Cria o ID único do lote de conciliação.
                  idDocumentoAlvo: cardBanco.id, // -> Aponta para o ID do card mestre que sofrerá o abatimento em dinheiro.
                  soldTo: cardBanco.soldTo || cardBanco.id, // -> Código conta ERP.
                  cliente: cardBanco.cliente, // -> Razão social do devedor.
                  cnpj: cardBanco.cnpj || "", // -> CNPJ da empresa.
                  local: cardBanco.local || "", // -> Cidade comarca.
                  regiao: cardBanco.regiao || "", // -> Estado comarca.
                  executivo: tituloSalvo.executivoVendas || "Controladoria", // -> Origem de vendas.
                  titulosAReceber: [{ // -> Envia o espelho da nota fiscal que sumiu em formato de objeto compatível.
                    idTemporario: `id_temp_baixa_${tituloSalvo.referencia}`, // -> ID temporário de flegagem.
                    numDocumento: tituloSalvo.numDocumento || "", // -> Contrato.
                    referencia: tituloSalvo.referencia, // -> Código da nota fiscal liquidada.
                    atribuicao: tituloSalvo.atribuicao || "BAIXA AUTOMÁTICA", // -> Descrição do fluxo.
                    dataDocumento: tituloSalvo.dataDocumento || "", // -> Emissão histórica.
                    vencimentoLiquido: tituloSalvo.vencimentoLiquido || "", // -> Vencimento histórico.
                    valorNota: tituloSalvo.valorNota, // -> Valor exato abatido.
                    executivoVendas: tituloSalvo.executivoVendas || "Sistema" // -> Assinatura.
                  }], // -> Encerra o array da nota faltante.
                  cardHistoricoRef: cardBanco, // -> Repassa a ficha completa do banco para a sub-tabela detalhar o abatimento.
                  acaoSugerida: "LIQUIDAR_CONCILIACAO", // -> Carimba o token de conciliação bancária por sumiço de título.
                  raiaSugerida: cardBanco.status || "novo", // -> Mantém o card fixo na mesma raia do seu status atual, apenas abatendo as moedas.
                  justificativa: `Baixa por Extrato Aging: A Nota Fiscal ${tituloSalvo.referencia} não consta mais no Aging diário. Indicação de quitação direta. Sugestão: Liquidar e abater R$ ${tituloSalvo.valorNota?.toLocaleString("pt-BR")} do card.`, // -> Mensagem explicativa de auditoria visual.
                  aprovadoPeloOperador: true // -> Inicializa marcado para que o operador dê a baixa rápida em lote com um clique.
                }); // -> Encerra o empilhamento de baixa automática por sumiço.
              } // -> Fim da detecção de sumiço.
            } // -> Fim da verificação de referência.
          }); // -> Fim do loop das faturas internas do devedor.
        } // -> Fim do filtro de cards qualificados.
      }); // -> Fim da varredura geral de conciliação.
    } // -> Fim da trava de modo aging.

    return listaDeSugestoesFinais; // -> Devolve a esteira consolidada contendo todas as decisões e cruzamentos NoSQL para a tabela do modal.
  } // -> Encerra o método processarSugestoesDeCarga.
} // -> Encerra a declaração mestre da classe MotorSugestoes.