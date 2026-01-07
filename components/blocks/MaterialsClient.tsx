/* eslint-disable @typescript-eslint/no-explicit-any */
// components/defrag/MaterialsClient.tsx
"use client";

import { deleteMaterial, deleteMaterialPhoto } from "@/app/actions";
import { ChartCard } from "@/components/ChartCard";
import { User } from "@supabase/supabase-js";
import { Delete, X } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AddMaterialPhotoDialog from "../dialogs/AddMaterialPhotoDialog";
import UpdateMaterialDialog from "../dialogs/UpdateMaterialDialog";
import { Button } from "../ui/button";

type MaterialPhoto = { id: string; storage_path: string; url: string };
type Material = {
  id: number;
  material_name: string;
  codename: string;
  weight: number;
  color: string;
  can_be_reused: boolean;
  description?: string;
  material_photos?: MaterialPhoto[];
};

const COLORS = [
  "#5A5F63",
  "#6B7A79",
  "#7A8B8A",
  "#9FA5A9",
  "#8A7A6B",
  "#9A8A7B",
];

export default function MaterialsClient({
  user,
  materials,
}: {
  user: User | null;
  materials: Material[];
}) {
  const [colorFilter, setColorFilter] = useState<string>("all");
  const [reuseFilter, setReuseFilter] = useState<"all" | "yes" | "no">("all");

  const filtered = useMemo(() => {
    return materials.filter((m) => {
      if (colorFilter !== "all" && m.color !== colorFilter) return false;
      if (reuseFilter === "yes" && !m.can_be_reused) return false;
      if (reuseFilter === "no" && m.can_be_reused) return false;
      return true;
    });
  }, [materials, colorFilter, reuseFilter]);

  const total = useMemo(
    () => filtered.reduce((s, m) => s + Number(m.weight || 0), 0),
    [filtered]
  );

  const pieData = useMemo(
    () =>
      filtered.map((m) => ({
        name: m.material_name,
        value: Number(m.weight || 0),
      })),
    [filtered]
  );

  const barData = useMemo(
    () =>
      [...filtered]
        .sort((a, b) => Number(b.weight) - Number(a.weight))
        .map((m) => ({
          name: m.material_name || m.codename,
          weight: Number(m.weight || 0),
        })),
    [filtered]
  );

  const colorOptions = useMemo(
    () => Array.from(new Set(materials.map((m) => m.color))),
    [materials]
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          className="border border-border bg-background px-2 py-1 text-sm"
          value={colorFilter}
          onChange={(e) => setColorFilter(e.target.value)}
        >
          <option value="all">All colors</option>
          {colorOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          className="border border-border bg-background px-2 py-1 text-sm"
          value={reuseFilter}
          onChange={(e) => setReuseFilter(e.target.value as any)}
        >
          <option value="all">All reuse</option>
          <option value="yes">Reusable</option>
          <option value="no">Not reusable</option>
        </select>

        <div className="text-xs text-muted-foreground ml-auto">
          Total: {total}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Частка типів матеріалів">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={120}
              >
                {pieData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Кумулятивний розподіл матеріалів">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={barData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" fontSize={8} width={80} />
              <Tooltip />
              <Bar dataKey="weight" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Table */}
      <div className="border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="text-xs uppercase tracking-wide font-mono">
            Таблиця матеріалів
          </div>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="p-3">Назва</th>
                <th className="p-3">Код</th>
                <th className="p-3">Вага</th>
                <th className="p-3">Колір</th>
                <th className="p-3">Підлягає перевикористанню</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <Fragment key={m.id}>
                  <tr
                    key={m.id}
                    className="border-t border-border hover:bg-secondary peer"
                  >
                    <td className="p-3">{m.material_name}</td>
                    <td className="p-3">{m.codename}</td>
                    <td className="p-3 text-muted-foreground">{m.weight}</td>
                    <td className="p-3 text-muted-foreground">{m.color}</td>
                    <td className="p-3 text-muted-foreground">
                      {m.can_be_reused ? "Так" : "Ні"}
                    </td>
                    <td className="p-3 text-right flex items-end justify-end ">
                      {(() => {
                        const photo = m.material_photos?.[0]; // treat the first as “the one”
                        if (!user && !photo) return null;
                        if (!user && photo) {
                          return (
                            <div className="inline-flex items-center gap-2">
                              <img
                                src={photo.url}
                                alt="fraction photo"
                                className="w-10 h-10 object-cover border border-border rounded"
                              />
                            </div>
                          );
                        }

                        if (!photo) {
                          return <AddMaterialPhotoDialog materialId={m.id} />;
                        }

                        return (
                          <div className="inline-flex items-center gap-2">
                            <img
                              src={photo.url}
                              alt="fraction photo"
                              className="w-10 h-10 object-cover border border-border rounded"
                            />

                            <button
                              type="button"
                              onClick={async () => {
                                if (!confirm("Delete this photo?")) return;
                                await deleteMaterialPhoto({
                                  material_photo_id: photo.id,
                                  storage_path: photo.storage_path,
                                });
                              }}
                              className="w-4 h-4 -ml-3 -mt-10 inline-flex items-center justify-center rounded border border-border bg-primary-foreground hover:bg-red-50 hover:border-red-300"
                              aria-label="Delete fraction photo"
                              title="Delete"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })()}
                      {!!user && (
                        <>
                          <UpdateMaterialDialog
                            material={{
                              id: m.id,
                              material_name: m.material_name,
                              codename: m.codename,
                              weight: m.weight,
                              color: m.color,
                              can_be_reused: m.can_be_reused,
                              description: m.description,
                            }}
                          />
                          <Button
                            variant={"outline"}
                            type="button"
                            size={"icon"}
                            className="ml-2"
                            onClick={async () => {
                              if (!confirm("Видалити матеріал?")) return;
                              await deleteMaterial(m.id);
                            }}
                          >
                            <Delete />
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                  {/* Description sub-row */}
                  {m.description?.trim?.() && (
                    <tr
                      key={`${m.id}-desc`}
                      className="border-border/50 hover:bg-secondary peer-hover:bg-secondary"
                    >
                      <td colSpan={5} className="px-3 pb-3 pt-0">
                        <div className="text-xs text-muted-foreground bg-muted/10 p-2 border">
                          {m.description?.trim?.() ? (
                            <span className="whitespace-pre-wrap">
                              {m.description}
                            </span>
                          ) : (
                            <span className="italic">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
