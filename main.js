const tabs = document.querySelectorAll(".tabs-container .tab");
const contents = document.querySelectorAll(".tabs-container .content");
const removeActiveClass = () => {
  tabs.forEach((t) => {
    t.classList.remove("active");
    console.log('Removing Active Class')
  });

  contents.forEach((c) => {
    c.classList.remove("active");
  });
};

tabs.forEach((t, i) => {
  t.addEventListener("click", () => {
    removeActiveClass();
    contents[i].classList.add("active");
    t.classList.add("active");
    map.invalidateSize();
    console.log('Reloading Map')
  });
});

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
console.log(urlParams)
const tab = urlParams.get('t')
const hidden = urlParams.get('h')
if (hidden === 'y') {
    hideTabs()
}

if (tab === 'st') {
    removeActiveClass()
    tabs[0].classList.add('active');
    contents[0].classList.add('active');
}
if (tab === 'hm') {
    removeActiveClass()
    tabs[1].classList.add('active');
    contents[1].classList.add('active');
}

if (tab === 'tl') {
    removeActiveClass()
    tabs[2].classList.add('active');
    contents[2].classList.add('active');
}
if (tab === 'sp') {
    removeActiveClass()
    tabs[3].classList.add('active');
    contents[3].classList.add('active');
}


function hideTabs() {
    console.log('Hiding Tabs')
    document.getElementById('tabs').style.display = 'none'
    document.getElementById('minButton').setAttribute( "onClick", "javascript: showTabs();" );
    document.getElementById('minButton').innerHTML = '🗖'
    document.getElementById('map').style.width = '94vw';
    map.invalidateSize();
}
    
function showTabs() {
    console.log('Showing Tabs')
    document.getElementById('tabs').style.display = 'block'
    document.getElementById('minButton').setAttribute( "onClick", "javascript: hideTabs();" );
    document.getElementById('minButton').innerHTML = '✖'
    document.getElementById('map').style.width = '78vw';
    map.invalidateSize();
}
