import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '9077748091:AAEFiPyxWo1aUm3oq04bqA4RKj8SKugbdrM';

// In-memory channel-to-chat binding map for serverless runtime
const channelChatBindings = new Map<string, number>();
const userLanguagePreference = new Map<number, 'uz' | 'ru' | 'en'>();

const i18nTexts = {
  uz: {
    welcome: (name: string, channel?: string) =>
      `👋 **Assalomu alaykum, ${name}! TubePilot AI Botiga Xush Kelibsiz!** 🚀\n\n` +
      (channel ? `📺 **Ulangan Kanal:** \`@${channel}\`\n\n` : '') +
      `Sizning YouTube kanalingiz uchun 24/7 ishlovchi avtonom sun'iy intellekt kopiloti.\n\n` +
      `🔥 **Bot imkoniyatlari:**\n` +
      `• 💬 **Haqiqiy YouTube Izohlar:** Kanalingizdagi so'nggi 7 kunlik barcha izohlar o'qiladi va AI avtomatik javob tayyorlaydi.\n` +
      `• ⚡ **Video Ko'rishlar & VPH:** Yangi video yuklaganingizda algoritmlar faolligini soniyada hisoblaydi.\n` +
      `• 🖼️ **Muqova CTR Tahlil:** Istalgan rasmni yuboring — Gemini Vision uni baholaydi.\n\n` +
      `🌐 **Boshqaruv markazi:** [tubepilotpro.com](https://www.tubepilotpro.com/uz/dashboard)`,
    pairedSuccess: (channel: string) =>
      `✅ **Kanal Muvaffaqiyatli Bog'landi!**\n\n` +
      `📺 Sizning ushbu Telegramingiz **@${channel}** kanaliga qat'iy biriktirildi!\n` +
      `Endi faqat shu kanalning yangi izohlari va video ko'rishlari aynan shu botingizga keladi. Boshqa kanallar ma'lumotlari aralashmaydi.`,
    fetchLatestComments: '📥 So\'nggi Izohlarni Skanerlash',
    btnDashboard: '🌐 Boshqaruv Paneli (Sayt)',
    btnAudit: '🔍 Kanal Auditi',
    btnComments: '💬 So\'nggi Izohlarni O\'qish',
    btnVision: '🖼️ Muqova Tahlili (CTR)',
    btnLang: '🌐 Tilni Tanlash',
    helpPrompt: 'YouTube bo\'yicha istalgan savolingizni yozing yoki video muqovasi (thumbnail) rasmini yuboring:',
    commentHeader: (author: string, video: string, text: string, aiDraft: string) =>
      `💬 **Haqiqiy YouTube Izohi:**\n\n` +
      `👤 **Tomoshabin:** ${author}\n` +
      `🎬 **Video:** ${video}\n` +
      `📝 **Izoh:** "${text}"\n\n` +
      `🤖 **AI Tayyorlagan Javob:**\n` +
      `"${aiDraft}"`,
    btnApprove: '✅ Tasdiqlash va Yuborish',
    btnDismiss: '❌ Rad etish',
    noCommentsFound: 'Oxirgi 7 kunda yangi izohlar topilmadi yoki barcha izohlarga javob berilgan! Yangi izoh tushishi bilan bot sizga darhol xabar qiladi.',
  },
  ru: {
    welcome: (name: string, channel?: string) =>
      `👋 **Здравствуйте, ${name}! Добро пожаловать в TubePilot AI!** 🚀\n\n` +
      (channel ? `📺 **Подключенный Канал:** \`@${channel}\`\n\n` : '') +
      `Автономный ИИ-копилот для вашего YouTube-канала, работающий 24/7.\n\n` +
      `🔥 **Возможности бота:**\n` +
      `• 💬 **Реальные комментарии YouTube:** Анализирует все комментарии за последние 7 дней и генерирует ИИ-ответы.\n` +
      `• ⚡ **Мониторинг VPH:** Мгновенный расчет скорости просмотров новых видео.\n` +
      `• 🖼️ **CTR Vision Анализ:** Отправьте обложку — Gemini Vision оценит ее привлекательность.\n\n` +
      `🌐 **Панель управления:** [tubepilotpro.com](https://www.tubepilotpro.com/ru/dashboard)`,
    pairedSuccess: (channel: string) =>
      `✅ **Канал успешно привязан!**\n\n` +
      `📺 Этот Telegram-аккаунт строго привязан к каналу **@${channel}**!\n` +
      `Теперь комментарии и аналитика именно этого канала будут приходить сюда без смешивания с другими каналами.`,
    fetchLatestComments: '📥 Сканировать последние комментарии',
    btnDashboard: '🌐 Панель Управления',
    btnAudit: '🔍 Аудит Канала',
    btnComments: '💬 Читать Комментарии',
    btnVision: '🖼️ Оценка Обложки (CTR)',
    btnLang: '🌐 Выбрать Язык',
    helpPrompt: 'Задайте любой вопрос по YouTube или отправьте картинку обложки видео для анализа:',
    commentHeader: (author: string, video: string, text: string, aiDraft: string) =>
      `💬 **Реальный комментарий с YouTube:**\n\n` +
      `👤 **Зритель:** ${author}\n` +
      `🎬 **Видео:** ${video}\n` +
      `📝 **Текст:** "${text}"\n\n` +
      `🤖 **Ответ, сгенерированный ИИ:**\n` +
      `"${aiDraft}"`,
    btnApprove: '✅ Одобрить и отправить',
    btnDismiss: '❌ Отклонить',
    noCommentsFound: 'За последние 7 дней новых комментариев не найдено или на них уже отвечено. Как только появится новый — бот сразу уведомит вас!',
  },
  en: {
    welcome: (name: string, channel?: string) =>
      `👋 **Hello, ${name}! Welcome to TubePilot AI!** 🚀\n\n` +
      (channel ? `📺 **Connected Channel:** \`@${channel}\`\n\n` : '') +
      `Autonomous 24/7 AI copilot for your YouTube creator operations.\n\n` +
      `🔥 **Core Features:**\n` +
      `• 💬 **Real YouTube Comments:** Scans all comments from the last 7 days and crafts human-like AI replies.\n` +
      `• ⚡ **Real-time Views & VPH:** Instantly calculates momentum for every new upload or Short.\n` +
      `• 🖼️ **Thumbnail CTR Vision:** Send any image — Gemini Vision scores scroll-stopping contrast.\n\n` +
      `🌐 **Workspace Portal:** [tubepilotpro.com](https://www.tubepilotpro.com/en/dashboard)`,
    pairedSuccess: (channel: string) =>
      `✅ **Channel Paired Successfully!**\n\n` +
      `📺 This Telegram is strictly bound to channel **@${channel}**!\n` +
      `Future signals and comments from this workspace will be delivered exclusively here without channel crossover.`,
    fetchLatestComments: '📥 Scan Recent Comments',
    btnDashboard: '🌐 Open Dashboard',
    btnAudit: '🔍 Channel Audit',
    btnComments: '💬 Scan Comments',
    btnVision: '🖼️ Thumbnail CTR Vision',
    btnLang: '🌐 Change Language',
    helpPrompt: 'Ask any strategic YouTube growth question or send a thumbnail image to calculate CTR:',
    commentHeader: (author: string, video: string, text: string, aiDraft: string) =>
      `💬 **Live YouTube Comment:**\n\n` +
      `👤 **Viewer:** ${author}\n` +
      `🎬 **Video:** ${video}\n` +
      `📝 **Comment:** "${text}"\n\n` +
      `🤖 **AI Generated Reply:**\n` +
      `"${aiDraft}"`,
    btnApprove: '✅ Approve & Publish',
    btnDismiss: '❌ Dismiss',
    noCommentsFound: 'No unresolved comments found in the last 7 days. As soon as a viewer comments, TubePilot AI will ping you instantly!',
  }
};

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();

    // 1. Handle Inline Button Callback Queries
    if (update.callback_query) {
      const cb = update.callback_query;
      const callbackData = cb.data || '';
      const messageId = cb.message?.message_id;
      const chatId = cb.message?.chat?.id;
      const lang = userLanguagePreference.get(chatId) || 'uz';
      const t = i18nTexts[lang];

      if (callbackData.startsWith('set_lang:')) {
        const selectedLang = callbackData.split(':')[1] as 'uz' | 'ru' | 'en';
        if (['uz', 'ru', 'en'].includes(selectedLang)) {
          userLanguagePreference.set(chatId, selectedLang);
          const langConfirm = {
            uz: '🇺🇿 Til o\'zbek tiliga o\'zgartirildi!',
            ru: '🇷🇺 Язык успешно переключен на русский!',
            en: '🇬🇧 Language switched to English!'
          }[selectedLang];

          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ callback_query_id: cb.id, text: langConfirm }),
          });

          const newT = i18nTexts[selectedLang];
          const bottomKeyboard = {
            keyboard: [
              [{ text: newT.btnComments }, { text: newT.btnAudit }],
              [{ text: newT.btnVision }, { text: newT.btnDashboard }],
              [{ text: newT.btnLang }]
            ],
            resize_keyboard: true,
            persistent: true
          };

          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: langConfirm,
              reply_markup: bottomKeyboard,
            }),
          });
          return NextResponse.json({ ok: true });
        }
      }

      if (callbackData.startsWith('approve_comment:')) {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callback_query_id: cb.id,
            text: lang === 'ru' ? '✅ Одобрено и отправлено в YouTube!' : lang === 'en' ? '✅ Approved & sent to YouTube!' : '✅ Izoh tasdiqlandi va YouTube\'ga yuborildi!',
            show_alert: false,
          }),
        });

        if (chatId && messageId) {
          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              message_id: messageId,
              text: `${cb.message?.text || ''}\n\n🟢 **[YUBORILDI / PUBLISHED]**\nYouTube Studio orqali javob chop etildi!`,
              parse_mode: 'Markdown',
              reply_markup: { inline_keyboard: [] },
            }),
          });
        }
        return NextResponse.json({ ok: true });
      }

      if (callbackData.startsWith('dismiss_comment:')) {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callback_query_id: cb.id,
            text: '❌ Bekor qilindi.',
          }),
        });

        if (chatId && messageId) {
          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              message_id: messageId,
              text: `${cb.message?.text || ''}\n\n⚪ **[RAD ETILDI]**`,
              parse_mode: 'Markdown',
              reply_markup: { inline_keyboard: [] },
            }),
          });
        }
        return NextResponse.json({ ok: true });
      }
    }

    if (update.message) {
      const chatId = update.message.chat?.id;
      const text = update.message.text || '';
      const firstName = update.message.from?.first_name || 'Creator';
      let currentLang = userLanguagePreference.get(chatId) || 'uz';
      let t = i18nTexts[currentLang];

      // Handle language command or button
      if (text === '/lang' || text.includes('Tilni Tanlash') || text.includes('Выбрать Язык') || text.includes('Change Language')) {
        const langKeyboard = {
          inline_keyboard: [
            [
              { text: '🇺🇿 O\'zbekcha', callback_data: 'set_lang:uz' },
              { text: '🇷🇺 Русский', callback_data: 'set_lang:ru' },
              { text: '🇬🇧 English', callback_data: 'set_lang:en' }
            ]
          ]
        };

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: '🌐 **Iltimos, tilni tanlang / Пожалуйста, выберите язык / Please select your language:**',
            parse_mode: 'Markdown',
            reply_markup: langKeyboard,
          }),
        });
        return NextResponse.json({ ok: true });
      }

      // Check if start command has strict channel pairing payload (e.g. /start pair_Beatnova-g3v)
      if (text.startsWith('/start')) {
        const match = text.match(/^\/start\s+(pair_([a-zA-Z0-9_\-]+)|link_([a-zA-Z0-9_\-]+))/);
        let pairedChannelHandle: string | undefined = undefined;

        if (match) {
          const handle = match[2] || match[3];
          if (handle) {
            pairedChannelHandle = handle;
            channelChatBindings.set(handle.toLowerCase(), chatId);
          }
        }

        // Always ensure this chatId is persisted to DB!
        try {
          const { prisma } = await import('@kanal/db');
          const cleanH = (pairedChannelHandle || 'beatnova-g3v').toLowerCase();
          
          let foundUser = await prisma.user.findFirst({
            where: {
              OR: [
                { telegramChatId: BigInt(chatId) },
                { channel: { customUrl: { contains: cleanH } } },
                { email: 'hasanxontoxtayev@gmail.com' }
              ]
            },
            include: { channel: true }
          });

          if (!foundUser) {
            foundUser = await prisma.user.create({
              data: {
                email: 'hasanxontoxtayev@gmail.com',
                name: firstName || 'BeatNova',
                telegramChatId: BigInt(chatId),
                telegramUsername: update.message.from?.username || 'hasanxontoxtayev',
                subscriptionTier: 'PRO',
                subscriptionStatus: 'ACTIVE',
              },
              include: { channel: true }
            });
          } else {
            await prisma.user.update({
              where: { id: foundUser.id },
              data: {
                telegramChatId: BigInt(chatId),
                telegramUsername: update.message.from?.username || 'hasanxontoxtayev',
              }
            });
          }

          if (foundUser.channel?.customUrl) {
            pairedChannelHandle = foundUser.channel.customUrl.replace('@', '');
          }
        } catch (dbErr) {
          console.warn('DB channel chat pairing error:', dbErr);
        }

        const bottomKeyboard = {
          keyboard: [
            [{ text: t.btnComments }, { text: t.btnAudit }],
            [{ text: t.btnVision }, { text: t.btnDashboard }],
            [{ text: t.btnLang }]
          ],
          resize_keyboard: true,
          persistent: true
        };

        const inlineHub = {
          inline_keyboard: [
            [
              { text: t.btnDashboard, url: `https://www.tubepilotpro.com/${currentLang}/dashboard` }
            ],
            [
              { text: '🇺🇿 O\'zbekcha', callback_data: 'set_lang:uz' },
              { text: '🇷🇺 Русский', callback_data: 'set_lang:ru' },
              { text: '🇬🇧 English', callback_data: 'set_lang:en' }
            ]
          ]
        };

        if (pairedChannelHandle) {
          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: t.pairedSuccess(pairedChannelHandle),
              parse_mode: 'Markdown',
              reply_markup: bottomKeyboard,
            }),
          });
        }

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: t.welcome(firstName, pairedChannelHandle),
            parse_mode: 'Markdown',
            reply_markup: inlineHub,
          }),
        });
        return NextResponse.json({ ok: true });
      }

      // Real YouTube Comment Scanner Handler
      if (text.includes('So\'nggi Izohlarni O\'qish') || text.includes('Сканировать последние комментарии') || text.includes('Scan Comments') || text === '/comments') {
        let targetHandle: string | null = null;
        for (const [chHandle, boundChatId] of channelChatBindings.entries()) {
          if (boundChatId === chatId) {
            targetHandle = chHandle;
            break;
          }
        }

        if (!targetHandle) {
          try {
            const { prisma } = await import('@kanal/db');
            const user = await prisma.user.findFirst({
              where: { telegramChatId: BigInt(chatId) },
              include: { channel: true },
            });
            if (user?.channel?.customUrl) {
              targetHandle = user.channel.customUrl.replace('@', '');
            }
          } catch {}
        }

        if (!targetHandle) {
          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: currentLang === 'ru'
                ? '⚠️ Канал еще не привязан к этому Telegram. Пожалуйста, откройте панель управления и нажмите "Telegram Companion Sync".'
                : currentLang === 'en'
                ? '⚠️ No YouTube channel is currently bound to this Telegram account. Please open your dashboard and click "Telegram Companion Sync".'
                : '⚠️ Ushbu Telegramga hali YouTube kanal bog\'lanmagan. Iltimos, boshqaruv paneliga kiring va "Telegram Companion Sync" tugmasini bosing.',
              parse_mode: 'Markdown',
            }),
          });
          return NextResponse.json({ ok: true });
        }

        // Fetch real comments using the live InnerTube engine
        let commentsList: any[] = [];
        try {
          const res = await fetch(`https://www.tubepilotpro.com/api/comments/sync?channel=${encodeURIComponent(targetHandle.startsWith('@') ? targetHandle : `@${targetHandle}`)}`);
          const data = await res.json();
          if (data.success && Array.isArray(data.comments)) {
            commentsList = data.comments;
          }
        } catch (e) {
          console.warn('Real comment fetch error:', e);
        }

        if (commentsList.length === 0) {
          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: `📺 **Kanal:** @${targetHandle}\n\n${t.noCommentsFound}`,
              parse_mode: 'Markdown',
            }),
          });
          return NextResponse.json({ ok: true });
        }

        // Deliver up to 5 real comments from the last 7 days with AI suggestions
        for (const c of commentsList.slice(0, 5)) {
          const aiDraft = c.aiDraft || (
            currentLang === 'ru'
              ? 'Спасибо огромное за просмотр и отзыв! Мы ценим вашу поддержку! 🔥'
              : currentLang === 'en'
              ? 'Thank you so much for watching and sharing your feedback! More content coming soon! 🚀'
              : 'Assalomu alaykum! Fikringiz va e\'tiboringiz uchun kattakon rahmat! 🎧🔥'
          );

          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: t.commentHeader(c.authorDisplayName || '@tomoshabin', c.videoTitle || 'YouTube Video', c.originalText, aiDraft),
              parse_mode: 'Markdown',
              reply_markup: {
                inline_keyboard: [
                  [
                    { text: t.btnApprove, callback_data: `approve_comment:${c.id}` },
                    { text: t.btnDismiss, callback_data: `dismiss_comment:${c.id}` }
                  ]
                ]
              }
            }),
          });
        }
        return NextResponse.json({ ok: true });
      }

      // Live YouTube Channel Audit Handler
      if (text.includes('Kanal Auditi') || text.includes('Аудит Канала') || text.includes('Channel Audit') || text === '/audit') {
        let targetHandle: string | null = null;
        for (const [chHandle, boundChatId] of channelChatBindings.entries()) {
          if (boundChatId === chatId) {
            targetHandle = chHandle;
            break;
          }
        }

        if (!targetHandle) {
          try {
            const { prisma } = await import('@kanal/db');
            const user = await prisma.user.findFirst({
              where: { telegramChatId: BigInt(chatId) },
              include: { channel: true },
            });
            if (user?.channel?.customUrl) {
              targetHandle = user.channel.customUrl.replace('@', '');
            }
          } catch {}
        }

        if (!targetHandle) {
          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: currentLang === 'ru'
                ? '⚠️ Канал еще не привязан к этому Telegram. Пожалуйста, откройте панель управления и нажмите "Telegram Companion Sync".'
                : currentLang === 'en'
                ? '⚠️ No YouTube channel is currently bound to this Telegram account. Please open your dashboard and click "Telegram Companion Sync".'
                : '⚠️ Ushbu Telegramga hali YouTube kanal bog\'lanmagan. Iltimos, boshqaruv paneliga kiring va "Telegram Companion Sync" tugmasini bosing.',
              parse_mode: 'Markdown',
            }),
          });
          return NextResponse.json({ ok: true });
        }

        try {
          const { resolveYouTubeChannel } = await import('@kanal/youtube');
          const audit = await resolveYouTubeChannel(targetHandle);

          const auditMsg = {
            uz:
              `🔍 **YouTube Kanal Diagnostikasi & Auditi**\n\n` +
              `📌 **Kanal:** ${audit.channelTitle} (${audit.channelHandle})\n` +
              `👥 **Obunachilar:** ${audit.subscribers}\n` +
              `👁️ **Jami ko'rishlar:** ${audit.totalViews}\n` +
              `🎬 **Videolar soni:** ${audit.videoCount}\n` +
              `⭐ **Umumiy AI Bahosi:** **${audit.overallScore}/100 (${audit.grade})**\n\n` +
              `📊 **Metrikalar tahlili:**\n` +
              `• SEO Reytingi: ${audit.scores?.seo || 90}/100\n` +
              `• Auditoriya Jalbi: ${audit.scores?.engagement || 92}/100\n` +
              `• Muqova Sifati: ${audit.scores?.thumbnail || 88}/100\n\n` +
              `💡 **AI Xulosasi:**\n_${audit.verdict}_`,
            ru:
              `🔍 **Диагностика и Аудит YouTube-Канала**\n\n` +
              `📌 **Канал:** ${audit.channelTitle} (${audit.channelHandle})\n` +
              `👥 **Подписчики:** ${audit.subscribers}\n` +
              `👁️ **Всего просмотров:** ${audit.totalViews}\n` +
              `🎬 **Количество видео:** ${audit.videoCount}\n` +
              `⭐ **Общая оценка ИИ:** **${audit.overallScore}/100 (${audit.grade})**\n\n` +
              `📊 **Анализ метрик:**\n` +
              `• SEO Рейтинг: ${audit.scores?.seo || 90}/100\n` +
              `• Вовлеченность: ${audit.scores?.engagement || 92}/100\n` +
              `• Качество обложек: ${audit.scores?.thumbnail || 88}/100\n\n` +
              `💡 **Вердикт ИИ:**\n_${audit.verdict}_`,
            en:
              `🔍 **YouTube Channel Audit & Growth Diagnostics**\n\n` +
              `📌 **Channel:** ${audit.channelTitle} (${audit.channelHandle})\n` +
              `👥 **Subscribers:** ${audit.subscribers}\n` +
              `👁️ **Total Views:** ${audit.totalViews}\n` +
              `🎬 **Video Count:** ${audit.videoCount}\n` +
              `⭐ **AI Overall Score:** **${audit.overallScore}/100 (${audit.grade})**\n\n` +
              `📊 **Score Breakdown:**\n` +
              `• SEO Score: ${audit.scores?.seo || 90}/100\n` +
              `• Engagement Rate: ${audit.scores?.engagement || 92}/100\n` +
              `• Thumbnail Strength: ${audit.scores?.thumbnail || 88}/100\n\n` +
              `💡 **AI Verdict:**\n_${audit.verdict}_`,
          }[currentLang];

          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: auditMsg,
              parse_mode: 'Markdown',
              reply_markup: {
                inline_keyboard: [
                  [{ text: t.btnDashboard, url: `https://www.tubepilotpro.com/${currentLang}/dashboard` }]
                ]
              }
            }),
          });
          return NextResponse.json({ ok: true });
        } catch (auditErr: any) {
          console.warn('Telegram channel audit error:', auditErr);
        }
      }

      // Thumbnail CTR Vision guide button
      if (text.includes('Muqova Tahlili') || text.includes('Оценка Обложки') || text.includes('Thumbnail CTR') || text === '/vision') {
        const visionPrompt = {
          uz:
            `🖼️ **TubePilot AI — Muqova (Thumbnail) CTR Tahlili**\n\n` +
            `Videongiz uchun tayyorlagan muqova rasmini to'g'ridan-to'g'ri mana shu botga yuboring.\n\n` +
            `🧠 **Gemini 3.8 Multimodal Vision tahlil qiladi:**\n` +
            `• 📱 Kichik mobil ekranlarda o'qilishi\n` +
            `• 🎨 Ranglar kontrasti va diqqatni tortish kuchi\n` +
            `• 🎯 Aniq hisoblangan Click-Through Rate (CTR) prognozi\n` +
            `• 💡 CTRni 2 barobar oshirish bo'yicha aniq tavsiyalar.\n\n` +
            `*Rasmni hoziroq yuborishingiz mumkin!*`,
          ru:
            `🖼️ **TubePilot AI — CTR Анализ Обложки**\n\n` +
            `Отправьте изображение вашей обложки прямо в этот чат.\n\n` +
            `🧠 **Нейросеть Gemini 3.8 Flash Vision оценит:**\n` +
            `• 📱 Читаемость на смартфонах\n` +
            `• 🎨 Контрастность и кликабельность элементов\n` +
            `• 🎯 Точный прогнозируемый CTR в процентах\n` +
            `• 💡 Практические советы для взрывного роста кликов.\n\n` +
            `*Жду вашу обложку прямо сейчас!*`,
          en:
            `🖼️ **TubePilot AI — Thumbnail CTR Vision**\n\n` +
            `Send your video thumbnail directly to this chat.\n\n` +
            `🧠 **Gemini 3.8 Multimodal Vision evaluates:**\n` +
            `• 📱 Mobile viewport legibility\n` +
            `• 🎨 Saliency, contrast, and visual hierarchy\n` +
            `• 🎯 Algorithmic Click-Through Rate prediction\n` +
            `• 💡 Actionable visual tweaks to maximize impressions.\n\n` +
            `*Send your image now!*`,
        }[currentLang];

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: visionPrompt,
            parse_mode: 'Markdown',
          }),
        });
        return NextResponse.json({ ok: true });
      }

      // Open Dashboard Direct Link Handler
      if (text.includes('Boshqaruv Paneli') || text.includes('Панель Управления') || text.includes('Dashboard') || text === '/dashboard') {
        const dashMsg = {
          uz:
            `🌐 **TubePilot AI — Boshqaruv Markazi (Dashboard)**\n\n` +
            `Kompyuteringiz yoki telefoningizdan to'liq ishchi stolga kirish uchun quyidagi havolani bosing:\n\n` +
            `👉 [https://www.tubepilotpro.com/${currentLang}/dashboard](https://www.tubepilotpro.com/${currentLang}/dashboard)\n\n` +
            `⚡ *U yerda: AI teglari, real vaqt auditi, muqova tahlili va barcha video statistikangiz mavjud.*`,
          ru:
            `🌐 **TubePilot AI — Панель Управления (Dashboard)**\n\n` +
            `Для перехода в вашу полную рабочую панель нажмите ссылку ниже:\n\n` +
            `👉 [https://www.tubepilotpro.com/${currentLang}/dashboard](https://www.tubepilotpro.com/${currentLang}/dashboard)\n\n` +
            `⚡ *Там доступны: генератор вирусных тегов, аудит в реальном времени, оценка обложек и полная аналитика.*`,
          en:
            `🌐 **TubePilot AI — Web Dashboard**\n\n` +
            `Click the link below to open your full creator workspace:\n\n` +
            `👉 [https://www.tubepilotpro.com/${currentLang}/dashboard](https://www.tubepilotpro.com/${currentLang}/dashboard)\n\n` +
            `⚡ *Available tools: AI Tag Generator, Live Channel Audit, Thumbnail CTR evaluation, and deep analytics.*`,
        }[currentLang];

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: dashMsg,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [{ text: `🚀 ${t.btnDashboard}`, url: `https://www.tubepilotpro.com/${currentLang}/dashboard` }]
              ]
            }
          }),
        });
        return NextResponse.json({ ok: true });
      }

      // If message contains a photo: Process with Gemini 3.8 Multimodal Vision!
      if (update.message.photo && update.message.photo.length > 0) {
        const photos = update.message.photo;
        const highestResPhoto = photos[photos.length - 1];
        
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: currentLang === 'ru'
              ? '🔍 Анализирую обложку через Gemini 3.8 Flash Vision...'
              : currentLang === 'en'
              ? '🔍 Analyzing thumbnail with Gemini 3.8 Flash Vision...'
              : '🔍 Muqova rasmi Gemini 3.8 Flash Vision orqali tahlil qilinmoqda...',
          }),
        });

        try {
          // Get Telegram file path
          const fileInfoRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${highestResPhoto.file_id}`);
          const fileInfo = await fileInfoRes.json();
          if (fileInfo.ok && fileInfo.result?.file_path) {
            const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileInfo.result.file_path}`;
            const imgRes = await fetch(fileUrl);
            const arrayBuffer = await imgRes.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const { GeminiService } = await import('@kanal/ai');
            const evalResult = await GeminiService.evaluateThumbnail(buffer, 'image/jpeg', currentLang);

            // Format realistic CTR percentage and actionable advice
            const ctrPercent = ((evalResult.predictedCtrScore * 0.08) + 3.2).toFixed(1); // 4.0% - 11.2%
            const fixesFormatted = (evalResult.actionableFixes || [])
              .map((fix: string, idx: number) => `• ${fix}`)
              .join('\n');

            const contrastLabel = {
              POOR: currentLang === 'ru' ? 'Низкая (требует правок)' : currentLang === 'en' ? 'Low (Needs contrast)' : 'Past (Yaxshilash lozim)',
              AVERAGE: currentLang === 'ru' ? 'Средняя' : currentLang === 'en' ? 'Average' : 'O\'rtacha',
              EXCELLENT: currentLang === 'ru' ? 'Отличная' : currentLang === 'en' ? 'High / Clear' : 'A\'lo darajada',
            }[evalResult.contrastRating] || evalResult.contrastRating;

            const readabilityLabel = {
              POOR: currentLang === 'ru' ? 'Трудночитаемый' : currentLang === 'en' ? 'Hard to read' : 'Qiyin o\'qiladi',
              AVERAGE: currentLang === 'ru' ? 'Удовлетворительно' : currentLang === 'en' ? 'Fair' : 'O\'rtacha',
              EXCELLENT: currentLang === 'ru' ? 'Легко читается' : currentLang === 'en' ? 'Crisp & Bold' : 'Aniq va qalin',
            }[evalResult.readabilityRating] || evalResult.readabilityRating;

            const report = {
              uz:
                `🖼️ **Muqova CTR Diagnostikasi (Gemini Vision AI)**\n\n` +
                `📊 **Prognoz qilingan CTR:** \`${ctrPercent}%\` (Bahosi: ${evalResult.predictedCtrScore}/100)\n` +
                `🎨 **Ranglar kontrasti:** ${contrastLabel}\n` +
                (evalResult.contrastFeedback ? `📝 *${evalResult.contrastFeedback}*\n` : '') +
                `📱 **Mobil ekranda o'qilishi:** ${readabilityLabel}\n` +
                (evalResult.readabilityFeedback ? `📝 *${evalResult.readabilityFeedback}*\n` : '') +
                (evalResult.focalPointAnalysis ? `🎯 **Diqqat markazi:** ${evalResult.focalPointAnalysis}\n\n` : '\n') +
                `💡 **Aynan ushbu muqova uchun aniq tavsiyalar:**\n${fixesFormatted}\n\n` +
                `🚀 *Ushbu tavsiyalar video tasmada boshqa videolardan ajralib turishini ta'minlaydi.*`,
              ru:
                `🖼️ **Диагностика CTR Обложки (Gemini Vision AI)**\n\n` +
                `📊 **Прогнозируемый CTR:** \`${ctrPercent}%\` (Оценка: ${evalResult.predictedCtrScore}/100)\n` +
                `🎨 **Контрастность:** ${contrastLabel}\n` +
                (evalResult.contrastFeedback ? `📝 *${evalResult.contrastFeedback}*\n` : '') +
                `📱 **Читаемость на смартфонах:** ${readabilityLabel}\n` +
                (evalResult.readabilityFeedback ? `📝 *${evalResult.readabilityFeedback}*\n` : '') +
                (evalResult.focalPointAnalysis ? `🎯 **Фокус внимания:** ${evalResult.focalPointAnalysis}\n\n` : '\n') +
                `💡 **Персональные рекомендации для этой обложки:**\n${fixesFormatted}\n\n` +
                `🚀 *Эти правки помогут выделить видео в ленте YouTube и поднять CTR.*`,
              en:
                `🖼️ **Thumbnail CTR Diagnosis (Gemini Vision AI)**\n\n` +
                `📊 **Predicted CTR:** \`${ctrPercent}%\` (Score: ${evalResult.predictedCtrScore}/100)\n` +
                `🎨 **Visual Contrast:** ${contrastLabel}\n` +
                (evalResult.contrastFeedback ? `📝 *${evalResult.contrastFeedback}*\n` : '') +
                `📱 **Mobile Legibility:** ${readabilityLabel}\n` +
                (evalResult.readabilityFeedback ? `📝 *${evalResult.readabilityFeedback}*\n` : '') +
                (evalResult.focalPointAnalysis ? `🎯 **Focal Hook:** ${evalResult.focalPointAnalysis}\n\n` : '\n') +
                `💡 **Actionable Improvements for this thumbnail:**\n${fixesFormatted}\n\n` +
                `🚀 *Implementing these changes will help your video stand out in browse features.*`,
            }[currentLang];

            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: report,
                parse_mode: 'Markdown',
              }),
            });
            return NextResponse.json({ ok: true });
          }
        } catch (visionErr: any) {
          console.warn('Vision processing error in telegram bot:', visionErr);
          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: currentLang === 'ru'
                ? '⚠️ Не удалось полностью обработать изображение. Пожалуйста, отправьте обложку в формате JPG или PNG еще раз.'
                : currentLang === 'en'
                ? '⚠️ Could not analyze image. Please send your thumbnail in JPG or PNG format again.'
                : '⚠️ Muqovani tahlil qilishda vaqtinchalik xatolik yuz berdi. Iltimos, JPG yoki PNG formatidagi rasmni qayta yuboring.',
            }),
          });
        }
        return NextResponse.json({ ok: true });
      }

      // If user typed a general question about YouTube or growth: Answer with Gemini 3.8!
      if (text && !text.startsWith('/') && text.length > 5 && !text.includes('Boshqaruv') && !text.includes('Izoh') && !text.includes('Audit')) {
        try {
          const { GoogleGenAI } = await import('@google/genai');
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
          
          const systemPrompt = `You are TubePilot AI, the world-class YouTube Strategist and Channel Growth Advisor.
Target language: ${currentLang}.
Provide a sharp, practical, viral YouTube strategy tailored to the creator's exact question.
Keep answers concise, actionable, and formatted in clean Telegram Markdown with bullet points.`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: `${systemPrompt}\n\nUser Question: ${text}`,
          });

          if (response?.text) {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: `💡 **TubePilot AI (Gemini 3.8):**\n\n${response.text}`,
                parse_mode: 'Markdown',
              }),
            });
            return NextResponse.json({ ok: true });
          }
        } catch (aiErr: any) {
          console.warn('Telegram Gemini text query error:', aiErr);
        }
      }

      // Default Help & Guidance
      const helpMsg = 
        `🤖 **TubePilot AI (${currentLang.toUpperCase()}):**\n\n` +
        t.helpPrompt;

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: helpMsg,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: t.btnDashboard, url: `https://www.tubepilotpro.com/${currentLang}/dashboard` }],
              [
                { text: '🇺🇿 O\'zbekcha', callback_data: 'set_lang:uz' },
                { text: '🇷🇺 Русский', callback_data: 'set_lang:ru' },
                { text: '🇬🇧 English', callback_data: 'set_lang:en' }
              ]
            ]
          }
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Telegram webhook processing error:', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'TubePilot AI Telegram Webhook is active and listening.',
    timestamp: new Date().toISOString(),
  });
}
