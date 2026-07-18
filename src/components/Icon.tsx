import * as Icons from 'lucide-react';
import type { ComponentType } from 'react';

export function DynamicIcon({ name, className = 'h-5 w-5' }: { name?: string; className?: string }) {
  const Icon = (Icons as unknown as Record<string, ComponentType<{ className?: string }>>)[name || 'Sparkles'] || Icons.Sparkles;
  return <Icon className={className} />;
}
