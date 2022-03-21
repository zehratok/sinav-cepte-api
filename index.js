const req = require('express/lib/request');
const { app, connection } = require('./init');
const jwt = require('jsonwebtoken');
const middleware = require('./middleware');

app.post('/kaydol', (req, res) => {
    const { ad, soyad, email, parola } = req.body;
    connection.query(
        `INSERT INTO kullanici (ad, soyad, email, parola) VALUES ('${ad}' , '${soyad}' , '${email}' , '${parola}');`
        , (error, results, fields) => {
            if (results == undefined) {
                res.send({
                    "mesaj": "Çift kayıt hatası"
                })
            } else {
                let result = {};
                result = {
                    "mesaj": "Kayit işlemi başarılı",
                    ...req.body
                }
                res.send(result);

            }

        })
})
app.get('/kullanicilar', (req, res) => {
    connection.query('SELECT * from kullanici', (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    })
})

app.listen(3001, () => {
    console.log('Runing on 3001');
});