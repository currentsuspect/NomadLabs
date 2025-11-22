
import { Post, User, Comment, PostType, PostStatus, UserRole } from '../types';

const STORAGE_KEYS = {
  POSTS: 'nomad_posts',
  USERS: 'nomad_users',
  COMMENTS: 'nomad_comments',
  INIT: 'nomad_init_v3' // Bump version to force clean slate for new schema
};

// Helper for safe local storage access
const get = <T>(key: string, defaultVal: T): T => {
  try {
    if (typeof window === 'undefined') return defaultVal;
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch (e) {
    console.error(`Error reading ${key}`, e);
    return defaultVal;
  }
};

const set = (key: string, val: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error(`Error writing ${key}`, e);
  }
};

export const api = {
  init: () => {
    if (typeof window === 'undefined') return;
    
    // One-time initialization for a fresh deploy if needed
    if (!localStorage.getItem(STORAGE_KEYS.INIT)) {
      // Ensure arrays exist but are empty (Clean Slate)
      // For v3, we clear old data to prevent type mismatches with new Comment/Post schemas
      set(STORAGE_KEYS.POSTS, []);
      set(STORAGE_KEYS.USERS, []);
      set(STORAGE_KEYS.COMMENTS, []);
      
      localStorage.setItem(STORAGE_KEYS.INIT, 'true');
    }
  },

  posts: {
    list: async (): Promise<Post[]> => {
      return get<Post[]>(STORAGE_KEYS.POSTS, []);
    },
    get: async (slug: string): Promise<Post | undefined> => {
      const posts = get<Post[]>(STORAGE_KEYS.POSTS, []);
      return posts.find(p => p.slug === slug);
    },
    create: async (post: Post): Promise<void> => {
      const posts = get<Post[]>(STORAGE_KEYS.POSTS, []);
      // Check for slug collision
      if (posts.find(p => p.slug === post.slug)) {
         post.slug = `${post.slug}-${Date.now()}`;
      }
      set(STORAGE_KEYS.POSTS, [post, ...posts]);
    },
    update: async (post: Post): Promise<void> => {
      const posts = get<Post[]>(STORAGE_KEYS.POSTS, []);
      set(STORAGE_KEYS.POSTS, posts.map(p => p.id === post.id ? post : p));
    },
    delete: async (id: string): Promise<void> => {
       const posts = get<Post[]>(STORAGE_KEYS.POSTS, []);
       set(STORAGE_KEYS.POSTS, posts.filter(p => p.id !== id));
    }
  },

  users: {
    get: async (id: string): Promise<User | undefined> => {
      return get<User[]>(STORAGE_KEYS.USERS, []).find(u => u.id === id);
    },
    login: async (email: string): Promise<User | undefined> => {
      const users = get<User[]>(STORAGE_KEYS.USERS, []);
      return users.find(u => u.email.toLowerCase() === email.toLowerCase());
    },
    register: async (user: User): Promise<void> => {
      const users = get<User[]>(STORAGE_KEYS.USERS, []);
      if (users.find(u => u.email.toLowerCase() === user.email.toLowerCase())) {
        throw new Error('User already exists');
      }
      set(STORAGE_KEYS.USERS, [...users, user]);
    },
    update: async (user: User): Promise<void> => {
      const users = get<User[]>(STORAGE_KEYS.USERS, []);
      set(STORAGE_KEYS.USERS, users.map(u => u.id === user.id ? user : u));
    },
    getAll: async (): Promise<User[]> => {
      return get<User[]>(STORAGE_KEYS.USERS, []);
    }
  },

  comments: {
    list: async (postId?: string): Promise<Comment[]> => {
       const allComments = get<Comment[]>(STORAGE_KEYS.COMMENTS, []);
       if (postId) {
         return allComments.filter(c => c.postId === postId);
       }
       return allComments;
    },
    create: async (comment: Comment): Promise<void> => {
      const comments = get<Comment[]>(STORAGE_KEYS.COMMENTS, []);
      set(STORAGE_KEYS.COMMENTS, [...comments, comment]);
    },
    update: async (comment: Comment): Promise<void> => {
      const comments = get<Comment[]>(STORAGE_KEYS.COMMENTS, []);
      set(STORAGE_KEYS.COMMENTS, comments.map(c => c.id === comment.id ? comment : c));
    }
  }
};
