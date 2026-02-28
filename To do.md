# What still needs to be done

1. ✅ Non-editable columns on gantt and data table.
2. ✅ Fix `erasableSyntaxOnly` and `verbatimModuleSyntax` on ui.
3. Roadmap view with objectives, KRs and tasks on one gantt chart.
    - ✅ Gantt must support child items.
    - ✅ Gantt must support items without or with only one date.
    - Gantt must support timeboxes
    - Gantt must support links between items
    - Option to add warning on gantt - When task dates are outside of assigned sprint (small ! icon at to right top of a bar with a tooltip)
    - Option to color rows, both on data table and gantt chart - Objectives purple, KRs orange and tasks without color.
4. Progress matrix.
5. Filtering tasks.
6. Editing description in objective, KR and task.
7. Custom rich text documents.
8. ✅ Objectives with calculated progress based on KRs.
    - ✅ KRs can have progress based on: Yes/no; Percentage or by assigned tasks completion.
9. Update page title and favicon
10. Handle somehow the fact that after years there will be too much data to display on gantt chart. Filtering on roadmap as well?
11. ✅ Change this "data view" bullshit into simple react composition:
    - ✅ ColumnDescription takes render function
    - ✅ change dataTypes into components
    - ✅ Add maybe some utils for inplacing, but it's handled at the dataType component level.