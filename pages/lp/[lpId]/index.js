import LandingpagePage from "../../../src/pages/Landingpage";
import { useRouter } from 'next/router';

export default function Page() {
  const router = useRouter();
  const { lpId } = router.query;

  return <LandingpagePage paramsId={lpId} />;
}