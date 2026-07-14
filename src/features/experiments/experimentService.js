import { supabase } from '../../lib/supabaseClient'

export async function getExperiments() {
  const { data, error } = await supabase
    .from('experiments')
    .select('*, courses(name, code)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function addExperiment({ course_id, name, execution_mode }) {
  const { data, error } = await supabase
    .from('experiments')
    .insert([{ course_id, name, execution_mode }])
    .select()
  if (error) throw error
  return data[0]
}

export async function updateExperiment(id, { course_id, name, execution_mode }) {
  const { data, error } = await supabase
    .from('experiments')
    .update({ course_id, name, execution_mode })
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

export async function deleteExperiment(id) {
  const { error } = await supabase.from('experiments').delete().eq('id', id)
  if (error) throw error
}
