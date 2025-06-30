import FormEdit from "../../../src/pages/FormEdit";

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
       <FormEdit paramsId={lpId}/>
    </>
  );
}
