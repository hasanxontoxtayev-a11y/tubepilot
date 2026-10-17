import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { commentText, authorName, language = 'uz', channelTitle = 'TubePilot Studio' } = await req.json();

    if (!commentText) {
      return NextResponse.json({ success: false, error: 'commentText is required' }, { status: 400 });
    }

    const name = authorName || 'Do\'stim';
    let draft = '';

    if (language === 'uz') {
      const templates = [
        `Assalomu alaykum ${name}! Fikringiz va iliq so'zlaringiz uchun katta rahmat! Aynan siz aytgan mavzuda yangi video ustida ishlayapmiz, kuzatib boring! 🚀`,
        `Rahmat ${name}! Qiziqishingizdan juda xursandman. Savolingiz bo'yicha tez orada batafsil video-darslik tayyorlaymiz! 👍`,
        `Katta rahmat ${name}! Kanaldagi yangiliklarni o'tkazib yubormaslik uchun qo'ng'iroqchani yoqib qo'ying, oldinda juda qiziq kontent kutmoqda! 🔥`,
      ];
      draft = templates[Math.floor(Math.random() * templates.length)];
    } else if (language === 'ru') {
      const templates = [
        `Привет, ${name}! Огромное спасибо за поддержку и отличный комментарий! Очень рад, что ролик оказался полезным. Скоро выпустим вторую часть! 🚀`,
        `Спасибо за отзыв, ${name}! Отличный вопрос — как раз готовим разбор этой темы в следующем выпуске. Оставайтесь на связи! 👍`,
        `Благодарю, ${name}! Очень ценю обратную связь от аудитории. Не забудьте подписаться с колокольчиком, впереди много крутого контента! 🔥`,
      ];
      draft = templates[Math.floor(Math.random() * templates.length)];
    } else {
      const templates = [
        `Hey ${name}! Thanks so much for watching and for your awesome feedback! We're already working on a follow-up video diving deeper into this topic. Stay tuned! 🚀`,
        `Really appreciate your comment, ${name}! Great question — I'll cover this thoroughly in an upcoming studio breakdown. Thanks for supporting the channel! 👍`,
        `Thanks a lot, ${name}! Your feedback means the world to our team. Make sure notifications are turned on, exciting uploads coming next week! 🔥`,
      ];
      draft = templates[Math.floor(Math.random() * templates.length)];
    }

    return NextResponse.json({
      success: true,
      draftReply: draft,
      language,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
