
var tbs = $("#tbs");
var  newTable = $("#newTable tr:last")

$(document).ready(function () {

//functions
function conditionCloseBTNS(div, childBtn){
    $(div).on("click", childBtn, function(){
        $("#action li").removeClass("disabled")
        $("#condition li").removeClass("disabled")
        $("#tbs li").removeClass("disabled")
        $("#conditionBtn").html("Condition")
        $("#tableBtn").html("Tables")
        $(div).empty()
    })
}

function addDisabled(){
    $("#action li").addClass("disabled")
    $("#condition li").addClass("disabled")
    $("#tbs li").addClass("disabled")
}
function removeDisabled(){
    $("#action li").removeClass("disabled")
    $("#condition li").removeClass("disabled")
    $("#tbs li").removeClass("disabled")
}
function tableContent(data){
    //in insert option there cant be two close buttons so we check to see if the option selected in insert and if yes we dont add another close button
    if ($("#actionBtn").text().trim() !== "Insert"){
        $("#selectedTable").append('<button class="closeBTN mb-3" style="float: right;">&#x2716;</button>')
    }
    $('#selectedTable').append('<th>ID</th>' + '<th>firstName</th>' + '<th>lastName</th>' + '<th>clientID</th>')
    
    for (var i = 0; i < data.length; i++){
        $('#selectedTable').append( '<tr><td>' + data[i].ID + '</td>' + '<td class="td">'+  data[i].firstName + '</td>' + '<td class="td">'+  data[i].lastName + '</td>' + '<td class="td">'+  data[i].clientID + '</td>' );             
    }
}
function getTables(){
    $.get(
        url= `http://localhost:3000/tables`,
        function(data, status){
            var tables = $.parseJSON(data)
            var dropdownLength = $("#tbs .dropdown-item").length;
            if (dropdownLength < tables.length){
                
                for (var i = 0; i < tables.length; i++){
                    tbs.append(`<li><a class="dropdown-item tbList" href="#">` + tables[i].TABLE_NAME + `</a></li>`)
                    
                } 
            }
        }
    );
}
function defaultHeader(){
    $("#conditionBtn").html("Condition")
    $("#tableBtn").html("Tables")
}

// Retrieve tables from the database
$("#tableBtn").on("click", function(){
    getTables()
})
    

$("#create").on("click", function(){
    addDisabled()
    var ID = 100;
    $("#newTable").append('<label for="tName">Table Name: </label><br>')
    $("#newTable").append('<button type="button" class="newTableCloseBTN mb-3" style="float: right;">&#x2716;</button></div>')
    //table name
    $("#newTable").append(`<input class="mb-3" type="text" id="tName" name="tName" placeholder="New Table" pattern="[A-Za-z]*" title="No numbers or special characters are allowed!"><br>`)
    //table headers
    $("#newTable").append('<th>ID</th>' + '<th>firstName</th>' + '<th>lastName</th>' + '<th>clientID</th>' + '<th class="addR"><button type="button"> + </button></th>')
    //click listner for when the + button is clicked
    $(".addR").unbind("click").bind("click", function(){
        $("#newTable").append(`<tr><td><Input name="ID" value="${++ID}" readonly></td><td><input name="FirstName"></td><td ><input name="LastName"></td><td ><input type="number" name="ClientID"></td></tr>`)
    })
    //first row in the table
    $("#newTable").append( `<tr><td><Input name="ID" value="${ID}" readonly></td><td><input name="FirstName"></td><td ><input name="LastName"></td><td ><input type="number" name="ClientID"></td></tr`);       
    $(".create").css("display", "")
})


// drop down headers text changer

// condition
$("#condition a").on('click', function(e) {
    e.preventDefault(); // cancel the link behaviour
    var selected = $(this).text();
    $("#conditionBtn").text(selected);
  });
//Action 
$("#action a").on('click', function(e) {
    e.preventDefault(); // cancel the link behaviour
    var selected = $(this).text();
    $("#actionBtn").text(selected);
  });


$("#tbs").on("click", "a", function(e) {
    var selected = $(this).text();
    $("#tableBtn").text(selected);
    var text = {database: selected}
    if ($("#actionBtn").text().trim() == "Select"){ 
        addDisabled()
        $.post({
            data: (text),
            url: `http://localhost:3000/content`,
            success: function (data) {
                tableContent(data)
            }
        })
    }
    if ($("#actionBtn").text().trim() == "Delete"){ 
        var removedDBJSON = {name: selected}
        $.post({
            data: (removedDBJSON),
            url: `http://localhost:3000/removeDatabase`,
            success: function (data) {
                bootbox.alert("Table successfully dropped!")
                $("#tableBtn").text("Tables");
                $(`li > a:contains(${selected})`).each(function() {
                    if ($(this).text() === `${selected}`) {
                        $(this).parent().remove();
                    }
               });
            }
        })
    }
    if ($("#actionBtn").text().trim() == "Insert"){ 
        addDisabled();
        $.post({
            data: (text),
            url: `http://localhost:3000/content`,
            success: function (data) {
                lastID = data[data.length - 1].ID;
                //close button
                $("#newRows").append('<button type="button" class="newRowsCloseBTN mb-3" style="float: right;">&#x2716;</button></div>')
                //table name
                $("#newRows").append(`<input class="mb-3" type="text" id="chosenTable" name="tName" value=${selected} readonly><br>`)
                //table headers
                $('#newRows').append('<th>ID</th>' + '<th>firstName</th>' + '<th>lastName</th>' + '<th>clientID</th>' + '<th><button class="rowsAdder" type="button"> + </button></th>')
                //click listner for when the + button is clicked
                $('.rowsAdder').unbind("click").bind("click", function(){
                    $('#newRows').append(`<tr><td><Input name="ID" value="${++lastID}" readonly></td><td><input name="FirstName"></td><td ><input name="LastName"></td><td ><input type="number" name="ClientID"></td></tr>`)
                })
                //first row in the table
                $('#newRows').append( `<tr><td><Input name="ID" value="${++lastID}" readonly></td><td><input name="FirstName"></td><td ><input name="LastName"></td><td ><input type="number" name="ClientID"></td></tr`); 
                tableContent(data)
                //display the insert button
                $(".insert").css("display", "")
            }
        })
    }      
    if ($("#actionBtn").text().trim() == "Update"){
        addDisabled()
        $.post({
            data: (text),
            url: `http://localhost:3000/content`,
            success: function (data) {
                tableContent(data)
                $(".td").one("click", function(){
                    $(".td").attr('contenteditable', true);
                    //to disable the double tap when trying to selected the cell
                    $(this).focus()
                    var originalText = $(this).text();
                    var th = $("#selectedTable th").eq($(this).index())
                    var columnHeader = th.text()
                    $(this).on('keypress', function(e) {
                        if(e.which == 13) {
                            e.preventDefault()
                            $(this).blur()
                            var newText = $(this).text()
                            var text = {old: originalText, new: newText, database: selected, colHeader: columnHeader}
                            $.post({
                                data: (text),
                                url: `http://localhost:3000/update`,
                                success: function (data) {
                                    bootbox.alert("The selected database has been successfully updated")
                                    
                                }
                            })
                        }
                    });
                    
                })
            }
        })
    }        
}) 

//some of the table close buttons
$("#selectedTable").on("click", ".closeBTN", function(){
    removeDisabled()
    $("#tableBtn").html("Tables")
    $("#actionBtn").html("Action")
    $('#selectedTable').empty()
})
$(".RowsTable").on("click", ".newRowsCloseBTN", function(){
    removeDisabled()
    $("#tableBtn").html("Tables")
    $("#actionBtn").html("Action")
    $("#newRows").empty()
    $(".insert").css("display", "none")
    $('#selectedTable').empty()

})
$(".form").on("click", ".newTableCloseBTN", function(){
    removeDisabled()
    $("#tableBtn").html("Tables")
    $("#actionBtn").html("Action")
    $(".create").css("display", "none")
    $('#newTable').empty()
})

//condition menu drop down    

$("#firstNameChar").on("click", function(){
    if ($("#tableBtn").text().trim() !== "Tables"){
        var dBase = $("#tableBtn").text().trim();
        bootbox.prompt("Please enter the character", function(result){ 
            if ((result !== null) && (result.length == 1)){
                // if((result.length > 0)){
                    addDisabled()
                    var text = {char: result, database: dBase}
                    $.post({
                        data: (text),
                        url: `http://localhost:3000/firstNameChar`,
                        success: function (data) {
                            if (data.length == '0'){
                                bootbox.alert("No rows found!");
                                defaultHeader()
                                removeDisabled()
                            } else{
                                $('#foreNameChar').append('<button class="foreNameCloseBTN mb-3" style="float: right;">&#x2716;</button></div>')
                                $('#foreNameChar').append('<th>ID</th>' + '<th>firstName</th>' + '<th>lastName</th>' + '<th>clientID</th>')
                                for (var i = 0; i < data.length; i++){
                                    $('#foreNameChar').append( '<tr><td>' + data[i].ID + '</td>' + '<td>'+  data[i].firstName + '</td>' + '<td>'+  data[i].lastName + '</td>' + '<td>'+  data[i].clientID + '</td>' );
                                }
                            }
                        }
                    })
                // } else{
                //     defaultHeader()
                // }
            } else{
                defaultHeader()
            }
        });
    } else{
        $("#conditionBtn").html("Condition")
        bootbox.alert("Please select a database first!");
    }
    conditionCloseBTNS("#foreNameChar", ".foreNameCloseBTN")
})

$("#lastNameChar").on("click", function(){
    if ($("#tableBtn").text().trim() !== "Tables"){
        var dBase = $("#tableBtn").text().trim();
        bootbox.prompt("Please enter the character", function(result){ 
            if((result !== null) && (result.length == 1)){
                    addDisabled()
                    var text = {char: result, database: dBase}
                    $.post({
                    data: (text),
                    url: `http://localhost:3000/lastNameChar`,
                    success: function (data) {
                        if (data.length == '0'){
                            bootbox.alert("No rows found!");
                            defaultHeader()
                            removeDisabled()
                        } else{
                            $('#surNameChar').append('<button class="surNameCloseBTN mb-3" style="float: right;">&#x2716;</button></div>')
                            $('#surNameChar').append('<th>ID</th>' + '<th>firstName</th>' + '<th>lastName</th>' + '<th>clientID</th>')
                            for (var i = 0; i < data.length; i++){
                                $('#surNameChar').append( '<tr><td>' + data[i].ID + '</td>' + '<td>'+  data[i].firstName + '</td>' + '<td>'+  data[i].lastName + '</td>' + '<td>'+  data[i].clientID + '</td>' );
                            }
                        }
                    }
                    })
            } else{
                defaultHeader()
            }      
        });
    } else{
        $("#conditionBtn").html("Condition")
        bootbox.alert("Please select a database first!");
    }
    conditionCloseBTNS('#surNameChar', ".surNameCloseBTN")
})

$("#firstName").on("click", function(){
    if ($("#tableBtn").text().trim() !== "Tables"){
        var dBase = $("#tableBtn").text().trim();
        bootbox.prompt("Please enter the first name", function(result){ 
            if((result !== null) && (result.length > 0)){
                // if((result.length > 0)){
                    addDisabled()
                    var text = {firstName: result, database: dBase}
                    $.post({
                        data: (text),
                        url: `http://localhost:3000/firstName`,
                        success: function (data) {
                            if (data.length == '0'){
                                bootbox.alert("No rows found!");
                                defaultHeader()
                                removeDisabled()
                            } else{
                                $('#foreName').append('<button class="foreNameCloseBTN mb-3" style="float: right;">&#x2716;</button></div>')
                                $('#foreName').append('<th>ID</th>' + '<th>firstName</th>' + '<th>lastName</th>' + '<th>clientID</th>')
                                for (var i = 0; i < data.length; i++){
                                    $('#foreName').append( '<tr><td>' + data[i].ID + '</td>' + '<td>'+  data[i].firstName + '</td>' + '<td>'+  data[i].lastName + '</td>' + '<td>'+  data[i].clientID + '</td>' );
                                }
                            }
                        }
                    })
                // } else{
                //     defaultHeader()
                // }
            } else{
                defaultHeader()
            }          
        });
    } else{
        $("#conditionBtn").html("Condition")
        bootbox.alert("Please select a database first!");                
    }  
    conditionCloseBTNS("#foreName", ".foreNameCloseBTN")     
})

$("#lastName").on("click", function(){
    if ($("#tableBtn").text().trim() !== "Tables"){
        var dBase = $("#tableBtn").text().trim();
        bootbox.prompt("Please enter the last name", function(result){ 
            if((result !== null) && (result.length > 0)){
                // if((result.length > 0)){
                    addDisabled()
                    var text = {lastName: result, database: dBase}
                    $.post({
                        data: (text),
                        url: `http://localhost:3000/lastName`,
                        success: function (data) {
                            if (data.length == '0'){
                                bootbox.alert("No rows found!");
                                defaultHeader()
                                removeDisabled()
                            } else{
                                $('#surName').append('<button class="surNameCloseBTN mb-3" style="float: right;">&#x2716;</button></div>')
                                $('#surName').append('<th>ID</th>' + '<th>firstName</th>' + '<th>lastName</th>' + '<th>clientID</th>')
                                for (var i = 0; i < data.length; i++){
                                    $('#surName').append( '<tr><td>' + data[i].ID + '</td>' + '<td>'+  data[i].firstName + '</td>' + '<td>'+  data[i].lastName + '</td>' + '<td>'+  data[i].clientID + '</td>' );
                                }
                            }
                        }
                    })
                // } else{
                //     defaultHeader()
                // }
            }  else{
                defaultHeader()
            }           
        });
    } else{
        $("#conditionBtn").html("Condition")
        bootbox.alert("Please select a database first!");                
    } 
    conditionCloseBTNS("#surName", ".surNameCloseBTN")        
})

$("#name").on("click", function(){
    if ($("#tableBtn").text().trim() !== "Tables"){
        var dBase = $("#tableBtn").text().trim();
        bootbox.prompt("Please enter the first name followed by space followed by last name", function(result){                        
            if((result !== null) && (result.length > 0)){
                // if((result.length > 0)){
                    addDisabled()
                    var input = result.split(" ");
                    var fName = input[0];
                    var lName = input[1];
                    var text = {firstName: fName, lastName: lName, database: dBase}
                    $.post({
                        data: (text),
                        url: `http://localhost:3000/name`,
                        success: function (data) {
                            if (data.length == '0'){
                                bootbox.alert("No rows found!");
                                defaultHeader()
                                removeDisabled()
                            } else{
                                $('#fullName').append('<button class="nameCloseBTN mb-3" style="float: right;">&#x2716;</button></div>')
                                $('#fullName').append('<th>ID</th>' + '<th>firstName</th>' + '<th>lastName</th>' + '<th>clientID</th>')
                                for (var i = 0; i < data.length; i++){
                                    $('#fullName').append( '<tr><td>' + data[i].ID + '</td>' + '<td>'+  data[i].firstName + '</td>' + '<td>'+  data[i].lastName + '</td>' + '<td>'+  data[i].clientID + '</td>' );
                                }
                            }
                        }
                    })
                // } else{
                //     defaultHeader()
                // } 
            } else{
                defaultHeader()
            }             
        });
    } else{
        $("#conditionBtn").html("Condition")
        bootbox.alert("Please select a database first!");                    
    }         
    conditionCloseBTNS("#fullName", ".nameCloseBTN")      
})

$("#clientID").on("click", function(){
    if ($("#tableBtn").text().trim() !== "Tables"){
        var dBase = $("#tableBtn").text().trim();
        bootbox.prompt("Please enter the client ID: ", function(result){                        
            if((result !== null) && (result.length > 0)){
                // if((result.length > 0)){
                    addDisabled()
                    var text = {ID: result, database: dBase}
                    $.post({
                        data: (text),
                        url: `http://localhost:3000/clientID`,
                        success: function (data) {
                            if (data.length == '0'){
                                bootbox.alert("No rows found!");
                                defaultHeader()
                                removeDisabled()
                            } else{
                                $('#id').append('<button class="idCloseBTN mb-3" style="float: right;">&#x2716;</button></div>')
                                $('#id').append('<th>ID</th>' + '<th>firstName</th>' + '<th>lastName</th>' + '<th>clientID</th>')
                                for (var i = 0; i < data.length; i++){
                                    $('#id').append( '<tr><td>' + data[i].ID + '</td>' + '<td>'+  data[i].firstName + '</td>' + '<td>'+  data[i].lastName + '</td>' + '<td>'+  data[i].clientID + '</td>' );
                                }
                            }
                        }
                    })
                // } else{
                //     defaultHeader()
                // }     
            } else{
                defaultHeader()
            }              
        });
    } else{
        $("#conditionBtn").html("Condition")
        bootbox.alert("Please select a database first!");                    
    } 
    conditionCloseBTNS("#id", ".idCloseBTN")                   
})

// Submit forms
$(".form").on("submit", function(){
    $.ajax({
        url: 'http://localhost:3000/createNewTable',
        type: 'POST',
        cache: false,
        data: $(".form").serialize(),
        success: function (data) {
        }
        , error: function (jqXHR, textStatus, err) {
            bootbox.alert("The form was not submitted!")
        }
    });
})
$(".RowsTable").on("submit", function(){
    $.ajax({
        url: 'http://localhost:3000/insertRows',
        type: 'POST',
        cache: false,
        data: $(".RowsTable").serialize(),
        success: function (data) {
        }
        , error: function (jqXHR, textStatus, err) {
            bootbox.alert("The rows were not added!")
        }
    });
})
})
