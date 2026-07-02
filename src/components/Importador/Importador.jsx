import React, { useState } from 'react'; // -> Traz a biblioteca mestre do React e o gancho de estados para gerenciar as telas de fluxo de dados.
import ReactDOM from 'react-dom/client'; // -> Importa o assistente de engenharia do React para estancar o ReferenceError e renderizar as janelas modais diretamente no HTML.
import * as XLSX from 'xlsx'; // -> Importa a biblioteca SheetJS especialista em ler, traduzir e decodificar arquivos binários do Excel nativo.
import { db } from '../../config/firebase.js'; // -> Conecta o componente de carga direta com as referências e chaves de rede do banco de dados na nuvem.
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore'; // -> Puxa as ferramentas especialistas do SDK do Firestore para gravações unificadas e atômicas.
import { UploadCloud, FileSpreadsheet, AlertTriangle, CheckCircle2 } from 'lucide-react'; // -> Injeta a coleção de ícones lineares executivos da biblioteca Lucide para ilustrar o fluxo de upload do sistema.

// -> IMPORTAÇÃO DOS NOVOS MÓDULOS FILHOS ESPECIALISTAS DA ESTEIRA DE AUTONOMIA
import { ValidadorEmpresas } from '../../services/Importador/ValidadorEmpresas'; // -> Importa o higienizador de CNPJs e cadastros corporativos de retaguarda.
import { MotorSugestoes } from '../../services/Importador/MotorSugestoes'; // -> Importa o cérebro analítico de cruzamento e geração de sugestões NoSQL.
import { FiltroLimboSobrantes } from '../../services/Importador/FiltroLimboSobrantes'; // -> Importa o isolador de inconsistências e dados malformados da planilha.
import ModalConferenciaAging from './ModalConferenciaAging'; // -> Importa a janela de checkout visual onde o operador exercerá sua validação de lote por flegagem.

export class ImportadorAging { // -> Mantém a assinatura da classe de arranque exportada para o perfeito acoplamento com a Toolbar do App.jsx.
  constructor(onSucessoCallback) { // -> Construtor que recebe a trigger de atualização imediata da prancha Kanban.
    this.onSucesso = onSucessoCallback; // -> Memoriza o callback para atualizar a tela no final do processamento de carga.
  } // -> Encerra o construtor.

