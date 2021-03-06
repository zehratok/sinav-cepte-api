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
                    console.log(error);
                } else {
                    if (results.length > 0) {
                        const user = {
                            "id": results[0].id,
                            "adSoyad": results[0].adSoyad,
                            "email": results[0].mail,
                            "parola": results[0].parola
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
app.get('/kullanicilar/:id', (req, res) => {
    connection.query("SELECT * FROM kullanici WHERE id=" + "'" + req.params.id + "'", (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    })
})
app.post('/not-ekle', (req, res) => {
    const { kullanici_id, baslik, icerik } = req.body;
    connection.query(
        `INSERT INTO notlarim (kullanici_id, baslik, icerik) VALUES ('${kullanici_id}' , '${baslik}' , '${icerik}');`
        , (error, results, fields) => {
            if (error) {
                res.send({
                    "mesaj": "Hata"
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
app.post('/gorev-ekle', (req, res) => {
    const { kullanici_id, baslik, icerik, tarih } = req.body;
    req.body.tarih = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log(req.body);
    connection.query(
        `INSERT INTO gorevlerim (kullanici_id, baslik, icerik, tarih) VALUES ('${kullanici_id}' , '${baslik}' , '${icerik}' , '${tarih}' );`
        , (error, results, fields) => {
            if (error) {
                res.send({
                    "mesaj": "Hata"
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
app.post('/soru-paylas', (req, res) => {
    const { kullanici_id, kullanici_adi, sinav, ders, resim, konu, baslik, aciklama, tarih } = req.body;
    req.body.tarih = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log(req.body);
    connection.query(
        `INSERT INTO sorular (kullanici_id, kullanici_adi, sinav, ders, resim, konu, baslik, aciklama, tarih) VALUES
         ('${kullanici_id}' , '${kullanici_adi}' , '${sinav}' , '${ders}' , '${resim}' , '${konu}' ,  '${baslik}' , '${aciklama}' , '${tarih}' );`
        , (error, results, fields) => {
            if (error) {
                res.send({
                    "mesaj": "Hata"
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
app.post('/cevapla', (req, res) => {
    const { soru_id, kullanici_id, kullanici_adi, resim, icerik, tarih } = req.body;
    req.body.tarih = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log(req.body);
    connection.query(
        `INSERT INTO cevaplar (soru_id, kullanici_id, kullanici_adi,  resim,  icerik, tarih) VALUES
         ('${soru_id}' , '${kullanici_id}' , '${kullanici_adi}' , '${resim}' ,'${icerik}' , '${tarih}' );`
        , (error, results, fields) => {
            if (error) {
                res.send({
                    "mesaj": "Hata"
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
app.post('/mesaj-yks', (req, res) => {
    const { kullanici_id, kullanici_adi, icerik, zaman } = req.body;
    console.log(req.body.zaman);
    connection.query(
        `INSERT INTO sohbet_yks (kullanici_id, kullanici_adi, icerik, zaman) VALUES ('${kullanici_id}' , '${kullanici_adi}' , '${icerik}' , '${zaman}');`
        , (error, results, fields) => {
            if (error) {
                res.send({
                    "mesaj": "Hata"
                })
            } else {
                let result = {};
                result = {
                    "mesaj": "Mesaj gönderildi",
                    ...req.body
                }
                res.send(result);
            }
        })
})
app.post('/mesaj-lgs', (req, res) => {
    const { kullanici_id, kullanici_adi, icerik, zaman } = req.body;

    console.log(req.body.zaman);
    connection.query(
        `INSERT INTO sohbet_lgs (kullanici_id, kullanici_adi, icerik, zaman) VALUES ('${kullanici_id}' , '${kullanici_adi}' , '${icerik}' , '${zaman}');`
        , (error, results, fields) => {
            if (error) {
                res.send({
                    "mesaj": "Hata"
                })
            } else {
                let result = {};
                result = {
                    "mesaj": "Mesaj gönderildi",
                    ...req.body
                }
                res.send(result);
            }
        })
})
app.post('/mesaj-msu', (req, res) => {
    const { kullanici_id, kullanici_adi, icerik, zaman } = req.body;
    console.log(req.body.zaman);
    connection.query(
        `INSERT INTO sohbet_msu (kullanici_id, kullanici_adi, icerik, zaman) VALUES ('${kullanici_id}' , '${kullanici_adi}' , '${icerik}' , '${zaman}');`
        , (error, results, fields) => {
            if (error) {
                res.send({
                    "mesaj": "Hata"
                })
            } else {
                let result = {};
                result = {
                    "mesaj": "Mesaj gönderildi",
                    ...req.body
                }
                res.send(result);
            }
        })
})
app.post('/mesaj-dgs', (req, res) => {
    const { kullanici_id, kullanici_adi, icerik, zaman } = req.body;

    console.log(req.body.zaman);
    connection.query(
        `INSERT INTO sohbet_dgs (kullanici_id, kullanici_adi, icerik, zaman) VALUES ('${kullanici_id}' , '${kullanici_adi}' , '${icerik}' , '${zaman}');`
        , (error, results, fields) => {
            if (error) {
                res.send({
                    "mesaj": "Hata"
                })
            } else {
                let result = {};
                result = {
                    "mesaj": "Mesaj gönderildi",
                    ...req.body
                }
                res.send(result);
            }
        })
})
app.get('/notlarim/:kullanici_id', (req, res) => {
    // console.log(req.params.kullanici_id)
    connection.query("SELECT * FROM notlarim WHERE kullanici_id=" + "'" + req.params.kullanici_id + "'", (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    })
})
app.get('/gorevlerim/:kullanici_id', (req, res) => {
    // console.log(req.params.kullanici_id)
    connection.query("SELECT * FROM gorevlerim WHERE kullanici_id=" + "'" + req.params.kullanici_id + "'", (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    })
})
app.get('/sohbet-yks', (req, res) => {
    connection.query('SELECT * from sohbet_yks', (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    })
})
app.get('/sohbet-lgs', (req, res) => {
    connection.query('SELECT * from sohbet_lgs', (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    })
})
app.get('/sohbet-msu', (req, res) => {
    connection.query('SELECT * from sohbet_msu', (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    })
})
app.get('/sohbet-dgs', (req, res) => {
    connection.query('SELECT * from sohbet_dgs', (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    })
})
app.get('/sorular/:sinav', (req, res) => {
    // console.log(req.params.sinav)
    connection.query("SELECT * FROM sorular WHERE sinav=" + "'" + req.params.sinav + "'", (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    })
})
app.get('/cevaplar/:soru_id', (req, res) => {
    // console.log(req.params.kullanici_id)
    connection.query("SELECT * FROM cevaplar WHERE soru_id=" + "'" + req.params.soru_id + "'", (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    })
})
app.get('/sorular/:sinav/:ders', (req, res) => {
    // console.log(req.params.sinav)
    connection.query("SELECT * FROM sorular WHERE sinav=" + "'" + req.params.sinav + "' AND" + " ders=" + "'" + req.params.ders + "'", (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    })
})
app.delete('/notlarim/:id', (req, res) => {
    connection.query("DELETE FROM notlarim WHERE id=" + "'" + req.params.id + "'", (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    })
})
app.delete('/gorevlerim/:id', (req, res) => {
    connection.query("DELETE FROM gorevlerim WHERE id=" + "'" + req.params.id + "'", (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    })
})
app.delete('/mesaj-lgs/:id', (req, res) => {
    connection.query("DELETE FROM sohbet_lgs WHERE id=" + "'" + req.params.id + "'", (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    })
})
app.delete('/mesaj-yks/:id', (req, res) => {
    connection.query("DELETE FROM sohbet_yks WHERE id=" + "'" + req.params.id + "'", (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    })
})
app.delete('/mesaj-msu/:id', (req, res) => {
    connection.query("DELETE FROM sohbet_msu WHERE id=" + "'" + req.params.id + "'", (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    })
})
app.delete('/mesaj-dgs/:id', (req, res) => {
    connection.query("DELETE FROM sohbet_dgs WHERE id=" + "'" + req.params.id + "'", (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    })
})
app.put('/not-guncelle/:id', (req, res) => {
    const { id, kullanici_id, baslik, icerik } = req.body;
    connection.query(
        "UPDATE notlarim SET  id= '" + `${id}` + "', kullanici_id='" + `${kullanici_id}` + "', baslik='" + `${baslik}` + "', icerik='" + `${icerik}` + "' WHERE id='" + req.params.id + "'"
        , (error, results, fields) => {
            if (error) {
                res.send({
                    "mesaj": "Hata"
                })
            } else {
                let result = {};
                result = {
                    "mesaj": "Güncelleme işlemi başarılı",
                    ...req.body
                }
                res.send(result);
            }
        })
})
app.put('/gorev-guncelle/:id', (req, res) => {
    const { id, kullanici_id, baslik, icerik, tarih } = req.body;
    req.body.tarih = new Date().toISOString().slice(0, 19).replace('T', ' ');
    connection.query(
        "UPDATE gorevlerim SET  id= '" + `${id}` + "', kullanici_id='" + `${kullanici_id}` + "', baslik='" + `${baslik}` + "', icerik='" + `${icerik}` + "', tarih='" + `${tarih}` + "' WHERE id='" + req.params.id + "'"
        , (error, results, fields) => {
            if (error) {
                res.send({
                    "mesaj": "Hata"
                })
            } else {
                let result = {};
                result = {
                    "mesaj": "Güncelleme işlemi başarılı",
                    ...req.body
                }
                res.send(result);
            }
        })
})
app.put('/kullanici-guncelle/:id', (req, res) => {
    const { id, adSoyad, mail, parola } = req.body;
    connection.query(
        "UPDATE kullanici SET  id= '" + `${id}` + "', adSoyad='" + `${adSoyad}` + "', mail='" + `${mail}` + "', parola='" + `${parola}` + "' WHERE id='" + req.params.id + "'"
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
app.listen(3001, () => {
    console.log('Runing on 3001');
});