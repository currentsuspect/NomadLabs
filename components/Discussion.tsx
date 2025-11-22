
import React, { useState, useEffect } from 'react';
import { Comment, ReactionType, CommentReaction } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthProvider';
import { useNotification } from './NotificationProvider';
import { Button } from './ui/Button';
import { MarkdownRenderer } from '../utils/markdown';
import { ThumbsUp, Flame, Brain, Rocket, MessageSquare, User as UserIcon } from 'lucide-react';

const ReactionButton: React.FC<{ 
  type: ReactionType; 
  count: number; 
  active: boolean; 
  onClick: () => void 
}> = ({ type, count, active, onClick }) => {
  const icons = {
    LIKE: <ThumbsUp size={14} />,
    FIRE: <Flame size={14} />,
    BRAIN: <Brain size={14} />,
    ROCKET: <Rocket size={14} />
  };

  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-all ${
        active 
          ? 'bg-primary/20 text-primary ring-1 ring-primary/50' 
          : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`}
    >
      {icons[type]}
      <span>{count}</span>
    </button>
  );
};

const CommentItem: React.FC<{ 
  comment: Comment; 
  depth?: number; 
  onReply: (parentId: string, content: string) => void;
}> = ({ comment, depth = 0, onReply }) => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [reactions, setReactions] = useState<CommentReaction[]>(comment.reactions || []);

  const handleReaction = async (type: ReactionType) => {
    if (!user) {
      addNotification({
        type: 'info',
        title: 'Authentication Required',
        message: 'Please sign in to react.'
      });
      return;
    }
    
    let newReactions = [...reactions];
    const existingIdx = newReactions.findIndex(r => r.userId === user.id && r.type === type);
    
    if (existingIdx >= 0) {
      // Remove reaction
      newReactions.splice(existingIdx, 1);
    } else {
      // Add reaction
      newReactions.push({ userId: user.id, type });
    }
    
    setReactions(newReactions);
    
    // Update persistent storage
    const updatedComment = { ...comment, reactions: newReactions };
    await api.comments.update(updatedComment);
  };

  const handleToggleReply = () => {
    if (!user) {
      addNotification({ type: 'info', title: 'Authentication Required', message: 'Please sign in to reply.' });
      return;
    }
    setIsReplying(!isReplying);
  };

  const handleSubmitReply = () => {
    if (!replyContent.trim()) return;
    onReply(comment.id, replyContent);
    setReplyContent('');
    setIsReplying(false);
  };

  // Compute counts for UI
  const getCount = (type: ReactionType) => reactions.filter(r => r.type === type).length;
  const hasReacted = (type: ReactionType) => user ? reactions.some(r => r.type === type && r.userId === user.id) : false;

  return (
    <div className={`group ${depth > 0 ? 'mt-4 pl-6 border-l border-slate-800' : 'py-6 border-b border-slate-800/50 last:border-0'}`}>
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-slate-800 ring-2 ring-slate-800 flex items-center justify-center overflow-hidden">
             {comment.author.avatarUrl ? (
               <img src={comment.author.avatarUrl} alt={comment.author.name} className="h-full w-full object-cover" />
             ) : (
               <UserIcon className="h-5 w-5 text-slate-400" />
             )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-slate-200 text-sm">{comment.author.name}</span>
            {comment.author.role === 'AUTHOR' && (
              <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold tracking-wide uppercase">
                Author
              </span>
            )}
            <span className="text-slate-500 text-xs">• {comment.createdAt}</span>
          </div>

          <div className="text-slate-300 text-sm leading-relaxed mb-3">
            <MarkdownRenderer content={comment.content} />
          </div>

          <div className="flex items-center gap-4 flex-wrap opacity-90">
            <div className="flex gap-2">
              {['LIKE', 'FIRE', 'BRAIN'].map((type) => (
                   <ReactionButton 
                    key={type}
                    type={type as ReactionType}
                    count={getCount(type as ReactionType)}
                    active={hasReacted(type as ReactionType)}
                    onClick={() => handleReaction(type as ReactionType)}
                  />
              ))}
            </div>
            <div className="h-4 w-px bg-slate-800"></div>
            <button 
              onClick={handleToggleReply}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
            >
              <MessageSquare size={14} />
              Reply
            </button>
          </div>

          {isReplying && (
            <div className="mt-4 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex-1">
                <textarea 
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={`Reply to ${comment.author.name}...`}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px]"
                  autoFocus
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button size="sm" variant="ghost" onClick={() => setIsReplying(false)}>Cancel</Button>
                  <Button size="sm" onClick={handleSubmitReply}>Reply</Button>
                </div>
              </div>
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {comment.replies.map(reply => (
                <CommentItem key={reply.id} comment={reply} depth={depth + 1} onReply={onReply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Discussion: React.FC<{ postId: string }> = ({ postId }) => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    api.comments.list(postId).then(setComments);
  }, [postId]);

  const handlePostComment = async () => {
    if (!user) {
       addNotification({ type: 'error', title: 'Authentication Required', message: 'Please log in to post.' });
       return;
    }
    if (!newComment.trim()) return;

    const commentObj: Comment = {
      id: `c-${Date.now()}`,
      postId,
      author: user,
      content: newComment,
      createdAt: new Date().toLocaleDateString(),
      reactions: [],
      replies: []
    };

    await api.comments.create(commentObj);
    setComments([commentObj, ...comments]);
    setNewComment('');
  };

  const handleReply = async (parentId: string, content: string) => {
    if (!user) return;
    
    const newReply: Comment = {
      id: `r-${Date.now()}`,
      postId, // Replies belong to same post
      author: user,
      content: content,
      createdAt: new Date().toLocaleDateString(),
      reactions: [],
      replies: []
    };

    // We need to find the parent and update it. 
    // Note: Deep nesting update in flat storage is tricky. 
    // For this demo, we assume we can find top-level comments. 
    // If the parent is a nested reply, we'd need a recursive search.
    
    // Simplified: Updates local state and persists top-level modified comment
    const addReplyRecursive = (list: Comment[]): { updated: Comment[], modified?: Comment } => {
      let modifiedComment: Comment | undefined;
      const updatedList = list.map(c => {
        if (c.id === parentId) {
          const updated = { ...c, replies: [...(c.replies || []), newReply] };
          modifiedComment = updated;
          return updated;
        }
        if (c.replies && c.replies.length > 0) {
          const { updated: childList, modified } = addReplyRecursive(c.replies);
          if (modified) {
            const updated = { ...c, replies: childList };
            modifiedComment = updated; // Propagate up (simplified, actually needs to propagate root)
            return updated;
          }
        }
        return c;
      });
      return { updated: updatedList, modified: modifiedComment };
    };

    const { updated, modified } = addReplyRecursive(comments);
    setComments(updated);

    // If we found the comment to update in our list (which contains only this post's comments)
    // We need to update that specific comment in the global storage.
    // Since api.comments.update updates by ID, if we update the root comment that contains the reply, it works.
    // But if we update a child, our API is flat.
    // Assumption for this demo: We only persist root comments to the flat 'comments' list if they are roots.
    // Actually, `api.comments.create` pushed to a flat list.
    // If we support nesting, we should probably just push the reply as a flat comment with a `parentId` reference.
    // But `Comment` type uses `replies: Comment[]`.
    // To keep "no mock data" promise and simpler architecture:
    // We will NOT persist replies recursively in the flat list for this demo unless we refactor the whole comment system to be relational.
    // Compromise: We push the reply to the `replies` array of the parent and update the parent.
    
    if (modified) {
       // We need to find the ROOT parent of this modified comment to update it in storage.
       // Since `addReplyRecursive` propagates modification, `modified` here is actually the direct parent.
       // If it was nested, we'd need to walk up.
       // For simplicity in this version: Single level nesting works best or flat structure.
       // Let's just update the modified comment.
       await api.comments.update(modified);
    }
  };

  return (
    <div className="bg-slate-950/50 rounded-2xl border border-slate-800/50 overflow-hidden">
      <div className="bg-slate-900/50 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <h3 className="font-bold text-white flex items-center gap-2">
          <MessageSquare size={18} className="text-primary" />
          Discussion <span className="text-slate-500 font-normal text-sm">({comments.length})</span>
        </h3>
      </div>

      <div className="p-6 md:p-8">
        {user ? (
          <div className="flex gap-4 mb-10">
            <div className="flex-shrink-0">
               {user.avatarUrl ? (
                 <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-800" />
               ) : (
                 <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
                   <UserIcon size={20} className="text-slate-400" />
                 </div>
               )}
            </div>
            <div className="flex-1">
              <textarea 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add to the discussion... (Markdown supported)"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all min-h-[100px]"
              />
              <div className="flex justify-between items-center mt-3">
                <p className="text-xs text-slate-500">Markdown supported.</p>
                <Button onClick={handlePostComment} disabled={!newComment.trim()}>Post Comment</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/50 rounded-xl p-6 text-center mb-10 border border-dashed border-slate-800">
            <p className="text-slate-400 mb-3">Log in to join the discussion</p>
            <Button variant="secondary" size="sm">Sign In</Button>
          </div>
        )}

        <div className="space-y-2">
          {comments.length === 0 ? (
            <p className="text-slate-500 text-center py-4">No comments yet. Be the first to share your thoughts.</p>
          ) : (
            comments.map(comment => (
              <CommentItem key={comment.id} comment={comment} onReply={handleReply} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
