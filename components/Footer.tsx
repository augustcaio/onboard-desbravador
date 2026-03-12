import { Github, Copyright } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Link 
            href="https://github.com/augustcaio" 
            className="flex items-center gap-1 hover:text-foreground transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="w-4 h-4" />
            Caio Augusto
          </Link>
          <span className="text-muted-foreground/50">|</span>
          <div className="flex items-center gap-1">
            <Copyright className="w-3 h-3" />
            <span>Direitos reservados {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
