import { cam } from "./cam"
import { addPhysicsComp } from "./components/physics"
import { addRenderComp } from "./components/render"
import {
    BLACK0,
    BLACK1,
    BLUE,
    HEIGHT,
    JOYSTICK_SIZE,
    JOYSTICK_THUMB_SIZE,
    RED,
    UI_BAR_HEIGHT,
    UI_BAR_WIDTH,
    UI_BAR_X,
    UI_BAR_Y,
    WIDTH,
} from "./const"
import { renderFontTex } from "./core/font"
import { keys } from "./core/input"
import { stats } from "./stat"

let unloadPhysics: () => void
let unloadRender: () => void

export const unloadHud = () => {
    unloadPhysics()
    unloadRender()
}

const element_offset = 8

export const loadHud = () => {
    unloadPhysics = addPhysicsComp((dt) => {
        // this may not be the best place to update this
        stats.time += dt / 1e3
    })

    unloadRender = addRenderComp((ctx, assets) => {
        const PI2 = Math.PI * 2

        // stage light
        const lightRadius = stats.hero.lightRadius
        let transparency = "ee"
        if (lightRadius >= 100) {
            transparency = "80"
        } else if (lightRadius >= 90) {
            transparency = "aa"
        } else if (lightRadius >= 80) {
            transparency = "bb"
        } else if (lightRadius >= 70) {
            transparency = "cc"
        } else if (lightRadius > 60) {
            transparency = "dd"
        }
        const centerX = stats.hero.x - cam.x
        const centerY = stats.hero.y - cam.y
        ctx.fillStyle = BLACK0 + transparency
        ctx.beginPath()
        ctx.arc(centerX, centerY, lightRadius + 10, 0, PI2, false)
        ctx.arc(centerX, centerY, WIDTH, 0, PI2, true)
        ctx.fill()
        ctx.fillStyle = BLACK0 + "44"
        ctx.beginPath()
        ctx.arc(centerX, centerY, lightRadius, 0, PI2, false)
        ctx.arc(centerX, centerY, WIDTH, 0, PI2, true)
        ctx.fill()

        // bars fill
        ctx.fillStyle = RED
        ctx.fillRect(
            UI_BAR_X + element_offset,
            UI_BAR_Y,
            ~~(UI_BAR_WIDTH * (stats.hero.health / stats.hero.maxHealth)),
            UI_BAR_HEIGHT,
        )
        renderFontTex(
            ctx,
            stats.hero.health + "/" + stats.hero.maxHealth,
            UI_BAR_X + element_offset + 1,
            UI_BAR_Y + 1,
        )

        const blueY = ~~(UI_BAR_Y + UI_BAR_HEIGHT * 1.5)
        ctx.fillStyle = BLUE
        ctx.fillRect(
            UI_BAR_X + element_offset,
            blueY,
            ~~(UI_BAR_WIDTH * (stats.hero.xp / stats.hero.levelXp)),
            UI_BAR_HEIGHT,
        )
        renderFontTex(
            ctx,
            stats.hero.xp + "/" + stats.hero.levelXp,
            UI_BAR_X + element_offset + 1,
            blueY + 1,
        )

        // bars border
        ctx.strokeStyle = BLACK1
        ctx.strokeRect(
            UI_BAR_X + element_offset,
            UI_BAR_Y,
            UI_BAR_WIDTH,
            UI_BAR_HEIGHT,
        )
        ctx.strokeRect(
            UI_BAR_X + element_offset,
            blueY,
            UI_BAR_WIDTH,
            UI_BAR_HEIGHT,
        )
        // bars logo
        ctx.drawImage(assets.eHeart, UI_BAR_X - 2, UI_BAR_Y - 1, 8, 8)
        ctx.drawImage(assets.eXp, UI_BAR_X - 2, blueY - 1, 8, 8)

        // time
        const abstime = ~~stats.time
        const mins = ~~(abstime / 60)
        const secs = abstime % 60
        renderFontTex(
            ctx,
            mins + ":" + (secs < 10 ? "0" + secs : secs),
            ~~(WIDTH / 7) * 6,
            UI_BAR_Y,
        )

        // virtual joystick
        if (keys.touchStartPos) {
            ctx.fillStyle = "#ffe7"
            ctx.beginPath()
            ctx.arc(
                keys.touchStartPos.x * WIDTH,
                keys.touchStartPos.y * HEIGHT,
                JOYSTICK_SIZE,
                0,
                PI2,
            )
            ctx.closePath()
            ctx.fill()

            ctx.beginPath()
            ctx.arc(
                (keys.touchStartPos.x + keys.clampedTouchPos.x) * WIDTH,
                (keys.touchStartPos.y + keys.clampedTouchPos.y) * HEIGHT,
                JOYSTICK_THUMB_SIZE,
                0,
                PI2,
            )
            ctx.closePath()
            ctx.fill()
        }
    })
}
