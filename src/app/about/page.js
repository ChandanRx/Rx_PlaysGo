import Card from "../../components/ui/Card";
import Data from "../../shared/data";
import { CATEGORY_ICONS, DEFAULT_CATEGORY_ICON, FEATURE_ICONS } from "../../shared/lucideIcons";

const features = [
  { icon: FEATURE_ICONS["Find players for a match"], text: "Find players for a match" },
  { icon: FEATURE_ICONS["Look for a tutor or freelancer"], text: "Look for a tutor or freelancer" },
  { icon: FEATURE_ICONS["Post local jobs or gigs"], text: "Post local jobs or gigs" },
  { icon: FEATURE_ICONS["Sell furniture or electronics"], text: "Sell furniture or electronics" },
  { icon: FEATURE_ICONS["Discover events and communities"], text: "Discover events and communities" },
  { icon: FEATURE_ICONS["Find a roommate or travel partner"], text: "Find a roommate or travel partner" },
];

const About = () => (
  <div className="space-y-5">

    {/* Hero */}
    <Card className="p-6 md:p-8" hover={false}>
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--brand)]">About PlaysGo</p>
      <h1 className="mt-1.5 text-[24px] font-black leading-tight text-[var(--text-heading)] md:text-[30px]">
        A local-first community platform for opportunities and connections
      </h1>
      <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-[var(--text-body)]">
        PlaysGo is a community-driven feed where people post needs, discover services, organize events, find teammates, look for roommates, hire freelancers, and connect with others nearby.
      </p>
    </Card>

    <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">

      {/* Features */}
      <Card className="p-5 md:p-6" hover={false}>
        <h2 className="text-[17px] font-black text-[var(--text-heading)]">What PlaysGo helps people do</h2>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {features.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-3">
              <Icon className="h-5 w-5 shrink-0 text-[var(--brand)]" strokeWidth={2} />
              <span className="text-[13px] font-medium text-[var(--text-body)]">{text}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Platform direction */}
      <Card className="p-5 md:p-6" hover={false}>
        <h2 className="text-[17px] font-black text-[var(--text-heading)]">Platform direction</h2>
        <div className="mt-4 space-y-3 text-[13.5px] leading-relaxed text-[var(--text-body)]">
          <p>Inspired by local discovery, community groups, meetups, classifieds, and lightweight professional networking.</p>
          <p>The goal is making posting and finding relevant nearby updates feel simple, trustworthy, and fast.</p>
          <p>This demo focuses on the frontend with local data, while the product expands toward chat, maps, notifications, and subscriptions.</p>
        </div>
      </Card>
    </div>

    {/* Categories */}
    <Card className="p-5 md:p-6" hover={false}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--brand)]">Categories v1</p>
          <h2 className="mt-0.5 text-[17px] font-black text-[var(--text-heading)]">Starting with the most common local use cases</h2>
        </div>
        <p className="text-[12.5px] text-[var(--text-muted)]">More categories coming soon</p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Data.CategoryData.map((item) => {
          const Icon = CATEGORY_ICONS[item.name] || DEFAULT_CATEGORY_ICON;

          return (
          <div key={item.name} className="rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 transition hover:border-[var(--brand)] hover:shadow-[0_4px_16px_rgba(255,60,31,0.08)]">
            <Icon className="h-7 w-7 text-[var(--brand)]" strokeWidth={2} />
            <h3 className="mt-3 text-[14px] font-black text-[var(--text-heading)]">{item.name}</h3>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--text-muted)]">{item.description}</p>
          </div>
          );
        })}
      </div>
    </Card>
  </div>
);

export default About;
