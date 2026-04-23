chrome.runtime.onMessage.addListener(onMessage);

function onMessage(message, sender, sendResponse) {
  if (message.action === "executeBackgroundCode") {
    const receivedValue = message.data;
    preExecution(receivedValue);
  }
}

async function preExecution(data) {
  chrome.tabs.query(
    { active: true, currentWindow: true },
    async function (tabs) {
      const tabId = tabs[0].id;
      await chrome.storage.local.set({ data: data }, function () {
        console.log("Data stored successfully.");
      });
      console.log(data);

      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: execution,
      });
    },
  );
}

async function execution() {
  console.log("Execution");
  let data;
  await chrome.storage.local.get("data", (result) => {
    console.log(result);
    data = result;
  });
  await sleep(500);
  console.log("data variable");

  const itemArray = data.data.split("\n");

  itemArray.pop();

  console.log(itemArray);

  chrome.runtime.sendMessage({
    action: "statusUpdate",
    data: { status: "testing status" },
  });

  async function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}
