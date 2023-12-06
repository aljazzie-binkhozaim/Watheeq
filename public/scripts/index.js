









var popuprectangle2 = document.getElementById("popuprectangle2");
if (popuprectangle2) {
  popuprectangle2.addEventListener("click", function (e) {
    // Please sync "s-home" to the project
  });
}

var popupnextText = document.getElementById("popupnextText");
if (popupnextText) {
  popupnextText.addEventListener("click", function (e) {
    // Please sync "ins-PAGE " to the project
  });
}

var rectangle = document.getElementById("rectangle");
if (rectangle) {
  rectangle.addEventListener("click", function () {
    var popup = document.getElementById("sSignInContainer");
    if (!popup) return;
    var popupStyle = popup.style;
    if (popupStyle) {b
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

var rectangle1 = document.getElementById("rectangle1");
if (rectangle1) {
  rectangle1.addEventListener("click", function () {
    var popup = document.getElementById("insSignInContainer");
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

var studentText = document.getElementById("studentText");
if (studentText) {
  studentText.addEventListener("click", function () {
    var popup = document.getElementById("sSignInContainer");
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