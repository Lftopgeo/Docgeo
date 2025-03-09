"use client";

import { TempoDevtools } from "tempo-devtools";
import { useEffect } from "react";

export function TempoInit() {
  useEffect(() => {
    // Verificar se estamos no cliente e se a variável de ambiente está definida
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_TEMPO) {
      try {
        TempoDevtools.init();
      } catch (error) {
        console.warn('Erro ao inicializar TempoDevtools:', error);
      }
    }
  }, []);

  return null;
}