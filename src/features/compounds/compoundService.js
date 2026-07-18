import { supabase } from '../../lib/supabaseClient'

// المجموعات (Buffer / Mixed Solvent / Unknown Series)
export async function getCompoundGroups(groupType) {
  let query = supabase
    .from('compound_groups')
    .select('*, experiments(name, courses(name, code)), compound_components(*)')
    .order('created_at', { ascending: false })
  if (groupType) {
    query = query.eq('group_type', groupType)
  }
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function addCompoundGroup(payload) {
  const { data, error } = await supabase
    .from('compound_groups')
    .insert([payload])
    .select()
  if (error) throw error
  return data[0]
}

export async function updateCompoundGroup(id, payload) {
  const { data, error } = await supabase
    .from('compound_groups')
    .update(payload)
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

export async function deleteCompoundGroup(id) {
  // حذف المجموعة بيحذف المكونات تلقائياً (on delete cascade)
  const { error } = await supabase.from('compound_groups').delete().eq('id', id)
  if (error) throw error
}

// المكوّنات الفردية داخل كل مجموعة
export async function addComponent(payload) {
  const { data, error } = await supabase
    .from('compound_components')
    .insert([payload])
    .select()
  if (error) throw error
  return data[0]
}

export async function updateComponent(id, payload) {
  const { data, error } = await supabase
    .from('compound_components')
    .update(payload)
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

export async function deleteComponent(id) {
  const { error } = await supabase.from('compound_components').delete().eq('id', id)
  if (error) throw error
}
