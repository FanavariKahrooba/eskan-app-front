"use client";

import { useAiDataLab } from "../../hooks/use-ai-data-lab";
import { AnalysisEnterpriseTopbar } from "./AnalysisEnterpriseTopbar";
import { AnalysisComposer } from "./AnalysisComposer";
import { AnalysisTemplates } from "./AnalysisTemplates";
import { AnalysisModeSwitcher } from "./AnalysisModeSwitcher";
import { AnalysisStatsBar } from "./AnalysisStatsBar";
import { AnalysisEmptyState } from "./AnalysisEmptyState";
import { AnalysisOutputPanel } from "./AnalysisOutputPanel";

interface AIDataLabEnterpriseProps {
  tenantId: string | any;
  userId: string | any;
}
export function AIDataLabEnterprise({
  tenantId,
  userId,
}: AIDataLabEnterpriseProps) {
  const lab = useAiDataLab({
    tenantId,
    userId,
  });

  const hasOutput =
    Boolean(lab.result) ||
    Boolean(lab.report) ||
    lab.insights.length > 0 ||
    lab.messages.length > 0;

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col">
        <AnalysisEnterpriseTopbar
          loadingRun={lab.loadingRun}
          onRun={lab.runAnalysis}
          onClear={lab.clearAnalysis}
        />

        <main className="flex-1">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
            <section className="grid gap-6 lg:grid-cols-[390px_minmax(0,1fr)]">
              <div className="flex flex-col gap-4">
                <AnalysisModeSwitcher
                  value={lab.analysisType}
                  onChange={lab.setAnalysisType}
                />

                <AnalysisComposer
                  content={lab.content}
                  onContentChange={lab.setContent}
                  files={lab.files}
                  onFilesChange={lab.setFiles}
                  onRemoveFile={lab.removeFile}
                  loadingRun={lab.loadingRun}
                  onRun={lab.runAnalysis}
                />

                <AnalysisTemplates onApplyTemplate={lab.applyTemplate} />

                <AnalysisStatsBar
                  content={lab.content}
                  files={lab.files}
                  messages={lab.messages}
                />
              </div>

              <div className="min-h-[620px]">
                {hasOutput || lab.loadingRun ? (
                  <AnalysisOutputPanel
                    loading={lab.loadingRun}
                    result={lab.result}
                    report={lab.report}
                    insights={lab.insights}
                    messages={lab.messages}
                  />
                ) : (
                  <AnalysisEmptyState />
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
