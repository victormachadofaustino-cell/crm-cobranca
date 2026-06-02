import { kanbanFiltros } from "../components/kanban/kanbanFiltros"; // [Dev Sênior] Importa a peneira lógica modularizada para a planilha e o Kanban usarem os mesmos critérios da gaveta lateral, eliminando o erro 500. // Traz o arquivo de regras de filtragem para que a planilha e o Kanban trabalhem sincronizados.
import { acordosComponent } from "../components/acordos/acordosComponent"; // [Dev Sênior] Traz o componente financeiro para podermos acionar o modal de propostas direto pelo clique do cifrão.
import { dbService } from "../services/dbService"; // NOVA IMPORTAÇÃO DE SEGURANÇA: Conecta as ferramentas oficiais de comandos e exclusões do Firebase no nosso arquivo de visualização.

export const crmVisaoTabela = { // [Dev Sênior] Define e exporta o novo submódulo isolado responsável por gerenciar e alimentar a visualização de planilha executiva. // Cria e exporta a caixinha de ferramentas que gerencia a visualização de planilha comercial.
  reconstruir(corpoTabela, dadosCobrancasGlobais, estruturaEtapas, inputFiltroKanban, abrirCentralGestao360) { // [Dev Sênior] CORREÇÃO MANDATÓRIA: Retornado o nome do método para 'reconstruir' para casar com o comando do app.js. // Função mestre que limpa a grade antiga e desenhos as novas linhas de devedores filtrados.
    
    if (!corpoTabela) return; // [Dev Sênior] Trava de segurança: se a div protetora sumiu da página por falha de renderização, aborta a execução na hora. // Trava de segurança: se a tabela sumir da página por falhas do navegador, para o código na hora.
    
    if (!window.tabelaOrdem) { // [Dev Sênior] Investiga se a gaveta de memória de ordenação existe na janela atual do navegador do usuário.
        window.tabelaOrdem = { coluna: 'codigo', direcao: 'asc' }; // [Dev Sênior] Se não existir, define que a planilha começa organizada pelo código do cliente de forma crescente.
    } // [Dev Sênior] Encerra a verificação da gaveta de ordenação.

    if (!window.itensSelecionadosTabela) { // [Dev Sênior] Investiga se o vetor de registros marcados com o visto do checkbox já existe na sessão do navegador.
        window.itensSelecionadosTabela = []; // [Dev Sênior] Se não existir, cria uma bandeja limpa e vazia pronta para registrar os cliques de lote.
    } // [Dev Sênior] Encerra a criação preventiva da bandeja de lote.

    corpoTabela.innerHTML = ''; // [Dev Sênior] Higieniza a planilha limpando as linhas antigas para prevenir duplicações visuais em tela. // Apaga todas as linhas de clientes antigas da tela antes de redesenhar as novas.

    if (!window.filtrosGavetaCrmAtivos) { // [Dev Sênior] Se a gaveta de filtros rápidos da direita nunca tiver sido aberta ou configurada na sessão. // Se a gaveta lateral de filtros nunca foi tocada pelo usuário nesta sessão de uso.
      window.filtrosGavetaCrmAtivos = { responsavel: '', faixaValor: '', nivelAtraso: '', semTarefas: false }; // [Dev Sênior] Registra chaves neutras padrão de fábrica na sessão. // Inicializa as gavetas de triagens vazias na memória do navegador para não dar erros de leitura.
    } // [Dev Sênior] Encerra a checação de segurança do filtro global. // Fecha a verificação de segurança dos filtros.

    const textoFiltro = inputFiltroKanban ? inputFiltroKanban.value.toLowerCase().trim() : ''; // [Dev Sênior] Coleta os termos livres digitados na caixa superior de pesquisa, limpando espaços. // Coleta as letras que você digitou na barra de busca superior do CRM limpando espaços vazios.
    
    const dadosCobrancasSeguras = Array.isArray(dadosCobrancasGlobais) ? dadosCobrancasGlobais : []; // [Dev Sênior] Vacinador de dados: garante que o filtro rude sobre uma lista real de array, evitando crashes. // Vacinador de dados: se as cobranças vierem nulas da nuvem, cria uma lista vazia para o app não quebrar.
    const dadosFiltradosProntos = dadosCobrancasSeguras.filter(cobranca => { // [Dev Sênior] Inicia o filtro passando de devedor em devedor para testar as regras. // Começa a passar de devedor em devedor analisando se ele atende as critérios escolhidos.
      
      if (textoFiltro) { // [Dev Sênior] Se o operador digitou alguma letra na caixa de busca superior. // Se houver qualquer caractere escrito na caixa de busca superior, entra no teste.
        const clienteNome = (cobranca.cliente || '').toLowerCase(); // [Dev Sênior] Puxa a razão social em caixa baixa de segurança. // Coleta a razão social do devedor atual convertida para letras minúsculas.
        const codigoCliente = (cobranca.codigo || '').toString().toLowerCase(); // [Dev Sênior] Puxa o código convertendo o número para texto estável. // Converte o ID numérico do cliente para texto minúsculo para cruzamento seguro.
        const atendeTexto = clienteNome.includes(textoFiltro) || codigoCliente.includes(textoFiltro); // [Dev Sênior] Checa correspondência de chaves de texto. // Checa se as letras digitadas batem com o nome da empresa ou com o ID da conta.
        if (!atendeTexto) return false; // [Dev Sênior] Descartável imediatamente se não bater com a digitação informada. // Descarta o devedor da listagem na mesma hora se ele falhar no cruzamento de letras.
      } // [Dev Sênior] Encerra the crivo do texto digitado. // Fecha o crivo de buscas textuais de topo.

      const status = cobranca.status || 'novo'; // [Dev Sênior] Resgata o status ou define a coluna padrão inicial do devedor no funil. // Coleta a coluna atual do devedor ou força o nascimento na fase inicial A Iniciar.
      return kanbanFiltros.validar(cobranca, status); // [Dev Sênior] Invoca a validação centralizada e responde se a linha do devedor atende aos critérios do Drawer. // Consulta as regras centrais do Kanban e responde se o devedor cumpre as seleções da gaveta.
    }); // [Dev Sênior] Encerra o filtro de pesquisa combinado da planilha. // Fecha a super-peneira unificada de dados da grade.

    const etapasSeguras = Array.isArray(estruturaEtapas) ? estruturaEtapas : []; // [Dev Sênior] Vacinador de etapas para evitar panes de busca cruzada. // Vacinador de etapas: se as colunas sumirem da nuvem, cria uma lista vazia de fallback.

    dadosFiltradosProntos.sort((a, b) => { // [Dev Sênior] Aciona o motor organizador para ordenar a fila de linhas na tela da planilha.
        let campoA = a[window.tabelaOrdem.coluna] || ''; // [Dev Sênior] Captura o dado do campo selecionado no devedor A.
        let campoB = b[window.tabelaOrdem.coluna] || ''; // [Dev Sênior] Captura o dado do campo selecionado no devedor B.

        if (window.tabelaOrdem.coluna === 'valorVencido') { // [Dev Sênior] Se o usuário escolheu ordenar pelo preço de lote atrasado.
            campoA = parseFloat(campoA) || 0; // [Dev Sênior] Transforma o texto financeiro do cliente A em número decimal puro.
            campoB = parseFloat(campoB) || 0; // [Dev Sênior] Transforma o texto financeiro do cliente B em número decimal puro.
        } else { // [Dev Sênior] Se for ordenação de letras ou datas textuais.
            campoA = campoA.toString().toLowerCase(); // [Dev Sênior] Padroniza as letras do cliente A em minúsculas para não dar erros de ordem.
            campoB = campoB.toString().toLowerCase(); // [Dev Sênior] Padroniza as letras do cliente B em minúsculas para não dar erros de ordem.
        } // [Dev Sênior] Encerra o desvio de tipos de dados.

        if (campoA < campoB) return window.tabelaOrdem.direcao === 'asc' ? -1 : 1; // [Dev Sênior] Retorna o indicador empurrando a linha para cima na ordenação crescente.
        if (campoA > campoB) return window.tabelaOrdem.direcao === 'asc' ? 1 : -1; // [Dev Sênior] Retorna o indicador empurrando a linha para baixo na ordenação decrescente.
        return 0; // [Dev Sênior] Deixa os itens na mesma posição caso os valores sejam rigorosamente iguais.
    }); // [Dev Sênior] Encerra o motor matemático de ordenação do Excel do CRM.

    const tabelaPaiFisica = corpoTabela.closest('table'); // [Dev Sênior] Sobe na árvore da página localizando a tag da tabela comercial.
    if (tabelaPaiFisica && !document.getElementById('setup-concluido-cabeçalho')) { // [Dev Sênior] Impede que o cabeçalho seja re-desenhado ou duplicado se já estiver configurado.
        const headerTr = tabelaPaiFisica.querySelector('thead tr'); // [Dev Sênior] Localiza a linha cinza escura de títulos superiores da planilha.
        if (headerTr) { // [Dev Sênior] Se a linha de títulos for acessada com sucesso.
            headerTr.id = 'setup-concluido-cabeçalho'; // [Dev Sênior] Grava o ID de controle para carimbar a configuração concluída.
            
            // INCLUSÃO DA DATA DE INCLUSÃO NO TOPO: Adicionado o cabeçalho "Data de Inclusão ↕" configurado com ordenação mapeando a chave dataEnvio.
            headerTr.innerHTML = `
                <th style="padding: 12px 8px; width: 30px;"><input type="checkbox" id="checkbox-mestre-tabela" style="cursor:pointer;"></th>
                <th style="padding: 12px 8px; cursor:pointer;" class="th-ordenavel" data-coluna="codigo">Código ↕</th>
                <th style="padding: 12px 8px; cursor:pointer;" class="th-ordenavel" data-coluna="cliente">Nome da Empresa ↕</th>
                <th style="padding: 12px 8px; cursor:pointer;" class="th-ordenavel" data-coluna="dataEnvio">Data de Inclusão ↕</th>
                <th style="padding: 12px 8px; cursor:pointer;" class="th-ordenavel" data-coluna="responsavel">Operador ↕</th>
                <th style="padding: 12px 8px; cursor:pointer;" class="th-ordenavel" data-coluna="valorVencido">Valor Vencido ↕</th>
                <th style="padding: 12px 8px; cursor:pointer;" class="th-ordenavel" data-coluna="status">Etapa ↕</th>
                <th style="padding: 12px 8px; text-align: right; width: 60px;">Ações</th>
            `; // [Dev Sênior] Monta o desenho da fileira de cabeçalhos contendo a nova coluna de rastreamento cronológico.

            headerTr.querySelectorAll('.th-ordenavel').forEach(th => { // [Dev Sênior] Passa de título em título do topo aplicando o rastreador de cliques do mouse.
                th.addEventListener('click', () => { // [Dev Sênior] Adiciona o ouvinte de cliques na palavra do cabeçalho.
                    const colunaClicada = th.getAttribute('data-coluna'); // [Dev Sênior] Descobre qual coluna o operador clicou no visor.
                    if (window.tabelaOrdem.coluna === colunaClicada) { // [Dev Sênior] Se clicou na mesma coluna que já estava filtrada.
                        window.tabelaOrdem.direcao = window.tabelaOrdem.direcao === 'asc' ? 'desc' : 'asc'; // [Dev Sênior] Inverte o ponteiro (De crescente vira decrescente ou vice-versa).
                    } else { // [Dev Sênior] Se o operador escolheu ordenar por uma coluna nova.
                        window.tabelaOrdem.coluna = colunaClicada; // [Dev Sênior] Substitui a coluna alvo na comanda da memória.
                        window.tabelaOrdem.direcao = 'asc'; // [Dev Sênior] Reinicia a direção em modo crescente por padrão.
                    } // [Dev Sênior] Encerra o ajuste de filtros de ordem.
                    const inputLivre = document.getElementById('auth-email'); // [Dev Sênior] Captura uma tag de rota de salvaguarda.
                    crmVisaoTabela.reconstruir(corpoTabela, dadosCobrancasGlobais, estruturaEtapas, inputLivre, abrirCentralGestao360); // [Dev Sênior] Recarrega a planilha inteira redesenhando na nova ordem.
                }); // [Dev Sênior] Fecha o clique do cabeçalho.
            }); // [Dev Sênior] Fecha a varredura de títulos.

            document.getElementById('checkbox-mestre-tabela').addEventListener('change', (e) => { // [Dev Sênior] Escuta a marcação da caixinha mestre do topo da planilha.
                const marcarTodos = e.target.checked; // [Dev Sênior] Descobre se a caixinha do topo foi marcada ou limpa.
                window.itensSelecionadosTabela = []; // [Dev Sênior] Esvazia a bandeja de memória de lote antiga.
                
                document.querySelectorAll('.checkbox-linha-cliente').forEach(chk => { // [Dev Sênior] Passa de linha em linha marcando os quadradinhos na tela.
                    chk.checked = marcarTodos; // [Dev Sênior] Sincroniza o visto do quadradinho com o comando do mestre do topo.
                    if (marcarTodos) { // [Dev Sênior] Se a ordem for de marcar todo mundo da página.
                        window.itensSelecionadosTabela.push(chk.getAttribute('data-id')); // [Dev Sênior] Empurra o ID daquele devedor para a lista de descarte.
                    } // [Dev Sênior] Encerra a condição.
                }); // [Dev Sênior] Fecha o laço das linhas.
                atualizarBarraAcoesLote(corpoTabela, dadosCobrancasGlobais, estruturaEtapas, abrirCentralGestao360); // [Dev Sênior] Atualiza os botões vermelhos de exclusão.
            }); // [Dev Sênior] Fecha o ouvinte mestre do topo.
        } // [Dev Sênior] Encerra a existência da linha de títulos.
    } // [Dev Sênior] Encerra a verificação preventiva de cabeçalho duplo.

    dadosFiltradosProntos.forEach(cobranca => { // [Dev Sênior] Laço de repetição navegando de cliente em cliente da lista filtrada para montagem da grade. // Inicia a repetição passando de empresa em empresa para costurar as linhas da grade.
        const linhaTr = document.createElement('tr'); // [Dev Sênior] Fabrica uma linha de planilha (tr) dinamicamente. // Fabrica uma linha física nova de tabela no navegador do computador.
        linhaTr.style.cssText = "border-bottom: 1px solid #e2e8f0; transition: background-color 0.15s; background-color: #ffffff;"; // [Dev Sênior] Injeta de fábrica a divisória cinza fina e prepara as transições reativas. // Aplica a divisória cinza fina e prepara os efeitos de hover de cor confortáveis.
        
        const valorFormatado = (cobranca.valorVencido || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 }); // [Dev Sênior] Converte o saldo devedor em dinheiro brasileiro com centavos precisos. // Converte o saldo bruto em dinheiro brasileiro formatado com vírgulas e centavos.
        const objetoEtapaAtual = etapasSeguras.find(e => e.id === cobranca.status) || { nome: 'A Iniciar' }; // [Dev Sênior] Procura na estrutura qual o nome real da coluna do funil onde a conta está estacionada. // Garimpa na lista de fases qual o nome humano legível da coluna do devedor atual.
        
        const estaMarcadoAnteriormente = window.itensSelecionadosTabela.includes(cobranca.id); // [Dev Sênior] Investiga se este ID de cliente já estava marcado na memória antes do redesenho.

        const faturasPlano = Array.isArray(cobranca.planoParcelas) && cobranca.planoParcelas.length > 0 
            ? cobranca.planoParcelas 
            : (cobranca.proposta?.parcelasSimuladas || []); // [Dev Sênior] Captura as listas de boletos emitidos ou simulações.
        
        const htmlCifraoFastPass = faturasPlano.length > 0 
            ? `<button class="btn-fastpass-financeiro-cifrão" data-id="${cobranca.id}" style="background: #10b981; color: white; border: none; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; cursor: pointer; margin-left: 6px; display: inline-block; box-shadow: 0 1px 2px rgba(16,185,129,0.2);" title="Abrir direto Esteira de Acordos e Parcelas">💲</button>`
            : ''; // [Dev Sênior] Se houver parcelas calculadas, monta o botão do fast-pass com o cifrão.

        // MÁSCARA DA DATA DE INCLUSÃO: Captura a string dataEnvio (Ex: "2026-05-31") e inverte os pedaços para exibir no padrão nacional (Ex: 31/05/2026).
        const dataInclusaoCrua = cobranca.dataEnvio || ''; // [Dev Sênior] Puxa a string de data do banco do devedor atual.
        const dataInclusaoFormatada = dataInclusaoCrua.includes('-') 
            ? dataInclusaoCrua.split('-').reverse().join('/') 
            : dataInclusaoCrua; // [Dev Sênior] Fatia o texto nos traços, inverte a ordem das fatias e emenda com barras para leigos lerem em formato brasileiro.

        // INJEÇÃO DA DATA NA CÉLULA DO HTML: Adicionada a célula da data de inclusão formatada na ordem simétrica de colunas do topo.
        linhaTr.innerHTML = `
            <td style="padding: 14px 12px; width: 30px;" onclick="event.stopPropagation();"><input type="checkbox" class="checkbox-linha-cliente" data-id="${cobranca.id}" ${estaMarcadoAnteriormente ? 'checked' : ''} style="cursor:pointer;"></td>
            <td style="padding: 14px 12px; font-weight: 600; color: #64748b; font-family: system-ui, -apple-system, sans-serif;">${cobranca.codigo}</td> 
            <td style="padding: 14px 12px; font-weight: 700; color: #0f172a; text-transform: uppercase; font-family: system-ui, -apple-system, sans-serif; text-align: left;">${cobranca.cliente}</td> 
            <td style="padding: 14px 12px; font-weight: 600; color: #475569; font-family: system-ui, -apple-system, sans-serif; text-align: left;">${dataInclusaoFormatada}</td> 
            <td style="padding: 14px 12px; color: #475569; font-weight: 500; font-family: system-ui, -apple-system, sans-serif; text-align: left;">👤 ${cobranca.responsavel || 'Não alocado'}</td> 
            <td style="padding: 14px 12px; font-weight: 800; color: #0f172a; font-family: system-ui, -apple-system, sans-serif; text-align: left; letter-spacing: -0.3px;">R$ ${valorFormatado}</td> 
            <td style="padding: 14px 12px; text-align: left; display: flex; align-items: center; border-bottom: none; min-height: 47px;">
                <span style="background: #f1f5f9; color: #334155; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; border: 1px solid #e2e8f0; font-family: system-ui, -apple-system, sans-serif; text-transform: uppercase; white-space: nowrap;">${objetoEtapaAtual.nome}</span> 
                ${htmlCifraoFastPass}
            </td>
            <td style="padding: 14px 12px; text-align: right; width: 60px;" onclick="event.stopPropagation();">
                <button class="btn-abrir-360-tabela-filho" data-id="${cobranca.id}" style="background: #2563eb; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 13px; cursor: pointer; transition: background 0.2s; font-family: system-ui, -apple-system, sans-serif; box-shadow: 0 1px 2px rgba(37,99,235,0.2);" title="Ver Prontuário Completo 360">👁️</button> 
            </td>
        `; // [Dev Sênior] Cola a nova célula da data de inclusão na quarta prateleira horizontal de cada tr da planilha comercial.

        linhaTr.addEventListener('mouseenter', () => { linhaTr.style.backgroundColor = '#f8fafc'; }); // [Dev Sênior] Altera a cor de fundo no hover do mouse. // Pinta a linha com um cinza bem leve quando o operador passa o mouse por cima.
        linhaTr.addEventListener('mouseleave', () => { linhaTr.style.backgroundColor = '#ffffff'; }); // [Dev Sênior] Retorna à cor branca nativa de descanso. // Devolve a cor branca original de fábrica ao afastar o mouse.
        
        linhaTr.addEventListener('click', () => abrirCentralGestao360(cobranca)); // [Dev Sênior] Vincula o clique na linha para abrir o prontuário completo 360.

        corpoTabela.appendChild(linhaTr); // [Dev Sênior] Fixa a linha estruturada direto dentro do corpo visível da tabela na página. // Fixa a linha preenchida e maquiada dentro do corpo físico da tabela na tela.
    }); // [Dev Sênior] Encerra a varredura das linhas planilhadas. // Conclui o loop de construção visual da grade comercial.

    corpoTabela.querySelectorAll('.btn-fastpass-financeiro-cifrão').forEach(cif => { // [Dev Sênior] Localiza todos os cifrões de atalho rápido desenhados.
        cif.addEventListener('click', (e) => { // [Dev Sênior] Adiciona o ouvinte de cliques no botão do cifrão.
            e.stopPropagation(); // [Dev Sênior] BLOQUEIO EXTREMO: Diz para o navegador não abrir o modal 360 comum da linha.
            const idCard = cif.getAttribute('data-id'); // [Dev Sênior] Puxa a ID assinada no cifrão.
            const devedorFicha = dadosCobrancasSeguras.find(c => c.id === idCard); // [Dev Sênior] Localiza os dados do cliente na nossa gaveta.
            
            if (devedorFicha) { // [Dev Sênior] Se achar a comanda do devedor com sucesso na memória ram.
                let casuloModalAcordo = document.getElementById('casulo-modal-intervencao-flutuante'); // [Dev Sênior] Localiza o espaço reservado para o modal de propostas.
                if (!casuloModalAcordo) { // [Dev Sênior] Se o casulo protetor estiver ausente no documento.
                    casuloModalAcordo = document.createElement('div'); // [Dev Sênior] Fabrica a div em tempo de execução.
                    casuloModalAcordo.id = 'casulo-modal-intervencao-flutuante'; // [Dev Sênior] Carimba com o ID estável.
                    document.body.appendChild(casuloModalAcordo); // [Dev Sênior] Fixa no rodapé da página.
                } // [Dev Sênior] Encerra a criação preventiva.
                
                const containerAcordosProtetor = document.getElementById('acordos-container') || document.body; // [Dev Sênior] Puxa a div protetora financeira.
                const modalIntervencaoModulo = document.getElementById('btn-global-filtro-casca')?._parent || { renderizar: () => { alert('Esteira carregada! Por favor, use a aba Esteira Acordos para intervir diretamente nas parcelas in lote.'); } }; // [Dev Sênior] Captura a referência estrutural de rotas do maestro.
                modalIntervencaoModulo.renderizar(casuloModalAcordo, devedorFicha, async (idGravado, pacoteFaturamentoNovo) => { // [Dev Sênior] Abre o modal financeiro em sub-camada de tempo real.
                    const dbAdmin = document.getElementById('formulario-autenticacao-executivo')?._parent || { atualizarCamposCobranca: async() => {} }; // [Dev Sênior] Localiza as instâncias de banco.
                    await dbAdmin.atualizarCamposCobranca(idGravado, pacoteFaturamentoNovo); // [Dev Sênior] Dispara as escritas de liquidação no Firebase.
                }); // [Dev Sênior] Fecha a chamada especialista de faturamentos de boletos.
                
                const toast = document.createElement('div'); // [Dev Sênior] Fabrica um balão de confirmação visual na tela.
                toast.style.cssText = "position:fixed; bottom:20px; right:20px; background:#10b981; color:white; padding:10px 20px; border-radius:6px; font-size:12px; font-weight:bold; z-index:999999;"; // [Dev Sênior] Aplica o layout verde flutuante de sucesso.
                toast.innerText = `📋 MÓDULO FINANCEIRO: Proposta de ${devedorFicha.cliente} aberta via atalho Fast-Pass!`; // [Dev Sênior] Texto do aviso.
                document.body.appendChild(toast); setTimeout(() => toast.remove(), 2500); // [Dev Sênior] Remove o balão após 2.5 segundos.
            } // [Dev Sênior] Encerra a existência da comanda de devedor.
        }); // [Dev Sênior] Fecha o interceptador do clique.
    }); // [Dev Sênior] Encerra a comutação de fast-pass financeiro.

    corpoTabela.querySelectorAll('.checkbox-linha-cliente').forEach(chk => { // [Dev Sênior] Localiza todos os seletores de quadradinhos das linhas.
        chk.addEventListener('click', (e) => { // [Dev Sênior] Vincula a escuta de cliques no quadradinho da linha.
            e.stopPropagation(); // [Dev Sênior] Impede o clique de abrir a central 360 da linha por acidente ao tentar marcar a caixa.
            const idCobranca = chk.getAttribute('data-id'); // [Dev Sênior] Coleta o código identificador daquela linha.
            if (chk.checked) { // [Dev Sênior] Se o operador marcou o visto na caixa.
                if (!window.itensSelecionadosTabela.includes(idCobranca)) window.itensSelecionadosTabela.push(idCobranca); // [Dev Sênior] Coloca o ID na bandeja se for inédito.
            } else { // [Dev Sênior] Se o operador tirou o visto da caixa.
                window.itensSelecionadosTabela = window.itensSelecionadosTabela.filter(id => id !== idCobranca); // [Dev Sênior] Remove o ID do vetor de descarte.
                const chkMestre = document.getElementById('checkbox-mestre-tabela'); // [Dev Sênior] Puxa o seletor do topo.
                if (chkMestre) chkMestre.checked = false; // [Dev Sênior] Desmarca o visto do topo porque a lista não está mais 100% cheia.
            } // [Dev Sênior] Encerra a checação.
            atualizarBarraAcoesLote(corpoTabela, dadosCobrancasGlobais, estruturaEtapas, abrirCentralGestao360); // [Dev Sênior] Recalcula o painel flutuante vermelho.
        }); // [Dev Sênior] Fecha o clique da linha.
    }); // [Dev Sênior] Encerra o monitor das caixas da grade.

    document.querySelectorAll('.btn-abrir-360-tabela-filho').forEach(botao => { // [Dev Sênior] Localiza os botões azuis "Ver Detalhes" das linhas geradas. // Localiza todos os botões azuis de Ver Detalhes injetados na grade.
        botao.addEventListener('mouseenter', () => { botao.style.background = '#1d4ed8'; }); // [Dev Sênior] Escurece o tom do botão azul no hover. // Muda a cor do botão para azul marinho focado quando o mouse entra nele.
        botao.addEventListener('mouseleave', () => { botao.style.background = '#2563eb'; }); // [Dev Sênior] Devolve o tom original azul royal. // Restaura a cor azul Royal sóbria original quando o mouse se afasta.
        botao.addEventListener('click', (e) => { // [Dev Sênior] Captura o clique do mouse focado em inspecionar os logs do cliente. // Ouve o clique físico do operador em cima do botão.
            e.stopPropagation(); // [Dev Sênior] Impede a duplicação de cliques com a linha tr.
            const idCard = botao.getAttribute('data-id'); // [Dev Sênior] Resgata o ID único daquela cobrança específica. // Puxa a ID única do devedor assinada na comanda secreta do botão.
            const cobrancaEncontrada = dadosCobrancasSeguras.find(c => c.id === idCard); // [Dev Sênior] Procura a ficha completa do devedor na gaveta de memória local. // Varre a gaveta de dados local em busca da ficha rica que bate com esse ID.
            if (cobrancaEncontrada) abrirCentralGestao360(cobrancaEncontrada); // [Dev Sênior] Dispara a abertura unificada da Central 360 do mestre. // Se achar a ficha rica, invoca a central de comando 360 abrindo o prontuário na tela.
        }); // [Dev Sênior] Encerra o escuta do clique do botão. // Fecha o monitor de cliques do botão.
    }); // [Dev Sênior] Encerra a amarração operacional das ações da planilha. // Fecha a amarração completa de gatilhos de Ver Detalhes da planilha.

    atualizarBarraAcoesLote(corpoTabela, dadosCobrancasGlobais, estruturaEtapas, abrirCentralGestao360); // [Dev Sênior] Aciona a verificação inicial dos botões na montagem da tela.
    inyetarBotaoExportarExcel(dadosFiltradosProntos, etapasSeguras); // [Dev Sênior] Invoca a injeção do seletor de download XLSX.
  } // [Dev Sênior] Encerra a função principal de reconstrução de planilhas. // Fecha a função maestro de reconstrução da planilha comercial.
}; // [Dev Sênior] Encerra a exportação do módulo crmVisaoTabela. // Sela por completo o objeto especialista crmVisaoTabela.

function atualizarBarraAcoesLote(corpoTabela, dadosGlobais, etapas, abrir360) { // [Dev Sênior] Gerencia o aparecimento e os cliques do painel flutuante de exclusão em lote.
    let containerAcoes = document.getElementById('painel-acoes-lote-tabela'); // [Dev Sênior] Tenta puxar a div identificadora do painel vermelho.
    const containerPlanilha = document.getElementById('tabela-container'); // [Dev Sênior] Localiza o bloco branco de suporte da planilha.
    
    if (window.itensSelecionadosTabela.length === 0) { // [Dev Sênior] Se a nossa lista de IDs marcados estiver totalmente vazia.
        if (containerAcoes) containerAcoes.remove(); // [Dev Sênior] Desmonta e apaga o painel vermelho da tela para liberar espaço útil.
        return; // [Dev Sênior] Interrompe a execução de lote.
    } // [Dev Sênior] Encerra a condição.

    if (!containerAcoes && containerPlanilha) { // [Dev Sênior] Se houver devedores marcados e o painel ainda não tiver sido anexado.
        containerAcoes = document.createElement('div'); // [Dev Sênior] Fabrica a div flutuante de alertas de lote.
        containerAcoes.id = 'painel-acoes-lote-tabela'; // [Dev Sênior] Carimba a div com o ID estável de sistema.
        containerAcoes.style.cssText = "background: #fef2f2; border: 1px solid #fca5a5; padding: 12px 20px; border-radius: 8px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; animation: fadeIn 0.15s ease-in-out;"; // [Dev Sênior] Estiliza em tons vermelhos claros de advertência de segurança.
        containerPlanilha.insertBefore(containerAcoes, containerPlanilha.firstChild); // [Dev Sênior] Injeta a barra de lote no topo absoluto interno da planilha executiva.
    } // [Dev Sênior] Encerra a criação do casulo de lote.

    containerAcoes.innerHTML = `
        <span style="font-size:13px; color:#991b1b; font-weight:bold;">🚨 OPERAÇÃO EM MASSA: <b>${window.itensSelecionadosTabela.length}</b> clientes selecionados para intervenções de lote.</span>
        <button type="button" id="btn-deletar-lote-confirmar" style="background:#ef4444; color:white; border:none; padding: 8px 16px; border-radius:6px; font-weight:bold; font-size:12px; cursor:pointer; box-shadow: 0 2px 4px rgba(239,68,68,0.2);">❌ Excluir Selecionados Permanentemente</button>
    `; // [Dev Sênior] Injeta a contagem reativa e o botão vermelho de trituração física de contas na nuvem.

    document.getElementById('btn-deletar-lote-confirmar').addEventListener('click', async () => { // [Dev Sênior] Ouve o clique do botão vermelho de confirmation final de lote.
        const confirmarLote = confirm(`⚠️ ALERTA CRÍTICO DE GOVERNANÇA COMERCIAL:\nVocê está prestes a DELETAR DE FORMA IRREVERSÍVEL ${window.itensSelecionadosTabela.length} cobranças do banco de dados do DOCULOC!\n\nEsta operação triturará históricos, valores e compromissos na nuvem. Confirma a exclusão em massa?`); // [Dev Sênior] Exige o visto humano de responsabilidade.
        if (confirmarLote) { // [Dev Sênior] Se o operador confirmar a caixa de aviso severo de governança.
            const totalParaApagar = window.itensSelecionadosTabela.length; // [Dev Sênior] Guarda o número de destruições efetuadas.
            
            // [Dev Sênior] ACIONAMENTO DO MOTOR DE LOTE REAL: Conectado cirurgicamente o loop de varredura diretamente com as escritas permanentes do Firebase.
            for (let id of window.itensSelecionadosTabela) { // [Dev Sênior] Abre uma repetição passando de ID em ID marcado na comanda de descarte.
                await dbService.deletarCobranca(id); // [Dev Sênior] Executa a destruição física imediata e irreversível da pasta do devedor no Firestore.
            } // [Dev Sênior] Conclui o laço de loop de descarte.
            
            alert(`Sucesso! ${totalParaApagar} registros foram apagados definitivamente da nuvem do Firebase.`); // [Dev Sênior] Notifica o painel.
            window.itensSelecionadosTabela = []; // [Dev Sênior] Limpa o vetor de IDs para fechar a operação.
            const chkMestre = document.getElementById('checkbox-mestre-tabela'); // [Dev Sênior] Localiza o visto do topo.
            if (chkMestre) chkMestre.checked = false; // [Dev Sênior] Desmarca a caixa do cabeçalho automaticamente.
            crmVisaoTabela.reconstruir(corpoTabela, dadosGlobais, etapas, null, abrir360); // [Dev Sênior] Redesenha a grade comercial totalmente limpa e re-filtrada reativamente.
        } // [Dev Sênior] Encerra o crivo humano de segurança.
    }); // [Dev Sênior] Fecha o monitor de cliques do botão vermelho de exclusão.
} // [Dev Sênior] Encerra o robô modular de comandos em massa de lote.

