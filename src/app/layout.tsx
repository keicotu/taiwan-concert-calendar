import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '台灣音樂會日曆 | OPENTIX・牛耳・寬宏・鴻觀 跨平台音樂會整合',
  description: '一站整合兩廳院 OPENTIX、MNA 牛耳藝術、寬宏藝術與鴻觀藝術古典音樂會資訊，支援月曆視圖、月份列表、一鍵加入行事曆與官方購票。',
  openGraph: {
    title: '台灣音樂會日曆 | 跨平台古典音樂會整合',
    description: '一站掌握全台頂尖交響樂、獨奏會、室內樂排程與開賣時間',
    type: 'website',
    locale: 'zh_TW',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="bg-slate-900 text-slate-100 antialiased selection:bg-amber-500/30 selection:text-amber-200 min-h-screen">
        {children}
      </body>
    </html>
  );
}
