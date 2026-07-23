"use client";

import React from "react";
import LearnSidebar from "../../components/learn/LearnSidebar";
import LearnTopBar from "../../components/learn/LearnTopBar";
import CoursePanel from "../../components/learn/CoursePanel";
import PerformancePanel from "../../components/learn/PerformancePanel";
import HomeworkPanel from "../../components/learn/HomeworkPanel";
import FriendsPanel from "../../components/learn/FriendsPanel";

/* Standalone learner dashboard (registered in AppShell's STANDALONE_PATHS so it
 * renders without the member app chrome). Recreates the reference layout —
 * left icon rail, top nav, a tall course panel, performance chart, and the
 * homework + friends row — entirely on the app's design tokens (light / dark /
 * category themes), no raw hex brand colors. */
const LearnDashboardPage = () => (
  <div
    className="min-h-screen w-full"
    style={{
      background:
        "radial-gradient(1200px 500px at 15% -5%, var(--brand-soft), transparent 60%), radial-gradient(1000px 480px at 100% 0%, var(--info-soft), transparent 55%), var(--bg-page)",
    }}
  >
    <div className="mx-auto flex w-full max-w-[1280px] gap-4 p-3 sm:p-4 lg:gap-5 lg:p-7">
      <LearnSidebar />

      <div className="min-w-0 flex-1 space-y-5">
        <LearnTopBar />

        <h1 className="px-1 text-[32px] font-black tracking-tight text-[var(--text-heading)] sm:text-[40px]">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:auto-rows-min">
          <div className="lg:col-span-4 lg:row-span-2">
            <CoursePanel />
          </div>
          <div className="lg:col-span-8">
            <PerformancePanel />
          </div>
          <div className="lg:col-span-4">
            <HomeworkPanel />
          </div>
          <div className="lg:col-span-4">
            <FriendsPanel />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default LearnDashboardPage;
