import { Suspense } from "react";
import HomeSection from "../components/HomeSection";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeSection />
    </Suspense>
  );
}
