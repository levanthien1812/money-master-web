document
  .getElementById("add-income-btn")
  .addEventListener("mouseenter", function () {
    document.getElementById("hovering-block").style.left =
      this.offsetLeft -
      document.getElementById("add-transactions-container").offsetLeft;
  });
