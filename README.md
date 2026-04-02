# Senior Frontend Interview: Velorona Assignment

Welcome to the Velorona Senior Frontend Assignment. This project is designed to evaluate your ability to handle real-world complexity, architectural patterns, and user experience at scale. 

We don't expect you to build a complete product, but we do look for senior-level depth in the features you implement.

---

## The Technology Stack

The project is initialized with a modern, high-performance stack. We encourage you to leverage these libraries to their full potential:

-   Next.js 15 (App Router) & React 19
-   Tailwind CSS 4 (configured with the new @theme engine)
-   TanStack Query v5 for server state and mutations
-   Radix UI for accessible primitives (Dialog, Select, Popover)
-   Framer Motion for high-quality layout animations
-   Zod & React Hook Form for type-safe form management
-   Recharts for data visualization

---

## Tasks

### Task 1: "Strategic Split" — Form State Orchestration
Enterprise users often need to split a single large expense (e.g., a $5,000 SaaS bill) into multiple internal categories or cost centers. This requires a sophisticated form that handles complex field-level synchronization.

**Hard Requirements:**
1.  **Transactional Integrity:** The sum of all split amounts must match the parent amount exactly. You must implement a "Remaining Balance" UI that provides real-time feedback and dynamic validation states.
2.  **Schema-Driven Validation:** Implement a schema that handles cross-field dependencies (e.g., the "Submit" button remains disabled until the `splitTotal === parentAmount`).
3.  **Partial Deletions & Re-balancing:** When a split row is deleted, you must decide how to handle the widowed balance (either leave it unallocated or provide a "Re-allocate" utility).
4.  **Optimized Rendering:** Using a large number of rows (50+) in the split form should not cause input lag. Demonstrate use of efficient state updates in a dynamic list.

**Senior-Level Considerations:**
-   How do you handle currency precision (floating point math) in the split logic?
-   How is the "Draft" state of a split expense persisted if the user accidentally closes the sheet?
-   Implementation of "Quick-Split" (e.g., split equally between N rows) is a major UX bonus.

---

### Task 2: "Insightful Transitions" — Data Visualization & Animation
The dashboard currently lacks deep analytical capabilities. Admins need to "pivot" through spending data with seamless visual continuity.

**Hard Requirements:**
1.  **Morphing Transitions:** Use framer-motion to animate the transition from an Annual Bar Chart (aggregated) to a Monthly Time-Series (granular). The transition must NOT be a simple swap—bars should morph or scale into the new view.
2.  **Efficient Data Aggregation:** The API returns raw expense objects. Implement a performant client-side data processor that groups and memoizes results by year, month, and category without blocking the main thread.
3.  **Dynamic Tooltips & Multi-Series:** Implement interactive tooltips that show "Contextual Insight"—not just the value, but the percentage growth compared to the previous period (YoY and MoM).
4.  **Time-Series Continuity:** Ensure the chart handles "Empty Gaps" (months with no spend) correctly without breaking the line/bar progression.

**Senior-Level Considerations:**
-   What is your approach to handling data sets with 5,000+ points? (SVG vs Canvas, virtualization, or sub-sampling).
-   How do you ensure the chart remains accessible (screen readers, keyboard focus on data points)?

---

### Task 3: "Reliable Batching" — Resilience & Concurrency
Users need to approve hundreds of expenses at once. The current implementation is naïve and doesn't handle the unreliable nature of the simulated backend.

**Hard Requirements:**
1.  **Concurrency-Limited Queue:** Implement a request scheduler that processes actions in batches (e.g., max 3 active requests at any time).
2.  **Granular Reversion:** If 2 out of 10 items fail (due to the API's 20% failure rate), only those 2 items should revert to "Pending" state in the UI. The rest should stay "Approved."
3.  **Atomic Status Sync:** Ensure that any global filters or totals (e.g., "Total Pending Amount") are synced in real-time as individual items in the batch complete, rather than waiting for the entire batch.
4.  **Global Background State:** Implement a persistent progress UI (toast or progress bar) that survives navigation or list re-fetching, showing the current queue status.

**Senior-Level Considerations:**
-   How do you handle "Duplicate Intent" (e.g., a user clicks Approve on an item that is already in the processing queue)?
-   How do you log and surface "Partial Success" to the user without overwhelming them with multiple toast notifications?

---

## What We Look For (Evaluation Criteria)

| Criteria | Senior Expectation |
| :--- | :--- |
| **Code Quality** | Clean, idiomatic React. Effective use of Hooks, Types, and separation of concerns. |
| **State Management** | Proper choice between local, global, and server state. (e.g., Not over-using `useEffect`). |
| **Performance** | Avoiding unnecessary re-renders in the list/chart. Efficient data aggregation. |
| **UX Polish** | Handling edge cases (empty states, loading spinners, error boundaries). |
| **Typesafety** | Strong TypeScript usage—avoid `any` at all costs. |

---

## Getting Started

1.  **Install dependencies:** `pnpm install`
2.  **Run dev server:** `pnpm dev`
3.  **Explore the Mock API:** See `src/services/api.mock.ts` for available endpoints and simulated network behaviors.

---

## Submission Guidelines

-   **Branching:** Create a new branch `feature/my-submission` or just commit to `main`.
-   **README Update:** Add a short `SUBMISSION.md` or append to this README explaining your technical choices, any trade-offs you made, and what you'd do with more time.
-   **Video (Optional but Recommended):** A 2-minute walkthrough explaining your implementation is highly appreciated.

Good luck. We can't wait to see how you approach these challenges.

