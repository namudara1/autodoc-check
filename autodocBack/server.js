const express = require('express');
const bodyParser = require('body-parser');
const cors = require ('cors');

const dbConnetion = require('./database');

const nodemailer = require('nodemailer');
const emailConfig = require('./emailConfig.json');

const PORT = 3000;

const app = express();

app.use(bodyParser.json());

app.use(cors());

var moment = require('moment');  
const con = require('./database');
const { duration } = require('moment');
var multer = require("multer");
const { query } = require('express');


// malithgen gatta sen email
async function sendEmail_namu({ to, subject, html, from = emailConfig.emailFrom }) {
    const transporter = nodemailer.createTransport(emailConfig.smtpOptions);
    await transporter.sendMail({ from, to, subject, html });
} // methana yanakan send email

app.get('/',function(req,res){
    res.send('Helllow from server..');
})

app.post('/enroll',function(req,res){
    console.log(req.body);

     var receivedvalues = {
         d1: req.body[0],
         d2: req.body[1],
         d3: req.body[2],
         d4: req.body[3]        

     }

     var sql = 'INSERT INTO testtable SET ?';
     dbConnetion.query(sql , receivedvalues, function(err, result) {
        if (err) throw err;
        res.status(200).send({"messagee":" data received :-)"});  
        
      });

})

app.get('/getVehicleDetails',function(req,res){

    var sql = 'Select * from vehicle WHERE owner_id= ?';
    var sqltest = 'SELECT COUNT(*) as x FROM vehicle WHERE owner_id=?';
  
    console.log('asdasdasdasdadweqf');


    dbConnetion.query(sql,req.query.userId,function(err,rows){ 
        if(err) throw err;
        console.log(rows[0].vehicle_number);
        res.send(rows);
        
    });

}) 


app.get('/getServiceStationsAll',function(req,res){ // kisima wenasak.. naaa

   // var sql_town = 'Select service_station.st_id,service_station.st_name,service_station.address,service_station.town,service_station.mobile FROM service_station INNER JOIN vehicle_owner ON service_station.town=vehicle_owner.home_town WHERE owner_id= ?';
    var sql_all = ' SELECT service_station.*,rating.current_rate,rating.rate_count FROM service_station INNER JOIN rating ON service_station.st_id=rating.st_id WHERE service_station.town!=? ORDER by rating.current_rate DESC ';

    dbConnetion.query(sql_all,req.query.home_town,function(err,rows){
        if(err) throw err;
        res.send(rows);
    });

})

app.get('/getServiceStationsByHomeTown',function(req,res){

    var sql_town = '  Select service_station.*,rating.current_rate,rating.rate_count FROM (service_station INNER JOIN vehicle_owner ON service_station.town=vehicle_owner.home_town) INNER JOIN rating ON service_station.st_id=rating.st_id WHERE owner_id= ?  ORDER BY current_rate DESC ';
     //var sql_all = 'Select * FROM service_station MINUS Select service_station.st_id,service_station.st_name,service_station.address,service_station.town,service_station.mobile FROM service_station INNER JOIN vehicle_owner ON service_station.town=vehicle_owner.home_town WHERE owner_id= ?'

    // const BothSQL = {};

    // const BothSQL_object = Object.create(BothSQL);

    dbConnetion.query(sql_town,req.query.userId,function(err,rows){
        if(err) throw err;
        // BothSQL_object.sql_town_rows = rows;

        res.send(rows);
    });

    // dbConnetion.query(sql_all,req.query.userId,function(err,rows){
    //     if(err) throw err;
    //     BothSQL_object.sql_all_rows = rows;

    //    // res.send(rows);
    // });

    // res.send(BothSQL_object);
    


})


