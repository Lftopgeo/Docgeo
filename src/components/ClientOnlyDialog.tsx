'use client';

import { useEffect, useState, ReactNode } from 'react';

interface ClientOnlyDialogProps {
  children: ReactNode;
}

/**
 * Componente que renderiza diálogos apenas no lado do cliente,
 * evitando problemas de hidratação relacionados a diferenças entre
 * renderização do servidor e cliente.
 */
export function ClientOnlyDialog({ children }: ClientOnlyDialogProps) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) return null;
  
  return <>{children}</>;
} 