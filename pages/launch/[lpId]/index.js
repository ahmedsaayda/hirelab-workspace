import React from "react";
import dynamic from "next/dynamic";

const Launch = dynamic(() => import("../../../src/pages/Launch/index"), { ssr: false });

export default function Page() {
  // Next will pass the lpId via router to the Launch component through paramsId inside that component
  return <Launch />;
}
