var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'myhost',
  database : 'mydatabase',
  user     : 'root',
  password : 'mypassword'
});

connection.connect();

var idsFournisseur = new Array();

function finishedRequestIdFournisseur() {
  console.log("idsFournisseur",idsFournisseur);
  //console.log("idsFournisseur 0 ",idsFournisseur[0].id);
  for(var i=0;i<idsFournisseur.length;i++) {
    requestReferenceByIdFournisseur(idsFournisseur[i].id);
  }
  connection.end();


}

function referenceToString(reference){
  var separator = "; ";
  var endline = "\n";
  return reference.referenceclean + separator + reference.codearticle + separator + reference.idfournisseur + separator + reference.libellefournisseur + endline;
}

function writeToFile(texte, idFournisseur){
  var fs = require('fs');
  fs.writeFile("./fournisseur_"+idFournisseur, texte, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("The file was saved!");
    }
  });
}
function requestIdFournisseur() {
  connection.query("select id from pce_fournisseur f where f.libelle IN ('requal','TRW-LUCAS','PURFLUX','BOSCH (Refs longues)','KNECHT','N.G.K.','VALEO (Refs longues)');", function (err, rows, fields) {
    if (err) console.log("erreur dans la requete sql" + err);
    for (var ids = 0; ids < rows.length; ids++) {
      idsFournisseur[ids] = rows[ids];

    }
    finishedRequestIdFournisseur();
  });

}

function requestReferenceByIdFournisseur(idFournisseur) {
  var  request = "select distinct i.referenceclean, i.codearticle, i.idfournisseur, i.libellefournisseur from adm_importreferentielpiece  i where  codearticle is not null and i.idfournisseur =" + idFournisseur + " order by i.prixbrut limit 1000;";
  console.log("request  : " + request);
  var toSave = "";
  connection.query(request, function (err, rows, fields) {
    if (err) console.log("erreur dans la requete sql" + err);
    for (var ids = 0; ids < rows.length; ids++) {
      toSave += referenceToString(rows[ids]);
    }
    writeToFile(toSave,idFournisseur);
  });
}


//Main
requestIdFournisseur();


