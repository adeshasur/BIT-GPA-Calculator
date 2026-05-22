# BIT GPA Calculator

A static GPA calculator for the UCSC Bachelor of Information Technology (BIT) 2023 course structure.

## Rules Implemented

### Grade Point Values

| Grade | GPV |
| --- | ---: |
| A+ / A | 4.00 |
| A- | 3.70 |
| B+ | 3.30 |
| B | 3.00 |
| B- | 2.70 |
| C+ | 2.30 |
| C | 2.00 |
| C- | 1.70 |
| D+ | 1.30 |
| D | 1.00 |
| E | 0.00 |

### Repeat Rule

- A course with `C` or above is final and cannot be repeated.
- Only courses below `C` (`C-`, `D+`, `D`, `E`) can be repeated.
- A repeated course is capped at `C` / `2.00` for GPA calculation, even if the repeat attempt grade is higher.
- `E` is treated as a fail grade and blocks progression until repeated.

### Progression Guidance

For Level I or Level II progression, the calculator warns using these conditions:

- Minimum GPA of `2.00`.
- At least `20` GPA credits at `C` or above.
- No `E` grade in GPA courses.
- All relevant `EN` courses must be passed, although EN credits are excluded from GPA.

Courses with `C-`, `D+`, or `D` are repeat courses. If the other progression conditions are met, they can be carried while continuing the next year; otherwise the calculator flags the level as at risk.

### Credits

- Level I: 30 GPA credits.
- Level II: 30 GPA credits.
- Level III: 27 compulsory GPA credits plus one 3-credit optional course, either `IT5506` or `IT6506`.
- Enhancement courses with `EN` course codes are non-GPA courses. They are shown for completion tracking but excluded from GPA calculation.

### Formula

```text
GPA = sum(GPV * GPA credits) / sum(GPA credits)
```

Use `index.html` directly in a browser. No build step is required.
