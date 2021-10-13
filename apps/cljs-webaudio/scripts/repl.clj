(require
  '[cljs.repl :as repl]
  '[cljs.repl.browser :as br])

(repl/repl (br/repl-env))
