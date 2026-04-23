const h1 = document.querySelector("h1");
const btn = document.querySelector("#click");
const inputField = document.querySelector("#text");

btn.addEventListener("click", onClick);

chrome.runtime.onMessage.addListener(onMessage);

function onMessage(message, sender, sendResponse) {
  if (message.action === "statusUpdate") {
    const receivedValue = message.data;
    h1.textContent = receivedValue.status;
  }
}

function onClick(e) {
  chrome.runtime.sendMessage({
    action: "executeBackgroundCode",
    data: [{ name: inputField.value }],
  });
}