app.get('/getServicesOfServiceStation',function(req,res){

     var sql = 'SELECT servicestation_services.amount , services.service_id ,services.service_name ,services.description ,servicestation_services.duration_hrs FROM servicestation_services INNER JOIN services ON servicestation_services.service_id = services.service_id WHERE servicestation_services.st_id = ?';


     dbConnetion.query(sql,req.query.serviceId,function(err,rows){
         if(err) throw err;
         res.send(rows);
     });
 
 })



  app.get('/getLockedDates',function(req,res){

            //....

            var finalArray = [];

            function bay_slots(){// meka eka dawasakata vitrai
                this.bay_id= 0,
                this.timeSlots = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] // 0 = free ,1= booked
            };

            function all_booked() {//book krla tyna dws ganata hadenna ona objects
                this.date="2000-00-00",
                this.object_array= [Object.create(new bay_slots())]

            };


            var appointments_sql = 'SELECT appointment_id, date, time AS TIMEE , reminder , duration_hrs , st_id , bay_id FROM `appointment` WHERE st_id=?';
            dbConnetion.query(appointments_sql,req.query.serviceId,function(err,rows){
                if(err) throw err;

                console.log(rows);
                
                if(rows!=""){

                    var bay_IDs_sql = 'SELECT bay_id as bayID FROM `bay` WHERE st_id=?';
                    var bay_count=0;
                    const timer = ms => new Promise(ress => setTimeout(ress, ms))

                    load();

       


                    async function load (){
                        for(var i=0;i<rows.length;i++){


                            console.log(finalArray.length+ "empty welawe length eka");
                         if(finalArray.length==0){

                            console.log("length eka 0 ta awe");
                            
                            var first_date = Object.create(new all_booked());
                            first_date.date = moment(rows[i].TIMEE ).format("YYYY-MM-DD");
                            
                            dbConnetion.query(bay_IDs_sql,req.query.serviceId,function(err,rowsS){
                                if(err) throw err;
                                bay_count = rowsS.length;
                                console.log(bay_count+ "<-palaweni row eke bay count");
                                 first_date.object_array[0].bay_id = rowsS[0].bayID;
                
                                for(var j =1;j<bay_count;j++){ // tiyana bays ganatsa array eka athule objects haduwa
                                    first_date.object_array.push(Object.create(new bay_slots()));
                                    first_date.object_array[j].bay_id = rowsS[j].bayID;
                                }
                                var indexOfbay_row = first_date.object_array.map(function(x) {return x.bay_id; }).indexOf(rows[0].bay_id);
                                console.log(indexOfbay_row+": bay id index eka mekaaaa :(  ");
                                // return krnne -1 if not found


                                var start_time_hrs = moment(rows[0].TIMEE ).format(" HH");
                                var start_time_mins = moment(rows[0].TIMEE ).format(" mm");
                                var start_time_mins_deci  = Number(start_time_mins)/60;
                                var start_time_correct = Number(start_time_hrs) + start_time_mins_deci;

                                console.log("corrdct time strt" + start_time_correct);

                                var final_time = start_time_correct + rows[0].duration_hrs;

                                console.log("corrdct time end" + final_time);

                                strt_index = (start_time_correct-9)*2;
                                end_index = ((final_time-9) *2)-1;

                                for(var x=strt_index;x<end_index+1;x++){
                                    first_date.object_array[indexOfbay_row].timeSlots[x] = 1;
                                }

                                console.log("me tiyenne objets array dekema slots:"+first_date.object_array[0].timeSlots,first_date.object_array[1].timeSlots);

                                console.log("adala row eken awa bay eke slots:"+first_date.object_array[indexOfbay_row].timeSlots);
                                finalArray.push(first_date);
                                console.log(finalArray+ "final arrayyy");
                                console.log(finalArray.length+ "ekak dapu welawe length eka");
                                
                                

                            });

                         }
                         else{
                                // samana ewa tiyanawanm...
                                console.log("samana ewa tibeida??");

                                var indexOfEqualDates = finalArray.map(function(x) {return x.date; }).indexOf(moment(rows[i].TIMEE ).format("YYYY-MM-DD"))

                                if( indexOfEqualDates==-1  /*samana ewa naa*/  ){

                                    console.log("samana ewa naaa!!");

                                    var first_datee = Object.create(new all_booked());
                                    first_datee.date = moment(rows[i].TIMEE ).format("YYYY-MM-DD");
                                    console.log(first_datee.date+ ": samana ewa naa eke date eka");
                                    
                                    dbConnetion.query(bay_IDs_sql,req.query.serviceId,function(err,rowsS){
                                        if(err) throw err;
                                        bay_count = rowsS.length;
                                        console.log(bay_count);
                                        first_datee.object_array[0].bay_id = rowsS[0].bayID;
                                        console.log("dan d"+first_datee.object_array[0].timeSlots+ "dan dapu")
                        
                                        for(var j =1;j<bay_count;j++){ // tiyana bays ganatsa array eka athule objects haduwa
                                            first_datee.object_array.push(Object.create(new bay_slots()));
                                            first_datee.object_array[j].bay_id = rowsS[j].bayID;
                                        }
                                        var indexOfbay_row = first_datee.object_array.map(function(x) {return x.bay_id; }).indexOf(rows[i].bay_id);
                                        console.log(indexOfbay_row+": bay id index eka meka :(  ");
                                        // return krnne -1 if not found
        
        
                                        var start_time_hrs = moment(rows[i].TIMEE ).format(" HH");
                                        var start_time_mins = moment(rows[i].TIMEE ).format(" mm");
                                        var start_time_mins_deci  = Number(start_time_mins)/60;
                                        var start_time_correct = Number(start_time_hrs) + start_time_mins_deci;
        
                                        console.log("corrdct time strt" + start_time_correct);
        
                                        var final_time = start_time_correct + rows[i].duration_hrs;
        
                                        console.log("corrdct time end" + final_time);
        
                                        strt_index = (start_time_correct-9)*2;
                                        console.log(strt_index+":strt inexxxx");
                                        end_index = ((final_time-9) *2)-1;
                                        console.log(end_index+": end indexxxx");

        
                                        for(var x=strt_index;x<end_index+1;x++){
                                            first_datee.object_array[indexOfbay_row].timeSlots[x] = 4;
                                        }
        
                                        console.log(first_datee.object_array[indexOfbay_row].timeSlots);
                                        finalArray.push(first_datee);
                                    
        
                                    });

                                }
                                else /*samana date tiyanawa*/ 
                                {
                                    console.log("samana ewa tibee!!");
                                    var indexOfbay_row = finalArray[indexOfEqualDates].object_array.map(function(x) {return x.bay_id; }).indexOf(rows[i].bay_id);

                                    var start_time_hrs = moment(rows[i].TIMEE ).format(" HH");
                                        var start_time_mins = moment(rows[i].TIMEE ).format(" mm");
                                        var start_time_mins_deci  = Number(start_time_mins)/60;
                                        var start_time_correct = Number(start_time_hrs) + start_time_mins_deci;
        
                                        console.log("corrdct time strt" + start_time_correct);
        
                                        var final_time = start_time_correct + rows[i].duration_hrs;
        
                                        console.log("corrdct time end" + final_time);
        
                                        strt_index = (start_time_correct-9)*2;
                                        end_index = ((final_time-9) *2)-1;
        
                                        for(var x=strt_index;x<end_index+1;x++){
                                            finalArray[indexOfEqualDates].object_array[indexOfbay_row].timeSlots[x] = 1;
                                        }
        
                                        console.log(finalArray[indexOfEqualDates].object_array[indexOfbay_row].timeSlots);
                                       
        
                                }
                                

                         }
                        
                         await timer(1200); 

                     }

                     res.send(finalArray);
                     console.log("----------.....------");

                     for(const elmnt of finalArray){
                         console.log(elmnt.date);
                         console.log(elmnt.object_array[0].bay_id,elmnt.object_array[0].timeSlots);
                         console.log(elmnt.object_array[1].bay_id,elmnt.object_array[1].timeSlots);

                     }

                    }


                }
                else{
                    console.log("eka row eakwath naa");
                    res.send("NO APPOINTMENT ROWS");
                }
                

            });



        //.....

 })


 app.get('/getAppointmentRows',function(req,res){

    var appointments_sql = 'SELECT appointment_id, date, time AS TIMEE , reminder , duration_hrs , st_id , bay_id FROM `appointment` WHERE st_id=?';


    dbConnetion.query(appointments_sql,req.query.serviceId,function(err,rows){
        if(err) throw err;
        res.send(rows);
    });

})