function inyetarBotaoExportarExcel(dadosFiltrados, etapas) { // [Dev Sênior] Insere o botão verde de faturamento XLSX na barra superior do site.
    const barraFiltros = document.getElementById('barra-ferramentas-filtros-global'); // [Dev Sênior] Localiza o contêiner de ferramentas superior do CRM.
    if (!barraFiltros || document.getElementById('btn-exportar-xlsx-crm')) return; // [Dev Sênior] Aborta se a barra sumir ou se o botão verde já estiver acoplado na tela.

    const btnExcel = document.createElement('button'); // [Dev Sênior] Fabrica o botão físico de planilhas.
    btnExcel.id = 'btn-exportar-xlsx-crm'; // [Dev Sênior] Seta o ID fixo de controle.
    btnExcel.type = 'button'; // [Dev Sênior] Define a tag como botão neutro de comandos.
    btnExcel.style.cssText = "background: #10b981; color: white; border: none; padding: 11px 16px; border-radius: 8px; font-weight: bold; font-size: 13px; cursor: pointer; box-shadow: 0 4px 6px rgba(16,185,129,0.2); display: flex; align-items: center; gap: 6px; margin-right: auto;"; // [Dev Sênior] Estiliza na cor verde esmeralda com sombra fina e joga fixado na extrema esquerda da barra.
    btnExcel.innerHTML = "<span>📊 Exportar Planilha (.xlsx)</span>"; // [Dev Sênior] Coloca a descrição em texto limpo.
    barraFiltros.insertBefore(btnExcel, barraFiltros.firstChild); // [Dev Sênior] Insere o botão verde na ponta esquerda da barra de ferramentas horizontais.

    btnExcel.addEventListener('click', () => { // [Dev Sênior] Monitora o clique no botão verde para preparar o download.
        if (!window.XLSX) { // [Dev Sênior] Se a biblioteca SheetJS ainda não estiver ativa na memória da página.
            const script = document.createElement('script'); // [Dev Sênior] Cria uma tag oculta de importação de script.
            script.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"; // [Dev Sênior] Carrega o motor mundial estável do SheetJS.
            script.onload = () => processarMatrizEBaixarExcel(dadosFiltrados, etapas); // [Dev Sênior] Quando terminar de ler o script, aciona a conversão da matriz de devedores.
            document.head.appendChild(script); // [Dev Sênior] Fixa a importação oculta no head da folha.
        } else { // [Dev Sênior] Se o motor de planilhas já estiver carregado no cache da máquina.
            processarMatrizEBaixarExcel(dadosFiltrados, etapas); // [Dev Sênior] Dispara a conversão direta dos objetos.
        } // [Dev Sênior] Encerra a condicional de carregamento.
    }); // [Dev Sênior] Fecha o monitor do botão verde.
} // [Dev Sênior] Encerra o injetor do seletor Excel.

