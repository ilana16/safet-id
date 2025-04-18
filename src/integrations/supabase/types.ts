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
      condition_interactions: {
        Row: {
          description: string
          drug_id: string | null
          id: string
        }
        Insert: {
          description: string
          drug_id?: string | null
          id?: string
        }
        Update: {
          description?: string
          drug_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "condition_interactions_drug_id_fkey"
            columns: ["drug_id"]
            isOneToOne: false
            referencedRelation: "drugs"
            referencedColumns: ["id"]
          },
        ]
      }
      drug_imprints: {
        Row: {
          description: string | null
          drug_id: string | null
          id: string
          image_url: string | null
          imprint_code: string | null
        }
        Insert: {
          description?: string | null
          drug_id?: string | null
          id?: string
          image_url?: string | null
          imprint_code?: string | null
        }
        Update: {
          description?: string | null
          drug_id?: string | null
          id?: string
          image_url?: string | null
          imprint_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drug_imprints_drug_id_fkey"
            columns: ["drug_id"]
            isOneToOne: false
            referencedRelation: "drugs"
            referencedColumns: ["id"]
          },
        ]
      }
      drug_interactions: {
        Row: {
          created_at: string | null
          drug_id: string | null
          id: string
          interaction: string
          level: string | null
        }
        Insert: {
          created_at?: string | null
          drug_id?: string | null
          id?: string
          interaction: string
          level?: string | null
        }
        Update: {
          created_at?: string | null
          drug_id?: string | null
          id?: string
          interaction?: string
          level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drug_interactions_drug_id_fkey"
            columns: ["drug_id"]
            isOneToOne: false
            referencedRelation: "drugs"
            referencedColumns: ["id"]
          },
        ]
      }
      drugs: {
        Row: {
          breastfeeding: string | null
          classification: string | null
          consumer_info: string | null
          created_at: string | null
          dosage: string | null
          drug_class: string | null
          generic: string | null
          id: string
          interactions: Json | null
          name: string
          otc: boolean | null
          pregnancy: string | null
          side_effects: string | null
          slug: string | null
        }
        Insert: {
          breastfeeding?: string | null
          classification?: string | null
          consumer_info?: string | null
          created_at?: string | null
          dosage?: string | null
          drug_class?: string | null
          generic?: string | null
          id?: string
          interactions?: Json | null
          name: string
          otc?: boolean | null
          pregnancy?: string | null
          side_effects?: string | null
          slug?: string | null
        }
        Update: {
          breastfeeding?: string | null
          classification?: string | null
          consumer_info?: string | null
          created_at?: string | null
          dosage?: string | null
          drug_class?: string | null
          generic?: string | null
          id?: string
          interactions?: Json | null
          name?: string
          otc?: boolean | null
          pregnancy?: string | null
          side_effects?: string | null
          slug?: string | null
        }
        Relationships: []
      }
      food_interactions: {
        Row: {
          description: string
          drug_id: string | null
          id: string
        }
        Insert: {
          description: string
          drug_id?: string | null
          id?: string
        }
        Update: {
          description?: string
          drug_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_interactions_drug_id_fkey"
            columns: ["drug_id"]
            isOneToOne: false
            referencedRelation: "drugs"
            referencedColumns: ["id"]
          },
        ]
      }
      international_names: {
        Row: {
          country: string
          drug_id: string | null
          id: string
          name: string
        }
        Insert: {
          country: string
          drug_id?: string | null
          id?: string
          name: string
        }
        Update: {
          country?: string
          drug_id?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "international_names_drug_id_fkey"
            columns: ["drug_id"]
            isOneToOne: false
            referencedRelation: "drugs"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_profiles: {
        Row: {
          created_at: string
          data: Json
          id: string
          section: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data: Json
          id?: string
          section: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          section?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      medications: {
        Row: {
          breastfeeding: string | null
          condition_interactions: string[] | null
          description: string | null
          dosage: Json | null
          drug_class: string | null
          food_interactions: string[] | null
          forms: string[] | null
          generic_name: string | null
          id: string
          interaction_classifications: Json | null
          interaction_severity: Json | null
          interactions: string[] | null
          name: string
          pregnancy: string | null
          prescription_only: boolean | null
          search_count: number | null
          searched_at: string
          searched_by: string | null
          side_effects: Json | null
          source: string | null
          therapeutic_duplications: string[] | null
          used_for: string[] | null
          warnings: string[] | null
        }
        Insert: {
          breastfeeding?: string | null
          condition_interactions?: string[] | null
          description?: string | null
          dosage?: Json | null
          drug_class?: string | null
          food_interactions?: string[] | null
          forms?: string[] | null
          generic_name?: string | null
          id?: string
          interaction_classifications?: Json | null
          interaction_severity?: Json | null
          interactions?: string[] | null
          name: string
          pregnancy?: string | null
          prescription_only?: boolean | null
          search_count?: number | null
          searched_at?: string
          searched_by?: string | null
          side_effects?: Json | null
          source?: string | null
          therapeutic_duplications?: string[] | null
          used_for?: string[] | null
          warnings?: string[] | null
        }
        Update: {
          breastfeeding?: string | null
          condition_interactions?: string[] | null
          description?: string | null
          dosage?: Json | null
          drug_class?: string | null
          food_interactions?: string[] | null
          forms?: string[] | null
          generic_name?: string | null
          id?: string
          interaction_classifications?: Json | null
          interaction_severity?: Json | null
          interactions?: string[] | null
          name?: string
          pregnancy?: string | null
          prescription_only?: boolean | null
          search_count?: number | null
          searched_at?: string
          searched_by?: string | null
          side_effects?: Json | null
          source?: string | null
          therapeutic_duplications?: string[] | null
          used_for?: string[] | null
          warnings?: string[] | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      therapeutic_duplications: {
        Row: {
          description: string
          drug_id: string | null
          id: string
        }
        Insert: {
          description: string
          drug_id?: string | null
          id?: string
        }
        Update: {
          description?: string
          drug_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "therapeutic_duplications_drug_id_fkey"
            columns: ["drug_id"]
            isOneToOne: false
            referencedRelation: "drugs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_drug_by_name: {
        Args: { drug_name: string }
        Returns: {
          id: string
          name: string
          generic: string
          drug_class: string
          otc: boolean
          consumer_info: string
          side_effects: string
          dosage: string
          pregnancy: string
          breastfeeding: string
          classification: string
        }[]
      }
      get_drug_interactions: {
        Args: { drug_id: string }
        Returns: {
          id: string
          level: string
          interaction: string
          created_at: string
        }[]
      }
      search_drugs: {
        Args: { search_term: string; result_limit: number }
        Returns: {
          id: string
          name: string
          generic: string
          drug_class: string
          otc: boolean
        }[]
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
    Enums: {},
  },
} as const
