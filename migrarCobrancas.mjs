// -> Puxa as ferramentas estáveis para gerenciar o Firestore diretamente do SDK do Firebase Admin.
import { initializeApp, cert } from "firebase-admin/app"; // -> Traz o módulo de inicialização administrativa do Google.
import { getFirestore } from "firebase-admin/firestore"; // -> Traz a engine de controle do banco NoSQL.

// -> INVERSÃO DE SEGURANÇA: Dados injetados direto no script para exterminar o erro de arquivo JSON corrompido.
const serviceAccount = {
    project_id: "sistema-de-controle-doculoc",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDrDMk+9zkozoZc\nSpTQxAmSh13ephexmGveP2c13KyOCkIaYGsyDH2I60X9emam4UWk84HJH7uLQpqG\nCSLgwtTyi5yk/pBxjL32G+HpA57bwxK+QcRD/fRdEAQxlg7b5FQiKuthvCMjzpKe\nQ4smBkS4WctIUQkV7kMwajuMuGjkVVWidUUjyKhaz2NxF+BkLsMLoSqmTGWFgPTH\nb4gcJYxUSB9847T71ci9rzPW6lYTW1qDG5nPAepvOUMi52ZgGNm71IbKAIDV7AnK\ngUWfCyp0QWzQfcIEVURzgnmaj3pVNj8C4KY9Syir7NkztFSQPOTOI04xxanvojyE\nS1Cq4FEXAgMBAAECggEAP4E4XCk6ScKmvYeu9kqI1Yx6OZ4BV8u5FRZnQb+p5URz\nQKIdRCvovNXoFoh79Il3og3iWl8W8hSgICeWw0gQdalvvIpEp1Ehv70fx69hO7nU\nNhAZwU77NyuNHoKO6C0j6AlViBXnHpUAuv6/uRnHdlFYYWT3gfPaNln1Vds7B7lb\n+Q6LFEPSWCKvVR5Is9E0yrZwahF0Rhgqqvi3cLfE+Os+byEyFG1lffDIRPMErN7N\nDWNgr+RNgba7F031ERBNnRxoO4aIQXrI3kvj5PZ9yxQ8OH5Zf3bC0FFxAHwnmzAK\nirtZcV9c1brzkAG3OR0aZ1VsHXlsjut9OVRiaIxruQKBgQD1swwucJf6q7OPHDKc\nd4OKVhxBVovaRrVUEgs6RoCqlKHyMoGPd4gavtbDhoLupcFAxy5wr9BU1bKeuGiq\n3RmLeX/KsEyylkI1/yPYrKiyyKEJHknHfPk6C5dgmEpMAx/FKea5lsHvTRJZgoaP\nATBbC13ALAhF3PTuk+bUOgwLPwKBgQD053GlVKEWawwiwSXduhTsEYxMLM1In02f\nbyvPkRw6xy+StwwvBWnWdV4vtI6tYnZiG6HGlGW4pUUFNinqqoNGhKKK5qIMFdJK\nRrlLxJVc78YTt/L2Fesn8xvWjctqJIzgTMz1JgstMhDZazok+Ckxjb4NRLuMC1Tm\nLUQnloB8KQKBgEXRZjHAHv/FUNXm3l7l+0QRKiBK9pzFIPvN0NDzfdZ7O/W18mkR\nP2TSO/b9vzEPevXsY77zxtCElShTILME9yBSG0U+idzpo9DyOn50uc9sAY60w6Rj\nV/Ltnkt9mwc0kA+X04+DToKwtPkohRIX9WS5ux9Do+ouWo99Ccfe4tNDAoGBAKoo\nsQadgXtRD1KKfuPK6cSIAMHgkxV1UfqHxJnoigOw57X5puZ4zWurirB8tHF1qylJ\nZ6LQ8shTVFxloMQiiymQ+FqoGklpU/41m4MwaFL1advDgHVJD2VnfZ0aUg5CrPsf\ngXyHXVaepaRa40BSiFSc1kLj0adhLDDtnKAg6s7ZAoGBALGH8N+6xS9p2FYqLZ3b\nAYU7g8sJ8WbAfxtYeM9moNG9Z7J+x1j1w1uM4wp3oCAwmtZCdPc7ldtBvCAlwRFO\nBJiJRHBwJ01FqrBmgJNcgzR+RL1yqoAokGmoiwNpiw+4CVnb2RhSjlEvyMK5A/vi\nmldLZUbLfwqySN/bedPLSK+w\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n'),
    client_email: "firebase-adminsdk-fbsvc@sistema-de-controle-doculoc.iam.gserviceaccount.com",};

