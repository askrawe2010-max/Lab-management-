import { useEffect, useState } from 'react'
import { getChemicals, addChemical, updateChemical, deleteChemical } from './chemicalService'
import { getExperiments } from '../experiments/experimentService'

const PHYSICAL_STATES = ['Pure Solid', 'Pure Liquid', 'Solution']
const CONCENTRATION_TYPES = ['mol/L', '%w/w', '%v/v', '%w/v', 'ppm']
const SOURCE_TYPES = [
  { value: 'solid_dissolved', label: 'Solid dissolved (مادة صلبة تذاب)' },
  { value: 'diluted_stock', label: 'Liquid stock - diluted (محلول مركز يتم تخفيفه)' },
  { value: 'concentrated_stock', label: 'Liquid stock - concentrated, as-is (محلول مركز يستخدم كما هو)' },
]
const SOLID_UNITS = ['g', 'kg', 'mg']
const LIQUID_UNITS = ['mL', 'L', 'g', 'kg', 'mg']

function ChemicalsPage() {
  const [chemicals, setChemicals] = useState([])
  const [experiments, setExperiments] = useState([])
  const [loading, setLoading] = useState(true)
  const [experimentId, setExperimentId] = useState('')
  const [name, setName] = useState('')
  const [physicalState, setPhysicalState] = useState('Pure Solid')
  const [amount, setAmount] = useState('')
  const [unit, setUnit] = useState('')
  const [concentrationType, setConcentrationType] = useState('')
  const [targetConcentrationValue, setTargetConcentrationValue] = useState('')
  const [sourceType, setSourceType] = useState('')
  const [molarMass, setMolarMass] = useState('')
  const [stockPercent, setStockPercent] = useState('')
  const [notes, setNotes] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const isSolution = physicalState === 'Solution'
  const showMolarMass = isSolution && sourceType === 'solid_dissolved'
  const showStockPercent = isSolution && (sourceType === 'diluted_stock' || sourceType === 'concentrated_stock')
  const showConcentrationFields = isSolution && sourceType === 'solid_dissolved' || isSolution && sourceType === 'diluted_stock'
  const unitOptions = physicalState === 'Pure Solid' ? SOLID_UNITS : LIQUID_UNITS
  const uniqueNames = [...new Set(chemicals.map((c) => c.name).filter(Boolean))]

  async function loadData() {
    setLoading(true)
    try {
      const [chemicalsData, experimentsData] = await Promise.all([getChemicals(), getExperiments()])
      setChemicals(chemicalsData)
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

  function handlePhysicalStateChange(value) {
    setPhysicalState(value)
    setUnit('')
    if (value !== 'Solution') {
      setSourceType('')
      setConcentrationType('')
      setTargetConcentrationValue('')
      setMolarMass('')
      setStockPercent('')
    }
  }

  function handleSourceTypeChange(value) {
    setSourceType(value)
    if (value !== 'solid_dissolved') setMolarMass('')
    if (value !== 'diluted_stock' && value !== 'concentrated_stock') setStockPercent('')
    if (value === 'concentrated_stock') {
      setConcentrationType('')
      setTargetConcentrationValue('')
    }
  }

  function resetForm() {
    setExperimentId('')
    setName('')
    setPhysicalState('Pure Solid')
    setAmount('')
    setUnit('')
    setConcentrationType('')
    setTargetConcentrationValue('')
    setSourceType('')
    setMolarMass('')
    setStockPercent('')
    setNotes('')
    setEditingId(null)
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!experimentId || !name.trim()) {
      setError('الرجاء تعبئة التجربة واسم المادة')
      return
    }
    const payload = {
      experiment_id: experimentId,
      name,
      physical_state: physicalState,
      amount: amount ? Number(amount) : null,
      unit,
      concentration_type: showConcentrationFields ? concentrationType || null : null,
      target_concentration_value: showConcentrationFields && targetConcentrationValue ? Number(targetConcentrationValue) : null,
      source_type: isSolution ? sourceType || null : null,
      molar_mass: showMolarMass && molarMass ? Number(molarMass) : null,
      stock_percent: showStockPercent && stockPercent ? Number(stockPercent) : null,
      notes,
    }
    try {
      if (editingId) {
        await updateChemical(editingId, payload)
      } else {
        await addChemical(payload)
      }
      resetForm()
      loadData()
    } catch (err) {
      setError('حدث خطأ أثناء الحفظ')
      console.error(err)
    }
  }

  function handleEdit(chemical) {
    setEditingId(chemical.id)
    setExperimentId(chemical.experiment_id)
    setName(chemical.name)
    setPhysicalState(chemical.physical_state || 'Pure Solid')
    setAmount(chemical.amount ?? '')
    setUnit(chemical.unit || '')
    setConcentrationType(chemical.concentration_type || '')
    setTargetConcentrationValue(chemical.target_concentration_value ?? '')
    setSourceType(chemical.source_type || '')
    setMolarMass(chemical.molar_mass ?? '')
    setStockPercent(chemical.stock_percent ?? '')
    setNotes(chemical.notes || '')
    setError('')
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('هل أنت متأكد من حذف هذه المادة؟')
    if (!confirmed) return
    try {
      await deleteChemical(id)
      loadData()
    } catch (err) {
      setError('حدث خطأ أثناء الحذف')
      console.error(err)
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '900px' }}>
      <h1>Chem Lab Calc</h1>
      <h2>المواد الكيميائية (Chemicals)</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
          placeholder="اسم المادة"
          value={name}
          onChange={(e) => setName(e.target.value)}
          list="chemical-names-list"
          style={{ padding: '0.5rem', flex: '1 1 150px' }}
        />
        <datalist id="chemical-names-list">
          {uniqueNames.map((n) => (
            <option key={n} value={n} />
          ))}
        </datalist>
        <select value={physicalState} onChange={(e) => handlePhysicalStateChange(e.target.value)} style={{ padding: '0.5rem', flex: '1 1 140px' }}>
          {PHYSICAL_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="الكمية"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ padding: '0.5rem', flex: '1 1 100px' }}
        />
        <select value={unit} onChange={(e) => setUnit(e.target.value)} style={{ padding: '0.5rem', flex: '1 1 100px' }}>
          <option value="">الوحدة</option>
          {unitOptions.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>

        {isSolution && (
          <select value={sourceType} onChange={(e) => handleSourceTypeChange(e.target.value)} style={{ padding: '0.5rem', flex: '1 1 260px' }}>
            <option value="">اختر مصدر المحلول</option>
            {SOURCE_TYPES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        )}

        {showConcentrationFields && (
          <>
            <select value={concentrationType} onChange={(e) => setConcentrationType(e.target.value)} style={{ padding: '0.5rem', flex: '1 1 120px' }}>
              <option value="">وحدة التركيز</option>
              {CONCENTRATION_TYPES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="قيمة التركيز المطلوب"
              value={targetConcentrationValue}
              onChange={(e) => setTargetConcentrationValue(e.target.value)}
              style={{ padding: '0.5rem', flex: '1 1 150px' }}
            />
          </>
        )}

        {showMolarMass && (
          <input
            type="number"
            placeholder="الوزن الجزيئي (g/mol)"
            value={molarMass}
            onChange={(e) => setMolarMass(e.target.value)}
            style={{ padding: '0.5rem', flex: '1 1 150px' }}
          />
        )}

        {showStockPercent && (
          <input
            type="number"
            placeholder="تركيز المحلول الأصلي (Stock) %"
            value={stockPercent}
            onChange={(e) => setStockPercent(e.target.value)}
            style={{ padding: '0.5rem', flex: '1 1 180px' }}
          />
        )}

        <input
          type="text"
          placeholder="ملاحظات (اختياري)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ padding: '0.5rem', flex: '1 1 200px' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          {editingId ? 'حفظ التعديل' : 'إضافة مادة'}
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
      ) : chemicals.length === 0 ? (
        <p>لا توجد مواد مضافة بعد.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {chemicals.map((chemical) => (
            <li
              key={chemical.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 0',
                borderBottom: '1px solid #ddd',
              }}
            >
              <span>
                {chemical.name} — {chemical.amount} {chemical.unit} — {chemical.physical_state} — {chemical.experiments?.name}
                {chemical.target_concentration_value ? ` — ${chemical.target_concentration_value} ${chemical.concentration_type}` : ''}
                {chemical.stock_percent ? ` — Stock: ${chemical.stock_percent}%` : ''}
              </span>
              <span style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEdit(chemical)}>تعديل</button>
                <button onClick={() => handleDelete(chemical.id)}>حذف</button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ChemicalsPage
