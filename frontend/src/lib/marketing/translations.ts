/**
 * Centralised, type-safe translations for the marketing surface.
 *
 * Every user-visible string lives here in both English and Indonesian so the
 * toggle can switch the entire site instantly without a round-trip. Content
 * that matches a known English default is swapped for the translated version;
 * live CMS data that doesn't match any default is shown as-is.
 *
 * Default language: **Indonesian** (`id`).
 */

export type Locale = 'en' | 'id'
export const DEFAULT_LOCALE: Locale = 'id'

/* -------------------------------------------------------------------------- */
/*  English                                                                    */
/* -------------------------------------------------------------------------- */

const en = {
  /* ---- Navigation ---- */
  nav: {
    home: 'Home',
    about: 'About',
    projects: 'Projects',
    contact: 'Contact',
    letsTalk: "Let's talk",
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },

  /* ---- Hero ---- */
  hero: {
    available: 'AVAILABLE FOR NEW WORK',
    headingPre: 'Full Stack Developer building ',
    headingAccent: 'reliable software',
    headingPost: ' — from web apps to backend systems.',
    viewWork: 'View my work',
    downloadCv: 'Download CV',
    intro:
      "Hi, I'm I Kadek Agga Sugitha — a Full Stack Developer who builds software end to end: web applications, REST APIs and backend services, databases, and the automation that ties them together.",
  },

  /* ---- About ---- */
  about: {
    eyebrow: '01 — About',
    lead: 'I build software that solves real problems — across web, backend, data and automation.',
    paragraphs: [
      "I'm an IT Full Stack Developer who works across the stack: web applications, backend services and APIs, database design, and the automation and tooling that keeps it all running smoothly. I care about the details that make software feel reliable — clean architecture, sensible data models, and interfaces people actually enjoy using.",
      'From designing PostgreSQL schemas and REST APIs to building responsive frontends and scripting deployment pipelines, I like owning a problem end to end rather than staying in one lane. Currently building internal platforms and public-facing products in the property-tech space.',
    ],
  },

  /* ---- Stats (labels only — values come from props/API) ---- */
  stats: {
    yearsShipping: 'Years shipping',
    projectsDelivered: 'Projects delivered',
    happyClients: 'Happy clients',
    onTimeDelivery: 'On-time delivery',
  },

  /* ---- What I Do ---- */
  whatIDo: {
    eyebrow: '02 — What I do',
    title: 'Software, end to end — not just websites',
    titleAccent: 'not just websites',
    subtitle:
      "A general-purpose Full Stack Developer's toolkit: the frontend is one part of a bigger picture.",
    capabilities: [
      {
        title: 'Web & Applications',
        description:
          'Responsive web apps, dashboards and internal tools built with React and Next.js.',
      },
      {
        title: 'Backend & APIs',
        description:
          'REST APIs and backend services with Node.js and Express — the systems that power the frontend.',
      },
      {
        title: 'Data & Databases',
        description:
          'Schema design and data modeling with PostgreSQL and MongoDB, built to stay maintainable as they grow.',
      },
      {
        title: 'Automation & DevOps',
        description:
          'CI/CD pipelines, Docker containers and scripts that keep deployment and maintenance painless.',
      },
    ],
  },

  /* ---- Skills ---- */
  skills: {
    eyebrow: '03 — Capabilities',
    title: 'A stack that covers the whole product',
    titleAccent: 'whole product',
    subtitle:
      'The tools I reach for daily — grouped by where they live in the stack.',
    // about-page variant
    aboutEyebrow: 'Toolkit',
    aboutTitle: 'Skills & tools',
    aboutTitleAccent: 'tools',
    aboutSubtitle:
      'The technologies I reach for day to day, grouped by where they live in the stack.',
  },

  /* ---- Work / Featured Projects ---- */
  work: {
    eyebrow: '04 — Selected work',
    title: "Things I've designed & shipped",
    subtitle:
      'A few representative projects. Open any card for a quick case study, or browse them all.',
  },

  /* ---- Testimonials ---- */
  testimonials: {
    eyebrow: '05 — Kind words',
    title: 'What collaborators say',
    quotes: [
      {
        name: 'Rina Dewanti',
        quote:
          'Agga delivered our platform ahead of schedule and the code was spotless. Rare to find someone equally strong on backend architecture and frontend polish.',
        title: 'Product Lead',
      },
      {
        name: 'Made Surya',
        quote:
          'The dashboard he built is fast, intuitive and still easy for our team to extend a year later. Exactly the kind of engineer you want owning a product.',
        title: 'CTO, PropTech Startup',
      },
      {
        name: 'Anita Kusuma',
        quote:
          'Communicative, detail-obsessed and genuinely cares about UX. Our conversion improved measurably after his rebuild.',
        title: 'Marketing Director',
      },
    ],
  },

  /* ---- Experience ---- */
  experience: {
    eyebrow: '06 — Experience',
    title: 'The road so far',
    // about-page variant
    aboutEyebrow: 'Career',
    aboutTitle: "Where I've worked",
    entries: [
      {
        period: '2023 — Present',
        role: 'Fullstack Software Engineer',
        company: 'Sinergi Investasi Properti',
        location: 'Jakarta, Indonesia',
        description:
          "Own the company's web platform end to end — a Next.js frontend backed by a custom CMS and admin dashboard. Built the content pipeline, media library and public site with a focus on speed and maintainability.",
      },
      {
        period: '2021 — 2023',
        role: 'Web Developer',
        company: 'Freelance & Agency Work',
        location: 'Remote',
        description:
          'Delivered 30+ client websites and web apps across e-commerce, dashboards and marketing sites. Introduced reusable component systems that cut delivery time significantly.',
      },
      {
        period: '2019 — 2021',
        role: 'Junior Software Engineer',
        company: 'Early career',
        location: 'Indonesia',
        description:
          'Cut my teeth building internal tools and REST APIs. Learned to ship, measure and iterate — and fell in love with the full stack.',
      },
    ],
  },

  /* ---- Contact (landing section) ---- */
  contact: {
    eyebrow: '07 — Contact',
    title: "Let's build something great together",
    titleAccent: 'great together',
    subtitle:
      'Have a project or role in mind? Send a message — I usually reply within a day.',
  },

  /* ---- Contact Form ---- */
  contactForm: {
    name: 'Name',
    email: 'Email',
    subject: 'Subject',
    message: 'Message',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'you@email.com',
    subjectPlaceholder: "What's this about?",
    messagePlaceholder: 'Tell me a bit about your project or role…',
    send: 'Send message',
    sending: 'Sending…',
    success: "Message sent — I'll reply within a day.",
    error: 'Something went wrong. Please email me directly instead.',
  },

  /* ---- Contact Page Hero ---- */
  contactPage: {
    eyebrow: 'Contact',
    heading: "Let's build something ",
    headingAccent: 'great together',
    subtitle:
      'Have a project, role or idea in mind? Tell me about it below — I usually reply within a day.',
    availableForWork: 'AVAILABLE FOR WORK',
  },

  /* ---- Contact Channels ---- */
  contactChannels: {
    email: 'Email',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    basedIn: 'Based in',
    viewMyCode: 'View my code',
    connectWithMe: 'Connect with me',
    remoteOk: 'Remote OK',
  },

  /* ---- Contact FAQ ---- */
  contactFaq: {
    eyebrow: 'FAQ',
    title: 'Frequently asked',
  },

  /* ---- CTA Band ---- */
  cta: {
    preferEmail: 'Prefer email?',
    reachMeDirectly: 'Reach me directly',
    notAFanOfForms:
      "Not a fan of forms? Drop me a line and I'll get straight back to you.",
    emailMe: 'Email me',
  },

  /* ---- About Page Hero ---- */
  aboutPage: {
    eyebrow: 'About me',
    availableForWork: 'AVAILABLE FOR WORK',
    getInTouch: 'Get in touch',
    downloadResume: 'Download résumé',
  },

  /* ---- Projects Page ---- */
  projectsPage: {
    eyebrow: 'Work',
    title: 'Projects & case studies',
    titleAccent: 'case studies',
    subtitle:
      "A collection of things I've designed, built and shipped. Search or filter by technology.",
    noMatch: 'No projects match your search',
    noPublished: 'No projects published yet',
    tryDifferent: 'Try a different keyword or clear the filters.',
    checkBack: 'Case studies are on the way — check back soon.',
    clearFilters: 'Clear filters',
    searchPlaceholder: 'Search projects by name, description or technology…',
    searchLabel: 'Search projects',
    filter: 'Filter',
    all: 'All',
    project: 'project',
    projects: 'projects',
    found: 'found',
    clear: 'Clear',
  },

  /* ---- Footer ---- */
  footer: {
    description:
      'Full Stack Developer building reliable software — web, backend and automation — from Jakarta, Indonesia.',
    navigate: 'Navigate',
    elsewhere: 'Elsewhere',
    downloadCv: 'Download CV',
    allRightsReserved: 'All rights reserved.',
  },

  /* ---- Education (about page) ---- */
  education: {
    eyebrow: 'Education',
    title: 'Academic background',
  },

  /* ---- Certificates (about page) ---- */
  certificates: {
    eyebrow: 'Credentials',
    title: 'Certifications',
    viewCredential: 'View credential',
  },

  /* ---- FAQ content ---- */
  faqs: [
    {
      q: 'What kind of projects do you take on?',
      a: "Web applications, dashboards, REST APIs, database design, and internal tooling or automation — not just websites. I'm happy to own a problem end to end or join an existing team on a specific piece of the stack.",
    },
    {
      q: 'Are you available for full-time roles?',
      a: "Yes — I'm open to full-time positions, contract work and freelance projects. Remote-first, and comfortable across time zones.",
    },
    {
      q: 'How do we get started?',
      a: "Send a message with a rough scope and timeline. I'll reply within a day to set up a quick call and share a plan.",
    },
  ],

  /* ---- Project content defaults ---- */
  projectsContent: [
    {
      id: 'portfolio-cms',
      title: 'Portfolio CMS Platform',
      summary:
        'A full personal-site platform: Next.js frontend, a custom admin dashboard, media library and content blocks — the system powering this very site.',
      detail:
        'A production content platform with a public Next.js site and a full admin CMS: profile, projects, skills, experience, media library and page builder. Built for speed (99 Lighthouse) and easy content editing without touching code.',
    },
    {
      id: 'analytics-dashboard',
      title: 'Realtime Analytics Dashboard',
      summary:
        'Live metrics dashboard with streaming charts, role-based access and sub-second updates over WebSockets.',
      detail:
        'A dashboard that ingests event streams and renders live KPIs with smooth, GPU-accelerated charts. Includes role-based access, saved views and CSV export. Backend on Node + Postgres with a WebSocket layer for realtime.',
    },
    {
      id: 'ecommerce-storefront',
      title: 'E-commerce Storefront',
      summary:
        'Headless storefront with cart, checkout and a Stripe-powered payment flow — optimized for conversion.',
      detail:
        'A conversion-focused headless commerce build: fast product pages, persistent cart and a streamlined Stripe checkout. Measurable lift in conversion after launch thanks to performance and UX work.',
    },
    {
      id: 'devops-toolkit',
      title: 'DevOps Automation Toolkit',
      summary:
        'CLI + dashboard to provision, deploy and monitor containerized services with one command.',
      detail:
        'Internal tooling that wraps Docker and AWS into a friendly CLI and dashboard: one command to provision, deploy and roll back services, with health monitoring and log streaming built in.',
    },
  ],
} as const

