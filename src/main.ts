import "@webxdc/highscores"
import { loadAssets } from "./asset"
import { CompPhysicsRun } from "./components/physics"
import { CompRenderRun } from "./components/render"
import { HEIGHT, WIDTH, DEBUG } from "./const"
import { resize } from "./core/canvas"
import { initInput } from "./core/input"
import { loop } from "./core/loop"
import { loadTitle, loadIntro } from "./scene"
import { loadSounds } from "./sound"
import { renderUI, updateUI } from "./ui"

const canvas = document.getElementById("c") as HTMLCanvasElement
const ctx = canvas.getContext("2d")!
const processInput = initInput(canvas, WIDTH, HEIGHT)

;(async () => {
    ;(onresize = () => {
        resize(canvas, WIDTH, HEIGHT)
    })()

    loadIntro()
    renderUI(ctx, null)
    loadSounds()

    await window.highscores.init({
        getAnnouncement: (name, result) => {
            const zeroPad = (numb) => (numb < 10 ? "0" + numb : numb)
            const abstime = ~~result.time
            const mins = zeroPad(~~(abstime / 60))
            const secs = zeroPad(abstime % 60)
            return `${name} scored ${result.score} in ${mins}:${secs}`
        },
        compareScores: (score1, score2) => score1.score - score2.score,
        getInitialScore: () => {
            return { score: 0, time: 0 }
        },
    })

    const start = new Date()
    console.log("loading assets...")
    const assets = await loadAssets()
    console.log("done loading assets...")
    const toWait = 3e3 - (new Date() - start)
    if (!DEBUG && toWait > 0) {
        await new Promise((res) => setTimeout(res, toWait))
    }
    loadTitle()

    loop(
        (dt) => {
            processInput()
            CompPhysicsRun(dt)
            // we have separate methods for UI because it draws above all entities
            updateUI(dt)
        },
        () => {
            CompRenderRun(ctx, assets)
            renderUI(ctx, assets)
        },
    )
})()
