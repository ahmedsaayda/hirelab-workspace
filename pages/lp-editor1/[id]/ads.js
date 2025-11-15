import { useRouter } from "next/router";
import dynamic from "next/dynamic";

// Load demo shell lazily to keep the main route untouched
const AdsEditDemoShell = dynamic(() => import("../../../src/pages/AdsEditDemo/Shell"), { ssr: false });

export default function AdsEditDemoPage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return <div>Loading...</div>;
  return <AdsEditDemoShell paramsId={id} />;
}