/* -------------------------------------------------------------------------- */
/*  Indonesian                                                                 */
/* -------------------------------------------------------------------------- */

const id = {
  nav: {
    home: 'Beranda',
    about: 'Tentang',
    projects: 'Proyek',
    contact: 'Kontak',
    letsTalk: 'Hubungi Saya',
    openMenu: 'Buka menu',
    closeMenu: 'Tutup menu',
  },

  hero: {
    available: 'TERSEDIA UNTUK PROYEK BARU',
    headingPre: 'Full Stack Developer membangun ',
    headingAccent: 'perangkat lunak andal',
    headingPost: ' — dari aplikasi web hingga sistem backend.',
    viewWork: 'Lihat karya saya',
    downloadCv: 'Unduh CV',
    intro:
      'Hai, saya I Kadek Agga Sugitha — seorang Full Stack Developer yang membangun perangkat lunak dari ujung ke ujung: aplikasi web, REST API dan layanan backend, database, serta otomasi yang menghubungkan semuanya.',
  },

  about: {
    eyebrow: '01 — Tentang',
    lead: 'Saya membangun perangkat lunak yang menyelesaikan masalah nyata — di seluruh web, backend, data, dan otomasi.',
    paragraphs: [
      'Saya seorang Full Stack Developer IT yang bekerja di seluruh stack: aplikasi web, layanan backend dan API, desain database, serta otomasi dan tooling yang menjaga semuanya berjalan lancar. Saya peduli dengan detail yang membuat perangkat lunak terasa andal — arsitektur yang bersih, model data yang masuk akal, dan antarmuka yang benar-benar dinikmati pengguna.',
      'Dari mendesain skema PostgreSQL dan REST API hingga membangun frontend yang responsif dan menyusun pipeline deployment, saya suka menyelesaikan masalah dari ujung ke ujung daripada hanya fokus di satu area. Saat ini sedang membangun platform internal dan produk publik di bidang property-tech.',
    ],
  },

  stats: {
    yearsShipping: 'Tahun pengalaman',
    projectsDelivered: 'Proyek selesai',
    happyClients: 'Klien puas',
    onTimeDelivery: 'Tepat waktu',
  },

  whatIDo: {
    eyebrow: '02 — Layanan',
    title: 'Software menyeluruh — bukan hanya website',
    titleAccent: 'bukan hanya website',
    subtitle:
      'Toolkit Full Stack Developer serba guna: frontend hanyalah satu bagian dari gambaran yang lebih besar.',
    capabilities: [
      {
        title: 'Web & Aplikasi',
        description:
          'Aplikasi web responsif, dashboard, dan tools internal yang dibangun dengan React dan Next.js.',
      },
      {
        title: 'Backend & API',
        description:
          'REST API dan layanan backend dengan Node.js dan Express — sistem yang menggerakkan frontend.',
      },
      {
        title: 'Data & Database',
        description:
          'Desain skema dan pemodelan data dengan PostgreSQL dan MongoDB, dibangun agar tetap mudah dipelihara seiring pertumbuhannya.',
      },
      {
        title: 'Otomasi & DevOps',
        description:
          'Pipeline CI/CD, container Docker, dan skrip yang menjaga deployment dan pemeliharaan tetap mudah.',
      },
    ],
  },

  skills: {
    eyebrow: '03 — Kemampuan',
    title: 'Stack yang mencakup seluruh produk',
    titleAccent: 'seluruh produk',
    subtitle:
      'Tools yang saya gunakan setiap hari — dikelompokkan berdasarkan posisinya di stack.',
    aboutEyebrow: 'Toolkit',
    aboutTitle: 'Keahlian & tools',
    aboutTitleAccent: 'tools',
    aboutSubtitle:
      'Teknologi yang saya gunakan setiap hari, dikelompokkan berdasarkan posisinya di stack.',
  },

  work: {
    eyebrow: '04 — Karya Pilihan',
    title: 'Hal-hal yang saya desain & kirim',
    subtitle:
      'Beberapa proyek representatif. Buka kartu mana saja untuk studi kasus singkat, atau telusuri semuanya.',
  },

  testimonials: {
    eyebrow: '05 — Kata Mereka',
    title: 'Apa kata rekan kerja',
    quotes: [
      {
        name: 'Rina Dewanti',
        quote:
          'Agga menyelesaikan platform kami lebih cepat dari jadwal dan kodenya sangat rapi. Jarang menemukan seseorang yang sama kuatnya di arsitektur backend dan polish frontend.',
        title: 'Product Lead',
      },
      {
        name: 'Made Surya',
        quote:
          'Dashboard yang dia bangun cepat, intuitif, dan masih mudah dikembangkan oleh tim kami setahun kemudian. Persis tipe engineer yang Anda inginkan untuk mengelola sebuah produk.',
        title: 'CTO, PropTech Startup',
      },
      {
        name: 'Anita Kusuma',
        quote:
          'Komunikatif, terobsesi dengan detail, dan benar-benar peduli terhadap UX. Konversi kami meningkat signifikan setelah rebuild yang dia lakukan.',
        title: 'Marketing Director',
      },
    ],
  },

  experience: {
    eyebrow: '06 — Pengalaman',
    title: 'Perjalanan sejauh ini',
    aboutEyebrow: 'Karir',
    aboutTitle: 'Tempat saya bekerja',
    entries: [
      {
        period: '2023 — Sekarang',
        role: 'Fullstack Software Engineer',
        company: 'Sinergi Investasi Properti',
        location: 'Jakarta, Indonesia',
        description:
          'Mengelola platform web perusahaan secara end to end — frontend Next.js didukung CMS kustom dan dashboard admin. Membangun pipeline konten, perpustakaan media, dan situs publik dengan fokus pada kecepatan dan kemudahan pemeliharaan.',
      },
      {
        period: '2021 — 2023',
        role: 'Web Developer',
        company: 'Freelance & Agensi',
        location: 'Remote',
        description:
          'Menyelesaikan 30+ website dan web app klien di bidang e-commerce, dashboard, dan situs pemasaran. Memperkenalkan sistem komponen reusable yang memangkas waktu pengerjaan secara signifikan.',
      },
      {
        period: '2019 — 2021',
        role: 'Junior Software Engineer',
        company: 'Karir awal',
        location: 'Indonesia',
        description:
          'Mengasah kemampuan membangun tools internal dan REST API. Belajar untuk merilis, mengukur, dan iterasi — dan jatuh cinta dengan full stack.',
      },
    ],
  },

  contact: {
    eyebrow: '07 — Kontak',
    title: 'Mari bangun sesuatu yang hebat bersama',
    titleAccent: 'hebat bersama',
    subtitle:
      'Punya proyek atau peran yang terlintas? Kirim pesan — saya biasanya membalas dalam sehari.',
  },

  contactForm: {
    name: 'Nama',
    email: 'Email',
    subject: 'Subjek',
    message: 'Pesan',
    namePlaceholder: 'Nama Anda',
    emailPlaceholder: 'anda@email.com',
    subjectPlaceholder: 'Tentang apa ini?',
    messagePlaceholder: 'Ceritakan sedikit tentang proyek atau peran Anda…',
    send: 'Kirim pesan',
    sending: 'Mengirim…',
    success: 'Pesan terkirim — saya akan membalas dalam sehari.',
    error: 'Terjadi kesalahan. Silakan email saya langsung.',
  },

  contactPage: {
    eyebrow: 'Kontak',
    heading: 'Mari bangun sesuatu yang ',
    headingAccent: 'hebat bersama',
    subtitle:
      'Punya proyek, peran, atau ide? Ceritakan di bawah ini — saya biasanya membalas dalam sehari.',
    availableForWork: 'TERSEDIA UNTUK PROYEK',
  },

  contactChannels: {
    email: 'Email',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    basedIn: 'Berlokasi di',
    viewMyCode: 'Lihat kode saya',
    connectWithMe: 'Terhubung dengan saya',
    remoteOk: 'Remote OK',
  },

  contactFaq: {
    eyebrow: 'FAQ',
    title: 'Pertanyaan umum',
  },

  cta: {
    preferEmail: 'Lebih suka email?',
    reachMeDirectly: 'Hubungi saya langsung',
    notAFanOfForms:
      'Tidak suka formulir? Kirim email dan saya akan segera membalas.',
    emailMe: 'Email saya',
  },

  aboutPage: {
    eyebrow: 'Tentang saya',
    availableForWork: 'TERSEDIA UNTUK PROYEK',
    getInTouch: 'Hubungi saya',
    downloadResume: 'Unduh résumé',
  },

  projectsPage: {
    eyebrow: 'Karya',
    title: 'Proyek & studi kasus',
    titleAccent: 'studi kasus',
    subtitle:
      'Kumpulan hal-hal yang telah saya desain, bangun, dan kirim. Cari atau filter berdasarkan teknologi.',
    noMatch: 'Tidak ada proyek yang cocok dengan pencarian Anda',
    noPublished: 'Belum ada proyek yang dipublikasikan',
    tryDifferent: 'Coba kata kunci lain atau hapus filter.',
    checkBack: 'Studi kasus sedang dalam perjalanan — kembali lagi nanti.',
    clearFilters: 'Hapus filter',
    searchPlaceholder: 'Cari proyek berdasarkan nama, deskripsi, atau teknologi…',
    searchLabel: 'Cari proyek',
    filter: 'Filter',
    all: 'Semua',
    project: 'proyek',
    projects: 'proyek',
    found: 'ditemukan',
    clear: 'Hapus',
  },

  footer: {
    description:
      'Full Stack Developer membangun perangkat lunak andal — web, backend, dan otomasi — dari Jakarta, Indonesia.',
    navigate: 'Navigasi',
    elsewhere: 'Lainnya',
    downloadCv: 'Unduh CV',
    allRightsReserved: 'Hak cipta dilindungi.',
  },

  education: {
    eyebrow: 'Pendidikan',
    title: 'Latar belakang akademik',
  },

  certificates: {
    eyebrow: 'Kredensial',
    title: 'Sertifikasi',
    viewCredential: 'Lihat kredensial',
  },

  faqs: [
    {
      q: 'Proyek seperti apa yang Anda kerjakan?',
      a: 'Aplikasi web, dashboard, REST API, desain database, dan tooling internal atau otomasi — bukan hanya website. Saya senang menangani masalah dari ujung ke ujung atau bergabung dengan tim yang sudah ada di bagian stack tertentu.',
    },
    {
      q: 'Apakah Anda tersedia untuk posisi penuh waktu?',
      a: 'Ya — saya terbuka untuk posisi penuh waktu, kontrak, dan proyek freelance. Remote-first, dan nyaman bekerja lintas zona waktu.',
    },
    {
      q: 'Bagaimana cara memulai?',
      a: 'Kirim pesan dengan gambaran kasar lingkup dan timeline. Saya akan membalas dalam sehari untuk mengatur panggilan singkat dan berbagi rencana.',
    },
  ],

  projectsContent: [
    {
      id: 'portfolio-cms',
      title: 'Platform CMS Portofolio',
      summary:
        'Platform situs personal lengkap: frontend Next.js, dashboard admin kustom, perpustakaan media, dan blok konten — sistem yang menggerakkan situs ini.',
      detail:
        'Platform konten produksi dengan situs Next.js publik dan CMS admin lengkap: profil, proyek, skill, pengalaman, perpustakaan media, dan page builder. Dibangun untuk kecepatan (99 Lighthouse) dan pengeditan konten yang mudah tanpa menyentuh kode.',
    },
    {
      id: 'analytics-dashboard',
      title: 'Dashboard Analitik Realtime',
      summary:
        'Dashboard metrik langsung dengan grafik streaming, akses berbasis peran, dan pembaruan sub-detik melalui WebSocket.',
      detail:
        'Dashboard yang mengkonsumsi event stream dan merender KPI langsung dengan grafik yang halus dan GPU-accelerated. Termasuk akses berbasis peran, tampilan tersimpan, dan ekspor CSV. Backend pada Node + Postgres dengan lapisan WebSocket untuk realtime.',
    },
    {
      id: 'ecommerce-storefront',
      title: 'Toko E-commerce',
      summary:
        'Storefront headless dengan keranjang, checkout, dan alur pembayaran Stripe — dioptimalkan untuk konversi.',
      detail:
        'Build e-commerce headless yang berfokus pada konversi: halaman produk cepat, keranjang persisten, dan checkout Stripe yang efisien. Peningkatan konversi yang terukur setelah peluncuran berkat performa dan pekerjaan UX.',
    },
    {
      id: 'devops-toolkit',
      title: 'Toolkit Otomasi DevOps',
      summary:
        'CLI + dashboard untuk provision, deploy, dan monitor layanan terkontainerisasi dengan satu perintah.',
      detail:
        'Tooling internal yang membungkus Docker dan AWS ke dalam CLI dan dashboard yang ramah: satu perintah untuk provision, deploy, dan rollback layanan, dengan monitoring kesehatan dan streaming log bawaan.',
    },
  ],
} as const

/* -------------------------------------------------------------------------- */
/*  Export                                                                     */
/* -------------------------------------------------------------------------- */

export const translations = { en, id } as const

/** Recursively widen literal string types to `string` and strip `readonly`. */
type DeepStringify<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? DeepStringify<U>[]
    : T extends object
      ? { [K in keyof T]: DeepStringify<T[K]> }
      : T

/** The shape of a single locale's translation bundle. */
export type Translations = DeepStringify<typeof en>
