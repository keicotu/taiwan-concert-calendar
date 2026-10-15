export interface ConcertDate {
  datetime: string; // ISO-8601
  venue: string;
  city: '台北' | '台中' | '高雄' | '台南' | '新竹';
  status: 'on_sale' | 'sold_out' | 'coming_soon';
}

export interface Concert {
  id: string;
  title: string;
  organizer: 'MNA 牛耳藝術' | '兩廳院 OPENTIX' | '寬宏藝術' | '鴻觀/鴻宇藝術';
  source: 'mna' | 'opentix' | 'kham' | 'grandview';
  performers: string[];
  category: '交響樂' | '鋼琴獨奏' | '室內樂' | '聲樂/歌劇' | '跨界合奏';
  dates: ConcertDate[];
  posterUrl: string;
  ticketUrl: string;
  priceRange: string;
  aiSummary: string;
  description: string;
}

export const mockConcerts: Concert[] = [
  {
    id: 'mna-2026-vienna-phil',
    title: '維也納愛樂樂團 2026 台北音樂會',
    organizer: 'MNA 牛耳藝術',
    source: 'mna',
    performers: ['維也納愛樂樂團 (Vienna Philharmonic)', '指揮：克里斯提安·提勒曼 (Christian Thielemann)'],
    category: '交響樂',
    dates: [
      {
        datetime: '2026-10-24T19:30:00+08:00',
        venue: '國家音樂廳',
        city: '台北',
        status: 'on_sale',
      },
      {
        datetime: '2026-10-25T19:30:00+08:00',
        venue: '國家音樂廳',
        city: '台北',
        status: 'sold_out',
      },
    ],
    posterUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
    ticketUrl: 'https://www.opentix.life/',
    priceRange: 'NT$ 1,800 - 8,800',
    aiSummary: '⭐️ 世界三大交響樂團之一睽違登台，重量級詮釋布魯克納第八號交響曲。',
    description: '維也納愛樂巡迴亞洲台北站，由德奧權威提勒曼親自執棒，帶來氣勢磅礡的布魯克納史詩巨作。',
  },
  {
    id: 'opentix-2026-nso-beethoven',
    title: 'NSO 開季名家系列《英雄的迴響》貝多芬第三號交響曲',
    organizer: '兩廳院 OPENTIX',
    source: 'opentix',
    performers: ['NSO 國家交響樂團', '指揮：準·馬寇爾 (Jun Märkl)', '小提琴：黃俊文'],
    category: '交響樂',
    dates: [
      {
        datetime: '2026-10-31T19:30:00+08:00',
        venue: '國家音樂廳',
        city: '台北',
        status: 'on_sale',
      },
      {
        datetime: '2026-11-01T14:30:00+08:00',
        venue: '衛武營國家藝術文化中心音樂廳',
        city: '高雄',
        status: 'on_sale',
      },
    ],
    posterUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80',
    ticketUrl: 'https://www.opentix.life/',
    priceRange: 'NT$ 500 - 2,500',
    aiSummary: '🎻 旅美知名小提琴家黃俊文攜手 NSO，演繹孟德爾頌小提琴協奏曲。',
    description: '音樂總監準·馬寇爾開季磅礡鉅獻，黃俊文細膩深情的炫技琴音，搭配貝多芬英雄交響曲。',
  },
  {
    id: 'mna-2026-zimerman-recital',
    title: '克里斯提安·齊瑪曼 鋼琴獨奏會 (Krystian Zimerman)',
    organizer: 'MNA 牛耳藝術',
    source: 'mna',
    performers: ['鋼琴：克里斯提安·齊瑪曼 (Krystian Zimerman)'],
    category: '鋼琴獨奏',
    dates: [
      {
        datetime: '2026-11-12T19:30:00+08:00',
        venue: '國家音樂廳',
        city: '台北',
        status: 'on_sale',
      },
      {
        datetime: '2026-11-14T19:30:00+08:00',
        venue: '臺中國家歌劇院大劇院',
        city: '台中',
        status: 'coming_soon',
      },
    ],
    posterUrl: 'https://images.unsplash.com/photo-1520523839898-507125cd53c1?auto=format&fit=crop&w=800&q=80',
    ticketUrl: 'https://www.mna.com.tw/',
    priceRange: 'NT$ 1,500 - 5,200',
    aiSummary: '🎹 當代蕭邦鋼琴大賽最具傳奇傳人，自備專屬鋼琴鍵盤抵台巡迴。',
    description: '傳奇鋼琴詩人齊瑪曼帶來全場蕭邦夜曲、敘事曲與舒伯特晚期奏鳴曲，琴音極致晶瑩剔透。',
  },
  {
    id: 'kham-2026-joe-hisaishi',
    title: '久石讓與新日本愛樂交響音樂會',
    organizer: '寬宏藝術',
    source: 'kham',
    performers: ['久石讓 (Joe Hisaishi)', '新日本愛樂世界之夢交響樂團'],
    category: '跨界合奏',
    dates: [
      {
        datetime: '2026-11-20T19:30:00+08:00',
        venue: '台北流行音樂中心表演廳',
        city: '台北',
        status: 'sold_out',
      },
      {
        datetime: '2026-11-21T19:30:00+08:00',
        venue: '台北流行音樂中心表演廳',
        city: '台北',
        status: 'on_sale',
      },
    ],
    posterUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
    ticketUrl: 'https://kham.com.tw/',
    priceRange: 'NT$ 1,200 - 4,800',
    aiSummary: '🎬 宮崎駿經典動畫《龍貓》、《天空之城》、《魔法公主》管弦交響現場重現。',
    description: '殿堂級配樂大師久石讓親臨指揮，重新編排震撼人心的交響組曲與原創極簡交響作品。',
  },
  {
    id: 'grandview-2026-chopin-trio',
    title: '鴻觀室內樂名家系列：巴黎三重奏之夜',
    organizer: '鴻觀/鴻宇藝術',
    source: 'grandview',
    performers: ['巴黎三重奏 (Trio de Paris)'],
    category: '室內樂',
    dates: [
      {
        datetime: '2026-11-28T19:30:00+08:00',
        venue: '松菸誠品表演廳',
        city: '台北',
        status: 'on_sale',
      },
    ],
    posterUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=800&q=80',
    ticketUrl: 'https://www.opentix.life/',
    priceRange: 'NT$ 800 - 1,800',
    aiSummary: '🇫🇷 法國當代頂尖室內樂組合，演繹拉威爾與佛瑞極致法式浪漫。',
    description: '細緻優雅的巴黎沙龍聲響，帶領聽眾穿梭印象派色彩斑斕的聲響世界。',
  },
  {
    id: 'opentix-2026-tso-mahler',
    title: 'TSO 大師系列《復活》馬勒第二號交響曲',
    organizer: '兩廳院 OPENTIX',
    source: 'opentix',
    performers: ['TSO 台北市立交響樂團', '指揮：殷巴爾 (Eliahu Inbal)', '台北愛樂合唱團'],
    category: '交響樂',
    dates: [
      {
        datetime: '2026-12-05T19:30:00+08:00',
        venue: '國家音樂廳',
        city: '台北',
        status: 'on_sale',
      },
    ],
    posterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    ticketUrl: 'https://www.opentix.life/',
    priceRange: 'NT$ 300 - 2,000',
    aiSummary: '✨ 馬勒權威指揮殷巴爾百人合唱巨編，撼動靈魂的終曲大合唱。',
    description: '歲末磅礡鉅獻，動員雙女高音、管風琴與近兩百人合唱團，編織自黑暗邁向永恆光明的音樂旅程。',
  },
  {
    id: 'mna-2026-yo-yo-ma',
    title: '馬友友與絲路合奏團 2026 跨界世界巡迴',
    organizer: 'MNA 牛耳藝術',
    source: 'mna',
    performers: ['大提琴：馬友友 (Yo-Yo Ma)', '絲路合奏團 (Silkroad Ensemble)'],
    category: '跨界合奏',
    dates: [
      {
        datetime: '2026-12-18T19:30:00+08:00',
        venue: '國家音樂廳',
        city: '台北',
        status: 'coming_soon',
      },
      {
        datetime: '2026-12-19T19:30:00+08:00',
        venue: '臺中國家歌劇院大劇院',
        city: '台中',
        status: 'coming_soon',
      },
      {
        datetime: '2026-12-20T19:30:00+08:00',
        venue: '衛武營國家藝術文化中心音樂廳',
        city: '高雄',
        status: 'coming_soon',
      },
    ],
    posterUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80',
    ticketUrl: 'https://www.mna.com.tw/',
    priceRange: 'NT$ 1,600 - 6,000',
    aiSummary: '🌍 格萊美常勝軍，橫跨歐亞美洲傳統樂器與大提琴的無界對話。',
    description: '馬友友創辦絲路計畫二十餘年經典再現，融合中東、亞洲與西方古典的獨特律動。',
  },
  {
    id: 'kham-2026-andrea-bocelli',
    title: '安德烈·波伽利 2026 台北大巨蛋跨年特別場',
    organizer: '寬宏藝術',
    source: 'kham',
    performers: ['安德烈·波伽利 (Andrea Bocelli)', '長榮交響樂團'],
    category: '聲樂/歌劇',
    dates: [
      {
        datetime: '2026-12-31T20:00:00+08:00',
        venue: '台北大巨蛋',
        city: '台北',
        status: 'on_sale',
      },
    ],
    posterUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
    ticketUrl: 'https://kham.com.tw/',
    priceRange: 'NT$ 2,000 - 12,800',
    aiSummary: '🎤 全球最受推崇義大利美聲天王，跨年夜降臨台北大巨蛋溫暖獻唱。',
    description: '經典名曲《Time to Say Goodbye》、《Besame Mucho》大巨蛋萬人齊聲倒數。',
  },
  {
    id: 'grandview-2027-seong-jin-cho',
    title: '趙成珍 鋼琴獨奏會 (Seong-Jin Cho)',
    organizer: '鴻觀/鴻宇藝術',
    source: 'grandview',
    performers: ['鋼琴：趙成珍 (Seong-Jin Cho)'],
    category: '鋼琴獨奏',
    dates: [
      {
        datetime: '2027-01-09T19:30:00+08:00',
        venue: '國家音樂廳',
        city: '台北',
        status: 'coming_soon',
      },
    ],
    posterUrl: 'https://images.unsplash.com/photo-1520523839898-507125cd53c1?auto=format&fit=crop&w=800&q=80',
    ticketUrl: 'https://www.opentix.life/',
    priceRange: 'NT$ 1,200 - 4,200',
    aiSummary: '🎹 蕭邦大賽金牌得主，演繹拉威爾《夜之加斯巴》與李斯特奏鳴曲。',
    description: '新生代鋼琴巨星趙成珍再次登台，以精湛絕倫的技巧挑戰鋼琴極限曲目。',
  },
];
