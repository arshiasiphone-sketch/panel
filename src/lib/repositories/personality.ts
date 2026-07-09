/**
 * Personality repository — encapsulates personality_profiles table operations.
 */
import { BaseRepository, type RepositoryDependencies } from "./base";
import type { PaginatedOptions } from "./base";
import type { Database } from "@/integrations/supabase/types";
import { personalityProfileUpdateSchema } from "@/lib/cms-schemas";

type PersonalityRow = Database["public"]["Tables"]["personality_profiles"]["Row"];
type PersonalityInsert = Database["public"]["Tables"]["personality_profiles"]["Insert"];
type PersonalityUpdate = Database["public"]["Tables"]["personality_profiles"]["Update"];

const SELECT_COLUMNS = "key,label,tagline,description,traits,drink,spot,color_from,color_to,sort_order,updated_at" as const;

export class PersonalityRepository extends BaseRepository {
  constructor(deps: RepositoryDependencies) {
    super(deps);
  }

  async getAll(opts?: PaginatedOptions): Promise<PersonalityRow[]> {
    try {
      let query = this.withWorkspace(
        this.db
          .from<PersonalityRow>("personality_profiles")
          .select(SELECT_COLUMNS)
          .order("sort_order"),
      );
      query = this.applyPagination(query, opts);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    } catch (err) {
      throw this.normalizeError("personality_profiles", "getAll", err, { opts });
    }
  }

  /**
   * Install personality profiles from blueprint data.
   * Uses upsert by key (primary key) for idempotency.
   * Tracks created keys in the resource map.
   */
  async installBlueprintPersonalities(
    profiles: Array<{
      key: string; label: string; tagline: string; description: string;
      traits: string[]; drink?: string; spot?: string;
      colorFrom?: string; colorTo?: string;
    }>,
    resourceMap?: import("../core/provision/session-context").ProvisionResourceMap,
  ): Promise<string[]> {
    const keys: string[] = [];

    for (const profile of profiles) {
      const upsertProfile = {
        key: profile.key,
        label: profile.label,
        tagline: profile.tagline,
        description: profile.description,
        traits: profile.traits,
        drink: profile.drink ?? null,
        spot: profile.spot ?? null,
        color_from: profile.colorFrom ?? null,
        color_to: profile.colorTo ?? null,
        sort_order: keys.length,
      };
      if (this.workspaceId) (upsertProfile as PersonalityInsert & { workspace_id?: string }).workspace_id = this.workspaceId;
      const { error } = await this.db.from("personality_profiles").upsert(upsertProfile);

      if (error) {
        if ((error as { code?: string }).code === "23505") continue;
        throw this.normalizeError("personality_profiles", "installBlueprintPersonalities", error);
      }
      keys.push(profile.key);

      if (resourceMap) {
        resourceMap.personalityKeys.push(profile.key);
      }
    }

    return keys;
  }

  async upsert(row: PersonalityRow): Promise<void> {
    try {
      this.validateOrThrow(personalityProfileUpdateSchema, { ...row }, "personality_profiles");
      const insertRow = this.workspaceId ? { ...row, workspace_id: this.workspaceId } : row;
      const { error } = await this.db
        .from("personality_profiles")
        .upsert(insertRow as PersonalityInsert);
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("personality_profiles", "upsert", err);
    }
  }

  /**
   * Batch delete personality profiles by keys.
   */
  async batchDelete(keys: string[]): Promise<void> {
    if (keys.length === 0) return;
    try {
      const { error } = await this.withWorkspace(
        this.db.from("personality_profiles").delete().in("key", keys),
      );
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("personality_profiles", "batchDelete", err, { count: keys.length });
    }
  }

  async update(key: string, patch: Partial<PersonalityUpdate>): Promise<void> {
    try {
      this.validateOrThrow(personalityProfileUpdateSchema, patch, "personality_profiles.update");
      const { error } = await this.withWorkspace(
        this.db.from("personality_profiles").update(patch as PersonalityUpdate).eq("key", key),
      );
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("personality_profiles", "update", err, { key });
    }
  }
}
