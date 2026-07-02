// -> Classe especialista encarregada de minerar as coordenadas, discernir tipos e isolar resíduos ou dados malformados de forma absoluta.
export class FiltroLimboSobrantes {

  constructor() { // -> Inicializa o construtor do motor de triagem inicial.
    this.dadosRejeitados = []; // -> Cria uma esteira limpa em memória RAM para segurar os canhotos corrompidos identificados.
    this.contatosIdentificados = []; // -> Balde reativo para alocar os elos humanos discernidos de forma atômica.
  } // -> Encerra o construtor.

  // =========================================================================================
  // 🏢 ROTA 1: MINERADOR DA ABA DE DÉBITOS (COORDENADAS DE TOPO MESTRE + FATURAS LINHA 5)
  // =========================================================================================
  filtrarAbaDebitos(dadosMatrizPlanilha) { // -> Função que decodifica as linhas vindas do conversor JSON da aba Débitos.
    this.dadosRejeitados = []; // -> Reseta o balde local para banir lixo acumulado de carregamentos passados.
    const linhasValidasAprovadas = []; // -> Inicializa a esteira de faturas saudáveis para o cérebro NoSQL.

    // 1. PINÇA CADASTRAIS DO TOPO: Localiza de forma cirúrgica o nome e o CNPJ do devedor unificado
    let clienteMae = ""; // -> Buffer para armazenar a Razão Social do devedor localizado.
    let cnpjMae = ""; // -> Buffer para armazenar o CNPJ numérico puro localizado.

    dadosMatrizPlanilha.forEach((linha) => { // -> Roda uma varredura inicial rápida para achar as chaves de cabeçalho do cliente.
      if (!linha || !Array.isArray(linha)) return; // -> Trava de segurança contra linhas corrompidas.
      
      const primeiraCelula = String(linha[0] || "").trim().toUpperCase(); // -> Lê a coluna A de forma absoluta.
      const segundaCelula = String(linha[1] || "").trim(); // -> Lê a coluna B de forma absoluta.

      if (primeiraCelula.startsWith("CLIENTE")) { // -> Se localizar a linha identificadora da Razão Social:
        clienteMae = segundaCelula.toUpperCase().trim(); // -> Isola e grava o nome oficial do devedor em caixa alta.
      } else if (primeiraCelula.startsWith("CNPJ")) { // -> Se localizar a linha identificadora do documento fiscal:
        cnpjMae = segundaCelula.replace(/[^0-9]/g, '').trim(); // -> Remove pontos, barras e traços salvando os 14 dígitos numéricos puros.
      } // -> Fim da checagem.
    }); // -> Fim da varredura de topo.

    // 2. MINERAÇÃO DAS NOTAS FISCAIS: Processa as linhas de faturamento reais ignorando os metadados
    dadosMatrizPlanilha.forEach((linha, index) => { // -> Percorre linha por linha do array do Excel.
      if (!linha || !Array.isArray(linha)) return; // -> Trava contra linhas nulas.

      const primeiraColunaTexto = String(linha[0] || "").trim(); // -> Puxa o texto da coluna A de forma direta.

      // Filtro de coordenadas: Ignora as linhas de cabeçalho superiores do arquivo Excel
      if (primeiraColunaTexto.startsWith("Atualizado") || primeiraColunaTexto.startsWith("Cliente") || primeiraColunaTexto.startsWith("CNPJ") || primeiraColunaTexto.startsWith("Conta") || !primeiraColunaTexto) {
        return; // -> Salta e pula a linha se for metadado ou linha de títulos da tabela.
      }

      // -> As colunas agora são pinçadas por índices rígidos de array, blindados com fallbacks antiqueda contra undefined
      const soldTo = String(linha[0] || "").trim(); // -> Coluna A: Conta ERP (Ex: 10009958).
      const numDocumento = String(linha[1] || "").trim(); // -> Coluna B: Nº doc/.
      const referencia = String(linha[2] || "").trim().toUpperCase(); // -> Coluna C: Nota Fiscal.
      const atribuicao = String(linha[3] || "").trim(); // -> Coluna D: Adicional/Atribuição.
      const tipo = String(linha[4] || "").trim(); // -> Coluna E: Tipo título (RV/DR/DF).
      const dataDoc = String(linha[5] || "").trim(); // -> Coluna F: Emissão.
      const vencimento = String(linha[6] || "").trim(); // -> Coluna G: Vencimento.
      const montante = parseFloat(linha[7]) || 0; // -> Coluna H: Valor (R$) convertido de forma segura para float decimal.
      const filial = String(linha[8] || "").trim(); // -> Coluna I: Filial.
      const situacao = String(linha[9] || "").trim(); // -> Coluna J: Situação (Vencido/A Vencer).

      // 🚨 BARREIRAS DE SEGURANÇA E HIGIENIZAÇÃO NoSQL
      let motivoRejeicao = ""; // -> Buffer para diagnóstico de inconsistências.

      if (!soldTo) { // -> Teste 1: Valida ausência de Conta ERP.
        motivoRejeicao = "CÓDIGO DE CONTA (SOLDTO) AUSENTE"; // -> Define erro.
      } else if (!cnpjMae || cnpjMae.length !== 14) { // -> Teste 2: Valida se o CNPJ do topo veio corrompido ou ausente.
        motivoRejeicao = `CNPJ DO DEVEDOR MESTRE INVÁLIDO OU NÃO LOCALIZADO NO TOPO (${cnpjMae?.length || 0} DÍG);`; // -> Define erro.
      } else if (!clienteMae) { // -> Teste 3: Valida se a Razão Social do topo se perdeu.
        motivoRejeicao = "RAZÃO SOCIAL DO DEVEDOR NÃO INFORMADA NO TOPO"; // -> Define erro.
      } else if (!referencia || referencia === "SEM REF") { // -> Teste 4: Valida integridade da Nota Fiscal.
        motivoRejeicao = "NÚMERO DE REFERÊNCIA (NOTA FISCAL) INVÁLIDO"; // -> Define erro.
      } else if (montante <= 0) { // -> Teste 5: Impede a entrada de faturas zeradas ou negativas.
        motivoRejeicao = `VALOR DA NOTA FISCAL COBRADA INVÁLIDO (R$ ${montante})`; // -> Define erro.
      }

      if (motivoRejeicao !== "") { // -> Se a linha falhou em qualquer um dos 5 testes:
        this.dadosRejeitados.push({ // -> Desvia o título corrompido para o Balde de Resíduos da RAM.
          linhaPlanilha: index + 1, // -> Número exato da linha física no Excel para auditoria do operador.
          soldTo: soldTo || "N/A", // -> Código bruto.
          cliente: clienteMae || "NOME NÃO LOCALIZADO", // -> Herda o pai.
          cnpj: cnpjMae || "NÃO INFORMADO", // -> Herda o pai.
          numDocumento: numDocumento || "0", // -> Contrato.
          referencia: referencia || "SEM REF", // -> NF.
          atribuicao: atribuicao || "INVÁLIDA", // -> Tipo venda.
          dataDoc: dataDoc || "N/A", // -> Emissão.
          vencimento: vencimento || "N/A", // -> Vencimento.
          montante: montante, // -> Saldo.
          erroDiagnostico: motivoRejeicao // -> Carimba o diagnóstico que o modal exibirá no limbo de erros.
        }); // -> Encerra o refugo.
      } else { // -> Passando com sinal verde nas validações NoSQL:
        linhasValidasAprovadas.push({ // -> Consolida a fatura saudável carimbando os dados cadastrais do devedor herdados do topo.
          soldTo,
          numDocumento,
          referencia,
          atribuicao,
          tipo,
          dataDoc,
          vencimento,
          montante,
          filial,
          situacao,
          cliente: clienteMae, // -> Injeta o nome capturado da coordenada da linha 2.
          cnpj: cnpjMae // -> Injeta o CNPJ capturado da coordenada da linha 3.
        }); // -> Adiciona na lista limpa.
      } // -> Fim do desvio.
    }); // -> Encerra o loop map das linhas de Débitos.

    return { // -> Exporta o resultado da mineração da aba Débitos dividido em duas vias limpas.
      linhasSanas: linhasValidasAprovadas, // -> 🛠️ CORREÇÃO CIRÚRGICA: Corrigida a palavra para casar perfeitamente com o array local de RAM criado acima.
      sobrantesRejeitados: this.dadosRejeitados // -> O relatório de erros contendo o refugo isolado da carga.
    }; // -> Encerra o retorno.
  } // -> Encerra o método filtrarAbaDebitos.

