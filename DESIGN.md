---
name: AeroPulse Design System
description: Tactical aeronautical telemetry & mission dispatch console
colors:
  bg-base: "#080c14"
  bg-surface: "#0f172a"
  bg-surface-raised: "#1e293b"
  bg-surface-subtle: "#131e33"
  border-subtle: "#1e293b"
  border-medium: "#334155"
  border-accent: "#0284c7"
  text-primary: "#f8fafc"
  text-secondary: "#cbd5e1"
  text-muted: "#94a3b8"
  accent-cyan: "#38bdf8"
  accent-blue: "#0369a1"
  btn-primary-bg: "#0369a1"
  status-operational: "#10b981"
  status-operational-bg: "rgba(16, 185, 129, 0.16)"
  status-warning: "#f59e0b"
  status-warning-bg: "rgba(245, 158, 11, 0.16)"
  status-critical: "#ef4444"
  status-critical-bg: "rgba(239, 68, 68, 0.16)"
  status-airborne: "#38bdf8"
  status-airborne-bg: "rgba(56, 189, 248, 0.16)"
typography:
  display:
    fontFamily: "Syne, sans-serif"
    fontSize: "clamp(2rem, 4vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  heading:
    fontFamily: "Syne, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0"
  mono:
    fontFamily: "Azeret Mono, monospace"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.btn-primary-bg}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "10px 18px"
  button-primary-hover:
    backgroundColor: "{colors.accent-cyan}"
    textColor: "{colors.bg-base}"
  badge-operational:
    backgroundColor: "{colors.status-operational-bg}"
    textColor: "{colors.status-operational}"
    rounded: "{rounded.full}"
    padding: "3px 10px"
---

# AeroPulse Visual Design System

## Overview

AeroPulse is designed for high-density, mission-critical aeronautical telemetry operations. The interface prioritizes rapid scanning, precise visual hierarchy, and instant command feedback. Taking inspiration from advanced aerospace avionics and flight dispatch consoles, the palette operates in a dark cockpit environment with high-contrast, purposeful telemetry accents.

## Colors

- **Base Canvas (`#080c14`)**: Ultra-deep aeronautical navy canvas minimizing eye fatigue in low-light operations.
- **Card/Surface Canvas (`#0f172a`, `#131e33`)**: High-contrast slate blue card backgrounds giving clear structure without harsh boundaries.
- **Surface Raised (`#1e293b`)**: Elevated modules, popovers, and table headers.
- **Borders (`#1e293b`, `#334155`)**: Crisp 1px structural framing.
- **Primary Text (`#f8fafc`)**: Crisp near-white for high legibility (contrast ratio > 14:1 against base).
- **Secondary Text (`#cbd5e1`)**: Slate text tinted with a subtle cool undertone (contrast ratio > 7:1).
- **Telemetry Indicators**:
  - Operational / Docked: `#10b981` (Emerald)
  - Airborne / In Flight: `#38bdf8` (Aero Sky)
  - Warning / Low Battery: `#f59e0b` (Amber)
  - Maintenance / Critical Alert: `#ef4444` (Coral Red)
  - Interactive Accents: `#38bdf8` (Telemetry Cyan) and `#0369a1` (Flight Blue)

## Typography

- **Display & Section Headings**: `Syne` (weights 600, 700). Technical, geometric, commanding, and authentic to aeronautical instrumentation.
- **Body & Labels**: `DM Sans` (weights 400, 500). Exceptional legibility at small sizes, optimal tracking, and clean humanist clarity.
- **Data & Telemetry**: `Azeret Mono` with `font-variant-numeric: tabular-nums`. Applied strictly to telemetry values (GPS coordinates, battery %, flight speeds, altitude meters, and JSON payloads).

## Layout

- Structured 12-column responsive grid with consistent 24px gutters.
- Visual hierarchy:
  1. Top Navigation Bar: System status pill, live clock, WebSocket/API ping indicator.
  2. Fleet Telemetry Overview: 4 quick vital stat summaries (Active Airborne, Docked Ready, Average Battery, Total Missions Dispatched).
  3. Main Operational Hub: Split 2-column or 3-column operational layout with interactive drone fleet cards and live telemetry monitor.
  4. Mission Dispatch Bay: Responsive form for instantaneous drone deployment.
  5. Postman & API Explorer: Interactive workbench allowing direct execution and inspection of the 4 Postman test queries.

## Elevation & Depth

- Elevation is achieved through soft, neutral ambient shadows:
  - Base Card: `box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.5); border: 1px solid #1e293b;`
  - Hover Card: `box-shadow: 0 10px 28px -4px rgba(0, 0, 0, 0.7); border-color: #334155;`
  - Active Modal/Popover: `box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);`

## Shapes

- Strict geometric radii:
  - Outer panels and cards: `rounded-md` (8px).
  - Telemetry badges and status pills: `rounded-full` (9999px).
  - Data inputs and command buttons: `rounded-sm` (4px).

## Components

- **Status Badges**: Semi-transparent saturated backdrop with solid high-contrast text and a steady live status dot.
- **Telemetry Gauge / Battery Meter**: Accessible progress element with dynamic color transitions (`#10b981` > 50%, `#f59e0b` 20-50%, `#ef4444` < 20%).
- **Interactive Action Buttons**: Tactile feel with distinct `:hover`, `:active`, and `:focus-visible` focus rings (`outline: 2px solid #38bdf8; outline-offset: 2px;`).
- **Terminal & Postman Response Inspector**: Dark syntax-highlighted code block with mono numerals, copy button, and HTTP response badges.

## Do's and Don'ts

- **DO** use tabular numerals (`tabular-nums`) for all changing numbers to prevent layout jitter.
- **DO** provide immediate inline status feedback upon API mutation.
- **DO** maintain strict WCAG AA contrast for all textual cues.
- **DON'T** use gradient text or decorative glassmorphism that obscures text readability.
- **DON'T** use generic emojis as icons; use authored crisp inline SVGs.
- **DON'T** use monospace font for body prose; reserve strictly for technical telemetry, identifiers, and JSON code.
