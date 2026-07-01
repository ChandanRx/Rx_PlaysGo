import Card from "../../components/ui/Card";

const plans = [
  {
    name: "Free",
    badge: "Current plan",
    price: "₹0",
    per: "Always free",
    features: ["5 active posts", "Basic visibility", "Community feed access"],
    cta: "Current plan",
    highlighted: false,
  },
  {
    name: "Pro",
    badge: "Most popular",
    price: "₹299",
    per: "per month",
    features: ["Unlimited posts", "Featured badge", "Priority ranking", "Advanced filters", "Early access to new features"],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
];

const ProPage = () => (
  <div className="space-y-5">

    {/* Hero */}
    <Card className="p-6 text-center md:p-10" hover={false}>
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF7A00]">Subscription</p>
      <h1 className="mt-2 text-[26px] font-black leading-tight text-[#0F1623] md:text-[38px]">
        PlaysGo Pro — better reach,<br className="hidden md:block" /> stronger visibility
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-[14px] leading-relaxed text-[#6B7280]">
        Upgrade for priority ranking, advanced filtering, unlimited posts, and stronger local discovery. Currently a UI preview of the future subscription experience.
      </p>
    </Card>

    {/* Plans */}
    <div className="grid gap-5 md:grid-cols-2">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`relative overflow-hidden rounded-[20px] border p-6 transition md:p-8 ${
            plan.highlighted
              ? "border-[#0F1623] bg-[#0F1623] text-white shadow-[0_8px_32px_rgba(15,23,42,0.2)]"
              : "border-[#E8EDF5] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.06)]"
          }`}
        >
          {plan.highlighted && (
            <span className="absolute right-4 top-4 rounded-full bg-[#FF7A00] px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white">
              {plan.badge}
            </span>
          )}

          <p className={`text-[11px] font-bold uppercase tracking-[0.18em] ${plan.highlighted ? "text-[#FF9F43]" : "text-[#6B7280]"}`}>
            {plan.name}
          </p>
          <div className="mt-3 flex items-end gap-2">
            <span className={`text-[40px] font-black leading-none ${plan.highlighted ? "text-white" : "text-[#0F1623]"}`}>
              {plan.price}
            </span>
            <span className={`pb-1.5 text-[13px] ${plan.highlighted ? "text-white/60" : "text-[#6B7280]"}`}>
              {plan.per}
            </span>
          </div>

          <ul className="mt-5 space-y-2.5">
            {plan.features.map((f) => (
              <li key={f} className={`flex items-center gap-2.5 rounded-[10px] px-3.5 py-2.5 text-[13px] ${
                plan.highlighted ? "bg-white/10 text-white" : "bg-[#F8FAFC] text-[#374151]"
              }`}>
                <span className="text-[#22C55E] font-bold">✓</span>
                {f}
              </li>
            ))}
          </ul>

          <button
            type="button"
            className={`mt-6 w-full rounded-full py-3 text-[14px] font-bold transition-all ${
              plan.highlighted
                ? "bg-[#FF7A00] text-white shadow-[0_4px_14px_rgba(255,122,0,0.4)] hover:bg-[#F26A00]"
                : "border-2 border-[#E8EDF5] bg-white text-[#374151] hover:border-[#0F1623] hover:text-[#0F1623]"
            }`}
          >
            {plan.cta}
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default ProPage;
