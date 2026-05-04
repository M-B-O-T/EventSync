"use client";

import dynamic from "next/dynamic";

const ReactAdminApp = dynamic(() => import("./ReactAdminApp"), {
  ssr: false,
});

export default function Page() {
  return <ReactAdminApp />;
}