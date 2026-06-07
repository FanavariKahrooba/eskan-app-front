"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { runAnalysisApi } from "../lib/ai-analysis-api";
import {
    AnalysisApiData,
    AnalysisInsight,
    AnalysisMessage,
    AnalysisType,
    UploadedAnalysisFile,
    UseAiDataLabOptions,
} from "../types/ai-analysis";

function buildOverviewMarkdown(data: AnalysisApiData) {
    const summary = data.summary?.trim() || "خلاصه‌ای برای این تحلیل ثبت نشده است.";
    const keyPoints = data.key_points || [];

    const keyPointsSection = keyPoints.length
        ? keyPoints.map((item) => `- ${item}`).join("\n")
        : "موردی ثبت نشده است.";

    return [
        "## خلاصه تحلیل",
        "",
        summary,
        "",
        "---",
        "",
        "### نکات کلیدی",
        "",
        keyPointsSection,
    ].join("\n");
}

function buildStatisticsMarkdown(data: AnalysisApiData) {
    const statistics = data.statistics || [];

    if (!statistics.length) {
        return "### شاخص‌ها و آمار\n\nموردی ثبت نشده است.";
    }

    return [
        "### شاخص‌ها و آمار",
        "",
        ...statistics.map(
            (item) =>
                `- **${item.label}**: ${item.value}${item.description ? ` — ${item.description}` : ""
                }`
        ),
    ].join("\n");
}

function buildRisksMarkdown(data: AnalysisApiData) {
    const risks = data.risks || [];

    if (!risks.length) {
        return "### ریسک‌ها\n\nموردی ثبت نشده است.";
    }

    return ["### ریسک‌ها", "", ...risks.map((item) => `- ${item}`)].join("\n");
}

function buildRecommendationsMarkdown(data: AnalysisApiData) {
    const recommendations = data.recommendations || [];

    if (!recommendations.length) {
        return "### پیشنهادها\n\nموردی ثبت نشده است.";
    }

    return [
        "### پیشنهادها",
        "",
        ...recommendations.map((item) => `- ${item}`),
    ].join("\n");
}

function buildReportMarkdown(data: AnalysisApiData) {
    const conclusion =
        data.conclusion?.trim() || "جمع‌بندی مشخصی برای این تحلیل ارائه نشده است.";

    const confidence =
        typeof data.confidence_score === "number"
            ? `**ضریب اطمینان تحلیل:** ${Math.round(data.confidence_score * 100)}٪`
            : "**ضریب اطمینان تحلیل:** نامشخص";

    return [
        "## گزارش نهایی تحلیل",
        "",
        conclusion,
        "",
        "---",
        "",
        buildStatisticsMarkdown(data),
        "",
        "---",
        "",
        buildRisksMarkdown(data),
        "",
        "---",
        "",
        buildRecommendationsMarkdown(data),
        "",
        "---",
        "",
        confidence,
    ].join("\n");
}

function buildInsights(data: AnalysisApiData): AnalysisInsight[] {
    const insightsFromKeyPoints = (data.key_points || []).map((point, index) => ({
        title: `بینش ${index + 1}`,
        description: point,
    }));

    const insightsFromStatistics = (data.statistics || []).map((item, index) => ({
        title: item.label || `شاخص ${index + 1}`,
        description: item.description
            ? `مقدار ثبت‌شده: **${item.value}**\n\n${item.description}`
            : `مقدار ثبت‌شده: **${item.value}**`,
    }));

    const merged = [...insightsFromKeyPoints, ...insightsFromStatistics];

    return merged.length
        ? merged
        : [
            {
                title: "بدون بینش استخراج‌شده",
                description: "برای این تحلیل، بینش مشخصی از سمت سرویس دریافت نشد.",
            },
        ];
}

function buildHistoryMessages(
    content: string,
    data: AnalysisApiData,
    conversationId: string
): AnalysisMessage[] {
    const now = new Date().toISOString();

    return [
        {
            id: crypto.randomUUID(),
            conversation_id: conversationId,
            role: "user",
            content,
            metadata: {},
            created_at: now,
        },
        {
            id: crypto.randomUUID(),
            conversation_id: conversationId,
            role: "assistant",
            content: buildOverviewMarkdown(data),
            metadata: {
                confidence_score: data.confidence_score ?? null,
                source: "analysis_api",
            },
            created_at: now,
        },
    ];
}

export function useAiDataLab({
    tenantId,
    userId,
    initialConversationId = null,
}: UseAiDataLabOptions) {
    const [conversationId, setConversationId] = useState<string | null>(
        initialConversationId
    );
    const [content, setContent] = useState("");
    const [analysisType, setAnalysisType] =
        useState<AnalysisType>("full_analysis");
    const [files, setFiles] = useState<UploadedAnalysisFile[]>([]);

    const [loadingRun, setLoadingRun] = useState(false);

    const [result, setResult] = useState<string>("");
    const [report, setReport] = useState<string>("");
    const [insights, setInsights] = useState<AnalysisInsight[]>([]);
    const [messages, setMessages] = useState<AnalysisMessage[]>([]);

    const combinedContent = useMemo(() => {
        const uploadedFilesText = files
            .map((file, index) => {
                const body = file.text?.trim()
                    ? file.text.trim()
                    : "محتوای متنی برای این فایل در دسترس نیست.";
                return `### فایل ${index + 1}: ${file.name}\n${body}`;
            })
            .join("\n\n");

        if (content.trim() && uploadedFilesText) {
            return `${content.trim()}\n\n---\n\n${uploadedFilesText}`;
        }

        if (uploadedFilesText) {
            return uploadedFilesText;
        }

        return content.trim();
    }, [content, files]);

    async function runAnalysis() {
        if (!combinedContent.trim()) {
            toast.error("لطفاً متن یا فایل موردنظر برای تحلیل را وارد کنید.");
            return;
        }

        try {
            setLoadingRun(true);

            const response = await runAnalysisApi({
                conversation_id: conversationId,
                tenant_id: tenantId,
                user_id: userId,
                title: "تحلیل جدید",
                content: combinedContent,
                analysis_type: analysisType,
                options: {
                    language: "fa",
                    tone: "professional",
                },
            });

            const data = response.data;

            const nextConversationId =
                data.conversation_id || conversationId || crypto.randomUUID();

            setConversationId(nextConversationId);
            setResult(buildOverviewMarkdown(data));
            setReport(buildReportMarkdown(data));
            setInsights(buildInsights(data));
            setMessages((prev) => [
                ...prev,
                ...buildHistoryMessages(combinedContent, data, nextConversationId),
            ]);

            toast.success("تحلیل با موفقیت انجام شد.");
        } catch (error: any) {
            toast.error(error?.message || "اجرای تحلیل ناموفق بود.");
        } finally {
            setLoadingRun(false);
        }
    }

    function clearAnalysis() {
        setContent("");
        setFiles([]);
        setResult("");
        setReport("");
        setInsights([]);
        setMessages([]);
    }

    function applyTemplate(templateContent: string, type?: AnalysisType) {
        setContent(templateContent);
        if (type) {
            setAnalysisType(type);
        }
    }

    function removeFile(fileId: string) {
        setFiles((prev) => prev.filter((item) => item.id !== fileId));
    }

    return {
        conversationId,
        content,
        setContent,
        analysisType,
        setAnalysisType,
        files,
        setFiles,
        removeFile,
        loadingRun,
        result,
        report,
        insights,
        messages,
        runAnalysis,
        clearAnalysis,
        applyTemplate,
    };
}
