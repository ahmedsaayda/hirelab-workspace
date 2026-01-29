import React, { useState, useEffect, useMemo } from "react";
import { Modal, Select, message as antdMessage, Spin } from "antd";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { selectUser } from "../../../redux/auth/selectors.js";
import CrudService from "../../../services/CrudService.js";
import AiService from "../../../services/AiService.js";
import UploadService from "../../../services/UploadService.js";
import { refreshUserData } from "../../../utils/userRefresh.js";

const { Option } = Select;

// Language-specific default content for multi-job campaigns
const getMultiJobTranslations = (language, companyName) => {
    const translations = {
        English: {
            ourOpenPositions: "Our Open Positions",
            meetTheTeam: "Meet the Team",
            aboutUs: "About Us",
            whyJoinUs: "Why Join Us",
            whatOurTeamSays: "What Our Team Says",
            exploreOpenPositions: "Explore Open Positions",
            findTheRole: "Find the role that matches your skills and ambitions.",
            reachOutToUs: "Reach out to us!",
            haveQuestions: `Have questions about opportunities at ${companyName}? Our talent team is ready to help you find your perfect role.`,
            discover: `Discover ${companyName}`,
            buildingSomethingSpecial: `At ${companyName}, we're building something special. Our team is driven by a shared passion for excellence and a commitment to creating value for our customers and communities.`,
            greatWorkHappens: `We believe that great work happens when talented people are given the freedom to innovate, collaborate, and grow. At ${companyName}, you'll find a supportive environment where your ideas matter and your contributions make a real difference.`,
            joinTeamDescription: `Join ${companyName} and be part of a team that values innovation, collaboration, and personal growth. We offer competitive benefits, flexible work arrangements, and the opportunity to make a real impact.`,
            footerTitle: "Ready to take the next step in your career?",
            footerDescription: "Explore our exciting job opportunities and apply today!",
            // Application Process
            applicationProcess: "Application Process",
            howToJoinUs: "How to Join Us",
        },
        German: {
            ourOpenPositions: "Unsere Offenen Stellen",
            meetTheTeam: "Lernen Sie das Team kennen",
            aboutUs: "Über Uns",
            whyJoinUs: "Warum zu uns",
            whatOurTeamSays: "Was unser Team sagt",
            exploreOpenPositions: "Entdecken Sie offene Stellen",
            findTheRole: "Finden Sie die Rolle, die zu Ihren Fähigkeiten und Ambitionen passt.",
            reachOutToUs: "Kontaktieren Sie uns!",
            haveQuestions: `Haben Sie Fragen zu Karrieremöglichkeiten bei ${companyName}? Unser Recruiting-Team hilft Ihnen gerne, die perfekte Position zu finden.`,
            discover: `Entdecken Sie ${companyName}`,
            buildingSomethingSpecial: `Bei ${companyName} bauen wir etwas Besonderes auf. Unser Team wird von einer gemeinsamen Leidenschaft für Exzellenz und dem Engagement angetrieben, Mehrwert für unsere Kunden und Gemeinschaften zu schaffen.`,
            greatWorkHappens: `Wir glauben, dass großartige Arbeit entsteht, wenn talentierte Menschen die Freiheit haben, zu innovieren, zusammenzuarbeiten und zu wachsen. Bei ${companyName} finden Sie ein unterstützendes Umfeld, in dem Ihre Ideen zählen und Ihre Beiträge einen echten Unterschied machen.`,
            joinTeamDescription: `Werden Sie Teil von ${companyName} und einem Team, das Innovation, Zusammenarbeit und persönliches Wachstum schätzt. Wir bieten wettbewerbsfähige Vorteile, flexible Arbeitsregelungen und die Möglichkeit, echte Wirkung zu erzielen.`,
            footerTitle: "Bereit für den nächsten Karriereschritt?",
            footerDescription: "Entdecken Sie unsere spannenden Jobangebote und bewerben Sie sich noch heute!",
            applicationProcess: "Bewerbungsprozess",
            howToJoinUs: "Wie Sie uns beitreten",
        },
        Dutch: {
            ourOpenPositions: "Onze Openstaande Vacatures",
            meetTheTeam: "Ontmoet het Team",
            aboutUs: "Over Ons",
            whyJoinUs: "Waarom bij ons werken",
            whatOurTeamSays: "Wat ons team zegt",
            exploreOpenPositions: "Ontdek openstaande posities",
            findTheRole: "Vind de rol die past bij jouw vaardigheden en ambities.",
            reachOutToUs: "Neem contact met ons op!",
            haveQuestions: `Heb je vragen over mogelijkheden bij ${companyName}? Ons talent team staat klaar om je te helpen de perfecte functie te vinden.`,
            discover: `Ontdek ${companyName}`,
            buildingSomethingSpecial: `Bij ${companyName} bouwen we iets bijzonders. Ons team wordt gedreven door een gedeelde passie voor excellentie en een toewijding om waarde te creëren voor onze klanten en gemeenschappen.`,
            greatWorkHappens: `Wij geloven dat geweldig werk ontstaat wanneer getalenteerde mensen de vrijheid krijgen om te innoveren, samen te werken en te groeien. Bij ${companyName} vind je een ondersteunende omgeving waar jouw ideeën ertoe doen en jouw bijdragen echt verschil maken.`,
            joinTeamDescription: `Word onderdeel van ${companyName} en een team dat innovatie, samenwerking en persoonlijke groei waardeert. Wij bieden competitieve voordelen, flexibele werkregelingen en de kans om echt impact te maken.`,
            footerTitle: "Klaar voor de volgende stap in je carrière?",
            footerDescription: "Ontdek onze spannende vacatures en solliciteer vandaag nog!",
            applicationProcess: "Sollicitatieproces",
            howToJoinUs: "Hoe solliciteren",
        },
        French: {
            ourOpenPositions: "Nos Postes Ouverts",
            meetTheTeam: "Rencontrez l'Équipe",
            aboutUs: "À Propos de Nous",
            whyJoinUs: "Pourquoi nous rejoindre",
            whatOurTeamSays: "Ce que notre équipe dit",
            exploreOpenPositions: "Découvrez nos postes ouverts",
            findTheRole: "Trouvez le poste qui correspond à vos compétences et ambitions.",
            reachOutToUs: "Contactez-nous !",
            haveQuestions: `Des questions sur les opportunités chez ${companyName} ? Notre équipe de recrutement est prête à vous aider à trouver le poste idéal.`,
            discover: `Découvrez ${companyName}`,
            buildingSomethingSpecial: `Chez ${companyName}, nous construisons quelque chose de spécial. Notre équipe est animée par une passion partagée pour l'excellence et un engagement à créer de la valeur pour nos clients et nos communautés.`,
            greatWorkHappens: `Nous croyons que le travail exceptionnel se produit lorsque les personnes talentueuses ont la liberté d'innover, de collaborer et de grandir. Chez ${companyName}, vous trouverez un environnement favorable où vos idées comptent et vos contributions font vraiment la différence.`,
            joinTeamDescription: `Rejoignez ${companyName} et faites partie d'une équipe qui valorise l'innovation, la collaboration et la croissance personnelle. Nous offrons des avantages compétitifs, des arrangements de travail flexibles et l'opportunité de faire un vrai impact.`,
            footerTitle: "Prêt à franchir la prochaine étape de votre carrière ?",
            footerDescription: "Découvrez nos offres d'emploi passionnantes et postulez dès aujourd'hui !",
            applicationProcess: "Processus de candidature",
            howToJoinUs: "Comment nous rejoindre",
        },
        Spanish: {
            ourOpenPositions: "Nuestras Posiciones Abiertas",
            meetTheTeam: "Conoce al Equipo",
            aboutUs: "Sobre Nosotros",
            whyJoinUs: "Por qué unirse a nosotros",
            whatOurTeamSays: "Lo que dice nuestro equipo",
            exploreOpenPositions: "Explora las posiciones abiertas",
            findTheRole: "Encuentra el puesto que coincide con tus habilidades y ambiciones.",
            reachOutToUs: "¡Contáctanos!",
            haveQuestions: `¿Tienes preguntas sobre oportunidades en ${companyName}? Nuestro equipo de talento está listo para ayudarte a encontrar tu puesto perfecto.`,
            discover: `Descubre ${companyName}`,
            buildingSomethingSpecial: `En ${companyName}, estamos construyendo algo especial. Nuestro equipo está impulsado por una pasión compartida por la excelencia y un compromiso de crear valor para nuestros clientes y comunidades.`,
            greatWorkHappens: `Creemos que el gran trabajo sucede cuando las personas talentosas tienen la libertad de innovar, colaborar y crecer. En ${companyName}, encontrarás un ambiente de apoyo donde tus ideas importan y tus contribuciones hacen una diferencia real.`,
            joinTeamDescription: `Únete a ${companyName} y sé parte de un equipo que valora la innovación, la colaboración y el crecimiento personal. Ofrecemos beneficios competitivos, arreglos de trabajo flexibles y la oportunidad de hacer un impacto real.`,
            footerTitle: "¿Listo para dar el siguiente paso en tu carrera?",
            footerDescription: "¡Descubre nuestras emocionantes oportunidades de trabajo y aplica hoy!",
            applicationProcess: "Proceso de solicitud",
            howToJoinUs: "Cómo unirte a nosotros",
        },
        Italian: {
            ourOpenPositions: "Le Nostre Posizioni Aperte",
            meetTheTeam: "Conosci il Team",
            aboutUs: "Chi Siamo",
            whyJoinUs: "Perché unirsi a noi",
            whatOurTeamSays: "Cosa dice il nostro team",
            exploreOpenPositions: "Esplora le posizioni aperte",
            findTheRole: "Trova il ruolo che corrisponde alle tue competenze e ambizioni.",
            reachOutToUs: "Contattaci!",
            haveQuestions: `Hai domande sulle opportunità in ${companyName}? Il nostro team di recruiting è pronto ad aiutarti a trovare la posizione perfetta.`,
            discover: `Scopri ${companyName}`,
            buildingSomethingSpecial: `In ${companyName}, stiamo costruendo qualcosa di speciale. Il nostro team è guidato da una passione condivisa per l'eccellenza e un impegno a creare valore per i nostri clienti e le nostre comunità.`,
            greatWorkHappens: `Crediamo che il grande lavoro avvenga quando le persone di talento hanno la libertà di innovare, collaborare e crescere. In ${companyName}, troverai un ambiente di supporto dove le tue idee contano e i tuoi contributi fanno davvero la differenza.`,
            joinTeamDescription: `Unisciti a ${companyName} e fai parte di un team che valorizza l'innovazione, la collaborazione e la crescita personale. Offriamo benefit competitivi, flessibilità lavorativa e l'opportunità di fare un impatto reale.`,
            footerTitle: "Pronto a fare il prossimo passo nella tua carriera?",
            footerDescription: "Scopri le nostre entusiasmanti opportunità di lavoro e candidati oggi!",
            applicationProcess: "Processo di candidatura",
            howToJoinUs: "Come unirti a noi",
        },
        Portuguese: {
            ourOpenPositions: "Nossas Vagas Abertas",
            meetTheTeam: "Conheça a Equipe",
            aboutUs: "Sobre Nós",
            whyJoinUs: "Por que se juntar a nós",
            whatOurTeamSays: "O que nossa equipe diz",
            exploreOpenPositions: "Explore as vagas abertas",
            findTheRole: "Encontre a função que combina com suas habilidades e ambições.",
            reachOutToUs: "Entre em contato!",
            haveQuestions: `Tem dúvidas sobre oportunidades na ${companyName}? Nossa equipe de talentos está pronta para ajudá-lo a encontrar a posição perfeita.`,
            discover: `Descubra a ${companyName}`,
            buildingSomethingSpecial: `Na ${companyName}, estamos construindo algo especial. Nossa equipe é movida por uma paixão compartilhada pela excelência e um compromisso em criar valor para nossos clientes e comunidades.`,
            greatWorkHappens: `Acreditamos que o grande trabalho acontece quando pessoas talentosas têm a liberdade de inovar, colaborar e crescer. Na ${companyName}, você encontrará um ambiente de apoio onde suas ideias importam e suas contribuições fazem uma diferença real.`,
            joinTeamDescription: `Junte-se à ${companyName} e faça parte de uma equipe que valoriza inovação, colaboração e crescimento pessoal. Oferecemos benefícios competitivos, arranjos de trabalho flexíveis e a oportunidade de causar um impacto real.`,
            footerTitle: "Pronto para dar o próximo passo na sua carreira?",
            footerDescription: "Descubra nossas oportunidades de emprego e candidate-se hoje!",
            applicationProcess: "Processo de candidatura",
            howToJoinUs: "Como se juntar a nós",
        },
        Polish: {
            ourOpenPositions: "Nasze Otwarte Stanowiska",
            meetTheTeam: "Poznaj Zespół",
            aboutUs: "O Nas",
            whyJoinUs: "Dlaczego warto do nas dołączyć",
            whatOurTeamSays: "Co mówi nasz zespół",
            exploreOpenPositions: "Przeglądaj otwarte stanowiska",
            findTheRole: "Znajdź stanowisko, które pasuje do Twoich umiejętności i ambicji.",
            reachOutToUs: "Skontaktuj się z nami!",
            haveQuestions: `Masz pytania dotyczące możliwości w ${companyName}? Nasz zespół rekrutacyjny jest gotowy pomóc Ci znaleźć idealną pozycję.`,
            discover: `Odkryj ${companyName}`,
            buildingSomethingSpecial: `W ${companyName} budujemy coś wyjątkowego. Nasz zespół kieruje się wspólną pasją do doskonałości i zaangażowaniem w tworzenie wartości dla naszych klientów i społeczności.`,
            greatWorkHappens: `Wierzymy, że świetna praca powstaje, gdy utalentowani ludzie mają wolność do innowacji, współpracy i rozwoju. W ${companyName} znajdziesz wspierające środowisko, w którym Twoje pomysły się liczą, a Twój wkład naprawdę robi różnicę.`,
            joinTeamDescription: `Dołącz do ${companyName} i stań się częścią zespołu, który ceni innowacje, współpracę i rozwój osobisty. Oferujemy konkurencyjne benefity, elastyczne warunki pracy i możliwość realnego wpływu.`,
            footerTitle: "Gotowy na następny krok w karierze?",
            footerDescription: "Odkryj nasze ekscytujące oferty pracy i aplikuj już dziś!",
            applicationProcess: "Proces rekrutacji",
            howToJoinUs: "Jak do nas dołączyć",
        },
    };

    return translations[language] || translations["English"];
};

