import Card from "../../components/ui/Card";
import Data from "../../shared/data";

const features = [
  { icon: "🏏", text: "Find players for a match" },
  { icon: "📚", text: "Look for a tutor or freelancer" },
  { icon: "💼", text: "Post local jobs or gigs" },
  { icon: "🪑", text: "Sell furniture or electronics" },
  { icon: "🎉", text: "Discover events and communities" },
  { icon: "🛋️", text: "Find a roommate or travel partner" },
];

const CAT_ICONS = { Players: "⚽", "Local Help": "🤝", "For Sale": "🛍️" };

const About = () => (
  <div className="space-y-5">

    {/* Hero */}
    <Card className="p-6 md:p-8" hover={false}>
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF7A00]">About PlaysGo</p>
      <h1 className="mt-1.5 text-[24px] font-black leading-tight text-[#0F1623] md:text-[30px]">
        A local-first community platform for opportunities and connections
      </h1>
      <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-[#374151]">
        PlaysGo is a community-driven feed where people post needs, discover services, organize events, find teammates, look for roommates, hire freelancers, and connect with others nearby.
      </p>
    </Card>

    <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">

      {/* Features */}
      <Card className="p-5 md:p-6" hover={false}>
        <h2 className="text-[17px] font-black text-[#0F1623]">What PlaysGo helps people do</h2>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {features.map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3 rounded-[12px] border border-[#E8EDF5] bg-[#F8FAFC] px-4 py-3">
              <span className="text-xl">{icon}</span>
              <span className="text-[13px] font-medium text-[#374151]">{text}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Platform direction */}
      <Card className="p-5 md:p-6" hover={false}>
        <h2 className="text-[17px] font-black text-[#0F1623]">Platform direction</h2>
        <div className="mt-4 space-y-3 text-[13.5px] leading-relaxed text-[#374151]">
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
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF7A00]">Categories v1</p>
          <h2 className="mt-0.5 text-[17px] font-black text-[#0F1623]">Starting with the most common local use cases</h2>
        </div>
        <p className="text-[12.5px] text-[#6B7280]">More categories coming soon</p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Data.CategoryData.map((item) => (
          <div key={item.name} className="rounded-[16px] border border-[#E8EDF5] bg-[#F8FAFC] p-4 transition hover:border-[#FF7A00] hover:shadow-[0_4px_16px_rgba(255,122,0,0.08)]">
            <div className="text-3xl">{CAT_ICONS[item.name] || "📌"}</div>
            <h3 className="mt-3 text-[14px] font-black text-[#0F1623]">{item.name}</h3>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[#6B7280]">{item.description}</p>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

export default About;
