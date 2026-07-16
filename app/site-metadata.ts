import type { Metadata } from "next";

const vercelUrl =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;

export const metadata: Metadata = {
  metadataBase: new URL(
    vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000",
  ),
  title: "Tailwind Inspector — Tailwind CSS direto no Chrome DevTools",
  description:
    "Teste, ajuste e copie classes Tailwind CSS diretamente no painel Elements do Chrome DevTools.",
  keywords: [
    "Tailwind CSS",
    "Chrome DevTools",
    "extensão Chrome",
    "frontend",
    "desenvolvimento web",
  ],
  applicationName: "Tailwind Inspector",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Tailwind Inspector",
    description:
      "Teste e ajuste classes Tailwind diretamente no Chrome DevTools.",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/Extensao-devtools-tailwind.png",
        width: 1536,
        height: 1024,
        alt: "Tailwind Inspector no Chrome DevTools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tailwind Inspector",
    description:
      "Teste e ajuste classes Tailwind diretamente no Chrome DevTools.",
    images: ["/Extensao-devtools-tailwind.png"],
  },
};
