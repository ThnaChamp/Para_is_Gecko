import Navbar from './assets/Navbar'
import { useEffect, useState } from 'react'

import { createClient } from '@supabase/supabase-js'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

function App() {
  const [paraWeight, setParaWeight] = useState<any[]>([])
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [form, setForm] = useState<{ [key: string]: string }>({})

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const { data: ParaWeight, error } = await supabase
        .from('ParaWeight')
        .select('*')
      setParaWeight(ParaWeight || [])
      setError(error)
      setLoading(false)
    }
    fetchData()
  }, [])

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('ParaWeight').insert([form])
    if (!error) {
      // Refresh table
      const { data: ParaWeight, error: fetchError } = await supabase
        .from('ParaWeight')
        .select('*')
      setParaWeight(ParaWeight || [])
      setError(fetchError)
      setForm({})
    } else {
      setError(error)
    }
    setLoading(false)
  }

  // Get table columns for form fields
  const columns = paraWeight[0] ? Object.keys(paraWeight[0]) : []
  return (
    <div className='bg-blue-300 min-h-screen'>
      <Navbar/>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">ParaWeight Table</h2>
        {/* Insert Form */}
        {columns.length > 0 && (
          <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-4 items-end bg-white p-4 rounded shadow">
            {columns.map((col) => (
              <div key={col} className="flex flex-col">
                <label className="text-sm font-semibold mb-1">{col}</label>
                <input
                  type="text"
                  name={col}
                  value={form[col] || ''}
                  onChange={handleInputChange}
                  className="border px-2 py-1 rounded"
                  required={col === 'id' ? false : true}
                  disabled={col === 'id'}
                />
              </div>
            ))}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              Add Row
            </button>
          </form>
        )}
        {loading ? (
          <div className="text-gray-700">Loading...</div>
        ) : paraWeight.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-blue-200 bg-white shadow-lg">
            <table className="min-w-full rounded">
              <thead className="bg-blue-100">
                <tr>
                  {columns.map((key) => (
                    <th key={key} className="px-4 py-2 border-b text-left">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paraWeight.map((row, idx) => (
                  <tr key={idx} className="hover:bg-blue-50 transition-colors">
                    {columns.map((col, i) => (
                      <td key={i} className="px-4 py-2 border-b">{String(row[col])}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-gray-700">No data found.</div>
        )}
        {error && <div className="text-red-600 mt-2">Error: {error.message}</div>}
      </div>
    </div>
  )
}

export default App