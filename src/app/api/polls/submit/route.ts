import { NextResponse } from "next/server";

import { submitPollAnswers } from "@/lib/cms";
import { isLocale } from "@/lib/i18n";
import { StrapiRequestError } from "@/lib/strapi-client";
import type { PollAnswer } from "@/types/cms";

interface SubmissionBody {
  entryPoll?: string;
  locale?: string;
  answers?: PollAnswer[];
  accessCode?: string;
  metadata?: Record<string, unknown>;
}

export async function POST(request: Request) {
  const { entryPoll, locale, answers, accessCode, metadata }: SubmissionBody =
    await request.json();

  if (!entryPoll || typeof entryPoll !== "string") {
    return NextResponse.json(
      { error: "entryPoll documentId is required." },
      { status: 400 },
    );
  }

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
    const submission = await submitPollAnswers({
      entryPoll,
      locale,
      answers,
      ...(accessCode ? { accessCode } : {}),
      metadata,
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    if (error instanceof StrapiRequestError && error.status === 400) {
      return NextResponse.json(error.details, { status: 400 });
    }

    console.error("Poll submission failed", error);
    return NextResponse.json(
      { error: "Unable to submit poll answers." },
      { status: 502 },
    );
  }
}
