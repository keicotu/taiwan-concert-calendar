'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  List as ListIcon,
  Search,
  Share2,
  ExternalLink,
  MapPin,
  Clock,
  Sparkles,
  Check,
  ChevronLeft,
  ChevronRight,
  Music,
  CalendarPlus,
  X,
  Ticket,
} from 'lucide-react';
import { mockConcerts, Concert, ConcertDate } from '../data/mockConcerts';

export default function ConcertCalendarPage() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrganizer, setSelectedOrganizer] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalConcert, setActiveModalConcert] = useState<Concert | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Month navigation for Calendar View (default to 2026-11)
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date(2026, 10, 1)); // November 2026

  // Filtered concerts
  const filteredConcerts = useMemo(() => {
    return mockConcerts.filter((c) => {
      // Organizer
      if (selectedOrganizer !== 'all' && c.source !== selectedOrganizer) return false;
      // Category
      if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
      // City
      if (selectedCity !== 'all' && !c.dates.some((d) => d.city === selectedCity)) return false;
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = c.title.toLowerCase().includes(q);
        const matchPerformer = c.performers.some((p) => p.toLowerCase().includes(q));
        const matchVenue = c.dates.some((d) => d.venue.toLowerCase().includes(q));
        if (!matchTitle && !matchPerformer && !matchVenue) return false;
      }
      return true;
    });
  }, [selectedOrganizer, selectedCategory, selectedCity, searchQuery]);

  // Group concerts by Year-Month for List View
  const concertsByMonth = useMemo(() => {
    const map = new Map<string, { label: string; concerts: Concert[] }>();

    // Sort concerts by earliest date
    const sorted = [...filteredConcerts].sort((a, b) => {
      const dateA = new Date(a.dates[0]?.datetime || 0).getTime();
      const dateB = new Date(b.dates[0]?.datetime || 0).getTime();
      return dateA - dateB;
    });

    sorted.forEach((c) => {
      c.dates.forEach((d) => {
        const dt = new Date(d.datetime);
        const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
        const label = `${dt.getFullYear()} 年 ${dt.getMonth() + 1} 月`;

        if (!map.has(key)) {
          map.set(key, { label, concerts: [] });
        }
        const bucket = map.get(key)!;
        if (!bucket.concerts.some((existing) => existing.id === c.id)) {
          bucket.concerts.push(c);
        }
      });
    });

    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredConcerts]);

  // Share handler
  const handleShare = async (concert: Concert, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const url = typeof window !== 'undefined' ? `${window.location.origin}/?id=${concert.id}` : '';
    const shareData = {
      title: concert.title,
      text: `【音樂會推薦】${concert.title}\n演出：${concert.performers.join('、')}\n主辦：${concert.organizer}`,
      url,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(url || window.location.href);
      setCopiedId(concert.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  // Add to Google Calendar
  const addToGoogleCalendar = (concert: Concert, date: ConcertDate, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const start = new Date(date.datetime);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours

    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const datesStr = `${fmt(start)}/${fmt(end)}`;

    const details = `演出陣容：${concert.performers.join(', ')}\n主辦單位：${concert.organizer}\n官方購票：${concert.ticketUrl}\n\n資訊來源：台灣音樂會日曆`;
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      concert.title
    )}&dates=${datesStr}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(
      date.venue
    )}`;

    window.open(gcalUrl, '_blank');
  };

  // Helper for organizer badge styling
  const getOrganizerBadge = (source: Concert['source']) => {
    switch (source) {
      case 'mna':
        return { label: 'MNA 牛耳藝術', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'opentix':
        return { label: '兩廳院 OPENTIX', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      case 'kham':
        return { label: '寬宏藝術', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'grandview':
        return { label: '鴻觀/鴻宇藝術', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      default:
        return { label: '其他主辦', color: 'bg-slate-700 text-slate-300 border-slate-600' };
    }
  };

  // Status badge styling
  const getStatusBadge = (status: ConcertDate['status']) => {
    switch (status) {
      case 'on_sale':
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">熱烈售票中</span>;
      case 'sold_out':
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-rose-900/60 text-rose-300 border border-rose-700/50">已售罄</span>;
      case 'coming_soon':
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-900/60 text-amber-300 border border-amber-700/50">即將啟售</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-slate-950/80 border-b border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-200 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-200 via-amber-100 to-white bg-clip-text text-transparent">
                台灣音樂會日曆
              </h1>
              <p className="text-xs text-slate-400">
                兩廳院 OPENTIX・MNA 牛耳・寬宏・鴻觀 跨平台整合
              </p>
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListIcon className="w-4 h-4" />
              月份列表
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'calendar'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              月曆視圖
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filter and Search Bar */}
        <section className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50 mb-8 backdrop-blur-sm space-y-4">
          {/* Top row: Search input */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜尋音樂會名稱、演奏家（如 齊瑪曼、黃俊文、馬友友）、或演出場館..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Bottom row: Filter chips */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
            {/* Organizer chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400 text-xs font-semibold mr-1">主辦：</span>
              {[
                { id: 'all', label: '全部主辦' },
                { id: 'opentix', label: 'OPENTIX' },
                { id: 'mna', label: 'MNA 牛耳' },
                { id: 'kham', label: '寬宏藝術' },
                { id: 'grandview', label: '鴻觀藝術' },
              ].map((org) => (
                <button
                  key={org.id}
                  onClick={() => setSelectedOrganizer(org.id)}
                  className={`px-3 py-1 rounded-lg border transition-all ${
                    selectedOrganizer === org.id
                      ? 'bg-amber-500 text-slate-950 font-semibold border-amber-400'
                      : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {org.label}
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-slate-700 hidden sm:block" />

            {/* City chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400 text-xs font-semibold mr-1">城市：</span>
              {['all', '台北', '台中', '高雄'].map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-2.5 py-1 rounded-lg border transition-all ${
                    selectedCity === city
                      ? 'bg-blue-500 text-white font-semibold border-blue-400'
                      : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {city === 'all' ? '全部城市' : city}
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-slate-700 hidden sm:block" />

            {/* Category chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400 text-xs font-semibold mr-1">類別：</span>
              {['all', '交響樂', '鋼琴獨奏', '室內樂', '跨界合奏'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg border transition-all ${
                    selectedCategory === cat
                      ? 'bg-purple-500 text-white font-semibold border-purple-400'
                      : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {cat === 'all' ? '全部類型' : cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Search Results Summary */}
        <div className="flex items-center justify-between mb-4 text-xs text-slate-400">
          <span>共找到 <strong className="text-amber-400 font-semibold">{filteredConcerts.length}</strong> 檔音樂會演出</span>
          {(selectedOrganizer !== 'all' || selectedCity !== 'all' || selectedCategory !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedOrganizer('all');
                setSelectedCity('all');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-amber-400 hover:underline"
            >
              清除所有篩選
            </button>
          )}
        </div>

        {/* VIEW 1: MONTHLY GROUPED LIST VIEW */}
        {viewMode === 'list' && (
          <div className="space-y-10">
            {concertsByMonth.length === 0 ? (
              <div className="py-20 text-center text-slate-500">
                <Music className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>沒有符合條件的音樂會，請嘗試更換篩選條件或關鍵字。</p>
              </div>
            ) : (
              concertsByMonth.map(([key, { label, concerts }]) => (
                <section key={key} className="space-y-4">
                  {/* Sticky Month Header */}
                  <div className="sticky top-[73px] z-20 backdrop-blur-md bg-slate-950/90 py-2.5 px-4 rounded-xl border border-slate-800 flex items-center justify-between shadow-sm">
                    <h2 className="text-lg font-bold text-amber-200 flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-amber-400" />
                      {label}
                    </h2>
                    <span className="text-xs text-slate-400">
                      共 {concerts.length} 場演出
                    </span>
                  </div>

                  {/* Concert Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {concerts.map((concert) => {
                      const orgBadge = getOrganizerBadge(concert.source);
                      return (
                        <div
                          key={concert.id}
                          onClick={() => setActiveModalConcert(concert)}
                          className="group relative bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/60 hover:border-amber-500/50 rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-md hover:shadow-amber-500/5"
                        >
                          <div>
                            {/* Card Header: Organizer + Category */}
                            <div className="flex items-center justify-between gap-2 mb-2.5">
                              <span
                                className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${orgBadge.color}`}
                              >
                                {orgBadge.label}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-700/50 text-slate-300">
                                {concert.category}
                              </span>
                            </div>

                            {/* Concert Title */}
                            <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-amber-200 transition-colors line-clamp-2 mb-1.5">
                              {concert.title}
                            </h3>

                            {/* Performers */}
                            <p className="text-xs sm:text-sm text-slate-300 mb-3 line-clamp-1">
                              {concert.performers.join('・')}
                            </p>

                            {/* AI Highlight Banner */}
                            {concert.aiSummary && (
                              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-amber-200/90 mb-4 flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <span>{concert.aiSummary}</span>
                              </div>
                            )}

                            {/* Show Dates List */}
                            <div className="space-y-1.5 mb-4">
                              {concert.dates.map((d, idx) => {
                                const dt = new Date(d.datetime);
                                const dateFormatted = `${dt.getMonth() + 1}/${dt.getDate()} (${['日', '一', '二', '三', '四', '五', '六'][dt.getDay()]}) ${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`;
                                return (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between text-xs text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                                      <span className="font-semibold text-slate-200">{dateFormatted}</span>
                                      <span className="text-slate-400">|</span>
                                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                      <span className="text-slate-300">{d.city} {d.venue}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {getStatusBadge(d.status)}
                                      <button
                                        title="加到 Google 行事曆"
                                        onClick={(e) => addToGoogleCalendar(concert, d, e)}
                                        className="text-slate-400 hover:text-amber-300 p-1 transition-colors"
                                      >
                                        <CalendarPlus className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Card Footer: Ticket & Action buttons */}
                          <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between gap-3">
                            <span className="text-xs text-slate-400 font-mono">
                              {concert.priceRange}
                            </span>

                            <div className="flex items-center gap-2">
                              {/* Share button */}
                              <button
                                onClick={(e) => handleShare(concert, e)}
                                title="分享此音樂會"
                                className="p-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1 text-xs"
                              >
                                {copiedId === concert.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-emerald-400 text-xs">已複製</span>
                                  </>
                                ) : (
                                  <>
                                    <Share2 className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">分享</span>
                                  </>
                                )}
                              </button>

                              {/* Official Ticket Link Button */}
                              <a
                                href={concert.ticketUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm shadow-amber-500/20"
                              >
                                <Ticket className="w-3.5 h-3.5" />
                                前往官方購票
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))
            )}
          </div>
        )}

        {/* VIEW 2: INTERACTIVE CALENDAR VIEW */}
        {viewMode === 'calendar' && (
          <div className="space-y-6">
            {/* Calendar Controls */}
            <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const prev = new Date(currentCalendarDate);
                    prev.setMonth(prev.getMonth() - 1);
                    setCurrentCalendarDate(prev);
                  }}
                  className="p-2 rounded-xl bg-slate-700/70 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg sm:text-xl font-bold text-amber-200">
                  {currentCalendarDate.getFullYear()} 年 {currentCalendarDate.getMonth() + 1} 月
                </h2>
                <button
                  onClick={() => {
                    const next = new Date(currentCalendarDate);
                    next.setMonth(next.getMonth() + 1);
                    setCurrentCalendarDate(next);
                  }}
                  className="p-2 rounded-xl bg-slate-700/70 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                  <span className="text-slate-300">OPENTIX</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-slate-300">MNA 牛耳</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-slate-300">寬宏</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                  <span className="text-slate-300">鴻觀</span>
                </div>
              </div>
            </div>

            {/* Calendar Grid (Sunday - Saturday) */}
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700/60 overflow-hidden">
              {/* Day headers */}
              <div className="grid grid-cols-7 border-b border-slate-700 text-center py-2.5 text-xs font-semibold text-slate-400 bg-slate-900/60">
                <span className="text-rose-400">週日</span>
                <span>週一</span>
                <span>週二</span>
                <span>週三</span>
                <span>週四</span>
                <span>週五</span>
                <span className="text-blue-400">週六</span>
              </div>

              {/* Month Days */}
              {(() => {
                const year = currentCalendarDate.getFullYear();
                const month = currentCalendarDate.getMonth();
                const firstDay = new Date(year, month, 1).getDay();
                const totalDays = new Date(year, month + 1, 0).getDate();

                const cells = [];
                for (let i = 0; i < firstDay; i++) {
                  cells.push(<div key={`empty-${i}`} className="min-h-[110px] bg-slate-950/30 border-r border-b border-slate-800/60 p-2 opacity-30" />);
                }

                for (let day = 1; day <= totalDays; day++) {
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                  // Find concerts matching this day
                  const dayConcerts = filteredConcerts.filter((c) =>
                    c.dates.some((d) => d.datetime.startsWith(dateStr))
                  );

                  cells.push(
                    <div
                      key={`day-${day}`}
                      className="min-h-[110px] bg-slate-900/40 border-r border-b border-slate-800/60 p-2 hover:bg-slate-800/50 transition-colors flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-300">{day}</span>
                        {dayConcerts.length > 0 && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                            {dayConcerts.length} 場
                          </span>
                        )}
                      </div>

                      {/* Mini Concert Badges */}
                      <div className="space-y-1">
                        {dayConcerts.map((c) => {
                          const dotColor =
                            c.source === 'mna'
                              ? 'bg-amber-400'
                              : c.source === 'opentix'
                              ? 'bg-blue-400'
                              : c.source === 'kham'
                              ? 'bg-emerald-400'
                              : 'bg-purple-400';

                          return (
                            <div
                              key={c.id}
                              onClick={() => setActiveModalConcert(c)}
                              title={`${c.title} (${c.organizer})`}
                              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-1.5 py-1 rounded border border-slate-700 flex items-center gap-1.5 truncate cursor-pointer transition-colors"
                            >
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
                              <span className="truncate">{c.title}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                return <div className="grid grid-cols-7">{cells}</div>;
              })()}
            </div>
          </div>
        )}
      </main>

      {/* DETAIL MODAL (DRAWER / POPUP) */}
      {activeModalConcert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative space-y-6 text-slate-100"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalConcert(null)}
              className="absolute right-4 top-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-xs px-3 py-1 rounded-full border font-medium ${
                    getOrganizerBadge(activeModalConcert.source).color
                  }`}
                >
                  {getOrganizerBadge(activeModalConcert.source).label}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300">
                  {activeModalConcert.category}
                </span>
              </div>
              <h3 className="text-xl font-bold text-amber-200">
                {activeModalConcert.title}
              </h3>
              <p className="text-sm text-slate-300 mt-1">
                {activeModalConcert.performers.join('・')}
              </p>
            </div>

            {/* AI Summary Highlight */}
            {activeModalConcert.aiSummary && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 text-sm text-amber-200 flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p>{activeModalConcert.aiSummary}</p>
              </div>
            )}

            {/* Description */}
            <div className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                節目介紹
              </h4>
              <p>{activeModalConcert.description}</p>
            </div>

            {/* Dates & Venues */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                所有巡迴場次與時間
              </h4>
              <div className="space-y-2">
                {activeModalConcert.dates.map((d, idx) => {
                  const dt = new Date(d.datetime);
                  const dateFormatted = `${dt.getFullYear()}/${dt.getMonth() + 1}/${dt.getDate()} (${['日', '一', '二', '三', '四', '五', '六'][dt.getDay()]}) ${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`;
                  return (
                    <div
                      key={idx}
                      className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                          <span>{dateFormatted}</span>
                          {getStatusBadge(d.status)}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{d.city} {d.venue}</span>
                        </div>
                      </div>

                      {/* Add to Calendar button */}
                      <button
                        onClick={(e) => addToGoogleCalendar(activeModalConcert, d, e)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs text-slate-200 flex items-center gap-1.5 transition-colors"
                      >
                        <CalendarPlus className="w-3.5 h-3.5 text-amber-400" />
                        加到行事曆
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={(e) => handleShare(activeModalConcert, e)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm flex items-center gap-2 transition-all border border-slate-700"
              >
                {copiedId === activeModalConcert.id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">已複製分享連結</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>分享節目資訊</span>
                  </>
                )}
              </button>

              <a
                href={activeModalConcert.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20"
              >
                <Ticket className="w-4 h-4" />
                前往官方售票系統購票 ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
