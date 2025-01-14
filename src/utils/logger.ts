import {Context, Effect, Layer, pipe} from "effect";
import {ConfigApp} from "../config/config";

export class Logger extends Context.Tag("Logger")<
    Logger,
    { log: (message: string) => Effect.Effect<void,  never, never> }
>() {
}

export const LoggerLive = Layer.effect(
    Logger,
    pipe(
        ConfigApp,
        Effect.flatMap(config => config.getConfig),
        Effect.map((config) => ({
            log: (message: string) =>
                Effect.sync(() => {
                    console.log(`[${config.logLevel}] ${message}`);
                })
        }))
    )
);