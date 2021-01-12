# CSV TO MYSQL
* **this is update tool with csv files**
* **this is very simple module.**
* **if you want update small csv file to mysql, you can use this module**
* this module is tested with 65000 row csv update to mysql, it works very well

**Install**
-
```
npm install -g csvtomysql
```

**How to run**
-

- global install
```
./csvtomysql ./config.json
```

- local install
```
./node_modules/.bin/csvtomysql ./config.json
```

**Support features:**
-

- read csv and update mysql
    - select key columns in csv
    - select key columns in mysql table
- read csv and insert mysql
- config file support

**Config File Format**
- update config file sample
```json
{
    "host": "localhost",
    "user": "puser",
    "password": "puser",
    "database": "test",
    "csv": "./samples/sample_update.csv",
    "table": "users",
    "mode": "update",
    "keys": ["id","age"]
}
```

- insert config file sample
```json
{
    "host": "localhost",
    "user": "puser",
    "password": "puser",
    "database": "test",
    "csv": "./samples/sample_insert.csv",
    "table": "users",
    "mode": "insert"
}
```
 - format
    - host: DB address
    - user: DB user
    - password: DB password
    - database: database name
    - csv: csv file path
    - table: update table name
    - mod: 'insert' or 'update'
    - keys: update query 'where' keys, this is string array
        - ['id', 'age'] 'update ...... were id = 'csv.id', age = 'csv.age'


