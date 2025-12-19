import { NewsArticle, BreakingNews, Poll } from "@/types/news";
import { categories } from "./categories";

const authors = [
  { id: "1", name: "মোহাম্মদ রাশেদ", designation: "সিনিয়র প্রতিবেদক" },
  { id: "2", name: "ফাতেমা খানম", designation: "রাজনৈতিক সংবাদদাতা" },
  { id: "3", name: "আবদুল করিম", designation: "ক্রীড়া সম্পাদক" },
  { id: "4", name: "সুমাইয়া আক্তার", designation: "বিনোদন সম্পাদক" },
  { id: "5", name: "তানভীর হাসান", designation: "প্রযুক্তি প্রতিবেদক" },
];

export const breakingNews: BreakingNews[] = [
  { id: "1", title: "জাতীয় সংসদে নতুন বাজেট প্রস্তাব পেশ করা হবে আগামীকাল", link: "/news/1" },
  { id: "2", title: "ঢাকা-চট্টগ্রাম মহাসড়কে যান চলাচল স্বাভাবিক", link: "/news/2" },
  { id: "3", title: "জাতীয় ক্রিকেট দলের নতুন কোচ নিয়োগ", link: "/news/3" },
  { id: "4", title: "দেশের আইটি খাতে নতুন বিনিয়োগ আসছে", link: "/news/4" },
  { id: "5", title: "আবহাওয়া অধিদপ্তরের সতর্কতা: আগামী সপ্তাহে ভারি বৃষ্টির সম্ভাবনা", link: "/news/5" },
];

export const poll: Poll = {
  id: "1",
  question: "আপনার মতে এবারের বাজেটে সবচেয়ে গুরুত্বপূর্ণ খাত কোনটি?",
  options: [
    { id: "1", text: "শিক্ষা", votes: 245 },
    { id: "2", text: "স্বাস্থ্য", votes: 189 },
    { id: "3", text: "অবকাঠামো", votes: 156 },
    { id: "4", text: "কৃষি", votes: 98 },
  ],
  totalVotes: 688,
};

