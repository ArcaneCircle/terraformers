import { Assets } from "./asset"
import {
    BLACK0,
    BLACK1,
    DDGREEN,
    DGREEN,
    HEIGHT,
    MENU_FONT_SIZE,
    RED,
    UI_TRANSITION_DURATION,
    WHITE,
    WIDTH,
    APPNAME,
} from "./const"
import { type CTX } from "./core/canvas"
import { renderFont, renderFontTex } from "./core/font"
import { keys } from "./core/input"
import { ticker } from "./core/interpolation"
import { clamp, lerp, pointInRect } from "./core/math"
import { obsListen } from "./core/observer"
import { Observable } from "./observables"
import { loadTitle, resumeGame, Scene, startGame } from "./scene"
import { stats } from "./stat"
import { Upgrade } from "./upgrade"

type UpgradeId = 0 | 1 | 2
let hoveredUpgrade: UpgradeId = 0
const upgrades: Upgrade[] = []
const selectUpgrade = (id: UpgradeId) => () => {
    upgrades[id].apply()
    resumeGame()
}

const transition = ticker(UI_TRANSITION_DURATION)

const halfSecond = ticker(500)
let buttonBlink = false

let runTransition = false
let scene: Scene
let prevScene: Scene
obsListen(Observable.scene, (next: Scene) => {
    if (
        next === Scene.powerup ||
        ((scene === Scene.title || scene === Scene.gameover) &&
            next === Scene.gameplay)
    ) {
        transition.reset()
        runTransition = true
    }
    if (next === Scene.powerup) {
        upgrades.splice(0)
        upgrades.push(...stats.hero.getUpgrades())
    }
    prevScene = scene
    scene = next
})

const btn = (
    x: number,
    y: number,
    w: number,
    h: number,
    onClick: () => void,
) => {
    const obj = {
        x,
        y,
        w,
        h,
        hovered: false,
        update: () => {
            if (runTransition) {
                return
            }
            obj.hovered = pointInRect(
                keys.ptr.x * WIDTH,
                keys.ptr.y * HEIGHT,
                x,
                y,
                w,
                h,
            )
            if (keys.btnp.clk && obj.hovered) {
                onClick()
            }
        },
        click: onClick,
        //render: (ctx: CTX) => {
        //    //if (DEBUG && obj.hovered) {
        //    //    ctx.fillStyle = BLACK1
        //    //}
        //    ctx.fillRect(x, y, w, h)
        //},
    }
    return obj
}

const BTN_SIZE = 32
const startBtn = btn(
    ~~(WIDTH / 3) + 16,
    ~~(HEIGHT / 3) * 2,
    MENU_FONT_SIZE * 4 * 6,
    BTN_SIZE,
    startGame,
)
const upgrade1btn = btn(
    ~~(WIDTH / 7) * 1,
    ~~(HEIGHT / 2) - 10,
    BTN_SIZE,
    BTN_SIZE,
    selectUpgrade(0),
)
const upgrade2btn = btn(
    ~~(WIDTH / 7) * 3,
    ~~(HEIGHT / 2) - 10,
    BTN_SIZE,
    BTN_SIZE,
    selectUpgrade(1),
)
const upgrade3btn = btn(
    ~~(WIDTH / 7) * 5,
    ~~(HEIGHT / 2) - 10,
    BTN_SIZE,
    BTN_SIZE,
    selectUpgrade(2),
)

