# Hover do menu desktop

## Objetivo

Fazer cada link da navegação principal mudar da cor neutra para o `accent-color` ciano quando o ponteiro estiver sobre ele em uma tela desktop.

## Causa identificada

O utilitário `hover:text-accent` do Tailwind CSS 4 é compilado dentro de `@media (hover: hover)`. Quando o navegador não corresponde a essa media query, a regra de cor não é aplicada, mesmo que o ponteiro possa ser usado sobre a página.

## Solução

- Aplicar uma classe semântica somente aos links da navegação principal.
- Definir o estado `:hover` dessa classe diretamente em `app/globals.css`, usando `var(--cyan)` para manter o token visual existente.
- Preservar a transição de cor atual.
- Manter o menu mobile, o CTA e o rodapé sem mudanças.

## Alternativas consideradas

1. **CSS direto (escolhida):** comportamento pequeno, previsível e independente da media query gerada pelo Tailwind.
2. **Manter `hover:text-accent`:** menor alteração, mas conserva a condição que impede o efeito no ambiente relatado.
3. **Estado React com eventos do mouse:** funcionaria, porém acrescentaria estado e handlers desnecessários para um efeito puramente visual.

## Acessibilidade

O foco por teclado continuará usando o indicador global de `:focus-visible`. A mudança de cor no hover é apenas um reforço visual e não comunica estado essencial.

## Testes

- Criar primeiro um teste de regressão que exija a classe semântica nos links da navegação principal.
- Verificar que o teste falha antes da alteração e passa depois.
- Executar testes, lint, verificação de tipos e build.
- Validar o hover renderizado no desktop quando um navegador automatizado estiver disponível; nesta sessão, a conexão com o navegador integrado não está disponível.
