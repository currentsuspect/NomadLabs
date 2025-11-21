import React, { useState } from 'react';
import { Comment, ReactionType } from '../types';
import { MOCK_COMMENTS } from '../constants';
import { useAuth } from './AuthProvider';
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

const CommentItem: React.FC<{ comment: Comment; depth?: number }> = ({ comment, depth = 0 }) => {
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  
  // Local state for reactions to make them interactive
  const [reactions, setReactions] = useState(comment.reactions);

  const handleReaction = (type: ReactionType) => {
    if (!user) return alert("Please sign in to react.");
    
    setReactions(prev => {
      const existing = prev.find(r => r.type === type);
      if (existing) {
        return prev.map(r => {
          if (r.type === type) {
            return {
              ...r,
              userHasReacted: !r.userHasReacted,
              count: r.userHasReacted ? r.count - 1 : r.count + 1
            };
          }
          return r;
        });
      } else {
        return [...prev, { type, count: 1, userHasReacted: true }];
      }
    });
  };

  return (
    <div className={`group ${depth > 0 ? 'mt-4 pl-6 border-l border-slate-800' : 'py-6 border-b border-slate-800/50 last:border-0'}`}>
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-slate-800 ring-2 ring-slate-800 flex items-center justify-center overflow-hidden">
             {comment.author.avatarUrl ? (
               <img src={comment.author.avatarUrl} alt={comment.author.name} className="h-full w-full object-cover" />
             ) : (
               <UserIcon className="h-5 w-5 text-slate-400" />
             )}
          </div>
        </div>

        {/* Content */}
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

          {/* Actions */}
          <div className="flex items-center gap-4 flex-wrap opacity-90">
            <div className="flex gap-2">
              {['LIKE', 'FIRE', 'BRAIN'].map((type) => {
                const r = reactions.find(x => x.type === type) || { type: type as ReactionType, count: 0, userHasReacted: false };
                // Show if count > 0 or if it's a generic "add reaction" like button
                return (
                   <ReactionButton 
                    key={type}
                    type={type as ReactionType}
                    count={r.count}
                    active={r.userHasReacted}
                    onClick={() => handleReaction(type as ReactionType)}
                  />
                );
              })}
            </div>
            
            <div className="h-4 w-px bg-slate-800"></div>

            <button 
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
            >
              <MessageSquare size={14} />
              Reply
            </button>
          </div>

          {/* Reply Input */}
          {isReplying && (
            <div className="mt-4 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="h-8 w-8 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center">
                <UserIcon size={16} className="text-slate-400" />
              </div>
              <div className="flex-1">
                <textarea 
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={`Reply to ${comment.author.name}...`}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px]"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button size="sm" variant="ghost" onClick={() => setIsReplying(false)}>Cancel</Button>
                  <Button size="sm" onClick={() => { setIsReplying(false); setReplyContent(''); }}>Reply</Button>
                </div>
              </div>
            </div>
          )}

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {comment.replies.map(reply => (
                <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
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
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);

  const handlePostComment = () => {
    if (!newComment.trim() || !user) return;

    const commentObj: Comment = {
      id: `new-${Date.now()}`,
      author: user,
      content: newComment,
      createdAt: 'Just now',
      reactions: [],
      replies: []
    };

    setComments([commentObj, ...comments]);
    setNewComment('');
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
        {/* New Comment Box */}
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
                <p className="text-xs text-slate-500">Markdown supported. Be kind and constructive.</p>
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

        {/* Comments List */}
        <div className="space-y-2">
          {comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
};