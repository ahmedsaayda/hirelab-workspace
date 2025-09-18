import Cookies from "js-cookie";
import React, { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Select from "../Dashboard/Vacancies/components/Select";
import { login } from "../../redux/auth/actions";
import { store } from "../../redux/store";
import AuthService from "../../services/AuthService";

import { Checkbox, message } from "antd";
import { useSelector } from "react-redux";
import { getPartner, selectLoading } from "../../redux/auth/selectors";
import { Button } from "../Landing/Button";
import { TextField } from "../Landing/Fields";
import { Logo } from "../Landing/Logo";
import { SlimLayout } from "../Landing/SlimLayout";
import { partner } from "../../constants";
import TeamService from "../../services/TeamService";

const Login = () => {

  const router = useRouter();
  const loading = useSelector(selectLoading);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const [firstName, lastName, email, password] = new Array(4)
        .fill(0)
        .map((_, i) => e.target[i].value);

      await AuthService.register({
        firstName,
        lastName,
        email,
        password,
      });

      const result = await AuthService.login({
        email,
        password,
      });
      if (!result?.data?.accessToken)
        return message.error("Could not load user data");

      Cookies.set("accessToken", result?.data?.accessToken);
      Cookies.set("refreshToken", result?.data?.refreshToken);

      const me = await AuthService.me();
      if (!me?.data) return message.error("Could not load user data");

      store.dispatch(login(me.data.me));

      // Check for return URL from query params (team invitation)
      const returnUrl = router.query.returnUrl;
      let hasTeamInvite = false;
      

      
      // If returnUrl contains a team join link, extract the invite link
      if (returnUrl && returnUrl.includes('/team/join/')) {
        const urlParts = returnUrl.split('/team/join/');
        if (urlParts.length === 2) {
          const inviteLink = urlParts[1];
          localStorage.setItem("pendingTeamInvite", inviteLink);
          Cookies.set("pendingTeamInvite", inviteLink, { expires: 1 });
          hasTeamInvite = true;
          console.log("🔥 Registration: Set team invite cookie", inviteLink);
        }
      }

      // Check for pending invitation (email invite) - check both localStorage and cookies
      let pendingInvitation = localStorage.getItem("pendingInvitation") || Cookies.get("pendingInvitation");
      if (pendingInvitation) {
        try {
          await TeamService.acceptInvitation(pendingInvitation);
          localStorage.removeItem("pendingInvitation");
          Cookies.remove("pendingInvitation");
          hasTeamInvite = true;
          console.log("Registration: Successfully accepted email invitation", pendingInvitation);
        } catch (error) {
          console.error("Error accepting invitation:", error);
          localStorage.removeItem("pendingInvitation");
          Cookies.remove("pendingInvitation");
        }
      }

      // Check for pending team invite link (shareable link)
      const pendingTeamInvite = localStorage.getItem("pendingTeamInvite");
      if (pendingTeamInvite) {
        try {
          const response = await TeamService.joinTeamByLink(pendingTeamInvite);
          if (response.success) {
            TeamService.setCurrentTeam(response.team);
            localStorage.removeItem("pendingTeamInvite");
            Cookies.remove("pendingTeamInvite");
            hasTeamInvite = true;
          }
        } catch (error) {
          console.error("Error joining team:", error);
          localStorage.removeItem("pendingTeamInvite");
          Cookies.remove("pendingTeamInvite");
        }
      }
      
      // If user joined via team invite, skip onboarding and go to dashboard
      // Otherwise, continue with normal onboarding flow
      if (hasTeamInvite) {
        router.push("/dashboard");
      } else {
        router.push("/auth/otpemail");
      }
    },
    [router]
  );

  return (
    <>
      <div className="flex h-[100vh] flex-col">
        <SlimLayout>
          <div className="flex justify-center">
            <Link href="/" aria-label="Home">
              <Logo className="h-10 w-auto" black />
            </Link>
          </div>
          <h2 className="mt-20 font-semibold text-[#101828] dark:text-gray-400 text-4xl ">
            Get started {partner?.trialDays > 0 ? "for free" : ""}
          </h2>
          <p className="mt-3 text-[#667085] dark:text-gray-300 text-base font-normal ">
            Already registered?{" "}
            <Link
              href={`/auth/login${router.query.returnUrl ? `?returnUrl=${router.query.returnUrl}` : ''}`}
              className="font-medium text-blue-600 hover:underline"
            >
              Sign in
            </Link>{" "}
            to your account.
          </p>
          <form
            action="#"
            className="mt-10 grid grid-cols-1 gap-y-8"
            onSubmit={handleSubmit}
          >
            <TextField
              label="First name"
              name="first_name"
              type="text"
              autoComplete="given-name"
              required
            />
            <TextField
              label="Last name"
              name="last_name"
              type="text"
              autoComplete="family-name"
              required
            />
            <TextField
              className="col-span-full"
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
            <TextField
              className="col-span-full"
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
            />

            {
              <div className="flex gap-2">
                <Checkbox className="col-span-full" required />
                <label>
                  I accept the{" "}
                  <a href="https://hirelab.io/privacy-policy-hirelab-platform" target="_blank" className="text-blue-600 hover:underline">
                    privacy policy
                  </a>{" "}
                  and{" "}
                  <a href="https://hirelab.io/terms-of-use-software" target="_blank" className="text-blue-600 hover:underline">
                    terms of service
                  </a>
                </label>
              </div>
            }
            <div>
              <Button
              type="primary"
              variant="solid"
              color="blue"
              className="w-full hover:bg-white hover:text-blue-A200 hover:border border-blue-700_01"
              loading={loading}
              >
                <span>Sign up</span>
              </Button>
            </div>
          </form>
        </SlimLayout>
      </div>
    </>
  );
};

export default Login;
