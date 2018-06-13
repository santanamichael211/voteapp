$(document).ready(function(){

    $(".des-show").on("click",function(event){
      var $listEle = event.target.parentElement;

      if($($listEle).children(".description-div").css("display")=="none"){
          $($listEle).children(".description-div").slideDown("fast");
          event.target.innerHTML = "&#9650;";
      }
      else{
          $($listEle).children(".description-div").slideUp("fast");
          event.target.innerHTML = "&#9660;";
      }
    })

    $(".add-button").on("click",function(event){
      var value = $("#input-val").val();
      if(value==""){alert("Unable to create element with out value. Please specify a value."); return;}
      $("#input-val").val("");
      var $formEle = event.target.parentElement;
      var element = document.createElement("LI");
      var text = document.createElement("H3");
      var textVal = document.createTextNode(value);
      var minusButton = document.createElement("BUTTON");
      minusButton.setAttribute("type","button");
      minusButton.setAttribute("class","minus-button");
      minusButton.setAttribute("onclick","removeEle(this)");
      minusButton.innerHTML = "-";
      text.appendChild(textVal);
      element.appendChild(text);
      element.appendChild(minusButton);
    $($formEle).children("form").children("#value-list").append(element);
    });

    $("#delete").on("click", function(event){
      var id = event.currentTarget.getAttribute("data-id");

      if(confirm("Are you sure you want to delete this poll?")){
        $.ajax({
          type: "DELETE",
          url:"/polls/"+ id,
          success: function(response){
            alert("Deleting Poll!");
            window.location.href="/";
          },
          error: function(err){
            console.log(err);
          }
      });
      }
    });
});

function removeEle(event){
  var li = event.parentElement;
  event.parentElement.parentElement.removeChild(li);
}


function validateForm(){
  if($("#value-list li").length<=0){
    alert("List of values is empty. Please add more values to list before submitting.");
    return false;
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
