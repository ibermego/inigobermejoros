// const express = require("express"); PARA FORMATO VIEJO; NO NO VALE
import express from 'express'
import fs from "node:fs"
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true })); //MIDLEWARE
app.use(express.json());

app.set("view engine", "ejs");

let historias = [];
fs.readFile("test100.json", "utf-8", (error, data) => {
    if (error) {
        console.log("archivo no existe test100.json")
    }
    else {
        historias = JSON.parse(data.toString())
        console.log ("imprimo historias: ", historias)
    }
});

app.get("/", (req, res) => {
    res.render("index", { historias });
});

app.post("/enviar-historia", (req, res) => {
    const { historiaUsuario, prioridad, fechaCaptura, responsable } = req.body;

    if (!historiaUsuario.startsWith("Como") || !historiaUsuario.includes("quiero") || !historiaUsuario.includes("para que")) {
        return res.status(400).send("La historia de usuario debe seguir el formato: 'Como ..., quiero ..., para que ...'");
    }

    historias.push({ historiaUsuario, prioridad, fechaCaptura, responsable });

    fs.writeFile("test100.json", JSON.stringify(historias), (err) => {
        if (err) {
            console.log("Hay un error, si eso también ya tal ...")
        } else {
            console.log("Exito al crear archivo")
        }
    })
    
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