app.get('/getBaysDetails',function(req,res){

    var bay_IDs_sql = 'SELECT bay_id as bayID FROM `bay` WHERE st_id=?';

    dbConnetion.query(bay_IDs_sql,req.query.serviceId,function(err,rows){
        if(err) throw err;
        res.send(rows);
    });

})

app.post('/postConfirmation',function(req,res){

    // req.body[]
    // 0 = st_id
    // 1= bay_id
    // 2 = duration
    // 3= timestamp
    // 4= vehicle_number
    // 5= date_ISO
    //6 = selected_services_id []
    //7 = isonline
    
    console.log(req.body+"mmmmm");

     var sql = ` INSERT INTO appointment (date,time,duration_hrs,st_id,bay_id,vehicle_number,isonline) values (?,?,?,?,?,?,?) `;
     let values = [   req.body[5],   req.body[3],   req.body[2],   req.body[0],   req.body[1],  req.body[4] ,req.body[7]  ];

     dbConnetion.query(sql ,values,function(err, result) {
        if (err) throw err;
        // res.status(200).send({"messagee":" appointment confirmed"});  
        
      });

      var sql_lastRow_appointment_service = 'SELECT appointment_id FROM appointment ORDER BY appointment_id DESC LIMIT 1';
      var last_appointment_id;
      
       dbConnetion.query(sql_lastRow_appointment_service,async function(err,rows){
          if(err) throw err;
          last_appointment_id =await rows[0].appointment_id;
          console.log(last_appointment_id,'lst appoint');

          var sql2 =  `  INSERT INTO appointment_service (appointment_id,service_id) values (?,?)   `;
          for(let i=0;i<req.body[6].length;i++){
         
            dbConnetion.query(sql2 ,[ last_appointment_id ,req.body[6][i] ],function(err, result) {
                if (err) throw err;
                console.log("hari");
            });
    
          }
          res.status(200).send({"messagee":"   services damma "});   
      })

    //   res.status(200).send({"messagee":"   services damma "}); 


})


