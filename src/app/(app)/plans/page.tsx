import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/format";
import { FadeIn } from "@/components/ui/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/ui/stagger";
import { SubscribeDialog } from "@/components/subscribe-dialog";
import { Check } from "lucide-react";

export default async function PlansPage() {
  const supabase = await createClient();
  const { data: plans } = await supabase
    .from("plans")
    .select("*")
    .eq("active", true)
    .order("min_amount", { ascending: true });

  return (
    <div className="space-y-8">
      <FadeIn>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Investment Plans</h1>
          <p className="mt-1 text-sm text-slate-500">
            Choose a plan that fits your savings goal. All plans run for 7 days.
          </p>
        </div>
      </FadeIn>

      <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(plans ?? []).map((plan) => {
          const totalReturnPct = Number(plan.roi_percent) * Number(plan.duration_days);
          return (
            <StaggerItem key={plan.id}>
              <div className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-amber-400/40 hover:shadow-md hover:shadow-amber-400/5">
                {/* header */}
                <div className="mb-4">
                  <h2 className="text-base font-semibold text-slate-900">{plan.name}</h2>
                  <div className="mt-2 flex items-end gap-1">
                    <span className="text-4xl font-bold text-amber-500">
                      {plan.roi_percent}%
                    </span>
                    <span className="mb-1 text-sm text-slate-400">/ day</span>
                  </div>
                </div>

                {/* divider */}
                <div className="mb-4 h-px bg-slate-100" />

                {/* description */}
                <p className="mb-4 text-sm leading-relaxed text-slate-500">
                  {plan.description}
                </p>

                {/* features */}
                <ul className="mb-6 flex-1 space-y-2.5 text-sm">
                  <li className="flex items-center gap-2.5 text-slate-700">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400/15">
                      <Check className="h-3 w-3 text-amber-600" />
                    </span>
                    Min {formatCurrency(Number(plan.min_amount))}
                  </li>
                  {plan.max_amount && (
                    <li className="flex items-center gap-2.5 text-slate-700">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400/15">
                        <Check className="h-3 w-3 text-amber-600" />
                      </span>
                      Max {formatCurrency(Number(plan.max_amount))}
                    </li>
                  )}
                  <li className="flex items-center gap-2.5 text-slate-700">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400/15">
                      <Check className="h-3 w-3 text-amber-600" />
                    </span>
                    {plan.duration_days} days · {totalReturnPct}% total return
                  </li>
                </ul>

                <SubscribeDialog plan={plan} />
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </div>
  );
}
