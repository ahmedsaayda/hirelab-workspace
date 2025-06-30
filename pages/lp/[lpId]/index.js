/*  import LandingpagePage from "../../../src/pages/Landingpage"; */



import { useRouter } from 'next/router';

export default function Page() {
  const router = useRouter();
  const { lpId } = router.query;

  return <div>
    {/* <LandingpagePage paramsId={lpId}/> */}

    Client-side lpId: {lpId}</div>;

}