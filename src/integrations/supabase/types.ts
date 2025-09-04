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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      audio_tracks: {
        Row: {
          created_at: string
          duration: string | null
          id: string
          is_custom: boolean
          name: string
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration?: string | null
          id?: string
          is_custom?: boolean
          name: string
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration?: string | null
          id?: string
          is_custom?: boolean
          name?: string
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      cards: {
        Row: {
          color_hex: string | null
          created_at: string
          created_by: string
          description: string | null
          file_url: string | null
          gradient_from: string | null
          gradient_to: string | null
          id: string
          link_image: string | null
          link_title: string | null
          link_url: string | null
          order_index: number | null
          pinned: boolean | null
          title: string
          updated_at: string | null
          updated_by: string | null
          z_index: number | null
        }
        Insert: {
          color_hex?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          file_url?: string | null
          gradient_from?: string | null
          gradient_to?: string | null
          id?: string
          link_image?: string | null
          link_title?: string | null
          link_url?: string | null
          order_index?: number | null
          pinned?: boolean | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
          z_index?: number | null
        }
        Update: {
          color_hex?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          file_url?: string | null
          gradient_from?: string | null
          gradient_to?: string | null
          id?: string
          link_image?: string | null
          link_title?: string | null
          link_url?: string | null
          order_index?: number | null
          pinned?: boolean | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
          z_index?: number | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          is_approved: boolean
          model_id: string
          sender_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_approved?: boolean
          model_id: string
          sender_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_approved?: boolean
          model_id?: string
          sender_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      domain_settings: {
        Row: {
          api_configuration: Json
          base_domain: string
          created_at: string
          dns_provider: string
          id: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          api_configuration?: Json
          base_domain?: string
          created_at?: string
          dns_provider?: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          api_configuration?: Json
          base_domain?: string
          created_at?: string
          dns_provider?: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      magazine_access: {
        Row: {
          access_config: Json
          access_type: string
          created_at: string
          id: string
          is_active: boolean | null
          magazine_id: string
          updated_at: string
        }
        Insert: {
          access_config: Json
          access_type: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          magazine_id: string
          updated_at?: string
        }
        Update: {
          access_config?: Json
          access_type?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          magazine_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      magazine_domains: {
        Row: {
          created_at: string
          domain_url: string
          id: string
          is_active: boolean
          magazine_id: string
          subdomain: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          domain_url: string
          id?: string
          is_active?: boolean
          magazine_id: string
          subdomain: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          domain_url?: string
          id?: string
          is_active?: boolean
          magazine_id?: string
          subdomain?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "magazine_domains_magazine_id_fkey"
            columns: ["magazine_id"]
            isOneToOne: false
            referencedRelation: "magazines"
            referencedColumns: ["id"]
          },
        ]
      }
      magazine_enhancements: {
        Row: {
          created_at: string
          enhancement_data: Json
          enhancement_type: string
          height: number | null
          id: string
          is_active: boolean | null
          magazine_id: string
          page_number: number
          position_x: number | null
          position_y: number | null
          updated_at: string
          width: number | null
        }
        Insert: {
          created_at?: string
          enhancement_data: Json
          enhancement_type: string
          height?: number | null
          id?: string
          is_active?: boolean | null
          magazine_id: string
          page_number: number
          position_x?: number | null
          position_y?: number | null
          updated_at?: string
          width?: number | null
        }
        Update: {
          created_at?: string
          enhancement_data?: Json
          enhancement_type?: string
          height?: number | null
          id?: string
          is_active?: boolean | null
          magazine_id?: string
          page_number?: number
          position_x?: number | null
          position_y?: number | null
          updated_at?: string
          width?: number | null
        }
        Relationships: []
      }
      magazine_leads: {
        Row: {
          additional_data: Json | null
          created_at: string
          email: string | null
          id: string
          magazine_id: string
          name: string
          whatsapp: string
        }
        Insert: {
          additional_data?: Json | null
          created_at?: string
          email?: string | null
          id?: string
          magazine_id: string
          name: string
          whatsapp: string
        }
        Update: {
          additional_data?: Json | null
          created_at?: string
          email?: string | null
          id?: string
          magazine_id?: string
          name?: string
          whatsapp?: string
        }
        Relationships: []
      }
      magazines: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          pages_data: Json
          thumbnail_url: string | null
          title: string
          total_pages: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          is_active?: boolean | null
          pages_data: Json
          thumbnail_url?: string | null
          title: string
          total_pages?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          pages_data?: Json
          thumbnail_url?: string | null
          title?: string
          total_pages?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      models: {
        Row: {
          access_code: string
          avatar_url: string | null
          created_at: string
          display_name: string
          id: string
          is_active: boolean
          updated_at: string
          username: string
        }
        Insert: {
          access_code?: string
          avatar_url?: string | null
          created_at?: string
          display_name: string
          id?: string
          is_active?: boolean
          updated_at?: string
          username: string
        }
        Update: {
          access_code?: string
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      page_access: {
        Row: {
          access_granted_at: string | null
          created_at: string
          expires_at: string | null
          has_access: boolean
          id: string
          page_id: string
          payment_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          access_granted_at?: string | null
          created_at?: string
          expires_at?: string | null
          has_access?: boolean
          id?: string
          page_id: string
          payment_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          access_granted_at?: string | null
          created_at?: string
          expires_at?: string | null
          has_access?: boolean
          id?: string
          page_id?: string
          payment_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_access_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      page_likes: {
        Row: {
          created_at: string
          id: string
          page_id: string
          updated_at: string
          user_fingerprint: string | null
          user_id: string | null
          user_ip: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          page_id: string
          updated_at?: string
          user_fingerprint?: string | null
          user_id?: string | null
          user_ip?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          page_id?: string
          updated_at?: string
          user_fingerprint?: string | null
          user_id?: string | null
          user_ip?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          created_at: string
          id: string
          status: string
          transaction_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string
          transaction_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          transaction_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reading_progress: {
        Row: {
          created_at: string
          current_page: number
          id: string
          last_read_at: string
          magazine_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_page?: number
          id?: string
          last_read_at?: string
          magazine_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_page?: number
          id?: string
          last_read_at?: string
          magazine_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          created_at: string
          event_type: string
          id: string
          payload: Json
          processed_at: string
          source: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          payload: Json
          processed_at?: string
          source: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json
          processed_at?: string
          source?: string
        }
        Relationships: []
      }
      whatsapp_registrations: {
        Row: {
          created_at: string
          hoopay_payment_id: string | null
          hoopay_transaction_data: Json | null
          id: string
          payment_confirmed_at: string | null
          phone: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          hoopay_payment_id?: string | null
          hoopay_transaction_data?: Json | null
          id?: string
          payment_confirmed_at?: string | null
          phone: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          hoopay_payment_id?: string | null
          hoopay_transaction_data?: Json | null
          id?: string
          payment_confirmed_at?: string | null
          phone?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      exec_sql: {
        Args: { sql: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
