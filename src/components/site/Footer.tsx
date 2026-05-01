import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="font-display text-lg font-bold">Sameh Naim</div>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Freelance Moodle developer & full-stack engineer building LMS
            solutions for schools and universities.
          </p>
          <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            Cairo, Egypt
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold">Sitemap</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Home</Link></li>
            <li><Link to="/projects" className="hover:text-foreground">Projects</Link></li>
            <li><Link to="/plugins" className="hover:text-foreground">Plugins</Link></li>
            <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold">Connect</div>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <a href="mailto:hello@samehnaim.dev" className="inline-flex items-center gap-2 hover:text-foreground">
              <Mail className="h-4 w-4" />
              <span>hello@samehnaim.dev</span>
            </a>
            <a href="https://github.com/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-foreground">
              <Github className="h-4 w-4" /> GitHub
            </a>
            <a href="https://linkedin.com/in/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-foreground">
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Sameh Naim. Built with TanStack Start.
      </div>
    </footer>
  );
}
