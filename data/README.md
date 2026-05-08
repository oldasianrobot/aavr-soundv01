# Anti-Asian Hate Crimes & Incidents: Data Overview

Project: **TINAG — This Is Not A Game** (ephemeral art experience)
Data compiled: March 2026

---

## Two Lenses on the Same Violence

This dataset draws from two fundamentally different systems of measurement — and their gap is itself the data.

### FBI Hate Crime Statistics
Counts **criminal acts** that were:
1. Reported to police
2. Investigated
3. Classified by an officer as bias-motivated
4. Submitted by a participating agency to the federal program

In 2023: **407 anti-Asian incidents** were recorded this way.

### STOP AAPI Hate
Counts **any discriminatory act** reported by community members — criminal or not. Includes verbal slurs, being avoided on a sidewalk, being refused service, being spat at, being assaulted.

From launch (March 2020) through 2024: **12,803 incidents** reported.

---

## The Numbers at a Glance

### FBI: Annual Anti-Asian Hate Crime Incidents

| Year | Incidents | Change |
|------|-----------|--------|
| 2015 | 111       | —      |
| 2016 | 113       | +2%    |
| 2017 | 109       | −4%    |
| 2018 | 148       | +36%   |
| 2019 | 149       | +1%    |
| 2020 | 279       | **+87%** |
| 2021 | 746       | **+168%** |
| 2022 | 380       | −49%   |
| 2023 | 407       | +7%    |

The 2021 spike coincides with the Atlanta spa shootings (March 16, 2021) and peak anti-Asian COVID rhetoric.

### FBI: How Violence Presents

| Type | Share |
|------|-------|
| Intimidation | 38% |
| Vandalism / Property Destruction | 29% |
| Simple Assault | 26% |
| Aggravated Assault | 14% |

### STOP AAPI Hate: How Hate Presents

| Type | Share |
|------|-------|
| Verbal Harassment | 63% |
| Physical Assault | 16% |
| Deliberate Avoidance / Shunning | 16% |
| Civil Rights Violations | 11% |
| Online Harassment | 9% |
| Property Damage | 6% |

---

## Who Is Being Harmed

- **Gender:** Two-thirds of STOP AAPI Hate reports filed by women. Non-binary people report higher rates of online harassment.
- **Age — elderly:** Adults 61+ are disproportionately targeted for unprovoked physical assault.
- **Age — youth:** 74% of AAPI adults aged 18–29 reported experiencing hate in 2024.
- **Population-wide:** 53% of all AAPI adults reported experiencing anti-AAPI hate in 2024 (NORC/University of Chicago survey).

---

## Where This Happens Most

Highest anti-Asian hate crime reporting states (FBI):
- California
- New York
- New Jersey
- Washington
- Massachusetts

---

## File Index

```
data/
├── fbi/
│   ├── fbi_anti_asian_annual.csv    — year-by-year FBI incident counts
│   ├── fbi_offense_types.csv        — breakdown by offense category
│   └── fbi_sources.md               — source URLs + methodology
├── stop_aapi_hate/
│   ├── sah_annual_totals.csv        — year-by-year SAH report counts
│   ├── sah_incident_types.csv       — breakdown by incident category
│   └── sah_sources.md               — source URLs + methodology
└── README.md                        — this file
```

---

## Critical Artistic Context

The FBI's 407 incidents in 2023 represents the floor — the minimum number the state acknowledges.
STOP AAPI Hate's 12,803 over four years represents the community's own count of what it lived through — and even that is a fraction, constrained by who knows the platform exists and who chooses to report.

The Bureau of Justice Statistics estimates only ~54% of violent hate crimes are even reported to police. Of those, a small fraction are classified as hate crimes. The true number is unknowable — which is part of the truth.

See `notes/data_gaps.md` for a full accounting of what these datasets cannot see.