export const updateUI = (dt: number) => {
    if (halfSecond.tick(dt)) {
        buttonBlink = !buttonBlink
    }
    switch (scene) {
        case Scene.intro:
            break
        case Scene.title:
            startBtn.update()
            break
        case Scene.powerup:
            upgrade1btn.update()
            upgrade2btn.update()
            upgrade3btn.update()
            hoveredUpgrade = upgrade1btn.hovered
                ? 0
                : upgrade2btn.hovered
                  ? 1
                  : upgrade3btn.hovered
                    ? 2
                    : hoveredUpgrade
            if (keys.btnp.rt) {
                hoveredUpgrade = clamp(hoveredUpgrade + 1, 0, 2) as UpgradeId
            }
            if (keys.btnp.lf) {
                hoveredUpgrade = clamp(hoveredUpgrade - 1, 0, 2) as UpgradeId
            }
            if (keys.btnp.spc) {
                if (hoveredUpgrade === 0) {
                    upgrade1btn.click()
                }
                if (hoveredUpgrade === 1) {
                    upgrade2btn.click()
                }
                if (hoveredUpgrade === 2) {
                    upgrade3btn.click()
                }
            }
            break
        case Scene.gameover:
            startBtn.update()
            break
    }
    if (runTransition && transition.tick(dt)) {
        runTransition = false
    }
}

export const renderIntro = (ctx: CTX) => {
    ctx.fillStyle = WHITE
    renderFontTex(
        ctx,
        APPNAME +
            "\n\nBASED ON XIICUR SURVIIVORS BY WWW.SAUD.WTF\n\nLOADING...",
        20,
        20,
    )
}

