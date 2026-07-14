// Managers page content — EN from the Codex rebuild brief §5.3 (2026-07-14),
// HE verbatim from the Codex HE copy pack (03_MANAGERS_HE_COPY_20260714).
// Audience: the artist-side אמרגן / משרד אמרגנות — that term is CORRECT here
// (and ONLY here). Never the buyer (מזמין הופעות).
// Psychology: roster leverage — next actions, never a grade.
// Missing HE strings carry the TODO_HE marker — do not improvise Hebrew.

import { APP_URL } from '@/lib/app-url'
import type { IconId } from '@/components/marketing/icons'
import {
  TODO_HE,
  type CardContent,
  type FinalCtaContent,
  type HeroContent,
  type SectionHeadingContent,
} from './types'

export interface ManagersContent {
  meta: { title: string; description: string }
  hero: HeroContent & {
    /** Floating roster mini-card on the hero image (brief §5.3 hero right). */
    rosterCard: {
      label: string
      rows: { name: string; status: string }[]
    }
  }
  /** §5.3 section 1 — roster pain: scattered links, uneven readiness, follow-up gaps. */
  pain: SectionHeadingContent & { cards: CardContent[] }
  /** §5.3 section 2 — roster cockpit: artist cards with ONE next action. */
  cockpit: SectionHeadingContent & {
    /** "You always know which act is ready to pitch…" */
    note: string
    actionLabel: string
    readyLabel: string
    cards: { name: string; tag: string; ready: boolean; action: string }[]
  }
  /** §5.3 section 3 — ArtistAccess: grant, not ownership (+ small diagram). */
  access: SectionHeadingContent & {
    diagram: { title: string; body: string; icon: IconId }[]
    trustCard: { methodLabel: string; explanation: string }
  }
  /** §5.3 section 4 — one reaction inbox. */
  inbox: SectionHeadingContent & {
    panelLabel: string
    rows: { artist: string; reaction: string; when: string }[]
  }
  finalCta: FinalCtaContent
}

const SIGNUP = `${APP_URL}/signup`

const en: ManagersContent = {
  meta: {
    title: 'For Artist Managers — Make Every Roster Pitch Easier to Trust | LOCK',
    description:
      'LOCK helps your office see which act is ready to pitch, what would strengthen the next one, and how to send a Passport a buyer can read fast. Grant, not ownership. Join the manager beta.',
  },
  hero: {
    eyebrow: 'For artist managers & agencies',
    h1: 'Make every roster pitch easier to trust.',
    body: 'LOCK helps your office see which act is ready to pitch, what would strengthen the next one, and how to send a Passport a buyer can read fast.',
    primaryCta: { label: 'Join manager beta', href: SIGNUP },
    secondaryCta: { label: 'Register roster interest', href: '/contact' },
    trustLine: 'No scores. No rankings. Artists keep ownership of their identity.',
    imageAlt:
      'Agency roster room — a manager reviewing roster context in a calm office',
    rosterCard: {
      label: 'Roster · Next actions',
      rows: [
        { name: 'Maya Oren', status: 'Ready to pitch' },
        { name: 'Asaf Levi', status: 'One next action' },
        { name: 'Noa Peled', status: 'One next action' },
      ],
    },
  },
  pain: {
    eyebrow: 'Roster pain',
    title: 'The roster is strong. The pitching is scattered.',
    cards: [
      {
        title: 'Scattered links.',
        body: 'Every pitch starts with hunting — a bio in one folder, clips in another chat, numbers in someone’s memory.',
      },
      {
        title: 'Uneven readiness.',
        body: 'Some acts could be sent today; others are missing one detail. From the outside it’s hard to see which is which.',
      },
      {
        title: 'Buyer follow-up gaps.',
        body: 'Reactions land in five different threads. By the time you follow up, the moment has moved on.',
      },
    ],
  },
  cockpit: {
    eyebrow: 'Roster cockpit',
    title: 'Roster readiness without ranking.',
    body: 'See which proof each artist on your roster still needs — as next actions, never as a grade.',
    note: 'You always know which act is ready to pitch and what would make the next one ready.',
    actionLabel: 'Next action',
    readyLabel: 'Ready to pitch',
    cards: [
      {
        name: 'Maya Oren',
        tag: 'Melodic techno · Tel Aviv',
        ready: true,
        action: 'Passport ready — share it before Friday’s call.',
      },
      {
        name: 'Asaf Levi',
        tag: 'Live electronic',
        ready: false,
        action: 'Invite the producer of the 12 Jun club night to confirm it.',
      },
      {
        name: 'Noa Peled',
        tag: 'Open-format DJ',
        ready: false,
        action: 'Approve two media tiles for the public Passport.',
      },
    ],
  },
  access: {
    eyebrow: 'ArtistAccess',
    title: 'ArtistAccess — a consented grant, not ownership.',
    body: 'Artists grant your office scoped access to their Passport. The identity stays theirs; the pitch power becomes yours.',
    diagram: [
      {
        title: 'Artist owns identity',
        body: 'The Passport, the evidence and the final say stay with the artist.',
        icon: 'artist',
      },
      {
        title: 'Manager gets scoped access',
        body: 'Your office pitches with the Passport through a visible, revocable grant.',
        icon: 'manager',
      },
      {
        title: 'Buyer sees Passport',
        body: 'One clean, method-labelled page with a trust card — never a grade.',
        icon: 'buyer',
      },
    ],
    trustCard: {
      methodLabel: 'Grant, not ownership',
      explanation: 'Every grant is visible, revocable and honest.',
    },
  },
  inbox: {
    eyebrow: 'One inbox',
    title: 'One inbox for Passport reactions.',
    body: 'Every buyer reaction to a roster artist’s Passport lands in one place.',
    panelLabel: 'Reactions · Roster',
    rows: [
      {
        artist: 'Maya Oren',
        reaction: 'A booking manager opened the Passport and asked about April availability.',
        when: 'Today',
      },
      {
        artist: 'Asaf Levi',
        reaction: 'An event producer viewed the Passport ahead of a Friday-night slot.',
        when: 'Yesterday',
      },
      {
        artist: 'Noa Peled',
        reaction: 'A private client asked for a call after reading the Passport.',
        when: 'This week',
      },
    ],
  },
  finalCta: {
    title: 'Bring your roster into the pilot.',
    body: 'The manager workspace is in closed beta.',
    primaryCta: { label: 'Join manager beta', href: SIGNUP },
    secondaryLink: { label: 'See how artists use LOCK', href: '/artists' },
  },
}

const he: ManagersContent = {
  meta: {
    title: 'למנהלי אמנים ומשרדי אמרגנות — להפוך כל פנייה של רוסטר לברורה יותר | LOCK',
    description:
      'LOCK עוזרת למשרד אמרגנות להבין איזה אמן מוכן לפנייה, מה חסר כדי לחזק את הבא, ואיך לשלוח פספורט שמזמין הופעות יכול להבין מהר.',
  },
  hero: {
    eyebrow: 'למנהלי אמנים ומשרדי אמרגנות',
    h1: 'רוסטר חזק צריך יותר מלינקים. הוא צריך הקשר שאפשר לשלוח.',
    body: 'LOCK עוזרת למשרד אמרגנות להבין איזה אמן מוכן לפנייה, מה חסר כדי לחזק את הבא, ואיך לשלוח פספורט שמזמין הופעות יכול להבין מהר.',
    primaryCta: { label: 'להצטרף לבטא למשרדי אמרגנות', href: SIGNUP },
    secondaryCta: { label: 'לרשום עניין לרוסטר', href: '/contact' },
    trustLine: 'להציג כל אמן ברוסטר עם יותר הקשר ופחות ניחושים',
    imageAlt: TODO_HE,
    rosterCard: {
      label: TODO_HE,
      rows: [
        { name: TODO_HE, status: TODO_HE },
        { name: TODO_HE, status: TODO_HE },
        { name: TODO_HE, status: TODO_HE },
      ],
    },
  },
  pain: {
    eyebrow: TODO_HE,
    title: TODO_HE,
    cards: [
      { title: TODO_HE, body: TODO_HE },
      { title: TODO_HE, body: TODO_HE },
      { title: TODO_HE, body: TODO_HE },
    ],
  },
  cockpit: {
    eyebrow: TODO_HE,
    title: 'מוכנות רוסטר בלי דירוגים',
    body: 'לראות מה יעזור לכל אמן ברוסטר להתקדם — כפעולות הבאות, לא כציון.',
    note: 'להבין איזה אקט מוכן לשליחה, ומה חסר כדי להפוך את הבא למוכן יותר.',
    actionLabel: TODO_HE,
    readyLabel: TODO_HE,
    cards: [
      { name: TODO_HE, tag: TODO_HE, ready: true, action: TODO_HE },
      { name: TODO_HE, tag: TODO_HE, ready: false, action: TODO_HE },
      { name: TODO_HE, tag: TODO_HE, ready: false, action: TODO_HE },
    ],
  },
  access: {
    eyebrow: 'ArtistAccess',
    title: 'ArtistAccess — הרשאה בהסכמה, לא בעלות',
    body: 'האמן נותן למשרד גישה מוגדרת לפספורט שלו. הזהות נשארת של האמן; יכולת ההצגה המקצועית מתחזקת אצלכם.',
    diagram: [
      { title: TODO_HE, body: TODO_HE, icon: 'artist' },
      { title: TODO_HE, body: TODO_HE, icon: 'manager' },
      { title: TODO_HE, body: TODO_HE, icon: 'buyer' },
    ],
    trustCard: {
      methodLabel: 'הרשאה בהסכמה, לא בעלות',
      explanation: 'כל הרשאה גלויה, ניתנת לביטול וברורה לשני הצדדים.',
    },
  },
  inbox: {
    eyebrow: TODO_HE,
    title: 'מקום אחד לתגובות על פספורטים',
    body: 'כל תגובה ממזמין הופעות לפספורט של אמן ברוסטר מגיעה למקום אחד.',
    panelLabel: TODO_HE,
    rows: [
      { artist: TODO_HE, reaction: TODO_HE, when: TODO_HE },
      { artist: TODO_HE, reaction: TODO_HE, when: TODO_HE },
      { artist: TODO_HE, reaction: TODO_HE, when: TODO_HE },
    ],
  },
  finalCta: {
    title: TODO_HE,
    body: 'מרחב מנהלי האמנים נמצא בבטא סגורה.',
    primaryCta: { label: 'להצטרף לבטא למשרדי אמרגנות', href: SIGNUP },
    secondaryLink: { label: 'לראות איך זה עובד לאמנים', href: '/artists' },
  },
}

export const managersContent: Record<'en' | 'he', ManagersContent> = { en, he }
