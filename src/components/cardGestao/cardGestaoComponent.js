import { dadosCliente } from "./dadosCliente"; // [Dev Sênior] Importa o sub-módulo responsável por gerenciar e desenhar as informações cadastrais à esquerda.
import { abaTarefas } from "./abaTarefas"; // [Dev Sênior] Importa o sub-módulo responsável por gerenciar e listar a agenda de lembretes à direita.
import { abaProposta } from "./abaProposta"; // [Dev Sênior] Importa o sub-módulo responsável por rodar a calculadora de propostas de acordos comerciais.

export const cardGestaoComponent = { // [Dev Sênior] Define e exporta o objeto do componente para que o arquivo principal app.js o localize perfeitamente.
  renderizar(elementoContainer, cobranca, listaEtapas, callbackAtualizarGeral) { // [Dev Sênior] Função mestre que fabrica o modal injetando os dados reativos da nuvem do Firebase.

    const dadosLocais = { // [Dev Sênior] Cria uma gaveta de cópia local dos dados do cliente devedor para manipulação fluida em tela.
      id: cobranca.id, // [Dev Sênior] Transfere o número de registro exclusivo do banco de dados para a memória temporária.
      cliente: cobranca.cliente || '', // [Dev Sênior] Preserva a razão social ou nome completo do cliente inadimplente.
      codigo: cobranca.codigo || '', // [Dev Sênior] Preserva o código numérico eletrônico de identificação da conta.
      responsavel: cobranca.responsavel || '', // [Dev Sênior] Mantém o nome do cobrador encarregado daquela respectiva carteira.
      dataEnvio: cobranca.dataEnvio || '', // [Dev Sênior] Armazena a data em que o lote original deu entrada no sistema.
      valorVencido: parseFloat(cobranca.valorVencido) || 0, // [Dev Sênior] Garante a formatação numérica do valor principal em atraso.
      valorAVencer: 0, // [Dev Sênior] Força a regra simplificada do sistema mantendo o saldo a vencer zerado.
      status: cobranca.status || 'novo', // [Dev Sênior] Lembra em qual coluna física do Kanban o cartão está paralisado atualmente.
      observacao: cobranca.observacao || '', // [Dev Sênior] Preserva a descrição textual inicial inserida no cadastro da conta.
      tarefas: Array.isArray(cobranca.tarefas) ? [...cobranca.tarefas] : [], // [Dev Sênior] Cria uma cópia limpa do lote de tarefas e prazos de cobrança.
      historicoNotas: Array.isArray(cobranca.historicoNotas) ? [...cobranca.historicoNotas] : [], // [Dev Sênior] Copia integralmente a linha do tempo cronológica de notas de conversas.
      proposta: cobranca.proposta || { valorCobrado: parseFloat(cobranca.valorVencido) || 0, tipoModificador: 'R$', valorModificador: 0, formaPagamento: 'A vista', tipoPagamento: 'Boleto', qtdParcelas: 1, parcelasSimuladas: [] }, // [Dev Sênior] Puxa a proposta calculada ou inicializa o modelo padrão da calculadora.
      contatos: Array.isArray(cobranca.contatos) ? [...cobranca.contatos] : (cobranca.contato ? [{ ...cobranca.contato }] : [{ nome: '', telefone: '', email: '', vinculo: 'proprio' }]) // [Dev Sênior] Inicializa e preserva de forma segura a lista de múltiplos contatos adicionados.
    }; // [Dev Sênior] Fecha a estruturação do objeto de memória volátil local.

    let abaAtiva = 'tarefas'; // [Dev Sênior] Determina qual sub-aba (Tarefas, Notas ou Propostas) deve inicializar em foco.

    // HTML INJETADO REFORMULADO: Transforma o nome e código do cabeçalho em caixas de entrada (inputs) transparentes editáveis com o ícone de lápis (✏️).
    // [Dev Sênior] CORREÇÃO DE LOGÍSTICA: Alterado de 'dadosLocais.cliente' e 'dadosLocais.codigo' para a variável correta minúscula 'dadosLocais' evitando travamentos de digitação.
    elementoContainer.innerHTML = ` <div id="modal-gestao-360" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 2500; padding: 20px;"> <div style="background: white; border-radius: 12px; width: 100%; max-width: 1100px; height: 90vh; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.15); display: flex; flex-direction: column; overflow: hidden;"> <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; flex-shrink: 0;"> <div style="display: flex; flex-direction: column; gap: 4px; width: 80%;"> <div style="display: flex; align-items: center; gap: 6px;"> <span style="font-size: 16px;">💼</span> <input type="text" id="topo-cliente-nome" value="${dadosLocais.cliente}" placeholder="NOME DO CLIENTE" style="font-size: 18px; font-weight: bold; color: #1e293b; background: transparent; border: none; padding: 2px 4px; width: 90%; outline: none; border-bottom: 1px dashed transparent; transition: border-color 0.2s; text-transform: uppercase;" title="Clique para editar o nome do cliente"> <span style="font-size: 12px; color: #94a3b8; pointer-events: none;">✏️</span> </div> <div style="display: flex; align-items: center; gap: 6px; padding-left: 2px;"> <span style="font-size: 12px; color: #64748b; white-space: nowrap;">Código da Conta:</span> <input type="text" id="topo-cliente-codigo" value="${dadosLocais.codigo}" placeholder="CÓDIGO" style="font-size: 12px; color: #64748b; font-weight: 600; background: transparent; border: none; padding: 1px 4px; width: 150px; outline: none; border-bottom: 1px dashed transparent; transition: border-color 0.2s;" title="Clique para editar o código da conta"> <span style="font-size: 11px; color: #94a3b8; pointer-events: none;">✏️</span> <span style="font-size: 12px; color: #cbd5e1; margin: 0 4px;">|</span> <span style="font-size: 12px; color: #64748b;">Gerencie o histórico, tarefas e pipeline de transição do cliente</span> </div> </div> <button id="btn-fechar-gestao-topo" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #94a3b8; font-weight: bold;">&times;</button> </div> <div style="background: #f1f5f9; padding: 12px 20px; border-bottom: 1px solid #e2e8f0; display: flex; gap: 8px; overflow-x: auto; flex-shrink: 0;" id="trilho-etapas-modal"></div> <div style="display: flex; flex-grow: 1; overflow: hidden; width: 100%;"> <div style="width: 45%; border-right: 1px solid #e2e8f0; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; background: #ffffff;" id="coluna-esquerda-dados"></div> <div style="width: 55%; padding: 20px; display: flex; flex-direction: column; background: #f8fafc; overflow: hidden;"> <div style="display: flex; gap: 5px; border-bottom: 2px solid #e2e8f0; margin-bottom: 15px; flex-shrink: 0;"> <button id="tab-tarefas" style="background: none; border: none; padding: 8px 16px; font-size: 14px; font-weight: bold; cursor: pointer; color: #2563eb; border-bottom: 2px solid #2563eb; margin-bottom: -2px;">📅 Tarefas e Lembretes</button> <button id="tab-anotacoes" style="background: none; border: none; padding: 8px 16px; font-size: 14px; font-weight: 500; cursor: pointer; color: #64748b; margin-bottom: -2px;">💬 Histórico de Conversas / Notas</button> <button id="tab-proposta" style="background: none; border: none; padding: 8px 16px; font-size: 14px; font-weight: 500; cursor: pointer; color: #64748b; margin-bottom: -2px; display: none;">🤝 Proposta de Acordo</button> </div> <div id="conteudo-aba-dinamica" style="display: flex; flex-direction: column; flex-grow: 1; overflow: hidden;"></div> </div> </div> </div> </div> `; // [Dev Sênior] Fabrica o esqueleto limpo de blocos do modal abrindo as tags para recepção dos arquivos-filhos.

    const tabTarefas = document.getElementById('tab-tarefas'); // [Dev Sênior] Coleta a aba física de tarefas por ID.
    const tabAnotacoes = document.getElementById('tab-anotacoes'); // [Dev Sênior] Coleta a aba física de anotações por ID.
    const tabProposta = document.getElementById('tab-proposta'); // [Dev Sênior] Coleta a nova aba física de propostas por ID.
    const conteudoAba = document.getElementById('conteudo-aba-dinamica'); // [Dev Sênior] Coleta o miolo direito que receberá o fatiamento de abas.

    // AMARRAÇÃO DE EVENTOS DO TOPO: Insere microinterações visuais de foco e captura as edições em tempo real do Nome e Código do Cliente na memória local.
    const inputNomeTopo = document.getElementById('topo-cliente-nome'); // [Dev Sênior] Localiza o input do nome do cliente no topo.
    inputNomeTopo.addEventListener('focus', () => { inputNomeTopo.style.borderColor = '#cbd5e1'; }); // [Dev Sênior] Quando clicado, destaca sutilmente a linha tracejada inferior.
    inputNomeTopo.addEventListener('blur', () => { inputNomeTopo.style.borderColor = 'transparent'; }); // [Dev Sênior] Quando o operador sai do campo, oculta a linha mantendo o design limpo.
    inputNomeTopo.addEventListener('input', (e) => { dadosLocais.cliente = e.target.value.trim(); }); // [Dev Sênior] Sincroniza cada letra digitada diretamente no objeto da sessão.

    const inputCodigoTopo = document.getElementById('topo-cliente-codigo'); // [Dev Sênior] Localiza o input do código da conta no topo.
    inputCodigoTopo.addEventListener('focus', () => { inputCodigoTopo.style.borderColor = '#cbd5e1'; }); // [Dev Sênior] Ativa a linha tracejada delimitadora no clique.
    inputCodigoTopo.addEventListener('blur', () => { inputCodigoTopo.style.borderColor = 'transparent'; }); // [Dev Sênior] Remove a linha tracejada no desfoque.
    inputCodigoTopo.addEventListener('input', (e) => { dadosLocais.codigo = e.target.value.trim(); }); // [Dev Sênior] Sincroniza cada caractere do código na memória volátil.

    const redefinirEstiloAbas = () => { // [Dev Sênior] Rotina unificada para desenhar a cor azul ativa exclusivamente na aba selecionada na memória.
        [tabTarefas, tabAnotacoes, tabProposta].forEach(t => { if (t) { t.style.color = '#64748b'; t.style.borderBottom = 'none'; t.style.fontWeight = '500'; } }); // [Dev Sênior] Limpa o destaque visual dos botões inativos de abas.
        const botaoAtivo = document.getElementById(`tab-${abaAtiva}`); // [Dev Sênior] Encontra o botão correspondente à aba atualmente aberta.
        if (botaoAtivo) { botaoAtivo.style.color = '#2563eb'; botaoAtivo.style.borderBottom = '2px solid #2563eb'; botaoAtivo.style.fontWeight = 'bold'; } // [Dev Sênior] Injeta the realce azul e negrito no botão ativo.
    };

    const atualizarAbasDireita = () => { // [Dev Sênior] Gerenciador inteligente de abas que decide qual arquivo-filho deve ser plotado no miolo direito da tela.
        if (abaAtiva === 'tarefas' || abaAtiva === 'anotacoes') { // [Dev Sênior] Se o ponteiro apontar para a agenda ou histórico cronológico de conversas.
            abaTarefas.renderizar(conteudoAba, dadosLocais, abaAtiva, () => { atualizarAbasDireita(); }); // [Dev Sênior] Invoca a lógica do sub-módulo de tarefas e notas limpando o arquivo mestre.
        } else if (abaAtiva === 'proposta') { // [Dev Sênior] Se o cobrador ativou a calculadora de negociações.
            abaProposta.renderizar(conteudoAba, dadosLocais, () => { atualizarAbasDireita(); }); // [Dev Sênior] Invoca a lógica isolada da calculadora de propostas de caixa.
        }
    };

    const desenharTrilhoSuperior = () => { // [Dev Sênior] Constrói a linha do tempo horizontal contendo os botões dinâmicos de setas das colunas na nuvem.
        const trilho = document.getElementById('trilho-etapas-modal'); // [Dev Sênior] Localiza o container físico do topo do modal.
        if (!trilho) return; // [Dev Sênior] Trava de segurança contra erros de carregamento na árvore do navegador.
        trilho.innerHTML = listaEtapas.map(etapa => { // [Dev Sênior] Inicia a listagem gerando os botões lado a lado reativamente.
            const estaAtiva = eta.id === dadosLocais.status || etapa.id === dadosLocais.status; // [Dev Sênior] Validação lógica se a fase analisada corresponds à coluna real do cliente.
            return `<button class="btn-trilho-etapa-filho" data-id="${etapa.id}" style="flex: 1; min-width: 140px; padding: 8px 12px; border: none; border-radius: 4px; font-size: 12px; font-weight: bold; cursor: pointer; transition: all 0.2s; text-align: center; white-space: nowrap; background-color: ${estaAtiva ? '#2563eb' : '#ffffff'}; color: ${estaAtiva ? '#ffffff' : '#475569'}; box-shadow: ${estaAtiva ? '0 2px 4px rgba(37,99,235,0.2)' : '0 1px 2px rgba(0,0,0,0.05)'}; border: 1px solid ${estaAtiva ? '#2563eb' : '#cbd5e1'};">${estaAtiva ? '🔵 ' : ''}${etapa.nome}</button>`; // [Dev Sênior] Retorna o design do botão ajustando cores azuis ou brancas em tempo de execução.
        }).join(''); // [Dev Sênior] Consolida os botões na string HTML unificada.

        trilho.querySelectorAll('.btn-trilho-etapa-filho').forEach(btn => { // [Dev Sênior] Captura as setas desenhadas e injeta os monitores de cliques individuais.
            btn.addEventListener('click', (e) => { // [Dev Sênior] Intercepta a ação do mouse mudando a etapa do pipeline.
                const idClicado = e.currentTarget.getAttribute('data-id'); // [Dev Sênior] Resgata o ID eletrônico da coluna clicada.
                const nomeClicado = e.currentTarget.innerText.replace('🔵 ', '').trim(); // [Dev Sênior] Coleta o nome limpo para fins de auditoria inalterável.
                if (dadosLocais.status === idClicado) return; // [Dev Sênior] Ignora o clique se o operador selecionou a fase em que o card já se encontra paralisado.
                
                const agora = new Date(); // [Dev Sênior] Registra o relógio interno no exato milissegundo da transição.
                const carimbo = `${agora.toLocaleDateString('pt-BR')} às ${agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`; // [Dev Sênior] Carimbo nacional estruturado.
                dadosLocais.historicoNotas.push({ conteudo: `Victor alterou a etapa para ${nomeClicado}`, dataHora: carimbo }); // [Dev Sênior] Injeta automaticamente a auditoria idêntica aos CRMs do mercado de topo.
                
                dadosLocais.status = idClicado; // [Dev Sênior] Altera o status local provisório da cobrança.
                desenharTrilhoSuperior(); // [Dev Sênior] Força o redeseho magnético imediato das cores das setas superiores.
                checarAbaPropostaExibicao(); // [Dev Sênior] Verifica se a aba da calculadora de propostas deve aparecer ou sumir na hora.
            });
        });
    };

    const checarAbaPropostaExibicao = () => { // [Dev Sênior] Controla de forma inteligente quando a aba Proposta tem permissão técnica de aparecer na interface.
        if (dadosLocais.status === 'negociacao' || dadosLocais.status === 'acordo' || dadosLocais.status === 'finalizado') { 
            tabProposta.style.display = 'block'; // [Dev Sênior] Torna o botão da aba proposta ativo no topo direito.
        } else { 
            tabProposta.style.display = 'none'; // [Dev Sênior] Oculta e esconde a aba caso o card retroceda para notificações, contato ou início de funil.
            if (abaAtiva === 'proposta') { 
                abaAtiva = 'tarefas'; // [Dev Sênior] Reseta o ponteiro de navegação para tarefas salvaguardando a integridade da tela.
                redefinirEstiloAbas(); 
            } 
        } 
        atualizarAbasDireita(); // [Dev Sênior] Recarrega os componentes visuais internos do lado direito reativamente.
    };

    document.getElementById('btn-fechar-gestao-topo').addEventListener('click', () => { elementoContainer.innerHTML = ''; }); // [Dev Sênior] Destrói e limpa a janela descartando rascunhos locais provisórios.

    dadosCliente.renderizar(document.getElementById('coluna-esquerda-dados'), dadosLocais, (id, pacoteSincronizado) => {
        if (pacoteSincronizado && pacoteSincronizado.proposta && pacoteSincronizado.status === 'negociacao') {
            const relogio = new Date(); // [Dev Sênior] Captura a minutagem de salvamento.
            const carimboProposta = `${relogio.toLocaleDateString('pt-BR')} às ${relogio.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
            const totalSimulado = (pacoteSincronizado.proposta.valorCobrado || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
            
            dadosLocais.historicoNotas.push({
                conteudo: `Proposta de acordo simulada no valor final de R$ ${totalSimulado} em ${pacoteSincronizado.proposta.qtdParcelas}x via ${pacoteSincronizado.proposta.tipoPagamento}`,
                dataHora: carimboProposta
            });
            pacoteSincronizado.historicoNotas = dadosLocais.historicoNotas; // [Dev Sênior] Sincroniza a linha do tempo atualizada no pacote final.
        }
        callbackAtualizarGeral(id, pacoteSincronizado); // [Dev Sênior] Repassa o pacote unificado para gravação definitiva na nuvem do Firebase.
    }, () => { elementoContainer.innerHTML = ''; }); // [Dev Sênior] Dispara o desenho do sub-módulo esquerdo focado em dados cadastrais e botões de salvar.
    
    [tabTarefas, tabAnotacoes, tabProposta].forEach(aba => { // [Dev Sênior] Varre as três abas de navegação injetando os chaveamentos automáticos.
        aba.addEventListener('click', (e) => { // [Dev Sênior] Monitora qual o botão de controle de abas o operador clicou no visor direito.
            const tipo = e.target.id.replace('tab-', ''); // [Dev Sênior] Coleta o nome eletrônico limpo da aba desejada.
            if (abaAtiva === tipo) return; // [Dev Sênior] Cancela a operação se o operador clicou na aba que já está em exibição ativa.
            abaAtiva = tipo; // [Dev Sênior] Modifica o ponteiro de navegação.
            redefinirEstiloAbas(); // [Dev Sênior] Atualiza os realces de cor azul nos botões.
            atualizarAbasDireita(); // [Dev Sênior] Plotagem reativa imediata do miolo do arquivo-filho correspondente.
        });
    });

    desenharTrilhoSuperior(); // [Dev Sênior] Inicializa a geração visual das setas dinâmicas do funil no topo do modal.
    checarAbaPropostaExibicao(); // [Dev Sênior] Executa o crivo de segurança exibindo ou ocultando a aba Proposta na abertura da tela.
  } // [Dev Sênior] Encerra a função principal de renderização da moldura mestre.
}; // [Dev Sênior] Encerra a exportação do objeto estrutural modular de gestão.