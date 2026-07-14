import { useEffect, useState } from 'react'
import { getSections, addSection, updateSection, deleteSection } from './sectionService'
import { getTerms } from '../terms/termService'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']

function SectionsPage() {
  const [sections, setSections] = useState([])
  const [terms, setTerms] = useState([])
  const [loading, setLoading] = useState(true)
  const [termId, setTermId] = useState('')
  const [instructorName, setInstructorName] = useState('')
  const [dayOfWeek, setDayOfWeek] = useState('Sunday')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [studentCount, setStudentCount] = useState('')
  const [labRoom, setLabRoom] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  async function loadData() {
    setLoading(true)
    try {
      const [sectionsData, termsData] = await Promise.all([getSections(), getTerms()])
      setSections(sectionsData)
      setTerms(termsData)
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
    setTermId('')
    setInstructorName('')
    setDayOfWeek('Sunday')
    setStartTime('')
    setEndTime('')
    setStudentCount('')
    setLabRoom('')
    setEditingId(null)
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!termId || !instructorName || !startTime || !endTime) {
      setError('الرجاء تعبئة الحقول الأساسية')
      return
    }
    const payload = {
      term_id: termId,
      instructor_name: instructorName,
      day_of_week: dayOfWeek,
      start_time: startTime,
      end_time: endTime,
      student_count: studentCount ? Number(studentCount) : null,
      lab_room: labRoom,
    }
    try {
      if (editingId) {
        await updateSection(editingId, payload)
      } else {
        await addSection(payload)
      }
      resetForm()
      loadData()
    } catch (err) {
      setError('حدث خطأ أثناء الحفظ')
      console.error(err)
    }
  }

  function handleEdit(section) {
    setEditingId(section.id)
    setTermId(section.term_id)
    setInstructorName(section.instructor_name)
    setDayOfWeek(section.day_of_week)
    setStartTime(section.start_time)
    setEndTime(section.end_time)
    setStudentCount(section.student_count || '')
    setLabRoom(section.lab_room || '')
    setError('')
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('هل أنت متأكد من حذف هذه الشعبة؟')
    if (!confirmed) return
    try {
      await deleteSection(id)
      loadData()
    } catch (err) {
      setError('حدث خطأ أثناء الحذف')
      console.error(err)
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px' }}>
      <h1>Chem Lab Calc</h1>
      <h2>الشعب (Sections)</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <select value={termId} onChange={(e) => setTermId(e.target.value)} style={{ padding: '0.5rem', flex: '1 1 220px' }}>
          <option value="">اختر الفصل</option>
          {terms.map((t) => (
            <option key={t.id} value={t.id}>
              {t.courses?.name} — {t.term_type} {t.year}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="اسم المدرس"
          value={instructorName}
          onChange={(e) => setInstructorName(e.target.value)}
          style={{ padding: '0.5rem', flex: '1 1 150px' }}
        />
        <select value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)} style={{ padding: '0.5rem', flex: '1 1 120px' }}>
          {DAYS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          style={{ padding: '0.5rem', flex: '1 1 110px' }}
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          style={{ padding: '0.5rem', flex: '1 1 110px' }}
        />
        <input
          type="number"
          placeholder="عدد الطلاب"
          value={studentCount}
          onChange={(e) => setStudentCount(e.target.value)}
          style={{ padding: '0.5rem', flex: '1 1 100px' }}
        />
        <input
          type="text"
          placeholder="رقم المختبر"
          value={labRoom}
          onChange={(e) => setLabRoom(e.target.value)}
          style={{ padding: '0.5rem', flex: '1 1 100px' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          {editingId ? 'حفظ التعديل' : 'إضافة شعبة'}
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
      ) : sections.length === 0 ? (
        <p>لا توجد شعب مضافة بعد.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {sections.map((section) => (
            <li
              key={section.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 0',
                borderBottom: '1px solid #ddd',
              }}
            >
              <span>
                {section.terms?.courses?.name} — {section.terms?.term_type} {section.terms?.year} — {section.instructor_name} — {section.day_of_week} {section.start_time}-{section.end_time} — {section.lab_room}
              </span>
              <span style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEdit(section)}>تعديل</button>
                <button onClick={() => handleDelete(section.id)}>حذف</button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SectionsPage
