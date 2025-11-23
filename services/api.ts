
import { Post, User, Comment, PostType, PostStatus, UserRole } from '../types';
import { supabase } from './supabase';

// --- Mappers ---

const mapProfileToUser = (p: any): User => ({
  id: p.id,
  email: p.email || '',
  name: p.name || 'Nomad',
  avatarUrl: p.avatar_url,
  role: (p.role as UserRole) || UserRole.MEMBER,
  expertise: p.expertise || [],
  bio: p.bio || '',
  followingUsers: p.following_users || [],
  followingTags: p.following_tags || []
});

const mapDbPostToPost = (p: any, authorProfile?: any): Post => ({
  id: p.id,
  slug: p.slug,
  title: p.title,
  subtitle: p.subtitle,
  content: p.content || '',
  authorId: p.author_id,
  // Handle case where authorProfile might be an array (if 1:many inferred) or object
  author: (authorProfile && !Array.isArray(authorProfile)) ? mapProfileToUser(authorProfile)
    : (Array.isArray(authorProfile) && authorProfile[0]) ? mapProfileToUser(authorProfile[0])
      : { id: p.author_id, name: 'Unknown', role: UserRole.MEMBER } as User,
  status: p.status as PostStatus,
  type: p.type as PostType,
  tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags || [],
  readTimeMinutes: p.read_time_minutes,
  featured: p.featured,
  pinned: p.pinned,
  likes: p.likes || [],
  publishedAt: p.published_at ? new Date(p.published_at).toLocaleDateString() : new Date(p.created_at).toLocaleDateString(),
  createdAt: new Date(p.created_at).toISOString(),
  updatedAt: new Date(p.updated_at).toISOString(),
  citations: 0
});

const mapDbCommentToComment = (c: any, authorProfile?: any): Comment => ({
  id: c.id,
  postId: c.post_id,
  author: (authorProfile && !Array.isArray(authorProfile)) ? mapProfileToUser(authorProfile)
    : (Array.isArray(authorProfile) && authorProfile[0]) ? mapProfileToUser(authorProfile[0])
      : { id: c.author_id, name: 'Unknown' } as User,
  content: c.content,
  createdAt: new Date(c.created_at).toLocaleDateString(),
  reactions: typeof c.reactions === 'string' ? JSON.parse(c.reactions) : c.reactions || [],
  replies: []
});

// --- API Service ---

