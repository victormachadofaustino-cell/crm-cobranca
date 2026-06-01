export const authComponent = { // Define e exporta o objeto mestre responsável por gerenciar e desenhar visualmente a tela de Login e Registro do sistema.
  renderizar(containerAlvo, callbackAcaoConfirmar) { // Função principal que recebe o espaço físico do HTML e a ação que será disparada ao enviar os dados.
    
    if (!containerAlvo) return; // Trava de segurança: se o bloco onde o formulário deveria ser injetado sumiu da página, aborta a execução na hora para não dar erro.
    
    let modoAtual = "login"; // Variável de controle interno que memoriza se a tela deve mostrar o modo de entrada ("login") ou de criação de credenciais ("cadastro").

    const atualizarLayoutFormulario = () => { // Sub-rotina interna encarregada de apagar o bloco de tela e desenhar o formulário exato conforme o modo ativo.
      containerAlvo.innerHTML = ""; // Limpa completamente qualquer resíduo ou texto corrompido que estivesse dentro da div antes de desenhar.

      // DESIGN SPLIT SCREEN ABSOLUTO: Força o contêiner de autenticação a ocupar a tela inteira em formato flexível horizontal moderno.
      containerAlvo.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #0f172a; display: flex; z-index: 99999; font-family: system-ui, -apple-system, sans-serif; overflow: hidden; box-sizing: border-box;";

      // 1. LADO ESQUERDO: Painel de impacto visual com gradiente corporativo e mensagem de autoridade comercial.
      const painelEsquerdo = document.createElement("div"); // Fabrica o elemento estrutural da coluna esquerda.
      painelEsquerdo.style.cssText = "flex: 1; background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); display: flex; flex-direction: column; justify-content: center; padding: 60px; color: #ffffff; text-align: left; border-right: 1px solid #1e293b;"; // Aplica o gradiente azul escuro profundo.
      
      let htmlEsquerdo = ""; // Inicializa a string de montagem do lado esquerdo.
      htmlEsquerdo += "<div style=\"max-width: 500px;\">"; // Abre o limitador de largura do texto.
      htmlEsquerdo += "  <span style=\"color: #38bdf8; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 15px;\">SISTEMA CENTRAL DE COBRANCA</span>"; // Exibe a etiqueta de governança.
      htmlEsquerdo += "  <h1 style=\"font-size: 42px; font-weight: 900; line-height: 1.1; margin: 0 0 20px 0; color: #ffffff; letter-spacing: -1px;\">Recupere Ativos com Inteligencia e Governanca</h1>"; // Título de impacto do produto.
      htmlEsquerdo += "  <p style=\"font-size: 16px; color: #94a3b8; line-height: 1.6; margin: 0;\">Mesa operacional integrada para gerenciamento de recebiveis, simulacao de propostas, acordos reativos em lote e BI consolidado.</p>"; // Descrição executiva do CRM.
      htmlEsquerdo += "</div>"; // Fecha o limitador de largura.
      painelEsquerdo.innerHTML = htmlEsquerdo; // Injeta o texto estruturado no lado esquerdo.

      // 2. LADO DIREITO: Espaço minimalista onde o formulário real fica centralizado de forma elegante.
      const painelDireito = document.createElement("div"); // Fabrica o elemento estrutural da coluna direita.
      painelDireito.style.cssText = "flex: 1; background: #ffffff; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 60px; box-sizing: border-box; position: relative;"; // Configura o alinhamento centralizado do formulário.

      const formularioCasulo = document.createElement("div"); // Cria o contêiner interno restritivo para o formulário não esticar demais.
      formularioCasulo.style.cssText = "width: 100%; max-width: 360px; display: flex; flex-direction: column; gap: 24px;"; // Trava a largura máxima em 360px para harmonia visual.

      let tituloTexto = modoAtual === "login" ? "Acesso a Mesa" : "Criar Conta Nova"; // Escolhe condicionalmente o título principal que vai no topo da coluna.
      let subtituloTexto = modoAtual === "login" ? "Insira suas credenciais para entrar no CRM de cobranca" : "Cadastre seu operador para liberacao de chaves de carteiras"; // Escolhe o texto explicativo menor que fica abaixo do título.
      let botaoTexto = modoAtual === "login" ? "Entrar no Sistema" : "Concluir Cadastro Comercial"; // Define o texto descritivo que vai aparecer gravado dentro do botão de envio.
      let linkTexto = modoAtual === "login" ? "Não tem conta? Cadastre-se aqui" : "Já possui cadastro? Faça o login"; // Define a frase de navegação do link do rodapé.

      let htmlFormulario = ""; // Inicializa uma variável de texto vazia na memória para acumular os pedaços da estrutura do formulário de forma segura.
      
      // CONCATENAÇÃO RÍGIDA DO CABEÇALHO DO FORMULÁRIO
      htmlFormulario += "<div style=\"text-align: left; display: block; width: 100%;\">"; // Abre o bloco alinhado à esquerda.
      htmlFormulario += "  <h2 style=\"font-size: 30px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0; letter-spacing: -0.5px;\">" + tituloTexto + "</h2>"; // Injeta a tag de título principal com tipografia premium.
      htmlFormulario += "  <p style=\"font-size: 14px; color: #64748b; margin: 0; line-height: 1.4;\">" + subtituloTexto + "</p>"; // Injeta o parágrafo descritivo.
      htmlFormulario += "</div>"; // Fecha o contêiner do cabeçalho.

      htmlFormulario += "<form id=\"formulario-autenticacao-executivo\" style=\"display: flex; flex-direction: column; gap: 18px; width: 100%; margin: 0; padding: 0;\">"; // Inicia a tag mestre do formulário eletrônico.

      // CONDICIONAL DE CADASTRO: Injeta o campo de nome do operador se a variável de estado exigir o registro.
      if (modoAtual === "cadastro") { // Verifica se a variável de estado está apontando para o modo de registro de novos operadores.
        htmlFormulario += "  <div style=\"display: flex; flex-direction: column; text-align: left; width: 100%;\">"; // Abre o grupo de espaçamento do campo de nome.
        htmlFormulario += "    <label style=\"display: block; font-size: 11px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;\">Nome Completo do Operador</label>"; // Coloca a etiqueta permanente indicando o preenchimento do nome.
        htmlFormulario += "    <input type=\"text\" id=\"auth-nome-usuario\" required placeholder=\"Ex: Victor Faustino\" style=\"width: 100%; padding: 12px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; box-sizing: border-box; background: #f8fafc; color: #0f172a; outline: none; transition: all 0.2s;\">"; // Caixa de digitação do nome.
        htmlFormulario += "  </div>"; // Fecha o contêiner do campo de nome.
      } // Encerra o bloco condicional.

      // GRUPO DE ENTRADA (E-MAIL CORPORATIVO)
      htmlFormulario += "  <div style=\"display: flex; flex-direction: column; text-align: left; width: 100%;\">"; // Abre o grupo de espaçamento do campo de e-mail.
      htmlFormulario += "    <label style=\"display: block; font-size: 11px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;\">E-mail Corporativo</label>"; // Adiciona a etiqueta do e-mail de acesso.
      htmlFormulario += "    <input type=\"email\" id=\"auth-email\" required placeholder=\"seuemail@empresa.com\" style=\"width: 100%; padding: 12px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; box-sizing: border-box; background: #f8fafc; color: #0f172a; outline: none; transition: all 0.2s;\">"; // Caixa de digitação de e-mail.
      htmlFormulario += "  </div>"; // Fecha o contêiner do campo de e-mail.

      // GRUPO DE ENTRADA (SENHA DE SEGURANÇA) - CORRIGIDO CIRURGICAMENTE COM ESCAPE NO MINLENGTH
      htmlFormulario += "  <div style=\"display: flex; flex-direction: column; text-align: left; width: 100%;\">"; // Abre o grupo de espaçamento do campo de senha.
      htmlFormulario += "    <label style=\"display: block; font-size: 11px; font-weight: 700; color: #475569; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;\">Senha de Segurança</label>"; // Adiciona a etiqueta do campo de senha.
      htmlFormulario += "    <input type=\"password\" id=\"auth-senha\" required placeholder=\"Digite sua senha\" minlength=\"6\" style=\"width: 100%; padding: 12px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; box-sizing: border-box; background: #f8fafc; color: #0f172a; outline: none; transition: all 0.2s;\">"; // Caixa de digitação mascarada de senha.
      htmlFormulario += "  </div>"; // Encerra o contêiner do campo de senha.

      // BOTÃO DE ENVIO
      htmlFormulario += "  <button type=\"submit\" style=\"background: #2563eb; color: #ffffff; border: none; padding: 14px; border-radius: 8px; font-weight: 700; font-size: 14px; width: 100%; cursor: pointer; box-shadow: 0 4px 12px rgba(37,99,235,0.2); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 10px; transition: background 0.2s;\">" + botaoTexto + "</button>"; // Cria o botão azul com sombra sutil.

      // LINK DE ALTERNÂNCIA DE MODOS NO RODAPÉ
      htmlFormulario += "  <div style=\"text-align: center; margin-top: 15px; border-top: 1px solid #f1f5f9; padding-top: 20px; display: block; width: 100%;\">"; // Abre a gaveta do rodapé.
      htmlFormulario += "    <a href=\"#\" id=\"link-alternar-modo-auth\" style=\"font-size: 13px; color: #2563eb; font-weight: 600; text-decoration: none;\">" + linkTexto + "</a>"; // Link clicável azul de chaveamento de telas.
      htmlFormulario += "  </div>"; // Fecha o rodapé do cartão.

      htmlFormulario += "</form>"; // Fecha a tag mestre do formulário eletrônico.

      formularioCasulo.innerHTML = htmlFormulario; // Deságua a estrutura montada dentro do casulo de restrição de largura.
      painelDireito.appendChild(formularioCasulo); // Insere o casulo dentro do painel da direita.

      // Acopla os dois lados da tela (Esquerdo e Direito) no container principal ativo.
      containerAlvo.appendChild(painelEsquerdo);
      containerAlvo.appendChild(painelDireito); // Fixa na tela.

      // MICROINTERAÇÃO DE FOCO (HOVER) DINÂMICA
      const inputs = formularioCasulo.querySelectorAll("input"); // Seleciona os inputs de dados.
      inputs.forEach(input => { // Roda a varredura aplicando os efeitos de foco modernos.
        input.addEventListener("focus", () => {
          input.style.borderColor = "#2563eb";
          input.style.background = "#ffffff";
          input.style.boxShadow = "0 0 0 4px rgba(37,99,235,0.1)";
        });
        input.addEventListener("blur", () => {
          input.style.borderColor = "#cbd5e1";
          input.style.background = "#f8fafc";
          input.style.boxShadow = "none";
        });
      });

      // CAPTURA DO INTERRUPTOR VISUAL
      document.getElementById("link-alternar-modo-auth").addEventListener("click", (e) => { // Captura o clique no link do rodapé.
        e.preventDefault(); // Bloqueia recargas cegas na página.
        modoAtual = (modoAtual === "login") ? "cadastro" : "login"; // Inverte o ponteiro de estado na memória.
        atualizarLayoutFormulario(); // Executa o redesenho dinâmico imediato da tela.
      });

      // INTERCEPTADOR DE SUBMIT: Coleta e despacha o pacote final de credenciais para a visão
      document.getElementById("formulario-autenticacao-executivo").addEventListener("submit", (e) => { // Escuta o disparo do botão de confirmação.
        e.preventDefault(); // Impede o envio nativo da página para processamento seguro.

        const dadosPacote = { // Cria o objeto organizado extraindo as strings das caixas.
          modo: modoAtual, // Define o modo operacional.
          email: document.getElementById("auth-email").value.trim(), // Captura e-mail.
          senha: document.getElementById("auth-senha").value // Captura senha.
        }; // Fecha o pacote básico de credenciais.

        if (modoAtual === "cadastro") { // Anexa o nome informado se for uma operação de registro.
          dadosPacote.nome = document.getElementById("auth-nome-usuario").value.trim(); // Vincula o nome completo do operador ao pacote.
        } // Encerra a condicional.

        callbackAcaoConfirmar(dadosPacote); // Despacha o pacote estruturado diretamente para o gerente da visão tratar com o Firebase.
      }); // Encerra o ouvinte de envio.
    }; // Encerra la sub-rotina de redesenho.

    atualizarLayoutFormulario(); // Inicializa a montagem imediata da tela split na abertura do sistema.
  } // Encerra a função principal de renderização do componente.
}; // Encerra a exportação do objeto de controle authComponent.