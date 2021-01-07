
import { iCSVFileInfo, iConfigFileInfo } from "./db/dbtype";
import { DBConnection } from "./db/dbconnection";
import * as fs from "fs";
import * as csv from "csv-parser";
import { printCommands } from './print.proc';
import * as figlet from 'figlet';

class App {
    private configFileInfo: iConfigFileInfo;
    private csvInfo: iCSVFileInfo | null;
    private dbConnection: DBConnection | null = null;
    private loaderTimer: NodeJS.Timeout | null = null;
   

    constructor() {
        this.csvInfo = {};
    }
    


    private async loadConfig() {
        const configFilePath = process.argv.slice(2)[0];

        if (configFilePath && fs.existsSync(configFilePath)) {
            const buffer = fs.readFileSync(configFilePath, "utf-8");
            const configs: iConfigFileInfo = JSON.parse(buffer);
            const isValidateConfigs =
                configs["host"] &&
                configs["user"] &&
                configs["password"] &&
                configs["database"] &&
                configs["mode"] &&
                configs["csv"] && configs["table"];
            if (!isValidateConfigs) {
                console.log(
                    "mission essential argument please check config file"
                );
                return false;
            } else {
                this.dbConnection = new DBConnection({
                    host: configs.host,
                    user: configs.user,
                    password: configs.password,
                    database: configs.database,
                });
                console.log("Config file Info");
                console.log(buffer);
                const result = await this.dbConnection.tryConnection();
                if (!result) {
                    return false;
                }
                this.configFileInfo = configs;
            }
        } else {
            console.log("Can not find config file!! please check parameters");
            return false;
        }

        console.log("DB Connect success");
        return true;
    }

    private async csvRead(filePath): Promise<boolean> {
        const results = [];
        return new Promise((resolve) => {
            try {
                if (fs.existsSync(filePath)) {
                    fs.createReadStream(filePath)
                        .pipe(csv())
                        .on("data", (data) => results.push(data))
                        .on("end", () => {
                            this.csvInfo.row = results;
                            console.log(`${results.length} row read`);
                            resolve(true);
                        });
                } else {
                    console.error("fail to read CSV file", filePath);
                    resolve(false);
                }
            } catch (e) {
                console.error("read csv file fail!!!");
                resolve(false);
            }
        });
    }

    private endQueryLoader() {
        if (this.loaderTimer) {
            clearInterval(this.loaderTimer);
        }
    }

    private startQueryLoader() {
        const P = ["\\", "|", "/", "-"];
        let x = 0;
        this.loaderTimer = setInterval(() => {
            process.stdout.write(`\r${P[x++]}`);
            x %= P.length;
        }, 250);
    }

    private async analyzeCSV() {
        console.log("analyze csv file");
        return new Promise((resolve) => {
            const filePath = this.configFileInfo.csv;
            try {
                if (fs.existsSync(filePath)) {
                    const results = [];
                    fs.createReadStream(filePath)
                        .pipe(csv())
                        .on("data", (data) => results.push(data))
                        .on("end", () => {
                            console.log('Success Read CSV Total Rows is:', results.length);
                            console.log('CSV file Columns',  Object.keys(results[0]));
                            resolve(results);
                        });
                } else {
                    console.error("fail to read CSV file", filePath);
                    resolve(null);
                }
            } catch (e) {
                console.error("read csv file fail!!!");
                resolve(null);
            }
        });
    }

    public showTitle(): void {
        console.log(figlet.textSync('CSV TO MYSQL', {
            font: '3D-ASCII',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 150,
            whitespaceBreak: false}))
    }

    public async start(): Promise<void> {
        printCommands("Start config Loading");
        this.startQueryLoader();
            const result = await this.loadConfig();
        this.endQueryLoader();
        if (result) {
            const csvRows = await this.analyzeCSV();
            if(csvRows && this.configFileInfo.mode === 'update') {
                await this.dbConnection.updates(this.configFileInfo.table, this.configFileInfo.keys, csvRows);
            }
            if(csvRows && this.configFileInfo.mode === 'insert') {
                await this.dbConnection.inserts(this.configFileInfo.table, csvRows);
            }
            
        }
    }
}

export default App;