export const api = {
  init: () => {
    console.log("Nomad Labs API: Connected to Supabase");
  },

  posts: {
    list: async (): Promise<Post[]> => {
      // Changed 'author:profiles(*)' to 'profiles(*)' to avoid alias resolution errors
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === 'PGRST205') {
          console.error("CRITICAL: Database tables missing. Please run SUPABASE_SETUP.sql in your Supabase SQL Editor.");
        } else {
          console.error('Error fetching posts:', JSON.stringify(error, null, 2));
        }
        return [];
      }
      // Map 'profiles' (the table name) to author
      return data.map((row: any) => mapDbPostToPost(row, row.profiles));
    },

    get: async (slug: string): Promise<Post | undefined> => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (*)
        `)
        .eq('slug', slug)
        .single();

      if (error) {
        console.error("Error fetching post by slug:", slug, JSON.stringify(error, null, 2));
        return undefined;
      }
      return mapDbPostToPost(data, data.profiles);
    },

    create: async (post: Post): Promise<Post> => {
      const dbPost = {
        slug: post.slug,
        title: post.title,
        subtitle: post.subtitle,
        content: post.content,
        author_id: post.authorId,
        status: post.status,
        type: post.type,
        tags: post.tags,
        read_time_minutes: post.readTimeMinutes,
        featured: post.featured,
        pinned: post.pinned,
        likes: post.likes || [],
        // Use ISO string for Postgres timestamps
        published_at: post.status === 'PUBLISHED' ? new Date().toISOString() : null
      };

      // Let Supabase generate the ID
      const { data, error } = await supabase.from('posts').insert(dbPost).select().single();

      if (error) {
        console.error("Error creating post:", JSON.stringify(error, null, 2));
        throw error;
      }

      // Return the created post with the new ID
      return mapDbPostToPost(data, post.author);
    },

    update: async (post: Post): Promise<void> => {
      const dbPost = {
        title: post.title,
        subtitle: post.subtitle,
        content: post.content,
        status: post.status,
        tags: post.tags,
        featured: post.featured,
        pinned: post.pinned,
        likes: post.likes,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('posts')
        .update(dbPost)
        .eq('id', post.id);

      if (error) {
        console.error("Error updating post:", JSON.stringify(error, null, 2));
        throw error;
      }
    },

    delete: async (id: string): Promise<void> => {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
    }
  },

  users: {
    getCurrent: async (): Promise<User | null> => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "Results contain 0 rows" (PostgREST), meaning profile not created yet
        console.error("Profile fetch error", JSON.stringify(error, null, 2));
      }

      if (profile) {
        return mapProfileToUser(profile);
      } else {
        // Fallback: User exists in Auth but trigger might have failed or not run
        // Self-heal: Create the missing profile
        const newProfile = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name || 'Researcher',
          avatar_url: session.user.user_metadata.avatarUrl,
          role: UserRole.MEMBER
        };

        const { error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile);

        if (insertError) {
          console.error("Failed to self-heal profile:", insertError);
          // Return fallback if insertion fails, though writes will likely fail later
          return {
            ...newProfile,
            expertise: [],
            followingUsers: [],
            followingTags: []
          } as User;
        }

        return mapProfileToUser(newProfile);
      }
    },

    get: async (id: string): Promise<User | undefined> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) return undefined;
      return mapProfileToUser(data);
    },

    login: async (email: string, password: string): Promise<void> => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },

    loginWithGoogle: async (): Promise<void> => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/auth' }
      });
      if (error) throw error;
    },

    register: async (name: string, email: string, password: string): Promise<void> => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${name}` }
        }
      });
      if (error) throw error;
    },

    logout: async (): Promise<void> => {
      await supabase.auth.signOut();
    },

    update: async (user: User): Promise<void> => {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: user.name,
          bio: user.bio,
          expertise: user.expertise,
          avatar_url: user.avatarUrl,
          following_users: user.followingUsers,
          following_tags: user.followingTags
        })
        .eq('id', user.id);

      if (error) throw error;
    },

    getAll: async (): Promise<User[]> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return [];
      return data.map(mapProfileToUser);
    },

    delete: async (id: string): Promise<void> => {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
    }
  },

  comments: {
    list: async (postId?: string): Promise<Comment[]> => {
      let query = supabase
        .from('comments')
        .select(`*, profiles (*)`)
        .order('created_at', { ascending: true });

      if (postId) {
        query = query.eq('post_id', postId);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching comments:", JSON.stringify(error, null, 2));
        return [];
      }

      const comments = data.map((row: any) => mapDbCommentToComment(row, row.profiles));

      // Reconstruct Tree
      const commentMap = new Map<string, Comment>();
      const roots: Comment[] = [];

      comments.forEach(c => {
        c.replies = [];
        commentMap.set(c.id, c);
      });

      data.forEach((row: any, index: number) => {
        const comment = comments[index];
        if (row.parent_id) {
          const parent = commentMap.get(row.parent_id);
          if (parent) {
            parent.replies?.push(comment);
          } else {
            roots.push(comment);
          }
        } else {
          roots.push(comment);
        }
      });

      return roots;
    },

    create: async (comment: Comment): Promise<void> => {
      // Simple create - assumes root level if no explicit parent context provided here.
      // For nested replies, use api.comments.reply
      const dbComment = {
        post_id: comment.postId,
        author_id: comment.author.id,
        content: comment.content,
        reactions: [],
      };

      const { error } = await supabase.from('comments').insert(dbComment);
      if (error) throw error;
    },

    reply: async (postId: string, content: string, authorId: string, parentId: string): Promise<void> => {
      const { error } = await supabase.from('comments').insert({
        post_id: postId,
        author_id: authorId,
        content,
        parent_id: parentId,
        reactions: []
      });
      if (error) throw error;
    },

    update: async (comment: Comment): Promise<void> => {
      const { error } = await supabase
        .from('comments')
        .update({
          content: comment.content,
          reactions: comment.reactions
        })
        .eq('id', comment.id);

      if (error) throw error;
    }
  }
};
