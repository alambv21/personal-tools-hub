export const SITE_URL = 'https://dailytoolkits.com';

export const GUIDES = [
  {
    slug: 'webp-vs-jpeg-vs-png',
    title: 'WebP vs JPEG vs PNG: Which Image Format Should You Actually Use?',
    description: 'A practical comparison of WebP, JPEG, and PNG covering file size, transparency, quality loss, and browser support, with clear rules for choosing between them.',
    keywords: 'webp vs jpeg, png vs jpeg, image formats, best image format for web, image compression',
    updated: '2026-08-01',
    tool: { id: 'image-compressor', label: 'Image Compressor & Resizer' },
    readMinutes: 6,
    body: `
<p class="lead">Choosing an image format sounds like a technical detail, but it is usually the single biggest factor in how fast your page loads. Pick badly and a photo that should weigh 80 KB arrives as 2 MB. Here is how the three formats actually differ, and a simple rule for each situation.</p>

<h2>The one distinction that matters: lossy vs lossless</h2>
<p>Every other difference follows from this. <strong>Lossy</strong> compression (JPEG, and WebP in its usual mode) permanently throws away visual detail your eye is unlikely to miss. Each time you re-save, more detail disappears. <strong>Lossless</strong> compression (PNG, and WebP in lossless mode) stores every pixel exactly, so the file survives unlimited re-saves unchanged.</p>
<p>This is why a photograph saved as PNG can be ten times larger than the same photograph as JPEG. PNG is not doing a bad job; it is doing a different job. It is faithfully recording the noise and subtle gradients in a photo that JPEG is designed to discard.</p>

<h2>JPEG</h2>
<p>JPEG has been the default photographic format since the early 1990s, and its universality is its real strength. Every browser, phone, printer, and ancient piece of software opens a JPEG without complaint.</p>
<p>It compresses photographs extremely well because its algorithm assumes the image contains smooth gradients and gradual colour transitions, which is exactly what a camera produces. Its weaknesses appear when that assumption breaks. Sharp edges, particularly text and line art, develop visible smudging around them, often called ringing or mosquito noise. JPEG also has no transparency at all: there is no way to make part of a JPEG see-through.</p>
<p><strong>Use JPEG for:</strong> photographs, especially where maximum compatibility matters, such as email attachments or files someone will open in unknown software.</p>

<h2>PNG</h2>
<p>PNG was designed for exactly what JPEG is bad at: flat colours, sharp edges, and transparency. A screenshot of an interface, a logo, a chart, or a diagram will look crisp as PNG and slightly mushy as JPEG.</p>
<p>PNG also supports an alpha channel, meaning each pixel can be partially transparent. That is what lets a logo sit cleanly over any background colour instead of arriving in a white box.</p>
<p>The cost is size. Because PNG records every pixel exactly, a detailed photograph becomes enormous. If you have ever compressed a photo and watched the file get <em>bigger</em>, you almost certainly converted it to PNG.</p>
<p><strong>Use PNG for:</strong> logos, icons, screenshots, diagrams, and anything needing transparency.</p>

<h2>WebP</h2>
<p>WebP is the modern option, and it is unusual in that it does both jobs. It has a lossy mode that typically produces files 25 to 35 percent smaller than a JPEG of comparable visual quality, and a lossless mode that usually beats PNG. Crucially, unlike JPEG, WebP supports transparency in both modes.</p>
<p>Browser support is no longer a real concern. Every current version of Chrome, Firefox, Safari, and Edge handles WebP. The remaining friction is outside the browser: some older desktop software, a few email clients, and certain print workflows still do not recognise it.</p>
<p><strong>Use WebP for:</strong> almost all images on a website, which is the situation most people are in.</p>

<h2>A simple decision rule</h2>
<ul>
  <li>Image going on a web page, and you control the page? <strong>WebP.</strong></li>
  <li>Needs transparency and must work everywhere? <strong>PNG.</strong></li>
  <li>Photograph someone will download, email, or open in unknown software? <strong>JPEG.</strong></li>
  <li>Logo, screenshot, chart, or anything with text in it? <strong>PNG</strong>, or lossless WebP if it stays on the web.</li>
</ul>

<h2>Three mistakes worth avoiding</h2>
<p><strong>Re-saving JPEGs repeatedly.</strong> Every save discards more detail, and the loss compounds. Editing the same JPEG ten times leaves visible artefacts. Keep an original in a lossless format and export copies from it.</p>
<p><strong>Using PNG for photographs.</strong> This is the most common cause of a needlessly heavy page. If the image came from a camera, PNG is almost never right.</p>
<p><strong>Chasing 100 percent quality.</strong> The difference between quality 80 and quality 100 is usually invisible on screen, while the file can easily double. Start around 80 and lower it until you can actually see a problem.</p>

<h2>One thing compression cannot undo</h2>
<p>Reducing an image's dimensions permanently discards pixels. If you shrink a 4000-pixel-wide photo to 800 pixels and later need it large again, enlarging the small copy will look soft and blurry: the detail is genuinely gone. Always keep your originals and treat compressed versions as disposable exports.</p>
`
  },
  {
    slug: 'how-to-compress-images-without-losing-quality',
    title: 'How to Compress Images Without Obviously Losing Quality',
    description: 'A step-by-step method for shrinking image file sizes while keeping them looking sharp, including how to pick a quality setting and the right dimensions.',
    keywords: 'compress images, reduce image file size, image optimization, resize images, compress jpg',
    updated: '2026-08-01',
    tool: { id: 'image-compressor', label: 'Image Compressor & Resizer' },
    readMinutes: 5,
    body: `
<p class="lead">Most oversized images are not oversized because of the compression setting. They are oversized because nobody resized them. Fixing that one thing usually does more than every other technique combined.</p>

<h2>Step one: fix the dimensions first</h2>
<p>A modern phone photograph is commonly around 4000 pixels wide. A blog post displays images at perhaps 800 pixels wide. Sending the full-size file means the visitor downloads roughly twenty-five times more pixel data than their screen will ever show, then waits while their browser throws most of it away.</p>
<p>Before touching quality settings, decide how wide the image will actually appear and resize to roughly that. Useful starting points:</p>
<ul>
  <li>Full-width banner: 1600 to 1920 pixels wide</li>
  <li>In-article image: 800 to 1200 pixels wide</li>
  <li>Thumbnail or avatar: 200 to 400 pixels wide</li>
</ul>
<p>A reasonable habit is to export at roughly twice the display width, which keeps images sharp on high-density screens without going overboard.</p>

<h2>Step two: choose the right format</h2>
<p>Format choice can swing file size by a factor of ten. Photographs belong in WebP or JPEG. Logos, screenshots, and anything containing text belong in PNG or lossless WebP. Saving a photo as PNG is the single most common way to accidentally make a file larger instead of smaller.</p>

<h2>Step three: find the quality setting by eye</h2>
<p>Quality sliders are not percentages of visual fidelity, and there is no universally correct number. What works is a quick comparison.</p>
<p>Start at 80. Look at the result next to the original at the size it will actually be displayed, not zoomed in to 400 percent. If you cannot tell them apart, go lower and look again. Stop at the point where you first notice something wrong.</p>
<p>Where problems appear first is predictable. Watch smooth gradients such as skies, which develop visible banding; areas of flat colour, which develop blotches; and edges around text or sharp lines, which develop a faint halo. Busy, detailed photographs hide compression well and can often go to 65 or lower. Images with large smooth areas need more care.</p>

<h2>Step four: check the actual saving</h2>
<p>If a change saves 3 percent, it is not worth the quality cost. Compression is worth doing when it produces a large reduction, and most images have an obvious sweet spot where the file drops dramatically before quality visibly suffers.</p>

<h2>What "without losing quality" honestly means</h2>
<p>Lossy compression always discards information. The realistic goal is discarding only what a viewer will not notice under normal conditions, not discarding nothing.</p>
<p>If you truly need zero loss, your options are lossless formats such as PNG or lossless WebP, and your savings will be far more modest. That is the right choice for archival masters, print originals, and images that will be edited repeatedly, and unnecessary for a photo on a web page.</p>

<h2>Practical habits that help</h2>
<p><strong>Keep originals.</strong> Compression and resizing are one-way. Store the full-resolution file somewhere and export copies for each use.</p>
<p><strong>Do not compress twice.</strong> Compressing an already-compressed JPEG stacks artefacts on artefacts. Always start from the original.</p>
<p><strong>Compress last.</strong> Do all cropping, colour correction, and editing first, then compress once as the final export.</p>
<p><strong>Mind privacy.</strong> Photos carry EXIF metadata, which can include GPS coordinates of where the picture was taken. Re-encoding through a browser-based tool generally drops this, which is usually what you want before publishing.</p>
`
  },
  {
    slug: 'pdf-to-word-conversion-guide',
    title: 'Converting PDF to Word: What Actually Works and What Does Not',
    description: 'An honest explanation of why PDF to Word conversion is imperfect, what determines whether it will work on your file, and how to get the best result.',
    keywords: 'pdf to word, convert pdf, pdf to docx, edit pdf, scanned pdf ocr',
    updated: '2026-08-01',
    tool: { id: 'pdf-kit', label: 'PDF Toolkit' },
    readMinutes: 6,
    body: `
<p class="lead">PDF to Word conversion has a reputation for being unreliable, and that reputation is deserved. The reason is not bad software. It is that the two formats are built on fundamentally incompatible ideas, and understanding that difference tells you exactly when conversion will work well.</p>

<h2>Why PDFs resist editing</h2>
<p>A Word document stores meaning. It knows this block is a heading, that block is a paragraph, and these items form a bulleted list. Change the page size and everything reflows automatically, because the document describes structure.</p>
<p>A PDF stores appearance. It says: draw this character at this exact coordinate in this font at this size, then draw the next one. There is often no stored concept of a paragraph at all, only a series of positioned glyphs that happen to look like one to a human reader.</p>
<p>Converting PDF to Word therefore means reverse-engineering meaning from appearance. Software has to infer that characters sharing a vertical position form a line, that consecutive lines with tight spacing form a paragraph, that a larger font size indicates a heading. Those inferences are usually right and sometimes wrong.</p>

<h2>The single biggest factor: is there a text layer?</h2>
<p>This determines everything, and it splits PDFs into two categories that behave completely differently.</p>
<p>A <strong>digitally created</strong> PDF, exported from Word, a browser, or design software, contains real text data. Conversion can extract that text accurately, and results are generally good.</p>
<p>A <strong>scanned</strong> PDF is a photograph of paper. To a computer it is a picture, with no text inside it whatsoever. No amount of conversion will extract text, because there is no text to extract. Getting words out requires OCR (optical character recognition), which is an entirely different technology: it examines the image and guesses at the letters, introducing its own errors.</p>
<p>You can tell which you have in seconds. Open the PDF and try to select a sentence with your cursor. If individual words highlight, there is a text layer. If you can only draw a rectangle over the page, it is a scan.</p>

<h2>What converts well</h2>
<p>Straightforward, mostly-text documents convert reliably: reports, letters, articles, contracts, and manuscripts. Single-column layouts with clear headings are the ideal case. Text content, reading order, and headings usually come across intact.</p>

<h2>What converts badly</h2>
<p>Complex layouts are where conversion falls apart. Multi-column pages often interleave columns incorrectly, because the software must guess whether to read across or down. Tables frequently lose their structure and arrive as loose lines of text, since a PDF table is often just lines and text drawn near each other with nothing marking it as a table. Headers, footers, and page numbers get mixed into the body. Precise positioning, text boxes, and unusual fonts rarely survive.</p>

<h2>Getting the best result</h2>
<p><strong>Find the source file.</strong> This is the advice people skip, and it is by far the best option. If the PDF came from a Word document, someone has that document. Five minutes of asking beats any conversion.</p>
<p><strong>Convert only what you need.</strong> If you need three pages from a sixty-page report, extract those pages first. Less content means fewer things to go wrong.</p>
<p><strong>Expect to fix formatting.</strong> Treat conversion as recovering the text, not the design. Getting words into an editable file and reformatting is usually far faster than retyping.</p>
<p><strong>Rebuild tables manually.</strong> For anything where table structure matters, it is generally quicker to recreate the table than to repair a mangled conversion.</p>

<h2>When you only need a small change</h2>
<p>If you are converting to Word purely to fix a typo or fill in a blank, converting the whole document is the long way round. Annotation tools let you cover the old text with a white box and type replacement text on top, which handles small corrections without disturbing the rest of the layout.</p>
<p>One important caution: covering text with a white box hides it visually but may leave the original text extractable underneath. Never rely on that technique to remove confidential information. Genuine redaction means removing the content from the source document before the PDF is created.</p>
`
  },
  {
    slug: 'how-to-create-strong-passwords',
    title: 'How to Create Strong Passwords That Are Actually Practical',
    description: 'What genuinely makes a password hard to crack, why common advice about symbols and frequent changes is outdated, and a realistic system for managing passwords.',
    keywords: 'strong password, password security, password generator, password manager, passphrase',
    updated: '2026-08-01',
    tool: { id: 'password-generator', label: 'Password Generator' },
    readMinutes: 6,
    body: `
<p class="lead">Most password advice people remember is a decade out of date, and some of it actively made things worse. Here is what actually determines whether a password holds up, and a system that does not require memorising nonsense.</p>

<h2>Length beats complexity</h2>
<p>The rule that mattered most turns out to be the simplest. Each additional character multiplies the number of possibilities an attacker must try, and that multiplication compounds far faster than adding symbol variety to a short password.</p>
<p>A twelve-character password drawn from a full character set is dramatically harder to brute-force than an eight-character one, and the gap widens enormously at sixteen. If you change one thing about your passwords, make them longer.</p>

<h2>Why "P@ssw0rd1!" fails</h2>
<p>It satisfies every classic requirement: uppercase, lowercase, number, symbol, eight characters. It is also among the first things any real attack tries.</p>
<p>The reason is that attackers do not guess randomly. They start with lists of leaked passwords, then apply the exact substitutions humans predictably make: a becomes @, o becomes 0, i becomes 1, append a number, append an exclamation mark. Those transformations are built into cracking tools. A predictable pattern applied to a common word adds almost nothing.</p>
<p>This is why composition rules backfired. Told to add a symbol, nearly everyone adds "!" at the end. Told to add a number, nearly everyone adds "1" or the current year. The rules produced passwords that look complex to a human and are trivial to a machine.</p>

<h2>Passphrases: long and memorable</h2>
<p>Several unrelated words strung together give you length without impossible memorisation. Something like "correct-battery-staple-harbour" is far longer than a typical password and considerably easier to recall.</p>
<p>The critical requirement is that the words must be genuinely random, not a phrase you chose because it means something. Song lyrics, film quotes, and common sayings are all in attack dictionaries. "To be or not to be" is not a strong passphrase regardless of length.</p>

<h2>Reuse is the real vulnerability</h2>
<p>Here is the uncomfortable part: the strength of your password often does not matter, because the most common way accounts get compromised has nothing to do with guessing.</p>
<p>When a company suffers a breach, attackers obtain email and password pairs. They then try those same pairs on banks, email providers, and shopping sites, automatically and at enormous scale. This is called credential stuffing, and it works because most people reuse passwords.</p>
<p>If you reuse one password across ten sites, your security across all ten is determined by the least careful of them. A perfect password used everywhere is weaker in practice than mediocre passwords used once each.</p>

<h2>A workable system</h2>
<p><strong>Use a password manager.</strong> This is the honest answer to an impossible problem. Nobody can remember forty unique long passwords. A manager generates and stores them, so you memorise exactly one strong master password.</p>
<p><strong>Memorise only the few that matter.</strong> Your password manager's master password, your primary email, and your device login. Make these long passphrases. Everything else can be random strings you never see.</p>
<p><strong>Turn on two-factor authentication.</strong> On important accounts this matters more than password strength, because it means a stolen password alone is not enough. An authenticator app is meaningfully safer than SMS codes, which can be intercepted through SIM-swapping.</p>
<p><strong>Stop rotating passwords on a schedule.</strong> Guidance moved away from forced periodic changes because they push people toward predictable increments: Summer2024 becomes Summer2025. Change a password when there is a reason to, such as a breach notification or a suspicion it was exposed.</p>

<h2>Checking your exposure</h2>
<p>Breaches are public knowledge, and reputable services let you check whether your email appears in known incidents. If it does, change the password for that service and anywhere you reused it. Many password managers monitor this automatically and flag reused or compromised entries.</p>
`
  },
  {
    slug: 'understanding-bmi-and-its-limits',
    title: 'Understanding BMI: What It Measures and What It Misses',
    description: 'A clear explanation of how body mass index is calculated, where the categories came from, and the well-documented situations where BMI gives misleading results.',
    keywords: 'bmi explained, body mass index, bmi limitations, bmi categories, healthy weight range',
    updated: '2026-08-01',
    tool: { id: 'bmi-calculator', label: 'BMI & Ideal Weight Calculator' },
    readMinutes: 5,
    body: `
<p class="lead">BMI is one of the most widely used and most widely misunderstood health numbers. It is genuinely useful for the job it was designed to do, and genuinely misleading when stretched beyond it. The distinction is worth understanding before reading anything into your own number.</p>

<h2>What it is</h2>
<p>Body mass index is weight in kilograms divided by height in metres squared. That is the entire calculation. It uses no other information: not age, not sex, not body composition, not medical history.</p>
<p>The formula dates to the 1830s, devised by Belgian statistician Adolphe Quetelet, who was studying the characteristics of populations. It was never intended as a measure of an individual's health, and Quetelet said as much.</p>

<h2>Where the categories come from</h2>
<p>The familiar bands, published by the World Health Organization for adults, are: below 18.5 underweight, 18.5 to 24.9 healthy weight, 25.0 to 29.9 overweight, and 30.0 and above obese.</p>
<p>These thresholds were derived from statistical associations across large populations, mostly of European descent. They describe where health risks tend to rise on average across many thousands of people. They do not describe what is happening in any particular body, and the boundaries are conventions rather than sharp biological transitions. Nothing meaningful changes between a BMI of 24.9 and 25.0.</p>

<h2>What BMI cannot see</h2>
<p><strong>It cannot distinguish muscle from fat.</strong> Muscle is denser than fat, so a very muscular person can register as overweight or obese while carrying little body fat. This is well documented among athletes, and it is the most frequently cited limitation.</p>
<p><strong>It cannot see where fat is stored.</strong> Research consistently finds that fat around the abdomen carries different health implications than fat on the hips and thighs. Two people with identical BMI can have meaningfully different risk profiles. This is why waist circumference is often measured alongside BMI.</p>
<p><strong>It says nothing about fitness or metabolic health.</strong> Blood pressure, blood sugar, cholesterol, and cardiorespiratory fitness are all measurable, all relevant, and all invisible to BMI.</p>

<h2>Groups where it is especially unreliable</h2>
<p><strong>Children and adolescents.</strong> Adult categories do not apply at all. Growing bodies are assessed against age- and sex-specific percentile charts.</p>
<p><strong>Older adults.</strong> Muscle mass declines and height is often lost with age, both of which distort the number.</p>
<p><strong>Pregnant people.</strong> BMI is not a meaningful measure during pregnancy.</p>
<p><strong>Athletes and physically heavy workers.</strong> High muscle mass reliably pushes BMI upward.</p>
<p><strong>Different ethnic groups.</strong> Because the thresholds were derived largely from European populations, several health bodies recommend lower cut-offs for people of South Asian, South-East Asian, and East Asian descent, where elevated risk appears at lower BMI values.</p>

<h2>So is it useless?</h2>
<p>No, and dismissing it entirely overcorrects. BMI is cheap, requires only a scale and a tape measure, is consistent between clinicians, and works well for its actual purpose: comparing populations and flagging individuals who might benefit from a closer look.</p>
<p>The problem is not the measure. It is treating a rough screening tool as a verdict.</p>

<h2>What "ideal weight" formulas are</h2>
<p>Formulas such as Devine, Robinson, and Hamwi calculate a weight from height and sex. It is worth knowing where they came from: the Devine formula was published in 1974 to help calculate medication dosages, not to advise people on body weight.</p>
<p>They are simple linear formulas, they disagree with each other, and none reflects your build, frame, or body composition. Read them as rough reference points, not targets.</p>

<h2>A reasonable way to use the number</h2>
<p>Treat BMI as one crude data point. If it falls well outside the healthy band, that is worth a conversation with a doctor who can look at the fuller picture. If it sits near a boundary, the boundary itself is not precise enough to act on.</p>
<p>No calculator can assess your health. A clinician who can consider your history, measurements, blood work, and circumstances is a far better guide than any formula, including this one.</p>
`
  }  ,
  {
    slug: 'how-to-write-a-resume-that-gets-read',
    title: 'How to Write a Resume That Actually Gets Read',
    description: 'What recruiters and automated screening systems look for, how to write bullet points that land, and the formatting choices that quietly get resumes rejected.',
    keywords: 'how to write a resume, cv tips, resume format, ats resume, resume bullet points',
    updated: '2026-08-03',
    tool: { id: 'resume-builder', label: 'Resume / CV Builder' },
    readMinutes: 7,
    body: `
<p class="lead">Most resume advice is about layout. The things that actually decide whether yours gets read are the wording of your bullet points and whether a screening system can parse the file at all. Here is what matters, roughly in order of impact.</p>

<h2>Write results, not responsibilities</h2>
<p>This single change does more than everything else combined. Compare:</p>
<ul>
  <li><em>Responsible for quality inspections of lifting equipment.</em></li>
  <li><em>Inspected 400+ items of lifting equipment annually, cutting failed re-inspections by 30% through a revised pre-check procedure.</em></li>
</ul>
<p>The first describes a job description. The second describes a person. Anyone holding that title was responsible for inspections; only you achieved that specific outcome.</p>
<p>A useful pattern is: <strong>what you did, how you did it, what changed as a result.</strong> Not every bullet will have a clean number, and inventing one is worse than having none. But most people underestimate how much of their work is measurable: volume handled, time saved, errors reduced, people trained, cost avoided.</p>

<h2>Front-load the important words</h2>
<p>Recruiters scan rather than read. Eye-tracking studies consistently find first passes measured in seconds, not minutes. That means the beginning of each bullet does most of the work.</p>
<p>Start with a strong verb and the substance. "Reduced downtime by 18% by rescheduling preventive maintenance" beats "Was involved in a project which aimed to reduce downtime, and this resulted in an 18% improvement."</p>

<h2>Understand what automated screening actually does</h2>
<p>Applicant tracking systems are widely misunderstood. They are mostly databases, not judges. Their common failure mode is not rejecting good candidates on merit; it is failing to parse the file properly, so your experience never gets recorded in the first place.</p>
<p>What causes parsing failures:</p>
<ul>
  <li><strong>Text inside images or graphics.</strong> A resume exported as a picture contains no readable text at all.</li>
  <li><strong>Complex multi-column layouts.</strong> Columns can be read across instead of down, scrambling everything.</li>
  <li><strong>Critical details in headers and footers.</strong> Some parsers skip these entirely, which is a problem if your phone number lives there.</li>
  <li><strong>Tables for layout.</strong> Often flattened unpredictably.</li>
  <li><strong>Unusual fonts or heavy graphics.</strong> Can produce garbled characters.</li>
</ul>
<p>The fix is boring and effective: a single-column layout, standard fonts, real selectable text, clear section headings such as Experience and Education, and dates in a consistent format.</p>

<h2>Mirror the language of the job posting</h2>
<p>If a posting asks for "non-destructive testing" and your resume says "NDT," a keyword search may miss you. Use both the spelled-out term and the abbreviation at least once.</p>
<p>This is not about stuffing keywords, which reads badly to the human who eventually looks. It is about making sure the words a recruiter would search for genuinely appear in your document.</p>

<h2>Length and what to cut</h2>
<p>One page suits early-career applicants. Two pages is widely accepted once you have several substantial roles. Beyond that you need a strong reason.</p>
<p>What to cut first: jobs from more than fifteen years ago (a single line each is enough), duties that any holder of the title would have, generic skill claims like "hard working" and "team player" that carry no information, and full addresses. City and country is sufficient and better for privacy.</p>

<h2>The summary section</h2>
<p>A short summary at the top is worth writing, but only if it says something specific. "Experienced professional seeking a challenging role" tells a reader nothing. "Mechanical engineer with 12 years in third-party inspection and calibration, specialising in lifting equipment and pressure systems" tells them exactly who you are in one line.</p>
<p>Two or three sentences is the right length. It is the first thing read, so it earns the attention you spend on it.</p>

<h2>PDF or Word?</h2>
<p>Send a PDF unless the employer asks otherwise, because it looks identical on every device. The exception is when a job portal explicitly requires .docx, or a recruiter wants to edit it before passing it on.</p>
<p>Whichever you send, make sure the text is genuinely selectable rather than an image. If you cannot highlight a sentence with your cursor, neither can a screening system.</p>

<h2>Before you send</h2>
<ul>
  <li>Read it aloud. Awkward phrasing is much easier to hear than to see.</li>
  <li>Check dates for gaps and contradictions, which are the errors reviewers notice most.</li>
  <li>Name the file sensibly: <em>Ashraful-Alam-Resume.pdf</em>, not <em>resume-final-v3.pdf</em>.</li>
  <li>Confirm your contact details are correct. It happens more often than you would think.</li>
</ul>
`
  },
  {
    slug: 'qr-codes-explained',
    title: 'QR Codes Explained: How They Work and How to Avoid Common Mistakes',
    description: 'How QR codes store data, what error correction actually does, why some codes fail to scan, and practical guidance on size, contrast, and safety.',
    keywords: 'qr code, how qr codes work, qr code error correction, wifi qr code, qr code not scanning',
    updated: '2026-08-03',
    tool: { id: 'qr-generator', label: 'QR Code Generator' },
    readMinutes: 6,
    body: `
<p class="lead">QR codes look like abstract noise, but almost everything in the pattern is doing a specific job. Understanding roughly how they work explains most of the reasons a code fails to scan.</p>

<h2>What is actually in the pattern</h2>
<p>The three large squares in the corners are <strong>finder patterns</strong>. They let a camera locate the code and work out its orientation, which is why a QR code scans upside down or at an angle.</p>
<p>A smaller square near the fourth corner is the <strong>alignment pattern</strong>, correcting for distortion when a code is photographed on a curved surface or from the side.</p>
<p>The rest holds your data plus a substantial block of error-correction information.</p>

<h2>Error correction is the interesting part</h2>
<p>QR codes deliberately store redundant data so they still work when partly damaged. There are four levels:</p>
<ul>
  <li><strong>L (Low)</strong> — recovers from roughly 7% damage</li>
  <li><strong>M (Medium)</strong> — roughly 15%</li>
  <li><strong>Q (Quartile)</strong> — roughly 25%</li>
  <li><strong>H (High)</strong> — roughly 30%</li>
</ul>
<p>This is what allows a code to work with a logo placed in the middle: the logo covers data, and error correction reconstructs it.</p>
<p>The trade-off is density. Higher correction means more redundant data, so the pattern becomes finer for the same content. A very dense code printed small can become harder to scan, which defeats the purpose. M is a sensible default; use H when adding a logo or printing somewhere the code may get scuffed.</p>

<h2>Why codes fail to scan</h2>
<p><strong>Too small for the distance.</strong> A rough working rule is that the code should be about one tenth of the scanning distance. Read from 1 metre, aim for roughly 10 cm across. Codes on posters routinely fail because they were sized for a phone held close.</p>
<p><strong>Not enough quiet zone.</strong> The blank margin around a code is functional, not decorative. Scanners use it to find the boundary. Cropping tight to the pattern is a common cause of failure.</p>
<p><strong>Inverted colours.</strong> Most scanners expect dark modules on a light background. Light-on-dark works on some readers and fails on others.</p>
<p><strong>Insufficient contrast.</strong> Mid-grey on light grey may look elegant and scan poorly. Keep contrast strong.</p>
<p><strong>Too much data.</strong> A very long URL produces a dense pattern. Shortening the link first usually helps more than any other adjustment.</p>

<h2>Static versus dynamic codes</h2>
<p>A plain QR code is <strong>static</strong>: the destination is encoded in the pattern itself and can never be changed. Print it, and it points there forever.</p>
<p><strong>Dynamic</strong> codes encode a short redirect URL controlled by a service, so the destination can be changed later. Useful, but with two real costs: it depends on that service continuing to exist, and it usually means someone tracking every scan.</p>
<p>For a printed run you may want to update later, dynamic makes sense. For a WiFi password on a café wall, static is simpler and depends on nobody.</p>

<h2>Beyond links</h2>
<p>QR codes can encode several formats phones recognise automatically:</p>
<ul>
  <li><strong>WiFi</strong> — network name, security type, and password, so guests connect without typing</li>
  <li><strong>Phone or SMS</strong> — opens the dialer or a pre-filled message</li>
  <li><strong>Email</strong> — pre-fills recipient, subject, and body</li>
  <li><strong>Plain text</strong> — displays as-is</li>
</ul>
<p>Worth remembering: a WiFi QR code contains your password in plain readable form. Anyone who photographs it has the password permanently. Fine for a guest network, unwise for your main one.</p>

<h2>A word on safety</h2>
<p>A QR code is unreadable to humans, which makes it an effective way to disguise a link. Scanning a sticker placed over a legitimate code on a parking meter or restaurant table is a known scam pattern.</p>
<p>The practical habit: check the URL your phone previews before opening it, and be sceptical of codes in public places that look stuck on rather than printed as part of the surface.</p>
`
  },
  {
    slug: 'common-json-errors-and-how-to-fix-them',
    title: 'Common JSON Errors and How to Fix Them',
    description: 'The handful of mistakes behind almost every JSON parsing error, how to read the error messages, and how JSON differs from JavaScript objects.',
    keywords: 'json error, invalid json, json syntax, unexpected token json, json validator',
    updated: '2026-08-03',
    tool: { id: 'json-formatter', label: 'JSON Formatter & Validator' },
    readMinutes: 5,
    body: `
<p class="lead">JSON has a deliberately tiny specification, which means nearly every error comes from the same short list. Once you recognise them, most "invalid JSON" messages take seconds to fix.</p>

<h2>Trailing commas</h2>
<p>This is the most common error by a wide margin.</p>
<pre><code>{ "name": "Ashraful", "role": "Engineer", }</code></pre>
<p>That comma after the last value is invalid. JavaScript tolerates it, many languages tolerate it, JSON does not. Same rule inside arrays.</p>

<h2>Single quotes</h2>
<p>JSON requires double quotes, for both keys and string values. <code>{ 'name': 'Ashraful' }</code> is not valid JSON even though it is perfectly good JavaScript. This trips people up constantly when copying an object out of code.</p>

<h2>Unquoted keys</h2>
<p><code>{ name: "Ashraful" }</code> is a valid JavaScript object and invalid JSON. Every key must be a quoted string.</p>
<p>These last two points come from the same root confusion: <strong>JSON looks like JavaScript object syntax but is a stricter, separate format.</strong> Anything you copy out of code needs checking rather than assuming.</p>

<h2>Comments</h2>
<p>JSON has no comment syntax. Neither <code>//</code> nor <code>/* */</code> is allowed. This is a frequent source of frustration in configuration files, and the usual workaround is a throwaway key such as <code>"_comment"</code>.</p>

<h2>Unescaped characters inside strings</h2>
<p>Double quotes, backslashes, and literal line breaks inside a string must be escaped:</p>
<ul>
  <li><code>\\"</code> for a quote</li>
  <li><code>\\\\</code> for a backslash</li>
  <li><code>\\n</code> for a newline</li>
</ul>
<p>Windows file paths are a classic offender, since <code>C:\\Users\\file</code> needs each backslash doubled.</p>

<h2>Values JSON does not have</h2>
<p>JSON supports strings, numbers, booleans, null, objects, and arrays. It does not support <code>undefined</code>, <code>NaN</code>, <code>Infinity</code>, dates, or functions.</p>
<p>Dates are the practical one: there is no date type, so dates are conventionally stored as ISO 8601 strings such as <code>"2026-08-03T10:30:00Z"</code>.</p>

<h2>Numbers with leading zeros or a trailing decimal point</h2>
<p><code>007</code> and <code>3.</code> are both invalid. Write <code>7</code> and <code>3.0</code>. If leading zeros matter, such as a product code, it is a string, not a number.</p>

<h2>Reading the error message</h2>
<p>Most parsers report something like <em>Unexpected token } at position 47</em>. Two things are worth knowing.</p>
<p>First, the position is where the parser <strong>noticed</strong> the problem, which is often slightly after where you made it. A missing comma on one line is usually reported at the start of the next.</p>
<p>Second, "unexpected end of input" almost always means an unclosed bracket or brace. Formatting the document is the fastest way to find it, since proper indentation makes an unbalanced structure visible immediately.</p>

<h2>A practical debugging order</h2>
<ol>
  <li>Format the JSON. Indentation alone reveals most structural problems.</li>
  <li>Scan for trailing commas, especially before <code>}</code> and <code>]</code>.</li>
  <li>Check quotes are double, on both keys and string values.</li>
  <li>Look for stray comments.</li>
  <li>Check escaping inside any string containing paths, quotes, or line breaks.</li>
</ol>
<p>If a document is very large, cut it in half and validate each part. A few rounds of that narrows the problem quickly.</p>
`
  },
  {
    slug: 'what-is-sha-256-and-file-verification',
    title: 'What SHA-256 Is, and How to Check a File Has Not Been Tampered With',
    description: 'A plain explanation of cryptographic hashing, what a checksum proves and what it does not, and how to verify a download you have just made.',
    keywords: 'sha-256, checksum, file verification, hash function, md5 vs sha256',
    updated: '2026-08-03',
    tool: { id: 'hash-generator', label: 'Hash Generator & Diff Checker' },
    readMinutes: 6,
    body: `
<p class="lead">A hash is a fixed-length fingerprint of data. Feed in a one-word message or a two-gigabyte file, and SHA-256 returns exactly 64 hexadecimal characters. That simple property turns out to be enormously useful.</p>

<h2>The properties that make it work</h2>
<p><strong>Deterministic.</strong> The same input always produces the same hash, on any machine, forever.</p>
<p><strong>Avalanche effect.</strong> Change one character and the output changes completely — not slightly, but entirely unrecognisably. This is why hashes are good at detecting tampering: there is no such thing as a "close" match.</p>
<p><strong>One-way.</strong> You cannot reverse a hash to recover the original. Hashing is not encryption; there is no decryption step, by design.</p>
<p><strong>Collision resistant.</strong> Finding two different inputs producing the same hash should be computationally infeasible. This is where older algorithms failed.</p>

<h2>Why MD5 and SHA-1 are no longer trusted</h2>
<p>Both were once standard and both are now broken for security purposes, because researchers demonstrated practical ways to construct two different files with the same hash. Once that is possible, a hash no longer proves a file is unmodified: an attacker could craft a malicious file matching the expected value.</p>
<p>They still appear for non-security purposes such as detecting accidental corruption, but for anything where someone might deliberately tamper, SHA-256 is the sensible minimum. It is worth noting that browsers deliberately do not offer MD5 at all in their built-in cryptography API.</p>

<h2>Verifying a download</h2>
<p>This is the everyday use. When a project publishes a checksum next to a download, they are giving you a way to confirm you received exactly what they published.</p>
<ol>
  <li>Download the file.</li>
  <li>Compute its SHA-256 hash.</li>
  <li>Compare against the published value.</li>
</ol>
<p>Identical means the file is byte-for-byte what was published. Different means something changed — a corrupted download, an interrupted transfer, or in the worst case a modified file.</p>
<p>You do not need to compare all 64 characters by eye. Checking the first and last six is enough in practice, given that any change alters the whole string.</p>

<h2>What a checksum does not prove</h2>
<p>This distinction matters and is widely missed.</p>
<p>A checksum proves the file matches <strong>the value you compared it against</strong>. If an attacker controls the website, they can replace both the file and the published checksum, and the two will match perfectly.</p>
<p>So a checksum protects mainly against accidental corruption and against tampering in transit or on a mirror. Protection against a compromised source requires a <strong>digital signature</strong>, which uses a key the attacker does not hold. For most everyday downloads a checksum is a reasonable check; for anything security-critical, look for signatures.</p>

<h2>Hashing and passwords</h2>
<p>Hashes are also how well-built systems store passwords: the hash is stored, never the password itself, so a breach does not directly expose it.</p>
<p>Importantly, though, plain SHA-256 is the wrong tool here. It is designed to be fast, and speed helps an attacker guessing billions of candidates. Password storage uses deliberately slow algorithms such as bcrypt, scrypt, or Argon2, plus a random salt per password so identical passwords do not produce identical hashes.</p>
<p>Worth knowing if you ever build a system that stores credentials: reaching for SHA-256 alone is a well-known mistake.</p>

<h2>Comparing text instead of files</h2>
<p>A related everyday need is finding what changed between two versions of a document. A hash tells you <em>whether</em> something differs; a diff tells you <em>what</em> differs. The two answer different questions, and it is usually the second one you actually want when reviewing a change.</p>
`
  },
  {
    slug: 'why-your-pdf-is-so-large',
    title: 'Why Your PDF Is So Large, and How to Make It Smaller',
    description: 'What actually takes up space inside a PDF, which fixes give the biggest reduction, and what to avoid when a document has to stay legible or printable.',
    keywords: 'reduce pdf size, compress pdf, large pdf file, pdf too big to email, shrink pdf',
    updated: '2026-08-03',
    tool: { id: 'pdf-kit', label: 'PDF Toolkit' },
    readMinutes: 5,
    body: `
<p class="lead">A ten-page document has no business being 40 MB, yet it happens constantly. Almost always one of a few specific things is responsible, and identifying which one tells you the fix.</p>

<h2>Images are usually the culprit</h2>
<p>Text is remarkably compact. A page of text might be a few kilobytes. A single photograph straight from a phone can be several megabytes.</p>
<p>The common pattern: someone inserts full-resolution photos into a document. Those images display at perhaps 10 cm wide, but the file still stores every original pixel. A report with twenty photos becomes enormous while looking like a modest document.</p>
<p>The fix is to resize images <em>before</em> inserting them. An image displayed at 10 cm needs roughly 1200 pixels across for good print quality, not 4000.</p>

<h2>Scans are images, and behave accordingly</h2>
<p>A scanned document is not text at all; it is a picture of each page. Size is driven almost entirely by scan resolution.</p>
<p>Many scanners default to 600 DPI, which is far more than most documents need. For ordinary text, 300 DPI is the standard for print quality and 150 DPI is fine for on-screen reading. Dropping from 600 to 300 typically cuts the file to roughly a quarter.</p>
<p>Scanning in colour when the original is black and white also multiplies size for no benefit.</p>

<h2>Embedded fonts</h2>
<p>PDFs embed fonts so the document looks identical everywhere. That is the format working as intended, but a full font family can add hundreds of kilobytes.</p>
<p>Most tools embed only the characters actually used, called subsetting. Files created by older or unusual software sometimes embed entire fonts, and using many different fonts multiplies the cost.</p>

<h2>Invisible leftovers</h2>
<p>PDFs accumulate things you cannot see: previous revisions retained by incremental saves, cropped-away portions of images that are hidden but still stored, unused form fields, annotations, and metadata.</p>
<p>This is why a PDF sometimes grows after light editing. It is also a quiet privacy issue — cropping an image in some tools hides the cropped area rather than deleting it.</p>

<h2>What to try, in order</h2>
<ol>
  <li><strong>Check what the size actually is.</strong> A text-only document that is 30 MB has a specific problem, not a general one.</li>
  <li><strong>Resize images before inserting</strong> and regenerate the PDF. This is by far the most effective fix.</li>
  <li><strong>Rescan at a lower resolution</strong> if the document is a scan.</li>
  <li><strong>Extract only the pages you need.</strong> Sending 5 pages instead of 80 is the simplest reduction available and often overlooked.</li>
  <li><strong>Re-save through a different tool</strong>, which frequently discards accumulated leftovers.</li>
</ol>

<h2>What to be careful with</h2>
<p>Aggressive compression degrades scanned text badly. Small characters develop artefacts and become hard to read, and worse, unreadable to OCR later. For anything that must remain legible or searchable, prioritise resolution over file size.</p>
<p>Also keep the original. Compression is one-way: once detail is discarded you cannot restore it, and a document you may need to print or archive deserves an untouched copy.</p>

<h2>If it is for email</h2>
<p>Most mail systems cap attachments around 20–25 MB. Rather than compressing a document until it looks poor, consider sending only the relevant pages, or sharing a link instead. Recipients generally prefer a clean, readable document over a small, blurry one.</p>
`
  }

];
