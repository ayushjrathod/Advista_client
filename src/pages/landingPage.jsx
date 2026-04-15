import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { FloatingNav } from "@/components/landing/floating-navbar";
import HeroButton from "@/components/landing/HeroButton";
import { Footer } from "@/components/landing/Footer";
import { HomeIcon, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const About = lazy(() => import("@/components/landing/About").then((module) => ({ default: module.About })));
const Spotlight = lazy(() => import("@/components/ui/spotlight-new").then((module) => ({ default: module.Spotlight })));
const RubiksCubeScene = lazy(() => import("@/components/landing/RubiksCube"));

export default function LandingPage() {
  const [shouldRender3D, setShouldRender3D] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const aboutSectionRef = useRef(null);

  const navItems = [
    { name: "Home", link: "/", icon: <HomeIcon /> },
    { name: "About", link: "/about" },
    { name: "Chat", link: "/chat", icon: <MessageSquare /> },
  ];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 1024;
    const saveData = navigator.connection?.saveData;

    if (prefersReducedMotion || isMobile || saveData) {
      return;
    }

    let timeoutId;
    let idleCallbackId;

    if ("requestIdleCallback" in window) {
      idleCallbackId = window.requestIdleCallback(() => {
        setShouldRender3D(true);
      });
    } else {
      timeoutId = window.setTimeout(() => {
        setShouldRender3D(true);
      }, 700);
    }

    return () => {
      if (idleCallbackId) {
        window.cancelIdleCallback(idleCallbackId);
      }
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  useEffect(() => {
    const section = aboutSectionRef.current;
    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowAbout(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen bg-black">
      <FloatingNav className="" navItems={navItems} />
      {/* <SmokeSceneComponent /> */}
      <main className="relative min-h-screen flex items-center bg-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between">
          <div className="text-left lg:w-1/2 mb-8 lg:mb-0">
            {/* <GlowingButton /> */}
            <h1 className="pt-6 text-4xl sm:text-5xl md:text-5xl font-bold text-white mb-4">
              Market insights in minutes, not weeks.
            </h1>
            <p className="text-xl sm:text-2xl md:text-2xl text-zinc-400 mb-8 mx-2">
              Delegate product marketing research to us, so you can focus on what matters.
            </p>
            <div className="flex flex-col">
              <Link to="/chat">
                <HeroButton />
              </Link>
            </div>
          </div>
          <Suspense fallback={null}>
            <Spotlight />
          </Suspense>
          {shouldRender3D ? (
            <Suspense
              fallback={<div className="lg:w-[45%] h-[400px] lg:h-[800px] w-full bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg" />}
            >
              <RubiksCubeScene />
            </Suspense>
          ) : (
            <div className="lg:w-[45%] h-[400px] lg:h-[800px] w-full bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg" />
          )}
        </div>
      </main>
      <div ref={aboutSectionRef} className="m-4 md:m-12 lg:m-24 min-h-[280px]">
        {showAbout ? (
          <Suspense fallback={<div className="h-24" />}>
            <About />
          </Suspense>
        ) : null}
      </div>

      <Footer />
    </div>
  );
}
