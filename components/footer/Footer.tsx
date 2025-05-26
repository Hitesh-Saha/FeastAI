"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Pin } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 py-8 bg-base rounded-3xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Link href={"/"} className="flex gap-2 items-center">
              <img src={"/Logo.svg"} className="w-10 h-10" alt="FeastAI Logo" />
              <h2 className="text-2xl font-extrabold">FeastAI</h2>
            </Link>
            <p className="text-base-foreground/70">
              Discover delicious recipes powered by AI, customized to your
              ingredients and preferences.
            </p>
            <div className="mt-4">
              <ul className="flex gap-4 flex-wrap">
                <li>
                  <a
                    href="https://x.com/hiteshsaha03?s=21"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base-foreground/70 hover:text-base-foreground transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4l7.2 10.8L4 20h3.3l5.5-8.3 4.5 8.3h3.3L13.3 9.2 20 4h-3.3l-4.3 6.5L8 4H4z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/storm_charger_03?utm_source=qr&igsh=bjNid3Nwc3R5bHBw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base-foreground/70 hover:text-base-foreground transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/share/5eaAze6pxaP5bD6Q/?mibextid=qi2Omg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base-foreground/70 hover:text-base-foreground transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/Hitesh-Saha"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base-foreground/70 hover:text-base-foreground transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/hitesh-saha-5401671b3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base-foreground/70 hover:text-base-foreground transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href="https://medium.com/@HiteshSaha"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base-foreground/70 hover:text-base-foreground transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Legal</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="#"
                  className="text-base-foreground/70 hover:text-base-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-base-foreground/70 hover:text-base-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Get in Touch */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Get In Touch</h3>
            <ul className="space-y-4">
              <li className="text-base-foreground/70 flex items-center gap-2 text-md hover:text-base-foreground transition-colors">
                <Mail size={20} />
                <a href="mailto:hiteshsaha52@gmail.com">
                  hiteshsaha52@gmail.com
                </a>
              </li>
              <li className="text-base-foreground/70 flex items-center gap-2 text-md hover:text-base-foreground transition-colors">
                <Phone size={20} />
                <a href="tel:+917002479931">+91 (700) 247-9931</a>
              </li>
              <li className="text-base-foreground/70 flex items-center gap-2 text-md hover:text-base-foreground transition-colors">
                <Pin size={20} />
                <div>
                  <p>Whitefield</p>
                  <p>Bengaluru, IN 560066</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-base-secondary/60" />

        <div className="text-center text-base-foreground/70">
          <p>© {year} FeastAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
