import { Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 py-8">
        <p className="text-sm text-muted-foreground">
          Made by <span className="font-semibold text-foreground">Anuj Sharma</span>
        </p>
        <div className="flex items-center gap-3">
          <a
            href="https://www.linkedin.com/in/anuj-sharma-537a403aa"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href="https://x.com/AnujSharma6767"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Twitter / X"
          >
            <Twitter className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
