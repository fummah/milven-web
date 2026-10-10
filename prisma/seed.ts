import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const globalSettings = {
  brand: {
    name: "Milven Consulting Services",
    shortName: "Milven",
    tagline: "Better Decisions. Better Businesses. Better Leaders.",
    description:
      "An African advisory firm combining strategy, finance, business transformation and executive development to help organisations perform at their best.",
    logo: "/images/brand/milven-logo.png",
    logoWhite: "/images/brand/milven-logo-white.png"
  },
  contact: {
    email: "advisory@milven.co.zw",
    addressLines: ["2nd Floor, Block A", "Smatsatsa Office Park", "Borrowdale"],
    responseNote: "We typically respond to enquiries within one business day.",
    mapQuery: "Smatsatsa Office Park, Borrowdale, Harare"
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    {
      label: "Services",
      href: "/services",
      children: [
        {
          label: "Strategy & Financial Advisory",
          href: "/services/strategy-financial-advisory",
          text: "Sharper decisions. Stronger performance."
        },
        {
          label: "Business Systems & Transformation",
          href: "/services/business-systems-transformation",
          text: "Smarter systems. Scalable businesses."
        }
      ]
    },
    { label: "Industries", href: "/industries" },
    { label: "Executive Finance Academy", href: "/academy" },
    { label: "Insights", href: "/insights" },
    { label: "Contact", href: "/contact" }
  ],
  footer: {
    description:
      "Milven Consulting Services is a professional advisory and business transformation firm helping organisations strengthen strategy, financial performance, business systems and executive capability.",
    columns: [
      {
        title: "Services",
        links: [
          { label: "Strategy & Financial Advisory", href: "/services/strategy-financial-advisory" },
          { label: "Business Systems & Transformation", href: "/services/business-systems-transformation" },
          { label: "Executive Finance Academy", href: "/academy" }
        ]
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Industries", href: "/industries" },
          { label: "Insights", href: "/insights" },
          { label: "Contact", href: "/contact" }
        ]
      }
    ],
    socials: [
      { label: "LinkedIn", href: "https://www.linkedin.com", icon: "linkedin" },
      { label: "X", href: "https://x.com", icon: "twitter" },
      { label: "Facebook", href: "https://www.facebook.com", icon: "facebook" }
    ],
    legal: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Sitemap", href: "/sitemap.xml" }
    ]
  },
  cta: {
    primaryLabel: "Talk to an Advisor",
    primaryHref: "/contact",
    secondaryLabel: "Explore Our Services",
    secondaryHref: "/services"
  },
  seo: {
    defaultTitle: "Milven Consulting Services",
    defaultDescription:
      "Strategy, financial advisory, business transformation and executive development for ambitious organisations across Africa."
  }
}

