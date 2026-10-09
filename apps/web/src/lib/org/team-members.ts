import { cache } from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import type { OrgMember } from '@/components/board/types';
import { memberDisplayName } from '@/lib/org/member-display';

export { memberDisplayName };

/** Membros ativos da org com nome (perfil) ou e-mail como fallback. */
export const loadOrgMembers = cache(async (orgId: string): Promise<OrgMember[]> => {
  const supabase = await createClient();
  const { data: memberRows } = await supabase
    .from('organization_members')
    .select('user_id')
    .eq('organization_id', orgId)
    .eq('is_active', true)
    .not('accepted_at', 'is', null);

  const userIds = (memberRows ?? []).map((m) => m.user_id);
  if (!userIds.length) return [];

  const admin = createAdminClient();
  const { data: profiles } = await admin
    .from('profiles')
    .select('id, full_name')
    .in('id', userIds);

  const nameByUser = new Map((profiles ?? []).map((p) => [p.id, p.full_name]));

  // Só busca e-mail no Auth quando não há nome — evita N round-trips desnecessários.
  const needsEmail = userIds.filter((uid) => !nameByUser.get(uid)?.trim());
  const emailByUser = new Map<string, string | null>();

  if (needsEmail.length) {
    const emailResults = await Promise.all(
      needsEmail.map(async (uid) => {
        try {
          const { data: authUser } = await admin.auth.admin.getUserById(uid);
          return [uid, authUser.user?.email ?? null] as const;
        } catch {
          return [uid, null] as const;
        }
      }),
    );
    for (const [uid, email] of emailResults) {
      emailByUser.set(uid, email);
    }
  }

  return userIds.map((uid) => ({
    user_id: uid,
    full_name: nameByUser.get(uid) ?? null,
    email: emailByUser.get(uid) ?? null,
  }));
});
