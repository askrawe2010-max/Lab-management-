import { useEffect, useState } from 'react'
import {
  getCompoundGroups,
  addCompoundGroup,
  updateCompoundGroup,
  deleteCompoundGroup,
  addComponent,
  updateComponent,
  deleteComponent,
} from './compoundService'
import { getExperiments } from '../experiments/experimentService'

const CONCENTRATION_TYPES = ['mol/L', '%w/w', '%v/v', '%w/v', 'ppm']
const UNITS = ['mL', 'L', 'g', 'kg', 'mg']

function BufferPage() {
  const [groups, setGroups] = useState([])
  const [experiments, setExperiments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [experimentId, setExperimentId] = useState('')
  const [groupName, setGroupName] = useState('')
  const [totalAmount, setTotalAmount] = useState('')
  const [totalUnit, setTotalUnit] = useState('')
  const [groupNotes, setGroupNotes] = useState('')
  const [editingGroupId, setEditingGroupId] = useState(null)

  const [activeGroupId, setActiveGroupId] = useState(null)
  const [compName, setCompName] = useState('')
  const [compRole, setCompRole] = useState('')
const [compAmount, setCompAmount] = useState('')
  const [compUnit, setCompUnit] = useState('')
  const [compConcentrationType, setCompConcentrationType] = useState('')
  const [compTargetValue, setCompTargetValue] = useState('')
  const [editingComponentId, setEditingComponentId] = useState(null)

  async function loadData() {
    setLoading(true)
    try {
      const [groupsData, experimentsData] = await Promise.all([
        getCompoundGroups('buffer'),
        getExperiments(),
      ])
      setGroups(groupsData)
      setExperiments(experimentsData)
    } catch (err) {
      setError('حدث خطأ أثناء تحميل البيانات')
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])
function resetGroupForm() {
    setExperimentId('')
    setGroupName('')
    setTotalAmount('')
    setTotalUnit('')
    setGroupNotes('')
    setEditingGroupId(null)
    setError('')
  }

  function resetComponentForm() {
    setActiveGroupId(null)
    setCompName('')
    setCompRole('')
    setCompAmount('')
    setCompUnit('')
    setCompConcentrationType('')
    setCompTargetValue('')
    setEditingComponentId(null)
  }
async function handleGroupSubmit(e) {
    e.preventDefault()
    if (!experimentId || !groupName.trim()) {
      setError('الرجاء تعبئة التجربة واسم المحلول المركّب')
      return
    }
    const payload = {
      experiment_id: experimentId,
      name: groupName,
      group_type: 'buffer',
      total_amount: totalAmount ? Number(totalAmount) : null,
      unit: totalUnit,
      notes: groupNotes,
    }
    try {
      if (editingGroupId) {
        await updateCompoundGroup(editingGroupId, payload)
      } else {
        await addCompoundGroup(payload)
      }
      resetGroupForm()
      loadData()
    } catch (err) {
      setError('حدث خطأ أثناء حفظ المحلول')
      console.error(err)
    }
  }

  function handleEditGroup(group) {
    setEditingGroupId(group.id)
    setExperimentId(group.experiment_id)
    setGroupName(group.name)
    setTotalAmount(group.total_amount ?? '')
    setTotalUnit(group.unit || '')
    setGroupNotes(group.notes || '')
    setError('')
  }

  async function handleDeleteGroup(id) {
    const confirmed = window.confirm('هل أنت متأكد من حذف هذا المحلول المركّب وكل مكوّناته؟')
    if (!confirmed) return
    try {
      await deleteCompoundGroup(id)
      loadData()
    } catch (err) {
      setError('حدث خطأ أثناء الحذف')
      console.error(err)
    }
  }
async function handleComponentSubmit(e) {
    e.preventDefault()
    if (!compName.trim()) {
      setError('الرجاء تعبئة اسم المكوّن')
      return
    }
    const payload = {
      group_id: activeGroupId,
      name: compName,
      role: compRole,
      amount: compAmount ? Number(compAmount) : null,
      unit: compUnit,
      concentration_type: compConcentrationType || null,
      target_concentration_value: compTargetValue ? Number(compTargetValue) : null,
    }
    try {
      if (editingComponentId) {
        await updateComponent(editingComponentId, payload)
      } else {
        await addComponent(payload)
      }
      resetComponentForm()
      loadData()
    } catch (err) {
      setError('حدث خطأ أثناء حفظ المكوّن')
      console.error(err)
    }
  }

  function handleEditComponent(groupId, component) {
    setActiveGroupId(groupId)
    setEditingComponentId(component.id)
    setCompName(component.name)
    setCompRole(component.role || '')
    setCompAmount(component.amount ?? '')
    setCompUnit(component.unit || '')
    setCompConcentrationType(component.concentration_type || '')
    setCompTargetValue(component.target_concentration_value ?? '')
  }

  async function handleDeleteComponent(id) {
    const confirmed = window.confirm('هل أنت متأكد من حذف هذا المكوّن؟')
    if (!confirmed) return
    try {
      await deleteComponent(id)
      loadData()
    } catch (err) {
      setError('حدث خطأ أثناء الحذف')
      console.error(err)
    }
  }
return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '950px' }}>
      <h1>Chem Lab Calc</h1>
      <h2>المحاليل المركّبة (Buffer / Mixed Solutions)</h2>

      <form onSubmit={handleGroupSubmit} style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', padding: '1rem', border: '1px solid #ccc', borderRadius: '6px' }}>
        <select value={experimentId} onChange={(e) => setExperimentId(e.target.value)} style={{ padding: '0.5rem', flex: '1 1 200px' }}>
          <option value="">اختر التجربة</option>
          {experiments.map((exp) => (
            <option key={exp.id} value={exp.id}>
              {exp.name} — {exp.courses?.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="اسم المحلول المركّب"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          style={{ padding: '0.5rem', flex: '1 1 220px' }}
        />
        <input
          type="number"
          placeholder="الكمية الكلية"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          style={{ padding: '0.5rem', flex: '1 1 120px' }}
        />
        <select value={totalUnit} onChange={(e) => setTotalUnit(e.target.value)} style={{ padding: '0.5rem', flex: '1 1 100px' }}>
          <option value="">الوحدة</option>
          {UNITS.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="ملاحظات (اختياري)"
          value={groupNotes}
          onChange={(e) => setGroupNotes(e.target.value)}
          style={{ padding: '0.5rem', flex: '1 1 200px' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          {editingGroupId ? 'حفظ التعديل' : 'إضافة محلول مركّب'}
        </button>
        {editingGroupId && (
          <button type="button" onClick={resetGroupForm} style={{ padding: '0.5rem 1rem' }}>
            إلغاء
          </button>
        )}
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>جاري التحميل...</p>
      ) : groups.length === 0 ? (
        <p>لا توجد محاليل مركّبة مضافة بعد.</p>
      ) : (
        <p>سيتم عرض القائمة هنا</p>
      )}
    </div>
  )
}

export default BufferPage
