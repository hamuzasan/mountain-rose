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
      admin_profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          role?: string | null
        }
        Relationships: []
      }
      brand_story: {
        Row: {
          craftsmanship_text: string | null
          craftsmanship_title: string | null
          created_at: string | null
          cta_text: string | null
          cta_title: string | null
          id: string
          image_url: string | null
          intro: string | null
          leather_text: string | null
          leather_title: string | null
          rose_text: string | null
          rose_title: string | null
          subtitle: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          craftsmanship_text?: string | null
          craftsmanship_title?: string | null
          created_at?: string | null
          cta_text?: string | null
          cta_title?: string | null
          id?: string
          image_url?: string | null
          intro?: string | null
          leather_text?: string | null
          leather_title?: string | null
          rose_text?: string | null
          rose_title?: string | null
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          craftsmanship_text?: string | null
          craftsmanship_title?: string | null
          created_at?: string | null
          cta_text?: string | null
          cta_title?: string | null
          id?: string
          image_url?: string | null
          intro?: string | null
          leather_text?: string | null
          leather_title?: string | null
          rose_text?: string | null
          rose_title?: string | null
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      collections: {
        Row: {
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          id: string
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      homepage_content: {
        Row: {
          created_at: string | null
          cta_text: string | null
          cta_title: string | null
          hero_image_url: string | null
          hero_subtitle: string | null
          hero_title: string | null
          id: string
          story_section_text: string | null
          story_section_title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          cta_text?: string | null
          cta_title?: string | null
          hero_image_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          story_section_text?: string | null
          story_section_title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          cta_text?: string | null
          cta_title?: string | null
          hero_image_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          story_section_text?: string | null
          story_section_title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leather_care_articles: {
        Row: {
          content: string | null
          cover_image_url: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          published_at: string | null
          slug: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      product_images: {
        Row: {
          alt: string | null
          created_at: string | null
          id: string
          product_id: string | null
          public_url: string
          sort_order: number | null
          storage_path: string
        }
        Insert: {
          alt?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          public_url: string
          sort_order?: number | null
          storage_path: string
        }
        Update: {
          alt?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          public_url?: string
          sort_order?: number | null
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          collection_id: string | null
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          is_available: boolean | null
          is_featured: boolean | null
          leather_type: string | null
          material: string | null
          name: string
          price: number | null
          price_amount: number | null
          price_currency: string | null
          price_note: string | null
          seo_description: string | null
          seo_title: string | null
          short_description: string | null
          size: string | null
          slug: string
          source_pdf_page: number | null
          status: string | null
          updated_at: string | null
          whatsapp_message: string | null
        }
        Insert: {
          category: string
          collection_id?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_available?: boolean | null
          is_featured?: boolean | null
          leather_type?: string | null
          material?: string | null
          name: string
          price?: number | null
          price_amount?: number | null
          price_currency?: string | null
          price_note?: string | null
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          size?: string | null
          slug: string
          source_pdf_page?: number | null
          status?: string | null
          updated_at?: string | null
          whatsapp_message?: string | null
        }
        Update: {
          category?: string
          collection_id?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_available?: boolean | null
          is_featured?: boolean | null
          leather_type?: string | null
          material?: string | null
          name?: string
          price?: number | null
          price_amount?: number | null
          price_currency?: string | null
          price_note?: string | null
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          size?: string | null
          slug?: string
          source_pdf_page?: number | null
          status?: string | null
          updated_at?: string | null
          whatsapp_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          address: string | null
          brand_name: string
          created_at: string | null
          email: string | null
          id: string
          instagram_url: string | null
          logo_url: string | null
          tagline: string | null
          updated_at: string | null
          whatsapp_number: string | null
        }
        Insert: {
          address?: string | null
          brand_name?: string
          created_at?: string | null
          email?: string | null
          id?: string
          instagram_url?: string | null
          logo_url?: string | null
          tagline?: string | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          address?: string | null
          brand_name?: string
          created_at?: string | null
          email?: string | null
          id?: string
          instagram_url?: string | null
          logo_url?: string | null
          tagline?: string | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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