  renderizarBotaoUpload(containerId) { // -> Método que renderiza os botões oficiais na barra de ferramentas do CRM.
    const container = document.getElementById(containerId); // -> Captura a div de ancoragem da Toolbar da página.
    if (!container) return; // -> Aborta o procedimento se o contêiner não estiver presente na árvore visível do HTML.

    const elementosAntigos = container.querySelectorAll('.wrapper-importador-aging'); // -> Caça o agrupador anterior.
    elementosAntigos.forEach(el => el.remove()); // -> Limpa a memória RAM visual da Toolbar.

    const wrapper = document.createElement('div'); // -> Fabrica uma div de envelopamento para alinhar os dois botões lado a lado.
    wrapper.className = 'wrapper-importador-aging'; // -> Batiza a classe do contêiner.
    wrapper.style.display = 'flex'; // -> Ativa o alinhamento flexbox horizontal.
    wrapper.style.gap = '8px'; // -> Cria um espaçamento técnico elegante de 8px entre as ações.
    wrapper.style.alignItems = 'center'; // -> Centraliza os elementos na vertical.

    const btnCarga = document.createElement('button'); // -> Fabrica o botão de início de cobrança.
    btnCarga.className = 'btn-importar-debitos'; // -> Batiza a classe.
    btnCarga.innerHTML = 'Iniciar Lote Débitos'; // -> Rótulo comercial sóbrio e formal.
    this.aplicarEstiloBotao(btnCarga, '#0f172a'); // -> Aplica a cor Azul Escuro Profundo institucional da DOCULOC.

    const btnAging = document.createElement('button'); // -> Fabrica o botão de conciliação.
    btnAging.className = 'btn-importar-aging'; // -> Batiza a classe.
    btnAging.innerHTML = 'Sincronizar Aging'; // -> Rótulo comercial sóbrio e formal.
    this.aplicarEstiloBotao(btnAging, '#475569'); // -> Aplica a cor Cinza Ardósia administrativo discreto.

    const inputOculto = document.createElement('input'); // -> Fabrica a caixa secreta de arquivos invisível do navegador.
    inputOculto.type = 'file'; // -> Configura o tipo para seleção de arquivos.
    inputOculto.accept = '.xlsx, .xls'; // -> Restringe para planilhas legítimas do Microsoft Excel.
    inputOculto.style.display = 'none'; // -> Oculta o elemento do layout principal.

    let modoSelecionadoLocal = "aging"; // -> Variável de controle local para capturar a intenção do clique do operador.

    btnCarga.addEventListener('click', () => { modoSelecionadoLocal = "inicial"; inputOculto.click(); }); // -> Seta o modo inicial e abre o gerenciador de arquivos.
    btnAging.addEventListener('click', () => { modoSelecionadoLocal = "aging"; inputOculto.click(); }); // -> Seta o modo aging e abre o gerenciador de arquivos.
    
    inputOculto.addEventListener('change', async (e) => { // -> Ouve quando o operador confirma a escolha de um arquivo legítimo.
      const arquivo = e.target.files[0]; // -> Isola o arquivo binário selecionado no explorer.
      if (arquivo) { // -> Se o arquivo passar na trava de integridade física.
        const leitor = new FileReader(); // -> Instancia o leitor binário nativo do navegador.
        leitor.onload = async (evento) => { // -> Define a rotina assíncrona executada ao ler os bytes da máquina.
          const dadosBinarios = evento.target.result; // -> Captura a string de dados binários brutos do arquivo.
          const pastaTrabalho = XLSX.read(dadosBinarios, { type: 'binary', cellDates: true }); // -> Invoca o decodificador do SheetJS para ler todas as abas.
          
          let linhasDebitosJSON = []; // -> Balde para reter os dados convertidos da aba de Débitos.
          let linhasContatosJSON = []; // -> Balde para reter os dados convertidos da aba de Contatos.

          pastaTrabalho.SheetNames.forEach((nomeAba) => { // -> Percorre la lista de abas do arquivo.
            const nomeLimpo = nomeAba.toUpperCase().trim(); // -> Normaliza o nome da aba em caixa alta.
            const prancha = pastaTrabalho.Sheets[nomeAba]; // -> Captura a aba correspondente.

            if (nomeLimpo.includes("DÉBITO") || nomeLimpo.includes("DEBITO")) { // -> Se for a aba contendo a tabela de títulos:
              linhasDebitosJSON = XLSX.utils.sheet_to_json(prancha, { header: 1, defval: "" }); // -> Converte forçando matriz bidimensional rígida (header: 1).
            } else if (nomeLimpo.includes("CONTATO") || nomeLimpo.includes("CONTACTO")) { // -> Se for a aba contendo a lista humana sem padrão:
              linhasContatosJSON = XLSX.utils.sheet_to_json(prancha, { defval: "" }); // -> Converte em array clássico de objetos JSON.
            }
          });

          if (linhasDebitosJSON.length === 0) { 
            linhasDebitosJSON = XLSX.utils.sheet_to_json(pastaTrabalho.Sheets[pastaTrabalho.SheetNames[0]], { header: 1, defval: "" }); 
          }

          const orquestrador = new OrquestradorProcesamento(linhasDebitosJSON, linhasContatosJSON, this.onSucesso, modoSelecionadoLocal); // -> Transmite os dados para o robô de processamento.
          await orquestrador.iniciarFluxoDeAnalise(); // -> Dispara os motores de triagem.
        }; 
        leitor.readAsBinaryString(arquivo); // -> Inicia a leitura física do arquivo da máquina para o buffer.
      } 
    }); 

    wrapper.appendChild(btnCarga); 
    wrapper.appendChild(btnAging); 
    wrapper.appendChild(inputOculto); 
    container.appendChild(wrapper); 
  } 

  aplicarEstiloBotao(btn, corFundo) { 
    btn.style.padding = '6px 14px'; 
    btn.style.backgroundColor = corFundo; 
    btn.style.color = '#ffffff'; 
    btn.style.border = 'none'; 
    btn.style.borderRadius = '6px'; 
    btn.style.cursor = 'pointer'; 
    btn.style.fontWeight = '700'; 
    btn.style.fontSize = '12px'; 
    btn.style.height = '30px'; 
  } 
} 

