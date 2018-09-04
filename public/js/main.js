$(document).ready(function(){


    //----------------------- show description/hide in index
    $(".des-show").on("click",function(event){
      var $listEle = event.target.parentElement;

      if($($listEle).children(".description-div").css("display")=="none"){
          $($listEle).children(".description-div").slideDown("fast");
          event.target.innerHTML = "&#9650;";
      }
      else{
          $($listEle).children(".description-div").slideUp("fast");
          event.target.blur();
          event.target.innerHTML = "&#9660;";
      }
    })
    //------------------------- show description/hide in index

    //---- handle error/message display

    var errorRed = "rgba(244, 67, 54,.7)";
    var successGreen = "rgba(76, 175, 80,.7)"

    if(getParams("success","false")){
      $("#status").text("Error");
      $("#modal-text").text("You have already voted on this poll. Please wait until tommorrow before voting again.");
      $("#status").css("background",errorRed);
      $("#modal").fadeIn("fast");
    }
    else if(getParams("success","true")){
      $("#status").text("Message");
      $("#modal-text").text("Vote Successfull!");
      $("#status").css("background",successGreen);
      $("#modal").fadeIn("fast");
    }
    else if(getParams("addSuccess","true")){
      $("#status").text("Message");
      $("#modal-text").text("Poll Added Successfully!");
      $("#status").css("background",successGreen);
      $("#modal").fadeIn("fast");
    }
    else if(getParams("addSuccess","false")){
      $("#status").text("Error");
      $("#modal-text").text("Sorry Something Went Wrong. Please Try Again!");
      $("#status").css("background",errorRed);
      $("#modal").fadeIn("fast");
    }
    else if(getParams("deleteSuccess","true")){
    $("#status").text("Message");
    $("#modal-text").text("Poll Deleted Successfully!");
    $("#status").css("background",successGreen);
    $("#modal").fadeIn("fast");
    }
    else if(getParams("deleteSuccess","false")){
    $("#status").text("Error");
    $("#modal-text").text("Error occured while deleting. Please try again!");
    $("#status").css("background",errorRed);
    $("#modal").fadeIn("fast");
    }
    else if(getParams("comDel","true")){
    $("#status").text("Message");
    $("#modal-text").text("Comment Successfully Deleted!");
    $("#status").css("background",successGreen);
    $("#modal").fadeIn("fast");
    }
    else if(getParams("addCom","true")){
    $("#status").text("Message");
    $("#modal-text").text("Commented Successfully");
    $("#status").css("background",successGreen);
    $("#modal").fadeIn("fast");
    }
    else if(getParams("addCom","false")){
    $("#status").text("Error");
    $("#modal-text").text("Comment could not be added. Please try again.");
    $("#status").css("background",errorRed);
    $("#modal").fadeIn("fast");
    }
    else if(getParams("logOut","true")){
    $("#status").text("Message");
    $("#modal-text").text("You have logged out.");
    $("#status").css("background",successGreen);
    $("#modal").fadeIn("fast");
    }
    else if(getParams("logIn","true")){
    $("#status").text("Message");
    $("#modal-text").text("You are now logged In");
    $("#status").css("background",successGreen);
    $("#modal").fadeIn("fast");
    }
    //---- handle error/message display end


    //-- close and open modals
    $("#close-vote").on("click", (event)=>{
      $("#vote-div").fadeOut("fast");
    });

    $("#close-modal").on("click", (event)=>{
      $("#modal").fadeOut("fast");
    });

    $(".vote-btn").on("click",(event)=>{
      $("#vote-div").fadeIn("fast");
    });
    //-- close and open modals


    //--- show user menu
      $("#user-btn").on("click",()=>{
        if($("#menu-div").css("display") === "none"){
          $("#menu-div").fadeIn("fast");
        }
        else{
          $("#menu-div").fadeOut("fast");
        }
      });
    // -----

    //----- add value to add poll form list start
    $(".add-button").on("click",function(event){
      var value = $("#input-val").val();
      //-- handleing empty string entered
      if(value==""){
        $("#status").text("Error");
        $("#modal-text").text("Unable to add empty value. Please enter a name for the value.");
        $("#status").css("background",errorRed);
        $("#modal").fadeIn("fast");
        return;
      }
      //-- handleing empty string entered

      //-- create list element with value for display
      $("#input-val").val("");
      var element = document.createElement("LI");
      var text = document.createElement("H3");
      var textVal = document.createTextNode(value);
      var minusButton = document.createElement("BUTTON");
      minusButton.setAttribute("type","button");
      minusButton.setAttribute("onclick","removeEle(this)");
      minusButton.innerHTML = "&times;";
      text.appendChild(textVal);
      element.appendChild(text);
      element.appendChild(minusButton);
    $("#value-list").append(element);
    //-- create list element with value for display
    });
    //----- add value to add poll form list end

    //----- delete poll start
    $("#delete").on("click", function(event){
      var id = event.currentTarget.getAttribute("data-id");
      if(confirm("Are you sure you want to delete this poll?")){
        $.ajax({
          type: "DELETE",
          url:"/polls/"+ id,
          success: function(response){
            window.location.href="/?deleteSuccess=true";
          },
          error: function(err){
            console.log(err);
            window.location.href="/?deleteSuccess=false";
          }
      });
      }
    });
    //----- delete poll end

    //---------------------- delete comments
    $(".comment-close").on("click", function(event){
      var id = event.currentTarget.getAttribute("data-id");
      var val = event.currentTarget.parentElement.getElementsByTagName("p")[0].innerHTML;
      var position = $("#comment-list li:contains("+val+")").index();

      if(confirm("Are you sure you want to delete this comment?")){
        $.ajax({
          type: "POST",
          url:"/polls/delete/deletecom/"+ id+"?val="+position,
          success: function(response){
            window.location.href="/polls/"+id+"?comDel=true";
          },
          error: function(err){
            console.log(err);
            window.location.href="/polls/"+id+"?comDel=false";
          }
      });
      }

    });
    //---------------------- delete comments
});

//---- remove element from add poll forms list value
function removeEle(event){
  var li = event.parentElement;
  event.parentElement.parentElement.removeChild(li);
}
//---- remove element from add poll forms list value

//------------ vaidate form function
function validateForm(){
  if($("#value-list li").length<=0){
    alert("Unable to submit form with empty value list.");
    return;
  }
  else{
    var listArr = document.getElementById("value-list").getElementsByTagName("li");
    var values = [];
    for(var i = 0; i<listArr.length; i++){
      values.push(listArr[i].getElementsByTagName("h3")[0].innerHTML);
    }

    $("#list-input").attr("value",values);
    document.getElementById("add-form").submit();
  }
}
//------------ vaidate form function

//------ access url params function
function getParams(param, value){
  var urlParams = new URLSearchParams(window.location.search);
  if(urlParams.has(param) && urlParams.get(param)===value){
    return true;
  }
  else{
    return false;
  }
}
//------ access url params function
