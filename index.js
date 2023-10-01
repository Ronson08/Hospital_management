const express = require("express");
const app = express();
const body = require("body-parser");
app.set('view engine', 'ejs');
app.use(body.urlencoded({ extended: true }));

app.use(express.static("public"));

const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/hospitaldb", { useNewUrlParser: true });





const patientschema = new mongoose.Schema({
    patientname: String,
    patientemail: String,
    patientpassword: String,
    patientaddress1: String,
    patientaddress2: String,
    patientcity: String,
    patientstate: String,
    patientzip: String,
    patientphone: String
});
const patientmodel = mongoose.model("patientdata", patientschema);

const staffschema = new mongoose.Schema({
    staffemail: String,
    staffpassword: String
});
const staffmodel = mongoose.model("staffc", staffschema);

const doctorschema = new mongoose.Schema({
    doctoremail: String,
    doctorpassword: String
});
const doctormodel = mongoose.model("doctor", doctorschema);

const pbookschema = new mongoose.Schema({
    patientname: String,
    patientemail: String,
    patientdoctor: String,
    patientdate: String,
    patientproblem: String,
    patientphone: String
});
const pbookmodel = mongoose.model("pbook", pbookschema);





app.get("/", function (req, res) {
    res.render("index");
});

app.get('/preg', (req, res) => {
    res.render('preg.ejs');
});

app.get('/oops', (req, res) => {
    res.render('oops.ejs');
});

app.get('/index', (req, res) => {
    res.render('index.ejs');
});






app.post('/preg',async (req, res) => {
    var patientn = req.body.pname;
    var patiente = req.body.pemail;
    var patientpwd = req.body.ppassword;
    var patientad1 = req.body.paddress1;
    var patientad2 = req.body.paddress2;
    var patientcty = req.body.pcity;
    var patientst = req.body.pstate;
    var patientz = req.body.pzip;
    var patientphone = req.body.pphone;


    const old_user =await patientmodel.findOne({ patientemail:patiente })
    if(old_user){
      res.send('<script>alert("The account is already present");window.location.href="/";</script>')
    }
    else{

    const patientdl = new patientmodel({
        patientname: patientn,
        patientemail: patiente,
        patientpassword: patientpwd,
        patientaddress1: patientad1,
        patientaddress2: patientad2,
        patientcity: patientcty,
        patientstate: patientst,
        patientzip: patientz,
        patientphone:patientphone
    });

    patientdl.save()
        .then(() => {
            res.send('<script>alert("Registration Successfull. Thank you!");window.location.href="/";</script>')
            
        })
        .catch(err => {
            console.error("Error saving patient data:", err);
            res.status(500).send("Error saving patient data");
        });
    }
});


app.post('/pbook',async (req, res) => {
    var pname = req.body.pname;
    var pemail = req.body.pemail;
    var patientdoctor = req.body.pdoctor;
    var patientdate = req.body.date;
    var patientproblem = req.body.pproblem;
    var patientphone = req.body.pphone;

    const bookdl = new pbookmodel({
        patientname: pname,
        patientemail: pemail,
        patientdoctor: patientdoctor,
        patientdate: patientdate,
        patientproblem: patientproblem,
        patientphone: patientphone
    });

    bookdl.save()
        .then(() => {
            res.send('<script>alert("Your Booking has been recorded. Our Staff will contact you for further details. Thank you!");window.location.href="/";</script>')
            //res.render("patient")
        })
        .catch(err => {
            console.error("Error saving patient data:", err);
            res.status(500).send("Error saving patient data");
        });
});




app.post('/patient', async (req, res) => {
    const { pemail,ppassword } = req.body;

    try {
        const patient = await patientmodel.findOne({ patientemail:pemail, patientpassword:ppassword});

        if (patient) {
            res.render('patient');
        } else {
            res.render('oops', { error: "alert('Incorrect email or password')" });
            console.log("invalidp")
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal server error");
    }
});


app.post('/staff', async (req, res) => {
    const { semail,spassword } = req.body;

    try {
        const staff = await staffmodel.findOne({ staffemail:semail, staffpassword:spassword});
        const patientData = await pbookmodel.find({});
        const patientlogindata = await patientmodel.find({})

        if (staff) {
        res.render('staff',  { patientData, patientlogindata });
        } else {
            res.render('oops', { error: "alert('Incorrect email or password')" });
            console.log("invalidp")
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal server error");
    }
});

app.post('/doctor', async (req, res) => {
    const { demail,dpassword } = req.body;

    try {
        const doctor = await doctormodel.findOne({ doctoremail:demail, doctorpassword:dpassword});
        const patientData = await pbookmodel.find({});

        if (doctor) {
        res.render('doctor', { patientData });
        } else {
            res.render('oops', { error: "alert('Incorrect email or password')" });
            console.log("invalidp")
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal server error");
    }
});




app.listen(3000, function () {
    console.log("Server is running on port 3000");
});



// app.post('/patient', async (req, res) => {
//     const { email,password } = req.body;

//     try {
//         // Query the database to find a patient member with the provided email and password.
//         const patient = await patientmodel.findOne({ patientemail:email, patientpassword:password});

//         if (patient) {
//             // patient member with matching credentials found, redirect to the patient dashboard or home page.
//             res.render('patient');
//         } else {
//             // No patient member found with matching credentials, render the login page with an error message.
//             res.render('oops', { error: "alert('Incorrect email or password')" });
//             console.log("invalidp")
//         }
//     } catch (error) {
//         // Handle any errors that occur during database query or processing.
//         console.error("Error during login:", error);
//         res.status(500).send("Internal server error");
//     }
// });

