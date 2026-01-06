"use client";
// components/BlockVoting.tsx
import { deleteFeedback, deleteIdea, deleteVote } from "@/app/actions";
import { artisticForms } from "@/app/static-data";
import { SectionWrapper } from "@/components/SectionWrapper";
import AddFeedbackDialog from "@/components/dialogs/AddFeedbackDialog";
import AddIdeaDialog from "@/components/dialogs/AddIdeaDialog";
import AddVoteDialog from "@/components/dialogs/AddVoteDialog";
import { User } from "@supabase/supabase-js";
import { X } from "lucide-react";

type Vote = {
  id: number;
  chosen_form: string;
  created_at: string;
  profiles?: { id: string; group: string };
};
type Idea = { id: number; form: string; idea: string; created_at: string };
type Feedback = {
  id: number;
  describe_idea_and_process: string;
  emotions: string;
  necessary_strategies: string;
  created_at: string;
};

export default function BlockVoting({
  user,
  votes,
  ideas,
  feedback,
  votesAll,
  ideasOther,
  feedbackOther,
  profile,
}: {
  user: User | null;
  votes: Vote[];
  ideas: Idea[];
  feedback?: Feedback;
  votesAll?: Vote[];
  ideasOther?: Idea[];
  feedbackOther?: Feedback[];
  profile?: { id: string; group: string } | null;
}) {
  return (
    <SectionWrapper
      id="block-voting"
      label="БЛОК 3"
      question="Опитування та рефлексія"
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="mb-2 text-neutral-700">Опитування</h3>
          <p className="text-sm text-muted-foreground">
            Вибір художньої форми, ідеї та рефлексія.
          </p>
        </div>

        {!!user ? (
          <div className="flex flex-wrap gap-2">
            <AddVoteDialog disabled={!!votes.length} />
            <AddIdeaDialog />
            <AddFeedbackDialog disabled={!!feedback} />
          </div>
        ) : null}
      </div>

      {!user ? (
        <></>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="border border-border bg-card p-5">
            <div className="text-xs uppercase tracking-wide font-mono mb-3">
              Ваш вибір художньої форми
            </div>
            {votes.length === 0 ? (
              <div className="text-sm text-muted-foreground">Немає даних.</div>
            ) : (
              <ul className="space-y-2">
                {votes?.[0] && (
                  <li
                    key={votes[0].id}
                    className="text-sm flex items-center justify-between gap-2 group"
                  >
                    <span>{votes[0].chosen_form}</span>

                    <button
                      type="button"
                      onClick={async () => {
                        if (!confirm("Clear your vote?")) return;
                        await deleteVote(votes[0].id);
                      }}
                      className="
                        w-6 h-6
                        flex items-center justify-center
                        rounded
                        opacity-0 group-hover:opacity-100
                        transition
                        text-muted-foreground
                        hover:text-red-600
                        hover:bg-red-50
                      "
                      aria-label="Clear vote"
                      title="Clear vote"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </li>
                )}
              </ul>
            )}
          </div>

          <div className="border border-border bg-card p-5">
            <div className="text-xs uppercase tracking-wide font-mono mb-3">
              Ваші ідеї
            </div>
            {ideas.length === 0 ? (
              <div className="text-sm text-muted-foreground">Немає ідей.</div>
            ) : (
              <ul className="space-y-3">
                {ideas.map((i) => (
                  <li
                    key={i.id}
                    className="text-sm group flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Тип: {i.form}
                      </div>
                      <div>{i.idea}</div>
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        if (!confirm("Delete this idea?")) return;
                        await deleteIdea(i.id);
                      }}
                      className="
                        mt-0.5
                        w-6 h-6
                        flex items-center justify-center
                        rounded
                        opacity-0 group-hover:opacity-100
                        transition
                        text-muted-foreground
                        hover:text-red-600
                        hover:bg-red-50
                        shrink-0
                      "
                      aria-label="Delete idea"
                      title="Delete idea"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border border-border bg-card p-5">
            <div className="text-xs uppercase tracking-wide font-mono mb-3">
              Ваш фідбек
            </div>
            {!feedback ? (
              <div className="text-sm text-muted-foreground">
                Немає фідбеку.
              </div>
            ) : (
              <div className="relative group space-y-4 text-sm bg-card ">
                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm("Delete your feedback?")) return;
                    await deleteFeedback(feedback.id);
                  }}
                  className="
                    absolute top-0 right-0
                    w-6 h-6
                    flex items-center justify-center
                    rounded
                    opacity-0 group-hover:opacity-100
                    transition
                    text-muted-foreground
                    hover:text-red-600
                    hover:bg-red-50
                  "
                  aria-label="Delete feedback"
                  title="Delete feedback"
                >
                  <X className="w-3 h-3" />
                </button>

                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Ідея та процес
                  </div>
                  <div>{feedback.describe_idea_and_process}</div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Емоції
                  </div>
                  <div>{feedback.emotions}</div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Стратегії
                  </div>
                  <div>{feedback.necessary_strategies}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {artisticForms.map((a) => (
            <div
              key={a.value}
              className={`border p-4 ${
                votes?.[0]?.chosen_form === a.value
                  ? "border-foreground bg-secondary"
                  : "border-border bg-card"
              }`}
            >
              <div className="aspect-square bg-muted mb-3 overflow-hidden relative">
                <img
                  src={"/defragmentation" + a.image}
                  alt={a.value}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 z-100 backdrop-blur-sm text-xs bg-background/50  px-2 py-1 flex flex-col items-end ">
                  <div>
                    Загалом голосів:{" "}
                    {votesAll?.filter((v) => v.chosen_form === a.value)
                      ?.length || 0}
                  </div>
                  {!!user && (
                    <div>
                      Голосів в вашій групі:{" "}
                      {votesAll
                        ?.filter((v) => v.chosen_form === a.value)
                        ?.filter((v) => v.profiles?.group === profile?.group)
                        .length || 0}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-xs text-center text-foreground font-mono uppercase tracking-wide">
                {a.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        {(!!ideasOther?.length || !!feedbackOther?.length) && (
          <h3 className="mb-6 text-neutral-700">Ідеї інших учасників</h3>
        )}

        {ideasOther?.length ? (
          <div className="grid lg:grid-cols-2 gap-6">
            {ideasOther?.map((m) => (
              <div key={m.id} className="border border-border bg-card p-6">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 font-mono">
                  Тип: {m.form}
                </div>

                <blockquote className="text-sm text-foreground italic border-l-2 border-muted pl-4">
                  &quot;{m.idea}&quot;
                </blockquote>
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}

        {feedbackOther?.length ? (
          <div className="mt-8 border border-border bg-secondary p-6">
            <h4 className="mb-4 text-xs uppercase tracking-widest text-foreground font-mono">
              Інші рефлексії учасників
            </h4>
            <div className="grid lg:grid-cols-3 gap-4">
              {feedbackOther
                // .filter((r) => r.sample_id !== selectedSample)
                .map((feedback, idx) => (
                  <div key={idx} className="bg-card p-4 border border-border">
                    <div className="space-y-4 text-sm">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          Ідея та процес
                        </div>
                        <div>{feedback.describe_idea_and_process}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          Емоції
                        </div>
                        <div>{feedback.emotions}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          Стратегії
                        </div>
                        <div>{feedback.necessary_strategies}</div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </SectionWrapper>
  );
}
