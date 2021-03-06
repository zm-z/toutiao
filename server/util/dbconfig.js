const mysql = require('mysql')
module.exports = {
    //配置数据库
    config: {
        host: 'localhost',
        port: '3306', //端口
        user: 'root',
        password: '19981230',
        database: 'exapp',
        timezone: "08:00",
        charset: "utf8",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    },
    //连接数据库，使用连接池
    //连接池对象
    sqlConnect: function(sql, sqlArr, callBack) {
        var pool = mysql.createPool(this.config)
        pool.getConnection((err, conn) => {
            if (err) {
                console.log('连接失败');
                return;
            }
            //事件驱动回调
            conn.query(sql, sqlArr, callBack);
            //释放连接
            conn.release();
            //事件驱动回调    
            callback(req, res);
        })
    },

    //promise封装
    SySqlConnect: function(sySql, sqlArr) {
        return new Promise((resolve, reject) => {
            var pool = mysql.createPool(this.config)
            pool.getConnection((err, conn) => {
                if (err) {
                    reject(err)
                } else {
                    //事件驱动回调
                    conn.query(sySql, sqlArr, (err, data) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(data)
                        }
                    });
                    //释放连接
                    conn.release();
                }
            })
        }).catch((err) => {
            console.log(err);
        })
    }

}