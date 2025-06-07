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
      activity_logs: {
        Row: {
          activity_type: string
          created_at: string
          data: Json | null
          description: string
          id: string
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          data?: Json | null
          description: string
          id?: string
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          data?: Json | null
          description?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_audit_log: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string | null
          details: Json | null
          id: string
          target_user_id: string | null
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string | null
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Relationships: []
      }
      anti_cheat_reports: {
        Row: {
          created_at: string | null
          details: Json | null
          detection_type: string
          id: string
          severity: string | null
          status: string | null
          tournament_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          detection_type: string
          id?: string
          severity?: string | null
          status?: string | null
          tournament_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          detection_type?: string
          id?: string
          severity?: string | null
          status?: string | null
          tournament_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "anti_cheat_reports_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      content_validation_rules: {
        Row: {
          created_at: string | null
          field_name: string
          id: string
          is_active: boolean | null
          max_length: number | null
          min_length: number | null
          pattern: string | null
        }
        Insert: {
          created_at?: string | null
          field_name: string
          id?: string
          is_active?: boolean | null
          max_length?: number | null
          min_length?: number | null
          pattern?: string | null
        }
        Update: {
          created_at?: string | null
          field_name?: string
          id?: string
          is_active?: boolean | null
          max_length?: number | null
          min_length?: number | null
          pattern?: string | null
        }
        Relationships: []
      }
      crypto_wallets: {
        Row: {
          created_at: string | null
          id: string
          is_verified: boolean | null
          user_id: string
          wallet_address: string
          wallet_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          user_id: string
          wallet_address: string
          wallet_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          user_id?: string
          wallet_address?: string
          wallet_type?: string
        }
        Relationships: []
      }
      friends: {
        Row: {
          addressee_id: string
          created_at: string
          id: string
          requester_id: string
          status: string
          updated_at: string
        }
        Insert: {
          addressee_id: string
          created_at?: string
          id?: string
          requester_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          addressee_id?: string
          created_at?: string
          id?: string
          requester_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "friends_addressee_id_fkey"
            columns: ["addressee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friends_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nft_rewards: {
        Row: {
          contract_address: string | null
          created_at: string | null
          id: string
          metadata_url: string | null
          nft_description: string | null
          nft_name: string
          rarity: string | null
          token_id: string | null
          tournament_id: string | null
          winner_id: string | null
        }
        Insert: {
          contract_address?: string | null
          created_at?: string | null
          id?: string
          metadata_url?: string | null
          nft_description?: string | null
          nft_name: string
          rarity?: string | null
          token_id?: string | null
          tournament_id?: string | null
          winner_id?: string | null
        }
        Update: {
          contract_address?: string | null
          created_at?: string | null
          id?: string
          metadata_url?: string | null
          nft_description?: string | null
          nft_name?: string
          rarity?: string | null
          token_id?: string | null
          tournament_id?: string | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nft_rewards_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string | null
          created_at: string
          data: Json | null
          id: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_metrics: {
        Row: {
          accuracy_percentage: number | null
          damage_dealt: number | null
          id: string
          kills: number | null
          match_id: string | null
          materials_gathered: number | null
          placement: number | null
          recorded_at: string | null
          survival_time: number | null
          tournament_id: string | null
          user_id: string
        }
        Insert: {
          accuracy_percentage?: number | null
          damage_dealt?: number | null
          id?: string
          kills?: number | null
          match_id?: string | null
          materials_gathered?: number | null
          placement?: number | null
          recorded_at?: string | null
          survival_time?: number | null
          tournament_id?: string | null
          user_id: string
        }
        Update: {
          accuracy_percentage?: number | null
          damage_dealt?: number | null
          id?: string
          kills?: number | null
          match_id?: string | null
          materials_gathered?: number | null
          placement?: number | null
          recorded_at?: string | null
          survival_time?: number | null
          tournament_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "performance_metrics_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_metrics_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_currency: {
        Row: {
          balance: number | null
          id: string
          total_earned: number | null
          total_spent: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number | null
          id?: string
          total_earned?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number | null
          id?: string
          total_earned?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      player_analytics: {
        Row: {
          ai_recommendations: Json | null
          id: string
          improvement_areas: Json | null
          last_analysis: string | null
          play_patterns: Json | null
          skill_metrics: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_recommendations?: Json | null
          id?: string
          improvement_areas?: Json | null
          last_analysis?: string | null
          play_patterns?: Json | null
          skill_metrics?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_recommendations?: Json | null
          id?: string
          improvement_areas?: Json | null
          last_analysis?: string | null
          play_patterns?: Json | null
          skill_metrics?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      player_stats: {
        Row: {
          achievements: Json | null
          created_at: string
          id: string
          total_matches: number
          total_tournaments: number
          total_wins: number
          updated_at: string
          user_id: string
          win_rate: number | null
        }
        Insert: {
          achievements?: Json | null
          created_at?: string
          id?: string
          total_matches?: number
          total_tournaments?: number
          total_wins?: number
          updated_at?: string
          user_id: string
          win_rate?: number | null
        }
        Update: {
          achievements?: Json | null
          created_at?: string
          id?: string
          total_matches?: number
          total_tournaments?: number
          total_wins?: number
          updated_at?: string
          user_id?: string
          win_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
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
      sponsored_tournaments: {
        Row: {
          created_at: string | null
          id: string
          logo_placement: string | null
          sponsor_id: string | null
          sponsorship_amount: number | null
          tournament_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          logo_placement?: string | null
          sponsor_id?: string | null
          sponsorship_amount?: number | null
          tournament_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          logo_placement?: string | null
          sponsor_id?: string | null
          sponsorship_amount?: number | null
          tournament_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsored_tournaments_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sponsored_tournaments_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsors: {
        Row: {
          active: boolean | null
          contact_email: string | null
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          sponsor_level: string | null
          website_url: string | null
        }
        Insert: {
          active?: boolean | null
          contact_email?: string | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          sponsor_level?: string | null
          website_url?: string | null
        }
        Update: {
          active?: boolean | null
          contact_email?: string | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          sponsor_level?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      tournament_bets: {
        Row: {
          bet_amount: number
          bet_type: string
          created_at: string | null
          id: string
          odds: number | null
          potential_payout: number | null
          predicted_user_id: string | null
          status: string | null
          tournament_id: string
          user_id: string
        }
        Insert: {
          bet_amount: number
          bet_type: string
          created_at?: string | null
          id?: string
          odds?: number | null
          potential_payout?: number | null
          predicted_user_id?: string | null
          status?: string | null
          tournament_id: string
          user_id: string
        }
        Update: {
          bet_amount?: number
          bet_type?: string
          created_at?: string | null
          id?: string
          odds?: number | null
          potential_payout?: number | null
          predicted_user_id?: string | null
          status?: string | null
          tournament_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_bets_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
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
      tournament_predictions: {
        Row: {
          accuracy_score: number | null
          actual_winner_id: string | null
          confidence_score: number | null
          created_at: string | null
          id: string
          predicted_winner_id: string | null
          prediction_factors: Json | null
          tournament_id: string
        }
        Insert: {
          accuracy_score?: number | null
          actual_winner_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          predicted_winner_id?: string | null
          prediction_factors?: Json | null
          tournament_id: string
        }
        Update: {
          accuracy_score?: number | null
          actual_winner_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          predicted_winner_id?: string | null
          prediction_factors?: Json | null
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_predictions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
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
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          is_active: boolean | null
          notes: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
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
      get_user_highest_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_any_role: {
        Args: {
          _user_id: string
          _roles: Database["public"]["Enums"]["app_role"][]
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      user_has_any_role: {
        Args: {
          _user_id: string
          _roles: Database["public"]["Enums"]["app_role"][]
        }
        Returns: boolean
      }
      user_has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      validate_content_length: {
        Args: { field_name: string; content: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "player"
        | "tournament_organizer"
        | "moderator"
        | "support_staff"
        | "financial_manager"
        | "platform_administrator"
        | "super_admin"
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
      app_role: [
        "player",
        "tournament_organizer",
        "moderator",
        "support_staff",
        "financial_manager",
        "platform_administrator",
        "super_admin",
      ],
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
