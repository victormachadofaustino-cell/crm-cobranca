import { dbService } from "../services/dbService"; // Importa o serviço de banco de dados para podermos salvar as melhorias na nuvem.

// CONTROLADOR DE OUVIDORIA: Define e exporta o submódulo responsável por intermediar os chamados de melhorias entre a tela e o Firebase.
export const suporteVisao = {

  // O DESPACHANTE DE SUGESTÕES: Função assíncrona que prepara o chamado e envia para gravação permanente na nuvem.
  async enviarNovaMelhoria(dadosFormulario, usuarioLogado) {
    
    const agora = new Date(); // Captura o relógio interno do computador no exato segundo do clique de envio.
    const dataCarimbo = agora.toLocaleDateString('pt-BR'); // Formata o dia no padrão nacional DD/MM/AAAA.
    const horaCarimbo = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); // Filtra o relógio para trazer apenas as horas e minutos.

    // Monta o pacote de dados rico e auditável que será gravado no banco de dados.
    const chamadoMelhoriaEstruturado = {
      titulo: dadosFormulario.titulo.trim(), // Captura o título da ideia limpando espaços vazios nas pontas.
      modulo: dadosFormulario.modulo, // Registra qual setor do sistema o usuário quer evoluir (CRM, Acordos ou Dash).
      descricao: dadosFormulario.descricao.trim(), // Captura o texto detalhado da sugestão do operador.
      
      // Dados de rastreabilidade de governança (Quem pediu e quando pediu).
      autorNome: usuarioLogado.nome, // Grava o nome de quem abriu o chamado para você saber quem gerou a ideia.
      autorEmail: usuarioLogado.email, // Salva o e-mail corporativo para auditoria de segurança.
      dataCriacao: `${dataCarimbo} às ${horaCarimbo}`, // Cria o texto legível de data e hora (Ex: 31/05/2026 às 23:15).
      
      // FLUXO DE VIDA DO PRODUTO: Todo chamado nasce obrigatoriamente aguardando a sua análise como dono do software.
      statusProgresso: 'analise', // Status iniciais de fábrica: 'analise', 'aprovado' ou 'implementado'.
      respostaGestao: '' // Espaço em branco que fica reservado para você escrever um feedback para o seu funcionário depois.
    };

    try {
      // INTERAÇÃO COM O BANCO: Ordena ao dbService que jogue esse objeto para dentro de uma gaveta nova chamada 'melhorias'.
      // Nota: Esta função assume que seu dbService possui ou herdará um método dinâmico de salvamento genérico por coleção.
      await dbService.salvarDocumentoGenerico('melhorias', chamadoMelhoriaEstruturado);
      
      alert('Sua sugestão de melhoria foi enviada direto para o Roadmap do Gestor! Obrigado por evoluir o CRM. 🚀');
      return true; // Retorna verdadeiro avisando a tela que o processo deu certo e o formulário já pode ser limpo.
    } catch (error) {
      console.error('[Erro no Suporte] Falha ao registrar sugestão no Firebase:', error);
      alert('⚠️ Falha técnica ao salvar seu chamado na nuvem. Tente novamente em instantes.');
      return false; // Retorna falso informando que houve um travamento na rede.
    }
  },

  // O VIGIA DA CAIXA DE SUGESTÕES: Liga um monitor em tempo real para listar as melhorias na tela do usuário conforme o banco muda.
  escutarListaMelhorias(usuarioLogado, callbackAtualizarTela) {
    
    // Aciona a escuta em tempo real na coleção de chamados do Firebase.
    // Nota: Mapeia o ouvinte nativo do Firebase para trazer as atualizações reativas na hora.
    return dbService.escutarColecaoGenerica('melhorias', (listaBrutaChamados) => {
      
      if (!listaBrutaChamados) return callbackAtualizarTela([]); // Se a gaveta estiver deserta, devolve uma lista vazia para a tela não quebrar.

      // REGRA DE PRIVACIDADE E FILTRO: Se o usuário logado for um operador comum, ele só vê as ideias que ele mesmo criou.
      // Se for você (Victor Faustino), o sistema libera a visão master e exibe o feedback de toda a equipe para gerenciamento!
      const ehAdmin = usuarioLogado.nome.toLowerCase().includes('victor') || usuarioLogado.email.toLowerCase().includes('admin');
      
      const chamadosFiltrados = listaBrutaChamados.filter(chamado => {
        if (ehAdmin) return true; // O administrador quebra a barreira e enxerga 100% das sugestões do time.
        return chamado.autorEmail === usuarioLogado.email; // O funcionário comum só enxerga o histórico dos seus próprios chamados.
      });

      // Ordena a exibição colocando os chamados mais novos no topo da lista.
      chamadosFiltrados.sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));

      callbackAtualizarTela(chamadosFiltrados); // Despacha a lista filtrada e organizada de volta para o componente visual desenhar as linhas.
    });
  }
};