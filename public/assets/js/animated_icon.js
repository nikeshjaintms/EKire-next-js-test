document.addEventListener("DOMContentLoaded", function () {
    const input = document.querySelector('div.search-bar input');
    const iconContainer = document.querySelector('ul.icon-list');

    if (!input || !iconContainer) {
        console.error("❌ Search input or icon container not found.");
        return;
    }

    let icons = [];
    document.querySelectorAll('li.icon-box').forEach(icon => {
        let strongElement = icon.querySelector('strong');
        if (strongElement) {
            icons.push({
                el: icon,
                name: strongElement.innerHTML.trim().toLowerCase()
            });
        }
    });

    // ✅ Add event listener only if input exists
    input.addEventListener('input', function (evt) {
        let searchValue = evt.target.value.toLowerCase().trim();
        let iconsToShow = searchValue.length
            ? icons.filter(icon => icon.name.includes(searchValue))
            : icons;

        iconContainer.innerHTML = ''; // Clear container
        iconsToShow.forEach(icon => iconContainer.appendChild(icon.el));
    });
});

// ✅ Function to copy text to clipboard
function copyTextToClipboard(text) {
    let textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

// ✅ Function to handle material icon copy notification
function material_icon(element) {
    setTimeout(() => {
        if (element.firstChild) {
            let iconText = element.firstChild.innerHTML.trim();
            console.log("Copied:", iconText);
            copyTextToClipboard(iconText);
            Toastify({
                text: "Copied to the clipboard successfully",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: { background: "rgba(var(--success),1)" },
                onClick: function () {}
            }).showToast();
        }
    }, 100);
}

// ✅ Function to test notification
function notify_copy_2() {
    console.log("Notification function triggered!");
}
