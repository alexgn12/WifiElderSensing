/** @type {import('../types/alert').Alert[]} */
const MOCK_ALERTS = [
  {
    id: 'a1',
    userId: 'user1',
    deviceId: 'dev1',
    type: 'inactivity',
    severity: 'warning',
    message: 'Sin movimiento 3h',
    device: 'Sensor salón',
    read: false,
    sentAt: '2025-01-13T09:30:00',
  },
  {
    id: 'a2',
    userId: 'user1',
    deviceId: 'dev2',
    type: 'fall',
    severity: 'danger',
    message: 'Posible caída detectada',
    device: 'Sensor dormitorio',
    read: true,
    sentAt: '2025-01-10T22:15:00',
  },
  {
    id: 'a3',
    userId: 'user1',
    deviceId: 'dev1',
    type: 'inactivity',
    severity: 'warning',
    message: 'Sin movimiento 4h',
    device: 'Sensor salón',
    read: true,
    sentAt: '2025-01-09T14:00:00',
  },
]

export function getAlerts() {
  return Promise.resolve([...MOCK_ALERTS])
}

export function markAlertRead(id) {
  // In real app: update Firestore doc
  return Promise.resolve(id)
}
