$(document).ready(function () {
  $("#buttonAjax").click(function () {

    if($("#username").val() === "" || $("#country").val() === "" || $("#message").val() === "") {
        alert("Please fill all the inputfields.");
        return;
    }

    $.post(
      "/ajaxmessage",
      {
        usernameAjax: $("#username").val(),
        countryAjax: $("#country").val(),
        messageAjax: $("#message").val(),
      },
    );

    $("#username").val("")
    $("#country").val("")
    $("#message").val("")


    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      console.log("Jee onnistuu!!!! :)")
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var testi = xmlhttp.responseText
        document.getElementById('feedback').innerHTML = testi
      }
    }

    xmlhttp.open("POST", "/ajaxmessage", true);
    // xmlhttp.setRequestHeader("Content-type", "application/x-www-for-urlencoded");
    xmlhttp.setRequestHeader("Content-type", "text/plain");
    xmlhttp.send();
  });
});