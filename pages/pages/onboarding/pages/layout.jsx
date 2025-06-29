import { Inter } from "next/font/google";
import { Stepper } from "@/components/stepper";
import { ConfigProvider } from "antd";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Emplifio - Onboarding",
  description: "Complete your onboarding process with Emplifio",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#0066FF",
            },
          }}
        >
          <div className=" bg-white">
            <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
              <div className="font-inter text-xl font-semibold">Emplifio</div>
              <div className="flex items-center gap-3">
                <button className="text-sm text-gray-600 hover:text-gray-900">
                  Log in
                </button>
                <button className="rounded-md bg-[#0066FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#0052CC]">
                  Invite your colleague
                </button>
              </div>
            </header>
            <Stepper />
            <main>{children}</main>
          </div>
        </ConfigProvider>
      </body>
    </html>
  );
}
