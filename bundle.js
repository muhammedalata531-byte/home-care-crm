/**
 * HomeCare AI Copilot - Standalone Production Bundle (Saudi Arabia + MicroSIP Dual Audio Edition)
 * Updated with systemAudio: 'include' for Windows Chrome/Edge
 */

(function() {
  'use strict';

  // ==========================================
  // 1. Audio Synthesizer (Web Audio API)
  // ==========================================
  class SoundEffects {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    play(type) {
      if (!this.enabled) return;
      try {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        switch (type) {
          case 'mic_start': {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.15);
            break;
          }
          case 'mic_stop': {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(660, now);
            osc.frequency.exponentialRampToValueAtTime(330, now + 0.12);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.15);
            break;
          }
          case 'extracted': {
            [523.25, 659.25, 783.99].forEach((freq, i) => {
              const osc = this.ctx.createOscillator();
              const gain = this.ctx.createGain();
              osc.type = 'triangle';
              osc.frequency.setValueAtTime(freq, now + i * 0.06);
              gain.gain.setValueAtTime(0.08, now + i * 0.06);
              gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);
              osc.connect(gain);
              gain.connect(this.ctx.destination);
              osc.start(now + i * 0.06);
              osc.stop(now + i * 0.06 + 0.25);
            });
            break;
          }
          case 'copied': {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(1108.73, now + 0.08);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.005, now + 0.14);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.14);
            break;
          }
          case 'emergency': {
            for (let i = 0; i < 2; i++) {
              const osc = this.ctx.createOscillator();
              const gain = this.ctx.createGain();
              osc.type = 'sawtooth';
              osc.frequency.setValueAtTime(987.77, now + i * 0.14);
              gain.gain.setValueAtTime(0.12, now + i * 0.14);
              gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.14 + 0.1);
              osc.connect(gain);
              gain.connect(this.ctx.destination);
              osc.start(now + i * 0.14);
              osc.stop(now + i * 0.14 + 0.1);
            }
            break;
          }
          case 'error': {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.setValueAtTime(180, now + 0.1);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.22);
            break;
          }
        }
      } catch (e) {
        console.warn('Audio feedback failed:', e);
      }
    }
  }

  const sounds = new SoundEffects();

  // ==========================================
  // 2. Saudi Arabia Presets & Quick Tags Data
  // ==========================================
  const CALL_PRESETS = [
    {
      id: 'diabetic_wound_riyadh',
      title: 'تمريض منزلي - غيار قرحة سكري وعناية جروح (الرياض - حي النرجس)',
      urgency: 'عادي',
      service: 'تمريض منزلي',
      fullTranscript: `السلام عليكم ورحمة الله، مساك الله بالخير يا فندم.
بتصل عليكم بخصوص الوالد، الوالد كبير بالسن ومريض سكر وضغط وطريح الفراش، وعنده قرحة سكري في القدم ومحتاجين ممرض شاطر يجي للبيت يغير على الجرح ويعقمه ويقيس له السكر ومستوى الضغط.
موقعنا في الرياض، حي النرجس، شمال طريق أنس بن مالك عند مجمع النرجس السكني.
ودنا الممرض يجي اليوم بعد صلاة العصر يعني حول الساعة 4:30 أو 5:00 عصراً. الله يعافيكم ومشكورين.`
    },
    {
      id: 'cardiac_emergency_jeddah',
      title: 'طوارئ قصوى - اشتباه أزمة قلبية وضيق تنفس (جدة - حي الشاطئ)',
      urgency: 'طوارئ قصوى',
      service: 'إسعاف وطوارئ',
      fullTranscript: `ألو! السلام عليكم! تكفون الحقونا بسرعة يا شباب!
الوالد الأستاذ عبد الله الغامدي فجأة مسك صدره وجاه ألم شديد جداً مثل الثقل مع ضيق تنفس وعرق بارد وغثيان وما يقدر يتنفس نهائياً!
محتاجين إسعاف مجهز أو طبيب طوارئ يوصل حالا مع جهاز تخطيط قلب ECG وأكسجين!
احنا في جدة، حي الشاطئ، شارع الأمير فيصل بن فهد، فيلا رقم 14 بجوار برج الشاطئ.
أرجوكم فزعتكم عاجل جداً وفوراً الحين!`
    },
    {
      id: 'elderly_doctor_khobar',
      title: 'زيارة طبيب - كشف باطنة وكبار سن منزلي (الخبر - حي الحزام الذهبي)',
      urgency: 'عاجل',
      service: 'زيارة طبيب',
      fullTranscript: `أهلاً وسهلاً، السلام عليكم.
لو تكرمت أبغى أحجز كشف طبيب باطنة واستشاري كبار سن منزلي للوالدة أم فهد.
عندها خمول شديد وارتفاع في درجات الحرارة وضعف في الشهية وما تقدر تروح للمستشفى وتعبانة من يومين.
العنوان في الخبر، حي الحزام الذهبي، بالقرب من مجمع الراشد التجاري.
يا ليت لو الطبيب يمرنا اليوم عاجل قبل الساعة 8 مساءً.`
    },
    {
      id: 'lab_package_riyadh',
      title: 'سحب عينات ومختبر - فحص شامل منزلي (الرياض - حي الملقا)',
      urgency: 'عادي',
      service: 'سحب عينات',
      fullTranscript: `صباح الخير، الله يعطيك العافية.
ودي أحجز خدمة سحب عينات دم ومختبر منزلي للوالد والوالدة.
الدكتور طالب باقة تحاليل دورية تشمل صورة دم CBC، وظائف كبد وكلى، سكر تراكمي وصائم، ودهون ثلاثية.
موقعنا بالرياض، حي الملقا، طريق أنس بن مالك بالقرب من حديقة الملقا الأولى.
نبا الأخصائي يجينا بكرة الصباح بدري على الساعة 7:30 صباحاً وهم صايمين. شكراً لكم.`
    },
    {
      id: 'physio_dammam',
      title: 'علاج طبيعي - تأهيل حركي بعد جلطة دماغية (الدمام - حي الشاطئ)',
      urgency: 'عادي',
      service: 'علاج طبيعي',
      fullTranscript: `مساك الله بالخير يا غالي.
أتصل بخصوص حجز جلسات علاج طبيعي وتأهيل حركي منزلي للوالد، أبو خالد.
هو الحمد لله طالع من المستشفى بعد جلطة دماغية وعنده ضعف في الجانب الأيمن ويحتاج أخصائي علاج طبيعي شاطر يبدأ معاه برنامج تأهيل وتقوية أطراف.
العنوان في الدمام، حي الشاطئ الغربي، بالقرب من كورنيش الدمام.
ودنا نبدأ أول جلسة تقييمية اليوم إن شاء الله الساعة 6:00 مساءً. جزاكم الله خير.`
    }
  ];

  const QUICK_MEDICAL_TAGS = [
    'تركيب كانيولا ومحاليل وريدية',
    'غيار جروح وقرح فراش وقدم سكري',
    'سحب عينات دم ومختبر شامل',
    'رسم وتخطيط قلب منزلي ECG',
    'جلسة تنفس واستنشاق نيبولايزر',
    'قسطرة بولية Foley Catheter',
    'حقن وريدي وعضلي بالمنزل',
    'فحص وقياس سكر وضغط ومؤشرات حيوية',
    'كشف باطنة وكبار سن منزلي',
    'تأهيل حركي وعلاج طبيعي مكثف',
    'رعاية تمريضية مقيمة لكبار السن',
    'توفير جهاز وأسطوانة أكسجين'
  ];

  // ==========================================
  // 3. Storage Manager
  // ==========================================
  const STORAGE_KEYS = {
    API_KEY: 'homecare_gemini_api_key',
    SETTINGS: 'homecare_copilot_settings',
    HISTORY: 'homecare_bookings_history'
  };

  const DEFAULT_SETTINGS = {
    model: 'gemini-2.5-flash',
    autoExtractOnStop: false,
    soundEffects: true,
    speechLanguage: 'ar-SA'
  };

  class StorageManager {
    getApiKey() {
      return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
    }

    setApiKey(key) {
      if (key) {
        localStorage.setItem(STORAGE_KEYS.API_KEY, key.trim());
      } else {
        localStorage.removeItem(STORAGE_KEYS.API_KEY);
      }
    }

    loadSettings() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : { ...DEFAULT_SETTINGS };
      } catch (e) {
        return { ...DEFAULT_SETTINGS };
      }
    }

    saveSettings(newSettings) {
      const current = this.loadSettings();
      const merged = { ...current, ...newSettings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
      return merged;
    }

    getHistory() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
        return data ? JSON.parse(data) : [];
      } catch (e) {
        return [];
      }
    }

    saveBooking(bookingData, transcript = '') {
      try {
        const history = this.getHistory();
        const newEntry = {
          id: 'bk_' + Date.now(),
          timestamp: new Date().toISOString(),
          timeFormatted: new Intl.DateTimeFormat('ar-SA', {
            hour: 'numeric',
            minute: 'numeric',
            day: 'numeric',
            month: 'short'
          }).format(new Date()),
          data: bookingData,
          transcript: transcript
        };
        const updated = [newEntry, ...history.filter(h => h.data?.patient_name !== bookingData.patient_name || Date.now() - new Date(h.timestamp).getTime() > 2000)].slice(0, 20);
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
        return updated;
      } catch (e) {
        return this.getHistory();
      }
    }

    deleteHistoryItem(id) {
      try {
        const history = this.getHistory().filter(item => item.id !== id);
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
        return history;
      } catch (e) {
        return this.getHistory();
      }
    }

    clearHistory() {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
      return [];
    }

    exportHistoryAsJSON() {
      const history = this.getHistory();
      const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `homecare_bookings_saudi_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  const storage = new StorageManager();

  // ==========================================
  // 4. Clipboard Manager & Toasts
  // ==========================================
  class ClipboardManager {
    static formatForCRM(data) {
      return [
        `الاسم: ${data.patient_name?.trim() || 'غير محدد'}`,
        `الخدمة: ${data.service_type?.trim() || 'غير محدد'}`,
        `المنطقة: ${data.district?.trim() || 'غير محدد'}`,
        `الموعد: ${data.preferred_time?.trim() || 'في أقرب وقت متاح'}`,
        `التفاصيل: ${data.medical_notes?.trim() || 'لا توجد ملاحظات إضافية'}`,
        `درجة الاستعجال: ${data.urgency_level?.trim() || 'عادي'}`
      ].join('\n');
    }

    static formatForWhatsApp(data) {
      const serviceType = data.service_type?.trim() || 'الرعاية الصحية المنزلية';
      const preferredTime = data.preferred_time?.trim() || 'المحدد معكم';

      return `أهلاً بك في خدمة الرعاية الصحية والطبية المنزلية. تم تسجيل موعدكم مبدئياً (${serviceType}) في موعد: [${preferredTime}].
يرجى مشاركة الموقع الجغرافي الدقيق (اللوكيشن) عبر هذه المحادثة لتأكيد وصول الفريق الطبي في الموعد.
نسعد بخدمتكم ونتمنى لكم دوام الصحة والعافية.`;
    }

    static async copyText(text, successMessage = 'تم النسخ إلى الحافظة بنجاح!') {
      if (!text || text.trim() === '') {
        ClipboardManager.showToast('لا توجد بيانات للنسخ!', 'warning');
        return false;
      }

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }

        sounds.play('copied');
        ClipboardManager.showToast(successMessage, 'success');
        return true;
      } catch (err) {
        ClipboardManager.showToast('تعذر النسخ تلقائياً، يرجى التحديد والنسخ يدوياً', 'error');
        sounds.play('error');
        return false;
      }
    }

    static showToast(message, type = 'success') {
      let container = document.getElementById('toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      let bgBorder = 'bg-emerald-950/95 border-emerald-500/60 text-emerald-100';
      let iconSvg = `<svg class="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>`;

      if (type === 'warning') {
        bgBorder = 'bg-amber-950/95 border-amber-500/60 text-amber-100';
        iconSvg = `<svg class="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`;
      } else if (type === 'error') {
        bgBorder = 'bg-rose-950/95 border-rose-500/60 text-rose-100';
        iconSvg = `<svg class="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>`;
      } else if (type === 'info') {
        bgBorder = 'bg-cyan-950/95 border-cyan-500/60 text-cyan-100';
        iconSvg = `<svg class="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
      }

      toast.className = `flex items-center gap-2.5 px-4 py-2.5 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 transform translate-y-4 opacity-0 pointer-events-auto font-medium text-xs sm:text-sm ${bgBorder}`;
      toast.innerHTML = `${iconSvg}<span>${message}</span>`;
      container.appendChild(toast);

      requestAnimationFrame(() => {
        toast.classList.remove('translate-y-4', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
      });

      setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-2', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
  }

  // ==========================================
  // 5. Gemini AI Extractor (Saudi Arabia + Audio Files)
  // ==========================================
  class GeminiExtractor {
    constructor(apiKey = '', model = 'gemini-2.5-flash') {
      this.apiKey = apiKey;
      this.model = model;
    }

    setApiKey(key) {
      this.apiKey = key ? key.trim() : '';
    }

    setModel(model) {
      this.model = model;
    }

    getSystemPrompt() {
      return `أنت خبير ذكاء اصطناعي متخصص في فرز وتحليل مكالمات حجز الرعاية الصحية والطبية المنزلية في المملكة العربية السعودية (Saudi Home Healthcare Call Center Copilot).
مهمتك هي الاستماع لمحادثة المكالمة بالعامية السعودية (النجدية، الحجازية، الشرقية، الجنوبية) أو الفصحى واستخراج بيانات الحجز الطبية واللوجستية بدقة متناهية وإرجاع كائن JSON حصراً.

قواعد الاستخراج والتصنيف:
1. اسم المريض (patient_name): استخرج اسم المريض المذكور في المكالمة (مثلاً الوالد أبو فهد، أم خالد، الأستاذ عبد الله الغامدي، الطفلة نورة...). إذا لم يُذكر، اكتب "غير محدد".
2. نوع الخدمة (service_type): اختر واحدة من القيم التالية بدقة:
   - "تمريض منزلي"
   - "زيارة طبيب"
   - "إسعاف وطوارئ"
   - "علاج طبيعي"
   - "سحب عينات ومختبر"
   - "رعاية كبار السن"
   - "أشعة وفحوصات منزلية"
3. المنطقة / الحي (district): استخرج المدينة والحي والشارع والمعالم المذكورة في السعودية (مثل: الرياض حي النرجس، جدة حي الشاطئ، الخبر حي الحزام الذهبي، الدمام...).
4. الموعد المقترح (preferred_time): استخرج التوقيت المفضل للزيارة (مثل: اليوم بعد صلاة العصر، غداً 7:30 صباحاً صائم، عاجل وفوراً...).
5. ملاحظات الحالة والطلب الطبي (medical_notes): صِغ ملخصاً طبياً واضحاً يوضح شكوى المريض، الأعراض، الإجراء التمريضي أو الطبي المطلوب، والتاريخ المرضي باختصار وافٍ.
6. درجة الاستعجال (urgency_level): صنف الحالة بدقة إلى واحدة من:
   - "طوارئ قصوى": (ألم صدر حاد، اشتباه جلطة، صعوبة تنفس حادة، نزيف حاد، فقدان وعي).
   - "عاجل": (حمى شديدة وقيء متكرر للأطفال، ألم شديد مستمر، إعياء وخمول حاد).
   - "عادي": (غيار روتيني، سحب عينات دورية، كشف غير طارئ، علاج طبيعي مجدول).

يجب أن يكون الرد عبارة عن كائن JSON فقط بالبنية التالية:
{
  "patient_name": "...",
  "service_type": "...",
  "district": "...",
  "preferred_time": "...",
  "medical_notes": "...",
  "urgency_level": "عادي" | "عاجل" | "طوارئ قصوى"
}`;
    }

    async extractEntities(transcript) {
      if (!transcript || transcript.trim().length < 5) {
        throw new Error('نص المكالمة قصير جداً أو فارغ لاستخراج البيانات');
      }

      if (!this.apiKey) {
        return this.offlineFallbackExtract(transcript);
      }

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
      const requestBody = {
        contents: [
          {
            role: 'user',
            parts: [{ text: `إليك نص المكالمة الواردة لمركز خدمة العملاء في السعودية:\n"""\n${transcript}\n"""\nاستخرج بيانات الحجز الطبية بصيغة JSON.` }]
          }
        ],
        systemInstruction: { parts: [{ text: this.getSystemPrompt() }] },
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1,
          maxOutputTokens: 1000
        }
      };

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) throw new Error('لم يتم استلام نص من نموذج الذكاء الاصطناعي');

        return this.cleanAndParseJSON(rawText);
      } catch (err) {
        console.warn('API error, falling back to local extractor:', err);
        const fallback = this.offlineFallbackExtract(transcript);
        fallback._warning = `تم الاستخراج بالمحرك الاحتياطي (${err.message})`;
        return fallback;
      }
    }

    async extractFromAudioFile(base64Audio, mimeType = 'audio/wav') {
      if (!this.apiKey) {
        throw new Error('لاستخراج البيانات مباشرة من ملف تسجيل المكالمة، يرجى إدخال مفتاح Gemini API في الإعدادات أولاً.');
      }

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
      const requestBody = {
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Audio
                }
              },
              {
                text: `استمع لهذا التسجيل الصوتي لمكالمة حجز رعاية صحية منزلية بالسعودية (بين الموظف والعميل في MicroSIP)، وفرّغ المحادثة واستخرج بيانات الحجز الطبية بالكامل بصيغة JSON.`
              }
            ]
          }
        ],
        systemInstruction: { parts: [{ text: this.getSystemPrompt() }] },
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1,
          maxOutputTokens: 1000
        }
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('لم يتم استلام رد من النموذج لتحليل الملف الصوتي');

      return this.cleanAndParseJSON(rawText);
    }

    cleanAndParseJSON(rawText) {
      let clean = rawText.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '');
      try {
        return JSON.parse(clean);
      } catch (e) {
        const jsonMatch = clean.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
        throw new Error('تعذر تحليل JSON المستلم');
      }
    }

    offlineFallbackExtract(transcript) {
      const text = transcript.toLowerCase();
      let urgency = 'عادي';
      if (/طوارئ|جلطة|ما يقدر يتنفس|ألم بالصدر|صدره|سكتة|غيبوبة|عرق بارد|نزيف|الحقونا|تكفون|فورا|الحين/.test(text)) {
        urgency = 'طوارئ قصوى';
      } else if (/عاجل|سخونة|حرارة|ترجيع|تعبان|الم شديد|خمول|طريح فراش|وجع/.test(text)) {
        urgency = 'عاجل';
      }

      let service = 'تمريض منزلي';
      if (/طوارئ|إسعاف|اسعاف|عربية اسعاف|نقل طبي/.test(text)) service = 'إسعاف وطوارئ';
      else if (/دكتور|طبيب|كشف|باطنة|أطفال|اطفال|عظام|قلب|استشاري/.test(text)) service = 'زيارة طبيب';
      else if (/علاج طبيعي|تأهيل|ركبة|مفصل|عضلات|جلطة دماغية/.test(text)) service = 'علاج طبيعي';
      else if (/سحب|عينات|مختبر|تحاليل|تحليل|صورة دم|وظائف كلى|سكر صائم|تراكمي/.test(text)) service = 'سحب عينات ومختبر';
      else if (/اشعة|أشعة|سونار|تخطيط قلب|رسم قلب|ecg/.test(text)) service = 'أشعة وفحوصات منزلية';
      else if (/كبار السن|مسنين|جليس|رعاية كبار/.test(text)) service = 'رعاية كبار السن';

      const saudiLocations = [
        'الرياض - حي النرجس', 'الرياض - حي الملقا', 'الرياض - حي الياسمين', 'الرياض - حي العليا',
        'الرياض - حي الصحافة', 'الرياض - حي الروضة', 'الرياض - حي السليمانية', 'الرياض - حي حطين',
        'جدة - حي الشاطئ', 'جدة - حي الروضة', 'جدة - حي الحمراء', 'جدة - حي الصفا', 'جدة - حي السلامة',
        'الخبر - حي الحزام الذهبي', 'الخبر - حي الراكة', 'الخبر - حي العقربية',
        'الدمام - حي الشاطئ', 'الدمام - حي الفيصلية', 'مكة المكرمة', 'المدينة المنورة', 'الرياض', 'جدة', 'الخبر', 'الدمام'
      ];
      let district = 'المملكة العربية السعودية';
      for (const loc of saudiLocations) {
        if (text.includes(loc.toLowerCase())) {
          district = loc;
          break;
        }
      }

      let patientName = 'غير محدد';
      const namePatterns = [
        /(?:الوالد|الوالدة|أبو|ابو|أم|ام|أستاذ|استاذ|الشيخ|الأخ|الأخت|بنتي|ولدي|المريض)\s+([^\s,،.]+)/i,
        /(?:اسمه|اسمها|لـ|للأستاذ|للشيخ)\s+([^\s,،.]+)/i
      ];
      for (const pat of namePatterns) {
        const match = transcript.match(pat);
        if (match && match[0]) {
          patientName = match[0].trim();
          break;
        }
      }

      let preferredTime = 'اليوم في أقرب وقت متاح';
      if (/اليوم/.test(text)) {
        const timeMatch = text.match(/(?:الساعة|حوالي|بعد صلاة|بعد)\s*(\d+|العصر|المغرب|الظهر|العشاء|الصبح)/i);
        preferredTime = timeMatch ? `اليوم ${timeMatch[0]}` : 'اليوم';
      } else if (/بكرة|غداً|غدا/.test(text)) {
        preferredTime = 'غداً صباحاً';
      } else if (urgency === 'طوارئ قصوى') {
        preferredTime = 'عاجل جداً وفوراً (الآن)';
      }

      return {
        patient_name: patientName,
        service_type: service,
        district: district,
        preferred_time: preferredTime,
        medical_notes: `استخراج تقديري: ${transcript.slice(0, 160)}...`,
        urgency_level: urgency
      };
    }

    async testApiKey() {
      if (!this.apiKey) return { valid: false, message: 'مفتاح API غير مدخل' };
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: 'مرحبا' }] }] })
        });
        if (res.ok) {
          return { valid: true, message: 'المفتاح نشط ويعمل بنجاح!' };
        } else {
          const err = await res.json().catch(() => ({}));
          return { valid: false, message: err.error?.message || 'المفتاح غير صالح' };
        }
      } catch (e) {
        return { valid: false, message: `تعذر الاتصال: ${e.message}` };
      }
    }
  }

  // ==========================================
  // 6. Speech Recognition Engine (Dual Audio)
  // ==========================================
  class SpeechEngine {
    constructor(options = {}) {
      this.language = options.language || 'ar-SA';
      this.audioSourceMode = options.audioSourceMode || 'mic';
      this.onTranscriptUpdate = options.onTranscriptUpdate || (() => {});
      this.onStatusChange = options.onStatusChange || (() => {});
      this.onError = options.onError || (() => {});
      this.onAudioLevel = options.onAudioLevel || (() => {});
      this.onTimerTick = options.onTimerTick || (() => {});

      this.recognition = null;
      this.isCallActive = false;
      this.isPaused = false;

      this.accumulatedTranscript = '';
      this.currentSessionTranscript = '';
      this.interimTranscript = '';

      this.audioContext = null;
      this.analyser = null;
      this.mediaStream = null;
      this.systemStream = null;
      this.animationFrameId = null;

      this.callDurationSeconds = 0;
      this.callTimerInterval = null;

      this.restartTimeout = null;
      this.isRestarting = false;

      this.simulationTimer = null;
      this.isSimulating = false;
    }

    initRecognition() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.warn('SpeechRecognition not found.');
        return false;
      }

      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = this.language;
        this.recognition.maxAlternatives = 1;

        this.recognition.onstart = () => {
          this.isRestarting = false;
          if (this.isCallActive) {
            this.onStatusChange('listening');
          }
        };

        this.recognition.onresult = (event) => {
          let currentInterim = '';
          let currentFinal = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcriptPart = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              currentFinal += (currentFinal ? ' ' : '') + transcriptPart.trim();
            } else {
              currentInterim += transcriptPart;
            }
          }

          if (currentFinal) {
            this.currentSessionTranscript += (this.currentSessionTranscript ? ' ' : '') + currentFinal;
          }

          this.interimTranscript = currentInterim;
          this.onTranscriptUpdate(this.getFullTranscript(), this.interimTranscript);
        };

        this.recognition.onerror = (event) => {
          console.warn('Speech error event:', event.error);
          if (event.error === 'no-speech') return;
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            this.onError('تم رفض أو حجب الميكروفون من المتصفح. لتفعيله، يرجى السماح بالإذن أو تشغيل run.bat.');
            this.stop();
          }
        };

        this.recognition.onend = () => {
          if (this.isCallActive && !this.isPaused && !this.isSimulating) {
            this.safeRestart();
          } else if (!this.isCallActive) {
            this.stopAudioAnalysis();
            this.stopTimer();
            this.onStatusChange('idle');
          }
        };
        return true;
      } catch (e) {
        console.error('Failed to instantiate SpeechRecognition:', e);
        return false;
      }
    }

    safeRestart() {
      if (!this.isCallActive || this.isRestarting) return;
      this.isRestarting = true;

      if (this.currentSessionTranscript) {
        this.accumulatedTranscript += (this.accumulatedTranscript ? ' ' : '') + this.currentSessionTranscript;
        this.currentSessionTranscript = '';
      }

      if (this.restartTimeout) clearTimeout(this.restartTimeout);
      this.restartTimeout = setTimeout(() => {
        if (this.isCallActive && this.recognition) {
          try {
            this.recognition.start();
          } catch (e) {
            this.isRestarting = false;
          }
        }
      }, 100);
    }

    setLanguage(lang) {
      this.language = lang;
      if (this.recognition) this.recognition.lang = lang;
    }

    async start(captureSystemAudio = false) {
      if (this.isSimulating) this.stopSimulation();

      if (!this.recognition) {
        const supported = this.initRecognition();
        if (!supported) {
          this.onError('متصفحك لا يدعم التعرف على الصوت. يرجى استخدام Chrome أو Edge.');
          return false;
        }
      }

      try {
        this.isCallActive = true;
        this.isPaused = false;
        this.currentSessionTranscript = '';
        sounds.play('mic_start');
        this.startTimer();
        this.onStatusChange('listening');

        this.recognition.start();
        await this.startAudioAnalysis(captureSystemAudio);
        return true;
      } catch (e) {
        console.warn('Speech start catch:', e);
        if (e.name === 'InvalidStateError') return true;
        this.onError('تعذر بدء التسجيل الصوتي: ' + e.message);
        this.isCallActive = false;
        this.onStatusChange('idle');
        return false;
      }
    }

    stop() {
      if (this.isSimulating) {
        this.stopSimulation();
        return;
      }

      const wasActive = this.isCallActive;
      this.isCallActive = false;
      this.isPaused = false;

      if (wasActive) sounds.play('mic_stop');

      if (this.currentSessionTranscript) {
        this.accumulatedTranscript += (this.accumulatedTranscript ? ' ' : '') + this.currentSessionTranscript;
        this.currentSessionTranscript = '';
      }

      if (this.recognition) {
        try {
          this.recognition.stop();
        } catch (e) {}
      }

      if (this.restartTimeout) {
        clearTimeout(this.restartTimeout);
        this.restartTimeout = null;
      }

      this.stopTimer();
      this.stopAudioAnalysis();
      this.onStatusChange('idle');
    }

    toggle(captureSystemAudio = false) {
      if (this.isCallActive || this.isSimulating) {
        this.stop();
        return false;
      } else {
        this.start(captureSystemAudio);
        return true;
      }
    }

    getFullTranscript() {
      const combined = [this.accumulatedTranscript, this.currentSessionTranscript].filter(Boolean).join(' ');
      return combined.trim();
    }

    setTranscript(text) {
      this.accumulatedTranscript = text || '';
      this.currentSessionTranscript = '';
      this.interimTranscript = '';
      this.onTranscriptUpdate(this.accumulatedTranscript, '');
    }

    clearTranscript() {
      this.accumulatedTranscript = '';
      this.currentSessionTranscript = '';
      this.interimTranscript = '';
      this.callDurationSeconds = 0;
      this.onTranscriptUpdate('', '');
      this.onTimerTick(0, '00:00');
    }

    startTimer() {
      this.stopTimer();
      this.callDurationSeconds = 0;
      this.onTimerTick(0, '00:00');
      this.callTimerInterval = setInterval(() => {
        this.callDurationSeconds++;
        const mins = String(Math.floor(this.callDurationSeconds / 60)).padStart(2, '0');
        const secs = String(this.callDurationSeconds % 60).padStart(2, '0');
        this.onTimerTick(this.callDurationSeconds, `${mins}:${secs}`);
      }, 1000);
    }

    stopTimer() {
      if (this.callTimerInterval) {
        clearInterval(this.callTimerInterval);
        this.callTimerInterval = null;
      }
    }

    async startAudioAnalysis(captureSystemAudio = false) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioCtx();

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
          } catch (e) {}
        }

        if (captureSystemAudio && navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          try {
            this.systemStream = await navigator.mediaDevices.getDisplayMedia({
              video: true,
              audio: { suppressLocalAudioPlayback: false },
              systemAudio: 'include'
            });
          } catch (e) {
            console.warn('System audio note:', e);
          }
        }

        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 64;
        this.analyser.smoothingTimeConstant = 0.8;

        if (this.mediaStream) {
          const micSource = this.audioContext.createMediaStreamSource(this.mediaStream);
          micSource.connect(this.analyser);
        }

        if (this.systemStream && this.systemStream.getAudioTracks().length > 0) {
          const sysSource = this.audioContext.createMediaStreamSource(this.systemStream);
          sysSource.connect(this.analyser);
        }

        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const loop = () => {
          if (!this.isCallActive && !this.isSimulating) return;
          this.analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
          this.onAudioLevel(sum / bufferLength, dataArray);
          this.animationFrameId = requestAnimationFrame(loop);
        };
        loop();
      } catch (e) {
        this.startMockWaveform();
      }
    }

    startMockWaveform() {
      const loop = () => {
        if (!this.isCallActive && !this.isSimulating) return;
        const mockData = new Uint8Array(32);
        const time = Date.now() / 150;
        for (let i = 0; i < 32; i++) {
          mockData[i] = Math.max(10, Math.floor(Math.sin(time + i * 0.4) * 80 + 100));
        }
        this.onAudioLevel(60, mockData);
        this.animationFrameId = requestAnimationFrame(loop);
      };
      loop();
    }

    stopAudioAnalysis() {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(t => t.stop());
        this.mediaStream = null;
      }
      if (this.systemStream) {
        this.systemStream.getTracks().forEach(t => t.stop());
        this.systemStream = null;
      }
      if (this.audioContext && this.audioContext.state !== 'closed') {
        this.audioContext.close().catch(() => {});
        this.audioContext = null;
      }
      this.onAudioLevel(0, new Uint8Array(32));
    }

    simulateCallTranscript(fullText, onComplete) {
      this.stop();
      this.isSimulating = true;
      this.isCallActive = true;
      this.accumulatedTranscript = '';
      this.currentSessionTranscript = '';
      this.interimTranscript = '';
      this.onStatusChange('listening');
      this.startTimer();
      sounds.play('mic_start');

      this.startMockWaveform();

      const words = fullText.split(' ');
      let currentIdx = 0;

      const streamWord = () => {
        if (!this.isSimulating) return;
        if (currentIdx < words.length) {
          const batchSize = Math.floor(Math.random() * 3) + 1;
          const chunk = words.slice(currentIdx, currentIdx + batchSize).join(' ');
          currentIdx += batchSize;

          this.accumulatedTranscript += (this.accumulatedTranscript ? ' ' : '') + chunk;
          this.onTranscriptUpdate(this.accumulatedTranscript, '');

          const delay = Math.floor(Math.random() * 100) + 80;
          this.simulationTimer = setTimeout(streamWord, delay);
        } else {
          this.isSimulating = false;
          this.isCallActive = false;
          this.stopTimer();
          this.stopAudioAnalysis();
          this.onStatusChange('idle');
          sounds.play('mic_stop');
          if (onComplete) onComplete(this.accumulatedTranscript);
        }
      };

      this.simulationTimer = setTimeout(streamWord, 200);
    }

    stopSimulation() {
      if (this.simulationTimer) {
        clearTimeout(this.simulationTimer);
        this.simulationTimer = null;
      }
      this.isSimulating = false;
      this.isCallActive = false;
      this.stopTimer();
      this.stopAudioAnalysis();
      this.onStatusChange('idle');
    }
  }

  // ==========================================
  // 7. Main Application Class
  // ==========================================
  class HomeCareCopilotApp {
    constructor() {
      this.storage = storage;
      this.settings = this.storage.loadSettings();
      this.gemini = new GeminiExtractor(this.storage.getApiKey(), this.settings.model);
      this.sounds = sounds;
      this.sounds.enabled = this.settings.soundEffects !== false;

      this.currentBooking = {
        patient_name: '',
        service_type: 'تمريض منزلي',
        district: '',
        preferred_time: '',
        medical_notes: '',
        urgency_level: 'عادي'
      };

      this.audioSourceMode = 'mic';
      this.isExtracting = false;

      this.initDOM();
      this.initSpeech();
      this.initPresetsAndTags();
      this.initEventListeners();
      this.initKeyboardShortcuts();
      this.updateApiKeyIndicator();
      this.renderHistory();

      if (window.lucide) window.lucide.createIcons();

      if (window.location.protocol === 'file:') {
        const protocolBanner = document.getElementById('protocol-warning-banner');
        if (protocolBanner) protocolBanner.classList.remove('hidden');
      }
    }

    initDOM() {
      this.statusPill = document.getElementById('status-pill');
      this.statusDot = document.getElementById('status-dot');
      this.statusText = document.getElementById('status-text');
      this.audioWave = document.getElementById('audio-wave');
      this.apiKeyIndicator = document.getElementById('api-key-indicator');
      this.callTimerDisplay = document.getElementById('call-timer-display');

      this.srcMicBtn = document.getElementById('src-mic-btn');
      this.srcDualBtn = document.getElementById('src-dual-btn');
      this.microsipGuideBtn = document.getElementById('microsip-guide-btn');
      this.microsipHelpLink = document.getElementById('microsip-help-link');
      this.microsipModal = document.getElementById('microsip-modal');
      this.closeMicrosipBtn = document.getElementById('close-microsip-btn');
      this.closeMicrosipBtn2 = document.getElementById('close-microsip-btn-2');
      this.audioFileInput = document.getElementById('audio-file-input');

      this.micToggleBtn = document.getElementById('mic-toggle-btn');
      this.micIcon = document.getElementById('mic-icon');
      this.micLabel = document.getElementById('mic-label');
      this.transcriptBox = document.getElementById('transcript-box');
      this.interimText = document.getElementById('interim-text');
      this.wordCount = document.getElementById('word-count');
      this.clearTranscriptBtn = document.getElementById('clear-transcript-btn');
      this.presetSelect = document.getElementById('preset-select');
      this.playPresetBtn = document.getElementById('play-preset-btn');
      this.quickTagsContainer = document.getElementById('quick-tags-container');
      this.extractBtn = document.getElementById('extract-btn');
      this.extractBtnText = document.getElementById('extract-btn-text');

      this.fieldPatientName = document.getElementById('field-patient-name');
      this.fieldServiceType = document.getElementById('field-service-type');
      this.fieldDistrict = document.getElementById('field-district');
      this.fieldPreferredTime = document.getElementById('field-preferred-time');
      this.fieldMedicalNotes = document.getElementById('field-medical-notes');
      this.urgencyBadgeDisplay = document.getElementById('urgency-badge-display');
      this.urgencyBadgeText = document.getElementById('urgency-badge-text');
      this.urgencyChoiceBtns = document.querySelectorAll('.urgency-choice-btn');

      this.copyCrmBtn = document.getElementById('copy-crm-btn');
      this.copyWhatsappBtn = document.getElementById('copy-whatsapp-btn');
      this.resetFormBtn = document.getElementById('reset-form-btn');

      this.settingsBtn = document.getElementById('settings-btn');
      this.quickKeyBtn = document.getElementById('quick-key-btn');
      this.settingsModal = document.getElementById('settings-modal');
      this.closeSettingsBtn = document.getElementById('close-settings-btn');
      this.settingApiKey = document.getElementById('setting-api-key');
      this.toggleKeyVisibility = document.getElementById('toggle-key-visibility');
      this.keyVisIcon = document.getElementById('key-vis-icon');
      this.testApiKeyBtn = document.getElementById('test-api-key-btn');
      this.testKeyStatus = document.getElementById('test-key-status');
      this.settingModel = document.getElementById('setting-model');
      this.settingDialect = document.getElementById('setting-dialect');
      this.settingAutoExtract = document.getElementById('setting-auto-extract');
      this.settingSound = document.getElementById('setting-sound');
      this.saveSettingsBtn = document.getElementById('save-settings-btn');

      this.historyDrawerBtn = document.getElementById('history-drawer-btn');
      this.historyBadge = document.getElementById('history-badge');
      this.historyDrawer = document.getElementById('history-drawer');
      this.historyBackdrop = document.getElementById('history-backdrop');
      this.historyPanel = document.getElementById('history-panel');
      this.closeHistoryBtn = document.getElementById('close-history-btn');
      this.historyList = document.getElementById('history-list');
      this.exportHistoryBtn = document.getElementById('export-history-btn');
      this.clearAllHistoryBtn = document.getElementById('clear-all-history-btn');

      this.toggleSplitBtn = document.getElementById('toggle-split-btn');
      this.crmSimulatorPane = document.getElementById('crm-simulator-pane');
      this.crmSimPasteBox = document.getElementById('crm-sim-paste-box');
      this.crmSimClearBtn = document.getElementById('crm-sim-clear-btn');

      this.toggleSoundBtn = document.getElementById('toggle-sound-btn');
      this.soundIcon = document.getElementById('sound-icon');
    }

    initSpeech() {
      this.speech = new SpeechEngine({
        language: this.settings.speechLanguage || 'ar-SA',
        onTranscriptUpdate: (finalText, interimText) => {
          this.transcriptBox.value = finalText;
          this.interimText.textContent = interimText ? `جاري النطق: "${interimText}"` : '';
          this.updateWordCount(finalText);
          this.transcriptBox.scrollTop = this.transcriptBox.scrollHeight;
        },
        onStatusChange: (status) => {
          this.updateSpeechStatusUI(status);
          if (status === 'idle' && this.settings.autoExtractOnStop && this.transcriptBox.value.trim().length > 10) {
            this.triggerAiExtraction();
          }
        },
        onTimerTick: (seconds, formattedTime) => {
          if (this.callTimerDisplay) {
            this.callTimerDisplay.textContent = formattedTime;
          }
        },
        onError: (msg) => {
          ClipboardManager.showToast(msg, 'error');
        },
        onAudioLevel: (avgLevel, dataArray) => {
          this.animateWaveBars(dataArray);
        }
      });
    }

    initPresetsAndTags() {
      this.presetSelect.innerHTML = '<option value="">-- اختر سيناريو مكالمة سعودية للتجربة --</option>';
      CALL_PRESETS.forEach((preset) => {
        const opt = document.createElement('option');
        opt.value = preset.id;
        opt.textContent = `[${preset.urgency}] ${preset.title}`;
        this.presetSelect.appendChild(opt);
      });

      this.quickTagsContainer.innerHTML = '';
      QUICK_MEDICAL_TAGS.forEach((tag) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'px-2 py-1 rounded-md bg-slate-900 hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 text-[11px] font-medium transition';
        btn.textContent = `+ ${tag}`;
        btn.addEventListener('click', () => {
          const current = this.transcriptBox.value.trim();
          this.transcriptBox.value = current ? `${current} - ${tag}` : tag;
          this.speech.setTranscript(this.transcriptBox.value);
          this.updateWordCount(this.transcriptBox.value);
          ClipboardManager.showToast(`تمت إضافة الإجراء: ${tag}`, 'info');
        });
        this.quickTagsContainer.appendChild(btn);
      });
    }

    initEventListeners() {
      this.fetchLatestCallBtn = document.getElementById('fetch-latest-call-btn');
      if (this.fetchLatestCallBtn) {
        this.fetchLatestCallBtn.addEventListener('click', () => {
          this.fetchLatestMicroSipCall();
        });
      }

      this.srcMicBtn.addEventListener('click', () => {
        this.audioSourceMode = 'mic';
        this.srcMicBtn.className = 'px-2 py-0.5 rounded bg-emerald-600 text-white font-medium transition';
        this.srcDualBtn.className = 'px-2 py-0.5 rounded text-slate-400 hover:text-white transition flex items-center gap-1';
        ClipboardManager.showToast('تم تعيين مصدر الصوت: الميكروفون المباشر', 'info');
      });

      this.srcDualBtn.addEventListener('click', () => {
        this.audioSourceMode = 'dual';
        this.srcDualBtn.className = 'px-2 py-0.5 rounded bg-cyan-600 text-white font-medium transition flex items-center gap-1';
        this.srcMicBtn.className = 'px-2 py-0.5 rounded text-slate-400 hover:text-white transition';
        ClipboardManager.showToast('تم تفعيل وضع دمج صوت MicroSIP مع المايك', 'info');
        if (!this.speech.isCallActive) {
          this.microsipModal.classList.remove('hidden');
        }
      });

      const openGuide = () => { this.microsipModal.classList.remove('hidden'); };
      const closeGuide = () => { this.microsipModal.classList.add('hidden'); };
      this.microsipGuideBtn.addEventListener('click', openGuide);
      this.microsipHelpLink.addEventListener('click', openGuide);
      this.closeMicrosipBtn.addEventListener('click', closeGuide);
      this.closeMicrosipBtn2.addEventListener('click', closeGuide);

      this.audioFileInput.addEventListener('change', async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        ClipboardManager.showToast(`جاري تحليل واستخراج بيانات المكالمة من: ${file.name}...`, 'info');
        this.updateStatus('extracting', 'جاري تحليل ملف تسجيل المكالمة...');
        this.extractBtnText.textContent = 'جاري تحليل الملف الصوتي...';
        this.extractBtn.disabled = true;

        try {
          const reader = new FileReader();
          reader.onload = async () => {
            try {
              const base64Data = reader.result.split(',')[1];
              const mimeType = file.type || 'audio/wav';
              const extracted = await this.gemini.extractFromAudioFile(base64Data, mimeType);
              this.populateForm(extracted);
              if (extracted.urgency_level === 'طوارئ قصوى') {
                this.sounds.play('emergency');
              } else {
                this.sounds.play('extracted');
              }
              ClipboardManager.showToast('تم تفريغ واستخراج بيانات المكالمة الصوتية بنجاح!', 'success');
            } catch (err) {
              console.error('Audio file extraction error:', err);
              ClipboardManager.showToast(err.message || 'فشل تحليل ملف الصوت', 'error');
              this.sounds.play('error');
            } finally {
              this.extractBtnText.textContent = 'استخراج وتحديث البيانات (Gemini AI)';
              this.extractBtn.disabled = false;
              this.updateStatus('idle', 'جاهز للاستماع');
            }
          };
          reader.readAsDataURL(file);
        } catch (err) {
          ClipboardManager.showToast('تعذر قراءة ملف الصوت: ' + err.message, 'error');
        }
      });

      this.micToggleBtn.addEventListener('click', () => {
        const captureSystem = this.audioSourceMode === 'dual';
        this.speech.toggle(captureSystem);
      });

      this.transcriptBox.addEventListener('input', () => {
        this.speech.setTranscript(this.transcriptBox.value);
        this.updateWordCount(this.transcriptBox.value);
      });

      this.clearTranscriptBtn.addEventListener('click', () => {
        this.speech.clearTranscript();
        this.transcriptBox.value = '';
        this.interimText.textContent = '';
        this.updateWordCount('');
        ClipboardManager.showToast('تم مسح نص المكالمة', 'info');
      });

      this.playPresetBtn.addEventListener('click', () => {
        const selectedId = this.presetSelect.value;
        if (!selectedId) {
          ClipboardManager.showToast('يرجى اختيار سيناريو مكالمة من القائمة أولاً', 'warning');
          return;
        }
        const preset = CALL_PRESETS.find(p => p.id === selectedId);
        if (preset) {
          ClipboardManager.showToast(`بدء محاكاة المكالمة السعودية: ${preset.title}`, 'info');
          this.speech.simulateCallTranscript(preset.fullTranscript, (finalText) => {
            ClipboardManager.showToast('اكتملت المكالمة، جاري استخراج البيانات...', 'success');
            this.triggerAiExtraction();
          });
        }
      });

      this.extractBtn.addEventListener('click', () => {
        this.triggerAiExtraction();
      });

      this.fieldPatientName.addEventListener('input', (e) => { this.currentBooking.patient_name = e.target.value; });
      this.fieldServiceType.addEventListener('change', (e) => { this.currentBooking.service_type = e.target.value; });
      this.fieldDistrict.addEventListener('input', (e) => { this.currentBooking.district = e.target.value; });
      this.fieldPreferredTime.addEventListener('input', (e) => { this.currentBooking.preferred_time = e.target.value; });
      this.fieldMedicalNotes.addEventListener('input', (e) => { this.currentBooking.medical_notes = e.target.value; });

      this.urgencyChoiceBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const urgency = btn.getAttribute('data-urgency');
          this.setUrgencyLevel(urgency);
        });
      });

      this.copyCrmBtn.addEventListener('click', () => { this.copyForCRM(); });
      this.copyWhatsappBtn.addEventListener('click', () => { this.copyForWhatsApp(); });
      this.resetFormBtn.addEventListener('click', () => { this.resetBookingForm(); });

      const openSettings = () => {
        this.settingApiKey.value = this.storage.getApiKey();
        this.settingModel.value = this.settings.model || 'gemini-2.5-flash';
        this.settingDialect.value = this.settings.speechLanguage || 'ar-SA';
        this.settingAutoExtract.checked = this.settings.autoExtractOnStop === true;
        this.settingSound.checked = this.settings.soundEffects !== false;
        this.testKeyStatus.textContent = '';
        this.settingsModal.classList.remove('hidden');
      };

      this.settingsBtn.addEventListener('click', openSettings);
      this.quickKeyBtn.addEventListener('click', openSettings);
      this.closeSettingsBtn.addEventListener('click', () => { this.settingsModal.classList.add('hidden'); });

      this.toggleKeyVisibility.addEventListener('click', () => {
        const isPass = this.settingApiKey.type === 'password';
        this.settingApiKey.type = isPass ? 'text' : 'password';
        this.keyVisIcon.setAttribute('data-lucide', isPass ? 'eye-off' : 'eye');
        if (window.lucide) window.lucide.createIcons();
      });

      this.testApiKeyBtn.addEventListener('click', async () => {
        this.testKeyStatus.textContent = 'جاري الفحص...';
        this.testKeyStatus.className = 'text-xs text-amber-400';
        const tempKey = this.settingApiKey.value.trim();
        const tempExtractor = new GeminiExtractor(tempKey, this.settingModel.value);
        const res = await tempExtractor.testApiKey();
        if (res.valid) {
          this.testKeyStatus.textContent = res.message;
          this.testKeyStatus.className = 'text-xs text-emerald-400 font-bold';
        } else {
          this.testKeyStatus.textContent = res.message;
          this.testKeyStatus.className = 'text-xs text-rose-400 font-bold';
        }
      });

      this.saveSettingsBtn.addEventListener('click', () => {
        const key = this.settingApiKey.value.trim();
        this.storage.setApiKey(key);
        this.gemini.setApiKey(key);

        const newSettings = this.storage.saveSettings({
          model: this.settingModel.value,
          speechLanguage: this.settingDialect.value,
          autoExtractOnStop: this.settingAutoExtract.checked,
          soundEffects: this.settingSound.checked
        });

        this.settings = newSettings;
        this.gemini.setModel(newSettings.model);
        this.speech.setLanguage(newSettings.speechLanguage);
        this.sounds.enabled = newSettings.soundEffects;

        this.updateApiKeyIndicator();
        this.settingsModal.classList.add('hidden');
        ClipboardManager.showToast('تم حفظ الإعدادات بنجاح!', 'success');
      });

      this.historyDrawerBtn.addEventListener('click', () => { this.openHistoryDrawer(); });
      this.closeHistoryBtn.addEventListener('click', () => { this.closeHistoryDrawer(); });
      this.historyBackdrop.addEventListener('click', () => { this.closeHistoryDrawer(); });

      this.exportHistoryBtn.addEventListener('click', () => {
        this.storage.exportHistoryAsJSON();
        ClipboardManager.showToast('تم تصدير سجل الحجوزات كملف JSON', 'success');
      });

      this.clearAllHistoryBtn.addEventListener('click', () => {
        if (confirm('هل أنت متأكد من مسح جميع الحجوزات السابقة؟')) {
          this.storage.clearHistory();
          this.renderHistory();
          ClipboardManager.showToast('تم تفريغ السجل بالكامل', 'info');
        }
      });

      this.toggleSplitBtn.addEventListener('click', () => {
        this.crmSimulatorPane.classList.toggle('hidden');
        const isVisible = !this.crmSimulatorPane.classList.contains('hidden');
        this.toggleSplitBtn.classList.toggle('bg-emerald-700/40', isVisible);
        this.toggleSplitBtn.classList.toggle('border-emerald-500/50', isVisible);
        if (isVisible) {
          ClipboardManager.showToast('تم تفعيل وضع محاكاة الـ CRM والشاشة المقسمة', 'info');
        }
      });

      if (this.crmSimClearBtn) {
        this.crmSimClearBtn.addEventListener('click', () => {
          this.crmSimPasteBox.value = '';
        });
      }

      this.toggleSoundBtn.addEventListener('click', () => {
        this.sounds.enabled = !this.sounds.enabled;
        this.settings.soundEffects = this.sounds.enabled;
        this.storage.saveSettings({ soundEffects: this.sounds.enabled });
        this.soundIcon.setAttribute('data-lucide', this.sounds.enabled ? 'volume-2' : 'volume-x');
        this.toggleSoundBtn.classList.toggle('text-slate-500', !this.sounds.enabled);
        if (window.lucide) window.lucide.createIcons();
        ClipboardManager.showToast(this.sounds.enabled ? 'تم تفعيل الأصوات' : 'تم كتم الأصوات', 'info');
      });
    }

    initKeyboardShortcuts() {
      window.addEventListener('keydown', (e) => {
        const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        const isInputFocused = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';

        if (e.code === 'Space' && !isInputFocused) {
          e.preventDefault();
          const captureSystem = this.audioSourceMode === 'dual';
          this.speech.toggle(captureSystem);
          return;
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          this.triggerAiExtraction();
          return;
        }

        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c' || e.code === 'KeyC')) {
          e.preventDefault();
          this.copyForCRM();
          return;
        }

        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'W' || e.key === 'w' || e.code === 'KeyW')) {
          e.preventDefault();
          this.copyForWhatsApp();
          return;
        }

        if (e.key === 'Escape') {
          if (!this.settingsModal.classList.contains('hidden')) {
            this.settingsModal.classList.add('hidden');
          }
          if (!this.microsipModal.classList.contains('hidden')) {
            this.microsipModal.classList.add('hidden');
          }
          if (!this.historyDrawer.classList.contains('hidden')) {
            this.closeHistoryDrawer();
          }
        }
      });
    }

    async fetchLatestMicroSipCall() {
      try {
        ClipboardManager.showToast('جاري فحص مجلد تسجيلات MicroSIP...', 'info');
        const res = await fetch('/api/latest-recording');
        const data = await res.json();

        if (!data.success) {
          ClipboardManager.showToast(data.message || 'لا توجد تسجيلات في Desktop/Recordings', 'warning');
          return;
        }

        ClipboardManager.showToast(`تم العثور على: ${data.fileName}، جاري الاستخراج بالذكاء الاصطناعي...`, 'info');
        this.updateStatus('extracting', 'جاري استخراج بيانات مكالمة MicroSIP...');
        this.extractBtnText.textContent = 'جاري تحليل مكالمة MicroSIP...';
        this.extractBtn.disabled = true;

        const extracted = await this.gemini.extractFromAudioFile(data.base64, data.mimeType);
        this.populateForm(extracted);

        if (extracted.urgency_level === 'طوارئ قصوى') {
          this.sounds.play('emergency');
        } else {
          this.sounds.play('extracted');
        }
        ClipboardManager.showToast(`تم استخراج بيانات المكالمة (${data.fileName}) بنجاح!`, 'success');
      } catch (err) {
        console.error('MicroSIP bridge error:', err);
        ClipboardManager.showToast('تعذر جلب أو تحليل مكالمة MicroSIP: ' + err.message, 'error');
        this.sounds.play('error');
      } finally {
        this.extractBtnText.textContent = 'استخراج وتحديث البيانات (Gemini AI)';
        this.extractBtn.disabled = false;
        this.updateStatus('idle', 'جاهز للاستماع');
      }
    }

    async triggerAiExtraction() {
      if (this.isExtracting) return;
      const transcript = this.transcriptBox.value.trim();

      if (!transcript || transcript.length < 5) {
        ClipboardManager.showToast('نص المكالمة فارغ! تحدث في المايك أو اختر مكالمة تجريبية أولاً.', 'warning');
        return;
      }

      this.isExtracting = true;
      this.updateStatus('extracting', 'جاري استخراج البيانات بالذكاء الاصطناعي...');
      this.extractBtnText.textContent = 'جاري التحليل والاستخراج...';
      this.extractBtn.disabled = true;
      this.extractBtn.classList.add('extract-active', 'opacity-90');

      try {
        const extracted = await this.gemini.extractEntities(transcript);
        this.populateForm(extracted);

        if (extracted.urgency_level === 'طوارئ قصوى') {
          this.sounds.play('emergency');
        } else {
          this.sounds.play('extracted');
        }

        if (extracted._warning) {
          ClipboardManager.showToast(extracted._warning, 'warning');
        } else {
          ClipboardManager.showToast('تم استخراج وتحديث بيانات الحجز بنجاح!', 'success');
        }
      } catch (err) {
        console.error('Extraction failure:', err);
        ClipboardManager.showToast(err.message || 'حدث خطأ أثناء استخراج البيانات', 'error');
        this.sounds.play('error');
      } finally {
        this.isExtracting = false;
        this.extractBtnText.textContent = 'استخراج وتحديث البيانات (Gemini AI)';
        this.extractBtn.disabled = false;
        this.extractBtn.classList.remove('extract-active', 'opacity-90');
        this.updateStatus(this.speech.isCallActive ? 'listening' : 'idle', this.speech.isCallActive ? 'جاري الاستماع للمكالمة...' : 'جاهز للاستماع');
      }
    }

    populateForm(data) {
      this.currentBooking = { ...this.currentBooking, ...data };

      this.fieldPatientName.value = data.patient_name || '';
      this.fieldServiceType.value = data.service_type || 'تمريض منزلي';
      this.fieldDistrict.value = data.district || '';
      this.fieldPreferredTime.value = data.preferred_time || '';
      this.fieldMedicalNotes.value = data.medical_notes || '';

      this.setUrgencyLevel(data.urgency_level || 'عادي');

      [
        this.fieldPatientName,
        this.fieldServiceType,
        this.fieldDistrict,
        this.fieldPreferredTime,
        this.fieldMedicalNotes
      ].forEach((el) => {
        el.classList.remove('field-updated');
        void el.offsetWidth;
        el.classList.add('field-updated');
      });
    }

    setUrgencyLevel(level) {
      this.currentBooking.urgency_level = level;

      this.urgencyBadgeDisplay.className = 'px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all duration-300';
      
      if (level === 'طوارئ قصوى') {
        this.urgencyBadgeDisplay.classList.add('badge-emergency', 'glow-rose');
        this.urgencyBadgeDisplay.innerHTML = `<span class="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span><span id="urgency-badge-text">تصنيف الحالة: طوارئ قصوى 🚨</span>`;
      } else if (level === 'عاجل') {
        this.urgencyBadgeDisplay.classList.add('badge-urgent');
        this.urgencyBadgeDisplay.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400"></span><span id="urgency-badge-text">تصنيف الحالة: عاجل ⚠️</span>`;
      } else {
        this.urgencyBadgeDisplay.classList.add('badge-normal');
        this.urgencyBadgeDisplay.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400"></span><span id="urgency-badge-text">تصنيف الحالة: عادي ✅</span>`;
      }

      this.urgencyChoiceBtns.forEach((btn) => {
        const btnUrgency = btn.getAttribute('data-urgency');
        if (btnUrgency === level) {
          if (level === 'طوارئ قصوى') {
            btn.className = 'urgency-choice-btn py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 border-rose-500 bg-rose-950/60 text-rose-200 ring-2 ring-rose-500/40';
          } else if (level === 'عاجل') {
            btn.className = 'urgency-choice-btn py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 border-amber-500 bg-amber-950/60 text-amber-200 ring-2 ring-amber-500/40';
          } else {
            btn.className = 'urgency-choice-btn py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 border-emerald-500 bg-emerald-950/60 text-emerald-200 ring-2 ring-emerald-500/40';
          }
        } else {
          btn.className = 'urgency-choice-btn py-2 px-3 rounded-xl border text-xs font-semibold transition flex items-center justify-center gap-1.5 border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200';
        }
      });
    }

    async copyForCRM() {
      this.syncFormState();
      const formatted = ClipboardManager.formatForCRM(this.currentBooking);
      const success = await ClipboardManager.copyText(formatted, 'تم نسخ بيانات الحجز بصيغة الـ CRM بنجاح!');
      
      if (success) {
        this.storage.saveBooking(this.currentBooking, this.transcriptBox.value);
        this.renderHistory();
        if (this.crmSimPasteBox) this.crmSimPasteBox.value = formatted;
      }
    }

    async copyForWhatsApp() {
      this.syncFormState();
      const formatted = ClipboardManager.formatForWhatsApp(this.currentBooking);
      await ClipboardManager.copyText(formatted, 'تم نسخ رسالة تأكيد الواتساب والموقع بنجاح!');
    }

    syncFormState() {
      this.currentBooking.patient_name = this.fieldPatientName.value.trim();
      this.currentBooking.service_type = this.fieldServiceType.value;
      this.currentBooking.district = this.fieldDistrict.value.trim();
      this.currentBooking.preferred_time = this.fieldPreferredTime.value.trim();
      this.currentBooking.medical_notes = this.fieldMedicalNotes.value.trim();
    }

    resetBookingForm() {
      this.currentBooking = {
        patient_name: '',
        service_type: 'تمريض منزلي',
        district: '',
        preferred_time: '',
        medical_notes: '',
        urgency_level: 'عادي'
      };

      this.fieldPatientName.value = '';
      this.fieldServiceType.value = 'تمريض منزلي';
      this.fieldDistrict.value = '';
      this.fieldPreferredTime.value = '';
      this.fieldMedicalNotes.value = '';
      this.setUrgencyLevel('عادي');

      this.speech.clearTranscript();
      this.transcriptBox.value = '';
      this.interimText.textContent = '';
      this.updateWordCount('');

      ClipboardManager.showToast('تم تفريغ الحقول لحجز جديد', 'info');
    }

    updateSpeechStatusUI(status) {
      if (status === 'listening') {
        this.updateStatus('listening', 'جاري الاستماع للمكالمة...');
        this.micToggleBtn.className = 'w-20 h-20 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 text-white flex flex-col items-center justify-center shadow-xl mic-active border-2 border-rose-400 focus:outline-none';
        this.micLabel.textContent = 'المكالمة نشطة... انقر للإنهاء';
        this.micLabel.className = 'text-xs font-bold text-rose-400';
        this.audioWave.classList.remove('hidden');
      } else {
        this.updateStatus('idle', 'جاهز للاستماع');
        this.micToggleBtn.className = 'w-20 h-20 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 hover:from-emerald-600 hover:to-teal-500 text-white flex flex-col items-center justify-center shadow-xl transition-all duration-300 transform active:scale-95 group focus:outline-none border-2 border-slate-600 hover:border-emerald-400';
        this.micLabel.textContent = 'انقر لبدء الاستماع للمكالمة';
        this.micLabel.className = 'text-xs font-bold text-slate-200';
        this.audioWave.classList.add('hidden');
      }
    }

    updateStatus(type, text) {
      this.statusText.textContent = text;
      if (type === 'listening') {
        this.statusDot.className = 'w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping';
        this.statusPill.className = 'flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-950/60 border border-rose-700/50 text-xs font-bold text-rose-200';
      } else if (type === 'extracting') {
        this.statusDot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-400 animate-spin';
        this.statusPill.className = 'flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-700/50 text-xs font-bold text-emerald-200';
      } else {
        this.statusDot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-500';
        this.statusPill.className = 'flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-300';
      }
    }

    animateWaveBars(dataArray) {
      if (!this.audioWave) return;
      const bars = this.audioWave.querySelectorAll('.wave-bar');
      if (!bars || bars.length === 0) return;

      bars.forEach((bar, index) => {
        const val = dataArray[index * 3] || 10;
        const height = Math.max(4, Math.min(22, (val / 255) * 22));
        bar.style.height = `${height}px`;
      });
    }

    updateWordCount(text) {
      const count = text.trim() ? text.trim().split(/\s+/).length : 0;
      this.wordCount.textContent = `${count} كلمة`;
    }

    updateApiKeyIndicator() {
      const key = this.storage.getApiKey();
      if (key) {
        this.apiKeyIndicator.textContent = `نشط (${this.settings.model || 'Flash'})`;
        this.apiKeyIndicator.className = 'font-mono text-emerald-400 text-xs';
      } else {
        this.apiKeyIndicator.textContent = 'محلي (بدون مفتاح)';
        this.apiKeyIndicator.className = 'font-mono text-amber-400 text-xs';
      }
    }

    openHistoryDrawer() {
      this.historyDrawer.classList.remove('hidden');
      requestAnimationFrame(() => {
        this.historyBackdrop.classList.remove('opacity-0');
        this.historyBackdrop.classList.add('opacity-100');
        this.historyPanel.classList.remove('-translate-x-full');
        this.historyPanel.classList.add('translate-x-0');
      });
    }

    closeHistoryDrawer() {
      this.historyBackdrop.classList.remove('opacity-100');
      this.historyBackdrop.classList.add('opacity-0');
      this.historyPanel.classList.remove('translate-x-0');
      this.historyPanel.classList.add('-translate-x-full');
      setTimeout(() => {
        this.historyDrawer.classList.add('hidden');
      }, 300);
    }

    renderHistory() {
      const history = this.storage.getHistory();
      this.historyBadge.textContent = history.length;
      if (!this.historyList) return;

      if (history.length === 0) {
        this.historyList.innerHTML = `
          <div class="text-center py-12 text-slate-500 text-xs">
            <i data-lucide="clipboard-x" class="w-8 h-8 mx-auto mb-2 text-slate-600"></i>
            لا توجد حجوزات مسجلة بعد في السجل
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      this.historyList.innerHTML = '';
      history.forEach((item) => {
        const data = item.data || {};
        const card = document.createElement('div');
        
        let badgeClass = 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300';
        if (data.urgency_level === 'طوارئ قصوى') {
          badgeClass = 'border-rose-500/40 bg-rose-950/40 text-rose-300';
        } else if (data.urgency_level === 'عاجل') {
          badgeClass = 'border-amber-500/40 bg-amber-950/40 text-amber-300';
        }

        card.className = 'p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex flex-col gap-2 shadow-sm text-right';
        card.innerHTML = `
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="font-bold text-xs text-white">${data.patient_name || 'بدون اسم'}</span>
              <span class="text-[10px] px-2 py-0.5 rounded-full border ${badgeClass} font-semibold">${data.urgency_level || 'عادي'}</span>
            </div>
            <span class="text-[10px] text-slate-500">${item.timeFormatted || ''}</span>
          </div>
          <div class="text-[11px] text-slate-300 flex items-center gap-3">
            <span>🩺 ${data.service_type || 'غير محدد'}</span>
            <span>📍 ${data.district || 'غير محدد'}</span>
          </div>
          <p class="text-[11px] text-slate-400 line-clamp-2 leading-relaxed bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">${data.medical_notes || 'لا توجد ملاحظات'}</p>
          <div class="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/60">
            <button class="restore-history-btn px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition flex items-center gap-1">
              <i data-lucide="edit-3" class="w-3 h-3"></i>
              <span>استعادة للنموذج</span>
            </button>
            <button class="copy-history-crm-btn px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold transition flex items-center gap-1">
              <i data-lucide="copy" class="w-3 h-3"></i>
              <span>نسخ للـ CRM</span>
            </button>
            <button class="delete-history-btn text-slate-500 hover:text-rose-400 p-1 transition" title="حذف">
              <i data-lucide="trash" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        `;

        card.querySelector('.restore-history-btn').addEventListener('click', () => {
          this.populateForm(data);
          if (item.transcript) {
            this.transcriptBox.value = item.transcript;
            this.speech.setTranscript(item.transcript);
            this.updateWordCount(item.transcript);
          }
          this.closeHistoryDrawer();
          ClipboardManager.showToast(`تمت استعادة حجز: ${data.patient_name}`, 'success');
        });

        card.querySelector('.copy-history-crm-btn').addEventListener('click', () => {
          const crmText = ClipboardManager.formatForCRM(data);
          ClipboardManager.copyText(crmText, `تم نسخ بيانات ${data.patient_name} للـ CRM!`);
          if (this.crmSimPasteBox) this.crmSimPasteBox.value = crmText;
        });

        card.querySelector('.delete-history-btn').addEventListener('click', () => {
          this.storage.deleteHistoryItem(item.id);
          this.renderHistory();
          ClipboardManager.showToast('تم حذف العنصر من السجل', 'info');
        });

        this.historyList.appendChild(card);
      });

      if (window.lucide) window.lucide.createIcons();
    }
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    window.homeCareApp = new HomeCareCopilotApp();
  });
})();
