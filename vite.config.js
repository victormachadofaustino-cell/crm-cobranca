import { defineConfig } from 'vite'; // -> Importa a ferramenta de configuração nativa do Vite[cite: 444].
import react from '@vitejs/plugin-react'; // -> Importa o tradutor oficial do React para o Vite conseguir ler arquivos .jsx.

export default defineConfig({ // -> Exporta as configurações oficiais do servidor[cite: 444].
  plugins: [react()], // -> Ativa o plugin do React para o sistema aceitar a nova arquitetura de componentes.
  server: { // -> Abre o bloco de instruções do servidor local.
    port: 3000 // -> Mantém o seu CRM rodando fixo na porta de rede número 3000.
  } // -> Encerra o bloco do servidor[cite: 446].
}); // -> Encerra a estrutura de configuração[cite: 446].