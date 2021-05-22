# Column formula

Populate a column from a formula.

What needs to happen? Want to `evalLisp(...)` and have results be in the computed sources.
So `evalLisp` needs to put its results in its own buffer, instead of just returning a single value result.
Process is:

1. Execute all the lisp that needs to be executed (this can be done in a lazy efficient way later). All of the cells for now.
2. Results are stored in a buffer. This can just be floats for now, but eventually will need to be strings too.
   1. E.g. I'd want to store lots of country codes from a column formula.
3. Display the results of all the cells.

The column formulas need to return some kind of list data type.
Parse result also will need to be a data type, instead of just a float.

So here's the tasks:

- [ ] Update the lisp interpreter to pass around parse result data types (that can be either lists of floats, or floats, for now).
- [ ] Create an `evalColumn(columnIndex, lisp)` or something that evals the lisp and stores the result in the column at `columnIndex`.
- [ ] Call `evalColumn(...)` for cell sources in the columns

# Lambdas, function references, etc

Column formulas are not so useful without being able to specify
e.g. `(map (lambda...) some-list)`.

One of the Parse types should be function. Those can be executed with arguments.
Eventually these should be able to be stored in the env:
(i.e. with `(fun some-func [arg1 arg2] ...)`)


# Backlog

- [ ] Only execute cells when they are outdated
  I.e. their dependencies have updated.
  Prevent infinite loops!
  Or, allow them, but they must proceed incrementally... that could be good for non-linear functions... chaos!
- [ ] Add cell ranges
- [ ] Highlight cells which are lisp
- [ ] Add ability to upload CSV
- [ ] Add ability to do web scraping. This would combine nicely with column/cell formulas
      since you could do e.g. `(web-scrape "https://blah.blah" "span.someclass")`
      and get all the contents of those spans as cells.

      Try to do what I showed Meg as a demo: get 2018 values of countries by cherry production
      with a simple formula:
      (https://en.wikipedia.org/wiki/List_of_countries_by_cherry_production)

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
- [ ] Lazy evaluation of cells.
  - [ ] Define (take n) etc as well.

## Parser improvements

Should evaluate lists more cleanly. Eval the first entry to get a function pointer.

Add quote, or linked lists. This will be necessary for row/column functions