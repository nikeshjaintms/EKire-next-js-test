//  **------flag icon**
$(document).on('click', '.flag-icon-toggle .btn', function () {
    $(".flag-icon-toggle .btn").removeClass("active");
    $(this).addClass("active");
    if ($(this).text().trim() === "Squared") {
        $(".flag-icon").addClass("flag-icon-squared");
    } else {
        $(".flag-icon").removeClass("flag-icon-squared");
    }
});

function copyText(element) {
    copyTextToClipboard(`<i class="${element.children[0].className}"></i>`);
    Toastify({
        text: "Copied to the clipboard successfully",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "rgba(var(--success),1)",
        },
        onClick: function () {}
    }).showToast();
}

function notify_copy_2() {
    console.log("this");
}

function copyTextToClipboard(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

// Wait for DOM to be fully loaded before running the icon search logic
document.addEventListener('DOMContentLoaded', function () {
    const input = document.querySelector('div.search-bar input');
    const iconContainer = document.querySelector('ul.icon-list');
    let icons = [];

    if (input && iconContainer) {
        document.querySelectorAll('li.icon-box').forEach(icon => {
            const nameEl = icon.querySelector('strong');
            if (nameEl) {
                icons.push({
                    el: icon,
                    name: nameEl.innerHTML
                });
            }
        });

        input.addEventListener('input', function (evt) {
            let searchValue = evt.target.value;
            let iconsToShow = searchValue.length
                ? icons.filter(icon => icon.name.toLowerCase().includes(searchValue.toLowerCase()))
                : icons;

            iconContainer.innerHTML = '';
            iconsToShow.forEach(icon => iconContainer.appendChild(icon.el));
        });
    }
});
