function myFunction() {
    var x = document.getElementById("mySidebar");
    if (x.className === "sidebar") {
      x.className += " responsive";
    } else {
      x.className = "sidebar";
    }
    }
    
    
        var createTestText = document.getElementById("createTestText");
        if (createTestText) {
          createTestText.addEventListener("click", function () {
            var popup = document.getElementById("testpageContainer");
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
      
        // Add event listener for the "Next" button in the "testpage" popup
        var nextButton = document.querySelector(".next-button");
        if (nextButton) {
          nextButton.addEventListener("click", function () {
            var questionPopup = document.getElementById("questionpageContainer");
            if (!questionPopup) return;
            var questionPopupStyle = questionPopup.style;
            if (questionPopupStyle) {
              questionPopupStyle.display = "flex";
              questionPopupStyle.zIndex = 100;
              questionPopupStyle.backgroundColor = "rgba(113, 113, 113, 0.3)";
              questionPopupStyle.alignItems = "center";
              questionPopupStyle.justifyContent = "center";
            }
            questionPopup.setAttribute("closable", "");
      
            var onClick =
              questionPopup.onClick ||
              function (e) {
                if (e.target === questionPopup && questionPopup.hasAttribute("closable")) {
                  questionPopupStyle.display = "none";
                }
              };
            questionPopup.addEventListener("click", onClick);
          });
        }
      
        var logOutText = document.getElementById("logOutText");
        if (logOutText) {
          logOutText.addEventListener("click", function (e) {
            // Please sync "Desktop - 1" to the project
          });
        }
      
        var announcementText = document.getElementById("announcementText");
        if (announcementText) {
          announcementText.addEventListener("click", function () {
            var popup = document.getElementById("annouencementpageContainer");
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