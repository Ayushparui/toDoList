// Entire Date will be displayed
exports.getDate = function() {
    var day = new Date();
    var options = {
        month: "long",
        day: "numeric",
        weekday: "long",
        year: "numeric"
    }
    return currentDate = day.toLocaleDateString("en-US", options)
}

// Only the Week day will be displayed
exports.getDay = function() {
    var day = new Date();
    var options = {
        weekday: "long",
    }
   return currentDate = day.toLocaleDateString("en-US", options)
}