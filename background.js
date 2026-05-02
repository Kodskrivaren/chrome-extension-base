chrome.runtime.onMessage.addListener(onMessage);

async function testFunc() {
  const html = document.querySelector("html");
  const a = document.createElement("a");
  a.href = "https://youtube.com";
  a.textContent = "";
  html.append(a);
  a.target = "_blank";
  a.rel = "noopener";
  a.click();
}

async function testFuncTwo() {
  console.log("test2");
  await sleep(500);
  const html = document.querySelector("html");
  html.innerHTML = "";
  console.log(chrome.runtime.sendMessage);
  chrome.runtime.sendMessage({
    action: "tabSwitch",
    data: { tabIndex: 0 },
  });

  async function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}

chrome.tabs.onActivated.addListener(function (activeInfo) {
  console.log("Querying tabs...");
  chrome.tabs.query({ index: 1 }, async function (tabs) {
    console.log(tabs);
    console.log(activeInfo);

    if (tabs.length == 0) return;
    const tabId = tabs[0].id;
    if (activeInfo.tabId != tabId) return;
    // await chrome.tabs.update(tabId, { active: true, selected: true });
    console.log("executing script...");
    console.log(tabs[0]);

    await sleep(1000);
    console.log(tabs[0]);
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: testFuncTwo,
    });
  });
});

function onMessage(message, sender, sendResponse) {
  if (message.action === "executeBackgroundCode") {
    const receivedValue = message.data;
    preExecution(receivedValue);
  } else if (message.action === "tabSwitch") {
    chrome.tabs.query({ index: message.data.tabIndex }, async function (tabs) {
      console.log(tabs);
      await chrome.tabs.update(tabs[0].id, { active: true, selected: true });
    });
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

      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: testFunc,
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

async function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
