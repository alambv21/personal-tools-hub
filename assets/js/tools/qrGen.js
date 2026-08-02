import QRCode from 'qrcode';
import { copyToClipboard } from '../utils.js';
import { getIconSvg } from '../icons.js';

export function renderQrGenerator(container) {
  // Tool State
  let activeTab = 'url'; // 'url' | 'text' | 'phone' | 'email' | 'sms' | 'wifi'
  
  // Field States
  let urlVal = 'https://dailytoolkits.com';
  let textVal = 'Welcome to Personal Tools Hub!';
  let phoneVal = '+1234567890';
  let emailTo = 'contact@example.com';
  let emailSubject = 'Inquiry from QR Code';
  let emailBody = 'Hello, I scanned your QR code and would like to connect.';
  let smsPhone = '+1234567890';
  let smsMsg = 'Hello! Scanning your QR code works great.';
  let wifiSsid = 'MyHomeNetwork';
  let wifiPass = 'SecurePassword123';
  let wifiType = 'WPA'; // 'WPA' | 'WEP' | 'nopass'
  let wifiHidden = false;
  let showWifiPass = false;

  // Customization State - ISO Standard Defaults
  let fgColor = '#000000'; // Standard Black Foreground
  let bgColor = '#ffffff'; // Standard White Background
  let isTransparent = false;
  let errorCorrectionLevel = 'M'; // 'L' | 'M' | 'Q' | 'H' (Default 'M')
  let marginVal = 4; // Minimum 4 modules Quiet Zone (ISO/IEC 18004)
  let exportSize = 600; // 300, 600, 1200 px

  // Helper to escape special characters for WiFi QR strings
  function escapeWifiStr(str) {
    if (!str) return '';
    return str.replace(/([\\;,:"])/g, '\\$1');
  }

  // Calculate payload based on active tab
  function getPayload() {
    switch (activeTab) {
      case 'url': {
        let v = urlVal.trim();
        if (!v) return '';
        if (!/^https?:\/\//i.test(v) && !/^ftp:\/\//i.test(v)) {
          v = 'https://' + v;
        }
        return v;
      }
      case 'text':
        return textVal.trim();
      case 'phone':
        return phoneVal.trim() ? `tel:${phoneVal.trim()}` : '';
      case 'email': {
        if (!emailTo.trim()) return '';
        const params = new URLSearchParams();
        if (emailSubject.trim()) params.append('subject', emailSubject.trim());
        if (emailBody.trim()) params.append('body', emailBody.trim());
        const queryStr = params.toString();
        return `mailto:${emailTo.trim()}${queryStr ? '?' + queryStr : ''}`;
      }
      case 'sms': {
        if (!smsPhone.trim()) return '';
        const num = smsPhone.trim();
        const msg = smsMsg.trim();
        return msg ? `sms:${num}?body=${encodeURIComponent(msg)}` : `sms:${num}`;
      }
      case 'wifi': {
        if (!wifiSsid.trim()) return '';
        const s = escapeWifiStr(wifiSsid.trim());
        const p = escapeWifiStr(wifiPass);
        const t = wifiType;
        const h = wifiHidden ? 'true' : 'false';
        return `WIFI:S:${s};T:${t};P:${p};H:${h};;`;
      }
      default:
        return '';
    }
  }

  // Render Base HTML
  container.innerHTML = `
    <div class="space-y-6">
      
      <div class="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60" role="tablist" aria-label="QR Code Type Selection">
        <button
          data-tab="url"
          role="tab"
          aria-selected="true"
          tabindex="0"
          class="qr-tab-btn flex-1 min-w-[110px] inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
        >
          ${getIconSvg('link', 'w-3.5 h-3.5')}
          <span>URL</span>
        </button>

        <button
          data-tab="text"
          role="tab"
          aria-selected="false"
          tabindex="0"
          class="qr-tab-btn flex-1 min-w-[110px] inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          ${getIconSvg('type', 'w-3.5 h-3.5')}
          <span>Plain Text</span>
        </button>

        <button
          data-tab="phone"
          role="tab"
          aria-selected="false"
          tabindex="0"
          class="qr-tab-btn flex-1 min-w-[110px] inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          ${getIconSvg('phone', 'w-3.5 h-3.5')}
          <span>Phone</span>
        </button>

        <button
          data-tab="email"
          role="tab"
          aria-selected="false"
          tabindex="0"
          class="qr-tab-btn flex-1 min-w-[110px] inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          ${getIconSvg('mail', 'w-3.5 h-3.5')}
          <span>Email</span>
        </button>

        <button
          data-tab="sms"
          role="tab"
          aria-selected="false"
          tabindex="0"
          class="qr-tab-btn flex-1 min-w-[110px] inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          ${getIconSvg('message', 'w-3.5 h-3.5')}
          <span>SMS</span>
        </button>

        <button
          data-tab="wifi"
          role="tab"
          aria-selected="false"
          tabindex="0"
          class="qr-tab-btn flex-1 min-w-[110px] inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          ${getIconSvg('wifi', 'w-3.5 h-3.5')}
          <span>WiFi</span>
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <div class="lg:col-span-7 space-y-5">
          
          <div class="p-5 sm:p-6 rounded-[20px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 class="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span id="tab-form-title">Enter Website Link</span>
              </h3>
              <button
                id="qr-clear-inputs-btn"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition focus:outline-none"
                title="Clear input fields"
              >
                ${getIconSvg('trash', 'w-3.5 h-3.5')}
                <span>Clear Input</span>
              </button>
            </div>

            <div id="form-tab-url" class="tab-content space-y-3">
              <label for="input-url" class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Website Address (URL)
              </label>
              <div class="relative">
                <input
                  id="input-url"
                  type="text"
                  value="${urlVal}"
                  placeholder="https://example.com"
                  class="w-full p-3 pl-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 text-sm focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                <div class="absolute left-3 top-3.5 text-slate-400">
                  ${getIconSvg('globe', 'w-4 h-4')}
                </div>
              </div>
              <div class="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                <span>Enter any standard webpage URL.</span>
                <button id="add-https-btn" class="text-blue-600 dark:text-blue-400 font-medium hover:underline focus:outline-none">
                  + Add https://
                </button>
              </div>
            </div>

            <div id="form-tab-text" class="tab-content hidden space-y-3">
              <label for="input-text" class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Plain Text Message
              </label>
              <textarea
                id="input-text"
                rows="4"
                placeholder="Type or paste any text, notes, address, or message here..."
                class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 text-sm focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition resize-y"
              >${textVal}</textarea>
              <p class="text-[11px] text-slate-500">Text is stored directly in the QR modules. Standard format.</p>
            </div>

            <div id="form-tab-phone" class="tab-content hidden space-y-3">
              <label for="input-phone" class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Phone Number
              </label>
              <div class="relative">
                <input
                  id="input-phone"
                  type="tel"
                  value="${phoneVal}"
                  placeholder="+1 (555) 000-0000"
                  class="w-full p-3 pl-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 text-sm focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                <div class="absolute left-3 top-3.5 text-slate-400">
                  ${getIconSvg('phone', 'w-4 h-4')}
                </div>
              </div>
              <p class="text-[11px] text-slate-500">Scanning will prompt smartphones to dial this phone number directly.</p>
            </div>

            <div id="form-tab-email" class="tab-content hidden space-y-3">
              <div>
                <label for="input-email-to" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Recipient Email Address
                </label>
                <input
                  id="input-email-to"
                  type="email"
                  value="${emailTo}"
                  placeholder="name@example.com"
                  class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 text-sm focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label for="input-email-subj" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject Line (Optional)
                  </label>
                  <input
                    id="input-email-subj"
                    type="text"
                    value="${emailSubject}"
                    placeholder="Subject..."
                    class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 text-xs focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
                <div>
                  <label for="input-email-body" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Message Body (Optional)
                  </label>
                  <input
                    id="input-email-body"
                    type="text"
                    value="${emailBody}"
                    placeholder="Message..."
                    class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 text-xs focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
              </div>
              <p class="text-[11px] text-slate-500">Scanning will open default email apps with recipient and message pre-filled.</p>
            </div>

            <div id="form-tab-sms" class="tab-content hidden space-y-3">
              <div>
                <label for="input-sms-phone" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Recipient Mobile Number
                </label>
                <input
                  id="input-sms-phone"
                  type="tel"
                  value="${smsPhone}"
                  placeholder="+1 (555) 000-0000"
                  class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 text-sm focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label for="input-sms-msg" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Preset Text Message
                </label>
                <textarea
                  id="input-sms-msg"
                  rows="2"
                  placeholder="Default SMS content..."
                  class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 text-sm focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
                >${smsMsg}</textarea>
              </div>
              <p class="text-[11px] text-slate-500">Scanning opens SMS app ready to send the draft message to the designated number.</p>
            </div>

            <div id="form-tab-wifi" class="tab-content hidden space-y-3">
              <div>
                <label for="input-wifi-ssid" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Network Name (SSID) *
                </label>
                <input
                  id="input-wifi-ssid"
                  type="text"
                  value="${wifiSsid}"
                  placeholder="e.g. Home_WiFi_5G"
                  class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 text-sm focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label for="input-wifi-pass" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    WiFi Password
                  </label>
                  <div class="relative">
                    <input
                      id="input-wifi-pass"
                      type="password"
                      value="${wifiPass}"
                      placeholder="Password..."
                      class="w-full p-2.5 pr-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 text-xs focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                    <button
                      id="toggle-wifi-pass-btn"
                      type="button"
                      class="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                    >
                      ${getIconSvg('eye', 'w-3.5 h-3.5')}
                    </button>
                  </div>
                </div>

                <div>
                  <label for="input-wifi-type" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Security Encryption
                  </label>
                  <select
                    id="input-wifi-type"
                    class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 text-xs focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer transition"
                  >
                    <option value="WPA" selected>WPA / WPA2 / WPA3 (Default)</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None (Open Network)</option>
                  </select>
                </div>
              </div>

              <div class="flex items-center gap-2 pt-1">
                <input
                  id="input-wifi-hidden"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <label for="input-wifi-hidden" class="text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                  Hidden WiFi Network (SSID is not broadcasting)
                </label>
              </div>
              <p class="text-[11px] text-slate-500">Guests can scan this QR code with their phone camera to join your WiFi instantly!</p>
            </div>

          </div>

          <div class="p-5 sm:p-6 rounded-[20px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs space-y-4">
            <h3 class="font-bold text-sm text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800">
              Color & Styling
            </h3>

            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                Color Palette Presets
              </label>
              <div class="flex flex-wrap gap-2">
                <button data-preset="classic" class="preset-btn px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200 transition">
                  🖤 Classic Dark
                </button>
                <button data-preset="ocean" class="preset-btn px-3 py-1.5 rounded-xl text-xs font-medium border border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 transition">
                  🌊 Ocean Blue
                </button>
                <button data-preset="emerald" class="preset-btn px-3 py-1.5 rounded-xl text-xs font-medium border border-emerald-200 dark:border-emerald-900 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 transition">
                  🌿 Emerald
                </button>
                <button data-preset="purple" class="preset-btn px-3 py-1.5 rounded-xl text-xs font-medium border border-purple-200 dark:border-purple-900 bg-purple-50/60 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 transition">
                  🔮 Royal Purple
                </button>
                <button data-preset="darkmode" class="preset-btn px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-700 bg-slate-900 text-white transition">
                  🌙 Dark Mode
                </button>
              </div>
            </div>

            <div class="space-y-3 pt-1">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label for="input-fg-color" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Foreground Color (QR Modules)
                  </label>
                  <div class="flex items-center gap-2.5">
                    <input
                      id="input-fg-color"
                      type="color"
                      value="${fgColor}"
                      class="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer bg-transparent p-0.5"
                    />
                    <input
                      id="input-fg-hex"
                      type="text"
                      value="${fgColor}"
                      class="w-24 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs font-mono uppercase focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label for="input-bg-color" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Background Color
                  </label>
                  <div class="flex items-center gap-2.5">
                    <input
                      id="input-bg-color"
                      type="color"
                      value="${bgColor}"
                      class="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer bg-transparent p-0.5"
                    />
                    <input
                      id="input-bg-hex"
                      type="text"
                      value="${bgColor}"
                      class="w-24 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs font-mono uppercase focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between pt-1">
                <button
                  id="swap-colors-btn"
                  type="button"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition focus:outline-none"
                  title="Swap Foreground and Background Colors"
                >
                  ${getIconSvg('swap', 'w-3.5 h-3.5')}
                  <span>Swap Colors</span>
                </button>
                <span class="text-[11px] text-slate-400">Modules must be darker than background</span>
              </div>
            </div>

            <div class="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <input
                id="input-bg-transparent"
                type="checkbox"
                class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <label for="input-bg-transparent" class="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                Transparent Background (PNG export only)
              </label>
            </div>
          </div>

          <div class="p-5 sm:p-6 rounded-[20px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs">
            <button
              id="toggle-advanced-btn"
              type="button"
              class="w-full flex items-center justify-between font-bold text-sm text-slate-800 dark:text-slate-200 text-left focus:outline-none"
            >
              <span>Advanced Output Settings</span>
              <span id="adv-arrow" class="transition-transform duration-200">
                ${getIconSvg('chevronDown', 'w-4 h-4 text-slate-400')}
              </span>
            </button>

            <div id="advanced-panel" class="hidden pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label for="input-ecl" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Error Correction Level
                  </label>
                  <select
                    id="input-ecl"
                    class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="L">L - Low (7% recovery)</option>
                    <option value="M" selected>M - Medium (15% recovery - Recommended)</option>
                    <option value="Q">Q - Quartile (25% recovery)</option>
                    <option value="H">H - High (30% recovery)</option>
                  </select>
                </div>

                <div>
                  <label for="input-margin" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Quiet Zone / Margin
                  </label>
                  <select
                    id="input-margin"
                    class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="4" selected>4 Modules (ISO Standard - Recommended)</option>
                    <option value="6">6 Modules (Spacious)</option>
                    <option value="8">8 Modules (Wide)</option>
                  </select>
                </div>

                <div>
                  <label for="input-export-size" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    PNG Export Quality
                  </label>
                  <select
                    id="input-export-size"
                    class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="300">300 x 300 px (Standard)</option>
                    <option value="600" selected>600 x 600 px (HD Print)</option>
                    <option value="1200">1200 x 1200 px (Ultra HD)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div class="lg:col-span-5 sticky top-24 space-y-5">
          <div class="p-6 sm:p-8 rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md flex flex-col items-center justify-center text-center space-y-5">
            
            <div class="flex items-center justify-between w-full">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                ${getIconSvg('checkCircle', 'w-3.5 h-3.5 text-emerald-500')} Instant Live Preview
              </span>
              <span id="qr-size-badge" class="text-xs font-mono text-slate-400">
                300 x 300 px
              </span>
            </div>

            <div class="w-full min-h-[300px] p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center relative overflow-hidden group shadow-inner">
              <div id="qr-empty-state" class="hidden text-center space-y-2 p-6">
                ${getIconSvg('qrCode', 'w-12 h-12 mx-auto text-slate-300 dark:text-slate-700')}
                <p class="text-xs font-medium text-slate-500">Please enter required fields to generate your QR Code.</p>
              </div>

              <div id="qr-canvas-wrapper" class="p-0 border-0 bg-transparent flex items-center justify-center">
                <canvas id="qr-canvas" class="max-w-full h-auto block"></canvas>
              </div>
            </div>

            <div class="w-full text-left space-y-1">
              <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Encoded String Payload
              </div>
              <div
                id="qr-payload-display"
                class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 truncate select-all"
              >
                https://dailytoolkits.com
              </div>
            </div>

            <div id="scan-warning-banner" class="hidden w-full p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-200 text-xs text-left space-y-2.5">
              <div class="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-100">
                ${getIconSvg('alertTriangle', 'w-4 h-4 text-amber-600 dark:text-amber-400')}
                <span>Scan Warning</span>
              </div>
              <p id="scan-warning-text" class="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300"></p>
              <button
                id="auto-fix-scan-btn"
                class="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-xs transition active:scale-98 focus:outline-none"
              >
                <span>⚡ Auto-Fix Colors for 100% Scan Success</span>
              </button>
            </div>

            <div class="grid grid-cols-2 gap-2.5 w-full pt-1">
              <button
                id="qr-download-btn"
                class="col-span-2 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-98"
              >
                ${getIconSvg('download', 'w-4 h-4')}
                <span>Download PNG Image</span>
              </button>

              <button
                id="qr-copy-payload-btn"
                class="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition focus:outline-none"
              >
                ${getIconSvg('copy', 'w-3.5 h-3.5')}
                <span id="copy-payload-text">Copy Text</span>
              </button>

              <button
                id="qr-copy-img-btn"
                class="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition focus:outline-none"
              >
                ${getIconSvg('qrCode', 'w-3.5 h-3.5')}
                <span id="copy-img-text">Copy Image</span>
              </button>

              <button
                id="qr-print-btn"
                class="col-span-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white/90 transition focus:outline-none"
              >
                ${getIconSvg('printer', 'w-4 h-4')}
                <span>Print QR Code</span>
              </button>
            </div>

            <div class="text-[11px] text-slate-400 dark:text-slate-500 text-center pt-1">
              🔒 100% Client-Side Privacy: No data transmitted over network.
            </div>

          </div>
        </div>

      </div>

    </div>
  `;

  // Bind Element References
  const tabBtns = container.querySelectorAll('.qr-tab-btn');
  const tabTitleEl = container.querySelector('#tab-form-title');
  const tabContents = container.querySelectorAll('.tab-content');

  // Input elements
  const inputUrl = container.querySelector('#input-url');
  const addHttpsBtn = container.querySelector('#add-https-btn');
  const inputText = container.querySelector('#input-text');
  const inputPhone = container.querySelector('#input-phone');
  const inputEmailTo = container.querySelector('#input-email-to');
  const inputEmailSubj = container.querySelector('#input-email-subj');
  const inputEmailBody = container.querySelector('#input-email-body');
  const inputSmsPhone = container.querySelector('#input-sms-phone');
  const inputSmsMsg = container.querySelector('#input-sms-msg');
  const inputWifiSsid = container.querySelector('#input-wifi-ssid');
  const inputWifiPass = container.querySelector('#input-wifi-pass');
  const inputWifiType = container.querySelector('#input-wifi-type');
  const inputWifiHidden = container.querySelector('#input-wifi-hidden');
  const toggleWifiPassBtn = container.querySelector('#toggle-wifi-pass-btn');

  const clearInputsBtn = container.querySelector('#qr-clear-inputs-btn');

  // Colors & Options
  const inputFgColor = container.querySelector('#input-fg-color');
  const inputFgHex = container.querySelector('#input-fg-hex');
  const inputBgColor = container.querySelector('#input-bg-color');
  const inputBgHex = container.querySelector('#input-bg-hex');
  const inputBgTransparent = container.querySelector('#input-bg-transparent');

  const toggleAdvBtn = container.querySelector('#toggle-advanced-btn');
  const advPanel = container.querySelector('#advanced-panel');
  const advArrow = container.querySelector('#adv-arrow');

  const inputEcl = container.querySelector('#input-ecl');
  const inputMargin = container.querySelector('#input-margin');
  const inputExportSize = container.querySelector('#input-export-size');

  // Output elements
  const canvasEl = container.querySelector('#qr-canvas');
  const canvasWrapper = container.querySelector('#qr-canvas-wrapper');
  const emptyState = container.querySelector('#qr-empty-state');
  const payloadDisplay = container.querySelector('#qr-payload-display');
  const sizeBadge = container.querySelector('#qr-size-badge');

  // Buttons
  const downloadBtn = container.querySelector('#qr-download-btn');
  const copyPayloadBtn = container.querySelector('#qr-copy-payload-btn');
  const copyPayloadText = container.querySelector('#copy-payload-text');
  const copyImgBtn = container.querySelector('#qr-copy-img-btn');
  const copyImgText = container.querySelector('#copy-img-text');
  const printBtn = container.querySelector('#qr-print-btn');

  // TAB Titles mapping
  const TAB_TITLES = {
    url: 'Enter Website Address',
    text: 'Enter Plain Text',
    phone: 'Enter Phone Details',
    email: 'Enter Email Details',
    sms: 'Enter SMS Details',
    wifi: 'Enter WiFi Network Details'
  };

  // Switch Active Tab
  function switchTab(tabKey) {
    activeTab = tabKey;

    tabBtns.forEach(btn => {
      const isSelected = btn.getAttribute('data-tab') === tabKey;
      btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      btn.className = `qr-tab-btn flex-1 min-w-[110px] inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        isSelected
          ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
      }`;
    });

    tabContents.forEach(tc => {
      if (tc.id === `form-tab-${tabKey}`) {
        tc.classList.remove('hidden');
      } else {
        tc.classList.add('hidden');
      }
    });

    if (tabTitleEl) {
      tabTitleEl.textContent = TAB_TITLES[tabKey] || 'Enter Details';
    }

    renderQrCode();
  }

  // Luminance and Contrast Scanner Compatibility Helpers
  function getLuminance(hex) {
    if (!hex || typeof hex !== 'string') return 0;
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    if (c.length !== 6) return 0;
    const r = parseInt(c.substring(0, 2), 16) / 255;
    const g = parseInt(c.substring(2, 4), 16) / 255;
    const b = parseInt(c.substring(4, 6), 16) / 255;
    const a = [r, g, b].map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function checkScanCompatibility() {
    const warningEl = container.querySelector('#scan-warning-banner');
    const warningText = container.querySelector('#scan-warning-text');
    if (!warningEl || !warningText) return;

    if (isTransparent) {
      warningEl.classList.remove('hidden');
      warningText.textContent = 'Transparent background active: Ensure you place or paste this QR code over a light-colored surface, otherwise camera scanners cannot detect it.';
      return;
    }

    const fgLum = getLuminance(fgColor);
    const bgLum = getLuminance(bgColor);

    if (fgLum >= bgLum) {
      warningEl.classList.remove('hidden');
      warningText.textContent = 'Inverted colors detected! Modules are lighter than background. Standard smartphone camera apps (iOS Camera & Google Lens) require dark modules on a light background.';
      return;
    }

    const l1 = Math.max(fgLum, bgLum);
    const l2 = Math.min(fgLum, bgLum);
    const contrastRatio = (l1 + 0.05) / (l2 + 0.05);

    if (contrastRatio < 3.0) {
      warningEl.classList.remove('hidden');
      warningText.textContent = 'Low color contrast detected between modules and background. Smartphone cameras may struggle to decode this QR code.';
      return;
    }

    if (parseInt(marginVal, 10) < 4) {
      warningEl.classList.remove('hidden');
      warningText.textContent = 'Quiet zone margin is under 4 modules. ISO/IEC 18004 specifies a minimum quiet zone of 4 modules for reliable camera scanning.';
      return;
    }

    warningEl.classList.add('hidden');
  }

  // Render QR Code onto Canvas using standard qrcode library
  async function renderQrCode() {
    const payload = getPayload();

    if (payloadDisplay) {
      payloadDisplay.textContent = payload || 'No data entered yet...';
    }

    if (!payload || !payload.trim()) {
      if (emptyState) emptyState.classList.remove('hidden');
      if (canvasWrapper) canvasWrapper.classList.add('hidden');
      checkScanCompatibility();
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (canvasWrapper) canvasWrapper.classList.remove('hidden');

    const effectiveBg = isTransparent ? '#00000000' : (bgColor || '#ffffff');
    const effectiveFg = fgColor || '#000000';

    try {
      await QRCode.toCanvas(canvasEl, payload, {
        width: 300,
        margin: Math.max(4, parseInt(marginVal, 10) || 4),
        color: {
          dark: effectiveFg,
          light: effectiveBg
        },
        errorCorrectionLevel: errorCorrectionLevel || 'M'
      });
      if (sizeBadge) {
        sizeBadge.textContent = `${exportSize} x ${exportSize} px export`;
      }
    } catch (err) {
      console.error('Failed to generate QR Code canvas:', err);
    }

    checkScanCompatibility();
  }

  // Event Listeners for Tabs
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.getAttribute('data-tab'));
    });
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        switchTab(btn.getAttribute('data-tab'));
      }
    });
  });

  // URL Helpers
  if (addHttpsBtn) {
    addHttpsBtn.addEventListener('click', () => {
      let v = inputUrl.value.trim();
      if (!/^https?:\/\//i.test(v)) {
        inputUrl.value = 'https://' + v.replace(/^http:\/\//i, '');
        urlVal = inputUrl.value;
        renderQrCode();
      }
    });
  }

  // Field Inputs binding
  inputUrl.addEventListener('input', (e) => { urlVal = e.target.value; renderQrCode(); });
  inputText.addEventListener('input', (e) => { textVal = e.target.value; renderQrCode(); });
  inputPhone.addEventListener('input', (e) => { phoneVal = e.target.value; renderQrCode(); });
  inputEmailTo.addEventListener('input', (e) => { emailTo = e.target.value; renderQrCode(); });
  inputEmailSubj.addEventListener('input', (e) => { emailSubject = e.target.value; renderQrCode(); });
  inputEmailBody.addEventListener('input', (e) => { emailBody = e.target.value; renderQrCode(); });
  inputSmsPhone.addEventListener('input', (e) => { smsPhone = e.target.value; renderQrCode(); });
  inputSmsMsg.addEventListener('input', (e) => { smsMsg = e.target.value; renderQrCode(); });
  inputWifiSsid.addEventListener('input', (e) => { wifiSsid = e.target.value; renderQrCode(); });
  inputWifiPass.addEventListener('input', (e) => { wifiPass = e.target.value; renderQrCode(); });
  inputWifiType.addEventListener('change', (e) => { wifiType = e.target.value; renderQrCode(); });
  inputWifiHidden.addEventListener('change', (e) => { wifiHidden = e.target.checked; renderQrCode(); });

  // Toggle Password Visibility
  toggleWifiPassBtn.addEventListener('click', () => {
    showWifiPass = !showWifiPass;
    inputWifiPass.type = showWifiPass ? 'text' : 'password';
    toggleWifiPassBtn.innerHTML = showWifiPass
      ? getIconSvg('eyeOff', 'w-3.5 h-3.5')
      : getIconSvg('eye', 'w-3.5 h-3.5');
  });

  // Clear Inputs
  clearInputsBtn.addEventListener('click', () => {
    switch (activeTab) {
      case 'url':
        urlVal = '';
        inputUrl.value = '';
        break;
      case 'text':
        textVal = '';
        inputText.value = '';
        break;
      case 'phone':
        phoneVal = '';
        inputPhone.value = '';
        break;
      case 'email':
        emailTo = '';
        emailSubject = '';
        emailBody = '';
        inputEmailTo.value = '';
        inputEmailSubj.value = '';
        inputEmailBody.value = '';
        break;
      case 'sms':
        smsPhone = '';
        smsMsg = '';
        inputSmsPhone.value = '';
        inputSmsMsg.value = '';
        break;
      case 'wifi':
        wifiSsid = '';
        wifiPass = '';
        inputWifiSsid.value = '';
        inputWifiPass.value = '';
        break;
    }
    renderQrCode();
  });

  // Color Pickers
  inputFgColor.addEventListener('input', (e) => {
    fgColor = e.target.value;
    inputFgHex.value = fgColor;
    renderQrCode();
  });
  inputFgHex.addEventListener('input', (e) => {
    let v = e.target.value.trim();
    if (!v.startsWith('#')) v = '#' + v;
    if (/^#[0-9A-F]{6}$/i.test(v)) {
      fgColor = v;
      inputFgColor.value = fgColor;
      renderQrCode();
    }
  });

  inputBgColor.addEventListener('input', (e) => {
    bgColor = e.target.value;
    inputBgHex.value = bgColor;
    renderQrCode();
  });
  inputBgHex.addEventListener('input', (e) => {
    let v = e.target.value.trim();
    if (!v.startsWith('#')) v = '#' + v;
    if (/^#[0-9A-F]{6}$/i.test(v)) {
      bgColor = v;
      inputBgColor.value = bgColor;
      renderQrCode();
    }
  });

  inputBgTransparent.addEventListener('change', (e) => {
    isTransparent = e.target.checked;
    renderQrCode();
  });

  // Color Palette Presets
  const presetBtns = container.querySelectorAll('.preset-btn');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.getAttribute('data-preset');
      switch (preset) {
        case 'classic':
          fgColor = '#000000';
          bgColor = '#ffffff';
          break;
        case 'ocean':
          fgColor = '#1e3a8a';
          bgColor = '#ffffff';
          break;
        case 'emerald':
          fgColor = '#064e3b';
          bgColor = '#ffffff';
          break;
        case 'purple':
          fgColor = '#581c87';
          bgColor = '#ffffff';
          break;
        case 'darkmode':
          fgColor = '#000000';
          bgColor = '#e2e8f0';
          break;
      }

      isTransparent = false;
      if (inputBgTransparent) inputBgTransparent.checked = false;
      inputFgColor.value = fgColor;
      inputFgHex.value = fgColor;
      inputBgColor.value = bgColor;
      inputBgHex.value = bgColor;
      renderQrCode();
    });
  });

  // Swap Colors Helper
  function swapColors() {
    const temp = fgColor;
    fgColor = bgColor;
    bgColor = temp;
    if (inputFgColor) inputFgColor.value = fgColor;
    if (inputFgHex) inputFgHex.value = fgColor;
    if (inputBgColor) inputBgColor.value = bgColor;
    if (inputBgHex) inputBgHex.value = bgColor;
    renderQrCode();
  }

  // Swap Colors Button Handler
  const swapColorsBtn = container.querySelector('#swap-colors-btn');
  if (swapColorsBtn) {
    swapColorsBtn.addEventListener('click', () => {
      swapColors();
    });
  }

  // Auto-Fix Scan Button Handler
  const autoFixScanBtn = container.querySelector('#auto-fix-scan-btn');
  if (autoFixScanBtn) {
    autoFixScanBtn.addEventListener('click', () => {
      fgColor = '#000000';
      bgColor = '#ffffff';
      isTransparent = false;
      marginVal = 4;
      if (inputFgColor) inputFgColor.value = fgColor;
      if (inputFgHex) inputFgHex.value = fgColor;
      if (inputBgColor) inputBgColor.value = bgColor;
      if (inputBgHex) inputBgHex.value = bgColor;
      if (inputBgTransparent) inputBgTransparent.checked = false;
      if (inputMargin) inputMargin.value = '4';
      renderQrCode();
    });
  }

  // Advanced Accordion
  toggleAdvBtn.addEventListener('click', () => {
    advPanel.classList.toggle('hidden');
    const isHidden = advPanel.classList.contains('hidden');
    advArrow.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(180deg)';
  });

  inputEcl.addEventListener('change', (e) => {
    errorCorrectionLevel = e.target.value;
    renderQrCode();
  });
  inputMargin.addEventListener('change', (e) => {
    marginVal = parseInt(e.target.value, 10);
    renderQrCode();
  });
  inputExportSize.addEventListener('change', (e) => {
    exportSize = parseInt(e.target.value, 10);
    renderQrCode();
  });

  // Download High Res PNG (identical to preview)
  downloadBtn.addEventListener('click', async () => {
    const payload = getPayload();
    if (!payload) return;

    // Auto-swap if user inverted colors (light modules on dark bg) so download is 100% camera-scannable
    if (!isTransparent && getLuminance(fgColor) >= getLuminance(bgColor)) {
      swapColors();
    }

    const exportCanvas = document.createElement('canvas');
    const effectiveBg = isTransparent ? '#00000000' : (bgColor || '#ffffff');
    const effectiveFg = fgColor || '#000000';
    const targetSize = Math.max(300, parseInt(exportSize, 10) || 600);

    try {
      await QRCode.toCanvas(exportCanvas, payload, {
        width: targetSize,
        margin: Math.max(4, parseInt(marginVal, 10) || 4),
        color: {
          dark: effectiveFg,
          light: effectiveBg
        },
        errorCorrectionLevel: errorCorrectionLevel || 'M'
      });

      const dataUrl = exportCanvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      const cleanLabel = activeTab + '-' + Date.now();
      a.download = `qrcode-${cleanLabel}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Download QR Code error:', err);
    }
  });

  // Copy Payload String
  copyPayloadBtn.addEventListener('click', async () => {
    const payload = getPayload();
    if (!payload) return;

    await copyToClipboard(payload);
    copyPayloadText.textContent = 'Copied!';
    setTimeout(() => {
      copyPayloadText.textContent = 'Copy Text';
    }, 2000);
  });

  // Copy QR Image
  copyImgBtn.addEventListener('click', async () => {
    const payload = getPayload();
    if (!payload) return;

    try {
      const exportCanvas = document.createElement('canvas');
      const targetSize = Math.max(300, parseInt(exportSize, 10) || 600);
      const effectiveBg = isTransparent ? '#00000000' : (bgColor || '#ffffff');
      const effectiveFg = fgColor || '#000000';

      await QRCode.toCanvas(exportCanvas, payload, {
        width: targetSize,
        margin: Math.max(4, parseInt(marginVal, 10) || 4),
        color: {
          dark: effectiveFg,
          light: effectiveBg
        },
        errorCorrectionLevel: errorCorrectionLevel || 'M'
      });

      exportCanvas.toBlob(async (blob) => {
        if (blob && navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          copyImgText.textContent = 'Image Copied!';
        } else {
          await copyToClipboard(payload);
          copyImgText.textContent = 'Payload Copied!';
        }
        setTimeout(() => {
          copyImgText.textContent = 'Copy Image';
        }, 2000);
      });
    } catch {
      await copyToClipboard(payload);
      copyImgText.textContent = 'Payload Copied!';
      setTimeout(() => {
        copyImgText.textContent = 'Copy Image';
      }, 2000);
    }
  });

  // Print Support
  printBtn.addEventListener('click', async () => {
    const payload = getPayload();
    if (!payload) return;

    try {
      const exportCanvas = document.createElement('canvas');
      const effectiveBg = isTransparent ? '#00000000' : (bgColor || '#ffffff');
      const effectiveFg = fgColor || '#000000';

      await QRCode.toCanvas(exportCanvas, payload, {
        width: 600,
        margin: Math.max(4, parseInt(marginVal, 10) || 4),
        color: {
          dark: effectiveFg,
          light: effectiveBg
        },
        errorCorrectionLevel: errorCorrectionLevel || 'M'
      });

      const dataUrl = exportCanvas.toDataURL('image/png');
      const printWin = window.open('', '_blank');
      if (!printWin) return;

      printWin.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print QR Code - Personal Tools Hub</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; text-align: center; padding: 40px; color: #0f172a; background: #ffffff; }
              .card { max-width: 420px; margin: 0 auto; border: 2px solid #e2e8f0; border-radius: 20px; padding: 32px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
              img { width: 260px; height: 260px; margin: 20px 0; border-radius: 12px; }
              h2 { margin: 0 0 6px 0; color: #0f172a; font-size: 22px; font-weight: 800; }
              p.sub { margin: 0 0 16px 0; color: #64748b; font-size: 13px; }
              .badge { display: inline-block; padding: 4px 14px; background: #eff6ff; color: #2563eb; font-weight: 700; font-size: 11px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.05em; }
              .payload-box { font-family: monospace; font-size: 11px; padding: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; word-break: break-all; color: #334155; margin-top: 12px; }
              .footer { margin-top: 24px; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 12px; }
            </style>
          </head>
          <body>
            <div class="card">
              <span class="badge">${activeTab} QR Code</span>
              <img src="${dataUrl}" alt="QR Code" />
              <h2>Point Camera to Scan</h2>
              <p class="sub">Compatible with iPhone, Android, & Tablets</p>
              <div class="payload-box">${payload}</div>
              <div class="footer">Printed from Personal Tools Hub</div>
            </div>
            <script>
              window.onload = () => {
                window.print();
                window.close();
              };
            </script>
          </body>
        </html>
      `);
      printWin.document.close();
    } catch (err) {
      console.error('Print QR Code error:', err);
    }
  });

  // Initial Draw
  renderQrCode();
}
