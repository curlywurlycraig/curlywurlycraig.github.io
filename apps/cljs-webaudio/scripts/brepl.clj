(require
  '[cljs.build.api :as b]
  '[cljs.repl :as repl]
  '[cljs.repl.browser :as browser])

(b/build "src"
  {:main 'audio.core
   :output-to "out/main.js"
   :output-dir "out"
   :verbose true})

(repl/repl (browser/repl-env)
           :watch "src"
           :output-dir "out")
