import { supabase } from '../../lib/supabaseClient'

export async function getChemicals() {
  const { data, error } = await supabase
    .from('chemicals')
    .select('*, experiments(name, courses(name, code))')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function addChemical(payload) {
  const { data, error } = await supabase
    .from('chemicals')
    .insert([payload])
    .select()
  if (error) throw error
  return data[0]
}

export async function updateChemical(id, payload) {
  const { data, error } = await supabase
    .from('chemicals')
    .update(payload)
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

export async function deleteChemical(id) {
  const { error } = await supabase.from('chemicals').delete().eq('id', id)
  if (error) throw error
}
