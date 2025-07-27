"use client"
import Cookies from "js-cookie";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { login } from "../../../src/redux/auth/actions";
import { store } from "../../../src/redux/store";
import AuthService from "../../../src/services/AuthService";

import { useSelector } from "react-redux";
import { getPartner, selectLoading } from "../../../src/redux/auth/selectors";
import { Button } from "../Landing/Button";
import { TextField } from "../Landing/Fields";
import { Logo } from "../Landing/Logo";
import { SlimLayout } from "../Landing/SlimLayout";
import TeamService from "../../../src/services/TeamService";

const Login = () => {
  const router = useRouter();
  const loading = false&&useSelector(selectLoading);
  console.log("loading",loading)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await AuthService.login({
      email: e.target[0].value,
      password: e.target[1].value,
    });
    if (!result?.data?.accessToken) return;

    Cookies.set("accessToken", result?.data?.accessToken);
    Cookies.set("refreshToken", result?.data?.refreshToken);

    const me = await AuthService.me();
    if (!me?.data) return message.error("Could not load user data");

    store.dispatch(login(me.data.me));

    // Check for return URL from query params (team invitation)
    const returnUrl = router.query.returnUrl;
    
    // If returnUrl contains a team join link, extract the invite link
    if (returnUrl && returnUrl.includes('/team/join/')) {
      const urlParts = returnUrl.split('/team/join/');
      if (urlParts.length === 2) {
        const inviteLink = urlParts[1];
        localStorage.setItem("pendingTeamInvite", inviteLink);
        Cookies.set("pendingTeamInvite", inviteLink, { expires: 1 });
        console.log("Login: Set team invite cookie", inviteLink);
      }
    }

    // Check for pending invitation (email invite) - check both localStorage and cookies
    let pendingInvitation = localStorage.getItem("pendingInvitation") || Cookies.get("pendingInvitation");
    if (pendingInvitation) {
      try {
        await TeamService.acceptInvitation(pendingInvitation);
        localStorage.removeItem("pendingInvitation");
        Cookies.remove("pendingInvitation");
        console.log("Login: Successfully accepted email invitation", pendingInvitation);
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
        }
      } catch (error) {
        console.error("Error joining team:", error);
        localStorage.removeItem("pendingTeamInvite");
        Cookies.remove("pendingTeamInvite");
      }
    }

    // Redirect to dashboard (team will be set if user joined via invite)
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-[100vh]  flex-col">
      <SlimLayout>
        <div className="flex justify-center">
          <Link href="/" aria-label="Home">
            <Logo className="w-auto h-10" black />
          </Link>
        </div>
        <h2 className="mt-20 font-semibold text-[#101828] dark:text-gray-400 text-4xl">
          Welcome!
        </h2>
        <p className="mt-3 text-[#667085] dark:text-gray-300 text-base font-normal">
          Sign in to your account. Don't have an account?{" "}
          <Link
            href={`/auth/register${router.query.returnUrl ? `?returnUrl=${router.query.returnUrl}` : ''}`}
            className="font-medium text-blue-600 hover:underline"
          >
            Sign up
          </Link>
        </p>
        <form
          action="#"
          className="grid grid-cols-1 mt-10 gap-y-8"
          onSubmit={handleSubmit}
        >
          <TextField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue=""
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            defaultValue=""
            required
          />
          <div>
            <Button
              type="primary"
              variant="solid"
              color="blue"
              className="w-full hover:bg-white hover:text-blue-A200 hover:border border-blue-700_01"
              loading={loading}
            >
              <span>Sign in</span>
            </Button>
          </div>
          <div className="text-sm text-center">
            <Link href="/auth/forgot" className="font-semibold text-indigo-500">
              Forgot password?
            </Link>
          </div>

        </form>
      </SlimLayout>
    </div>
  );
};

export default Login;
