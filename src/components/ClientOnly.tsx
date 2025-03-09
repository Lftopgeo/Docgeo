'use client';

import { useEffect, useState, ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
}

/**
 * Componente que renderiza seu conteúdo apenas no lado do cliente,
 * evitando problemas de hidratação relacionados a diferenças entre
 * renderização do servidor e cliente.
 */
export function ClientOnly({ children }: ClientOnlyProps) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) return null;
  
  return <>{children}</>;
} 