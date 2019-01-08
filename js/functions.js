var log = function(e, t) {
  t = t || "INFO";
  var o = moment().format("DD MMM HH:mm:ss");
  console.log(o + " [" + t.toUpperCase() + "] " + e)
};
log("Scripts loaded");
var staticLoaded = 0,
  jsonLoaded = 0,
  playerCount = 0,
  errorMsg = "Error loading content!",
  loadStatic = function(e) {
    for (var t = 0; t < e.length; t++) getStatic(e[t], e.length);
    setTimeout(function() {
      log(staticLoaded + "/" + e.length + " static items loaded"), staticLoaded = 0
    }, 3e3)
  },
  getStatic = function(e, t) {
    var o = "#" + e.replace("statics/", "").replace(".html", "");
    $.get(e, function(t) {
      $(o).html(t), staticLoaded += 1, log("(STATIC " + staticLoaded + ") Loaded " + e)
    }).error(function() {
      log("Error loading " + e + "!", "WARN"), $(o).html(errorMsg)
    })
  },
  loadJson = function(e, t) {
    getJson(e, function(e) {
      return updateOnline(e.usingCachedData ? !1 : !0), updateJsonItems(e), t.length > e.length ? void log("JSON data incomplete, not storing in cache!", "WARN") : ($.cookies.set("jsondata", e, {
        expiresAt: moment().add("days", 15).toDate()
      }), void log("Updated JSON data cache"))
    }, function(o) {
      updateOnline(!1), log("Error loading " + e + "!", "WARN");
      var n = $.cookies.get("jsondata");
      if (null != n) log("Loading JSON items from cache...", "WARN"), updateJsonItems(n);
      else {
        log("No cached JSON items found!", "WARN");
        for (var a in t) $("#" + t[a]).html(errorMsg)
      }
    }), setTimeout(function() {
      log(jsonLoaded + "/" + t.length + " JSON items loaded"), jsonLoaded = 0
    }, 3e3)
  },
  getJson = function(e, t, o) {
    if (e) {
      t = t || function() {}, o = o || function() {};
      var n = "undefined" != typeof XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP");
      n.open("get", e, !0), n.onreadystatechange = function() {
        var e;
        4 == n.readyState && 200 == n.status && (e = JSON.parse(n.responseText), t(e))
      }, n.onerror = function() {
        o(9001)
      }, n.timeout = 2500, n.ontimeout = function() {
        o(9001)
      }, n.send()
    }
  },
  updateJsonItems = function(e) {
    for (var t in jsonContent) {
      var o = jsonContent[t],
        n = e[o];
      null != n && 0 != n.length ? ($("#" + o).html(parseArray(n, o)), jsonLoaded += 1, log("(JSON " + jsonLoaded + ") Loaded " + o)) : (log("Error loading " + o + "!", "WARN"), $("#" + o).html(errorMsg))
    }
  },
  parseArray = function(e, t) {
    var o = "";
    if ("developers" == t) {
      for (var n in e) {
        var a = " - ";
        a += "Madgeek1450" == e[n] ? "TFM Creator" : "DarthSalamon" == e[n] ? "Lead Developer" : "Developer", o += '<a href="#"><li>' + e[n] + a + "</li></a>"
      }
    } else if ("masterbuilders" == t) {
        for (var n in e) o += '<a name="' + e[n] + '"><li><img class="responsive-img head-icon" src="https://minotar.net/avatar/' + e[n] + '/80.png">' + e[n] + "</li></a>";
    } else
        for (var n in e) o += '<a href="#"><li>' + e[n] + "</li></a>";
    return o
  },
  updateOnline = function(e) {
    e ? $("#status").html("The server is <font color='Green'>Online</font>!") : $("#status").html("The server is <font color='Red'>Offline</font> :/")
  };
