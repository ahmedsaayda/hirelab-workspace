import { Tabs, Tooltip } from "antd";
import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import CalendarRangePicker from "./CalendarRangePicker.js";
import Overview from "./Overview.js";
import Reports from "./Reports.js";
import { InviteModal } from "../../onboarding/components/invite-modal.jsx";
import { Button, Heading, Img } from "../Vacancies/components/components/index.jsx";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import UpgradeModal from "../Vacancies/components/UpgradeModal.jsx";
import { selectUser } from "../../../redux/auth/selectors.js";
import AuthService from "../../../services/AuthService";
import { CrownOutlined, PlusOutlined } from "@ant-design/icons";
import { refreshUserData } from "../../../utils/userRefresh.js";
import { useWorkspace } from "../../../contexts/WorkspaceContext";
import { HelpCircle } from "lucide-react";
import CandidateChatService from "../../../services/CandidateChatService.js";
import moment from "moment";

// 200 motivational welcome messages focused on HireLab's philosophy
const welcomeMessages = [
  // Design & Candidate Journey (1-50)
  "Beautiful design isn't vanity—it's the first impression that makes candidates stay.",
  "Every pixel on your landing page shapes a candidate's decision. We make them count.",
  "The candidate journey starts with design. Let's make yours unforgettable.",
  "Great UX isn't optional in recruitment—it's the difference between apply and abandon.",
  "Your employer brand deserves design that matches your ambition.",
  "Candidates judge in seconds. Beautiful pages make those seconds work for you.",
  "Design-first recruitment isn't a trend—it's the new standard. You're ahead of the curve.",
  "A stunning candidate experience starts here. Let's attract the talent you deserve.",
  "First impressions are visual. Your job pages should stop candidates in their scroll.",
  "We believe recruitment deserves the same design love as consumer products.",
  "Every click, every scroll, every moment matters in the candidate journey.",
  "Beautiful employer branding pages convert passive scrollers into active applicants.",
  "Design is the silent ambassador of your employer brand. Make it speak volumes.",
  "The best candidates expect premium experiences. Deliver them effortlessly.",
  "Your career page is your talent storefront. Let's make it irresistible.",
  "Candidate experience is a design problem. We solved it for you.",
  "The journey from impression to application should be beautiful. We made it so.",
  "Good design removes friction. Great design creates desire to apply.",
  "Modern candidates expect modern experiences. Your pages now deliver both.",
  "Every element of your landing page is a conversion opportunity. Maximize them all.",
  "Visual storytelling attracts talent that words alone never could.",
  "The candidate journey is a story. Design helps you tell it beautifully.",
  "Aesthetics and functionality unite in recruitment pages that actually work.",
  "Your employer brand finally has the visual presence it deserves.",
  "Design thinking meets talent acquisition. Welcome to the future of hiring.",
  "Candidates feel the difference when design is intentional. Yours is.",
  "From first glance to final click—every touchpoint is designed to convert.",
  "Great design builds trust before candidates even read a word.",
  "Your landing pages now work as hard as you do. With style.",
  "Design excellence is our obsession. Talent attraction is your result.",
  "The gap between seeing and applying should be seamless. We closed it.",
  "Premium design attracts premium candidates. It's that simple.",
  "Every visual element serves a purpose: getting you better applicants.",
  "Candidate journeys shouldn't feel corporate. They should feel human.",
  "Your employer story deserves cinematic presentation. We deliver it.",
  "Design-led recruitment separates the memorable from the forgotten.",
  "Boring job pages cost you candidates. Yours are anything but boring now.",
  "The visual journey from curiosity to application—optimized and beautiful.",
  "Mobile-first, design-forward, conversion-focused. That's your new reality.",
  "Great design makes complex hiring feel effortless to candidates.",
  "Your brand personality now shines through every recruitment touchpoint.",
  "Candidates don't just see your pages—they experience them.",
  "Design is the competitive advantage most recruiters overlook. Not you.",
  "Beautiful pages attract beautiful talent. Let's prove it together.",
  "Every scroll should deepen candidate interest. Your pages now do exactly that.",
  "The intersection of art and recruitment. You're standing right at it.",
  "Visual consistency builds employer brand trust faster than any other element.",
  "Your candidate experience is now a design masterpiece.",
  "Great recruitment design feels invisible—it just works.",
  "From passive browser to excited applicant. That's the power of design.",
  
  // Social Recruitment & Passive Candidates (51-100)
  "The best candidates aren't searching. They're scrolling. Let's meet them there.",
  "Passive candidates are 70% of the talent market. Time to tap into it.",
  "Social recruitment finds people before they know they're looking. Powerful.",
  "The talent you need is scrolling Instagram right now. Let's reach them.",
  "Active applicants compete. Passive candidates get recruited. Big difference.",
  "Stop waiting for applications. Start attracting talent where they actually are.",
  "Social recruitment isn't the future—it's the now. And you're doing it.",
  "The best hires often come from people who weren't job hunting. Find them.",
  "Passive candidates need to be wooed, not spammed. Your pages woo beautifully.",
  "Social feeds are the new job boards. Your content now wins there.",
  "Reaching passive talent requires standing out. Your pages definitely do.",
  "Job boards reach job seekers. Social reaches everyone. Think bigger.",
  "The scroll-stopping landing page is your secret weapon for passive talent.",
  "Passive candidates need a reason to care. Beautiful design gives them one.",
  "Social recruitment is about interrupting their scroll with something worth seeing.",
  "The war for talent happens in social feeds. You're now armed for battle.",
  "Passive candidates click on experiences, not job listings.",
  "Your next star employee isn't on LinkedIn. They're on their couch, scrolling.",
  "Social-first recruitment reaches the unreachable. That's your advantage now.",
  "The best talent needs to be attracted, not hunted. Attraction starts with design.",
  "Passive candidates become active when the opportunity looks irresistible.",
  "Stop posting jobs. Start creating content that makes careers look amazing.",
  "The talent pool is deeper than job boards show. Social dives deeper.",
  "Reaching passive candidates is an art. Your pages are the masterpiece.",
  "Social recruitment works because great careers deserve great first impressions.",
  "The best candidates discover you when you meet them in their world.",
  "Job posts push. Social campaigns pull. Pulling works better.",
  "Passive talent needs inspiration, not desperation. Inspire them.",
  "Your content now turns casual scrollers into curious candidates.",
  "The feed is the new career fair. Make every impression count.",
  "Targeting passive talent is targeting the gold standard.",
  "Active candidates apply everywhere. Passive candidates choose carefully.",
  "Social recruitment is permission marketing for careers. Beautiful permission.",
  "The swipe-right moment for your next hire starts with great design.",
  "Passive candidates expect consumer-grade experiences. Now you deliver them.",
  "Social reach + stunning pages = talent pipeline transformation.",
  "The untapped 70%. Passive candidates. Now within your reach.",
  "Great employers attract. They don't beg. Your pages attract beautifully.",
  "Social recruitment is about being discovered, not doing the discovering.",
  "Passive candidates respond to emotion, not bullet points. Feel the difference.",
  "Your employer brand now travels through feeds and conversations.",
  "The algorithm favors the beautiful. So do passive candidates.",
  "Stop competing for active applicants. Start attracting passive talent.",
  "Social recruitment democratizes access to exceptional candidates.",
  "The passive candidate sees your page and thinks: this feels different.",
  "Reaching talent that isn't looking requires looking exceptional.",
  "Social-first, mobile-optimized, candidate-obsessed. That's your edge.",
  "The best hire you'll ever make hasn't started job hunting yet.",
  "Passive talent acquisition: where patience meets stunning presentation.",
  "Your landing pages now speak the visual language of social.",
  
  // Employer Branding as Science (101-150)
  "Employer branding is part science, part art. We automated the hard parts.",
  "Building employer brand used to take agencies and months. Now it takes minutes.",
  "The science of candidate attraction is complex. Your experience of it isn't.",
  "Employer branding is a multi-variable equation. We solved it for you.",
  "What took brand agencies weeks, you accomplish in an afternoon.",
  "Employer branding complexity, simplified into beautiful simplicity.",
  "The psychology of candidate conversion is built into every page you create.",
  "Data-driven employer branding without the data science degree.",
  "We turned years of conversion research into templates that just work.",
  "Employer branding is rocket science. Using our platform isn't.",
  "The complicated art of EVP communication, made beautifully simple.",
  "Every design choice is backed by candidate behavior research.",
  "Employer branding automation means consistency at scale. Finally.",
  "The science says candidates decide in seconds. We optimized for seconds.",
  "Brand building that used to require consultants now requires just you.",
  "Employer branding frameworks, embedded invisibly into your workflow.",
  "What Fortune 500 companies pay millions for, you're doing yourself.",
  "The psychology of apply buttons, the science of scroll depth—all automated.",
  "Employer branding best practices, baked into every template.",
  "You focus on your story. We handle the conversion science.",
  "The complexity of employer branding, hidden behind simple interfaces.",
  "Behavioral science meets recruitment technology. You benefit from both.",
  "Building employer brand equity with every page you publish.",
  "The research is done. The testing is complete. Just create.",
  "Employer branding science that doesn't require a scientist to use.",
  "We democratized employer branding. Everyone can now compete with giants.",
  "The hard science of talent attraction, made effortlessly accessible.",
  "EVP frameworks and candidate psychology, invisible but ever-present.",
  "You're doing employer branding at enterprise level without enterprise complexity.",
  "The automation of excellence. That's what employer branding should feel like.",
  "Candidate behavior patterns, conversion psychology—all working for you.",
  "Employer branding used to be for big budgets. We changed that equation.",
  "The science of standing out, simplified into creative freedom.",
  "Research-backed design choices you don't even have to think about.",
  "Employer brand consistency at scale. The hardest problem, solved.",
  "What marketing agencies charge premium for, you do on-demand.",
  "The compound effect of consistent employer branding starts today.",
  "Behavioral triggers, trust signals, social proof—automated and beautiful.",
  "Enterprise employer branding tools, startup simplicity.",
  "The ROI of great employer branding is now accessible to everyone.",
  "Brand science + creative freedom = your competitive advantage.",
  "Employer branding complexity is our problem to solve, not yours.",
  "Every template carries the DNA of successful talent campaigns.",
  "The employer branding playbook, automated into your workflow.",
  "Complex candidate journeys, simple creator experience.",
  "We obsess over employer branding science so you can focus on storytelling.",
  "The heavy lifting of EVP communication is handled. Just be yourself.",
  "Employer branding expertise, embedded and invisible.",
  "What works in talent attraction isn't a mystery anymore. It's your default.",
  "Brand building for recruitment, finally as sophisticated as consumer marketing.",
  
  // HireLab Philosophy & Vision (151-200)
  "We believe every company deserves to look like an employer of choice.",
  "Recruitment marketing shouldn't require a marketing team. Now it doesn't.",
  "Our philosophy: if candidates can't see your culture, they can't join it.",
  "Talent attraction is a design problem. We're designers at heart.",
  "We built what we wished existed when we were recruiting.",
  "The tools of elite employer branding, democratized for everyone.",
  "Beautiful recruitment experiences shouldn't be a privilege. They're a right.",
  "We obsess over candidate experience so you can obsess over people.",
  "Our mission: make every employer look like the employer they aspire to be.",
  "Recruitment technology should inspire, not frustrate. Welcome to inspiration.",
  "We believe in the compound effect of beautiful first impressions.",
  "Your employer brand is your promise. We help you make it beautifully.",
  "Design-first thinking applied to humanity's oldest challenge: finding talent.",
  "We're building the future where great jobs find great people.",
  "Candidate experience excellence, accessible to ambitious teams everywhere.",
  "Our philosophy: recruitment deserves the same innovation as consumer products.",
  "The belief that drives us: talent attraction should feel like attraction.",
  "We're here to level the playing field for employer brands of all sizes.",
  "Great companies shouldn't lose talent to better websites. Problem solved.",
  "Our obsession is your success: beautiful pages that fill roles.",
  "We believe in giving every candidate an experience worth having.",
  "The future of recruitment is beautiful. You're already living in it.",
  "Our vision: a world where job discovery feels like product discovery.",
  "We built HireLab because recruitment deserved a design revolution.",
  "Your success in talent attraction is the only metric we care about.",
  "Empowering recruiters with the tools that attract exceptional people.",
  "We believe employer branding is too important to be ugly.",
  "The conviction that drives us: every company can become a talent magnet.",
  "We're not just a platform. We're a philosophy of recruitment excellence.",
  "Our purpose: turning recruitment challenges into beautiful solutions.",
  "We exist because candidates deserve better experiences.",
  "The future where talent finds you—we're building it together.",
  "Our belief: great recruitment design creates great career connections.",
  "We democratize design so you can focus on decisions.",
  "Talent attraction reimagined for teams who refuse to settle.",
  "We believe in recruitment that feels more human, not less.",
  "Our philosophy in action: stunning pages, effortless creation, real results.",
  "We're proving that recruitment can be both beautiful and effective.",
  "The tools of talent attraction, refined and ready for you.",
  "We believe your employer brand should turn heads and fill pipelines.",
  "Our mission continues: making candidate experience a competitive advantage.",
  "We built what ambitious recruiters deserve: power without complexity.",
  "The conviction that every job deserves a beautiful first impression.",
  "We believe in empowering recruiters to create without limits.",
  "Our vision: recruitment experiences so good, candidates share them.",
  "The platform built on a simple belief: design drives decisions.",
  "We're here to make employer branding excellence your everyday reality.",
  "Our philosophy: the candidate journey is sacred. Treat it that way.",
  "We believe in recruitment that attracts, engages, and converts. Beautifully.",
  "Welcome back. Let's create candidate experiences worth remembering.",
];

