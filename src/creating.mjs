import setText, { appendText } from "./results.mjs";

export function timeout() {
  const wait = new Promise((resolve) => {
    setTimeout(() => {
      resolve("Timeout!");
    }, 1500);
  });
  wait.then((text) => setText(text));
}

export function interval() {
  let counter = 0;
  const wait = new Promise((resolve) => {
    console.log("INTERVAL");
    setInterval(() => {
      resolve(`Timeout! ${++counter}`);
    }, 1500);
  });
  wait
    .then((text) => setText(text))
    .finally(() => appendText(`--Done ${counter}`));
}

export function clearIntervalChain() {
  let counter = 0;
  let interval;
  const wait = new Promise((resolve) => {
    interval = setInterval(() => {
      console.log("INTERVAL");
      resolve(`Timeout! ${++counter}`);
    }, 1500);
  });
  wait.then((text) => setText(text)).finally(() => clearInterval(interval));
}

export function xhr() {
  let request = new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3000/users/7");
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.responseText);
      } else {
        reject(xhr.statusText);
      }
    };
    xhr.onerror = () => reject("Request failed");
    xhr.send();
  });
  request.then((result) => setText(result)).catch((reason) => setText(reason));
}

export function allPromises() {
  let catagories = axios.get("http://localhost:3000/itemCategories");
  let statuses = axios.get("http://localhost:3000/orderStatuses");
  let userTypes = axios.get("http://localhost:3000/userTypes");
  let addressesTypes = axios.get("http://localhost:3000/adressTypes");
  Promise.all([catagories, statuses, userTypes, adressTypes])
    .then(([cat, stat, type, addresses]) => {
      setText("");

      appendText(JSON.stringify(cat.data));
      appendText(JSON.stringify(stat.data));
      appendText(JSON.stringify(type.data));
      appendText(JSON.stringify(addresses.data));
    })
    .catch((reasons) => {
      setText(reasons);
    });
}

export function allSettled() {
  let catagories = axios.get("http://localhost:3000/itemCategories");
  let statuses = axios.get("http://localhost:3000/orderStatuses");
  let userTypes = axios.get("http://localhost:3000/userTypes");
  let addressesTypes = axios.get("http://localhost:3000/adressTypes");
  Promise.allSettled([catagories, statuses, userTypes, adressTypes])
    .then((values) => {
      let results = values.map((v) => {
        if (v.status === "fulfilled") {
          return `FULFILLED: ${JSON.stringify(v.value.data[0])} `;
        }

        return `REJECTED: ${v.reason.message} `;
      });
      setText(results);
    })
    .catch((reasons) => {
      setText(reasons);
    });
}

export function race() {
  let users = axios.get("http://localhost:3000/users");
  let backup = axios.get("http://localhost:3001/users");

  Promise.race([users, backup])
    .then((users) => setText(JSON.stringify(users.data)))
    .catch((reason) => setText(reason));
}
