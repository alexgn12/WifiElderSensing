// Motion event counts per hour (index = hour 0-23)
const MOCK_HOURLY_ACTIVITY = [0,0,0,0,0,1,4,9,13,11,15,18,10,8,12,9,7,11,14,9,5,3,1,0]

/**
 * Returns hourly activity data for today as [{hour, count}]
 * @returns {Promise<{hour:number, count:number}[]>}
 */
export function getHourlyActivity() {
  const data = MOCK_HOURLY_ACTIVITY.map((count, hour) => ({ hour, count }))
  return Promise.resolve(data)
}

/**
 * Simulates onSnapshot — calls callback immediately with mock data.
 * Returns an unsubscribe function.
 * @param {function} callback
 * @returns {function}
 */
export function subscribeHourlyActivity(callback) {
  const data = MOCK_HOURLY_ACTIVITY.map((count, hour) => ({ hour, count }))
  callback(data)
  return () => {}
}
