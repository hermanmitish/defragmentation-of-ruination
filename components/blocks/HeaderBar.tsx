// components/defrag/HeaderBar.tsx
"use client";

import { groups } from "@/app/static-data";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { Calendar, LogIn, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function HeaderBar({
  user,
  profile,
  generalList,
  selectedGpId,
  selectedGroup,
}: {
  user: User | null;
  generalList: { id: number; codename: string; name: string; group?: string }[];
  profile: {
    id: string;
    name: string;
    role: string;
    group: string;
    approved_at: string;
  } | null;
  selectedGpId: string | number | null;
  selectedGroup: string;
}) {
  const router = useRouter();
  const avatar =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    user?.identities?.[0]?.identity_data?.avatar_url ||
    user?.identities?.[0]?.identity_data?.picture;
  // console.log({ selectedGroup, selectedGpId, generalList });
  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-8 py-3 flex items-center justify-between">
        <div className="text-sm uppercase tracking-widest font-mono">
          Дефрагментація руїн
        </div>

        <div className="flex items-center gap-3 flex-1 justify-center">
          <Select
            value={String(selectedGpId ?? "")}
            onValueChange={(v: string) =>
              router.push(
                `/?gp=${v}${
                  selectedGroup && selectedGroup !== "all"
                    ? `&group=${selectedGroup}`
                    : ""
                }`
              )
            }
          >
            <SelectTrigger className="w-[160px] border-border h-8 text-xs">
              <SelectValue placeholder="Оберіть Зразок" />
            </SelectTrigger>
            <SelectContent>
              {generalList
                ?.filter((v) =>
                  selectedGroup === "all"
                    ? true
                    : !selectedGroup
                    ? true
                    : v.group === selectedGroup
                )
                .map((g) => (
                  <SelectItem key={g.id} value={g.id.toString()}>
                    {g.codename || g.name || `#${g.id}`}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <div className="flex gap-0 border border-border">
            {(["all", ...groups.map((v) => v.value)] as const).map((group) => (
              <button
                key={group}
                onClick={() =>
                  router.push(
                    `/?gp=${
                      generalList
                        ?.filter((v) => v.group === group)
                        ?.find((v) => v.id === selectedGpId)?.id ||
                      generalList?.filter((v) => v.group === group)?.[0]?.id ||
                      ""
                    }${group && group !== "all" ? `&group=${group}` : ""}`
                  )
                }
                className={`px-3 py-1 text-xs border-r border-border last:border-r-0 transition-colors ${
                  selectedGroup === group
                    ? "bg-foreground text-card"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {group === "all"
                  ? "ВСІ"
                  : `${groups.find((g) => g.value === group)?.label}`}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
            <Calendar className="w-3 h-3" />
            <span>{new Date().toLocaleDateString("uk-UA")}</span>
          </div>
          {!!user && (
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
              <span>{user?.user_metadata?.full_name}</span>
              {avatar && (
                <img
                  src={avatar}
                  alt="User Avatar"
                  className="w-4 h-4 rounded-full object-cover border border-border"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "/default-avatar.png";
                  }}
                />
              )}
            </div>
          )}
          {!user ? (
            <button
              className="flex items-center gap-2 px-3 py-1.5 border border-border text-xs hover:bg-muted"
              onClick={() => {
                const supabase = createClient();
                supabase.auth.signInWithOAuth({
                  provider: "google",
                  options: {
                    redirectTo: `${window.location.origin}/defragmentation/auth/oauth?next=/defragmentation`,
                  },
                });
              }}
            >
              <LogIn className="w-3 h-3" /> Увійти
            </button>
          ) : (
            <button
              className="flex items-center gap-2 px-3 py-1.5 border border-border text-xs hover:bg-muted"
              onClick={async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                router.refresh();
              }}
            >
              <LogOut className="w-3 h-3" /> Вийти
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
