const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost', 
    user: 'root', 
    password: 'Ren040827', 
    database: 'charityevents_db', 
    waitForConnections: true, 
    connectionLimit: 10, 
    queueLimit: 0 
};

// 创建数据库连接池
const dbPool = mysql.createPool(dbConfig);

// 测试数据库连接
async function testDbConnection() {
    try {
        const connection = await dbPool.getConnection();
        console.log('Successfully connected to the charityevents_db database!');
        connection.release(); 
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1); 
    }
}

// 导出连接池和测试函数
module.exports = {
    dbPool,
    testDbConnection
};

// 直接运行该文件时执行连接测试
if (require.main === module) {
    testDbConnection();
}