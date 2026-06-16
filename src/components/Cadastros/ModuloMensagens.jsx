import React, { useState, useRef } from "react"; // -> Importa as ferramentas essenciais do React (estados e referências de tela).
import { doc, updateDoc } from "firebase/firestore"; // -> Importa as funções para localizar documentos e atualizar dados no banco Firestore.
import { db } from "../../config/firebase"; // -> Importa a conexão activa com o seu banco de dados Firebase.
import { MessageSquare, Mail, Save, FileText, Smartphone, SlidersHorizontal } from "lucide-react"; // -> Importa os ícones visuais utilizados no cabeçalho e nos blocos da tela.

export default function ModuloMensagens({ etapasFunilExternas }) { // -> Declara o componente principal recebendo a lista de etapas vindas do componente pai.
  // -> Monitora qual etapa do Firebase está selecionada na mesa de edição
  const [etapaIdAtiva, setEtapaIdAtiva] = useState(""); // -> Cria o estado que armazena a ID da etapa do funil que o usuário selecionou no momento.
  
  // -> Estados locais para edição dos templates antes de arremessar para a nuvem
  const [templateWhats, setTemplateWhats] = useState(""); // -> Cria o estado que armazena temporariamente o texto digitado para o WhatsApp.
  const [templateEmail, setTemplateEmail] = useState(""); // -> Cria o estado que armazena temporariamente o texto digitado para o E-mail.
  const [salvando, setSalvando] = useState(false); // -> Cria o estado de carregamento que desativa o botão enquanto a gravação ocorre no banco de dados.

  // -> Referências físicas dos campos de texto para gerenciar a posição exata do cursor do mouse
  const campoWhatsRef = useRef(null); // -> Cria uma linha de controle direto com a caixa de texto do WhatsApp.
  const campoEmailRef = useRef(null); // -> Cria uma linha de controle direto com a caixa de texto do E-mail.
  const [ultimoCampoFocado, setUltimoCampoFocado] = useState("whats"); // -> Guarda a informação de qual foi o último campo em que o usuário clicou (whats ou email).

  // -> Localiza os dados da etapa selecionada para carregar nos inputs
  const etapaSelecionada = etapasFunilExternas.find(e => e.id === etapaIdAtiva); // -> Varre a lista de etapas procurando os dados daquela que está ativa na tela.

  // -> Gatilho acionado ao trocar de etapa no seletor dropdown
  const lidarComMudancaEtapa = (id) => { // -> Define a função executada sempre que o usuário troca a etapa no seletor do topo.
    setEtapaIdAtiva(id); // -> Grava a nova ID selecionada no estado da aplicação.
    const alvo = etapasFunilExternas.find(e => e.id === id); // -> Procura dentro da lista externa os dados textuais dessa nova etapa.
    if (alvo) { // -> Caso a etapa seja encontrada com sucesso:
      setTemplateWhats(alvo.templateWhats || ""); // -> Preenche o campo do WhatsApp com o texto que já estava salvo no banco de dados.
      setTemplateEmail(alvo.templateEmail || ""); // -> Preenche o campo do E-mail com o texto que já estava salvo no banco de dados.
    } else { // -> Caso seja a opção vazia:
      setTemplateWhats(""); // -> Limpa completamente a caixa de texto do WhatsApp.
      setTemplateEmail(""); // -> Limpa completamente a caixa de texto do E-mail.
    }
  }; // -> Encerra a lógica de troca de etapas.

  // -> FUNÇÃO INJETORA: Insere a tag automaticamente onde o cursor do usuário estava piscando
  const injetarTagNaMensagem = (tag) => { // -> Declara a função que processa o clique no botão da biblioteca de variáveis.
    const campoAlvo = ultimoCampoFocado === "whats" ? campoWhatsRef.current : campoEmailRef.current; // -> Identifica qual caixa de texto receberá a tag com base no último clique.
    const textoAlvo = ultimoCampoFocado === "whats" ? templateWhats : templateEmail; // -> Captura o texto que já existe dentro dessa respectiva caixa.
    const setTextoAlvo = ultimoCampoFocado === "whats" ? setTemplateWhats : setTemplateEmail; // -> Seleciona a função de atualização correspondente à caixa ativa.

    if (!campoAlvo) return; // -> Interrompe a execução caso o campo físico ainda não tenha sido renderizado na tela.

    const posicaoInicio = campoAlvo.selectionStart; // -> Descobre a exata posição inicial onde o cursor estava piscando.
    const posicaoFim = campoAlvo.selectionEnd; // -> Descobre a posição final da seleção de texto (caso o usuário tenha selecionado uma palavra).

    const novoTexto = textoAlvo.substring(0, posicaoInicio) + tag + textoAlvo.substring(posicaoFim, textoAlvo.length); // -> Recorta o texto original e solda a tag exatamente no meio dele.

    setTextoAlvo(novoTexto); // -> Atualiza a tela com o novo texto contendo a tag injetada.

    setTimeout(() => { // -> Executa um pequeno atraso de milissegundos para dar tempo do React renderizar o novo texto.
      campoAlvo.focus(); // -> Devolve o foco visual para o campo onde o usuário estava digitando.
      campoAlvo.selectionStart = campoAlvo.selectionEnd = posicaoInicio + tag.length; // -> Move o cursor piscante para logo após a tag recém-inserida.
    }, 10); // -> Tempo fixado em 10 milissegundos para garantir fluidez visual.
  }; // -> Encerra a lógica do mecanismo injetor de variáveis.

  // -> MOTOR DE GRAVAÇÃO NoSQL: Atualiza a matriz de etapas dentro do documento padrão
  const salvarConfiguracaoMensagem = async () => { // -> Inicia a função assíncrona que faz o envio seguro das informações para a internet.
    if (!etapaIdAtiva) { // -> Verifica se o usuário não esqueceu de selecionar uma etapa válida.
      alert("⚠️ ERRO: Selecione uma etapa antes de salvar."); // -> Exibe um alerta visual avisando que nenhuma operação pode ocorrer sem uma etapa selecionada.
      return; // -> Para a execução da função imediatamente.
    }

    try { // -> Abre o bloco de proteção contra erros de rede ou quedas de sinal de internet.
      setSalvando(true); // -> Modifica o estado de salvamento para congelar as interações do botão e evitar cliques duplicados.
      
      // -> Reconstroi o array de etapas injetando os novos templates de forma cirúrgica
      const etapasAtualizadas = etapasFunilExternas.map((etapa) => { // -> Percorre linha por linha a lista original de etapas enviadas ao componente.
        if (etapa.id === etapaIdAtiva) { // -> Encontra a linha específica da etapa que o usuário acabou de modificar.
          return { // -> Devolve todos os dados daquela etapa substituindo apenas os templates de texto.
            ...etapa, // -> Copia todos os dados originais e fixos da etapa (como nome, ordem e cor).
            templateWhats: templateWhats, // -> Grava o novo texto parametrizado do WhatsApp.
            templateEmail: templateEmail // -> Grava o novo texto parametrizado do E-mail.
          }; // -> Finaliza o objeto da etapa atualizada.
        }
        return etapa; // -> Caso não seja a etapa editada, devolve ela intacta sem nenhuma alteração.
      }); // -> Encerra a varredura e reconstrução da nova lista.

      // -> Aponta a mira física e executa o updateDoc no esqueleto do funil padrão
      const funilDocRef = doc(db, "config_funil", "padrao"); // -> Localiza a coleção 'config_funil' e o documento de ID 'padrao' dentro do Firestore.
      await updateDoc(funilDocRef, { // -> Faz a chamada de gravação enviando os novos dados estruturados ao servidor.
        etapas: etapasAtualizadas // -> Substitui o array de etapas antigo pela nova lista que contém os textos configurados.
      }); // -> Aguarda a resposta positiva do servidor da Google.

      alert("🟩 SUCESSO!\nRégua de mensagens atualizada na nuvem Google."); // -> Dispara um aviso na tela confirmando que os dados foram gravados de forma permanente.
    } catch (err) { // -> Caso aconteça algum erro de conexão, permissão ou internet:
      console.error(err); // -> Registra detalhadamente o erro técnico no console do navegador do programador.
      alert("🚨 Falha de rede ou privilégio ao gravar templates no Firestore!"); // -> Mostra um aviso amigável ao usuário informando que a operação falhou.
    } finally { // -> Bloco executado obrigatoriamente tanto se der certo quanto se der errado:
      setSalvando(false); // -> Descongela o botão de salvar, permitindo novas tentativas de clique.
    }
  }; // -> Encerra a lógica do motor de gravação.

  return ( // -> Inicia a montagem visual da estrutura HTML que o usuário enxergará na tela.
    <div style={{ maxWidth: "1400px", margin: "20px auto", padding: "0 20px", boxSizing: "border-box", fontFamily: "sans-serif" }}> {/* -> Container externo principal com limite de largura e centralizado */}
      <div style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}> {/* -> Caixa branca de fundo que engloba todo o painel interno com bordas arredondadas */}
        
        {/* CABEÇALHO INSTITUCIONAL */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "15px" }}> {/* -> Linha horizontal do cabeçalho com espaçamento entre o ícone e os títulos */}
          <SlidersHorizontal style={{ color: "#0f172a" }} size={22} /> {/* -> Desenha o ícone de engrenagens/ajustes no formato de controle manual de réguas */}
          <div> {/* -> Agrupador dos textos de título e descrição */}
            <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#1e293b", margin: 0 }}>Régua de Cobrança &amp; Mensagens Automáticas</h2> {/* -> Título principal em negrito escuro */}
            <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0 0" }}>Configure os gatilhos e templates de texto que serão disparados por etapa do funil.</p> {/* -> Subtítulo explicativo com letras reduzidas */}
          </div> {/* -> Fecha o agrupador de textos */}
        </div> {/* -> Fecha o bloco do cabeçalho */}

        {/* ETAPA 1: SELEÇÃO DA RAIA ATIVA */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", textAlign: "left", marginBottom: "25px", maxWidth: "400px" }}> {/* -> Bloco organizador do seletor alinhado verticalmente */}
          <label style={{ fontSize: "12px", fontWeight: "bold", color: "#475569" }}>Selecione a Etapa do Funil para Parametrizar:</label> {/* -> Rótulo explicativo para instruir a ação do usuário */}
          <select // -> Caixa de seleção dinâmica do sistema.
            value={etapaIdAtiva} // -> Vincula o valor visual do seletor ao estado de ID ativa controlado pelo React.
            onChange={(e) => lidarComMudancaEtapa(e.target.value)} // -> Dispara a troca de textos automáticos no instante em que o usuário clica em outra opção.
            style={{ padding: "10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px", fontWeight: "bold", color: "#0f172a", backgroundColor: "#f8fafc", cursor: "pointer", outline: "none" }} // -> Estilização da caixa com fundo claro e indicador de clique amigável.
          >
            <option value="">-- Escolha uma Etapa Ativa --</option> {/* -> Opção padrão exibida quando nenhuma linha do funil foi escolhida ainda */}
            {etapasFunilExternas.map((col) => ( // -> Realiza um laço de repetição mapeando todas as etapas disponíveis do banco de dados.
              <option key={col.id} value={col.id}>{col.nome.toUpperCase()} ({col.categoria.toUpperCase()})</option> // -> Renderiza uma linha de opção em letras maiúsculas contendo o nome e categoria da etapa.
            ))}
          </select> {/* -> Encerra o seletor html */}
        </div> {/* -> Fecha a seção da Etapa 1 */}

        {etapaIdAtiva ? ( // -> Operador condicional: Se existir uma etapa ativa, exibe o painel de montagem, senão exibe o aviso de espera.
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px" }}> {/* -> Divide o painel em duas colunas: uma maior para os textos e uma de 320px para as tags */}
            
            {/* FORMULÁRIO DE TEMPLATES */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}> {/* -> Coluna da esquerda organizada verticalmente para receber os blocos de mensagens */}
              
              {/* CANAL WHATSAPP */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}> {/* -> Agrupador vertical para o rótulo e caixa do WhatsApp */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}> {/* -> Linha do título do bloco combinando ícone e texto */}
                  <MessageSquare size={16} style={{ color: "#16a34a" }} /> {/* -> Ícone de balão de mensagem pintado na cor verde característica do WhatsApp */}
                  <label style={{ fontSize: "13px", fontWeight: "700", color: "#334155" }}>Template de Notificação - WhatsApp</label> {/* -> Texto indicador do canal */}
                </div> {/* -> Fecha a linha do título */}
                <textarea // -> Caixa de digitação de múltiplas linhas para a mensagem do WhatsApp.
                  ref={campoWhatsRef} // -> Conecta o elemento de texto físico à nossa referência do React para monitorar a posição do cursor.
                  value={templateWhats} // -> Vincula o texto exibido em tempo real ao estado do template do WhatsApp.
                  onChange={(e) => { // -> Abre a função de escuta a cada tecla digitada pelo usuário.
                    const pos = e.target.selectionStart; // -> Captura e memoriza a posição atual do cursor na caixa do WhatsApp antes da atualização de tela.
                    setTemplateWhats(e.target.value); // -> Salva os novos caracteres digitados dentro do estado correspondente.
                    setTimeout(() => { // -> Abre um agendador ultra rápido para fixar o cursor após a renderização do React.
                      if(campoWhatsRef.current) campoWhatsRef.current.selectionStart = campoWhatsRef.current.selectionEnd = pos; // -> Recoloca o cursor exatamente no mesmo lugar onde o usuário digitou, evitando saltos visuais.
                    }, 0); // -> Roda o temporizador de forma instantânea na fila de processamento.
                  }} // -> Encerra a lógica de digitação inteligente do WhatsApp.
                  onFocus={() => setUltimoCampoFocado("whats")} // -> Alerta o sistema que este campo está ativo e que qualquer tag clicada deve cair aqui dentro.
                  placeholder="Ex: Olá {cliente}, identificamos uma pendência no valor de {valor}. Responda para negociar." // -> Texto fantasma instrutivo de exemplo em segundo plano.
                  style={{ width: "100%", height: "120px", padding: "12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px", color: "#0f172a", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", outline: "none" }} // -> Estilo profissional de tamanho flexível verticalmente.
                />
              </div> {/* -> Fecha o agrupador do WhatsApp */}

              {/* CANAL E-MAIL */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}> {/* -> Agrupador vertical para o rótulo e caixa do E-mail */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}> {/* -> Linha do título do bloco combinando ícone e texto */}
                  <Mail size={16} style={{ color: "#2563eb" }} /> {/* -> Ícone de envelope pintado na cor azul característica de e-mails corporativos */}
                  <label style={{ fontSize: "13px", fontWeight: "700", color: "#334155" }}>Template de Notificação - Correio Eletrônico (E-mail)</label> {/* -> Texto indicador do canal */}
                </div> {/* -> Fecha a linha do título */}
                <textarea // -> Caixa de digitação de múltiplas linhas para a mensagem de E-mail.
                  ref={campoEmailRef} // -> Conecta o elemento de texto físico à nossa referência do React para monitorar a posição do cursor.
                  value={templateEmail} // -> Vincula o texto exibido em tempo real ao estado do template de E-mail.
                  onChange={(e) => { // -> Abre a função de escuta a cada tecla digitada pelo usuário no campo de e-mail.
                    const pos = e.target.selectionStart; // -> Memoriza com precisão milimétrica a posição do cursor na caixa do E-mail.
                    setTemplateEmail(e.target.value); // -> Transmite as modificações textuais para o estado interno do componente.
                    setTimeout(() => { // -> Dispara o agendador de estabilização do cursor.
                      if(campoEmailRef.current) campoEmailRef.current.selectionStart = campoEmailRef.current.selectionEnd = pos; // -> Trava e repõe o cursor do mouse na posição correta da digitação.
                    }, 0); // -> Roda o temporizador imediatamente sem atrasar a digitação.
                  }} // -> Encerra a lógica de digitação estável do E-mail.
                  onFocus={() => setUltimoCampoFocado("email")} // -> Alerta o sistema que este campo de e-mail está ativo e que qualquer tag clicada deve cair aqui.
                  placeholder="Ex: Prezado gestor da {cliente}, notificamos que o boleto com vencimento em..." // -> Texto fantasma instrutivo de exemplo em segundo plano.
                  style={{ width: "100%", height: "120px", padding: "12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px", color: "#0f172a", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", outline: "none" }} // -> Estilo profissional combinado com o design do bloco superior.
                />
              </div> {/* -> Fecha o agrupador do E-mail */}

              {/* BOTÃO SALVAR DA CONTROLADORIA */}
              <button // -> Elemento de ação para disparar a gravação física no banco de dados.
                type="button" // -> Define o comportamento fixo como botão comum de ação Javascript.
                onClick={salvarConfiguracaoMensagem} // -> Aponta o gatilho de clique para rodar o motor NoSQL de atualização.
                disabled={salvando} // -> Bloqueia o botão fisicamente caso a transação com o Firebase esteja em andamento.
                style={{ alignSelf: "flex-start", background: "#0f172a", color: "white", border: "none", padding: "12px 24px", borderRadius: "6px", fontWeight: "800", fontSize: "13px", cursor: salvando ? "not-allowed" : "pointer", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px", transition: "background 0.15s ease", opacity: salvando ? 0.7 : 1 }} // -> Layout moderno em tom escuro com efeitos de opacidade.
              >
                <Save size={14} /> {/* -> Desenha o ícone clássico de disquete ao lado do texto de ação */}
                {salvando ? "Salvando Alterações..." : "Gravar Régua na Nuvem"} {/* -> Altera o texto de forma inteligente indicando o andamento do processo */}
              </button> {/* -> Fecha o botão */}
            </div> {/* -> Fecha a coluna da esquerda */}

            {/* PAINEL LATERAL: VARIÁVEIS FISCAIS DISPONÍVEIS */}
            <div style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0", textAlign: "left" }}> {/* -> Caixa de fundo cinza claro que atua como barra lateral de utilidades */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}> {/* -> Cabeçalho da biblioteca unindo ícone e título menor */}
                <FileText size={14} style={{ color: "#64748b" }} /> {/* -> Ícone cinza representando documento de texto ou dicionário de dados */}
                <h4 style={{ fontSize: "12px", fontWeight: "800", color: "#475569", margin: 0, textTransform: "uppercase" }}>Tags Dinâmicas Disponíveis</h4> {/* -> Título da biblioteca formatado em caixa alta */}
              </div> {/* -> Fecha o cabeçalho interno */}
              <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 12px 0", lineHeight: "1.4" }}> {/* -> Pequeno manual de instruções rápido */}
                Clique sobre qualquer uma das chaves abaixo para injetá-la diretamente no ponto ativo do seu editor de texto: {/* -> Instrução direta para o usuário leigo saber o que fazer */}
              </p> {/* -> Fecha o parágrafo de instrução */}
              
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}> {/* -> Agrupador vertical dos botões interativos das variáveis */}
                
                {/* Botões clicáveis que injetam as variáveis dinamicamente usando a nova função */}
                <button // -> Inicia o botão interativo para a tag de cliente.
                  type="button" // -> Garante comportamento livre sem submeter formulários involuntariamente.
                  onClick={() => injetarTagNaMensagem("{cliente}")} // -> Dispara a inserção automatizada da chave {cliente} no cursor.
                  style={{ textAlign: "left", cursor: "pointer", background: "#ffffff", padding: "8px", borderRadius: "4px", border: "1px solid #e2e8f0", fontSize: "11px", color: "#0f172a", fontWeight: "600", transition: "background 0.2s" }} // -> Visual limpo imitando pequenas etiquetas de dados.
                >
                  <span style={{ color: "#2563eb" }}>{"{cliente}"}</span> ➔ Razão Social / PJ {/* -> Destaque visual colorido para a chave e seu significado técnico */}
                </button> {/* -> Fecha o botão */}

                <button // -> Inicia o botão interativo para a tag de código da conta.
                  type="button" // -> Garante comportamento livre sem submeter formulários.
                  onClick={() => injetarTagNaMensagem("{codigo}")} // -> Dispara a inserção automatizada da chave {codigo} no cursor.
                  style={{ textAlign: "left", cursor: "pointer", background: "#ffffff", padding: "8px", borderRadius: "4px", border: "1px solid #e2e8f0", fontSize: "11px", color: "#0f172a", fontWeight: "600", transition: "background 0.2s" }} // -> Mantém o mesmo padrão visual de etiquetas da lista.
                >
                  <span style={{ color: "#2563eb" }}>{"{codigo}"}</span> ➔ Código da Conta {/* -> Exibe o atalho para puxar o ID interno do contrato ou documento financeiro */}
                </button> {/* -> Fecha o botão */}

                <button // -> Inicia o botão interativo para a tag de valor total.
                  type="button" // -> Garante comportamento livre sem submeter formulários.
                  onClick={() => injetarTagNaMensagem("{valor}")} // -> Dispara a inserção automatizada da chave {valor} no cursor.
                  style={{ textAlign: "left", cursor: "pointer", background: "#ffffff", padding: "8px", borderRadius: "4px", border: "1px solid #e2e8f0", fontSize: "11px", color: "#0f172a", fontWeight: "600", transition: "background 0.2s" }} // -> Etiqueta de valor.
                >
                  <span style={{ color: "#2563eb" }}>{"{valor}"}</span> ➔ Saldo Devedor Total {/* -> Exibe o mapeamento do saldo monetário em atraso */}
                </button> {/* -> Fecha o botão */}

                <button // -> Inicia o botão interativo para a tag de representante legal.
                  type="button" // -> Garante comportamento livre sem submeter formulários.
                  onClick={() => injetarTagNaMensagem("{contato_nome}")} // -> Dispara a inserção automatizada da chave {contato_nome} no cursor.
                  style={{ textAlign: "left", cursor: "pointer", background: "#ffffff", padding: "8px", borderRadius: "4px", border: "1px solid #e2e8f0", fontSize: "11px", color: "#0f172a", fontWeight: "600", transition: "background 0.2s" }} // -> Etiqueta de contato.
                >
                  <span style={{ color: "#2563eb" }}>{"{contato_nome}"}</span> ➔ Representante Legal {/* -> Puxa o nome físico da pessoa responsável pelo setor de contas na empresa parceira */}
                </button> {/* -> Fecha o botão */}

                <button // -> Inicia o botão interativo para a tag do operador.
                  type="button" // -> Garante comportamento livre sem submeter formulários.
                  onClick={() => injetarTagNaMensagem("{responsavel}")} // -> Dispara a inserção automatizada da chave {responsavel} no cursor.
                  style={{ textAlign: "left", cursor: "pointer", background: "#ffffff", padding: "8px", borderRadius: "4px", border: "1px solid #e2e8f0", fontSize: "11px", color: "#0f172a", fontWeight: "600", transition: "background 0.2s" }} // -> Etiqueta de operador técnico.
                >
                  <span style={{ color: "#2563eb" }}>{"{responsavel}"}</span> ➔ Operador Cobrador {/* -> Resgata a assinatura do funcionário interno do CRM que está operando a carteira */}
                </button> {/* -> Fecha o botão */}

              </div> {/* -> Fecha o agrupador vertical de botões */}
            </div> {/* -> Fecha a barra lateral inteira de variáveis */}

          </div> // -> Fecha o grid de layout ativo.
        ) : ( // -> Bloco alternativo executado caso o usuário ainda não tenha selecionado uma etapa.
          <div style={{ padding: "40px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px dashed #cbd5e1", color: "#64748b", fontSize: "13px", fontWeight: "600" }}> {/* -> Caixa com borda pontilhada cinza indicando um estado vazio temporário */}
            💡 Aguardando seleção... Selecione uma etapa acima para liberar as réguas de comunicação. {/* -> Texto amigável de instrução inicial */}
          </div> // -> Fecha a caixa pontilhada de estado vazio.
        )}

      </div> {/* -> Fecha a caixa branca principal de fundo */}
    </div> // -> Fecha o container externo final.
  ); // -> Encerra o retorno de elementos visuais do React.
} // -> Encerra por completo a exportação do componente ModuloMensagens.