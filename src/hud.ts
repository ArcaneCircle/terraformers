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

let unloadRender: () => void

export const unloadHud = () => {
    unloadRender()
}

const element_offset = 8

export const loadHud = () => {
    unloadRender = addRenderComp((ctx, assets) => {
        const PI2 = Math.PI * 2

        // stage light
        const lightRadius = Math.max(stats.hero.lightRadius, stats.lightRadius)
        const centerX = stats.hero.x - cam.x
        const centerY = stats.hero.y - cam.y
        ctx.fillStyle = BLACK0 + stats.darkness.toString(16)
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
        const zeroPad = (numb: number) => (numb < 10 ? "0" + numb : numb)
        const hour = stats.hour
        const mins = ~~(hour * 60) % 60
        renderFontTex(
            ctx,
            zeroPad(~~hour) + ":" + zeroPad(mins),
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
