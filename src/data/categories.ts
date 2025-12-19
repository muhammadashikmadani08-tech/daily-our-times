import { Category } from "@/types/news";

export const categories: Category[] = [
  { id: "1", name: "বাংলাদেশ", slug: "bangladesh", nameEn: "Bangladesh" },
  { id: "2", name: "রাজনীতি", slug: "politics", nameEn: "Politics" },
  { id: "3", name: "আন্তর্জাতিক", slug: "international", nameEn: "International" },
  { id: "4", name: "অর্থনীতি", slug: "economy", nameEn: "Economy" },
  { id: "5", name: "খেলাধুলা", slug: "sports", nameEn: "Sports" },
  { id: "6", name: "বিনোদন", slug: "entertainment", nameEn: "Entertainment" },
  { id: "7", name: "মতামত", slug: "opinion", nameEn: "Opinion" },
  { id: "8", name: "প্রযুক্তি", slug: "technology", nameEn: "Technology" },
  { id: "9", name: "চাকরি", slug: "jobs", nameEn: "Jobs" },
  { id: "10", name: "লাইফস্টাইল", slug: "lifestyle", nameEn: "Lifestyle" },
  { id: "11", name: "ফটো", slug: "photo", nameEn: "Photo" },
  { id: "12", name: "ভিডিও", slug: "video", nameEn: "Video" },
];

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find((cat) => cat.slug === slug);
};

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find((cat) => cat.id === id);
};
