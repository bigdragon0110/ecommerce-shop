export const uiLabels = {
  brand: "たこ焼き",
  memberRegistration: "会員登録",
  additionalMenu: "追加メニュー",
  login: "ログイン",
  favourite: "お気に入り",
  cart: "買い物かご",
  searchPlaceholder: "キーワード検索",
  terms: "サービス利用規約",
  privacy: "プライバシーポリシー",
  inquiry: "サイト利用お問い合わせ",
} as const;

export const sectionLabels: Record<string, { primary: string; secondary: string }> = {
  "hit products": { primary: "ヒット", secondary: "商品" },
  "recommended products": { primary: "おすすめ", secondary: "商品" },
  "new products": { primary: "新", secondary: "商品" },
  "popular products": { primary: "人気", secondary: "商品" },
  "discounted products": { primary: "割引", secondary: "商品" },
};

export const badgeLabels = {
  HIT: "ヒット",
  POPULAR: "人気",
  RECOMMENDED: "推薦",
  NEW: "最新",
  SALE: "割引",
} as const;
