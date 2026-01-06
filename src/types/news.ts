export interface NewsArticle {
  id: string;
  title: string;
  slug?: string;
  subtitle?: string;
  content: string;
  excerpt: string;
  category: Category;
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  imageUrl: string;
  imageCaption?: string;
  tags: string[];
  views: number;
  isFeatured?: boolean;
  isBreaking?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  nameEn: string;
}

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  designation?: string;
}

export interface BreakingNews {
  id: string;
  title: string;
  link: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
}
