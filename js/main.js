const createElement = (properties) => {
    const { parent, tag, id, classes, text, onclick } = properties;
    const element = document.createElement(tag);

    if ( parent !== undefined )
        parent.append(element);

    element.id = id;
    element.innerText = text || '';
    element.onclick = onclick;

    if ( Array.isArray(classes) )
        classes.forEach(name => element.classList.add(name));

    return element;
};

const renderObject = (element, object) => {
    if (Object.keys(object || {}).length === 0)
        return;

    const ul = document.createElement("ul");
    ul.classList.add("object-list");
    Object.keys(object).forEach(key => {
        const li = document.createElement("li");
        ul.append(li);
        if (typeof object[key] === 'object' && Object.keys(object[key] || {}).length > 0) {
            const liTitle = document.createElement("li");
            liTitle.innerHTML = `<b>${key}</b>: ${Object.keys(object[key]).length} item(s)`;
            li.append(liTitle);
            renderObject(li, object[key]);
            liTitle.classList.add("clickable-object");
            liTitle.onclick = () => li.querySelector("ul")?.classList.toggle("hidden-object");
            li.querySelector("ul")?.classList.add("hidden-object");
        } else {
            li.innerHTML = `<b>${key}</b>: <i style="color: grey">${object[key] === null || object[key] === undefined ? '-' : object[key]}</i>`;
        }
    });
    element.append(ul);
};

const testAPI = async (requests, testResultElement) => {

    let response;
    let data;

    for (let request in requests) {
        
        const { method, route, meta } = requests[request];

        if (typeof data === "object" && data !== null) {
            Object.keys(data).forEach(key => {
                if (key in meta && meta[key] === null)
                    meta[key] = data[key];
            });
        }
        
        response = await fetch(`https://sandbox.tripleplaypay.com/api/${route}?apikey=testapikey`, {
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            method: method,
            body: JSON.stringify(meta)
        });

        data = await response.json();

        const requestDetailsElement = createElement({ type: "div", parent: testResultElement, classes: ["test-detail-info"] });
        const responseDetailsElement = createElement({ type: "div", parent: testResultElement, classes: ["test-detail-info"] });

        const requestTitleElement = createElement({ 
            type: "h5", 
            parent: requestDetailsElement, 
            classes: ["test-detail-title"], 
            text: `${method} /api/${route}`
        });
        createElement({ type: "b", parent: requestTitleElement, classes: ["test-detail-title-decorator"], text: `${request}`});
        renderObject(requestDetailsElement, meta);
        
        const responseTitleElement = createElement({ 
            type: "h5",
            parent: responseDetailsElement, 
            classes: ["test-detail-title", data.status === false ? "test-detail-title-error" : "test-detail-title-ok"], 
            text: `${response.status} ${response.statusText} ${data.message?.message || data.id || ''}`
        });
        createElement({ type: "b", parent: responseTitleElement, classes: ["test-detail-title-decorator"], text: `${request}`});
        renderObject(responseDetailsElement, data);
    }

    return {
        code: response.status,
        status: data.status === undefined ? true : data.status,
        message: data.message?.message || data.id || ''
    }
};

