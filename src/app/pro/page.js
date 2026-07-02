import Card from "../../components/ui/Card";
import { Check } from "lucide-react";

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
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--brand)]">Subscription</p>
      <h1 className="mt-2 text-[26px] font-black leading-tight text-[var(--text-heading)] md:text-[38px]">
        PlaysGo Pro — better reach,<br className="hidden md:block" /> stronger visibility
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-[14px] leading-relaxed text-[var(--text-muted)]">
        Upgrade for priority ranking, advanced filtering, unlimited posts, and stronger local discovery. Currently a UI preview of the future subscription experience.
      </p>
    </Card>

    {/* Plans */}
    <div className="grid gap-5 md:grid-cols-2">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`relative overflow-hidden rounded-sm border p-6 transition md:p-8 ${
            plan.highlighted
              ? "border-[var(--text-heading)] bg-[var(--text-heading)] text-white shadow-[0_8px_32px_rgba(30,20,10,0.18)]"
              : "border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-[0_2px_12px_rgba(30,20,10,0.06)]"
          }`}
        >
          {plan.highlighted && (
            <span className="absolute right-4 top-4 rounded-full bg-[var(--brand)] px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white">
              {plan.badge}
            </span>
          )}

          <p className={`text-[11px] font-bold uppercase tracking-[0.18em] ${plan.highlighted ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`}>
            {plan.name}
          </p>
          <div className="mt-3 flex items-end gap-2">
            <span className={`text-[40px] font-black leading-none ${plan.highlighted ? "text-white" : "text-[var(--text-heading)]"}`}>
              {plan.price}
            </span>
            <span className={`pb-1.5 text-[13px] ${plan.highlighted ? "text-white/60" : "text-[var(--text-muted)]"}`}>
              {plan.per}
            </span>
          </div>

          <ul className="mt-5 space-y-2.5">
            {plan.features.map((f) => (
              <li key={f} className={`flex items-center gap-2.5 rounded-sm px-3.5 py-2.5 text-[13px] ${
                plan.highlighted ? "bg-white/10 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-body)]"
              }`}>
                <Check className="h-4 w-4 shrink-0 text-[#22C55E]" strokeWidth={2.5} />
                {f}
              </li>
            ))}
          </ul>

          <button
            type="button"
            className={`mt-6 w-full rounded-full py-3 text-[14px] font-bold transition-all ${
              plan.highlighted
                ? "bg-[var(--brand)] text-white shadow-[0_4px_14px_rgba(255,60,31,0.35)] hover:bg-[var(--brand-hover)]"
                : "border-2 border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-body)] hover:border-[var(--text-heading)] hover:text-[var(--text-heading)]"
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
