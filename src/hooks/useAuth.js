// Stub — returns a mock authenticated user
// Replace with real Firebase Auth listener when ready
export function useAuth() {
  return {
    user: {
      uid: 'user1',
      displayName: 'María García',
      email: 'maria@example.com',
    },
    loading: false,
  }
}