/**
 * MultiJobCampaignModal - Modern, minimalistic wizard for creating multi-job campaigns
 */
const MultiJobCampaignModal = ({
    isOpen,
    onClose,
    onGoBack,
    onRefresh,
    darkMode = false,
    brandingDetails = null
}) => {
    const router = useRouter();
    const user = useSelector(selectUser);

    const [currentStep, setCurrentStep] = useState(0);

    // Form state
    const [campaignTitle, setCampaignTitle] = useState("");
    const [heroTitle, setHeroTitle] = useState("");
    const [heroDescription, setHeroDescription] = useState("");
    const [jobsSectionTitle, setJobsSectionTitle] = useState("");
    const [jobsSectionDescription, setJobsSectionDescription] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("English");
    const [selectedTemplate, setSelectedTemplate] = useState("1");

    // Linked campaigns
    const [availableCampaigns, setAvailableCampaigns] = useState([]);
    const [selectedCampaigns, setSelectedCampaigns] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingCampaigns, setLoadingCampaigns] = useState(false);

    // AI and loading states
    const [isLoading, setIsLoading] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");

    const languageOptions = [
        "English", "German", "Dutch", "French", "Spanish", "Italian",
        "Portuguese", "Polish", "Turkish", "Arabic", "Chinese", "Japanese"
    ];

    useEffect(() => {
        if (isOpen) {
            fetchAvailableCampaigns();
        }
    }, [isOpen]);

    const fetchAvailableCampaigns = async () => {
        setLoadingCampaigns(true);
        try {
            const filters = {
                campaignType: { $ne: "multi" },
            };

            if (user?.isWorkspaceSession && user?.workspaceId) {
                filters.workspace = user.workspaceId;
            } else {
                filters.user_id = user?._id;
            }

            const response = await CrudService.search("LandingPageData", 100, 1, {
                filters,
                sorters: [{ key: "createdAt", direction: "desc" }]
            });

            setAvailableCampaigns(response.data.items || []);
        } catch (error) {
            console.error("Error fetching campaigns:", error);
            antdMessage.error("Failed to load available campaigns");
        } finally {
            setLoadingCampaigns(false);
        }
    };

    const filteredCampaigns = useMemo(() => {
        if (!searchQuery.trim()) return availableCampaigns;

        const query = searchQuery.toLowerCase();
        return availableCampaigns.filter(campaign =>
            campaign.vacancyTitle?.toLowerCase().includes(query) ||
            campaign.department?.toLowerCase().includes(query) ||
            campaign.location?.some(loc => loc?.toLowerCase?.().includes(query))
        );
    }, [availableCampaigns, searchQuery]);

    const toggleCampaignSelection = (campaignId) => {
        setSelectedCampaigns(prev => {
            if (prev.includes(campaignId)) {
                return prev.filter(id => id !== campaignId);
            } else {
                return [...prev, campaignId];
            }
        });
    };

    const selectedCampaignObjects = useMemo(() => {
        return availableCampaigns.filter(c => selectedCampaigns.includes(c._id));
    }, [availableCampaigns, selectedCampaigns]);

    const generateAIContent = async () => {
        const selectedJobTitles = selectedCampaignObjects.map(c => c.vacancyTitle).join(", ");
        const departments = [...new Set(selectedCampaignObjects.map(c => c.department).filter(Boolean))];
        const companyName = brandingDetails?.companyName || user?.companyName || "the company";
        
        // Analyze campaign type: departmental (single department) vs mixed (multiple departments)
        const isDepartmental = departments.length === 1;
        const departmentName = isDepartmental ? departments[0] : null;
        const jobCategory = departments.length > 0 ? departments.join(", ") : "various roles";

        // SAFELY extract existing company facts from linked campaigns for AI context
        // This helps the AI generate consistent content based on what's already been created
        const existingCompanyFacts = [];
        const existingAboutContent = [];
        
        for (const campaign of selectedCampaignObjects) {
            // Extract company facts that have actual content
            if (Array.isArray(campaign.companyFacts)) {
                for (const fact of campaign.companyFacts) {
                    if (fact?.headingText?.trim() || fact?.title?.trim()) {
                        existingCompanyFacts.push({
                            icon: fact.icon || "star",
                            title: fact.headingText || fact.title || "",
                            description: fact.descriptionText || fact.description || ""
                        });
                    }
                }
            }
            // Extract about company content if available
            if (campaign.aboutTheCompanyDescription?.trim()) {
                existingAboutContent.push(campaign.aboutTheCompanyDescription.substring(0, 200));
            }
        }

        // Deduplicate facts by title
        const uniqueFacts = existingCompanyFacts.reduce((acc, fact) => {
            const titleLower = (fact.title || "").toLowerCase().trim();
            if (titleLower && !acc.some(f => (f.title || "").toLowerCase().trim() === titleLower)) {
                acc.push(fact);
            }
            return acc;
        }, []).slice(0, 6); // Limit to 6 examples

        // Build context string for AI (only if we have examples)
        const existingContentContext = (uniqueFacts.length > 0 || existingAboutContent.length > 0) 
            ? `
EXISTING CONTENT FROM LINKED JOB PAGES (use as reference for consistency):
${uniqueFacts.length > 0 ? `Company Facts Examples:
${uniqueFacts.map(f => `- ${f.title}: ${f.description}`).join("\n")}` : ""}
${existingAboutContent.length > 0 ? `
About Company Examples:
${existingAboutContent.map(a => `- ${a}...`).join("\n")}` : ""}

IMPORTANT: Use these examples as inspiration to generate similar quality content. 
Maintain the same tone, style, and type of information but create NEW unique content for this multi-job page.
` : "";

        // Map language name to native language name for clearer AI instructions
        // IMPORTANT: Native instructions help the AI understand the target language better
        const languageMap = {
            "English": { native: "English", instruction: "Write in English", notLang: "Do NOT write in German, Dutch, or any other language" },
            "German": { native: "Deutsch", instruction: "Schreiben Sie auf Deutsch", notLang: "Schreiben Sie NICHT auf Englisch, Niederländisch oder einer anderen Sprache" },
            "Dutch": { native: "Nederlands", instruction: "Schrijf in het Nederlands", notLang: "Schrijf NIET in het Duits, Engels of een andere taal. Nederlands is NIET Duits!" },
            "French": { native: "Français", instruction: "Écrivez en français", notLang: "N'écrivez PAS en allemand, anglais ou toute autre langue" },
            "Spanish": { native: "Español", instruction: "Escribe en español", notLang: "NO escribas en alemán, inglés u otro idioma" },
            "Italian": { native: "Italiano", instruction: "Scrivi in italiano", notLang: "NON scrivere in tedesco, inglese o in altre lingue" },
            "Portuguese": { native: "Português", instruction: "Escreva em português", notLang: "NÃO escreva em alemão, inglês ou qualquer outro idioma" },
            "Polish": { native: "Polski", instruction: "Pisz po polsku", notLang: "NIE pisz po niemiecku, angielsku ani w żadnym innym języku" },
            "Turkish": { native: "Türkçe", instruction: "Türkçe yazın", notLang: "Almanca, İngilizce veya başka bir dilde YAZMAYIN" },
            "Arabic": { native: "العربية", instruction: "اكتب بالعربية", notLang: "لا تكتب بالألمانية أو الإنجليزية أو أي لغة أخرى" },
            "Chinese": { native: "中文", instruction: "请用中文写", notLang: "不要用德语、英语或其他任何语言书写" },
            "Japanese": { native: "日本語", instruction: "日本語で書いてください", notLang: "ドイツ語、英語、または他の言語で書かないでください" }
        };
        const langInfo = languageMap[selectedLanguage] || { 
            native: selectedLanguage, 
            instruction: `Write in ${selectedLanguage}`,
            notLang: `Do NOT write in German, English, or any other language - ONLY ${selectedLanguage}`
        };

        // Build contextual prompt based on campaign type
        const campaignTypeContext = isDepartmental 
            ? `══════════════════════════════════════════════════════════════
CAMPAIGN TYPE: DEPARTMENTAL (${departmentName.toUpperCase()} DEPARTMENT FOCUS)
══════════════════════════════════════════════════════════════
This is a DEDICATED ${departmentName} department careers page at ${companyName}.

CONTENT STRATEGY FOR ${departmentName.toUpperCase()} DEPARTMENT:
1. DEPARTMENT AS BACKBONE: Position the ${departmentName} team as crucial to ${companyName}'s success
2. DEPARTMENT CULTURE: Highlight what makes ${departmentName} professionals uniquely valued
3. GROWTH WITHIN DEPARTMENT: Emphasize career paths and development for ${departmentName} roles
4. TEAM INVESTMENT: Show how ${companyName} specifically invests in their ${departmentName} people
5. DEPARTMENT IMPACT: Explain how ${departmentName} drives business outcomes

TONE: Speak directly to ${departmentName} professionals - make them feel this page was created FOR THEM.
The content should make a ${departmentName} professional think: "This company truly values and understands what I do."`
            : `══════════════════════════════════════════════════════════════
CAMPAIGN TYPE: MIXED DEPARTMENTS (GENERAL CAREERS PAGE)
══════════════════════════════════════════════════════════════
This is a general careers page showcasing opportunities across ${departments.length > 0 ? departments.length : 'multiple'} departments at ${companyName}.

CONTENT STRATEGY FOR MIXED DEPARTMENT PAGE:
1. COMPANY-WIDE APPEAL: Content should resonate with talent from ANY department
2. DIVERSE OPPORTUNITIES: Highlight the variety of roles and career paths available
3. UNIFIED CULTURE: Focus on company values that apply to ALL employees
4. INCLUSIVE MESSAGE: Emphasize ${companyName}'s commitment to every team member

Departments represented: ${jobCategory}
TONE: Welcoming and inclusive - make ALL candidates feel they could belong here.`;

        const prompt = `You are a professional copywriter. Generate employer brand content for a multi-job career page.

╔═══════════════════════════════════════════════════════════════════════════════╗
║ ⚠️ LANGUAGE REQUIREMENT - CRITICAL - READ CAREFULLY ⚠️                         ║
╠═══════════════════════════════════════════════════════════════════════════════╣
    ║ OUTPUT LANGUAGE: ${selectedLanguage.toUpperCase()} (${langInfo.native})                                         
║                                                                               ║
║ ${langInfo.instruction}                                                       
║ ${langInfo.notLang}                                                           
║                                                                               ║
║ EVERY SINGLE WORD must be in ${selectedLanguage} (${langInfo.native}).        
║ If you write in the wrong language, the output is USELESS.                    ║
╚═══════════════════════════════════════════════════════════════════════════════╝

${campaignTypeContext}

CONTENT RULES:
- NEVER use placeholder text like "[Insert X here]", "[Company name]", "Example:"
- Generate REAL, SPECIFIC, READY-TO-PUBLISH content
- Write as the company's marketing team would
- Be specific to the campaign type (departmental vs mixed)

CONTEXT:
- Company: ${companyName}
${aiPrompt.trim() ? `- User's description: ${aiPrompt}` : ""}
- Job focus: ${jobCategory}
${selectedJobTitles ? `- Open positions: ${selectedJobTitles}` : ""}
${existingContentContext}
GENERATE (ALL TEXT MUST BE IN ${selectedLanguage.toUpperCase()}):
1. heroTitle: ${isDepartmental ? `Inspiring headline for ${departmentName} careers` : "Inspiring headline for careers"} at ${companyName} (max 60 chars)
2. heroDescription: ${isDepartmental ? `Compelling paragraph about why ${departmentName} professionals should join - focus on department importance and impact` : "Compelling paragraph about why professionals should join"} (150-200 words)
3. jobsSectionTitle: Title for jobs listing section (max 40 chars)
4. jobsSectionDescription: Brief intro for jobs section (1-2 sentences)
5. aboutTheCompanyTitle: Title for About section (max 50 chars)
6. aboutTheCompanyText: Short tagline about the company (max 100 chars)
7. aboutTheCompanyDescription: ${isDepartmental ? `Description focusing on how ${departmentName} department drives company success` : "Description of the company culture and mission"} (150-200 words)
8. companyFactsTitle: Title for Company Facts/Why Join Us section (max 40 chars)
9. companyFacts: Array of 4 compelling facts about working at ${companyName}${isDepartmental ? `, specifically for ${departmentName} roles` : ""} (each with icon, title, description)
10. candidateProcessTitle: Title for Application Process section (max 40 chars)
11. candidateProcessSteps: Array of 4-5 steps describing the hiring process

RESPOND IN JSON ONLY (values in ${selectedLanguage}):
{
  "heroTitle": "...",
  "heroDescription": "...",
  "jobsSectionTitle": "...",
  "jobsSectionDescription": "...",
  "aboutTheCompanyTitle": "...",
  "aboutTheCompanyText": "...",
  "aboutTheCompanyDescription": "...",
  "companyFactsTitle": "...",
  "companyFacts": [
    {"icon": "star", "title": "...", "description": "..."},
    {"icon": "users", "title": "...", "description": "..."},
    {"icon": "trending-up", "title": "...", "description": "..."},
    {"icon": "heart", "title": "...", "description": "..."}
  ],
  "candidateProcessTitle": "...",
  "candidateProcessSteps": [
    {"step": 1, "title": "...", "description": "..."},
    {"step": 2, "title": "...", "description": "..."},
    {"step": 3, "title": "...", "description": "..."},
    {"step": 4, "title": "...", "description": "..."}
  ]
}`;

        const response = await AiService.generateSectionContent({
            sectionName: "multiJobHero",
            prompt,
            language: selectedLanguage, // Top-level language for backend to use
            fields: [
                { key: "heroTitle", label: "Hero Title", type: "text", maxLength: 60 },
                { key: "heroDescription", label: "Hero Description", type: "textarea", maxLength: 500 },
                { key: "jobsSectionTitle", label: "Jobs Section Title", type: "text", maxLength: 40 },
                { key: "jobsSectionDescription", label: "Jobs Section Description", type: "text", maxLength: 150 },
                { key: "aboutTheCompanyTitle", label: "About Title", type: "text", maxLength: 50 },
                { key: "aboutTheCompanyText", label: "About Text", type: "text", maxLength: 100 },
                { key: "aboutTheCompanyDescription", label: "About Description", type: "textarea", maxLength: 500 },
                { key: "companyFactsTitle", label: "Facts Title", type: "text", maxLength: 40 },
                { key: "companyFacts", label: "Company Facts", type: "object" },
                { key: "candidateProcessTitle", label: "Process Title", type: "text", maxLength: 40 },
                { key: "candidateProcessSteps", label: "Process Steps", type: "object" }
            ],
            vacancyContext: {
                title: campaignTitle,
                companyInfo: brandingDetails?.companyName || user?.companyName,
                isDepartmental,
                departmentName,
                language: selectedLanguage
            }
        });

        let result = response.data?.data?.content || response.data?.content;
        if (typeof result === "string") {
            result = result.replace(/```json/g, "").replace(/```/g, "").trim();
            const firstBrace = result.indexOf("{");
            const lastBrace = result.lastIndexOf("}");
            if (firstBrace >= 0 && lastBrace >= 0) {
                result = result.substring(firstBrace, lastBrace + 1);
            }
            result = JSON.parse(result);
        }

        // Parse nested JSON strings if needed
        if (typeof result.companyFacts === "string") {
            try { result.companyFacts = JSON.parse(result.companyFacts); } catch (e) { result.companyFacts = []; }
        }
        if (typeof result.candidateProcessSteps === "string") {
            try { result.candidateProcessSteps = JSON.parse(result.candidateProcessSteps); } catch (e) { result.candidateProcessSteps = []; }
        }

        return result;
    };

    const handleGenerateAndCreate = async () => {
        if (selectedCampaigns.length === 0) {
            antdMessage.warning("Please select at least one job campaign to link");
            return;
        }

        setIsLoading(true);
        try {
            // Use the new backend endpoint for AI generation (like single job pages)
            console.log("Creating multi-job campaign via backend...");
            
            const response = await AiService.createMultiVacanciesPage({
                linkedCampaignIds: selectedCampaigns,
                campaignTitle: campaignTitle,
                language: selectedLanguage,
                templateId: selectedTemplate,
                brandingDetails: {
                    companyName: brandingDetails?.companyName || user?.companyName,
                    companyUrl: brandingDetails?.companyUrl || user?.companyUrl,
                    companyLogo: brandingDetails?.companyLogo || user?.companyLogo,
                    primaryColor: brandingDetails?.primaryColor || user?.primaryColor,
                    secondaryColor: brandingDetails?.secondaryColor || user?.secondaryColor,
                    tertiaryColor: brandingDetails?.tertiaryColor || user?.tertiaryColor,
                    selectedFont: brandingDetails?.selectedFont || user?.selectedFont,
                    titleFont: brandingDetails?.titleFont || user?.titleFont,
                    subheaderFont: brandingDetails?.subheaderFont || user?.subheaderFont,
                    bodyFont: brandingDetails?.bodyFont || user?.bodyFont,
                },
                user_id: user?._id,
            });

            if (response?.data?.success && response?.data?.data?.campaign) {
                const newCampaign = response.data.data.campaign;
                console.log("Multi-job campaign created successfully via backend:", newCampaign._id);
                
                antdMessage.success("Multi-job campaign created successfully!");
                await refreshUserData();
                if (onRefresh) onRefresh();
                
                // Navigate to editor (same as single job page)
                router.push(`/edit-page/${newCampaign._id}`);
                onClose();
            } else {
                throw new Error(response?.data?.error || "Failed to create campaign");
            }
        } catch (error) {
            console.error("Error creating multi-job campaign:", error);
            antdMessage.error(error.response?.data?.error || error.message || "Failed to create campaign");
            setIsLoading(false);
        }
    };

    // LEGACY: Keep the old frontend-based creation as fallback (can be removed later)
    const handleGenerateAndCreateLegacy = async () => {
        if (selectedCampaigns.length === 0) {
            antdMessage.warning("Please select at least one job campaign to link");
            return;
        }

        setIsLoading(true);
        try {
            // First generate AI content
            let generatedContent = {};
            try {
                generatedContent = await generateAIContent();
                console.log("Generated AI content:", generatedContent);
            } catch (error) {
                console.error("AI generation error:", error);
                // Continue with defaults if AI fails
            }

            // Now create the campaign with all generated content
            await createCampaignWithContent(generatedContent);
        } catch (error) {
            console.error("Error creating campaign:", error);
            antdMessage.error(error.response?.data?.message || "Failed to create campaign");
            setIsLoading(false);
        }
    };

    const createCampaignWithContent = async (generatedContent = {}) => {
        const companyName = brandingDetails?.companyName || user?.companyName || "Our Company";
        
        // Extract generated content with fallbacks
        const generatedHeroTitle = generatedContent.heroTitle || "";
        const generatedHeroDescription = generatedContent.heroDescription || "";
        const generatedJobsSectionTitle = generatedContent.jobsSectionTitle || "";
        const generatedJobsSectionDescription = generatedContent.jobsSectionDescription || "";
        const generatedAboutTitle = generatedContent.aboutTheCompanyTitle || "";
        const generatedAboutText = generatedContent.aboutTheCompanyText || "";
        const generatedAboutDescription = generatedContent.aboutTheCompanyDescription || "";
        const generatedFactsTitle = generatedContent.companyFactsTitle || "";
        let generatedFacts = Array.isArray(generatedContent.companyFacts) ? generatedContent.companyFacts : [];
        const generatedProcessTitle = generatedContent.candidateProcessTitle || "";
        const generatedProcessSteps = Array.isArray(generatedContent.candidateProcessSteps) ? generatedContent.candidateProcessSteps : [];

        // FALLBACK: If AI didn't generate facts, try to use facts from linked campaigns
        if (generatedFacts.length === 0 && selectedCampaignObjects.length > 0) {
            console.log("AI didn't generate facts, checking linked campaigns for existing facts...");
            for (const campaign of selectedCampaignObjects) {
                if (Array.isArray(campaign.companyFacts) && campaign.companyFacts.length > 0) {
                    // Check if any fact has actual content (headingText or descriptionText)
                    const validFacts = campaign.companyFacts.filter(
                        f => (f.headingText && f.headingText.trim()) || (f.descriptionText && f.descriptionText.trim())
                    );
                    if (validFacts.length > 0) {
                        console.log(`Using ${validFacts.length} facts from linked campaign:`, campaign.vacancyTitle);
                        generatedFacts = validFacts.map(f => ({
                            icon: f.icon || "star",
                            title: f.headingText || f.title || "",
                            description: f.descriptionText || f.description || ""
                        }));
                        break; // Use facts from the first campaign that has them
                    }
                }
            }
        }

        // Get translations for the selected language
        const t = getMultiJobTranslations(selectedLanguage, companyName);

        // Multi-job campaign default sections with localized labels:
        // Hero (Flexible) → Jobs (carousel) → About the Company → Company Facts → Candidate Process → Footer
        const multiJobMenuItems = [
            {
                id: "linked-jobs",
                key: "Linked Jobs",
                label: t.ourOpenPositions,
                active: true,
                visible: true,
                sort: 1
            },
            {
                id: "about-company",
                key: "About The Company",
                label: t.aboutUs,
                active: true,
                visible: true,
                sort: 2
            },
            {
                id: "company-facts",
                key: "Company Facts",
                label: t.whyJoinUs,
                active: true,
                visible: true,
                sort: 3
            },
            {
                id: "candidate-process",
                key: "Candidate Process",
                label: t.applicationProcess,
                active: true,
                visible: true,
                sort: 4
            },
        ];

        // Fetch hero image from Unsplash based on campaign/company context
        let heroImage = "";
        let aboutTheCompanyImages = [];

        try {
            // Search for hero image with generic career/team terms (more reliable than specific company names)
            // Use simple terms that Unsplash will definitely have results for
            const heroSearchQuery = "modern office team professional workplace";
            console.log(`MultiJobCampaignModal: Searching Unsplash for hero with query: "${heroSearchQuery}"`);

            const heroImageResponse = await AiService.searchUnsplash(heroSearchQuery, 6);

            if (heroImageResponse?.data?.success && heroImageResponse.data.data?.length > 0) {
                const randomIndex = Math.floor(Math.random() * Math.min(heroImageResponse.data.data.length, 6));
                const selectedImage = heroImageResponse.data.data[randomIndex];

                console.log("MultiJobCampaignModal: Uploading hero image to Cloudinary...");
                const uploadRes = await UploadService.upload(selectedImage.url, 10);
                if (uploadRes?.data?.secure_url) {
                    heroImage = uploadRes.data.secure_url;
                    console.log("MultiJobCampaignModal: Hero image uploaded:", heroImage);
                }
            } else {
                console.log("MultiJobCampaignModal: No hero images found from Unsplash, heroImage will be empty");
            }
        } catch (imgError) {
            console.error("MultiJobCampaignModal: Failed to fetch/upload hero image:", imgError);
        }

        // Fetch "About Company" section images from Unsplash
        try {
            // Use generic terms that Unsplash will have good results for
            const aboutSearchQuery = "team collaboration office workspace meeting";
            console.log(`MultiJobCampaignModal: Searching Unsplash for About section with query: "${aboutSearchQuery}"`);

            const aboutImageResponse = await AiService.searchUnsplash(aboutSearchQuery, 8);

            if (aboutImageResponse?.data?.success && aboutImageResponse.data.data?.length > 0) {
                const images = aboutImageResponse.data.data.slice(0, 4); // Get up to 4 images

                // Upload each image to Cloudinary
                console.log(`MultiJobCampaignModal: Uploading ${images.length} About section images...`);
                const uploadPromises = images.map(async (img) => {
                    try {
                        const uploadRes = await UploadService.upload(img.url, 10);
                        return uploadRes?.data?.secure_url || null;
                    } catch (e) {
                        console.error("Failed to upload about image:", e);
                        return null;
                    }
                });

                const uploadedUrls = await Promise.all(uploadPromises);
                aboutTheCompanyImages = uploadedUrls.filter(Boolean);
                console.log(`MultiJobCampaignModal: Uploaded ${aboutTheCompanyImages.length} About section images`);
            }
        } catch (imgError) {
            console.error("MultiJobCampaignModal: Failed to fetch/upload About section images:", imgError);
        }

        const campaignData = {
            campaignType: "multi",
            vacancyTitle: campaignTitle,
            multiJobHeroTitle: generatedHeroTitle || campaignTitle,
            heroDescription: generatedHeroDescription || t.joinTeamDescription,
            heroImage, // Dynamic Unsplash image
            jobsSectionTitle: generatedJobsSectionTitle || t.exploreOpenPositions,
            jobsSectionDescription: generatedJobsSectionDescription || t.findTheRole,
            linkedCampaigns: selectedCampaigns,
            lang: selectedLanguage,
            language: selectedLanguage,
            templateId: selectedTemplate,
            menuItems: multiJobMenuItems,
            companyName,
            companyUrl: brandingDetails?.companyUrl || user?.companyUrl,
            companyLogo: brandingDetails?.companyLogo || user?.companyLogo,
            primaryColor: brandingDetails?.primaryColor || user?.primaryColor,
            secondaryColor: brandingDetails?.secondaryColor || user?.secondaryColor,
            tertiaryColor: brandingDetails?.tertiaryColor || user?.tertiaryColor,
            selectedFont: brandingDetails?.selectedFont || user?.selectedFont,
            titleFont: brandingDetails?.titleFont || user?.titleFont,
            subheaderFont: brandingDetails?.subheaderFont || user?.subheaderFont,
            bodyFont: brandingDetails?.bodyFont || user?.bodyFont,
            user_id: user?._id,
            workspace: user?.isWorkspaceSession ? user.workspaceId : undefined,
            // For multi-job campaigns, use URL apply type (candidates apply on individual job pages)
            applyType: 'url',
            cta2Link: '#linked-jobs',
            // No form needed for multi-job career pages
            form: { title: "", fields: [] },

            // Default Recruiter Contact section (language-aware)
            recruiterContactTitle: t.reachOutToUs,
            recruiterContactText: t.haveQuestions,
            recruiters: user?.fullName || user?.name ? [
                {
                    recruiterFullname: user?.fullName || user?.name || "",
                    recruiterRole: "Talent Acquisition",
                    recruiterEmail: user?.email || "",
                    recruiterPhone: "",
                    recruiterImage: user?.avatar || "",
                }
            ] : [],

            // Default About Company section with Unsplash images (AI-generated or language-aware fallback)
            aboutTheCompanyTitle: generatedAboutTitle || t.discover,
            aboutTheCompanyText: generatedAboutText || t.buildingSomethingSpecial,
            aboutTheCompanyDescription: generatedAboutDescription || t.greatWorkHappens,
            aboutTheCompanyImages: aboutTheCompanyImages, // Dynamic Unsplash images

            // Company Facts section (AI-generated with proper field names)
            // The template expects headingText and descriptionText (not title/description)
            companyFacts: generatedFacts.length > 0 ? generatedFacts.map((fact, idx) => ({
                icon: fact.icon || ["star", "users", "trending-up", "heart"][idx % 4],
                headingText: fact.title || fact.headingText || "",
                descriptionText: fact.description || fact.descriptionText || ""
            })) : [
                // Fallback: Create empty placeholders so the section shows
                { icon: "star", headingText: "", descriptionText: "" },
                { icon: "users", headingText: "", descriptionText: "" },
                { icon: "trending-up", headingText: "", descriptionText: "" },
                { icon: "heart", headingText: "", descriptionText: "" }
            ],
            companyFactsTitle: generatedFactsTitle || t.whyJoinUs,
            companyFactsDescription: "",

            // Candidate Process section (AI-generated)
            candidateProcessTitle: generatedProcessTitle || t.applicationProcess,
            candidateProcessSteps: generatedProcessSteps.length > 0 ? generatedProcessSteps.map((step, idx) => ({
                step: step.step || idx + 1,
                title: step.title || "",
                description: step.description || ""
            })) : [
                { step: 1, title: t.applicationProcess, description: "" },
                { step: 2, title: "", description: "" },
                { step: 3, title: "", description: "" },
                { step: 4, title: "", description: "" }
            ],

            // Default Testimonials section (empty - to be filled by user)
            testimonials: [],

            // Footer section (language-aware)
            footerTitle: t.footerTitle,
            footerDescription: t.footerDescription,

            // Explicit visibility flags for multi-job sections
            showAboutCompany: true,
            showCompanyFacts: true,
            showCandidateProcess: true,
            showTestimonial: false, // Empty by default, user can enable
            showRecruiterContact: true,
        };

        // Use CrudService.create directly to ensure menuItems is not overwritten
        const response = await CrudService.create("LandingPageData", campaignData);

        antdMessage.success("Multi-job campaign created!");

        await refreshUserData();
        if (onRefresh) onRefresh();

        console.log("will redirect to edit page", response.data.result._id)
        router.push(`/edit-page/${response.data.result._id}`);
        setIsLoading(false);
    };

    const steps = [
        { id: 0, label: "Details" },
        { id: 1, label: "Jobs" }
    ];

    const canProceed = () => {
        if (currentStep === 0) return campaignTitle.trim().length > 0;
        if (currentStep === 1) return selectedCampaigns.length > 0;
        return true;
    };

    // Step 1: Campaign Details
    const renderStep0 = () => (
        <div className="space-y-6">
            {/* Campaign Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign name
                </label>
                <input
                    type="text"
                    placeholder="e.g., Engineering Careers 2025"
                    value={campaignTitle}
                    onChange={(e) => setCampaignTitle(e.target.value)}
                    className="w-full px-4 py-3 text-base rounded-xl border border-gray-200 bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-100 outline-none transition-all"
                />
                <p className="text-xs text-gray-400 mt-1.5">
                    This is for your reference only
                </p>
            </div>

            {/* Language */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                </label>
                <Select
                    size="large"
                    value={selectedLanguage}
                    onChange={setSelectedLanguage}
                    className="w-full"
                    style={{ height: 48 }}
                >
                    {languageOptions.map(lang => (
                        <Option key={lang} value={lang}>{lang}</Option>
                    ))}
                </Select>
            </div>

            {/* AI Context */}
            <div className="relative rounded-2xl bg-gradient-to-br from-violet-50/50 via-purple-50/30 to-fuchsia-50/40 p-5 border border-violet-100/60">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                        </svg>
                    </div>
                    <span className="font-medium text-violet-800">AI Content Assistant</span>
                </div>

                <textarea
                    placeholder="What would you like to highlight in this multi-job campaign? For example: generate a campaign page for our sales job opportunities..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-violet-100 bg-white/80 focus:border-violet-200 focus:ring-2 focus:ring-violet-50 outline-none transition-all resize-none"
                />
                <p className="text-xs text-violet-500 mt-2">
                    This context will be used to generate your page content
                </p>
            </div>
        </div>
    );

    // Step 2: Link Jobs
    const renderStep1 = () => (
        <div className="space-y-5">
            {/* Search */}
            <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                    type="text"
                    placeholder="Search by job title, department, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 text-base rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-100 outline-none transition-all"
                />
            </div>

            {/* Selection counter */}
            {selectedCampaigns.length > 0 && (
                <div className="flex items-center justify-between px-4 py-2.5 bg-violet-50/60 rounded-xl border border-violet-100/80">
                    <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-violet-400 text-white text-xs font-bold flex items-center justify-center">
                            {selectedCampaigns.length}
                        </div>
                        <span className="text-sm font-medium text-violet-600">
                            job{selectedCampaigns.length !== 1 ? 's' : ''} selected
                        </span>
                    </div>
                    <button
                        onClick={() => setSelectedCampaigns([])}
                        className="text-xs text-gray-500 hover:text-violet-600 font-medium transition-colors"
                    >
                        Clear all
                    </button>
                </div>
            )}

            {/* Campaign List */}
            <div className="max-h-[340px] overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                {loadingCampaigns ? (
                    <div className="flex justify-center py-12">
                        <Spin size="large" />
                    </div>
                ) : filteredCampaigns.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-2xl bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-sm">
                            {availableCampaigns.length === 0
                                ? "No single job campaigns found"
                                : "No campaigns match your search"
                            }
                        </p>
                    </div>
                ) : (
                    filteredCampaigns.map(campaign => {
                        const isSelected = selectedCampaigns.includes(campaign._id);
                        return (
                            <div
                                key={campaign._id}
                                onClick={() => toggleCampaignSelection(campaign._id)}
                                className={`
                                    relative p-3.5 rounded-xl cursor-pointer transition-all duration-200
                                    ${isSelected
                                        ? 'bg-violet-50 border-2 border-violet-200 shadow-sm'
                                        : 'bg-white border border-gray-100 hover:border-violet-100 hover:bg-violet-50/30'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3.5">
                                    {/* Thumbnail */}
                                    <div className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ${isSelected ? 'ring-2 ring-violet-200' : ''}`}>
                                        {campaign.heroImage ? (
                                            <img
                                                src={campaign.heroImage}
                                                alt={campaign.vacancyTitle}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`font-medium truncate ${isSelected ? 'text-violet-900' : 'text-gray-900'}`}>
                                            {campaign.vacancyTitle || "Untitled Campaign"}
                                        </h4>

                                        <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5 text-xs ${isSelected ? 'text-violet-600' : 'text-gray-500'}`}>
                                            {campaign.department && (
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                                                    </svg>
                                                    {campaign.department}
                                                </span>
                                            )}
                                            {campaign.location?.[0] && (
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                                    </svg>
                                                    {campaign.location[0]}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Selection indicator */}
                                    <div className="flex-shrink-0">
                                        <div className={`
                                            w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                                            ${isSelected
                                                ? 'bg-violet-500 border-violet-500'
                                                : 'border-gray-300 bg-white'
                                            }
                                        `}>
                                            {isSelected && (
                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Tip */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/60 border border-amber-100/80">
                <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
                <p className="text-xs text-amber-700">
                    Selected jobs will appear as cards on your career page. Visitors can click to view full details.
                </p>
            </div>
        </div>
    );

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={480}
            centered
            destroyOnClose
            wrapClassName={darkMode ? "dark" : ""}
            closable={true}
            styles={{
                content: {
                    padding: 0,
                    borderRadius: 24,
                    overflow: 'hidden'
                },
                mask: {
                    backdropFilter: 'blur(8px)',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)'
                }
            }}
        >
            <div className="p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={currentStep === 0 ? onGoBack : () => setCurrentStep(prev => prev - 1)}
                        className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Multi-Job Career Page
                        </h2>
                        <p className="text-sm text-gray-500">
                            Showcase multiple positions
                        </p>
                    </div>
                </div>

                {/* Step Indicator - Minimal dots */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {steps.map((step, idx) => (
                        <div key={step.id} className="flex items-center gap-2">
                            <div
                                className={`
                                    h-1.5 rounded-full transition-all duration-300
                                    ${idx < currentStep
                                        ? 'bg-violet-400 w-2'
                                        : idx === currentStep
                                            ? 'bg-violet-500 w-8'
                                            : 'bg-gray-200 w-2'
                                    }
                                `}
                            />
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="min-h-[360px]">
                    {currentStep === 0 && renderStep0()}
                    {currentStep === 1 && renderStep1()}
                </div>

                {/* Navigation */}
                <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
                    {currentStep === 0 ? (
                        <button
                            onClick={() => setCurrentStep(1)}
                            disabled={!canProceed()}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-500 text-white font-medium rounded-xl hover:bg-violet-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            <span>Next</span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    ) : (
                        <button
                            onClick={handleGenerateAndCreate}
                            disabled={!canProceed() || isLoading}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-500 text-white font-medium rounded-xl hover:bg-violet-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            {isLoading ? (
                                <>
                                    <Spin size="small" />
                                    <span>Generating...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                                    </svg>
                                    <span>Generate</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default MultiJobCampaignModal;
