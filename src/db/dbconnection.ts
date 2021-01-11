import * as mysql from "mysql";
import { Connection, ConnectionConfig } from "mysql";

import { iDBInfo } from "./dbtype";
import * as moment from "moment";

export class DBConnection {
    private dbinfo: iDBInfo;
    private connection: Connection | null;

    constructor(db: iDBInfo) {
        this.dbinfo = db;
        this.connection = null;
    }

    public async tryConnection(): Promise<boolean> {
        return new Promise((resolve) => {
            if (this.dbinfo.host && this.dbinfo.password) {
                try {
                    this.connection = mysql.createConnection({
                        ...this.dbinfo,
                        multipleStatements: true,
                    } as ConnectionConfig);
                    this.connection.connect((err) => {
                        if (err) {
                            console.log(err.message);
                            resolve(false);
                        } else resolve(true);
                    });
                } catch (e) {
                    console.log("error connection database: ", e);
                    resolve(false);
                }
            }
        });
    }

    public inserts(table: string, csvRows: any) {

        let updateQueruTemplate = "";
        const keys = Object.keys(csvRows[0]);
        const mapStrings = keys.map( ()=> '?');
        const formattedKeys = keys.map( item => `\`${item}\``);
        updateQueruTemplate = `INSERT INTO ${table}(${formattedKeys.join(',')}) VALUES(${mapStrings});`;
 
        let sqlm = "";
        csvRows.forEach( row => {
            const values = keys.map((value) => row[value] ? row[value] : null);
            sqlm += mysql.format(updateQueruTemplate, [
                ...values,
            ]);
        });

        this.connection.query(sqlm,  (error, results) => {
            if (error) {
                console.log(error)
                console.log('error query----------------------^^');
                return;
            }
            let affectionRow = 0;
            let warningCount = 0;
            
            if(results && results.length > 0){
                results.forEach(element => {
                    affectionRow += element.affectedRows;
                    warningCount += element.warningCount;
                });
                console.log(`Insert Total Query Count: ${results.length}, affectionRow: ${affectionRow}, warningCount: ${warningCount}`)

            } else {
                console.log("Not found result");
            }
            this.connection.end();
            return
        });
    }

    public updates(table: string, keyColumns: string[], csvRows: any) {

        let updateQueruTemplate = "";
        const keys = Object.keys(csvRows[0]);
        const keyValues = keys.filter((item) => {
            return keyColumns.findIndex((kitem) => item == kitem) == -1;
        });
        updateQueruTemplate = `UPDATE ${table} SET `;
        keyValues.forEach((item, index) => {
            if (index == 0) {
                updateQueruTemplate += `\`${item}\` = ?`;
            } else {
                updateQueruTemplate += `, \`${item}\` = ?`;
            }
        });
        updateQueruTemplate += ` where`;
        keyColumns.forEach((keyColumnItem, index) => {
            if (index === 0) {
                updateQueruTemplate += ` ${keyColumnItem} = ?`;
            } else {
                updateQueruTemplate += ` and ${keyColumnItem} = ?`;
            }
        });
        updateQueruTemplate += ";";

        let sqlm = "";
        csvRows.forEach( row => {
            const values = keyValues.map((value) => row[value] ? row[value] : null);
            const keyColsValue = keyColumns.map((value) => row[value]);
            sqlm += mysql.format(updateQueruTemplate, [
                ...values,
                ...keyColsValue,
            ]);
        });

        this.connection.query(sqlm,  (error, results) => {
            if (error) {
                console.log(error)
                console.log('error query----------------------^^');
                return;
            }
            let affectionRow = 0;
            let warningCount = 0;
            
            if(results && results.length > 0){
                results.forEach(element => {
                    affectionRow += element.affectedRows;
                    warningCount += element.warningCount;
                });
                console.log(`Update Total Query Count: ${results.length}, affectionRow: ${affectionRow}, warningCount: ${warningCount}`)

            } else {
                console.log("Not found result");
            }
            this.connection.end();
            return
        });
    }
}

export default DBConnection;
