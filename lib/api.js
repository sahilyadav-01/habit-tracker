import mongoose from './mongoose'

// Get token from localStorage
const getToken = () => localStorage.getItem('token')

// Base headers
const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getToken() && { Authorization: `Bearer ${getToken()}` })
})

export const getHabits = async (isFamily = false) => {
  const res = await fetch(`/api/habits?family=${isFamily}`, {
    headers: getHeaders()
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Failed to fetch habits')
  }
  return res.json()
}

export const createHabit = async (habitData) => {
  const res = await fetch('/api/habits', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(habitData)
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Failed to create habit')
  }
  return res.json()
}

export const completeHabit = async (id) => {
  const res = await fetch(`/api/habits/${id}/complete`, {
    method: 'PATCH',
    headers: getHeaders()
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Failed to complete habit')
  }
  return res.json()
}

export const deleteHabit = async (id) => {
  const res = await fetch(`/api/habits/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Failed to delete habit')
  }
  return res.json()
}

export const updateHabit = async (id, habitData) => {
  const res = await fetch(`/api/habits/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(habitData)
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Failed to update habit')
  }
  return res.json()
}
