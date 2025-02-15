"use client";

import ThemeToggle from "@/modules/Common/Components/RootLayout/_partials/ThemeToggle";
import Logo from "@/modules/Common/Components/RootLayout/_partials/Logo";

const QuestionnairesResponseHeader = () => {
  return (
    <header className="fixed right-0 top-0 z-20 border-b bg-background/95 backdrop-blur transition-[left] ease-linear left-0">
      <nav className="flex h-16 shrink-0 items-center gap-2 transition-[width] ease-linear px-4 justify-between">
        <Logo />
        <div className="flex items-center gap-5 md:gap-3">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default QuestionnairesResponseHeader;
