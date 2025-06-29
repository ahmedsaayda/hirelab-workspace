import { useMemo } from "react";
import { useSelector } from "react-redux";
import { getPartner } from "../../redux/auth/selectors";
import { Container } from "./Container";
import backgroundImage from "./images/background-faqs.jpg";

export function Faqs({ data }) {
  const partner = data || useSelector(getPartner);

  const faqSegments = useMemo(() => {
    const faqs = partner?.FAQ;
    if (!faqs) return [];

    const array = [];
    const current = [];
    for (const review of faqs) {
      current.push(review);
      if (current.length === 3) {
        array.push([...current]);
        current.length = 0;
      }
    }
    if (current.length) array.push([...current]);

    return array;
  }, [partner]);

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-32"
    >
      <img
        className="absolute left-1/2 top-0 max-w-none -translate-y-1/4 translate-x-[-30%]"
        src={partner?.lpSimpleColors ? null : backgroundImage}
        style={{ display: partner?.lpSimpleColors ? "none" : "block" }}
        alt=""
        width={1558}
        height={946}
      />
      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faq-title"
            className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl"
          >
            {partner?.faqTitle}
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            {partner?.faqSubtext}
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
        >
          {faqSegments?.map?.((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-8">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="font-display text-lg leading-7 text-slate-900">
                      {faq.question}
                    </h3>
                    <p className="mt-4 text-sm text-slate-700">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
