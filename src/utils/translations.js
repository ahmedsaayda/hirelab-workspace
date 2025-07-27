// Enhanced translation system that can handle any language dynamically
// 
// HOW IT WORKS:
// 1. AI generates content in ANY language from 180+ supported languages
// 2. UI elements use smart fallback system:
//    - Direct match: Use exact language translation if available
//    - Language family: Use linguistically similar language (e.g. Swedish → Norwegian)
//    - Default fallback: Use English for unsupported languages
// 3. Future enhancement: AI-powered UI translation on demand
//
// CORE LANGUAGES: 13 strategic languages covering major language families
// FALLBACK LANGUAGES: 187 languages with intelligent linguistic fallbacks
const coreTranslations = {
  English: {
    weAreHiring: "👋 WE'RE HIRING",
    hours: "Hours", hour: "Hour", year: "Year", month: "Month", week: "Week", day: "Day",
    daily: "Daily", weekly: "Weekly", monthly: "Monthly", yearly: "Yearly",
    remote: "Remote",Hybrid:"Hybrid", hybrid: "Hybrid", summary: "Summary", contacts: "Contacts",
    description: "Description", agenda: "Agenda", aboutUs: "About Us", companyFacts: "Company Facts",
    leaderIntro: "Leader Intro", testimonials: "Testimonials", applicationProcess: "Application Process",
    growthPath: "Growth Path", applyNow: "Apply Now", share: "Share", locations: "Locations",
    pagePublished: "Page Published", letsShareWithTheWorld: "Let's Share with the World!",
    copyLink: "Copy Link", shareWithYourLovedOnes: "Share with your loved ones:",
    linkCopiedToClipboard: "Link copied to clipboard!", setApplyButtonUrl: "Set Apply Button URL",
    applyButtonUrl: "Apply Button URL", thisUrlWillBeUsed: "This should be your application form or job posting URL",
    cancel: "Cancel", saveUrl: "Save URL", beforePublishing: "Before publishing your landing page, please set the URL where candidates will be directed when they click the Apply button."
  },
  Dutch: {
    weAreHiring: "👋 WE ZOEKEN PERSONEEL",
    hours: "Uren", hour: "Uur", year: "Jaar", month: "Maand", week: "Week", day: "Dag",
    daily: "Dagelijks", weekly: "Wekelijks", monthly: "Maandelijks", yearly: "Jaarlijks",
    remote: "Thuiswerken", hybrid: "Hybride", summary: "Samenvatting", contacts: "Contacten",
    description: "Beschrijving", agenda: "Agenda", aboutUs: "Over Ons", companyFacts: "Bedrijfsfeiten",
    leaderIntro: "Leider Intro", testimonials: "Getuigenissen", applicationProcess: "Sollicitatieproces",
    growthPath: "Groeipad", applyNow: "Solliciteer Nu", share: "Delen", locations: "Locaties",
    pagePublished: "Pagina Gepubliceerd", letsShareWithTheWorld: "Laten we het met de wereld delen!",
    copyLink: "Link Kopiëren", shareWithYourLovedOnes: "Deel met je dierbaren:",
    linkCopiedToClipboard: "Link gekopieerd naar klembord!", setApplyButtonUrl: "Solliciteer Button URL Instellen",
    applyButtonUrl: "Solliciteer Button URL", thisUrlWillBeUsed: "Dit moet je sollicitatieformulier of vacature URL zijn",
    cancel: "Annuleren", saveUrl: "URL Opslaan", beforePublishing: "Voordat je je landingspagina publiceert, stel je de URL in waar kandidaten naartoe worden geleid wanneer ze op de solliciteer knop klikken."
  },
  German: {
    weAreHiring: "👋 WIR STELLEN EIN",
    hours: "Stunden", hour: "Stunde", year: "Jahr", month: "Monat", week: "Woche", day: "Tag",
    daily: "Täglich", weekly: "Wöchentlich", monthly: "Monatlich", yearly: "Jährlich",
    remote: "Remote",Hybrid:"Hybrid!!", hybrid: "Hybrid", summary: "Zusammenfassung", contacts: "Kontakte",
    description: "Beschreibung", agenda: "Agenda", aboutUs: "Über Uns", companyFacts: "Unternehmensfakten",
    leaderIntro: "Führungskraft Intro", testimonials: "Testimonials", applicationProcess: "Bewerbungsprozess",
    growthPath: "Wachstumspfad", applyNow: "Jetzt Bewerben", share: "Teilen", locations: "Standorte",
    pagePublished: "Seite Veröffentlicht", letsShareWithTheWorld: "Lass uns mit der Welt teilen!",
    copyLink: "Link Kopieren", shareWithYourLovedOnes: "Teile mit deinen Liebsten:",
    linkCopiedToClipboard: "Link in die Zwischenablage kopiert!", setApplyButtonUrl: "Bewerbung Button URL Einstellen",
    applyButtonUrl: "Bewerbung Button URL", thisUrlWillBeUsed: "Das sollte dein Bewerbungsformular oder Stellenanzeige URL sein",
    cancel: "Abbrechen", saveUrl: "URL Speichern", beforePublishing: "Bevor du deine Landingpage veröffentlichst, stelle die URL ein, wohin Kandidaten geleitet werden, wenn sie auf den Bewerbungsbutton klicken."
  },
  French: {
    weAreHiring: "👋 NOUS RECRUTONS",
    hours: "Heures", hour: "Heure", year: "Année", month: "Mois", week: "Semaine", day: "Jour",
    daily: "Quotidiennement", weekly: "Hebdomadaire", monthly: "Mensuel", yearly: "Annuel",
    remote: "Télétravail", hybrid: "Hybride", summary: "Résumé", contacts: "Contacts",
    description: "Description", agenda: "Agenda", aboutUs: "À Propos", companyFacts: "Faits sur l'Entreprise",
    leaderIntro: "Intro du Leader", testimonials: "Témoignages", applicationProcess: "Processus de Candidature",
    growthPath: "Parcours de Croissance", applyNow: "Postuler Maintenant", share: "Partager", locations: "Localisations",
    pagePublished: "Page Publiée", letsShareWithTheWorld: "Partageons avec le monde!",
    copyLink: "Copier le Lien", shareWithYourLovedOnes: "Partagez avec vos proches:",
    linkCopiedToClipboard: "Lien copié dans le presse-papiers!", setApplyButtonUrl: "Définir l'URL du Bouton de Candidature",
    applyButtonUrl: "URL du Bouton de Candidature", thisUrlWillBeUsed: "Cela devrait être votre formulaire de candidature ou URL d'offre d'emploi",
    cancel: "Annuler", saveUrl: "Enregistrer l'URL", beforePublishing: "Avant de publier votre page de destination, veuillez définir l'URL vers laquelle les candidats seront dirigés lorsqu'ils cliqueront sur le bouton de candidature."
  },
  Spanish: {
    weAreHiring: "👋 ESTAMOS CONTRATANDO",
    hours: "Horas", hour: "Hora", year: "Año", month: "Mes", week: "Semana", day: "Día",
    daily: "Diariamente", weekly: "Semanalmente", monthly: "Mensualmente", yearly: "Anualmente",
    remote: "Remoto", hybrid: "Híbrido", summary: "Resumen", contacts: "Contactos",
    description: "Descripción", agenda: "Agenda", aboutUs: "Sobre Nosotros", companyFacts: "Datos de la Empresa",
    leaderIntro: "Introducción del Líder", testimonials: "Testimonios", applicationProcess: "Proceso de Solicitud",
    growthPath: "Camino de Crecimiento", applyNow: "Aplicar Ahora", share: "Compartir", locations: "Ubicaciones",
    pagePublished: "Página Publicada", letsShareWithTheWorld: "¡Compartamos con el mundo!",
    copyLink: "Copiar Enlace", shareWithYourLovedOnes: "Comparte con tus seres queridos:",
    linkCopiedToClipboard: "¡Enlace copiado al portapapeles!", setApplyButtonUrl: "Establecer URL del Botón de Solicitud",
    applyButtonUrl: "URL del Botón de Solicitud", thisUrlWillBeUsed: "Esta debería ser tu formulario de solicitud o URL de oferta de trabajo",
    cancel: "Cancelar", saveUrl: "Guardar URL", beforePublishing: "Antes de publicar tu página de destino, establece la URL a la que serán dirigidos los candidatos cuando hagan clic en el botón de solicitud."
  },
  Italian: {
    weAreHiring: "👋 STIAMO ASSUMENDO",
    hours: "Ore", hour: "Ora", year: "Anno", month: "Mese", week: "Settimana", day: "Giorno",
    daily: "Giornaliero", weekly: "Settimanale", monthly: "Mensile", yearly: "Annuale",
    remote: "Remoto", hybrid: "Ibrido", summary: "Riassunto", contacts: "Contatti",
    description: "Descrizione", agenda: "Agenda", aboutUs: "Chi Siamo", companyFacts: "Fatti Aziendali",
    leaderIntro: "Presentazione Leader", testimonials: "Testimonianze", applicationProcess: "Processo di Candidatura",
    growthPath: "Percorso di Crescita", applyNow: "Candidati Ora", share: "Condividi", locations: "Località",
    pagePublished: "Pagina Pubblicata", letsShareWithTheWorld: "Condividiamo con il mondo!",
    copyLink: "Copia Link", shareWithYourLovedOnes: "Condividi con i tuoi cari:",
    linkCopiedToClipboard: "Link copiato negli appunti!", setApplyButtonUrl: "Imposta URL Pulsante Candidatura",
    applyButtonUrl: "URL Pulsante Candidatura", thisUrlWillBeUsed: "Questo dovrebbe essere il tuo modulo di candidatura o URL dell'offerta di lavoro",
    cancel: "Annulla", saveUrl: "Salva URL", beforePublishing: "Prima di pubblicare la tua landing page, imposta l'URL verso cui i candidati saranno diretti quando cliccano sul pulsante di candidatura."
  },
  Portuguese: {
    weAreHiring: "👋 ESTAMOS CONTRATANDO",
    hours: "Horas", hour: "Hora", year: "Ano", month: "Mês", week: "Semana", day: "Dia",
    daily: "Diário", weekly: "Semanal", monthly: "Mensal", yearly: "Anual",
    remote: "Remoto", hybrid: "Híbrido", summary: "Resumo", contacts: "Contatos",
    description: "Descrição", agenda: "Agenda", aboutUs: "Sobre Nós", companyFacts: "Fatos da Empresa",
    leaderIntro: "Apresentação do Líder", testimonials: "Depoimentos", applicationProcess: "Processo de Candidatura",
    growthPath: "Caminho de Crescimento", applyNow: "Candidatar Agora", share: "Compartilhar", locations: "Localizações",
    pagePublished: "Página Publicada", letsShareWithTheWorld: "Vamos compartilhar com o mundo!",
    copyLink: "Copiar Link", shareWithYourLovedOnes: "Compartilhe com seus entes queridos:",
    linkCopiedToClipboard: "Link copiado para a área de transferência!", setApplyButtonUrl: "Definir URL do Botão de Candidatura",
    applyButtonUrl: "URL do Botão de Candidatura", thisUrlWillBeUsed: "Este deve ser seu formulário de candidatura ou URL da vaga",
    cancel: "Cancelar", saveUrl: "Salvar URL", beforePublishing: "Antes de publicar sua landing page, defina a URL para onde os candidatos serão direcionados ao clicar no botão de candidatura."
  },
  Norwegian: {
    weAreHiring: "👋 VI ANSETTER",
    hours: "Timer", hour: "Time", year: "År", month: "Måned", week: "Uke", day: "Dag",
    daily: "Daglig", weekly: "Ukentlig", monthly: "Månedlig", yearly: "Årlig",
    remote: "Hjemmekontor", hybrid: "Hybrid", summary: "Sammendrag", contacts: "Kontakter",
    description: "Beskrivelse", agenda: "Agenda", aboutUs: "Om Oss", companyFacts: "Bedriftsfakta",
    leaderIntro: "Leder Presentasjon", testimonials: "Anbefalinger", applicationProcess: "Søknadsprosess",
    growthPath: "Vekstbane", applyNow: "Søk Nå", share: "Del", locations: "Lokasjoner",
    pagePublished: "Side Publisert", letsShareWithTheWorld: "La oss dele med verden!",
    copyLink: "Kopier Link", shareWithYourLovedOnes: "Del med dine kjære:",
    linkCopiedToClipboard: "Link kopiert til utklippstavle!", setApplyButtonUrl: "Sett Søknad Knapp URL",
    applyButtonUrl: "Søknad Knapp URL", thisUrlWillBeUsed: "Dette bør være ditt søknadsskjema eller jobbutlysning URL",
    cancel: "Avbryt", saveUrl: "Lagre URL", beforePublishing: "Før du publiserer landingssiden din, sett URL-en hvor kandidater vil bli dirigert når de klikker på søknadsknappen."
  },
  // Strategic core languages for major language families
  Russian: {
    weAreHiring: "👋 МЫ НАНИМАЕМ",
    hours: "Часы", hour: "Час", year: "Год", month: "Месяц", week: "Неделя", day: "День",
    daily: "Ежедневно", weekly: "Еженедельно", monthly: "Ежемесячно", yearly: "Ежегодно",
    remote: "Удалённо", hybrid: "Гибридно", summary: "Резюме", contacts: "Контакты",
    description: "Описание", agenda: "Повестка", aboutUs: "О нас", companyFacts: "Факты о компании",
    leaderIntro: "Представление руководителя", testimonials: "Отзывы", applicationProcess: "Процесс подачи заявки",
    growthPath: "Путь роста", applyNow: "Подать заявку сейчас", share: "Поделиться", locations: "Местоположения",
    pagePublished: "Страница опубликована", letsShareWithTheWorld: "Давайте поделимся с миром!",
    copyLink: "Копировать ссылку", shareWithYourLovedOnes: "Поделитесь с близкими:",
    linkCopiedToClipboard: "Ссылка скопирована в буфер обмена!", setApplyButtonUrl: "Установить URL кнопки подачи заявки",
    applyButtonUrl: "URL кнопки подачи заявки", thisUrlWillBeUsed: "Это должна быть ваша форма заявки или URL вакансии",
    cancel: "Отмена", saveUrl: "Сохранить URL", beforePublishing: "Перед публикацией целевой страницы установите URL, на который будут перенаправлены кандидаты при нажатии кнопки подачи заявки."
  },
  Chinese: {
    weAreHiring: "👋 我们正在招聘",
    hours: "小时", hour: "小时", year: "年", month: "月", week: "周", day: "天",
    daily: "每日", weekly: "每周", monthly: "每月", yearly: "每年",
    remote: "远程", hybrid: "混合", summary: "摘要", contacts: "联系方式",
    description: "描述", agenda: "议程", aboutUs: "关于我们", companyFacts: "公司信息",
    leaderIntro: "领导介绍", testimonials: "推荐", applicationProcess: "申请流程",
    growthPath: "成长路径", applyNow: "立即申请", share: "分享", locations: "位置",
    pagePublished: "页面已发布", letsShareWithTheWorld: "让我们与世界分享！",
    copyLink: "复制链接", shareWithYourLovedOnes: "与您的亲人分享：",
    linkCopiedToClipboard: "链接已复制到剪贴板！", setApplyButtonUrl: "设置申请按钮URL",
    applyButtonUrl: "申请按钮URL", thisUrlWillBeUsed: "这应该是您的申请表或职位发布URL",
    cancel: "取消", saveUrl: "保存URL", beforePublishing: "在发布您的着陆页之前，请设置候选人点击申请按钮时将被引导到的URL。"
  },
  Arabic: {
    weAreHiring: "👋 نحن نوظف",
    hours: "ساعات", hour: "ساعة", year: "سنة", month: "شهر", week: "أسبوع", day: "يوم",
    daily: "يوميا", weekly: "أسبوعيا", monthly: "شهريا", yearly: "سنويا",
    remote: "عن بعد", hybrid: "مختلط", summary: "ملخص", contacts: "جهات الاتصال",
    description: "وصف", agenda: "جدول الأعمال", aboutUs: "من نحن", companyFacts: "حقائق الشركة",
    leaderIntro: "مقدمة القائد", testimonials: "شهادات", applicationProcess: "عملية التقديم",
    growthPath: "مسار النمو", applyNow: "قدم الآن", share: "شارك", locations: "المواقع",
    pagePublished: "تم نشر الصفحة", letsShareWithTheWorld: "دعونا نشارك مع العالم!",
    copyLink: "نسخ الرابط", shareWithYourLovedOnes: "شارك مع أحبائك:",
    linkCopiedToClipboard: "تم نسخ الرابط إلى الحافظة!", setApplyButtonUrl: "تعيين رابط زر التقديم",
    applyButtonUrl: "رابط زر التقديم", thisUrlWillBeUsed: "يجب أن يكون هذا نموذج التقديم أو رابط الوظيفة",
    cancel: "إلغاء", saveUrl: "حفظ الرابط", beforePublishing: "قبل نشر صفحتك المقصودة، يرجى تعيين الرابط الذي سيتم توجيه المرشحين إليه عند النقر على زر التقديم."
  },
  Hindi: {
    weAreHiring: "👋 हम भर्ती कर रहे हैं",
    hours: "घंटे", hour: "घंटा", year: "वर्ष", month: "महीना", week: "सप्ताह", day: "दिन",
    daily: "दैनिक", weekly: "साप्ताहिक", monthly: "मासिक", yearly: "वार्षिक",
    remote: "रिमोट", hybrid: "हाइब्रिड", summary: "सारांश", contacts: "संपर्क",
    description: "विवरण", agenda: "एजेंडा", aboutUs: "हमारे बारे में", companyFacts: "कंपनी तथ्य",
    leaderIntro: "नेता परिचय", testimonials: "प्रशंसापत्र", applicationProcess: "आवेदन प्रक्रिया",
    growthPath: "विकास पथ", applyNow: "अभी आवेदन करें", share: "साझा करें", locations: "स्थान",
    pagePublished: "पेज प्रकाशित", letsShareWithTheWorld: "आइए दुनिया के साथ साझा करें!",
    copyLink: "लिंक कॉपी करें", shareWithYourLovedOnes: "अपने प्रियजनों के साथ साझा करें:",
    linkCopiedToClipboard: "लिंक क्लिपबोर्ड पर कॉपी हो गया!", setApplyButtonUrl: "आवेदन बटन URL सेट करें",
    applyButtonUrl: "आवेदन बटन URL", thisUrlWillBeUsed: "यह आपका आवेदन फॉर्म या नौकरी पोस्टिंग URL होना चाहिए",
    cancel: "रद्द करें", saveUrl: "URL सेव करें", beforePublishing: "अपना लैंडिंग पेज प्रकाशित करने से पहले, कृपया वह URL सेट करें जहाँ उम्मीदवारों को आवेदन बटन पर क्लिक करने पर भेजा जाएगा।"
  },
  Japanese: {
    weAreHiring: "👋 採用中",
    hours: "時間", hour: "時間", year: "年", month: "月", week: "週", day: "日",
    daily: "日次", weekly: "週次", monthly: "月次", yearly: "年次",
    remote: "リモート", hybrid: "ハイブリッド", summary: "概要", contacts: "連絡先",
    description: "説明", agenda: "アジェンダ", aboutUs: "私たちについて", companyFacts: "会社情報",
    leaderIntro: "リーダー紹介", testimonials: "お客様の声", applicationProcess: "応募プロセス",
    growthPath: "成長パス", applyNow: "今すぐ応募", share: "共有", locations: "場所",
    pagePublished: "ページ公開済み", letsShareWithTheWorld: "世界と共有しましょう！",
    copyLink: "リンクをコピー", shareWithYourLovedOnes: "愛する人と共有:",
    linkCopiedToClipboard: "リンクがクリップボードにコピーされました！", setApplyButtonUrl: "応募ボタンURLを設定",
    applyButtonUrl: "応募ボタンURL", thisUrlWillBeUsed: "これは応募フォームまたは求人投稿のURLである必要があります",
    cancel: "キャンセル", saveUrl: "URLを保存", beforePublishing: "ランディングページを公開する前に、候補者が応募ボタンをクリックしたときに誘導されるURLを設定してください。"
  }
};

