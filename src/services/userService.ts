import { supabase } from '@/lib/supabase/client';
import { createClient } from '@/lib/supabase/server';
import { storageService, STORAGE_BUCKETS } from './storageService';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface UserSettings {
  id: string;
  language: string | null;
  theme: string | null;
  notifications: boolean | null;
  email_notifications: boolean | null;
  auto_save: boolean | null;
  default_view: string | null;
  primary_color: string | null;
  font_size: string | null;
  animations_enabled: boolean | null;
  two_factor_auth: boolean | null;
  session_timeout: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface UserProfileUpdate {
  full_name?: string;
  avatar_url?: string;
}

export interface UserSettingsUpdate {
  language?: string;
  theme?: string;
  notifications?: boolean;
  email_notifications?: boolean;
  auto_save?: boolean;
  default_view?: string;
  primary_color?: string;
  font_size?: string;
  animations_enabled?: boolean;
  two_factor_auth?: boolean;
  session_timeout?: number;
}

// Serviço para o cliente (browser)
export const userService = {
  /**
   * Obtém o perfil do usuário atual
   */
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) {
      console.error('Erro ao obter perfil do usuário:', error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Obtém as configurações do usuário atual
   */
  async getCurrentUserSettings(): Promise<UserSettings | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) {
      console.error('Erro ao obter configurações do usuário:', error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Atualiza o perfil do usuário
   */
  async updateUserProfile(userId: string, profile: UserProfileUpdate): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', userId)
      .select()
      .single();
      
    if (error) {
      console.error('Erro ao atualizar perfil do usuário:', error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Atualiza as configurações do usuário
   */
  async updateUserSettings(userId: string, settings: UserSettingsUpdate): Promise<UserSettings> {
    const { data, error } = await supabase
      .from('user_settings')
      .update(settings)
      .eq('id', userId)
      .select()
      .single();
      
    if (error) {
      console.error('Erro ao atualizar configurações do usuário:', error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Faz upload de um avatar para o usuário
   */
  async uploadAvatar(userId: string, file: File): Promise<string> {
    try {
      // 1. Fazer upload do arquivo para o bucket de avatares
      const filePath = await storageService.uploadFile({
        bucket: STORAGE_BUCKETS.AVATARS,
        file: file,
        path: `${userId}/${Date.now()}-${file.name.replace(/\s+/g, '_')}`,
        upsert: true
      });
      
      // 2. Obter a URL pública do avatar
      const avatarUrl = storageService.getPublicUrl(STORAGE_BUCKETS.AVATARS, filePath);
      
      // 3. Atualizar o perfil do usuário com a nova URL do avatar
      await this.updateUserProfile(userId, { avatar_url: avatarUrl });
      
      return avatarUrl;
    } catch (error) {
      console.error('Erro ao fazer upload do avatar:', error);
      throw error;
    }
  }
};

// Serviço para o servidor
export const serverUserService = {
  /**
   * Obtém o perfil de um usuário pelo ID (servidor)
   */
  async getUserProfileById(userId: string): Promise<UserProfile | null> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error(`Erro ao obter perfil do usuário ${userId}:`, error);
      return null;
    }
    
    return data;
  },
  
  /**
   * Obtém as configurações de um usuário pelo ID (servidor)
   */
  async getUserSettingsById(userId: string): Promise<UserSettings | null> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error(`Erro ao obter configurações do usuário ${userId}:`, error);
      return null;
    }
    
    return data;
  },
  
  /**
   * Lista todos os usuários (apenas para administradores)
   */
  async getAllUsers(): Promise<UserProfile[]> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Erro ao listar usuários:', error);
      throw error;
    }
    
    return data;
  }
}; 