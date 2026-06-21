// Conecta o importador diretamente com as chaves e credenciais oficiais do banco de dados na nuvem. -> Comentário orientativo sobre o acoplamento de infraestrutura remota.
import { db } from '../../config/firebase.js'; // -> Traz a conexão configurada com o servidor do Firebase ativo.
// Traz as ferramentas do Firebase para gravação atômica segura de registros. -> Nota explicativa sobre as engines de comandos síncronos do Firestore.
import { collection, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'; // -> Importa os comandos cirúrgicos NoSQL.
// Injeta a biblioteca mestre SheetJS para decodificar planilhas nativas do Excel sem corromper números longos. -> Nota sobre o leitor binário mundial de planilhas.
import * as XLSX from 'xlsx'; // -> Importa o leitor binário especialista em arquivos .xlsx.

export class ImportadorAging { // -> Cria o motor principal que vai comandar a carga pesada de arquivos Excel (.xlsx).
  // Construtor que recebe o aviso reativo do app central para atualizar o visor do Kanban assim que o lote concluir. -> Nota de arquitetura reativa.
  constructor(onSucessoCallback) { // -> Prepara a classe guardando a trigger de sucesso.
    this.onSucesso = onSucessoCallback; // -> Memoriza a função de atualização para acioná-la no fim do processo de carga.
    this.dadosProcessados = []; // -> Inicia a esteira limpa em memória RAM para segurar as linhas extraídas da planilha.
  } // -> Encerra o construtor.

  // Desenha o botão visual de importação na barra de ferramentas superior do CRM. -> Nota sobre a injeção do botão de carregamento.
  renderizarBotaoUpload(containerId) { // -> Cria e estiliza o botão de upload de arquivos dinamicamente na página.
    const container = document.getElementById(containerId); // -> Localiza o bloco visual da barra de ferramentas pela ID.
    if (!container) return; // -> Aborta a criação se o container de destino não estiver montado na árvore visível por segurança.

    const btn = document.createElement('button'); // -> Fabrica uma nova tag de botão HTML diretamente na memória do navegador.
    btn.className = 'btn-importar-aging'; // -> Atribui a classe de estilização CSS para o botão ficar padronizado.
    btn.innerHTML = 'Upload Xlsx'; // -> ADEQUAÇÃO: Altera o texto interno do botão de forma limpa para o padrão regulamentar "Upload Xlsx".
    btn.style.padding = '8px 14px'; // -> Garante um tamanho de espaçamento confortável para o clique do usuário.
    btn.style.backgroundColor = '#0f172a'; // -> ADEQUAÇÃO: Pinta o fundo do botão com o tom Azul Escuro Profundo institucional da DOCULOC.
    btn.style.color = '#ffffff'; // -> Força a cor do texto interno para branco absoluto.
    btn.style.border = 'none'; // -> Remove as bordas padrão antiquadas do navegador.
    btn.style.borderRadius = '6px'; // -> Arredonda levemente os cantos do botão seguindo o padrão estético.
    btn.style.cursor = 'pointer'; // -> Muda o ponteiro do mouse para indicar elemento clicável.
    btn.style.fontWeight = '600'; // -> Engrossa a fonte do botão para melhorar o destaque visual.
    btn.style.fontSize = '13px'; // -> Ajusta o tamanho da letra do botão para o padrão executivo.

    const inputOculto = document.createElement('input'); // -> Cria uma caixa secreta e oculta de seleção de arquivos do sistema.
    inputOculto.type = 'file'; // -> Configura o tipo do elemento para seleção de arquivos locais do computador.
    inputOculto.accept = '.xlsx, .xls'; // -> Altera a restrição aceitando rigidamente arquivos nativos do Excel (.xlsx).
    inputOculto.style.display = 'none'; // -> Esconde o input original do navegador para manter o visual limpo.

    btn.addEventListener('click', () => inputOculto.click()); // -> Abre a janela de escolha de arquivos sempre que o botão customizado for pressionado.
    
    inputOculto.addEventListener('change', (e) => { // -> Vigia o momento exato em que o cobrador seleciona o arquivo.
      const arquivo = e.target.files[0]; // -> Captura a primeira planilha selecionada na lista.
      if (arquivo) { // -> Testa se o arquivo existe e é válido antes de iniciar o motor de conversão.
        this.processarExcel(arquivo); // -> Despacha o arquivo binário direto para o processador especialista do Excel.
      } // -> Fim da checagem de arquivo.
    }); // -> Encerra o evento de mudança.

    container.appendChild(btn); // -> Injeta o botão azul fisicamente na barra superior do CRM.
    container.appendChild(inputOculto); // -> Anexa a caixa de arquivos oculta ao lado do botão na página web.
  } // -> Encerra a renderização do botão.

  // O motor reativo que lê a prancha binária do Excel, filtra as abas de resumo e extrai o Aging real. -> Comentário do decodificador binário mestre.
  processarExcel(arquivo) { // -> Transforma a prancha de faturamento bruta em um array de objetos puros do JavaScript.
    const leitor = new FileReader(); // -> Cria o leitor binário nativo do navegador web.
    
    leitor.onload = (evento) => { // -> Define a rotina assíncrona executada ao concluir a leitura do arquivo da máquina.
      const dadosBinarios = evento.target.result; // -> Extrai a string binária gerada pela leitura do arquivo Excel.
      const pastaTrabalho = XLSX.read(dadosBinarios, { type: 'binary', cellDates: true }); // -> Invoca o decodificador da SheetJS convertendo o binário em abas reais.
      
      // =========================================================================================
      // 🔥 ALGORITMO EXCLUSIVO DE TRIAGEM MULTI-ABAS: Filtra e expurga abas de "Resumo Clientes"
      // ========================================================================================= -> Comentário do mecanismo de triagem de segurança.
      let nomeAbaAnalitica = ""; // -> Buffer local para guardar o nome da aba correta de faturamento.
      
      // Varre reativamente a matriz de abas gerada pelo seu ERP para localizar o lote real
      for (const nomeAba of pastaTrabalho.SheetNames) { // -> Inicia o loop pelas abas.
        const nomeAbaMaiusculo = nomeAba.toUpperCase().trim(); // -> Normaliza o nome em caixa alta para travar comparações de segurança.
        
        // Regra de Expurgo do Victor: Descarta resumos e foca na aba de data ou que possua dados analíticos
        if (!nomeAbaMaiusculo.includes("RESUMO") && !nomeAbaMaiusculo.includes("SUMMARY")) {
          // Se a aba não contiver termos de sumário, é candidata mestre a ser a aba analítica real do faturamento -> Comentário técnico.
          nomeAbaAnalitica = nomeAba; // -> Salva o nome da aba legítima (ex: "12062026").
          break; // -> Quebra o laço imediatamente ao encontrar o alvo analítico.
        }
      }

      // Linha de segurança e contingência: se não encontrar por palavra-chave, pega a aba padrão de fallback
      if (!nomeAbaAnalitica) nomeAbaAnalitica = pastaTrabalho.SheetNames[0]; // -> Fallback padrão para a primeira aba.

      const pranchaPlanilha = pastaTrabalho.Sheets[nomeAbaAnalitica]; // -> Abre os dados fiscais analíticos da aba selecionada de faturamento.
      
      // Converte a prancha mestre em um array de objetos JSON mapeando as chaves pelas strings de cabeçalho reais
      const linhasObjeto = XLSX.utils.sheet_to_json(pranchaPlanilha, { defval: "" }); // -> Transforma as colunas em propriedades JavaScript preservando números longos.

      if (linhasObjeto.length === 0) { // -> Trava contra distração se a planilha vier sem nenhuma linha preenchida.
        alert('Erro: A aba analítica selecionada no Excel está completamente vazia.'); // -> Avisa o operador.
        return; // -> Aborta o processamento para não danificar o banco de dados.
      } // -> Fim da barreira.

      this.dadosProcessados = []; // -> Zera a esteira interna para receber a nova carga de braços abertos.

      for (let i = 0; i < linhasObjeto.length; i++) { // -> Inicia a varredura linha por linha do array extraído pela biblioteca.
        const linha = linhasObjeto[i]; // -> Captura a linha da vez contendo as faturas.

        // Garante a extração limpa e o tratamento de texto do SoldTo e CNPJ blindando contra mutações e espaços invisíveis
        const soldToTexto = linha['SoldTo'] ? String(linha['SoldTo']).trim() : ""; // -> Isola a ID Conta do devedor como texto.
        const cnpjTratado = linha['CNPJ'] ? String(linha['CNPJ']).replace(/[^0-9]/g, '').trim() : ""; // -> Puxa o CNPJ nativo intocado de 14 dígitos e expulsa pontos/traços.

        // TRAVA DE SEGURANÇA ANALÍTICA: Ignora linhas de cabeçalhos vazias ou sumários sem dados relacionais no meio do arquivo
        if (!soldToTexto || !cnpjTratado || cnpjTratado.length < 5) continue; // -> Pula e ignora linhas de rodapé ou registros corrompidos na planilha.

        // Trata os valores de montante e datas convertendo-os em propriedades computáveis
        const valorMontante = parseFloat(linha['Montante em moeda interna']) || 0; // -> Extrai o Double real da célula sem quebrar em potências.
        const dataDocFormatada = linha['Data do documento'] instanceof Date ? linha['Data do documento'].toLocaleDateString('pt-BR') : String(linha['Data do documento'] || "").trim(); // -> Converte datas nativas do Excel para string BR.
        const vencimentoFormatado = linha['Vencimento líquido'] instanceof Date ? linha['Vencimento líquido'].toLocaleDateString('pt-BR') : String(linha['Vencimento líquido'] || "").trim(); // -> Converte vencimentos nativos do Excel para string BR.

        const registro = { // -> Constrói o objeto estruturado perfeitamente compatível com o ecossistema NoSQL do CRM.
          idTemporario: `id_temp_${i + 1}`, // -> Identificador único de interface para os checkboxes da tabela.
          soldTo: soldToTexto, // -> ID Conta ERP mestre.
          cliente: String(linha['Cliente'] || '').trim(), // -> Razão social tratada livre de quebras de strings.
          cnpj: cnpjTratado, // -> CNPJ intacto de 14 dígitos reais.
          numDocumento: String(linha['Nº documento'] || '').trim(), // -> Número de contrato comercial.
          referencia: String(linha['Referência'] || '').trim(), // -> Nota Fiscal real para baixas e prontuários.
          atribuicao: String(linha['Atribuição'] || '').trim(), // -> Modelo ou tipo de venda.
          dataDoc: dataDocFormatada, // -> Data fiscal de emissão.
          vencimento: vencimentoFormatado || vencimentoFormatado, // -> Vencimento líquido estourado.
          montante: valorMontante, // -> Valor monetário Double real puro para somas.
          executivo: String(linha['Executivo de vendas'] || 'Não Informado').trim(), // -> Representante da carteira do devedor.
          local: String(linha['Local'] || '').trim(), // -> Comarca municipal do cliente devedor.
          regiao: String(linha['Região'] || '').trim() // -> Comarca estadual do cliente devedor.
        }; // -> Encerra o objeto da linha.

        this.dadosProcessados.push(registro); // -> Enfileira o registro limpo e com o CNPJ perfeito na memória ram de pré-carga.
      } // -> Fim do laço for.

      this.abrirModalConferencia(); // -> Projeta e joga o painel de conferência visual (Autonomia de Lote) na tela do operador de cobrança.
    }; // -> Encerra a função onload.

    leitor.readAsBinaryString(arquivo); // -> Inicia a leitura física da planilha em modo binário bruto para capturar as células originais do Excel.
  } // -> Encerra o processador de planilhas.

  // Consulta a API nacional pública de CNPJ para puxar dados cadastrais atualizados.
  async consultarApiCNPJ(cnpj) { // -> Faz a chamada para a BrasilAPI (rápida, gratuita e atualizada).
    try {
      const resposta = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`); // -> Faz o pedido de dados à API enviando o CNPJ numérico perfeito.
      if (!resposta.ok) return null; // -> Retorna nulo se a Receita Federal recusar o documento.
      
      const dados = await resposta.json(); // -> Converte a resposta em formato JSON estruturado.
      return { // -> Entrega os metadados ricos da Receita Federal in letras limpas.
        razaoSocial: dados.razao_social || '',
        nomeFantasia: dados.nome_fantasia || dados.razao_social || '',
        situacaoCadastral: dados.descricao_situacao_cadastral || 'ATIVA'
      }; // -> Encerra o pacote de sucesso.
    } catch (e) {
      console.warn(`[API CNPJ] Não foi possível consultar o CNPJ ${cnpj} na API externa. Usando dados da planilha.`); // -> Imprime aviso leve se a internet oscilar.
      return null; // -> Aciona as rotinas de contingência locais.
    } // -> Fim do catch.
  } // -> Encerra a busca de API.

  // Sincroniza e garante o cadastro da matriz da empresa conectando ao módulo de cadastros corporativos.
  async garantizarCadastroEmpresa(cnpj, nomePlanilha, local, regiao) { // -> Garante que a PJ esteja arquivada antes de subir os faturamentos.
    const empresaDocRef = doc(db, 'cadastros_empresas', cnpj); // -> Endereço físico NoSQL usando o CNPJ limpo como ID única do documento.
    const snapshot = await getDoc(empresaDocRef); // -> Faz a varredura preventiva na nuvem.

    if (snapshot.exists()) { // -> Se a empresa já constar no banco de dados.
      return snapshot.data(); // -> Devolve a ficha existente economizando conexões e processamento no Firebase.
    } // -> Fim da verificação.

    console.log(`[Importador] Empresa ${cnpj} não cadastrada. Iniciando fluxo de cadastro rápido...`); // -> Alerta no terminal de desenvolvedor.
    const dadosApi = await this.consultarApiCNPJ(cnpj); // -> Aciona o consultor externo web com o CNPJ perfeito de 14 dígitos que o leitor de Excel preservou.
    
    let payloadEmpresa = {}; // -> Inicializa a gaveta de memória ram de embalagem.

    if (dadosApi) { // -> Se localizou a empresa ativa na Receita Federal do Brasil.
      payloadEmpresa = { // -> Embala a ficha cadastral profissional com a Razão Social oficial do governo em letras maiúsculas.
        cnpj: cnpj,
        razaoSocial: dadosApi.razaoSocial.toUpperCase(),
        nomeFantasia: dadosApi.nomeFantasia.toUpperCase(),
        situacao: dadosApi.situacaoCadastral,
        tipoCadastro: 'Automático via API (Importador)',
        criadoEm: serverTimestamp() // -> Assinatura cronológica oficial imutável de compliance do Google.
      };
    } else { // -> Regime de contingência: se a API falhar, força a criação usando as comarcas locais para o endereço não nascer órfão.
      const comarcaEndereço = local && regiao ? `${local} / ${regiao}` : "Não informado no lote"; // -> Monta o texto de localização geográfica.
      payloadEmpresa = {
        cnpj: cnpj,
        razaoSocial: nomePlanilha.toUpperCase(),
        nomeFantasia: nomePlanilha.toUpperCase(),
        situacao: 'NÃO VERIFICADO',
        endereco: comarcaEndereço.toUpperCase(), // -> Sincroniza as cidades locais diretamente no prontuário.
        tipoCadastro: 'Contingência via Planilha (Importador)',
        criadoEm: serverTimestamp()
      };
    } // -> Fim da fiação de cadastro rápido.

    await setDoc(empresaDocRef, payloadEmpresa); // -> Grava definitivamente a ficha cadastral corporativa na coleção 'cadastros_empresas'.
    this.ultimoTipoCadastro = payloadEmpresa.tipoCadastro; // -> Anota o tipo de inclusão para o placar final do rodapé.
    return payloadEmpresa; // -> Devolve o objeto criado para alimentar a esteira subsequente.
  } // -> Encerra o garantidor de cadastro de empresa.

  // Constrói a janela flutuante cinza e branca contendo a listagem prévia de aprovação humana.
  abrirModalConferencia() { // -> AREA DE AUTONOMIA DE LOTE: Painel de checkout com checkboxes individuais de aprovação.
    const modalExistente = document.getElementById('modal-conferencia-aging'); // -> Caça duplicados perdidos na árvore visual.
    if (modalExistente) modalExistente.remove(); // -> Limpa a tela eliminando resquícios de cargas anteriores.

    const modalBg = document.createElement('div'); // -> Fabrica o apagão de fundo translúcido para focar o cobrador nas faturas.
    modalBg.id = 'modal-conferencia-aging'; // -> Batiza a ID identificadora.
    modalBg.style.position = 'fixed'; // -> Fixa a janela colada nas bordas evitando sumiços ao rolar as raias.
    modalBg.style.top = '0'; modalBg.style.left = '0'; // -> Alinha nos limites absolutos do monitor.
    modalBg.style.width = '100vw'; modalBg.style.height = '100vh'; // -> Alarga e alonga cobranca 100% da aba ativa.
    modalBg.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'; // -> Aplica a opacidade escura de foco.
    modalBg.style.display = 'flex'; modalBg.style.justifyContent = 'center'; modalBg.style.alignItems = 'center'; // -> Centralização ágil em flexbox.
    modalBg.style.zIndex = '99999'; // -> Camada máxima de sobreposição visual.

    const modalConteudo = document.createElement('div'); // -> Painel interno branco de alta visibilidade comercial.
    modalConteudo.style.backgroundColor = '#ffffff'; modalConteudo.style.width = '92%'; modalConteudo.style.maxHeight = '85vh'; // -> Configura o papel branco responsivo em 92%.
    modalConteudo.style.borderRadius = '8px'; modalConteudo.style.display = 'flex'; modalConteudo.style.flexDirection = 'column'; modalConteudo.style.padding = '24px'; // -> Alinhamentos de flexbox.
    modalConteudo.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)'; // -> Efeito visual moderno 3D nas margens.

    // Escreve a estrutura HTML limpando qualquer string solta das células para anular avisos de DOM do navegador.
    modalConteudo.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="text-align: left;">
          <h2 style="margin: 0; color: #1e293b; font-size: 18px; font-family: sans-serif; font-weight: 800;">Área de Conferência Pré-Carga (Autonomia de Lote)</h2>
          <p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px; font-family: sans-serif; font-weight: 500;">O sistema localizou e filtrou a aba analítica com sucesso. As faturas serão consolidadas por devedor único via <b>SoldTo</b>.</p>
        </div>
        <button id="btn-fechar-modal-conferencia" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #94a3b8; font-weight: bold;">&times;</button>
      </div>
      
      <div style="flex: 1; overflow-y: auto; overflow-x: auto; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 16px;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; font-family: sans-serif;">
          <thead>
            <tr style="background-color: #f8fafc; border-bottom: 2px solid #e2e8f0; position: sticky; top: 0; z-index: 10;">
              <th style="padding: 12px; width: 40px;"><input type="checkbox" id="checkbox-selecionar-todos-conferencia" checked style="cursor: pointer;"></th>
              <th style="padding: 12px; color: #475569; font-weight: 700;">SoldTo (ID Conta)</th>
              <th style="padding: 12px; color: #475569; font-weight: 700;">Cliente / Razão Social</th>
              <th style="padding: 12px; color: #475569; font-weight: 700;">CNPJ Preservado</th>
              <th style="padding: 12px; color: #475569; font-weight: 700;">Nº documento</th>
              <th style="padding: 12px; color: #475569; font-weight: 700;">Referência (NF)</th>
              <th style="padding: 12px; color: #475569; font-weight: 700;">Atribuição</th>
              <th style="padding: 12px; color: #475569; font-weight: 700;">Data Doc.</th>
              <th style="padding: 12px; color: #475569; font-weight: 700;">Vencimento</th>
              <th style="padding: 12px; color: #475569; font-weight: 700; text-align: right;">Montante (R$)</th>
              <th style="padding: 12px; color: #475569; font-weight: 700;">Executivo de Vendas</th>
            </tr>
          </thead>
          <tbody id="corpo-tabela-conferencia-aging"></tbody>
        </table>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 12px; font-family: sans-serif;">
        <button id="btn-cancelar-conferencia" style="padding: 9px 16px; background-color: #f1f5f9; color: #475569; border: none; border-radius: 6px; cursor: pointer; font-weight: 700; fontSize: 12px;">Cancelar e Descartar</button>
        <button id="btn-confirmar-carga-final" style="padding: 9px 20px; background-color: #16a34a; color: #ffffff; border: none; border-radius: 6px; cursor: pointer; font-weight: 800; fontSize: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); text-transform: uppercase;">🚀 Confirmar Processamento</button>
      </div>
    `; // -> Encerra a injeção do cabeçalho da tabela.

    modalBg.appendChild(modalConteudo); // -> Insere o bloco branco no plano de foco escuro.
    document.body.appendChild(modalBg); // -> Projeta a estrutura na aba ativa do navegador do Victor.

    const corpoTabela = document.getElementById('corpo-tabela-conferencia-aging'); // -> Mapeia a ID tbody do HTML para descida das linhas.
    this.dadosProcessados.forEach(reg => { // -> Percorre todos os devedores binários minerados da planilha Excel.
      const tr = document.createElement('tr'); // -> Fabrica a linha tr diretamente na RAM.
      tr.style.borderBottom = '1px solid #f1f5f9'; // -> Borda fina inferior separadora.
      
      tr.innerHTML = `
        <td style="padding: 12px;"><input type="checkbox" class="checkbox-linha-conferencia" data-id="${reg.idTemporario}" checked style="cursor: pointer;"></td>
        <td style="padding: 12px; font-weight: 700; color: #1e293b;">${reg.soldTo}</td>
        <td style="padding: 12px; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; color: #334155;">${reg.cliente}</td>
        <td style="padding: 12px; font-family: monospace; color: #475569; font-weight: bold;">${reg.cnpj}</td>
        <td style="padding: 12px; color: #64748b;">#${reg.numDocumento}</td>
        <td style="padding: 12px; color: #0284c7; font-weight: 700;">${reg.referencia}</td>
        <td style="padding: 12px; color: #64748b;">${reg.atribuicao}</td>
        <td style="padding: 12px; color: #475569;">${reg.dataDoc}</td>
        <td style="padding: 12px; color: #2563eb; font-weight: 700;">${reg.vencimento}</td>
        <td style="padding: 12px; font-weight: 800; color: #0f172a; text-align: right;">R$ ${reg.montante.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td style="padding: 12px; color: #475569; font-weight: 600;">${reg.executivo}</td>
      `; // -> Alimenta a linha injetando o CNPJ de 14 dígitos reais que vieram da aba analítica selecionada.
      corpoTabela.appendChild(tr); // -> Acopla a linha fisicamente no checkout.
    }); // -> Fim do loop.

    const chkTodos = document.getElementById('checkbox-selecionar-todos-conferencia'); // -> Caixa mestre superior.
    chkTodos.addEventListener('change', (e) => { // -> Sincroniza todas as subcaixas secundárias com um único clique do topo esquerdo.
      const checkboxes = document.querySelectorAll('.checkbox-linha-conferencia'); // -> Coleta os checkboxes de linha.
      checkboxes.forEach(chk => chk.checked = e.target.checked); // -> Clona o estado mestre nas linhas secundárias.
    }); // -> Encerra o evento.

    const fecharModal = () => modalBg.remove(); // -> Desliga e extingue o modal da RAM.
    document.getElementById('btn-fechar-modal-conferencia').addEventListener('click', fecharModal); // -> Fecha no 'x'.
    document.getElementById('btn-cancelar-conferencia').addEventListener('click', fecharModal); // -> Descarta no cancelar.

    // DISPARO DE INJEÇÃO EM MASSA ASSÍNCRONA COMPACTADA PELO SOLDTO REAL (A SACOLA INTEGRAL):
    document.getElementById('btn-confirmar-carga-final').addEventListener('click', async () => { // -> Aciona o gatilho final.
      const chksMarcados = document.querySelectorAll('.checkbox-linha-conferencia:checked'); // -> Varre quais faturas mantiveram o flag ativo.
      
      if (chksMarcados.length === 0) { // -> Impede o envio de lotes em branco.
        alert('Atenção Operador: É necessário manter pelo menos uma cobrança selecionada para autorizar o processamento.'); // -> Exibe o aviso.
        return; // -> Aborta.
      } // -> Fim da checagem.

      const idsParaSalvar = Array.from(chksMarcados).map(chk => chk.getAttribute('data-id')); // -> Junta em vetor simples as IDs salvas.
      const registrosAprovados = this.dadosProcessados.filter(reg => idsParaSalvar.includes(reg.idTemporario)); // -> Filtra e mantém os devedores binários aprovados.
      const btnConfirmar = document.getElementById('btn-confirmar-carga-final'); // -> Resgata o botão.
      btnConfirmar.disabled = true; // -> Trava contra duplo clique ansioso.
      btnConfirmar.innerHTML = '⏳ Unificando Sacolas por SoldTo e Injetando...'; // -> Altera status visual de gravação.

      try { // -> Escudo antiquedas.
        const colecaoCobrancasRef = collection(db, 'cobrancas'); // -> Abre cabo de rede com a rota mestre de cobranças unificadas.
        let totalNovasEmpresas = 0; // -> Placar de homologações de PJ de retaguarda.

        // =========================================================================================
        // 🔥 CONSOLIDAÇÃO DINÂMICA DA SACOLA ÚNICA EM RAM (SANEAMENTO DO TRUNCAMENTO DE CNPJ) 
        // =========================================================================================
        const devedoresAgrupadosPorSoldTo = {}; // -> Inicializa o cofre temporário em RAM.
        
        registrosAprovados.forEach(reg => { // -> Agrupa as Notas Fiscais no mesmo SoldTo limpo da planilha Excel.
          const chaveGrupoSoldTo = reg.soldTo; // -> Chave primária.
          
          if (!devedoresAgrupadosPorSoldTo[chaveGrupoSoldTo]) { // -> Se for o primeiro título daquele cliente, cria a sacola mestre.
            devedoresAgrupadosPorSoldTo[chaveGrupoSoldTo] = { // -> Aloca dados mestre.
              soldTo: reg.soldTo,
              cliente: reg.cliente,
              cnpj: reg.cnpj, // -> CNPJ de 14 dígitos reais preservado pela célula do Excel.
              local: reg.local,
              regiao: reg.regiao,
              titulos: [] // -> Array limpo pronto para receber o bolo de faturas da PJ.
            }; // -> Fim.
          } // -> Fim.
          
          devedoresAgrupadosPorSoldTo[chaveGrupoSoldTo].titulos.push({ // -> Encaixa as faturas fiscais individuais dentro da sacola da PJ.
            numDocumento: parseInt(reg.numDocumento) || 0,
            referencia: reg.referencia,
            atribuicao: reg.atribuicao,
            dataDocumento: reg.dataDoc,
            vencimentoLiquido: reg.vencimento,
            valorNota: reg.montante,
            executivoVendas: reg.executivo
          }); // -> Fim.
        }); // -> Fim.

        // Loop assíncrono NoSQL que processa e grava os SoldTos consolidados na nuvem da Google 
        for (const soldToChave of Object.keys(devedoresAgrupadosPorSoldTo)) { // -> Inicia varredura.
          const devedorUnico = devedoresAgrupadosPorSoldTo[soldToChave]; // -> Pega sacola.

          // CRUCIAL: Sincroniza e garante a gravação síncrona da PJ na rota oficial de cadastros.
          const dadosEmpresa = await this.garantizarCadastroEmpresa(devedorUnico.cnpj, devedorUnico.cliente, devedorUnico.local, devedorUnico.regiao);
          
          if (this.ultimoTipoCadastro && this.ultimoTipoCadastro.includes('Importador')) { // -> Soma no placar se a empresa mãe for inédita na nuvem.
            totalNovasEmpresas++; // -> Soma.
            this.ultimoTipoCadastro = null; // -> Reseta buffer técnico.
          } // -> Fim.

          const novaSomaBrutaAcumulada = devedorUnico.titulos.reduce((acc, n) => acc + n.valorNota, 0); // -> Soma o bolo financeiro da sacola unificada.
          const primeiroTitulo = devedorUnico.titulos[0] || {}; // -> Captura a primeira NF como espelho.

          const payloadCobranca = { // -> Monta o documento final reestruturado e imune a truncamentos.
            soldTo: devedorUnico.soldTo, // -> Código numérico ERP do cliente devedor.
            codigo: devedorUnico.soldTo, // -> ID conta para os cabeçalhos das raias Kanban.
            cliente: dadosEmpresa.razaoSocial || devedorUnico.cliente, // -> Razão social oficial maiúscula da Receita Federal.
            cnpj: devedorUnico.cnpj, // -> CNPJ unificador verdadeiro de 14 dígitos.
            titulos: devedorUnico.titulos, // -> INJEÇÃO AUTOMÁTICA DA SACOLA: Array completo com todas as NFs anexadas.
            
            // ESPELHOS DE COMPATIBILIDADE DE INTERFACE (HERANÇA DO PRIMEIRO TÍTULO DO LOTE) 
            numDocumento: primeiroTitulo.numDocumento || 0,
            referencia: primeiroTitulo.referencia || "",
            atribuicao: primeiroTitulo.atribuicao || "",
            dataDocumento: primeiroTitulo.dataDocumento || "",
            dataEnvio: primeiroTitulo.dataDocumento || "",
            vencimentoLiquido: primeiroTitulo.vencimentoLiquido || "",
            executivoVendas: primerioTitulo.executivoVendas || "Não Informado",

            valorVencido: novaSomaBrutaAcumulada, // -> Saldo vencido consolidado do devedor mestre do card.
            valor: novaSomaBrutaAcumulada, // -> Sincroniza os contadores numéricos do topo da raia kanban.
            responsavel: "Victor Faustino", // -> Operador responsável dono da carteira da mesa do CRM.
            status: 'novo', // -> Força a ID da primeira calha cinza ('A Iniciar') do funil Kanban.
            categoria: 'inicio', // -> Categoria macro gerencial de entrada.
            arquivado: false, // -> O devedor nasce fora do arquivo morto.
            historicoNotas: [ // -> Notas de histórico.
              {
                conteudo: `Injeção automática unificada pelo Excel .XLSX filtrando a aba analítica. Lote agrupado com ${devedorUnico.titulos.length} Notas Fiscais vinculadas no prontuário.`, 
                dataHora: new Date().toLocaleDateString("pt-BR") + " às " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
              }
            ],
            tarefas: [], // -> Tarefas limpas.
            proposta: { valorCobrado: novaSomaBrutaAcumulada, qtdParcelas: 1 }, // -> Proposta Price baseada no montante total acumulado.
            atualizadoEm: serverTimestamp() // -> Assinatura cronológica oficial imutável de compliance do Google.
          }; // -> Fim.

          // EXECUÇÃO DO SETDOC USANDO EXCLUSIVAMENTE O SOLDTO ERP COMO ID ÚNICO DO CARD (ANTI-DUPLICIDADE EM MASSA) 
          await setDoc(doc(colecaoCobrancasRef, devedorUnico.soldTo), payloadCobranca, { merge: true }); // -> Salva ou mescla faturamentos na nuvem na ID do SoldTo corporativo real, blindando as visões.
        } // -> Fim.

        alert(`Sucesso! Processamento concluído via Excel nativo de abas filtradas:\n• ${Object.keys(devedoresAgrupadosPorSoldTo).length} Devedores unificados criados no Firebase.\n• Planilha processou ${registrosAprovados.length} Notas Fiscais em sacolas agrupadas pelo SoldTo de célula.\n• ${totalNovasEmpresas} Novas empresas cadastradas no módulo de cadastros.`); // -> Alerta visível detalhado comemorativo de transação concluída.
        fecharModal(); // -> Destrói e desliga o modal da tela do usuário.
        
        if (typeof this.onSucesso === 'function') { // -> Gatilho reativo maestro.
          this.onSucesso(); // -> Recarrega e redesenha o Kanban reativamente com as novas sacolas unificadas sem dar F5.
        } // -> Fim.

      } catch (erroGravacao) { // -> Captura erros.
        console.error('Falha crítica no processamento do lote:', erroGravacao); // -> Detalhes técnicos no terminal de desenvolvedor.
        alert('Erro de Processamento: Ocorreu um contratempo ao tentar salvar os dados na nuvem. Revise sua conexão.'); // -> Alerta.
        btnConfirmar.disabled = false; // -> Destrava botão de reenvio.
        btnConfirmar.innerHTML = '🚀 Confirmar Processamento'; // -> Restaura rótulo comercial do botão.
      } // -> Fim.
    }); // -> Fim.
  } // -> Encerra a Área de Conferência.
} // -> Encerra a classe mestre do ImportadorAging.