(require '[cljs.build.api :as b])

(b/watch "src"
  {:main 'three-body-problem.core
   :output-to "out/three_body_problem.js"
   :output-dir "out"})
