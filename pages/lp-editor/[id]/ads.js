import { useRouter } from "next/router";
import AdsEdit from "../../../src/pages/AdsEdit";

export default function AdsEditPage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id) {
    return <div>Loading...</div>;
  }

  return <AdsEdit paramsId={id} />;
}




