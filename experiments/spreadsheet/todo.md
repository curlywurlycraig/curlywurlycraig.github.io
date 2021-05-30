# Use header files

# Cell ranges

- [ ] Evaluate :C1-C5 as a list

# Lambdas, function references, etc

- [ ] Add `filter`
- [ ] Add `reduce`
- [ ] Add ability to store parsed lisp in an env
      (Basically some `fun` builtin)
- [ ] Add ability to execute parsed lisp in the env

# Evaluation order

- [ ] Only execute cells when they are outdated
  I.e. their dependencies have updated.
  Prevent infinite loops!
  Or, allow them, but they must proceed incrementally... that could be good for non-linear functions... chaos!
- [ ] Virtualise list

# Lazy lists

Add another lazy list elem that has an unknown number of elements and
uses an iterator instead. E.g. `(repeat 10)`

- [ ] Add `(repeat x)` function
- [ ] Add `(take x)` function
- [ ] Add `(drop x)` function
- [ ] Use lazy lists for whole columns (e.g. :A)

# Write a proper allocator

- [ ] Rewrite mmalloc so that it can be deallocated.
- [ ] When de-allocating, only de-allocate the tokenizer result and the parse result. Search through calls to `mmalloc` and ensure they're all removed.

# Backend execution feature

- [ ] Get the LISP interpreter running in Deno/node
- [ ] Write tests: run loads of scenarios in there and make assertions
- [ ] Write an API that allows for CRUD.
- [ ] Add a feature whereby cells can be marked as exposed via API.
- [ ] The sheet has some ID, and you could do e.g.
      `GET /sheet/:sheetId/:cellName`. Maybe you can do named queries,
      and add multiple things. So if you name cells `total`, `average`,
      and maybe a list like `values`, you'd get:
      `GET /sheet/:sheetId/income`
      ```json
      {
            total: 123,
            average: 111,
            values: [104, 400, 145]
      }
      ```
- [ ] Probably want sheet versioning too.

# Improvements

Make bindings a map instead of an array.

Don't do string comparison of idents all the time. Instead, replace string names with a numerical ID.

Move utilities to other files. E.g. the envIsCellNameList etc should be their own file.

# Backlog

- [ ] Highlight cells which are lisp
- [ ] Add ability to upload CSV
- [ ] Add ability to do web scraping. This would combine nicely with column/cell formulas
      since you could do e.g. `(web-scrape "https://blah.blah" "span.someclass")`
      and get all the contents of those spans as cells.

      Will need to reveal a callback that accepts data.
      As in, WASM calls fetch, sets requisite cells to some
      "waiting" value, then JS eventually calls a "done"
      callback with resulting fetch data. It might need to ask
      WASM for a place to store the result.

      Try to do what I showed Meg as a demo: get 2018 values of countries by cherry production
      with a simple formula:
      (https://en.wikipedia.org/wiki/List_of_countries_by_cherry_production)

- [ ] Research and think about proper lispy things like cons cells,
  and metaprogramming features.
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
- [ ] Format cells