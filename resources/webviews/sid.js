(function () {
    const vscode = acquireVsCodeApi();

    // const oldState = /** @type {{ count: number} | undefined} */ (vscode.getState());

    /** 
     * @param {string} value 
     */
    function onSnippetClicked(snippetValue) {
        vscode.postMessage({ type: 'snippet', value: snippetValue });
    }

    /** 
     * @param {string} value 
     */
    function onStringClicked(snippetValue) {
        vscode.postMessage({ type: 'string', value: snippetValue });
    }

    const snippets = /** @type {HTMLElement} */ (document.querySelectorAll('.snippet'));
    snippets.forEach(snippet => {
        snippet.addEventListener('click', (evt) => {
            onSnippetClicked(evt.target.attributes["data"].value);
        });
    });

    const strings = /** @type {HTMLElement} */ (document.querySelectorAll('.string'));
    strings.forEach(str => {
        str.addEventListener('click', (evt) => {
            onStringClicked(evt.target.attributes["data"].value);
        });
    });

    
    // console.log('Initial state', oldState);

    // let currentCount = (oldState && oldState.count) || 0;
    // counter.textContent = `${currentCount}`;

    // setInterval(() => {
    //     counter.textContent = `${currentCount++} `;

    //     // Update state
    //     vscode.setState({ count: currentCount });

    //     // Alert the extension when the cat introduces a bug
    //     if (Math.random() < Math.min(0.001 * currentCount, 0.05)) {
    //         // Send a message back to the extension
    //         vscode.postMessage({
    //             command: 'alert',
    //             text: '🐛  on line ' + currentCount
    //         });
    //     }
    // }, 100);

    // // Handle messages sent from the extension to the webview
    // window.addEventListener('message', event => {
    //     const message = event.data; // The json data that the extension sent
    //     switch (message.command) {
    //         case 'refactor':
    //             currentCount = Math.ceil(currentCount * 0.5);
    //             counter.textContent = `${currentCount}`;
    //             break;
    //     }
    // });
}());