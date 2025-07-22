import { useSelector } from "react-redux";
import { getPartner } from "../../redux/auth/selectors";
import backgroundImage from "./images/background-auth.jpg";

export function SlimLayout({ children }) {
  // const partner = useSelector(getPartner);
  return (
      <div className="relative flex min-h-[100vh]  justify-center   flex-col-reverse lg:flex-row pt-10">
        <div className=" flex flex-1 bg-[#ffffff] overflow-hidden items-center justify-center"

        >
          <img
            className="object-contain object-center"
            src={"/assets/mobile.png"}
            alt=""
            style={{
              width:"100%",
              aspectRatio:"1/1",
              margin:"auto",
              maxHeight:"80vh",
            }}
          
          />
        </div>
        <div className="relative z-10 flex flex-1 flex-col bg-white dark:bg-gray-900 px-4 py-10  sm:justify-center md:flex-none md:px-28 ">
          <main className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0 md:justify-center md:align-center">
            {children}         
          </main>
        </div>
      </div>

  );
}
