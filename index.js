import { TEAMNAMES } from './constants.js'

var curInterval
var curDate
var selectedTeam

const main = () => {
    fetchTeamList();
    const form = document.querySelector(".topology-visualizer-team-form");
    const previousStateSelector = document.querySelector(".topology-visualizer-previous-status");
    const nextStateSelector = document.querySelector(".topology-visualizer-next-status");
    form.addEventListener('submit', fetchTeamData);
    previousStateSelector.addEventListener('click', decrementInterval);
    window.addEventListener("keydown", changeTopology, false);
}

const changeTopology = (event) => {
    if(event.key === "ArrowLeft")
        decrementInterval();
    else if (event.key === "ArrowRight")
        incrementInterval();
}

const fetchTeamList = () => {
    const select = document.querySelector('.topology-visualizer-team-select')

    TEAMNAMES.forEach((team) => {
        const newOption = new Option(team, team);
        select.add(newOption, undefined);
    })
}

const fetchCurrentDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).padStart(2, '0');
    curDate = `${year}-${month}-${day}`;
}

const fetchCurrentInterval = () => {
    const date = new Date();
    const time = date.getHours();
    if (time === 0) curInterval = 1;
    else curInterval = Math.ceil(time / 4);
}

const addDayToDate = () => {
    var date = new Date(Date.parse(curDate));
    date.setDate(date.getDate() + 1);
    const day = date.getDate();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).padStart(2, '0');
    curDate = `${year}-${month}-${day}`;
}

const subtractDayFromDate = () => {
    var date = new Date(Date.parse(curDate));
    date.setDate(date.getDate() - 1);
    const day = date.getDate();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).padStart(2, '0');
    curDate = `${year}-${month}-${day}`;
}

const incrementInterval = () => {
    if (curInterval === 6){
        addDayToDate();
        curInterval = 1;
    }
    else curInterval += 1;
    displayTopologyGraph();
}

const decrementInterval = () => {
    if (curInterval === 1){
        subtractDayFromDate();
        curInterval = 6;
    }
    else curInterval -= 1;
    displayTopologyGraph();
}

const displayTopologyGraph = () => {
    const graphArea = document.querySelector(".topology-visualizer-team-graph");
    fetch(`./data/${selectedTeam}/${curDate.replaceAll('-', '')}-${curInterval}.html`)
    .then(res => res.text())
    .then(data => {
        graphArea.innerHTML = data;
    })
}

const fetchTeamData = (event) => {
    event.preventDefault();
    const teamSelector = document.querySelector(".topology-visualizer-team-select");
    const dateSelector = document.querySelector(".topology-visualizer-date");
    selectedTeam = teamSelector.value;
    const selectedDate = dateSelector.value;
    fetchCurrentDate();
    if(selectedDate)
        curDate = selectedDate;
    fetchCurrentInterval();
    displayTopologyGraph();
}

window.onload = main