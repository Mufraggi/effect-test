import {Context, Effect, Layer, pipe} from "effect";
import {Database} from "../repository/db";
import {Logger} from "../utils/logger";
import {ConfigError} from "effect/ConfigError";
import {ConfigApp} from "../config/config";

export class Services extends Context.Tag("Services")<
    Services,
    {
        getData: (data: string) => Effect.Effect<{ result: string }, ConfigError, Logger | ConfigApp>;
    }
>() {
}

export const ServicesLive = Layer.effect(
    Services,
    pipe(
        Effect.all({logger: Logger, repo: Database, config: ConfigApp}),
        Effect.map(({repo, logger}) => ({
            getData: (data: string) =>
                pipe(
                    logger.log("execute in services: " + data),
                    Effect.flatMap(() => repo.query(data))
                ),
        }))
    )
);
