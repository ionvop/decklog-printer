let btnPrint = document.getElementById("btnPrint");
let inputHeight = document.getElementById("inputHeight");

btnPrint.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let height = inputHeight.value;

    if (tab.id) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            args: [height],
            function: (height) => {
                let deckview = document.querySelector(".deckview");
                let decklist = [];

                for (let cardContainer of deckview.querySelectorAll(".card-container")) {
                    let card = cardContainer.querySelector("img");

                    if (card.getAttribute("lazy") != "loaded") {
                        alert("Please scroll to the bottom of the page and try again.");
                        return;
                    }

                    for (let i = 0; i < Number(cardContainer.querySelector(".num").innerText); i++) {
                        decklist.push(card.src);
                    }
                }

                console.log(decklist);
                let result = document.createElement("div");

                for (let card of decklist) {
                    let img = document.createElement("img");
                    img.src = card;
                    img.style.height = height + "in";
                    result.appendChild(img);
                }

                let win = window.open();
                win.document.write(result.innerHTML);
                
                setTimeout(() => {
                    win.print();
                    win.close();
                }, 100);
            }
        });
    }
});