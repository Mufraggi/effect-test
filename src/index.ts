import {Effect, Layer, pipe} from "effect";
import {ConfigApp, ConfigAppLive, ConfigAppTest} from "./config/config";
import {Logger, LoggerLive} from "./utils/logger";
import {Database, DatabaseLive} from "./repository/db";
import {Services, ServicesLive} from "./service/service";
import {ConfigError} from "effect/ConfigError";

// Fusionner toutes les couches nécessaires
//const AppConfigLive = Layer.merge(ConfigAppLive, LoggerLive);

/*const MainLive = pipe(
    AppConfigLive, // Fournit la configuration de l'application
    Layer.merge(LoggerLive), // Ajoute le logger (dépend de ConfigAppLive)
    Layer.merge(DatabaseLive), // Ajoute la base de données (dépend de LoggerLive et ConfigAppLive)
    Layer.merge(ServicesLive) // Ajoute les services (dépend de DatabaseLive et LoggerLive)
);*/
const AppConfigLive = Layer.merge(ConfigAppTest, LoggerLive);
const DatabaseAndConfig = Layer.merge(DatabaseLive, AppConfigLive);


const MainLive = Layer.merge(
    Layer.merge(ConfigAppLive, LoggerLive),
    DatabaseLive
);
// Programme principal utilisant le service
const program: Effect.Effect<{ result: string }, ConfigError, Logger | ConfigApp | Database | Services> = pipe(
    Services,
    Effect.flatMap((services) =>
        services.getData("SELECT * FROM users"),
    )
);
const runnable = Effect.provide(program, MainLive);
Effect.runPromise(runnable).then(console.log);