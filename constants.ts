import { Post, PostType, PostStatus, UserRole, User, Comment } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Chen',
  email: 'alex@nomadlabs.dev',
  role: UserRole.ADMIN, // Changed to ADMIN to show the panel
  expertise: ['DSP', 'Rust', 'WASM', 'React'], // Added React to trigger recommendations
  avatarUrl: 'https://picsum.photos/seed/alex/200/200',
  bio: 'Audio systems engineer specializing in low-latency web audio.'
};

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    slug: 'real-time-granular-synthesis-wasm',
    title: 'Real-time Granular Synthesis with Rust & WASM',
    subtitle: 'Achieving sub-3ms latency in the browser using AudioWorklets.',
    type: PostType.PAPER,
    status: PostStatus.PUBLISHED,
    author: MOCK_USER,
    authorId: 'u1',
    content: `
# Introduction

Granular synthesis involves dividing an audio sample into short distinct sounds, called grains. These grains typically range from 1 to 100 ms in duration.

## The Challenge of Web Audio

Traditionally, the JavaScript main thread is too unstable for high-density granular synthesis. Garbage collection pauses can cause audible glitches.

### Architecture

We propose a shared-memory ring buffer architecture using \`SharedArrayBuffer\` to communicate between the UI thread and the AudioWorklet processor.

\`\`\`rust
// Simplified Rust Processor
pub struct Granulator {
    grains: Vec<Grain>,
    buffer: Arc<AudioBuffer>,
}

impl Granulator {
    pub fn process(&mut self, output: &mut [f32]) {
        for sample in output.iter_mut() {
            *sample = self.sum_active_grains();
        }
    }
}
\`\`\`

## Benchmarks

Initial tests show a 400% performance improvement over pure JavaScript implementations.
    `,
    abstract: 'This paper explores the performance characteristics of Rust-compiled WebAssembly modules within the AudioWorklet scope, specifically focusing on high-density granular synthesis engines.',
    publishedAt: '2023-10-15',
    readTimeMinutes: 12,
    tags: [
      { id: 't1', name: 'WASM', slug: 'wasm', type: 'TECH' },
      { id: 't2', name: 'DSP', slug: 'dsp', type: 'TOPIC' },
      { id: 't3', name: 'Rust', slug: 'rust', type: 'STACK' }
    ],
    version: '1.2.0',
    citations: 14
  },
  {
    id: 'p2',
    slug: 'optimizing-react-renders-audio-ui',
    title: 'Optimizing React Renders for Audio Visualizers',
    subtitle: 'Techniques for 60fps canvas drawing without blocking the main thread.',
    type: PostType.ARTICLE,
    status: PostStatus.PUBLISHED,
    author: { ...MOCK_USER, name: 'Sarah Jenkins', id: 'u2' },
    authorId: 'u2',
    content: '...',
    publishedAt: '2023-11-02',
    readTimeMinutes: 6,
    tags: [
      { id: 't4', name: 'React', slug: 'react', type: 'STACK' },
      { id: 't5', name: 'Canvas', slug: 'canvas', type: 'TECH' }
    ]
  },
  {
    id: 'p3',
    slug: 'lab-note-fourier-experiments',
    title: 'Lab Note: FFT Window Function Artifacts',
    type: PostType.LAB_NOTE,
    status: PostStatus.PUBLISHED,
    author: MOCK_USER,
    authorId: 'u1',
    content: 'Just noticed some interesting spectral leakage when using a Hamming window on short buffers (< 128 samples). Needs more investigation. Using a Blackman-Harris window seems to resolve most of the low-frequency aliasing I was seeing in the spectrograph.',
    publishedAt: '2023-11-05',
    readTimeMinutes: 2,
    tags: [
      { id: 't2', name: 'DSP', slug: 'dsp', type: 'TOPIC' }
    ]
  },
  {
    id: 'p4',
    slug: 'generative-music-transformers',
    title: 'Generative Music with Transformers',
    subtitle: 'Using small language models to generate MIDI sequences in real-time.',
    type: PostType.PAPER,
    status: PostStatus.PUBLISHED,
    author: { ...MOCK_USER, name: 'Dr. Aris Thorne', id: 'u5' },
    authorId: 'u5',
    content: '...',
    abstract: 'An exploration of attention mechanisms applied to symbolic music generation, optimized for edge devices.',
    publishedAt: '2023-11-10',
    readTimeMinutes: 15,
    tags: [
      { id: 't6', name: 'AI', slug: 'ai', type: 'TOPIC' },
      { id: 't7', name: 'Python', slug: 'python', type: 'STACK' }
    ],
    version: '0.9.0'
  }
];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    author: { ...MOCK_USER, name: 'Marcus V', id: 'u3', avatarUrl: undefined },
    content: 'Have you considered using a lock-free circular buffer for the grain scheduling? I found it reduces jitter significantly in Chrome.',
    createdAt: '2 hours ago',
    reactions: [
      { type: 'LIKE', count: 5, userHasReacted: true },
      { type: 'BRAIN', count: 2, userHasReacted: false }
    ],
    replies: [
      {
        id: 'c2',
        author: MOCK_USER,
        content: 'That is a great point. We actually tried `rtrb` crate initially but ran into some ownership issues with the WASM bridge. Do you have a reference implementation?',
        createdAt: '1 hour ago',
        reactions: [
          { type: 'LIKE', count: 1, userHasReacted: false }
        ]
      }
    ]
  },
  {
    id: 'c3',
    author: { ...MOCK_USER, name: 'Elena R', id: 'u4', avatarUrl: undefined },
    content: 'The benchmarks on Firefox seem a bit low. Are you using SIMD instructions in the Rust compilation profile?',
    createdAt: '5 hours ago',
    reactions: [
      { type: 'FIRE', count: 3, userHasReacted: false }
    ]
  }
];