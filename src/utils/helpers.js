
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;

    let result = 12742 * Math.asin(Math.sqrt(a));

    if (result < 1) {
        return `${parseFloat(result).toFixed(2)} mtrs`
    } else {
        return `${parseFloat(result).toFixed(2)} kms`
    }

    // return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km

}

module.exports = {
    calculateDistance
}