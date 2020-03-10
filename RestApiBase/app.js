let express = require('express')
let bodyparser = require('body-parser')
let cors = require('cors')


let app = express()
let port = 3000

let thermo = new Object();
thermo.statut_thermo = 0;


app.use(cors());
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json())


app.post('/temperature', (req, res)=>{
    let body = req.body;
    let reponse = new  Object();
    reponse.data = new Object();
    if(body.type === "get"){
        console.log("ok");
        reponse.data.zone_chauffe = getTemperatureThermo();
        reponse.data.ambiante = getTemperatureAmbianteThermo();
        reponse.info = "Lorem ipsum...get OK!^^";
        reponse.code = "100"; 
    }
    else if (body.type === "set"){
        setTemperatureThermo(body.data.zone_chauffe);
        reponse.info = "Lorem ipsum...set OK!^^";
        reponse.code = "100"; 
    }
    res.json(reponse);
})

app.post('/statut', (req, res)=>{
    let body = req.body;
    let reponse = new Object();
    reponse.data = new Object();
    if(body.type === "get")
    {
        
        reponse.data.statut = getStatutThermo();
        reponse.info = "Lorem ipsum...statut OK!^^";
        reponse.code = "100";
    }
    res.json(reponse);
})

app.post('/start', (req, res)=>{
    let body = req.body;
    let reponse = new Object();
    reponse.data = new Object();
    if(body.type === "set")
    {
        startThermo();
        reponse.info = "Lorem ipsum...start OK!^^";
        reponse.code = "100";
    }
    res.json(reponse);

})




app.post('/preset')

app.listen(port, ()=>{console.log(`Test app listenning a ${port}!`)});

function getTemperatureThermo(){
    console.log("Récupération des valeurs de température des zones de chauffe")
    return {"Z1":1, "Z2":2, "Z3":3, "Z4":4, "Z5":5, "Z6":6}
}

function getTemperatureAmbianteThermo(){
    console.log("Récupération de la température ambiante")
    return 3;
}

function setTemperatureThermo(zone){
    console.log("Modification des températures des zones de chauffe par :" + JSON.stringify(zone));
}

function getStatutThermo(){
    if (thermo.statut_thermo == 1) {
        console.log("Statut de la machine : Marche");
    } else {
        console.log("Statut de la machine : Stop");
    }
    return thermo.statut_thermo;
}

function startThermo(){
    statut_thermo = 1;
    console.log("Démarrage de la thermo!!");
    setTimeout(()=>{
        statut_thermo = 0;
        console.log("Arrêt de la thermo!!");
    },30000)
}