app.post('/postConfirmation_manual',function(req,res){

    // req.body[]
    // 0 = st_id
    // 1= bay_id
    // 2 = duration
    // 3= timestamp
    // 4= vehicle_number
    // 5= date_ISO
    //6 = selected_services_id []
    //7 = isonline
    //8 = owner_name_manual
    //9 = owner_mobile_manual
    
    console.log(req.body+"mmmmm");

     var sql = ` INSERT INTO appointment (date,time,duration_hrs,st_id,bay_id,vehicle_number,isonline,manual_name,manual_mobile) values (?,?,?,?,?,?,?,?,?) `;
     let values = [   req.body[5],   req.body[3],   req.body[2],   req.body[0],   req.body[1],  req.body[4] ,req.body[7] ,req.body[8] ,req.body[9] ];

     dbConnetion.query(sql ,values,function(err, result) {
        if (err) throw err;
        // res.status(200).send({"messagee":" appointment confirmed"});  
        
      });

      var sql_lastRow_appointment_service = 'SELECT appointment_id FROM appointment ORDER BY appointment_id DESC LIMIT 1';
      var last_appointment_id;
      
       dbConnetion.query(sql_lastRow_appointment_service,async function(err,rows){
          if(err) throw err;
          last_appointment_id =await rows[0].appointment_id;
          console.log(last_appointment_id,'lst appoint');

          var sql2 =  `  INSERT INTO appointment_service (appointment_id,service_id) values (?,?)   `;
          for(let i=0;i<req.body[6].length;i++){
         
            dbConnetion.query(sql2 ,[ last_appointment_id ,req.body[6][i] ],function(err, result) {
                if (err) throw err;
                console.log("hari");
            });
    
          }
          res.status(200).send({"messagee":"   services damma manual "});   
      })

    //   res.status(200).send({"messagee":"   services damma "}); 


})



