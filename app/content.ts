export const siteConfig = {
  name: "Tailwind Inspector",
  storeUrl: "#suporte",
  logo: "/tailwind-Inspector-logo.png",
  heroImage: "/Extensao-devtools-tailwind.png",
  workflowImage: "/Imagem-raw-1717x916.png",
} as const;

export const navigation = [
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Recursos", href: "#recursos" },
  { label: "Privacidade", href: "#privacidade" },
  { label: "Suporte", href: "#suporte" },
] as const;

export const howSteps = [
  {
    number: "01",
    title: "Selecione",
    description:
      "Escolha qualquer elemento no painel Elements do Chrome DevTools.",
  },
  {
    number: "02",
    title: "Experimente",
    description:
      "Filtre, adicione e ajuste utilitários com feedback imediato na página.",
  },
  {
    number: "03",
    title: "Copie ou restaure",
    description:
      "Leve o resultado para o projeto ou retorne às classes originais em um clique.",
  },
] as const;

export const featureGroups = [
  {
    title: "Classes sob controle",
    description: "Trabalhe com a lista completa sem perder contexto.",
    items: [
      "Filtre rapidamente as classes do elemento selecionado.",
      "Cole e edite várias classes de uma vez.",
      "Adicione, edite, remova ou desative classes temporariamente.",
      "Identifique conflitos como p-4 e p-8 antes da substituição.",
    ],
  },
  {
    title: "Layouts sem tentativa e erro",
    description: "Transforme decisões de layout em controles diretos.",
    items: [
      "Ajuste Flex e Grid por meio de controles visuais.",
      "Aplique breakpoints e variantes como md, hover, focus e dark.",
      "Simule estados com o botão :hov.",
      "Consulte o Box Model e os estilos CSS computados.",
    ],
  },
  {
    title: "Um fluxo que não perde seu trabalho",
    description:
      "Experimente com segurança e leve apenas o resultado final.",
    items: [
      "Use Undo, Redo ou restaure as classes originais.",
      "Copie como classes, className ou atributo HTML.",
      "Salve classes favoritas, recentes e snippets.",
      "Visualize cada alteração imediatamente na página inspecionada.",
    ],
  },
] as const;

export const privacyPoints = [
  "Sem coleta, venda, compartilhamento ou envio de dados para servidores externos.",
  "Sem analytics, telemetria, anúncios, serviços externos ou código remoto.",
  "Favoritos, recentes e snippets permanecem no chrome.storage.local.",
  "Alterações temporárias desaparecem ao restaurar, recarregar ou encerrar a sessão.",
] as const;
