import Link from "next/link";
import { FaFacebookF, FaInstagram, FaPinterestP, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { uiLabels } from "@/data/ui-labels";

export default function Footer() {
  return <footer className="mt-0">
    <div className="footer-policy-row border-y border-[#b9bdc1] bg-white">
      <div className="max-w-frame mx-auto px-4 xl:px-0 h-[44px] flex items-center gap-4 text-xs text-[#222]">
        <Link href="#terms">{uiLabels.terms}</Link><Link href="#privacy">{uiLabels.privacy}</Link>
      </div>
    </div>
    <div className="footer-main bg-[#111] text-[#858585]">
      <div className="max-w-frame mx-auto px-4 xl:px-0 py-12 grid md:grid-cols-[1.05fr_1fr_1fr] gap-10">
        <section className="md:pr-10 md:border-r border-[#333]">
          <h2 className="text-white/80 font-bold text-lg mb-5">{uiLabels.brand}</h2>
          <div className="text-sm leading-7">
            <p>{uiLabels.brand} Co., Ltd. <span className="mx-2">|</span> Representative: Masahisa Nakatagawa</p>
            <p>Business registration number: Tokyo Metropolitan Public Safety Commission Permit No. 306609805590</p>
            <p>Mail order business: 226-88-02194</p>
            <p>Address: 5-12-6 Ueno, Taito-ku, Tokyo, Japan</p>
            <p>Headquarters: 11, 201, Donhwamun-ro 5-gil, Jongno-gu, Seoul, South Korea</p>
            <p>E-mail: <span className="text-white/80">wed1wed@naver.com</span></p>
          </div>
        </section>
        <section className="md:px-2 md:border-r border-[#333]">
          <h2 className="text-white/70 font-bold text-lg mb-5">{uiLabels.inquiry}</h2>
          <p className="text-sm leading-7">Counseling hours: Weekdays 9:00 AM – 10:00 PM</p>
          <p className="text-sm leading-7">Weekends 9:00 AM – 9:00 PM, open year-round</p>
          <p className="text-sm leading-7">Closing days: Open all year round</p>
        </section>
        <section className="flex items-start md:pl-1 pt-1">
          <div className="flex flex-wrap gap-2">
            {[
              [FaFacebookF,"#3b5998"],[FaXTwitter,"#38a1f3"],[FaYoutube,"#e62117"],[FaInstagram,"#3f729b"],[FaPinterestP,"#bd081c"]
            ].map(([Icon,color],i)=>{const SocialIcon=Icon as typeof FaFacebookF; return <Link key={i} href="#social" aria-label="Social network" className="w-8 h-8 flex items-center justify-center text-white rounded-sm" style={{backgroundColor:color as string}}><SocialIcon /></Link>})}
            <span className="w-8 h-8 flex items-center justify-center text-white font-bold rounded-sm bg-[#16b84e]">N</span>
          </div>
        </section>
      </div>
    </div>
    <div className="bg-[#202020] text-[#909090] text-center text-xs py-5">Copyright © <span className="text-white">{uiLabels.brand}</span>. All Rights Reserved.</div>
  </footer>;
}
