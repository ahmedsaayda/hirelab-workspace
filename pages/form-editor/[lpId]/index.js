import FormEdit from "../../../src/pages/FormEdit";
import { useRouter } from 'next/router';

export default function Page() {
  const router = useRouter();
  const { lpId } = router.query;

  return <FormEdit paramsId={lpId} />
}