const pages: Record<string, any> = {
  home: {
    title: "Home",
    seoTitle: "Milven Consulting Services | Strategy, Finance & Transformation",
    seoDesc:
      "Milven combines strategy, finance, business transformation and executive development to help ambitious organisations perform at their best.",
    heroTitle: "Better Decisions. Better Businesses. Better Leaders.",
    heroText:
      "Milven Consulting Services combines strategy, finance, business transformation and executive development to help ambitious organisations perform at their best.",
    heroImage: "/images/home/hero-executive.jpg",
    content: {
      eyebrow: "African Advisory & Transformation",
      heroImages: [
        "/images/home/hero-executive.jpg",
        "/images/home/hero.jpg",
        "/images/home/executive-meeting.jpg"
      ],
      heroMetrics: [
        { value: "50+", label: "Projects Completed" },
        { value: "20+", label: "Organisations" },
        { value: "5+", label: "Industries" },
        { value: "100%", label: "Commitment to Impact" }
      ],
      pillars: [
        {
          title: "Strategy & Financial Advisory",
          text: "Sharper decisions. Stronger performance. Sustainable growth.",
          href: "/services/strategy-financial-advisory",
          image: "/images/home/advisory.jpg",
          icon: "compass"
        },
        {
          title: "Business Systems & Transformation",
          text: "Smarter systems. Better processes. Scalable businesses.",
          href: "/services/business-systems-transformation",
          image: "/images/home/systems.jpg",
          icon: "workflow"
        },
        {
          title: "Milven Executive Finance Academy",
          text: "Developing financially intelligent leaders and organisations.",
          href: "/academy",
          image: "/images/home/academy.jpg",
          icon: "graduation-cap"
        }
      ],
      trustLine: "Trusted by African organisations across multiple sectors.",
      why: {
        eyebrow: "Why Milven",
        title: "Insight That Moves Businesses Forward.",
        text: "Milven combines financial discipline, strategic thinking, technology and practical execution to help organisations move from complexity to clarity and from strategy to measurable results.",
        image: "/images/home/executive-meeting.jpg",
        values: [
          { title: "Strategic Perspective", text: "Board-level thinking grounded in commercial reality.", icon: "compass" },
          { title: "Integrated Capability", text: "Strategy, finance and systems under one roof.", icon: "layers" },
          { title: "Implementation Orientation", text: "We stay through execution, not just advice.", icon: "rocket" },
          { title: "Executive Engagement", text: "Direct access to senior advisors.", icon: "users" },
          { title: "Decision Quality", text: "Analytical rigour that de-risks decisions.", icon: "target" },
          { title: "Capability Transfer", text: "We leave teams stronger than we found them.", icon: "graduation-cap" },
          { title: "Technology + Finance", text: "Modern tools applied to financial performance.", icon: "cpu" }
        ]
      },
      challengesTitle: "What challenge are you navigating?",
      challengesIntro: "Start where your organisation is today. We will help you define the path forward.",
      challenges: [
        { title: "I need a business strategy", text: "Clarify direction, priorities and the roadmap.", href: "/services/strategy-financial-advisory", icon: "compass" },
        { title: "I need stronger financial performance", text: "Improve margins, cash flow and returns.", href: "/services/strategy-financial-advisory", icon: "trending-up" },
        { title: "I need a business plan or feasibility study", text: "Evidence-based plans for growth and investment.", href: "/services/strategy-financial-advisory", icon: "file-text" },
        { title: "I need better management reporting", text: "Insightful reporting for faster decisions.", href: "/services/business-systems-transformation", icon: "bar-chart-3" },
        { title: "I need an ERP or integrated business system", text: "Systems that connect the whole business.", href: "/services/business-systems-transformation", icon: "network" },
        { title: "I need to redesign business processes", text: "Leaner, faster and more controlled operations.", href: "/services/business-systems-transformation", icon: "workflow" },
        { title: "I need executive or management finance training", text: "Build financial intelligence across leadership.", href: "/academy", icon: "graduation-cap" }
      ],
      process: {
        eyebrow: "How We Work",
        title: "A disciplined method, from insight to impact.",
        steps: [
          { title: "Understand", text: "We immerse ourselves in your business, market and ambitions." },
          { title: "Diagnose", text: "We analyse performance, risks and opportunities with rigour." },
          { title: "Design", text: "We develop practical strategies, models and solutions." },
          { title: "Implement", text: "We work alongside your teams to deliver change." },
          { title: "Transfer Capability", text: "We build skills so the impact endures." },
          { title: "Measure", text: "We track results against clear, agreed outcomes." }
        ]
      },
      industriesTitle: "Deep sector perspective.",
      industriesIntro: "We adapt our methods to the commercial realities of each client and sector.",
      industries: [
        { name: "Financial Services", text: "Banks, insurers and financial institutions.", image: "/images/industries/financial-services.jpg" },
        { name: "Property & Real Estate", text: "Real estate, development and property businesses.", image: "/images/industries/property.jpg" },
        { name: "Manufacturing", text: "Production, processing and industrial businesses.", image: "/images/industries/manufacturing.jpg" },
        { name: "Agriculture & Agribusiness", text: "Farming, agri-processing and value chains.", image: "/images/industries/agriculture.jpg" },
        { name: "Trade & Distribution", text: "Wholesale, retail and distribution networks.", image: "/images/industries/trade.jpg" },
        { name: "Professional Services", text: "Advisory, legal, audit and consulting firms.", image: "/images/industries/professional-services.jpg" },
        { name: "Public Sector", text: "Government, parastatals and agencies.", image: "/images/industries/public-sector.jpg" },
        { name: "Development Organisations", text: "NGOs, donors and development finance.", image: "/images/industries/development.jpg" },
        { name: "SMEs & Family Businesses", text: "Growth businesses and family enterprises.", image: "/images/industries/smes.jpg" },
        { name: "Technology & Digital", text: "Technology, software and digital businesses.", image: "/images/industries/technology.jpg" }
      ],
      academy: {
        eyebrow: "Executive Finance Academy",
        title: "Developing financially intelligent leaders.",
        text: "Practical, high-impact programmes designed around the financial and strategic decisions boards, executives, managers and finance teams face every day.",
        points: [
          "Practical and applied, not academic",
          "Led by experienced practitioners",
          "Delivered in-house or as open programmes",
          "Customised to your organisation"
        ],
        image: "/images/home/academy.jpg",
        cta: "Explore the Academy"
      },
      finalCta: {
        title: "Let's Build a Stronger, More Resilient Organisation.",
        text: "Book a consultation or send us an enquiry to discuss your priorities.",
        primaryLabel: "Get In Touch",
        primaryHref: "/contact"
      }
    }
  },

  services: {
    title: "Services",
    seoTitle: "Services | Milven Consulting Services",
    seoDesc:
      "Integrated advisory, systems and capability solutions designed for real-world impact.",
    heroTitle: "Our Services",
    heroText:
      "Integrated advisory, systems and capability solutions designed for real-world impact.",
    heroImage: "/images/services/advisory-hero.jpg",
    content: {
      eyebrow: "What We Do",
      intro:
        "Milven brings strategy, finance, systems and capability together. Whether you are setting direction, improving performance or rebuilding how the business runs, we help you move from insight to execution.",
      pillars: [
        {
          title: "Strategy & Financial Advisory",
          text: "Sharper decisions. Stronger performance. Sustainable growth.",
          href: "/services/strategy-financial-advisory",
          image: "/images/services/strategy-session.jpg",
          icon: "compass"
        },
        {
          title: "Business Systems & Transformation",
          text: "Smarter systems. Better processes. Scalable businesses.",
          href: "/services/business-systems-transformation",
          image: "/images/services/systems-hero.jpg",
          icon: "workflow"
        },
        {
          title: "Milven Executive Finance Academy",
          text: "Developing financially intelligent leaders and organisations.",
          href: "/academy",
          image: "/images/academy/workshop.jpg",
          icon: "graduation-cap"
        }
      ],
      addValue: {
        title: "How We Add Value",
        items: [
          { title: "Practical Solutions", text: "Advice designed to be implemented, not shelved.", icon: "wrench" },
          { title: "Measurable Outcomes", text: "Clarity on the results that matter.", icon: "gauge" },
          { title: "Executive Engagement", text: "Senior advisors working directly with leaders.", icon: "users" },
          { title: "Cross-Functional Expertise", text: "Finance, strategy, systems and people.", icon: "layers" }
        ]
      },
      finalCta: {
        title: "From Insight to Execution.",
        text: "We don't just advise. We work with you to implement and achieve results.",
        primaryLabel: "Discuss Your Needs",
        primaryHref: "/contact"
      }
    }
  },

  about: {
    title: "About",
    seoTitle: "About Milven | A Trusted African Advisory Partner",
    seoDesc:
      "Milven Consulting Services is a professional advisory and business transformation firm helping organisations strengthen strategy, financial performance, business systems and executive capability.",
    heroTitle: "Advising Leaders. Transforming Businesses. Building Capability.",
    heroText:
      "Milven is a professional advisory and business transformation firm helping organisations strengthen strategy, financial performance, business systems and executive capability.",
    heroImage: "/images/about/about-hero.jpg",
    content: {
      eyebrow: "About Milven",
      intro:
        "We are an African advisory firm built around a simple conviction: better decisions create better businesses and better leaders. We combine strategic thinking, financial discipline, technology and capability development to help organisations perform at their best.",
      purpose: "To enable businesses and leaders to make better decisions, build stronger organisations and achieve sustainable performance.",
      vision: "To become a trusted African advisory partner for organisations seeking strategic, financial and operational excellence.",
      mission: "To provide high-quality advisory, transformation and executive-development solutions that create measurable business value.",
      values: [
        { title: "Integrity & Professional Judgement", text: "Independent, honest advice that puts your interests first.", icon: "shield-check" },
        { title: "Commercial Relevance", text: "Solutions grounded in the realities of your market.", icon: "briefcase" },
        { title: "Quality & Analytical Rigour", text: "Work that stands up to boardroom scrutiny.", icon: "target" },
        { title: "Practical Execution", text: "We stay accountable through implementation.", icon: "rocket" },
        { title: "Confidentiality & Trust", text: "Discretion and trust in every engagement.", icon: "lock" },
        { title: "Continuous Learning & Innovation", text: "Modern methods for modern challenges.", icon: "lightbulb" },
        { title: "Partnership with Clients", text: "We succeed when you do.", icon: "handshake" }
      ],
      approach: {
        title: "Our Approach",
        text: "We combine advisory depth with hands-on delivery. Every engagement is designed to produce clear decisions, measurable outcomes and stronger internal capability.",
        points: [
          { title: "Senior-led", text: "Experienced advisors remain close to the work." },
          { title: "Evidence-based", text: "Decisions grounded in data and analysis." },
          { title: "Collaborative", text: "We work with your teams, not around them." },
          { title: "Outcome-focused", text: "Success is defined by results, not reports." }
        ]
      },
      differentiators: {
        title: "What Sets Us Apart",
        items: [
          { title: "Integrated Capability", text: "Strategy, finance, systems and capability in one partner.", icon: "layers" },
          { title: "African Context", text: "Deep understanding of doing business in African markets.", icon: "globe" },
          { title: "Implementation Focus", text: "We bridge the gap between strategy and execution.", icon: "workflow" },
          { title: "Capability Transfer", text: "We build the skills that sustain performance.", icon: "graduation-cap" }
        ]
      },
      story: {
        eyebrow: "Our Story",
        title: "A short introduction to Milven and what drives us.",
        text: "Milven was founded to close the gap between high-quality advice and real-world execution. We bring together financial, strategic and systems expertise to help organisations make decisions with confidence.",
        image: "/images/about/leadership-session.jpg"
      },
      finalCta: {
        title: "Partner With Milven.",
        text: "Speak to us about your strategy, performance or transformation priorities.",
        primaryLabel: "Talk to an Advisor",
        primaryHref: "/contact"
      }
    }
  },

  "strategy-financial-advisory": {
    title: "Strategy & Financial Advisory",
    seoTitle: "Strategy & Financial Advisory | Milven",
    seoDesc:
      "Milven helps leadership teams strengthen business strategy, financial planning and enterprise performance.",
    heroTitle: "Turning Financial Insight Into Better Business Decisions.",
    heroText:
      "Milven works alongside leadership teams to strengthen business strategy, financial planning and enterprise performance.",
    heroImage: "/images/services/advisory-hero.jpg",
    content: {
      eyebrow: "Strategy & Financial Advisory",
      overview: {
        title: "Overview",
        text: "We help organisations make better decisions through practical, evidence-based strategy and financial advisory services that improve performance and create long-term value. From corporate strategy to financial modelling and board advisory, our work is designed to translate insight into action."
      },
      outcomes: {
        title: "Key Outcomes",
        items: [
          "Clearer strategic direction",
          "Improved financial performance",
          "Better resource allocation",
          "Stronger governance and controls",
          "Sustainable growth"
        ]
      },
      clusters: {
        title: "Our Services Include",
        items: [
          { title: "Corporate & Financial Strategy", text: "Set direction, priorities and financial ambition.", icon: "compass" },
          { title: "Financial Modelling & Decision Support", text: "Robust models that de-risk major decisions.", icon: "calculator" },
          { title: "Business Planning & Feasibility", text: "Bankable plans and investment cases.", icon: "file-text" },
          { title: "Performance Improvement", text: "Improve margins, cash flow and profitability.", icon: "trending-up" },
          { title: "Business Restructuring", text: "Reshape the business for resilience and growth.", icon: "refresh-cw" },
          { title: "Board & Executive Advisory", text: "Independent advice for boards and leadership.", icon: "users" }
        ]
      },
      approach: {
        title: "Our Approach",
        steps: [
          { title: "Understand", text: "Immerse in your business, market and objectives." },
          { title: "Analyse", text: "Assess performance, financials and options." },
          { title: "Recommend", text: "Develop clear, prioritised recommendations." },
          { title: "Support", text: "Help implement and monitor outcomes." }
        ]
      },
      cta: {
        title: "Let's Discuss Your Strategy and Financial Needs.",
        text: "Book a consultation with our advisory team.",
        primaryLabel: "Book a Consultation",
        primaryHref: "/contact"
      }
    }
  },

  "business-systems-transformation": {
    title: "Business Systems & Transformation",
    seoTitle: "Business Systems & Transformation | Milven",
    seoDesc:
      "Milven helps organisations redesign processes and implement systems that enhance visibility, control, efficiency and scalability.",
    heroTitle: "Building Smarter, More Efficient Businesses.",
    heroText:
      "Milven helps organisations redesign processes and implement systems that enhance visibility, control, efficiency and scalability.",
    heroImage: "/images/services/systems-hero.jpg",
    content: {
      eyebrow: "Business Systems & Transformation",
      overview: {
        title: "Overview",
        text: "We help organisations transform how they operate. By redesigning processes and implementing integrated systems, we give leadership the visibility, control and efficiency needed to scale. Our approach connects technology to real business outcomes."
      },
      clusters: {
        title: "Our Services Include",
        items: [
          { title: "Business Systems Advisory", text: "Select and align the right systems to your strategy.", icon: "layers" },
          { title: "Odoo Solutions", text: "Implementation and optimisation of integrated business platforms.", icon: "boxes" },
          { title: "Process Transformation", text: "Redesign processes for speed, control and quality.", icon: "workflow" },
          { title: "Digital Finance", text: "Modernise financial reporting, controls and analysis.", icon: "cpu" },
          { title: "Implementation Support", text: "Hands-on delivery, training and change management.", icon: "wrench" }
        ]
      },
      process: {
        title: "Our Implementation Method",
        steps: [
          { title: "Diagnose", text: "Assess current processes, systems and gaps." },
          { title: "Design", text: "Design future-state processes and system architecture." },
          { title: "Configure", text: "Configure and tailor the solution to your business." },
          { title: "Implement", text: "Deploy with controlled migration and testing." },
          { title: "Train", text: "Build user capability and adoption." },
          { title: "Optimise", text: "Refine and improve continuously after go-live." }
        ]
      },
      dashboard: {
        title: "Visibility, control and insight",
        text: "Managers and executives get real-time visibility into performance, freeing teams from manual work and enabling faster, better decisions.",
        image: "/images/services/dashboard.jpg"
      },
      cta: {
        title: "Transform How Your Business Runs.",
        text: "Speak to our systems and transformation team.",
        primaryLabel: "Get In Touch",
        primaryHref: "/contact"
      }
    }
  },

  academy: {
    title: "Milven Executive Finance Academy",
    seoTitle: "Executive Finance Academy | Milven",
    seoDesc:
      "Practical, high-impact executive finance programmes for boards, executives, managers and finance teams.",
    heroTitle: "Milven Executive Finance Academy",
    heroText:
      "Practical, high-impact programmes that build financial intelligence across boards, executives, managers and finance teams.",
    heroImage: "/images/academy/academy-hero.jpg",
    content: {
      eyebrow: "Executive Education",
      intro:
        "Our programmes are built around the decisions leaders actually make. Delivered by experienced practitioners, they combine practical frameworks, real cases and immediate application to your business.",
      formats: {
        title: "Delivery Formats",
        items: [
          { title: "Open Programmes", text: "Join a cohort of peers from across industries.", icon: "users" },
          { title: "In-House Training", text: "Customised for your leadership team.", icon: "building-2" },
          { title: "Executive Coaching", text: "One-to-one support for senior leaders.", icon: "user-check" },
          { title: "Board Briefings", text: "Focused sessions for boards and committees.", icon: "presentation" }
        ]
      },
      programmes: [
        { title: "Finance for Executives", text: "Financial fluency for senior decision makers.", category: "Finance", duration: "3 days", format: "In-house / Open", image: "/images/academy/executive-training.jpg" },
        { title: "Finance for Non-Financial Managers", text: "Understand the numbers and act on them.", category: "Finance", duration: "2 days", format: "In-house", image: "/images/academy/workshop.jpg" },
        { title: "Strategic Financial Management", text: "Link financial decisions to strategy.", category: "Strategy", duration: "3 days", format: "In-house / Open", image: "/images/academy/academy-hero.jpg" },
        { title: "Corporate Finance", text: "Investment, funding and value creation.", category: "Finance", duration: "3 days", format: "Open" },
        { title: "Financial Modelling and Decision Making", text: "Build models that support real decisions.", category: "Analytics", duration: "3 days", format: "In-house / Open" },
        { title: "Budgeting, Forecasting and Planning", text: "Plan with confidence and control.", category: "Finance", duration: "2 days", format: "In-house" },
        { title: "Business Valuation", text: "Value businesses with rigour.", category: "Finance", duration: "2 days", format: "Open" },
        { title: "Financial Statement Analysis", text: "Read performance behind the numbers.", category: "Finance", duration: "2 days", format: "In-house / Open" },
        { title: "Cost and Profitability Management", text: "Understand and improve margins.", category: "Performance", duration: "2 days", format: "In-house" },
        { title: "Cash-Flow and Working-Capital Management", text: "Strengthen liquidity and cash discipline.", category: "Finance", duration: "2 days", format: "In-house" },
        { title: "Board Financial Literacy", text: "Financial oversight for board members.", category: "Governance", duration: "1 day", format: "Board Briefing" },
        { title: "Strategic Planning and Execution", text: "Turn strategy into delivered results.", category: "Strategy", duration: "3 days", format: "In-house" },
        { title: "Business Performance Management", text: "Drive performance across the organisation.", category: "Performance", duration: "2 days", format: "In-house" },
        { title: "Excel, Analytics and AI for Finance", text: "Modern tools for finance professionals.", category: "Analytics", duration: "3 days", format: "In-house / Open" },
        { title: "ERP and Digital Finance", text: "Finance in an integrated digital environment.", category: "Technology", duration: "2 days", format: "In-house" },
        { title: "Family Business Governance and Succession", text: "Governance for enduring family enterprises.", category: "Governance", duration: "2 days", format: "Open" }
      ],
      testimonialsIntro: "Participant and corporate testimonials will be published here once approved.",
      enquiry: {
        title: "Request a Corporate Training Proposal",
        text: "Tell us about your team and objectives and we will design a programme around your needs."
      },
      cta: {
        title: "Invest in Your Leadership.",
        text: "Build financial intelligence across your organisation.",
        primaryLabel: "Request a Corporate Training Proposal",
        primaryHref: "/contact?service=Executive+Finance+Academy"
      }
    }
  },

  industries: {
    title: "Industries",
    seoTitle: "Industries | Milven Consulting Services",
    seoDesc: "Cross-sector experience and commercial perspective across African markets.",
    heroTitle: "We Serve Diverse Industries",
    heroText: "Deep sector experience. Practical insights. Real-world solutions.",
    heroImage: "/images/industries/financial-services.jpg",
    content: {
      eyebrow: "Industries We Serve",
      intro:
        "Milven adapts its methods to the commercial realities of each client and sector. We bring cross-sector perspective and deep understanding of African markets.",
      industries: [
        { name: "Financial Services", text: "Banks, insurers and financial institutions.", image: "/images/industries/financial-services.jpg" },
        { name: "Public Sector", text: "Government, parastatals and agencies.", image: "/images/industries/public-sector.jpg" },
        { name: "Development Organisations", text: "NGOs, donors and development finance.", image: "/images/industries/development.jpg" },
        { name: "Growth Businesses & SMEs", text: "Ambitious small and medium enterprises.", image: "/images/industries/smes.jpg" },
        { name: "Family Businesses", text: "Multi-generational family enterprises.", image: "/images/industries/professional-services.jpg" },
        { name: "Property & Real Estate", text: "Real estate and property businesses.", image: "/images/industries/property.jpg" },
        { name: "Manufacturing", text: "Production and industrial businesses.", image: "/images/industries/manufacturing.jpg" },
        { name: "Agriculture & Agribusiness", text: "Farming, agri-processing and value chains.", image: "/images/industries/agriculture.jpg" },
        { name: "Trade & Distribution", text: "Wholesale, retail and distribution.", image: "/images/industries/trade.jpg" },
        { name: "Technology & Digital", text: "Technology, software and digital businesses.", image: "/images/industries/technology.jpg" }
      ],
      cta: {
        title: "Understanding Your Sector.",
        text: "We combine sector knowledge with functional expertise to advise organisations within your industry.",
        primaryLabel: "Discuss Your Sector",
        primaryHref: "/contact"
      }
    }
  },

  insights: {
    title: "Insights",
    seoTitle: "Insights | Milven Consulting Services",
    seoDesc: "Thought leadership, executive briefings and practical resources for better decisions.",
    heroTitle: "Insights",
    heroText: "Thought leadership, executive briefings and practical resources for better decisions.",
    heroImage: "/images/insights/african-business.jpg",
    content: {
      eyebrow: "Insights & Resources",
      categories: [
        "Strategy",
        "Finance",
        "Business Transformation",
        "Technology",
        "Leadership",
        "Corporate Performance",
        "African Business",
        "Executive Education"
      ]
    }
  },

  contact: {
    title: "Contact",
    seoTitle: "Contact Milven | Talk to an Advisor",
    seoDesc: "Have a strategic, financial or transformation challenge? Speak to Milven.",
    heroTitle: "Start a Conversation with Milven.",
    heroText:
      "Tell us about your strategic, financial, systems or capability challenge. We would be glad to help.",
    heroImage: "/images/contact/contact-hero.jpg",
    content: {
      eyebrow: "Contact",
      formTitle: "Send an Enquiry",
      enquiryTypes: [
        "Strategy & Financial Advisory",
        "Business Systems & Transformation",
        "Executive Finance Academy",
        "General Enquiry"
      ],
      contactMethods: ["Email", "Telephone", "WhatsApp", "Microsoft Teams"]
    }
  }
}

