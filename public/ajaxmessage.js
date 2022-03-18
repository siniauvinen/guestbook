$(document).ready(function () {
  $("#buttonAjax").click(function () {
    if (
      $("#username").val() === "" ||
      $("#country").val() === "" ||
      $("#message").val() === ""
    ) {
      alert("Please fill all the inputfields.");
      return;
    }

    $.post("/ajaxmessage", {
      usernameAjax: $("#username").val(),
      countryAjax: $("#country").val(),
      messageAjax: $("#message").val(),
    });

    $("#username").val("");
    $("#country").val("");
    $("#message").val("");

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var response = xmlhttp.responseText;
        document.getElementById('feedback').innerHTML = response
      }
    };

    xmlhttp.open("POST", "/ajaxmessage", true);
    xmlhttp.setRequestHeader(
      "Content-type",
      "application/x-www-for-urlencoded"
    );
    xmlhttp.send();
  });
});
