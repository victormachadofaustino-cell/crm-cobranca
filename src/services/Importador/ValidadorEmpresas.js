// -> Conecta o validador diretamente com a fiação e referências oficiais do banco de dados na nuvem.
import { db } from '../../config/firebase.js'; // -> Traz a conexão configurada com o servidor do Firebase ativo.
// -> Puxa as ferramentas especialistas do SDK do Firestore para ler e gravar nós de forma atômica.
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'; // -> Traz as engines cirúrgicas NoSQL.

export class ValidadorEmpresas { // -> Declara a classe especialista encarregada da higienização cadastral.
  
  constructor() { // -> Inicializa o construtor do módulo.
    this.cacheEmpresasLocais = {}; // -> Cria um dicionário em memória RAM para reter os CNPJs checados na mesma sessão e evitar requisições repetidas na API.
  } // -> Encerra o construtor.

  // 🚀 ENGINE DE CONSULTA AUTOMÁTICA DE CNPJ (BRASIL API)
  async consultarApiCNPJ(cnpj) { // -> Define a função assíncrona que dispara o pacote de rede para enriquecimento de dados.
    try { // -> Escudo protetivo antiqueda para tratar instabilidades de conexão ou CNPJs inexistentes.
      const resposta = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`); // -> Dispara o método fetch visando o endpoint da BrasilAPI.
      if (!resposta.ok) return null; // -> Retorna nulo se a Receita Federal recusar o documento ou der erro 404.
      
      const dados = await resposta.json(); // -> Traduz o pacote de rede codificado em formato JSON vivo para leitura na memória.
      return { // -> Entrega os metadados ricos estruturados em letras limpas.
        razaoSocial: (dados.razao_social || '').toUpperCase(), // -> Captura a Razão Social oficial forçando caixa alta.
        nomeFantasia: (dados.nome_fantasia || dados.razao_social || '').toUpperCase(), // -> Captura o Nome Fantasia de fallback em caixa alta.
        situacaoCadastral: dados.descricao_situacao_cadastral || 'ATIVA', // -> Isola a string de situação cadastral (Ex: ATIVA, BAIXADA).
        endereco: `${dados.logradouro || ""}, Nº ${dados.numero || ""}`.toUpperCase(), // -> Concatena o endereço básico da Receita.
        cep: dados.cep || "" // -> Captura o código postal postal.
      }; // -> Encerra o retorno estruturado.
    } catch (e) { // -> Captura falhas físicas de timeout ou falta de internet.
      console.warn(`[API CNPJ] Falha ao consultar o documento ${cnpj}:`, e); // -> Imprime aviso leve no console do desenvolvedor.
      return null; // -> Retorna nulo para acionar as rotinas de contingência locais.
    } // -> Fim do catch.
  } // -> Encerra a consulta de API.

  // 🛡️ MOTOR DE GARANTIA CADASTRAL: Valida existência no Firebase e previne duplicidade
  async garantirCadastroEmpresa(cnpj, nomePlanilha, local, regiao) { // -> Função que checa o banco antes de autorizar novos registros.
    const cnpjLimpo = String(cnpj).replace(/[^0-9]/g, '').trim(); // -> Expulsa pontos, barras e traços aplicando regex para isolar os 14 dígitos numéricos puros.
    
    if (cnpjLimpo.length !== 14) { // -> Trava de segurança para caminhos de rede corrompidos.
      throw new Error(`CNPJ Inválido para cadastro: ${cnpj}`); // -> Dispara exceção se o documento fiscal estiver quebrado.
    }

    // -> Primeiro nível de checagem: Verifica se já foi lido nesta mesma rodada de processamento da planilha.
    if (this.cacheEmpresasLocais[cnpjLimpo]) { // -> Se o CNPJ constar no dicionário temporário da RAM:
      return this.cacheEmpresasLocais[cnpjLimpo]; // -> Devolve a ficha da memória local economizando processamento.
    }

    // -> Segundo nível de checagem: Faz a varredura em tempo real direto na nuvem do Firestore.
    const empresaDocRef = doc(db, 'cadastros_empresas', cnpjLimpo); // -> Define a rota física fixa: o ID do documento na nuvem passa a ser o próprio CNPJ numérico puro.
    const snapshot = await getDoc(empresaDocRef); // -> Realiza a leitura preventiva no cofre do Firebase.

    if (snapshot.exists()) { // -> Cenário A: Se a empresa já constar na base de dados de retaguarda:
      const dadosExistentes = snapshot.data(); // -> Puxa os dados estruturados do nó.
      this.cacheEmpresasLocais[cnpjLimpo] = dadosExistentes; // -> Aloca no cache local da RAM.
      return dadosExistentes; // -> Devolve a ficha existente salvando conexões com o servidor.
    }

    // -> Cenário B: Empresa inédita na esteira. Inicializa o fluxo de enriquecimento automático via API.
    const dadosApi = await this.consultarApiCNPJ(cnpjLimpo); // -> Invoca o consultor externo web com o CNPJ purificado.
    let payloadEmpresa = {}; // -> Inicializa o balde de alocação do pacote.

    if (dadosApi) { // -> Sub-cenário B1: Se localizou a empresa ativa nos servidores da Receita Federal:
      payloadEmpresa = { // -> Embala a ficha cadastral oficial rica do governo.
        codigo: "SOLICITAR", // -> Marca o alerta de preenchimento para sincronismo posterior com o ERP.
        cliente: dadosApi.razaoSocial, // -> Razão social validada em caixa alta estrita.
        cnpj: cnpjLimpo, // -> CNPJ unificador de 14 dígitos puros.
        tipo: "Matriz", // -> Define o padrão institucional sóbrio de Matriz.
        segmento: "Extraído via Script (API)", // -> Metadado de auditoria de migração automática.
        endereco: dadosApi.endereco, // -> Logradouro oficial retornado pela API.
        cep: dadosApi.cep, // -> Código postal oficial retornado pela API.
        situacaoFiscal: dadosApi.situacaoCadastral, // -> Carimba se o CNPJ está ativo ou baixado no governo.
        criadoEm: serverTimestamp() // -> Assinatura cronológica oficial imutável de compliance do Google.
      }; // -> Encerra a montagem do documento enriquecido.
    } else { // -> Sub-cenário B2: Contingência contra falhas de timeout ou indisponibilidade da API:
      const comarcaEndereco = local && regiao ? `${local} / ${regiao}` : "Não informado no lote"; // -> Concatena as praças da planilha.
      payloadEmpresa = { // -> Embala o documento com os dados disponíveis nas colunas do Excel.
        codigo: "SOLICITAR", // -> Alerta de preenchimento de Conta.
        cliente: String(nomePlanilha || '').trim().toUpperCase(), // -> Puxa o nome da célula da planilha forçando letras maiúsculas.
        cnpj: cnpjLimpo, // -> CNPJ unificador verdadeiro.
        tipo: "Matriz", // -> Define padrão soberano Matriz.
        segmento: "Extraído via Script (Planilha)", // -> Carimba metadados de contingência.
        endereco: comarcaEndereco.toUpperCase(), // -> Aloca as comarcas da planilha no endereço para não nascer órfão.
        cep: "00000-000", // -> Insere o formato numérico padrão temporário.
        situacaoFiscal: "NÃO VERIFICADO", // -> Alerta para checagem posterior do operador.
        criadoEm: serverTimestamp() // -> Assinatura cronológica do Google.
      }; // -> Encerra a montagem de contingência.
    }

    await setDoc(empresaDocRef, payloadEmpresa); // -> Grava definitivamente a ficha cadastral corporativa estável na coleção.
    this.cacheEmpresasLocais[cnpjLimpo] = payloadEmpresa; // -> Aloca o novo registro no cache de RAM local.
    return payloadEmpresa; // -> Devolve a ficha criada para abastecer os motores subsequentes da esteira.
  } // -> Encerra o motor garantidor de cadastros.
}