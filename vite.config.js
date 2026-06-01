import { defineConfig } from 'vite'; // Importa a ferramenta de configuração nativa do Vite para podermos gerenciar o nosso servidor de desenvolvimento

export default defineConfig({ // Exporta de forma oficial as configurações personalizadas que o nosso sistema vai usar para rodar localmente
  server: { // Abre o bloco de instruções e propriedades específicas para o comportamento do servidor local
    port: 3000     // Força o sistema do CRM a rodar fixo e bonitinho através da porta de rede número 3000 no seu navegador
  } // Encerra o bloco de instruções específicas do servidor local
}); // Encerra e fecha por completo a estrutura de configuração do Vite