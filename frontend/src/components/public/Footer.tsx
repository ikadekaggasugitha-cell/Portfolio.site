import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="public-footer bg-surface-container-low text-on-surface-variant py-12 px-gutter border-t border-outline-variant/20">
      <div className="max-w-container-max mx-auto">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,420px)_minmax(0,740px)] items-start">
          {/* Left column */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="text-sm font-mono tracking-[0.35em] uppercase text-primary">&lt;/&gt;</div>
              <div>
                <h2 className="font-headline-xl text-white">I Kadek Agga Sugitha</h2>
                <p className="mt-2 max-w-[44ch] text-body-lg text-on-surface-variant whitespace-normal break-words leading-relaxed">Passionate about building innovative digital solutions across web development, software engineering, data analytics, and emerging technologies.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant">
              <Link href="/admin/login" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                <span className="text-[18px]">👤</span>
                <span>Sign In</span>
              </Link>
              <span className="h-4 border-l border-outline-variant/40" />
              <span>© {year} Designed & Developed by Kadek Agga</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a href="#" className="social-icon w-12 h-12 rounded-xl border border-primary/40 bg-surface flex items-center justify-center text-primary transition-all hover:border-primary" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor"><path d="M12 .5C5.6.5.5 5.6.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.4-3.9-1.4-.5-1.2-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.6 1.1 1.6 1.1 1 .1 1.6.8 2 .9.1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.9 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.3 11.3 0 0 1 6 0c2.2-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.9 1.2 2 1.2 3.3 0 4.6-2.7 5.6-5.3 5.9.4.4.8 1 .8 2v3c0 .3.2.7.8.6C20.7 21.4 24 17.1 24 12c0-6.4-5.1-11.5-11.5-11.5z"/></svg>
              </a>
              <a href="#" className="social-icon w-12 h-12 rounded-xl border border-primary/40 bg-surface flex items-center justify-center text-primary transition-all hover:border-primary" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor"><path d="M4 4.5C4 3.7 4.7 3 5.5 3S7 3.7 7 4.5 6.3 6 5.5 6 4 5.3 4 4.5zM3 8.5h4v12H3v-12zm7 0h3.8v1.6h.1c.5-.9 1.8-1.8 3.6-1.8 3.8 0 4.5 2.5 4.5 5.8V20.5H17V14c0-1.5 0-3.4-2-3.4-2 0-2 1.4-2 3.3v6.6H10V8.5z"/></svg>
              </a>
              <a href="#" className="social-icon w-12 h-12 rounded-xl border border-primary/40 bg-surface flex items-center justify-center text-primary transition-all hover:border-primary" aria-label="Email">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="6" width="18" height="12" rx="2" />
                  <path d="M3 8.5L12 13L21 8.5" />
                </svg>
              </a>
              <a href="#" className="social-icon w-12 h-12 rounded-xl border border-primary/40 bg-surface flex items-center justify-center text-primary transition-all hover:border-primary" aria-label="External">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor"><path d="M14 3h7v7M21 3L10 14"/></svg>
              </a>
            </div>
          </div>

          <div className="border-t border-outline-variant/10 pt-8 lg:border-t-0 lg:pt-0">
            <div className="mt-10 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:gap-6">
              <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-low p-6 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.03)] min-h-[138px]">
                <div className="text-2xl text-primary mb-3">🔒</div>
                <div className="font-semibold text-sm text-white mb-2">Secure & Reliable</div>
                <div className="text-sm text-on-surface-variant">Built with best practices</div>
              </div>
              <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-low p-6 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.03)] min-h-[138px]">
                <div className="text-2xl text-primary mb-3">⚡</div>
                <div className="font-semibold text-sm text-white mb-2">Fast Performance</div>
                <div className="text-sm text-on-surface-variant">Optimized for speed</div>
              </div>
              <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-low p-6 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.03)] min-h-[138px]">
                <div className="text-2xl text-primary mb-3">&lt;/&gt;</div>
                <div className="font-semibold text-sm text-white mb-2">Clean Code</div>
                <div className="text-sm text-on-surface-variant">Maintainable & scalable</div>
              </div>
              <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-low p-6 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.03)] min-h-[138px]">
                <div className="text-2xl text-primary mb-3">🚀</div>
                <div className="font-semibold text-sm text-white mb-2">Always Improving</div>
                <div className="text-sm text-on-surface-variant">Constantly learning & building</div>
              </div>
            </div>

            
          </div>
        </div>
      </div>

      <style jsx>{`
        .social-icon {
          box-shadow: 0 0 8px rgba(0,218,243,0.10);
          /* subtle constant glow */
        }

        @keyframes socialPulse {
          0% {
            box-shadow: 0 0 6px rgba(0,218,243,0.06);
            transform: translateY(0);
          }
          50% {
            box-shadow: 0 0 14px rgba(0,218,243,0.12);
            transform: translateY(-2px);
          }
          100% {
            box-shadow: 0 0 6px rgba(0,218,243,0.06);
            transform: translateY(0);
          }
        }

        .social-icon {
          animation: socialPulse 3.5s ease-in-out infinite;
        }

        /* reduce brightness on small screens to avoid overpowering the UI */
        @media (max-width: 768px) {
          .social-icon { box-shadow: 0 0 4px rgba(0,218,243,0.06); }
        }
      `}</style>
    </footer>
  )
}
