
class LogConsole {
    constructor(id) {
        this._log = document.getElementById(id);
    }
    clear() {
        const parent = this._log;
        while (parent.firstChild) {
            parent.firstChild.remove();
        }
    }
    append(str, color=null, escape=true) {
        const span = document.createElement('span');
        // span.setAttribute('class', 'sr-only');
        if (color) span.style.color = color;
        if (escape) {
            span.textContent = str;
        } else {
            span.innerHTML = str;
        }

        this._log.appendChild(span);
    }
    scrollToBottom() {
        // https://stackoverflow.com/a/33193694
        this._log.scrollTop = this._log.scrollHeight - this._log.clientHeight;
    }
    outputLine(str, color) {
        this.append(str, color);
        this.append('<br />', null, false);
        this.scrollToBottom();
    }
}

export default LogConsole;