export const newsArticles: NewsArticle[] = [
  // Featured News
  {
    id: "1",
    title: "দেশের অর্থনৈতিক প্রবৃদ্ধিতে নতুন মাইলফলক স্থাপিত হলো এ বছর",
    subtitle: "বিশ্ব ব্যাংকের প্রতিবেদনে বাংলাদেশের অগ্রগতির প্রশংসা",
    excerpt: "চলতি অর্থবছরে বাংলাদেশের অর্থনৈতিক প্রবৃদ্ধি আশাতীত হয়েছে। বিভিন্ন আন্তর্জাতিক সংস্থা এই অগ্রগতির প্রশংসা করেছে।",
    content: `<p>চলতি অর্থবছরে বাংলাদেশের অর্থনৈতিক প্রবৃদ্ধি আশাতীত হয়েছে। বিভিন্ন আন্তর্জাতিক সংস্থা এই অগ্রগতির প্রশংসা করেছে এবং ভবিষ্যতে আরও উন্নতির সম্ভাবনা দেখছে।</p>
    <p>বিশ্ব ব্যাংকের সাম্প্রতিক প্রতিবেদনে বলা হয়েছে, বাংলাদেশের অর্থনীতি স্থিতিশীল গতিতে এগিয়ে যাচ্ছে। রপ্তানি খাত, রেমিট্যান্স এবং দেশীয় শিল্পের অবদান এই প্রবৃদ্ধিতে বিশেষ ভূমিকা রেখেছে।</p>
    <h2>প্রধান খাতগুলোর অবদান</h2>
    <p>তৈরি পোশাক শিল্প এখনও রপ্তানি আয়ের প্রধান উৎস হিসেবে রয়ে গেছে। তবে আইটি সেক্টর এবং ফার্মাসিউটিক্যাল শিল্পও দ্রুত বিকশিত হচ্ছে।</p>
    <blockquote>এই প্রবৃদ্ধি বজায় রাখতে হলে অবকাঠামো উন্নয়ন এবং দক্ষ মানবসম্পদ তৈরিতে আরও বিনিয়োগ প্রয়োজন।</blockquote>
    <p>অর্থনীতিবিদরা মনে করেন, সরকারের সঠিক নীতি এবং বেসরকারি খাতের উদ্যোগের সমন্বয়ে এই অগ্রগতি সম্ভব হয়েছে।</p>`,
    category: categories[3], // অর্থনীতি
    author: authors[0],
    publishedAt: "২০২৫-১২-১৯ সকাল ১০:৩০",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop",
    tags: ["অর্থনীতি", "প্রবৃদ্ধি", "বিশ্ব ব্যাংক"],
    views: 15420,
    isFeatured: true,
  },
  // বাংলাদেশ
  {
    id: "2",
    title: "ঢাকায় নতুন মেট্রোরেল লাইনের কাজ শুরু হচ্ছে আগামী মাসে",
    excerpt: "রাজধানীর যানজট নিরসনে আরও একটি মেট্রোরেল লাইনের নির্মাণ কাজ শুরু হতে যাচ্ছে।",
    content: "<p>রাজধানীর যানজট নিরসনে আরও একটি মেট্রোরেল লাইনের নির্মাণ কাজ শুরু হতে যাচ্ছে। এই প্রকল্পের মাধ্যমে ঢাকার বিভিন্ন এলাকায় যাতায়াত আরও সহজ হবে।</p>",
    category: categories[0],
    author: authors[0],
    publishedAt: "২০২৫-১২-১৯ সকাল ৯:১৫",
    imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=500&fit=crop",
    tags: ["মেট্রোরেল", "ঢাকা", "উন্নয়ন"],
    views: 8932,
  },
  {
    id: "3",
    title: "দেশব্যাপী শীতকালীন বৃক্ষরোপণ কর্মসূচি শুরু",
    excerpt: "পরিবেশ মন্ত্রণালয়ের উদ্যোগে সারাদেশে লাখ লাখ গাছ লাগানো হবে এই শীতে।",
    content: "<p>পরিবেশ মন্ত্রণালয়ের উদ্যোগে সারাদেশে লাখ লাখ গাছ লাগানো হবে এই শীতে। জলবায়ু পরিবর্তন মোকাবেলায় এই উদ্যোগ গুরুত্বপূর্ণ ভূমিকা রাখবে।</p>",
    category: categories[0],
    author: authors[1],
    publishedAt: "২০২৫-১২-১৯ সকাল ৮:৪৫",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=500&fit=crop",
    tags: ["পরিবেশ", "বৃক্ষরোপণ"],
    views: 5621,
  },
  {
    id: "4",
    title: "চট্টগ্রাম বন্দরে নতুন জেটি উদ্বোধন",
    excerpt: "দেশের প্রধান সমুদ্র বন্দরের সক্ষমতা বাড়াতে নতুন অত্যাধুনিক জেটি চালু।",
    content: "<p>দেশের প্রধান সমুদ্র বন্দরের সক্ষমতা বাড়াতে নতুন অত্যাধুনিক জেটি চালু করা হয়েছে।</p>",
    category: categories[0],
    author: authors[0],
    publishedAt: "২০২৫-১২-১৮ বিকাল ৫:৩০",
    imageUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&h=500&fit=crop",
    tags: ["বন্দর", "চট্টগ্রাম"],
    views: 4230,
  },
  // রাজনীতি
  {
    id: "5",
    title: "জাতীয় সংসদে নতুন আইন পাসের প্রস্তাব",
    excerpt: "ডিজিটাল নিরাপত্তা বিষয়ক নতুন আইন নিয়ে সংসদে আলোচনা চলছে।",
    content: "<p>ডিজিটাল নিরাপত্তা বিষয়ক নতুন আইন নিয়ে সংসদে আলোচনা চলছে। বিভিন্ন রাজনৈতিক দলের মধ্যে এ নিয়ে মতবিনিময় হয়েছে।</p>",
    category: categories[1],
    author: authors[1],
    publishedAt: "২০২৫-১২-১৯ দুপুর ১২:০০",
    imageUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=500&fit=crop",
    tags: ["সংসদ", "আইন", "রাজনীতি"],
    views: 12450,
  },
  {
    id: "6",
    title: "স্থানীয় সরকার নির্বাচনের তফসিল ঘোষণা",
    excerpt: "আগামী মার্চ মাসে অনুষ্ঠিত হবে উপজেলা পরিষদ নির্বাচন।",
    content: "<p>আগামী মার্চ মাসে অনুষ্ঠিত হবে উপজেলা পরিষদ নির্বাচন। নির্বাচন কমিশন এ সংক্রান্ত তফসিল প্রকাশ করেছে।</p>",
    category: categories[1],
    author: authors[1],
    publishedAt: "২০২৫-১২-১৮ সন্ধ্যা ৬:৩০",
    imageUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&h=500&fit=crop",
    tags: ["নির্বাচন", "স্থানীয় সরকার"],
    views: 9870,
  },
  // আন্তর্জাতিক
  {
    id: "7",
    title: "জাতিসংঘে বাংলাদেশের নতুন প্রস্তাব গৃহীত",
    excerpt: "জলবায়ু পরিবর্তন মোকাবেলায় উন্নয়নশীল দেশগুলোর জন্য বিশেষ তহবিল গঠনের প্রস্তাব।",
    content: "<p>জলবায়ু পরিবর্তন মোকাবেলায় উন্নয়নশীল দেশগুলোর জন্য বিশেষ তহবিল গঠনের প্রস্তাব জাতিসংঘে গৃহীত হয়েছে।</p>",
    category: categories[2],
    author: authors[0],
    publishedAt: "২০২৫-১২-১৯ রাত ৯:০০",
    imageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=500&fit=crop",
    tags: ["জাতিসংঘ", "জলবায়ু"],
    views: 7650,
  },
  {
    id: "8",
    title: "ভারতের সাথে নতুন বাণিজ্য চুক্তি স্বাক্ষর",
    excerpt: "দুই দেশের মধ্যে দ্বিপাক্ষিক বাণিজ্য বাড়াতে নতুন চুক্তি সই হয়েছে।",
    content: "<p>দুই দেশের মধ্যে দ্বিপাক্ষিক বাণিজ্য বাড়াতে নতুন চুক্তি সই হয়েছে।</p>",
    category: categories[2],
    author: authors[0],
    publishedAt: "২০২৫-১২-১৮ দুপুর ২:০০",
    imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=500&fit=crop",
    tags: ["ভারত", "বাণিজ্য"],
    views: 6540,
  },
  // খেলাধুলা
  {
    id: "9",
    title: "জাতীয় ক্রিকেট দলের নতুন অধ্যায় শুরু",
    subtitle: "নতুন কোচের অধীনে দলে বড় পরিবর্তন আসছে",
    excerpt: "বাংলাদেশ ক্রিকেট দল নতুন কোচের নেতৃত্বে আগামী সিরিজে মাঠে নামতে যাচ্ছে।",
    content: "<p>বাংলাদেশ ক্রিকেট দল নতুন কোচের নেতৃত্বে আগামী সিরিজে মাঠে নামতে যাচ্ছে। দলে নতুন কিছু মুখ দেখা যেতে পারে।</p>",
    category: categories[4],
    author: authors[2],
    publishedAt: "২০২৫-১২-১৯ সকাল ১১:০০",
    imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=500&fit=crop",
    tags: ["ক্রিকেট", "খেলাধুলা"],
    views: 18920,
  },
  {
    id: "10",
    title: "ফুটবলে বাংলাদেশের ঐতিহাসিক জয়",
    excerpt: "আন্তর্জাতিক প্রীতি ম্যাচে শক্তিশালী প্রতিপক্ষকে হারিয়েছে বাংলাদেশ।",
    content: "<p>আন্তর্জাতিক প্রীতি ম্যাচে শক্তিশালী প্রতিপক্ষকে হারিয়েছে বাংলাদেশ। এটি দলের জন্য বড় অর্জন।</p>",
    category: categories[4],
    author: authors[2],
    publishedAt: "২০২৫-১২-১৮ রাত ১০:৩০",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop",
    tags: ["ফুটবল", "খেলাধুলা"],
    views: 14560,
  },
  // বিনোদন
  {
    id: "11",
    title: "ঢালিউডে নতুন সিনেমার ঝড়",
    excerpt: "আগামী মাসে মুক্তি পাচ্ছে একাধিক বাংলা চলচ্চিত্র। দর্শকদের মধ্যে ব্যাপক উৎসাহ।",
    content: "<p>আগামী মাসে মুক্তি পাচ্ছে একাধিক বাংলা চলচ্চিত্র। দর্শকদের মধ্যে ব্যাপক উৎসাহ দেখা যাচ্ছে।</p>",
    category: categories[5],
    author: authors[3],
    publishedAt: "২০২৫-১২-১৯ দুপুর ১:০০",
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=500&fit=crop",
    tags: ["সিনেমা", "বিনোদন"],
    views: 11230,
  },
  {
    id: "12",
    title: "জনপ্রিয় গায়কের নতুন অ্যালবাম প্রকাশ",
    excerpt: "দীর্ঘ বিরতির পর ফিরে এলেন জনপ্রিয় শিল্পী। নতুন অ্যালবামে রয়েছে ১০টি গান।",
    content: "<p>দীর্ঘ বিরতির পর ফিরে এলেন জনপ্রিয় শিল্পী। নতুন অ্যালবামে রয়েছে ১০টি গান।</p>",
    category: categories[5],
    author: authors[3],
    publishedAt: "২০২৫-১২-১৮ বিকাল ৪:০০",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=500&fit=crop",
    tags: ["সঙ্গীত", "বিনোদন"],
    views: 8970,
  },
  // প্রযুক্তি
  {
    id: "13",
    title: "দেশে তৈরি প্রথম স্মার্টফোন বাজারে আসছে",
    subtitle: "মেড ইন বাংলাদেশ ট্যাগ নিয়ে প্রযুক্তি খাতে নতুন মাইলফলক",
    excerpt: "বাংলাদেশি একটি কোম্পানি সম্পূর্ণ দেশীয় প্রযুক্তিতে স্মার্টফোন তৈরি করেছে।",
    content: "<p>বাংলাদেশি একটি কোম্পানি সম্পূর্ণ দেশীয় প্রযুক্তিতে স্মার্টফোন তৈরি করেছে। এটি প্রযুক্তি খাতে একটি বড় অগ্রগতি।</p>",
    category: categories[7],
    author: authors[4],
    publishedAt: "২০২৫-১২-১৯ সকাল ৭:৩০",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=500&fit=crop",
    tags: ["স্মার্টফোন", "প্রযুক্তি"],
    views: 21340,
  },
  {
    id: "14",
    title: "দেশের আইটি রপ্তানি বাড়ছে",
    excerpt: "সফটওয়্যার ও আইটি সেবা রপ্তানিতে নতুন রেকর্ড গড়েছে বাংলাদেশ।",
    content: "<p>সফটওয়্যার ও আইটি সেবা রপ্তানিতে নতুন রেকর্ড গড়েছে বাংলাদেশ।</p>",
    category: categories[7],
    author: authors[4],
    publishedAt: "২০২৫-১২-১৮ সকাল ১০:০০",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=500&fit=crop",
    tags: ["আইটি", "রপ্তানি"],
    views: 7890,
  },
  // চাকরি
  {
    id: "15",
    title: "সরকারি চাকরিতে ১০ হাজার নতুন নিয়োগ",
    excerpt: "বিভিন্ন মন্ত্রণালয়ে শূন্য পদে নিয়োগের বিজ্ঞপ্তি প্রকাশিত হয়েছে।",
    content: "<p>বিভিন্ন মন্ত্রণালয়ে শূন্য পদে নিয়োগের বিজ্ঞপ্তি প্রকাশিত হয়েছে।</p>",
    category: categories[8],
    author: authors[0],
    publishedAt: "২০২৫-১২-১৯ সকাল ৮:০০",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop",
    tags: ["চাকরি", "নিয়োগ"],
    views: 32100,
  },
  {
    id: "16",
    title: "বেসরকারি ব্যাংকে নতুন নিয়োগ বিজ্ঞপ্তি",
    excerpt: "একাধিক ব্যাংকে বিভিন্ন পদে লোক নেওয়া হবে।",
    content: "<p>একাধিক ব্যাংকে বিভিন্ন পদে লোক নেওয়া হবে।</p>",
    category: categories[8],
    author: authors[0],
    publishedAt: "২০২৫-১২-১৭ দুপুর ৩:০০",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop",
    tags: ["ব্যাংক", "চাকরি"],
    views: 28500,
  },
  // লাইফস্টাইল
  {
    id: "17",
    title: "শীতে সুস্থ থাকার সহজ উপায়",
    excerpt: "ঠান্ডায় সুস্থ থাকতে কিছু সহজ টিপস মেনে চলুন।",
    content: "<p>ঠান্ডায় সুস্থ থাকতে কিছু সহজ টিপস মেনে চলুন।</p>",
    category: categories[9],
    author: authors[3],
    publishedAt: "২০২৫-১২-১৯ সকাল ৬:০০",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=500&fit=crop",
    tags: ["স্বাস্থ্য", "লাইফস্টাইল"],
    views: 6780,
  },
  {
    id: "18",
    title: "ঘরে বসে ফিট থাকার টিপস",
    excerpt: "ব্যস্ত জীবনে জিমে না গিয়েও সুস্থ থাকা সম্ভব।",
    content: "<p>ব্যস্ত জীবনে জিমে না গিয়েও সুস্থ থাকা সম্ভব।</p>",
    category: categories[9],
    author: authors[3],
    publishedAt: "২০২৫-১২-১৮ সন্ধ্যা ৭:০০",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop",
    tags: ["ফিটনেস", "লাইফস্টাইল"],
    views: 5430,
  },
  // অর্থনীতি
  {
    id: "19",
    title: "শেয়ার বাজারে ইতিবাচক প্রবাহ",
    excerpt: "ঢাকা স্টক এক্সচেঞ্জে লেনদেন বেড়েছে। বিনিয়োগকারীদের মধ্যে আশাবাদ।",
    content: "<p>ঢাকা স্টক এক্সচেঞ্জে লেনদেন বেড়েছে।</p>",
    category: categories[3],
    author: authors[0],
    publishedAt: "২০২৫-১২-১৮ দুপুর ১:০০",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=500&fit=crop",
    tags: ["শেয়ার বাজার", "অর্থনীতি"],
    views: 9870,
  },
  {
    id: "20",
    title: "রপ্তানি আয়ে নতুন রেকর্ড",
    excerpt: "চলতি অর্থবছরে রপ্তানি আয় ৫০ বিলিয়ন ডলার ছাড়িয়েছে।",
    content: "<p>চলতি অর্থবছরে রপ্তানি আয় ৫০ বিলিয়ন ডলার ছাড়িয়েছে।</p>",
    category: categories[3],
    author: authors[0],
    publishedAt: "২০২৫-১২-১৭ সকাল ১১:০০",
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=500&fit=crop",
    tags: ["রপ্তানি", "অর্থনীতি"],
    views: 8760,
  },
  // মতামত
  {
    id: "21",
    title: "শিক্ষা ব্যবস্থায় সংস্কার জরুরি",
    excerpt: "একজন শিক্ষাবিদের কলাম: বর্তমান শিক্ষা ব্যবস্থার সমস্যা ও সমাধান।",
    content: "<p>একজন শিক্ষাবিদের কলাম: বর্তমান শিক্ষা ব্যবস্থার সমস্যা ও সমাধান।</p>",
    category: categories[6],
    author: authors[1],
    publishedAt: "২০২৫-১২-১৯ সকাল ৯:০০",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=500&fit=crop",
    tags: ["শিক্ষা", "মতামত"],
    views: 4560,
  },
  {
    id: "22",
    title: "নগর উন্নয়নে নতুন ভাবনা",
    excerpt: "পরিকল্পিত নগরায়ণ কেন জরুরি - একটি বিশ্লেষণ।",
    content: "<p>পরিকল্পিত নগরায়ণ কেন জরুরি - একটি বিশ্লেষণ।</p>",
    category: categories[6],
    author: authors[0],
    publishedAt: "২০২৫-১২-১৮ বিকাল ৫:০০",
    imageUrl: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=500&fit=crop",
    tags: ["নগরায়ণ", "মতামত"],
    views: 3450,
  },
];

// Helper functions
export const getFeaturedNews = (): NewsArticle | undefined => {
  return newsArticles.find((news) => news.isFeatured);
};

export const getLeadNews = (count: number = 6): NewsArticle[] => {
  return newsArticles.filter((news) => !news.isFeatured).slice(0, count);
};

export const getNewsByCategory = (categorySlug: string): NewsArticle[] => {
  return newsArticles.filter((news) => news.category.slug === categorySlug);
};

export const getNewsById = (id: string): NewsArticle | undefined => {
  return newsArticles.find((news) => news.id === id);
};

export const getLatestNews = (count: number = 10): NewsArticle[] => {
  return [...newsArticles].slice(0, count);
};

export const getMostReadNews = (count: number = 5): NewsArticle[] => {
  return [...newsArticles].sort((a, b) => b.views - a.views).slice(0, count);
};

export const getRelatedNews = (newsId: string, count: number = 4): NewsArticle[] => {
  const currentNews = getNewsById(newsId);
  if (!currentNews) return [];
  
  return newsArticles
    .filter((news) => news.id !== newsId && news.category.id === currentNews.category.id)
    .slice(0, count);
};
