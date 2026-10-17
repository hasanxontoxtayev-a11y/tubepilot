# Telegram Bot Buyurtma Integratsiyasi: Brainstorm / Discovery Notes
Date: 2026-10-15 · Goal: Saytdagi buyurtma berish formasi orqali tushgan xabarlarni Telegram botga to'g'ridan-to'g'ri yuborish mexanizmini loyihalash va aniqlashtirish.

## Summary / key decisions
- Boshlang'ich niyat: Saytdagi buyurtma formasi to'ldirilganda, buyurtma ma'lumotlari adminning Telegram botiga yoki kanal/guruhiga borib tushishi kerak.
- Bot konfiguratsiyasi: Tayyor Telegram bot mavjud. Bot tokeni va Chat ID xavfsiz holda `.env` (`.env.local`) faylida saqlanadi. Kodlar server tomonlama (Next.js API route) orqali buni qo'llab-quvvatlaydigan qilib yoziladi.
- Buyurtma formati: To'liq batafsil ma'lumotlar (Ism, Telefon raqam, Manzil, Mahsulotlar ro'yxati, o'lchami, rangi, soni, umumiy summasi va to'lov turi).
- Foydalanuvchi ko'p savol berilmasdan darhol to'liq ishga tushirib berilishini so'radi.

## Q&A log
### Q1 — Telegram bot tayyorgarligi va konfiguratsiyasi
- Asked: Telegram bot va qabul qiluvchi Chat ID ma'lumotlaringiz tayyormi?
- Captured: Foydalanuvchida tayyor Telegram bot bor. Token va Chat ID `.env` fayl orqali ulanishi va kodlar shunga moslab yozilishi talab qilindi ("menda tayyor telegram bor uni env fayl orqali ulamoqchiman kodlarni ham shunga moslab yozib ber").
- Flags: Yo'q.

### Q2 — Buyurtma ma'lumotlari tarkibi va amalga oshirish
- Asked: Mijoz buyurtma berganda Telegram botga qanday ma'lumotlar borib tushishi kerak?
- Captured: To'liq va professional format tanlandi. Ko'p savol berilmasdan darhol kod yozib ulab berilishi aytildi ("Ko`p savol berm").
- Flags: Yo'q. Savol-javob bosqichi yakunlanib to'g'ridan-to'g'ri kodlashga o'tildi.

## Open flags (pending input)
