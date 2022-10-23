let tabButtons = document.getElementsByClassName("tab-button");
let selected = null;
for (let button of tabButtons) {
    if (button.classList.contains("button-selected")) {
        selected = button;
    }
    button.addEventListener('click', function() {
        if (!button.classList.contains("button-selected")) {
            button.classList.add("button-selected");
            selected.classList.remove("button-selected");
            selected = button;
        }
    });
}