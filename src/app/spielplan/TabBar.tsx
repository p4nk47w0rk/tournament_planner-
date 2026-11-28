type Tab = "all" | "A" | "B" | "playoffs";

interface TabBarProps {
  tabs: Tab[];
  active: Tab;
  onChange: (tab: Tab) => void;
  t: (k: string) => string;
}

export default function TabBar({ tabs, active, onChange, t }: TabBarProps) {
  return (
    <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
      {tabs.map((tab) => (
        <TabButton
          key={tab}
          active={active === tab}
          onClick={() => onChange(tab)}
        >
          {tab === "all" && t("all")}
          {tab === "A" && t("groupA")}
          {tab === "B" && t("groupB")}
          {tab === "playoffs" && t("playoffs")}
        </TabButton>
      ))}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200
        ${
          active
            ? "bg-[#3B5E4D] text-white"
            : "text-slate-stone dark:text-dark-text-secondary hover:text-slate-ink dark:hover:text-dark-text hover:bg-slate-100 dark:hover:bg-dark-border"
        }`}
    >
      {children}
    </button>
  );
}
