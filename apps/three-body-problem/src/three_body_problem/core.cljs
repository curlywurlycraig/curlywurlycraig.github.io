(ns three-body-problem.core
  (:require [clojure.browser.repl :as repl]
            [cljs.pprint]))

;; (defonce conn
;;   (repl/connect "http://localhost:9000/repl"))

(def c (. js/document getElementById "c"))
(def ctx (. c getContext "2d"))

(set! (.-fillStyle ctx) "#e4a85c")
(set! (.-lineWidth ctx) 0)

(enable-console-print!)

(def init-bodies
  [{:r 20
    :x 200
    :y 0
    :xv 0
    :yv 2.5}
   {:r 20
    :x -200
    :y 0
    :xv 0
    :yv -2.5}
   {:r 1
    :x 0
    :y 400
    :xv 5
    :yv 0}])

(def bodies (atom init-bodies))

(defn newton-gravity
  "F = G(m1*m2)/r^2. Returns as :fx and :fy dimension components of the force."
  [body other]
  (let [g 25 ; TODO stop using g as a time variable, it's not the right place
        xdiff (- (:x other) (:x body))
        ydiff (- (:y other) (:y body))
        theta (Math/atan (/ ydiff xdiff))
        x-square (Math/pow xdiff 2)
        y-square (Math/pow ydiff 2)
        r-square (+ x-square y-square)
        m1m2 (* (:r other) (:r body))
        f (* g (/ m1m2 r-square))
        xsign (if (> 0 xdiff) -1 1)
        ysign (if (> 0 ydiff) -1 1)]
    {:fx (* xsign f (Math/abs (Math/cos theta)))
     :fy (* ysign f (Math/abs (Math/sin theta)))}))
  
(defn update-body
  "Given a body and the others, return a new body with new position and velocity."
  [body other1 other2]
  (let [first-grav (newton-gravity body other1)
        second-grav (newton-gravity body other2)
        fx (+ (:fx first-grav) (:fx second-grav))
        fy (+ (:fy first-grav) (:fy second-grav))
        new-xv (+ (:xv body) fx)
        new-yv (+ (:yv body) fy)
        new-x (+ (:x body) new-xv)
        new-y (+ (:y body) new-yv)]
    (merge body {:xv new-xv
                 :yv new-yv
                 :x new-x
                 :y new-y})))

(defn update-bodies 
  "Return new bodies, after applying all force changes to all bodies."
  [[first second third]]
  [(update-body first second third)
   (update-body second third first)
   (update-body third first second)])

(defn update-bodies!
  "Stateful update to the bodies in the atom."
  []
  (swap! bodies update-bodies))

(defn draw-circle!
  [ctx x y r]
  (doto ctx
    (.beginPath)
    (.arc x y r 0 (* Math/PI 2))
    (.fill)))

(defn draw-bodies
  "Draw all the bodies to the canvas."
  []
  (let [cw (.-width c)
        ch (.-height c)
        ox (/ cw 2)
        oy (/ ch 2)]
    (.clearRect ctx 0 0 cw ch)
    (doseq [body @bodies]
      (draw-circle!
       ctx
       (+ (:x body) ox)
       (+ (:y body) oy)
       (:r body)))))

(defn animation-loop-body
  "Called every animation frame."
  []
  (update-bodies!)
  (draw-bodies))

(defn animate
  "Apply animation loop body every frame."
  []
  (animation-loop-body)
  (.requestAnimationFrame js/window animate))

(draw-bodies)
(animate)
