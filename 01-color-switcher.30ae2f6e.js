!function(){function t(){document.body.style.backgroundColor="".concat("#".concat(Math.floor(16777215*Math.random()).toString(16).padStart(6,0))),localStorage.setItem(r,document.body.style.backgroundColor)}var e,o=document.querySelector("[data-start]"),n=document.querySelector("[data-stop]"),r="body-background-color";o.addEventListener("click",(function(o){t(),e=setInterval((function(){t()}),1e3),o.currentTarget.setAttribute("disabled","")})),n.addEventListener("click",(function(t){o.removeAttribute("disabled"),clearInterval(e)})),document.body.addEventListener("durationchange",(function(){})),document.body.style.backgroundColor=localStorage.getItem(r)}();
//# sourceMappingURL=01-color-switcher.30ae2f6e.js.map
