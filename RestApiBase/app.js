let express = require('express')
let bodyparser = require('body-parser')
let cors = require('cors')
let dao = require('./dao')
const fs = require('fs')


let app = express()
let port = 3000

let thermo = new Object();
thermo.statut_thermo = 0;

let fichier_specfications = fs.readFileSync('./specifications.json');
let specifications_thermo = JSON.parse(fichier_specfications);
//spécifications physiques de la thermoformeuse: nombre de zone, nom des zones...


app.use(cors());
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json())



//Forme de la requete : ["methode": string, "data":Objet Json]
//Forme de la reponse  : ["code":entier, "data":objet json", infos": string] 


app.post('/', (req, res)=> {
    let body = req.body;
    let reponse = new Array(3);
    reponse[1] = new Object();
    if(body[0]=== "get_temperature"){
        reponse[0] = 100;
        reponse[1].zone_chauffe = getTemperatureThermo();
        reponse[1].ambiante = getTemperatureAmbianteThermo();
        reponse[1].nom_zone_chauffe = specifications_thermo.nom_zone_chauffe
        reponse[2] = "Récuprations des températures!!!^^";
        res.json(reponse);
    }
    else if (body[0] === "set_temperature"){
        setTemperatureThermo(body[1].zone_chauffe);
        reponse[0] = 100;
        reponse[2] = "Modification des températures!^^";
        res.json(reponse);

    }
    else if(body[0] === "get_statut"){
        reponse[0] = 100;
        reponse[1].statut = getStatutThermo();
        reponse[2] = "Récupération du statut!^^";
        res.json(reponse);


    }
    else if(body[0] === "start"){
        if (startThermo() == 1){
            reponse[0] = 100;
            reponse[2] = "La thermoformeuse a bien démarrée!!!^^";
        }
        else
        {
            reponse[0] = 100;
            reponse[2] = "Un cycle est déja lancé, veuillez patienter la fin de celui-ci!!";
        }
        res.json(reponse);
    }
    else if(body[0] === "get_all_log"){
        dao.getAllLog().then(resulat => {
            reponse[0] = 100;
            reponse[1] = resulat;
            reponse[2] = "Récupérations des logs";
            res.json(reponse);
        });
    }
    else if(body[0] === "save_log"){

        dao.saveLog(body[1].log).then(()=>{
            reponse[0] = 100;
            reponse[2] = "log sauvergardé";
            res.json(reponse);
        });

    }
    else if(body[0] === "get_all_configurations"){
        dao.getAllConfiguration().then(resulat => {
            reponse[0] = 100;
            reponse[1] = resulat;
            reponse[2] = "Récupérations des configurations!!";
            res.json(reponse);
        });

    }
    else if(body[0] === "save_configuration"){
        dao.saveConfiguration(body[1].configuration).then(() => {
            reponse[0] = 100;
            reponse[2] = "configuration sauvergardé";
            res.json(reponse);
        });
    }
    else if (body[0] === "set_configuration_courante"){
        dao.setConfigurationCourante(body[1].config_courante._id)
        reponse[2] = "Modification de la configuration active";
        reponse[0] = 100;
        res.json(reponse);
    }
    else if(body[0] === "get_configuration_courante"){
        reponse[0] = 100;
        reponse[1] = dao.getConfigurationCourante()
        reponse[2] = "Récupération de la configuration courante";
        res.json(reponse);
    }

    else if (body[0] === "get_specifications_thermo"){
        reponse[0] = 100;
        reponse[1] = specifications_thermo;
        reponse[2] = "Récupération de la configuration active dans la thermo";
        res.json(reponse);
    }
    else {
        reponse[0] = 300;
        reponse[2] = "Veuillez entrer dans le champ \"method\" une action valide !!!";
        res.json(reponse);
    }

})





app.post('/preset')
app.listen(port, ()=>{console.log(`Test app listenning a ${port}!`)});

function getTemperatureThermo(){
    console.log("Récupération des valeurs de température des zones de chauffe")
    return [Math.floor((Math.random() * 200) + 100), Math.floor((Math.random() * 200) + 100), Math.floor((Math.random() * 200) + 100), Math.floor((Math.random() * 200) + 100), Math.floor((Math.random() * 200) + 100), Math.floor((Math.random() * 200) + 100)]
}

function getTemperatureAmbianteThermo(){
    console.log("Récupération de la température ambiante")
    return 3;reponse[0] = 100;
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
    if(getStatutThermo() == 1)
    {
        return 0;
    }
    else{
        thermo.statut_thermo = 1;
        console.log("Démarrage de la thermo!!");
        setTimeout(()=>{
            thermo.statut_thermo = 0;
            console.log("Arrêt de la thermo!!");
        },30000)
        return 1;
    }
}

