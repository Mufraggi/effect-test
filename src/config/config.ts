import {Config, Context, Effect, Layer, pipe} from "effect";
import {ConfigError} from "effect/ConfigError";

export class ConfigApp extends Context.Tag("ConfigApp")<
    ConfigApp,
    {
        readonly getConfig: Effect.Effect<{
            readonly dbUrl: string;
            readonly logLevel: string;
        },
            ConfigError,
            never
        >
    }
>() {
}

export const ConfigAppLive = Layer.succeed(
    ConfigApp,
    ConfigApp.of({
            getConfig: pipe(
                Effect.all({
                    dbUrl:
                        Config.string("DB_URL").pipe(
                            Config.validate({
                                message: "Expected a valid DB_URL (minimum 4 characters)",
                                validation: (s) => s.length > 4
                            })
                        ),
                    logLevel:
                        Config.string("LOG_LEVEL").pipe(
                            Config.validate({
                                message: "Expected LOG_LEVEL to be one of: DEBUG, INFO, WARN, ERROR",
                                validation: (s) => ["DEBUG", "INFO", "WARN", "ERROR"].includes(s)
                            })
                        )
                })
            )
        }
    ))

export const ConfigAppTest = Layer.succeed(ConfigApp,
    ConfigApp.of({
        getConfig: Effect.succeed({
            dbUrl: "postgresql://localhost:5432/postgres",
            logLevel: "INFO",
        })
    })
)