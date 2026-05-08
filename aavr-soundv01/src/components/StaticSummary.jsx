import styles from './StaticSummary.module.css'

const FBI_OFFENSES = [
  { label: 'Intimidation', pct: '36%', count: '~2,753' },
  { label: 'Vandalism / Property Destruction', pct: '27%', count: '~2,094' },
  { label: 'Simple Assault', pct: '24%', count: '~1,861' },
  { label: 'Aggravated Assault', pct: '13%', count: '~1,008' },
  { label: 'All other offenses', pct: '<1% ea.', count: '' },
]

const SAH_CATEGORIES = [
  { label: 'Verbal Harassment', pct: '60%', count: '~7,682' },
  { label: 'Physical Assault', pct: '16%', count: '~2,049' },
  { label: 'Avoidance / Shunning', pct: '15%', count: '~1,920' },
  { label: 'Online Harassment', pct: '9%', count: '~1,152' },
  { label: 'Civil Rights Violations', pct: '5%', count: '~640' },
  { label: 'Property Damage', pct: '6%', count: '~768' },
]

export default function StaticSummary() {
  return (
    <main className={styles.summary}>
      <h1 className={styles.heading}>This Is Not a Gap</h1>
      <p className={styles.subheading}>Sound Canvas — Anti-Asian Hate Crime Data</p>

      <section className={styles.section} aria-labelledby="fbi-heading">
        <h2 id="fbi-heading" className={styles.sectionTitle}>FBI Hate Crime Statistics / 1993–2024</h2>
        {FBI_OFFENSES.map(({ label, pct, count }) => (
          <div className={styles.dataRow} key={label}>
            <span className={styles.dataLabel}>{label}</span>
            <span className={styles.dataValue}>{pct}{count ? ` — ${count}` : ''}</span>
          </div>
        ))}
        <div className={styles.dataRow}>
          <span className={styles.dataLabel}>2024 total reported to FBI</span>
          <span className={styles.dataValue}>336</span>
        </div>
        <div className={styles.dataRow}>
          <span className={styles.dataLabel}>Cumulative 1993–2024</span>
          <span className={styles.dataValue}>7,755</span>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="sah-heading">
        <h2 id="sah-heading" className={styles.sectionTitle}>STOP AAPI Hate / 2020–2024</h2>
        {SAH_CATEGORIES.map(({ label, pct, count }) => (
          <div className={styles.dataRow} key={label}>
            <span className={styles.dataLabel}>{label}</span>
            <span className={styles.dataValue}>{pct}{count ? ` — ${count}` : ''}</span>
          </div>
        ))}
        <div className={styles.dataRow}>
          <span className={styles.dataLabel}>Cumulative 2020–2024</span>
          <span className={styles.dataValue}>12,803</span>
        </div>
      </section>

      <div className={styles.gap}>
        The gap between 7,755 incidents documented by the FBI over 32 years and
        12,803 incidents reported to STOP AAPI Hate in just 5 years is not a discrepancy
        to footnote. It is the subject of this work.
      </div>
    </main>
  )
}
