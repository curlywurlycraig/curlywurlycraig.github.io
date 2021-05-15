- [ ] Create a simple lisp parser
- [ ] Allow cells to contain lisp
- [ ] Execute lisp in cells containing lisp
- [ ] Allow cells to be specified in lisp
- [ ] Only execute cells when they are outdated
  I.e. their dependencies have updated.
  Prevent infinite loops!
  Or, allow them, but they must proceed incrementally... that could be good for non-linear functions... chaos!
- [ ] Automatically open a larger text input when an open paren is entered
- [ ] Highlight cells which are lisp
- [ ] Add ability to make column and row functions
  I.e. functions which populate rows/columns
- [ ] Add ability to upload CSV
- [ ] Research and think about proper lispy things like cons cells,
  and metaprogramming features.

## Parser improvements

Should evaluate lists more cleanly. Eval the first entry to get a function pointer.

Add quote, or linked lists. This will be necessary for row/column functions