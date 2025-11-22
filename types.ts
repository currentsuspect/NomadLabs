
// Enums matching the planned Prisma Schema
export enum UserRole {
  GUEST = 'GUEST',
  MEMBER = 'MEMBER',
  AUTHOR = 'AUTHOR',
  REVIEWER = 'REVIEWER',
  ADMIN = 'ADMIN'
}

export enum PostType {
  ARTICLE = 'ARTICLE',
  PAPER = 'PAPER',
  LAB_NOTE = 'LAB_NOTE'
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  UNDER_REVIEW = 'UNDER_REVIEW',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

// Models
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  expertise: string[];
  bio?: string;
  followingUsers: string[]; // IDs of users being followed
  followingTags: string[];  // Names of tags being followed
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
  type: 'TOPIC' | 'TECH' | 'STACK';
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  type: PostType;
  status: PostStatus;
  authorId: string;
  author: User;
  content: string; // MDX content
  coverImage?: string;
  tags: Tag[];
  publishedAt: string;
  readTimeMinutes: number;
  // Metadata specific to Research Papers
  abstract?: string;
  version?: string;
  citations?: number;
  // CMS Control Flags
  featured?: boolean; // Determines if it appears in the Hero section
  pinned?: boolean;   // Determines if it sticks to the top of lists
}

export type ReactionType = 'LIKE' | 'FIRE' | 'BRAIN' | 'ROCKET';

export interface Reaction {
  type: ReactionType;
  count: number;
  userHasReacted: boolean;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  replies?: Comment[];
  reactions: Reaction[];
}
