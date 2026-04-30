import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function AppLayout({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('w-full max-w-screen overflow-x-hidden', className)}>{children}</div>;
}

