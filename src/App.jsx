import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'

function App() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCourses() {
      const { data, error } = await supabase.from('courses').select('*')
      if (error) {
        console.error('Error fetching courses:', error)
      } else {
        setCourses(data)
      }
      setLoading(false)
    }
    fetchCourses()
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Chem Lab Calc</h1>
      <h2>المساقات (Courses)</h2>
      {loading ? (
        <p>جاري التحميل...</p>
      ) : courses.length === 0 ? (
        <p>لا توجد مساقات مضافة بعد.</p>
      ) : (
        <ul>
          {courses.map((course) => (
            <li key={course.id}>
              {course.name} ({course.code})
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
