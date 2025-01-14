import {Context, Effect, Layer, pipe} from "effect";
import {ConfigApp} from "../config/config";
import {Logger} from "../utils/logger";
import {ConfigError} from "effect/ConfigError";

export class Database extends Context.Tag("Database")<
    Database,
    { query: (sql: string) => Effect.Effect<{ result: string }, ConfigError, ConfigApp | Logger> }
>() {
}

export const DatabaseLive = Layer.effect(
    Database,
    pipe(
        Effect.all({config: ConfigApp, logger: Logger}),
        Effect.map(({config, logger}) => ({
            query: (sql: string) =>
                pipe(
                    logger.log(`Executing query: ${sql}`), // Journalisation
                    Effect.flatMap(() =>
                        pipe(
                            config.getConfig, // Récupération de la configuration
                            Effect.map(({dbUrl}) => ({
                                result: `Results from ${dbUrl}` // Résultat simulé
                            }))
                        )
                    )
                )
        })),
    )
)