import { Menu, Transition } from "@headlessui/react";
import { BarsArrowUpIcon } from "@heroicons/react/24/outline";
import {
  Alert,
  Badge,
  Button,
  Modal,
  Progress,
  Space,
  Switch,
  Tag,
  Tooltip,
} from "antd";
import classNames from "classnames";
import moment from "moment";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import DatePicker from "react-datepicker";
import { FaFilter } from "react-icons/fa";
import { GrInfo, GrValidate } from "react-icons/gr";
import { RiSortAsc } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  getPartner,
  selectDarkMode,
  selectUser,
} from "../../redux/auth/selectors";
import PartnerService from "../../service/PartnerService";

const PAGE_LIMIT = 18;
const PartnerUsers = () => {
  const partner = useSelector(getPartner);
  const router = useRouter();;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [grantTrialModal, setGrantTrialModal] = useState(null);
  const [lastScroll, setLastScroll] = useState(0);
  const [sortId, setSortId] = useState("recent_created");
  const [queryFilter, setQueryFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [total, setTotal] = useState(0);
  const [softValue, setSoftValue] = useState(null);
  const darkMode = useSelector(selectDarkMode);

  const sortQuery = {
    recent_created: { createdAt: -1 },
    oldest_created: { createdAt: 1 },
    recent_activity: { lastActivity: -1 },
    oldest_activity: { lastActivity: 1 },
  };

  const loadMoreUsers = useCallback(
    async ({ text = undefined, refresh = false, page = 1 }) => {
      setLoading(true);
      try {
        const response = await PartnerService.searchUsers({
          page,
          limit: PAGE_LIMIT,
          sort: sortId ? sortQuery[sortId] : {},
          text,
          filter: {
            ALL: {},
            SUBSCRIBED: { "subscription.paid": true },
            SUBSCRIBED_ONCE: { subscribedOnce: true },
          }[queryFilter],
        });

        const newUsers = response.data.result;
        setUsers((prevUsers) => [...(refresh ? [] : prevUsers), ...newUsers]);
        setPage((prevPage) => prevPage + 1);
        setTotal(response.data.total);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [queryFilter, sortId]
  );

  useEffect(() => {
    loadMoreUsers({});
  }, [loadMoreUsers]);

  useEffect(() => {
    if (loading) return;
    const handleScroll = () => {
      const container = document.getElementById("myContainer");

      if (
        container &&
        window.innerHeight + window.scrollY >= container.scrollHeight - 100
      ) {
        loadMoreUsers({ page });
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, loading]);

  // Function to perform the actual search
  const performSearch = useCallback((text) => {
    setPage(1);
    loadMoreUsers({
      text: text ? text : undefined,
      refresh: true,
      page: 1,
    });
  }, []);

  // Function to handle the input change with debounce
  const searchTimer = useRef();
  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setSearchTerm(newValue);

    // Delay the execution of the search function by 300 milliseconds (adjust as needed)
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      performSearch(newValue);
    }, 1000);
  };

  const getTier = (user) =>
    partner?.pricing?.find?.((p) => p._id === user?.subscription?.tier);

  const getProps = (fieldKey, required = false) => ({
    value: softValue?.[fieldKey],
    onChange: (e) => {
      if (!e?.target?.value && required) return;
      setSoftValue((current) =>
        current
          ? {
              ...current,
              [fieldKey]: e?.target?.value ?? e,
            }
          : current
      );
    },
  });

  const handleSave = () => {
    PartnerService.updateUser(softValue._id, softValue);
    setUsers((users) => {
      const current = [...users];
      const user = current?.find?.((a) => a._id === softValue._id);
      if (user) {
        for (const key of Object.keys(softValue)) {
          user[key] = softValue[key];
        }
      }

      return current;
    });
  };

  return (
    <>
      <div className="relative mt-2 flex items-center">
        <input
          type="text"
          placeholder="Search Users"
          className="block w-full rounded-md border-0 py-1.5 pr-14 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
          value={searchTerm}
          onChange={handleInputChange}
        />

        <Menu as="div" className="relative ml-3">
          <div>
            <Menu.Button
              type="button"
              className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-400  ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <RiSortAsc />
              Sort
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-900 py-1 shadow-lg dark:shadow-gray-400/50 hover:shadow-gray-600/50  ring-1 ring-black ring-opacity-5 focus:outline-none">
              {[
                { _id: "recent_created", name: "Newest first" },
                { _id: "oldest_created", name: "Oldest first" },
                { _id: "recent_activity", name: "Recent Activity" },
                { _id: "oldest_activity", name: "Oldest Activity" },
              ].map((item) => (
                <Menu.Item key={item._id}>
                  {({ active }) => (
                    <div
                      className={classNames(
                        active || sortId === item._id
                          ? "bg-gray-100 dark:bg-gray-400 dark:bg-gray-600"
                          : "",
                        "block px-4 py-2 text-sm text-gray-700 dark:text-gray-300  cursor-pointer"
                      )}
                      onClick={() => {
                        setPage(1);
                        setUsers([]);
                        setSortId(item._id);
                      }}
                    >
                      {item.name}
                    </div>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>

        <Menu as="div" className="relative ml-3">
          <div>
            <Menu.Button
              type="button"
              className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-400  ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <FaFilter />
              Filter
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-900 py-1 shadow-lg dark:shadow-gray-400/50 hover:shadow-gray-600/50  ring-1 ring-black ring-opacity-5 focus:outline-none">
              {[
                { _id: "ALL", name: "All users" },
                { _id: "SUBSCRIBED_ONCE", name: "Subscribed Once" },
                { _id: "SUBSCRIBED", name: "Currently subscribed" },
              ].map((item) => (
                <Menu.Item key={item._id}>
                  {({ active }) => (
                    <div
                      className={classNames(
                        active || queryFilter === item._id
                          ? "bg-gray-100 dark:bg-gray-400 dark:bg-gray-600"
                          : "",
                        "block px-4 py-2 text-sm text-gray-700 dark:text-gray-300  cursor-pointer"
                      )}
                      onClick={() => {
                        setPage(1);
                        setUsers([]);
                        setQueryFilter(item._id);
                      }}
                    >
                      {item.name}
                    </div>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <div className="container mx-auto p-4" id="myContainer">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="max-w-sm rounded-xl overflow-hidden shadow-lg dark:shadow-gray-400/50 hover:shadow-gray-600/50  hover:shadow-2xl transition duration-300 ease-in-out"
            >
              <div className="flex justify-center">
                <img
                  className="h-40 p-4 rounded-full"
                  src={user.avatar}
                  alt=""
                />
              </div>
              <div className="px-6 py-4">
                <div className="flex justify-between">
                  <div className="font-bold text-xl mb-2">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="flex items-center gap-1">
                    {new Date().getTime() -
                      new Date(user.lastActive).getTime() <=
                      5 * 60 * 1000 && (
                      <span class="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold leading-5 text-green-800">
                        Online
                      </span>
                    )}
                    {user?.subscription?.tier &&
                      partner?.pricing?.find?.(
                        (p) => p._id === user?.subscription?.tier
                      )?.name && (
                        <p className="rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                          {
                            partner?.pricing?.find?.(
                              (p) => p._id === user?.subscription?.tier
                            )?.name
                          }
                        </p>
                      )}
                    {!user?.subscription?.tier &&
                      new Date() <=
                        new Date(user.createdAt).setDate(
                          new Date(user.createdAt).getDate() + partner.trialDays
                        ) && (
                        <p className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                          Trial
                        </p>
                      )}
                    {user?.partnerGrantedTrialEnd &&
                      new Date() <= new Date(user?.partnerGrantedTrialEnd) && (
                        <p className="rounded-full bg-indigo-200 px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                          Manual Trial
                        </p>
                      )}
                  </div>
                </div>
                <div className="mb-4">
                  <div>
                    <a
                      href={`mailto:${user.email}`}
                      className="text-gray-700 dark:text-gray-300  text-base"
                    >
                      {user.email}
                    </a>
                  </div>
                  <div>
                    <a
                      href={`tel:${user.phone}`}
                      className="text-gray-700 dark:text-gray-300  text-base"
                    >
                      {user.phone}
                    </a>
                  </div>
                </div>

                <div className="subscription-limitations">
                  {getTier(user)?.maxFunnels ? (
                    <div className="w-[50%]">
                      <div>
                        <Progress
                          percent={
                            100 * (user?.vacancyNum / getTier(user)?.maxFunnels)
                          }
                          status="active"
                          format={(percent) =>
                            `${user?.vacancyNum} / ${
                              getTier(user)?.maxFunnels
                            } Funnels`
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="my-2">
                      <Tag color="default">{user?.vacancyNum} Funnels</Tag>
                    </div>
                  )}
                  {getTier(user)?.maxCandidates ? (
                    <div className="w-[50%]">
                      <div>
                        <Progress
                          percent={
                            100 *
                            (user?.candidateNum / getTier(user)?.maxCandidates)
                          }
                          status="active"
                          format={(percent) =>
                            `${user?.candidateNum} / ${
                              getTier(user)?.maxCandidates
                            } Candidates`
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="my-2">
                      <Tag color="default">{user?.candidateNum} Candidates</Tag>
                    </div>
                  )}
                  {getTier(user)?.maxMessaging ? (
                    <div className="w-[50%]">
                      <div>
                        <Progress
                          percent={
                            100 *
                            (user?.messageNum / getTier(user)?.maxMessaging)
                          }
                          status="active"
                          format={(percent) =>
                            `${user?.messageNum} / ${
                              getTier(user)?.maxMessaging
                            } Templates`
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="my-2">
                      <Tag color="default">{user?.messageNum} Templates</Tag>
                    </div>
                  )}
                  {getTier(user)?.maxTeamSize ? (
                    <div className="w-[50%]">
                      <div>
                        <Progress
                          percent={
                            100 * (user?.teamNum / getTier(user)?.maxTeamSize)
                          }
                          status="active"
                          format={(percent) =>
                            `${user?.teamNum} / ${
                              getTier(user)?.maxTeamSize
                            } Team mates`
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="my-2">
                      <Tag color="default">{user?.teamNum} Team mates</Tag>
                    </div>
                  )}
                </div>

                <div className="text-sm my-2 flex items-center justify-between">
                  <Space>
                    <div>Access Allowed</div>
                    <Switch
                      size={"sm"}
                      checked={!user.blocked}
                      onChange={(e) => {
                        setUsers((cur) => {
                          const current = [...cur];
                          const thisUser = current.find(
                            (u) => u._id === user._id
                          );
                          if (thisUser) thisUser.blocked = !e;
                          return current;
                        });
                        PartnerService.updateUser(user._id, { blocked: !e });
                      }}
                    />
                  </Space>

                  <GrValidate
                    className="cursor-pointer text-indigo-500"
                    size={23}
                    onClick={() => {
                      setLastScroll(window.scrollY);
                      setGrantTrialModal(user._id);
                      setSoftValue(user);
                    }}
                  />
                </div>

                <p className="text-gray-400 text-[10px]">
                  Joined: {moment(user.createdAt).format("Do MMM, YYYY, HH:mm")}
                </p>
                <p className="text-gray-400 text-[10px]">
                  Activity:{" "}
                  {moment(user.lastActive).format("Do MMM, YYYY, HH:mm")}
                </p>
              </div>
            </div>
          ))}
        </div>

        {total >= PAGE_LIMIT * (page - 1) && (
          <div className="flex justify-center mt-5">
            <Button loading={loading} onClick={() => loadMoreUsers({ page })}>
              Load more
            </Button>
          </div>
        )}
      </div>

      <Modal
        wrapClassName={`${darkMode ? "dark" : ""}`}
        open={!!grantTrialModal}
        onCancel={() => setGrantTrialModal(null)}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        destroyOnClose
        afterOpenChange={(e) => {
          if (!e) window.scrollTo(0, lastScroll);
        }}
      >
        <div className="sm:col-span-2 mt-5">
          <Space>
            <label
              className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 `}
            >
              Adjusted trial end date
            </label>
            <Tooltip title="By default, all users are granted a standard trial period of ${partner?.trialDays} days as per your SaaS configuration. As a partner, you have the discretion to extend the trial duration for individual users. Set the final date below to determine the length of the extended trial access for the selected user. This date represents the conclusion of the user's extended trial period. if user's extended trial access date is not specified below or has passed, and their account registration exceeds the default ${partner?.trialDays}-day trial period, they will be required to select and purchase a suitable subscription package for continued system access.">
              <GrInfo />
            </Tooltip>
          </Space>
          <div>
            <DatePicker
              className="dark:bg-gray-900"
              placeholderText="Adjusted trial end date"
              selected={
                users?.find?.((a) => a._id === grantTrialModal)
                  ?.partnerGrantedTrialEnd
                  ? new Date(
                      users?.find?.(
                        (a) => a._id === grantTrialModal
                      )?.partnerGrantedTrialEnd
                    )
                  : undefined
              }
              onChange={(e) => {
                PartnerService.updateUser(grantTrialModal, {
                  partnerGrantedTrialEnd: e,
                });
                setUsers((users) => {
                  const current = [...users];
                  const user = current?.find?.(
                    (a) => a._id === grantTrialModal
                  );
                  if (user) user.partnerGrantedTrialEnd = e;
                  if (user) setSoftValue(user);

                  return current;
                });
              }}
            />
          </div>
        </div>

        <div className="sm:col-span-2 mt-5">
          <Space>
            <label
              className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 `}
            >
              Resale Factor for Candidate Sourcing
            </label>
            <Tooltip title="This configuration is to decide how many times more this specific user is charged for using the candidate sourcing system compared to your cost. Leave it at 0 if the standard configuration from your SaaS Configuration > RC System should apply.">
              <GrInfo />
            </Tooltip>
          </Space>
          <div>
            <input
              type="number"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
              {...getProps("candidateSourcingProfitFactor")}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <button
            onClick={handleSave}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm dark:shadow-gray-400/50  hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </Modal>
    </>
  );
};

export default PartnerUsers;
