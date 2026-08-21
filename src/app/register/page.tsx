"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const policyBox = "border border-[#d8d8d8] bg-white dark:border-[#303841] dark:bg-[#11171e]";

export default function RegisterAgreementPage() {
  const router = useRouter();
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const allAccepted = terms && privacy;
  const continueRegistration = () => {
    if (!allAccepted) return;
    sessionStorage.setItem("registration-consent", JSON.stringify({ acceptedTerms: true, acceptedPrivacy: true, acceptedAt: new Date().toISOString() }));
    router.push("/register/details");
  };
  return <main className="bg-white text-[#20252b] md:pt-[50px] dark:bg-[#0b1016] dark:text-[#d7dbe0]"><div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-8">
    <h1 className="mb-7 border-b border-[#cfcfcf] pb-5 text-2xl font-bold dark:border-[#303841]">利用規約の同意</h1>
    <Policy title="サービス利用規約" checked={terms} onChange={setTerms} label="会員登録規約の内容に同意します。">
      <p className="mb-4">本規約は、当ショップが提供するオンラインショッピングサービスの利用条件を定めるものです。</p>
      <h3 className="font-bold">第1条（適用）</h3><p className="mb-4">利用者は、本規約に同意したうえで会員登録を行い、登録情報を正確かつ最新の状態に保つものとします。</p>
      <h3 className="font-bold">第2条（アカウント管理）</h3><p className="mb-4">ユーザーIDおよびパスワードは利用者自身の責任で管理してください。第三者による不正利用が判明した場合は速やかにご連絡ください。</p>
      <h3 className="font-bold">第3条（注文・支払い）</h3><p className="mb-4">注文は当ショップが承諾した時点で成立します。表示価格、配送条件、キャンセルおよび返品条件は各案内に従います。</p>
      <h3 className="font-bold">第4条（利用停止）</h3><p>不正アクセス、虚偽登録、サービス運営を妨げる行為があった場合、利用を停止できるものとします。</p>
    </Policy>
    <Policy title="個人情報取扱方針" checked={privacy} onChange={setPrivacy} label="個人情報取扱方針の内容に同意します。">
      <p className="mb-4">当ショップは、お客様の個人情報を重要なものと認識し、適切な安全管理措置を講じます。</p>
      <h3 className="font-bold">収集する情報</h3><p className="mb-4">氏名、ユーザーID、メールアドレス、配送先、購入履歴、接続情報、お問い合わせ内容などを収集します。</p>
      <h3 className="font-bold">利用目的</h3><p className="mb-4">本人確認、注文処理、配送、決済、サポート、サービス改善、不正利用防止、および同意を得たご案内の配信に利用します。</p>
      <h3 className="font-bold">第三者提供</h3><p>法令に基づく場合またはサービス提供に必要な委託先を除き、本人の同意なく第三者へ提供しません。</p>
    </Policy>
    <label className={`${policyBox} flex cursor-pointer items-center justify-center gap-3 px-5 py-5`}><input className="h-4 w-4 accent-[#444b86]" type="checkbox" checked={allAccepted} onChange={(e) => { setTerms(e.target.checked); setPrivacy(e.target.checked); }} />すべての規約に同意します。</label>
    <div className="mt-7 text-center"><button type="button" onClick={continueRegistration} disabled={!allAccepted} className="min-w-36 bg-[#444b86] px-6 py-3 font-bold text-white transition hover:bg-[#353b70] disabled:cursor-not-allowed disabled:opacity-40">会員登録へ進む</button></div>
  </div></main>;
}

function Policy({ title, checked, onChange, label, children }: { title: string; checked: boolean; onChange(value: boolean): void; label: string; children: React.ReactNode }) {
  return <section className={`${policyBox} mb-7`}><h2 className="border-b border-[#d8d8d8] bg-[#fafafa] px-5 py-4 text-xl font-bold dark:border-[#303841] dark:bg-[#151c24]">{title}</h2><div className="max-h-[290px] overflow-y-auto px-5 py-4 text-[15px] leading-7">{children}</div><label className="flex cursor-pointer items-center justify-end gap-3 border-t border-[#d8d8d8] px-5 py-4 dark:border-[#303841]"><input className="h-4 w-4 accent-[#444b86]" type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />{label}</label></section>;
}
