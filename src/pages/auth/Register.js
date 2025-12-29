import Cookies from "js-cookie";
import React, { useCallback, useRef, useState } from "react";
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
import TrackingService from "../../services/TrackingService";
import WorkspaceService from "../../services/WorkspaceService";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";

const RegisterInner = () => {

  const router = useRouter();
  const loading = useSelector(selectLoading);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        if (!executeRecaptcha) {
          message.error("Captcha not ready. Please try again.");
          return;
        }
        const latestToken = await executeRecaptcha("register");

        const [firstName, lastName, email, password] = new Array(4)
          .fill(0)
          .map((_, i) => e.target[i].value);

        await AuthService.register({
          firstName,
          lastName,
          email,
          password,
          captchaToken: latestToken
        });

        const result = await AuthService.login({
          email,
          password,
          captchaToken: latestToken
        });

        console.log(result);
        if (!result?.data?.accessToken)
          return message.error("Could not load user data");

        Cookies.set("accessToken", result?.data?.accessToken);
        Cookies.set("refreshToken", result?.data?.refreshToken);

        const me = await AuthService.me();
        console.log(me);
        if (!me?.data) return message.error("Could not load user data");

        store.dispatch(login(me.data.me));

        // 🎯 TRACK SUCCESSFUL REGISTRATION CONVERSION
        try {
          await TrackingService.trackSignUpConversion({
            email: email,
            firstName: firstName,
            lastName: lastName,
            registration_method: 'email',
            user_id: me.data.me._id || me.data.me.id,
          });

          console.log('✅ Registration conversion tracking completed');
        } catch (trackingError) {
          console.error('⚠️ Registration tracking failed (non-critical):', trackingError);
          // Continue with registration flow even if tracking fails
        }

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

        const consumeWorkspaceInvite = async () => {
          try {
            const inviteString = localStorage.getItem("workspaceInvite") || Cookies.get("workspaceInvite");
            if (!inviteString) return false;

            const invite = JSON.parse(inviteString);
            if (!invite?.token) return false;

            const response = await WorkspaceService.acceptWorkspaceInvitation(invite.token);

            if (response?.data?.accessToken) {
              Cookies.set("accessToken", response.data.accessToken);
            }
            if (response?.data?.refreshToken) {
              Cookies.set("refreshToken", response.data.refreshToken);
            }
            if (response?.data?.user) {
              store.dispatch(login(response.data.user));
            }

            localStorage.removeItem("workspaceInvite");
            Cookies.remove("workspaceInvite");

            return response?.data?.workspace?._id || true;
          } catch (inviteError) {
            console.error("Error consuming workspace invitation after registration:", inviteError);
            localStorage.removeItem("workspaceInvite");
            Cookies.remove("workspaceInvite");
            return false;
          }
        };

        let workspaceRedirect = await consumeWorkspaceInvite();
        if (workspaceRedirect && typeof workspaceRedirect === "string") {
          router.push(`/dashboard?workspace=${workspaceRedirect}`);
          return;
        }

        if (workspaceRedirect) {
          router.push("/dashboard");
        } else if (result?.data?.workspaceId) {
          router.push(`/dashboard?workspace=${result.data.workspaceId}`);
        } else if (hasTeamInvite) {
          router.push("/dashboard");
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        console.log(error);
      }
    },
    [router, executeRecaptcha]
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
                className="w-full"
                disabled={loading}
              >
                {!loading ? <span>Sign up</span> : <svg width="20" height="20" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke="#60A5FA" stroke-width="3" stroke-linecap="round" stroke-dasharray="60 120"><animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"></animateTransform></circle></svg>}
              </Button>
            </div>
          </form>
        </SlimLayout>
      </div>
    </>
  );
};

const Login = () => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
      scriptProps={{ async: true, defer: true }}
    >
      <RegisterInner />
    </GoogleReCaptchaProvider>
  );
};

export default Login;
