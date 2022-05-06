/**
 * @module src
 */
import { WebServer } from "./net/WebServer";
import { Logger } from "./misc/Logger";
import { Globals } from "./misc/Globals";
import { StringTools } from "./misc/StringTools";

// if(Globals.refreshDoc)
// {
//     const TypeDoc = require("typedoc");

//     async function generateDocumentation() {
//         const app = new TypeDoc.Application();

//         app.options.addReader(new TypeDoc.TSConfigReader());
//         app.options.addReader(new TypeDoc.TypeDocReader());

//         app.bootstrap({
//             // typedoc options here
//             entryPoints: ["src"],
//             entryPointStrategy: "expand",
//             mergeModulesRenameDefaults: true,
//             mergeModulesMergeMode: "module"
//         });

//         const project = app.convert();

//         if (project) {
//             // Project may not have converted correctly
//             const outputDir = "docs";

//             // Rendered docs
//             await app.generateDocs(project, outputDir);
//             // Alternatively generate JSON output
//             await app.generateJson(project, outputDir + "/documentation.json");
//         }
//     }

//     Logger.log("Updating documentation...");
//     generateDocumentation().then(r => console.log("succesfully updated documentation"))
//                             .catch(e => console.log("Failed to update documentation"));
// }

WebServer.singleton.start();
