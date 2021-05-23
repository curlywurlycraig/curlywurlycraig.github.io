# Lambdas, function references, etc

Column formulas are not so useful without being able to specify
e.g. `(map (lambda...) some-list)`.

One of the Parse types should be function. Those can be executed with arguments.
Eventually these should be able to be stored in the env:
(i.e. with `(defn some-func (arg1 arg2) ...)`)

Lambda syntax thoughts.

`(f (x y) (+ x y))` Probably my favourite.
`((x y) (+ x y))` Interesting, but would prevent e.g. `((if cond + -) 1 2)`
`(\ (x y) (+ x y))` Nice, but very similar to `(/ 1 2)` i.e. division
`(. (x y) (+ x y))`

- [ ] Add lambdas. `(fn (x y) (+ x y))`
- [ ] Add `map` and `filter`
- [ ] Add `reduce`
- [ ] Add ability to store parsed lisp in an env
      (Basically some `fun` builtin)
- [ ] Add ability to execute parsed lisp in the env

# Write a proper allocator

- [ ] Rewrite mmalloc so that it can be deallocated.
- [ ] When de-allocating, only de-allocate the tokenizer result and the parse result. Search through calls to `mmalloc` and ensure they're all removed.

# Lazy lists

Add another lazy list elem that has an unknown number of elements and
uses an iterator instead. E.g. `(repeat 10)`

- [ ] Add `(repeat x)` function
- [ ] Add `(take x)` function
- [ ] Add `(drop x)` function

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
