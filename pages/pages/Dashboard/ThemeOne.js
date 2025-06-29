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
import { Spin } from "antd";
import { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import {
  BellrIcon,
  LogoIcon,
  MessagerIcon,
  SearchrIcon,
  TextrIcon,
} from "../../components/Icons";

import { 
  User, 
  CreditCard, 
  Plug, 
  Users, 
  ArrowUpCircle, 
  Settings, 
  ToggleRight, 
  LogOut ,
  UserPlus
} from "lucide-react";

import  {InviteModal}  from "../onboarding/components/invite-modal.jsx";
import useWindowDimensions from "../../hook/useWindowDimensions";
import {
  getPartner,
  selectLoading,
  selectUser,
} from "../../redux/auth/selectors";
import { partner } from "../../constants.js";

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

  const { width } = useWindowDimensions();

  console.log('useruseruseruser',{user , navigation});


  const handleCloseModal = () => {
    setShowInviteModal(false);
   
  };
  const handleOpenModal = () => {
    setShowInviteModal(true);
   
  };

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
                                  className={`submenu-category-title dark:text-gray-900 ${
                                    collapsed
                                      ? "w-[68px] text-center !mx-0"
                                      : ""
                                  }`}
                                >
                                  {category.name}
                                </h1>
                                {category.subitems.map((item) => (
                                  <Link
                                    key={item.name}
                                    href={item.href}
                                    target={item?.target}
                                    className={classNames(
                                      item.current
                                        ? "bg-indigo-500 text-white current dark:bg-gray-600 dark:text-gray-400"
                                        : "hover:text-white hover:bg-indigo-500 dark:hover:bg-gray-600",
                                      `submenu-item-box transition-all duration-200 ${
                                        collapsed ? "flex justify-center" : ""
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

                                      { item?.isOnboardingCompleted === false &&(

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
                                ))}
                              </div>
                            ))}
                          </ul>
                        </li>
                        {subMenus.map((subMenu, i) => (
                          <li key={i}>
                            <div className="text-xs font-semibold leading-6 text-indigo-200">
                              {subMenu.title}
                            </div>
                            <ul role="list" className="mt-2 -mx-2 space-y-1">
                              {subMenu.items.map((team) => (
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
              width: (collapsed ? 80 : 200) ,
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
                          className={`submenu-category-title dark:text-gray-900 ${
                            collapsed ? "w-[68px] text-center !mx-0" : ""
                          }`}
                        >
                          {category.name}
                        </h1>
                        {category.subitems.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            target={item?.target}
                            className={classNames(
                              item.current
                                ? "bg-indigo-500 text-white current dark:bg-gray-600 dark:text-gray-400"
                                : "hover:text-white hover:bg-indigo-500 dark:hover:bg-gray-600",
                              `submenu-item-box transition-all duration-200 ${
                                collapsed ? "flex justify-center" : ""
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
                                     { item?.isOnboardingCompleted === false &&(

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
                  {loading && <Spin />}
                </div>
                <form
                  className="relative flex justify-center flex-1 hidden lg:block h-full"
                  action="#"
                  method="GET"
                >
                  <div className="top-search-wrapper flex items-center h-full">
                    <label htmlFor="search-field" className="sr-only">
                      Search
                    </label>
                    <SearchrIcon />
                    <input
                      id="search-field"
                      className="block w-full h-full py-0 pl-0 pr-0 bg-transparent border-0 border-transparent"
                      placeholder="Search"
                      type="search"
                      style={{ height: "100%" }}
                    />
                  </div>
                </form>
                <div className="flex items-center justify-end flex-1 gap-x-4 lg:gap-x-6 h-full">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 flex items-center h-full"
                  >
                    <span className="sr-only">View notifications</span>
                    <div className="top-right-options flex items-center h-full">
                      <div
                        onClick={() => {
                          handleOpenModal();
                          setSelectedTopRightOption("invite");
                        }}
                        className={`top-right-inner-circle ${
                          selectedTopRightOption === "invite"
                            ? "active"
                            : ""
                        } cursor-pointer flex items-center h-full`}
                      >
                        <UserPlus />
                      </div>
                      {showInviteModal && <InviteModal open={showInviteModal} onClose={handleCloseModal} />}
                      <div
                        onClick={() => {
                          setSelectedTopRightOption("notifications");
                        }}
                        className={`top-right-inner-circle ${
                          selectedTopRightOption === "notifications"
                            ? "active"
                            : ""
                        } cursor-pointer flex items-center h-full`}
                      >
                        <BellrIcon />
                      </div>
                      <div
                        onClick={() => {
                          setSelectedTopRightOption("chat");
                        }}
                        className={`top-right-inner-circle ${
                          selectedTopRightOption === "chat" ? "active" : ""
                        } cursor-pointer flex items-center h-full`}
                      >
                        <MessagerIcon />
                      </div>
                    </div>
                  </button>
                  <Menu as="div" className="relative h-full flex items-center">
                    <Menu.Button className="-m-1.5 flex items-center p-1.5 h-full">
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

                      <Menu.Items className="absolute right-0 z-40 mt-2.5 w-48 origin-top-right rounded-md bg-white dark:bg-gray-600 py-2 shadow-lg dark:shadow-gray-400/50 hover:shadow-gray-600/50  ring-1 ring-gray-900/5 focus:outline-none">
                          {/*  */}
                          <div className="flex items-center gap-3 p-2 pt-0">
                          {user?.avatar && (
                            <img
                              className="w-10 h-10 rounded-full bg-gray-50 object-cover"
                              src={user?.avatar}
                              alt="User Avatar"
                            />
                          )}
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {user.firstName + " " + user.lastName}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </span>
                            <span className="text-[10px] px-1 rounded-lg border w-fit bg-white-A700_33">Free</span>
                          </div>
                        </div>

                          {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => {

                              console.log("item.logo",item.logo )
                              return (
                                <div className={classNames(
                                  active ? "bg-gray-50 dark:bg-gray-700  px-4 transition-all duration-[.4s]" : `${item.name === "Sign out" ? "text-red-500 dark:text-red-500" : ""}`,
                                  `flex items-center gap-x-2  px-3 py-1 text-sm leading-6 text-gray-900 dark:text-gray-400 `
                                )}
                                >
                                {item.logo && <item.logo className="w-4 h-4" />}
                                <Link
                                  href={item.href}
                                  target={item?.target}
                                  onClick={item.onClick}
                                  
                                >
                                  {item.name}
                                </Link>
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
              className={`px-2 sm:px-6 lg:px-4 transition-all duration-200 ${
                width < 1024 ? "" : collapsed ? "ml-[80px]" : "ml-[204px]"
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
