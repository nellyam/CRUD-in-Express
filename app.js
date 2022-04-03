const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const urlEncodedParser = bodyParser.urlencoded({"extended": false})

PORT = 12345;

const app = express();
let userConnected = {};
let products = [
    {
        "name": "Riz",
        "weight": "500g",
        "status": true
    },
    {
        "name": "Pâtes",
        "weight": "200g",
        "status": true
    },
    {
        "name": "Semoules",
        "weight": "300g",
        "status": false
    },
];

app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs"); 


app.get("/auth", (req, res) => {
    if(userConnected.firstname && userConnected.lastname) {
        res.redirect("/");     
   } else {
    res.render("auth",
     {
         "title": "Page de connexion"
     });     
   }

});

app.get("/", (req, res) => {
    if(userConnected.firstname && userConnected.lastname) {
         res.render("index", {
         "title": "Accueil",
         "user": userConnected,
         "products": products
     });
    } else {
      res.redirect("/auth");     
    }
 
});


app.post("/auth", urlEncodedParser, (req, res) => {
    userConnected.firstname = req.body.firstname;
    userConnected.lastname = req.body.lastname;
    res.redirect("/")
});

app.get("/product/new", (req, res) => {
    res.render("newProduct",
    {
        "title": "Page ajout produit",
        
    })
});
app.post("/product/new", urlEncodedParser, (req, res) => {
    products.push({  
        "name": req.body.name,
        "weight": req.body.weight,
         "status": req.body.status ? true : false
        });
    res.redirect("/")
});

app.get("/product/edit/:id", (req, res) => {
    let id = parseInt(req.params.id);
    res.render("editProduct", {
          
        "title": "Page Modification Produit",
        "product": products[id],
        "index": id
    })
})

 app.post("/product/edit", urlEncodedParser, (req, res) => {
     let id = parseInt(req.body.index);

     products[id].name = req.body.name;
     products[id].weight = req.body.weight;
     products[id].status = req.body.status ? true : false;
     res.redirect("/");
 });

app.get("/product/:id", (req, res) => {
    let id = parseInt(req.params.id);
    res.render("product",
    {
        "title": "Page Produit",
        "product": products[id]
    })
});

app.delete("/product/:id", (req, res) => {
    let id = parseInt(req.params.id);
    products.splice(id, 1);
    res.end();
})


app.use((req, res) => {  
    res.render("404", {
        "title": "Page introuvable"
    })
});



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});