/**
 * Tools Data Registry for Personal Tools Hub
 */

export const TOOLS_DATA = [
  {
    id: 'word-counter',
    title: 'Word & Character Counter',
    tagline: 'Count words, characters, sentences, paragraphs, and reading time instantly.',
    description: 'Free online word counter tool. Instantly count words, characters with/without spaces, sentences, paragraphs, reading time, speaking time, and analyze keyword density in real time.',
    category: 'text',
    iconName: 'fileText',
    popular: true,
    seoMeta: {
      metaTitle: 'Word Counter Tool - Free Online Word & Character Count',
      metaDescription: 'Accurate free word counter. Calculate total words, character count, reading time, and sentence frequency instantly with our clean online tool.',
      keywords: ['word counter', 'character count', 'reading time', 'text statistics', 'word count tool']
    },
    faqs: [
      {
        question: 'Does the word counter count spaces?',
        answer: 'Our word counter provides both character counts with spaces and character counts without spaces so you can meet exact length guidelines.'
      },
      {
        question: 'How is reading time calculated?',
        answer: 'Reading time is calculated using an average reading speed of 200 words per minute (WPM), which is standard for adult readers.'
      },
      {
        question: 'Is my text private and secure?',
        answer: 'Yes! All calculations occur strictly inside your browser. No text is ever uploaded to any external server.'
      }
    ],
    schemaJson: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Word & Character Counter',
      'applicationCategory': 'UtilitiesApplication',
      'operatingSystem': 'All',
      'description': 'Free real-time online word counter and text statistics analyzer.'
    }
  },
  {
    id: 'password-generator',
    title: 'Secure Password Generator',
    tagline: 'Generate ultra-secure, randomized passwords with custom criteria.',
    description: 'Create strong, unbreakable passwords using customizable parameters including uppercase letters, numbers, symbols, and length configuration. 100% browser-side secure.',
    category: 'security',
    iconName: 'key',
    popular: true,
    seoMeta: {
      metaTitle: 'Password Generator - Create Secure Random Passwords Online',
      metaDescription: 'Generate strong, customizable random passwords online. Choose length, symbols, numbers, and capital letters for bulletproof security.',
      keywords: ['password generator', 'random password', 'secure password tool', 'strong password maker']
    },
    faqs: [
      {
        question: 'How secure are the generated passwords?',
        answer: 'Passwords are created using browser cryptographic randomness (crypto.getRandomValues), ensuring high entropy and unpredictability.'
      },
      {
        question: 'Are my generated passwords stored anywhere?',
        answer: 'Never. Passwords exist only in your current session memory and disappear as soon as you close or refresh the page.'
      }
    ],
    schemaJson: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Secure Password Generator',
      'applicationCategory': 'SecurityApplication',
      'operatingSystem': 'All'
    }
  },
  {
    id: 'case-converter',
    title: 'Text Case Converter',
    tagline: 'Convert text between UPPERCASE, lowercase, Title Case, camelCase & kebab-case.',
    description: 'Easily transform text formatting. Supports UPPERCASE, lowercase, Title Case, Sentence case, camelCase, kebab-case, snake_case, PascalCase, and Alternating case.',
    category: 'text',
    iconName: 'type',
    popular: true,
    seoMeta: {
      metaTitle: 'Text Case Converter - UPPERCASE, lowercase, Title Case & More',
      metaDescription: 'Free online text case converter. Quickly change case to title case, camelCase, kebab-case, uppercase, or lowercase with one click.',
      keywords: ['case converter', 'title case converter', 'uppercase converter', 'camelcase generator']
    },
    faqs: [
      {
        question: 'What is camelCase vs kebab-case?',
        answer: 'camelCase starts lowercase and capitalizes subsequent words (e.g. myVariableName). kebab-case separates words with hyphens (e.g. my-variable-name).'
      }
    ],
    schemaJson: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Text Case Converter',
      'applicationCategory': 'UtilitiesApplication'
    }
  },
  {
    id: 'qr-generator',
    title: 'QR Code Generator',
    tagline: 'Generate high-resolution custom QR codes for URLs, WiFi, Phone, Email, SMS & Text.',
    description: 'Create instant, production-ready custom QR codes completely client-side. Supports web URLs, plain text, phone calls, SMS text messages, emails with pre-filled subjects, and WiFi network auto-connect details. Customize colors, adjust error correction, preview live, copy payload, download PNG, and print.',
    category: 'utility',
    iconName: 'qrCode',
    popular: true,
    seoMeta: {
      metaTitle: 'Free QR Code Generator - Create Custom QR Codes for WiFi, URL, Email, Phone & SMS',
      metaDescription: 'Create custom QR codes for websites, WiFi networks, phone calls, SMS, text, and emails. Features live preview, custom colors, high-resolution PNG download, and print support.',
      keywords: ['qr code generator', 'wifi qr code maker', 'url qr code', 'phone qr code', 'sms qr code generator', 'email qr code', 'custom qr code generator', 'print qr code']
    },
    faqs: [
      {
        question: 'What data types are supported by this QR Code Generator?',
        answer: 'Our tool supports URLs (web links), Plain Text, Phone Numbers (tel:), Email addresses (with optional subject and message body), SMS text messages, and WiFi network configurations (SSID, password, and security protocol).'
      },
      {
        question: 'Do the generated QR codes ever expire?',
        answer: 'No! All generated QR codes are static, meaning your input data is encoded directly into the matrix pixels. They will work permanently with no redirection or expiration.'
      },
      {
        question: 'Can I customize the colors and download as high-resolution PNG?',
        answer: 'Yes! You can pick custom foreground and background colors, apply color presets, select error correction levels, preview in real-time, copy the input payload, download crisp PNG images, and print directly.'
      },
      {
        question: 'Is my WiFi password or personal data safe when generating QR codes?',
        answer: '100% safe. All QR codes are generated entirely within your browser memory using local JavaScript. No text, phone numbers, email addresses, or passwords are ever sent to any server.'
      },
      {
        question: 'How do users scan the generated QR code?',
        answer: 'Point any smartphone camera (iOS Camera or Android Google Lens) at the screen or printed QR code. Most mobile OS camera apps automatically detect the payload and prompt to open the website, dial the phone number, connect to WiFi, or draft the message.'
      }
    ],
    schemaJson: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'QR Code Generator',
      'applicationCategory': 'DesignApplication',
      'operatingSystem': 'All',
      'description': 'Free client-side online QR code generator for URLs, WiFi networks, phone numbers, SMS, text, and emails.'
    }
  },
  {
    id: 'json-formatter',
    title: 'JSON Formatter & Validator',
    tagline: 'Format, validate, prettify, and minify JSON data with clear error highlighting.',
    description: 'A clean, developer-friendly JSON tool to validate syntax, format messy JSON strings with custom indentation (2 or 4 spaces), minify JSON payload, and inspect key hierarchy.',
    category: 'developer',
    iconName: 'code',
    popular: true,
    seoMeta: {
      metaTitle: 'JSON Formatter & Validator - Prettify & Minify JSON Online',
      metaDescription: 'Validate and beautify JSON online. Fix syntax errors, prettify JSON trees, and compress JSON payloads instantly.',
      keywords: ['json formatter', 'json validator', 'json prettify', 'json minifier', 'json parser']
    },
    faqs: [
      {
        question: 'How does JSON validation detect errors?',
        answer: 'The validator parses JSON using native browser engines and pinpoints exact syntax error details.'
      }
    ],
    schemaJson: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'JSON Formatter & Validator',
      'applicationCategory': 'DeveloperApplication'
    }
  },
  {
    id: 'base64-tool',
    title: 'Base64 Encoder & Decoder',
    tagline: 'Encode plain text to Base64 or decode Base64 strings back to readable text.',
    description: 'Fast online Base64 encoder and decoder. Convert UTF-8 text strings into Base64 formats or decode Base64 strings safely with instant live preview.',
    category: 'developer',
    iconName: 'binary',
    popular: false,
    seoMeta: {
      metaTitle: 'Base64 Encoder & Decoder - Online Base64 Tool',
      metaDescription: 'Free online Base64 tool to encode text into Base64 format or decode Base64 payloads into UTF-8 readable text.',
      keywords: ['base64 encoder', 'base64 decoder', 'encode base64', 'base64 converter']
    },
    faqs: [
      {
        question: 'Is Base64 encryption?',
        answer: 'No. Base64 is an encoding format designed to transmit binary data safely over text-based protocols, not an encryption standard.'
      }
    ],
    schemaJson: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Base64 Encoder & Decoder',
      'applicationCategory': 'DeveloperApplication'
    }
  },
  {
    id: 'unit-converter',
    title: 'Multi-Unit Converter',
    tagline: 'Convert Length, Mass, Temperature, Volume, Speed, and Data Storage units.',
    description: 'Comprehensive unit conversion suite for measurements in metric and imperial systems. Supports meters, feet, inches, kg, lbs, Celsius, Fahrenheit, MB, GB, and more.',
    category: 'utility',
    iconName: 'scale',
    popular: true,
    seoMeta: {
      metaTitle: 'Unit Converter - Free Measurement & Data Conversion Tool',
      metaDescription: 'Convert length, weight, temperature, data storage, speed, and area measurements with instant accurate results.',
      keywords: ['unit converter', 'metric to imperial', 'temperature converter', 'data storage conversion']
    },
    faqs: [
      {
        question: 'Are metric and imperial units both supported?',
        answer: 'Yes, all major metric and imperial standard units are built right in.'
      }
    ],
    schemaJson: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Multi-Unit Converter',
      'applicationCategory': 'UtilitiesApplication'
    }
  },
  {
    id: 'age-calculator',
    title: 'Age & Date Calculator',
    tagline: 'Calculate exact age in years, months, days, hours, and next birthday countdown.',
    description: 'Find out your exact age down to the day, calculate time duration between two dates, and see a live countdown to your upcoming birthday.',
    category: 'utility',
    iconName: 'calendar',
    popular: false,
    seoMeta: {
      metaTitle: 'Age Calculator - Calculate Exact Age in Years, Months, Days',
      metaDescription: 'Free age calculator tool. Calculate exact age from birthdate and discover total days, months, and hours lived.',
      keywords: ['age calculator', 'calculate age', 'date difference', 'birthday countdown']
    },
    faqs: [
      {
        question: 'Does this account for leap years?',
        answer: 'Yes, full date math precision is maintained including leap year calculations.'
      }
    ],
    schemaJson: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Age & Date Calculator',
      'applicationCategory': 'UtilitiesApplication'
    }
  },
  {
    id: 'lorem-generator',
    title: 'Lorem Ipsum Generator',
    tagline: 'Generate customizable dummy placeholder text for layouts and mockups.',
    description: 'Generate clean Lorem Ipsum text paragraphs, sentences, or word blocks. Perfect for designers, developers, and copywriters testing layout typography.',
    category: 'text',
    iconName: 'alignLeft',
    popular: false,
    seoMeta: {
      metaTitle: 'Lorem Ipsum Generator - Create Placeholder Text Online',
      metaDescription: 'Free online dummy text generator. Create paragraphs, sentences, or lists of classic Lorem Ipsum text for web designs.',
      keywords: ['lorem ipsum generator', 'dummy text maker', 'placeholder text generator']
    },
    faqs: [
      {
        question: 'Where does Lorem Ipsum come from?',
        answer: 'Lorem Ipsum is derived from classical Latin literature written by Cicero in 45 BC, modified into placeholder typesetting.'
      }
    ],
    schemaJson: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Lorem Ipsum Generator',
      'applicationCategory': 'DesignApplication'
    }
  },
  {
    id: 'hash-generator',
    title: 'Hash Generator & Diff Checker',
    tagline: 'Compute SHA-256 and SHA-1 hashes and compare text differences side-by-side.',
    description: 'Generate cryptographic hash digests (SHA-256, SHA-1) from text input using the browser\u2019s native Web Crypto API, and compare two text snippets to highlight exact line-by-line additions and deletions.',
    category: 'developer',
    iconName: 'shield',
    popular: false,
    seoMeta: {
      metaTitle: 'Hash Generator & Text Diff Tool - SHA256 & Diff Checker',
      metaDescription: 'Compute SHA-256 and SHA-1 cryptographic hashes, generate digests, and compare text differences online.',
      keywords: ['hash generator', 'sha256 generator', 'text diff checker', 'diff viewer']
    },
    faqs: [
      {
        question: 'Is SHA-256 safe for checksums?',
        answer: 'Yes, SHA-256 is an industry standard cryptographic hash function widely used for integrity checks.'
      }
    ],
    schemaJson: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Hash Generator & Diff Checker',
      'applicationCategory': 'DeveloperApplication'
    }
  }
];
