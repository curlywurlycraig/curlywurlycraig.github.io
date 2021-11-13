(ns three-body-problem.core)

(enable-console-print!)

(def c (. js/document getElementById "c"))

(set! (.-width c) (* 2 (.-clientWidth c)))
(set! (.-height c) (* 2 (.-clientHeight c)))

(def ctx (. c getContext "2d"))
(set! (.-fillStyle ctx) "#e4a85c")
(set! (.-strokeStyle ctx) "#e4a85c")
(set! (.-lineWidth ctx) 1)

(def MAX-TRAIL-LENGTH 100)

;; Gravitational constant.
;; https://en.wikipedia.org/wiki/Gravitational_constant
(def G 6.674e-11)

(def presets
  {
   :earth-sun
   [
    {:r 6.37e+6
     :m 5.972e+24
     :x 150.56e+9
     :y 0
     :xv 0
     :yv 30e+3
     :collides false
     :color "#ff4444"}
    {:r 636.34e+6
     :m 1.989e+30
     :x 0 :y 0
     :xv 0 :yv 0
     :collides false
     :color "#44ff44"}
    {:r 1e+6
     :m 1e+24
     :x 0 :y 200e+12
     :xv 0 :yv 0
     :collides false
     :color "#4444ff"}
    ]

   :ejector
   [
    {:r 446715316.7201177
     :m 4.747801601113963e+30
     :x -234395537652.3922
     :y 146091689581.0697
     :xv -19682.5108207867
     :yv -16608.53383736956
     :collides false
     :color "#ff4444"}
    {:r 108445631.96879774
     :m 6.348716039263539e+30
     :x 4957727711.402954
     :y 208081910850.28613
     :xv 4401.989805949335
     :yv 18975.83202357812
     :collides false
     :color "#44ff44"}
    {:r 172940993.23917344
     :m 1.409398865053951e+30
     :x 206322935360.31714
     :y -127981731257.94144
     :xv 26295.314170081256
     :yv 3060.2088297695154
     :collides false
     :color "#4444ff"}
    ]
   })

(def init-camera
  {:x 0
   :y 0
   :xscale 10e+12 ;; From left to right, distance in metres
   })

(def init-bodies (:ejector presets))
(def bodies (atom init-bodies))
(def history (atom [init-bodies]))
(def camera (atom init-camera))

;; This is about a an earth year in a couple of seconds
(def time-rate (atom 1e+7))

(defn random-range
  [low high]
  (let [range (- high low)]
    (+ low (* range (Math/random)))))

(defn randomize-position
  [body]
  (merge body {:r (random-range 0.1e+6 600e+6)
               :m (random-range 1e+24 10e+30)
               :x (random-range -300e+9 300e+9)
               :y (random-range -300e+9 300e+9)
               :xv (random-range -30e+3 30e+3)
               :yv (random-range -30e+3 30e+3)
               :collides false}))

(defn randomize
  []
  (swap! bodies #(map randomize-position %))
  (reset! history [@bodies])
  (println bodies))

(defn newton-gravity
  "F = G(m1*m2)/r^2. Returns as :fx and :fy dimension components of the force."
  [body other]
  (let [xdiff (- (:x other) (:x body))
        ydiff (- (:y other) (:y body))
        theta (Math/atan (/ ydiff xdiff))
        x-square (Math/pow xdiff 2)
        y-square (Math/pow ydiff 2)
        r-square (+ x-square y-square)
        m1m2 (* (:m other) (:m body))
        f (* G (/ m1m2 r-square))
        xsign (if (> 0 xdiff) -1 1)
        ysign (if (> 0 ydiff) -1 1)]
    {:fx (* xsign f (Math/abs (Math/cos theta)))
     :fy (* ysign f (Math/abs (Math/sin theta)))}))

(defn collide?
  "Returns true if body collides with other."
  [body other]
  (let [xdist (- (:x body) (:x other))
        ydist (- (:y body) (:y other))
        dist (Math/sqrt (+ (Math/pow xdist 2) (Math/pow ydist 2)))]
    (< dist (+ (:r body) (:r other)))))
  
(defn update-body
  "Given a body and the others, return a new body with new position and velocity."
  [body other1 other2]
  (let [time-passed (* @time-rate (/ 1 60))
        first-grav (newton-gravity body other1)
        second-grav (newton-gravity body other2)
        fx (+ (:fx first-grav) (:fx second-grav))
        fy (+ (:fy first-grav) (:fy second-grav))
        ax (/ fx (:m body))
        ay (/ fy (:m body))
        scale-time #(* time-passed %)
        new-xv (+ (:xv body) (scale-time ax))
        new-yv (+ (:yv body) (scale-time ay))
        new-x (+ (:x body) (scale-time new-xv))
        new-y (+ (:y body) (scale-time new-yv))
        collides-any (or (collide? body other1) (collide? body other2))]
    (merge body (if collides-any
                  {:collides true}
                  {:xv new-xv
                   :yv new-yv
                   :x new-x
                   :y new-y}
                  ))))

(defn update-bodies 
  "Return new bodies, after applying all force changes to all bodies."
  [[first second third]]
  [(update-body first second third)
   (update-body second third first)
   (update-body third first second)])

(defn update-history!
  []
  (swap! history #(conj (vec (take-last MAX-TRAIL-LENGTH %)) @bodies)))

(defn update-bodies!
  "Stateful update to the bodies in the atom."
  []
  (swap! bodies update-bodies))

(defn draw-circle
  [ctx c x y r]
  (set! (.-fillStyle ctx) c)
  (doto ctx
    (.beginPath)
    (.arc x y r 0 (* Math/PI 2))
    (.closePath)
    (.fill)))

(defn draw-line
  [ctx c x1 y1 x2 y2]
  (set! (.-strokeStyle ctx) c)
  (doto ctx
    (.beginPath)
    (.moveTo x1 y1)
    (.lineTo x2 y2)
    (.closePath)
    (.stroke)))

(defn draw-bodies
  "Draw all the bodies to the canvas."
  []
  (let [cw (.-width c)
        ch (.-height c)
        zoom-factor (/ cw (:xscale @camera))
        zoom #(* zoom-factor %)
        xmidpx (/ cw 2)
        ymidpx (/ ch 2)]
    (.clearRect ctx 0 0 cw ch)
    (doseq [[i [all-before all-after]] (map-indexed vector (partition 2 1 @history))]
      (doseq [[before after] (map list all-before all-after)]
        (let [frames-in-past (- (count @history) i)
              percentage-of-max (min (/ (+ frames-in-past 1) MAX-TRAIL-LENGTH) 1)]
            (set! (.-globalAlpha ctx) (- 1 percentage-of-max))
            (draw-line
             ctx
             (:color before)
             (+ (zoom (:x before)) xmidpx)
             (+ (zoom (:y before)) ymidpx)
             (+ (zoom (:x after)) xmidpx)
             (+ (zoom (:y after)) ymidpx))
            (set! (.-globalAlpha ctx) 1))))
    (doseq [body @bodies]
      (draw-circle
       ctx
       (:color body)
       (+ (zoom (:x body)) xmidpx)
       (+ (zoom (:y body)) ymidpx)
       (max 2 (zoom (:r body)))))))

(defn animation-loop-body
  "Called every animation frame."
  []
  (update-history!)
  (if (not-any? :collides @bodies) (update-bodies!))
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
