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
      matches: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          match_data: Json | null
          match_number: number
          player1_id: string | null
          player2_id: string | null
          round_number: number
          scheduled_time: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["match_status"] | null
          tournament_id: string | null
          winner_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          match_data?: Json | null
          match_number: number
          player1_id?: string | null
          player2_id?: string | null
          round_number: number
          scheduled_time?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["match_status"] | null
          tournament_id?: string | null
          winner_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          match_data?: Json | null
          match_number?: number
          player1_id?: string | null
          player2_id?: string | null
          round_number?: number
          scheduled_time?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["match_status"] | null
          tournament_id?: string | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_player1_id_fkey"
            columns: ["player1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_player2_id_fkey"
            columns: ["player2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          epic_games_id: string | null
          fortnite_username: string | null
          id: string
          skill_rating: number | null
          total_tournaments: number | null
          total_winnings: number | null
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          epic_games_id?: string | null
          fortnite_username?: string | null
          id: string
          skill_rating?: number | null
          total_tournaments?: number | null
          total_winnings?: number | null
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          epic_games_id?: string | null
          fortnite_username?: string | null
          id?: string
          skill_rating?: number | null
          total_tournaments?: number | null
          total_winnings?: number | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      tournament_participants: {
        Row: {
          eliminated_at: string | null
          final_placement: number | null
          id: string
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          registration_time: string | null
          seed_number: number | null
          tournament_id: string | null
          user_id: string | null
        }
        Insert: {
          eliminated_at?: string | null
          final_placement?: number | null
          id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          registration_time?: string | null
          seed_number?: number | null
          tournament_id?: string | null
          user_id?: string | null
        }
        Update: {
          eliminated_at?: string | null
          final_placement?: number | null
          id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          registration_time?: string | null
          seed_number?: number | null
          tournament_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_participants_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          created_at: string | null
          creator_id: string
          current_participants: number | null
          description: string | null
          end_time: string | null
          entry_fee: number | null
          game_mode: string | null
          id: string
          island_code: string | null
          max_participants: number
          prize_pool: number | null
          registration_deadline: string | null
          rules: string | null
          start_time: string | null
          status: Database["public"]["Enums"]["tournament_status"] | null
          title: string
          tournament_format: Database["public"]["Enums"]["tournament_format"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          current_participants?: number | null
          description?: string | null
          end_time?: string | null
          entry_fee?: number | null
          game_mode?: string | null
          id?: string
          island_code?: string | null
          max_participants: number
          prize_pool?: number | null
          registration_deadline?: string | null
          rules?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["tournament_status"] | null
          title: string
          tournament_format: Database["public"]["Enums"]["tournament_format"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          current_participants?: number | null
          description?: string | null
          end_time?: string | null
          entry_fee?: number | null
          game_mode?: string | null
          id?: string
          island_code?: string | null
          max_participants?: number
          prize_pool?: number | null
          registration_deadline?: string | null
          rules?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["tournament_status"] | null
          title?: string
          tournament_format?: Database["public"]["Enums"]["tournament_format"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          processed_at: string | null
          stripe_payment_intent_id: string | null
          tournament_id: string | null
          transaction_type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          processed_at?: string | null
          stripe_payment_intent_id?: string | null
          tournament_id?: string | null
          transaction_type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          processed_at?: string | null
          stripe_payment_intent_id?: string | null
          tournament_id?: string | null
          transaction_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      match_status: "scheduled" | "in_progress" | "completed" | "disputed"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      tournament_format:
        | "single_elimination"
        | "double_elimination"
        | "round_robin"
        | "swiss"
      tournament_status:
        | "draft"
        | "open"
        | "in_progress"
        | "completed"
        | "cancelled"
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
      match_status: ["scheduled", "in_progress", "completed", "disputed"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      tournament_format: [
        "single_elimination",
        "double_elimination",
        "round_robin",
        "swiss",
      ],
      tournament_status: [
        "draft",
        "open",
        "in_progress",
        "completed",
        "cancelled",
      ],
    },
  },
} as const
