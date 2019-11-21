
Sydney1 = {lat: -37.687411, lng: 144.9577383}
Sydney2 = {lat: -33.8775, lng: 151.2412}

MIT = {lat: 42.3601, lng: -71.0942};
Harvard = {lat: 42.380098, lng: -71.116629}


function calcDistance(loc1, loc2){
    // function that returns the distance between two places
    lat1 = loc1.lat
    lat2 = loc2.lat
    lon1= loc1.lng
    lon2= loc2.lng
    
    var R = 6371; // km
    var φ1 = degrees_to_radians(lat1);
    var φ2 = degrees_to_radians(lat2);
    var Δφ = degrees_to_radians(lat2-lat1);
    var Δλ = degrees_to_radians(lon2-lon1);

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;
    return d
}

console.log(calcDistance(MIT, Harvard))


function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}
