import { loadCam, unloadCam } from "./cam"
import { loadCoin, unloadCoin } from "./coin"
import { physicsPause } from "./components/physics"
import { obsEmit, obsStart } from "./core/observer"
import { loadFloor, unloadFloor } from "./floor"
import { loadHud, unloadHud } from "./hud"
import { loadMob, unloadMob } from "./mob"
import { Observable } from "./observables"
import { playTheme, stopTheme } from "./sound"
import { resetStats, stats } from "./stat"
import { loadText, unloadText } from "./text"

export const enum Scene {
    intro,
    title,
    gameplay,
    powerup,
    gameover,
}

let scene: Scene
obsStart(Observable.scene)

const unloadGameEntities = () => {
    if (scene === Scene.gameplay) {
        unloadCam()
        unloadFloor()
        unloadMob()
        unloadCoin()
        stats.hero.unload()
        unloadHud()
        unloadText()
    }
}

const loadGameEntities = () => {
    // order matters
    loadCam()
    loadFloor()
    stats.hero.load()
    loadCoin()
    loadMob()
    loadText()
    loadHud()
}

export const loadIntro = () => {
    unloadGameEntities()
    scene = Scene.intro
    obsEmit(Observable.scene, scene)
}

export const loadTitle = () => {
    unloadGameEntities()
    scene = Scene.title
    obsEmit(Observable.scene, scene)
}

export const startGame = () => {
    resetStats()
    loadGameEntities()
    scene = Scene.gameplay
    obsEmit(Observable.scene, scene)
    playTheme()
}

export const endGame = () => {
    unloadGameEntities()
    scene = Scene.gameover
    obsEmit(Observable.scene, scene)
    stopTheme()
}

export const powerupMenu = () => {
    physicsPause(true)
    scene = Scene.powerup
    obsEmit(Observable.scene, scene)
}

export const prerpareDeathScene = () => {
    unloadHud()
    stats.hero.unloadSkills()
    unloadCam()
    stopTheme()
    obsEmit(Observable.scene, scene)
    window.highscores.setScore({ score: stats.score, time: stats.time })
}

export const resumeGame = () => {
    physicsPause(false)
    scene = Scene.gameplay
    obsEmit(Observable.scene, scene)
}
