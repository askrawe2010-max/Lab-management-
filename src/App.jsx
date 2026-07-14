import { useState } from 'react'
import CoursesPage from './features/courses/CoursesPage'
import TermsPage from './features/terms/TermsPage'
import SectionsPage from './features/sections/SectionsPage'
import ExperimentsPage from './features/experiments/ExperimentsPage'
import ChemicalsPage from './features/chemicals/ChemicalsPage'

function App() {
  const [activeTab, setActiveTab] = useState('courses')

  const tabStyle = (tab) => ({
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    border: 'none',
    borderBottom: activeTab === tab ? '3px solid #333' : '3px solid transparent',
    background: 'none',
    fontSize: '1rem',
    fontWeight: activeTab === tab ? 'bold' : 'normal',
  })

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', padding: '0 2rem', borderBottom: '1px solid #ddd', flexWrap: 'wrap' }}>
        <button style={tabStyle('courses')} onClick={() => setActiveTab('courses')}>
          المساقات
        </button>
        <button style={tabStyle('terms')} onClick={() => setActiveTab('terms')}>
          الفصول
        </button>