app.get('/getOwnerdetails',function(req,res){

    var sql = 'SELECT * FROM `vehicle_owner` WHERE owner_id=?';

    dbConnetion.query(sql,req.query.userID,function(err,rows){
        if(err) throw err;
        res.send(rows);
    });

})

app.post('/postaddNewVehicle',function(req,res){

    var sql = ` INSERT INTO vehicle (vehicle_number,model,make,mileage,owner_id,vehicle_img_name,type,reg_year) values (?,?,?,?,?,?,?,?) `;

    dbConnetion.query(sql ,[    req.body[0],   req.body[1],   req.body[2],   req.body[3],   req.body[4] , req.body[5] , req.body[6] , req.body[7]  ],function(err, result) {
        if (err) throw err;
        res.status(200).send({"messagee":"  new vehicle damma "}); 
        
    });

})

var store = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '../autodoc/src/assets/img/pic/')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }, 
  });

const upload = multer({ storage: store });

app.post('/postChooseFile',upload.single("image"),function(req,res){

    console.log(req.file);
    res.status(200).send({"messagee":"   uploaded image successful "}); 

});


////////////////////////////////////////////////////////////////////////////////////////////////////////////
//PROFILE COMOPONENT !!

app.get('/getUserDetails',function(req,res){

    var sql = 'SELECT * FROM `vehicle_owner` WHERE owner_id=?';

    dbConnetion.query(sql,req.query.userId,function(err,rows){
        if(err) throw err;
        res.send(rows);
    });

})

app.get('/getAppointments',function(req,res){

    var sql = 'SELECT appointment.st_id,appointment.rated,appointment.appointment_id,appointment.time,appointment.date,appointment.bay_id,appointment.duration_hrs,appointment.vehicle_number,appointment.appointment_id,service_station.st_name FROM(    (appointment INNER JOIN vehicle ON appointment.vehicle_number=vehicle.vehicle_number)INNER JOIN service_station ON service_station.st_id = appointment.st_id) WHERE vehicle.owner_id=?';

    dbConnetion.query(sql,req.query.userId,function(err,rows){
        if(err) throw err;
        res.send(rows);
    });

})

app.post('/Update_confirm_edit',function(req,res){

    console.log("aaawa");
    console.log(req.body);
    var sql = 'UPDATE vehicle_owner SET first_name = ?, last_name=?, mobile= ?,email=?, owner_img_name=?,address=? WHERE owner_id = ?' ;

    dbConnetion.query(sql ,[    req.body[0],   req.body[1],   req.body[2],   req.body[3],   req.body[4] , req.body[5] ,req.body[6] ],function(err, result) {
        if (err) throw err;
        res.status(200).send({"messagee":"  edit user details damma "}); 
        
    });

});

var storee = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '../autodoc/src/assets/img/user/')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }, 
  });

const uploadd = multer({ storage: storee });

app.post('/update_user_img',uploadd.single("image"),function(req,res){

    console.log(req.file);
    res.status(200).send({"messagee":"   uploaded image successful "}); 

});


app.delete('/Remove_Vehicle',function(req,res){

    var sql = "DELETE FROM vehicle WHERE vehicle_number = ? ";
    dbConnetion.query(sql,req.query.vehicle_number,function(err,rows){
        if(err) throw err;
    });
    res.status(200).send({"messagee":"   deleted vehicle successful "}); 

});

