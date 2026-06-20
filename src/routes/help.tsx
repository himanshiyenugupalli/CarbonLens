import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Mail } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & Support: CarbonLens" },
      { name: "description", content: "Get help and find answers to frequently asked questions." },
    ],
  }),
  component: HelpPage,
});

function HelpPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl animate-fade-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
          <p className="mt-2 text-sm text-muted-foreground">Find answers to common questions or reach out to us.</p>
        </div>

        <div className="glass-strong overflow-hidden p-6 sm:p-10 space-y-8">
          
          <section>
            <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How is my carbon footprint calculated?</AccordionTrigger>
                <AccordionContent>
                  CarbonLens uses standard conversion factors to estimate the carbon emissions of your daily activities. For example, we convert the distance you drive or the electricity you use into estimated kilograms of CO₂.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Can I edit a mistake in my log?</AccordionTrigger>
                <AccordionContent>
                  Yes! Head over to the Dashboard and scroll down to the "Recent Activities" section. Simply click on any log to open the edit modal, where you can update the values or delete it entirely.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>How does the AI personalization work?</AccordionTrigger>
                <AccordionContent>
                  We use your profile settings (location, diet, etc.) along with your recent logs to generate specific, actionable suggestions. The AI analyzes your highest emission categories to recommend the easiest ways to reduce your footprint.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section className="pt-4 border-t border-[var(--glass-border)]">
            <h2 className="text-lg font-semibold mb-4">Still have doubts?</h2>
            <p className="text-sm text-muted-foreground mb-4">
              If you have any other questions, bug reports, or feature requests, feel free to drop us an email.
            </p>
            <a 
              href="mailto:support@carbonlens.com"
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[var(--leaf)] px-6 py-3 text-sm font-semibold text-[oklch(0.15_0.03_160)] shadow transition hover:brightness-105"
            >
              <Mail className="w-4 h-4" /> Contact Support
            </a>
          </section>

        </div>
      </div>
    </AppShell>
  );
}