class OrquestradorProcesamento { 
  constructor(linhasDebitos, linhasContatos, callbackSucesso, modoOperacao) { 
    this.linhasDebitos = linhasDebitos; 
    this.linhasContatos = linhasContatos; 
    this.callbackSucesso = callbackSucesso; 
    this.modoOperacao = modoOperacao; 
    
    this.validadorCadastros = new ValidadorEmpresas(); 
    this.motorInteligencia = new MotorSugestoes(); 
    this.filtroResiduos = new FiltroLimboSobrantes(); 
  } 

  // 🛡️ SHIELD RECURSIVO ANTI-UNDEFINED: Varre profundamente qualquer objeto/array e expurga resíduos nulos para satisfazer o Firebase de forma vitalícia
  saneadorObjetoNoSQL(obj) {
    if (obj === undefined || obj === null) return ""; // -> Se o próprio dado for nulo, transmuta para string estável vazia.
    if (typeof obj !== 'object') return obj; // -> Se for um tipo primitivo saudável (string, número, booleano), passa direto.
    
    if (Array.isArray(obj)) { // -> Se for um array de objetos (como a sacola de Notas Fiscais):
      return obj.map(item => this.saneadorObjetoNoSQL(item)); // -> Saneia recursivamente item por item da lista.
    }
    
    const rascunhoLimpado = {}; // -> Fabrica um novo dicionário limpo em RAM.
    Object.keys(obj).forEach(key => { // -> Passa pente fino chave por chave.
      const valorOriginal = obj[key];
      // Se for uma chave técnica do Firebase (como Timestamp ou FieldValue), não altera para preservar a engine
      if (valorOriginal && typeof valorOriginal === 'object' && valorOriginal.constructor?.name === 'FieldValue') {
        rascunhoLimpado[key] = valorOriginal;
      } else {
        rascunhoLimpado[key] = this.saneadorObjetoNoSQL(valorOriginal); // -> Limpa profundamente o campo interno.
      }
    });
    return rascunhoLimpado; // -> Devolve o payload 100% imune a quebras.
  }

  async iniciarFluxoDeAnalise() { 
    try { 
      const triagemDeIntegridade = this.filtroResiduos.filtrarAbaDebitos(this.linhasDebitos); 
      const faturasSaudaveisLimpas = triagemDeIntegridade.linhasSanas; 
      const residuosSobrantesIdentificados = triagemDeIntegridade.sobrantesRejeitados; 

      const contatosDiscernidos = this.filtroResiduos.filtrarAbaContatos(this.linhasContatos); 

      const mapaSugestoesGerado = await this.motorInteligencia.processarSugestoesDeCarga(faturasSaudaveisLimpas, this.modoOperacao); 

      const loteCompletoParaOConferidor = [
        ...mapaSugestoesGerado.map(sug => ({ ...sug, contatosIdentificados: contatosDiscernidos })), 
        ...residuosSobrantesIdentificados.map((res, i) => ({ 
          idTemporario: `residuo_${res.referencia}-${res.linhaPlanilha}-${i}`, 
          soldTo: res.soldTo || "",
          cliente: res.cliente || "",
          cnpj: res.cnpj || "",
          numDocumento: String(res.numDocumento || "0"),
          referencia: res.referencia || "",
          atribuicao: "SOBRANTE REJEITADO",
          dataDoc: "N/A", vencimento: "N/A",
          montante: res.valor || 0,
          executivo: "SISTEMA",
          acaoSugerida: "REJEITAR_LIMBO", 
          justificativa: `Linha #${res.linhaPlanilha} del Excel Rejeitada. Diagnóstico: ${res.erroDiagnostico}. Este dado não será injetado.`, 
          aprovadoPeloOperador: false, 
          contatosIdentificados: [] 
        })) 
      ]; 

      this.renderizarModalDeConferenciaNaTela(loteCompletoParaOConferidor); 

    } catch (err) { 
      console.error(err); 
      alert("Erro crítico ao rodar fluxo de análise del lote de planilhas."); 
    } 
  } 

