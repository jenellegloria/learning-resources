# Tool Testing

Run the dev server, then open each URL to test the tool.

```
npm run dev
```

---

## Tools

| Tool | URL |
|---|---|
| Hub (home) | `http://localhost:5173/#/` |
| Kant's Categorical Imperative | `http://localhost:5173/#/kant-categorical-imperative` |
| Utility Calculator | `http://localhost:5173/#/utility-calculator` |
| Aristotle's Golden Mean | `http://localhost:5173/#/aristotle-golden-mean` |
| Trolley Problem | `http://localhost:5173/#/trolley-problem` |
| Aristotle's Final End | `http://localhost:5173/#/aristotle-final-end` |

---

## Per-tool notes

### Utility Calculator (`utility-calculator-plain.jsx`)
- Click **Start** to get past the splash screen
- Add two or more named options, each with at least one consequence
- Expand a consequence to test the Mill / Preference sliders
- Click **Compute** and verify the results table renders
- Test **Copy results** button

### Aristotle's Golden Mean (`golden-mean-activity.jsx`)
- Step through all 7 stages using the nav buttons
- On the Brainstorm step, try entering virtue names and check matching
- On the Golden Mean step, drag the slider and verify excess/deficiency labels update
- Complete the full flow to the final "Your Scale" step

### Trolley Problem (`trolley-problem-lab.jsx`)
- Select an option on each scenario and verify the result panel appears
- Check that the philosophy alignment scores update after each choice
- Navigate through all scenarios and verify the summary screen at the end

### Aristotle's Final End (`aristotle-final-end.jsx`)
- Phase 1 (Why Chain): add a goal and click "Why?" repeatedly to build the chain
- Phase 2 (Value Categorization): categorize each item as instrumental / intrinsic / both
- Phase 3 (Final End): verify the summary reflects your chain and categorizations