  // =========================================================================================
  // 👤 ROTA 2: MOTOR DE DISCERNIMENTO DA ABA DE CONTATOS (VARREDURA POR TIPOS PRIMITIVOS)
  // =========================================================================================
  filtrarAbaContatos(dadosMatrizContatos) { // -> Função especialista que varre as colunas sem padrão em busca de elos humanos.
    this.contatosIdentificados = []; // -> Reseta o balde de contatos identificados na sessão.

    if (!dadosMatrizContatos || !Array.isArray(dadosMatrizContatos)) return []; // -> Salvaguarda contra abas ausentes.

    dadosMatrizContatos.forEach((linha, index) => { // -> Abre o laço percorrendo linha por linha da aba de contatos.
      const valoresDaLinha = Object.values(linha).map(v => String(v).trim()); // -> Captura os textos de todas as colunas da linha e limpa os espaços.
      
      let emailEncontrado = ""; // -> Buffer local para o e-mail.
      let telefoneFixoEncontrado = ""; // -> Buffer local para o fixo.
      let celularWhatsEncontrado = ""; // -> Buffer local para o celular.
      let nomeSugeridoPeloPrefixo = ""; // -> Buffer local para dedução do papel do contato.

      valoresDaLinha.forEach((textoCelula) => { // -> Passa pente fino célula por célula de dentro da linha atual.
        if (!textoCelula) return; // -> Pula células vazias.

        // A) VERIFICADOR DE E-MAILS (PADRÃO CHARACTER ARROBA)
        if (textoCelula.includes("@") && textoCelula.includes(".")) { // -> Se possuir arroba e ponto, confirma a tipagem eletrônica.
          emailEncontrado = textoCelula.toLowerCase(); // -> Grava o e-mail limpo em letras minúsculas.
          
          const prefixoEmail = textoCelula.split("@")[0]; // -> Isola o texto anterior ao @ (Ex: financeiro.frederico).
          nomeSugeridoPeloPrefixo = prefixoEmail.replace(/[^a-zA-Z0-9]/g, ' ').trim(); // -> Substitui pontos ou traços por espaço para UX.
          nomeSugeridoPeloPrefixo = nomeSugeridoPeloPrefixo.charAt(0).toUpperCase() + nomeSugeridoPeloPrefixo.slice(1); // -> Capitaliza a primeira letra de forma sóbria.
        } 
        
        // B) VERIFICADOR DE NÚMEROS TELEFÔNICOS (PADRÃO NUMÉRICO BRASILEIRO COM DDD)
        else {
          const apenasNumeros = textoCelula.replace(/\D/g, ""); // -> Aplica regex limpando parênteses, hifens e espaços da célula.
          
          if (apenasNumeros.length >= 10 && apenasNumeros.length <= 12) { // -> Valida se a cadeia numérica possui tamanho de telefone legítimo (com DDD).
            const numeroSemDDD = apenasNumeros.slice(2); // -> Recorta os dois primeiros algarismos para analisar o corpo do telefone.
            
            if (numeroSemDDD.startsWith("9")) { // -> Se o número após o DDD iniciar com 9, classifica como Celular/WhatsApp.
              celularWhatsEncontrado = apenasNumeros; // -> Aloca na caixinha de celular móvel.
            } else { // -> Caso contrário, se iniciar com algarismos de 2 a 5, classifica como Telefone Fixo de escritório.
              telefoneFixoEncontrado = apenasNumeros; // -> Aloca na caixinha de fixo de mesa.
            } // -> Fim do classificador de canais.
          } // -> Fim da trava de tamanho.
        } // -> Fim da bifurcação de tipos.
      }); // -> Encerra a varredura das células da linha.

      if (emailEncontrado || telefoneFixoEncontrado || celularWhatsEncontrado) { // -> Se a varredura conseguiu extrair ao menos um canal válido:
        let vinculoSugerido = "Preposto"; // -> Assume a classificação sóbria de Preposto como padrão.
        const nomeParaAnalise = nomeSugeridoPeloPrefixo.toLowerCase(); // -> Puxa o nome para análise de termos.
        
        if (nomeParaAnalise.includes("financeiro") || nomeParaAnalise.includes("faturamento")) {
          vinculoSugerido = "Financeiro"; // -> Classifica como departamento financeiro.
        } else if (nomeParaAnalise.includes("compras") || nomeParaAnalise.includes("suprimentos")) {
          vinculoSugerido = "Compras"; // -> Classifica como mesa de compras.
        } else if (nomeParaAnalise.includes("manutencao") || nomeParaAnalise.includes("infra")) {
          vinculoSugerido = "Manutenção"; // -> Classifica como mesa operacional de manutenção.
        } // -> Fim do de-para de papéis contratuais.

        this.contatosIdentificados.push({ // -> Aloca o pacote de elo humano discernido no balde de RAM.
          linhaPlanilha: index + 1, // -> Index físico do Excel.
          nomeSugerido: nomeSugeridoPeloPrefixo || "REPRESENTANTE OCULTO", // -> Envia o nome deduzido do e-mail.
          email: emailEncontrado || "não informado", // -> Envia o e-mail.
          telefoneFixo: telefoneFixoEncontrado || "", // -> Envia o fixo limpo.
          celularWhats: celularWhatsEncontrado || "", // -> Envia o celular limpo pronto para disparos.
          vinculoSugerido: vinculoSugerido // -> Envia o papel contratual sugerido pelo robô para o dropdown do modal.
        }); // -> Encerra o empilhamento.
      } // -> Fim da trava de segurança.
    }); // -> Encerra o laço de repetição for de contatos.

    return this.contatosIdentificados; // -> Exporta a lista de contatos discernidos mastigada e pronta para o modal.
  } // -> Encerra o método filtrarAbaContatos.
}