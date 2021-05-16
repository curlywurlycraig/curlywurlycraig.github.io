- [ ] Only execute cells when they are outdated
  I.e. their dependencies have updated.
  Prevent infinite loops!
  Or, allow them, but they must proceed incrementally... that could be good for non-linear functions... chaos!
- [ ] Add cell ranges
- [ ] Highlight cells which are lisp
- [ ] Add ability to make column and row functions
  I.e. functions which populate rows/columns
- [ ] Add ability to upload CSV
- [ ] Research and think about proper lispy things like cons cells,
  and metaprogramming features.
  Also lambdas, map, reduce, and so on
- [ ] Document available built in functions
- [ ] Make it possible to define your own functions
- [ ] Learn how to use C header files
- [ ] Visualisation (3d would be very cool)
- [ ] Select multiple cells
- [ ] Fill down, fill right
- [ ] Click to select cell in formula
- [ ] Virtualised table
- [ ] Syntax highlighting on formulas
- [ ] Add even more cells
- [ ] Improve styling

## Parser improvements

Should evaluate lists more cleanly. Eval the first entry to get a function pointer.

Add quote, or linked lists. This will be necessary for row/column functions