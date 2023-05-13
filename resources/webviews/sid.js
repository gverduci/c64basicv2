(function () {
    const vscode = acquireVsCodeApi();

    /**
     * 
     * @param {number} attack 2ms - 8s
     * @param {*} decay 6ms - 24 s
     * @param {*} sustainLevel 0 - 15
     * @param {*} release 6ms - 24 s
     * @param {*} sustain s
     */
    const drawADSR = (attack, decay, sustainLevel, release, sustain = 3) => {
        var c = /** @type {HTMLCanvasElement} */ (document.querySelector('#canvas'));

        const headlen = 6; // length of head in pixels
        const bottomAreaADSR = 30;
        const bottomAreaGate = 30;
        const bottomArea = bottomAreaADSR + bottomAreaGate;
        const preGatePostRelease = 0.5; //s
        const maxs = preGatePostRelease + attack + decay + sustain + release + preGatePostRelease;
        const startx = 30;
        const maxWidth = c.width;
        const maxx = maxWidth - startx;

        const margin = ((preGatePostRelease / maxs) * maxx);
        const basex = margin + startx;
        const bottomy = c.height - bottomArea - headlen;
        const peaky = 10;
        // a:maxs=x:maxx
        const attackp = basex + ((attack / maxs) * maxx);
        const decayp = attackp + ((decay / maxs) * maxx);
        const sustainx = decayp + ((sustain / maxs) * maxx);
        const sustainy = bottomy - ((bottomy - peaky) / 15) * sustainLevel;
        const releasex = sustainx + ((release / maxs) * maxx);

        /** @type {CanvasRenderingContext2D} */
        var ctx = c.getContext("2d");
        ctx.clearRect(0, 0, c.width, c.height);

        // start zero line
        ctx.strokeStyle = '#569cd6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(startx, bottomy);
        ctx.lineTo(basex, bottomy);
        ctx.stroke();

        // attack line
        ctx.beginPath();
        ctx.moveTo(basex, bottomy);
        ctx.lineTo(attackp, peaky);
        ctx.stroke();

        // decay line
        ctx.beginPath();
        ctx.moveTo(attackp, peaky);
        ctx.lineTo(decayp, sustainy);
        ctx.stroke();

        // sustain line
        ctx.beginPath();
        ctx.moveTo(decayp, sustainy);
        ctx.lineTo(sustainx, sustainy);
        ctx.stroke();

        // release line
        ctx.beginPath();
        ctx.moveTo(sustainx, sustainy);
        ctx.quadraticCurveTo(sustainx + (releasex - sustainx) / 12, bottomy + (bottomy - sustainy) / 12, releasex, bottomy);
        ctx.stroke();

        // end zero line
        ctx.beginPath();
        ctx.moveTo(releasex, bottomy);
        ctx.lineTo(maxWidth, bottomy);
        ctx.stroke();

        // bottom part

        ctx.lineWidth = .5;
        ctx.font = "lighter 10px monospace";

        // attack
        ctx.beginPath();
        ctx.moveTo(basex, bottomy + bottomAreaADSR - 2 * headlen);
        ctx.lineTo(basex, bottomy + bottomAreaADSR);
        ctx.moveTo(basex, bottomy + bottomAreaADSR - headlen);
        ctx.lineTo(attackp, bottomy + bottomAreaADSR - headlen);
        ctx.stroke();
        ctx.strokeText("A", (attackp - (attackp - basex) / 2) - 5, bottomy + bottomAreaADSR - 2 * headlen);

        // decay
        ctx.beginPath();
        ctx.moveTo(attackp, bottomy + bottomAreaADSR - 2 * headlen);
        ctx.lineTo(attackp, bottomy + bottomAreaADSR);
        ctx.moveTo(attackp, bottomy + bottomAreaADSR - headlen);
        ctx.lineTo(decayp, bottomy + bottomAreaADSR - headlen);
        ctx.stroke();
        ctx.strokeText("D", (decayp - (decayp - attackp) / 2) - 5, bottomy + bottomAreaADSR - 2 * headlen);

        // sustain
        ctx.beginPath();
        ctx.moveTo(decayp, bottomy + bottomAreaADSR - 2 * headlen);
        ctx.lineTo(decayp, bottomy + bottomAreaADSR);
        ctx.moveTo(decayp, bottomy + bottomAreaADSR - headlen);
        ctx.lineTo(sustainx, bottomy + bottomAreaADSR - headlen);
        ctx.stroke();
        ctx.strokeText("S", (sustainx - (sustainx - decayp) / 2) - 5, bottomy + bottomAreaADSR - 2 * headlen);

        // release
        ctx.beginPath();
        ctx.moveTo(sustainx, bottomy + bottomAreaADSR - 2 * headlen);
        ctx.lineTo(sustainx, bottomy + bottomAreaADSR);
        ctx.moveTo(sustainx, bottomy + bottomAreaADSR - headlen);
        ctx.lineTo(releasex, bottomy + bottomAreaADSR - headlen);
        ctx.moveTo(releasex, bottomy + bottomAreaADSR - 2 * headlen);
        ctx.lineTo(releasex, bottomy + bottomAreaADSR);
        ctx.stroke();
        ctx.strokeText("R", (releasex - (releasex - sustainx) / 2) - 5, bottomy + bottomAreaADSR - 2 * headlen);

        // gate
        ctx.beginPath();
        ctx.moveTo(basex, bottomy + bottomAreaGate + bottomAreaADSR - 2 * headlen);
        ctx.lineTo(basex, bottomy + bottomAreaGate + bottomAreaADSR);
        ctx.moveTo(basex, bottomy + bottomAreaGate + bottomAreaADSR - headlen);
        ctx.lineTo(sustainx, bottomy + bottomAreaGate + bottomAreaADSR - headlen);
        ctx.moveTo(sustainx, bottomy + bottomAreaGate + bottomAreaADSR - 2 * headlen);
        ctx.lineTo(sustainx, bottomy + bottomAreaGate + bottomAreaADSR);
        ctx.stroke();
        ctx.strokeText("Gate", (sustainx - (sustainx - basex) / 2) - 5, bottomy + bottomAreaGate + bottomAreaADSR - 2 * headlen);

        // Amplitude
        ctx.beginPath();
        ctx.moveTo(startx - 2 * headlen, peaky);
        ctx.lineTo(startx, peaky);
        ctx.moveTo(startx - headlen, peaky);
        ctx.lineTo(startx - headlen, bottomy);
        ctx.moveTo(startx - 2 * headlen, bottomy);
        ctx.lineTo(startx, bottomy);
        ctx.stroke();
        ctx.strokeText("Peak", startx + 1, peaky + 5);
        ctx.strokeText("Ampl.", startx + 1, ((bottomy - peaky) / 2) + 5);
        ctx.strokeText("Zero", startx + 1, bottomy - 5);

    };

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

    const getOptionValue = (attributeName, select) => {
        let option = null;
        for (let index = 0; index < select.options.length; index++) {
            if (select.options[index].value === select.value) {
                return select.options[index].attributes[attributeName].value;
            }

        }
        return "0";
    };

    const adBtn = /** @type {HTMLElement} */ (document.querySelector('.adBtn'));
    const srBtn = /** @type {HTMLElement} */ (document.querySelector('.srBtn'));
    adBtn.addEventListener('click', (evt) => {
        const adHi = /** @type {HTMLElement} */ (document.querySelector('.attack'));
        const adLow = /** @type {HTMLElement} */ (document.querySelector('.decay'));
        const valHi = parseInt(adHi.value, 10);
        const valHiSh = valHi << 4;
        const valLow = parseInt(adLow.value, 10);
        const val = valHiSh + valLow;
        onStringClicked(`${val}`);
    });

    srBtn.addEventListener('click', (evt) => {
        const srHi = /** @type {HTMLElement} */ (document.querySelector('.sustain'));
        const srLow = /** @type {HTMLElement} */ (document.querySelector('.release'));
        const valHi = parseInt(srHi.value, 10);
        const valHiSh = valHi << 4;
        const valLow = parseInt(srLow.value, 10);
        const val = valHiSh + valLow;
        onStringClicked(`${val}`);
    });

    const attack = /** @type {HTMLElement} */ (document.querySelector('.attack'));
    const decay = /** @type {HTMLElement} */ (document.querySelector('.decay'));
    const sustain = /** @type {HTMLElement} */ (document.querySelector('.sustain'));
    const release = /** @type {HTMLElement} */ (document.querySelector('.release'));

    const callDrawADSR = () => {
        const adHi = /** @type {HTMLElement} */ (document.querySelector('.attack'));
        const adLow = /** @type {HTMLElement} */ (document.querySelector('.decay'));
        const srHi = /** @type {HTMLElement} */ (document.querySelector('.sustain'));
        const srLow = /** @type {HTMLElement} */ (document.querySelector('.release'));
        drawADSR(parseFloat(getOptionValue("attack", adHi)), parseFloat(getOptionValue("decrel", adLow)), parseInt(getOptionValue("sustain", srHi), 10), parseFloat(getOptionValue("decrel", srLow)));
    };

    attack.addEventListener('change', (evt) => callDrawADSR());
    decay.addEventListener('change', (evt) => callDrawADSR());
    sustain.addEventListener('change', (evt) => callDrawADSR());
    release.addEventListener('change', (evt) => callDrawADSR());

    callDrawADSR();

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