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
}
