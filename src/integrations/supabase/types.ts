export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      account_risk_flags: {
        Row: {
          created_at: string
          evidence: Json
          id: string
          kind: string
          resolution_note: string | null
          resolved_at: string | null
          resolved_by: string | null
          score: number
          user_id: string
        }
        Insert: {
          created_at?: string
          evidence?: Json
          id?: string
          kind: string
          resolution_note?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          score?: number
          user_id: string
        }
        Update: {
          created_at?: string
          evidence?: Json
          id?: string
          kind?: string
          resolution_note?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          score?: number
          user_id?: string
        }
        Relationships: []
      }
      active_sessions: {
        Row: {
          created_at: string
          device_id: string
          device_label: string | null
          geo_city: string | null
          geo_country: string | null
          geo_lat: number | null
          geo_lon: number | null
          geo_region: string | null
          id: string
          ip_inet: unknown
          last_seen_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_id: string
          device_label?: string | null
          geo_city?: string | null
          geo_country?: string | null
          geo_lat?: number | null
          geo_lon?: number | null
          geo_region?: string | null
          id?: string
          ip_inet?: unknown
          last_seen_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_id?: string
          device_label?: string | null
          geo_city?: string | null
          geo_country?: string | null
          geo_lat?: number | null
          geo_lon?: number | null
          geo_region?: string | null
          id?: string
          ip_inet?: unknown
          last_seen_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          autor: string
          blocos: Json
          created_at: string
          fontes: Json
          leitura_min: number
          publicado_em: string | null
          resumo: string
          slug: string
          status: string
          tags: string[]
          titulo: string
          updated_at: string
        }
        Insert: {
          autor?: string
          blocos?: Json
          created_at?: string
          fontes?: Json
          leitura_min?: number
          publicado_em?: string | null
          resumo: string
          slug: string
          status?: string
          tags?: string[]
          titulo: string
          updated_at?: string
        }
        Update: {
          autor?: string
          blocos?: Json
          created_at?: string
          fontes?: Json
          leitura_min?: number
          publicado_em?: string | null
          resumo?: string
          slug?: string
          status?: string
          tags?: string[]
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_topics: {
        Row: {
          ativo: boolean
          created_at: string
          fontes_sugeridas: string[]
          id: string
          prioridade: number
          prompt: string
          tags: string[]
          titulo_sugerido: string
          usado_em: string | null
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          fontes_sugeridas?: string[]
          id?: string
          prioridade?: number
          prompt: string
          tags?: string[]
          titulo_sugerido: string
          usado_em?: string | null
        }
        Update: {
          ativo?: boolean
          created_at?: string
          fontes_sugeridas?: string[]
          id?: string
          prioridade?: number
          prompt?: string
          tags?: string[]
          titulo_sugerido?: string
          usado_em?: string | null
        }
        Relationships: []
      }
      calc_history: {
        Row: {
          created_at: string
          id: string
          inputs: Json
          pais: string
          resultado: Json
          rotulo: string | null
          tipo: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          inputs?: Json
          pais: string
          resultado?: Json
          rotulo?: string | null
          tipo: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          inputs?: Json
          pais?: string
          resultado?: Json
          rotulo?: string | null
          tipo?: string
          user_id?: string
        }
        Relationships: []
      }
      calc_leads: {
        Row: {
          created_at: string
          data_nasc: string | null
          email: string
          id: string
          nome: string
          notas: string | null
          pais: string | null
          referer: string | null
          resultado_caso: string | null
          sexo: string | null
          status: string
          telefone: string
          tempo_brasil_meses: number | null
          tempo_pais_meses: number | null
          tipo: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          data_nasc?: string | null
          email: string
          id?: string
          nome: string
          notas?: string | null
          pais?: string | null
          referer?: string | null
          resultado_caso?: string | null
          sexo?: string | null
          status?: string
          telefone: string
          tempo_brasil_meses?: number | null
          tempo_pais_meses?: number | null
          tipo?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          data_nasc?: string | null
          email?: string
          id?: string
          nome?: string
          notas?: string | null
          pais?: string | null
          referer?: string | null
          resultado_caso?: string | null
          sexo?: string | null
          status?: string
          telefone?: string
          tempo_brasil_meses?: number | null
          tempo_pais_meses?: number | null
          tipo?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      downloads_log: {
        Row: {
          country: string
          downloaded_at: string
          file_path: string
          id: string
          user_id: string
        }
        Insert: {
          country: string
          downloaded_at?: string
          file_path: string
          id?: string
          user_id: string
        }
        Update: {
          country?: string
          downloaded_at?: string
          file_path?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      hub_favoritos: {
        Row: {
          created_at: string
          id: string
          pais: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          pais: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          pais?: string
          user_id?: string
        }
        Relationships: []
      }
      hub_laudos: {
        Row: {
          caso: string | null
          cliente_cpf: string | null
          cliente_nome: string | null
          created_at: string
          id: string
          pais: string | null
          payload: Json
          ref: string
          rmi_valor: number | null
          tipo: string | null
          user_id: string
        }
        Insert: {
          caso?: string | null
          cliente_cpf?: string | null
          cliente_nome?: string | null
          created_at?: string
          id?: string
          pais?: string | null
          payload: Json
          ref: string
          rmi_valor?: number | null
          tipo?: string | null
          user_id: string
        }
        Update: {
          caso?: string | null
          cliente_cpf?: string | null
          cliente_nome?: string | null
          created_at?: string
          id?: string
          pais?: string | null
          payload?: Json
          ref?: string
          rmi_valor?: number | null
          tipo?: string | null
          user_id?: string
        }
        Relationships: []
      }
      hub_notas: {
        Row: {
          conteudo: string
          created_at: string
          id: string
          pais: string
          updated_at: string
          user_id: string
        }
        Insert: {
          conteudo?: string
          created_at?: string
          id?: string
          pais: string
          updated_at?: string
          user_id: string
        }
        Update: {
          conteudo?: string
          created_at?: string
          id?: string
          pais?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      session_events: {
        Row: {
          device_id: string
          event_type: string
          geo_city: string | null
          geo_country: string | null
          geo_lat: number | null
          geo_lon: number | null
          geo_region: string | null
          id: string
          ip_inet: unknown
          occurred_at: string
          user_id: string
        }
        Insert: {
          device_id: string
          event_type: string
          geo_city?: string | null
          geo_country?: string | null
          geo_lat?: number | null
          geo_lon?: number | null
          geo_region?: string | null
          id?: string
          ip_inet?: unknown
          occurred_at?: string
          user_id: string
        }
        Update: {
          device_id?: string
          event_type?: string
          geo_city?: string | null
          geo_country?: string | null
          geo_lat?: number | null
          geo_lon?: number | null
          geo_region?: string | null
          id?: string
          ip_inet?: unknown
          occurred_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          id: string
          lifetime_access: boolean
          price_id: string | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          id?: string
          lifetime_access?: boolean
          price_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          id?: string
          lifetime_access?: boolean
          price_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_session: {
        Args: {
          p_city?: string
          p_country?: string
          p_device_id: string
          p_device_label?: string
          p_ip?: string
          p_lat?: number
          p_lon?: number
          p_region?: string
          p_user_agent?: string
        }
        Returns: Json
      }
      cleanup_old_session_events: { Args: never; Returns: undefined }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      detect_geo_anomalies: { Args: { p_user_id: string }; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      get_founder_count: { Args: never; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      haversine_km: {
        Args: { lat1: number; lat2: number; lon1: number; lon2: number }
        Returns: number
      }
      heartbeat_session: {
        Args: {
          p_city?: string
          p_country?: string
          p_device_id: string
          p_ip?: string
          p_lat?: number
          p_lon?: number
          p_region?: string
        }
        Returns: Json
      }
      is_pro: { Args: { _user_id: string }; Returns: boolean }
      list_my_devices: {
        Args: never
        Returns: {
          created_at: string
          device_id: string
          device_label: string
          geo_city: string
          geo_country: string
          is_active: boolean
          last_seen_at: string
          user_agent: string
        }[]
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      release_other_sessions: { Args: { p_device_id: string }; Returns: Json }
      release_session: { Args: { p_device_id: string }; Returns: Json }
    }
    Enums: {
      app_role: "subscriber" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["subscriber", "admin"],
    },
  },
} as const