app.get('/getRating',function(req,res){

var sql = 'SELECT * FROM `rating` WHERE st_id=?';
    dbConnetion.query(sql,req.query.st_id,function(err,rows){
        if(err) throw err;
        res.send(rows);
    });

})

app.post('/post_rating',function(req,res){
    console.log(req.body);

    var sql = 'UPDATE rating SET rate_count = ?, current_rate=? WHERE st_id = ?' ; 
        dbConnetion.query(sql , [   req.body[1],req.body[2],req.body[0]      ], function(err, result) {
        if (err) throw err;
        res.status(200).send({"messagee":" data received :-)"});  
        
      });

})

app.post('/post_appointment_rated',function(req,res){
    console.log(req.body);

    var sql = 'UPDATE appointment SET rated = ? WHERE appointment_id = ?' ; 
        dbConnetion.query(sql , [ 1,  req.body[0]     ], function(err, result) {
        if (err) throw err;
        res.status(200).send({"messagee":" data received :-)"});  
        
      });

})

app.delete('/Remove_Appointment',function(req,res){

    var sql = "DELETE FROM appointment WHERE appointment_id = ? ";
    dbConnetion.query(sql,req.query.appointment_id,function(err,rows){
        if(err) throw err;
    });
    res.status(200).send({"messagee":"   deleted appointment from vehcile owner successful "}); 

});




////////////////////////////////////////
///////////////////////////////////////

/////////   ADMIN /////////////////////

////////////////////////////////////////
///////////////////////////////////////


app.get('/getRequestedServiceStations',function(req,res){

    var sql = 'SELECT * FROM `requested_stations` ORDER BY reg_number DESC ';

    dbConnetion.query(sql,function(err,rows){
        if(err) throw err;
        res.send(rows);
    });

})


app.get('/get_details_of_req_station',function(req,res){

    var sql = ' select requested_station_services.* ,services.service_name FROM requested_station_services INNER JOIN services ON requested_station_services.service_id = services.service_id WHERE requested_station_services.reg_number = ?';

    dbConnetion.query(sql,req.query.reg_number, function(err,rows){
        if(err) throw err;
        res.send(rows);
    });

})

app.get('/getAllServiceStations',function(req,res){

    var sql = 'SELECT * FROM `service_station`  ';
    dbConnetion.query(sql, function(err,rows){
        if(err) throw err;
        res.send(rows);
    });
})


app.get('/getAllVehicleOwners',function(req,res){

    var sql = 'SELECT * FROM `vehicle_owner` ';
    dbConnetion.query(sql, function(err,rows){
        if(err) throw err;
        res.send(rows);
    });
})
  

app.post('/post_ServiceStation',function(req,res){
    console.log(req.body);

     var sql = ` INSERT INTO service_station (st_id,firstName,lastName,st_name,address,town,email,mobile) values (?,?,?,?,?,?,?,?) `;  
     dbConnetion.query(sql ,[   req.body[0],req.body[1],req.body[2],req.body[3] ,req.body[4],req.body[5],req.body[6],req.body[7]      ], function(err, result) {
        if (err) throw err;
        res.status(200).send({"messagee":" data received :-)"});  
        
      });

})

app.post('/post_serviceStation_services',function(req,res){
    console.log(req.body);

    var sql = ` INSERT INTO servicestation_services (service_id,st_id,amount,duration_hrs) values ? `;
     dbConnetion.query(sql , [req.body], function(err, result) {
        if (err) throw err;
        res.status(200).send({"messagee":" data received :-)"});  
        
      });

})

app.delete('/remove_requested_station',function(req,res){

    var sql = "DELETE FROM requested_stations WHERE reg_number = ?";
    dbConnetion.query(sql,req.query.reg_number, function(err,rows){
        if(err) throw err;
        res.send(rows);
    });
})

