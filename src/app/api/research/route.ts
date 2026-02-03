import { NextResponse } from "next/server";

import { submitResearchSubmission } from "@/lib/cms";
import { isLocale } from "@/lib/i18n";
import type { ResearchAnswerPayload } from "@/types/cms";

interface SubmissionBody {
  locale?: string;
  answers?: ResearchAnswerPayload[];
  metadata?: Record<string, unknown>;
}

export async function POST(request: Request) {
  const { locale, answers, metadata }: SubmissionBody = await request.json();

  if (!locale || !isLocale(locale)) {
    return NextResponse.json(
      { error: "Locale is required and must be one of the supported locales." },
      { status: 400 },
    );
  }

  if (!Array.isArray(answers) || answers.length === 0) {
    return NextResponse.json(
      { error: "At least one answer is required." },
      { status: 400 },
    );
  }

  try {
    const submission = await submitResearchSubmission({
      locale,
      answers,
      metadata,
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("Research submission failed", error);
    return NextResponse.json(
      { error: "Unable to submit research answers." },
      { status: 502 },
    );
  }
}