// Comprehensive language family mappings for all 187 languages from lang.json
// Each language maps to the most linguistically appropriate core language
const languageFamilies = {
  // Language code mappings (from lang.json)
  "Afar": "Arabic",
  "Abkhazian": "Russian",
  "Avestan": "Hindi",
  "Afrikaans": "German",
  "Akan": "English",
  "Amharic": "Arabic",
  "Aragonese": "Spanish",
  "Arabic": "Arabic",
  "Assamese": "Hindi",
  "Avaric": "Russian",
  "Aymara": "Spanish",
  "Azerbaijani": "Russian",
  "Bashkir": "Russian",
  "Belarusian": "Russian",
  "Bulgarian": "Russian",
  "Bihari languages": "Hindi",
  "Bislama": "English",
  "Bambara": "French",
  "Bengali": "Hindi",
  "Tibetan": "Chinese",
  "Breton": "French",
  "Bosnian": "Russian",
  "Catalan": "Spanish",
  "Chechen": "Russian",
  "Chamorro": "English",
  "Corsican": "Italian",
  "Cree": "English",
  "Czech": "Russian",
  "Church Slavic": "Russian",
  "Chuvash": "Russian",
  "Welsh": "English",
  "Danish": "Norwegian",
  "German": "German",
  "Maldivian": "Hindi",
  "Dzongkha": "Chinese",
  "Ewe": "English",
  "Greek": "English",
  "English": "English",
  "Esperanto": "English",
  "Spanish": "Spanish",
  "Estonian": "Norwegian",
  "Basque": "Spanish",
  "Persian": "Arabic",
  "Fulah": "French",
  "Finnish": "Norwegian",
  "Fijian": "English",
  "Faroese": "Norwegian",
  "French": "French",
  "Western Frisian": "Dutch",
  "Irish": "English",
  "Gaelic": "English",
  "Galician": "Spanish",
  "Guarani": "Spanish",
  "Gujarati": "Hindi",
  "Manx": "English",
  "Hausa": "Arabic",
  "Hebrew": "Arabic",
  "Hindi": "Hindi",
  "Hiri Motu": "English",
  "Croatian": "Russian",
  "Haitian": "French",
  "Hungarian": "Russian",
  "Armenian": "Russian",
  "Herero": "English",
  "Interlingua": "English",
  "Indonesian": "English",
  "Interlingue": "English",
  "Igbo": "English",
  "Sichuan Yi": "Chinese",
  "Inupiaq": "English",
  "Ido": "English",
  "Icelandic": "Norwegian",
  "Italian": "Italian",
  "Inuktitut": "English",
  "Japanese": "Japanese",
  "Javanese": "English",
  "Georgian": "Russian",
  "Kongo": "French",
  "Kikuyu": "English",
  "Kuanyama": "English",
  "Kazakh": "Russian",
  "Kalaallisut": "Norwegian",
  "Central Khmer": "Chinese",
  "Kannada": "Hindi",
  "Korean": "Chinese",
  "Kanuri": "Arabic",
  "Kashmiri": "Hindi",
  "Kurdish": "Arabic",
  "Komi": "Russian",
  "Cornish": "English",
  "Kirghiz": "Russian",
  "Latin": "Italian",
  "Luxembourgish": "German",
  "Ganda": "English",
  "Limburgan": "Dutch",
  "Lingala": "French",
  "Lao": "Chinese",
  "Lithuanian": "Russian",
  "Luba-Katanga": "French",
  "Latvian": "Russian",
  "Malagasy": "French",
  "Marshallese": "English",
  "Maori": "English",
  "Macedonian": "Russian",
  "Malayalam": "Hindi",
  "Mongolian": "Chinese",
  "Marathi": "Hindi",
  "Malay": "English",
  "Maltese": "English",
  "Burmese": "Chinese",
  "Nauru": "English",
  "Norwegian (Bokmål)": "Norwegian",
  "North Ndebele": "English",
  "Nepali": "Hindi",
  "Ndonga": "English",
  "Dutch": "Dutch",
  "Norwegian (Nynorsk)": "Norwegian",
  "Norwegian": "Norwegian",
  "South Ndebele": "English",
  "Navajo": "English",
  "Chichewa": "English",
  "Occitan": "French",
  "Ojibwa": "English",
  "Oromo": "Arabic",
  "Oriya": "Hindi",
  "Ossetic": "Russian",
  "Panjabi": "Hindi",
  "Pali": "Hindi",
  "Polish": "Russian",
  "Pushto": "Arabic",
  "Portuguese": "Portuguese",
  "Quechua": "Spanish",
  "Romansh": "Italian",
  "Rundi": "French",
  "Romanian": "Italian",
  "Russian": "Russian",
  "Kinyarwanda": "French",
  "Sanskrit": "Hindi",
  "Sardinian": "Italian",
  "Sindhi": "Hindi",
  "Northern Sami": "Norwegian",
  "Sango": "French",
  "Sinhala": "Hindi",
  "Slovak": "Russian",
  "Slovenian": "Russian",
  "Samoan": "English",
  "Shona": "English",
  "Somali": "Arabic",
  "Albanian": "Italian",
  "Serbian": "Russian",
  "Swati": "English",
  "Sotho, Southern": "English",
  "Sundanese": "English",
  "Swedish": "Norwegian",
  "Swahili": "Arabic",
  "Tamil": "Hindi",
  "Telugu": "Hindi",
  "Tajik": "Russian",
  "Thai": "Chinese",
  "Tigrinya": "Arabic",
  "Turkmen": "Russian",
  "Tagalog": "English",
  "Tswana": "English",
  "Tonga": "English",
  "Turkish": "Russian",
  "Tsonga": "English",
  "Tatar": "Russian",
  "Twi": "English",
  "Tahitian": "French",
  "Uighur": "Chinese",
  "Ukrainian": "Russian",
  "Urdu": "Hindi",
  "Uzbek": "Russian",
  "Venda": "English",
  "Vietnamese": "Chinese",
  "Volapük": "English",
  "Walloon": "French",
  "Wolof": "French",
  "Xhosa": "English",
  "Yiddish": "German",
  "Yoruba": "English",
  "Zhuang": "Chinese",
  "Chinese": "Chinese",
  "Zulu": "English"
};

