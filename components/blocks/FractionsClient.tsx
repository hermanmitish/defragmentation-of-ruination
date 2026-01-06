// components/defrag/FractionsClient.tsx
"use client";

import { deleteFraction, deleteFractionPhoto } from "@/app/actions";
import { ChartCard } from "@/components/ChartCard";
import AddFractionPhotoDialog from "@/components/dialogs/AddFractionPhotoDialog";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { Delete, X } from "lucide-react";
import { useMemo, useState } from "react";
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

type Fraction = {
  id: number;
  fraction_type: string;
  codename: string;
  amount_weight: number;
  reuse_potential: number;
  fraction_photos?: {
    id: number;
    storage_path: string;
    created_at: string;
    url?: string;
  }[];
};

const COLORS = {
  primary: ["#5A5F63", "#6B7A79", "#7A8B8A", "#9FA5A9"],
  accent: ["#8A7A6B", "#9A8A7B", "#AA9A8B", "#BA9A8B"],
  materials: {
    бетон: "#6B7A79",
    цегла: "#8A7A6B",
    "природний камінь": "#7A8B8A",
    метал: "#5A5F63",
    кераміка: "#9A8A7B",
    шпалери: "#AA9A8B",
    некласифікована: "#9FA5A9",
    інше: "#B0B5B9",
  },
};

export default function FractionsClient({
  user,
  fractions,
}: {
  user: User | null;
  fractions: Fraction[];
}) {
  const [viewMode, setViewMode] = useState<"weight" | "reuse" | "ratio">(
    "weight"
  );

  const total = useMemo(
    () => fractions.reduce((s, f) => s + Number(f.amount_weight || 0), 0),
    [fractions]
  );

  const chartData = useMemo(
    () =>
      fractions.map((f) => ({
        name: f.fraction_type,
        code: f.codename,
        weight: Number(f.amount_weight || 0),
        reuse: Number(f.reuse_potential || 0),
        percentage:
          total > 0
            ? ((Number(f.amount_weight || 0) / total) * 100).toFixed(1)
            : "0",
      })),
    [fractions, total]
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button
          variant={viewMode === "weight" ? "default" : "outline"}
          onClick={() => setViewMode("weight")}
        >
          Вага
        </Button>
        <Button
          variant={viewMode === "reuse" ? "default" : "outline"}
          onClick={() => setViewMode("reuse")}
        >
          Круговий потенціал
        </Button>
        <Button
          variant={viewMode === "ratio" ? "default" : "outline"}
          onClick={() => setViewMode("ratio")}
        >
          Частка фракцій
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {viewMode === "ratio" ? (
          <ChartCard title="Частка фракцій">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="weight"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS.primary[index % COLORS.primary.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E5E5",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        ) : (
          <ChartCard
            title={
              viewMode === "weight"
                ? "Розподіл фракцій за вагою"
                : "Круговий потенціал"
            }
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar
                  dataKey={viewMode === "weight" ? "weight" : "reuse"}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        <div className="border border-border bg-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="text-xs uppercase tracking-wide font-mono">
              Фракції
            </div>
          </div>

          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="p-3">Тип</th>
                  <th className="p-3">Код</th>
                  <th className="p-3">Вага</th>
                  <th className="p-3">К.П.</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {fractions.map((f) => (
                  <tr
                    key={f.id}
                    className="border-t border-border hover:bg-secondary"
                  >
                    <td className="p-3">{f.fraction_type}</td>
                    <td className="p-3">{f.codename}</td>
                    <td className="p-3 text-muted-foreground">
                      {f.amount_weight}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {f.reuse_potential}
                    </td>
                    <td className="p-3 text-right flex items-end justify-end">
                      {(() => {
                        const photo = f.fraction_photos?.[0]; // treat the first as “the one”
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
                          return <AddFractionPhotoDialog fractionId={f.id} />;
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
                                await deleteFractionPhoto({
                                  fraction_photo_id: photo.id,
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
                        <Button
                          variant={"outline"}
                          type="button"
                          size={"icon"}
                          className="ml-2"
                          onClick={async () => {
                            if (!confirm("Видалити фракцію?")) return;
                            await deleteFraction(f.id);
                          }}
                        >
                          <Delete />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
