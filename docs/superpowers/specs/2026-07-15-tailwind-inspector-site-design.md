# Tailwind Inspector — Especificação do site institucional

## Objetivo

Criar uma landing page institucional em português do Brasil para apresentar a extensão Tailwind Inspector, explicar seu funcionamento e suas garantias de privacidade, direcionar o usuário à Chrome Web Store e receber solicitações de suporte por e-mail.

O site será hospedado na Vercel e deve evitar infraestrutura adicional: não haverá banco de dados, Redis, armazenamento de solicitações ou serviço de rate limiting. O envio de e-mail será realizado pelo Resend em uma Vercel Function acionada sob demanda.

## Contexto técnico existente

- Next.js 16.2.10 com App Router em `app/` e sem diretório `src/`.
- React 19.2.4.
- TypeScript em modo `strict`.
- Tailwind CSS 4 configurado com `@tailwindcss/postcss`.
- Vitest 4.1.10 e Lucide React 1.24.0 instalados.
- Zod, Resend, React Testing Library, `@testing-library/jest-dom`, `@testing-library/user-event` e ambiente DOM de teste ainda não instalados.
- Há mudanças locais do usuário em `app/layout.tsx`, `app/page.tsx`, `app/favicon.ico`, `package.json`, `pnpm-lock.yaml` e `public/tailwind-Inspector-logo.png`. Elas devem ser preservadas e incorporadas apenas quando fizerem parte direta do site.
- Não será feito downgrade de dependências nem substituição desnecessária das configurações existentes.

## Nome e posicionamento

O nome oficial é **Tailwind Inspector**. Ocorrências de “Tailwind Inspecto” devem ser corrigidas.

Descrição principal:

> Tailwind Inspector melhora a experiência de testar e ajustar classes Tailwind CSS diretamente no Chrome DevTools. O usuário seleciona qualquer elemento no painel Elements para visualizar suas classes, experimentar utilitários e acompanhar as mudanças imediatamente na página, sem alterar o código-fonte durante cada tentativa.

## Arquitetura

`app/page.tsx` será um Server Component responsável por compor a landing page. A interface será dividida em componentes com responsabilidade única para cabeçalho, hero, demonstração, fluxo de uso, recursos, preview de classes não compiladas, privacidade, suporte e rodapé.

Textos recorrentes, caminhos de imagens e links serão centralizados em constantes tipadas. O caminho do logo, futuros screenshots e a URL da Chrome Web Store poderão ser substituídos sem alterações estruturais. Como a URL da loja ainda não foi definida, os CTAs de instalação apontarão temporariamente para `#suporte`, com o valor centralizado em uma constante.

O formulário será um Client Component e utilizará `useActionState` para enviar `FormData` a uma Server Action. A ação validará a entrada e delegará o envio a um serviço de suporte isolado. O schema Zod, a composição do e-mail e a integração com o Resend ficarão em módulos separados e testáveis.

## Estrutura visual e conteúdo

A direção aprovada é **Precisão DevTools**:

- fundo principal próximo de preto e superfícies em grafite;
- branco nos textos principais e cinza nos textos secundários;
- ciano e azul como cores funcionais;
- bordas finas e brilho ciano restrito à demonstração principal;
- tipografia Inter já configurada no projeto, com apoio de fonte monoespaçada do sistema em trechos técnicos;
- ícones exclusivamente do Lucide React;
- animações pequenas e funcionais, desativadas ou reduzidas com `prefers-reduced-motion`;
- layout responsivo em uma coluna nas telas menores, sem rolagem horizontal.

### Seções

1. **Cabeçalho:** logo horizontal existente, navegação por âncoras para recursos, privacidade e suporte, além do CTA de instalação.
2. **Hero:** mensagem “Teste classes Tailwind. Veja o resultado agora.”, texto de apoio, CTA principal e link para “Como funciona”. À direita, uma simulação acessível do painel do DevTools; o componente também aceitará um caminho de screenshot futuro.
3. **Como funciona:** três etapas — selecionar um elemento, experimentar classes e copiar ou restaurar o resultado.
4. **Recursos:** conteúdo agrupado por fluxo de trabalho para evitar excesso de cards.
5. **Classes não compiladas:** explicação dedicada ao preview temporário, seu escopo controlado e sua remoção ao restaurar ou recarregar.
6. **Segurança e privacidade:** declaração técnica ampla com garantias verificáveis.
7. **Suporte:** texto contextual e garantias à esquerda, formulário à direita.
8. **Rodapé:** marca, navegação resumida e declaração curta de privacidade.

### Recursos divulgados

- Adicionar, editar, remover ou desativar classes temporariamente.
- Filtrar classes do elemento selecionado.
- Colar e editar várias classes de uma vez.
- Visualizar alterações imediatamente na página inspecionada.
- Identificar conflitos, como `p-4` e `p-8`, antes da substituição.
- Ajustar Flex e Grid por controles visuais.
- Aplicar breakpoints e variantes como `md`, `hover`, `focus` e `dark`.
- Simular estados com o botão `:hov`.
- Usar Undo, Redo ou restaurar classes originais.
- Consultar Box Model e estilos CSS computados.
- Copiar o resultado como classes, `className` ou atributo HTML.
- Salvar classes favoritas, recentes e snippets.

### Preview de classes não compiladas

