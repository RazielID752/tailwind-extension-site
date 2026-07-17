import { readFileSync } from "node:fs";

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteHeader } from "@/app/components/site-header";

describe("hover do menu desktop", () => {
  it("aplica o accent-color diretamente aos links no hover", () => {
    render(<SiteHeader />);

    const navigation = screen.getByRole("navigation", {
      name: "Navegação principal",
    });
    const links = within(navigation).getAllByRole("link");
    const globalCss = readFileSync("app/globals.css", "utf8");

    expect(links).not.toHaveLength(0);
    links.forEach((link) => {
      expect(link).toHaveClass("desktop-nav-link");
    });
    expect(globalCss).toMatch(
      /\.desktop-nav-link:hover\s*{\s*color: var\(--cyan\);\s*}/,
    );
  });
});
