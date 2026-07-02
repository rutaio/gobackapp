# AGENTS.md

## Project

GoBack is a solo-built fullstack app that helps people return to self-directed projects after interruptions by preserving context and encouraging small progress.

The product evolves through personal use, user interviews, and small experiments.

## Tech Stack

- React
- TypeScript
- Vite
- Supabase
- Google Auth
- Pico CSS

## Development Principles

- Preserve existing behavior unless asked to change it.
- Prefer the smallest safe solution.
- Avoid unnecessary rewrites and abstractions.
- Follow the existing project structure and naming.
- Use strict TypeScript; avoid `any`.
- Keep components focused and readable.
- Do not remove or redesign existing behavior without explaining the trade-offs first.

## Workflow

Before implementing:
- Explain the proposed approach.
- Identify the files that will change.

When implementing:
- Make the smallest safe change.
- Prefer incremental changes over large refactors.
- Don't mix unrelated improvements.
- Explain what changed.
- Suggest future improvements separately.

Ask before:
- introducing new dependencies
- changing architecture
- renaming core concepts

If multiple solutions exist, explain the trade-offs and recommend one.

## Product & UX

Treat current UI, terminology, and product decisions as hypotheses rather than permanent solutions.

Prefer validating ideas through copy, layout, interaction, or lightweight prototypes before adding new features.

Aim for interfaces that are calm, lightweight, welcoming, and easy to understand. Avoid unnecessary complexity.

## Testing

After changes:
- Ensure the project builds.
- Avoid TypeScript errors.
- Preserve existing functionality.
- Mention any manual testing required.

## Domain Language

- Thread = ongoing area of focus
- Check-in = completed action or update

Do not rename domain concepts unless requested.

## Collaboration

Teach, don't just generate code.

Explain why before how.

Assume the founder wants to understand implementation decisions, not only receive solutions.

Optimize for maintainability, understanding, and iterative product discovery over rapid feature delivery.

This project values learning over speed.