// -> Inicializa a aplicação comercial passando as credenciais limpas lidas da memória ativa.
initializeApp({
  credential: cert(serviceAccount)
});

// -> Conecta os cabos de rede e ativa a mira no banco de dados Firestore.
const db = getFirestore();

async function rodarHigienizacaoBaseCobrancas() { // -> Declara a função assíncrona que varre e nivela as chaves NoSQL.
  console.log("🚀 INICIANDO AUDITORIA E HIGIENIZAÇÃO DA COLAÇÃO [COBRANCAS]..."); // -> Log de status de inicialização na tela.

  try { // -> Escudo de proteção de rede para monitorar falhas ou quedas de conexão.
    const cobrancasCollectionRef = db.collection("cobrancas"); // -> Mira os cabos de leitura na coleção mestre 'cobrancas'.
    const snapshot = await cobrancasCollectionRef.get(); // -> Puxa todos os documentos existentes na nuvem em lote de uma vez só.

    if (snapshot.empty) { // -> Checa se o banco de dados retornou completamente vazio.
      console.log("📭 Nenhuma cobrança encontrada na base de dados."); // -> Alerta o desenvolvedor.
      return; // -> Aborta a execução.
    }

    // -> Cria uma esteira de gravação em lote (Write Batch) para atualizar até 500 documentos em uma única chamada de rede, economizando tráfego.
    const batch = db.batch();
    let contadorModificados = 0; // -> Inicializa o somador reativo de documentos que realmente precisaram de correção.

    snapshot.forEach((snapshotDoc) => { // -> Inicia a varredura linha a linha, documento por documento do Firestore.
      const id = snapshotDoc.id; // -> Captura a ID física NoSQL exclusiva do documento (Ex: '3r4FNS1fm7jqpzY9mswt').
      const dadosAntigos = snapshotDoc.data(); // -> Despeja o objeto de dados original do devedor em rascunho de RAM.

      console.log(`🔍 Inspecionando registro: ${dadosAntigos.cliente || "Sem Nome"} [ID: ${id}]`); // -> Log de rastreio de cada pasta.

      // -> CÁLCULO DE RECONSTITUIÇÃO FINANCEIRA SEGURO
      const valorOriginal = parseFloat(dadosAntigos.valorVencido) || parseFloat(dadosAntigos.valor) || 0; // -> Herda o saldo de qualquer uma das chaves antigas e limpa para número real.

      // -> 1. NORMALIZAÇÃO OPERACIONAL DO OBJETO 'PROPOSTA' (O CORAÇÃO DA PRICE)
      let propostaNormalizada = { // -> Prepara o novo mapa estruturado simulando o documento gabarito do 'VICTOR FAUSTINO'.
        dataPrimeiroVencimento: dadosAntigos.proposta?.dataPrimeiroVencimento || dadosAntigos.dataEnvio || "2026-06-11", // -> Sincroniza a data com o calendário corrente.
        tipoPagamento: dadosAntigos.proposta?.tipoPagamento || dadosAntigos.proposta?.formaPagamento || "Boleto", // -> Unifica chaves duplicadas antigas para a string unificada 'Boleto'.
        qtdParcelas: parseInt(dadosAntigos.proposta?.qtdParcelas) || 1, // -> Força a conversão do número de meses em inteiro numérico puro (int64).
        valorCobrado: parseFloat(dadosAntigos.proposta?.valorCobrado) || valorOriginal, // -> Persiste o saldo corrigido sem juros nas contas não simuladas.
        parcelasSimuladas: dadosAntigos.proposta?.parcelasSimuladas || dadosAntigos.planoParcelas || [] // -> Herda o plano antigo ou inicializa um array limpo.
      };

      // -> Se a lista de parcelas simuladas vier vazia ou ausente, gera automaticamente a primeira parcela espelho para a Price rodar limpa.
      if (propostaNormalizada.parcelasSimuladas.length === 0) {
        propostaNormalizada.parcelasSimuladas = [{
          numero: 1, // -> Parcela número 1 de carência.
          valor: propostaNormalizada.valorCobrado, // -> Ocupa o valor integral nominal.
          vencimento: propostaNormalizada.dataPrimeiroVencimento, // -> Aplica a data base.
          pago: false, // -> Inicializa como pendente fiscal.
          status: "a_vencer" // -> Define o status estável da parcela.
        }];
      }

      // -> 2. HIGIENIZAÇÃO COMPLETA DO ARRAY DE TAREFAS (CONVERSÃO DE CHAVES ANTIGAS)
      const tarefasHigienizadas = (dadosAntigos.tarefas || []).map((tar) => { // -> Varre o array de ações antigas do cobrador.
        return {
          texto: tar.texto || tar.descricao || "Cobrar novamente", // -> CASAMENTO JAVASCRIPT: Se achar a chave antiga 'texto', preserva o dado e joga na esteira.
          criadoPor: tar.criadoPor || dadosAntigos.responsavel || "Lucas Vieira", // -> Garante a assinatura do operador da mesa de faturamento.
          data: tar.data || new Date().toISOString().split("T")[0], // -> Sincroniza a data do evento técnico.
          dataCriacao: tar.dataCriacao || new Date().toLocaleDateString("pt-BR") + " às " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
        };
      });

      // -> 3. MONTAGEM FINAL DO MOLDE PADRÃO DE FÁBRICA INDESTRUTÍVEL
      const dadosNivelados = { // -> Consolida o espelho perfeito do novo layout do CRM.
        ...dadosAntigos, // -> Preserva os dados textuais de nascimento originais sem mutação cega (Razão Social, Código, Responsável).
        valorVencido: valorOriginal, // -> Força o campo mestre monetário da esteira a virar número Double real.
        valorAVencer: parseFloat(dadosAntigos.valorAVencer) || 0, // -> Inicializa em zero se a conta estiver atrasada.
        status: dadosAntigos.status || "novo", // -> Garante que o devedor permaneça na sua calha cinza correta do funil.
        subStatus: dadosAntigos.subStatus || "", // -> Blindagem contra undefined: força string vazia para o React não quebrar nas abas de finalizado.
        observacao: dadosAntigos.observacao || dadosAntigos.observacao === "" ? dadosAntigos.observacao : "Teste do Vitao", // -> Mantém observações ou aplica string limpa.
        proposta: propostaNormalizada, // -> Acopla o sub-objeto Price normalizado.
        tarefas: tarefasHigienizadas, // -> Acopla o array de ocorrências traduzido.
        historicoNotas: dadosAntigos.historicoNotas || [], // -> Blindagem contra undefined: garante a existência física do array de notas de auditoria.
        planoParcelas: dadosAntigos.planoParcelas || propostaNormalizada.parcelasSimuladas // -> Herda o plano real de quitação da carteira.
      };

      // -> Injeta a rota física de atualização no lote do Batch apontando para a pasta e ID correspondentes.
      const documentoRef = cobrancasCollectionRef.doc(id);
      batch.update(documentoRef, dadosNivelados); // -> Executa o comando 'update' (parcial) que reconfigura chaves sem destruir o nó original.
      contadorModificados++; // -> Incrementa o indicador síncrono.
    });

    // -> DISPARO CENTRAL SÍNCRONO NO BANCO: Consolida todas as correções e updates o Firestore da Google em um piscar de olhos.
    await batch.commit();
    console.log(`\n✅ HISTÓRICO: SUCESSO ABSOLUTO! ${contadorModificados} documentos foram reconfigurados e nivelados para o Novo Padrão.`); // -> Emite o veredito de conclusão no terminal.
  } catch (error) { // -> Captura e exibe falhas de internet ou barramento de permissões.
    console.error("❌ ERRO CRÍTICO DURANTE A MIGRAÇÃO DE LOTE:", error); // -> Cospe a falha real caso algo quebre na rede.
  }
}

// -> Dispara a execução do motor de higienização do back-end.
rodarHigienizacaoBaseCobrancas();