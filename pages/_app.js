import Head from 'next/head'
import "./style/index.scss";
import "./index.css";
import "react-phone-input-2/lib/style.css";
import "allotment/dist/style.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-chat-widget/lib/styles.css";
import "react-alice-carousel/lib/alice-carousel.css";
import "./pages/Landingpage/components/Sharedstyle/customScrollBar.css"
import 'react-international-phone/style.css';
import "react-calendar/dist/Calendar.css";
import "./pages/Landingpage/Agenda.calendar.css";
import "react-phone-input-2/lib/style.css";

export default function Home() {
  return (
    <div>
      <Head>
        <title>HireLab</title>
        <meta name="description" content="HireLab recruitment platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to HireLab
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your recruitment platform is now running with Next.js!
          </p>
          <div className="space-x-4">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Get Started
            </button>
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
              Learn More
            </button>
          </div>
        </div>
      </main>
    </div>
  )
} 