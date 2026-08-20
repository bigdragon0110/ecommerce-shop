"use client";

import { LockKeyhole, UserRound } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { uiLabels } from "@/data/ui-labels";

export default function LoginPopover() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => event.preventDefault();

  return <div ref={rootRef} className="relative min-w-9 sm:min-w-12">
    <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-haspopup="dialog" className="group flex w-full flex-col items-center gap-1 p-0 text-[#8d8f91] hover:text-white sm:p-1" aria-label="Open member login">
      <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-current"><UserRound size={20} strokeWidth={1.8}/></span>
      <span className={`hidden text-[10px] font-bold text-white sm:block ${open ? "border-b-2 border-white pb-1" : ""}`}>{uiLabels.login}</span>
    </button>

    {open && <div role="dialog" aria-label="Member login" className="absolute right-0 top-[calc(100%+18px)] z-[70] w-[min(375px,calc(100vw-16px))] border border-[#d7d7d7] bg-white text-[#333] shadow-sm dark:border-[#3b424a] dark:bg-[#151b22] dark:text-[#d3d5d7]">
      <div className="border-b border-[#dedede] px-6 py-5 dark:border-[#343b43]"><h2 className="text-xl font-bold">会員ログイン</h2></div>
      <form onSubmit={submit} className="px-6 py-5">
        <Link href="#recover" className="mb-3 block text-right text-sm hover:underline">ID/パスワードを探す</Link>
        <label className="mb-2 block font-bold">ユーザーID</label>
        <div className="mb-5 flex h-12 border border-[#d2d2d2] bg-white dark:border-[#414850] dark:bg-[#0e141a]">
          <input type="text" name="member-id" placeholder="ID" autoComplete="username" className="min-w-0 flex-1 bg-transparent px-4 text-base outline-none placeholder:text-[#999]"/>
          <span className="grid w-12 shrink-0 place-items-center border-l border-[#d2d2d2] text-[#3b4c5d] dark:border-[#414850] dark:text-[#b7bdc3]"><UserRound size={19} fill="currentColor"/></span>
        </div>
        <label className="mb-2 block font-bold">パスワード</label>
        <div className="mb-5 flex h-12 border border-[#d2d2d2] bg-white dark:border-[#414850] dark:bg-[#0e141a]">
          <input type="password" name="password" placeholder="Password" autoComplete="current-password" className="min-w-0 flex-1 bg-transparent px-4 text-base outline-none placeholder:text-[#999]"/>
          <span className="grid w-12 shrink-0 place-items-center border-l border-[#d2d2d2] text-[#3b4c5d] dark:border-[#414850] dark:text-[#b7bdc3]"><LockKeyhole size={19} fill="currentColor"/></span>
        </div>
        <label className="mb-5 flex cursor-pointer items-center gap-3"><input type="checkbox" name="remember" className="h-5 w-5 accent-[#2c3742]"/><span>自動ログイン</span></label>
        <button type="submit" className="h-12 w-full rounded-[9px] border border-[#333] font-medium hover:bg-[#f5f5f5] dark:border-[#737b83] dark:hover:bg-white/5">ログイン</button>
      </form>
      <div className="bg-[#f4f4f4] px-6 py-5 dark:bg-[#20272e]">
        <p className="mb-4 text-xs text-[#999]">会員登録するとさらに多くの特典が受けられます。</p>
        <Link href="#register" onClick={() => setOpen(false)} className="grid h-12 place-items-center rounded-[7px] bg-[#2d3741] font-bold text-white hover:bg-[#202831]">会員登録</Link>
      </div>
    </div>}
  </div>;
}
