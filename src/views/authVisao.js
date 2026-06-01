import { auth } from "../config/firebase"; // Importa o motor de portaria oficial configurado com as chaves de acesso exclusivas do seu projeto Google Firebase.
import { 
  createUserWithEmailAndPassword, // Importa a ferramenta real e nativa do Google para registrar novos operadores no painel de Authentication[cite: 1677].
  signInWithEmailAndPassword, // Importa a ferramenta real e nativa do Google para validar e-mails e senhas cadastrados no momento da entrada[cite: 1678].
  updateProfile // Importa o recurso de segurança que permite gravar o nome completo do funcionário direto no prontuário da conta dele[cite: 1679].
} from "firebase/auth"; // Vincula com os pacotes oficiais de controle de acesso do Firebase enviados pela biblioteca[cite: 1680].

export const authVisao = { // Define e exporta o objeto de controle authVisao para que o arquivo mestre app.js consiga gerenciar o fluxo de login.
  
  // GERENTE DE PORTARIA REAL: Função assíncrona que conecta o formulário do CRM diretamente com os servidores de nuvem do Google Cloud[cite: 1682].
  async processarAutenticacao(dadosPacote, callbackSucessoLogin) { // Cria o método de processamento recebendo os dados brutos recolhidos do formulário e a ação de sucesso[cite: 1682, 1693].
    
    const { modo, email, senha, nome } = dadosPacote; // Isola o e-mail, a senha, o nome completo e o modo operacional recebidos do pacote de credenciais[cite: 1683].
    
    try { // Inicia o bloco de monitoramento seguro contra instabilidades de rede, falta de internet ou erros de digitação de senhas[cite: 1684].
      
      // ==========================================
      // 1. BLOCO DE CADASTRO REAL NA NUVEM DO GOOGLE
      // ==========================================
      if (modo === "cadastro") { // Se a variável de estado apontar para o modo de registro de novos operadores na mesa[cite: 1685].
        console.log("[Firebase Auth] Enviando comando de criacao para o e-mail: " + email); // Registra no console técnico do navegador o início do protocolo de registro[cite: 1685, 1686].
        
        // Dispara a criação da credencial criptografada direto no painel do seu Firebase Authentication na internet[cite: 1687].
        const credencialUsuarioNovo = await createUserWithEmailAndPassword(auth, email, senha); // Aguarda a resposta do servidor do Google criando o usuário[cite: 1688].
        
        if (nome && nome.trim() !== "") { // Se o operador informou o nome completo dele de forma válida dentro da caixa de digitação[cite: 1688].
          await updateProfile(credencialUsuarioNovo.user, { displayName: nome.trim() }); // Grava o nome real do funcionário dentro do perfil de segurança do Google[cite: 1689].
        } // Encerra o salvamento do nome de exibição[cite: 1690].

        alert("Conta comercial criada com sucesso! Efetuando seu primeiro acesso automatico..."); // Exibe o aviso de sucesso para o cobrador na interface da tela[cite: 1690, 1691].
        
        // FLUXO DE SESSÃO AUTOMÁTICA: Monta o objeto de sessão estável usando as informações reais recebidas e criadas na nuvem[cite: 1692].
        const nomeParaExibicao = nome || email.split("@")[0].toUpperCase(); // Fallback de governança: se não tiver nome salvo, extrai a primeira parte do e-mail[cite: 1693].
        const iniciaisCalculadas = nomeParaExibicao.split(" ").map(n => n[0]).join("").substring(0, 2); // Computa de forma automática as duas primeiras iniciais (Ex: Victor Faustino = VF)[cite: 1694].
        
        const operadorSessaoNovo = { // Estrutura o objeto de crachá oficial que controlará a sessão ativa do operador no CRM[cite: 1695].
          nome: nomeParaExibicao, // Grava o nome completo ou e-mail formatado do funcionário logado[cite: 1696].
          iniciais: iniciaisCalculadas, // Salva as iniciais automáticas calculadas para o círculo do perfil superior[cite: 1697].
          email: email, // Vincula o e-mail corporativo para auditoria de registros e cartões[cite: 1698].
          uid: credencialUsuarioNovo.user.uid // Resgata o código UID único e real gerado pelo Google para identificar esse usuário no banco de dados[cite: 1699].
        }; // Fecha o objeto estruturado de credenciais[cite: 1699].
        
        localStorage.setItem("crm_sessao_operador_logado", JSON.stringify(operadorSessaoNovo)); // Guarda o crachá de sessão na memória cache interna do navegador para manter o acesso estável no F5[cite: 1700].
        callbackSucessoLogin(operadorSessaoNovo); // Dispara o gatilho do app.js que esconde a tela de login e abre o Kanban com as permissões reais ativas[cite: 1701].
        return; // Encerra a execução do bloco de cadastro com sucesso absoluto[cite: 1701, 1702].
      } // Encerra a condicional de cadastro[cite: 1702].
      
      // ==========================================
      // 2. BLOCO DE LOGIN REAL CONTRA O AUTHENTICATION
      // ==========================================
      if (modo === "login") { // Se a variável apontar que o usuário deseja efetuar a entrada comum no sistema[cite: 1702].
        console.log("[Firebase Auth] Validando chaves de acesso para: " + email); // Registra o início do protocolo de login no painel técnico de desenvolvimento[cite: 1702, 1703].
        
        // Envia o e-mail e a senha digitados para conferência rigorosa dentro do servidor do Firebase Authentication[cite: 1704].
        const credencialLoginReal = await signInWithEmailAndPassword(auth, email, senha); // Aguarda a verificação de chaves do servidor[cite: 1705].

        const nomeDoPerfilGoogle = credencialLoginReal.user.displayName; // Resgata o nome completo do funcionário que deixamos guardado lá no cadastro do Google[cite: 1705, 1706].
        const nomeParaExibicao = nomeDoPerfilGoogle || email.split("@")[0].toUpperCase(); // Se o perfil do Google estiver sem nome salvo, extrai as letras iniciais do e-mail corporativo[cite: 1706, 1707].
        const iniciaisCalculadas = nomeParaExibicao.split(" ").map(n => n[0]).join("").substring(0, 2); // Computa as duas iniciais de perfil para a barra superior e avatares[cite: 1708].
        
        const operadorSessaoAutenticado = { // Estrutura o objeto de governança estável da sessão atual aceita pelo sistema[cite: 1709].
          nome: nomeParaExibicao, // Vincula o nome real resgatado do perfil ou e-mail[cite: 1710].
          iniciais: iniciaisCalculadas, // Vincula as iniciais calculadas de perfil de usuário[cite: 1710].
          email: email, // Vincula o e-mail oficial autenticado no sistema[cite: 1711].
          uid: credencialLoginReal.user.uid // Vincula o ID único real do operador logado para liberar as travas e regras do Firestore[cite: 1711].
        }; // Fecha o objeto estruturado de login[cite: 1712].

        localStorage.setItem("crm_sessao_operador_logado", JSON.stringify(operadorSessaoAutenticado)); // Salva o crachá de segurança na gaveta local do cache do navegador para evitar deslogar no F5[cite: 1712].
        callbackSucessoLogin(operadorSessaoAutenticado); // Dispara o callback avisando o arquivo maestro app.js de que a entrada foi aceita e validada[cite: 1712, 1713].
      } // Encerra a condicional de login[cite: 1714].

    } catch (error) { // CAPTURA DE ERROS DE CRÉDITO DO GOOGLE: Ativado caso a senha falhe, o e-mail não exista ou ocorra queda de sinal de internet[cite: 1714].
      console.error("[Erro de Autenticacao] Falha real na comunicacao com o Google:", error); // Escreve a pilha técnica do erro de engenharia no console secreto[cite: 1715, 1716].
      
      // TRATAMENTO PREMIUM DE UX: Traduz as siglas cruas de erro do Google para mensagens explicativas em português amigável[cite: 1717].
      let mensagemAmigavel = "Falha critica ao conectar com o servidor de autenticacao!"; // Mensagem padrão de segurança corporativa[cite: 1718].
      
      if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") { // Filtro para senhas incorretas ou dados incompatíveis no cofre[cite: 1719].
        mensagemAmigavel = "⚠️ Senha de seguranca incorreta ou credenciais invalidas! Verifique os caracteres."; // Alerta explicativo de senha inválida[cite: 1720].
      } else if (error.code === "auth/user-not-found") { // Filtro para e-mails inexistentes no cadastro da nuvem[cite: 1721].
        mensagemAmigavel = "⚠️ Este e-mail corporativo nao consta no cadastro de operadores!"; // Alerta de usuário inexistente[cite: 1722].
      } else if (error.code === "auth/email-already-in-use") { // Filtro para e-mails duplicados no banco de dados[cite: 1723].
        mensagemAmigavel = "⚠️ Este e-mail ja esta registrado em outra carteira ativa deste CRM!"; // Alerta de e-mail duplicado[cite: 1724].
      } else if (error.code === "auth/invalid-email") { // Filtro para erros estruturais de digitação do e-mail[cite: 1725].
        mensagemAmigavel = "⚠️ O formato do e-mail digitado e invalido! Use o padrao seuemail@empresa.com"; // Alerta de sintaxe incorreta[cite: 1726].
      } else if (error.code === "auth/weak-password") { // Filtro de força de chaves exigido pelo Firebase[cite: 1727].
        mensagemAmigavel = "⚠️ Senha muito fraca! O Firebase exige no minimo 6 digitos para protecao da mesa."; // Alerta de restrição de tamanho de senha[cite: 1728].
      }

      alert(mensagemAmigavel); // Dispara o balão de alerta notificando o motivo exato do bloqueio de portaria para o cobrador[cite: 1729].
    } // Encerra o bloco de tratamento de falhas[cite: 1730].
  }, // Encerra a lógica de processamento de autenticação[cite: 1730].
  
  // MOTOR VERIFICADOR DE SESSÕES ATIVAS: Função executada de maneira invisível no início do app.js para checar logins prévios[cite: 1731].
  checarSessaoExistente() { // Método de checagem automática[cite: 1732].
    const dadosSalvosLocalStorage = localStorage.getItem("crm_sessao_operador_logado"); // Tenta pescar o registro de sessão na memória cache do navegador[cite: 1732, 1733].
    if (dadosSalvosLocalStorage) { // Se o crachá eletrônico de login automático existir e for válido no cache da máquina[cite: 1734].
      return JSON.parse(dadosSalvosLocalStorage); // Converte o texto plano em objeto de dados e o entrega de volta para liberar as telas do CRM[cite: 1734, 1735].
    } // Encerra a validação do cache[cite: 1735, 1736].
    return null; // Retorna nulo obrigando o funcionário a passar pelo formulário de login no primeiro acesso à página[cite: 1736].
  }, // Encerra a checagem de sessão existente[cite: 1737].

  // GATILHO DE LOGOUT (DESCONEXÃO DEFINITIVA): Executado quando o funcionário clica em sair do sistema[cite: 1737].
  efetuarLogout() { // Método de encerramento de turnos[cite: 1738].
    localStorage.removeItem("crm_sessao_operador_logado"); // Varre o crachá eletrônico de segurança da memória local da máquina de vez[cite: 1738].
    location.reload(); // Recarrega a página inteira forçando as travas do HTML a fecharem o CRM e re-plotarem o formulário de acesso limpo[cite: 1738, 1739].
  } // Encerra a rotina de logout definitivo.
}; // Encerra a exportação do objeto de controle de autenticação authVisao.