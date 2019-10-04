
const sql = new window.JsonSql({
    dialect: 'sqlite'
});
console.log(sql);

var query = sql.build({
    type: 'select',
    table: 'users',
    fields: ['name', 'age'],
    condition: {name: 'Max', id: 6}
});


var sqlJoin = sql.build({
    table: 'table',
    join: [{
        type: 'right',
        table: 'joinTable',
        on: {'table.a': 'joinTable.b'}
    }]
});
console.log(query);
console.log(sqlJoin);