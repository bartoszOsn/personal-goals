# What still needs to be 

## MVP

1. ✅ Non-editable columns on gantt and data table.
2. ✅ Fix `erasableSyntaxOnly` and `verbatimModuleSyntax` on ui.
3. ✅ Roadmap view with objectives, KRs and tasks on one gantt chart.
    - ✅ Gantt must support child items.
    - ✅ Gantt must support items without or with only one date.
    - ✅ Gantt must support timeboxes
    - ✅ Option to color rows, both on data table and gantt chart - Objectives purple, KRs orange and tasks without color.
4. ✅ Editing description in objective, KR and task.
5. Custom rich text documents.
6. ✅ Objectives with calculated progress based on KRs.
    - ✅ KRs can have progress based on: Yes/no; Percentage or by assigned tasks completion.
7. Update page title and favicon
8. ✅ Handle somehow the fact that after years there will be too much data to display on gantt chart. Filtering on roadmap as well?
    - ✅ Handled by context
9. ✅ Change this "data view" bullshit into simple react composition:
   - ✅ ColumnDescription takes render function
   - ✅ change dataTypes into components
   - ✅ Add maybe some utils for inplacing, but it's handled at the dataType component level.
10. ✅ Update "All OKRs" to use Data table - OR, maybe just remove this screen and make sure that all this can be done on roadmap
11. ✅ Tooltip on gantt bar – on roadmap name of the work item
12. ✅ Board uses new work-item architecture
13. ✅ Remove old architecture from code
14. Sprints per context year

## First release

1. Fix Data table – Better UX
2. Fix Auth – Better security, ability to change password, recover account etc.
3. Work on performance
4. Better UI 
5. Make sure it works on mobile.
6. Ability to change sprint settings
7. Drag and drop on board - Changing order
8. Drag and drop on roadmap - changing order, and moving tasks between KRs
9. Drag and drop on roadmap - gantt chart, change task dates and objective deadlines
10. Clicking on the gantt chart selects items
11. Filtering tasks.
