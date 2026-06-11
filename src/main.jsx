import React from 'react'; // -> Traz a biblioteca mestre do React para permitir a leitura e interpretação da sintaxe de componentes .jsx.
import ReactDOM from 'react-dom/client'; // -> Puxa o assistente de engenharia do React especializado em gerenciar e renderizar elementos na tela do navegador.
// CORREÇÃO DE EXTENSÃO: Forçado o caminho relativo com ".jsx" explicitamente para o Vite não buscar o arquivo .js que foi descontinuado.
import App from './App.jsx'; // -> Conecta o novo cérebro central unificado App.jsx de forma direta e sem erros de leitura.

// -> EXECUTA A INJEÇÃO DE ARRANQUE: Captura a Div mestre "root" do index.html e acende o ecossistema do React ali dentro.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* CORREÇÃO DE COMENTÁRIO SÊNIOR: Envelopado o texto no formato de chaves e asteriscos para o interpretador JSX não dar crash de compilação. */}
    <App /> 
  </React.StrictMode>
);