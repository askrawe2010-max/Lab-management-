import { supabase } from '../../lib/supabaseClient'

export async function getCourses() {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function addCourse({ name, code }) {
  const { data, error } = await supabase
    .from('courses')
    .insert([{ name, code }])
    .select()
  if (error) throw error
  return data[0]
}

export async function updateCourse(id, { name, code }) {
  const { data, error } = await supabase
    .from('courses')
    .update({ name, code })
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

export async function deleteCourse(id) {
  const { error } = await supabase.from('courses').delete().eq('id', id)
  if (error) throw error
}