// Cache for dynamic translations to avoid repeated API calls
let translationCache = {};

// Enhanced translation function with intelligent fallbacks for all 187 languages
export const getTranslation = (language, key) => {
  console.log("language", language);
  console.log("key", key);
  
  // If no language specified, use English
  if (!language) {
    return coreTranslations.English[key] || key;
  }

  // Check if we have direct translation for this language
  if (coreTranslations[language] && coreTranslations[language][key]) {
    return coreTranslations[language][key];
  }

  // Check for cached dynamic translations
  const cacheKey = `${language}_${key}`;
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  // Use language family fallback mapping
  const fallbackLanguage = languageFamilies[language];
  if (fallbackLanguage && coreTranslations[fallbackLanguage] && coreTranslations[fallbackLanguage][key]) {
    return coreTranslations[fallbackLanguage][key];
  }

  // Final fallback to English for any unmapped languages
  return coreTranslations.English[key] || key;
};

// Get time unit translation
export const getTimeUnitTranslation = (language, unit) => {
  const unitMap = {
    Days: 'day',
    Week: 'week', 
    Month: 'month',
    daily: 'daily',
    weekly: 'weekly',
    monthly: 'monthly',
    yearly: 'yearly',
    Year: 'year'
  };
  
  const translationKey = unitMap[unit] || 'day';
  return getTranslation(language, translationKey);
};

// Get salary time translation
export const getSalaryTimeTranslation = (language, time) => {
  const timeMap = {
    Year: 'year',
    Month: 'month',
    Week: 'week',
    Day: 'day'
  };
  
  const translationKey = timeMap[time] || 'year';
  return getTranslation(language, translationKey);
};

// Future enhancement: AI-powered translation for any language
// This could be called when we need UI translations for unsupported languages
export const getAITranslation = async (text, targetLanguage) => {
  // This could be implemented to call an AI translation service
  // For now, return the original text
  console.log(`AI Translation needed: "${text}" → ${targetLanguage}`);
  return text;
};

// Helper function to check if a language is fully supported
export const isLanguageFullySupported = (language) => {
  return !!coreTranslations[language];
};

// Get list of all supported languages
export const getSupportedLanguages = () => {
  return Object.keys(coreTranslations);
};

export default coreTranslations; 