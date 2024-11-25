import { Skill } from "src/skills/skill"
import { Hero } from "src/heroes/hero"
import { WavesKey } from "src/mob"

import { Hero1 } from "./heroes/hero1"

class Stats {
    won = false
    score = 0
    /** Time passed since game session start, in seconds */
    time = 0
    waveStartTime = 0
    wave: WavesKey = 1
    hero!: Hero
}

export const stats = new Stats()

export const resetStats = () => {
    stats.won = false
    stats.wave = 1
    stats.waveStartTime = stats.time = 0
    stats.score = 0
    stats.hero = new Hero1()
}
