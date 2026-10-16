# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Node.js, Express, HTML5, Vanilla CSS, and Vanilla JavaScript. (Chosen to deliver a lightweight, high-performance RESTful API with a zero-dependency, ultra-fast frontend dashboard).

## Users

Autonomous fleet operations managers, air logistics dispatchers, and aviation API developers managing cargo drone routes, live payload telematics, and airspace safety protocols.

## Product Purpose

AeroPulse is an autonomous cargo drone fleet dispatch and telemetry tracking platform. It allows logistics teams to monitor live drone telemetry, track cargo payload delivery states, inspect battery and altitude vitals, dispatch priority freight missions, and interface via clean REST API endpoints.

## Positioning

Unlike conventional generic parcel tracking systems, AeroPulse is built around mission-critical aeronautical telemetry (vector coordinates, battery dissipation rates, altitude hold, wind-shear alerts) coupled with deterministic RESTful API integration for automated warehouses.

## Operating Context

Used in logistics control rooms, warehouse dispatch bays, and developer terminals under low-ambient light conditions requiring high legibility, real-time data streaming, and immediate command execution.

## Capabilities and Constraints

- **Fleet Telemetry Monitoring**: Real-time status (`airborne`, `docked`, `returning`, `maintenance`), battery level, payload capacity, altitude, and GPS coordinates.
- **Mission Dispatch Engine**: Validation of payload weight against drone capacity, autonomous waypoint route generation, and immediate mission tracking.
- **Operational Status Control**: Dedicated patch endpoints for return-to-base and status transitions.
- **Developer API Explorer**: Interactive in-browser console matching Postman collection specifications.
- **Constraints**: In-memory database with persistent initial seeds, zero external database setup required for seamless local evaluation.

## Brand Commitments

- **Name**: AeroPulse Telemetry & Airspace Dispatch API
- **Voice**: Technical, precise, authoritative, mission-ready, and transparent.
- **Visual Identity**: Aeronautical dark cockpit console, high-contrast cyan/emerald telemetry accents, crisp geometric structure, and tabular data legibility.

## Evidence on Hand

Seed dataset containing 6 industrial cargo drones across sectors Alpha, Beta, Gamma, and Delta, complete with serial identifiers, battery metrics, payload weights, and flight telemetry. Complete Postman v2.1.0 collection file included for testing.

## Product Principles

1. **Immediate Telemetric Legibility**: Critical flight numbers and status badges must be readable at a glance without visual ambiguity.
2. **Deterministic REST Architecture**: Standard HTTP semantics (200, 201, 400, 404), uniform JSON envelopes, and descriptive validation errors.
3. **Actionable State Transitions**: UI controls immediately reflect API mutations with responsive state confirmation.

## Accessibility & Inclusion

- Dark console theme calibrated for WCAG AA contrast (minimum 4.5:1 on text elements).
- Tabular numerals (`tabular-nums`) for jitter-free live numeric meters.
- Visible focus rings (`:focus-visible`) across all interactive buttons, inputs, and tabs.
- Full keyboard operability and semantic ARIA labeling for telemetry meters.