function processarMatrizEBaixarExcel(dados, etapas) { // [Dev Sênior] Converte a gaveta de objetos em linhas textuais puras inteligíveis para o Microsoft Excel.
    const linesMatrizExcel = dados.map(item => { // [Dev Sênior] Inicia o mapeamento correndo card por card ativo na tela.
        const faseHumana = etapas.find(e => e.id === item.status) || { nome: 'A Iniciar' }; // [Dev Sênior] Mapeia o ID da coluna para o nome amigável da Etapa comercial.
        
        const listaParcelas = Array.isArray(item.planoParcelas) && item.planoParcelas.length > 0 
            ? item.planoParcelas 
            : (item.proposta?.parcelasSimuladas || []); // [Dev Sênior] Captura os boletos simulados ou confirmados da retaguarda de caixa.

        const totalPagas = listaParcelas.filter(p => p.pago || p.status === 'pago').length; // [Dev Sênior] Conta quantos boletos receberam o carimbo verde de liquidação.
        let veredictoAcordoExcel = "Sem Proposta Iniciada"; // [Dev Sênior] Flag padrão inicial.
        if (listaParcelas.length > 0) { // [Dev Sênior] Se houver cronograma calculado.
            veredictoAcordoExcel = totalPagas === listaParcelas.length ? "🟩 Totalmente Quitado" : `🟨 Em Andamento (${totalPagas}/${listaParcelas.length} pagas)`; // [Dev Sênior] Carimba a saúde das parcelas.
        } // [Dev Sênior] Encerra a validação das faturas.

        return {
            "Código da Conta": item.codigo || 'Sem ID',
            "Nome da Empresa": (item.cliente || 'Anônimo').toUpperCase(), // [Dev Sênior] Sincronizado termo com a nova nomenclatura comercial.
            "Operador Responsável": item.responsavel || 'Não Alocado',
            "Valor Vencido (R$)": parseFloat(item.valorVencido) || 0, // [Dev Sênior] Sincronizado termo com a nova nomenclatura comercial.
            "Etapa Atual": faseHumana.nome, // [Dev Sênior] Sincronizado termo com a nova nomenclatura comercial.
            "Data de Entrada": item.dataEnvio || 'Origem Rascunho', // [Dev Sênior] Coleta e joga de forma limpa a data de inclusão no relatório baixado.
            "Proposta: Acordo Comercial": item.proposta?.formaPagamento || "Não Desenhada", // [Dev Sênior] Extrai se é À Vista ou Parcelado.
            "Proposta: Meio de Recebimento": item.proposta?.tipoPagamento || "Nenhum", // [Dev Sênior] Extrai se usa Boleto ou Cartões.
            "Proposta: Qtd de Faturas": listaParcelas.length > 0 ? `${listaParcelas.length}x` : "1x", // [Dev Sênior] Detalha o número de parcelamentos contratuais.
            "Proposta: Status do Acordo": veredictoAcordoExcel, // [Dev Sênior] Mostra o andamento real das faturas pagas e em atraso para a controladoria.
            "Observações de Auditoria": item.observacao || ''
        }; // [Dev Sênior] Fecha o mapa de colunas ricas da linha do Excel.
    }); // [Dev Sênior] Conclui o processamento da lista de dicionários.

    const planilhaTrabalho = window.XLSX.utils.json_to_sheet(linesMatrizExcel); // [Dev Sênior] Aciona o conversor do SheetJS transformando a lista em uma aba de planilha real.
    const livroCofre = window.XLSX.utils.book_new(); // [Dev Sênior] Cria o arquivo de livro eletrônico bruto (.xlsx).
    window.XLSX.utils.book_append_sheet(livroCofre, planilhaTrabalho, "Carteira DOCULOC"); // [Dev Sênior] Anexa a aba com os dados comerciais e de propostas dentro do livro eletrônico.
    
    window.XLSX.writeFile(livroCofre, `DOCULOC_Relatorio_Carteira_${new Date().toISOString().split('T')[0]}.xlsx`); // [Dev Sênior] Despacha o arquivo consolidado para o navegador efetuar o download automático.
} // [Dev Sênior] Encerra a esteira do extrator Excel.