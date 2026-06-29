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
      events: {
        Row: {
          created_at: string
          date_label: string | null
          description: string | null
          id: string
          image_url: string | null
          sort_order: number
          title: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          date_label?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          sort_order?: number
          title: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          date_label?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          sort_order: number
          tags: string[] | null
          title: string | null
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          sort_order?: number
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          sort_order?: number
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: string
          sort_order: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price?: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      page_blocks: {
        Row: {
          created_at: string
          data: Json
          id: string
          sort_order: number
          type: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          sort_order?: number
          type: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          sort_order?: number
          type?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      personality_profiles: {
        Row: {
          color_from: string | null
          color_to: string | null
          description: string | null
          drink: string | null
          key: string
          label: string
          sort_order: number
          spot: string | null
          tagline: string | null
          traits: string[] | null
          updated_at: string
        }
        Insert: {
          color_from?: string | null
          color_to?: string | null
          description?: string | null
          drink?: string | null
          key: string
          label: string
          sort_order?: number
          spot?: string | null
          tagline?: string | null
          traits?: string[] | null
          updated_at?: string
        }
        Update: {
          color_from?: string | null
          color_to?: string | null
          description?: string | null
          drink?: string | null
          key?: string
          label?: string
          sort_order?: number
          spot?: string | null
          tagline?: string | null
          traits?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string
          id: string
          name: string
          sort_order: number
          text: string
          type: string | null
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          sort_order?: number
          text: string
          type?: string | null
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
          text?: string
          type?: string | null
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      media_files: {
        Row: {
          created_at: string
          folder: string
          id: string
          mime_type: string | null
          name: string
          size_bytes: number
          storage_path: string
          tags: string[] | null
        }
        Insert: {
          created_at?: string
          folder?: string
          id?: string
          mime_type?: string | null
          name: string
          size_bytes?: number
          storage_path: string
          tags?: string[] | null
        }
        Update: {
          created_at?: string
          folder?: string
          id?: string
          mime_type?: string | null
          name?: string
          size_bytes?: number
          storage_path?: string
          tags?: string[] | null
        }
        Relationships: []
      }
      test_responses: {
        Row: {
          answers: Json
          completed_at: string
          created_at: string
          id: string
          result: string
          tied: string[] | null
          user_age: number | null
          user_full_name: string | null
          user_gender: string | null
          user_phone: string | null
        }
        Insert: {
          answers?: Json
          completed_at?: string
          created_at?: string
          id?: string
          result: string
          tied?: string[] | null
          user_age?: number | null
          user_full_name?: string | null
          user_gender?: string | null
          user_phone?: string | null
        }
        Update: {
          answers?: Json
          completed_at?: string
          created_at?: string
          id?: string
          result?: string
          tied?: string[] | null
          user_age?: number | null
          user_full_name?: string | null
          user_gender?: string | null
          user_phone?: string | null
        }
        Relationships: []
      }
      page_views: {
        Row: {
          id: string
          path: string | null
          referrer: string | null
          user_agent: string | null
          visited_at: string
        }
        Insert: {
          id?: string
          path?: string | null
          referrer?: string | null
          user_agent?: string | null
          visited_at?: string
        }
        Update: {
          id?: string
          path?: string | null
          referrer?: string | null
          user_agent?: string | null
          visited_at?: string
        }
        Relationships: []
      }
      theme_settings: {
        Row: {
          accent_color: string
          background_color: string
          border_radius: string
          glass_opacity: number
          id: number
          primary_color: string
          secondary_color: string
          text_color: string
          text_secondary_color: string
          text_tertiary_color: string
          updated_at: string
        }
        Insert: {
          accent_color?: string
          background_color?: string
          border_radius?: string
          glass_opacity?: number
          id?: number
          primary_color?: string
          secondary_color?: string
          text_color?: string
          text_secondary_color?: string
          text_tertiary_color?: string
          updated_at?: string
        }
        Update: {
          accent_color?: string
          background_color?: string
          border_radius?: string
          glass_opacity?: number
          id?: number
          primary_color?: string
          secondary_color?: string
          text_color?: string
          text_secondary_color?: string
          text_tertiary_color?: string
          updated_at?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
