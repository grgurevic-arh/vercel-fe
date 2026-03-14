"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import type { Locale } from "@/lib/i18n";
import type { EntryPoll } from "@/types/cms";

interface PollFormProps {
  poll: EntryPoll;
  locale: Locale;
}

export function PollForm({ poll, locale }: PollFormProps) {
  const router = useRouter();
  const storageKey = `poll-submitted-${poll.documentId}`;

  const hasSubmittedBefore = (() => {
    try {
      return localStorage.getItem(storageKey) !== null;
    } catch {
      return false;
    }
  })();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pollClosed, setPollClosed] = useState(false);
  const [showBanner, setShowBanner] = useState(hasSubmittedBefore);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<Record<string, string>>();

  const onSubmit = async (formData: Record<string, string>) => {
    setSubmitError(null);

    const answers = poll.questions.map((q) => ({
      questionId: q.questionId,
      value: formData[q.questionId] ?? "",
    }));

    try {
      const res = await fetch("/api/polls/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entryPoll: poll.documentId,
          locale,
          answers,
          metadata: {
            userAgent: navigator.userAgent,
            submittedAt: new Date().toISOString(),
          },
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message = body?.error?.message ?? body?.error ?? "";

        if (message.includes("not accepting submissions")) {
          setPollClosed(true);
          return;
        }

        if (body?.error?.details?.missingQuestionIds) {
          const missing: string[] = body.error.details.missingQuestionIds;
          for (const qId of missing) {
            setError(qId, { message: "This field is required" });
          }
          return;
        }

        setSubmitError(
          locale === "hr"
            ? "Nešto je pošlo po krivu. Pokušajte ponovno."
            : "Something went wrong. Please try again.",
        );
        return;
      }

      try {
        localStorage.setItem(storageKey, "true");
      } catch {
        // localStorage not available
      }

      router.push(`/${locale}/research/${poll.slug}/thank-you`);
    } catch {
      setSubmitError(
        locale === "hr"
          ? "Nešto je pošlo po krivu. Pokušajte ponovno."
          : "Something went wrong. Please try again.",
      );
    }
  };

  const requiredMessage =
    locale === "hr" ? "Ovo polje je obavezno" : "This field is required";

  return (
    <div>
      {showBanner ? (
        <div
          className="
            mb-[24px] flex items-center justify-between
            border border-text-primary/20 px-[16px] py-[12px]
            text-[14px] leading-[20px] text-text-primary/70
          "
        >
          <span>
            {locale === "hr"
              ? "Već ste odgovorili na ovu anketu."
              : "You have already submitted this poll."}
          </span>
          <button
            type="button"
            onClick={() => setShowBanner(false)}
            className="ml-[12px] text-text-primary underline"
          >
            {locale === "hr" ? "Zatvori" : "Dismiss"}
          </button>
        </div>
      ) : null}

      {pollClosed ? (
        <p className="text-[18px] leading-[26px] text-text-primary">
          {locale === "hr"
            ? "Ova anketa je zatvorena."
            : "This poll has been closed."}
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* First two questions — two-column on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-[40px] gap-y-[24px]">
            {poll.questions.slice(0, 2).map((q) => (
              <div key={q.questionId} className="flex flex-col gap-[6px]">
                <label
                  htmlFor={q.questionId}
                  className="
                    font-sans text-[16px] leading-[23px]
                    [font-feature-settings:'onum'_1,'pnum'_1]
                    text-text-primary
                  "
                >
                  {q.prompt}
                  {q.required ? (
                    <span className="ml-[4px] text-red-600">*</span>
                  ) : null}
                </label>

                {q.inputType === "text" ? (
                  <input
                    id={q.questionId}
                    type="text"
                    placeholder={q.placeholder ?? undefined}
                    {...register(q.questionId, {
                      required: q.required ? requiredMessage : false,
                    })}
                    className="
                      font-sans w-full border-0 border-b border-[#636363]
                      bg-transparent px-[1px] py-[10px]
                      text-[16px] leading-[23px]
                      text-text-primary
                      placeholder:text-[#636363] placeholder:tracking-[-0.1px]
                      focus:outline focus:outline-2 focus:outline-text-primary
                    "
                  />
                ) : null}

                {q.inputType === "select" ? (
                  <div className="flex items-center gap-[20px] py-[10px]">
                    {q.options?.map((opt) => (
                      <label
                        key={opt.value}
                        className="
                          flex items-center gap-[7px] cursor-pointer
                          font-sans text-[16px] leading-[23px]
                          text-text-primary tracking-[-0.1px]
                        "
                      >
                        <input
                          type="radio"
                          value={opt.value}
                          {...register(q.questionId, {
                            required: q.required ? requiredMessage : false,
                          })}
                          className="size-[12px] accent-text-primary"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                ) : null}

                {q.inputType === "textarea" ? (
                  <textarea
                    id={q.questionId}
                    rows={4}
                    placeholder={q.placeholder ?? undefined}
                    {...register(q.questionId, {
                      required: q.required ? requiredMessage : false,
                    })}
                    className="
                      font-sans w-full border-0 border-b border-[#636363]
                      bg-transparent px-[1px] py-[10px]
                      text-[16px] leading-[23px]
                      text-text-primary
                      placeholder:text-[#636363] placeholder:tracking-[-0.1px]
                      focus:outline focus:outline-2 focus:outline-text-primary
                      resize-y
                    "
                  />
                ) : null}

                {errors[q.questionId] ? (
                  <p className="mt-[4px] text-[14px] text-red-600">
                    {errors[q.questionId]?.message}
                  </p>
                ) : null}
              </div>
            ))}
          </div>

          {/* Remaining questions — single column */}
          <div
            className="
              mt-[32px] md:mt-[92px]
              space-y-[24px] md:space-y-[32px]
            "
          >
            {poll.questions.slice(2).map((q) => (
              <div key={q.questionId} className="flex flex-col gap-[6px]">
                <label
                  htmlFor={q.questionId}
                  className="
                    font-sans text-[16px] leading-[23px]
                    [font-feature-settings:'onum'_1,'pnum'_1]
                    text-text-primary
                  "
                >
                  {q.prompt}
                  {q.required ? (
                    <span className="ml-[4px] text-red-600">*</span>
                  ) : null}
                </label>

                {q.inputType === "text" ? (
                  <input
                    id={q.questionId}
                    type="text"
                    placeholder={q.placeholder ?? undefined}
                    {...register(q.questionId, {
                      required: q.required ? requiredMessage : false,
                    })}
                    className="
                      font-sans w-full border-0 border-b border-[#636363]
                      bg-transparent px-[1px] py-[10px]
                      text-[16px] leading-[23px]
                      text-text-primary
                      placeholder:text-[#636363] placeholder:tracking-[-0.1px]
                      focus:outline focus:outline-2 focus:outline-text-primary
                    "
                  />
                ) : null}

                {q.inputType === "textarea" ? (
                  <textarea
                    id={q.questionId}
                    rows={4}
                    placeholder={q.placeholder ?? undefined}
                    {...register(q.questionId, {
                      required: q.required ? requiredMessage : false,
                    })}
                    className="
                      font-sans w-full border-0 border-b border-[#636363]
                      bg-transparent px-[1px] py-[10px]
                      text-[16px] leading-[23px]
                      text-text-primary
                      placeholder:text-[#636363] placeholder:tracking-[-0.1px]
                      focus:outline focus:outline-2 focus:outline-text-primary
                      resize-y
                    "
                  />
                ) : null}

                {q.inputType === "select" ? (
                  <div className="flex items-center gap-[20px] py-[10px]">
                    {q.options?.map((opt) => (
                      <label
                        key={opt.value}
                        className="
                          flex items-center gap-[7px] cursor-pointer
                          font-sans text-[16px] leading-[23px]
                          text-text-primary tracking-[-0.1px]
                        "
                      >
                        <input
                          type="radio"
                          value={opt.value}
                          {...register(q.questionId, {
                            required: q.required ? requiredMessage : false,
                          })}
                          className="size-[12px] accent-text-primary"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                ) : null}

                {errors[q.questionId] ? (
                  <p className="mt-[4px] text-[14px] text-red-600">
                    {errors[q.questionId]?.message}
                  </p>
                ) : null}
              </div>
            ))}
          </div>

          {submitError ? (
            <p className="mt-[16px] text-[14px] text-red-600">{submitError}</p>
          ) : null}

          <div className="flex justify-center md:justify-end mt-[32px] md:mt-[40px]">
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                w-full md:w-auto
                font-serif
                px-[20px] py-[10px]
                bg-text-primary text-white
                text-[20px] leading-[28px]
                [font-feature-settings:'onum'_1,'pnum'_1]
                hover:opacity-80
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {isSubmitting
                ? locale === "hr"
                  ? "Šaljem..."
                  : "Submitting..."
                : locale === "hr"
                  ? "Pošalji"
                  : "Submit"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
