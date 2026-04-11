// Global mock storage - shared across API calls
export let mockUsers = new Map()

export function logMockUsers() {
  console.log('📊 Current mock users:', Array.from(mockUsers.keys()))
}
