export type SectionPromoSlide = {
  image: string;
  label: string;
  copy: string;
};

export type SectionPromo = {
  slides: readonly SectionPromoSlide[];
  dark?: boolean;
};

export const sectionPromos = {
  goldCollection: {
    slides: [
      { image: "/images/sections/gold-collection-01.jpg", label: "ボリューム感が際立つ", copy: "純金ネックレスコレクション" },
      { image: "/images/sections/gold-collection-02.jpg", label: "HEARTゴールドバー", copy: "愛の心を込めて伝える特別な瞬間" },
    ],
  },
  featuredRecommended: {
    slides: [
      { image: "/images/sections/featured-recommend-01.jpg", label: "VOLUME HEART TIE BANGLE", copy: "最大30%OFF — シンプルで堅牢、黄金の輝き。" },
      { image: "/images/sections/featured-recommend-02.jpg", label: "VOLUME HEART TIE BANGLE", copy: "最大20%OFF — 日常を格上げする、洗練のカジュアルジュエリー。" },
    ],
  },
  hit: { slides: [{ image: "/images/sections/hit-items.jpg", label: "HIT ITEMS", copy: "話題のヒット商品を今すぐチェック。" }] },
  recommended: { slides: [{ image: "/images/sections/recommend-items.jpg", label: "RECOMMEND ITEMS", copy: "MDがおすすめする商品をご覧ください。" }] },
  newProducts: { slides: [{ image: "/images/sections/new-items.jpg", label: "NEW ITEMS", copy: "さらにアップグレードされた最新商品をご覧ください。" }] },
  popular: { slides: [{ image: "/images/sections/popular-items.jpg", label: "POPULAR ITEMS", copy: "トレンドの人気商品をご覧ください。" }], dark: true },
  sale: { slides: [{ image: "/images/sections/sale-items.jpg", label: "SALE ITEMS", copy: "特別な商品をセール価格でお楽しみください。" }] },
} as const satisfies Record<string, SectionPromo>;