Quando uma classe não estiver presente no CSS compilado, a extensão poderá gerar uma regra temporária para um conjunto controlado de utilitários comuns e valores arbitrários validados. Esse CSS será isolado no elemento selecionado, não alterará arquivos do projeto e será removido ao restaurar a sessão ou recarregar a página.

## Privacidade da extensão

O site comunicará apenas as garantias fornecidas:

- funcionamento local no navegador;
- ausência de coleta, venda, compartilhamento ou envio de dados para servidores externos;
- ausência de analytics, telemetria, anúncios, serviços externos e código remoto;
- acesso somente ao elemento selecionado no DevTools e às informações CSS necessárias;
- preferências, favoritos e snippets armazenados em `chrome.storage.local`;
- alterações temporárias removidas ao restaurar o elemento, recarregar a página ou encerrar a sessão do DevTools;
- permissões usadas exclusivamente para páginas HTTP, HTTPS e arquivos locais autorizados, para aplicar previews, detectar navegações e copiar resultados mediante ação do usuário;
- páginas internas do Chrome não são acessadas.

Essas garantias se referem à extensão. O formulário de suporte transmitirá ao Resend os dados que o próprio usuário decidir enviar, e essa diferença será explicitada junto ao formulário.

## Formulário de suporte

### Campos

- `name`: nome, entre 2 e 80 caracteres.
- `email`: e-mail válido, com no máximo 254 caracteres.
- `subject`: assunto, entre 5 e 120 caracteres.
- `category`: uma das opções `question`, `problem`, `suggestion` ou `other`, exibidas em português.
- `message`: mensagem, entre 20 e 5.000 caracteres.
- `website`: honeypot visualmente oculto, que deve permanecer vazio.
- `startedAt`: instante gerado ao montar o formulário; submissões realizadas em menos de 2 segundos serão rejeitadas como automação.

### Variáveis de ambiente

- `RESEND_API_KEY`: chave do Resend, obrigatória.
- `SUPPORT_EMAIL`: destinatário Gmail, obrigatório.
- `RESEND_FROM_EMAIL`: remetente verificado; quando ausente, usar `Tailwind Inspector <onboarding@resend.dev>` como fallback de desenvolvimento.

Um arquivo `.env.example` documentará as três variáveis sem conter valores secretos.

### Fluxo de envio

1. O Client Component entrega `FormData` à Server Action.
2. A ação converte apenas campos conhecidos, normaliza strings e valida tudo com Zod.
3. Honeypot preenchido ou submissão em tempo incompatível com uso humano retornam uma resposta genérica sem chamar o Resend.
4. O serviço verifica as variáveis de ambiente e compõe um e-mail em texto simples.
5. O Resend envia para `SUPPORT_EMAIL`, usando o e-mail informado pelo usuário em `replyTo`.
6. Sucesso limpa o formulário e apresenta confirmação. Falha mantém os dados não sensíveis necessários para correção e apresenta uma mensagem genérica.
7. Nenhuma solicitação é persistida pela aplicação.

### Segurança e acessibilidade

- Validação no servidor é obrigatória; validação nativa no cliente melhora apenas a experiência.
- Limites de tamanho reduzem abuso e consumo inesperado da função.
- E-mail em texto simples evita interpolação de HTML não confiável.
- Nenhum segredo ou detalhe de erro do Resend é retornado ao navegador.
- Erros de campo usam `aria-describedby`; feedback geral usa `aria-live`.
- O botão mostra estado pendente e fica desabilitado durante o envio.
- Labels visíveis, foco destacado, áreas de clique adequadas e contraste compatível com WCAG AA.
- Não haverá rate limiting em memória, pois ele é inconsistente entre instâncias serverless. Uma camada distribuída poderá ser adicionada apenas se houver abuso real.

## SEO e desempenho

- `Metadata` do Next.js com título, descrição, Open Graph, Twitter Card e palavras-chave coerentes.
- HTML semântico com um único `h1`, landmarks, headings hierárquicos e links descritivos.
- Imagens locais via `next/image` com dimensões, texto alternativo e carregamento prioritário apenas para conteúdo acima da dobra.
- Maioria da página renderizada no servidor; JavaScript cliente limitado ao formulário.
- Sem bibliotecas de animação ou formulário.
- Assets e constantes preparados para receber screenshots futuros.

## Estratégia de testes

- Testes unitários do schema para campos válidos, limites, e-mail inválido, categoria desconhecida e campos anti-spam.
- Testes da composição do e-mail para conteúdo, destinatário, `replyTo` e ausência de HTML.
- Testes do serviço Resend para sucesso, falha do provedor e configuração ausente.
- Testes da Server Action para validação, spam, sucesso e erro de envio.
- Testes do formulário com React Testing Library para labels, erros, envio pendente, confirmação e falha geral.
- Teste da landing page para conteúdo essencial, landmarks e CTAs.
- Verificações finais com toda a suíte Vitest, ESLint, TypeScript por meio do build e `next build`.
- Verificação visual em navegador local nos tamanhos desktop e mobile, incluindo console e navegação por teclado.

## Fora do escopo

- Publicação da extensão e URL definitiva da Chrome Web Store.
- Banco de dados ou histórico de tickets.
- Upload de anexos.
- Autenticação, painel administrativo ou sistema completo de tickets.
- Analytics ou telemetria do site.
- Serviço distribuído de rate limiting.
- Deploy e configuração de domínio na Vercel.
