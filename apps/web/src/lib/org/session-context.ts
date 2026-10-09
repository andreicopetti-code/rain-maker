import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';

type OrgMembership = {
  organization_id: string;
  role: Database['public']['Enums']['user_role'];
};

/** Deduplica auth + org no mesmo request RSC (várias páginas/helpers). */
export const getSessionContext = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, org: null as OrgMembership | null };
  }

  const { data: orgRows } = await supabase.rpc('get_user_organization', {
    p_user_id: user.id,
  });
  const row = orgRows?.[0];
  const org: OrgMembership | null = row
    ? { organization_id: row.organization_id, role: row.role }
    : null;

  return { supabase, user, org };
});
