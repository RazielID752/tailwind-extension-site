import Image from "next/image";

import { siteConfig } from "@/app/content";

export function Brand() {
  return (
    <a
      href="#inicio"
      className="brand"
      aria-label="Tailwind Inspector — início"
    >
      <Image
        src={siteConfig.logo}
        alt=""
        width={238}
        height={46}
        priority
      />
    </a>
  );
}
