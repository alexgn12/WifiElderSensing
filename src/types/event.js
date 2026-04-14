/**
 * @typedef {Object} SensorEvent
 * @property {string} id
 * @property {string} deviceId
 * @property {'motion'|'fall'|'inactivity'} type
 * @property {Date} timestamp
 * @property {number} confidence  - 0.0 to 1.0
 */

/**
 * @typedef {Object} HourlyActivity
 * @property {number} hour  - 0 to 23
 * @property {number} count - number of motion events
 */
