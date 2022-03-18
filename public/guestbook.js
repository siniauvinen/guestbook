fetch("guestbookdata")
  .then(response => response.json())
  .then(data => {
    var tbody = document.getElementById("tbody")

    for (i = 0; i < data.length; i++) {
    var tr = document.createElement('tr');
    tr.innerHTML = '<td>' + data[i].username + '</td>' +
    '<td>' + data[i].country + '</td>' +
    '<td>' + data[i].message + '</td>';
    tbody.appendChild(tr);
    }
  })
