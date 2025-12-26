/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Spin, message } from "antd";
import { Fragment, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import Cookies from "js-cookie";
import {
  BellrIcon,
  LogoIcon,
  MessagerIcon,
  SearchrIcon,
  TextrIcon,
} from "./Vacancies/components/Icons.js";

import NotificationDropdown from "../../components/NotificationDropdown.jsx";
import WorkspaceService from "../../services/WorkspaceService.js";
import { useWorkspace } from "../../contexts/WorkspaceContext";

import {
  User,
  CreditCard,
  Plug,
  Users,
  ArrowUpCircle,
  Settings,
  ToggleRight,
  LogOut,
  UserPlus,
  ExternalLink
} from "lucide-react";

import { InviteModal } from "../onboarding/components/invite-modal.jsx";
import useWindowDimensions from "../../../pages/hook/useWindowDimensions.js";
import {
  getPartner,
  selectLoading,
  selectUser,
} from "../../redux/auth/selectors.js";
import { ArrowLeftCircle, Building2 } from "lucide-react";
import { partner } from "../../constants.js";
import CrudService from "../../services/CrudService.js";
import TeamService from "../../services/TeamService.js";
import debounce from "lodash/debounce";
import { useRouter } from "next/router";
import debugLogger from "../../utils/debugLogger.js";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example({
  navigation,
  subMenus,
  userNavigation,
  children,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedTopRightOption, setSelectedTopRightOption] = useState("");
  const user = useSelector(selectUser);
  const loading = useSelector(selectLoading);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Team management state
  const [userTeams, setUserTeams] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState("viewer");
  const {
    accessibleWorkspaces,
    pendingInvitations,
    refreshAccessibleWorkspaces,
    workspaceSession,
    currentWorkspace,
    workspaceSwitcherEntries,
    returnFromWorkspace,
    returnToMainSmart,
    switchToWorkspace,
  } = useWorkspace();
  const [workspaceMenuVisible, setWorkspaceMenuVisible] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [hasMainAccessInCurrentTeam, setHasMainAccessInCurrentTeam] = useState(true);
  const [mainAccessResolved, setMainAccessResolved] = useState(false);
  console.log("[theme one logs]hasMainAccessInCurrentTeam", hasMainAccessInCurrentTeam)
  const router = useRouter();
  const prevAllowRef = useRef(user?.allowWorkspaces);
  const autoRoutedRef = useRef(false);

  // Search functionality state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const { width } = useWindowDimensions();

  console.log('useruseruseruser', { user, navigation });


  // Derive own team vs invited team and block state for main account access
  const isOwnTeamContext = Boolean(currentTeam?._id) && Boolean(user?.defaultTeam) && (String(currentTeam._id) === String(user.defaultTeam));
  const isMainBlocked = Boolean(!workspaceSession && mainAccessResolved && !isOwnTeamContext && !hasMainAccessInCurrentTeam);

  //one log that summerize all data about team to debug the user in ivited team logic

  useEffect(() => {
    // console.log("[theme one logs]user",user)
    // console.log("[theme one logs]currentTeam",currentTeam)
    // console.log("[theme one logs]userTeams",userTeams)
    // console.log("[theme one logs]workspaceSession",workspaceSession)
    // console.log("[theme one logs]workspaceSwitcherEntries",workspaceSwitcherEntries)
    // console.log("[theme one logs]switchToWorkspace",switchToWorkspace)
    // console.log("[theme one logs]returnToMainSmart",returnToMainSmart)


    // Debug logging for team context
    console.log("[team context]", {
      isOwnTeamContext,
      isMainBlocked,
      hasMainAccessInCurrentTeam,
      mainAccessResolved,
      currentTeamId: currentTeam?._id,
      userDefaultTeam: user?.defaultTeam,
      userCurrentTeam: user?.currentTeam,
      userCurrentTeamId: user?.currentTeam?._id || user?.currentTeam
    });



  }, [user, currentTeam, userTeams, workspaceSession, workspaceSwitcherEntries, switchToWorkspace, returnToMainSmart]);

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce(async (query) => {
        if (!query.trim() || !user) {
          setSearchResults([]);
          setSearchLoading(false);
          return;
        }

        setSearchLoading(true);
        try {
          const result = await CrudService.search("LandingPageData", 5, 1, {
            text: query,
            filters: {
              user_id: user._id,
            },
            sort: { createdAt: "desc" },
          });

          setSearchResults(result.data.items || []);
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        } finally {
          setSearchLoading(false);
        }
      }, 300),
    [user]
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim()) {
      setShowSearchDropdown(true);
      debouncedSearch(value);
    } else {
      setShowSearchDropdown(false);
      setSearchResults([]);
    }
  };

  // Handle search focus
  const handleSearchFocus = () => {
    setSearchFocused(true);
    if (searchQuery.trim()) {
      setShowSearchDropdown(true);
    }
  };

  // Handle search blur
  const handleSearchBlur = () => {
    setSearchFocused(false);
    // Delay hiding dropdown to allow clicking on results
    setTimeout(() => {
      setShowSearchDropdown(false);
    }, 200);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchDropdown(false);
  };

  const handleCloseModal = () => {
    setShowInviteModal(false);
  };
  const handleOpenModal = async () => {
    if (workspaceSession) {
      return message.info("Team invitations are managed from your primary account.");
    }
    try {
      // Ensure teams are loaded (team creation now happens automatically in loadUserTeams)
      if (!currentTeam) {
        await loadUserTeams();
      }

      // Open modal if we have a current team
      if (currentTeam) {
        console.log("[theme one logs]Opening modal for team:", currentTeam.name);
        setShowInviteModal(true);
      } else {
        message.error('Unable to access your team. Please refresh the page and try again.');
      }
    } catch (error) {
      console.error('Error in handleOpenModal:', error);
      message.error('Something went wrong. Please try again.');
    }
  };

  // Team management functions
  const loadUserTeams = async () => {
    if (!user) return;

    try {
      setLoadingTeams(true);
      const response = await TeamService.getUserTeams();
      const userTeams = response.teams || [];
      setUserTeams(userTeams);

      // Clear any existing team references
      setCurrentTeam(null);
      setCurrentUserRole("viewer");

      // Validate and set current team
      // First check if user has currentTeam set in Redux (from backend updates)
      let teamToSet = null;

      if (user?.currentTeam && userTeams.length > 0) {
        // Use the currentTeam from user data (set by backend)
        teamToSet = userTeams.find(t => t._id === user.currentTeam._id || t._id === user.currentTeam);
        console.log("[loadUserTeams] Using user.currentTeam:", user.currentTeam, "found team:", teamToSet);
      }

      if (!teamToSet) {
        // Fallback to stored team in localStorage
        const storedTeam = TeamService.getCurrentTeam();
        if (storedTeam && userTeams.length > 0) {
          // Only use stored team if user is actually a member of it
          teamToSet = userTeams.find(t => t._id === storedTeam._id);

          if (!teamToSet) {
            // Stored team is invalid, clear it and use first available team
            console.warn("Stored team is no longer accessible, clearing localStorage");
            TeamService.removeCurrentTeam();
            teamToSet = userTeams[0];
          }
        } else if (userTeams.length > 0) {
          // No stored team or empty teams, use first available
          teamToSet = userTeams[0];
        }
      }

      // Set the validated team
      if (teamToSet) {
        setCurrentTeam(teamToSet);
        setCurrentUserRole(teamToSet.role || "viewer");
        TeamService.setCurrentTeam(teamToSet);
        console.log("[theme one logs]Set current team:", teamToSet.name, "Role:", teamToSet.role);
        console.log("[loadUserTeams] Final team set:", teamToSet._id, "user.currentTeam:", user?.currentTeam);
      } else {
        // No teams available, create one automatically
        console.log("[theme one logs]No teams available for user, creating one automatically");
        try {
          const createResponse = await TeamService.createTeamForUser();

          if (createResponse.success) {
            const newTeam = createResponse.team;
            setCurrentTeam(newTeam);
            setCurrentUserRole("owner");
            TeamService.setCurrentTeam(newTeam);
            setUserTeams([newTeam]); // Update the userTeams state

            console.log('✅ Team created automatically:', newTeam.name);
            message.success(`Welcome! Your team "${newTeam.name}" has been created.`);
          } else {
            console.error('❌ Failed to create team automatically:', createResponse.message);
            // Fallback: clear everything
            TeamService.removeCurrentTeam();
            setCurrentTeam(null);
            setCurrentUserRole("viewer");
          }
        } catch (error) {
          console.error('❌ Error creating team automatically:', error);
          // Fallback: clear everything  
          TeamService.removeCurrentTeam();
          setCurrentTeam(null);
          setCurrentUserRole("viewer");
        }
      }
    } catch (error) {
      console.error("Error loading teams:", error);
      // Clear team references on error
      setCurrentTeam(null);
      setCurrentUserRole("viewer");
      TeamService.removeCurrentTeam();
    } finally {
      setLoadingTeams(false);
    }
  };

  const handleSwitchTeam = async (team) => {
    try {
      console.log(`🔄 Frontend: Switching to team ${team.name} (${team._id})`);
      console.log(`🔄 Current user role in this team: ${team.role}`);

      await TeamService.switchTeam(team._id);
      setCurrentTeam(team);
      setCurrentUserRole(team.role || "viewer");
      TeamService.setCurrentTeam(team);

      // Clear any stale localStorage data
      console.log(`🔄 Clearing localStorage and reloading...`);
      localStorage.removeItem("pendingInvitation");
      localStorage.removeItem("teamMemberState");
      // Mark that we just switched teams so we can optionally auto-route into a workspace on load
      try { localStorage.setItem('autoRouteOnLoad', '1'); } catch (e) { }

      // Add cache busting to force clean reload
      window.location.href = window.location.pathname + "?t=" + Date.now();
    } catch (error) {
      console.error("Error switching team:", error);
    }
  };

  // Load teams on component mount
  useEffect(() => {
    if (user && !workspaceSession) {
      loadUserTeams();
    } else {
      setUserTeams([]);
      setCurrentTeam(null);
      setCurrentUserRole("viewer");
    }
  }, [user, workspaceSession]);

  // Determine if current team grants main account access for this user
  useEffect(() => {
    const resolve = async () => {
      if (!currentTeam || !user) {
        setHasMainAccessInCurrentTeam(true);
        setMainAccessResolved(true);
        return;
      }

      const isOwnTeam = Boolean(currentTeam?._id) && Boolean(user?.defaultTeam) && (String(currentTeam._id) === String(user.defaultTeam));
      if (isOwnTeam) {
        setHasMainAccessInCurrentTeam(true);
        setMainAccessResolved(true);
        return;
      }

      try {
        const details = await TeamService.getTeamDetails(currentTeam._id);
        const access = details?.team?.userMainAccountAccess;
        if (typeof access === 'boolean') {
          setHasMainAccessInCurrentTeam(access);
          setMainAccessResolved(true);
          return;
        }
      } catch (e) {
        // ignore and fall back
      }

      // Fallback: infer from permissions if team details unavailable
      const perms = currentTeam.permissions || {};
      const hasAnyAccess = !(perms.landingPages === 'none' && perms.mediaLibrary === 'none' && perms.teamManagement === 'none' && perms.ats === 'none');
      setHasMainAccessInCurrentTeam(hasAnyAccess);
      setMainAccessResolved(true);
    };
    resolve();
  }, [currentTeam?._id, user?.defaultTeam]);

  // 🔥 Check if user has pending EMAIL invitations and redirect
  useEffect(() => {
    const checkPendingInvitations = async () => {
      if (user && user.email) {
        try {
          // Check if user has pending invitations by email
          const response = await TeamService.getInvitationByEmail(user.email);
          if (response.success && response.invitation) {
            console.log("[theme one logs]🔥 User has pending invitation, redirecting:", response.invitation.token);
            router.push(`/team/invitation/${response.invitation.token}`);
          }
        } catch (error) {
          // No pending invitations, continue normally
          console.log("[theme one logs]No pending invitations for user");
        }
      }
    };

    checkPendingInvitations();
  }, [user, router]);

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Proactively refresh accessible workspaces when relevant context changes
  useEffect(() => {
    if (!user) return;
    // Initial load and when team owner context changes
    refreshAccessibleWorkspaces?.();
  }, [user?._id, currentTeam?.owner?._id]);

  // Enforce redirect when in invited team with no main account access
  useEffect(() => {
    if (!isMainBlocked) return;
    const entries = workspaceSwitcherEntries();
    const currentOwnerId = currentTeam?.owner?._id || currentTeam?.owner || null;
    const filteredActive = (entries.active || []).filter((e) => !currentOwnerId || e.ownerId === currentOwnerId);
    if (filteredActive.length > 0) {
      switchToWorkspace(filteredActive[0].id, { skipRedirect: false }).catch(() => {
        router.replace('/dashboard/workspaces');
      });
    } else {
      router.replace('/dashboard/workspaces');
    }
  }, [isMainBlocked, currentTeam?._id]);

  // If workspace feature is revoked, ensure switcher closes and data refreshes
  useEffect(() => {
    const prev = prevAllowRef.current;
    const curr = Boolean(user?.allowWorkspaces);
    if (prev === true && curr === false) {
      try {
        setWorkspaceMenuVisible(false);
        refreshAccessibleWorkspaces?.();
      } catch (e) { }
    }
    prevAllowRef.current = curr;
  }, [user?.allowWorkspaces, refreshAccessibleWorkspaces]);

  const { acceptWorkspaceInvitation } = WorkspaceService;

  const workspaceMenu = useMemo(() => {
    const entries = workspaceSwitcherEntries();
    // Filter workspaces to only those owned by the current team's owner (context isolation)
    const currentOwnerId = currentTeam?.owner?._id || currentTeam?.owner || null;
    const filteredActive = (entries.active || []).filter((e) => !currentOwnerId || e.ownerId === currentOwnerId);
    const filteredPending = (entries.pending || []).filter((e) => !currentOwnerId || e.ownerId === currentOwnerId);

    // Show workspace switcher if user has workspace privilege OR has accessible workspaces for the current team owner.
    // IMPORTANT: When allowWorkspaces is false and currentOwnerId is not yet resolved, do NOT show switcher.
    const isOwnTeam = Boolean(currentTeam?._id) && Boolean(user?.defaultTeam) && (String(currentTeam._id) === String(user.defaultTeam));
    const hasWorkspaceAccess = (
      Boolean(user?.allowWorkspaces) ||
      (Boolean(currentOwnerId) && !isOwnTeam && ((filteredActive.length > 0) || (filteredPending.length > 0)))
    );

    const mainAccountItem = (workspaceSession || Boolean(user?.allowWorkspaces)) && hasMainAccessInCurrentTeam
      ? [{
        key: 'workspace-main-account',
        label: (
          <div className="font-medium">Main Account</div>
        ),
        onSelect: async () => {
          setWorkspaceMenuVisible(false);
          if (workspaceSession) {
            try {
              await returnFromWorkspace({ redirectTo: '/dashboard', skipRedirect: false });
            } catch (error) {
              console.error('Error returning to main account:', error);
              message.error(error?.response?.data?.message || 'Failed to return to main account');
            }
          } else {
            router.push('/dashboard');
          }
        },
      }]
      : [];

    const pendingItems = filteredPending.map((invite) => ({
      key: `workspace-pending-${invite.token}`,
      label: (
        <div className="flex flex-col">
          <span className="font-medium">{invite.name}</span>
          <span className="text-xs text-gray-500">Pending ({invite.role || 'member'})</span>
          <button
            className="text-xs text-indigo-600 mt-1 text-left"
            onClick={async () => {
              setWorkspaceMenuVisible(false);
              try {
                await acceptWorkspaceInvitation(invite.token);
                await refreshAccessibleWorkspaces();
              } catch (error) {
                message.error(error.response?.data?.message || 'Failed to accept invitation');
              }
            }}
          >
            Accept invitation
          </button>
        </div>
      ),
    }));

    const activeItems = filteredActive.map((entry) => ({
      key: `workspace-active-${entry.id}`,
      label: (
        <div className="flex flex-col">
          <span className="font-medium">{entry.name}</span>
          <span className="text-xs text-gray-500">Role: {entry.role || 'member'}</span>
        </div>
      ),
      onSelect: async () => {
        setWorkspaceMenuVisible(false);
        if (entry.id) {
          try {
            await switchToWorkspace(entry.id, { skipRedirect: false });
          } catch (error) {
            console.error('Error switching workspace:', error);
            message.error(error?.response?.data?.message || 'Failed to switch workspace');
          }
        }
      },
    }));

    const items = [...mainAccountItem, ...pendingItems, ...activeItems];

    if (workspaceSession) {
      items.push({ type: 'divider', key: 'divider-main' });
      items.push({
        key: 'workspace-return-main',
        label: (
          <div className="flex items-center gap-2">
            <ArrowLeftCircle className="w-4 h-4" />
            <span>Return to main account</span>
          </div>
        ),
        onSelect: async () => {
          setWorkspaceMenuVisible(false);
          await returnToMainSmart();
        },
      });
    }

    const hasEntries = workspaceSession ? (items.length > 0) : (hasWorkspaceAccess && items.length > 0);
    return { items, hasEntries };
  }, [workspaceSwitcherEntries, acceptWorkspaceInvitation, refreshAccessibleWorkspaces, workspaceSession, user?.allowWorkspaces, returnFromWorkspace, switchToWorkspace, currentTeam?._id, currentTeam?.owner?._id, currentTeam?.owner, user?.defaultTeam, hasMainAccessInCurrentTeam]);

  // Auto-route only immediately after explicit team switches (one-time), to avoid landing on invited team main account
  useEffect(() => {
    if (workspaceSession) return;
    const flag = (() => { try { return localStorage.getItem('autoRouteOnLoad'); } catch (e) { return null; } })();
    if (flag !== '1') return;
    // Wait until access is resolved before making a decision and clearing the flag
    if (!mainAccessResolved) return;

    const entries = workspaceSwitcherEntries();
    const currentOwnerId = currentTeam?.owner?._id || currentTeam?.owner || null;
    const isOwnTeam = Boolean(currentTeam?._id) && Boolean(user?.defaultTeam) && (String(currentTeam._id) === String(user.defaultTeam));
    if (isOwnTeam) { try { localStorage.removeItem('autoRouteOnLoad'); } catch (e) { } return; }
    if (hasMainAccessInCurrentTeam) { try { localStorage.removeItem('autoRouteOnLoad'); } catch (e) { } return; } // only auto-route when main-account access is false
    const filteredActive = (entries.active || []).filter((e) => !currentOwnerId || e.ownerId === currentOwnerId);
    if (filteredActive.length > 0) {
      switchToWorkspace(filteredActive[0].id, { skipRedirect: false }).catch(() => { });
    }
    try { localStorage.removeItem('autoRouteOnLoad'); } catch (e) { }
  }, [workspaceSession, currentTeam?._id, currentTeam?.owner?._id, currentTeam?.owner, user?.defaultTeam, workspaceSwitcherEntries, switchToWorkspace, hasMainAccessInCurrentTeam, mainAccessResolved]);

  // Reset auto-route guard when team context or permissions change
  useEffect(() => {
    autoRoutedRef.current = false;
  }, [currentTeam?._id, user?.allowWorkspaces]);

  useEffect(() => { }, [workspaceSession]);

  return (
    <div>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex flex-1 w-full max-w-xs mr-16">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 flex justify-center w-16 pt-5 left-full">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="w-6 h-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex flex-col px-6 pb-4 overflow-y-auto bg-white grow gap-y-5">
                    <div className="flex items-center h-16 shrink-0">
                      <img
                        className="w-auto h-8"
                        src={partner?.dashboardLogo || partner?.logo}
                        alt=" "
                      />
                    </div>
                    <nav className="flex flex-col flex-1">
                      <ul role="list" className="flex flex-col flex-1 gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((category, i) => (
                              <div key={i}>
                                <h1
                                  className={`submenu-category-title dark:text-gray-900 ${collapsed
                                    ? "w-[68px] text-center !mx-0"
                                    : ""
                                    }`}
                                >
                                  {category.name}
                                </h1>
                                {(category.subitems || []).map((item) => (
                                  item.grayout ? (
                                    <div
                                      key={item.name}
                                      className={classNames(
                                        "opacity-50 cursor-not-allowed",
                                        `submenu-item-box transition-all duration-200 ${collapsed ? "flex justify-center" : ""
                                        }`
                                      )}
                                    >
                                      <div className=" flex p-2 text-sm font-semibold leading-6 rounded-md group gap-x-3">
                                        <item.icon
                                          className="h-6 w-6 shrink-0 submenu-item-icon text-gray-400"
                                          aria-hidden="true"
                                        />
                                        {!collapsed && <span className="text-gray-400">{item.name}</span>}
                                      </div>
                                    </div>
                                  ) : (
                                    <Link
                                      key={item.name}
                                      href={item.href}
                                      target={item?.target}
                                      className={classNames(
                                        item.current
                                          ? "bg-indigo-500 text-white current dark:bg-gray-600 dark:text-gray-400"
                                          : "hover:text-white hover:bg-indigo-500 dark:hover:bg-gray-600",
                                        `submenu-item-box transition-all duration-200 ${collapsed ? "flex justify-center" : ""
                                        }`
                                      )}
                                    >
                                      <div className=" flex p-2 text-sm font-semibold leading-6 rounded-md group gap-x-3">
                                        <item.icon
                                          className={classNames(
                                            item.current
                                              ? "text-white current"
                                              : "group-hover:text-white",
                                            "h-6 w-6 shrink-0 submenu-item-icon"
                                          )}
                                          aria-hidden="true"
                                        />
                                        {!collapsed && item.name}

                                        {item?.isOnboardingCompleted === false && (

                                          <span className="relative flex items-center">
                                            {item.name === "Brand Kit" && (
                                              <div className="relative flex items-center justify-center">
                                                <span className=" inline-flex h-4 w-4 rounded-full bg-red-400 opacity-50 animate-ping">
                                                </span>
                                                <span className="absolute  inline-flex h-[8px] w-[7.9px] rounded-full bg-red-600">
                                                </span>
                                              </div>
                                            )}
                                          </span>
                                        )}
                                      </div>
                                    </Link>
                                  )
                                ))}
                              </div>
                            ))}
                          </ul>
                        </li>
                        {(subMenus || []).map((subMenu, i) => (
                          <li key={i}>
                            <div className="text-xs font-semibold leading-6 text-indigo-200">
                              {subMenu.title}
                            </div>
                            <ul role="list" className="mt-2 -mx-2 space-y-1">
                              {(subMenu.items || []).map((team) => (
                                <li key={team.name}>
                                  <Link
                                    href={team.href}
                                    target={team?.target}
                                    className={classNames(
                                      team.current
                                        ? "bg-indigo-500 text-white dark:bg-gray-600 dark:text-gray-400"
                                        : "text-indigo-200 hover:text-white hover:bg-indigo-500 dark:hover:bg-gray-600",
                                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                    )}
                                  >
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 dark:bg-gray-600 dark:text-gray-400 text-[0.625rem] font-medium text-white">
                                      {team.initial}
                                    </span>
                                    <span className="truncate">
                                      {team.name}
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div
          className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col mt-[132px] px-[32px]  "
          style={{ width: 200 }}
        >
          {/* Sidebar component, swap this element with another sidebar if you like */}

          <div
            style={{
              width: (collapsed ? 80 : 200),
              position: "fixed",
              background: "#f8f8f8",
              marginLeft: -80,
              height: "200vh",
              // marginTop: -200,
              zIndex: 1,
              position: "absolute",
            }}
          ></div>
          <div
            className="flex flex-col overflow-y-auto transition-all duration-200 bg-white grow  rounded-xl dark:bg-gray-500"
            style={{
              zIndex: 2,
              borderRadius: 20,
              width: collapsed ? 80 : 200,
              paddingInline: collapsed ? 6 : 16,
              marginTop: -25,
              marginRight: 1,
              // backgroundColor: "blue",
            }}
          >
            <nav className="flex flex-col flex-1 ">
              <ul role="list" className="flex flex-col flex-1 ">
                <li>
                  <ul role="list" className="pt-6 space-y-1 ">
                    {navigation.map((category, i) => (
                      <div key={i}>
                        <h1
                          className={`submenu-category-title dark:text-gray-900 ${collapsed ? "w-[68px] text-center !mx-0" : ""
                            }`}
                        >
                          {category.name}
                        </h1>
                        {category?.subitems?.map?.((item) => (
                          item.grayout ? (
                            <div
                              key={item.name}
                              className={classNames(
                                "opacity-50 cursor-not-allowed",
                                `submenu-item-box transition-all duration-200 ${collapsed ? "flex justify-center" : ""
                                }`
                              )}
                            >
                              <div className="flex p-2 text-xs lgr:text-sm font-semibold leading-6 rounded-md group gap-x-3">
                                <item.icon
                                  className="h-6 w-6 shrink-0 submenu-item-icon text-gray-400"
                                  aria-hidden="true"
                                />
                                {!collapsed && <span className="text-gray-400">{item.name}</span>}
                              </div>
                            </div>
                          ) : (
                            <Link
                              key={item.name}
                              href={item.href}
                              target={item?.target}
                              className={classNames(
                                item.current
                                  ? "bg-indigo-500 text-white current dark:bg-gray-600 dark:text-gray-400"
                                  : "hover:text-white hover:bg-indigo-500 dark:hover:bg-gray-600",
                                `submenu-item-box transition-all duration-200 ${collapsed ? "flex justify-center" : ""
                                }`
                              )}
                            >
                              <div className="flex p-2 text-xs lgr:text-sm font-semibold leading-6 rounded-md group gap-x-3">
                                <item.icon
                                  className={classNames(
                                    item.current
                                      ? "text-white current"
                                      : "group-hover:text-white",
                                    "h-6 w-6 shrink-0 submenu-item-icon"
                                  )}
                                  aria-hidden="true"
                                />
                                {!collapsed && item.name}
                                {item?.isOnboardingCompleted === false && (

                                  <span className="relative flex items-center">
                                    {item.name === "Brand Kit" && (
                                      <div className="relative flex items-center justify-center">
                                        <span className=" inline-flex h-4 w-4 rounded-full bg-red-400 opacity-50 animate-ping">
                                        </span>
                                        <span className="absolute  inline-flex h-[8px] w-[7.9px] rounded-full bg-red-600">
                                        </span>
                                      </div>
                                    )}
                                  </span>
                                )}
                              </div>
                            </Link>
                          )
                        ))}
                      </div>
                    ))}
                  </ul>
                  <div className="w-full flex justify-center mt-[48px]">
                    <div
                      className="submenu-retract-button dark:bg-gray-600"
                      style={{ transform: collapsed ? "rotate(180deg)" : "" }}
                      onClick={() => setCollapsed((t) => !t)}
                    >
                      <TextrIcon />
                    </div>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="topbar">
          <div
            style={{
              height: 80,
              width: "100%",
            }}
          ></div>
          <div
            className="w-full"
            style={{
              position: "fixed",
              background: "#f8f8f8",
              marginTop: -24,
              height: 70,
              zIndex: 998,
            }}
          ></div>
          <div
            className="topbar-container w-[98.5%] "
            style={{
              position: "fixed",
              zIndex: 999,
              height: 70,
              display: "flex",
              alignItems: "center",
            }}
          >
            <div className="topbar-inner" style={{ display: "flex", alignItems: "center", height: "100%", width: "100%" }}>
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300  lg:hidden flex items-center h-full"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="w-6 h-6" aria-hidden="true" />
              </button>

              <div className="flex items-center justify-between w-full gap-x-4 lg:gap-x-6 h-full">
                <div className="flex items-center flex-1 gap-3 h-full">
                  <LogoIcon height={32} className="hidden lg:block" />
                </div>
                <div className="relative justify-center flex-1 hidden lg:flex h-full">
                  <div className="top-search-wrapper flex items-center h-full relative">
                    <label htmlFor="search-field" className="sr-only">
                      Search
                    </label>
                    <SearchrIcon />
                    <input
                      id="search-field"
                      className="block w-full h-full  bg-transparent !border-0 !bg-transparent border-transparent focus:border-0 focus:outline-none focus:ring-0 outline-none ring-0"
                      placeholder="Search vacancies..."
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={handleSearchFocus}
                      onBlur={handleSearchBlur}
                      style={{ height: "145%" }}
                    />

                    {/* Search Dropdown */}
                    {showSearchDropdown && (searchResults.length > 0 || searchLoading || searchQuery.trim()) && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-80 overflow-y-auto">
                        {searchLoading && (
                          <div className="px-4 py-3 text-center">
                            <Spin size="small" />
                            <span className="ml-2 text-sm text-gray-500">Searching...</span>
                          </div>
                        )}

                        {!searchLoading && searchResults.length === 0 && searchQuery.trim() && (
                          <div className="px-4 py-3 text-center text-sm text-gray-500">
                            No vacancies found for "{searchQuery}"
                          </div>
                        )}

                        {!searchLoading && searchResults.length > 0 && (
                          <>
                            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-200 dark:border-gray-700">
                              Vacancies ({searchResults.length})
                            </div>
                            {searchResults.map((vacancy) => (
                              <Link
                                key={vacancy._id}
                                href={`/edit-page/${vacancy._id}`}
                                onClick={() => {
                                  clearSearch();
                                }}
                                className="flex items-start px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {vacancy.vacancyTitle || "Untitled Vacancy"}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {vacancy.location && (
                                      <span className="mr-3">📍 {Array.isArray(vacancy.location) ? vacancy.location.join(", ") : vacancy.location}</span>
                                    )}
                                    {vacancy.department && (
                                      <span className="mr-3">🏢 {vacancy.department}</span>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-400 mt-1">
                                    Created: {new Date(vacancy.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                                <ExternalLink className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                              </Link>
                            ))}
                            {searchResults.length === 5 && (
                              <Link
                                href={`/dashboard/vacancies?search=${encodeURIComponent(searchQuery)}`}
                                onClick={clearSearch}
                                className="block px-4 py-3 text-center text-sm text-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                              >
                                View all results →
                              </Link>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-end flex-1 gap-x-4 lg:gap-x-6 h-full">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 flex items-center h-full"
                  >
                    <span className="sr-only">View notifications</span>
                    <div className="top-right-options flex items-center h-full">
                      {workspaceMenu.hasEntries && (
                        <div className="mr-2">
                          <div className="relative">
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              onClick={() => setWorkspaceMenuVisible((prev) => !prev)}
                            >
                              {workspaceSession && currentWorkspace?.name ? currentWorkspace.name : 'Workspaces'}
                              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                            </button>
                            {workspaceMenuVisible && (
                              <div className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                {workspaceMenu.items.map((item) => (
                                  item.type === 'divider' ? (
                                    <div key={item.key} className="border-t border-gray-100 my-1" />
                                  ) : (
                                    <button
                                      key={item.key}
                                      onClick={() => {
                                        setWorkspaceMenuVisible(false);
                                        item.onSelect?.();
                                      }}
                                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      {item.label}
                                    </button>
                                  )
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {!workspaceSession && (
                        <div
                          onClick={() => {
                            handleOpenModal();
                            setSelectedTopRightOption("invite");
                          }}
                          className={`top-right-inner-circle ${selectedTopRightOption === "invite"
                            ? "active"
                            : ""
                            } cursor-pointer flex items-center h-full ${loadingTeams ? "opacity-50" : ""
                            }`}
                        >
                          {loadingTeams ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent"></div>
                          ) : (
                            <UserPlus />
                          )}
                        </div>
                      )}
                      {showInviteModal && (
                        <InviteModal
                          open={showInviteModal}
                          onClose={handleCloseModal}
                          teamId={currentTeam?._id}
                          teamName={currentTeam?.name}
                          currentUserRole={currentUserRole}
                          workspaceId={workspaceSession ? currentWorkspace?.id : undefined}
                          workspaceName={workspaceSession ? currentWorkspace?.name : undefined}
                          defaultInvitationType={workspaceSession ? "workspace" : "team"}
                        />
                      )}
                      <div
                        className={`top-right-inner-circle ${selectedTopRightOption === "notifications"
                          ? "active"
                          : ""
                          } flex items-center h-full`}
                      >
                        <NotificationDropdown
                          onToggle={(isOpen) => {
                            setSelectedTopRightOption(isOpen ? "notifications" : "");
                          }}
                        />
                      </div>
                      <div
                        onClick={() => {
                          router.push('/dashboard/candidate-chat');
                        }}
                        className={`top-right-inner-circle ${selectedTopRightOption === "chat" ? "active" : ""
                          } cursor-pointer flex items-center h-full`}
                      >
                        <MessagerIcon />
                      </div>
                    </div>
                  </button>
                  <Menu as="div" className="relative h-full flex items-center">
                    <Menu.Button className="-m-1.5 flex items-center p-1.5 h-full focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0">
                      <span className="sr-only">Open user menu</span>
                      {!user?.avatar && (
                        <UsersIcon className="w-8 h-8 rounded-full bg-gray-50" />
                      )}
                      {user?.avatar && (
                        <img
                          className="w-8 h-8 rounded-full bg-gray-50  object-cover"
                          src={user?.avatar}
                          alt=""
                        />
                      )}
                      <span className="hidden lg:flex lg:items-center">
                        <ChevronDownIcon
                          className="w-5 h-5 ml-2 text-gray-400 dark:text-gray-300"
                          aria-hidden="true"
                        />
                      </span>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >

                      <Menu.Items className="absolute z-40 mt-2.5 w-48 origin-top-right rounded-md bg-white dark:bg-gray-600 py-2 shadow-lg dark:shadow-gray-400/50 hover:shadow-gray-600/50  ring-1 ring-gray-900/5 focus:outline-none" style={{ top: '100%', right: '0px', left: 'auto', transform: 'translateX(-5px)' }}>
                        {/*  */}
                        <div className="flex items-center gap-3 p-2 pt-0">
                          {user?.avatar && (
                            <img
                              className="w-10 h-10 rounded-full bg-gray-50 object-cover"
                              src={user?.avatar}
                              alt="User Avatar"
                            />
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className="block font-semibold text-gray-900 dark:text-white truncate">
                              {user?.firstName + " " + user?.lastName}
                            </span>
                            <span className="block text-sm text-gray-500 dark:text-gray-400 truncate" title={user?.email}>
                              {user?.email}
                            </span>
                            <span className="text-[10px] px-1 rounded-lg border w-fit bg-white-A700_33">Free</span>
                          </div>
                        </div>

                        {/* Team Switcher */}
                        {userTeams.length > 0 && (
                          <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                              Current Team
                            </div>
                            <div className="space-y-1">
                              {userTeams.map((team) => (
                                <button
                                  key={team._id}
                                  onClick={() => handleSwitchTeam(team)}
                                  className={`w-full flex items-center gap-2 px-2 py-1 text-sm rounded-md transition-colors ${currentTeam?._id === team._id
                                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                  <div className="w-6 h-6 rounded bg-indigo-500 flex items-center justify-center text-white text-xs font-medium">
                                    {team.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="flex-1 text-left">
                                    <div className="font-medium">{team.name}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      {team.role === 'owner' ? 'Owner' :
                                        team.role === 'admin' ? 'Admin' :
                                          team.role === 'editor' ? 'Editor' :
                                            team.role === 'atsOnly' ? 'ATS Only' : 'Viewer'}
                                    </div>
                                  </div>
                                  {currentTeam?._id === team._id && (
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => {

                              console.log("[theme one logs]item.logo", item.logo)
                              return (
                                <div className={classNames(
                                  item.grayout ? "opacity-50 cursor-not-allowed" :
                                    active ? "bg-gray-50 dark:bg-gray-700  px-4 transition-all duration-300" : `${item.name === "Sign out" ? "text-red-500 dark:text-red-500" : ""}`,
                                  `flex items-center gap-x-2  px-3 py-1 text-sm leading-6 text-gray-900 dark:text-gray-400 `
                                )}
                                >
                                  {item.logo && <item.logo className={classNames("w-4 h-4", item.grayout ? "text-gray-400" : "")} />}
                                  {item.grayout ? (
                                    <span className="text-gray-400">{item.name}</span>
                                  ) : (
                                    <Link
                                      href={item.href}
                                      target={item?.target}
                                      onClick={item.onClick}

                                    >
                                      {item.name}
                                    </Link>
                                  )}
                                </div>
                              )


                            }}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          </div>

          <main className="w-full py-0 bg-[#F8F8F8]">
            <div
              className={`px-2 sm:px-6 lg:px-4 transition-all duration-200 ${width < 1024 ? "" : collapsed ? "ml-[80px]" : "ml-[204px]"
                }`}
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
