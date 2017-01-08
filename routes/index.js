var express = require('express');
var router = express.Router();
var passport = require('passport')
var mongoose = require('mongoose');
require('../db');
var User = mongoose.model('User');
var Location = mongoose.model('Location');
var request = require('request');

var the_src = "https://maps.googleapis.com/maps/api/js?key=" + process.env.G_MAPS_API_KEY + "&callback=initMap";

/* GET home page. */
router.get('/', function(req, res, next) {
  var responseBody;
  request('https://gbfs.citibikenyc.com/gbfs/en/station_information.json', function parseJSON(error, response, body) {
    if (error) {
      console.log("There was an error requesting JSON.");
      res.redirect('/');
    }
    else {
      responseBody = JSON.parse(body);
      responseBody.data.stations.forEach(function(element) {
        element.name = element.name.replace("&", "and");
      });
      if (!req.user) {
        res.render('index', {the_src:the_src,"json_obj":responseBody});
      }
      // if there is a user, make an array of their station ids to test against locations on map
      else {
        User.findOne({_id:req.user._id}, function(err, users) {
          if (err) {
            console.log("User locations could not be accessed.");
            res.redirect('/');
          }
          else {
            var station_ids = users.locations.map(function(element) {
              return element.stationID;
            });
            /*
            var station_ids = [];
            users.locations.forEach(function(element) {
              station_ids.push(element.stationID);
            })*/
            for (var i = 0; i < responseBody.data.stations.length; i++) {
              if (station_ids.indexOf(Number(responseBody.data.stations[i].station_id)) != -1) {
                responseBody.data.stations[i].saved = true;
              }
            }
            res.render('index', {the_src:the_src, "json_obj": responseBody});
          }
        });
      }
    }
  });
});

/* GET login page */
router.get('/login', function(req, res) {
  res.render('login');
});

/* GET register page */
router.get('/register', function(req, res) {
  res.render('register');
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/my-account', function(req,res) {
  if (!req.user) {
    res.redirect('/login');
  }
  else {
    res.render('edit-user-data');
  }
});

router.get('/my-locations', function(req, res, next) {
  if (!req.user) {
    res.redirect('/login')
  }
  else {
    var responseBody;
    request('https://gbfs.citibikenyc.com/gbfs/en/station_information.json', function parseJSON(error, response, body) {
      if (error) {
        console.log("There was an error requesting JSON.");
        res.redirect('/');
      }
      else {
        responseBody = JSON.parse(body);
        responseBody.data.stations.forEach(function(element) {
          element.name = element.name.replace("&", "and");
        });
        responseBody.data.stations = responseBody.data.stations.filter(function(element) {
          return element != null;
        })
        User.findOne({_id:req.user._id}, function(err, users) {
          if (err) {
            console.log("User locations could not be accessed.");
            res.redirect('/');
          }
          else {
            var station_ids = users.locations.map(function(element) {
              return element.stationID;
            });
            for (var i = 0; i < responseBody.data.stations.length; i++) {
              if (station_ids.indexOf(Number(responseBody.data.stations[i].station_id)) != -1) {
                responseBody.data.stations[i].saved = true;
              }
            }
            res.render('locations', {locs: users.locations, the_src:the_src, "json_obj":responseBody});
          }
        });
      }
    })
  }
});

router.get("/about", function(req,res,next) {
  res.render("about");
});

router.post('/', function(req,res) {
  // if there is a user logged in then add to locations
  if (req.user) {
    /* add to mongo locations for that user */
     User.findOne({_id:req.user._id}, function(err, users) {
        users.locations.push(new Location({
          "locationType": "citibike",
          "locationName": req.body.the_loc,
          "stationID": req.body.station_id
        }))
        users.save(function(err) {
          if (err) {
            console.log('Location did not save.');
            res.redirect('/');
          }
          else {
            res.redirect('/');
          }
        })
      })

  }
  // redirect to log in
  else {
    res.redirect('/login');
  }
});

// link to delete a location
router.post('/del', function(req,res) {
  if (!req.user) {
    res.redirect('/');
  }
  else {
    User.findOne({_id:req.user._id}, function(err, users) {
        for (var i = 0; i < users.locations.length; i++) {
          if (users.locations[i].stationID == parseInt(req.body.station_id)) {
            users.locations.splice(i, 1);
          }
        }
        users.save(function(err) {
          if (!err) {
            res.redirect('/');
          }
          else {
            console.log("Location could not be deleted.");
            res.redirect('/');
          }  
        })
    })
  }
});

router.post('/register', function(req, res) {
  User.register(new User({username:req.body.username}), 
      req.body.password, function(err, user){
    if (err) {
      res.render('register',{message: "Registration is not valid."});
    }
    else {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/');
      });
    }
  });   
});

router.post('/login', function(req,res,next) {
  passport.authenticate('local', function(err,user) {
    if(user) {
      req.logIn(user, function(err) {
        res.redirect('/');
      });
    } else {
      res.render('login', {message:'Your login or password is incorrect.'});
    }
  })(req, res, next);
});

router.post('/my-account', function(req,res) {
    if (req.body.length === 0) {
      res.redirect('/my-account');
    }
    else if (req.body.delete !== undefined) {
        User.findOne({_id:req.user._id}, function(err, users) {
          users.borough = undefined;
          users.save(function(err) {
            if (err) {
              console.log("Borough information could not be deleted.");
              res.redirect('/my-account');
            }
            else {
              res.redirect('/my-account');
            }
          })
      })
    }
    else if (req.body.borough != undefined) {
      User.findOne({_id:req.user._id}, function(err, users) {
        users.borough = req.body.borough;
        users.save(function(err) {
         if (err) {
            console.log("Borough information could not be saved.");
            res.redirect('/my-account');
          }
          else {
            res.redirect('/my-account');
          }
        })
      })
    }
  
});

module.exports = router;
