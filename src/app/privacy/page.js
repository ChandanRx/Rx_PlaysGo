import Card from "../../components/ui/Card";
import {
  ShieldCheckIcon,
  InformationCircleIcon,
  CircleStackIcon,
  ShareIcon,
  ClockIcon,
  AdjustmentsHorizontalIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

const LAST_UPDATED = "July 29, 2026";

const sections = [
  {
    icon: InformationCircleIcon,
    title: "Information we collect",
    points: [
      "Profile details you provide — such as your name, chosen avatar, and community area.",
      "Content you post — the games, requests, and listings you share on the feed.",
      "Basic usage signals — the filters and preferences you set so the app can remember them.",
    ],
  },
  {
    icon: AdjustmentsHorizontalIcon,
    title: "How we use your information",
    points: [
      "To show you relevant nearby posts and personalise your feed.",
      "To let other members contact you about the posts you create.",
      "To remember your appearance, notification, and feed preferences between visits.",
    ],
  },
  {
    icon: CircleStackIcon,
    title: "Local storage & cookies",
    points: [
      "PlaysGo stores your theme, category, and preferences in your browser's local storage — this stays on your device.",
      "We do not use third-party advertising or tracking cookies.",
      "Clearing your browser storage will reset these preferences.",
    ],
  },
  {
    icon: ShareIcon,
    title: "Sharing your information",
    points: [
      "Posts and profile details you publish are visible to other members of the community.",
      "We do not sell your personal information.",
      "We only share data with service providers needed to run the app, or when required by law.",
    ],
  },
  {
    icon: ClockIcon,
    title: "Data retention",
    points: [
      "Your posts and profile remain until you remove them or delete your account.",
      "Preferences kept in local storage last until you clear them.",
    ],
  },
  {
    icon: ShieldCheckIcon,
    title: "Your choices & rights",
    points: [
      "You can update your profile and preferences any time from Settings.",
      "You can request access to, correction of, or deletion of your personal data.",
      "You can opt out of non-essential notifications from the notification settings.",
    ],
  },
];

const Privacy = () => (
  <div className="space-y-5">

    {/* Hero */}
    <Card className="p-6 md:p-8" hover={false}>
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
          <ShieldCheckIcon className="h-5 w-5" strokeWidth={2} />
        </span>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--brand)]">Privacy Policy</p>
      </div>
      <h1 className="mt-3 text-[24px] font-black leading-tight text-[var(--text-heading)] md:text-[30px]">
        Your privacy matters to us
      </h1>
      <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-[var(--text-body)]">
        This policy explains what information PlaysGo collects, how we use it, and the choices you have.
        We keep things simple and only collect what we need to run your local community feed.
      </p>
      <p className="mt-4 text-[12.5px] font-semibold text-[var(--text-muted)]">Last updated: {LAST_UPDATED}</p>
    </Card>

    {/* Sections */}
    <div className="grid gap-5 sm:grid-cols-2">
      {sections.map(({ icon: Icon, title, points }) => (
        <Card key={title} className="p-5 md:p-6" hover={false}>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
              <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
            </span>
            <h2 className="text-[16px] font-black text-[var(--text-heading)]">{title}</h2>
          </div>
          <ul className="mt-4 space-y-2.5">
            {points.map((point) => (
              <li key={point} className="flex gap-2.5 text-[13px] leading-relaxed text-[var(--text-body)]">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>

    {/* Changes + contact */}
    <Card className="p-5 md:p-6" hover={false}>
      <h2 className="text-[17px] font-black text-[var(--text-heading)]">Changes to this policy</h2>
      <p className="mt-2 max-w-3xl text-[13.5px] leading-relaxed text-[var(--text-body)]">
        We may update this policy as PlaysGo grows. When we make significant changes, we'll update the
        date above and, where appropriate, let you know in the app.
      </p>

      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-3.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
          <EnvelopeIcon className="h-[18px] w-[18px]" strokeWidth={2} />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-[var(--text-heading)]">Questions about your privacy?</p>
          <p className="text-[12.5px] text-[var(--text-muted)]">
            Reach us at <span className="font-semibold text-[var(--brand)]">privacy@playsgo.app</span>
          </p>
        </div>
      </div>
    </Card>
  </div>
);

export default Privacy;
