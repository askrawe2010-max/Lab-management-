import { supabase } from '../../lib/supabaseClient'

export async function getSections() {
  const { data, error } = await supabase
    .from('sections')
    .select('*, terms(term_type, year, courses(name, code))')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function addSection({ term_id, instructor_name, day_of_week, start_time, end_time, student_count, lab_room }) {
  const { data, error } = await supabase
    .from('sections')
    .insert([{ term_id, instructor_name, day_of_week, start_time, end_time, student_count, lab_room }])
    .select()
  if (error) throw error
  return data[0]
}

export async function updateSection(id, { term_id, instructor_name, day_of_week, start_time, end_time, student_count, lab_room }) {
  const { data, error } = await supabase
    .from('sections')
    .update({ term_id, instructor_name, day_of_week, start_time, end_time, student_count, lab_room })
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

export async function deleteSection(id) {
  const { error } = await supabase.from('sections').delete().eq('id', id)
  if (error) throw error
}
