import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [habits, setHabits] = useState([])
  const [newHabit, setNewHabit] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    fetchHabits()
  }, [])

  const fetchHabits = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/'
      return
    }
    const res = await fetch('/api/habits', {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      const data = await res.json()
      setHabits(data)
    } else {
      window.location.href = '/'
    }
  }

  const addHabit = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/habits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name: newHabit })
    })
    if (res.ok) {
      setNewHabit('')
      fetchHabits()
    } else {
      const data = await res.json()
      setError(data.message)
    }
  }

  const deleteHabit = async (id) => {
    const token = localStorage.getItem('token')
    const res = await fetch(`/api/habits/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      fetchHabits()
    }
  }

  const completeHabit = async (id) => {
    const token = localStorage.getItem('token')
    const res = await fetch(`/api/habits/${id}/complete`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    if (res.ok) {
      fetchHabits()
    } else {
      setError(data.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Habit Tracker</h1>
      <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/' }} className="bg-gray-500 text-white p-2 rounded mb-4">Logout</button>
      <div className="mb-8">
        <input
          type="text"
          placeholder="New habit name"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          className="p-2 border rounded mr-4"
        />
        <button onClick={addHabit} className="bg-green-500 text-white p-2 rounded">
          Add Habit
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {habits.map((habit) => (
          <div key={habit._id} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold">{habit.name}</h2>
            <p>Streak: {habit.streak}</p>
            <p>Consistency: {habit.consistency}%</p>
            <p>Completions: {habit.completions}</p>
            <button onClick={() => completeHabit(habit._id)} className="bg-blue-500 text-white p-2 rounded mt-2">
              Mark Done
            </button>
            <button onClick={() => deleteHabit(habit._id)} className="bg-red-500 text-white p-2 rounded mt-2 ml-2">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}