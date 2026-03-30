import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.5.51'],
  turbopack: {
    root: '/home/claw/.openclaw/workspace/projects/new-kanban-setup/board-frontend',
  },
  async rewrites() {
    return [
      {
        source: '/api/kanban',
        destination: 'http://127.0.0.1:4311/api/kanban',
      },
      {
        source: '/api/health',
        destination: 'http://127.0.0.1:4311/api/health',
      },
      {
        source: '/api/stories/:id',
        destination: 'http://127.0.0.1:4311/api/stories/:id',
      },
      {
        source: '/api/kanban/move',
        destination: 'http://127.0.0.1:4311/api/kanban/move',
      },
    ];
  },
};

export default nextConfig;
