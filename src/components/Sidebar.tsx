import { useState } from "react";
import { getLatestNews, getMostReadNews, poll } from "@/data/news";
import { NewsCard } from "./NewsCard";
import { Button } from "@/components/ui/button";

export const Sidebar = () => {
  const [activeTab, setActiveTab] = useState<"latest" | "popular">("latest");
  const latestNews = getLatestNews(5);
  const popularNews = getMostReadNews(5);

  return (
    <aside className="space-y-6">
      {/* Latest/Popular Toggle */}
      <div className="bg-card rounded p-4 border border-border">
        <div className="flex border-b border-border mb-4">
          <button
            onClick={() => setActiveTab("latest")}
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "latest" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
            }`}
          >
            সর্বশেষ
          </button>
          <button
            onClick={() => setActiveTab("popular")}
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "popular" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
            }`}
          >
            সর্বাধিক পঠিত
          </button>
        </div>
        <div className="space-y-1">
          {(activeTab === "latest" ? latestNews : popularNews).map((news) => (
            <NewsCard key={news.id} news={news} variant="horizontal" />
          ))}
        </div>
      </div>

      {/* Poll Widget */}
      <div className="bg-card rounded p-4 border border-border">
        <h3 className="font-serif font-bold mb-4 pb-2 border-b border-border">আপনার মতামত</h3>
        <p className="text-sm mb-4">{poll.question}</p>
        <div className="space-y-2">
          {poll.options.map((option) => {
            const percentage = Math.round((option.votes / poll.totalVotes) * 100);
            return (
              <div key={option.id} className="relative">
                <div
                  className="absolute inset-0 bg-primary/10 rounded"
                  style={{ width: `${percentage}%` }}
                />
                <div className="relative flex justify-between items-center p-2 text-sm">
                  <span>{option.text}</span>
                  <span className="font-medium">{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-3">মোট ভোট: {poll.totalVotes.toLocaleString("bn-BD")}</p>
      </div>

      {/* Ad Block */}
      <div className="bg-muted rounded p-8 border border-border text-center">
        <span className="text-xs text-muted-foreground">বিজ্ঞাপন</span>
        <div className="mt-4 text-muted-foreground">৩০০ × ২৫০</div>
      </div>
    </aside>
  );
};
