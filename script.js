const h1 = document.querySelector("h1");
const btn = document.querySelector("#click");
const inputField = document.querySelector("#text");

btn.addEventListener("click", onClick);

function onClick(e) {
  chrome.runtime.sendMessage({
    action: "executeBackgroundCode",
    data: [{ name: inputField.value }],
  });
}