  renderizarModalDeConferenciaNaTela(loteSugestoes) { 
    const containerModal = document.createElement('div'); 
    containerModal.id = 'nó-sustentacao-modal-conferencia'; 
    document.body.appendChild(containerModal); 

    const aoFecharModalLocal = () => { 
      containerModal.remove(); 
    }; 

    const aoConfirmarProcessamentoFinal = async (faturasAprovadasPeloOperador) => { 
      const botaoConfirmar = document.getElementById('btn-confirmar-carga-final'); 
      if (botaoConfirmar) { 
        botaoConfirmar.disabled = true; 
        botaoConfirmar.innerHTML = '⏳ Gravando Alterações na Nuvem...'; 
      } 

      try { 
        const colecaoCobrancasRef = collection(db, 'cobrancas'); 
        const colecaoContatosRef = collection(db, 'cadastros_contatos'); 
        let totalCobrancasSalvas = 0; 

        for (const faturaAproved of faturasAprovadasPeloOperador) { 
          if (faturaAproved.acaoSugerida === "REJEITAR_LIMBO") continue; 

          if (faturaAproved.acaoSugerida === "LIQUIDAR_CONCILIACAO") { 
            const cardBancoRef = doc(db, "cobrancas", faturaAproved.idDocumentoAlvo); 
            const listaFaturasLimpa = (faturaAproved.cardHistoricoRef?.titulos || []).filter(t => t.referencia !== faturaAproved.titulosAReceber[0]?.referencia); 
            const novoSaldoAbatido = listaFaturasLimpa.reduce((acc, n) => acc + (parseFloat(n.valorNota) || 0), 0); 
            
            const payloadLiquida = this.saneadorObjetoNoSQL({ 
              titulos: listaFaturasLimpa, 
              valorVencido: novoSaldoAbatido, 
              valor: novoSaldoAbatido, 
              historicoNotas: [ 
                { conteudo: `Baixa Automática Aging: Título ${faturaAproved.titulosAReceber[0]?.referencia} liquidado via extrato.`, dataHora: new Date().toLocaleDateString("pt-BR") + " às " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) },
                ...(faturaAproved.cardHistoricoRef?.historicoNotas || []) 
              ]
            });

            await setDoc(cardBancoRef, payloadLiquida, { merge: true }); 
            totalCobrancasSalvas++; 
            continue; 
          } 

          const dadosPJMae = await this.validadorCadastros.garantirCadastroEmpresa(faturaAproved.cnpj, faturaAproved.cliente, faturaAproved.local, faturaAproved.regiao); 
          const devedorDocRef = doc(colecaoCobrancasRef, faturaAproved.idDocumentoAlvo); 
          
          let listaNotasFiscaisFinais = [...faturaAproved.titulosAReceber]; 
          let historicoNotasFinal = []; 

          if (faturaAproved.acaoSugerida === "MESCLAR_CONTA_CORRENTE" || faturaAproved.acaoSugerida === "ATUALIZAR_ESTEIRA") { 
            const faturasAntigas = faturaAproved.cardHistoricoRef?.titulos || []; 
            const faturasNovasNaoDuplicadas = faturaAproved.titulosAReceber.filter(nfNova => !faturasAntigas.some(nfAntiga => nfAntiga.referencia === nfNova.referencia)); 
            listaNotasFiscaisFinais = [...faturasAntigas, ...faturasNovasNaoDuplicadas]; 
            historicoNotasFinal = [ 
              { conteudo: `Lote processado. Anexadas ${faturasNovasNaoDuplicadas.length} novas NFs marcadas voluntariamente na triagem por item.`, dataHora: new Date().toLocaleDateString("pt-BR") + " às " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) },
              ...(faturaAproved.cardHistoricoRef?.historicoNotas || []) 
            ];
          } else { 
            historicoNotasFinal = [{ 
              conteudo: faturaAproved.acaoSugerida === "RAMIFICAR_NOVO_CARD" ? "Nova cobrança isolada criada para novas NFs selecionadas, protegendo o acordo Price antigo contra resets." : "Lote de cobrança iniciado com faturamento unificado via triagem pré-carga.",
              dataHora: new Date().toLocaleDateString("pt-BR") + " às " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
            }];
          } 

          const novoMontanteConsolidado = listaNotasFiscaisFinais.reduce((acc, n) => acc + (parseFloat(n.valorNota) || 0), 0); 
          const itemEspelho = listaNotasFiscaisFinais[0] || {}; 

          const rawPayloadCobranca = { 
            soldTo: faturaAproved.soldTo || "",
            codigo: faturaAproved.soldTo || "",
            cliente: dadosPJMae?.cliente || dadosPJMae?.razaoSocial || faturaAproved.cliente || "", 
            cnpj: faturaAproved.cnpj || "",
            titulos: listaNotasFiscaisFinais || [],
            numDocumento: itemEspelho.numDocumento || 0,
            referencia: itemEspelho.referencia || "",
            atribuicao: itemEspelho.atribuicao || "",
            dataDocumento: itemEspelho.dataDocumento || "",
            dataEnvio: itemEspelho.dataDocumento || "", 
            vencimentoLiquido: itemEspelho.vencimentoLiquido || "",
            executivoVendas: itemEspelho.executivoVendas || "Não Informado",
            valorVencido: novoMontanteConsolidado || 0,
            valor: novoMontanteConsolidado || 0,
            responsavel: "Victor Faustino",
            status: faturaAproved.raiaSugerida || "novo",
            categoria: faturaAproved.raiaSugerida === "novo" ? "inicio" : "em_andamento",
            arquivado: false,
            historicoNotas: historicoNotasFinal || [],
            tarefas: faturaAproved.cardHistoricoRef?.tarefas || [],
            proposta: { valorCobrado: novoMontanteConsolidado || 0, qtdParcelas: 1 },
            atualizadoEm: serverTimestamp()
          };

          // 🛠️ FILTRAGEM FINAL ATIVA: Purifica o payload removendo resíduos profundos de undefined antes do barramento
          const payloadFinalCobranca = this.saneadorObjetoNoSQL(rawPayloadCobranca);

          await setDoc(devedorDocRef, payloadFinalCobranca, { merge: true }); 

          if (faturaAproved.contatosIdentificados && faturaAproved.contatosIdentificados.length > 0) { 
            for (const con of faturaAproved.contatosIdentificados) { 
              const rawPayloadContato = { 
                nome: con.nomeSugerido || "REPRESENTANTE OCULTO", 
                cpf: "* REQUER ATUALIZAÇÃO *", 
                telefone: con.celularWhats || con.telefoneFixo || "0000000000", 
                email: con.email || "não informado", 
                tipoVinculo: con.vinculoSugerido || "Preposto", 
                empresaId: faturaAproved.soldTo || "" 
              }; 
              
              const payloadContatoLimpo = this.saneadorObjetoNoSQL(rawPayloadContato);
              const idCustomContato = `contato_${faturaAproved.soldTo || "indef"}_${String(con.email || "oculto").split("@")[0]}`; 
              await setDoc(doc(colecaoContatosRef, idCustomContato), payloadContatoLimpo, { merge: true }); 
            } 
          } 

          totalCobrancasSalvas++; 
        } 

        alert(`🟩 PROCESSO CONCLUÍDO COM SUCESSO!\n\n• A esteira atualizou com sucesso ${totalCobrancasSalvas} devedores no quadro Kanban junto com seus representantes de faturamento.`);
        aoFecharModalLocal(); 
        if (typeof this.callbackSucesso === 'function') { this.callbackSucesso(); }
      } catch (err) { 
        console.error(err);
        alert("Erro de barramento NoSQL ao salvar lote.");
        if (botaoConfirmar) { botaoConfirmar.disabled = false; botaoConfirmar.innerHTML = '🚀 Confirmar Processamento'; }
      } 
    }; 

    const elementoModalDOM = ( 
      <ModalConferenciaAging 
        aberto={true} 
        aoFechar={aoFecharModalLocal} 
        dadosProcessados={loteSugestoes} 
        aoConfirmarProcessing={aoConfirmarProcessamentoFinal} 
        aoConfirmarProcessamento={aoConfirmarProcessamentoFinal} 
        carregando={false} 
      />
    ); 
    
    const renderizadorFixoDiv = document.getElementById('nó-sustentacao-modal-conferencia'); 
    if (renderizadorFixoDiv) { 
      renderizadorFixoDiv.innerHTML = ""; 
      ReactDOM.createRoot(renderizadorFixoDiv).render(elementoModalDOM); 
    }
  } 
}