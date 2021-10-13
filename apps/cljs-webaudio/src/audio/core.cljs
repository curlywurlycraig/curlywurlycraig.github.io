;; A simple tone playing program demonstration the connection of
;; multiple nodes in an AudioContext.
(ns audio.core)

(enable-console-print!)

;; Create the context
(def ctx (new js/AudioContext))

;; Create source nodes
(def osc (.createOscillator ctx))
(set! (.-type osc) "triangle")

;; Create amplitude node
(def amp (.createGain ctx))
(set! (.. amp -gain -value) 1)

(defn trigger-amp
  [a]
  (doto (.-gain a)
    (.cancelScheduledValues 0)
    (.setValueAtTime 1 (.-currentTime ctx))
    (.linearRampToValueAtTime 0 (+ (.-currentTime ctx) 2))))

;; Set up connections
(.. osc
    (connect amp)
    (connect (.-destination ctx)))

(.start osc)

(.addEventListener js/window "keydown" #(trigger-amp amp))

