"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { shopApi } from "@/lib/api/client";

type AvailabilityField = "username" | "email" | "nickname";
const inputClass = "h-11 w-full border border-[#d1d1d1] bg-transparent px-3 outline-none focus:border-[#444b86] dark:border-[#3a424c]";

export default function RegisterDetailsPage() {
  const router = useRouter(); const { register } = useAuth();
  const [consentAt, setConsentAt] = useState(""); const [ready, setReady] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const [checks, setChecks] = useState<Partial<Record<AvailabilityField, string>>>({});
  useEffect(() => { try { const consent = JSON.parse(sessionStorage.getItem("registration-consent") || "null"); if (!consent?.acceptedTerms || !consent?.acceptedPrivacy || !consent?.acceptedAt) return router.replace("/register"); setConsentAt(consent.acceptedAt); setReady(true); } catch { router.replace("/register"); } }, [router]);
  const checkAvailability = async (field: AvailabilityField) => {
    const value = document.querySelector<HTMLInputElement>(`[name="${field}"]`)?.value.trim() || "";
    if (!value) return setChecks((c) => ({ ...c, [field]: "入力してください。" }));
    try { const result = await shopApi<{ available: boolean }>(`auth/availability?${field}=${encodeURIComponent(value)}`); setChecks((c) => ({ ...c, [field]: result.available ? "使用できます。" : "すでに使用されています。" })); }
    catch (value) { setChecks((c) => ({ ...c, [field]: value instanceof Error ? value.message : "確認できませんでした。" })); }
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); const form = new FormData(event.currentTarget); const password = String(form.get("password") || "");
    if (password !== String(form.get("passwordConfirm") || "")) return setError("パスワードが一致しません。");
    setBusy(true); try {
      await register({ username: String(form.get("username") || ""), email: String(form.get("email") || ""), password, firstName: String(form.get("firstName") || ""), lastName: String(form.get("lastName") || ""), nickname: String(form.get("nickname") || ""), marketingConsent: form.get("marketingConsent") === "on", profilePublic: form.get("profilePublic") === "on", referralCode: String(form.get("referralCode") || ""), acceptedTerms: true, acceptedPrivacy: true, consentAcceptedAt: consentAt });
      sessionStorage.removeItem("registration-consent"); router.push("/account");
    } catch (value) { setError(value instanceof Error ? value.message : "登録に失敗しました。"); } finally { setBusy(false); }
  };
  if (!ready) return <main className="min-h-[500px] bg-white dark:bg-[#0b1016]" />;
  const checkedField = (field: AvailabilityField, label: string, type = "text") => <label className="block font-semibold">{label}<div className="mt-2 flex"><input className={inputClass} required type={type} name={field} /><button type="button" onClick={() => void checkAvailability(field)} className="shrink-0 border border-l-0 border-[#d1d1d1] px-4 dark:border-[#3a424c]">重複チェック</button></div>{checks[field] && <span className="mt-1 block text-xs text-[#b32020]">{checks[field]}</span>}</label>;
  return <main className="bg-white text-[#20252b] md:pt-[50px] dark:bg-[#0b1016] dark:text-[#d7dbe0]"><div className="mx-auto max-w-[1280px] px-4 py-7 sm:px-8"><h1 className="mb-8 border-b border-[#cfcfcf] pb-5 text-2xl font-bold dark:border-[#303841]">情報入力</h1>
    <form onSubmit={submit} className="border border-[#d8d8d8] dark:border-[#303841]">
      <FormSection title="サイト利用情報入力"><div className="grid gap-x-6 gap-y-8 sm:grid-cols-2"><div className="sm:col-span-2 sm:max-w-[620px]">{checkedField("username", "ユーザーID")}</div><label className="font-semibold">パスワード<input className={`${inputClass} mt-2`} required minLength={8} type="password" name="password" /></label><label className="font-semibold">パスワード確認<input className={`${inputClass} mt-2`} required minLength={8} type="password" name="passwordConfirm" /></label></div></FormSection>
      <FormSection title="個人情報入力"><div className="grid gap-x-6 gap-y-8 sm:grid-cols-2"><label className="font-semibold">名<input className={`${inputClass} mt-2`} required name="firstName" /></label><label className="font-semibold">姓<input className={`${inputClass} mt-2`} required name="lastName" /></label><div className="sm:col-span-2 sm:max-w-[620px]">{checkedField("nickname", "ニックネーム")}</div><div className="sm:col-span-2 rounded border border-[#efb14d] bg-[#fff6e5] px-4 py-3 text-sm text-[#a33b00] dark:bg-[#2a2115]">Note: 空白なしで日本語、英語、数字のみ入力可能です。ニックネームを変更すると、今後60日以内は変更できません。</div><div className="sm:col-span-2 sm:max-w-[620px]">{checkedField("email", "メールアドレス", "email")}</div></div></FormSection>
      <FormSection title="その他個人設定"><div className="grid gap-5 sm:grid-cols-2"><label className="flex items-center gap-3"><input type="checkbox" name="marketingConsent" /> お知らせメールを受け取ります。</label><label className="flex items-center gap-3"><input type="checkbox" name="profilePublic" /> プロフィール公開を許可します。</label><label className="font-semibold sm:col-span-2 sm:max-w-[620px]">推薦コード（任意）<input className={`${inputClass} mt-2`} name="referralCode" /></label></div></FormSection>
      {error && <p className="mx-5 mb-4 text-sm text-red-600 sm:mx-7">{error}</p>}<div className="border-t border-[#d8d8d8] py-6 text-center dark:border-[#303841]"><button disabled={busy} className="min-w-36 bg-[#444b86] px-6 py-3 font-bold text-white disabled:opacity-50">{busy ? "登録中…" : "会員登録"}</button></div>
    </form></div></main>;
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-[#d8d8d8] first:border-t-0 dark:border-[#303841]">
      <h2 className="border-b border-[#d8d8d8] bg-[#fafafa] px-5 py-5 text-xl font-bold sm:px-7 dark:border-[#303841] dark:bg-[#121920]">
        {title}
      </h2>
      <div className="px-5 py-8 sm:px-7 sm:py-9">{children}</div>
    </section>
  );
}
