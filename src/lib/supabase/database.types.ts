
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "comments": {
                  Row: {
                    "author_id": string,"content": string,"created_at": string,"devlog_id": string,"id": string
                  }
                  Insert: {
                    "author_id": string,"content": string,"created_at"?: string,"devlog_id": string,"id"?: string
                  }
                  Update: {
                    "author_id"?: string,"content"?: string,"created_at"?: string,"devlog_id"?: string,"id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "comments_author_id_fkey"
      columns: ["author_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "comments_devlog_id_fkey"
      columns: ["devlog_id"]
isOneToOne: false
      referencedRelation: "devlogs"
      referencedColumns: ["id"]
    }
                  ]
                },"devlog_media": {
                  Row: {
                    "created_at": string,"devlog_id": string,"id": string,"position": number,"size_bytes": number,"storage_path": string,"type": Database["public"]['Enums']["media_type"]
                  }
                  Insert: {
                    "created_at"?: string,"devlog_id": string,"id"?: string,"position"?: number,"size_bytes": number,"storage_path": string,"type": Database["public"]['Enums']["media_type"]
                  }
                  Update: {
                    "created_at"?: string,"devlog_id"?: string,"id"?: string,"position"?: number,"size_bytes"?: number,"storage_path"?: string,"type"?: Database["public"]['Enums']["media_type"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "devlog_media_devlog_id_fkey"
      columns: ["devlog_id"]
isOneToOne: false
      referencedRelation: "devlogs"
      referencedColumns: ["id"]
    }
                  ]
                },"devlogs": {
                  Row: {
                    "content_md": string,"created_at": string,"id": string,"project_id": string,"published_at": string | null,"slug": string,"status": Database["public"]['Enums']["devlog_status"],"title": string,"updated_at": string,"youtube_url": string | null
                  }
                  Insert: {
                    "content_md"?: string,"created_at"?: string,"id"?: string,"project_id": string,"published_at"?: string | null,"slug": string,"status"?: Database["public"]['Enums']["devlog_status"],"title": string,"updated_at"?: string,"youtube_url"?: string | null
                  }
                  Update: {
                    "content_md"?: string,"created_at"?: string,"id"?: string,"project_id"?: string,"published_at"?: string | null,"slug"?: string,"status"?: Database["public"]['Enums']["devlog_status"],"title"?: string,"updated_at"?: string,"youtube_url"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "devlogs_project_id_fkey"
      columns: ["project_id"]
isOneToOne: false
      referencedRelation: "projects"
      referencedColumns: ["id"]
    }
                  ]
                },"profiles": {
                  Row: {
                    "avatar_path": string | null,"banner_path": string | null,"bio": string | null,"created_at": string,"display_name": string | null,"id": string,"links": NonNullable<Json>,"location": string | null,"pronouns": string | null,"theme": NonNullable<Json>,"username": string
                  }
                  Insert: {
                    "avatar_path"?: string | null,"banner_path"?: string | null,"bio"?: string | null,"created_at"?: string,"display_name"?: string | null,"id": string,"links"?: NonNullable<Json>,"location"?: string | null,"pronouns"?: string | null,"theme"?: NonNullable<Json>,"username": string
                  }
                  Update: {
                    "avatar_path"?: string | null,"banner_path"?: string | null,"bio"?: string | null,"created_at"?: string,"display_name"?: string | null,"id"?: string,"links"?: NonNullable<Json>,"location"?: string | null,"pronouns"?: string | null,"theme"?: NonNullable<Json>,"username"?: string
                  }
                  Relationships: [
                    
                  ]
                },"projects": {
                  Row: {
                    "cover_path": string | null,"created_at": string,"description": string | null,"engine": Database["public"]['Enums']["game_engine"],"id": string,"links": NonNullable<Json>,"owner_id": string,"slug": string,"status": Database["public"]['Enums']["project_status"],"title": string,"updated_at": string
                  }
                  Insert: {
                    "cover_path"?: string | null,"created_at"?: string,"description"?: string | null,"engine"?: Database["public"]['Enums']["game_engine"],"id"?: string,"links"?: NonNullable<Json>,"owner_id": string,"slug": string,"status"?: Database["public"]['Enums']["project_status"],"title": string,"updated_at"?: string
                  }
                  Update: {
                    "cover_path"?: string | null,"created_at"?: string,"description"?: string | null,"engine"?: Database["public"]['Enums']["game_engine"],"id"?: string,"links"?: NonNullable<Json>,"owner_id"?: string,"slug"?: string,"status"?: Database["public"]['Enums']["project_status"],"title"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "projects_owner_id_fkey"
      columns: ["owner_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "is_devlog_published":
{ Args: { "p_devlog_id": string }; Returns: boolean
                           },
"is_valid_theme":
{ Args: { "t": Json }; Returns: boolean
                           },
"owns_devlog":
{ Args: { "p_devlog_id": string }; Returns: boolean
                           },
"owns_project":
{ Args: { "p_project_id": string }; Returns: boolean
                           },
"path_segment_uuid":
{ Args: { "p_index": number,"p_name": string }; Returns: string
                           }
          }
          Enums: {
            "devlog_status": "draft"|"published","game_engine": "godot"|"unity"|"unreal"|"other","media_type": "image"|"gif"|"model","project_status": "idea"|"in_development"|"released"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            "devlog_status": ["draft", "published"],"game_engine": ["godot", "unity", "unreal", "other"],"media_type": ["image", "gif", "model"],"project_status": ["idea", "in_development", "released"]
          }
        }
} as const

