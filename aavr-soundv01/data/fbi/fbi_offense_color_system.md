# FBI Offense Type — Color System

## Logic

Offense types are assigned colors on a spectrum from violent to non-violent:
- **Violent offenses against persons** → warm, high-intensity colors (red → orange → yellow)
- **Property offenses** → cool, lower-intensity colors (green → blue → purple)
- **Intensity within each group** follows severity: darker/brighter = more severe

## Color Assignments

| Offense Type | Hex | Category | Severity Rationale |
|---|---|---|---|
| Murder / Non-Negligent Manslaughter | `#CC0000` | Violent — Person | Lethal. Darkest red. |
| Rape / Sexual Assault | `#E8472A` | Violent — Person | Severe bodily violation. Red-orange. |
| Aggravated Assault | `#FF5500` | Violent — Person | Weapon or serious injury. Orange-red. |
| Robbery | `#FF8000` | Violent — Person | Force or threat + property. Orange. |
| Simple Assault | `#FFB300` | Violent — Person | Physical contact without weapon. Amber. |
| Intimidation | `#FFE033` | Violent — Person | Threat without contact; can precede violence. Yellow. |
| Arson | `#7D4E00` | Property — Dangerous | Property crime that endangers life. Dark brown. |
| Destruction / Damage / Vandalism | `#2D6A4F` | Property | Most common property offense. Dark green. |
| Burglary | `#1A5276` | Property | Unlawful entry. Dark navy. |
| Larceny / Theft | `#4A235A` | Property | Taking without force. Dark purple. |
| Motor Vehicle Theft | `#7D3C98` | Property | Theft of vehicle. Medium purple. |
| Other / Unknown | `#555555` | — | Unclassified. Gray. |

## Notes
- Intimidation sits at the warm end of the spectrum because it is classified by FBI as a crime against persons, not property. It is the most common FBI hate crime category overall and for anti-Asian incidents specifically (38% of offenses).
- Arson is treated separately from other property crimes — it is a property offense but carries significant risk of physical harm, hence brown (warm but dark) rather than green/blue.
- Colors are designed to remain readable against white or dark backgrounds and to be distinguishable when placed adjacently in a table or visualization.
