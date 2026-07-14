import { supabase } from '../../lib/supabaseClient'

export async function getTerms() {
  const { data, error } = await supabase
    .from('terms')
    .select('*, courses(name, code)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function addTerm({ course_id, term_type, year, start_date }) {
  const { data, error } = await supabase
    .from('terms')
    .insert([{ course_id, term_type, year, start_date }])
    .select()
  if (error) throw error
  return data[0]
}

export async function updateTerm(id, { course_id, term_type, year, start_date }) {
  const { data, error } = await supabase
    .from('terms')
    .update({ course_id, term_type, year, start_date })
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

export async function deleteTerm(id) {
  const { error } = await supabase.from('terms').delete().eq('id', id)
  if (error) throw error
}
