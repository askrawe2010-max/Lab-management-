import { useEffect, useState } from 'react'
import { getExperiments, addExperiment, updateExperiment, deleteExperiment } from './experimentService'
import { getCourses } from '../courses/courseService'

const EXECUTION_MODES = ['Individual', 'Pairs']

function ExperimentsPage() {
  const [experiments, setExperiments] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [courseId, setCourseId] = useState('')
  const [name, setName] = useState('')
  const [executionMode, setExecutionMode] = useState('Individual')
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  async function loadData() {
    setLoading(true)
    try {
      const [experimentsData, coursesData] = await Promise.all([getExperiments(), getCourses()])
      setExperiments(experimentsData)
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
    setName('')
    setExecutionMode('Individual')
    setEditingId(null)
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!courseId || !name.trim()) {
      setError('الرجاء تعبئة المساق واسم التجربة')
      return
    }
    const payload = { course_id: courseId, name, execution_mode: executionMode }
    try {
      if (editingId) {
        await updateExperiment(editingId, payload)
      } else {
        await addExperiment(payload)
      }
      resetForm()
      loadData()
    } catch (err) {
      setError('حدث خطأ أثناء الحفظ')
      console.error(err)
    }
  }

  function handleEdit(experiment) {
    setEditingId(experiment.id)
    setCourseId(experiment.course_id)
    setName(experiment.name)
    setExecutionMode(experiment.execution_mode || 'Individual')
    setError('')
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('هل أنت متأكد من حذف هذه التجربة؟')
    if (!confirmed) return
    try {
      await deleteExperiment(id)
      loadData()
    } catch (err) {
      setError('حدث خطأ أثناء الحذف')
      console.error(err)
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '700px' }}>
      <h1>Chem Lab Calc</h1>
      <h2>التجارب (Experiments)</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)} style={{ padding: '0.5rem', flex: '1 1 180px' }}>
          <option value="">اختر المساق</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="اسم التجربة"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '0.5rem', flex: '1 1 200px' }}
        />
        <select value={executionMode} onChange={(e) => setExecutionMode(e.target.value)} style={{ padding: '0.5rem', flex: '1 1 130px' }}>
          {EXECUTION_MODES.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          {editingId ? 'حفظ التعديل' : 'إضافة تجربة'}
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
      ) : experiments.length === 0 ? (
        <p>لا توجد تجارب مضافة بعد.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {experiments.map((experiment) => (
            <li
              key={experiment.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 0',
                borderBottom: '1px solid #ddd',
              }}
            >
              <span>
                {experiment.name} — {experiment.courses?.name} ({experiment.courses?.code}) — {experiment.execution_mode}
              </span>
              <span style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEdit(experiment)}>تعديل</button>
                <button onClick={() => handleDelete(experiment.id)}>حذف</button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ExperimentsPage
