export type CareerPackageFile = {
  path: string;
  content: string;
};

export type CareerPackageDefinition = {
  id: string;
  country: string;
  jobType: string;
  files: CareerPackageFile[];
};

const files: CareerPackageFile[] = [
  {
    path: "README.md",
    content: `# Germany Tech Job Application Kit — Software / IT

Use this kit to build a clear, market-aware application for German technology roles.

## Included
- Germany CV Guidance
- Professional CV Template
- Senior / Leadership CV Template
- Cover Letter Templates
- Job Description Worksheet
- Application Checklist
- Application Tracker
- AI Prompt Pack

## Suggested workflow
1. Choose the CV template that fits your target role.
2. Analyse the job description with the worksheet.
3. Tailor your CV using verified evidence from your experience.
4. Adapt the cover letter to the employer and role.
5. Run the final checklist.
6. Record the application in the tracker.
7. Use the AI prompts for optional refinement.

This product provides templates and general career guidance. It is not legal, immigration, tax, or employment-law advice.
`,
  },
  {
    path: "germany-cv-guidance.md",
    content: `# Germany CV Guidance

## Suggested structure
1. Name and professional headline
2. Contact details and relevant professional links
3. Short professional summary
4. Core skills / technologies
5. Professional experience
6. Selected achievements or projects
7. Education
8. Certifications, if relevant
9. Languages
10. Additional information only when useful

## Experience bullets
Prefer evidence over responsibilities.

Use:
**Action + scope + technology/context + verified outcome**

Never invent metrics. If a metric is unavailable, describe the outcome accurately without fabricating a number.

## International applicants
- State your current location clearly.
- Mention relocation when relevant.
- State work authorization accurately.
- Keep visa/relocation information factual and brief.

## Language
Show German and English proficiency honestly. Use a recognized level when known.

## Photo and personal details
Practices vary by employer. A photo or extra personal information should not be treated as universally mandatory. Follow the employer's instructions.

## Formatting
Keep the CV professional, readable and searchable. A concise two-page CV is a useful target for many experienced technology professionals when it allows relevant evidence to be presented clearly. Submit PDF unless the employer requests another format.

## Final check
- Accurate claims
- Consistent dates
- Clear target role
- Relevant achievements first
- Current contact information
- Searchable/selectable text
`,
  },
  {
    path: "cv-template-professional.md",
    content: `# Professional CV Template

> Replace bracketed fields and remove instructions before submitting.

# [FULL NAME]
**[Target Job Title] | [Specialization]**

[City, Country] · [Phone] · [Email] · [LinkedIn] · [GitHub / Portfolio]

## PROFESSIONAL SUMMARY
[2–4 sentences describing your experience, specialization, strongest technologies and target role.]

## CORE SKILLS
**Languages:** [ ]
**Frameworks / Platforms:** [ ]
**Cloud / Infrastructure:** [ ]
**Architecture / Engineering:** [ ]
**Tools:** [ ]
**Leadership / Collaboration:** [ ]

## PROFESSIONAL EXPERIENCE
### [JOB TITLE] — [COMPANY]
[City, Country] · [MM/YYYY – Present or MM/YYYY]

- [Action] [what you delivered] using [technology/context], resulting in [verified outcome].
- [Action] [problem solved] for [scope], with [verified outcome].
- [Achievement showing ownership, complexity, scale, reliability, speed, revenue, cost or quality.]

### [PREVIOUS JOB TITLE] — [COMPANY]
[City, Country] · [MM/YYYY – MM/YYYY]

- [Achievement]
- [Achievement]
- [Achievement]

## SELECTED PROJECTS
### [PROJECT NAME]
[Description]
**Contribution:** [ ]
**Technology:** [ ]
**Outcome:** [ ]

## EDUCATION
[Degree] — [Institution], [Year]

## CERTIFICATIONS
- [Certification] — [Issuer], [Year]

## LANGUAGES
- [Language] — [Level]
`,
  },
  {
    path: "cv-template-senior-leadership.md",
    content: `# Senior / Leadership CV Template

> For Tech Lead, Solution Architect and Engineering Manager applications.

# [FULL NAME]
**[Target Leadership / Architecture Role]**

[City, Country] · [Phone] · [Email] · [LinkedIn] · [GitHub / Portfolio]

## EXECUTIVE SUMMARY
[3–5 sentences covering years of experience, leadership scope, architecture strengths, technology domain, business impact and target role.]

## LEADERSHIP & TECHNICAL STRENGTHS
- Technical strategy: [ ]
- Architecture: [ ]
- Engineering leadership: [ ]
- Team development: [ ]
- Delivery / execution: [ ]
- Stakeholder management: [ ]
- Cloud / platforms: [ ]
- Software engineering: [ ]

## PROFESSIONAL EXPERIENCE
### [TITLE] — [COMPANY]
[City, Country] · [MM/YYYY – Present]
**Scope:** [Team size, products, platforms or responsibility]

- Led [team / initiative] across [scope], delivering [verified outcome].
- Defined or evolved [architecture / technical strategy], addressing [problem].
- Partnered with [stakeholders] to [outcome].
- Mentored [engineers/leads] and improved [verified outcome].

## SELECTED ARCHITECTURE / ENGINEERING IMPACT
### [INITIATIVE]
**Problem:** [ ]
**Approach:** [ ]
**Technology:** [ ]
**Outcome:** [ ]

## EDUCATION
[Degree] — [Institution], [Year]

## CERTIFICATIONS
- [Certification] — [Issuer], [Year]

## LANGUAGES
- [Language] — [Level]
`,
  },
  {
    path: "cover-letter-templates.md",
    content: `# Cover Letter Templates

Use a tailored cover letter when it adds value or the employer requests one.

## Standard
**Subject: Application for [Job Title] — [Your Name]**

Dear [Hiring Manager / Hiring Team],

I am applying for the [Job Title] position at [Company]. With [X years] of experience in [software engineering / architecture / technology leadership], I have worked on [relevant area] and have particular experience with [2–3 relevant strengths].

What interests me about this role is [specific reason connected to the company, product or role]. In my current/recent position at [Company], I [specific achievement] which resulted in [verified outcome].

I believe my experience with [requirement 1] and [requirement 2] would allow me to contribute to [specific team/product/problem].

Kind regards,
[Full Name]

## Experienced Software Engineer
Dear [Hiring Manager / Hiring Team],

I am excited to apply for [Job Title] at [Company]. I bring [X years] of software engineering experience, with a focus on [domain] and hands-on work across [technologies].

In my recent role at [Company], I [achievement]. I also [second achievement], demonstrating experience with [job requirement].

The opportunity at [Company] stands out because [specific reason]. I would be pleased to discuss the position and my experience further.

Kind regards,
[Full Name]

## Senior / Leadership
Dear [Hiring Manager / Hiring Team],

I am applying for the [Job Title] position at [Company]. Over the past [X years], I have combined hands-on software engineering with [technical leadership / architecture / people leadership].

In my current/recent role, I have [leadership achievement] and [architecture/delivery achievement]. These experiences have strengthened my ability to translate business priorities into practical technical strategy and support engineering teams.

I am particularly interested in [Company] because [specific researched reason].

Kind regards,
[Full Name]

## Customization checklist
- Add one reason you want this company.
- Add one achievement directly relevant to the job.
- Connect two or three requirements to real experience.
- Use the exact job title.
- Remove every placeholder.
- Never claim experience you do not have.
`,
  },
  {
    path: "job-description-worksheet.md",
    content: `# Job Description Worksheet

## Job basics
**Company:**
**Job title:**
**Location:**
**Job ID / reference:**
**Application deadline:**
**Source / URL:**

## Must-have requirements
| Requirement | Evidence from my experience | Where to show it |
|---|---|---|
| [Requirement] | [Evidence] | CV / Cover letter |
| [Requirement] | [Evidence] | CV / Cover letter |
| [Requirement] | [Evidence] | CV / Cover letter |

## Nice-to-have requirements
| Requirement | My evidence | Priority |
|---|---|---|
| [Requirement] | [Evidence] | High / Medium / Low |
| [Requirement] | [Evidence] | High / Medium / Low |

## Technology keywords
- [ ]
- [ ]
- [ ]

## Evidence bank
**Achievement 1:** Situation / Action / Result
**Achievement 2:** Situation / Action / Result
**Achievement 3:** Situation / Action / Result

## CV changes
- [ ] Update headline
- [ ] Update summary
- [ ] Reorder relevant skills
- [ ] Add relevant achievement
- [ ] Remove irrelevant detail
- [ ] Check keywords naturally
- [ ] Check dates and facts

## Cover-letter changes
- [ ] Add company-specific reason
- [ ] Reference the target role
- [ ] Connect requirements to real experience
- [ ] Remove generic statements
- [ ] Proofread
`,
  },
  {
    path: "application-checklist.md",
    content: `# Germany Tech Application Checklist

## Before tailoring
- [ ] Read the complete job description.
- [ ] Confirm job title and reference number.
- [ ] Identify must-have requirements.
- [ ] Identify relevant technologies.
- [ ] Identify 3–5 matching achievements.
- [ ] Check location and work model.
- [ ] Check language requirements.
- [ ] Check work-authorization requirements.

## CV
- [ ] Target role is obvious.
- [ ] Summary matches the position.
- [ ] Relevant skills are easy to find.
- [ ] Experience bullets focus on achievements.
- [ ] No unsupported claims or invented metrics.
- [ ] Dates are consistent.
- [ ] Contact details are current.
- [ ] Links work.
- [ ] Final PDF opens correctly.

## Cover letter
- [ ] Correct company.
- [ ] Correct job title.
- [ ] Specific reason for applying.
- [ ] Relevant achievement included.
- [ ] Requirements connected to real experience.
- [ ] No copied job-description paragraphs.
- [ ] No placeholders remain.

## Submission
- [ ] Correct documents attached.
- [ ] Correct file names.
- [ ] Requested format followed.
- [ ] Application questions answered accurately.
- [ ] Work authorization / relocation information is accurate.
- [ ] Submitted before deadline.

## After submission
- [ ] Add application to tracker.
- [ ] Save job URL/reference.
- [ ] Record submission date.
- [ ] Record next follow-up date if appropriate.
`,
  },
  {
    path: "application-tracker.csv",
    content: `Company,Job Title,Location,Job URL,Job ID,Date Found,Date Applied,Status,Recruiter/Contact,Next Follow-up,Interview Date,Notes
,,,,,,,,,,,
`,
  },
  {
    path: "ai-prompts.md",
    content: `# AI Prompt Pack

Always verify AI output against your real experience.

## Job description analysis
Analyze the job description below for a Germany-based software/IT role.

Return:
1. Five must-have requirements
2. Five useful keywords
3. Three likely evaluation areas
4. Three areas of my experience to emphasize
5. Gaps I should address honestly

Do not invent qualifications.

JOB DESCRIPTION:
[Paste here]

MY EXPERIENCE:
[Paste here]

## CV tailoring
Tailor my CV toward the job description while preserving every factual claim. Do not invent metrics, technologies, employers, responsibilities, qualifications or achievements.

Return:
- Recommended headline
- Revised summary
- Skills to prioritize
- Experience bullets to rewrite
- Information to de-emphasize

JOB DESCRIPTION:
[Paste here]

CURRENT CV:
[Paste here]

## Achievement rewrite
Rewrite this CV bullet to emphasize action, technical complexity and measurable impact.

Rules:
- Keep facts unchanged.
- Do not invent numbers.
- Give 3 alternatives.

BULLET:
[Paste here]

## Cover letter review
Review this cover letter for a Germany-based technology role. Check relevance, evidence of fit, clarity, professional tone, unsupported claims, generic language and grammar. Suggest changes without changing facts.

JOB DESCRIPTION:
[Paste here]

COVER LETTER:
[Paste here]

## Interview preparation
Create 10 interview questions based only on the job description. Group them into Technical, Architecture / problem solving, Leadership / collaboration and Motivation. For each, provide the competency being evaluated.

## Final application review
Score 1–10:
- Role alignment
- Technical credibility
- Achievement evidence
- Clarity
- Country/context fit
- Overall readiness

Then provide the five highest-impact improvements.

Do not invent missing information.
`,
  },
];

export const careerPackageDefinitions: CareerPackageDefinition[] = [
  {
    id: "germany-software-it",
    country: "Germany",
    jobType: "Software / IT",
    files,
  },
];
