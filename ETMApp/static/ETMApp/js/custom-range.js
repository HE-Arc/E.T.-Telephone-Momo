/* INPSIRED BY https://codepen.io/trevanhetzel/pen/rOVrGK*/
let sheet = document.createElement('style');
let prefs = ['webkit-slider-runnable-track', 'moz-range-track', 'ms-track'];

document.body.appendChild(sheet);

function prevAll(element) {
    let result = [];

    while (element = element.previousElementSibling)
        result.push(element);
    return result;
}

let getTrackStyle = function (el) {
    let curVal = (el.value - 3) / 2+1;
    //let val = (curVal - 1) * 16.666666667;
    let val = (curVal - 1) * (100 / ((el.max - el.min) / 2));
    let style = '';

    let labels = document.querySelectorAll('.range-labels li');

    for (let label of labels) {
        label.classList.remove('active', 'selected');
    }

    //var curLabel = $('.range-labels').find('li:nth-child(' + curVal + ')');
    let curLabel = document.querySelector('.range-labels li:nth-child(' + curVal + ')');
    curLabel.classList.add('active', 'selected');


    //curLabel.prevAll().addClass('selected');
    prevAll(curLabel).forEach((e) => e.classList.add('selected'));

    // Change background gradient
    for (let i = 0; i < prefs.length; i++) {
        style += '.range {background: linear-gradient(to right, #0396a6 0%, #0396a6 ' + val + '%, #00000000 ' + val + '%, #00000000 100%)}';
        style += '.range input::-' + prefs[i] + '{background: linear-gradient(to right, #0396a6 0%, #0396a6 ' + val + '%, #b2b2b2 ' + val + '%, #b2b2b2 100%)}';
    }

    return style;
}

sliderRound.addEventListener('input', function () {
    sheet.textContent = getTrackStyle(this);
});



function changeRange(max) {
    let wasMax = false;
    if (sliderRound.value == sliderRound.max) {
        wasMax = true;
    }
    html = `
        <li class="active selected">3 rounds</li>`;
        let nbLabel = 1;
    for (let i = 0; i < (max - 4) / 2; i++) {
        html += `
            <li class="">${i * 2 + 5} rounds</li>`;
            nbLabel++;
    }

    document.getElementById('round-labels').innerHTML = html;
    sliderRound.max = Math.floor((max-1) / 2) * 2+1;
    sliderRound.step = 2;
    sliderRound.min = 3;

    if (wasMax) {
        sliderRound.value = sliderRound.max;
    }

    let inputWidth = sliderRound.getBoundingClientRect().width;

    let labels = document.querySelectorAll('.range-labels li');
    let lus = document.querySelectorAll('.range-labels');

    let labelWidth = 100;
    if (nbLabel - 1 > 0) {
        labelWidth = inputWidth / (nbLabel - 1);
    }
    for (let label of labels) {
        label.style.width = labelWidth + "px";
    }
    for (let lu of lus) {
        lu.style.marginLeft = (-labelWidth / 2) + "px";
        lu.style.marginRight = (-labelWidth / 2) + "px";
    }

    // Change input value on label click
    let generalIndex = 1;
    document.querySelectorAll('.range-labels li').forEach(e =>  {
        generalIndex += 2;
        let index = generalIndex;
        e.addEventListener('click', function () {
            sliderRound.value = index;
            var event = new Event('input');
            sliderRound.dispatchEvent(event);
        });
    });
    sheet.textContent = getTrackStyle(sliderRound);
    var event = new Event('input');
    sliderRound.dispatchEvent(event);
}