// main
document.addEventListener("DOMContentLoaded", () => {

    document.querySelector("#test-iframe-charge").onclick = () => {
        const triple = new Triple("testapikey");
        triple.generatePaymentForm({
            containerSelector: "#iframe",
            amount: "3.33",
            onSuccess: (message) => alert(JSON.stringify(message)),
            onError: (error) => alert(JSON.stringify(error))
        });
        document.querySelector("#iframe-modal").style.display = "block";
        document.querySelector("#screen-dim").style.display = "block";
        document.body.style.overflow = "hidden";
    };
    
    document.querySelector("#test-iframe-subscription").onclick = () => {
        const triple = new Triple("testapikey");
        triple.generatePaymentForm({
            containerSelector: "#iframe",
            paymentType: "subscription",
            interval: "daily",
            frequency: 2,
            amount: "3.33",
            onSuccess: (message) => alert(JSON.stringify(message)),
            onError: (error) => alert(JSON.stringify(error))
        });
        document.querySelector("#iframe-modal").style.display = "block";
        document.querySelector("#screen-dim").style.display = "block";
        document.body.style.overflow = "hidden";
    };
    
    // set up button to close the iframe modal
    document.querySelector("#close-iframe").onclick = () => {
        document.querySelector("#iframe-modal").style.display = "none";
        document.querySelector("#screen-dim").style.display = "none";
        document.body.style.overflow = "scroll";
    };

    const testButton = document.querySelector("#test-all");

    testButton.onclick = () => {
        const buttons = document.querySelectorAll(".group-button");
        for (let i = 0; i < buttons.length; i++)
            buttons[i].click();

        let i = 0;
        const tokens = [".", "..", "..."];
        const interval = setInterval(() => {
            testButton.innerText = tokens[i++ % 3];
            for (let j = 0; j < buttons.length; j++) {
                if (buttons[j].disabled === false)
                    break;
                else if (j === buttons.length - 1) {
                    testButton.innerText = "ALL TESTS COMPLETED";
                    testButton.disabled = true;
                    clearInterval(interval);
                }
            }
        }, 200);
    };

    // generate rows (forgive me for the mess...)
    Object.keys(tests).forEach(sectionName => {

        const sectionElement = createElement({ tag: "div", parent: document.body, classes: ["section"] });
        createElement({ tag: "h4", parent: sectionElement, classes: ["section-header"], text: sectionName });
        const testAllButton = createElement({ 
            tag: "button", 
            parent: sectionElement, 
            text: "RUN TESTS", 
            classes: ["section-button", "group-button"], 
            onclick: () => {

                const buttons = document.querySelectorAll(`.button-group-${sectionName}`);
                for (let i = 0; i < buttons.length; i++) {
                    if (buttons[i].classList.contains("test-button"))
                        buttons[i].click();
                }

                let i = 0;
                const tokens = [".", "..", "..."];
                const interval = setInterval(() => {
                    testAllButton.innerText = tokens[i++ % 3];
                    for (let j = 0; j < buttons.length; j++) {
                        if (buttons[j].classList.contains("test-button"))
                            break;
                        else if (j === buttons.length - 1) { // reached the last button
                            testAllButton.innerText = "TESTS COMPLETED";
                            testAllButton.disabled = true;
                            clearInterval(interval);
                        }
                    }
                }, 200);
            }
        });

        tests[sectionName].forEach(test => {
            const testContainerElement = createElement({ tag: "div", parent: document.body, classes: ["test-container"] });
            const testDetailElement = createElement({ tag: "div", parent: testContainerElement, classes: ["test-detail"] });
            const testResultElement = createElement({ tag: "div", parent: testContainerElement, classes: ["test-result", "hide-result"] });
        
            const testDetailL = createElement({ tag: "div", parent: testDetailElement, classes: ["test-detail-l"] });
            const testDetailR = createElement({ tag: "div", parent: testDetailElement, classes: ["test-detail-r"] });

            const testStatusElement = createElement({ tag: "h5", parent: testDetailL, classes: ["test-status"], text: '·' });
            createElement({ tag: "h5", parent: testDetailL, text: `/api/${test.endpoint}`});
            const shortResponseElement = createElement({ tag: "p", parent: testDetailR, classes: ["test-short-response"] });
            
            const testButton = createElement({ 
                tag: "button", 
                parent: testDetailR, 
                text: "▶",
                classes: ["test-button", `button-group-${sectionName}`],
                onclick: async () => {

                    let result = undefined;
                    let i = 0;
                    const tokens = ["·", "··","···"];

                    let interval = setInterval(() => {
                        if (result !== undefined) {
                            testButton.innerText = "▽";
                            testButton.classList.replace("test-button", "details-button");
                            clearInterval(interval);
                        } else {
                            testButton.innerText = tokens[i++ % 3];
                        }
                    }, 200);

                    try {
                        result = await testAPI(test.requests, testResultElement);
                    } catch (error) {
                        result = { status: false, message: error };
                    }

                    testStatusElement.innerText = result.status === true ? '⊙': '⊗';
                    testStatusElement.style.color = result.status === true ? "green" : "lightcoral"
                    shortResponseElement.innerText = result.message;

                    testButton.onclick = () => {
                        testButton.innerText = testButton.innerText === "△" ? "▽" : "△";
                        testResultElement.classList.toggle("hide-result");
                    };
                }
            });
        });
    });
});