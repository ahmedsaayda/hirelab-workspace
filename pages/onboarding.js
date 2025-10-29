import { useSelector } from "react-redux";
import { selectUser } from "../src/redux/auth/selectors";
import { useRouter } from "next/router";
import { useEffect } from "react";
import BrandStyleForm from "../src/pages/onboarding/components/brand-style-form";

export default function Page() {
    const user = useSelector(selectUser);
    const router = useRouter();

    useEffect(() => {
        // Redirect to dashboard if user is in workspace session
        if (user?.isWorkspaceSession) {
            router.push("/dashboard");
        }
    }, [user, router]);

    // Don't render anything while checking workspace session
    if (user?.isWorkspaceSession) {
        return null;
    }

    return (
      <BrandStyleForm />
    );
  } 
