import { HighScores } from "@webxdc/highscores"

declare global {
    interface Highscore {
        score: number
        time: number
    }

    interface Window {
        highscores: HighScores<HighScore>
    }
}