// Helper to normalize to date key (YYYY-MM-DD) in local time
const toDateKey = (date) => {
  return moment(date).format("YYYY-MM-DD");
};

// Custom hook for typing animation effect
const useTypingEffect = (text, speed = 30) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) return;
    
    setDisplayedText("");
    setIsComplete(false);
    let currentIndex = 0;
    
    const intervalId = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return { displayedText, isComplete };
};

// Get random welcome message - fresh on each page load
const getRandomWelcomeMessage = () => {
  const randomIndex = Math.floor(Math.random() * welcomeMessages.length);
  return welcomeMessages[randomIndex];
};

const MyDashboard = () => {
  const items = [
    {
      key: "1",
      label: "Overview",
      children: <Overview />,
    },
    /*    {
         key: "2",
         label: "Reports",
         children: <Reports />,
       }, */
  ];
  const [activeKey, setActiveKey] = useState("1");
  const [showInviteModal, setShowInviteModal] = useState(true);
  const router = useRouter();
  const [upgradeModalVisible, setUpgradeModalVisible] = useState(false);
  const user = useSelector(selectUser);
  const { getWorkspaceFunnelUsage, currentWorkspace } = useWorkspace();
  const [funnelUsage, setFunnelUsage] = useState(null);
  const tier = user?.tier || { id: 'free', name: 'Free Forever', maxFunnels: 1 };
  const upgradeNeeded = user?.upgradeNeeded;

  // Interview calendar state
  const [interviewEvents, setInterviewEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [calendarLoading, setCalendarLoading] = useState(false);

  // Welcome message with typing animation
  const [welcomeMessage, setWelcomeMessage] = useState("");
  
  useEffect(() => {
    // Set random message on client-side only
    setWelcomeMessage(getRandomWelcomeMessage());
  }, []);

  const { displayedText, isComplete } = useTypingEffect(welcomeMessage, 25);

  // Add effect to check for subscription changes
  useEffect(() => {
    refreshUserData();
  }, []);

  // Fetch workspace funnel usage
  useEffect(() => {
    const fetchFunnelUsage = async () => {
      if (user) {
        try {
          const usage = await getWorkspaceFunnelUsage();
          setFunnelUsage(usage);
        } catch (error) {
          console.error('Error fetching funnel usage:', error);
        }
      }
    };
    fetchFunnelUsage();
  }, [user, getWorkspaceFunnelUsage]);

  // Enhanced logging for debugging plan limits
  useEffect(() => {
    if (user) {
      console.log('Dashboard - User plan data:', {
        tier: user.tier,
        usage: user.usage,
        upgradeNeeded: user.upgradeNeeded,
        landingPageNum: user.landingPageNum,
        funnelUsage: funnelUsage,
        plans: user.plans
      });
    }
  }, [user, funnelUsage]);

  useEffect(() => {
    var aTags = document.getElementsByTagName("div");
    var searchText = "MUI X Missing license key";
    var found;

    for (var i = 0; i < aTags.length; i++) {
      if (aTags[i].textContent == searchText) {
        found = aTags[i];
        found.style = "display: none;";
        break;
      }
    }
  }, []);

  const loadInterviewEvents = useCallback(async () => {
    // Ensure a team is selected (same logic as CandidateChat)
    const currentTeam = JSON.parse(
      typeof window !== "undefined"
        ? window.localStorage.getItem("currentTeam") || "null"
        : "null"
    );
    if (!currentTeam) {
      setInterviewEvents([]);
      return;
    }

    setCalendarLoading(true);
    try {
      // Load first 100 chats, which is typically plenty for upcoming interviews
      const response = await CandidateChatService.getTeamChats(1, 100);
      const chats = response.data?.chats || [];

      const events = [];

      chats.forEach((chat) => {
        const candidate = chat.candidateId || {};
        if (!candidate.meetingScheduled || !candidate.interviewMeetingTimestamp) {
          return;
        }

        const start = new Date(candidate.interviewMeetingTimestamp);
        const end = candidate.interviewMeetingTimestampEnd
          ? new Date(candidate.interviewMeetingTimestampEnd)
          : new Date(start.getTime() + 60 * 60 * 1000);

        events.push({
          id: `${chat._id}-${start.toISOString()}`,
          chatId: chat._id,
          candidateId: candidate._id,
          candidateName: chat.candidateName || candidate.formData?.fullname || candidate.formData?.name || "Candidate",
          jobTitle: chat.jobTitle,
          start,
          end,
          timezone: candidate.interviewMeetingTimezone || "UTC",
          meetingLink: candidate.interviewMeetingLink || null,
        });
      });

      // Sort by start time
      events.sort((a, b) => a.start - b.start);
      setInterviewEvents(events);
    } catch (error) {
      console.error("Error loading interview events for calendar:", error);
      // Fallback to empty list on error
      setInterviewEvents([]);
    } finally {
      setCalendarLoading(false);
    }
  }, []);

  // Initial load of interview events
  useEffect(() => {
    loadInterviewEvents();
  }, [loadInterviewEvents]);

  // Derive highlighted dates and events for the currently selected day
  const highlightedDates = useMemo(
    () => Array.from(new Set(interviewEvents.map((e) => toDateKey(e.start)))),
    [interviewEvents]
  );

  const eventsForSelectedDate = useMemo(() => {
    const key = toDateKey(selectedDate);
    return interviewEvents.filter((e) => toDateKey(e.start) === key);
  }, [interviewEvents, selectedDate]);

  const handleTabChange = (key) => {
    setActiveKey(key);
    if (key === "2") {
      setShowInviteModal(false);
    } else {
      setShowInviteModal(true);
    }
  };

  const handleCreateNewVacancy = () => {
    console.log('🎯 DASHBOARD CREATE VACANCY LIMIT CHECK');

    // Use workspace funnel usage data for accurate counting
    const currentFunnelCount = funnelUsage?.totalCurrentFunnels ?? user?.landingPageNum ?? 0;
    const maxFunnels = user?.planFeatures?.maxFunnels ?? user?.tier?.maxFunnels ?? tier?.maxFunnels ?? 1;
    const hasReachedLimit = maxFunnels !== null && currentFunnelCount >= maxFunnels;
    const tierName = user?.tier?.name ?? tier?.name ?? 'Unknown';

    console.log('Dashboard limit check:', {
      currentFunnelCount,
      maxFunnels,
      hasReachedLimit,
      tierName,
      funnelUsage: funnelUsage,
      note: 'Dashboard now uses workspace funnel usage data'
    });

    if (hasReachedLimit) {
      console.log('🚫 DASHBOARD BLOCKING: User has reached funnel limit, showing upgrade modal');
      setUpgradeModalVisible(true);
      return; // Explicitly prevent further execution
    }

    console.log('✅ DASHBOARD ALLOWING: User can create new vacancy');
    router.push("/dashboard/campaigns?new=true");
  };

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const firstName = user?.firstName?.split(' ')[0] || user?.email?.split('@')[0] || 'there';

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-2">
      {/* Main Content Area */}
      <div className="w-full lg:w-[70%] flex flex-col gap-6">
        {/* Welcome Header Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-8 text-white shadow-xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-purple-200 text-sm font-medium">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {getGreeting()}, {firstName}! 
              </h1>
              <p className="text-purple-100 text-base max-w-md min-h-[48px]">
                <span className="inline">
                  {displayedText}
                </span>
                {!isComplete && (
                  <span className="inline-block w-0.5 h-5 bg-white/70 ml-0.5 animate-pulse align-middle" />
                )}
              </p>
            </div>

            {showInviteModal && (
              <>
                {(() => {
                  let currentFunnelCount, maxFunnels, tierName;

                  if (user?.isWorkspaceSession && user?.workspaceId && funnelUsage?.workspaces) {
                    const workspaceUsage = funnelUsage.workspaces.find(ws => ws._id === user.workspaceId);
                    currentFunnelCount = workspaceUsage?.currentFunnels ?? 0;
                    maxFunnels = workspaceUsage?.maxFunnels ?? 0;
                    tierName = currentWorkspace?.name ? `${currentWorkspace.name}` : 'Workspace';
                  } else {
                    currentFunnelCount = funnelUsage?.totalCurrentFunnels ?? user?.landingPageNum ?? 0;
                    maxFunnels = user?.planFeatures?.maxFunnels ?? user?.tier?.maxFunnels ?? tier?.maxFunnels ?? 1;
                    tierName = user?.tier?.name ?? tier?.name ?? 'Free';
                  }

                  const hasReachedLimit = maxFunnels !== null && currentFunnelCount >= maxFunnels;

                  return (
                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                        <span className="text-purple-100">
                          {maxFunnels === null ?
                            `${currentFunnelCount} funnels` :
                            `${currentFunnelCount} / ${maxFunnels} funnels`
                          }
                        </span>
                        {!user?.isWorkspaceSession && funnelUsage?.workspaces && (
                          <Tooltip
                            title={
                              <div className="space-y-2 p-2">
                                <div className="font-medium">Funnel Allocation</div>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between gap-4">
                                    <span>Main Account:</span>
                                    <span>{funnelUsage.mainAccountFunnels || 0}</span>
                                  </div>
                                  {funnelUsage.workspaces.map(workspace => (
                                    <div key={workspace._id} className="flex justify-between gap-4">
                                      <span>{workspace.name}:</span>
                                      <span>{workspace.currentFunnels || 0}/{workspace.maxFunnels || 0}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            }
                            placement="bottomRight"
                          >
                            <HelpCircle className="w-4 h-4 text-purple-200 hover:text-white cursor-help transition-colors" />
                          </Tooltip>
                        )}
                        <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-medium">
                          {tierName}
                        </span>
                      </div>

                      <Button
                        shape="round"
                        onClick={hasReachedLimit ? () => setUpgradeModalVisible(true) : handleCreateNewVacancy}
                        size="3xl"
                        leftIcon={
                          hasReachedLimit ? (
                            <CrownOutlined className="mr-2 text-yellow-400" />
                          ) : (
                            <PlusOutlined className="mr-2" />
                          )
                        }
                        className={`min-w-[200px] gap-2 font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                          hasReachedLimit
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                            : 'bg-white text-violet-700 hover:bg-gray-50'
                        }`}
                        title={hasReachedLimit ? `Upgrade to create more campaigns` : 'Create a new campaign'}
                      >
                        {hasReachedLimit ? 'Upgrade Plan' : 'Create a New Campaign'}
                      </Button>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        </div>

        {/* Overview Content */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <Overview />
        </div>
      </div>

      {/* Sidebar - Calendar & Events */}
      <div className="w-full lg:w-[30%] flex flex-col gap-6">
        {/* Calendar Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <CalendarRangePicker
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            highlightedDates={highlightedDates}
          />
        </div>

        {/* Scheduled Interviews Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Scheduled Interviews</h3>
            <span className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-full font-medium">
              {eventsForSelectedDate.length} {eventsForSelectedDate.length === 1 ? 'event' : 'events'}
            </span>
          </div>

          {calendarLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
                <span className="text-sm text-gray-500">Loading interviews...</span>
              </div>
            </div>
          )}

          {!calendarLoading && eventsForSelectedDate.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">No interviews scheduled for this date.</p>
              <p className="text-gray-400 text-xs mt-1">Select a highlighted date to see events.</p>
            </div>
          )}

          {!calendarLoading && eventsForSelectedDate.length > 0 && (
            <div className="space-y-3">
              {eventsForSelectedDate.map((event) => (
                <div
                  key={event.id}
                  onClick={() => router.push(`/dashboard/candidate-chat?chatId=${event.chatId}`)}
                  className="group relative p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 cursor-pointer transition-all duration-300 hover:shadow-md hover:border-violet-200 hover:scale-[1.02]"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-1 h-full min-h-[60px] bg-gradient-to-b from-violet-500 to-purple-600 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm text-violet-600 font-medium mb-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>
                          {moment(event.start).format("HH:mm")} - {moment(event.end).format("HH:mm")}
                        </span>
                        {event.timezone && (
                          <span className="text-violet-400 text-xs">({event.timezone})</span>
                        )}
                      </div>
                      <h4 className="font-semibold text-gray-900 truncate">
                        {event.candidateName}
                      </h4>
                      {event.jobTitle && (
                        <p className="text-sm text-gray-600 truncate mt-0.5">
                          {event.jobTitle}
                        </p>
                      )}
                      {event.meetingLink && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 font-medium">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                          </svg>
                          <span>Meeting link available</span>
                        </div>
                      )}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <UpgradeModal
        open={upgradeModalVisible}
        onClose={() => {
          setUpgradeModalVisible(false);
          refreshUserData();
        }}
        currentTier={tier}
        requiredTier={upgradeNeeded}
        feature="funnel"
        usage={user?.usage}
        plans={user?.plans || []}
        upgradeReason="limit"
      />
    </div>
  );
};

export default MyDashboard;
