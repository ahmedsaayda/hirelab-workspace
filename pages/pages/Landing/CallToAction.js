import { useSelector } from "react-redux";
import { getPartner } from "../../../src/redux/auth/selectors";
import { Button } from "./Button";
import { Container } from "./Container";
import backgroundImage from "./images/background-call-to-action.jpg";

export function CallToAction({ data }) {
  const partner = data || useSelector(getPartner);
  return (
    <section id="get-started-today" className="relative overflow-hidden  py-32">
      <img
        className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        src={partner?.lpSimpleColors ? null : backgroundImage}
        alt=""
        width={2347}
        height={1244}
      />
      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            {partner?.ctaTitle}
          </h2>
          <p className="mt-4 text-lg tracking-tight text-white">
            {partner?.ctaSubtext}
          </p>
          <Button to="/auth/register" color="white" className="mt-10">
            {partner?.ctaButtontext}
          </Button>
        </div>
      </Container>
    </section>
  );
}
