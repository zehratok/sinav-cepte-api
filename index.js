const req = require('express/lib/request');
const { app, connection } = require('./init');
const jwt = require('jsonwebtoken');
const middleware = require('./middleware');

app.post('/kaydol', (req, res) => {
    const { adSoyad, mail, parola } = req.body;
    connection.query(
        `INSERT INTO kullanici (adSoyad, mail, parola) VALUES ('${adSoyad}' , '${mail}' , '${parola}');`
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
app.post('/giris-yap', (req, res) => {
    const { mail, parola } = req.body;
    try {
        connection.query(
            `SELECT * FROM kullanici where mail='${mail}' and parola='${parola}' `
            , (error, results, fields) => {
                console.log(error)
                console.log(results)
                if (error) {
                    console.log(error)
                } else {
                    if (results.length > 0) {
                        const user = {
                            "id": results[0].id,
                            "adSoyad": results[0].adSoyad,
                            "email": results[0].email,
                          
                        }
                        const access_token = jwt.sign(user, "alaska", { expiresIn: '200d' })
                        res.send({ access_token, ...user });
                    } else {
                        res.send("Hatalı giriş")
                    }
                }
            })

    } catch (hata) {
        res.send(hata);
    }
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