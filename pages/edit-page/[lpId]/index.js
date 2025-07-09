import LandingpageEdit from "../../../src/pages/LandingpageEdit";
import { useRouter } from 'next/router';

export default function Page() {
  const router = useRouter();
  const { lpId } = router.query;

  console.log("lpId",lpId)
  return (
    <>
      <LandingpageEdit paramsId={lpId} />
    </>
  );
}