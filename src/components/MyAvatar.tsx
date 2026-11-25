import React from 'react';
import { Avatar } from './ui';
import { Role, useStore } from '../store';

// The signed-in person's own photo or avatar.
export function MyAvatar({ role, size = 64 }: { role: Role; size?: number }) {
  const { s } = useStore();
  const p = s.photos[role];
  if (!p) return <Avatar size={size} />;
  if (p.kind === 'uri') return <Avatar size={size} uri={p.uri} />;
  return <Avatar size={size} icon={p.icon} bg={p.bg} />;
}
