import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Command } from "cmdk";
import { Search, FileText, BarChart3, Settings, Image as ImageIcon, Brain, ListChecks, Sparkles, Type, UtensilsCrossed, CalendarDays } from "lucide-react";
import { ADMIN_NAV } from "./admin-shell";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function go(to: string) { navigate({ to }); setOpen(false); }

  const icons: Record<string, React.ReactNode> = {
    "/admin": <BarChart3 className="h-4 w-4" />,
    "/admin/page": <FileText className="h-4 w-4" />,
    "/admin/site-content": <Type className="h-4 w-4" />,
    "/admin/menu": <UtensilsCrossed className="h-4 w-4" />,
    "/admin/gallery": <ImageIcon className="h-4 w-4" />,
    "/admin/events": <CalendarDays className="h-4 w-4" />,
    "/admin/media": <ImageIcon className="h-4 w-4" />,
    "/admin/test-analytics": <Brain className="h-4 w-4" />,
    "/admin/test-results": <BarChart3 className="h-4 w-4" />,
    "/admin/test-questions": <ListChecks className="h-4 w-4" />,
    "/admin/personality-types": <Sparkles className="h-4 w-4" />,
    "/admin/analytics": <BarChart3 className="h-4 w-4" />,
    "/admin/settings": <Settings className="h-4 w-4" />,
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4" onClick={() => setOpen(false)}>
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-popover shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <Command label="جستجو" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Command.Input placeholder="جستجو یا اجرای دستور..." className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground" />
            <kbd className="text-[10px] rounded border border-border px-1.5 py-0.5 text-muted-foreground">ESC</kbd>
          </div>
          <Command.List className="max-h-80 overflow-y-auto p-1.5">
            <Command.Empty className="py-6 text-center text-xs text-muted-foreground">نتیجه‌ای یافت نشد</Command.Empty>
            <Command.Group heading="پیمایش">
              {ADMIN_NAV.map(item => (
                <Item key={item.to} onSelect={() => go(item.to)} icon={icons[item.to] ?? <FileText className="h-4 w-4" />} label={item.label} />
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}

function Item({ onSelect, icon, label }: { onSelect: () => void; icon: React.ReactNode; label: string }) {
  return (
    <Command.Item onSelect={onSelect} className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm cursor-pointer aria-selected:bg-muted">
      <span className="text-muted-foreground">{icon}</span>{label}
    </Command.Item>
  );
}
