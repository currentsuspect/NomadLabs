
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { ArrowRight, Sparkles, Zap, Bookmark, Globe, PlusCircle } from 'lucide-react';
import { PostCard } from '../components/PostCard';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { Post } from '../types';

// --- Advanced Physics Background Component ---
const MusicNotesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const SYMBOLS = ['♩', '♪', '♫', '♬', '♭', '♯', '𝄞', '𝄢', '𝄡'];

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
      size: number;
    }

    interface Note {
      id: number;
      x: number;
      y: number;
      size: number;
      symbol: string;
      vx: number;
      vy: number;
      rotation: number;
      vRot: number;
      baseAlpha: number;
      active: boolean;
    }

    const notes: Note[] = [];
    const particles: Particle[] = [];

    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      notes.length = 0;

      const gridSize = 120;
      const cols = Math.floor(width / gridSize);
      const rows = Math.floor(height / gridSize);

      let idCounter = 0;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (Math.random() > 0.3) continue;

          const cellX = c * gridSize;
          const cellY = r * gridSize;

          const x = cellX + Math.random() * (gridSize - 40) + 20;
          const y = cellY + Math.random() * (gridSize - 40) + 20;

          notes.push({
            id: idCounter++,
            x: x,
            y: y,
            size: Math.random() * 20 + 16,
            symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            vx: (Math.random() - 0.5) * 0.15,
            vy: (Math.random() - 0.5) * 0.15,
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.005,
            baseAlpha: Math.random() * 0.15 + 0.05,
            active: true
          });
        }
      }
    };

    const onResize = () => init();

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const onClick = (e: MouseEvent) => {
      const mx = e.clientX;
      const my = e.clientY;

      for (let i = notes.length - 1; i >= 0; i--) {
        const note = notes[i];
        if (!note.active) continue;

        const dx = note.x - mx;
        const dy = note.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 50) {
          note.active = false;
          for (let j = 0; j < 8; j++) {
            particles.push({
              x: note.x,
              y: note.y,
              vx: (Math.random() - 0.5) * 6,
              vy: (Math.random() - 0.5) * 6,
              life: 1,
              color: '129, 140, 248',
              size: Math.random() * 2 + 1
            });
          }
          break;
        }
      }
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onClick);
    init();

    let animationId: number;

    const update = () => {
      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        if (!note.active) continue;

        note.x += note.vx;
        note.y += note.vy;
        note.rotation += note.vRot;

        const dx = note.x - mx;
        const dy = note.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const isHovered = dist < 120;

        if (isHovered) {
          const force = (120 - dist) / 120;
          const angle = Math.atan2(dy, dx);
          note.x += Math.cos(angle) * force * 1.5;
          note.y += Math.sin(angle) * force * 1.5;
        }

        if (note.x < -50) note.x = width + 50;
        else if (note.x > width + 50) note.x = -50;

        if (note.y < -50) note.y = height + 50;
        else if (note.y > height + 50) note.y = -50;

        ctx.save();
        ctx.translate(note.x, note.y);
        ctx.rotate(note.rotation);
        ctx.font = `${note.size}px "Times New Roman", serif`;

        if (isHovered) {
          ctx.fillStyle = `rgba(165, 180, 252, ${Math.min(1, note.baseAlpha + 0.8)})`;
          ctx.shadowColor = `rgba(129, 140, 248, 0.8)`;
          ctx.shadowBlur = 15;
        } else {
          ctx.fillStyle = `rgba(71, 85, 105, ${note.baseAlpha})`;
          ctx.shadowBlur = 0;
        }

        ctx.fillText(note.symbol, 0, 0);
        ctx.restore();
      }

      if (particles.length > 0) {
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.03;

          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.fillStyle = `rgba(129, 140, 248, ${p.life})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onClick);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-auto" />;
};

export const HomeView: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.posts.list();
        setPosts(data.filter(p => p.status === 'PUBLISHED'));
      } catch (e) {
        console.error("Failed to load posts:", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Featured Logic: Try to find explicitly featured, then papers, then just the first post
  const featuredPost = posts.find(p => p.featured) || posts.find(p => p.type === 'PAPER') || posts[0];

  // Pinned Logic: Exclude the featured one to avoid duplication
  const pinnedPosts = posts.filter(p => p.pinned && p.id !== featuredPost?.id);

  // --- Advanced Recommendation Engine ---
  const getRecommendedPosts = () => {
    if (!user) return [];

    const scoredPosts = posts
      .filter(post => post.id !== featuredPost?.id && !pinnedPosts.find(p => p.id === post.id))
      .map(post => {
        let score = 0;
        if (user.followingUsers?.includes(post.authorId)) score += 5;
        post.tags.forEach(tag => {
          if (user.followingTags?.includes(tag.name)) score += 3;
        });
        post.tags.forEach(tag => {
          if (user.expertise.some(exp => exp.toLowerCase() === tag.name.toLowerCase())) score += 1;
        });
        return { post, score };
      });

    return scoredPosts
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.post)
      .slice(0, 3);
  };

  const recommendedPosts = getRecommendedPosts();

  // Latest feed logic
  const latestPosts = posts.filter(p =>
    p.id !== featuredPost?.id &&
    !pinnedPosts.find(pinned => pinned.id === p.id) &&
    !recommendedPosts.find(r => r.id === p.id)
  ).slice(0, 6);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Initializing Lab...</div>;
  }

  return (
    <div className="relative min-h-screen">
      <MusicNotesBackground />

      <div className="relative z-10 space-y-20 fade-in pb-20 pointer-events-none">

        {/* 0. Empty State (System Start) */}
        {!featuredPost && (
          <section className="relative pt-4 pointer-events-auto min-h-[60vh] flex flex-col justify-center">
            <div className="relative overflow-hidden rounded-3xl border-2 border-white/10 bg-slate-900/60 backdrop-blur-2xl p-8 md:p-14 lg:p-16 shadow-2xl text-center">
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="inline-flex items-center gap-2 text-emerald-400 text-sm font-bold tracking-widest uppercase">
                  <Zap size={16} /> System Online
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                  Welcome to <span className="text-indigo-500">Nomad Labs</span>
                </h1>
                <p className="text-xl text-slate-300 leading-relaxed">
                  The platform is live and ready. Be the first to publish your research, experiments, and lab notes to the community.
                </p>
                <div className="flex justify-center gap-4 pt-4">
                  <Link to="/lab/new">
                    <Button size="lg" className="shadow-xl shadow-indigo-500/20">
                      <PlusCircle size={18} className="mr-2" /> Submit First Entry
                    </Button>
                  </Link>
                  {!user && (
                    <Link to="/auth">
                      <Button variant="secondary" size="lg">Join the Lab</Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 1. Hero / Featured Section */}
        {featuredPost && (
          <section className="relative pt-4 pointer-events-auto">
            <div className="relative overflow-hidden rounded-3xl border-2 border-white/10 bg-slate-900/60 backdrop-blur-2xl p-8 md:p-14 lg:p-16 shadow-2xl">

              <div className="grid md:grid-cols-3 gap-12 items-center">
                <div className="md:col-span-2 relative z-10 space-y-8">
                  <div className="inline-flex items-center gap-2 text-indigo-400 text-sm font-bold tracking-widest uppercase">
                    <Zap size={16} /> Featured Research
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                    {featuredPost.title}
                  </h1>

                  <p className="text-xl text-slate-300 leading-relaxed max-w-2xl border-l-2 border-indigo-500/50 pl-6">
                    {featuredPost.abstract || featuredPost.subtitle}
                  </p>

                  <div className="flex items-center gap-4 pt-4">
                    <Link
                      to={`/read/${featuredPost.slug}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-white text-slate-950 px-8 py-4 text-base font-bold hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-900/20"
                    >
                      Read Paper <ArrowRight size={18} />
                    </Link>
                    {featuredPost.readTimeMinutes && (
                      <span className="text-sm text-slate-400 ml-2 font-mono">{featuredPost.readTimeMinutes} min read</span>
                    )}
                  </div>
                </div>

                <div className="hidden md:flex justify-center items-center">
                  <div className="relative h-72 w-72 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-slate-500/20 animate-[spin_20s_linear_infinite]"></div>
                    <div className="absolute inset-8 rounded-full border border-slate-400/20 animate-[spin_15s_linear_infinite_reverse]"></div>
                    <div className="absolute inset-16 rounded-full border border-indigo-500/30 animate-[pulse_4s_ease-in-out_infinite]"></div>
                    <div className="relative z-10 text-center mix-blend-overlay">
                      <div className="text-6xl font-bold text-white/10 tracking-tighter">DSP</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 2. Pinned / Essential Readings */}
        {pinnedPosts.length > 0 && (
          <section className="space-y-8 pointer-events-auto">
            <div className="flex items-center gap-3 text-white text-2xl font-bold tracking-tight">
              <Bookmark size={24} className="text-orange-500" /> Essential Reading
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {pinnedPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* 3. Algorithmic Recommendations */}
        {user && recommendedPosts.length > 0 && (
          <section className="space-y-8 pointer-events-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-white text-2xl font-bold tracking-tight">
                <Sparkles size={24} className="text-purple-500" /> Recommended for You
              </div>
              <div className="hidden md:block text-sm text-slate-500 font-medium">
                Curated from your network & interests
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendedPosts.map(post => (
                <PostCard key={post.id} post={post} isRecommended />
              ))}
            </div>
          </section>
        )}

        {/* 4. Global Feed */}
        {featuredPost && (
          <section className="space-y-8 pointer-events-auto">
            <div className="flex items-center gap-3 text-white text-2xl font-bold tracking-tight">
              <Globe size={24} className="text-sky-500" /> Latest Publications
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}

              {latestPosts.length > 0 && (
                <Link to="/explore" className="group flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/20 p-8 hover:border-indigo-500/50 hover:bg-indigo-900/10 transition-all min-h-[240px]">
                  <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-indigo-600 text-white shadow-xl">
                    <ArrowRight size={28} className="text-slate-400 group-hover:text-white" />
                  </div>
                  <span className="font-medium text-slate-400 group-hover:text-white transition-colors">View All Research</span>
                </Link>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
