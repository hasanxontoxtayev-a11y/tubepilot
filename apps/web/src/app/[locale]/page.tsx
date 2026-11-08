'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { TubePilotLogo } from '@/components/TubePilotLogo';
import { YoutubeIcon as Youtube } from '@/components/YoutubeIcon';
import {
  Sparkles,
  Zap,
  TrendingUp,
  MessageSquare,
  Eye,
  Bot,
  Flame,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Star,
  Activity,
  Layers,
  BarChart3,
  Search,
  Crown,
  Play,
  ShieldCheck,
  Check,
  Share2,
  Users,
  Clock,
  ThumbsUp
} from 'lucide-react';

export default function PremiumFintechLandingPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'uz';

  // Live dynamic counter simulations (Stripe & FinTech animated vibe)
  const [liveViews, setLiveViews] = useState(1425890);
  const [liveCtr, setLiveCtr] = useState(9.4);
  const [vphVelocity, setVphVelocity] = useState(3840);
  const [activeTab, setActiveTab] = useState<'ctr' | 'copilot' | 'audit'>('ctr');

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViews((prev) => prev + Math.floor(Math.random() * 8) + 1);
      setVphVelocity((prev) => prev + Math.floor(Math.random() * 5) - 2);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const content = {
    uz: {
      tagline: 'YouTube Uchun Kelajak Avlodi Sun\'iy Intellekti',
      heroTitle1: 'YouTube Kanalingizni',
      heroGradient: 'FinTech & AI Quvvati',
      heroTitle2: 'Bilan Reaktiv Tezlikda O\'stiring',
      heroSubtitle:
        'YouTube algoritmlarini zabt etish endi omadga bog\'liq emas. Gemini Multimodal Vision, real vaqtli VPH tahlillari va 24/7 Telegram avtopiloti yordamida har bir videongizni tavsiyalarga olib chiqing.',
      btnLaunch: 'Boshqaruv Paneliga O\'tish',
      btnPricing: 'Tariflar va Imkoniyatlar',
      freeBadge: 'Kredit karta talab etilmaydi • 1-bosishda YouTube ulash',
      liveMetricsTitle: 'Real Vaqtda Algoritmik Tahlil (Live Simulator)',
      metricCtr: 'Kutilayotgan CTR Foizi',
      metricVph: 'Soatiga Ko\'rishlar (VPH)',
      metricViews: 'Jami Tahlil Qilingan Ko\'rishlar',
      metricGrowth: 'Auditoriya Oqimi Sur\'ati',
      featureTab1: '🖼️ Gemini Vision CTR',
      featureTab2: '💬 AI Izohlar Kopiloti',
      featureTab3: '🔍 Global Kanal Auditi',
      whyTitle: 'Nega Aynan TubePilot AI?',
      whySubtitle: 'Stripe kabi toza, VidIQ kabi chuqur, YouTube algoritmlari kabi tezkor platforma.',
      card1Title: 'Gemini Vision Muqova Tahlili',
      card1Desc: 'Smartfon ekranlarida 85%+ aniqlikda kontrast, shrift o\'lchami va e\'tiborni jalb qilish darajasini baholang.',
      card2Title: 'Ko\'p Tilli Izohlar Yordamchisi',
      card2Desc: 'Tomoshabin istalgan tilda yozsin: AI uning ona tilida qiziqarli javob yozadi va Telegramda tasdiqlatadi.',
      card3Title: 'Virusli Kalit So\'zlar & Teglar',
      card3Desc: 'Past raqobatli, yuqori qidiruvli teglarni 1 soniyada olib, videoni qidiruvda 1-o\'ringa olib chiqing.',
      card4Title: 'Optimal Yuklash Vaqti Xaritasi',
      card4Desc: 'Auditoriyangiz eng faol bo\'lgan soatlarni aniqlab, video chiqqan ilk daqiqalardanoq maksimal impuls oling.',
      card5Title: 'Global Kanal Josusi & VPH',
      card5Desc: 'Istalgan xalqaro kanalni tahlil qiling: uning eng kuchli videolari va daromad sirlarini o\'rganing.',
      card6Title: '24/7 Telegram Avtopilot Hamrohi',
      card6Desc: 'Kompyuteringiz yopiq bo\'lsa ham, bot sizga yangi izohlar, audit hisobotlari va tavsiyalarni yuboradi.',
      ctaReady: 'YouTube Kanal Oqimini Bugunoq O\'zgartiring',
      ctaDesc: 'Dunyo bo\'ylab ilg\'or kreatorlar va YouTube mutaxassislari TubePilot AI bilan o\'z ko\'rishlarini oshirmoqda.',
      ctaStartBtn: 'Hoziroq Bepul Boshlang',
      privacy: 'Maxfiylik Siyosati',
      terms: 'Foydalanish Shartlari',
      rights: 'Barcha huquqlar himoyalangan.'
    },
    ru: {
      tagline: 'Искусственный Интеллект Нового Поколения Для YouTube',
      heroTitle1: 'Масштабируйте Свой YouTube',
      heroGradient: 'Мощью FinTech & ИИ',
      heroTitle2: 'С Реактивной Скоростью',
      heroSubtitle:
        'Продвижение видео больше не лотерея. Мультимодальный анализ Gemini Vision, отслеживание VPH в реальном времени и автономный Telegram-помощник выводят ваши ролики в рекомендации.',
      btnLaunch: 'Открыть Панель Управления',
      btnPricing: 'Тарифы и Планы',
      freeBadge: 'Без привязки карты • Подключение YouTube в 1 клик',
      liveMetricsTitle: 'Алгоритмический Монитор в Реальном Времени',
      metricCtr: 'Прогнозируемый CTR',
      metricVph: 'Скорость Просмотров (VPH)',
      metricViews: 'Проанализировано Просмотров',
      metricGrowth: 'Коэффициент Роста',
      featureTab1: '🖼️ Gemini Vision CTR',
      featureTab2: '💬 ИИ-Копилот Ответов',
      featureTab3: '🔍 Глобальный Аудит Канала',
      whyTitle: 'Почему Выбирают TubePilot AI?',
      whySubtitle: 'Безупречный стиль Stripe, глубина VidIQ и скорость алгоритмов YouTube.',
      card1Title: 'Диагностика Обложек Gemini Vision',
      card1Desc: 'Оцените контрастность, читаемость на смартфонах и реальный потенциал кликабельности (CTR) с точностью 85%+.',
      card2Title: 'Мультиязычный Автопилот Ответов',
      card2Desc: 'Зритель пишет на любом языке — ИИ мгновенно формулирует авторский ответ с подтверждением в Telegram в 1 клик.',
      card3Title: 'Генератор Вирусных Тегов',
      card3Desc: 'Находите низкоконкурентные высокочастотные теги и поднимайте видео в топ поиска YouTube.',
      card4Title: 'Тепловая Карта Публикаций',
      card4Desc: 'Публикуйте видео в пиковые часы активности аудитории для максимального импульса первых 2 часов.',
      card5Title: 'Глобальный Аудит и VPH',
      card5Desc: 'Анализируйте любой канал в мире: отслеживайте скорость набора просмотров в час (VPH) и алгоритмические паттерны.',
      card6Title: '24/7 Автономный Telegram-Ассистент',
      card6Desc: 'Управляйте каналом прямо со смартфона без необходимости открывать ноутбук.',
      ctaReady: 'Выведите YouTube Канал в Топ Прямо Сейчас',
      ctaDesc: 'Профессиональные авторы и агентства используют мощь TubePilot AI для десятикратного роста.',
      ctaStartBtn: 'Начать Бесплатно',
      privacy: 'Политика Конфиденциальности',
      terms: 'Условия Использования',
      rights: 'Все права защищены.'
    },
    en: {
      tagline: 'Next-Generation YouTube Growth Intelligence Suite',
      heroTitle1: 'Scale Your YouTube Channel',
      heroGradient: 'FinTech & Multimodal AI',
      heroTitle2: 'At Supersonic Speed',
      heroSubtitle:
        'Algorithmic dominance is no longer guesswork. Harness Gemini Multimodal Vision, real-time VPH metrics, and autonomous 24/7 Telegram companion to push every upload straight to Browse Features.',
      btnLaunch: 'Launch Creator Dashboard',
      btnPricing: 'Pricing & Plans',
      freeBadge: 'No credit card required • 1-click official YouTube sync',
      liveMetricsTitle: 'Real-Time Algorithmic Engine (Live Sandbox)',
      metricCtr: 'Predicted CTR Average',
      metricVph: 'Browse Velocity (VPH)',
      metricViews: 'Aggregated Views Analyzed',
      metricGrowth: 'Audience Momentum Rate',
      featureTab1: '🖼️ Gemini Vision CTR',
      featureTab2: '💬 Comment Copilot',
      featureTab3: '🔍 Global Channel Audit',
      whyTitle: 'Engineered For High-Velocity Creators',
      whySubtitle: 'The sleek aesthetics of Stripe, analytical precision of VidIQ, and raw velocity of YouTube algorithms.',
      card1Title: 'Gemini Multimodal Vision CTR',
      card1Desc: 'Diagnose contrast, mobile readability, and predict actual click-through rates with over 85% algorithmic precision.',
      card2Title: 'Multilingual Comment Copilot',
      card2Desc: 'Reply to international audiences in their native language in 1 click via Telegram companion.',
      card3Title: 'Viral Tag & Keyword Engine',
      card3Desc: 'Discover high-search volume, low-competition keywords that propel videos to the #1 spot in search results.',
      card4Title: 'Peak Upload Timing Heatmap',
      card4Desc: 'Target the exact 30-minute window when your viewers are active to maximize the critical 2-hour velocity curve.',
      card5Title: 'Global Channel Spy & VPH',
      card5Desc: 'Inspect any channel worldwide to uncover their fastest-growing videos, revenue pace, and SEO strategies.',
      card6Title: '24/7 Telegram Companion Bot',
      card6Desc: 'Manage incoming comments, verify thumbnail CTRs, and audit competitors directly from your mobile device.',
      ctaReady: 'Ready To Supercharge Your YouTube Growth?',
      ctaDesc: 'Join elite content creators and media agencies scaling their audience exponentially with TubePilot AI.',
      ctaStartBtn: 'Get Started Free Today',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      rights: 'All rights reserved.'
    }
  }[locale as 'uz' | 'ru' | 'en'] || {
    tagline: 'YouTube Uchun Kelajak Avlodi Sun\'iy Intellekti',
    heroTitle1: 'YouTube Kanalingizni',
    heroGradient: 'FinTech & AI Quvvati',
    heroTitle2: 'Bilan Reaktiv Tezlikda O\'stiring',
    heroSubtitle:
      'YouTube algoritmlarini zabt etish endi omadga bog\'liq emas. Gemini Multimodal Vision, real vaqtli VPH tahlillari va 24/7 Telegram avtopiloti yordamida har bir videongizni tavsiyalarga olib chiqing.',
    btnLaunch: 'Boshqaruv Paneliga O\'tish',
    btnPricing: 'Tariflar va Imkoniyatlar',
    freeBadge: 'Kredit karta talab etilmaydi • 1-bosishda YouTube ulash',
    liveMetricsTitle: 'Real Vaqtda Algoritmik Tahlil (Live Simulator)',
    metricCtr: 'Kutilayotgan CTR Foizi',
    metricVph: 'Soatiga Ko\'rishlar (VPH)',
    metricViews: 'Jami Tahlil Qilingan Ko\'rishlar',
    metricGrowth: 'Auditoriya Oqimi Sur\'ati',
    featureTab1: '🖼️ Gemini Vision CTR',
    featureTab2: '💬 AI Izohlar Kopiloti',
    featureTab3: '🔍 Global Kanal Auditi',
    whyTitle: 'Nega Aynan TubePilot AI?',
    whySubtitle: 'Stripe kabi toza, VidIQ kabi chuqur, YouTube algoritmlari kabi tezkor platforma.',
    card1Title: 'Gemini Vision Muqova Tahlili',
    card1Desc: 'Smartfon ekranlarida 85%+ aniqlikda kontrast, shrift o\'lchami va e\'tiborni jalb qilish darajasini baholang.',
    card2Title: 'Ko\'p Tilli Izohlar Yordamchisi',
    card2Desc: 'Tomoshabin istalgan tilda yozsin: AI uning ona tilida qiziqarli javob yozadi va Telegramda tasdiqlatadi.',
    card3Title: 'Virusli Kalit So\'zlar & Teglar',
    card3Desc: 'Past raqobatli, yuqori qidiruvli teglarni 1 soniyada olib, videoni qidiruvda 1-o\'ringa olib chiqing.',
    card4Title: 'Optimal Yuklash Vaqti Xaritasi',
    card4Desc: 'Auditoriyangiz eng faol bo\'lgan soatlarni aniqlab, video chiqqan ilk daqiqalardanoq maksimal impuls oling.',
    card5Title: 'Global Kanal Josusi & VPH',
    card5Desc: 'Istalgan xalqaro kanalni tahlil qiling: uning eng kuchli videolari va daromad sirlarini o\'rganing.',
    card6Title: '24/7 Telegram Avtopilot Hamrohi',
    card6Desc: 'Kompyuteringiz yopiq bo\'lsa ham, bot sizga yangi izohlar, audit hisobotlari va tavsiyalarni yuboradi.',
    ctaReady: 'YouTube Kanal Oqimini Bugunoq O\'zgartiring',
    ctaDesc: 'Dunyo bo\'ylab ilg\'or kreatorlar va YouTube mutaxassislari TubePilot AI bilan o\'z ko\'rishlarini oshirmoqda.',
    ctaStartBtn: 'Hoziroq Bepul Boshlang',
    privacy: 'Maxfiylik Siyosati',
    terms: 'Foydalanish Shartlari',
    rights: 'Barcha huquqlar himoyalangan.'
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white selection:bg-indigo-500 selection:text-white font-sans relative overflow-x-hidden">
      {/* Dynamic Stripe-Style Multi-Layered Aurora Mesh Gradient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-indigo-600/25 via-purple-600/20 to-transparent blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-cyan-500/20 via-blue-600/20 to-transparent blur-[130px]" />
        <div className="absolute bottom-[10%] left-[20%] w-[60vw] h-[40vw] rounded-full bg-gradient-to-tr from-emerald-500/15 via-indigo-600/15 to-transparent blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Modern Navigation Header */}
      <header className="relative z-30 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/[0.08] backdrop-blur-xl bg-[#07090e]/40">
        <Link href={`/${locale}`} className="flex items-center gap-3 group">
          <TubePilotLogo size="md" showText={true} />
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href={`/${locale}/pricing`}
            className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl hover:bg-white/[0.06] transition-all border border-transparent hover:border-white/10"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>{content.btnPricing}</span>
          </Link>

          <LocaleSwitcher />

          <Link
            href={`/${locale}/dashboard`}
            className="relative group overflow-hidden px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm text-white shadow-xl shadow-indigo-950/60 transition-all hover:scale-105 active:scale-95 border border-white/20"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 group-hover:from-indigo-400 group-hover:via-purple-400 group-hover:to-pink-400 transition-all" />
            <span className="relative flex items-center gap-2">
              <span>{content.btnLaunch}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 pt-20 sm:pt-28 pb-16 text-center">
        {/* Floating Gradient FinTech Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.12] text-xs sm:text-sm font-bold text-slate-200 mb-8 shadow-2xl backdrop-blur-2xl hover:border-indigo-400/50 transition-all">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            {content.tagline}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.12]">
          {content.heroTitle1}{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 via-pink-400 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_15px_35px_rgba(168,85,247,0.35)]">
            {content.heroGradient}
          </span>{' '}
          {content.heroTitle2}
        </h1>

        {/* Subtitle */}
        <p className="mt-8 text-base sm:text-xl text-slate-300/90 max-w-3xl mx-auto leading-relaxed font-normal">
          {content.heroSubtitle}
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={`/${locale}/dashboard`}
            className="w-full sm:w-auto relative group overflow-hidden px-8 py-4 rounded-2xl font-black text-base sm:text-lg text-white shadow-2xl shadow-indigo-600/40 transition-all hover:scale-105 active:scale-95 border border-white/30 flex items-center justify-center gap-3"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 group-hover:from-indigo-500 group-hover:via-purple-500 group-hover:to-pink-500 transition-all" />
            <span className="relative flex items-center gap-3">
              <Youtube className="w-6 h-6 fill-white" />
              <span>{content.btnLaunch}</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href={`/${locale}/pricing`}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white font-bold text-base transition-all border border-white/[0.12] hover:border-white/25 flex items-center justify-center gap-2 backdrop-blur-xl"
          >
            <Crown className="w-5 h-5 text-amber-400" />
            <span>{content.btnPricing}</span>
          </Link>
        </div>

        <p className="mt-4 text-xs text-slate-400 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{content.freeBadge}</span>
        </p>

        {/* Interactive FinTech Live Dashboard Simulation (Stripe Style) */}
        <div className="mt-16 sm:mt-20 p-2 sm:p-3 rounded-3xl bg-gradient-to-b from-white/15 to-white/5 border border-white/20 shadow-2xl shadow-black/80 backdrop-blur-3xl max-w-5xl mx-auto">
          <div className="rounded-[22px] bg-[#0c0f17] border border-white/10 p-6 sm:p-8 text-left overflow-hidden relative">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="h-4 w-px bg-white/10 mx-1" />
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>TubePilot Quantum Engine v3.8</span>
                </span>
              </div>

              {/* Interactive Tabs */}
              <div className="flex items-center gap-1.5 bg-white/[0.05] p-1 rounded-xl border border-white/10 text-xs">
                <button
                  onClick={() => setActiveTab('ctr')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === 'ctr'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {content.featureTab1}
                </button>
                <button
                  onClick={() => setActiveTab('copilot')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === 'copilot'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {content.featureTab2}
                </button>
                <button
                  onClick={() => setActiveTab('audit')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === 'audit'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {content.featureTab3}
                </button>
              </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-indigo-500/40 transition-all">
                <span className="text-xs font-semibold text-slate-400 block">{content.metricCtr}</span>
                <div className="text-2xl sm:text-3xl font-black text-white mt-1 flex items-baseline gap-1.5">
                  <span className="text-indigo-400">{liveCtr}%</span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center">
                    <TrendingUp className="w-3 h-3" /> +2.8%
                  </span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full w-[82%] rounded-full animate-pulse" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-purple-500/40 transition-all">
                <span className="text-xs font-semibold text-slate-400 block">{content.metricVph}</span>
                <div className="text-2xl sm:text-3xl font-black text-white mt-1 flex items-baseline gap-1.5">
                  <span className="text-purple-400">{vphVelocity.toLocaleString()}</span>
                  <span className="text-[11px] font-bold text-slate-400">/hr</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-400 h-full w-[74%] rounded-full" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-emerald-500/40 transition-all">
                <span className="text-xs font-semibold text-slate-400 block">{content.metricViews}</span>
                <div className="text-2xl sm:text-3xl font-black text-white mt-1 flex items-baseline gap-1.5">
                  <span className="text-emerald-400">{liveViews.toLocaleString()}</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[91%] rounded-full" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-pink-500/40 transition-all">
                <span className="text-xs font-semibold text-slate-400 block">{content.metricGrowth}</span>
                <div className="text-2xl sm:text-3xl font-black text-white mt-1 flex items-baseline gap-1.5">
                  <span className="text-pink-400">10.4x</span>
                  <span className="text-xs font-bold text-emerald-400">⚡ Viral</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-pink-500 to-amber-400 h-full w-[88%] rounded-full" />
                </div>
              </div>
            </div>

            {/* Dynamic Interactive Tab View */}
            <div className="mt-6 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-6">
              {activeTab === 'ctr' && (
                <>
                  <div className="space-y-2 max-w-lg">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-400 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                      Gemini Multimodal AI Vision
                    </span>
                    <h4 className="text-lg font-bold text-white">Smartfon ekranlarida 85%+ aniqlikdagi muqova tahlili</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      AI rasmdagi yuz ifodasi, shrift qalinligi va rang kontrastini tahlil qilib, YouTube tavsiyalar lentasida boshqa videolardan qanchalik ustun turishini aniqlab beradi.
                    </p>
                  </div>
                  <div className="flex items-center gap-4 bg-dark-950 p-4 rounded-xl border border-white/10">
                    <div className="w-16 h-12 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-xl font-black text-white">
                      88
                    </div>
                    <div className="text-xs">
                      <div className="text-emerald-400 font-extrabold">A&apos;lo Darajadagi Kontrast</div>
                      <div className="text-slate-400 text-[11px]">Mobil o&apos;qilishi: 9.2/10</div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'copilot' && (
                <>
                  <div className="space-y-2 max-w-lg">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-purple-400 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                      Global Comment Copilot
                    </span>
                    <h4 className="text-lg font-bold text-white">Tomoshabin ona tilida avtomatik samimiy javoblar</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Istalgan tildagi izohlar muallif ohangida tahlil qilinadi. To&apos;g&apos;ridan-to&apos;g&apos;ri Telegram botingizga yuboriladi va 1 soniyada tasdiqlanadi.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 bg-dark-950 p-3.5 rounded-xl border border-white/10 text-xs">
                    <MessageSquare className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="text-white font-bold">1-Bosishda Tasdiqlash</div>
                      <div className="text-slate-400 text-[11px]">Telegram & YouTube Studio Sync</div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'audit' && (
                <>
                  <div className="space-y-2 max-w-lg">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                      Views Per Hour Velocity
                    </span>
                    <h4 className="text-lg font-bold text-white">Dunyodagi istalgan YouTube kanalining VPH tezligi</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Kanal sarlavhalari, teglari, yuklash vaqti va eng ko&apos;p ko&apos;rilayotgan flagman videolarini 1 soniyada tekshiring.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 bg-dark-950 p-3.5 rounded-xl border border-white/10 text-xs">
                    <Flame className="w-5 h-5 text-amber-400" />
                    <div>
                      <div className="text-white font-bold">Cheklovsiz Qidiruv</div>
                      <div className="text-slate-400 text-[11px]">Raqobatchilarni tahlil qilish</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FinTech Grid Features (6 High-Impact Cards) */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30">
            Professional Suite
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {content.whyTitle}
          </h2>
          <p className="text-base text-slate-400 leading-relaxed font-normal">
            {content.whySubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="group p-8 rounded-3xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1 shadow-xl relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white mb-3">{content.card1Title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{content.card1Desc}</p>
          </div>

          {/* Card 2 */}
          <div className="group p-8 rounded-3xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1 shadow-xl relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white mb-3">{content.card2Title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{content.card2Desc}</p>
          </div>

          {/* Card 3 */}
          <div className="group p-8 rounded-3xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1 shadow-xl relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white mb-3">{content.card3Title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{content.card3Desc}</p>
          </div>

          {/* Card 4 */}
          <div className="group p-8 rounded-3xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1 shadow-xl relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white mb-3">{content.card4Title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{content.card4Desc}</p>
          </div>

          {/* Card 5 */}
          <div className="group p-8 rounded-3xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 shadow-xl relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white mb-3">{content.card5Title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{content.card5Desc}</p>
          </div>

          {/* Card 6 */}
          <div className="group p-8 rounded-3xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-pink-500/40 transition-all duration-300 hover:-translate-y-1 shadow-xl relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all" />
            <div className="w-12 h-12 rounded-2xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white mb-3">{content.card6Title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{content.card6Desc}</p>
          </div>
        </div>
      </section>

      {/* Global FinTech High-Impact CTA Section */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 py-20">
        <div className="relative p-10 sm:p-16 rounded-[36px] bg-gradient-to-r from-indigo-900/60 via-purple-900/50 to-[#0c0f17] border border-white/20 shadow-2xl shadow-indigo-950/80 overflow-hidden text-center backdrop-blur-3xl">
          <div className="absolute top-[-50%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/30 to-pink-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-white/10 text-indigo-300 border border-white/15">
              Instant Access • 100% Free Setup
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {content.ctaReady}
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              {content.ctaDesc}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/${locale}/dashboard`}
                className="w-full sm:w-auto relative group overflow-hidden px-9 py-4 rounded-2xl font-black text-base text-white shadow-2xl shadow-indigo-600/50 transition-all hover:scale-105 active:scale-95 border border-white/30 flex items-center justify-center gap-2.5"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 group-hover:from-indigo-400 group-hover:via-purple-400 group-hover:to-pink-400 transition-all" />
                <span className="relative flex items-center gap-2.5">
                  <Youtube className="w-5 h-5 fill-white" />
                  <span>{content.ctaStartBtn}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 max-w-7xl mx-auto px-6 py-10 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <TubePilotLogo size="sm" showText={true} />
          <span>· © {new Date().getFullYear()} {content.rights}</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href={`/${locale}/privacy`} className="hover:text-white transition-colors">
            {content.privacy}
          </Link>
          <Link href={`/${locale}/pricing`} className="hover:text-white transition-colors">
            {content.btnPricing}
          </Link>
          <Link href={`/${locale}/dashboard`} className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
            TubePilot Studio
          </Link>
        </div>
      </footer>
    </div>
  );
}
