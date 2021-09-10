(ns three-body-problem.core)

(def c (. js/document getElementById "c"))

(set! (.-width c) (* 2 (.-clientWidth c)))
(set! (.-height c) (* 2 (.-clientHeight c)))

(def ctx (. c getContext "2d"))
(set! (.-fillStyle ctx) "#e4a85c")
(set! (.-strokeStyle ctx) "#e4a85c")
(set! (.-lineWidth ctx) 0)

(def MAX-TRAIL-LENGTH 100)

(enable-console-print!)

(def init-bodies
  [{:r 10
    :x 200 :y 0
    :xv 0 :yv 2.5}
   {:r 10
    :x -200 :y 0
    :xv 0 :yv -2.5}
   {:r 5
    :x 0 :y 500
    :xv 0 :yv 0}])

(def bodies (atom init-bodies))
(def history (atom [init-bodies]))

(defn random-range
  [low high]
  (let [range (- high low)]
    (+ low (* range (Math/random)))))

(defn random-body
  []
  {:r (random-range 5 15)
   :x (random-range -300 300)
   :y (random-range -300 300)
   :xv (random-range -3 3)
   :yv (random-range -3 3)})

(defn randomize
  []
  (reset! bodies (take 3 (repeatedly random-body)))
  (reset! history [@bodies])
  (println bodies))

(defn newton-gravity
  "F = G(m1*m2)/r^2. Returns as :fx and :fy dimension components of the force."
  [body other]
  (let [g 50 ; TODO stop using g as a time variable, it's not the right place
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

(defn update-history!
  []
  (swap! history conj @bodies))

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

(defn draw-line!
  [ctx x1 y1 x2 y2]
  (doto ctx
    (.beginPath)
    (.moveTo x1 y1)
    (.lineTo x2 y2)
    (.stroke)))

(defn draw-bodies
  "Draw all the bodies to the canvas."
  []
  (let [cw (.-width c)
        ch (.-height c)
        ox (/ cw 2)
        oy (/ ch 2)]
    (.clearRect ctx 0 0 cw ch)
    (doseq [[i [all-before all-after]] (map-indexed vector (partition 2 1 @history))]
      (doseq [[before after] (map list all-before all-after)]
        (let [frames-in-past (- (count @history) i)
              percentage-of-max (min (/ (+ frames-in-past 1) MAX-TRAIL-LENGTH) 1)]
            (set! (.-globalAlpha ctx) (- 1 percentage-of-max))
            (draw-line!
             ctx
             (+ (:x before) ox)
             (+ (:y before) oy)
             (+ (:x after) ox)
             (+ (:y after) oy))
            (set! (.-globalAlpha ctx) 1))))
    (doseq [body @bodies]
      (draw-circle!
       ctx
       (+ (:x body) ox)
       (+ (:y body) oy)
       (:r body)))))

(defn animation-loop-body
  "Called every animation frame."
  []
  (update-history!)
  (update-bodies!)
  (draw-bodies))

(defn animate
  "Apply animation loop body every frame."
  []
  (animation-loop-body)
  (.requestAnimationFrame js/window animate))

(def random-button (. js/document getElementById "random"))
(.addEventListener random-button "click" randomize)

(draw-bodies)
(animate)
