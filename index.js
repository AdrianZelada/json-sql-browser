
const sql = new window.JsonSql();
console.log(sql);

var query = sql.build({
    type: 'select',
    table: 'users',
    fields: ['name', 'age'],
    condition: {name: 'Max', id: 6}
});

console.log(query);