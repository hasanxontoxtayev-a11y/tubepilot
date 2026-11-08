'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { TubePilotLogo } from '@/components/TubePilotLogo';
import { AmbientBackgroundMesh } from '@/components/AmbientBackgroundMesh';
import { YoutubeIcon as Youtube } from '@/components/YoutubeIcon';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  Eye,
  Bot,
  Flame,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Star,
  Layers,
  BarChart3,
  Search,
  Crown
} from 'lucide-react';

export default function LandingPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'uz';

  const tLanding = {
    uz: {
      badge: "YouTube Uchun Maxsus AI Suite",
      heroTitle1: "YouTube Kanalingizni",
      heroTitleGradient: "Sun'iy Intellekt",
      heroTitle2: "Bilan 10 Barobarga O'stiring",
      heroSubtitle: "Haqiqiy YouTube Studio tahlillari, Gemini Vision orqali muqova (CTR) baholash, ko'p tilli izohlar kopiloti va 24/7 Telegram yordamchisi.",
      ctaStart: "Boshqaruv Paneliga O'tish",
      ctaPricing: "Tariflar va Rejalar",
      stats1Val: "10x",
      stats1Lab: "Tezkor O'sish Sur'ati",
      stats2Val: "85%+",
      stats2Lab: "Haqiqiy CTR Aniqligi",
      stats3Val: "24/7",
      stats3Lab: "Telegram Avtopilot",
      featuresTitle: "Kreatorlar Uchun Barcha Qurollar Bir Joyda",
      featuresSubtitle: "YouTube algoritmlarini zabt etish va videolaringizni tavsiyalarga olib chiqish uchun zamonaviy instrumentlar:",
      feat1Title: "Gemini Vision CTR Tahlili",
      feat1Desc: "Muqovani yuklang: AI ranglar kontrasti, mobil ekranda ko'rinishi va kutilayotgan CTR foizini soniyalarda aniqlaydi.",
      feat2Title: "Ko'p Tilli Izohlar Kopiloti",
      feat2Desc: "Tomoshabin qaysi tilda yozsa, AI o'sha tilda muallif ohangida samimiy javob tayyorlaydi. Telegramda 1-bosishda tasdiqlang.",
      feat3Title: "Global Kanal Auditi & VPH",
      feat3Desc: "Dunyodagi istalgan YouTube kanalini qidiring va soatiga ko'rishlar (VPH) tezligi hamda SEO holatini tekshiring.",
      feat4Title: "AI Virusli Teglar Generator",
      feat4Desc: "Eng yuqori qidiruv hajmiga ega va past raqobatli kalit so'zlarni topib, videongizni qidiruv natijalarida 1-o'ringa olib chiqing.",
      feat5Title: "Optimal Joylash Vaqti",
      feat5Desc: "Auditoriyangiz faol bo'lgan aniq soatlarni aniqlab, video chiqqan dastlabki 2 soatda maksimal oqim yig'ing.",
      feat6Title: "Telegram Bot Hamrohi",
      feat6Desc: "Kompyutersiz ham barcha izohlarni boshqaring, audit o'tkazing va YouTube bo'yicha maslahatlar oling.",
      readyTitle: "YouTube'da yangi darajaga chiqishga tayyormisiz?",
      readyDesc: "Hech qanday murakkab sozlamalarsiz kanalingizni ulang va hoziroq real natijalarga erishing.",
      startFree: "Hoziroq Boshlash (Bepul)",
      privacy: "Maxfiylik Siyosati",
      terms: "Foydalanish Shartlari",
      rights: "Barcha huquqlar himoyalangan."
    },
    ru: {
      badge: "ИИ-платформа нового поколения для YouTube",
      heroTitle1: "Масштабируйте Свой YouTube",
      heroTitleGradient: "С Помощью ИИ",
      heroTitle2: "В 10 Раз Быстрее",
      heroSubtitle: "Реальная аналитика YouTube Studio, диагностика CTR обложек через Gemini Vision, автопилот комментариев и 24/7 Telegram компаньон.",
      ctaStart: "Открыть Панель Управления",
      ctaPricing: "Тарифы и Планы",
      stats1Val: "10x",
      stats1Lab: "Ускорение Роста Канала",
      stats2Val: "85%+",
      stats2Lab: "Точность Прогноза CTR",
      stats3Val: "24/7",
      stats3Lab: "Автопилот в Telegram",
      featuresTitle: "Все инструменты для профессионального ютубера",
      featuresSubtitle: "Продвигайте свои видео в тренды и рекомендации с помощью передового искусственного интеллекта:",
      feat1Title: "Gemini Vision Анализ CTR",
      feat1Desc: "Загрузите обложку: нейросеть оценит контраст, читаемость на смартфонах и точный потенциал кликабельности (CTR).",
      feat2Title: "Мультиязычный Копилот Ответов",
      feat2Desc: "ИИ понимает любой язык зрителя и генерирует живой авторский ответ с подтверждением в Telegram в 1 клик.",
      feat3Title: "Глобальный Аудит Каналов & VPH",
      feat3Desc: "Анализируйте любой канал в мире, отслеживайте скорость просмотров в час (VPH) и алгоритмический потенциал.",
      feat4Title: "Генератор Вирусных Тегов",
      feat4Desc: "Находите высокочастотные поисковые фразы с низкой конкуренцией для вывода видео в топ поиска YouTube.",
      feat5Title: "Тепловая Карта Публикаций",
      feat5Desc: "Узнайте лучшее время для публикации роликов, чтобы максимизировать вовлеченность первых 24 часов.",
      feat6Title: "Telegram Бот-Ассистент",
      feat6Desc: "Управляйте каналом прямо со смартфона: получайте отчеты, одобряйте комментарии и анализируйте видео.",
      readyTitle: "Готовы масштабировать свой YouTube канал?",
      readyDesc: "Подключите канал в 1 клик и используйте алгоритмическую мощь TubePilot AI прямо сейчас.",
      startFree: "Начать Бесплатно",
      privacy: "Политика Конфиденциальности",
      terms: "Условия Использования",
      rights: "Все права защищены."
    },
    en: {
      badge: "The Definitive YouTube Growth Intelligence Suite",
      heroTitle1: "Scale Your YouTube Channel",
      heroTitleGradient: "With Multimodal AI",
      heroTitle2: "10x Faster",
      heroSubtitle: "Authentic YouTube Studio intelligence, Gemini Multimodal CTR diagnostics, multilingual comment autopilot, and 24/7 Telegram companion.",
      ctaStart: "Launch Creator Dashboard",
      ctaPricing: "Explore Pricing & Plans",
      stats1Val: "10x",
      stats1Lab: "Channel Growth Velocity",
      stats2Val: "85%+",
      stats2Lab: "Predictive CTR Accuracy",
      stats3Val: "24/7",
      stats3Lab: "Telegram Autonomous Bot",
      featuresTitle: "Engineered for Serious YouTube Creators",
      featuresSubtitle: "Everything you need to dominate the YouTube algorithm and capture browse features:",
      feat1Title: "Gemini Vision CTR Diagnosis",
      feat1Desc: "Analyze visual contrast, mobile viewport readability, and predict real CTR scores before publishing.",
      feat2Title: "Multilingual Comment Copilot",
      feat2Desc: "Craft authentic creator replies in any language. Approve in 1-tap via Telegram companion.",
      feat3Title: "Global Channel Audit & VPH",
      feat3Desc: "Inspect any YouTube channel worldwide, track Views Per Hour (VPH) velocity, and algorithmic factors.",
      feat4Title: "AI Viral Tag Generator",
      feat4Desc: "Discover high-volume, low-competition tags that position your videos at the top of search queries.",
      feat5Title: "Optimal Posting Heatmap",
      feat5Desc: "Pinpoint the exact hours your target audience is most active to maximize initial 24-hour momentum.",
      feat6Title: "Telegram Bot Companion",
      feat6Desc: "Perform visual thumbnail checks, review audience engagement, and get strategic guidance 24/7.",
      readyTitle: "Ready to dominate YouTube recommendations?",
      readyDesc: "Connect your channel with zero friction and unlock full multimodal growth power today.",
      startFree: "Get Started Free",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      rights: "All rights reserved."
    }
  }[locale as 'uz' | 'ru' | 'en'] || {
    badge: "YouTube Uchun Maxsus AI Suite",
    heroTitle1: "YouTube Kanalingizni",
    heroTitleGradient: "Sun'iy Intellekt",
    heroTitle2: "Bilan 10 Barobarga O'stiring",
    heroSubtitle: "Haqiqiy YouTube Studio tahlillari, Gemini Vision orqali muqova (CTR) baholash, ko'p tilli izohlar kopiloti va 24/7 Telegram yordamchisi.",
    ctaStart: "Boshqaruv Paneliga O'tish",
    ctaPricing: "Tariflar va Rejalar",
    stats1Val: "10x",
    stats1Lab: "Tezkor O'sish Sur'ati",
    stats2Val: "85%+",
    stats2Lab: "Haqiqiy CTR Aniqligi",
    stats3Val: "24/7",
    stats3Lab: "Telegram Avtopilot",
    featuresTitle: "Kreatorlar Uchun Barcha Qurollar Bir Joyda",
    featuresSubtitle: "YouTube algoritmlarini zabt etish va videolaringizni tavsiyalarga olib chiqish uchun zamonaviy instrumentlar:",
    feat1Title: "Gemini Vision CTR Tahlili",
    feat1Desc: "Muqovani yuklang: AI ranglar kontrasti, mobil ekranda ko'rinishi va kutilayotgan CTR foizini soniyalarda aniqlaydi.",
    feat2Title: "Ko'p Tilli Izohlar Kopiloti",
    feat2Desc: "Tomoshabin qaysi tilda yozsa, AI o'sha tilda muallif ohangida samimiy javob tayyorlaydi. Telegramda 1-bosishda tasdiqlang.",
    feat3Title: "Global Kanal Auditi & VPH",
    feat3Desc: "Dunyodagi istalgan YouTube kanalini qidiring va soatiga ko'rishlar (VPH) tezligi hamda SEO holatini tekshiring.",
    feat4Title: "AI Virusli Teglar Generator",
    feat4Desc: "Eng yuqori qidiruv hajmiga ega va past raqobatli kalit so'zlarni topib, videongizni qidiruv natijalarida 1-o'ringa olib chiqing.",
    feat5Title: "Optimal Joylash Vaqti",
    feat5Desc: "Auditoriyangiz faol bo'lgan aniq soatlarni aniqlab, video chiqqan dastlabki 2 soatda maksimal oqim yig'ing.",
    feat6Title: "Telegram Bot Hamrohi",
    feat6Desc: "Kompyutersiz ham barcha izohlarni boshqaring, audit o'tkazing va YouTube bo'yicha maslahatlar oling.",
    readyTitle: "YouTube'da yangi darajaga chiqishga tayyormisiz?",
    readyDesc: "Hech qanday murakkab sozlamalarsiz kanalingizni ulang va hoziroq real natijalarga erishing.",
    startFree: "Hoziroq Boshlash (Bepul)",
    privacy: "Maxfiylik Siyosati",
    terms: "Foydalanish Shartlari",
    rights: "Barcha huquqlar himoyalangan."
  };

  const features = [
    {
      icon: Eye,
      title: tLanding.feat1Title,
      desc: tLanding.feat1Desc,
      gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
      iconColor: "text-amber-400",
      borderColor: "border-amber-500/30"
    },
    {
      icon: MessageSquare,
      title: tLanding.feat2Title,
      desc: tLanding.feat2Desc,
      gradient: "from-sky-500/20 via-blue-500/10 to-transparent",
      iconColor: "text-sky-400",
      borderColor: "border-sky-500/30"
    },
    {
      icon: BarChart3,
      title: tLanding.feat3Title,
      desc: tLanding.feat3Desc,
      gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
      iconColor: "text-emerald-400",
      borderColor: "border-emerald-500/30"
    },
    {
      icon: Search,
      title: tLanding.feat4Title,
      desc: tLanding.feat4Desc,
      gradient: "from-purple-500/20 via-indigo-500/10 to-transparent",
      iconColor: "text-purple-400",
      borderColor: "border-purple-500/30"
    },
    {
      icon: Flame,
      title: tLanding.feat5Title,
      desc: tLanding.feat5Desc,
      gradient: "from-rose-500/20 via-red-500/10 to-transparent",
      iconColor: "text-rose-400",
      borderColor: "border-rose-500/30"
    },
    {
      icon: Bot,
      title: tLanding.feat6Title,
      desc: tLanding.feat6Desc,
      gradient: "from-malla-500/20 via-amber-500/10 to-transparent",
      iconColor: "text-malla-400",
      borderColor: "border-malla-500/30"
    }
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-white relative overflow-hidden font-sans selection:bg-malla-500 selection:text-white">
      <AmbientBackgroundMesh />

      {/* Navigation Header */}
      <header className="relative z-30 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-dark-800/80">
        <Link href={`/${locale}`} className="flex items-center gap-2 group">
          <TubePilotLogo size="md" showText={true} />
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href={`/${locale}/pricing`}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-white px-3.5 py-2 rounded-xl hover:bg-dark-800 transition-all"
          >
            <Crown className="w-4 h-4 text-malla-400" />
            <span>{tLanding.ctaPricing}</span>
          </Link>

          <LocaleSwitcher />

          <Link
            href={`/${locale}/dashboard`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-malla-600 via-amber-600 to-malla-500 hover:from-malla-500 hover:to-amber-500 text-white text-xs sm:text-sm font-extrabold transition-all shadow-lg shadow-malla-950/60 hover:scale-105 active:scale-95 border border-malla-400/40"
          >
            <span>{tLanding.ctaStart}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 pt-16 sm:pt-24 pb-16 text-center">
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800/90 border border-malla-500/30 text-malla-300 text-xs sm:text-sm font-extrabold mb-8 shadow-xl shadow-malla-950/30 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-malla-400 animate-pulse" />
          <span>{tLanding.badge}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.15]">
          {tLanding.heroTitle1}{' '}
          <span className="bg-gradient-to-r from-malla-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
            {tLanding.heroTitleGradient}
          </span>{' '}
          {tLanding.heroTitle2}
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          {tLanding.heroSubtitle}
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={`/${locale}/dashboard`}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-malla-600 via-amber-600 to-malla-500 hover:from-malla-500 hover:to-amber-500 text-white font-black text-base sm:text-lg transition-all shadow-2xl shadow-malla-950/80 hover:shadow-malla-900/90 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 border border-malla-400/50"
          >
            <Youtube className="w-6 h-6 fill-white" />
            <span>{tLanding.ctaStart}</span>
            <ChevronRight className="w-5 h-5" />
          </Link>

          <Link
            href={`/${locale}/pricing`}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-dark-800/80 hover:bg-dark-750 text-gray-200 hover:text-white font-bold text-base transition-all border border-dark-700 hover:border-malla-500/40 flex items-center justify-center gap-2"
          >
            <Crown className="w-5 h-5 text-malla-400" />
            <span>{tLanding.ctaPricing}</span>
          </Link>
        </div>

        {/* Live Metrics Proof */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="p-6 rounded-3xl bg-dark-850/80 border border-dark-750 backdrop-blur-md shadow-xl">
            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-malla-400 to-amber-300 bg-clip-text text-transparent">
              {tLanding.stats1Val}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-gray-400 mt-1">{tLanding.stats1Lab}</div>
          </div>

          <div className="p-6 rounded-3xl bg-dark-850/80 border border-dark-750 backdrop-blur-md shadow-xl">
            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              {tLanding.stats2Val}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-gray-400 mt-1">{tLanding.stats2Lab}</div>
          </div>

          <div className="p-6 rounded-3xl bg-dark-850/80 border border-dark-750 backdrop-blur-md shadow-xl">
            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-sky-400 to-blue-300 bg-clip-text text-transparent">
              {tLanding.stats3Val}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-gray-400 mt-1">{tLanding.stats3Lab}</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {tLanding.featuresTitle}
          </h2>
          <p className="mt-4 text-base text-gray-400 leading-relaxed">
            {tLanding.featuresSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className={`p-8 rounded-3xl bg-gradient-to-b ${feat.gradient} bg-dark-850/90 border ${feat.borderColor} hover:border-malla-400/50 transition-all duration-300 hover:-translate-y-1 shadow-xl relative overflow-hidden group`}
              >
                <div className="w-14 h-14 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                  <Icon className={`w-7 h-7 ${feat.iconColor}`} />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-2.5">
                  {feat.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Direct Call to Action Footer Section */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 py-16">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-malla-600/30 via-dark-800 to-amber-600/20 border border-malla-500/40 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-80 h-80 bg-malla-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              {tLanding.readyTitle}
            </h2>
            <p className="text-base text-gray-300">
              {tLanding.readyDesc}
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/${locale}/dashboard`}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-malla-600 via-amber-600 to-malla-500 hover:from-malla-500 hover:to-amber-500 text-white font-black text-base transition-all shadow-xl shadow-malla-950/70 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <Youtube className="w-5 h-5 fill-white" />
                <span>{tLanding.startFree}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 max-w-7xl mx-auto px-6 py-8 border-t border-dark-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <TubePilotLogo size="sm" showText={true} />
          <span>· © {new Date().getFullYear()} {tLanding.rights}</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href={`/${locale}/privacy`} className="hover:text-gray-300 transition-colors">
            {tLanding.privacy}
          </Link>
          <Link href={`/${locale}/pricing`} className="hover:text-gray-300 transition-colors">
            {tLanding.ctaPricing}
          </Link>
          <Link href={`/${locale}/dashboard`} className="text-malla-400 font-bold hover:text-malla-300 transition-colors">
            TubePilot Studio
          </Link>
        </div>
      </footer>
    </div>
  );
}
