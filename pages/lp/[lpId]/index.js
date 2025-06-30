import LandingpagePage from "../../../src/pages/Landingpage";

export async function getServerSideProps(context) {
  const { lpId } = context.params;
  
  return {
      props: {
          lpId,
      },
  };
}

// Then in your component:
export default function Page({ lpId }) {
  return (
    <>
       <LandingpagePage paramsId={lpId}/>
    </>
  );
}
