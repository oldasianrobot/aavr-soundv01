import styles from './StaticSummary.module.css'

const FBI_OFFENSES = [
  { label: 'Intimidation', pct: '38%', count: '~2,243' },
  { label: 'Vandalism / Property Destruction', pct: '29%', count: '~1,712' },
  { label: 'Simple Assault', pct: '26%', count: '~1,535' },
  { label: 'Aggravated Assault', pct: '14%', count: '~826' },
  { label: 'All other offenses', pct: '<1% ea.', count: '' },
]

const SAH_CATEGORIES = [
  { label: 'Verbal Harassment', pct: '63%', count: '~8,066' },
  { label: 'Physical Assault', pct: '16%', count: '~2,049' },
  { label: 'Avoidance / Shunning', pct: '16%', count: '~2,049' },
  { label: 'Civil Rights Violations', pct: '11.5%', count: '~1,472' },
  { label: 'Online Harassment', pct: '8.6%', count: '~1,101' },
  { label: 'Property Damage', pct: '6%', count: '~768' },
]

export default function StaticSummary() {
  return (
    <main className={styles.summary}>
      <h1 className={styles.heading}>This Is Not a Gap</h1>
      <p className={styles.subheading}>Sound Canvas — Anti-Asian Hate Crime Data</p>

      <section className={styles.section} aria-labelledby="fbi-heading">
        <h2 id="fbi-heading" className={styles.sectionTitle}>FBI Hate Crime Statistics / 1991–2023</h2>
        {FBI_OFFENSES.map(({ label, pct, count }) => (
          <div className={styles.dataRow} key={label}>
            <span className={styles.dataLabel}>{label}</span>
            <span className={styles.dataValue}>{pct}{count ? ` — ${count}` : ''}</span>
          </div>
        ))}
        <div className={styles.dataRow}>
          <span className={styles.dataLabel}>2023 total reported to FBI</span>
          <span className={styles.dataValue}>407</span>
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
        The gap between 407 (FBI, 2023) and 12,803 (STOP AAPI Hate, cumulative 2020–2024)
        is not a discrepancy to footnote. It is the subject of this work.
      </div>
    </main>
  )
}
