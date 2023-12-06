document.getElementById('close').addEventListener('click', function(e) {
    e.preventDefault();
    this.parentNode.style.display = 'none';
}, false);



      function myFunction() {
  var x = document.getElementById("mySidebar");
  if (x.className === "sidebar") {
    x.className += " responsive";
  } else {
    x.className = "sidebar";
  }
}



      var iconLogout = document.getElementById("iconLogout");
      if (iconLogout) {
        iconLogout.addEventListener("click", function (e) {
          // Please sync "Desktop - 1" to the project
        });
      }

      var popupstartText = document.getElementById("popupstartText");
          if (popupstartText) {
            popupstartText.addEventListener("click", function (e) {
              // Please sync "s-exam[ EMTENAN ]" to the project
            });
          }
          
          var takeTest = document.getElementById("takeTest");
          if (takeTest) {
            takeTest.addEventListener("click", function () {
              var popup = document.getElementById("testCodePopup");
              if (!popup) return;
              var popupStyle = popup.style;
              if (popupStyle) {
                popupStyle.display = "flex";
                popupStyle.zIndex = 100;
                popupStyle.backgroundColor = "rgba(113, 113, 113, 0.3)";
                popupStyle.alignItems = "center";
                popupStyle.justifyContent = "center";
              }
              popup.setAttribute("closable", "");
          
              var onClick =
                popup.onClick ||
                function (e) {
                  if (e.target === popup && popup.hasAttribute("closable")) {
                    popupStyle.display = "none";
                  }
                };
              popup.addEventListener("click", onClick);
            });
          }
    
          var iconLogout = document.getElementById("iconLogout");
          if (iconLogout) {
            iconLogout.addEventListener("click", function (e) {
              // Please sync "Desktop - 1" to the project
            });
          }