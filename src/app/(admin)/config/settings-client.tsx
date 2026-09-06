"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateConfigValue } from "@/features/config/actions";
import { Check, Pencil, X } from "lucide-react";

type Config = {
  key: string;
  label: string | null;
  value: unknown;
  category: string | null;
  updatedAt: string;
  updatedBy: string | null;
};

const CATEGORY_LABELS: Record<string, string> = {
  pricing: "💰 Pricing & Rates",
  business: "🏢 Business Info",
  labour: "👥 Labour",
  stats: "📊 Website Stats",
};

function groupByCategory(configs: Config[]): Record<string, Config[]> {
  return configs.reduce<Record<string, Config[]>>((acc, conf) => {
    const cat = conf.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(conf);
    return acc;
  }, {});
}

function EditableRow({ conf }: { conf: Config }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(conf.value ?? ""));
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    const parsed = isNaN(Number(value)) ? value : Number(value);
    startTransition(async () => {
      await updateConfigValue(conf.key, parsed);
      setEditing(false);
      router.refresh();
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") { setValue(String(conf.value ?? "")); setEditing(false); }
  }

  return (
    <div className="flex items-center justify-between px-4 py-3.5 border-b border-outline/10 last:border-0 hover:bg-surface-container-low/30 group transition-colors">
      <div className="flex-1">
        <p className="text-sm font-medium text-on-surface">{conf.label}</p>
        <p className="text-xs text-on-surface-variant font-mono mt-0.5">{conf.key}</p>
      </div>
      <div className="flex items-center gap-2">
        {editing ? (
          <>
            <input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-32 px-2.5 py-1.5 rounded-lg border border-primary/50 bg-surface text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-right"
            />
            <button onClick={handleSave} disabled={isPending}
              className="w-7 h-7 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center transition-colors">
              <Check className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => { setValue(String(conf.value ?? "")); setEditing(false); }}
              className="w-7 h-7 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-low flex items-center justify-center transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <>
            <span className="text-sm font-semibold text-on-surface tabular-nums min-w-[5rem] text-right">
              {String(conf.value ?? "—")}
            </span>
            <button onClick={() => setEditing(true)}
              className="w-7 h-7 rounded-lg opacity-0 group-hover:opacity-100 bg-surface-container text-on-surface-variant hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-all">
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function BusinessSettingsClient({ configs }: { configs: Config[] }) {
  const grouped = groupByCategory(configs);

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-display font-semibold text-on-surface">Business Settings</h1>
        <p className="text-on-surface-variant mt-1">
          Manage pricing rates, GST, advance %, and business details. Hover any row and click <Pencil className="w-3 h-3 inline" /> to edit.
        </p>
      </div>

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="border border-outline/20 rounded-xl bg-surface-container-low/30 overflow-hidden">
          <div className="px-4 py-3 bg-surface-container border-b border-outline/20">
            <h2 className="font-medium text-on-surface">{CATEGORY_LABELS[category] || category}</h2>
          </div>
          <div>
            {items.map((conf) => (
              <EditableRow key={conf.key} conf={conf} />
            ))}
          </div>
        </div>
      ))}

      {configs.length === 0 && (
        <div className="text-center py-12 text-on-surface-variant border border-outline/20 rounded-xl">
          No configuration found. Run <code className="bg-surface-container px-1.5 py-0.5 rounded font-mono text-sm">pnpm db:seed</code> to populate defaults.
        </div>
      )}
    </div>
  );
}
