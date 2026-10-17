# Bir sahifali mahsulot veb-sayti: Brainstorm / Discovery Notes
Date: 2026-10-15 · Goal: Bir sahifali mahsulotlar katalogi, sharhlar va murojaat anketasi veb-sayti talablarini aniqlashtirish

## Summary / key decisions
- Biznes sohasi: **FAQAT ERKAKLAR KIYIMLARI (Professional Lookbook Model fotosuratlari)**:
  - Barcha yaqinlashtirilgan yuz (headshot) suratlari chiqarib tashlandi.
  - Har bir rasmda **erkak modelning gavdasi, kiyimning to'liq fasoni, yelkalari, ko'krak va etak qismi (70%-90% kadrni kiyim egallagan holda)** professional katalogdek aniq va ravshan ko'rsatiladi.
- Mahsulot kartochkasi: Kiyim to'liq ko'rinishi uchun foto markazlashtirildi (`object-center`), har bir modelning bo'yi va o'lchami bilan ta'minlandi.
- Brend logotipi joylashuvi: Saytning orqa qismida.
- Sayt umumiy orqa foni: **Jigarrang (Rich Warm Brown / Mocha)**.

## Q&A log
### Q1 — Mahsulotlar bo'limi formati va taqdimoti (~50 ta mahsulot)
- Asked: 50 ga yaqin mahsulot bitta sahifada qanday tuzilishda va formatda taqdim etilishi lozim?
- Captured: Foydalanuvchi "Foydalanuvchilar uchun enga qulay bo`lgan variantni uzing tanlab ber" deb javob berdi. Eng qulay UX qarori qabul qilindi: Kategoriya filtrlari (tabs), tezkor qidiruv, qulay kartalar gridi va mahsulot ustiga bosilganda to'liq ma'lumotni ko'rsatuvchi modal (popup) oyna.
- Flags: Mahsulotlarning aniq sohalari/kategoriyalari ro'yxati va nomlari -> Buyurtmachi/User

### Q2 — Kompaniya yo'nalishi va mahsulotlar sohasi
- Asked: Kompaniyangiz qaysi sohada faoliyat yuritadi va mahsulotlaringiz nimalardan iborat? (Kompaniya nomi bormi?)
- Captured: Foydalanuvchi mahsulotlar uchun aniq sohani belgilashni tanladi ("Aniq sohani ko'rsataman").
- Flags: Kompaniya nomi va aniq faoliyat sohasi/mahsulot yo'nalishi -> Foydalanuvchi kiritishi kutilmoqda

### Q3 — Do'kon yo'nalishi, nom va logotip
- Asked: Qaysi sohada faoliyat yuritasiz va kompaniyangiz nomi nima?
- Captured: Foydalanuvchi hozircha yangi kompaniya ochayotganini va u **"erkaklar uchun kiyim kechak magazini... Over sayz engoxirgi rusumdagi kiyimlar dukoni"** bo'lishini ma'lum qildi. Avval zamonaviy brend nomi variantlarini berishni, so'ngra tanlangan nom asosida logotip yaratishni so'radi.
- Flags: Brend nomini tasdiqlash -> Foydalanuvchi

### Q4 — Brend nomini tanlash
- Asked: Erkaklar oversize va zamonaviy kiyim-kechak brendi uchun qaysi nom varianti sizga ko'proq ma'qul?
- Captured: Foydalanuvchi **OVERDROP** nomini tasdiqladi.
- Flags: Logotip uslubi va ranglarini aniqlashtirish -> Q5

### Q5 — Logotip va vizual dizayn uslubi
- Asked: OVERDROP brendi logotipi va veb-sayt dizayni qanday ranglar va uslubda bo'lishini xohlaysiz?
- Captured: Foydalanuvchi **Minimalist Light / Clean** uslubini tanladi (Oq va och kulrang fon, zamonaviy toza skandinav/estetik ko'rinish).
- Flags: Logotip SVG/vektor tayyorlash -> AI

### Q6 — Murojaat va aloqa anketasi
- Asked: Saytdagi oxirgi bo'lim — murojaat anketasi to'ldirilganda, buyurtma va xabarlar qayerga kelib tushishi kerak?
- Captured: Foydalanuvchi **Telegram + Telefon qo'ng'irog'i** integratsiyasini tanladi (Mijoz raqamini qoldiradi, menejer tezda qayta bog'lanadi).
- Flags: Telegram bot tokeni/chat ID yoki to'g'ridan-to'g'ri Telegram havolasi -> Sayt sozlamalariga kiritiladi

### Q7 — Texnologiya steki
- Asked: Veb-sayt qaysi texnologiyada tayyorlanishi ma'qul?
- Captured: Foydalanuvchi **Next.js** stekini tanladi (Kelajakda to'liq ko'p sahifali internet do'konga aylantirish uchun qulay poydevor).
- Flags: Loyiha katalogida Next.js ilovasini o'rnatish va sozlash -> AI

### Q8 — Yakuniy kelishuv va tasdiq
- Asked: Hammasi joyidami, loyihani boshlashga rozimisiz?
- Captured: Foydalanuvchi "hammasi joyida" deb tasdiqladi. Barcha shartlar qabul qilindi.

## Open flags (pending input)
- *Barcha dastlabki talablar to'liq aniqlandi. Hech qanday to'siq mavjud emas.*
- Navbatdagi amaliy bosqich: OVERDROP brend logotipini yaratish va Next.js veb-saytini ishlab chiqish.
