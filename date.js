module.exports.getDay = getDay


function getDay(){

    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    var date = new Date()
    var day = date.toLocaleDateString("en-US", options)
    return day
}
