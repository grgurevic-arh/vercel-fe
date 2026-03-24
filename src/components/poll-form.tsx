"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/translations";
import type { EntryPoll } from "@/types/cms";

interface PollFormProps {
  poll: EntryPoll;
  locale: Locale;
}

export function PollForm({ poll, locale }: PollFormProps) {
  const router = useRouter();
  const trans = t(locale);
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

  const [accessCodeError, setAccessCodeError] = useState<string | null>(null);

  const onSubmit = async (formData: Record<string, string>) => {
    setSubmitError(null);
    setAccessCodeError(null);

    if (poll.requiresAccessCode && !formData.__accessCode?.trim()) {
      setAccessCodeError(trans.pollForm.accessCodeRequired);
      return;
    }

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
          ...(poll.requiresAccessCode
            ? { accessCode: formData.__accessCode.trim() }
            : {}),
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

        if (message.includes("requires an access code")) {
          setAccessCodeError(trans.pollForm.accessCodeRequired);
          return;
        }

        if (message.includes("Invalid access code")) {
          setAccessCodeError(trans.pollForm.accessCodeInvalid);
          return;
        }

        if (body?.error?.details?.missingQuestionIds) {
          const missing: string[] = body.error.details.missingQuestionIds;
          for (const qId of missing) {
            setError(qId, { message: trans.pollForm.fieldRequired });
          }
          return;
        }

        setSubmitError(trans.pollForm.somethingWentWrong);
        return;
      }

      try {
        localStorage.setItem(storageKey, "true");
      } catch {
        // localStorage not available
      }

      router.push(`/${locale}/research/${poll.slug}/thank-you`);
    } catch {
      setSubmitError(trans.pollForm.somethingWentWrong);
    }
  };

  const requiredMessage = trans.pollForm.fieldRequired;

  return (
    <div>
      {showBanner ? (
        <div
          className="
            mb-[32px] flex items-center justify-between
            px-[1px] py-[10px]
            font-sans text-[16px] leading-[23px] text-[#636363]
            [font-feature-settings:'onum'_1,'pnum'_1]
          "
        >
          <span>{trans.pollForm.alreadySubmitted}</span>
          <button
            type="button"
            onClick={() => setShowBanner(false)}
            className="ml-[12px] font-serif text-text-primary underline"
          >
            {trans.pollForm.dismiss}
          </button>
        </div>
      ) : null}

      {pollClosed ? (
        <p className="text-[18px] leading-[26px] text-text-primary">
          {trans.pollForm.pollClosed}
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-[24px] md:space-y-[32px]">
            {poll.requiresAccessCode ? (
              <div className="flex flex-col gap-[6px]">
                <label
                  htmlFor="__accessCode"
                  className="
                    font-sans text-[16px] leading-[23px]
                    [font-feature-settings:'onum'_1,'pnum'_1]
                    text-text-primary
                  "
                >
                  {trans.pollForm.accessCodeLabel}
                  <span className="ml-[4px] text-red-600">*</span>
                </label>
                <input
                  id="__accessCode"
                  type="text"
                  placeholder={trans.pollForm.accessCodePlaceholder}
                  {...register("__accessCode")}
                  className="
                    font-sans w-full border-0 border-b border-[#636363]
                    bg-transparent px-[1px] py-[10px]
                    text-[16px] leading-[23px]
                    text-text-primary
                    placeholder:text-[#636363] placeholder:tracking-[-0.1px]
                    focus:outline-none
                  "
                />
                {accessCodeError ? (
                  <p className="mt-[4px] text-[14px] text-red-600">
                    {accessCodeError}
                  </p>
                ) : null}
              </div>
            ) : null}

            {poll.questions.map((q) => (
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
                      focus:outline-none
                    "
                  />
                ) : null}

                {q.inputType === "textarea" ? (
                  <textarea
                    id={q.questionId}
                    rows={1}
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
                      focus:outline-none
                      resize-y
                    "
                  />
                ) : null}

                {q.inputType === "select" ? (
                  <div className="flex flex-wrap items-center gap-[20px] py-[10px]">
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
              {isSubmitting ? trans.pollForm.submitting : trans.pollForm.submit}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
