import { useSelector } from "react-redux";
import { getPartner } from "../../../src/redux/auth/selectors";
import backgroundImage from "./images/background-auth.jpg";

export function SlimLayout({ children }) {
  // const partner = useSelector(getPartner);
  return (
    <>
      <div className="relative flex min-h-full h-[100vw] justify-center md:px-12 lg:px-0">
        <div className="hidden sm:contents lg:relative lg:block lg:flex-1 bg-[#ffffff] overflow-hidden">
          <img
            className="absolute left-[110px] top-[125px] h-[600px] hidden lg:block  object-cover"
            src={"/assets/Screen-part Mac.png"}
            alt=""
          />
              <img
            className="absolute right-[-30px] top-[290px] h-[600px] hidden lg:block  object-cover"
            src={"/assets/Mobile2.png"}
            alt=""
          />
          <img
            className="absolute right-[140px] bottom-[-95px] h-[550px] hidden lg:block  object-cover"
            src={"/assets/Mobile1.png"}
            alt=""
          />
         
        </div>
        <div className="relative z-10 flex flex-1 flex-col bg-white dark:bg-gray-900 px-4 py-10  sm:justify-center md:flex-none md:px-28 w-5/12">
          <main className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0 md:justify-center md:align-center">
            {children}         
          </main>
        </div>
      </div>
    </>
  );
}