const insights = [
  {
    slug: "five-financial-indicators-every-ceo-should-monitor",
    title: "Five Financial Indicators Every CEO Should Monitor",
    category: "Finance",
    excerpt:
      "The handful of numbers that tell you more about the health of your business than any dashboard.",
    image: "/images/insights/finance.jpg",
    featured: true,
    readMinutes: 6,
    author: "Milven Advisory",
    authorRole: "Strategy & Financial Advisory",
    body: `<p>Chief executives are surrounded by data, yet the most important signals are often buried. The discipline is not collecting more numbers but choosing the few that genuinely predict performance.</p>
<h2>1. Gross margin trend</h2>
<p>Margin is where pricing power, cost control and mix meet. A declining trend rarely corrects itself and usually signals a deeper commercial issue.</p>
<h2>2. Cash conversion</h2>
<p>Profit is an opinion; cash is a fact. Track how quickly earnings convert into cash and monitor working capital closely.</p>
<h2>3. Return on capital employed</h2>
<p>Growth that destroys returns is not growth. ROCE keeps the organisation honest about where capital is deployed.</p>
<h2>4. Revenue concentration</h2>
<p>Dependence on a small number of customers or products is a strategic risk that belongs on the board agenda.</p>
<h2>5. Forward order book or pipeline</h2>
<p>Backward-looking results reassure; forward indicators inform. A healthy pipeline is the earliest sign of what is coming.</p>
<blockquote>Better decisions start with a small number of indicators, reviewed consistently and acted upon.</blockquote>
<p>Milven helps leadership teams design reporting that turns these indicators into faster, better decisions.</p>`
  },
  {
    slug: "why-strategy-fails-at-execution",
    title: "Why Strategy Fails at Execution",
    category: "Strategy",
    excerpt:
      "Most strategies do not fail because they are wrong. They fail in the gap between the boardroom and the front line.",
    image: "/images/insights/strategy.jpg",
    featured: false,
    readMinutes: 7,
    author: "Milven Advisory",
    authorRole: "Strategy & Financial Advisory",
    body: `<p>The gap between strategy and execution is the single most common source of value destruction in organisations. The plan is sound, yet the results never arrive.</p>
<h2>Clarity is not alignment</h2>
<p>A clear strategy understood by the executive team is not the same as an aligned organisation. Alignment requires translation into priorities, resources and metrics at every level.</p>
<h2>Ownership matters</h2>
<p>Every strategic initiative needs a named owner with authority and accountability. Shared ownership is no ownership.</p>
<h2>Measure what matters</h2>
<p>Progress must be visible. Milestones, leading indicators and disciplined review cadences keep execution on track.</p>
<blockquote>Strategy is a hypothesis. Execution is the experiment that proves it.</blockquote>
<p>Milven works with leadership teams to close the execution gap and deliver measurable outcomes.</p>`
  },
  {
    slug: "when-should-a-business-implement-an-erp",
    title: "When Should a Business Implement an ERP?",
    category: "Technology",
    excerpt:
      "The signals that it is time to move from spreadsheets and disconnected systems to an integrated platform.",
    image: "/images/insights/technology.jpg",
    featured: false,
    readMinutes: 5,
    author: "Milven Advisory",
    authorRole: "Business Systems & Transformation",
    body: `<p>An ERP is a significant investment. Implementing too early wastes money; implementing too late holds the business back. The art is reading the signals.</p>
<h2>Symptoms of the wrong time to wait</h2>
<ul><li>Multiple versions of the truth across departments</li><li>Manual rework and spreadsheet sprawl</li><li>Slow, error-prone month-end reporting</li><li>Poor visibility of costs, stock or cash</li></ul>
<h2>Readiness matters as much as need</h2>
<p>Successful implementations depend on clear processes, committed leadership and a realistic scope. Technology accelerates a well-run business; it does not fix a broken one.</p>
<blockquote>The question is not whether to implement an ERP, but whether your business is ready to benefit from one.</blockquote>
<p>Milven helps organisations assess readiness, select the right platform and implement it successfully.</p>`
  },
  {
    slug: "building-a-resilient-financial-strategy-in-uncertain-times",
    title: "Building a Resilient Financial Strategy in Uncertain Times",
    category: "Corporate Performance",
    excerpt:
      "How leadership teams can build financial resilience when the environment keeps changing.",
    image: "/images/insights/african-business.jpg",
    featured: false,
    readMinutes: 6,
    author: "Milven Advisory",
    authorRole: "Strategy & Financial Advisory",
    body: `<p>Volatility has become the baseline condition for many African businesses. Resilience is no longer a nice-to-have; it is the core of strategy.</p>
<h2>Scenario planning beats forecasting</h2>
<p>Single-point forecasts create false confidence. Scenario-based planning prepares the organisation for a range of futures.</p>
<h2>Cash is the shock absorber</h2>
<p>Strong cash discipline and access to liquidity are what allow a business to absorb shocks and act on opportunities.</p>
<h2>Cost agility</h2>
<p>Understanding which costs are fixed, variable and discretionary allows leadership to respond quickly without damaging capability.</p>
<blockquote>Resilient businesses are not those that predict the future, but those that can respond to it.</blockquote>
<p>Milven supports leadership teams in building financial strategies that withstand uncertainty.</p>`
  },
  {
    slug: "the-role-of-executive-finance-in-business-growth",
    title: "The Role of Executive Finance in Business Growth",
    category: "Leadership",
    excerpt:
      "Why financial intelligence at the top of the organisation is a growth enabler, not a compliance function.",
    image: "/images/insights/leadership.jpg",
    featured: false,
    readMinutes: 5,
    author: "Milven Academy",
    authorRole: "Executive Finance Academy",
    body: `<p>Organisations grow at the speed of their leaders' ability to make good financial decisions. Executive finance is therefore a growth capability.</p>
<h2>From scorekeeping to steering</h2>
<p>Finance leaders who move beyond reporting to insight become genuine partners to the business.</p>
<h2>Financial fluency across the executive team</h2>
<p>When non-financial executives understand the numbers, decisions improve and debates become sharper.</p>
<blockquote>Financial intelligence is a leadership skill, not a finance department skill.</blockquote>
<p>The Milven Executive Finance Academy builds this capability across leadership teams.</p>`
  },
  {
    slug: "africa-s-business-transformation-imperative",
    title: "Africa's Business Transformation Imperative",
    category: "African Business",
    excerpt:
      "African businesses are under pressure to transform faster. Those that do will define their sectors.",
    image: "/images/insights/transformation.jpg",
    featured: false,
    readMinutes: 7,
    author: "Milven Advisory",
    authorRole: "Business Systems & Transformation",
    body: `<p>Across the continent, businesses face a common set of pressures: rapid change, rising competition, technology shifts and demanding customers. Transformation is no longer optional.</p>
<h2>Process before technology</h2>
<p>The most successful transformations begin with process clarity, then apply technology to accelerate it.</p>
<h2>People make systems work</h2>
<p>Adoption, training and change management determine whether a system delivers value.</p>
<blockquote>Transformation is a business discipline, not an IT project.</blockquote>
<p>Milven partners with organisations across Africa to design and deliver transformation that lasts.</p>`
  },
  {
    slug: "financial-modelling-for-better-decisions",
    title: "Financial Modelling for Better Decisions",
    category: "Finance",
    excerpt: "A good financial model is a decision tool. Here is what separates a useful model from a spreadsheet.",
    image: "/images/insights/finance.jpg",
    featured: false,
    readMinutes: 6,
    author: "Milven Advisory",
    authorRole: "Strategy & Financial Advisory",
    body: `<p>Financial models are often treated as accounting exercises. Their real value lies in informing decisions under uncertainty.</p>
<h2>Start with the decision</h2>
<p>Define the question before building. A model should make the trade-offs visible and testable.</p>
<h2>Transparency over complexity</h2>
<p>Simple, well-structured models are more useful than opaque complexity. Assumptions should be explicit and easy to challenge.</p>
<blockquote>A model is a conversation about the future, made concrete.</blockquote>
<p>Milven builds financial models that support investment, funding and strategic decisions.</p>`
  },
  {
    slug: "designing-management-reporting-that-drives-action",
    title: "Designing Management Reporting That Drives Action",
    category: "Business Transformation",
    excerpt: "Reporting should prompt decisions, not archive the past. A practical guide to management information.",
    image: "/images/insights/transformation.jpg",
    featured: false,
    readMinutes: 5,
    author: "Milven Advisory",
    authorRole: "Business Systems & Transformation",
    body: `<p>Many organisations report too much and decide too little. Effective management reporting is designed around decisions.</p>
<h2>Lead with insight, not data</h2>
<p>Start with what has changed and why, then support it with numbers. Executives value interpretation.</p>
<h2>Right cadence, right audience</h2>
<p>Daily, weekly and monthly reporting have different purposes. Match the report to the decision cycle.</p>
<blockquote>The test of a report is the action it provokes.</blockquote>
<p>Milven helps organisations redesign reporting that drives performance.</p>`
  }
]

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || "advisory@milven.co.zw")
    .toLowerCase()
    .trim()
  const password = process.env.ADMIN_PASSWORD || "MilvenAdmin#2026"
  const name = process.env.ADMIN_NAME || "Milven Administrator"

  const existing = await prisma.adminUser.findUnique({ where: { email } })
  if (existing) {
    if (existing.name !== name) {
      await prisma.adminUser.update({ where: { email }, data: { name } })
    }
    console.log(`Admin user already exists: ${email}`)
    return
  }

  const passwordHash = await bcrypt.hash(password, 10)
  await prisma.adminUser.create({
    data: { email, name, passwordHash, role: "ADMIN" }
  })
  console.log(`Admin user created: ${email}`)
  if (!process.env.ADMIN_PASSWORD) {
    console.log(
      `Default admin password in use: ${password}  (set ADMIN_PASSWORD to change)`
    )
  }
}

async function main() {
  await seedAdmin()

  await prisma.siteSetting.upsert({
    where: { id: "global" },
    update: { data: globalSettings as any },
    create: { id: "global", data: globalSettings as any }
  })

  for (const [slug, page] of Object.entries(pages)) {
    const { content, ...rest } = page
    await prisma.page.upsert({
      where: { slug },
      update: { ...rest, content },
      create: { slug, ...rest, content }
    })
  }

  for (const item of insights) {
    const { slug, ...data } = item
    await prisma.insight.upsert({
      where: { slug },
      update: data,
      create: { slug, ...data }
    })
  }

  console.log("Seed complete.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => prisma.$disconnect())
