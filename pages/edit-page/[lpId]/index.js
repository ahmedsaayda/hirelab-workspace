import LandingpageEdit from "../../../src/pages/LandingpageEdit";
import { useRouter } from 'next/router';

export default function Page() {
  const router = useRouter();
  const { lpId } = router.query;

  return (
    <>
      <LandingpageEdit paramsId={lpId} />
    </>
  );
}