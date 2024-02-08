const grandparent = document.getElementById("grandparent");
console.log(document);
const parent = document.querySelector("#parent");
const child = document.querySelector("#child");

console.log(grandparent);

grandparent.addEventListener("click", () => {
  console.log("buttonclicked");
});
