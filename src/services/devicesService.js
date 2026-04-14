/** @type {import('../types/device').Device[]} */
const MOCK_DEVICES = [
  {
    id: 'dev1',
    ownerId: 'user1',
    name: 'Sensor salón',
    room: 'Salón',
    status: 'online',
    lastSeen: new Date(),
    signal: 87,
  },
  {
    id: 'dev2',
    ownerId: 'user1',
    name: 'Sensor dormitorio',
    room: 'Dormitorio',
    status: 'online',
    lastSeen: new Date(Date.now() - 5 * 60 * 1000),
    signal: 72,
  },
]

export function getDevices() {
  return Promise.resolve(MOCK_DEVICES)
}

export function getDeviceById(id) {
  return Promise.resolve(MOCK_DEVICES.find((d) => d.id === id) ?? null)
}
