import Image from "next/image";

import { siteConfig } from "@/app/content";

export function Brand() {
  return (
    <a
      href="#inicio"
      className="inline-flex shrink-0 items-center"
      aria-label="Tailwind Inspector — início"
    >
      <Image
        src={siteConfig.logo}
        alt=""
        width={238}
        height={46}
        priority
        className="h-auto w-[190px] sm:w-[210px]"
      />
    </a>
  );
}
