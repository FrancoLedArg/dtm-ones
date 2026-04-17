"use client";

// Next
import Link from "next/link";

// React Hook Form
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Next Safe Action
import { useAction } from "next-safe-action/hooks";
import { createContactRequest } from "@/actions/contact-requests";

// Validation Schema
import { createContactRequestSchema as schema } from "@/lib/validation/contact-requests";

// Phosphor
import {
  InstagramLogoIcon,
  TiktokLogoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react";

// Toast
import { toast } from "sonner";

// Zod
import { z } from "zod";

// Styles
import styles from "./styles.module.scss";

type FormValues = z.infer<typeof schema>;

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      message: "",
    },
  });

  const { execute, isExecuting } = useAction(createContactRequest, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success(data.message);
        reset();
      }
    },
    onError: ({ error }) => {
      toast.error("No se pudo enviar el mensaje.", {
        description: error.serverError,
      });
    },
  });

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>Contact</h2>
        <p className={styles.subtitle}>
          We're always open to meaningful conversations about basketball,
          careers, and opportunities.
        </p>
      </div>

      <div className={styles.formWrap}>
        <form
          className={styles.form}
          onSubmit={handleSubmit((data) => execute(data))}
          noValidate
        >
          <div className={styles.field}>
            <label htmlFor="email" className={styles.fieldLabel}>
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={styles.fieldInput}
              disabled={isExecuting}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
            {errors.email?.message ? (
              <p id="email-error" className={styles.fieldError} role="alert">
                {errors.email.message}
              </p>
            ) : null}
          </div>

          <div className={styles.field}>
            <label htmlFor="message" className={styles.fieldLabel}>
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder="Write your message…" 
              className={styles.fieldTextarea}
              disabled={isExecuting}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              {...register("message")}
            />
            {errors.message?.message ? (
              <p id="message-error" className={styles.fieldError} role="alert">
                {errors.message.message}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            className={styles.submit}
            disabled={isExecuting}
          >
            {isExecuting ? "Sending…" : "Send message"}
          </button>
        </form>
      </div>

      <div className={styles.socials}>
        <h3 className={styles.title}>Our Socials</h3>
        <div className={styles.icons}>
          <Link href="#" target="_blank" className={styles.item}>
            <InstagramLogoIcon size={24} />
          </Link>

          <Link href="#" target="_blank" className={styles.item}>
            <TiktokLogoIcon size={24} />
          </Link>

          <Link href="#" target="_blank" className={styles.item}>
            <YoutubeLogoIcon size={24} />
          </Link>
        </div>
      </div>
    </section>
  );
}
