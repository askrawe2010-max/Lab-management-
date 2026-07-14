import { useEffect, useState } from 'react'
import { getTerms, addTerm, updateTerm, deleteTerm } from './termService'
import { getCourses } from '../courses/courseService'

const TERM_TYPES = ['Fall', 'Spring', 'Summer']

function TermsPage() {
  const [terms, setTerms] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [courseId, setCourseId] = useState('')
  const [termType, setTermType] = useState('Fall')
  const [year, setYear] = useState('')
  const [startDate, setStartDate] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  async function loadData() {
    setLoading(true)
    try {
      const [termsData, coursesData] = await Promise.all([getTerms(), getCourses()])
      setTerms(termsData)
      setCourses(coursesData)
    } catch (err) {
      setError('حدث خطأ أثناء تحميل البيانات')
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  function resetForm() {
    setCourseId('')
    setTermType('Fall')
    setYear('')
    setStartDate('')
    setEditingId(null)
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!courseId || !year || !startDate) {
      setError('الرجاء تعبئة جميع الحقول')
      return
    }
    const payload = { course_id: courseId, term_type: termType, year: Number(year), start_date: startDate }
    try {
      if (editingId) {
        await updateTerm(editingId, payload)
      } else {
        await addTerm(payload)
      }
      resetForm()
      loadData()
    } catch (err) {
      setError('حدث خطأ أثناء الحفظ')
      console.error(err)
    }
  }

  function handleEdit(term) {
    setEditingId(term.id)
    setCourseId(term.course_id)
    setTermType(term.term_type)
    setYear(term.year)
    setStartDate(term.start_date)
    setError('')
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('هل أنت متأكد من حذف هذا الفصل؟')
    if (!confirmed) return
    try {
      await deleteTerm(id)
      loadData()
    } catch (err) {
      setError('حدث خطأ أثناء الحذف')
      console.error(err)
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '700px' }}>
      <h1>Chem Lab Calc</h1>
      <h2>الفصول (Terms)</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)} style={{ padding: '0.5rem', flex: '1 1 180px' }}>
          <option value="">اختر المساق</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
          ))}
        </select>
        <select value={termType} onChange={(e) => setTermType(e.target.value)} style={{ padding: '0.5rem', flex: '1 1 100px' }}>
          {TERM_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="السنة"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={{ padding: '0.5rem', flex: '1 1 100px' }}
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ padding: '0.5rem', flex: '1 1 150px' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          {editingId ? 'حفظ التعديل' : 'إضافة فصل'}
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
      ) : terms.length === 0 ? (
        <p>لا توجد فصول مضافة بعد.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {terms.map((term) => (
            <li
              key={term.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 0',
                borderBottom: '1px solid #ddd',
              }}
            >
              <span>
                {term.courses?.name} ({term.courses?.code}) — {term.term_type} {term.year} — يبدأ {term.start_date}
              </span>
              <span style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEdit(term)}>تعديل</button>
                <button onClick={() => handleDelete(term.id)}>حذف</button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TermsPage
