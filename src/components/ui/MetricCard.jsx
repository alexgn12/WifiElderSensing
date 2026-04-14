import styles from './MetricCard.module.css'

export default function MetricCard({ icon, label, value, sub, accent }) {
  return (
    <div className={`${styles.card} ${accent ? styles[accent] : ''}`}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <div className={styles.body}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value}</span>
        {sub && <span className={styles.sub}>{sub}</span>}
      </div>
    </div>
  )
}
