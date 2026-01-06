"use client";
import { ChartCard } from "@/components/ChartCard";
import { MetaCard } from "@/components/MetaCard";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SectionWrapper } from "@/components/SectionWrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { Calendar, LogIn, LogOut } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
import {
  fractions,
  materials,
  sampleOverviews,
  solutionsReflections,
} from "./data/mockData";

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

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{
    id: string;
    name: string;
    role: string;
    group: string;
    approved_at: string;
  } | null>(null);
  useEffect(() => {
    const supabase = createClient();

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user && !profile) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("id, name, role, group, approved_at")
          .eq("id", user.id)
          .single();
        setProfile(profile);
      } else if (!user) {
        setProfile(null);
      }
    })();
  }, []);

  const [selectedSample, setSelectedSample] = useState("S001");
  const [selectedGroup, setSelectedGroup] = useState<"A" | "B" | "C" | "all">(
    "all"
  );
  const [viewMode, setViewMode] = useState<"weight" | "percentage">("weight");
  const [materialFilter, setMaterialFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [decisionFilter, setDecisionFilter] = useState<string>("all");

  // Filtered data based on selections
  const currentSample = useMemo(
    () =>
      sampleOverviews.find((s) => s.sample_id === selectedSample) ||
      sampleOverviews[0],
    [selectedSample]
  );

  const currentFractions = useMemo(
    () => fractions.filter((f) => f.sample_id === selectedSample),
    [selectedSample]
  );

  const currentMaterials = useMemo(
    () => materials.filter((m) => m.sample_id === selectedSample),
    [selectedSample]
  );

  const filteredMaterials = useMemo(() => {
    return currentMaterials.filter((m) => {
      if (materialFilter !== "all" && m.material_type !== materialFilter)
        return false;
      if (riskFilter !== "all" && m.risk_level !== riskFilter) return false;
      if (decisionFilter !== "all" && m.decision !== decisionFilter)
        return false;
      return true;
    });
  }, [currentMaterials, materialFilter, riskFilter, decisionFilter]);

  const currentReflection = useMemo(
    () => solutionsReflections.find((r) => r.sample_id === selectedSample),
    [selectedSample]
  );

  // Computed metrics
  const weightDelta =
    currentSample.total_weight_pre_wash_g -
    currentSample.total_weight_post_wash_g;
  const weightDeltaPercent = (
    (weightDelta / currentSample.total_weight_pre_wash_g) *
    100
  ).toFixed(1);

  const totalFractionWeight = currentFractions.reduce(
    (sum, f) => sum + f.weight_g,
    0
  );
  const totalMaterialWeight = filteredMaterials.reduce(
    (sum, m) => sum + m.weight_g,
    0
  );

  // Chart data preparations
  const fractionChartData = currentFractions.map((f) => ({
    name: f.fraction_label,
    weight: f.weight_g,
    percentage: ((f.weight_g / totalFractionWeight) * 100).toFixed(1),
    reuse: f.reuse_potential_score,
  }));

  const materialPieData = currentMaterials.map((m) => ({
    name: m.material_type,
    value: m.weight_g,
    percentage: ((m.weight_g / totalMaterialWeight) * 100).toFixed(1),
  }));

  const materialBarData = [...currentMaterials]
    .sort((a, b) => b.weight_g - a.weight_g)
    .map((m, idx, arr) => {
      const cumulativeWeight = arr
        .slice(0, idx + 1)
        .reduce((sum, item) => sum + item.weight_g, 0);
      return {
        name: m.material_type,
        weight: m.weight_g,
        cumulative: ((cumulativeWeight / totalMaterialWeight) * 100).toFixed(1),
      };
    });

  // Solution matrix data
  const solutionTypes = ["gabion", "filler", "mosaic", "not_suitable", "other"];
  const materialTypes = Array.from(
    new Set(materials.map((m) => m.material_type))
  );

  const solutionMatrixData = materialTypes.map((matType) => {
    const row: { [mat: string]: string | number } = { material: matType };
    solutionTypes.forEach((solType) => {
      // Count or sum weights where this material was assigned to this solution
      const count = solutionsReflections.filter(
        (r) => r.solution_type === solType
      ).length;
      row[solType] = count > 0 ? Math.random() * 100 : 0; // Mock intensity
    });
    return row;
  });

  const materialsWithCumulative = [...filteredMaterials]
    .sort((a, b) => b.weight_g - a.weight_g)
    .map((m, idx, arr) => {
      const percentage = (m.weight_g / totalMaterialWeight) * 100;
      const cumulativePercent = arr
        .slice(0, idx + 1)
        .reduce(
          (sum, item) => sum + (item.weight_g / totalMaterialWeight) * 100,
          0
        );
      return {
        ...m,
        percentage: percentage.toFixed(1),
        cumulativePercent: cumulativePercent.toFixed(1),
      };
    });

  return (
    <div
      className="min-h-screen bg-background"
      style={{ fontFamily: "IBM Plex Sans, sans-serif" }}
    >
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-8 py-3">
          <div className="flex items-center justify-between gap-8">
            <h1 className="text-sm uppercase tracking-widest font-mono text-foreground">
              Дефрагментація руїн
            </h1>

            <div className="flex items-center gap-3 flex-1 justify-center">
              <Select value={selectedSample} onValueChange={setSelectedSample}>
                <SelectTrigger className="w-[140px] border-border h-8 text-xs">
                  <SelectValue placeholder="Зразок" />
                </SelectTrigger>
                <SelectContent>
                  {sampleOverviews.map((s) => (
                    <SelectItem key={s.sample_id} value={s.sample_id}>
                      {s.sample_id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-0 border border-border">
                {(["all", "A", "B", "C"] as const).map((group) => (
                  <button
                    key={group}
                    onClick={() => setSelectedGroup(group)}
                    className={`px-3 py-1 text-xs border-r border-border last:border-r-0 transition-colors ${
                      selectedGroup === group
                        ? "bg-foreground text-card"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {group === "all" ? "ВСІ" : `Г.${group}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                <Calendar className="w-3 h-3" />
                <span>{new Date().toLocaleDateString("uk-UA")}</span>
              </div>
              {!user && (
                <button
                  onClick={() => {
                    const supabase = createClient();
                    supabase.auth.signInWithOAuth({
                      provider: "google",
                      options: {
                        redirectTo: `${window.location.origin}/defragmentation/auth/oauth?next=/defragmentation`,
                      },
                    });
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 border border-border text-xs hover:bg-muted transition-colors uppercase tracking-wide font-mono"
                >
                  <LogIn className="w-3 h-3" />
                  Увійти
                </button>
              )}
              {!!user && (
                <button
                  onClick={() => {
                    const supabase = createClient();
                    supabase.auth.signOut();
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 border border-border text-xs hover:bg-muted transition-colors uppercase tracking-wide font-mono"
                >
                  <LogOut className="w-3 h-3" />
                  Вийти
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Hero Section */}
      <section id="hero" className="py-16 border-b border-border">
        <div className="max-w-4xl mx-auto px-8">
          <h2
            className="mb-6 max-w-3xl"
            style={{
              fontFamily: "IBM Plex Sans, sans-serif",
              lineHeight: "1.3",
            }}
          >
            Перетворення фрагментів на записи: матеріал, ризик, повторне
            використання та рефлексія
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">
            Дані зібрані під час воркшопу з аналізу будівельного сміття. Кожен
            зразок документує процес класифікації матеріалів, оцінки ризиків та
            визначення можливостей повторного використання.
          </p>
        </div>
      </section>

      {/* Block 1 - Material Overview */}
      <SectionWrapper
        id="block-1"
        label="БЛОК 1"
        question="Огляд матеріалу та фракції"
      >
        {/* Sub-block 1.1 */}
        <div className="mb-16">
          <h3 className="mb-6 text-neutral-700">
            З яким матеріалом ми працюємо?
          </h3>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <MetaCard label="ID зразка" value={currentSample.sample_id} />
            <MetaCard
              label="Дата аналізу"
              value={new Date(currentSample.analysis_date).toLocaleDateString(
                "uk-UA"
              )}
            />
            <MetaCard label="Група" value={currentSample.group} />
            <MetaCard
              label="Вага до промивання"
              value={currentSample.total_weight_pre_wash_g}
              unit="г"
            />
            <MetaCard
              label="Вага після промивання"
              value={currentSample.total_weight_post_wash_g}
              unit="г"
            />
            <MetaCard
              label="Дельта"
              value={`-${weightDelta}`}
              unit={`г (${weightDeltaPercent}%)`}
              highlight
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="border border-border bg-card overflow-hidden">
              <img
                src={currentSample.photo_url}
                alt="Зразок матеріалу"
                className="w-full h-80 object-cover"
              />
              <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground font-mono uppercase tracking-wider">
                Зразок {currentSample.sample_id}
              </div>
            </div>

            <div className="flex flex-col justify-center gap-5 p-6 border border-border bg-card">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-mono">
                  Загальна вага після обробки
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl text-foreground font-mono">
                    {currentSample.total_weight_post_wash_g}
                  </span>
                  <span className="text-sm text-muted-foreground font-mono">
                    г
                  </span>
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-mono">
                  Втрата ваги при промиванні
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl text-foreground font-mono">
                    {weightDelta}
                  </span>
                  <span className="text-sm text-muted-foreground font-mono">
                    г ({weightDeltaPercent}%)
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t border-border text-xs text-muted-foreground leading-relaxed">
                Промивання видалило пил, глину та дрібні частки, залишивши
                тільки структурний матеріал
              </div>
            </div>
          </div>
        </div>

        {/* Sub-block 1.2 */}
        <div>
          <h3 className="mb-6 text-neutral-700">
            Які фракції складають щебінь? Який циркулярний потенціал кожної
            фракції?
          </h3>

          <div className="mb-4 flex gap-0 border border-border">
            <button
              onClick={() => setViewMode("weight")}
              className={`px-4 py-2 text-sm transition-all border-r border-border ${
                viewMode === "weight"
                  ? "bg-foreground text-card"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              За вагою (г)
            </button>
            <button
              onClick={() => setViewMode("percentage")}
              className={`px-4 py-2 text-sm transition-all ${
                viewMode === "percentage"
                  ? "bg-foreground text-card"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              За відсотками (%)
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <ChartCard title="Розподіл фракцій за вагою">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={fractionChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    stroke="#737373"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#737373" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E5E5",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="weight" fill="#3F3F3F" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Частка фракцій">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={fractionChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="weight"
                  >
                    {fractionChartData.map((entry, index) => (
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

            <ChartCard title="Потенціал повторного використання за фракціями">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={fractionChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    stroke="#737373"
                  />
                  <YAxis
                    domain={[0, 1]}
                    tick={{ fontSize: 12 }}
                    stroke="#737373"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E5E5",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="reuse" fill="#9C8B7A" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 text-xs text-neutral-500 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  Високий (0.7-1.0)
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  Середній (0.4-0.7)
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  Низький (0-0.4)
                </div>
              </div>
            </ChartCard>
          </div>
        </div>
      </SectionWrapper>

      {/* Block 2 - Materials Composition */}
      <SectionWrapper id="block-2" label="БЛОК 2" question="Склад матеріалів">
        {/* Sub-block 2.1 */}
        <div className="mb-16">
          <h3 className="mb-6 text-neutral-700">
            З чого насправді складається щебінь?
          </h3>

          <ChartCard title="Частка типів матеріалів">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={materialPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {materialPieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        COLORS.materials[
                          entry.name as keyof typeof COLORS.materials
                        ] || "#CCCCCC"
                      }
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
        </div>

        {/* Sub-block 2.2 */}
        <div>
          <h3 className="mb-6 text-neutral-700">
            Скільки кожного матеріалу присутнє, включаючи ризик та рішення?
          </h3>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <Select value={materialFilter} onValueChange={setMaterialFilter}>
              <SelectTrigger className="w-[200px] border-border">
                <SelectValue placeholder="Тип матеріалу" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Всі матеріали</SelectItem>
                {Array.from(
                  new Set(currentMaterials.map((m) => m.material_type))
                ).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-[200px] border-border">
                <SelectValue placeholder="Рівень ризику" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Всі рівні</SelectItem>
                <SelectItem value="низький">Низький</SelectItem>
                <SelectItem value="невідомий">Невідомий</SelectItem>
                <SelectItem value="потенційно ризиковий">
                  Потенційно ризиковий
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={decisionFilter} onValueChange={setDecisionFilter}>
              <SelectTrigger className="w-[200px] border-border">
                <SelectValue placeholder="Рішення" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Всі рішення</SelectItem>
                <SelectItem value="придатний">Придатний</SelectItem>
                <SelectItem value="непридатний">Непридатний</SelectItem>
                <SelectItem value="відкладено">Відкладено</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Charts */}
            <div className="space-y-6">
              <ChartCard title="Кумулятивний розподіл матеріалів">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={materialBarData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 12 }}
                      stroke="#737373"
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fontSize: 11 }}
                      stroke="#737373"
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #E5E5E5",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar
                      dataKey="weight"
                      fill="#3F3F3F"
                      radius={[0, 8, 8, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Materials Table */}
            <div className="border border-border bg-card overflow-hidden">
              <div className="p-4 border-b border-border">
                <h4 className="text-xs text-foreground uppercase tracking-wide font-mono">
                  Таблиця матеріалів
                </h4>
              </div>
              <div className="overflow-auto max-h-[500px]">
                <table className="w-full text-sm">
                  <thead className="bg-secondary sticky top-0">
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="p-3"></th>
                      <th className="p-3">Матеріал</th>
                      <th className="p-3">Вага (г)</th>
                      <th className="p-3">%</th>
                      <th className="p-3">Кумул. %</th>
                      <th className="p-3">Колір</th>
                      <th className="p-3">Ризик</th>
                      <th className="p-3">Рішення</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materialsWithCumulative.map((material, idx) => (
                      <tr
                        key={idx}
                        className="border-t border-border hover:bg-secondary"
                      >
                        <td className="p-3">
                          <img
                            src={material.photo_url_small}
                            alt={material.material_type}
                            className="w-10 h-10 object-cover"
                          />
                        </td>
                        <td className="p-3 text-foreground">
                          {material.material_type}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {material.weight_g}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {material.percentage}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {material.cumulativePercent}
                        </td>
                        <td className="p-3">
                          <span className="text-xs px-2 py-0.5 border border-border bg-secondary text-muted-foreground font-mono">
                            {material.color_class}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`text-xs px-2 py-0.5 border font-mono ${
                              material.risk_level === "низький"
                                ? "border-green-600 bg-green-50 text-green-700"
                                : material.risk_level === "потенційно ризиковий"
                                ? "border-red-600 bg-red-50 text-red-700"
                                : "border-yellow-600 bg-yellow-50 text-yellow-700"
                            }`}
                          >
                            {material.risk_level}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`text-xs px-2 py-0.5 border font-mono ${
                              material.decision === "придатний"
                                ? "border-blue-600 bg-blue-50 text-blue-700"
                                : material.decision === "непридатний"
                                ? "border-gray-600 bg-gray-50 text-gray-700"
                                : "border-purple-600 bg-purple-50 text-purple-700"
                            }`}
                          >
                            {material.decision}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Block 3 - Decisions & Reflection */}
      <SectionWrapper
        id="block-3"
        label="БЛОК 3"
        question="Рішення, придатність та емоційна рефлексія"
      >
        {/* Sub-block 3.1 */}
        <div className="mb-16">
          <h3 className="mb-6 text-neutral-700">
            Придатність та обрана художня форма
          </h3>

          {currentReflection && (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {[
                { type: "gabion", label: "Габіон" },
                { type: "filler", label: "Наповнювач" },
                { type: "mosaic", label: "Мозаїка" },
                { type: "not_suitable", label: "Не підходить" },
                { type: "other", label: "Інше" },
              ].map((solution) => (
                <div
                  key={solution.type}
                  className={`border p-4 ${
                    currentReflection.solution_type === solution.type
                      ? "border-foreground bg-secondary"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="aspect-square bg-muted mb-3 overflow-hidden">
                    {currentReflection.solution_type === solution.type && (
                      <img
                        src={currentReflection.photo_url}
                        alt={solution.label}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="text-xs text-center text-foreground font-mono uppercase tracking-wide">
                    {solution.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-xs text-muted-foreground mb-6 font-mono">
            Ця матриця показує, куди потрапляє матеріал у процесі воркшопу
          </div>
        </div>

        {/* Sub-block 3.2 */}
        <div>
          <h3 className="mb-6 text-neutral-700">Анонімна рефлексія</h3>

          {currentReflection && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="border border-border bg-card p-6">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 font-mono">
                  Емоції під час роботи з матеріалом
                </div>
                <blockquote className="text-sm text-foreground italic border-l-2 border-muted pl-4">
                  &quot;{currentReflection.reflection_emotions}&quot;
                </blockquote>
              </div>

              <div className="border border-border bg-card p-6">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 font-mono">
                  Стратегії для свідомої роботи з руїнами
                </div>
                <blockquote className="text-sm text-foreground italic border-l-2 border-muted pl-4">
                  &quot;{currentReflection.reflection_strategies}&quot;
                </blockquote>
              </div>
            </div>
          )}

          <div className="mt-8 border border-border bg-secondary p-6">
            <h4 className="mb-4 text-xs uppercase tracking-widest text-foreground font-mono">
              Інші рефлексії учасників
            </h4>
            <div className="grid lg:grid-cols-3 gap-4">
              {solutionsReflections
                .filter((r) => r.sample_id !== selectedSample)
                .map((reflection, idx) => (
                  <div key={idx} className="bg-card p-4 border border-border">
                    <div className="text-[10px] text-muted-foreground mb-2 font-mono uppercase tracking-wider">
                      Зразок {reflection.sample_id}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {reflection.reflection_emotions}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Data Schema Accordion */}
      <section className="py-12 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-8">
          <Accordion type="single" collapsible>
            <AccordionItem value="schema">
              <AccordionTrigger className="text-sm text-neutral-700">
                Схема даних (для підключення Google Sheets)
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-sm text-neutral-600">
                  <div>
                    <h4 className="mb-2 text-neutral-900">samples_overview</h4>
                    <p className="text-xs">
                      Колонки: sample_id, analysis_date, group,
                      total_weight_pre_wash_g, total_weight_post_wash_g,
                      photo_url
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 text-neutral-900">fractions</h4>
                    <p className="text-xs">
                      Колонки: sample_id, fraction_label, weight_g,
                      reuse_potential_score, reuse_category
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 text-neutral-900">materials</h4>
                    <p className="text-xs">
                      Колонки: sample_id, material_type, weight_g,
                      photo_url_small, color_class, risk_level, decision,
                      notes_optional
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 text-neutral-900">
                      solutions_reflection
                    </h4>
                    <p className="text-xs">
                      Колонки: sample_id, solution_type, photo_url,
                      reflection_emotions, reflection_strategies, is_anonymous
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-8 text-center text-xs text-neutral-500">
          Дефрагментація руїн — Воркшоп з аналізу та переосмислення будівельних
          матеріалів
        </div>
      </footer>
    </div>
  );
}
