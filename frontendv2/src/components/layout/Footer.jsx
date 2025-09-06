import { Github, Linkedin, ArrowUp, Mail, MapPin, Phone } from "lucide-react";
import { NavLink } from "react-router-dom";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  const footerSections = {
    company: [
      // { label: "About Us", path: "/about" },
      // { label: "Our Mission", path: "/mission" },
      // { label: "Team", path: "/team" },
      // { label: "Careers", path: "/careers" },
    ],
    resources: [
      { label: "Documentation", path: "/docs" },
      { label: "About Us", path: "/about" },
      // { label: "User Guide", path: "/docs/guide" },
      // { label: "FAQ", path: "/faq" },
    ],
    support: [
      // { label: "Help Center", path: "/support" },
      // { label: "Contact Us", path: "/contact" },
      // { label: "System Status", path: "/status" },
      // { label: "Report Issue", path: "/report" },
    ],
    legal: [
      // { label: "Privacy Policy", path: "/privacy" },
      // { label: "Terms of Service", path: "/terms" },
      // { label: "Cookie Policy", path: "/cookies" },
      // { label: "GDPR", path: "/gdpr" },
    ],
  };

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="mx-auto px-6 py-6">
        {/* Main Footer Content */}
        <div className="flex items-center justify-between gap-8 mb-8">
          {/* Brand Section */}
          <div className="xl:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img src="/Logo.png" alt="Trackademy Logo" className="w-8 h-8" />
              <h3 className="text-xl font-bold text-foreground">Trackademy</h3>
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Empowering educational institutions with comprehensive tracking
              and management solutions for academic excellence.
            </p>
          </div>

          {/* Company Links
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerSections.company.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Resources Links */}
          <div className="xl:col-span-2">
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerSections.resources.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              {footerSections.support.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Legal Links
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerSections.legal.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Contact Info */}
          <div className="col-span-2 space-y-3">
            <h4 className="font-semibold text-foreground mb-4">Contact Us</h4>
            <div className="flex items-center space-x-3 text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span className="text-sm">trackademy.ldrp@gmail.com</span>
            </div>
            <div className="flex items-center space-x-3 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                LDRP Institute of Technology & Research,
                <br />
                Near KH-5, Sector-15, Gandhinagar - 382015.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-3">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-muted-foreground text-sm">
              © {currentYear} Trackademy. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-1">
              <span>Built with ❤️ by{` `}</span>
              <a
                href="https://github.com/slantie"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Kandarp Gajjar,
              </a>
              <a
                href="https://github.com/HarshDodiya1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Harsh Dodiya,
              </a>
              <a
                href="https://github.com/#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Parin Dave
              </a>
            </div>

            {/* Back to Top */}
            <div className="flex items-center space-x-2">
              <a
                href="https://github.com/slantie/Trackademy"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-2 rounded-lg bg-background hover:bg-muted border border-border hover:border-primary transition-all duration-300"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
              </a>
              <button
                onClick={scrollToTop}
                className="group flex items-center space-x-2 px-4 py-2 rounded-lg bg-background hover:bg-muted border border-border hover:border-primary transition-all duration-300"
                aria-label="Back to top"
              >
                <ArrowUp className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:-translate-y-0.5 transition-all duration-300" />
                <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300">
                  Back to Top
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
