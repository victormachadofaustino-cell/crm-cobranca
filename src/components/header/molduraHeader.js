import { menuNavegacao } from "./menuNavegacao"; // Importa o submódulo responsável por gerenciar e desenhar as abas textuais de navegação.
import { botoesAcao } from "./botoesAcao"; // Importa o submódulo responsável por gerenciar a engrenagem, o upload de planilha e o avatar do usuário.

export const headerComponent = { // Define e exporta o objeto do cabeçalho mestre para que o arquivo app.js consiga gerenciar o topo.
  renderizar(elementoHeader, usuarioLogado, callbackEngrenagem, callbackMenu, callbackAplicarFiltros) { // Cria a função mestre de renderização recebendo o contêiner do topo, dados de sessão e as ações de clique e filtros.
    
    // MONTAGEM DO ESQUELETO DE DUAS PONTAS: Desenha as duas caixas de ancoragem laterais e adiciona um botão elegante de Logout na ponta direita para governança.
    elementoHeader.innerHTML = `
      <div style="display: flex; align-items: center; gap: 30px;" id="casulo-navegacao-esquerda"></div> 
      <div style="display: flex; align-items: center; gap: 15px;" id="casulo-acoes-direita"></div> 
    `; // Monta o esqueleto base de duas pontas com Flexbox distribuindo as responsabilidades do cabeçalho.

    const containerEsquerdo = document.getElementById('casulo-navegacao-esquerda'); // Localiza o casulo esquerdo recém-criado na árvore do site para abrigar o menu de abas textuais.
    const containerDireito = document.getElementById('casulo-acoes-direita'); // Localiza o casulo direito recém-criado na árvore do site para receber os avatares e ferramentas.

    menuNavegacao.renderizar(containerEsquerdo, callbackMenu); // Dispara a injeção do fatiamento focado nas abas textuais do lado esquerdo (CRM, Acordos, Tarefas, Suporte).
    
    // AJUSTE DE INFRAESTRUTURA: Passa o quinto parâmetro de callback de filtros e os metadados do operador para o sub-componente direito ser acionado com total precisão.
    botoesAcao.renderizar(containerDireito, usuarioLogado, callbackEngrenagem, callbackMenu, callbackAplicarFiltros); // Dispara a injeção do fatiamento focado nos botões circulares, filtros e avatar do lado direito.
  } // Encerra a função mestre de renderização do componente de cabeçalho profissional modular.
}; // Encerra a exportação do objeto estrutural do componente header.