'use client';

import { useEffect, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ClientOnlyPortalProps {
  children: ReactNode;
  selector?: string;
}

/**
 * Componente que renderiza seu conteúdo em um portal apenas no lado do cliente,
 * evitando problemas de hidratação relacionados a diferenças entre
 * renderização do servidor e cliente.
 */
export function ClientOnlyPortal({ 
  children, 
  selector = 'body' 
}: ClientOnlyPortalProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  if (!mounted) return null;
  
  const container = document.querySelector(selector);
  if (!container) return null;
  
  return createPortal(children, container);
} 