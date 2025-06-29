import LandingpageEdit from "../../pages/LandingpageEdit";

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
       <LandingpageEdit paramsId={lpId}/>
    </>
  );
}
