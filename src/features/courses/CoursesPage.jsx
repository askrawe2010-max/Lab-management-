import { useEffect, useState } from 'react'
import { getCourses, addCourse, updateCourse, deleteCourse } from './courseService'

function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  async function loadCourses() {
    setLoading(true)
    try {
      const data = await getCourses()
      setCourses(data)
    } catch (err) {
      setError('حدث خطأ أثناء تحميل المساقات')
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadCourses()
  }, [])

  function resetForm() {
    setName('')
    setCode('')
    setEditingId(null)
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !code.trim()) {
      setError('الرجاء تعبئة اسم المساق ورمزه')
      return
    }
    try {
      if (editingId) {
        await updateCourse(editingId, { name, code })
      } else {
        await addCourse({ name, code })
      }
      resetForm()
      loadCourses()
    } catch (err) {
      setError('حدث خطأ أثناء الحفظ')
      console.error(err)
    }
  }

  function handleEdit(course) {
    setEditingId(course.id)
    setName(course.name)
    setCode(course.code)
    setError('')
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('هل أنت متأكد من حذف هذا المساق؟')
    if (!confirmed) return
    try {
      await deleteCourse(id)
      loadCourses()
    } catch (err) {
      setError('حدث خطأ أثناء الحذف')
      console.error(err)
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px' }}>
      <h1>Chem Lab Calc</h1>
      <h2>المساقات (Courses)</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="اسم المساق"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '0.5rem', flex: '1 1 200px' }}
        />
        <input
          type="text"
          placeholder="رمز المساق"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ padding: '0.5rem', flex: '1 1 120px' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          {editingId ? 'حفظ التعديل' : 'إضافة مساق'}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm} style={{ padding: '0.5rem 1rem' }}>
            إلغاء
          </button>
        )}
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>جاري التحميل...</p>
      ) : courses.length === 0 ? (
        <p>لا توجد مساقات مضافة بعد.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {courses.map((course) => (
            <li
              key={course.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 0',
                borderBottom: '1px solid #ddd',
              }}
            >
              <span>{course.name} ({course.code})</span>
              <span style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEdit(course)}>تعديل</button>
                <button onClick={() => handleDelete(course.id)}>حذف</button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CoursesPage
