<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>What SHA-256 Is, and How to Check a File Has Not Been Tampered With</title>
<meta name="description" content="A plain explanation of cryptographic hashing, what a checksum proves and what it does not, and how to verify a download you have just made." />
<meta name="keywords" content="sha-256, checksum, file verification, hash function, md5 vs sha256" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://dailytoolkits.com/guides/what-is-sha-256-and-file-verification.html" />
<meta property="og:type" content="article" />
<meta property="og:title" content="What SHA-256 Is, and How to Check a File Has Not Been Tampered With" />
<meta property="og:description" content="A plain explanation of cryptographic hashing, what a checksum proves and what it does not, and how to verify a download you have just made." />
<meta property="og:url" content="https://dailytoolkits.com/guides/what-is-sha-256-and-file-verification.html" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="icon" type="image/svg+xml" href="https://dailytoolkits.com/assets/logo/icon.svg" />
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3519739466221208" crossorigin="anonymous"></script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"What SHA-256 Is, and How to Check a File Has Not Been Tampered With","description":"A plain explanation of cryptographic hashing, what a checksum proves and what it does not, and how to verify a download you have just made.","dateModified":"2026-08-03","mainEntityOfPage":{"@type":"WebPage","@id":"https://dailytoolkits.com/guides/what-is-sha-256-and-file-verification.html"},"publisher":{"@type":"Organization","name":"Personal Tools Hub"}}</script>
<style>
:root{--bg:#ffffff;--fg:#0f172a;--muted:#64748b;--line:#e2e8f0;--accent:#2563eb;--card:#f8fafc}
@media(prefers-color-scheme:dark){:root{--bg:#020617;--fg:#e2e8f0;--muted:#94a3b8;--line:#1e293b;--accent:#60a5fa;--card:#0f172a}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;line-height:1.7;-webkit-font-smoothing:antialiased}
.wrap{max-width:720px;margin:0 auto;padding:0 20px}
header.site{border-bottom:1px solid var(--line);padding:14px 0;position:sticky;top:0;background:var(--bg);z-index:10}
header.site .wrap{display:flex;align-items:center;justify-content:space-between;gap:12px}
.brand{font-weight:800;color:var(--fg);text-decoration:none;font-size:15px;letter-spacing:-.01em}
.brand span{color:var(--accent)}
.nav a{color:var(--muted);text-decoration:none;font-size:13px;font-weight:600;margin-left:16px}
.nav a:hover{color:var(--accent)}
main{padding:40px 0 56px}
h1{font-size:clamp(26px,5vw,36px);line-height:1.22;letter-spacing:-.02em;margin:0 0 14px}
h2{font-size:20px;line-height:1.3;letter-spacing:-.01em;margin:36px 0 12px}
p{margin:0 0 16px}
.lead{font-size:18px;color:var(--muted)}
ul{margin:0 0 16px;padding-left:22px}
li{margin-bottom:7px}
.meta{color:var(--muted);font-size:13px;margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid var(--line)}
.cta{margin:32px 0;padding:18px 20px;border:1px solid var(--line);border-radius:14px;background:var(--card)}
.cta p{margin:0 0 10px;font-size:14px;color:var(--muted)}
.btn{display:inline-block;background:var(--accent);color:#fff;text-decoration:none;font-weight:700;font-size:13px;padding:9px 16px;border-radius:9px}
.related{margin-top:44px;padding-top:24px;border-top:1px solid var(--line)}
.related h2{margin-top:0;font-size:16px}
.related ul{list-style:none;padding:0}
.related a{color:var(--accent);text-decoration:none;font-weight:600;font-size:14px}
.related a:hover{text-decoration:underline}
footer.site{border-top:1px solid var(--line);padding:22px 0;color:var(--muted);font-size:13px}
footer.site a{color:var(--muted)}
.disclaimer{margin-top:28px;padding:14px 16px;border:1px solid var(--line);border-radius:12px;background:var(--card);font-size:13px;color:var(--muted)}
figure{margin:24px 0;padding:18px;border:1px solid var(--line);border-radius:14px;background:var(--card)}
figure svg{display:block;width:100%;height:auto;max-width:560px;margin:0 auto}
figcaption{margin-top:12px;font-size:13px;color:var(--muted);text-align:center}
.svg-fill-card{fill:var(--bg)}
.svg-stroke{stroke:var(--muted)}
.svg-text{fill:var(--fg);font-family:ui-sans-serif,system-ui,sans-serif}
.svg-muted{fill:var(--muted);font-family:ui-sans-serif,system-ui,sans-serif}
.svg-accent{fill:var(--accent)}
.svg-accent-stroke{stroke:var(--accent)}
code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.9em;background:var(--card);border:1px solid var(--line);border-radius:5px;padding:1px 5px}
pre{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px;overflow-x:auto;margin:0 0 16px}
pre code{background:none;border:none;padding:0;font-size:13px;line-height:1.5}
ol{margin:0 0 16px;padding-left:22px}
</style>
</head>
<body>
<header class="site">
  <div class="wrap">
    <a class="brand" href="https://dailytoolkits.com/">Personal <span>Tools Hub</span></a>
    <nav class="nav">
      <a href="https://dailytoolkits.com/">All Tools</a>
      <a href="https://dailytoolkits.com/guides/">Guides</a>
    </nav>
  </div>
</header>
<main class="wrap">

<article>
  <h1>What SHA-256 Is, and How to Check a File Has Not Been Tampered With</h1>
  <p class="meta">Updated 2026-08-03 &middot; 6 min read</p>
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
  
  <div class="cta">
    <p>Try it yourself &mdash; free, and everything runs in your browser.</p>
    <a class="btn" href="https://dailytoolkits.com/#tool/hash-generator">Open Hash Generator &amp; Diff Checker</a>
  </div>
</article>
<section class="related">
  <h2>More guides</h2>
  <ul>
    <li><a href="https://dailytoolkits.com/guides/webp-vs-jpeg-vs-png.html">WebP vs JPEG vs PNG: Which Image Format Should You Actually Use?</a></li>
    <li><a href="https://dailytoolkits.com/guides/how-to-compress-images-without-losing-quality.html">How to Compress Images Without Obviously Losing Quality</a></li>
    <li><a href="https://dailytoolkits.com/guides/pdf-to-word-conversion-guide.html">Converting PDF to Word: What Actually Works and What Does Not</a></li>
  </ul>
</section>
</main>
<footer class="site">
  <div class="wrap">
    &copy; 2026 Personal Tools Hub &middot;
    <a href="https://dailytoolkits.com/">Tools</a> &middot;
    <a href="https://dailytoolkits.com/#privacy">Privacy</a> &middot;
    <a href="https://dailytoolkits.com/#terms">Terms</a>
  </div>
</footer>
</body>
</html>