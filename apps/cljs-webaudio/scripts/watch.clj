(require '[cljs.build.api :as b]
         '[cljs.repl.browser :as br])

(future (b/watch "src" {:main 'audio.core
                        :output-to "out/main.js"
                        :output-dir "out"}))

(br/serve {:host "localhost"
           :port 9000})
