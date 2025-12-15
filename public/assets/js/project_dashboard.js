// Toast js
window.addEventListener('load', () => {
    showToast("You have 6 tasks today. Keep it up ⚡");
});

function showToast(message) {
    let toastContainer = document.querySelector('.toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toastContainer';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4000);
}

// Chart Configuration
var options = {
    series: [
        { name: 'Income', data: [35, 35, 18, 45, 45, 10, 20] },
        { name: 'Expense', data: [10, 25, 15, 25, 20, 45] }
    ],
    chart: {
        height: 380,
        type: 'line',
        dropShadow: {
            enabled: true,
            blur: 1,
            color: ['rgba(var(--primary),1)', 'rgba(var(--success),1)'],
            opacity: 0.6
        }
    },
    colors: ['rgba(var(--primary),1)', 'rgba(var(--success),1)'],
    dataLabels: { enabled: false },
    stroke: {
        width: 2,
        curve: 'smooth',
        dashArray: [0, 2],
    },
    xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
        labels: { style: { fontSize: '14px', fontFamily: '"Montserrat", system-ui', fontWeight: 600 } },
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false }
    },
    grid: {
        show: true,
        borderColor: 'rgba(var(--dark),.2)',
        yaxis: { lines: { show: true } }
    },
    yaxis: {
        labels: {
            formatter: (value) => value + "$",
            style: { fontSize: '14px', fontFamily: '"Montserrat", system-ui', fontWeight: 600 }
        }
    },
    legend: { show: false },
    tooltip: { x: { show: false }, style: { fontSize: '16px', fontFamily: '"Outfit", sans-serif' } },
    responsive: [
        { breakpoint: 1399, options: { chart: { height: 380 } } },
        { breakpoint: 567, options: { yaxis: { show: false } } }
    ]
};

var chartElement = document.querySelector("#projectExpense");
if (chartElement) {
    var chart = new ApexCharts(chartElement, options);
    chart.render();
}

// Timer functionality
const timerDisplay = document.querySelector('.timer-display');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');
const historyList = document.querySelector('.tracker-history-list');

let timer, elapsedTime = 0, historyCount = 5;

const formatTime = ms => new Date(ms).toISOString().slice(11, 19);
const toggleButtons = (start, stop) => { if (startBtn && stopBtn) { startBtn.disabled = start; stopBtn.disabled = stop; } };
const addHistory = (time) => {
    if (historyList) {
        const li = document.createElement('li');
        li.className = 'bg-info-300';
        li.innerHTML = `<div><h6 class="text-info-dark mb-0">Session ${++historyCount}</h6></div>
                        <div class="text-dark f-w-600 ms-2">${time}</div>`;
        historyList.appendChild(li);
    }
};

if (startBtn && stopBtn && resetBtn && timerDisplay) {
    startBtn.onclick = () => {
        const startTime = Date.now() - elapsedTime;
        timer = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            timerDisplay.textContent = formatTime(elapsedTime);
        }, 100);
        toggleButtons(true, false);
    };

    stopBtn.onclick = () => {
        clearInterval(timer);
        addHistory(formatTime(elapsedTime));
        toggleButtons(false, true);
    };

    resetBtn.onclick = () => {
        clearInterval(timer);
        elapsedTime = 0;
        timerDisplay.textContent = formatTime(elapsedTime);
        toggleButtons(false, true);
    };
}

// File uploader
const fileUploader = document.querySelector('#fileUploaderBox');
if (fileUploader) {
    FilePond.create(fileUploader, {
        labelIdle: `
            <img src="../assets/images/dashboard/project/emoji.gif" alt="gif" class="w-40 ">
            <div class="filepond--label-action text-decoration-none">
                <h5 class="text-info f-s-22">No Files Available!</h5>
                <p class="text-dark f-s-14">Unfortunately, there's no open files right now</p>
            </div>`
    });
}

// Task container slider
if ($('.task-container').length) {
    $('.task-container').slick({
        dots: false,
        speed: 1000,
        slidesToShow: 3,
        arrows: false,
        vertical: true,
        verticalSwiping: true,
        focusOnSelect: true,
        autoplay: true,
        autoplaySpeed: 1000,
    });
}

// Clock update function with element existence check
function updateClock() {
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const hourHand = document.getElementById("hour");
    const minuteHand = document.getElementById("min");
    const secondHand = document.getElementById("sec");
    const hourDisplay = document.querySelector(".hour-display");

    if (hourDisplay) {
        hourDisplay.textContent = `${hour}H`;
    }

    const hourDeg = (hour % 12) * 30 + minutes * 0.5;
    const minuteDeg = minutes * 6;
    const secondDeg = seconds * 6;

    if (hourHand && minuteHand && secondHand) {
        hourHand.style.transform = `translate(-50%, -100%) rotate(${hourDeg}deg)`;
        minuteHand.style.transform = `translate(-50%, -100%) rotate(${minuteDeg}deg)`;
        secondHand.style.transform = `translate(-50%, -100%) rotate(${secondDeg}deg)`;
    }
}

// Run updateClock only if elements exist
if (document.querySelector(".hour-display")) {
    setInterval(updateClock, 1000);
    updateClock();
}
