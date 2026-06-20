import Card from "../../components/ui/Card";

const ProPage = () => {
  return (
    <div className="px-4 py-10">
      <Card className="mx-auto max-w-4xl p-6 text-center md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#89f336]">
          Pro Version
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
          Plays Go Pro is coming soon
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-700 md:text-base">
          Advanced match discovery, premium profile tools, and priority post
          visibility will live here. For now, this page keeps the demo route
          ready without needing an API.
        </p>
      </Card>
    </div>
  );
};

export default ProPage;
