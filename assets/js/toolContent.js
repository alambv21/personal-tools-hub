/**
 * Long-form editorial content for each tool page.
 *
 * Tool pages were previously a widget plus a one-line description, which reads
 * as thin to both visitors and search engines. Each entry here adds several
 * hundred words explaining what the tool does, how to use it well, and where
 * it falls short.
 *
 * Keys match TOOLS_DATA ids. A missing key degrades gracefully: the page simply
 * shows the short description as before.
 */

export const TOOL_CONTENT = {
  'qr-generator': {
    intro: 'A QR code is a compact way to hand information to a phone without anyone typing it. This generator builds codes for links, plain text, phone numbers, email, SMS and WiFi credentials, and everything is produced inside your browser.',
    sections: [
      {
        heading: 'Choosing the right content type',
        body: `<p>The tabs at the top of the tool matter more than they first appear. A phone recognises a QR code's payload by its prefix, and that prefix is what makes a code open the dialer rather than a web page.</p>
        <p>Pick <strong>URL</strong> for anything that should open a website, and include the full address with <code>https://</code>. A code containing <em>example.com</em> without the scheme is treated as plain text by many scanners, so nothing happens when it is scanned.</p>
        <p><strong>WiFi</strong> encodes the network name, security type and password so a guest joins without typing anything. <strong>SMS</strong> and <strong>Email</strong> pre-fill a message, which is useful for feedback cards and support posters.</p>`
      },
      {
        heading: 'Error correction, and why the level matters',
        body: `<p>Every QR code carries redundant data so it still scans when part of it is obscured. Four levels are available, recovering from roughly 7%, 15%, 25% and 30% damage respectively.</p>
        <p>Higher correction is not automatically better. The redundancy has to be stored somewhere, so the pattern becomes denser for the same content. A dense code printed small is harder for a camera to resolve, which can make a high-correction code <em>less</em> reliable than a medium one.</p>
        <p>Level M is a sensible default. Move to H when you plan to place a logo over the centre, or when the code will be printed somewhere it is likely to be scuffed, such as equipment tagging or outdoor signage.</p>`
      },
      {
        heading: 'Sizing and contrast for real-world scanning',
        body: `<p>A practical rule is that a code should be about one tenth of the distance it will be scanned from. Read from arm's length, roughly 10 cm is comfortable. On a wall poster read from two metres, it needs to be around 20 cm across.</p>
        <p>Keep the blank margin around the pattern. That quiet zone is functional: scanners use it to find where the code begins, and cropping tightly to the pattern is a common reason codes fail.</p>
        <p>Contrast should stay strong, with a dark pattern on a light background. Light-on-dark works on some readers and fails on others, and mid-tone colour pairs that look elegant on screen often scan poorly in print.</p>`
      },
      {
        heading: 'A note on privacy and safety',
        body: `<p>A WiFi QR code stores the password in readable form. Anyone who photographs the code has your password permanently, so it suits a guest network rather than your main one.</p>
        <p>More broadly, QR codes are unreadable to humans, which makes them an effective way to disguise a destination. Stickers placed over legitimate codes on parking meters and restaurant tables are a known scam. Check the URL your phone previews before opening it, and treat codes that look stuck on rather than printed with suspicion.</p>`
      }
    ],
    tips: [
      'Include https:// in URLs, or many scanners treat the code as plain text.',
      'Test the downloaded code with a real phone camera before printing a batch.',
      'Shorten long links first — less data means a less dense, more reliable pattern.',
      'Use error correction H only when adding a logo or printing on rough surfaces.'
    ]
  },

  'pdf-kit': {
    intro: 'A complete set of PDF operations that run entirely inside your browser. Merge documents, extract page ranges, rotate pages, convert between PDF, Word and Excel, and place text or whiteout boxes on a page — without any file being uploaded to a server.',
    sections: [
      {
        heading: 'Why local processing matters here',
        body: `<p>Most free online PDF tools work by uploading your document, processing it on their infrastructure, and sending back a result. For a restaurant menu that is unremarkable. For an employment contract, a bank statement, a medical letter or a signed agreement, it means handing a complete copy to a company you know nothing about.</p>
        <p>Every operation in this toolkit runs locally using the browser's own capabilities. Your file is read into memory, transformed, and offered back as a download. Nothing is transmitted, which is why it works even with your connection disabled after the page has loaded.</p>`
      },
      {
        heading: 'Merging and page ranges',
        body: `<p>Merging appends documents in the order they are listed, which is worth checking before you run it: files are usually listed alphabetically by filename rather than in the order you intend. Use the arrows to reorder first.</p>
        <p>Page ranges accept a compact notation — <code>1-3, 5, 8-10</code> selects pages one through three, five, and eight through ten. Ranges are inclusive at both ends, so <code>1-3</code> yields three pages.</p>
        <p>One subtlety catches people out: page numbers refer to the physical position in the file, not the number printed on the page. A report with three cover pages before printed page 1 means that page is physically page 4.</p>`
      },
      {
        heading: 'Conversion, and what it can realistically do',
        body: `<p><strong>PDF to Word</strong> reads the text layer embedded in the document and rebuilds it as an editable file, detecting headings from font size and tables from column alignment. This works well for digitally created PDFs. It produces nothing at all for scans, because a scanned page is an image and contains no text to extract — that requires OCR, a different technology.</p>
        <p><strong>Word to PDF</strong> carries across headings, paragraphs, bold and italic runs, lists and simple tables. Complex layouts, embedded images and precise styling are simplified. Only the modern <code>.docx</code> format is supported.</p>
        <p><strong>Excel to PDF</strong> renders each worksheet as a table with a repeating header row, sized to fit the page. Formulas appear as their calculated values rather than the formula text.</p>`
      },
      {
        heading: 'Editing text, honestly',
        body: `<p>PDFs cannot be edited the way a word processor document can, and no browser tool can change that. Text in a PDF is stored as positioned glyphs drawn with embedded fonts rather than as editable sentences, so it cannot be re-flowed.</p>
        <p>What the Add Text and Whiteout tools do is place new content on top of the page. Cover an error with a white box and type the correction over it. That handles typos, form filling and dating a document, which covers most everyday needs.</p>
        <p>One important caution: a whiteout box hides content visually but the original text may remain extractable underneath. Never rely on it to redact confidential information. Genuine redaction means removing the content from the source document before the PDF is created.</p>`
      }
    ],
    tips: [
      'Password-protected PDFs must be unlocked before any tool can read them.',
      'Extract only the pages you need before converting — fewer pages, fewer things to go wrong.',
      'For heavy editing, convert to Word, edit there, and convert back.',
      'If a file refuses to load, opening and re-saving it in a PDF reader sometimes repairs the structure.'
    ]
  },

  'image-compressor': {
    intro: 'Resize and compress JPG, PNG and WebP images with a live preview of the file size you save. Images are processed on a canvas inside your browser, so nothing is uploaded and the originals on your device are never modified.',
    sections: [
      {
        heading: 'Resize before you compress',
        body: `<p>Most oversized images are large because nobody resized them, not because the compression setting was wrong. A phone photograph is commonly around 4000 pixels wide. Displayed in an article at 800 pixels, that means the visitor downloads roughly twenty-five times more pixel data than their screen will ever use.</p>
        <p>Decide how wide the image will actually appear and resize to roughly twice that, which keeps it crisp on high-density screens without waste. Useful starting points are 1600–1920 pixels for a full-width banner, 800–1200 for an in-article image, and 200–400 for a thumbnail.</p>`
      },
      {
        heading: 'Picking a format',
        body: `<p>Format choice can change file size by a factor of ten. <strong>WebP</strong> typically produces files 25–35% smaller than a comparable JPEG and supports transparency, making it the sensible default for anything staying on the web.</p>
        <p><strong>JPEG</strong> remains the most universally compatible choice and suits photographs that will be emailed or opened in unknown software. It has no transparency at all.</p>
        <p><strong>PNG</strong> is lossless and keeps transparency, which makes it right for logos, screenshots and anything containing text. It is the wrong choice for photographs: saving a photo as PNG is the most common way to accidentally make a file larger instead of smaller.</p>`
      },
      {
        heading: 'Finding the quality setting by eye',
        body: `<p>Quality sliders are not percentages of visual fidelity, and there is no universally correct number. Start at 80 and compare the result against the original at the size it will actually be displayed, rather than zoomed in.</p>
        <p>Compression artefacts appear in predictable places. Watch smooth gradients such as skies, which develop visible banding; areas of flat colour, which become blotchy; and the edges around text, which develop a faint halo. Busy, detailed photographs hide compression well and often tolerate 65 or lower.</p>`
      },
      {
        heading: 'What cannot be undone',
        body: `<p>Reducing dimensions permanently discards pixels. Shrinking a 4000-pixel photo to 800 and later needing it large again means the detail is genuinely gone, and enlarging the small copy will look soft.</p>
        <p>Lossy compression is equally one-way. Always keep your originals somewhere and treat compressed versions as disposable exports. Compressing an already-compressed JPEG stacks artefacts on artefacts, so always start from the original file rather than a previous export.</p>`
      }
    ],
    tips: [
      'Exporting a transparent PNG as JPEG fills transparent areas with white, not black.',
      'Do all cropping and colour correction first, then compress once as the final step.',
      'Re-encoding through the browser generally strips EXIF metadata, including GPS location.',
      'If a change saves only a few percent, it is not worth the quality cost.'
    ]
  },

  'resume-builder': {
    intro: 'Build a clean, professional resume with a live preview and export it to PDF or an editable Word document. Your draft is stored only in your own browser, so nothing is uploaded and no account is required.',
    sections: [
      {
        heading: 'Write results, not responsibilities',
        body: `<p>This single change does more than any formatting decision. "Responsible for quality inspections" describes a job title. "Inspected 400+ items of lifting equipment annually, cutting failed re-inspections by 30% through a revised pre-check procedure" describes a person.</p>
        <p>A useful pattern is: what you did, how you did it, and what changed as a result. Not every line will have a clean number, and inventing one is worse than having none — but most people underestimate how much of their work is measurable. Volume handled, time saved, errors reduced, people trained, cost avoided.</p>`
      },
      {
        heading: 'Formatting that survives automated screening',
        body: `<p>Applicant tracking systems are widely misunderstood. They are mostly databases, and their common failure is not rejecting good candidates on merit but failing to parse the file at all, so your experience is never recorded.</p>
        <p>Parsing breaks on text inside images, complex multi-column layouts that get read across instead of down, critical details placed in headers and footers, and tables used for visual layout. The templates here deliberately use a single-column structure with standard fonts and clear section headings for that reason.</p>
        <p>Both exports produce real selectable text rather than an image, which is the baseline requirement. If you cannot highlight a sentence with your cursor, neither can a screening system.</p>`
      },
      {
        heading: 'PDF or Word, and which to send',
        body: `<p>Send a PDF unless the employer asks otherwise, because it renders identically everywhere. Choose Word when a job portal specifically requires <code>.docx</code>, when a recruiter needs to edit it before passing it on, or when you want to keep refining the wording.</p>
        <p>One important limitation: the PDF export uses built-in fonts that cover Latin characters only. If your resume contains Bangla, Arabic or CJK text, use the Word export, which handles every script correctly. You can export a PDF from Word afterwards.</p>`
      },
      {
        heading: 'Length and what to cut',
        body: `<p>One page suits early-career applicants; two pages is widely accepted once you have several substantial roles. Beyond that you need a strong reason.</p>
        <p>Cut first: roles from more than fifteen years ago, duties any holder of the title would have had, and generic claims like "hard working" that carry no information. A full street address is unnecessary — city and country is enough and better for privacy.</p>`
      }
    ],
    tips: [
      'Your draft saves automatically in this browser, but not across devices — download anything important.',
      'Mirror the exact wording of the job posting, including both abbreviations and spelled-out terms.',
      'Name the exported file sensibly, such as Your-Name-Resume.pdf.',
      'Read it aloud before sending; awkward phrasing is easier to hear than to see.'
    ]
  },

  'password-generator': {
    intro: 'Generate strong random passwords with control over length and character sets. Generation uses the browser\'s cryptographic random number source, and nothing is transmitted or stored.',
    sections: [
      {
        heading: 'Length matters more than complexity',
        body: `<p>Each additional character multiplies the number of possibilities an attacker must try, and that multiplication compounds far faster than adding symbol variety to a short password. A twelve-character password is dramatically harder to brute-force than an eight-character one, and the gap widens enormously at sixteen.</p>
        <p>If you change one thing about your passwords, make them longer. Sixteen characters is a reasonable modern default for anything generated rather than memorised.</p>`
      },
      {
        heading: 'Why "P@ssw0rd1!" fails every requirement test it passes',
        body: `<p>It satisfies the classic rules — uppercase, lowercase, number, symbol, eight characters — and is among the first things any real attack tries.</p>
        <p>Attackers do not guess randomly. They start with lists of leaked passwords, then apply the exact substitutions humans predictably make: a becomes @, o becomes 0, append a number, append an exclamation mark. Those transformations are built into cracking tools, so a predictable pattern applied to a common word adds almost nothing.</p>
        <p>Randomly generated strings avoid this entirely because there is no underlying word and no pattern to exploit.</p>`
      },
      {
        heading: 'Reuse is the real vulnerability',
        body: `<p>Here is the uncomfortable part: password strength often does not matter, because the most common route to a compromised account has nothing to do with guessing.</p>
        <p>When a company suffers a breach, attackers obtain email and password pairs, then try those same pairs on banks, email providers and shopping sites automatically and at enormous scale. This is credential stuffing, and it works because most people reuse passwords.</p>
        <p>A perfect password used across ten sites is weaker in practice than ten mediocre passwords used once each. This is the argument for a password manager: it makes unique passwords everywhere practical, since you only memorise one.</p>`
      }
    ],
    tips: [
      'Generate a unique password per site and store them in a password manager.',
      'Turn on two-factor authentication for important accounts; an authenticator app beats SMS.',
      'Stop rotating passwords on a schedule — change them when there is a reason to.',
      'Nothing generated here is logged or transmitted; close the tab and it is gone.'
    ]
  },

  'json-formatter': {
    intro: 'Format, minify and validate JSON with clear error reporting. Useful for reading API responses, debugging configuration files, and checking that data is well-formed before sending it anywhere.',
    sections: [
      {
        heading: 'The errors behind almost every failure',
        body: `<p>JSON has a deliberately tiny specification, so nearly every parsing error comes from a short list. <strong>Trailing commas</strong> are the most common: a comma after the last item is valid JavaScript and invalid JSON.</p>
        <p><strong>Single quotes</strong> are the next. JSON requires double quotes for both keys and string values, so <code>{ 'name': 'value' }</code> fails despite being perfectly good JavaScript. <strong>Unquoted keys</strong> fail for the same underlying reason.</p>
        <p>Those last two share a root cause worth internalising: JSON looks like JavaScript object syntax but is a stricter, separate format. Anything copied out of code needs checking rather than assuming.</p>`
      },
      {
        heading: 'Reading the error position',
        body: `<p>Parsers report something like <em>Unexpected token } at position 47</em>. Two things help. The position is where the parser <em>noticed</em> the problem, which is often just after where you made it — a missing comma on one line is typically reported at the start of the next.</p>
        <p>And "unexpected end of input" almost always means an unclosed bracket or brace. Formatting the document is the fastest way to find it, because proper indentation makes an unbalanced structure immediately visible.</p>`
      },
      {
        heading: 'What JSON does not support',
        body: `<p>JSON has strings, numbers, booleans, null, objects and arrays. It has no <code>undefined</code>, no <code>NaN</code>, no <code>Infinity</code>, no functions and — the practical one — no date type. Dates are conventionally stored as ISO 8601 strings such as <code>"2026-08-19T10:30:00Z"</code>.</p>
        <p>There is also no comment syntax. Neither <code>//</code> nor <code>/* */</code> is permitted, which surprises people writing configuration files. The usual workaround is a throwaway key such as <code>"_comment"</code>.</p>`
      }
    ],
    tips: [
      'Format first — indentation alone reveals most structural problems.',
      'Escape backslashes in Windows paths: C:\\\\Users\\\\file, not C:\\Users\\file.',
      'Leading zeros are invalid in numbers; if they matter, it is a string.',
      'For a very large document, validate it in halves to narrow down the problem.'
    ]
  },

  'base64-tool': {
    intro: 'Encode text to Base64 and decode it back, with correct UTF-8 handling so accented characters, Bangla and emoji survive the round trip intact.',
    sections: [
      {
        heading: 'What Base64 is for',
        body: `<p>Many systems were designed to carry plain text and nothing else. Email is the classic example: the original protocols assumed 7-bit ASCII, so anything outside that range could be mangled in transit.</p>
        <p>Base64 re-expresses arbitrary binary data using only 64 characters that travel safely everywhere. The data is unchanged in meaning, just written in a safer alphabet. The cost is size: every three bytes become four characters, so encoded data is roughly 33% larger than the original.</p>`
      },
      {
        heading: 'It is not security, and that matters',
        body: `<p>Base64 is not encryption and protects nothing. There is no key, anyone can decode it instantly, and it is trivially recognisable by its character set and padding.</p>
        <p>This is worth stating plainly because the mistake appears in real systems: credentials Base64-encoded in configuration files or request headers, treated as though they were protected. They are not. Putting a password in Base64 is equivalent to writing it out plainly, with an extra step that fools nobody.</p>`
      },
      {
        heading: 'Where decoding usually goes wrong',
        body: `<p>Standard Base64 uses <code>+</code> and <code>/</code> as its final two characters, both of which have special meaning in URLs. A URL-safe variant substitutes <code>-</code> and <code>_</code>, and a mismatch between the two is a common cause of decode failures.</p>
        <p>Missing padding is the other. Some systems strip the trailing <code>=</code> characters, and stricter decoders then reject the input.</p>
        <p>If a decoded string looks corrupted while the plain ASCII parts are fine, the cause is almost always a character-encoding mismatch rather than a Base64 problem — the bytes decoded correctly but were interpreted with the wrong text encoding.</p>`
      }
    ],
    tips: [
      'Base64 is for safe transport, not confidentiality — use HTTPS for the latter.',
      'Data URIs suit tiny icons; the 33% overhead makes them wasteful for larger images.',
      'JSON has no binary type, which is why binary payloads are usually Base64 encoded.',
      'Whitespace and line breaks in encoded input are ignored here and decode fine.'
    ]
  },

  'word-counter': {
    intro: 'Count words, characters, sentences, paragraphs and estimated reading time as you type. Useful for essays with strict limits, meta descriptions, social posts and anything with a word target.',
    sections: [
      {
        heading: 'Which count you actually need',
        body: `<p>Different counts answer different questions. <strong>Characters</strong> matter where a system imposes a hard limit: form fields, SMS, meta tags, database columns. Note that spaces usually count toward such limits.</p>
        <p><strong>Words</strong> are the standard for essays and articles, though definitions differ slightly at the edges. Hyphenated terms and numbers are handled inconsistently between tools, so small discrepancies against a word processor are normal and not worth worrying about.</p>
        <p><strong>Sentences and paragraphs</strong> are the most neglected and arguably most useful. If your average sentence runs beyond 25 words, the writing is probably harder to follow than it needs to be.</p>`
      },
      {
        heading: 'Common targets',
        body: `<p>Academic essays should follow the stated limit exactly, and many institutions penalise work outside a tolerance band of around 10%. Check whether references and appendices count, because the rules vary and the difference is often several hundred words.</p>
        <p>Blog posts and articles: under 300 words rarely says enough to be useful, and most substantial pieces land between 700 and 1,500. Professional emails work best under 200 words — short emails get replies, long ones get postponed. Meta descriptions are truncated by search engines at around 155 characters.</p>`
      },
      {
        heading: 'Reading time as a better measure',
        body: `<p>Average adult reading speed for general text is roughly 200 to 250 words per minute, so a 1,000 word article is about a four to five minute read.</p>
        <p>This framing is often more useful than a raw count, because it connects to the reader's experience. "Is this worth five minutes of someone's time?" is a sharper question than "is this long enough?" Technical material is read considerably slower, so a dense piece may take twice the estimate.</p>`
      }
    ],
    tips: [
      'Write first without watching the counter, then check — targets distort drafting.',
      'Far under target usually means missing substance, not missing words.',
      'Far over target: cut a whole weaker section rather than trimming every sentence.',
      'Text stays in your browser; nothing is sent anywhere as you type.'
    ]
  },

  'case-converter': {
    intro: 'Convert text between upper case, lower case, title case, sentence case, camelCase, snake_case and kebab-case. Useful for cleaning up pasted content, normalising headings, and formatting identifiers for code.',
    sections: [
      {
        heading: 'Which case to use where',
        body: `<p><strong>Sentence case</strong> capitalises only the first word and proper nouns. It is the standard for body text and, increasingly, for headings — it reads more naturally and is the default in most modern style guides.</p>
        <p><strong>Title Case</strong> capitalises major words. Conventions differ between style guides on which small words stay lower case, so consistency within a document matters more than picking the "correct" variant.</p>
        <p><strong>UPPER CASE</strong> is worth using sparingly. Blocks of capitals are measurably slower to read because the uniform letter height removes the word-shape cues readers rely on, and in messages it is widely read as shouting.</p>`
      },
      {
        heading: 'Programming conventions',
        body: `<p>The identifier cases are not interchangeable, and each ecosystem has settled conventions. <code>camelCase</code> is standard for variables in JavaScript and Java. <code>snake_case</code> dominates Python and SQL column names. <code>kebab-case</code> is used for URLs, CSS class names and HTML attributes, since those contexts treat underscores and capitals inconsistently.</p>
        <p>URLs in particular should use hyphens rather than underscores — search engines have long treated hyphens as word separators and underscores as joiners.</p>`
      },
      {
        heading: 'When conversion needs a human check',
        body: `<p>Automatic case conversion cannot know your intent. Acronyms are the clearest example: converting "NASA launched a probe" to title case is fine, but converting text that is entirely upper case back to sentence case will turn "NASA" into "Nasa".</p>
        <p>Proper nouns have the same problem in reverse. Always read the result rather than trusting it, particularly for names, brands and technical terms with unusual capitalisation.</p>`
      }
    ],
    tips: [
      'Converting from ALL CAPS loses acronym and proper-noun information — check names afterwards.',
      'Use kebab-case for URLs; hyphens are treated as word separators by search engines.',
      'Sentence case for headings is now the more common house style than Title Case.',
      'Conversion happens as you type and nothing leaves your browser.'
    ]
  },

  'unit-converter': {
    intro: 'Convert between units of length, mass, temperature, volume, speed and data storage. Conversions use standard factors and update as you type.',
    sections: [
      {
        heading: 'Why temperature works differently',
        body: `<p>Most unit conversions are a simple multiplication: a kilometre is always 1,000 metres regardless of the value. Temperature is not, because the scales have different zero points as well as different step sizes.</p>
        <p>Converting Celsius to Fahrenheit requires both a multiplication and an offset, which is why 0°C is 32°F rather than 0°F. This tool handles that separately from the ratio-based categories, so results are correct across the full range including negative values.</p>`
      },
      {
        heading: 'Data storage and the 1000 versus 1024 question',
        body: `<p>There is a genuine ambiguity here worth knowing about. Historically a kilobyte meant 1,024 bytes, following the binary powers computers naturally work in. The SI standard defines the kilo prefix as 1,000, and the binary values were later given separate names — kibibyte, mebibyte, gibibyte.</p>
        <p>In practice, operating systems and storage manufacturers disagree. This is why a drive sold as 1 TB shows as roughly 931 GB once connected: the manufacturer counted in powers of 1,000 and the operating system displayed powers of 1,024. This tool uses the binary convention, which matches what your computer reports.</p>`
      },
      {
        heading: 'Precision and rounding',
        body: `<p>Results are rounded for readability, which is almost always what you want. Be aware that chaining conversions compounds rounding: converting inches to centimetres to metres and back will not always return exactly the starting number.</p>
        <p>For anything where precision genuinely matters — engineering tolerances, dosage calculations, legal measurements — convert once directly from the source unit to the target unit rather than stepping through intermediates, and keep the original figure alongside the converted one.</p>`
      }
    ],
    tips: [
      'Switching category clears the fields deliberately, so a value is never reinterpreted in the wrong unit.',
      'Temperature conversions handle negatives correctly, including below absolute zero warnings.',
      'A 1 TB drive showing as 931 GB is the 1000-versus-1024 difference, not a fault.',
      'For critical measurements, convert directly rather than through intermediate units.'
    ]
  },

  'age-calculator': {
    intro: 'Calculate exact age in years, months and days from a date of birth, along with totals in weeks, days and hours and a countdown to the next birthday.',
    sections: [
      {
        heading: 'How age is calculated',
        body: `<p>Age is measured in completed years, months and days rather than as a decimal. Someone born on 15 March 1990 turns 36 on 15 March 2026 — not partway through, and not on any other date.</p>
        <p>The month arithmetic handles varying month lengths correctly. Counting from 31 January to 28 February gives 28 days rather than rolling into an invalid 31 February, which is a common source of off-by-a-day errors in simpler calculators.</p>`
      },
      {
        heading: 'Leap years and 29 February',
        body: `<p>Anyone born on 29 February has a birthday that exists only every four years. There is no universal rule for which date they "become" a year older in common years, and jurisdictions genuinely differ — some treat 28 February as the anniversary, others 1 March.</p>
        <p>This calculator counts completed years from the birth date, which is the mathematically consistent approach. For legal purposes such as age of majority, the applicable local rule takes precedence over any calculator.</p>`
      },
      {
        heading: 'Practical uses',
        body: `<p>Beyond curiosity, exact age matters for eligibility thresholds — school entry, retirement, insurance bands and visa requirements often hinge on age at a specific date rather than in the current year.</p>
        <p>The total-days figure is useful for milestone planning, and the countdown is handy for anyone organising events. Note that all calculations use your device's clock and local timezone, so a device with an incorrect date will produce an incorrect result.</p>`
      }
    ],
    tips: [
      'Results depend on your device clock — check it if a figure looks wrong.',
      'For legal age thresholds, confirm the applicable local rule rather than relying on any calculator.',
      'Dates are processed in your browser and never transmitted.',
      'Use the total-days figure for milestone anniversaries such as 10,000 days.'
    ]
  },

  'bmi-calculator': {
    intro: 'Calculate Body Mass Index in metric or imperial units, see where it falls on the World Health Organization category scale, and compare reference weight ranges from standard clinical formulas.',
    sections: [
      {
        heading: 'What BMI actually measures',
        body: `<p>Body mass index is weight in kilograms divided by the square of height in metres. That is the entire calculation — it uses no other information: not age, not sex, not body composition, not medical history.</p>
        <p>The formula dates to the 1830s, devised by Belgian statistician Adolphe Quetelet, who was studying characteristics of populations. It was never intended as a measure of an individual's health, and Quetelet said as much.</p>`
      },
      {
        heading: 'Where the categories come from',
        body: `<p>The familiar bands published by the World Health Organization for adults are: below 18.5 underweight, 18.5 to 24.9 healthy weight, 25.0 to 29.9 overweight, and 30.0 and above obese.</p>
        <p>These thresholds were derived from statistical associations across large populations, predominantly of European descent. They describe where health risks tend to rise on average across thousands of people. They do not describe what is happening in any particular body, and the boundaries are conventions rather than sharp biological transitions — nothing meaningful changes between 24.9 and 25.0.</p>`
      },
      {
        heading: 'What BMI cannot see',
        body: `<p>It cannot distinguish muscle from fat. Muscle is denser, so a very muscular person can register as overweight while carrying little body fat — the most frequently cited limitation.</p>
        <p>It cannot see where fat is stored, although research consistently finds abdominal fat carries different implications than fat on the hips and thighs. And it says nothing about blood pressure, blood sugar, cholesterol or fitness, all of which are measurable and relevant.</p>
        <p>It is especially unreliable for children and adolescents, who need age- and sex-specific growth charts; for older adults, whose muscle mass and height change; during pregnancy; and for athletes. Several health bodies also recommend lower thresholds for people of South Asian and East Asian descent, where elevated risk appears at lower BMI values.</p>`
      },
      {
        heading: 'The ideal weight formulas',
        body: `<p>The Devine, Robinson and Hamwi formulas calculate a weight from height and sex. It is worth knowing their origin: the Devine formula was published in 1974 to help calculate medication dosages, not to advise people on body weight.</p>
        <p>They are simple linear formulas, they disagree with each other by design, and none reflects your build or body composition. Read them as rough reference points rather than targets.</p>`
      }
    ],
    tips: [
      'BMI is a population screening measure, not a diagnosis or a measure of health.',
      'Switching between metric and imperial clears the fields so values are never misread.',
      'Waist circumference is often more informative than BMI alone.',
      'For anything concerning your own health, a doctor who knows your history is a far better guide.'
    ],
    disclaimer: 'This calculator provides general information only and is not medical advice. Consult a qualified healthcare professional about your own health.'
  },

  'hash-generator': {
    intro: 'Generate SHA-256 and SHA-1 hashes from text using the browser\'s native Web Crypto API, and compare two pieces of text to see exactly what changed between them.',
    sections: [
      {
        heading: 'What a hash is and why it is useful',
        body: `<p>A hash is a fixed-length fingerprint of data. Feed in one word or a two-gigabyte file and SHA-256 returns exactly 64 hexadecimal characters.</p>
        <p>The same input always produces the same hash, on any machine, forever. Change one character and the output changes completely — not slightly, but unrecognisably. That avalanche property is what makes hashes good at detecting tampering: there is no such thing as a close match.</p>
        <p>Hashing is one-way. You cannot reverse a hash to recover the original, and there is no decryption step. Hashing is not encryption.</p>`
      },
      {
        heading: 'Why MD5 and SHA-1 are no longer trusted',
        body: `<p>Both were once standard and both are now broken for security purposes, because researchers demonstrated practical ways to construct two different files sharing a hash. Once that is possible, a hash no longer proves a file is unmodified.</p>
        <p>SHA-1 is offered here for compatibility with older systems that still use it, and it remains adequate for detecting accidental corruption. For anything where deliberate tampering is a concern, SHA-256 is the sensible minimum. MD5 is not offered at all — browsers deliberately exclude it from their cryptography API.</p>`
      },
      {
        heading: 'What a checksum does and does not prove',
        body: `<p>Comparing a downloaded file's hash against a published value confirms the file matches what was published. Identical means byte-for-byte the same; different means something changed.</p>
        <p>But a checksum only proves the file matches <em>the value you compared it against</em>. If an attacker controls the website, they can replace both the file and the published checksum. Checksums therefore protect mainly against accidental corruption and tampering in transit. Protection against a compromised source requires a digital signature, which uses a key the attacker does not hold.</p>`
      },
      {
        heading: 'A caution about passwords',
        body: `<p>Hashes are how well-built systems store passwords, but plain SHA-256 is the wrong tool for it. It is designed to be fast, and speed helps an attacker testing billions of candidates.</p>
        <p>Password storage uses deliberately slow algorithms such as bcrypt, scrypt or Argon2, plus a random salt per password so identical passwords do not produce identical hashes. Reaching for SHA-256 alone is a well-known mistake if you are ever building a system that stores credentials.</p>`
      }
    ],
    tips: [
      'You need not compare all 64 characters by eye — the first and last six is enough in practice.',
      'A hash tells you whether something differs; the diff checker tells you what differs.',
      'Hashing happens locally via the Web Crypto API; your text is never transmitted.',
      'For security-critical downloads, look for a digital signature rather than only a checksum.'
    ]
  }
};
