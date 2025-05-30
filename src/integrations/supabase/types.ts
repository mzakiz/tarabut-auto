export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      dealership_signups: {
        Row: {
          created_at: string | null
          dealership_name: string
          email: string
          id: string
          name: string
          phone: string
        }
        Insert: {
          created_at?: string | null
          dealership_name: string
          email: string
          id?: string
          name: string
          phone: string
        }
        Update: {
          created_at?: string | null
          dealership_name?: string
          email?: string
          id?: string
          name?: string
          phone?: string
        }
        Relationships: []
      }
      document_uploads: {
        Row: {
          confidence_score: number | null
          document_type: string
          error_message: string | null
          extracted_data: Json | null
          file_name: string
          file_path: string
          file_size: number
          id: string
          processed_at: string | null
          processing_status: string
          uploaded_at: string
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          document_type: string
          error_message?: string | null
          extracted_data?: Json | null
          file_name: string
          file_path: string
          file_size: number
          id?: string
          processed_at?: string | null
          processing_status?: string
          uploaded_at?: string
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          document_type?: string
          error_message?: string | null
          extracted_data?: Json | null
          file_name?: string
          file_path?: string
          file_size?: number
          id?: string
          processed_at?: string | null
          processing_status?: string
          uploaded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          created_at: string | null
          email_to: string
          id: string
          metadata: Json | null
          status: string
          template: Database["public"]["Enums"]["email_template_type"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email_to: string
          id?: string
          metadata?: Json | null
          status: string
          template: Database["public"]["Enums"]["email_template_type"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email_to?: string
          id?: string
          metadata?: Json | null
          status?: string
          template?: Database["public"]["Enums"]["email_template_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "waitlist_users"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist_users: {
        Row: {
          created_at: string | null
          display_alias: string | null
          email: string
          id: string
          name: string
          phone: string
          points: number
          position: number
          referral_code: string
          referrer_code: string | null
          status_id: string
          updated_at: string | null
          variant: string | null
        }
        Insert: {
          created_at?: string | null
          display_alias?: string | null
          email: string
          id?: string
          name: string
          phone: string
          points?: number
          position: number
          referral_code: string
          referrer_code?: string | null
          status_id?: string
          updated_at?: string | null
          variant?: string | null
        }
        Update: {
          created_at?: string | null
          display_alias?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string
          points?: number
          position?: number
          referral_code?: string
          referrer_code?: string | null
          status_id?: string
          updated_at?: string | null
          variant?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_display_alias: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_next_waitlist_position: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_user_tier: {
        Args: { user_points: number }
        Returns: string
      }
    }
    Enums: {
      email_template_type:
        | "waitlist_confirmation"
        | "dealership_confirmation"
        | "status_update"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      email_template_type: [
        "waitlist_confirmation",
        "dealership_confirmation",
        "status_update",
      ],
    },
  },
} as const