app.post('/insert_station_to_ratings',function(req,res){ //post

    var sql = ` INSERT INTO rating (st_id,rate_count,current_rate) values (?,?,?) `;
     dbConnetion.query(sql , [   req.body[0] , 0,  0    ], function(err, result) {
        if (err) throw err;
        res.status(200).send({"messagee":" data received :-)"});  
        
      });

})

app.post('/insert_to_bays',function(req,res){
    console.log(req.body,"bays st_id");

    var sql = ` INSERT INTO bay (bay_id,st_id) values ? `;
     dbConnetion.query(sql , [req.body], function(err, result) {
        if (err) throw err;
        res.status(200).send({"messagee":" data received :-)"});  
        
      });

})
app.post('/update_account_table',function(req,res){

    console.log('called update account',req.body);
    var sql = 'UPDATE accounts SET isAccepted = ? WHERE email = ?' ; 
    dbConnetion.query(sql , [ req.body[1],  req.body[0]     ], function(err, result) {
    if (err) throw err;
    res.status(200).send({"messagee":" updated account :-)"});  
    
  });

})


///////////////////////////////
///////////////////////////// 
////////// Service Station//////////////
/////////////////////////////////////

app.get('/getTodayBookings',function(req,res){

    var sql = 'SELECT * FROM `appointment` WHERE st_id =?  ';
    dbConnetion.query(sql,req.query.st_id, function(err,rows){
        if(err) throw err;
        res.send(rows);
    });
})
app.get('/get_owner_vehicle_details',function(req,res){

    var sql = 'Select vehicle.*,vehicle_owner.* FROM vehicle INNER JOIN vehicle_owner ON vehicle.owner_id=vehicle_owner.owner_id WHERE vehicle.vehicle_number = ?  ';
    dbConnetion.query(sql,req.query.vehicle_number, function(err,rows){
        if(err) throw err;
        res.send(rows);
    });
})

app.get('/get_appointment_services',function(req,res){

    var sql = ' SELECT appointment_service.appointment_id,services.* FROM appointment_service INNER JOIN services ON appointment_service.service_id = services.service_id WHERE appointment_service.appointment_id =?';
    dbConnetion.query(sql,req.query.appointment_id, function(err,rows){
        if(err) throw err;
        console.log(rows)
        res.send(rows);
    });
})

app.post('/send_appointment_confirmation_email' , 

async function send_appointment_confirmation_email(req,res) {
     // req.body[]
    // 0 = st_id
    // 1= bay_id
    // 2 = duration
    // 3= timestamp
    // 4= vehicle_number
    // 5= date_ISO
    //6 = selected_services_id []
    //7 = isonline
    emailAttrs = req.body
    // console.log("calleddddddd to email",emailAttrs);

    let message;

    let services = '';
    var sql = 'SELECT * FROM `services` WHERE service_id =?  ';
  
    for(let x = 0; x< emailAttrs[9].length; x++)
    {
         services = services + emailAttrs[9][x] + ', ' ; 
        //  console.log(services,"eliey?");
    }
  
    message = `<p>Your appointment has been confirmed. Please check below info.</p>
               <h2> Appointment Confirmation </h2>
               <p><b>Service Staion: </b> ${emailAttrs[1]}</p>
               <p><b>Bay Number: </b> ${emailAttrs[2]}</p>
               <p><b>Duration: </b> ${emailAttrs[3]} hours</p>
               <p><b>Date:  </b> ${emailAttrs[4]}</p>
               <p><b>Time:  </b> ${emailAttrs[5]}</p>
               <p><b>Vehicle Number: </b> ${emailAttrs[6]}</p>`;
    
    await sendEmail_namu({
        to: emailAttrs[8],
        subject: 'Appointment Confimation - AutoDoc',
        html: `<h4>AutoDoc Online Appointment Confirmation</h4>
               ${message}
               <h2> Services Selected </h2>
               ${services}`
    });
    res.status(200).send({"messagee":" data received from email :-)"});
  }

)


app.listen(PORT,function(){
    console.log("server running on  port : "+ PORT);
})