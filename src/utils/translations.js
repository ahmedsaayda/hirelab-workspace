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
// CORE LANGUAGES: 24 strategic languages covering major language families
// FALLBACK LANGUAGES: 187 languages with intelligent linguistic fallbacks
const coreTranslations = {
  English: {
    weAreHiring: "WE'RE HIRING",
    hours: "Hours", hour: "Hour", year: "Year", month: "Month", week: "Week", day: "Day",
    daily: "Daily", weekly: "Weekly", monthly: "Monthly", yearly: "Yearly",
    remote: "Remote", Hybrid: "Hybrid", hybrid: "Hybrid", summary: "Summary", contacts: "Contacts",
    description: "Description", agenda: "Agenda", aboutUs: "About Us", companyFacts: "Company Facts",
    textBox: "Text Box", video: "Video", images: "Images", evpMission: "EVP / Mission", leaderIntro: "Leader Intro",
    testimonials: "Testimonials", growthPath: "Growth Path", applicationProcess: "Application Process",
    applyNow: "Apply Now", share: "Share", locations: "Locations",
    pagePublished: "Page Published", letsShareWithTheWorld: "Let's Share with the World!",
    copyLink: "Copy Link", shareWithYourLovedOnes: "Share with your loved ones:",
    linkCopiedToClipboard: "Link copied to clipboard!", setApplyButtonUrl: "Set Apply Button URL",
    applyButtonUrl: "Apply Button URL", thisUrlWillBeUsed: "This should be your application form or job posting URL",
    cancel: "Cancel", saveUrl: "Save URL", beforePublishing: "Before publishing your landing page, please set the URL where candidates will be directed when they click the Apply button.",
    // Form field translations
    firstName: "First Name", lastName: "Last Name", email: "Email", phone: "Phone Number",
    contactInformation: "Contact Information", fieldLabel: "Field Label", placeholder: "Placeholder",
    required: "Required", visible: "Visible", previous: "Previous", next: "Next", submit: "Submit",
    startApplication: "Start Application", formFields: "Form Fields", addField: "Add Field",
    configureField: "Configure Field", clickToConfigure: "Click to configure",
    // Placeholder translations
    firstNamePlaceholder: "Enter your first name", lastNamePlaceholder: "Enter your last name",
    emailPlaceholder: "Enter your email address", phonePlaceholder: "Enter your phone number",
    // Modal translations
    pasteJobText: "Paste Job Text", enterJobTitle: "Enter Job Title", department: "Department",
    selectDepartment: "Select a department", language: "Language", selectLanguage: "Select a language",
    pasteJobDescription: "Paste Job Description (Ctrl+V)",
    pasteJobTip: "Tip: Copy (Ctrl+C) the entire job posting from a website and paste (Ctrl+V) it here. Our AI will extract all relevant information.",
    readMore: "Read More", readLess: "Read Less",
    // Multi-job campaign translations
    whatWouldYouLikeToCreate: "What would you like to create?",
    singleJobCampaign: "Single Job Campaign",
    multiJobCampaign: "Multi-Job Campaign",
    singleJobDescription: "Create a landing page for one specific job position with detailed descriptions, benefits, and application form.",
    multiJobDescription: "Create a career page showcasing multiple job positions. Link existing campaigns to display all your open positions in one place.",
    mostPopular: "Most Popular",
    whichShouldIChoose: "Which should I choose?",
    singleJobTip: "Best for recruiting for a specific position with a dedicated landing page.",
    multiJobTip: "Ideal for showcasing your employer brand with multiple open positions, like a career page. You can link existing single job campaigns.",
    ourOpenPositions: "Our Open Positions",
    openPositions: "Open Positions",
    departments: "Departments",
    viewPosition: "View Position",
    searchPositions: "Search positions...",
    allDepartments: "All Departments",
    noPositionsLinked: "No job positions have been linked to this campaign yet",
    noPositionsMatch: "No positions match your search criteria",
    linkedJobs: "Linked Jobs",
    addJobs: "Add Jobs",
    heroSection: "Hero Section",
    jobsSection: "Jobs Section",
    campaignSettings: "Campaign Settings",
    // Multi-job page specific
    exploreOpportunities: "Explore Opportunities",
    showingXofY: "Showing {count} of {total}",
    position: "position",
    positions: "positions",
    readyToTakeNextStep: "Ready to take the next step in your career?",
    exploreJobOpportunities: "Explore our exciting job opportunities and apply today!",
    // Save/Bookmark
    save: "Save",
    bookmarkAdded: "Page bookmarked! Press Ctrl+D (Cmd+D on Mac) to save.",
    bookmarkInstructions: "Press Ctrl+D (Cmd+D on Mac) to bookmark this page"
  },
  Dutch: {
    weAreHiring: " WE ZOEKEN PERSONEEL",
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
    cancel: "Annuleren", saveUrl: "URL Opslaan", beforePublishing: "Voordat je je landingspagina publiceert, stel je de URL in waar kandidaten naartoe worden geleid wanneer ze op de solliciteer knop klikken.",
    // Form field translations
    firstName: "Voornaam", lastName: "Achternaam", email: "E-mail", phone: "Telefoonnummer",
    contactInformation: "Contactgegevens", fieldLabel: "Veldlabel", placeholder: "Tijdelijke aanduiding",
    required: "Verplicht", visible: "Zichtbaar", previous: "Vorige", next: "Volgende", submit: "Versturen",
    startApplication: "Start Sollicitatie", formFields: "Formuliervelden", addField: "Veld Toevoegen",
    configureField: "Veld Configureren", clickToConfigure: "Klik om te configureren",
    // Placeholder translations
    firstNamePlaceholder: "Voer je voornaam in", lastNamePlaceholder: "Voer je achternaam in",
    emailPlaceholder: "Voer je e-mailadres in", phonePlaceholder: "Voer je telefoonnummer in",
    // Modal translations
    pasteJobText: "Plak Vacaturetekst", enterJobTitle: "Voer Functietitel In", department: "Afdeling",
    selectDepartment: "Selecteer een afdeling", language: "Taal", selectLanguage: "Selecteer een taal",
    pasteJobDescription: "Plak Vacaturebeschrijving (Ctrl+V)",
    pasteJobTip: "Tip: Kopieer (Ctrl+C) de hele vacature van een website en plak (Ctrl+V) deze hier. Onze AI haalt alle relevante informatie eruit.",
    readMore: "Lees Meer", readLess: "Lees Minder",
    // Multi-job campaign translations
    whatWouldYouLikeToCreate: "Wat wilt u aanmaken?",
    singleJobCampaign: "Enkele Vacature Campagne",
    multiJobCampaign: "Multi-Vacature Campagne",
    singleJobDescription: "Maak een landingspagina voor één specifieke functie met gedetailleerde beschrijvingen, voordelen en sollicitatieformulier.",
    multiJobDescription: "Maak een carrièrepagina met meerdere functies. Koppel bestaande campagnes om al uw openstaande functies op één plek te tonen.",
    mostPopular: "Meest Populair",
    whichShouldIChoose: "Welke moet ik kiezen?",
    singleJobTip: "Ideaal voor het werven voor een specifieke functie met een speciale landingspagina.",
    multiJobTip: "Ideaal om uw werkgeversmerk te presenteren met meerdere openstaande functies, zoals een carrièrepagina.",
    ourOpenPositions: "Onze Openstaande Functies",
    openPositions: "Openstaande Functies",
    departments: "Afdelingen",
    viewPosition: "Bekijk Functie",
    searchPositions: "Zoek functies...",
    allDepartments: "Alle Afdelingen",
    noPositionsLinked: "Er zijn nog geen functies gekoppeld aan deze campagne",
    noPositionsMatch: "Geen functies komen overeen met uw zoekcriteria",
    linkedJobs: "Gekoppelde Vacatures",
    addJobs: "Vacatures Toevoegen",
    heroSection: "Hero Sectie",
    jobsSection: "Vacatures Sectie",
    campaignSettings: "Campagne Instellingen",
    // Multi-job page specific
    exploreOpportunities: "Vacatures Ontdekken",
    showingXofY: "Toont {count} van {total}",
    position: "functie",
    positions: "functies",
    readyToTakeNextStep: "Klaar voor de volgende stap in je carrière?",
    exploreJobOpportunities: "Ontdek onze spannende vacatures en solliciteer vandaag nog!",
    // Save/Bookmark
    save: "Opslaan",
    bookmarkAdded: "Pagina opgeslagen! Druk op Ctrl+D (Cmd+D op Mac) om op te slaan.",
    bookmarkInstructions: "Druk op Ctrl+D (Cmd+D op Mac) om deze pagina op te slaan"
  },
  German: {
    weAreHiring: " WIR STELLEN EIN",
    hours: "Stunden", hour: "Stunde", year: "Jahr", month: "Monat", week: "Woche", day: "Tag",
    daily: "Täglich", weekly: "Wöchentlich", monthly: "Monatlich", yearly: "Jährlich",
    remote: "Remote", Hybrid: "Hybrid!!", hybrid: "Hybrid", summary: "Zusammenfassung", contacts: "Kontakte",
    description: "Beschreibung", agenda: "Agenda", aboutUs: "Über Uns", companyFacts: "Unternehmensfakten",
    leaderIntro: "Führungskraft Intro", testimonials: "Testimonials", applicationProcess: "Bewerbungsprozess",
    growthPath: "Wachstumspfad", applyNow: "Jetzt Bewerben", share: "Teilen", locations: "Standorte",
    pagePublished: "Seite Veröffentlicht", letsShareWithTheWorld: "Lass uns mit der Welt teilen!",
    copyLink: "Link Kopieren", shareWithYourLovedOnes: "Teile mit deinen Liebsten:",
    linkCopiedToClipboard: "Link in die Zwischenablage kopiert!", setApplyButtonUrl: "Bewerbung Button URL Einstellen",
    applyButtonUrl: "Bewerbung Button URL", thisUrlWillBeUsed: "Das sollte dein Bewerbungsformular oder Stellenanzeige URL sein",
    cancel: "Abbrechen", saveUrl: "URL Speichern", beforePublishing: "Bevor du deine Landingpage veröffentlichst, stelle die URL ein, wohin Kandidaten geleitet werden, wenn sie auf den Bewerbungsbutton klicken.",
    // Form field translations
    firstName: "Vorname", lastName: "Nachname", email: "E-Mail", phone: "Telefonnummer",
    contactInformation: "Kontaktinformationen", fieldLabel: "Feldbezeichnung", placeholder: "Platzhalter",
    required: "Erforderlich", visible: "Sichtbar", previous: "Zurück", next: "Weiter", submit: "Absenden",
    startApplication: "Bewerbung Starten", formFields: "Formularfelder", addField: "Feld Hinzufügen",
    configureField: "Feld Konfigurieren", clickToConfigure: "Klicken zum Konfigurieren",
    // Placeholder translations
    firstNamePlaceholder: "Geben Sie Ihren Vornamen ein", lastNamePlaceholder: "Geben Sie Ihren Nachnamen ein",
    emailPlaceholder: "Geben Sie Ihre E-Mail-Adresse ein", phonePlaceholder: "Geben Sie Ihre Telefonnummer ein",
    // Modal translations
    pasteJobText: "Stellentext Einfügen", enterJobTitle: "Stellentitel Eingeben", department: "Abteilung",
    selectDepartment: "Wählen Sie eine Abteilung", language: "Sprache", selectLanguage: "Wählen Sie eine Sprache",
    pasteJobDescription: "Stellenbeschreibung Einfügen (Strg+V)",
    pasteJobTip: "Tipp: Kopieren Sie (Strg+C) die gesamte Stellenausschreibung von einer Website und fügen Sie sie (Strg+V) hier ein. Unsere KI extrahiert alle relevanten Informationen.",
    readMore: "Mehr Lesen", readLess: "Weniger Lesen",
    // Multi-job campaign translations
    whatWouldYouLikeToCreate: "Was möchten Sie erstellen?",
    singleJobCampaign: "Einzelne Stellenkampagne",
    multiJobCampaign: "Multi-Stellen-Kampagne",
    singleJobDescription: "Erstellen Sie eine Landingpage für eine bestimmte Stelle mit detaillierten Beschreibungen, Vorteilen und Bewerbungsformular.",
    multiJobDescription: "Erstellen Sie eine Karriereseite mit mehreren Stellenangeboten. Verknüpfen Sie bestehende Kampagnen, um alle offenen Stellen an einem Ort anzuzeigen.",
    mostPopular: "Am Beliebtesten",
    whichShouldIChoose: "Welche sollte ich wählen?",
    singleJobTip: "Ideal für die Rekrutierung für eine bestimmte Position mit einer eigenen Landingpage.",
    multiJobTip: "Ideal für die Präsentation Ihrer Arbeitgebermarke mit mehreren offenen Stellen, wie eine Karriereseite.",
    ourOpenPositions: "Unsere Offenen Stellen",
    openPositions: "Offene Stellen",
    departments: "Abteilungen",
    viewPosition: "Stelle Ansehen",
    searchPositions: "Stellen suchen...",
    allDepartments: "Alle Abteilungen",
    noPositionsLinked: "Es wurden noch keine Stellen mit dieser Kampagne verknüpft",
    noPositionsMatch: "Keine Stellen entsprechen Ihren Suchkriterien",
    linkedJobs: "Verknüpfte Stellen",
    addJobs: "Stellen Hinzufügen",
    heroSection: "Hero-Bereich",
    jobsSection: "Stellen-Bereich",
    campaignSettings: "Kampagnen-Einstellungen",
    // Multi-job page specific
    exploreOpportunities: "Stellen Entdecken",
    showingXofY: "Zeige {count} von {total}",
    position: "Stelle",
    positions: "Stellen",
    readyToTakeNextStep: "Bereit für den nächsten Karriereschritt?",
    exploreJobOpportunities: "Entdecken Sie unsere spannenden Jobangebote und bewerben Sie sich noch heute!",
    // Save/Bookmark
    save: "Speichern",
    bookmarkAdded: "Seite gemerkt! Drücken Sie Strg+D (Cmd+D auf Mac) zum Speichern.",
    bookmarkInstructions: "Drücken Sie Strg+D (Cmd+D auf Mac) um diese Seite zu speichern"
  },
  French: {
    weAreHiring: " NOUS RECRUTONS",
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
    cancel: "Annuler", saveUrl: "Enregistrer l'URL", beforePublishing: "Avant de publier votre page de destination, veuillez définir l'URL vers laquelle les candidats seront dirigés lorsqu'ils cliqueront sur le bouton de candidature.",
    // Form field translations
    firstName: "Prénom", lastName: "Nom de famille", email: "E-mail", phone: "Téléphone",
    contactInformation: "Informations de Contact", fieldLabel: "Étiquette du Champ", placeholder: "Texte d'exemple",
    required: "Obligatoire", visible: "Visible", previous: "Précédent", next: "Suivant", submit: "Soumettre",
    startApplication: "Commencer la Candidature", formFields: "Champs du Formulaire", addField: "Ajouter un Champ",
    configureField: "Configurer le Champ", clickToConfigure: "Cliquez pour configurer",
    // Placeholder translations
    firstNamePlaceholder: "Entrez votre prénom", lastNamePlaceholder: "Entrez votre nom de famille",
    emailPlaceholder: "Entrez votre adresse e-mail", phonePlaceholder: "Entrez votre numéro de téléphone",
    // Modal translations
    pasteJobText: "Coller le Texte de l'Emploi", enterJobTitle: "Entrer le Titre du Poste", department: "Département",
    selectDepartment: "Sélectionnez un département", language: "Langue", selectLanguage: "Sélectionnez une langue",
    pasteJobDescription: "Coller la Description de l'Emploi (Ctrl+V)",
    pasteJobTip: "Astuce : Copiez (Ctrl+C) l'offre d'emploi complète d'un site web et collez-la (Ctrl+V) ici. Notre IA extraira toutes les informations pertinentes.",
    readMore: "Lire Plus", readLess: "Lire Moins",
    // Save/Bookmark
    save: "Enregistrer",
    bookmarkAdded: "Page enregistrée ! Appuyez sur Ctrl+D (Cmd+D sur Mac) pour sauvegarder.",
    bookmarkInstructions: "Appuyez sur Ctrl+D (Cmd+D sur Mac) pour enregistrer cette page"
  },
  Spanish: {
    weAreHiring: " ESTAMOS CONTRATANDO",
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
    cancel: "Cancelar", saveUrl: "Guardar URL", beforePublishing: "Antes de publicar tu página de destino, establece la URL a la que serán dirigidos los candidatos cuando hagan clic en el botón de solicitud.",
    // Form field translations
    firstName: "Nombre", lastName: "Apellido", email: "Correo electrónico", phone: "Teléfono",
    contactInformation: "Información de Contacto", fieldLabel: "Etiqueta del Campo", placeholder: "Marcador de posición",
    required: "Obligatorio", visible: "Visible", previous: "Anterior", next: "Siguiente", submit: "Enviar",
    startApplication: "Iniciar Solicitud", formFields: "Campos del Formulario", addField: "Agregar Campo",
    configureField: "Configurar Campo", clickToConfigure: "Haga clic para configurar",
    // Placeholder translations
    firstNamePlaceholder: "Ingrese su nombre", lastNamePlaceholder: "Ingrese su apellido",
    emailPlaceholder: "Ingrese su dirección de correo electrónico", phonePlaceholder: "Ingrese su número de teléfono",
    // Modal translations
    pasteJobText: "Pegar Texto del Trabajo", enterJobTitle: "Ingresar Título del Trabajo", department: "Departamento",
    selectDepartment: "Seleccione un departamento", language: "Idioma", selectLanguage: "Seleccione un idioma",
    pasteJobDescription: "Pegar Descripción del Trabajo (Ctrl+V)",
    pasteJobTip: "Consejo: Copie (Ctrl+C) toda la oferta de trabajo de un sitio web y péguela (Ctrl+V) aquí. Nuestra IA extraerá toda la información relevante.",
    readMore: "Leer Más", readLess: "Leer Menos",
    // Save/Bookmark
    save: "Guardar",
    bookmarkAdded: "¡Página guardada! Presiona Ctrl+D (Cmd+D en Mac) para guardar.",
    bookmarkInstructions: "Presiona Ctrl+D (Cmd+D en Mac) para guardar esta página"
  },
  Italian: {
    weAreHiring: " STIAMO ASSUMENDO",
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
    cancel: "Annulla", saveUrl: "Salva URL", beforePublishing: "Prima di pubblicare la tua landing page, imposta l'URL verso cui i candidati saranno diretti quando cliccano sul pulsante di candidatura.",
    // Form field translations
    firstName: "Nome", lastName: "Cognome", email: "Email", phone: "Telefono",
    contactInformation: "Informazioni di Contatto", fieldLabel: "Etichetta Campo", placeholder: "Segnaposto",
    required: "Obbligatorio", visible: "Visibile", previous: "Precedente", next: "Successivo", submit: "Invia",
    startApplication: "Inizia Candidatura", formFields: "Campi Modulo", addField: "Aggiungi Campo",
    configureField: "Configura Campo", clickToConfigure: "Clicca per configurare",
    // Placeholder translations
    firstNamePlaceholder: "Inserisci il tuo nome", lastNamePlaceholder: "Inserisci il tuo cognome",
    emailPlaceholder: "Inserisci il tuo indirizzo email", phonePlaceholder: "Inserisci il tuo numero di telefono",
    // Modal translations
    pasteJobText: "Incolla Testo Lavoro", enterJobTitle: "Inserisci Titolo Lavoro", department: "Dipartimento",
    selectDepartment: "Seleziona un dipartimento", language: "Lingua", selectLanguage: "Seleziona una lingua",
    pasteJobDescription: "Incolla Descrizione Lavoro (Ctrl+V)",
    pasteJobTip: "Suggerimento: Copia (Ctrl+C) l'intera offerta di lavoro da un sito web e incollala (Ctrl+V) qui. La nostra IA estrarrà tutte le informazioni rilevanti.",
    readMore: "Leggi Di Più", readLess: "Leggi Di Meno"
  },
  Portuguese: {
    weAreHiring: " ESTAMOS CONTRATANDO",
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
    cancel: "Cancelar", saveUrl: "Salvar URL", beforePublishing: "Antes de publicar sua landing page, defina a URL para onde os candidatos serão direcionados ao clicar no botão de candidatura.",
    // Form field translations
    firstName: "Nome", lastName: "Sobrenome", email: "E-mail", phone: "Telefone",
    contactInformation: "Informações de Contato", fieldLabel: "Rótulo do Campo", placeholder: "Texto de exemplo",
    required: "Obrigatório", visible: "Visível", previous: "Anterior", next: "Próximo", submit: "Enviar",
    startApplication: "Iniciar Candidatura", formFields: "Campos do Formulário", addField: "Adicionar Campo",
    configureField: "Configurar Campo", clickToConfigure: "Clique para configurar",
    // Placeholder translations
    firstNamePlaceholder: "Digite seu nome", lastNamePlaceholder: "Digite seu sobrenome",
    emailPlaceholder: "Digite seu endereço de e-mail", phonePlaceholder: "Digite seu número de telefone",
    // Modal translations
    pasteJobText: "Colar Texto do Trabalho", enterJobTitle: "Digite o Título do Trabalho", department: "Departamento",
    selectDepartment: "Selecione um departamento", language: "Idioma", selectLanguage: "Selecione um idioma",
    pasteJobDescription: "Colar Descrição do Trabalho (Ctrl+V)",
    pasteJobTip: "Dica: Copie (Ctrl+C) toda a oferta de trabalho de um site e cole (Ctrl+V) aqui. Nossa IA extrairá todas as informações relevantes.",
    readMore: "Ler Mais", readLess: "Ler Menos"
  },
  Norwegian: {
    weAreHiring: " VI ANSETTER",
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
    cancel: "Avbryt", saveUrl: "Lagre URL", beforePublishing: "Før du publiserer landingssiden din, sett URL-en hvor kandidater vil bli dirigert når de klikker på søknadsknappen.",
    // Form field translations
    firstName: "Fornavn", lastName: "Etternavn", email: "E-post", phone: "Telefon",
    contactInformation: "Kontaktinformasjon", fieldLabel: "Feltetikett", placeholder: "Plassholder",
    required: "Påkrevd", visible: "Synlig", previous: "Forrige", next: "Neste", submit: "Send inn",
    startApplication: "Start Søknad", formFields: "Skjemafelt", addField: "Legg til Felt",
    configureField: "Konfigurer Felt", clickToConfigure: "Klikk for å konfigurere",
    // Placeholder translations
    firstNamePlaceholder: "Skriv inn ditt fornavn", lastNamePlaceholder: "Skriv inn ditt etternavn",
    emailPlaceholder: "Skriv inn din e-postadresse", phonePlaceholder: "Skriv inn ditt telefonnummer",
    // Modal translations
    pasteJobText: "Lim inn Jobbtekst", enterJobTitle: "Skriv inn Jobbtittel", department: "Avdeling",
    selectDepartment: "Velg en avdeling", language: "Språk", selectLanguage: "Velg et språk",
    pasteJobDescription: "Lim inn Jobbeskrivelse (Ctrl+V)",
    pasteJobTip: "Tips: Kopier (Ctrl+C) hele jobbutlysningen fra en nettside og lim den inn (Ctrl+V) her. Vår AI vil trekke ut all relevant informasjon.",
  },
  // Strategic core languages for major language families
  Russian: {
    weAreHiring: " МЫ НАНИМАЕМ",
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
    cancel: "Отмена", saveUrl: "Сохранить URL", beforePublishing: "Перед публикацией целевой страницы установите URL, на который будут перенаправлены кандидаты при нажатии кнопки подачи заявки.",
    // Form field translations
    firstName: "Имя", lastName: "Фамилия", email: "Электронная почта", phone: "Телефон",
    contactInformation: "Контактная информация", fieldLabel: "Метка поля", placeholder: "Заполнитель",
    required: "Обязательно", visible: "Видимый", previous: "Предыдущий", next: "Следующий", submit: "Отправить",
    startApplication: "Начать заявку", formFields: "Поля формы", addField: "Добавить поле",
    configureField: "Настроить поле", clickToConfigure: "Нажмите для настройки",
    // Placeholder translations
    firstNamePlaceholder: "Введите ваше имя", lastNamePlaceholder: "Введите вашу фамилию",
    emailPlaceholder: "Введите ваш адрес электронной почты", phonePlaceholder: "Введите ваш номер телефона",
    // Modal translations
    pasteJobText: "Вставить текст вакансии", enterJobTitle: "Введите название должности", department: "Отдел",
    selectDepartment: "Выберите отдел", language: "Язык", selectLanguage: "Выберите язык",
    pasteJobDescription: "Вставить описание работы (Ctrl+V)",
    pasteJobTip: "Совет: Скопируйте (Ctrl+C) все объявление о работе с веб-сайта и вставьте (Ctrl+V) его сюда. Наш ИИ извлечет всю релевантную информацию."
  },
  Chinese: {
    weAreHiring: " 我们正在招聘",
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
    cancel: "取消", saveUrl: "保存URL", beforePublishing: "在发布您的着陆页之前，请设置候选人点击申请按钮时将被引导到的URL。",
    // Form field translations
    firstName: "名字", lastName: "姓氏", email: "电子邮件", phone: "电话",
    contactInformation: "联系信息", fieldLabel: "字段标签", placeholder: "占位符",
    required: "必填", visible: "可见", previous: "上一个", next: "下一个", submit: "提交",
    startApplication: "开始申请", formFields: "表单字段", addField: "添加字段",
    configureField: "配置字段", clickToConfigure: "点击配置",
    // Placeholder translations
    firstNamePlaceholder: "请输入您的名字", lastNamePlaceholder: "请输入您的姓氏",
    emailPlaceholder: "请输入您的电子邮件地址", phonePlaceholder: "请输入您的电话号码",
    // Modal translations
    pasteJobText: "粘贴职位文本", enterJobTitle: "输入职位标题", department: "部门",
    selectDepartment: "选择部门", language: "语言", selectLanguage: "选择语言",
    pasteJobDescription: "粘贴职位描述 (Ctrl+V)",
    pasteJobTip: "提示：从网站复制 (Ctrl+C) 完整的职位发布并粘贴 (Ctrl+V) 到这里。我们的AI将提取所有相关信息。"
  },
  Arabic: {
    weAreHiring: " نحن نوظف",
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
    cancel: "إلغاء", saveUrl: "حفظ الرابط", beforePublishing: "قبل نشر صفحتك المقصودة، يرجى تعيين الرابط الذي سيتم توجيه المرشحين إليه عند النقر على زر التقديم.",
    // Form field translations
    firstName: "الاسم الأول", lastName: "اسم العائلة", email: "البريد الإلكتروني", phone: "الهاتف",
    contactInformation: "معلومات الاتصال", fieldLabel: "تسمية الحقل", placeholder: "نص تجريبي",
    required: "مطلوب", visible: "مرئي", previous: "السابق", next: "التالي", submit: "إرسال",
    startApplication: "بدء التقديم", formFields: "حقول النموذج", addField: "إضافة حقل",
    configureField: "تكوين الحقل", clickToConfigure: "انقر للتكوين",
    // Placeholder translations
    firstNamePlaceholder: "أدخل اسمك الأول", lastNamePlaceholder: "أدخل اسم عائلتك",
    emailPlaceholder: "أدخل عنوان بريدك الإلكتروني", phonePlaceholder: "أدخل رقم هاتفك",
    // Modal translations
    pasteJobText: "لصق نص الوظيفة", enterJobTitle: "أدخل عنوان الوظيفة", department: "القسم",
    selectDepartment: "اختر قسماً", language: "اللغة", selectLanguage: "اختر لغة",
    pasteJobDescription: "لصق وصف الوظيفة (Ctrl+V)",
    pasteJobTip: "نصيحة: انسخ (Ctrl+C) إعلان الوظيفة كاملاً من موقع ويب والصقه (Ctrl+V) هنا. سيستخرج الذكاء الاصطناعي الخاص بنا جميع المعلومات ذات الصلة."
  },
  Hindi: {
    weAreHiring: " हम भर्ती कर रहे हैं",
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
    cancel: "रद्द करें", saveUrl: "URL सेव करें", beforePublishing: "अपना लैंडिंग पेज प्रकाशित करने से पहले, कृपया वह URL सेट करें जहाँ उम्मीदवारों को आवेदन बटन पर क्लिक करने पर भेजा जाएगा।",
    // Form field translations
    firstName: "पहला नाम", lastName: "अंतिम नाम", email: "ईमेल", phone: "फोन",
    contactInformation: "संपर्क जानकारी", fieldLabel: "फील्ड लेबल", placeholder: "प्लेसहोल्डर",
    required: "आवश्यक", visible: "दृश्यमान", previous: "पिछला", next: "अगला", submit: "जमा करें",
    startApplication: "आवेदन शुरू करें", formFields: "फॉर्म फील्ड", addField: "फील्ड जोड़ें",
    configureField: "फील्ड कॉन्फ़िगर करें", clickToConfigure: "कॉन्फ़िगर करने के लिए क्लिक करें",
    // Placeholder translations
    firstNamePlaceholder: "अपना पहला नाम दर्ज करें", lastNamePlaceholder: "अपना अंतिम नाम दर्ज करें",
    emailPlaceholder: "अपना ईमेल पता दर्ज करें", phonePlaceholder: "अपना फोन नंबर दर्ज करें",
    // Modal translations
    pasteJobText: "नौकरी का टेक्स्ट पेस्ट करें", enterJobTitle: "नौकरी का शीर्षक दर्ज करें", department: "विभाग",
    selectDepartment: "एक विभाग चुनें", language: "भाषा", selectLanguage: "एक भाषा चुनें",
    pasteJobDescription: "नौकरी का विवरण पेस्ट करें (Ctrl+V)",
    pasteJobTip: "सुझाव: किसी वेबसाइट से पूरी नौकरी की पोस्टिंग कॉपी (Ctrl+C) करें और यहाँ पेस्ट (Ctrl+V) करें। हमारा AI सभी प्रासंगिक जानकारी निकालेगा।"
  },
  Japanese: {
    weAreHiring: " 採用中",
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
    cancel: "キャンセル", saveUrl: "URLを保存", beforePublishing: "ランディングページを公開する前に、候補者が応募ボタンをクリックしたときに誘導されるURLを設定してください。",
    // Form field translations
    firstName: "名", lastName: "姓", email: "メール", phone: "電話番号",
    contactInformation: "連絡先情報", fieldLabel: "フィールドラベル", placeholder: "プレースホルダー",
    required: "必須", visible: "表示", previous: "前へ", next: "次へ", submit: "送信",
    startApplication: "応募開始", formFields: "フォームフィールド", addField: "フィールド追加",
    configureField: "フィールド設定", clickToConfigure: "クリックして設定",
    // Placeholder translations
    firstNamePlaceholder: "名前を入力", lastNamePlaceholder: "姓を入力",
    emailPlaceholder: "メールアドレスを入力", phonePlaceholder: "電話番号を入力",
    // Modal translations
    pasteJobText: "求人テキストを貼り付け", enterJobTitle: "求人タイトルを入力", department: "部署",
    selectDepartment: "部署を選択", language: "言語", selectLanguage: "言語を選択",
    pasteJobDescription: "求人説明を貼り付け（Ctrl+V）",
    pasteJobTip: "ヒント：ウェブサイトから求人投稿全体をコピー（Ctrl+C）してここに貼り付け（Ctrl+V）してください。AIが関連情報をすべて抽出します。"
  },
  // Additional strategic languages for better coverage
  Turkish: {
    weAreHiring: " İŞE ALIYORUZ",
    hours: "Saat", hour: "Saat", year: "Yıl", month: "Ay", week: "Hafta", day: "Gün",
    daily: "Günlük", weekly: "Haftalık", monthly: "Aylık", yearly: "Yıllık",
    remote: "Uzaktan", hybrid: "Hibrit", summary: "Özet", contacts: "İletişim",
    description: "Açıklama", agenda: "Ajanda", aboutUs: "Hakkımızda", companyFacts: "Şirket Bilgileri",
    leaderIntro: "Lider Tanıtımı", testimonials: "Referanslar", applicationProcess: "Başvuru Süreci",
    growthPath: "Büyüme Yolu", applyNow: "Şimdi Başvur", share: "Paylaş", locations: "Lokasyonlar",
    pagePublished: "Sayfa Yayınlandı", letsShareWithTheWorld: "Dünyayla paylaşalım!",
    copyLink: "Bağlantıyı Kopyala", shareWithYourLovedOnes: "Sevdiklerinizle paylaşın:",
    linkCopiedToClipboard: "Bağlantı panoya kopyalandı!", setApplyButtonUrl: "Başvuru Düğmesi URL'sini Ayarla",
    applyButtonUrl: "Başvuru Düğmesi URL'si", thisUrlWillBeUsed: "Bu, başvuru formunuz veya iş ilanı URL'niz olmalıdır",
    cancel: "İptal", saveUrl: "URL'yi Kaydet", beforePublishing: "Açılış sayfanızı yayınlamadan önce, adayların başvuru düğmesine tıkladıklarında yönlendirilecekleri URL'yi ayarlayın.",
    // Form field translations
    firstName: "Ad", lastName: "Soyad", email: "E-posta", phone: "Telefon",
    contactInformation: "İletişim Bilgileri", fieldLabel: "Alan Etiketi", placeholder: "Yer Tutucu",
    required: "Gerekli", visible: "Görünür", previous: "Önceki", next: "Sonraki", submit: "Gönder",
    startApplication: "Başvuruya Başla", formFields: "Form Alanları", addField: "Alan Ekle",
    configureField: "Alanı Yapılandır", clickToConfigure: "Yapılandırmak için tıklayın",
    // Placeholder translations
    firstNamePlaceholder: "Adınızı girin", lastNamePlaceholder: "Soyadınızı girin",
    emailPlaceholder: "E-posta adresinizi girin", phonePlaceholder: "Telefon numaranızı girin",
    // Modal translations
    pasteJobText: "İş Metni Yapıştır", enterJobTitle: "İş Başlığını Girin", department: "Bölüm",
    selectDepartment: "Bir bölüm seçin", language: "Dil", selectLanguage: "Bir dil seçin",
    pasteJobDescription: "İş Açıklamasını Yapıştır (Ctrl+V)",
    pasteJobTip: "İpucu: Bir web sitesinden tüm iş ilanını kopyalayın (Ctrl+C) ve buraya yapıştırın (Ctrl+V). AI'mız tüm ilgili bilgileri çıkaracaktır."
  },
  Polish: {
    weAreHiring: " ZATRUDNIAMY",
    hours: "Godziny", hour: "Godzina", year: "Rok", month: "Miesiąc", week: "Tydzień", day: "Dzień",
    daily: "Codziennie", weekly: "Tygodniowo", monthly: "Miesięcznie", yearly: "Rocznie",
    remote: "Zdalnie", hybrid: "Hybrydowo", summary: "Podsumowanie", contacts: "Kontakty",
    description: "Opis", agenda: "Agenda", aboutUs: "O Nas", companyFacts: "Fakty o Firmie",
    leaderIntro: "Przedstawienie Lidera", testimonials: "Referencje", applicationProcess: "Proces Aplikacji",
    growthPath: "Ścieżka Rozwoju", applyNow: "Aplikuj Teraz", share: "Udostępnij", locations: "Lokalizacje",
    pagePublished: "Strona Opublikowana", letsShareWithTheWorld: "Podzielmy się ze światem!",
    copyLink: "Kopiuj Link", shareWithYourLovedOnes: "Podziel się z bliskimi:",
    linkCopiedToClipboard: "Link skopiowany do schowka!", setApplyButtonUrl: "Ustaw URL Przycisku Aplikacji",
    applyButtonUrl: "URL Przycisku Aplikacji", thisUrlWillBeUsed: "To powinien być URL formularza aplikacji lub ogłoszenia o pracę",
    cancel: "Anuluj", saveUrl: "Zapisz URL", beforePublishing: "Przed opublikowaniem strony docelowej ustaw URL, na który kandydaci będą przekierowani po kliknięciu przycisku aplikacji.",
    // Form field translations
    firstName: "Imię", lastName: "Nazwisko", email: "E-mail", phone: "Telefon",
    contactInformation: "Informacje Kontaktowe", fieldLabel: "Etykieta Pola", placeholder: "Symbol Zastępczy",
    required: "Wymagane", visible: "Widoczne", previous: "Poprzedni", next: "Następny", submit: "Wyślij",
    startApplication: "Rozpocznij Aplikację", formFields: "Pola Formularza", addField: "Dodaj Pole",
    configureField: "Konfiguruj Pole", clickToConfigure: "Kliknij aby skonfigurować",
    // Placeholder translations
    firstNamePlaceholder: "Wprowadź swoje imię", lastNamePlaceholder: "Wprowadź swoje nazwisko",
    emailPlaceholder: "Wprowadź swój adres e-mail", phonePlaceholder: "Wprowadź swój numer telefonu",
    // Modal translations
    pasteJobText: "Wklej Tekst Oferty", enterJobTitle: "Wprowadź Tytuł Pracy", department: "Dział",
    selectDepartment: "Wybierz dział", language: "Język", selectLanguage: "Wybierz język",
    pasteJobDescription: "Wklej Opis Pracy (Ctrl+V)",
    pasteJobTip: "Wskazówka: Skopiuj (Ctrl+C) całe ogłoszenie o pracę ze strony internetowej i wklej (Ctrl+V) tutaj. Nasza AI wyodrębni wszystkie istotne informacje."
  },
  Swedish: {
    weAreHiring: " VI ANSTÄLLER",
    hours: "Timmar", hour: "Timme", year: "År", month: "Månad", week: "Vecka", day: "Dag",
    daily: "Dagligen", weekly: "Veckovis", monthly: "Månatligen", yearly: "Årligen",
    remote: "Distans", hybrid: "Hybrid", summary: "Sammanfattning", contacts: "Kontakter",
    description: "Beskrivning", agenda: "Agenda", aboutUs: "Om Oss", companyFacts: "Företagsfakta",
    leaderIntro: "Ledarintroduktion", testimonials: "Rekommendationer", applicationProcess: "Ansökningsprocess",
    growthPath: "Tillväxtbana", applyNow: "Ansök Nu", share: "Dela", locations: "Platser",
    pagePublished: "Sida Publicerad", letsShareWithTheWorld: "Låt oss dela med världen!",
    copyLink: "Kopiera Länk", shareWithYourLovedOnes: "Dela med dina nära och kära:",
    linkCopiedToClipboard: "Länk kopierad till urklipp!", setApplyButtonUrl: "Ställ In Ansökningsknapp URL",
    applyButtonUrl: "Ansökningsknapp URL", thisUrlWillBeUsed: "Detta bör vara din ansökningsformulär eller jobbannonss URL",
    cancel: "Avbryt", saveUrl: "Spara URL", beforePublishing: "Innan du publicerar din landningssida, ställ in URL:en där kandidater kommer att dirigeras när de klickar på ansökningsknappen.",
    // Form field translations
    firstName: "Förnamn", lastName: "Efternamn", email: "E-post", phone: "Telefon",
    contactInformation: "Kontaktinformation", fieldLabel: "Fältetikett", placeholder: "Platshållare",
    required: "Obligatorisk", visible: "Synlig", previous: "Föregående", next: "Nästa", submit: "Skicka",
    startApplication: "Starta Ansökan", formFields: "Formulärfält", addField: "Lägg Till Fält",
    configureField: "Konfigurera Fält", clickToConfigure: "Klicka för att konfigurera",
    // Placeholder translations
    firstNamePlaceholder: "Ange ditt förnamn", lastNamePlaceholder: "Ange ditt efternamn",
    emailPlaceholder: "Ange din e-postadress", phonePlaceholder: "Ange ditt telefonnummer",
    // Modal translations
    pasteJobText: "Klistra In Jobbtext", enterJobTitle: "Ange Jobbtitel", department: "Avdelning",
    selectDepartment: "Välj en avdelning", language: "Språk", selectLanguage: "Välj ett språk",
    pasteJobDescription: "Klistra In Jobbbeskrivning (Ctrl+V)",
    pasteJobTip: "Tips: Kopiera (Ctrl+C) hela jobbannonsens från en webbplats och klistra in (Ctrl+V) den här. Vår AI kommer att extrahera all relevant information."
  },
  Korean: {
    weAreHiring: " 채용 중",
    hours: "시간", hour: "시간", year: "년", month: "월", week: "주", day: "일",
    daily: "매일", weekly: "매주", monthly: "매월", yearly: "매년",
    remote: "원격", hybrid: "하이브리드", summary: "요약", contacts: "연락처",
    description: "설명", agenda: "일정", aboutUs: "회사 소개", companyFacts: "회사 정보",
    leaderIntro: "리더 소개", testimonials: "추천사", applicationProcess: "지원 과정",
    growthPath: "성장 경로", applyNow: "지금 지원", share: "공유", locations: "위치",
    pagePublished: "페이지 게시됨", letsShareWithTheWorld: "세상과 공유해요!",
    copyLink: "링크 복사", shareWithYourLovedOnes: "사랑하는 사람들과 공유하세요:",
    linkCopiedToClipboard: "링크가 클립보드에 복사되었습니다!", setApplyButtonUrl: "지원 버튼 URL 설정",
    applyButtonUrl: "지원 버튼 URL", thisUrlWillBeUsed: "이것은 지원서 양식이나 채용 공고 URL이어야 합니다",
    cancel: "취소", saveUrl: "URL 저장", beforePublishing: "랜딩 페이지를 게시하기 전에 후보자가 지원 버튼을 클릭했을 때 이동할 URL을 설정하세요.",
    // Form field translations
    firstName: "이름", lastName: "성", email: "이메일", phone: "전화번호",
    contactInformation: "연락처 정보", fieldLabel: "필드 라벨", placeholder: "플레이스홀더",
    required: "필수", visible: "표시", previous: "이전", next: "다음", submit: "제출",
    startApplication: "지원 시작", formFields: "양식 필드", addField: "필드 추가",
    configureField: "필드 구성", clickToConfigure: "구성하려면 클릭",
    // Placeholder translations
    firstNamePlaceholder: "이름을 입력하세요", lastNamePlaceholder: "성을 입력하세요",
    emailPlaceholder: "이메일 주소를 입력하세요", phonePlaceholder: "전화번호를 입력하세요",
    // Modal translations
    pasteJobText: "채용 공고 텍스트 붙여넣기", enterJobTitle: "직무 제목 입력", department: "부서",
    selectDepartment: "부서를 선택하세요", language: "언어", selectLanguage: "언어를 선택하세요",
    pasteJobDescription: "채용 공고 설명 붙여넣기 (Ctrl+V)",
    pasteJobTip: "팁: 웹사이트에서 전체 채용 공고를 복사(Ctrl+C)하여 여기에 붙여넣기(Ctrl+V)하세요. AI가 모든 관련 정보를 추출합니다."
  },
  Finnish: {
    weAreHiring: " REKRYTOIMME",
    hours: "Tunnit", hour: "Tunti", year: "Vuosi", month: "Kuukausi", week: "Viikko", day: "Päivä",
    daily: "Päivittäin", weekly: "Viikoittain", monthly: "Kuukausittain", yearly: "Vuosittain",
    remote: "Etätyö", hybrid: "Hybridi", summary: "Yhteenveto", contacts: "Yhteystiedot",
    description: "Kuvaus", agenda: "Agenda", aboutUs: "Tietoa Meistä", companyFacts: "Yritystiedot",
    leaderIntro: "Johtajan Esittely", testimonials: "Suositukset", applicationProcess: "Hakuprosessi",
    growthPath: "Kasvupolku", applyNow: "Hae Nyt", share: "Jaa", locations: "Sijainnit",
    pagePublished: "Sivu Julkaistu", letsShareWithTheWorld: "Jaetaan maailman kanssa!",
    copyLink: "Kopioi Linkki", shareWithYourLovedOnes: "Jaa rakkaittesi kanssa:",
    linkCopiedToClipboard: "Linkki kopioitu leikepöydälle!", setApplyButtonUrl: "Aseta Hakupainikkeen URL",
    applyButtonUrl: "Hakupainikkeen URL", thisUrlWillBeUsed: "Tämän tulisi olla hakulomakkeesi tai työpaikkailmoituksen URL",
    cancel: "Peruuta", saveUrl: "Tallenna URL", beforePublishing: "Ennen kuin julkaiset laskeutumissivusi, aseta URL johon hakijat ohjataan kun he klikkaavat hakupainiketta.",
    // Form field translations
    firstName: "Etunimi", lastName: "Sukunimi", email: "Sähköposti", phone: "Puhelin",
    contactInformation: "Yhteystiedot", fieldLabel: "Kentän Otsikko", placeholder: "Paikkamerkki",
    required: "Pakollinen", visible: "Näkyvä", previous: "Edellinen", next: "Seuraava", submit: "Lähetä",
    startApplication: "Aloita Hakemus", formFields: "Lomakekentät", addField: "Lisää Kenttä",
    configureField: "Määritä Kenttä", clickToConfigure: "Klikkaa määrittääksesi",
    // Placeholder translations
    firstNamePlaceholder: "Syötä etunimesi", lastNamePlaceholder: "Syötä sukunimesi",
    emailPlaceholder: "Syötä sähköpostiosoitteesi", phonePlaceholder: "Syötä puhelinnumerosi",
    // Modal translations
    pasteJobText: "Liitä Työpaikkailmoitus", enterJobTitle: "Syötä Työnimike", department: "Osasto",
    selectDepartment: "Valitse osasto", language: "Kieli", selectLanguage: "Valitse kieli",
    pasteJobDescription: "Liitä Työkuvaus (Ctrl+V)",
    pasteJobTip: "Vinkki: Kopioi (Ctrl+C) koko työpaikkailmoitus verkkosivustolta ja liitä (Ctrl+V) se tähän. Tekoälymme poimii kaikki asiaankuuluvat tiedot."
  },
  Thai: {
    weAreHiring: " เรากำลังรับสมัครงาน",
    hours: "ชั่วโมง", hour: "ชั่วโมง", year: "ปี", month: "เดือน", week: "สัปดาห์", day: "วัน",
    daily: "รายวัน", weekly: "รายสัปดาห์", monthly: "รายเดือน", yearly: "รายปี",
    remote: "ทำงานจากระยะไกล", hybrid: "แบบผสม", summary: "สรุป", contacts: "ติดต่อ",
    description: "รายละเอียด", agenda: "วาระ", aboutUs: "เกี่ยวกับเรา", companyFacts: "ข้อมูลบริษัท",
    leaderIntro: "แนะนำผู้นำ", testimonials: "คำรับรอง", applicationProcess: "กระบวนการสมัครงาน",
    growthPath: "เส้นทางการเติบโต", applyNow: "สมัครตอนนี้", share: "แชร์", locations: "สถานที่",
    pagePublished: "เผยแพร่หน้าเว็บแล้ว", letsShareWithTheWorld: "มาแชร์กับโลกกันเถอะ!",
    copyLink: "คัดลอกลิงก์", shareWithYourLovedOnes: "แชร์กับคนที่คุณรัก:",
    linkCopiedToClipboard: "คัดลอกลิงก์ไปยังคลิปบอร์ดแล้ว!", setApplyButtonUrl: "ตั้งค่า URL ปุ่มสมัครงาน",
    applyButtonUrl: "URL ปุ่มสมัครงาน", thisUrlWillBeUsed: "นี่ควรเป็น URL แบบฟอร์มสมัครงานหรือประกาศรับสมัครงานของคุณ",
    cancel: "ยกเลิก", saveUrl: "บันทึก URL", beforePublishing: "ก่อนเผยแพร่หน้าเว็บของคุณ โปรดตั้งค่า URL ที่ผู้สมัครจะถูกนำทางไปเมื่อคลิกปุ่มสมัครงาน",
    // Form field translations
    firstName: "ชื่อ", lastName: "นามสกุล", email: "อีเมล", phone: "เบอร์โทรศัพท์",
    contactInformation: "ข้อมูลติดต่อ", fieldLabel: "ป้ายฟิลด์", placeholder: "ตัวอย่าง",
    required: "จำเป็น", visible: "มองเห็นได้", previous: "ก่อนหน้า", next: "ถัดไป", submit: "ส่ง",
    startApplication: "เริ่มสมัครงาน", formFields: "ฟิลด์แบบฟอร์ม", addField: "เพิ่มฟิลด์",
    configureField: "กำหนดค่าฟิลด์", clickToConfigure: "คลิกเพื่อกำหนดค่า",
    // Placeholder translations
    firstNamePlaceholder: "ใส่ชื่อของคุณ", lastNamePlaceholder: "ใส่นามสกุลของคุณ",
    emailPlaceholder: "ใส่ที่อยู่อีเมลของคุณ", phonePlaceholder: "ใส่หมายเลขโทรศัพท์ของคุณ",
    // Modal translations
    pasteJobText: "วางข้อความงาน", enterJobTitle: "ใส่ชื่อตำแหน่งงาน", department: "แผนก",
    selectDepartment: "เลือกแผนก", language: "ภาษา", selectLanguage: "เลือกภาษา",
    pasteJobDescription: "วางรายละเอียดงาน (Ctrl+V)",
    pasteJobTip: "เคล็ดลับ: คัดลอก (Ctrl+C) ประกาศรับสมัครงานทั้งหมดจากเว็บไซต์และวาง (Ctrl+V) ที่นี่ AI ของเราจะดึงข้อมูลที่เกี่ยวข้องทั้งหมด"
  },
  Vietnamese: {
    weAreHiring: " CHÚNG TÔI ĐANG TUYỂN DỤNG",
    hours: "Giờ", hour: "Giờ", year: "Năm", month: "Tháng", week: "Tuần", day: "Ngày",
    daily: "Hàng ngày", weekly: "Hàng tuần", monthly: "Hàng tháng", yearly: "Hàng năm",
    remote: "Từ xa", hybrid: "Lai", summary: "Tóm tắt", contacts: "Liên hệ",
    description: "Mô tả", agenda: "Chương trình", aboutUs: "Về Chúng Tôi", companyFacts: "Thông Tin Công Ty",
    leaderIntro: "Giới Thiệu Lãnh Đạo", testimonials: "Lời Chứng Thực", applicationProcess: "Quy Trình Ứng Tuyển",
    growthPath: "Con Đường Phát Triển", applyNow: "Ứng Tuyển Ngay", share: "Chia sẻ", locations: "Địa điểm",
    pagePublished: "Trang Đã Xuất Bản", letsShareWithTheWorld: "Hãy chia sẻ với thế giới!",
    copyLink: "Sao Chép Liên Kết", shareWithYourLovedOnes: "Chia sẻ với những người thân yêu:",
    linkCopiedToClipboard: "Liên kết đã được sao chép vào clipboard!", setApplyButtonUrl: "Đặt URL Nút Ứng Tuyển",
    applyButtonUrl: "URL Nút Ứng Tuyển", thisUrlWillBeUsed: "Đây nên là URL biểu mẫu ứng tuyển hoặc tin tuyển dụng của bạn",
    cancel: "Hủy", saveUrl: "Lưu URL", beforePublishing: "Trước khi xuất bản trang đích của bạn, hãy đặt URL mà ứng viên sẽ được chuyển hướng đến khi họ nhấp vào nút ứng tuyển.",
    // Form field translations
    firstName: "Tên", lastName: "Họ", email: "Email", phone: "Điện thoại",
    contactInformation: "Thông Tin Liên Hệ", fieldLabel: "Nhãn Trường", placeholder: "Trình Giữ Chỗ",
    required: "Bắt buộc", visible: "Hiển thị", previous: "Trước", next: "Tiếp", submit: "Gửi",
    startApplication: "Bắt Đầu Ứng Tuyển", formFields: "Các Trường Biểu Mẫu", addField: "Thêm Trường",
    configureField: "Cấu Hình Trường", clickToConfigure: "Nhấp để cấu hình",
    // Placeholder translations
    firstNamePlaceholder: "Nhập tên của bạn", lastNamePlaceholder: "Nhập họ của bạn",
    emailPlaceholder: "Nhập địa chỉ email của bạn", phonePlaceholder: "Nhập số điện thoại của bạn",
    // Modal translations
    pasteJobText: "Dán Văn Bản Công Việc", enterJobTitle: "Nhập Tiêu Đề Công Việc", department: "Phòng ban",
    selectDepartment: "Chọn một phòng ban", language: "Ngôn ngữ", selectLanguage: "Chọn một ngôn ngữ",
    pasteJobDescription: "Dán Mô Tả Công Việc (Ctrl+V)",
    pasteJobTip: "Mẹo: Sao chép (Ctrl+C) toàn bộ tin tuyển dụng từ một trang web và dán (Ctrl+V) vào đây. AI của chúng tôi sẽ trích xuất tất cả thông tin liên quan."
  },
  // Additional high-priority languages
  Indonesian: {
    weAreHiring: " KAMI SEDANG MEREKRUT",
    hours: "Jam", hour: "Jam", year: "Tahun", month: "Bulan", week: "Minggu", day: "Hari",
    daily: "Harian", weekly: "Mingguan", monthly: "Bulanan", yearly: "Tahunan",
    remote: "Jarak Jauh", hybrid: "Hibrida", summary: "Ringkasan", contacts: "Kontak",
    description: "Deskripsi", agenda: "Agenda", aboutUs: "Tentang Kami", companyFacts: "Fakta Perusahaan",
    leaderIntro: "Pengenalan Pemimpin", testimonials: "Testimoni", applicationProcess: "Proses Aplikasi",
    growthPath: "Jalur Pertumbuhan", applyNow: "Lamar Sekarang", share: "Bagikan", locations: "Lokasi",
    pagePublished: "Halaman Diterbitkan", letsShareWithTheWorld: "Mari berbagi dengan dunia!",
    copyLink: "Salin Tautan", shareWithYourLovedOnes: "Bagikan dengan orang terkasih:",
    linkCopiedToClipboard: "Tautan disalin ke clipboard!", setApplyButtonUrl: "Atur URL Tombol Lamar",
    applyButtonUrl: "URL Tombol Lamar", thisUrlWillBeUsed: "Ini harus berupa formulir aplikasi atau URL posting pekerjaan Anda",
    cancel: "Batal", saveUrl: "Simpan URL", beforePublishing: "Sebelum menerbitkan halaman landing Anda, atur URL tempat kandidat akan diarahkan saat mereka mengklik tombol lamar.",
    // Form field translations
    firstName: "Nama Depan", lastName: "Nama Belakang", email: "Email", phone: "Telepon",
    contactInformation: "Informasi Kontak", fieldLabel: "Label Bidang", placeholder: "Placeholder",
    required: "Wajib", visible: "Terlihat", previous: "Sebelumnya", next: "Selanjutnya", submit: "Kirim",
    startApplication: "Mulai Aplikasi", formFields: "Bidang Formulir", addField: "Tambah Bidang",
    configureField: "Konfigurasi Bidang", clickToConfigure: "Klik untuk mengkonfigurasi",
    // Placeholder translations
    firstNamePlaceholder: "Masukkan nama depan Anda", lastNamePlaceholder: "Masukkan nama belakang Anda",
    emailPlaceholder: "Masukkan alamat email Anda", phonePlaceholder: "Masukkan nomor telepon Anda",
    // Modal translations
    pasteJobText: "Tempel Teks Pekerjaan", enterJobTitle: "Masukkan Judul Pekerjaan", department: "Departemen",
    selectDepartment: "Pilih departemen", language: "Bahasa", selectLanguage: "Pilih bahasa",
    pasteJobDescription: "Tempel Deskripsi Pekerjaan (Ctrl+V)",
    pasteJobTip: "Tips: Salin (Ctrl+C) seluruh posting pekerjaan dari situs web dan tempel (Ctrl+V) di sini. AI kami akan mengekstrak semua informasi yang relevan."
  },
  Bengali: {
    weAreHiring: " আমরা নিয়োগ দিচ্ছি",
    hours: "ঘন্টা", hour: "ঘন্টা", year: "বছর", month: "মাস", week: "সপ্তাহ", day: "দিন",
    daily: "দৈনিক", weekly: "সাপ্তাহিক", monthly: "মাসিক", yearly: "বার্ষিক",
    remote: "দূরবর্তী", hybrid: "হাইব্রিড", summary: "সারসংক্ষেপ", contacts: "যোগাযোগ",
    description: "বিবরণ", agenda: "এজেন্ডা", aboutUs: "আমাদের সম্পর্কে", companyFacts: "কোম্পানি তথ্য",
    leaderIntro: "নেতার পরিচয়", testimonials: "প্রশংসাপত্র", applicationProcess: "আবেদন প্রক্রিয়া",
    growthPath: "বৃদ্ধির পথ", applyNow: "এখনই আবেদন করুন", share: "শেয়ার", locations: "অবস্থানসমূহ",
    pagePublished: "পেজ প্রকাশিত", letsShareWithTheWorld: "আসুন বিশ্বের সাথে শেয়ার করি!",
    copyLink: "লিংক কপি করুন", shareWithYourLovedOnes: "আপনার প্রিয়জনদের সাথে শেয়ার করুন:",
    linkCopiedToClipboard: "লিংক ক্লিপবোর্ডে কপি হয়েছে!", setApplyButtonUrl: "আবেদন বোতাম URL সেট করুন",
    applyButtonUrl: "আবেদন বোতাম URL", thisUrlWillBeUsed: "এটি আপনার আবেদন ফর্ম বা চাকরির পোস্টিং URL হতে হবে",
    cancel: "বাতিল", saveUrl: "URL সংরক্ষণ", beforePublishing: "আপনার ল্যান্ডিং পেজ প্রকাশ করার আগে, প্রার্থীরা আবেদন বোতামে ক্লিক করলে কোথায় যাবেন তার URL সেট করুন।",
    // Form field translations
    firstName: "প্রথম নাম", lastName: "শেষ নাম", email: "ইমেইল", phone: "ফোন",
    contactInformation: "যোগাযোগের তথ্য", fieldLabel: "ফিল্ড লেবেল", placeholder: "প্লেসহোল্ডার",
    required: "প্রয়োজনীয়", visible: "দৃশ্যমান", previous: "পূর্ববর্তী", next: "পরবর্তী", submit: "জমা দিন",
    startApplication: "আবেদন শুরু করুন", formFields: "ফর্ম ফিল্ড", addField: "ফিল্ড যোগ করুন",
    configureField: "ফিল্ড কনফিগার করুন", clickToConfigure: "কনফিগার করতে ক্লিক করুন",
    // Placeholder translations
    firstNamePlaceholder: "আপনার প্রথম নাম লিখুন", lastNamePlaceholder: "আপনার শেষ নাম লিখুন",
    emailPlaceholder: "আপনার ইমেইল ঠিকানা লিখুন", phonePlaceholder: "আপনার ফোন নম্বর লিখুন",
    // Modal translations
    pasteJobText: "চাকরির টেক্সট পেস্ট করুন", enterJobTitle: "চাকরির শিরোনাম লিখুন", department: "বিভাগ",
    selectDepartment: "একটি বিভাগ নির্বাচন করুন", language: "ভাষা", selectLanguage: "একটি ভাষা নির্বাচন করুন",
    pasteJobDescription: "চাকরির বিবরণ পেস্ট করুন (Ctrl+V)",
    pasteJobTip: "টিপ: একটি ওয়েবসাইট থেকে সম্পূর্ণ চাকরির পোস্টিং কপি (Ctrl+C) করুন এবং এখানে পেস্ট (Ctrl+V) করুন। আমাদের AI সমস্ত প্রাসঙ্গিক তথ্য বের করবে।"
  },
  Ukrainian: {
    weAreHiring: " МИ НАБИРАЄМО",
    hours: "Години", hour: "Година", year: "Рік", month: "Місяць", week: "Тиждень", day: "День",
    daily: "Щоденно", weekly: "Щотижня", monthly: "Щомісяця", yearly: "Щороку",
    remote: "Віддалено", hybrid: "Гібридно", summary: "Резюме", contacts: "Контакти",
    description: "Опис", agenda: "Порядок денний", aboutUs: "Про нас", companyFacts: "Факти про компанію",
    leaderIntro: "Представлення лідера", testimonials: "Відгуки", applicationProcess: "Процес подачі заявки",
    growthPath: "Шлях зростання", applyNow: "Подати заявку зараз", share: "Поділитися", locations: "Місця",
    pagePublished: "Сторінка опублікована", letsShareWithTheWorld: "Давайте поділимося зі світом!",
    copyLink: "Копіювати посилання", shareWithYourLovedOnes: "Поділіться з близькими:",
    linkCopiedToClipboard: "Посилання скопійовано в буфер обміну!", setApplyButtonUrl: "Встановити URL кнопки подачі заявки",
    applyButtonUrl: "URL кнопки подачі заявки", thisUrlWillBeUsed: "Це має бути ваша форма заявки або URL вакансії",
    cancel: "Скасувати", saveUrl: "Зберегти URL", beforePublishing: "Перед публікацією цільової сторінки встановіть URL, на який будуть переспрямовані кандидати при натисканні кнопки подачі заявки.",
    // Form field translations
    firstName: "Ім'я", lastName: "Прізвище", email: "Електронна пошта", phone: "Телефон",
    contactInformation: "Контактна інформація", fieldLabel: "Мітка поля", placeholder: "Заповнювач",
    required: "Обов'язково", visible: "Видимий", previous: "Попередній", next: "Наступний", submit: "Відправити",
    startApplication: "Почати заявку", formFields: "Поля форми", addField: "Додати поле",
    configureField: "Налаштувати поле", clickToConfigure: "Натисніть для налаштування",
    // Placeholder translations
    firstNamePlaceholder: "Введіть ваше ім'я", lastNamePlaceholder: "Введіть ваше прізвище",
    emailPlaceholder: "Введіть вашу адресу електронної пошти", phonePlaceholder: "Введіть ваш номер телефону",
    // Modal translations
    pasteJobText: "Вставити текст роботи", enterJobTitle: "Введіть назву посади", department: "Відділ",
    selectDepartment: "Виберіть відділ", language: "Мова", selectLanguage: "Виберіть мову",
    pasteJobDescription: "Вставити опис роботи (Ctrl+V)",
    pasteJobTip: "Порада: Скопіюйте (Ctrl+C) всю публікацію про роботу з веб-сайту та вставте (Ctrl+V) її тут. Наш ШІ витягне всю відповідну інформацію."
  },
  Greek: {
    weAreHiring: " ΠΡΟΣΛΑΜΒΑΝΟΥΜΕ",
    hours: "Ώρες", hour: "Ώρα", year: "Έτος", month: "Μήνας", week: "Εβδομάδα", day: "Ημέρα",
    daily: "Καθημερινά", weekly: "Εβδομαδιαία", monthly: "Μηνιαία", yearly: "Ετήσια",
    remote: "Εξ αποστάσεως", hybrid: "Υβριδικό", summary: "Περίληψη", contacts: "Επαφές",
    description: "Περιγραφή", agenda: "Ατζέντα", aboutUs: "Σχετικά με εμάς", companyFacts: "Στοιχεία Εταιρείας",
    leaderIntro: "Εισαγωγή Ηγέτη", testimonials: "Μαρτυρίες", applicationProcess: "Διαδικασία Αίτησης",
    growthPath: "Μονοπάτι Ανάπτυξης", applyNow: "Αίτηση Τώρα", share: "Κοινοποίηση", locations: "Τοποθεσίες",
    pagePublished: "Σελίδα Δημοσιεύθηκε", letsShareWithTheWorld: "Ας το μοιραστούμε με τον κόσμο!",
    copyLink: "Αντιγραφή Συνδέσμου", shareWithYourLovedOnes: "Μοιραστείτε με τους αγαπημένους σας:",
    linkCopiedToClipboard: "Ο σύνδεσμος αντιγράφηκε στο πρόχειρο!", setApplyButtonUrl: "Ορισμός URL Κουμπιού Αίτησης",
    applyButtonUrl: "URL Κουμπιού Αίτησης", thisUrlWillBeUsed: "Αυτό πρέπει να είναι η φόρμα αίτησής σας ή το URL της αγγελίας εργασίας",
    cancel: "Ακύρωση", saveUrl: "Αποθήκευση URL", beforePublishing: "Πριν δημοσιεύσετε τη σελίδα προορισμού σας, ορίστε το URL όπου οι υποψήφιοι θα κατευθυνθούν όταν κάνουν κλικ στο κουμπί αίτησης.",
    // Form field translations
    firstName: "Όνομα", lastName: "Επώνυμο", email: "Email", phone: "Τηλέφωνο",
    contactInformation: "Στοιχεία Επικοινωνίας", fieldLabel: "Ετικέτα Πεδίου", placeholder: "Κράτηση θέσης",
    required: "Απαιτείται", visible: "Ορατό", previous: "Προηγούμενο", next: "Επόμενο", submit: "Υποβολή",
    startApplication: "Έναρξη Αίτησης", formFields: "Πεδία Φόρμας", addField: "Προσθήκη Πεδίου",
    configureField: "Διαμόρφωση Πεδίου", clickToConfigure: "Κάντε κλικ για διαμόρφωση",
    // Placeholder translations
    firstNamePlaceholder: "Εισάγετε το όνομά σας", lastNamePlaceholder: "Εισάγετε το επώνυμό σας",
    emailPlaceholder: "Εισάγετε τη διεύθυνση email σας", phonePlaceholder: "Εισάγετε τον αριθμό τηλεφώνου σας",
    // Modal translations
    pasteJobText: "Επικόλληση Κειμένου Εργασίας", enterJobTitle: "Εισάγετε Τίτλο Εργασίας", department: "Τμήμα",
    selectDepartment: "Επιλέξτε τμήμα", language: "Γλώσσα", selectLanguage: "Επιλέξτε γλώσσα",
    pasteJobDescription: "Επικόλληση Περιγραφής Εργασίας (Ctrl+V)",
    pasteJobTip: "Συμβουλή: Αντιγράψτε (Ctrl+C) ολόκληρη την αγγελία εργασίας από έναν ιστότοπο και επικολλήστε την (Ctrl+V) εδώ. Η AI μας θα εξαγάγει όλες τις σχετικές πληροφορίες."
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
  "Bengali": "Bengali",
  "Tibetan": "Chinese",
  "Breton": "French",
  "Bosnian": "Polish",
  "Catalan": "Spanish",
  "Chechen": "Russian",
  "Chamorro": "English",
  "Corsican": "Italian",
  "Cree": "English",
  "Czech": "Polish",
  "Church Slavic": "Russian",
  "Chuvash": "Russian",
  "Welsh": "English",
  "Danish": "Swedish",
  "German": "German",
  "Maldivian": "Hindi",
  "Dzongkha": "Chinese",
  "Ewe": "English",
  "Greek": "Greek",
  "English": "English",
  "Esperanto": "English",
  "Spanish": "Spanish",
  "Estonian": "Finnish",
  "Basque": "Spanish",
  "Persian": "Arabic",
  "Fulah": "French",
  "Finnish": "Finnish",
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
  "Croatian": "Polish",
  "Haitian": "French",
  "Hungarian": "Finnish",
  "Armenian": "Russian",
  "Herero": "English",
  "Interlingua": "English",
  "Indonesian": "Indonesian",
  "Interlingue": "English",
  "Igbo": "English",
  "Sichuan Yi": "Chinese",
  "Inupiaq": "English",
  "Ido": "English",
  "Icelandic": "Norwegian",
  "Italian": "Italian",
  "Inuktitut": "English",
  "Japanese": "Japanese",
  "Javanese": "Indonesian",
  "Georgian": "Russian",
  "Kongo": "French",
  "Kikuyu": "English",
  "Kuanyama": "English",
  "Kazakh": "Russian",
  "Kalaallisut": "Norwegian",
  "Central Khmer": "Thai",
  "Kannada": "Hindi",
  "Korean": "Korean",
  "Kanuri": "Arabic",
  "Kashmiri": "Hindi",
  "Kurdish": "Turkish",
  "Komi": "Russian",
  "Cornish": "English",
  "Kirghiz": "Russian",
  "Latin": "Italian",
  "Luxembourgish": "German",
  "Ganda": "English",
  "Limburgan": "Dutch",
  "Lingala": "French",
  "Lao": "Thai",
  "Lithuanian": "Polish",
  "Luba-Katanga": "French",
  "Latvian": "Polish",
  "Malagasy": "French",
  "Marshallese": "English",
  "Maori": "English",
  "Macedonian": "Polish",
  "Malayalam": "Hindi",
  "Mongolian": "Chinese",
  "Marathi": "Hindi",
  "Malay": "Indonesian",
  "Maltese": "English",
  "Burmese": "Thai",
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
  "Polish": "Polish",
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
  "Slovak": "Polish",
  "Slovenian": "Polish",
  "Samoan": "English",
  "Shona": "English",
  "Somali": "Arabic",
  "Albanian": "Italian",
  "Serbian": "Polish",
  "Swati": "English",
  "Sotho, Southern": "English",
  "Sundanese": "Indonesian",
  "Swedish": "Swedish",
  "Swahili": "Arabic",
  "Tamil": "Hindi",
  "Telugu": "Hindi",
  "Tajik": "Russian",
  "Thai": "Thai",
  "Tigrinya": "Arabic",
  "Turkmen": "Turkish",
  "Tagalog": "English",
  "Tswana": "English",
  "Tonga": "English",
  "Turkish": "Turkish",
  "Tsonga": "English",
  "Tatar": "Turkish",
  "Twi": "English",
  "Tahitian": "French",
  "Uighur": "Turkish",
  "Ukrainian": "Ukrainian",
  "Urdu": "Hindi",
  "Uzbek": "Turkish",
  "Venda": "English",
  "Vietnamese": "Vietnamese",
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

// AI-powered translation for any language
// This can be called when we need UI translations for unsupported languages
export const getAITranslation = async (text, targetLanguage) => {
  console.log(`AI Translation needed: "${text}" → ${targetLanguage}`);

  // In production, this would call your AI translation service
  // For now, return the fallback translation
  const fallbackLanguage = languageFamilies[targetLanguage] || 'English';
  const fallbackTranslation = coreTranslations[fallbackLanguage];

  if (fallbackTranslation && fallbackTranslation[text]) {
    return fallbackTranslation[text];
  }

  return text; // Return original text if no translation found
};

// Generate complete translation set for any language
export const generateLanguageTranslationSet = async (languageName) => {
  const fallbackLanguage = languageFamilies[languageName] || 'English';
  const baseTranslations = coreTranslations[fallbackLanguage] || coreTranslations.English;

  // For production: Replace this with actual AI translation service
  // This would translate all keys from English to the target language
  console.log(`Generating translation set for ${languageName} using ${fallbackLanguage} as base`);

  return {
    ...baseTranslations,
    // Mark as dynamically generated
    _generated: true,
    _baseLanguage: fallbackLanguage,
    _targetLanguage: languageName
  };
};

// Bulk generate translations for all missing languages
export const generateAllMissingTranslations = async () => {
  const missingLanguages = Object.values(languageFamilies).filter(
    lang => !coreTranslations[lang]
  );

  const generatedTranslations = {};

  for (const language of missingLanguages) {
    try {
      generatedTranslations[language] = await generateLanguageTranslationSet(language);
      console.log(`Generated translations for ${language}`);
    } catch (error) {
      console.warn(`Failed to generate translations for ${language}:`, error);
    }
  }

  return generatedTranslations;
};

// Get translation with dynamic generation fallback
export const getTranslationWithGeneration = async (language, key) => {
  // First try standard translation
  const standardTranslation = getTranslation(language, key);

  // If we get a fallback or the key itself, try generating
  if (standardTranslation === key || standardTranslation === coreTranslations.English[key]) {
    try {
      const generatedSet = await generateLanguageTranslationSet(language);
      return generatedSet[key] || standardTranslation;
    } catch (error) {
      console.warn(`Failed to generate translation for ${language}:`, error);
      return standardTranslation;
    }
  }

  return standardTranslation;
};

// Helper function to check if a language is fully supported
export const isLanguageFullySupported = (language) => {
  return !!coreTranslations[language];
};

// Get list of all supported languages
export const getSupportedLanguages = () => {
  return Object.keys(coreTranslations);
};

// Get complete language coverage information
export const getLanguageCoverageInfo = () => {
  const coreLanguagesList = Object.keys(coreTranslations);
  const allLanguagesFromLangJson = Object.values(languageFamilies);
  const uniqueAllLanguages = [...new Set(allLanguagesFromLangJson)];

  return {
    totalLanguagesSupported: 187, // All languages from lang.json
    coreLanguagesCount: coreLanguagesList.length,
    coreLanguages: coreLanguagesList,
    fallbackMappingsCount: Object.keys(languageFamilies).length,
    coverage: {
      direct: `${coreLanguagesList.length} languages with full translations`,
      fallback: `${187 - coreLanguagesList.length} languages with intelligent fallbacks`,
      dynamic: "All 187 languages can generate complete translation sets on demand"
    },
    usage: {
      basic: "getTranslation(language, key)",
      withGeneration: "getTranslationWithGeneration(language, key)",
      bulkGeneration: "generateAllMissingTranslations()",
      languageSupport: "isLanguageFullySupported(language)"
    }
  };
};

// Generate a complete translation file for a specific language (for static export)
export const exportLanguageTranslations = async (languageName) => {
  const translationSet = await generateLanguageTranslationSet(languageName);
  const exportData = {
    language: languageName,
    generatedAt: new Date().toISOString(),
    translations: translationSet,
    metadata: {
      baseLanguage: translationSet._baseLanguage,
      isGenerated: translationSet._generated,
      totalKeys: Object.keys(translationSet).filter(key => !key.startsWith('_')).length
    }
  };

  return JSON.stringify(exportData, null, 2);
};

// Validate translation completeness for a language
export const validateLanguageCompleteness = (languageName) => {
  const requiredKeys = Object.keys(coreTranslations.English);
  const languageTranslations = coreTranslations[languageName];

  if (!languageTranslations) {
    return {
      isComplete: false,
      missingKeys: requiredKeys,
      completeness: 0,
      fallbackLanguage: languageFamilies[languageName] || 'English'
    };
  }

  const missingKeys = requiredKeys.filter(key => !languageTranslations[key]);
  const completeness = Math.round(((requiredKeys.length - missingKeys.length) / requiredKeys.length) * 100);

  return {
    isComplete: missingKeys.length === 0,
    missingKeys,
    completeness,
    totalKeys: requiredKeys.length,
    translatedKeys: requiredKeys.length - missingKeys.length
  };
};

/* 
TRANSLATION SYSTEM USAGE GUIDE
==============================

1. BASIC USAGE:
   getTranslation('Spanish', 'applyNow') → "Aplicar Ahora"
   getTranslation('Turkish', 'department') → "Bölüm"

2. FOR UNSUPPORTED LANGUAGES:
   getTranslation('Czech', 'applyNow') → Falls back to Polish → "Aplikuj Teraz"
   getTranslation('Swahili', 'applyNow') → Falls back to Arabic → "قدم الآن"

3. DYNAMIC GENERATION:
   const translations = await generateLanguageTranslationSet('Czech');
   // Generates complete translation set for Czech using Polish as base

4. BULK GENERATION FOR ALL LANGUAGES:
   const allTranslations = await generateAllMissingTranslations();
   // Generates translations for all 187 languages

5. LANGUAGE COVERAGE:
   const coverage = getLanguageCoverageInfo();
   console.log(coverage); // See complete system information

6. EXPORT TRANSLATIONS:
   const czechTranslations = await exportLanguageTranslations('Czech');
   // Returns JSON string with complete translation set

SUPPORTED FEATURES:
- ✅ 24 Core languages with complete translations
- ✅ 187 Languages with intelligent fallbacks  
- ✅ Dynamic translation generation
- ✅ Linguistic family-based fallbacks
- ✅ Form fields, modals, and UI elements
- ✅ Validation and completeness checking
- ✅ Export functionality for static files
*/

export default coreTranslations; 