export const renderUI = (ctx: CTX, assets: Assets) => {
    if (runTransition) {
        // normalized, 0 -> 1
        const norm = transition.ticks / UI_TRANSITION_DURATION
        switch (scene) {
            case Scene.gameplay:
                if (prevScene === Scene.title || prevScene === Scene.gameover) {
                    // 0 -> 1 -> 0
                    //const norm2 = norm * 2
                    //const lerpval = norm2 < 1 ? norm2 : 2 - norm2

                    // 1 -> 0
                    const lerpval = 1 - norm
                    ctx.fillStyle = "#000"
                    ctx.fillRect(0, 0, WIDTH, lerp(0, HEIGHT, lerpval))
                }
                break

            case Scene.powerup:
                ctx.fillStyle = BLACK0 + "77"
                ctx.fillRect(0, 0, WIDTH, HEIGHT)
                ctx.fillStyle = DDGREEN
                ctx.fillRect(
                    0,
                    HEIGHT / 3 - 8,
                    ~~(WIDTH * norm) + 32,
                    HEIGHT / 3,
                )
                ctx.fillStyle = DGREEN
                ctx.fillRect(0, HEIGHT / 3, ~~(WIDTH * norm), HEIGHT / 3)
                // we don't want to render buttons until transition is done
                return
        }
    }
    switch (scene) {
        case Scene.intro:
            renderIntro(ctx)
            break

        // such a bespoke title rendering technique
        case Scene.title:
            const titleY = 15
            const bgX = ~~((WIDTH - assets.titleBg.width) / 2)
            const bgY = ~~((HEIGHT - assets.titleBg.height) / 2)
            ctx.drawImage(assets.titleBg, bgX, bgY + titleY)

            ctx.fillStyle = BLACK0
            //startBtn.render(ctx)
            ctx.fillStyle = BLACK1
            renderFont(
                ctx,
                APPNAME,
                MENU_FONT_SIZE,
                ~~(WIDTH / 3.6) + 1,
                titleY + 2,
            )
            ctx.fillStyle = WHITE
            renderFont(
                ctx,
                APPNAME,
                MENU_FONT_SIZE,
                ~~(WIDTH / 3.6) - 1,
                titleY,
            )

            if (buttonBlink) {
                renderFont(
                    ctx,
                    "START",
                    MENU_FONT_SIZE,
                    startBtn.x + 10,
                    startBtn.y + 10,
                )
            }
            break

        case Scene.powerup:
            // bg
            ctx.fillStyle = BLACK0 + "77"
            ctx.fillRect(0, 0, WIDTH, HEIGHT)
            ctx.fillStyle = DDGREEN
            ctx.fillRect(0, HEIGHT / 3 - 8, WIDTH, HEIGHT / 3)
            ctx.fillStyle = DGREEN
            ctx.fillRect(0, HEIGHT / 3, WIDTH, HEIGHT / 3)
            ctx.fillStyle = WHITE
            renderFont(
                ctx,
                "SELECT UPGRADE",
                MENU_FONT_SIZE,
                ~~(WIDTH / 7),
                ~~(HEIGHT / 7),
            )

            //if (DEBUG) {
            //    ctx.fillStyle = GREY
            //    upgrade1btn.render(ctx)
            //    ctx.fillStyle = GREY
            //    upgrade2btn.render(ctx)
            //    ctx.fillStyle = GREY
            //    upgrade3btn.render(ctx)
            //}

            // icons
            ctx.imageSmoothingEnabled = false
            ctx.drawImage(
                assets.eBg,
                upgrade1btn.x,
                upgrade1btn.y,
                BTN_SIZE,
                BTN_SIZE,
            )
            ctx.drawImage(
                assets.eBg,
                upgrade2btn.x,
                upgrade2btn.y,
                BTN_SIZE,
                BTN_SIZE,
            )
            ctx.drawImage(
                assets.eBg,
                upgrade3btn.x,
                upgrade3btn.y,
                BTN_SIZE,
                BTN_SIZE,
            )
            ctx.drawImage(
                assets[upgrades[0].sprite] as HTMLImageElement,
                upgrade1btn.x,
                upgrade1btn.y,
                BTN_SIZE,
                BTN_SIZE,
            )
            ctx.drawImage(
                assets[upgrades[1].sprite] as HTMLImageElement,
                upgrade2btn.x,
                upgrade2btn.y,
                BTN_SIZE,
                BTN_SIZE,
            )
            ctx.drawImage(
                assets[upgrades[2].sprite] as HTMLImageElement,
                upgrade3btn.x,
                upgrade3btn.y,
                BTN_SIZE,
                BTN_SIZE,
            )

            // text
            ctx.fillStyle = WHITE
            renderFontTex(
                ctx,
                upgrades[0].label,
                upgrade1btn.x,
                upgrade1btn.y + BTN_SIZE + 5,
            )
            renderFontTex(
                ctx,
                upgrades[1].label,
                upgrade2btn.x,
                upgrade2btn.y + BTN_SIZE + 5,
            )
            renderFontTex(
                ctx,
                upgrades[2].label,
                upgrade3btn.x,
                upgrade3btn.y + BTN_SIZE + 5,
            )

            // highlight selected
            ctx.strokeStyle = WHITE
            ctx.strokeRect(
                ~~(WIDTH / 7) * (hoveredUpgrade * 2 + 1),
                upgrade1btn.y,
                BTN_SIZE,
                BTN_SIZE,
            )
            ctx.drawImage(
                assets.eArrow,
                ~~(WIDTH / 7) * (hoveredUpgrade * 2 + 1) + 6,
                upgrade1btn.y + 48 + (buttonBlink ? 2 : 0),
                BTN_SIZE / 2,
                BTN_SIZE / 2,
            )
            break

        case Scene.gameplay:
            break

        case Scene.gameover:
            ctx.fillStyle = WHITE
            renderFont(
                ctx,
                stats.won ? "YOU WIN!" : "GAME OVER!",
                MENU_FONT_SIZE,
                ~~(WIDTH / 3) - 10,
                ~~(HEIGHT / 5),
            )

            // time
            const abstime = ~~stats.time
            const mins = ~~(abstime / 60)
            const secs = abstime % 60
            renderFontTex(
                ctx,
                "TIME: " + mins + ":" + (secs < 10 ? "0" + secs : secs),
                ~~(WIDTH / 2) - 20,
                HEIGHT / 5 + 40,
            )
            renderFontTex(
                ctx,
                "SCORE: " + stats.score,
                ~~(WIDTH / 2) - 20,
                HEIGHT / 5 + 50,
            )
            if (buttonBlink) {
                renderFontTex(ctx, "RESTART", startBtn.x + 10, startBtn.y + 10)
            }
            break
    }
}
