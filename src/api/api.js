const {
    Universal,
    glob,
    express
} = require("../imports/Imports");

module.exports = function() {
    const app = express();
    const cors = require('cors');
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.listen(process.env.API_PORT, () => {
        Universal.sendLog("info", `API listening on port ${process.env.API_PORT}!`)
    });
    return createRoutes(app);
};

async function createRoutes(app) {
    const rootPath = "src/api/routes/";
    return glob(`${rootPath}**/*.js`, function(error, files) {
        if(error) return Universal.sendLog("error", `Failed to create routes:\n${error}`);
        let routes = "";
        for(const file of files) {
            const fileName = file.substring(rootPath.length, file.length - 3);
            routes += `${fileName}\n`;
            try { 
                const route = require(`./routes/${fileName}`);
                app.use(`/${fileName}`, route);
            } catch (error) {
                throw Universal.sendLog("error", `Failed to create route ${fileName}:\n${error}`); 
            }
        }
        return Universal.sendLog("info", `Finished creating routes:\n${routes.substring(0, routes.length - 1)}`);
    });
}