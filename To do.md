# What still needs to be done

## MVP

1. ✅ Non-editable columns on gantt and data table.
2. ✅ Fix `erasableSyntaxOnly` and `verbatimModuleSyntax` on ui.
3. ✅ Roadmap view with objectives, KRs and tasks on one gantt chart.
    - ✅ Gantt must support child items.
    - ✅ Gantt must support items without or with only one date.
    - ✅ Gantt must support timeboxes
    - ✅ Option to color rows, both on data table and gantt chart - Objectives purple, KRs orange and tasks without color.
4. ✅ Editing description in objective, KR and task.
5. ✅ Custom rich text documents.
6. ✅ Objectives with calculated progress based on KRs.
    - ✅ KRs can have progress based on: Yes/no; Percentage or by assigned tasks completion.
7. ✅ Update page title and favicon
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
14. ✅ Sprints per context year
15. ✅ Fix Table deselecting when clicking a button (See: DeleteSprintsButton.tsx)
16. ✅ Backend errors are mapped to user friendly messages and displayed in notifications
17. ✅ Header on roadmap

## First release

1. Fix Gantt and Data table – Better UX
    - changing order of columns
    - ✅ resizable width of table and chart
    - Gantt timeboxes show periods on tooltip
2. ✅ Fix Auth – Use firebase
    - ✅ Login and register
    - ✅ Forgot password
    - ✅ Change password
    - ✅ Change email
    - ✅ Log out
    - ✅ Delete account
      - ✅ Deleting account must delete both firebase account and data associated with it in a local database.
3. ✅ Work on performance
    - ✅ It turns out it's not a problem in a production build
4. Better UI
    - Better inplace - Editor and display share similar styles - same font weight, size etc.
5. ✅ Navigating to the index actually shows something.
6. Make sure it works on mobile.
    - ✅ Hide gantt chart on mobile, leaving only the table
    - ✅ Sidebar hides on navigation on mobile
    - ✅ User dropdown works on mobile
    - Column resize works on mobile
      - Maybe it shouldn't work on mobile - maybe on mobile columns should be fixed width
7. ✅ Drag and drop on board - Changing order
8. ✅ Drag and drop on roadmap - changing order and parent
    - ✅ Data table uses Jotai (In perspective, it was a bad choice)
    - ✅Drag and drop on Datatable
      - ✅ Rendering drop indicator - indicating both new position and parent
      - ✅ greying out dragged rows and its children
      - ✅ emitting drop result
    - ✅ Drag and drop on Gantt
9. ✅ Drag and drop on roadmap - gantt chart, change task dates and objective deadlines
10. ✅ Removing sprints that are used by some work item - right now it fails. It should show a message that it cannot be done.

# Ideas for future releases

1. Immediately after first release I need to work on migrations
    - Migration tests on CI
2. Dark mode
    - CSS colors needs to be ported to using semantic tokens instead of color palettes
3. Demo mode – allow users to try out the app without creating an account
    - Login and register page has a link to demo mode
    - When in demo, frontend should always display a banner at the top showing that this is a demo and changes won't be persisted
    - Ideally, logged in user should also be able to enter demo mode for exploring without worrying of changing production data
      - 🤔 How routing should be handled? All links will be prefixed with `/demo` to avoid accidental redirrect to main account.
    - In demo mode, backend uses mock data
    - All changes in demo mode are lost when the app is refreshed
      - 🤔 how it should be done on backend side?
        - Should all repositories have different implementation for demo mode?
        - Or maybe it should be handled at app layer level?
        - Or maybe naive solution - on enter create new account with "demo" flag, and periodically delete all accounts with "demo" flag after some inactivity?
    - Should avoid code duplication as much as possible
4. Technical - Better integration of DataTable and gantt, so that it willl be possible to, for example:
    - When dragging, highlight row on both dataTable and gantt
5. Technical - Refactor data-table completely
    - Use divs with flex or grid instead of tables - avoid table's layout quirks
    - Try some approach with some global state management for shared data between components
      - I still don't know what
        - Jotai on board didn't pass the exam. Ideal solution that I have in mind would be something like angular services, but it's not "react way".
        - React context api also is not ideal, as shown in gantt.
        - The problem lies in passing props to the store introduces not-ideal `useEffect` usages.
        - Maybe stick to hooks executed at the root level and passed props, just like it is now, but structure it better, with a more "data-first" approach, and don't rely too much on UI when it's unnecessary
    - Also, ties to the previous point, with better integration of DataTable and gantt, so that it will be possible to, for example: