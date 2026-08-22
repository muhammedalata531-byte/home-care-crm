/**
 * HomeCare AI Copilot - Standalone Production Unified Bundle
 * Specialized for Saudi Arabia Healthcare Call Centers (3 Adaptive Categories):
 * 1. Doctor & Specialists Visits (الاسم، العمر، الأمراض المزمنة، الأعراض، الموقع، نوع الخدمة، زمن الخدمة + اللوكيشن)
 * 2. Nursing & Lab Tests (الاسم، العمر، الأعراض، الموقع، نوع الخدمة، زمن الخدمة + اللوكيشن)
 * 3. Physiotherapy & Rehabilitation (الاسم، العمر، الأعراض، الموقع، نوع الخدمة، زمن الخدمة + اللوكيشن)
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
  // 2. Saudi Arabia Medical Presets & Categories Data
  // ==========================================
  const MEDICAL_CATEGORIES = {
    doctor: {
      id: 'doctor',
      title: 'طلب أطباء وأخصائيين 👨‍⚕️',
      crmTitle: 'طلب زيارة طبيب / أخصائي',
      services: [
        'طبيب عام وزيارة منزلية',
        'استشاري / أخصائي باطنية عامة',
        'استشاري / أخصائي أطفال وحديثي ولادة',
        'استشاري / أخصائي عظام ومفاصل',
        'استشاري / أخصائي قلب وأوعية دموية',
        'استشاري / أخصائي مخ وأعصاب',
        'استشاري / أخصائي جلدية وتناسلية',
        'استشاري / أخصائي مسالك بولية وكلى',
        'استشاري / أخصائي نساء وتوليد',
        'استشاري / أخصائي طب أسرة ومجتمع',
        'أخصائي رعاية كبار السن والشيخوخة',
        'أخصائي غدد صماء وسكري',
        'أخصائي تغذية علاجية وتغذية أنبوبية',
        'أخصائي علاج تنفسي ورعاية صدرية',
        'استشاري / أخصائي جراحة عامة',
        'أخصائي طب نفسي وسلوكي'
      ]
    },
    nursing_lab: {
      id: 'nursing_lab',
      title: 'تمريض ومختبر وتحاليل 🩺',
      crmTitle: 'طلب تمريض / تحاليل ومختبر',
      services: [
        'تمريض منزلي (زيارة تمريضية عامة)',
        'سحب عينات دم ومختبر منزلي شامل',
        'باقة تحاليل كبار السن وفحص دوري',
        'تحليل سكر صائم وتراكمي ووظائف كلى',
        'غيار جروح وقدم سكري وقرح فراش',
        'تركيب / تغيير قسطرة بولية منزلية',
        'تركيب وتغيير أنبوب تغذية أنفي (رايل)',
        'إعطاء محاليل ووريد وحقن منزلية',
        'قياس ومتابعة العلامات الحيوية والسكر',
        'رعاية تمريضية مقيمة (شفت 12 أو 24 ساعة)',
        'رعاية تمريضية ما بعد العمليات الجراحية',
        'جلسة تنفس واستنشاق نيبولايزر بالمنزل'
      ]
    },
    physio: {
      id: 'physio',
      title: 'علاج طبيعي وتأهيل 🏃‍♂️',
      crmTitle: 'طلب علاج طبيعي وتأهيل',
      services: [
        'جلسة علاج طبيعي منزلي عامة',
        'تأهيل حركي وعصبي بعد الجلطات الدماغية',
        'تأهيل ما بعد كسور وعمليات تبديل المفاصل',
        'علاج طبيعي لخشونة الركبة ومشاكل المشي',
        'علاج طبيعي لآلام الظهر والرقبة والانزلاق الغضروفي',
        'تأهيل كبار السن والتوازن والوقاية من السقوط',
        'علاج طبيعي تنفسي وتحسين وظائف الرئة',
        'علاج طبيعي وتأهيل حركي للأطفال'
      ]
    }
  };

  const CALL_PRESETS = [
    {
      id: 'specialist_cardiac_riyadh',
      category: 'doctor',
      title: 'طلب أخصائي - كشف قلب وباطنة لكبير سن (الرياض - حي الملقا)',
      urgency: 'عاجل',
      service: 'استشاري / أخصائي قلب وأوعية دموية',
      fullTranscript: `السلام عليكم ورحمة الله، مساك الله بالخير.
أتصل بخصوص الوالد الأستاذ عبد العزيز التميمي، عمره 68 سنة، ومريض سكر وضغط مزمن ومركب دعامة قلب قديمة.
من أمس يشتكي من ثقل بالصدر مع نهجان وضيق تنفس عند أي حركة وخفقان سريع.
نحتاج استشاري أو أخصائي قلب وأوعية دموية يزوره بالبيت ويكشف عليه ويسوي له تخطيط قلب ECG منزلي.
موقعنا بالرياض، حي الملقا، شارع وادي السرحان فيلا رقم 22.
ودنا الطبيب يجي اليوم بعد صلاة العصر حول الساعة 4:30 عصراً، وبارسل لكم اللوكيشن على الواتساب.`
    },
    {
      id: 'nursing_lab_jeddah',
      category: 'nursing_lab',
      title: 'تمريض وتحاليل - سحب دم وغيار جروح (جدة - حي الشاطئ)',
      urgency: 'عادي',
      service: 'سحب عينات دم ومختبر منزلي شامل',
      fullTranscript: `صباح الخير، الله يعطيكم العافية.
أبغى أحجز خدمة تمريض وسحب تحاليل منزلية للوالدة أم فيصل، عمرها 62 سنة.
الدكتور طالب لها تحاليل وظائف كبد وكلى وسكر صائم وتراكمي، وعندها بعد جرح في الساق يحتاج تنظيف وغيار معقم وقياس الضغط والسكر.
موقعنا في جدة، حي الشاطئ، شارع حراء بالقرب من الواجهة البحرية.
يا ريت يجينا الأخصائي بكرة الصباح بدري على الساعة 7:30 صباحاً وهي صايمة، وبارسل لكم اللوكيشن الحين.`
    },
    {
      id: 'physio_stroke_dammam',
      category: 'physio',
      title: 'علاج طبيعي - تأهيل حركي بعد جلطة (الدمام - حي الشاطئ)',
      urgency: 'عادي',
      service: 'تأهيل حركي وعصبي بعد الجلطات الدماغية',
      fullTranscript: `مساك الله بالخير يا طيب.
أبغى أحجز جلسة علاج طبيعي وتأهيل حركي منزلي للوالد أبو خالد، عمره 74 سنة.
هو خارج من المستشفى بعد جلطة دماغية، وعنده ضعف وثقل في الطرف الأيمن وصعوبة في الوقوف والتوازن وما يقدر يمشي لحاله.
نبغى أخصائي علاج طبيعي متمكن يجي يسوي له تقييم حركي ويبدأ معاه برنامج تقوية وتأهيل للمشي.
العنوان في الدمام، حي الشاطئ الغربي، شارع الخليج.
ودنا بالموعد اليوم الساعة 6:00 مساءً واللوكيشن جاهز على الواتساب.`
    }
  ];

  const QUICK_MEDICAL_TAGS = [
    'تركيب كانيولا ومحاليل وريدية',
    'غيار جروح وقدم سكري',
    'سحب عينات دم ومختبر صائم',
    'استشاري باطنية وكبار سن',
    'تأهيل حركي بعد جلطة دماغية',
    'تخطيط ورسم قلب ECG منزلي',
    'قسطرة بولية Foley Catheter',
    'علاج طبيعي لخشونة الركبة',
    'أخصائي تغذية علاجية',
    'فحص سكر تراكمي وضغط',
    'جلسة تنفس واستنشاق',
    'أنبوب تغذية أنفي رايل'
  ];

  // ==========================================
  // 3. Storage Manager (Multi-Layer Local & Disk Config Sync)
  // ==========================================
  const STORAGE_KEYS = {
    API_KEY: 'homecare_gemini_api_key',
    SETTINGS: 'homecare_copilot_settings',
    HISTORY: 'homecare_bookings_history'
  };

  const DEFAULT_SETTINGS = {
    model: 'auto',
    autoExtractOnStop: false,
    soundEffects: true,
    speechLanguage: 'ar-SA'
  };

  class StorageManager {
    constructor() {
      this.settings = this.loadSettings();
      this.initServerSync();
    }

    async initServerSync() {
      try {
        const res = await fetch('/api/config');
        if (res.ok) {
          const data = await res.json();
          if (data.apiKey && !this.getApiKey()) {
            this.setApiKeyLocal(data.apiKey);
          } else if (this.getApiKey() && (!data.apiKey || data.apiKey !== this.getApiKey())) {
            this.syncToServer(this.getApiKey(), this.settings);
          }
          if (data.model && this.settings.model === 'auto') {
            this.settings.model = data.model;
          }
        }
      } catch (e) {}
    }

    getApiKey() {
      return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
    }

    setApiKeyLocal(key) {
      if (key) {
        localStorage.setItem(STORAGE_KEYS.API_KEY, key.trim());
      } else {
        localStorage.removeItem(STORAGE_KEYS.API_KEY);
      }
    }

    setApiKey(key) {
      this.setApiKeyLocal(key);
      this.syncToServer(key, this.settings);
    }

    async syncToServer(apiKey, settings) {
      try {
        await fetch('/api/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apiKey: apiKey ? apiKey.trim() : '',
            model: settings?.model || 'auto',
            speechLanguage: settings?.speechLanguage || 'ar-SA',
            updatedAt: new Date().toISOString()
          })
        });
      } catch (e) {}
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
      this.settings = merged;
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
      this.syncToServer(this.getApiKey(), merged);
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
  // 4. Clipboard Manager & Toasts (3 Specialized CRM Templates)
  // ==========================================
  class ClipboardManager {
    static formatForCRM(data, includePhone = true) {
      const category = data.category || (
        data.service_type?.includes('طبيب') || data.service_type?.includes('استشاري') || data.service_type?.includes('أخصائي') && !data.service_type?.includes('علاج طبيعي') && !data.service_type?.includes('سحب') ? 'doctor' :
        data.service_type?.includes('علاج طبيعي') || data.service_type?.includes('تأهيل') ? 'physio' : 'nursing_lab'
      );

      const name = data.patient_name?.trim() || 'غير محدد';
      const phone = data.patient_phone?.trim();
      const age = data.age?.trim() || 'غير محدد';
      const chronic = data.chronic_diseases?.trim() || 'لا يوجد';
      const symptoms = data.symptoms?.trim() || data.medical_notes?.trim() || 'غير محدد';
      const location = data.district?.trim() || 'غير محدد';
      const service = data.service_type?.trim() || 'غير محدد';
      const time = data.preferred_time?.trim() || 'في أقرب وقت متاح';

      const lines = [`الاسم : ${name}`];
      if (includePhone && phone && phone !== 'غير محدد') {
        lines.push(`الرقم : ${phone}`);
      }
      lines.push(`العمر: ${age}`);

      if (category === 'doctor') {
        lines.push(`الامراض المزمنة : ${chronic}`);
      }

      lines.push(`الاعراض: ${symptoms}`);
      lines.push(`الموقع : ${location}`);
      lines.push(`نوع الخدمة: ${service}`);
      lines.push(`زمن الخدمة: ${time}`);

      return lines.join('\n');
    }

    static formatForWhatsApp(data) {
      const serviceType = data.service_type?.trim() || 'الرعاية الصحية المنزلية';
      const preferredTime = data.preferred_time?.trim() || 'المحدد معكم';

      return `أهلاً بك في خدمة الرعاية الصحية والطبية المنزلية 🏥
تم تسجيل طلبكم مبدئياً لخدمة: (${serviceType})
الموعد المقترح: [${preferredTime}]

📍 يرجى إرسال اللوكيشن (الموقع الجغرافي الدقيق) عبر هذه المحادثة لتأكيد وصول الفريق الطبي في الموعد.
نسعد بخدمتكم ونتمنى لكم دوام الصحة والعافية.`;
    }

    static async copyCrmFormat(data, includePhone = true) {
      const text = ClipboardManager.formatForCRM(data, includePhone);
      return await ClipboardManager.copyText(text, includePhone ? 'تم نسخ بيانات الحجز مع رقم العميل للـ CRM بنجاح!' : 'تم نسخ بيانات الحجز بدون رقم للـ CRM بنجاح!');
    }

    static async copyWhatsAppFormat(data) {
      const text = ClipboardManager.formatForWhatsApp(data);
      return await ClipboardManager.copyText(text, 'تم نسخ رسالة تأكيد الحجز واللوكيشن للواتساب 💬!');
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
  // 5. Gemini AI Extractor (Auto-Select Fastest Model & Saudi Prompt)
  // ==========================================
  class GeminiExtractor {
    constructor(apiKey = '', model = 'auto') {
      this.apiKey = apiKey ? apiKey.trim() : '';
      this.model = model || 'auto';
      this.discoveredModels = [];
      this.activeModel = '';
    }

    setApiKey(key) {
      this.apiKey = key ? key.trim() : '';
    }

    setModel(model) {
      this.model = model || 'auto';
    }

    getSystemPrompt() {
      return `أنت خبير ذكاء اصطناعي طبي متخصص في تحليل وتفريغ واستخراج بيانات مكالمات مركز اتصال الرعاية الصحية والطبية المنزلية في المملكة العربية السعودية (Saudi Home Healthcare Call Center AI Copilot).

مهمتك الأساسية:
1. الاستماع لتسجيل المكالمة أو قراءة النص باللهجة السعودية (النجدية، الحجازية، الشرقية، الجنوبية) أو الفصحى.
2. تفريغ نص المكالمة كاملاً (call_transcript).
3. تحديد وتصنيف فئة الخدمة المطلوبة بدقة من بين الفئات الثلاث التالية:
   - "doctor": طلب زيارة طبيب عام أو استشاري أو أخصائي (باطنية، أطفال، عظام، قلب، مخ وأعصاب، جلدية، مسالك، نساء وتوليد، طب أسرة، تغذية، علاج تنفسي، كبار سن، سكري...).
   - "nursing_lab": تمريض منزلي، سحب عينات ومختبر، تحاليل صائم وتراكمي، غيار جروح وقدم سكري، قسطرة، محاليل، حقن...
   - "physio": علاج طبيعي وتأهيل حركي وعصبي بعد الجلطات، خشونة مفاصل، تأهيل كبار السن، آلام العمود الفقري...
4. استخراج الحقول الطبية التالية بدقة:
   - "patient_name": اسم المريض المذكور (مثال: الوالد عبد العزيز التميمي، أم فيصل، أبو خالد، الطفلة سارة...).
   - "patient_phone": رقم جوال العميل أو المريض إن ذُكر (مثال: 0555978282 أو +96655...) أو غير محدد.
   - "age": عمر المريض إذا ذُكر أو وُصف (مثال: 68 سنة، 62 سنة، مسن، 8 سنوات...). إذا لم يُذكر اكتب "غير محدد".
   - "chronic_diseases": الأمراض المزمنة (خاصة لطلبات الأطباء) مثل: السكري، الضغط، القلب، الفشل الكلوي، جلطة سابقة... إذا لم يذكر اكتب "لا يوجد".
   - "symptoms": الأعراض والشكوى أو الفحوصات والإجراءات التمريضية/التأهيلية المطلوبة باختصار وافٍ ودقيق.
   - "district": الموقع والمدينة والحي والشارع (مثال: الرياض - حي الملقا - شارع وادي السرحان، جدة - حي الشاطئ، الدمام - حي الشاطئ...).
   - "service_type": نوع الخدمة أو تخصص الطبيب/الأخصائي المطلوب بدقة.
   - "preferred_time": الموعد والتوقيت المقترح للزيارة (مثال: اليوم بعد صلاة العصر 4:30 عصراً، غداً 7:30 صباحاً صائم...).
   - "urgency_level": درجة الفرز والاستعجال ("طوارئ قصوى" | "عاجل" | "عادي").

صيغة الرد المطلوبة (JSON فقط دون أي كود ماركداون إضافي):
{
  "call_transcript": "نص الحوار الكامل بالعامية السعودية",
  "category": "doctor" | "nursing_lab" | "physio",
  "patient_name": "اسم المريض",
  "patient_phone": "رقم الجوال أو غير محدد",
  "age": "العمر",
  "chronic_diseases": "الأمراض المزمنة أو لا يوجد",
  "symptoms": "الأعراض والشكوى / الفحص / الإجراء المطلوب",
  "district": "المدينة والحي والموقع",
  "service_type": "نوع الخدمة أو التخصص الطبي",
  "preferred_time": "زمن الموعد المقترح",
  "urgency_level": "عادي" | "عاجل" | "طوارئ قصوى"
}`;
    }

    async fetchLiveModels() {
      if (!this.apiKey) return [];
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models?key=${this.apiKey}`;
        const res = await fetch(endpoint);
        if (!res.ok) return [];
        const data = await res.json();
        const valid = (data.models || [])
          .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'))
          .map(m => m.name.replace(/^models\//, ''))
          .filter(name => !name.includes('embedding') && !name.includes('aqa') && !name.includes('imagen') && !name.includes('veo') && !name.includes('8b'));

        this.discoveredModels = valid;
        return valid;
      } catch (e) {
        return [];
      }
    }

    async getCandidateModels() {
      if (this.discoveredModels.length === 0 && this.apiKey) {
        await this.fetchLiveModels();
      }

      const priorityList = [
        'gemini-1.5-flash',
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-3.6-flash',
        'gemini-3.5-flash'
      ];

      const candidates = [];
      if (this.model && this.model !== 'auto' && this.model !== 'offline') {
        candidates.push(this.model);
      }

      if (this.discoveredModels.length > 0) {
        priorityList.forEach(p => {
          if (this.discoveredModels.includes(p)) candidates.push(p);
        });
        this.discoveredModels.filter(m => m.includes('flash')).forEach(m => candidates.push(m));
        this.discoveredModels.forEach(m => candidates.push(m));
      } else {
        candidates.push(...priorityList);
      }

      return candidates.filter((v, i, a) => v && a.indexOf(v) === i);
    }

    async extractEntities(transcript) {
      if (!transcript || transcript.trim().length < 5) {
        throw new Error('نص المكالمة قصير جداً أو فارغ');
      }

      if (this.model === 'offline' || !this.apiKey) {
        const fallback = this.offlineFallbackExtract(transcript);
        fallback._warning = 'تم الاستخراج بالمحرك المحلي الداخلي (بدون استهلاك توكنز 🟢)';
        return fallback;
      }

      const candidateModels = await this.getCandidateModels();
      let lastError = null;

      for (const currentModel of candidateModels) {
        try {
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${this.apiKey}`;
          const requestBody = {
            contents: [{ role: 'user', parts: [{ text: `إليك نص مكالمة حجز الرعاية الصحية المنزلية في السعودية:\n"""\n${transcript}\n"""\nحلل واستخرج بيانات الحجز الطبية بالكامل بصيغة JSON وفق النموذج الطبي المحدد.` }] }],
            systemInstruction: { parts: [{ text: this.getSystemPrompt() }] },
            generationConfig: { responseMimeType: 'application/json', temperature: 0.1, maxOutputTokens: 1200 }
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
          if (!rawText) throw new Error('لم يتم استلام رد من النموذج');

          this.activeModel = currentModel;
          const parsed = this.cleanAndParseJSON(rawText);
          parsed._active_model = currentModel;
          return parsed;
        } catch (err) {
          console.warn(`Model ${currentModel} error:`, err.message);
          lastError = err;
        }
      }

      const fallback = this.offlineFallbackExtract(transcript);
      fallback._warning = `تم الاستخراج بالمحرك الاحتياطي (${lastError?.message || ''})`;
      return fallback;
    }

    async extractFromAudioFile(base64Audio, mimeType = 'audio/mp3') {
      if (!this.apiKey && this.model !== 'offline') {
        throw new Error('لاستخراج البيانات من ملف تسجيل المكالمة، يرجى إدخال مفتاح Gemini API في الإعدادات (⚙️).');
      }

      let cleanMime = mimeType;
      if (mimeType === 'audio/mp3' || mimeType.includes('mpeg') || mimeType.includes('mp3')) cleanMime = 'audio/mp3';
      else if (mimeType.includes('wav')) cleanMime = 'audio/wav';
      else if (mimeType.includes('ogg')) cleanMime = 'audio/ogg';
      else if (mimeType.includes('m4a') || mimeType.includes('mp4')) cleanMime = 'audio/mp4';

      const candidateModels = await this.getCandidateModels();
      let lastError = null;

      for (const currentModel of candidateModels) {
        try {
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${this.apiKey}`;
          const requestBody = {
            contents: [{
              role: 'user',
              parts: [
                { inlineData: { mimeType: cleanMime, data: base64Audio } },
                { text: `استمع لتسجيل مكالمة الرعاية الصحية المنزلية في السعودية، وفرّغ نص الحوار كاملاً، واستخرج بيانات الحجز الطبية بالكامل بصيغة JSON وفق النموذج الطبي المحدد.` }
              ]
            }],
            systemInstruction: { parts: [{ text: this.getSystemPrompt() }] },
            generationConfig: { responseMimeType: 'application/json', temperature: 0.1, maxOutputTokens: 1500 }
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
          if (!rawText) throw new Error('لم يتم استلام رد من النموذج');

          this.activeModel = currentModel;
          const parsed = this.cleanAndParseJSON(rawText);
          parsed._active_model = currentModel;
          return parsed;
        } catch (err) {
          console.warn(`Model ${currentModel} audio error:`, err.message);
          lastError = err;
        }
      }

      throw new Error(lastError?.message || 'فشلت معالجة الملف الصوتي');
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
      if (/طوارئ|جلطة|ما يقدر يتنفس|ألم بالصدر|صدره|سكتة|غيبوبة|عرق بارد|نزيف|الحقونا|تكفون|فورا|الحين/.test(text)) urgency = 'طوارئ قصوى';
      else if (/عاجل|سخونة|حرارة|ترجيع|تعبان|الم شديد|خمول|طريح فراش|وجع/.test(text)) urgency = 'عاجل';

      let category = 'nursing_lab';
      let service = 'تمريض منزلي (زيارة تمريضية عامة)';

      if (/دكتور|طبيب|كشف|استشاري|باطنة|أطفال|عظام|قلب|أخصائي/.test(text)) {
        category = 'doctor';
        if (/قلب|صدر|نهجان|خفقان/.test(text)) service = 'استشاري / أخصائي قلب وأوعية دموية';
        else if (/عظام|مفصل|كسر/.test(text)) service = 'استشاري / أخصائي عظام ومفاصل';
        else if (/أطفال|طفل/.test(text)) service = 'استشاري / أخصائي أطفال وحديثي ولادة';
        else service = 'استشاري / أخصائي باطنية عامة';
      } else if (/علاج طبيعي|تأهيل|ركبة|مفصل|جلطة دماغية|شلل|عضلات|توازن/.test(text)) {
        category = 'physio';
        if (/جلطة/.test(text)) service = 'تأهيل حركي وعصبي بعد الجلطات الدماغية';
        else if (/ركبة|خشونة/.test(text)) service = 'علاج طبيعي لخشونة الركبة ومشاكل المشي';
        else service = 'جلسة علاج طبيعي منزلي عامة';
      } else {
        category = 'nursing_lab';
        if (/سحب|عينات|تحاليل|تحليل|صائم|مختبر/.test(text)) service = 'سحب عينات دم ومختبر منزلي شامل';
        else if (/غيار|جرح|قرحة|قدم سكري/.test(text)) service = 'غيار جروح وقدم سكري وقرح فراش';
        else if (/قسطرة/.test(text)) service = 'تركيب / تغيير قسطرة بولية منزلية';
      }

      let patientName = 'غير محدد';
      const nameMatch = transcript.match(/(?:الوالد|الوالدة|أبو|أم|مريض|المريض|أستاذ|استاذ|الأخ|الأخت)\s+([^\s,،.]+)/i);
      if (nameMatch) patientName = nameMatch[0].trim();

      let age = 'غير محدد';
      const ageMatch = transcript.match(/(\d{1,2})\s*(?:سنة|عام|سنوات)/);
      if (ageMatch) age = `${ageMatch[1]} سنة`;
      else if (/كبير بالسن|مسن|مسنة|طاعن/.test(text)) age = 'كبير بالسن (مسن)';

      let chronic = 'لا يوجد';
      const chronicList = [];
      if (/سكر|سكري/.test(text)) chronicList.push('السكري');
      if (/ضغط/.test(text)) chronicList.push('ضغط الدم');
      if (/قلب|دعامة/.test(text)) chronicList.push('أمراض القلب');
      if (/كلى|غسيل/.test(text)) chronicList.push('الكلى');
      if (chronicList.length > 0) chronic = chronicList.join('، ');

      const saudiLocations = [
        'الرياض - حي النرجس', 'الرياض - حي الملقا', 'الرياض - حي الياسمين', 'الرياض - حي العليا',
        'جدة - حي الشاطئ', 'جدة - حي الروضة', 'الخبر - حي الحزام الذهبي', 'الدمام - حي الشاطئ',
        'الرياض', 'جدة', 'الخبر', 'الدمام', 'مكة المكرمة', 'المدينة المنورة'
      ];
      let district = 'المملكة العربية السعودية';
      for (const loc of saudiLocations) { if (text.includes(loc.toLowerCase())) { district = loc; break; } }

      let preferredTime = 'اليوم في أقرب وقت متاح';
      if (/بكرة|غداً|غدا/.test(text)) preferredTime = 'غداً صباحاً';
      else if (urgency === 'طوارئ قصوى') preferredTime = 'عاجل جداً وفوراً (الآن)';

      let patientPhone = '';
      const phoneMatch = transcript.match(/(?:05\d{8}|\+966\d{9}|966\d{9})/);
      if (phoneMatch) patientPhone = phoneMatch[0];

      return {
        call_transcript: transcript,
        category: category,
        patient_name: patientName,
        patient_phone: patientPhone,
        age: age,
        chronic_diseases: chronic,
        symptoms: `استخراج سريع: ${transcript.slice(0, 140)}...`,
        district: district,
        service_type: service,
        preferred_time: preferredTime,
        urgency_level: urgency,
        _active_model: 'المحرك المحلي'
      };
    }

    async testApiKey() {
      if (this.model === 'offline') {
        return { valid: true, message: 'المحرك المحلي مفعل (يعمل بدون API وبدون استهلاك توكنز 🟢)' };
      }
      if (!this.apiKey) return { valid: false, message: 'يرجى إدخال مفتاح الـ API أولاً' };

      const liveModels = await this.fetchLiveModels();
      if (liveModels.length > 0) {
        const candidates = await this.getCandidateModels();
        const chosen = candidates[0] || liveModels[0];
        this.activeModel = chosen;

        try {
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${chosen}:generateContent?key=${this.apiKey}`;
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: '1' }] }], generationConfig: { maxOutputTokens: 5 } })
          });
          if (res.ok) {
            return {
              valid: true,
              message: `المفتاح نشط وتم اختيار أسرع نموذج تلقائياً: (${chosen}) ⚡`,
              models: liveModels,
              chosenModel: chosen
            };
          }
        } catch (e) {}
      }

      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models?key=${this.apiKey}`;
        const res = await fetch(endpoint);
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          return { valid: false, message: err.error?.message || `HTTP ${res.status}` };
        }
      } catch (e) {
        return { valid: false, message: e.message };
      }

      return { valid: false, message: 'تعذر الاتصال بـ Google API. تحقق من صحة المفتاح.' };
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
      this.isListening = false;
      this.isSimulating = false;
      this.isCallActive = false;
      this.accumulatedTranscript = '';
      this.currentSessionTranscript = '';
      this.interimTranscript = '';

      this.timerInterval = null;
      this.timerSeconds = 0;

      this.audioContext = null;
      this.analyser = null;
      this.mediaStream = null;
      this.systemStream = null;
      this.animationFrameId = null;

      this.initRecognition();
    }

    setLanguage(lang) {
      this.language = lang;
      if (this.recognition) {
        this.recognition.lang = lang;
      }
    }

    initRecognition() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        return;
      }

      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = this.language;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.onStatusChange('listening');
      };

      this.recognition.onresult = (event) => {
        let interim = '';
        let newlyFinal = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          const transcriptChunk = res[0].transcript;
          if (res.isFinal) {
            newlyFinal += transcriptChunk + ' ';
          } else {
            interim += transcriptChunk;
          }
        }

        if (newlyFinal) {
          this.currentSessionTranscript += newlyFinal;
          sounds.play('mic_start');
        }
        this.interimTranscript = interim;

        const combined = (this.accumulatedTranscript + ' ' + this.currentSessionTranscript).trim();
        this.onTranscriptUpdate(combined, this.interimTranscript);
      };

      this.recognition.onerror = (event) => {
        if (event.error === 'no-speech') return;
        if (event.error === 'aborted') return;
        this.onError(`خطأ التعرف الصوتي: ${event.error}`);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (this.isCallActive) {
          try {
            this.recognition.start();
          } catch (e) {}
        } else {
          this.onStatusChange('idle');
        }
      };
    }

    async toggle(captureSystemAudio = false) {
      if (this.isCallActive) {
        this.stop();
      } else {
        await this.start(captureSystemAudio);
      }
    }

    async start(captureSystemAudio = false) {
      if (this.isCallActive) return;
      this.isCallActive = true;
      this.currentSessionTranscript = '';
      this.interimTranscript = '';

      this.startTimer();
      sounds.play('mic_start');

      try {
        await this.startAudioAnalysis(captureSystemAudio);
      } catch (err) {
        console.warn('Audio capture warning:', err);
      }

      if (this.recognition) {
        try {
          this.recognition.lang = this.language;
          this.recognition.start();
        } catch (e) {
          this.recognition.stop();
          setTimeout(() => {
            try { this.recognition.start(); } catch (err) {}
          }, 150);
        }
      } else {
        this.startMockWaveform();
        this.onStatusChange('listening');
      }
    }

    stop() {
      if (!this.isCallActive) return;
      this.isCallActive = false;

      this.accumulatedTranscript = (this.accumulatedTranscript + ' ' + this.currentSessionTranscript).trim();
      this.currentSessionTranscript = '';
      this.interimTranscript = '';

      this.stopTimer();
      this.stopAudioAnalysis();

      if (this.recognition && this.isListening) {
        try { this.recognition.stop(); } catch (e) {}
      }

      this.onStatusChange('idle');
      sounds.play('mic_stop');
    }

    startTimer() {
      this.stopTimer();
      this.timerSeconds = 0;
      this.onTimerTick(0, '00:00');
      this.timerInterval = setInterval(() => {
        this.timerSeconds++;
        const mins = Math.floor(this.timerSeconds / 60).toString().padStart(2, '0');
        const secs = (this.timerSeconds % 60).toString().padStart(2, '0');
        this.onTimerTick(this.timerSeconds, `${mins}:${secs}`);
      }, 1000);
    }

    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    }

    setTranscript(text) {
      this.accumulatedTranscript = text;
      this.currentSessionTranscript = '';
      this.interimTranscript = '';
    }

    clearTranscript() {
      this.accumulatedTranscript = '';
      this.currentSessionTranscript = '';
      this.interimTranscript = '';
      this.onTranscriptUpdate('', '');
    }

    async startAudioAnalysis(captureSystemAudio = false) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.audioContext = new AudioCtx();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;

      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });
      this.mediaStream = micStream;
      const micSource = this.audioContext.createMediaStreamSource(micStream);
      micSource.connect(this.analyser);

      if (captureSystemAudio && navigator.mediaDevices.getDisplayMedia) {
        try {
          const sysStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
            systemAudio: 'include'
          });
          this.systemStream = sysStream;
          const sysSource = this.audioContext.createMediaStreamSource(sysStream);
          sysSource.connect(this.analyser);
        } catch (e) {}
      }

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const loop = () => {
        if (!this.isCallActive) return;
        this.analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
        const avg = sum / bufferLength;
        this.onAudioLevel(avg, dataArray);
        this.animationFrameId = requestAnimationFrame(loop);
      };
      loop();
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
  // 7. Main Application Class (3 Adaptive Categories)
  // ==========================================
  class HomeCareCopilotApp {
    constructor() {
      this.storage = storage;
      this.settings = this.storage.loadSettings();
      this.gemini = new GeminiExtractor(this.storage.getApiKey(), this.settings.model);
      this.sounds = sounds;
      this.sounds.enabled = this.settings.soundEffects !== false;

      this.currentCategory = 'doctor';

      this.currentBooking = {
        category: 'doctor',
        patient_name: '',
        age: '',
        chronic_diseases: '',
        symptoms: '',
        district: '',
        service_type: '',
        preferred_time: '',
        urgency_level: 'عادي'
      };

      this.audioSourceMode = 'mic';
      this.isExtracting = false;
      this.extractionTimerInterval = null;
      this.extractionStartTime = 0;

      this.initDOM();
      this.initSpeech();
      this.initCategoriesAndServices();
      this.initPresetsAndTags();
      this.initEventListeners();
      this.initKeyboardShortcuts();
      this.updateApiKeyIndicator();
      this.renderHistory();

      // Background permanent config sync & auto-model discovery
      fetch('/api/config')
        .then(res => res.json())
        .then(data => {
          if (data && data.apiKey && !this.storage.getApiKey()) {
            this.storage.setApiKeyLocal(data.apiKey);
            this.gemini.setApiKey(data.apiKey);
          }
          if (this.storage.getApiKey()) {
            this.gemini.getCandidateModels().then(() => {
              this.updateApiKeyIndicator();
            });
          }
          this.updateApiKeyIndicator();
        })
        .catch(() => {
          if (this.storage.getApiKey()) {
            this.gemini.getCandidateModels().then(() => {
              this.updateApiKeyIndicator();
            });
          }
        });

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

      // Category Switcher Tabs
      this.tabCatDoctor = document.getElementById('tab-cat-doctor');
      this.tabCatNursing = document.getElementById('tab-cat-nursing');
      this.tabCatPhysio = document.getElementById('tab-cat-physio');
      this.categoryTabs = [this.tabCatDoctor, this.tabCatNursing, this.tabCatPhysio];

      // Form Elements
      this.fieldPatientName = document.getElementById('field-patient-name');
      this.fieldPatientPhone = document.getElementById('field-patient-phone');
      this.fieldPatientAge = document.getElementById('field-patient-age');
      this.containerChronicDiseases = document.getElementById('container-chronic-diseases');
      this.fieldChronicDiseases = document.getElementById('field-chronic-diseases');
      this.labelSymptoms = document.getElementById('label-symptoms');
      this.fieldSymptoms = document.getElementById('field-symptoms');
      this.fieldDistrict = document.getElementById('field-district');
      this.fieldServiceType = document.getElementById('field-service-type');
      this.fieldPreferredTime = document.getElementById('field-preferred-time');
      this.crmPhoneWith = document.getElementById('crm-phone-with');
      this.crmPhoneWithout = document.getElementById('crm-phone-without');
      this.crmIncludePhone = true;
      this.urgencyBadgeDisplay = document.getElementById('urgency-badge-display');
      this.urgencyBadgeText = document.getElementById('urgency-badge-text');
      this.urgencyChoiceBtns = document.querySelectorAll('.urgency-choice-btn');
      this.aiTimingBadge = document.getElementById('ai-timing-badge');
      this.aiTimingText = document.getElementById('ai-timing-text');

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
          if (this.callTimerDisplay && !this.extractionStartTime) {
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

    initCategoriesAndServices() {
      this.setCategory('doctor');
    }

    setCategory(categoryKey, preserveValue = false) {
      const valid = ['doctor', 'nursing_lab', 'physio'];
      this.currentCategory = valid.includes(categoryKey) ? categoryKey : 'doctor';
      this.currentBooking.category = this.currentCategory;

      if (this.categoryTabs) {
        this.categoryTabs.forEach(tab => {
          if (!tab) return;
          const cat = tab.getAttribute('data-cat');
          if (cat === this.currentCategory) {
            tab.className = 'category-tab-btn py-2 px-1 sm:px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 bg-emerald-600 text-white shadow-md ring-1 ring-emerald-400';
          } else {
            tab.className = 'category-tab-btn py-2 px-1 sm:px-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition flex items-center justify-center gap-1.5';
          }
        });
      }

      const catData = MEDICAL_CATEGORIES[this.currentCategory] || MEDICAL_CATEGORIES.doctor;
      if (this.fieldServiceType) {
        const previousVal = this.fieldServiceType.value;
        this.fieldServiceType.innerHTML = '';

        catData.services.forEach(svc => {
          const opt = document.createElement('option');
          opt.value = svc;
          opt.textContent = svc;
          this.fieldServiceType.appendChild(opt);
        });

        if (preserveValue && previousVal && catData.services.includes(previousVal)) {
          this.fieldServiceType.value = previousVal;
        } else {
          this.fieldServiceType.value = catData.services[0];
          this.currentBooking.service_type = catData.services[0];
        }
      }

      if (this.containerChronicDiseases) {
        if (this.currentCategory === 'doctor') {
          this.containerChronicDiseases.classList.remove('hidden');
          if (this.labelSymptoms) {
            const sp = this.labelSymptoms.querySelector('span');
            if (sp) sp.textContent = 'الاعراض :';
          }
        } else if (this.currentCategory === 'nursing_lab') {
          this.containerChronicDiseases.classList.add('hidden');
          if (this.labelSymptoms) {
            const sp = this.labelSymptoms.querySelector('span');
            if (sp) sp.textContent = 'الاعراض / الفحص والطلب المطلوب :';
          }
        } else {
          this.containerChronicDiseases.classList.add('hidden');
          if (this.labelSymptoms) {
            const sp = this.labelSymptoms.querySelector('span');
            if (sp) sp.textContent = 'التشخيص / الاعراض :';
          }
        }
      }

      if (window.lucide) window.lucide.createIcons();
    }

    initPresetsAndTags() {
      if (this.presetSelect) {
        this.presetSelect.innerHTML = '<option value="">-- اختر سيناريو مكالمة سعودية للتجربة --</option>';
        CALL_PRESETS.forEach((preset) => {
          const opt = document.createElement('option');
          opt.value = preset.id;
          opt.textContent = `[${preset.category === 'doctor' ? 'أطباء' : preset.category === 'physio' ? 'علاج طبيعي' : 'تمريض'}] ${preset.title}`;
          this.presetSelect.appendChild(opt);
        });
      }

      if (this.quickTagsContainer) {
        this.quickTagsContainer.innerHTML = '';
        QUICK_MEDICAL_TAGS.forEach((tag) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'px-2 py-1 rounded-md bg-slate-900 hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 text-[11px] font-medium transition';
          btn.textContent = `+ ${tag}`;
          btn.addEventListener('click', () => {
            if (this.transcriptBox) {
              const current = this.transcriptBox.value.trim();
              this.transcriptBox.value = current ? `${current} - ${tag}` : tag;
              if (this.speech) this.speech.setTranscript(this.transcriptBox.value);
              this.updateWordCount(this.transcriptBox.value);
            }
            ClipboardManager.showToast(`تمت إضافة الإجراء: ${tag}`, 'info');
          });
          this.quickTagsContainer.appendChild(btn);
        });
      }
    }

    startExtractionTimer(statusLabel = 'جاري تحليل واستخراج بيانات المكالمة...') {
      this.stopExtractionTimer();
      this.extractionStartTime = performance.now();
      this.updateStatus('extracting', statusLabel);
      if (this.aiTimingBadge) this.aiTimingBadge.classList.add('hidden');

      this.extractionTimerInterval = setInterval(() => {
        if (!this.extractionStartTime) return;
        const elapsed = ((performance.now() - this.extractionStartTime) / 1000).toFixed(1);
        if (this.callTimerDisplay) {
          this.callTimerDisplay.textContent = `⏱️ ${elapsed}s`;
          this.callTimerDisplay.className = 'font-mono text-cyan-300 bg-cyan-950/90 px-2 py-0.5 rounded border border-cyan-500/60 text-[11px] font-bold animate-pulse';
        }
      }, 100);
    }

    stopExtractionTimer() {
      if (this.extractionTimerInterval) {
        clearInterval(this.extractionTimerInterval);
        this.extractionTimerInterval = null;
      }
      const elapsed = this.extractionStartTime ? ((performance.now() - this.extractionStartTime) / 1000).toFixed(2) : '0.00';
      this.extractionStartTime = 0;
      return elapsed;
    }

    displayExtractionDuration(durationSec) {
      if (this.aiTimingBadge && this.aiTimingText) {
        this.aiTimingBadge.classList.remove('hidden');
        this.aiTimingText.textContent = `⏱️ وقت التحليل: ${durationSec} ثانية`;
        if (window.lucide) window.lucide.createIcons();
      }
      if (this.callTimerDisplay) {
        this.callTimerDisplay.textContent = `${durationSec}s`;
        this.callTimerDisplay.className = 'font-mono text-emerald-400 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-700/80 text-[11px] font-bold';
      }
      this.updateStatus('completed', `اكتمل التحليل في (${durationSec} ثانية) ⚡`);
    }

    initEventListeners() {
      this.tabCatDoctor.addEventListener('click', () => { this.setCategory('doctor'); });
      this.tabCatNursing.addEventListener('click', () => { this.setCategory('nursing_lab'); });
      this.tabCatPhysio.addEventListener('click', () => { this.setCategory('physio'); });

      this.fetchLatestCallBtn = document.getElementById('fetch-latest-call-btn');
      if (this.fetchLatestCallBtn) {
        this.fetchLatestCallBtn.addEventListener('click', () => {
          this.fetchLatestMicroSipCall();
        });
      }

      if (this.srcMicBtn) {
        this.srcMicBtn.addEventListener('click', () => {
          this.audioSourceMode = 'mic';
          this.srcMicBtn.className = 'px-2 py-0.5 rounded bg-emerald-600 text-white font-medium transition';
          if (this.srcDualBtn) this.srcDualBtn.className = 'px-2 py-0.5 rounded text-slate-400 hover:text-white transition flex items-center gap-1';
          ClipboardManager.showToast('تم تعيين مصدر الصوت: الميكروفون المباشر', 'info');
        });
      }

      if (this.srcDualBtn) {
        this.srcDualBtn.addEventListener('click', () => {
          this.audioSourceMode = 'dual';
          this.srcDualBtn.className = 'px-2 py-0.5 rounded bg-cyan-600 text-white font-medium transition flex items-center gap-1';
          if (this.srcMicBtn) this.srcMicBtn.className = 'px-2 py-0.5 rounded text-slate-400 hover:text-white transition';
          ClipboardManager.showToast('تم تفعيل وضع دمج صوت MicroSIP مع المايك', 'info');
          if (!this.speech.isCallActive && this.microsipModal) {
            this.microsipModal.classList.remove('hidden');
          }
        });
      }

      const openGuide = () => { if (this.microsipModal) this.microsipModal.classList.remove('hidden'); };
      const closeGuide = () => { if (this.microsipModal) this.microsipModal.classList.add('hidden'); };
      if (this.microsipGuideBtn) this.microsipGuideBtn.addEventListener('click', openGuide);
      if (this.microsipHelpLink) this.microsipHelpLink.addEventListener('click', openGuide);
      if (this.closeMicrosipBtn) this.closeMicrosipBtn.addEventListener('click', closeGuide);
      if (this.closeMicrosipBtn2) this.closeMicrosipBtn2.addEventListener('click', closeGuide);

      if (this.audioFileInput) {
        this.audioFileInput.addEventListener('change', async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          ClipboardManager.showToast(`جاري استخراج وتحليل بيانات المكالمة من: ${file.name}...`, 'info');
          this.startExtractionTimer(`جاري تحليل ملف تسجيل المكالمة (${file.name})...`);
          if (this.extractBtnText) this.extractBtnText.textContent = 'جاري تحليل الملف الصوتي...';
          if (this.extractBtn) this.extractBtn.disabled = true;

          try {
            const reader = new FileReader();
            reader.onload = async () => {
              try {
                const base64Data = reader.result.split(',')[1];
                const mimeType = file.type || 'audio/wav';
                const extracted = await this.gemini.extractFromAudioFile(base64Data, mimeType);
                const durationSec = this.stopExtractionTimer();
                extracted._extraction_duration = `${durationSec} ثانية`;

                if (extracted.call_transcript && this.transcriptBox) {
                  this.transcriptBox.value = extracted.call_transcript;
                  this.updateWordCount(extracted.call_transcript);
                }

                this.populateForm(extracted);
                this.displayExtractionDuration(durationSec);

                if (extracted.urgency_level === 'طوارئ قصوى') {
                  this.sounds.play('emergency');
                } else {
                  this.sounds.play('extracted');
                }
                ClipboardManager.showToast(`⚡ تم تحليل وتفريغ المكالمة بنجاح خلال ${durationSec} ثانية!`, 'success');
              } catch (err) {
                this.stopExtractionTimer();
                this.updateStatus('idle', 'جاهز');
                console.error('Audio file extraction error:', err);
                ClipboardManager.showToast(err.message || 'فشل تحليل ملف الصوت', 'error');
                this.sounds.play('error');
              } finally {
                if (this.extractBtnText) this.extractBtnText.textContent = 'استخراج وتعبئة النموذج بالذكاء الاصطناعي';
                if (this.extractBtn) this.extractBtn.disabled = false;
              }
            };
            reader.readAsDataURL(file);
          } catch (err) {
            this.stopExtractionTimer();
            this.updateStatus('idle', 'جاهز');
            console.error('Audio file read error:', err);
            ClipboardManager.showToast('تعذر قراءة ملف الصوت: ' + err.message, 'error');
            this.sounds.play('error');
            if (this.extractBtnText) this.extractBtnText.textContent = 'استخراج وتعبئة النموذج بالذكاء الاصطناعي';
            if (this.extractBtn) this.extractBtn.disabled = false;
          }
        });
      }

      if (this.micToggleBtn) {
        this.micToggleBtn.addEventListener('click', () => {
          const captureSystem = this.audioSourceMode === 'dual';
          this.speech.toggle(captureSystem);
        });
      }

      if (this.transcriptBox) {
        this.transcriptBox.addEventListener('input', () => {
          this.speech.setTranscript(this.transcriptBox.value);
          this.updateWordCount(this.transcriptBox.value);
        });
      }

      if (this.clearTranscriptBtn) {
        this.clearTranscriptBtn.addEventListener('click', () => {
          this.speech.clearTranscript();
          if (this.transcriptBox) this.transcriptBox.value = '';
          if (this.interimText) this.interimText.textContent = '';
          this.updateWordCount('');
          if (this.aiTimingBadge) this.aiTimingBadge.classList.add('hidden');
          ClipboardManager.showToast('تم مسح النص', 'info');
        });
      }

      if (this.playPresetBtn) {
        this.playPresetBtn.addEventListener('click', () => {
          const selectedId = this.presetSelect ? this.presetSelect.value : '';
          if (!selectedId) {
            ClipboardManager.showToast('يرجى اختيار سيناريو مكالمة من القائمة أولاً', 'warning');
            return;
          }
          const preset = CALL_PRESETS.find(p => p.id === selectedId);
          if (preset) {
            if (preset.category) {
              this.setCategory(preset.category);
            }
            ClipboardManager.showToast(`بدء محاكاة المكالمة السعودية: ${preset.title}`, 'info');
            this.speech.simulateCallTranscript(preset.fullTranscript, (finalText) => {
              ClipboardManager.showToast('اكتملت المكالمة، جاري استخراج البيانات...', 'success');
              this.triggerAiExtraction();
            });
          }
        });
      }

      if (this.extractBtn) {
        this.extractBtn.addEventListener('click', () => {
          this.triggerAiExtraction();
        });
      }

      if (this.fieldPatientName) this.fieldPatientName.addEventListener('input', (e) => { this.currentBooking.patient_name = e.target.value; });
      if (this.fieldPatientPhone) this.fieldPatientPhone.addEventListener('input', (e) => { this.currentBooking.patient_phone = e.target.value; });
      if (this.fieldPatientAge) this.fieldPatientAge.addEventListener('input', (e) => { this.currentBooking.age = e.target.value; });
      if (this.fieldChronicDiseases) this.fieldChronicDiseases.addEventListener('input', (e) => { this.currentBooking.chronic_diseases = e.target.value; });
      if (this.fieldSymptoms) this.fieldSymptoms.addEventListener('input', (e) => { this.currentBooking.symptoms = e.target.value; });
      if (this.fieldDistrict) this.fieldDistrict.addEventListener('input', (e) => { this.currentBooking.district = e.target.value; });
      if (this.fieldServiceType) this.fieldServiceType.addEventListener('change', (e) => { this.currentBooking.service_type = e.target.value; });
      if (this.fieldPreferredTime) this.fieldPreferredTime.addEventListener('input', (e) => { this.currentBooking.preferred_time = e.target.value; });

      if (this.urgencyChoiceBtns) {
        this.urgencyChoiceBtns.forEach((btn) => {
          btn.addEventListener('click', () => {
            const urgency = btn.getAttribute('data-urgency');
            this.setUrgencyLevel(urgency);
          });
        });
      }

      if (this.copyCrmBtn) this.copyCrmBtn.addEventListener('click', () => { this.copyForCRM(); });
      if (this.copyWhatsappBtn) this.copyWhatsappBtn.addEventListener('click', () => { this.copyForWhatsApp(); });
      if (this.resetFormBtn) this.resetFormBtn.addEventListener('click', () => { this.resetBookingForm(); });

      const openSettings = () => {
        if (!this.settingsModal) return;
        if (this.settingApiKey) this.settingApiKey.value = this.storage.getApiKey();
        let currentModel = this.settings.model || 'auto';
        if (currentModel === 'gemini-2.0-flash' || currentModel === 'gemini-2.0-flash-lite' || currentModel.includes('8b')) {
          currentModel = 'auto';
        }
        if (this.settingModel) this.settingModel.value = currentModel;
        if (this.settingDialect) this.settingDialect.value = this.settings.speechLanguage || 'ar-SA';
        if (this.settingAutoExtract) this.settingAutoExtract.checked = this.settings.autoExtractOnStop === true;
        if (this.settingSound) this.settingSound.checked = this.settings.soundEffects !== false;
        if (this.testKeyStatus) this.testKeyStatus.textContent = '';
        this.settingsModal.classList.remove('hidden');
      };

      if (this.settingsBtn) this.settingsBtn.addEventListener('click', openSettings);
      if (this.quickKeyBtn) this.quickKeyBtn.addEventListener('click', openSettings);
      if (this.closeSettingsBtn) this.closeSettingsBtn.addEventListener('click', () => { if (this.settingsModal) this.settingsModal.classList.add('hidden'); });

      if (this.toggleKeyVisibility && this.settingApiKey) {
        this.toggleKeyVisibility.addEventListener('click', () => {
          const isPass = this.settingApiKey.type === 'password';
          this.settingApiKey.type = isPass ? 'text' : 'password';
          if (this.keyVisIcon) this.keyVisIcon.setAttribute('data-lucide', isPass ? 'eye-off' : 'eye');
          if (window.lucide) window.lucide.createIcons();
        });
      }

      if (this.testApiKeyBtn && this.settingApiKey) {
        this.testApiKeyBtn.addEventListener('click', async () => {
          if (this.testKeyStatus) {
            this.testKeyStatus.textContent = 'جاري الاتصال والتعرف على النماذج النشطة في حسابك...';
            this.testKeyStatus.className = 'text-xs text-amber-400';
          }
          const tempKey = this.settingApiKey.value.trim();
          const tempExtractor = new GeminiExtractor(tempKey, this.settingModel?.value || 'auto');
          const res = await tempExtractor.testApiKey();
          if (res.valid) {
            if (res.models && res.models.length > 0 && this.settingModel) {
              this.settingModel.innerHTML = '';
              const autoOpt = document.createElement('option');
              autoOpt.value = 'auto';
              autoOpt.textContent = `⚡ اختيار تلقائي لأفضل وأسرع نموذج (${res.chosenModel || 'موصى به'})`;
              this.settingModel.appendChild(autoOpt);

              res.models.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m;
                opt.textContent = `${m} ${m.includes('flash') ? '⚡ (سريع وخفيف)' : ''}`;
                this.settingModel.appendChild(opt);
              });
              const offOpt = document.createElement('option');
              offOpt.value = 'offline';
              offOpt.textContent = 'المحرك الداخلي المحلي (بدون API - استهلاك 0 توكنز ومجاني 🟢)';
              this.settingModel.appendChild(offOpt);
              this.settingModel.value = 'auto';
            }
            if (this.testKeyStatus) {
              this.testKeyStatus.textContent = res.message;
              this.testKeyStatus.className = 'text-xs text-emerald-400 font-bold';
            }
          } else {
            if (this.testKeyStatus) {
              this.testKeyStatus.textContent = res.message;
              this.testKeyStatus.className = 'text-xs text-rose-400 font-bold';
            }
          }
        });
      }

      if (this.saveSettingsBtn && this.settingApiKey) {
        this.saveSettingsBtn.addEventListener('click', () => {
          const key = this.settingApiKey.value.trim();
          this.storage.setApiKey(key);
          this.gemini.setApiKey(key);

          const newSettings = this.storage.saveSettings({
            model: this.settingModel?.value || 'auto',
            speechLanguage: this.settingDialect?.value || 'ar-SA',
            autoExtractOnStop: this.settingAutoExtract?.checked || false,
            soundEffects: this.settingSound ? this.settingSound.checked : true
          });

          this.settings = newSettings;
          this.gemini.setModel(newSettings.model);
          this.speech.setLanguage(newSettings.speechLanguage);
          this.sounds.enabled = newSettings.soundEffects;

          this.updateApiKeyIndicator();
          if (this.settingsModal) this.settingsModal.classList.add('hidden');
          ClipboardManager.showToast('تم حفظ المفتاح والإعدادات دائماً بنجاح!', 'success');
        });
      }

      if (this.historyDrawerBtn) this.historyDrawerBtn.addEventListener('click', () => { this.openHistoryDrawer(); });
      if (this.closeHistoryBtn) this.closeHistoryBtn.addEventListener('click', () => { this.closeHistoryDrawer(); });
      if (this.historyBackdrop) this.historyBackdrop.addEventListener('click', () => { this.closeHistoryDrawer(); });

      if (this.exportHistoryBtn) {
        this.exportHistoryBtn.addEventListener('click', () => {
          this.storage.exportHistoryAsJSON();
          ClipboardManager.showToast('تم تصدير سجل الحجوزات كملف JSON', 'success');
        });
      }

      if (this.clearAllHistoryBtn) {
        this.clearAllHistoryBtn.addEventListener('click', () => {
          if (confirm('هل أنت متأكد من مسح جميع الحجوزات السابقة؟')) {
            this.storage.clearHistory();
            this.renderHistory();
            ClipboardManager.showToast('تم تفريغ السجل بالكامل', 'info');
          }
        });
      }

      if (this.toggleSplitBtn && this.crmSimulatorPane) {
        this.toggleSplitBtn.addEventListener('click', () => {
          this.crmSimulatorPane.classList.toggle('hidden');
          const isVisible = !this.crmSimulatorPane.classList.contains('hidden');
          this.toggleSplitBtn.classList.toggle('bg-emerald-700/40', isVisible);
          this.toggleSplitBtn.classList.toggle('border-emerald-500/50', isVisible);
          if (isVisible) {
            ClipboardManager.showToast('تم تفعيل وضع محاكاة الـ CRM والشاشة المقسمة', 'info');
          }
        });
      }

      if (this.crmPhoneWith && this.crmPhoneWithout) {
        this.crmPhoneWith.addEventListener('click', () => {
          this.crmIncludePhone = true;
          this.crmPhoneWith.className = 'px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 bg-emerald-600 text-white shadow text-xs';
          this.crmPhoneWithout.className = 'px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 text-xs';
          ClipboardManager.showToast('تم تفعيل تضمين رقم العميل عند النسخ 📱', 'info');
        });
        this.crmPhoneWithout.addEventListener('click', () => {
          this.crmIncludePhone = false;
          this.crmPhoneWithout.className = 'px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 bg-amber-600 text-white shadow text-xs';
          this.crmPhoneWith.className = 'px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 text-xs';
          ClipboardManager.showToast('تم استبعاد رقم العميل من النسخ ✂️', 'info');
        });
      }

      if (this.toggleSoundBtn) {
        this.toggleSoundBtn.addEventListener('click', () => {
          this.sounds.enabled = !this.sounds.enabled;
          this.settings.soundEffects = this.sounds.enabled;
          this.storage.saveSettings({ soundEffects: this.sounds.enabled });
          if (this.soundIcon) this.soundIcon.setAttribute('data-lucide', this.sounds.enabled ? 'volume-2' : 'volume-x');
          this.toggleSoundBtn.classList.toggle('text-slate-500', !this.sounds.enabled);
          if (window.lucide) window.lucide.createIcons();
          ClipboardManager.showToast(this.sounds.enabled ? 'تم تفعيل الأصوات' : 'تم كتم الأصوات', 'info');
        });
      }
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
        this.startExtractionTimer('جاري جلب وتحليل مكالمة MicroSIP...');
        this.extractBtnText.textContent = 'جاري تحليل مكالمة MicroSIP...';
        this.extractBtn.disabled = true;

        const res = await fetch('/api/latest-recording');
        const data = await res.json();

        if (!data.success) {
          this.stopExtractionTimer();
          this.updateStatus('idle', 'جاهز للاستماع');
          ClipboardManager.showToast(data.message || 'لا توجد تسجيلات في Desktop/Recordings', 'warning');
          return;
        }

        const extracted = await this.gemini.extractFromAudioFile(data.base64, data.mimeType);
        const durationSec = this.stopExtractionTimer();
        extracted._extraction_duration = `${durationSec} ثانية`;

        this.populateForm(extracted);
        this.displayExtractionDuration(durationSec);

        if (extracted.urgency_level === 'طوارئ قصوى') {
          this.sounds.play('emergency');
        } else {
          this.sounds.play('extracted');
        }
        ClipboardManager.showToast(`⚡ تم استخراج بيانات المكالمة (${data.fileName}) بنجاح في ${durationSec} ثانية!`, 'success');
      } catch (err) {
        this.stopExtractionTimer();
        this.updateStatus('idle', 'جاهز للاستماع');
        console.error('MicroSIP bridge error:', err);
        ClipboardManager.showToast('تعذر جلب أو تحليل مكالمة MicroSIP: ' + err.message, 'error');
        this.sounds.play('error');
      } finally {
        this.extractBtnText.textContent = 'استخراج وتحديث البيانات (Gemini AI)';
        this.extractBtn.disabled = false;
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
      this.startExtractionTimer('جاري استخراج البيانات بالذكاء الاصطناعي...');
      this.extractBtnText.textContent = 'جاري التحليل والاستخراج...';
      this.extractBtn.disabled = true;
      this.extractBtn.classList.add('extract-active', 'opacity-90');

      try {
        const extracted = await this.gemini.extractEntities(transcript);
        const durationSec = this.stopExtractionTimer();
        extracted._extraction_duration = `${durationSec} ثانية`;

        this.populateForm(extracted);
        this.displayExtractionDuration(durationSec);

        if (extracted.urgency_level === 'طوارئ قصوى') {
          this.sounds.play('emergency');
        } else {
          this.sounds.play('extracted');
        }

        if (extracted._warning) {
          ClipboardManager.showToast(extracted._warning, 'warning');
        } else {
          ClipboardManager.showToast(`⚡ تم استخراج وتحديث بيانات الحجز بنجاح خلال ${durationSec} ثانية!`, 'success');
        }
      } catch (err) {
        this.stopExtractionTimer();
        this.updateStatus('idle', 'جاهز للاستماع');
        console.error('Extraction failure:', err);
        ClipboardManager.showToast(err.message || 'حدث خطأ أثناء استخراج البيانات', 'error');
        this.sounds.play('error');
      } finally {
        this.isExtracting = false;
        this.extractBtnText.textContent = 'استخراج وتحديث البيانات (Gemini AI)';
        this.extractBtn.disabled = false;
        this.extractBtn.classList.remove('extract-active', 'opacity-90');
      }
    }

    populateForm(data) {
      if (!data) return;

      if (data.call_transcript && !this.transcriptBox.value.trim()) {
        this.transcriptBox.value = data.call_transcript;
        this.speech.setTranscript(data.call_transcript);
        this.updateWordCount(data.call_transcript);
      }

      let targetCategory = data.category || this.currentCategory;
      if (!data.category) {
        const svc = (data.service_type || '').toLowerCase();
        if (svc.includes('طبيب') || svc.includes('استشاري') || svc.includes('أخصائي') && !svc.includes('علاج طبيعي') && !svc.includes('سحب')) {
          targetCategory = 'doctor';
        } else if (svc.includes('علاج طبيعي') || svc.includes('تأهيل')) {
          targetCategory = 'physio';
        } else {
          targetCategory = 'nursing_lab';
        }
      }

      this.setCategory(targetCategory);

      this.currentBooking.category = targetCategory;
      this.currentBooking.patient_name = data.patient_name || this.currentBooking.patient_name;
      this.currentBooking.patient_phone = data.patient_phone || this.currentBooking.patient_phone || '';
      this.currentBooking.age = data.age || this.currentBooking.age || '';
      this.currentBooking.chronic_diseases = data.chronic_diseases || this.currentBooking.chronic_diseases || '';
      this.currentBooking.symptoms = data.symptoms || data.medical_notes || this.currentBooking.symptoms || '';
      this.currentBooking.district = data.district || this.currentBooking.district;
      this.currentBooking.service_type = data.service_type || this.currentBooking.service_type;
      this.currentBooking.preferred_time = data.preferred_time || this.currentBooking.preferred_time;
      this.currentBooking.urgency_level = data.urgency_level || this.currentBooking.urgency_level;
      if (data._extraction_duration) {
        this.currentBooking._extraction_duration = data._extraction_duration;
      }

      this.fieldPatientName.value = this.currentBooking.patient_name || '';
      if (this.fieldPatientPhone) this.fieldPatientPhone.value = this.currentBooking.patient_phone || '';
      this.fieldPatientAge.value = this.currentBooking.age || '';
      this.fieldChronicDiseases.value = this.currentBooking.chronic_diseases || '';
      this.fieldSymptoms.value = this.currentBooking.symptoms || '';
      this.fieldDistrict.value = this.currentBooking.district || '';

      if (this.currentBooking.service_type) {
        const options = Array.from(this.fieldServiceType.options).map(o => o.value);
        if (!options.includes(this.currentBooking.service_type)) {
          const customOpt = document.createElement('option');
          customOpt.value = this.currentBooking.service_type;
          customOpt.textContent = this.currentBooking.service_type;
          this.fieldServiceType.insertBefore(customOpt, this.fieldServiceType.firstChild);
        }
        this.fieldServiceType.value = this.currentBooking.service_type;
      }

      this.fieldPreferredTime.value = this.currentBooking.preferred_time || '';
      this.setUrgencyLevel(this.currentBooking.urgency_level);

      this.flashFieldsUpdated();
      this.storage.saveBooking(this.currentBooking, this.transcriptBox.value);
      this.renderHistory();
    }

    setUrgencyLevel(level) {
      const validLevels = ['عادي', 'عاجل', 'طوارئ قصوى'];
      const urgency = validLevels.includes(level) ? level : 'عادي';
      this.currentBooking.urgency_level = urgency;

      this.urgencyBadgeDisplay.className = `badge-${urgency === 'عادي' ? 'normal' : urgency === 'عاجل' ? 'urgent' : 'emergency'} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5`;
      this.urgencyBadgeText.textContent = `تصنيف الحالة: ${urgency}`;

      this.urgencyChoiceBtns.forEach((btn) => {
        const btnUrgency = btn.getAttribute('data-urgency');
        if (btnUrgency === urgency) {
          btn.classList.add('bg-slate-700', 'border-slate-500', 'text-white');
        } else {
          btn.classList.remove('bg-slate-700', 'border-slate-500', 'text-white');
        }
      });
    }

    flashFieldsUpdated() {
      const fields = [
        this.fieldPatientName,
        this.fieldPatientPhone,
        this.fieldPatientAge,
        this.fieldChronicDiseases,
        this.fieldSymptoms,
        this.fieldDistrict,
        this.fieldServiceType,
        this.fieldPreferredTime
      ];

      fields.forEach((f) => {
        if (f && f.value) {
          f.classList.add('border-emerald-500', 'bg-emerald-950/20');
          setTimeout(() => {
            f.classList.remove('border-emerald-500', 'bg-emerald-950/20');
          }, 1200);
        }
      });
    }

    async copyForCRM() {
      this.syncFormState();
      const success = await ClipboardManager.copyCrmFormat(this.currentBooking, this.crmIncludePhone);
      if (success) {
        this.sounds.play('copied');
        if (this.crmSimPasteBox) {
          this.crmSimPasteBox.value = ClipboardManager.formatForCRM(this.currentBooking, this.crmIncludePhone);
        }
        this.storage.saveBooking(this.currentBooking, this.transcriptBox.value);
        this.renderHistory();
      }
    }

    async copyForWhatsApp() {
      this.syncFormState();
      const success = await ClipboardManager.copyWhatsAppFormat(this.currentBooking);
      if (success) {
        this.sounds.play('copied');
      }
    }

    syncFormState() {
      this.currentBooking.category = this.currentCategory;
      this.currentBooking.patient_name = this.fieldPatientName.value.trim();
      this.currentBooking.patient_phone = this.fieldPatientPhone ? this.fieldPatientPhone.value.trim() : '';
      this.currentBooking.age = this.fieldPatientAge.value.trim();
      this.currentBooking.chronic_diseases = this.fieldChronicDiseases.value.trim();
      this.currentBooking.symptoms = this.fieldSymptoms.value.trim();
      this.currentBooking.district = this.fieldDistrict.value.trim();
      this.currentBooking.service_type = this.fieldServiceType.value;
      this.currentBooking.preferred_time = this.fieldPreferredTime.value.trim();
    }

    resetBookingForm() {
      this.currentBooking = {
        category: this.currentCategory,
        patient_name: '',
        patient_phone: '',
        age: '',
        chronic_diseases: '',
        symptoms: '',
        district: '',
        service_type: '',
        preferred_time: '',
        urgency_level: 'عادي'
      };

      this.fieldPatientName.value = '';
      if (this.fieldPatientPhone) this.fieldPatientPhone.value = '';
      this.fieldPatientAge.value = '';
      this.fieldChronicDiseases.value = '';
      this.fieldSymptoms.value = '';
      this.fieldDistrict.value = '';
      this.setCategory(this.currentCategory);
      this.fieldPreferredTime.value = '';
      this.setUrgencyLevel('عادي');

      this.speech.clearTranscript();
      this.transcriptBox.value = '';
      this.interimText.textContent = '';
      this.updateWordCount('');
      if (this.aiTimingBadge) this.aiTimingBadge.classList.add('hidden');

      ClipboardManager.showToast('تم تفريغ الحقول لحجز جديد', 'info');
    }

    updateSpeechStatusUI(status) {
      if (status === 'listening') {
        this.updateStatus('listening', 'جاري الاستماع للمكالمة...');
        if (this.micToggleBtn) this.micToggleBtn.className = 'w-20 h-20 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 text-white flex flex-col items-center justify-center shadow-xl mic-active border-2 border-rose-400 focus:outline-none';
        if (this.micLabel) {
          this.micLabel.textContent = 'المكالمة نشطة... انقر للإنهاء';
          this.micLabel.className = 'text-xs font-bold text-rose-400';
        }
        if (this.audioWave) this.audioWave.classList.remove('hidden');
      } else {
        this.updateStatus('idle', 'جاهز للاستماع');
        if (this.micToggleBtn) this.micToggleBtn.className = 'w-20 h-20 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 hover:from-emerald-600 hover:to-teal-500 text-white flex flex-col items-center justify-center shadow-xl transition-all duration-300 transform active:scale-95 group focus:outline-none border-2 border-slate-600 hover:border-emerald-400';
        if (this.micLabel) {
          this.micLabel.textContent = 'انقر لبدء الاستماع للمكالمة';
          this.micLabel.className = 'text-xs font-bold text-slate-200';
        }
        if (this.audioWave) this.audioWave.classList.add('hidden');
      }
    }

    updateStatus(type, text) {
      if (this.statusText) this.statusText.textContent = text;
      if (this.statusDot) {
        if (type === 'listening') this.statusDot.className = 'w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping';
        else if (type === 'extracting') this.statusDot.className = 'w-2.5 h-2.5 rounded-full bg-cyan-400 animate-spin';
        else if (type === 'completed') this.statusDot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-400';
        else this.statusDot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-500';
      }
      if (this.statusPill) {
        if (type === 'listening') this.statusPill.className = 'flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-950/60 border border-rose-700/50 text-xs font-bold text-rose-200';
        else if (type === 'extracting') this.statusPill.className = 'flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-700/50 text-xs font-bold text-cyan-200';
        else if (type === 'completed') this.statusPill.className = 'flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-xs font-bold text-emerald-300';
        else this.statusPill.className = 'flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-300';
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
      if (!this.wordCount) return;
      const count = text.trim() ? text.trim().split(/\s+/).length : 0;
      this.wordCount.textContent = `${count} كلمة`;
    }

    updateApiKeyIndicator() {
      if (!this.apiKeyIndicator) return;
      const key = this.storage.getApiKey();
      if (key) {
        let modelLabel = this.gemini.activeModel || (this.settings.model === 'auto' ? 'تلقائي ⚡' : this.settings.model);
        this.apiKeyIndicator.textContent = `نشط (${modelLabel})`;
        this.apiKeyIndicator.className = 'font-mono text-emerald-400 text-xs font-bold';
      } else {
        this.apiKeyIndicator.textContent = 'محلي (بدون مفتاح)';
        this.apiKeyIndicator.className = 'font-mono text-amber-400 text-xs';
      }
    }

    openHistoryDrawer() {
      if (!this.historyDrawer) return;
      this.historyDrawer.classList.remove('hidden');
      requestAnimationFrame(() => {
        if (this.historyBackdrop) {
          this.historyBackdrop.classList.remove('opacity-0');
          this.historyBackdrop.classList.add('opacity-100');
        }
        if (this.historyPanel) {
          this.historyPanel.classList.remove('-translate-x-full');
          this.historyPanel.classList.add('translate-x-0');
        }
      });
    }

    closeHistoryDrawer() {
      if (!this.historyDrawer) return;
      if (this.historyBackdrop) {
        this.historyBackdrop.classList.remove('opacity-100');
        this.historyBackdrop.classList.add('opacity-0');
      }
      if (this.historyPanel) {
        this.historyPanel.classList.remove('translate-x-0');
        this.historyPanel.classList.add('-translate-x-full');
      }
      setTimeout(() => {
        if (this.historyDrawer) this.historyDrawer.classList.add('hidden');
      }, 300);
    }

    renderHistory() {
      const history = this.storage.getHistory();
      if (this.historyBadge) this.historyBadge.textContent = history.length;
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

        const catLabel = data.category === 'doctor' ? '👨‍⚕️ أطباء' : data.category === 'physio' ? '🏃‍♂️ علاج طبيعي' : '🩺 تمريض ومختبر';

        card.className = 'p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex flex-col gap-2 shadow-sm text-right';
        card.innerHTML = `
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="font-bold text-xs text-white">${data.patient_name || 'بدون اسم'}</span>
              <span class="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">${catLabel}</span>
              <span class="text-[10px] px-2 py-0.5 rounded-full border ${badgeClass} font-semibold">${data.urgency_level || 'عادي'}</span>
              ${data._extraction_duration ? `<span class="text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40 font-mono">⏱️ ${data._extraction_duration}</span>` : ''}
            </div>
            <span class="text-[10px] text-slate-500">${item.timeFormatted || ''}</span>
          </div>
          <div class="text-[11px] text-slate-300 flex flex-wrap items-center gap-3">
            <span>🩺 ${data.service_type || 'غير محدد'}</span>
            <span>📍 ${data.district || 'غير محدد'}</span>
            ${data.age ? `<span>🎂 ${data.age}</span>` : ''}
          </div>
          <p class="text-[11px] text-slate-400 line-clamp-2 leading-relaxed bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">${data.symptoms || data.medical_notes || 'لا توجد ملاحظات'}</p>
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
          ClipboardManager.copyCrmFormat(data);
          this.sounds.play('copied');
          ClipboardManager.showToast(`تم نسخ حجز ${data.patient_name} بصيغة الـ CRM`, 'success');
        });

        card.querySelector('.delete-history-btn').addEventListener('click', () => {
          this.storage.deleteHistoryItem(item.id);
          this.renderHistory();
          ClipboardManager.showToast('تم حذف السجل', 'info');
        });

        this.historyList.appendChild(card);
      });

      if (window.lucide) {
        window.lucide.createIcons();
      }
    }
  }

  // ==========================================
  // CONVERSATIONAL WORK ASSISTANT CHAT MODULE
  // ==========================================
  class WorkAssistantChat {
    constructor() {
      this.apiKey = '';
      this.chatHistory = JSON.parse(localStorage.getItem('wa_chat_history') || '[]');
      this.appointments = JSON.parse(localStorage.getItem('wa_appointments') || '[]');
      this.staff = JSON.parse(localStorage.getItem('wa_staff') || JSON.stringify({
        ambulance: [{ name: 'سيارة إسعاف 1', status: 'available', phone: '' }],
        nursing: [{ name: 'ممرضة سارة', status: 'busy', phone: '', mention: '@~Alhayat homecare' }],
        drivers: [{ name: 'السائق خالد', status: 'available', phone: '', mention: '@~Mohammed Imran Sherani' }]
      }));
      
      this.stagedImage = null; // { base64, mimeType, dataUrl }
      this.isProcessing = false;
      this.speechRecognition = null;
      this.isRecordingSpeech = false;

      this.whatsappContacts = {
        nursing_head: '@~Alhayat homecare',
        drivers_head: '@~Mohammed Imran Sherani'
      };

      this.init();
    }

    async init() {
      await this.loadApiKey();
      this.bindTabSwitcher();
      this.bindChatInputs();
      this.bindSidePanel();
      this.renderChatFeed();
      this.renderSideAppointments();
      this.initSpeechRecognition();
      this.startReminderCheck();
    }

    async loadApiKey() {
      // 1. Check homeCareApp storage
      if (window.homeCareApp && window.homeCareApp.storage) {
        this.apiKey = window.homeCareApp.storage.getApiKey() || '';
      }
      // 2. Check local storage keys
      if (!this.apiKey) {
        this.apiKey = localStorage.getItem('homecare_gemini_api_key') || localStorage.getItem('gemini_api_key') || '';
      }
      // 3. Fallback: fetch from server config.json
      if (!this.apiKey) {
        try {
          const res = await fetch('/api/config');
          if (res.ok) {
            const data = await res.json();
            if (data.apiKey) {
              this.apiKey = data.apiKey.trim();
              localStorage.setItem('homecare_gemini_api_key', this.apiKey);
            }
          }
        } catch (e) {}
      }
      return this.apiKey;
    }

    // ---- Tab Switching (3 Views: Chat Assistant, Quick Form, CS Toolkit) ----
    bindTabSwitcher() {
      const tabCopilot = document.getElementById('tab-copilot');
      const tabAssistant = document.getElementById('tab-assistant');
      const tabCstool = document.getElementById('tab-cstool');

      const copilotMain = document.getElementById('copilot-main');
      const assistantView = document.getElementById('assistant-view');
      const cstoolView = document.getElementById('cstool-view');

      const activeTokens = ['bg-emerald-600', 'text-white', 'shadow'];
      const inactiveTokens = ['text-slate-400', 'hover:text-white', 'hover:bg-slate-800'];

      const setTabActive = (btn, isActive) => {
        if (!btn) return;
        if (isActive) {
          inactiveTokens.forEach(c => btn.classList.remove(c));
          activeTokens.forEach(c => btn.classList.add(c));
        } else {
          activeTokens.forEach(c => btn.classList.remove(c));
          inactiveTokens.forEach(c => btn.classList.add(c));
        }
      };

      const activateTab = async (tab) => {
        localStorage.setItem('active_homecare_tab', tab);

        setTabActive(tabAssistant, tab === 'assistant');
        setTabActive(tabCopilot, tab === 'copilot');
        setTabActive(tabCstool, tab === 'cstool');

        if (assistantView) assistantView.classList.toggle('hidden', tab !== 'assistant');
        if (copilotMain) copilotMain.classList.toggle('hidden', tab !== 'copilot');
        if (cstoolView) cstoolView.classList.toggle('hidden', tab !== 'cstool');

        if (tab === 'assistant') {
          await this.loadApiKey();
          this.scrollToBottom();
        }
        if (window.lucide) window.lucide.createIcons();
      };

      if (tabCopilot) tabCopilot.addEventListener('click', () => activateTab('copilot'));
      if (tabAssistant) tabAssistant.addEventListener('click', () => activateTab('assistant'));
      if (tabCstool) tabCstool.addEventListener('click', () => activateTab('cstool'));

      const savedTab = localStorage.getItem('active_homecare_tab') || 'assistant';
      activateTab(savedTab);
    }

    // ---- Chat Inputs & Events ----
    bindChatInputs() {
      const sendBtn = document.getElementById('wa-send-btn');
      const textInput = document.getElementById('wa-chat-input');
      const fileInput = document.getElementById('wa-file-input');
      const removeImgBtn = document.getElementById('wa-remove-image-btn');
      const newChatBtn = document.getElementById('wa-new-chat-btn');
      const micBtn = document.getElementById('wa-mic-btn');

      // Send on click
      if (sendBtn) sendBtn.addEventListener('click', () => this.handleSendMessage());

      // Send on Enter (Shift+Enter for newline)
      if (textInput) {
        textInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSendMessage();
          }
        });
        // Auto-expand textarea
        textInput.addEventListener('input', () => {
          textInput.style.height = 'auto';
          textInput.style.height = Math.min(textInput.scrollHeight, 120) + 'px';
        });
      }

      // File upload
      if (fileInput) {
        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file && file.type.startsWith('image/')) this.stageImage(file);
        });
      }

      // Remove staged image
      if (removeImgBtn) {
        removeImgBtn.addEventListener('click', () => this.clearStagedImage());
      }

      // New Chat
      if (newChatBtn) {
        newChatBtn.addEventListener('click', () => {
          if (confirm('هل تريد بدء محادثة جديدة ومسح سجل الشات؟')) {
            this.chatHistory = [];
            localStorage.removeItem('wa_chat_history');
            this.renderChatFeed();
            ClipboardManager.showToast('تم بدء محادثة جديدة', 'info');
          }
        });
      }

      // Mic Button
      if (micBtn) {
        micBtn.addEventListener('click', () => this.toggleSpeechInput());
      }

      // Preset Chips
      document.querySelectorAll('.wa-chip-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const preset = btn.dataset.preset;
          const action = btn.dataset.action;
          if (preset) this.handlePresetClick(preset);
          if (action) this.handleActionClick(action);
        });
      });

      // Global Paste (Ctrl+V) for images inside assistant view
      document.addEventListener('paste', (e) => {
        const assistantView = document.getElementById('assistant-view');
        if (assistantView && assistantView.classList.contains('hidden')) return;

        const items = e.clipboardData?.items;
        if (!items) return;
        for (const item of items) {
          if (item.type.startsWith('image/')) {
            const blob = item.getAsFile();
            if (blob) {
              this.stageImage(blob);
              ClipboardManager.showToast('تم لصق الصورة 📸 جاهزة للإرسال', 'success');
              e.preventDefault();
              break;
            }
          }
        }
      });
    }

    // ---- Side Panel & Schedule ----
    bindSidePanel() {
      const toggleBtn = document.getElementById('wa-toggle-side-btn');
      const sidePanel = document.getElementById('wa-side-panel');

      if (toggleBtn && sidePanel) {
        toggleBtn.addEventListener('click', () => {
          sidePanel.classList.toggle('hidden');
          if (window.lucide) window.lucide.createIcons();
        });
      }
    }

    // ---- Image Staging ----
    stageImage(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        this.stagedImage = {
          base64: dataUrl.split(',')[1],
          mimeType: file.type || 'image/png',
          dataUrl
        };

        const previewBar = document.getElementById('wa-image-preview-bar');
        const previewImg = document.getElementById('wa-preview-img');
        if (previewBar && previewImg) {
          previewImg.src = dataUrl;
          previewBar.classList.remove('hidden');
          if (window.lucide) window.lucide.createIcons();
        }
      };
      reader.readAsDataURL(file);
    }

    clearStagedImage() {
      this.stagedImage = null;
      const previewBar = document.getElementById('wa-image-preview-bar');
      const fileInput = document.getElementById('wa-file-input');
      if (previewBar) previewBar.classList.add('hidden');
      if (fileInput) fileInput.value = '';
    }

    // ---- Speech-to-Text Input ----
    initSpeechRecognition() {
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRec) {
        this.speechRecognition = new SpeechRec();
        this.speechRecognition.lang = 'ar-SA';
        this.speechRecognition.continuous = false;
        this.speechRecognition.interimResults = true;

        this.speechRecognition.onresult = (e) => {
          let text = '';
          for (let i = e.resultIndex; i < e.results.length; i++) {
            text += e.results[i][0].transcript;
          }
          const textInput = document.getElementById('wa-chat-input');
          if (textInput) textInput.value = text;
        };

        this.speechRecognition.onend = () => {
          this.isRecordingSpeech = false;
          const micBtn = document.getElementById('wa-mic-btn');
          if (micBtn) micBtn.classList.remove('text-rose-500', 'animate-pulse');
        };
      }
    }

    toggleSpeechInput() {
      if (!this.speechRecognition) {
        ClipboardManager.showToast('المتصفح لا يدعم التعرف الصوتي المباشر', 'warning');
        return;
      }
      const micBtn = document.getElementById('wa-mic-btn');
      if (this.isRecordingSpeech) {
        this.speechRecognition.stop();
        this.isRecordingSpeech = false;
        if (micBtn) micBtn.classList.remove('text-rose-500', 'animate-pulse');
      } else {
        try {
          this.speechRecognition.start();
          this.isRecordingSpeech = true;
          if (micBtn) micBtn.classList.add('text-rose-500', 'animate-pulse');
          ClipboardManager.showToast('تحدث الآن...', 'info');
        } catch (e) {
          this.isRecordingSpeech = false;
        }
      }
    }

    // ---- Presets & Actions Handling ----
    handlePresetClick(presetKey) {
      const presets = {
        specialist: 'السلام عليكم، الوالد عبد العزيز التميمي عمره 68 سنة ومريض سكر وضغط. يشتكي من ثقل بالصدر ونهجان وخفقان، ونحتاج استشاري قلب يزوره بالبيت ويسوي له تخطيط قلب ECG. موقعنا بالرياض حي الملقا شارع وادي السرحان، نبغاه اليوم بعد العصر 4:30 عصراً.',
        nursing: 'صباح الخير، نبغى خدمة تمريض وسحب دم للوالدة أم فيصل عمرها 62 سنة في جدة حي الشاطئ شارع حراء، محتاجة فحص سكر وتراكمي ووظائف كلى وغيار جرح بالساق، بكرة الصباح 7:30 صائم.',
        physio: 'مساكم الله بالخير، حجز علاج طبيعي للوالد أبو خالد 74 سنة في الدمام حي الشاطئ شارع الخليج، تأهيل حركي بعد جلطة دماغية وضعف بالجانب الأيمن، اليوم الساعة 6:00 مساءً.'
      };
      const text = presets[presetKey];
      if (text) {
        const textInput = document.getElementById('wa-chat-input');
        if (textInput) {
          textInput.value = text;
          this.handleSendMessage();
        }
      }
    }

    handleActionClick(actionKey) {
      if (actionKey === 'show_schedule') {
        const today = new Date().toISOString().split('T')[0];
        const apts = this.appointments.filter(a => a.date === today);
        if (apts.length === 0) {
          this.addSystemMessage('📅 لا توجد مواعيد مسجلة لليوم حتى الآن. يمكنك إضافة موعد عند استخراج أي حجز.');
        } else {
          let list = apts.map(a => `• ⏰ ${a.time} - ${a.patient} (${a.service || 'زيارة'}) - ${a.staff || 'لم يُعيّن'}`).join('\n');
          this.addSystemMessage(`📅 **جدول مواعيد اليوم (${apts.length} مواعيد):**\n\n${list}`);
        }
      } else if (actionKey === 'show_staff') {
        this.addSystemMessage(`👥 **حالة الطاقم والمناوبات:**
• 🚑 سيارات الإسعاف: ${this.staff.ambulance.map(s => s.name).join(', ')} (جاهزية فورية)
• 👩‍⚕️ رئيسية التمريض: ${this.whatsappContacts.nursing_head}
• 🚗 رئيس السواقين: ${this.whatsappContacts.drivers_head}`);
      }
    }

    // ---- Sending & Processing Messages ----
    async handleSendMessage() {
      if (this.isProcessing) return;

      const textInput = document.getElementById('wa-chat-input');
      const text = textInput?.value?.trim() || '';
      const image = this.stagedImage;

      if (!text && !image) {
        ClipboardManager.showToast('يرجى كتابة نص أو إرفاق صورة أولاً', 'warning');
        return;
      }

      await this.loadApiKey();
      if (!this.apiKey) {
        ClipboardManager.showToast('يرجى إدخال مفتاح Gemini API في الإعدادات أولاً', 'warning');
        sounds.play('error');
        return;
      }

      // Add user message to feed
      const userMsg = {
        id: Date.now(),
        role: 'user',
        text: text,
        image: image ? image.dataUrl : null,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      };

      this.chatHistory.push(userMsg);
      this.renderChatFeed();
      this.scrollToBottom();

      // Clear inputs
      if (textInput) {
        textInput.value = '';
        textInput.style.height = 'auto';
      }
      this.clearStagedImage();

      // Show Bot Typing Indicator
      this.isProcessing = true;
      this.showTypingIndicator();

      try {
        const startTime = Date.now();
        const extractedData = await this.callGeminiAPI(text, image);
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

        this.hideTypingIndicator();

        const isBooking = extractedData.intent === 'booking' || (
          extractedData.patient_name && 
          extractedData.patient_name !== 'غير محدد' && 
          extractedData.patient_name !== 'مريض' && 
          extractedData.symptoms && 
          extractedData.symptoms !== 'لا يوجد'
        );

        const botMsg = {
          id: Date.now() + 1,
          role: 'assistant',
          intent: isBooking ? 'booking' : 'chat',
          text: extractedData.reply_text || (isBooking ? 'تم استخراج بيانات الحجز وترجمتها بنجاح:' : 'أهلاً بك! كيف يمكنني مساعدتك؟'),
          data: isBooking ? extractedData : null,
          elapsed,
          timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
        };

        this.chatHistory.push(botMsg);
        this.saveChatHistory();
        this.renderChatFeed();
        this.scrollToBottom();
        sounds.play('success');
      } catch (err) {
        this.hideTypingIndicator();
        this.addSystemMessage(`❌ عذراً، حدث خطأ أثناء التحليل: ${err.message}`);
        sounds.play('error');
      } finally {
        this.isProcessing = false;
      }
    }

    async callGeminiAPI(text, image) {
      const systemPrompt = `أنت "وكيل العمل الطبي الذكي" (HomeCare Operations AI Agent) المساعد لخدمات الرعاية الصحية والطبية المنزلية وإدارة المواعيد وطاقم التمريض والسائقين في المملكة العربية السعودية.

طبيعة عملك (ذكية ومزدوجة):
1. **الحديث والمحاورة (Conversational Mode - intent: "chat"):**
   - إذا ألقى المستخدم التحية (مثل: "سلام عليكم", "مرحبا", "هلا", "صباح الخير", "مساء الخير").
   - أو إذا سأل سؤالاً عاماً (مثل: "كيف أرسل للقروب؟", "ما هي خدماتكم؟", "مين السواقين المتاحين؟", "كيف أسوي تذكير؟").
   - أو إذا دارت محادثة عادية بدون طلب حجز طبي.
   -> ضع "intent": "chat".
   -> ضع في "reply_text" إجابة ذكية، مهذبة، ودودة ومباشرة باللغة العربية.
   -> لا تملأ أي بيانات حجز.

2. **استخراج ومعالجة بيانات الحجز (Booking Extraction Mode - intent: "booking"):**
   - إذا أرسل المستخدم صورة سكرين شوت (محادثة واتساب، تقرير طبي، كشف) أو نص طلب حجز لمريض، أو تفاصيل كشف أو تحاليل أو علاج طبيعي:
   -> ضع "intent": "booking".
   -> ضع في "reply_text" عبارة تأكيد مختصرة (مثل: "تم استخراج وتصنيف بيانات الحجز وترجمتها بنجاح:")
   -> اقرأ وفرغ كافة النصوص والروابط (خرائط جوجل Google Maps) والأسماء وأرقام الجوالات والأوقات بدقة تامة وبلا تخمين (Zero Hallucination).
   -> استخرج الحقول الطبية بدقة:
      - "raw_ocr_text": التفريغ الحرفي لمحادثة الصورة.
      - "category": "doctor" (أطباء واستشاريين) أو "nursing_lab" (تمريض وتحاليل ومختبر) أو "physio" (علاج طبيعي).
      - "patient_name": اسم المريض بدقة.
      - "patient_name_en": اسم المريض بالإنجليزية.
      - "patient_phone": رقم جوال العميل أو المريض المذكور في المحادثة أو الصورة (مثال: "0555978282" أو "+96655...") أو غير محدد.
      - "patient_phone_en": Phone number or Not specified.
      - "age": العمر أو غير محدد.
      - "chronic_diseases": الأمراض المزمنة أو لا يوجد.
      - "chronic_diseases_en": Chronic Diseases or None.
      - "symptoms": الأعراض أو الشكوى أو المتابعة الطبية المذكورة نصاً.
      - "symptoms_en": Symptoms or Follow-up in English.
      - "district": الحي والمدينة ورابط الخريطة إن وجد.
      - "district_en": Location and URL in English.
      - "service_type": نوع الخدمة بدقة.
      - "service_type_en": Service Type in English.
      - "preferred_time": الموعد والتوقيت المذكور فقط.
      - "preferred_time_en": Service Time only.
      - "urgency_level": "عادي" | "عاجل" | "طوارئ قصوى".

صيغة الرد المطلوبة (JSON فقط دون أي كود ماركداون إضافي):
{
  "intent": "chat" | "booking",
  "reply_text": "الرد النصي المحادثاتي الذكي والودود للمستخدم",
  "raw_ocr_text": "التفريغ الحرفي لمحادثة الصورة",
  "category": "doctor" | "nursing_lab" | "physio",
  "patient_name": "اسم المريض",
  "patient_name_en": "Patient Name",
  "patient_phone": "رقم الجوال أو غير محدد",
  "patient_phone_en": "Phone Number",
  "age": "العمر أو غير محدد",
  "chronic_diseases": "الأمراض المزمنة أو لا يوجد",
  "chronic_diseases_en": "Chronic Diseases or None",
  "symptoms": "الأعراض أو تفاصيل المتابعة",
  "symptoms_en": "Symptoms in English",
  "district": "الحي والمدينة ورابط الخريطة",
  "district_en": "Location in English",
  "service_type": "نوع الخدمة",
  "service_type_en": "Service Type",
  "preferred_time": "وقت الموعد",
  "preferred_time_en": "Service Time",
  "urgency_level": "عادي" | "عاجل" | "طوارئ قصوى"
}`;

      const parts = [];
      if (image) {
        parts.push({
          inlineData: {
            mimeType: image.mimeType,
            data: image.base64
          }
        });
      }

      // Add recent chat context (up to last 4 messages)
      const recentHistory = this.chatHistory.slice(-4);
      let contextPrompt = '';
      if (recentHistory.length > 0) {
        contextPrompt = 'سياق المحادثة السابقة بينك وبين المستخدم:\n' + 
          recentHistory.map(m => `${m.role === 'user' ? 'المستخدم' : 'الوكيل'}: ${m.text || (m.data ? m.data.patient_name : '')}`).join('\n') + '\n\n';
      }

      const promptText = image && text
        ? `${contextPrompt}اقرأ صورة محادثة الواتساب هذه بعناية فائقة وفرغ كل النصوص والروابط وأرقام الجوالات والأوقات والأسماء بدقة، مع الأخذ بالاعتبار الملاحظات التالية:\n"""\n${text}\n"""\nاستخرج كافة الحقول الطبية بصيغة JSON.`
        : image
          ? `${contextPrompt}اقرأ صورة محادثة الواتساب هذه بعناية فائقة واقرأ كافة الفقاعات والروابط (Google Maps) والأسماء وأرقام الجوالات والأوقات والملاحظات الطبية وفرغها بدقة كاملة واستخرج جميع الحقول بصيغة JSON دون أي تخمين.`
          : `${contextPrompt}رسالة المستخدم الحالية:\n"""\n${text}\n"""\nحدد الغرض (intent: "chat" أو "booking") وأجب بصيغة JSON.`;

      parts.push({ text: promptText });

      const candidateModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-3.5-flash'];
      let lastError = null;

      for (const model of candidateModels) {
        try {
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts }],
              systemInstruction: { parts: [{ text: systemPrompt }] },
              generationConfig: { responseMimeType: 'application/json', temperature: 0.1, maxOutputTokens: 2500 }
            })
          });

          if (!response.ok) {
            lastError = new Error(`${model} HTTP ${response.status}`);
            continue;
          }

          const resData = await response.json();
          const raw = resData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!raw) { lastError = new Error(`${model} استجابة فارغة`); continue; }

          return this.safeParseJSON(raw);
        } catch (e) {
          lastError = e;
          continue;
        }
      }

      throw lastError || new Error('تعذر الاتصال بمحرك الذكاء الاصطناعي');
    }

    safeParseJSON(raw) {
      if (!raw || typeof raw !== 'string') throw new Error('استجابة فارغة');

      let cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      }

      // 1. Try direct parse
      try {
        return JSON.parse(cleaned);
      } catch (e1) {
        // 2. Fix unescaped newlines/tabs inside quotes
        try {
          const sanitized = cleaned.replace(/[\u0000-\u001F]+/g, (match) => {
            if (match.includes('\n')) return '\\n';
            if (match.includes('\t')) return '\\t';
            return ' ';
          });
          return JSON.parse(sanitized);
        } catch (e2) {
          // 3. Fallback regex field extraction
          const extractField = (key) => {
            const re = new RegExp('"' + key + '"\\s*:\\s*"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"', 'i');
            const m = cleaned.match(re);
            if (m) return m[1].replace(/\\"/g, '"').replace(/\\n/g, '\n').trim();
            const re2 = new RegExp('"' + key + '"\\s*:\\s*([^,\\r\\n]+)', 'i');
            const m2 = cleaned.match(re2);
            return m2 ? m2[1].replace(/^["']|["']$/g, '').replace(/\x7D/g, '').trim() : '';
          };

          const result = {
            intent: extractField('intent') || (extractField('patient_name') ? 'booking' : 'chat'),
            reply_text: extractField('reply_text') || (extractField('patient_name') ? 'تم استخراج بيانات الحجز بنجاح.' : 'أهلاً بك! كيف يمكنني مساعدتك اليوم؟'),
            category: extractField('category') || 'doctor',
            patient_name: extractField('patient_name') || '',
            patient_name_en: extractField('patient_name_en') || extractField('patient_name') || '',
            patient_phone: extractField('patient_phone') || extractField('phone') || extractField('mobile') || '',
            patient_phone_en: extractField('patient_phone_en') || extractField('patient_phone') || extractField('phone') || '',
            age: extractField('age') || 'غير محدد',
            chronic_diseases: extractField('chronic_diseases') || 'لا يوجد',
            chronic_diseases_en: extractField('chronic_diseases_en') || 'None',
            symptoms: extractField('symptoms') || '',
            symptoms_en: extractField('symptoms_en') || '',
            district: extractField('district') || '',
            district_en: extractField('district_en') || '',
            service_type: extractField('service_type') || 'زيارة رعاية صحية منزلية',
            service_type_en: extractField('service_type_en') || 'Home Healthcare Visit',
            preferred_time: extractField('preferred_time') || 'المحدد مع المريض',
            preferred_time_en: extractField('preferred_time_en') || 'As scheduled',
            urgency_level: extractField('urgency_level') || 'عادي'
          };

          if (result.reply_text || result.patient_name) {
            return result;
          }
          throw new Error('تعذر معالجة الـ JSON بشكل صحيح: ' + e1.message);
        }
      }
    }

    addSystemMessage(text) {
      this.chatHistory.push({
        id: Date.now(),
        role: 'system',
        text,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      });
      this.saveChatHistory();
      this.renderChatFeed();
      this.scrollToBottom();
    }

    saveChatHistory() {
      localStorage.setItem('wa_chat_history', JSON.stringify(this.chatHistory.slice(-50)));
    }

    showTypingIndicator() {
      const feed = document.getElementById('wa-chat-feed');
      if (!feed) return;
      const ind = document.createElement('div');
      ind.id = 'wa-typing-indicator';
      ind.className = 'flex items-center gap-2 text-xs text-slate-400 p-3 bg-slate-900/80 rounded-2xl border border-slate-800 w-fit';
      ind.innerHTML = `
        <div class="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
          <i data-lucide="bot" class="w-3.5 h-3.5 animate-spin"></i>
        </div>
        <span>الوكيل الذكي يحلل البيانات ويترجمها للـ CRM والواتساب...</span>
        <div class="flex items-center gap-1 mr-1">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style="animation-delay: 0.2s"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style="animation-delay: 0.4s"></span>
        </div>
      `;
      feed.appendChild(ind);
      if (window.lucide) window.lucide.createIcons();
      this.scrollToBottom();
    }

    hideTypingIndicator() {
      const ind = document.getElementById('wa-typing-indicator');
      if (ind) ind.remove();
    }

    scrollToBottom() {
      const feed = document.getElementById('wa-chat-feed');
      if (feed) {
        setTimeout(() => { feed.scrollTop = feed.scrollHeight; }, 50);
      }
    }

    // ---- Rendering Chat Feed ----
    renderChatFeed() {
      const feed = document.getElementById('wa-chat-feed');
      if (!feed) return;

      if (this.chatHistory.length === 0) {
        feed.innerHTML = `
          <div class="flex flex-col items-center justify-center py-10 px-4 text-center max-w-xl mx-auto space-y-4">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20">
              <i data-lucide="sparkles" class="w-8 h-8"></i>
            </div>
            <div>
              <h3 class="text-base sm:text-lg font-bold text-white mb-1">أهلاً بك في محادثة الوكيل الطبي المساعد 🏥🇸🇦</h3>
              <p class="text-xs sm:text-sm text-slate-400 leading-relaxed">
                أرسل صورة سكرين شوت (واتساب، تقرير طبي، ورقة فحص) أو الصق نص رسالة العميل، وسأقوم فوراً بـ:
              </p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-right w-full text-xs">
              <div class="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                <span class="text-emerald-400 font-bold">1.</span>
                <span class="text-slate-300">استخراج وتصنيف بيانات الحجز للـ CRM</span>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                <span class="text-cyan-400 font-bold">2.</span>
                <span class="text-slate-300">الترجمة التلقائية للغة الإنجليزية</span>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                <span class="text-teal-400 font-bold">3.</span>
                <span class="text-slate-300">تجهيز رسالة الواتساب للقروب مع المنشن</span>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                <span class="text-purple-400 font-bold">4.</span>
                <span class="text-slate-300">جدولة الموعد والتذكير قبل 30 دقيقة</span>
              </div>
            </div>
            <div class="pt-2 text-xs text-slate-500">
              💡 تلميح: يمكنك سحب الصورة مباشرة إلى هذه النافذة أو استخدام <span class="kbd-shortcut">Ctrl+V</span> للصق من الحافظة.
            </div>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      feed.innerHTML = this.chatHistory.map(msg => {
        if (msg.role === 'user') {
          return `
            <div class="flex justify-start gap-2.5 max-w-2xl">
              <div class="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 border border-slate-700">
                <i data-lucide="user" class="w-4 h-4"></i>
              </div>
              <div class="bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/30 p-3 rounded-2xl rounded-tr-none text-xs sm:text-sm text-slate-100 shadow-md space-y-2">
                ${msg.image ? `<img src="${msg.image}" class="max-h-48 rounded-xl border border-emerald-500/40 shadow object-cover mb-2" />` : ''}
                ${msg.text ? `<p class="whitespace-pre-wrap leading-relaxed">${msg.text}</p>` : ''}
                <div class="text-[10px] text-emerald-400/80 text-left font-mono">${msg.timestamp || ''}</div>
              </div>
            </div>
          `;
        } else if (msg.role === 'system') {
          return `
            <div class="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
              ${msg.text}
            </div>
          `;
        } else if (msg.role === 'assistant') {
          // 1. Pure Conversational Chat Message (No booking card)
          if (!msg.data) {
            return `
              <div class="flex justify-start gap-2.5 max-w-2xl">
                <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 text-white flex items-center justify-center shrink-0 shadow">
                  <i data-lucide="bot" class="w-4 h-4"></i>
                </div>
                <div class="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl rounded-tr-none text-xs sm:text-sm text-slate-100 shadow-md space-y-1.5 leading-relaxed text-right" dir="rtl">
                  <p class="whitespace-pre-wrap">${msg.text || 'أهلاً بك! كيف يمكنني مساعدتك؟'}</p>
                  <div class="text-[10px] text-slate-500 text-left font-mono">${msg.timestamp || ''}</div>
                </div>
              </div>
            `;
          }

          // 2. Structured Booking Card Response
          const d = msg.data;
          const cardId = `card-${msg.id}`;
          const includePhone = msg.includePhone !== false; // Default true
          const arCRM = this.formatArabicCRM(d, includePhone);
          const enCRM = this.formatEnglishCRM(d, includePhone);
          const waGroup = this.formatWhatsAppGroup(d, includePhone);

          return `
            <div class="flex justify-start gap-2.5 max-w-3xl w-full" id="${cardId}">
              <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 text-white flex items-center justify-center shrink-0 shadow">
                <i data-lucide="bot" class="w-4 h-4"></i>
              </div>
              
              <!-- Rich Interactive Booking Card -->
              <div class="flex-1 space-y-2">
                ${msg.text ? `
                  <div class="bg-slate-900/80 border border-slate-800 p-2.5 rounded-2xl rounded-tr-none text-xs text-slate-200 text-right" dir="rtl">
                    ${msg.text}
                  </div>
                ` : ''}

                <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-xl space-y-3">
                  <!-- Card Header -->
                  <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-bold text-white">${d.patient_name || 'حجز جديد'}</span>
                      <span class="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">${d.service_type || 'خدمة طبية'}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">${d.urgency_level || 'عادي'}</span>
                      ${msg.elapsed ? `<span class="text-[10px] text-slate-500 font-mono">⏱️ ${msg.elapsed}s</span>` : ''}
                    </div>
                  </div>

                  <!-- Phone Number Options Toolbar -->
                  <div class="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-950/90 rounded-xl border border-slate-800 text-xs">
                    <div class="flex items-center gap-1.5">
                      <span class="text-slate-400 font-semibold text-[11px]">📱 خيار النسخ:</span>
                      <button class="wa-phone-toggle-btn px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${includePhone ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'}" data-card="${cardId}" data-phone-mode="with">
                        <i data-lucide="${includePhone ? 'check-circle-2' : 'circle'}" class="w-3.5 h-3.5"></i>
                        <span>مع رقم العميل</span>
                      </button>
                      <button class="wa-phone-toggle-btn px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1.5 ${!includePhone ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'}" data-card="${cardId}" data-phone-mode="without">
                        <i data-lucide="${!includePhone ? 'check-circle-2' : 'circle'}" class="w-3.5 h-3.5"></i>
                        <span>بدون رقم</span>
                      </button>
                    </div>
                    ${d.patient_phone && d.patient_phone !== 'غير محدد' ? `<span class="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-lg border border-cyan-800/60 flex items-center gap-1">📞 ${d.patient_phone}</span>` : `<span class="text-[10px] text-slate-500">لم يرصد رقم جوال</span>`}
                  </div>

                  <!-- Tabs for Formats (Arabic CRM / English CRM / WhatsApp Group) -->
                  <div class="space-y-2">
                    <div class="flex items-center gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs">
                      <button class="wa-tab-toggle flex-1 py-1.5 rounded-lg font-bold transition bg-emerald-600 text-white shadow" data-target="ar" data-card="${cardId}">
                        🇸🇦 نموذج CRM (عربي)
                      </button>
                      <button class="wa-tab-toggle flex-1 py-1.5 rounded-lg text-slate-400 hover:text-white transition font-bold" data-target="en" data-card="${cardId}">
                        🌐 English CRM
                      </button>
                      <button class="wa-tab-toggle flex-1 py-1.5 rounded-lg text-slate-400 hover:text-white transition font-bold" data-target="wa" data-card="${cardId}">
                        💬 رسالة القروب (واتساب)
                      </button>
                    </div>

                    <!-- Tab 1: Arabic CRM Content -->
                    <div id="${cardId}-tab-ar" class="wa-tab-pane bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed text-right" dir="rtl">${arCRM}</div>

                    <!-- Tab 2: English CRM Content -->
                    <div id="${cardId}-tab-en" class="wa-tab-pane hidden bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed text-left" dir="ltr">${enCRM}</div>

                    <!-- Tab 3: WhatsApp Group Content -->
                    <div id="${cardId}-tab-wa" class="wa-tab-pane hidden bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-emerald-300 font-mono whitespace-pre-wrap leading-relaxed text-right" dir="rtl">${waGroup}</div>
                  </div>

                  <!-- 1-Click Action Buttons -->
                  <div class="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
                    <button class="wa-copy-ar-btn px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition shadow" data-card="${cardId}">
                      <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                      <span>نسخ للـ CRM (عربي)</span>
                    </button>
                    <button class="wa-copy-en-btn px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold flex items-center gap-1.5 transition" data-card="${cardId}">
                      <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                      <span>Copy English (with @mentions)</span>
                    </button>
                    <button class="wa-copy-group-btn px-3 py-1.5 rounded-xl bg-teal-950 hover:bg-teal-900 text-teal-200 border border-teal-700/60 font-semibold flex items-center gap-1.5 transition" data-card="${cardId}">
                      <i data-lucide="message-circle" class="w-3.5 h-3.5 text-teal-400"></i>
                      <span>نسخ للقروب مع المنشن</span>
                    </button>
                    <button class="wa-schedule-btn px-3 py-1.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-700/60 font-semibold flex items-center gap-1.5 transition mr-auto" data-card="${cardId}">
                      <i data-lucide="calendar-plus" class="w-3.5 h-3.5 text-purple-400"></i>
                      <span>إضافة لجدول المواعيد</span>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          `;
        }
        return '';
      }).join('');

      // Bind tabs and buttons inside rendered cards
      this.bindCardInteractions();
      if (window.lucide) window.lucide.createIcons();
    }

    bindCardInteractions() {
      // Tab toggling inside cards
      document.querySelectorAll('.wa-tab-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
          const cardId = btn.dataset.card;
          const target = btn.dataset.target;
          const card = document.getElementById(cardId);
          if (!card) return;

          // Toggle tab buttons
          card.querySelectorAll('.wa-tab-toggle').forEach(b => {
            b.className = b.className.replace('bg-emerald-600 text-white shadow', 'text-slate-400 hover:text-white');
          });
          btn.className = btn.className.replace('text-slate-400 hover:text-white', 'bg-emerald-600 text-white shadow');

          // Toggle panes
          card.querySelectorAll('.wa-tab-pane').forEach(p => p.classList.add('hidden'));
          const activePane = document.getElementById(`${cardId}-tab-${target}`);
          if (activePane) activePane.classList.remove('hidden');
        });
      });

      // Phone toggle (with/without phone number)
      document.querySelectorAll('.wa-phone-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const cardId = btn.dataset.card;
          const phoneMode = btn.dataset.phoneMode; // 'with' or 'without'
          const includePhone = phoneMode === 'with';
          const card = document.getElementById(cardId);
          if (!card) return;

          const msgId = parseInt(cardId.replace('card-', ''));
          const msg = this.chatHistory.find(m => m.id === msgId);
          if (!msg || !msg.data) return;

          msg.includePhone = includePhone;
          this.saveChatHistory();

          // Toggle buttons appearance
          card.querySelectorAll('.wa-phone-toggle-btn').forEach(b => {
            const isThis = b.dataset.phoneMode === phoneMode;
            if (isThis) {
              b.className = includePhone
                ? 'wa-phone-toggle-btn px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1.5 bg-emerald-600 text-white shadow'
                : 'wa-phone-toggle-btn px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1.5 bg-amber-600 text-white shadow';
              const icon = b.querySelector('i');
              if (icon) icon.setAttribute('data-lucide', 'check-circle-2');
            } else {
              b.className = 'wa-phone-toggle-btn px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800';
              const icon = b.querySelector('i');
              if (icon) icon.setAttribute('data-lucide', 'circle');
            }
          });

          // Update text in all 3 tabs immediately
          const arPane = document.getElementById(`${cardId}-tab-ar`);
          const enPane = document.getElementById(`${cardId}-tab-en`);
          const waPane = document.getElementById(`${cardId}-tab-wa`);

          if (arPane) arPane.innerText = this.formatArabicCRM(msg.data, includePhone);
          if (enPane) enPane.innerText = this.formatEnglishCRM(msg.data, includePhone);
          if (waPane) waPane.innerText = this.formatWhatsAppGroup(msg.data, includePhone);

          if (window.lucide) window.lucide.createIcons();
          ClipboardManager.showToast(includePhone ? 'تم تفعيل نسخ رقم العميل 📱' : 'تم استبعاد رقم العميل من النسخ ✂️', 'info');
        });
      });

      // Copy Arabic CRM
      document.querySelectorAll('.wa-copy-ar-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const cardId = btn.dataset.card;
          const pane = document.getElementById(`${cardId}-tab-ar`);
          if (pane) {
            ClipboardManager.copyText(pane.innerText.trim(), 'تم نسخ نموذج الـ CRM العربي بنجاح 📋');
          }
        });
      });

      // Copy English CRM
      document.querySelectorAll('.wa-copy-en-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const cardId = btn.dataset.card;
          const pane = document.getElementById(`${cardId}-tab-en`);
          if (pane) {
            ClipboardManager.copyText(pane.innerText.trim(), 'English format copied with @mentions 🌐');
          }
        });
      });

      // Copy WhatsApp Group
      document.querySelectorAll('.wa-copy-group-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const cardId = btn.dataset.card;
          const pane = document.getElementById(`${cardId}-tab-wa`);
          if (pane) {
            ClipboardManager.copyText(pane.innerText.trim(), 'تم نسخ رسالة الواتساب مع المنشن للقروب 💬');
          }
        });
      });

      // Add to schedule
      document.querySelectorAll('.wa-schedule-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const cardId = btn.dataset.card;
          const msgId = parseInt(cardId.replace('card-', ''));
          const msg = this.chatHistory.find(m => m.id === msgId);
          if (msg && msg.data) {
            this.addAppointmentFromData(msg.data);
          }
        });
      });
    }

    // ---- Formatters ----
    formatArabicCRM(data, includePhone = true) {
      const cat = data.category || 'doctor';
      const lines = [];

      lines.push(`الاسم : ${data.patient_name || ''}`);
      if (includePhone && data.patient_phone && data.patient_phone !== 'غير محدد') {
        lines.push(`الرقم : ${data.patient_phone}`);
      }
      lines.push(`العمر: ${data.age || 'غير محدد'}`);

      if (cat === 'doctor') {
        lines.push(`الامراض المزمنة : ${data.chronic_diseases || 'لا يوجد'}`);
      }

      lines.push(`الاعراض: ${data.symptoms || ''}`);
      lines.push(`الموقع : ${data.district || ''}`);
      lines.push(`نوع الخدمة: ${data.service_type || ''}`);
      lines.push(`زمن الخدمة: ${data.preferred_time || ''}`);
      lines.push('');
      lines.push(this.whatsappContacts.nursing_head);
      lines.push(this.whatsappContacts.drivers_head);

      return lines.join('\n');
    }

    formatEnglishCRM(data, includePhone = true) {
      const cat = data.category || 'doctor';
      const lines = [];

      lines.push(`Patient Name: ${data.patient_name_en || data.patient_name || ''}`);
      if (includePhone && (data.patient_phone_en || data.patient_phone) && data.patient_phone !== 'غير محدد') {
        lines.push(`Phone Number: ${data.patient_phone_en || data.patient_phone}`);
      }
      lines.push(`Age: ${data.age || 'Not specified'}`);

      if (cat === 'doctor') {
        lines.push(`Chronic Diseases: ${data.chronic_diseases_en || data.chronic_diseases || 'None'}`);
      }

      lines.push(`Symptoms: ${data.symptoms_en || data.symptoms || ''}`);
      lines.push(`Location: ${data.district_en || data.district || ''}`);
      lines.push(`Service Type: ${data.service_type_en || data.service_type || ''}`);
      lines.push(`Service Time: ${data.preferred_time_en || data.preferred_time || ''}`);
      lines.push('');
      lines.push(this.whatsappContacts.nursing_head);
      lines.push(this.whatsappContacts.drivers_head);

      return lines.join('\n');
    }

    formatWhatsAppGroup(data, includePhone = true) {
      const phoneLine = (includePhone && data.patient_phone && data.patient_phone !== 'غير محدد')
        ? `\n📱 الرقم: ${data.patient_phone}`
        : '';

      return `🔔 طلب حجز جديد:
━━━━━━━━━━━━━━━━
👤 المريض: ${data.patient_name || ''}${phoneLine}
🎂 العمر: ${data.age || 'غير محدد'}
🩺 الخدمة: ${data.service_type || ''}
📍 الموقع: ${data.district || ''}
⏰ الموعد: ${data.preferred_time || ''}
📝 الأعراض: ${data.symptoms || ''}
━━━━━━━━━━━━━━━━
${this.whatsappContacts.nursing_head}
${this.whatsappContacts.drivers_head}`;
    }

    // ---- Schedule & Reminders ----
    addAppointmentFromData(data) {
      // Auto extract time
      const timeMatch = (data.preferred_time || '').match(/(\d{1,2}:\d{2})/);
      const timeStr = timeMatch ? timeMatch[1] : '16:00';

      const apt = {
        id: Date.now(),
        time: timeStr,
        patient: data.patient_name || 'مريض',
        service: data.service_type || 'خدمة طبية',
        location: data.district || '',
        status: 'new',
        date: new Date().toISOString().split('T')[0]
      };

      this.appointments.push(apt);
      this.saveAppointments();
      this.renderSideAppointments();
      ClipboardManager.showToast(`✅ تمت إضافة موعد ${apt.patient} الساعة ${apt.time}`, 'success');
      sounds.play('success');
    }

    saveAppointments() {
      localStorage.setItem('wa_appointments', JSON.stringify(this.appointments));
    }

    renderSideAppointments() {
      const container = document.getElementById('wa-side-apt-list');
      const badgeCount = document.getElementById('wa-side-apt-count');
      const topBadge = document.getElementById('wa-apt-badge');

      if (!container) return;

      const today = new Date().toISOString().split('T')[0];
      const todayApts = this.appointments
        .filter(a => a.date === today)
        .sort((a, b) => a.time.localeCompare(b.time));

      if (badgeCount) badgeCount.textContent = `${todayApts.length} مواعيد`;
      if (topBadge) topBadge.textContent = `${todayApts.length}`;

      if (todayApts.length === 0) {
        container.innerHTML = '<div class="text-center py-6 text-slate-500 text-xs">لا توجد مواعيد مضافة بعد</div>';
        return;
      }

      container.innerHTML = todayApts.map(apt => `
        <div class="p-2 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5 text-xs" data-apt-id="${apt.id}">
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-100">${apt.patient}</span>
            <span class="text-emerald-400 font-mono font-bold">${apt.time}</span>
          </div>
          <div class="flex items-center justify-between text-[11px] text-slate-400">
            <span>${apt.service}</span>
            <button class="wa-side-remind-btn text-[#25D366] hover:underline flex items-center gap-1" data-id="${apt.id}">
              <i data-lucide="message-circle" class="w-3 h-3"></i> تذكير
            </button>
          </div>
        </div>
      `).join('');

      container.querySelectorAll('.wa-side-remind-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = parseInt(btn.dataset.id);
          const apt = this.appointments.find(a => a.id === id);
          if (apt) {
            const msg = `🔔 تذكير موعد اليوم:
━━━━━━━━━━━━━━━━
👤 المريض: ${apt.patient}
🩺 الخدمة: ${apt.service}
⏰ الموعد: اليوم ${apt.time}
📍 الموقع: ${apt.location || 'يرجى تأكيد اللوكيشن'}
━━━━━━━━━━━━━━━━
${this.whatsappContacts.nursing_head}
${this.whatsappContacts.drivers_head}`;
            ClipboardManager.copyText(msg, 'تم نسخ تذكير الموعد للقروب 💬');
          }
        });
      });

      if (window.lucide) window.lucide.createIcons();
    }

    startReminderCheck() {
      setInterval(() => {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
        const today = now.toISOString().split('T')[0];

        this.appointments.forEach(apt => {
          if (apt.date !== today || apt.status === 'done' || apt.status === 'cancelled') return;
          if (apt._reminded) return;

          const [h, m] = (apt.time || '00:00').split(':').map(Number);
          const aptMinutes = h * 60 + m;
          const nowMinutes = now.getHours() * 60 + now.getMinutes();
          const diff = aptMinutes - nowMinutes;

          if (diff <= 30 && diff > 0) {
            apt._reminded = true;
            this.showNotification(apt);
          }
        });
      }, 60000);

      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }

    showNotification(apt) {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('⏰ تذكير موعد قريب!', {
          body: `المريض: ${apt.patient}\nالخدمة: ${apt.service}\nالساعة: ${apt.time}`,
          icon: '🏥'
        });
      }
      ClipboardManager.showToast(`⏰ تذكير موعد: ${apt.patient} الساعة ${apt.time} (خلال 30 دقيقة)`, 'warning');
      sounds.play('notification');
    }
  }

  // ==========================================
  // CUSTOMER SERVICE TOOLKIT (مجمع الحياة الطبي)
  // ==========================================
  class CustomerServiceToolkit {
    constructor() {
      this.branches = [
        { name: "الفيحاء", lat: 24.6850278, lng: 46.7967778 },
        { name: "اشبيليا", lat: 24.7859167, lng: 46.7692500 },
        { name: "الرمال",  lat: 24.8456389, lng: 46.8256389 },
        { name: "النفل",   lat: 24.7919722, lng: 46.6786944 },
        { name: "النظيم",  lat: 24.8146389, lng: 46.8800833 }
      ];

      this.initBranchTable();
      this.bindEvents();
    }

    initBranchTable() {
      const tbody = document.getElementById('cs-branch-table-body');
      if (!tbody) return;
      tbody.innerHTML = '';
      this.branches.forEach(b => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-900/50 transition';
        tr.innerHTML = `
          <td class="p-2 font-bold text-emerald-400">${b.name}</td>
          <td class="p-2 font-mono text-slate-400">${b.lat.toFixed(6)}</td>
          <td class="p-2 font-mono text-slate-400">${b.lng.toFixed(6)}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    bindEvents() {
      // 1. Templates Copy
      const copyWelcomeBtn = document.getElementById('cs-copy-welcome-btn');
      const tplWelcome = document.getElementById('cs-tpl-welcome');
      if (copyWelcomeBtn && tplWelcome) {
        copyWelcomeBtn.addEventListener('click', () => {
          ClipboardManager.copyText(tplWelcome.value);
          ClipboardManager.showToast('تم نسخ رسالة الترحيب بنجاح ✅', 'success');
          sounds.play('copied');
        });
      }

      const copyBookingBtn = document.getElementById('cs-copy-booking-btn');
      const priceInput = document.getElementById('cs-booking-price-input');
      const tplBooking = document.getElementById('cs-tpl-booking');
      if (copyBookingBtn && tplBooking) {
        copyBookingBtn.addEventListener('click', () => {
          const price = priceInput ? priceInput.value.trim() : '';
          if (!price) {
            ClipboardManager.showToast('من فضلك اكتب السعر المبدئي أولاً', 'warning');
            if (priceInput) priceInput.focus();
            return;
          }
          const text = tplBooking.value.replace(/\[السعر\]/g, price);
          ClipboardManager.copyText(text);
          ClipboardManager.showToast(`تم نسخ رسالة التأكيد مع السعر (${price} ريال) ✅`, 'success');
          sounds.play('copied');
        });
      }

      const copyLeadBtn = document.getElementById('cs-copy-lead-btn');
      const tplLead = document.getElementById('cs-tpl-lead');
      if (copyLeadBtn && tplLead) {
        copyLeadBtn.addEventListener('click', () => {
          ClipboardManager.copyText(tplLead.value);
          ClipboardManager.showToast('تم نسخ الرسالة التعريفية بنجاح ✅', 'success');
          sounds.play('copied');
        });
      }

      // 1.1 Promotional Offers Copy
      [
        { btn: 'cs-copy-offer1-btn', tpl: 'cs-tpl-offer1', name: 'عرض الرعاية الصحية المتكاملة' },
        { btn: 'cs-copy-offer2-btn', tpl: 'cs-tpl-offer2', name: 'عروض باقات العلاج الطبيعي' },
        { btn: 'cs-copy-offer3-btn', tpl: 'cs-tpl-offer3', name: 'عرض عقود التمريض الشهري' },
        { btn: 'cs-copy-offer4-btn', tpl: 'cs-tpl-offer4', name: 'عرض تذكير العروض وخصم الترشيح' }
      ].forEach(item => {
        const btn = document.getElementById(item.btn);
        const tpl = document.getElementById(item.tpl);
        if (btn && tpl) {
          btn.addEventListener('click', () => {
            ClipboardManager.copyText(tpl.value);
            ClipboardManager.showToast(`تم نسخ ${item.name} للواتساب بنجاح ✅`, 'success');
            sounds.play('copied');
          });
        }
      });

      // 2. Discount Calculator
      const origInput = document.getElementById('cs-disc-original');
      const customDiscInput = document.getElementById('cs-disc-custom');
      const calcDiscBtn = document.getElementById('cs-calc-disc-btn');
      const tplPromo = document.getElementById('cs-tpl-promo');
      const copyPromoBtn = document.getElementById('cs-copy-promo-btn');

      const discBtns = document.querySelectorAll('.cs-disc-btn');
      discBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const pct = btn.getAttribute('data-pct');
          if (customDiscInput) customDiscInput.value = pct;
          this.calculateDiscount();
        });
      });

      if (calcDiscBtn) calcDiscBtn.addEventListener('click', () => this.calculateDiscount());
      if (customDiscInput) customDiscInput.addEventListener('input', () => this.calculateDiscount());
      if (origInput) origInput.addEventListener('input', () => this.calculateDiscount());

      if (copyPromoBtn && tplPromo) {
        copyPromoBtn.addEventListener('click', () => {
          const vals = this.getDiscountValues();
          if (!vals) return;
          let text = tplPromo.value
            .replace(/\[قبل\]/g, vals.orig.toFixed(2))
            .replace(/\[نسبة\]/g, String(vals.pct))
            .replace(/\[بعد\]/g, vals.after.toFixed(2));
          ClipboardManager.copyText(text);
          ClipboardManager.showToast(`تم نسخ رسالة العرض بعد خصم ${vals.pct}% ✅`, 'success');
          sounds.play('copied');
        });
      }

      // 3. Nearest Branch Calculator
      const custLinkInput = document.getElementById('cs-cust-link');
      const calcLinkBtn = document.getElementById('cs-calc-link-btn');
      const custCoordsInput = document.getElementById('cs-cust-coords');
      const calcCoordsBtn = document.getElementById('cs-calc-coords-btn');

      if (calcLinkBtn && custLinkInput) {
        calcLinkBtn.addEventListener('click', () => {
          const link = custLinkInput.value.trim();
          if (!link) {
            ClipboardManager.showToast('من فضلك أدخل رابط خرائط Google Maps', 'warning');
            return;
          }
          const match = link.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) ||
                        link.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/) ||
                        link.match(/ll=(-?\d+\.\d+),(-?\d+\.\d+)/) ||
                        link.match(/place\/(-?\d+\.\d+),(-?\d+\.\d+)/);
          if (match) {
            const lat = parseFloat(match[1]);
            const lng = parseFloat(match[2]);
            this.showBranchResult(lat, lng);
            ClipboardManager.showToast('تم احتساب المسافة وزمن الوصول بنجاح 📍', 'success');
          } else {
            ClipboardManager.showToast('إذا كان الرابط مختصراً (maps.app.goo.gl)، افتحه في المتصفح وانسخ الإحداثيات وضعها في خانة الإحداثيات المباشرة', 'warning');
          }
        });
      }

      if (calcCoordsBtn && custCoordsInput) {
        calcCoordsBtn.addEventListener('click', () => {
          const val = custCoordsInput.value.trim();
          const parts = val.split(',').map(s => parseFloat(s.trim()));
          if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
            ClipboardManager.showToast('من فضلك أدخل الإحداثيات بصيغة صحيحة (مثال: 24.7136, 46.6753)', 'error');
            return;
          }
          this.showBranchResult(parts[0], parts[1]);
          ClipboardManager.showToast('تم احتساب المسافة وزمن الوصول من الإحداثيات 📍', 'success');
        });
      }
    }

    getDiscountValues() {
      const origInput = document.getElementById('cs-disc-original');
      const customDiscInput = document.getElementById('cs-disc-custom');
      const orig = parseFloat(origInput ? origInput.value : 0);
      const pct = parseFloat(customDiscInput ? customDiscInput.value : 0);

      if (!orig || orig <= 0) {
        ClipboardManager.showToast('من فضلك أدخل السعر قبل الخصم أولاً', 'warning');
        if (origInput) origInput.focus();
        return null;
      }
      if (isNaN(pct) || pct < 0 || pct > 100) {
        ClipboardManager.showToast('نسبة الخصم يجب أن تكون بين 0 و 100%', 'warning');
        return null;
      }

      const saved = (orig * pct) / 100;
      const after = orig - saved;
      return { orig, pct, saved, after };
    }

    calculateDiscount() {
      const origInput = document.getElementById('cs-disc-original');
      const customDiscInput = document.getElementById('cs-disc-custom');
      const discResult = document.getElementById('cs-disc-result');
      const resSaved = document.getElementById('cs-res-saved');
      const resFinal = document.getElementById('cs-res-final');

      const orig = parseFloat(origInput ? origInput.value : 0);
      const pct = parseFloat(customDiscInput ? customDiscInput.value : 0);

      if (orig > 0 && !isNaN(pct) && pct >= 0 && pct <= 100) {
        const saved = (orig * pct) / 100;
        const after = orig - saved;
        if (resSaved) resSaved.textContent = `${saved.toFixed(2)} ريال`;
        if (resFinal) resFinal.textContent = `${after.toFixed(2)} ريال`;
        if (discResult) discResult.classList.remove('hidden');
      } else {
        if (discResult) discResult.classList.add('hidden');
      }
    }

    haversine(lat1, lon1, lat2, lon2) {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    estimateTime(distanceKm) {
      const roadKm = distanceKm * 1.25;
      const minutes = Math.max(5, Math.round((roadKm / 35) * 60));
      return minutes < 60 ? `${minutes} دقيقة` : `${Math.floor(minutes / 60)} ساعة${minutes % 60 ? ' و ' + (minutes % 60) + ' دقيقة' : ''}`;
    }

    showBranchResult(lat, lng) {
      const distances = this.branches.map(b => ({
        name: b.name,
        dist: this.haversine(lat, lng, b.lat, b.lng)
      }));

      const fixedNames = ["الفيحاء", "اشبيليا"];
      const fixedLinesHtml = distances
        .filter(d => fixedNames.includes(d.name))
        .map(d => `
          <div class="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <span class="font-bold text-slate-200">📍 فرع <b>${d.name}</b>:</span>
            <span class="font-mono text-cyan-300 text-xs font-bold">${d.dist.toFixed(1)} كم — ⏱️ ${this.estimateTime(d.dist)}</span>
          </div>
        `).join('');

      let nearest = distances[0];
      distances.forEach(d => { if (d.dist < nearest.dist) nearest = d; });

      const fixedContainer = document.getElementById('cs-fixed-branches');
      const nearestContainer = document.getElementById('cs-nearest-branch');
      const resBox = document.getElementById('cs-branch-result');

      if (fixedContainer) fixedContainer.innerHTML = fixedLinesHtml;
      if (nearestContainer) {
        nearestContainer.innerHTML = `
          <div class="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
            <span class="text-emerald-300">✅ أقرب فرع للعميل: <b>${nearest.name}</b></span>
            <span class="font-mono text-emerald-400 font-bold">${nearest.dist.toFixed(1)} كم — ⏱️ ${this.estimateTime(nearest.dist)}</span>
          </div>
        `;
      }
      if (resBox) resBox.classList.remove('hidden');
    }
  }

  // Initialize
  function startApps() {
    if (!window.homeCareApp) window.homeCareApp = new HomeCareCopilotApp();
    if (!window.workAssistantChat) window.workAssistantChat = new WorkAssistantChat();
    if (!window.csToolkit) window.csToolkit = new CustomerServiceToolkit();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApps);
  } else {
    startApps();
  }
})();


