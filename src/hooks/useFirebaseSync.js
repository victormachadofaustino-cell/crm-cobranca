// [Dev Sênior] Hook customizado encarregado de encapsular e gerenciar todos os listeners em tempo real (onSnapshot) do Firebase. -> Importa recursos do React para gerenciar ciclos de vida e estados na memória do navegador.
import { useState, useEffect } from "react"; // -> Importa as ferramentas nativas do React para criar variáveis que atualizam a tela automaticamente (useState) e gerenciar eventos de inicialização (useEffect).
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"; // -> Importa os comandos oficiais do Firebase para selecionar coleções, escutar atualizações em tempo real, criar buscas e ordenar dados.
import { db } from "../config/firebase"; // -> Importa a conexão ativa e homologada com o banco de dados do Firestore da DOCULOC.

export const useFirebaseSync = () => { // -> Declara a função do hook customizado que centraliza e distribui todos os dados síncronos para o sistema.
    // === Estados Reativos do Banco de Dados === -> Comentário do desenvolvedor sênior demarcando a área de armazenamento temporário de dados em memória.
    const [dadosCobrancasGlobais, setDadosCobrancasGlobais] = useState([]); // -> Cria uma lista reativa vazia para guardar todas as cobranças ativas do sistema.
    const [empresas, setEmpresas] = useState([]); // -> Cria uma lista reativa vazia para guardar as empresas que serão listadas no módulo de cadastros.
    const [contatos, setContatos] = useState([]); // -> Cria uma lista reativa vazia para guardar as informações de contatos telefônicos e e-mails.
    const [segmentos, setSegmentos] = useState([]); // -> Cria uma lista reativa vazia para guardar as categorias ou nichos de mercado das empresas.
    const [vinculos, setVinculos] = useState([]); // -> Cria uma lista reativa vazia para registrar os relacionamentos entre contatos e empresas.
    const [configuracoesFunil, setConfiguracoesFunil] = useState(null); // -> Cria uma variável reativa (inicialmente nula) para armazenar as etapas do funil de cobrança.
    const [carregandoDados, setCarregandoDados] = useState(true); // -> Cria um indicador visual (verdadeiro/falso) para avisar o sistema se os dados ainda estão sendo baixados da nuvem.

    useEffect(() => { // -> Inicia um bloco de código isolado que roda automaticamente assim que a tela ou o sistema termina de carregar.
        setCarregandoDados(true); // -> Ativa o sinalizador de "carregando" para que o usuário veja um aviso visual na tela enquanto os dados não chegam.

        // 1. Sincronização em Tempo Real da Coleção de Cobranças (Ordenada por Vencimento) -> Comentário orientativo sobre o monitoramento do motor de finanças.
        const qCobrancas = query(collection(db, "cobrancas"), orderBy("vencimentoLiquido", "asc")); // -> Prepara uma consulta ao banco na gaveta "cobrancas", ordenando as contas da data mais próxima para a mais distante.
        const descadastrarCobrancas = onSnapshot(qCobrancas, (snapshot) => { // -> Abre um canal de comunicação permanente (rádio transmissor) com a tabela de cobranças no Firebase.
            const listaCobrancas = []; // -> Cria uma lista vazia na memória para organizar os dados que acabaram de chegar da nuvem.
            snapshot.forEach((doc) => { // -> Percorre linha por linha cada cobrança encontrada no banco de dados.
                listaCobrancas.push({ id: doc.id, ...doc.data() }); // -> Captura o código identificador único do documento e junta com as informações internas dele (valor, cliente, datas) inserindo na lista.
            }); // -> Encerra o laço de repetição que lê as linhas de cobranças.
            setDadosCobrancasGlobais(listaCobrancas); // -> Salva a lista completa e organizada dentro da variável de estado para atualizar os gráficos e relatórios na tela.
            setCarregandoDados(false); // Desativa o carregamento assim que o primeiro lote essencial chega -> Desliga o aviso visual de carregamento porque os dados financeiros principais já estão prontos.
        }, (erro) => { // -> Prepara uma função de contingência caso aconteça alguma falha ou falta de internet no canal de cobranças.
            console.error("Erro no listener de cobrancas:", erro); // -> Registra o erro técnico detalhado no painel de inspeção de código para análise dos desenvolvedores.
        }); // -> Encerra a configuração do transmissor de cobranças em tempo real.

        // 2. Sincronização em Tempo Real da Coleção de Empresas -> Monitor de atualização automática das informações de pessoas jurídicas (PJs).
        const descadastrarEmpresas = onSnapshot(collection(db, "cadastros_empresas"), (snapshot) => { // -> CORREÇÃO: Conecta o transmissor na gaveta certa ("cadastros_empresas"), capturando em tempo real a carga inserida via planilha.
            const listaEmpresas = []; // -> Cria uma lista temporária na memória RAM para estruturar as empresas encontradas.
            snapshot.forEach((doc) => { // -> Passa pente fino de linha em linha em todas as empresas importadas ou cadastradas manualmente.
                listaEmpresas.push({ id: doc.id, ...doc.data() }); // -> Pega o CNPJ (id) e todos os campos (nomeFantasia, razaoSocial, situacao) e joga no array de dados do React.
            }); // -> Finaliza a varredura das empresas atuais capturadas do banco.
            setEmpresas(listaEmpresas); // -> Alimenta a variável reativa oficial de empresas, fazendo com que a tabela na tela preencha na mesma hora.
        }, (erro) => console.error("Erro no listener de empresas:", erro)); // -> Trata possíveis falhas de segurança ou leitura no canal de empresas e joga no relatório de erros do console.

        // 3. Sincronização em Tempo Real da Coleção de Contatos -> Canal de escuta para novos telefones ou e-mails de devedores.
        const descadastrarContatos = onSnapshot(collection(db, "contatos"), (snapshot) => { // -> Cria o link de rádio permanente com a tabela NoSQL de contatos cadastrados.
            const listaContatos = []; // -> Cria um espaço limpo em memória para empilhar os contatos vindos do servidor.
            snapshot.forEach((doc) => { // -> Executa um loop que lê individualmente cada registro de contato armazenado na nuvem.
                listaContatos.push({ id: doc.id, ...doc.data() }); // -> Formata o registro adicionando o ID único junto com o número de telefone e nome do indivíduo.
            }); // -> Conclui a análise e formatação de todas as linhas de contato.
            setContatos(listaContatos); // -> Envia a lista tratada para o estado global do React, atualizando as telas de ligações e cobranças operacionais.
        }, (erro) => console.error("Erro no listener de contatos:", erro)); // -> Mostra no console técnico do navegador se houver falha de permissão no acesso aos contatos.

        // 4. Sincronização em Tempo Real da Coleção de Segmentos -> Gerenciador automático de filtros de mercado ou categorias empresariais.
        const descadastrarSegmentos = onSnapshot(collection(db, "segmentos"), (snapshot) => { // -> Abre um ouvinte fixo na coleção NoSQL que categoriza os tipos de empresas (Ex: Varejo, Saúde).
            const listaSegmentos = []; // -> Inicia um array temporário vazio para catalogar as categorias identificadas.
            snapshot.forEach((doc) => { // -> Roda por todos os itens cadastrados no painel administrativo de classificações.
                listaSegmentos.push({ id: doc.id, ...doc.data() }); // -> Insere na memória o nome do segmento e as configurações dele vinculadas ao ID.
            }); // -> Termina o processamento estruturado da listagem de nichos.
            setSegmentos(listaSegmentos); // -> Grava o catálogo de segmentos pronto nas variáveis visuais para abastecer os menus de seleção (Dropdowns) do sistema.
        }, (erro) => console.error("Erro no listener de segmentos:", erro)); // -> Registra alertas visuais ocultos se o banco negar acesso aos metadados de segmentos.

        // 5. Sincronização em Tempo Real da Coleção de Vínculos -> Amarrações de segurança NoSQL que associam pessoas físicas às suas respectivas PJs.
        const descadastrarVinculos = onSnapshot(collection(db, "vinculos"), (snapshot) => { // -> Estabelece conexão ao vivo com a tabela relacional de vínculos entre credores, empresas e devedores.
            const listaVinculos = []; // -> Estabelece um repositório volátil temporário para agrupar as conexões entre dados.
            snapshot.forEach((doc) => { // -> Visita cada par ou amarração de vínculo salvo na base NoSQL do projeto.
                listaVinculos.push({ id: doc.id, ...doc.data() }); // -> Mescla as referências estruturais de IDs com as chaves estrangeiras presentes no documento.
            }); // -> Finaliza a consolidação das dependências relacionais do banco.
            setVinculos(listaVinculos); // -> Salva a malha de vínculos atualizada na memória viva para cross-check instantâneo de segurança nas telas.
        }, (erro) => console.error("Erro no listener de vinculos:", erro)); // -> Intercepta problemas na sincronia relacional avisando o console administrativo.

        // 6. Sincronização em Tempo Real das Configurações do Funil (Pipeline/Etapas) -> Configurações visuais dos cards do CRM de cobranças.
        const descadastrarFunil = onSnapshot(collection(db, "configuracoes_funil"), (snapshot) => { // -> Sintoniza o front-end com os parâmetros estruturais das réguas de cobrança e colunas do Kanban.
            if (!snapshot.empty) { // -> Verifica se há pelo menos uma linha de configuração de funil ativa e cadastrada no banco de dados.
                // Captura o primeiro documento ativo com as definições de etapas -> Nota técnica do desenvolvedor explicando a prioridade de leitura.
                const docFunil = snapshot.docs[0]; // -> Seleciona a primeira parametrização válida de colunas encontrada no Firestore.
                setConfiguracoesFunil({ id: docFunil.id, ...docFunil.data() }); // -> Atualiza a ordem e nome das colunas do CRM (Ex: Novo, Notificado, Negociando) dinamicamente.
            } // -> Encerra o bloco de verificação de existência do funil.
        }, (erro) => console.error("Erro no listener de configuracoes_funil:", erro)); // -> Informa bugs estruturais caso o painel do Kanban falhe ao carregar layouts customizados.

        // [Dev Sênior] Função de limpeza (Cleanup): Desliga todos os gatilhos caso o componente seja desmontado, evitando vazamento de memória RAM (Memory Leaks). -> Trava de segurança que protege o computador do operador.
        return () => { // -> Devolve uma rotina de desligamento automática para o React usar quando o operador mudar de página no CRM.
            descadastrarCobrancas(); // -> Desliga o rádio transmissor das cobranças para parar de gastar internet e processamento em segundo plano.
            descadastrarEmpresas(); // -> Corta a transmissão contínua da lista de empresas para aliviar o consumo de memória RAM.
            descadastrarContatos(); // -> Encerra o monitoramento de contatos enquanto a tela de cadastros estiver fechada.
            descadastrarSegmentos(); // -> Fecha a escuta da listagem de categorias administrativas de mercado.
            descadastrarVinculos(); // -> Desativa o rastreador de amarrações e relacionamentos NoSQL.
            descadastrarFunil(); // -> Desconecta a escuta do layout do painel de etapas e réguas do funil.
        }; // -> Conclui o escopo de limpeza de conexões abertas do Firebase.
    }, []); // -> Define que todo esse ecossistema de listeners só será montado uma única vez na abertura do sistema.

    // Disponibiliza as listas em tempo real e o estado de carregamento global para consumo externo -> Entrega os dados empacotados para as telas visuais utilizarem.
    return { // -> Abre a caixa de exportação de dados do hook customizado.
        dadosCobrancasGlobais, // -> Entrega a lista de finanças/cobranças sempre fresca e sincronizada.
        empresas, // -> Entrega a lista correta extraída de "cadastros_empresas" pronta para preencher a tabela vazia.
        contatos, // -> Disponibiliza as fichas de telefonia e e-mails para os módulos de comunicação.
        segmentos, // -> Exporta as classificações comerciais para uso em relatórios e filtros em massa.
        vinculos, // -> Compartilha o mapeamento relacional entre entidades para as listagens de contatos corporativos.
        configuracoesFunil, // -> Disponibiliza o esqueleto de colunas atualizado do CRM.
        carregandoDados // -> Fornece a variável booleana para travar botões e exibir spinners visuais de carregamento enquanto houver sincronismo inicial.
    }; // -> Fecha o pacote de exportações do hook.
}; // -> Encerra definitivamente a declaração e o escopo do arquivo do hook de sincronização do Firebase.