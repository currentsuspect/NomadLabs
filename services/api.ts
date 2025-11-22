import { MOCK_POSTS, MOCK_USER, MOCK_COMMENTS } from '../constants';
import { Post, User, Comment } from '../types';

const DELAY = 400; // Simulate realistic network latency

const get = <T>(key: string, defaultVal: T): T => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

const set = (key: string, val: any) => localStorage.setItem(key, JSON.stringify(val));

export const api = {
  init: () => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem('nomad_init')) {
      set('nomad_users', [MOCK_USER]);
      set('nomad_posts', MOCK_POSTS);
      set('nomad_comments', MOCK_COMMENTS);
      localStorage.setItem('nomad_init', 'true');
    }
  },
  posts: {
    list: async (): Promise<Post[]> => {
      await new Promise(r => setTimeout(r, DELAY));
      return get<Post[]>('nomad_posts', []);
    },
    get: async (slug: string): Promise<Post | undefined> => {
      await new Promise(r => setTimeout(r, DELAY));
      return get<Post[]>('nomad_posts', []).find(p => p.slug === slug);
    },
    create: async (post: Post): Promise<void> => {
      await new Promise(r => setTimeout(r, DELAY));
      const posts = get<Post[]>('nomad_posts', []);
      set('nomad_posts', [post, ...posts]);
    },
    update: async (post: Post): Promise<void> => {
      await new Promise(r => setTimeout(r, DELAY));
      const posts = get<Post[]>('nomad_posts', []);
      set('nomad_posts', posts.map(p => p.id === post.id ? post : p));
    },
    delete: async (id: string): Promise<void> => {
       await new Promise(r => setTimeout(r, DELAY));
       const posts = get<Post[]>('nomad_posts', []);
       set('nomad_posts', posts.filter(p => p.id !== id));
    }
  },
  users: {
    get: async (id: string): Promise<User | undefined> => {
      await new Promise(r => setTimeout(r, DELAY));
      return get<User[]>('nomad_users', []).find(u => u.id === id);
    },
    login: async (email: string): Promise<User | undefined> => {
      await new Promise(r => setTimeout(r, DELAY));
      const users = get<User[]>('nomad_users', []);
      // Simple mock auth logic
      return users.find(u => u.email.toLowerCase() === email.toLowerCase());
    },
    register: async (user: User): Promise<void> => {
      await new Promise(r => setTimeout(r, DELAY));
      const users = get<User[]>('nomad_users', []);
      if (users.find(u => u.email === user.email)) {
        throw new Error('User already exists');
      }
      set('nomad_users', [...users, user]);
    },
    update: async (user: User): Promise<void> => {
      await new Promise(r => setTimeout(r, DELAY));
      const users = get<User[]>('nomad_users', []);
      set('nomad_users', users.map(u => u.id === user.id ? user : u));
    }
  },
  comments: {
    list: async (): Promise<Comment[]> => {
       // In a real API, we'd filter by Post ID here, but for this mock we return all 
       // and filter on the client or let the view handle it. 
       // For simplicity in this structure, we are returning the flat list.
       await new Promise(r => setTimeout(r, DELAY));
       return get<Comment[]>('nomad_comments', []);
    },
    create: async (comment: Comment): Promise<void> => {
      await new Promise(r => setTimeout(r, DELAY));
      const comments = get<Comment[]>('nomad_comments', []);
      set('nomad_comments', [comment, ...comments]);
    }
  }
};