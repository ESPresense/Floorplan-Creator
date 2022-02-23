// get references to the canvas and context
var canvas = document.getElementById("canvas");
var overlay = document.getElementById("overlay");
var ctx = canvas.getContext("2d");
var ctxo = overlay.getContext("2d");

// get stock container to pick element to clone and inject
var selfStorage = document.getElementById("stock");

// style the context
ctx.strokeStyle = "blue";
ctx.lineWidth = 3;
ctxo.strokeStyle = "blue";
ctxo.lineWidth = 3;

var exportedValue = "";

// calculate where the canvas is on the window
// (used to help calculate mouseX/mouseY)
var $canvas = document.querySelector("#canvas");
var offsetX = $canvas.offsetLeft;
var offsetY = $canvas.offsetTop;
var scrollX = $canvas.scrollLeft;
var scrollY = $canvas.scrollTop;

// this flage is true when the user is dragging the mouse
var isDown = false;

// these vars will hold the starting mouse position
var startX;
var startY;

var prevStartX = 0;
var prevStartY = 0;

var prevWidth = 0;
var prevHeight = 0;

canvas.width = document.getElementById("canvasWrapper").getBoundingClientRect().width;
canvas.height = document.getElementById("canvasWrapper").getBoundingClientRect().height;

overlay.width = document.getElementById("canvasWrapper").getBoundingClientRect().width;
overlay.height = document.getElementById("canvasWrapper").getBoundingClientRect().height;

// resize canvas on window resize
window.addEventListener("resize", function(e) {
    canvas.width = document.getElementById("canvasWrapper").getBoundingClientRect().width;
    canvas.height = document.getElementById("canvasWrapper").getBoundingClientRect().height;

    overlay.width = document.getElementById("canvasWrapper").getBoundingClientRect().width;
    overlay.height = document.getElementById("canvasWrapper").getBoundingClientRect().height;
});

render();

// renders the canvas overlay (where rooms are drawn after you mouseup) and right list buttons
// you can choose not to render buttons and can pass an id to highlish the room on the canvas
function render(hightlightId = null, renderButtons = true) {
    var storage = window.localStorage.getItem("rooms");
    if (storage) {
        var jsonStorage = JSON.parse(storage);
        if (jsonStorage) {
            ctxo.clearRect(0, 0, overlay.width, overlay.height);
            // parse array and draw each rooms
            jsonStorage.rooms.forEach((room) => {
                // hightlight room or not
                if (hightlightId != null && hightlightId == room.id) {
                    ctx.fillStyle = '#000000';
                    ctxo.fillRect(room.zone.x, room.zone.y, room.zone.width, room.zone.height);
                } else {
                    ctxo.strokeRect(room.zone.x, room.zone.y, room.zone.width, room.zone.height);
                }
                // draw mesures
                ctxo.font = "15px Helvetica";
                ctxo.textAlign = "center";
                ctxo.textBaseline = "middle";
                if (hightlightId != null && hightlightId == room.id) {
                    ctxo.fillStyle = '#ffffff';
                } else {
                    ctxo.fillStyle = '#000000';
                }
                ctxo.fillText(room.name, room.text.width.x, room.text.width.y - 20);
                ctxo.fillText(room.text.width.label, room.text.width.x, room.text.width.y);
                ctxo.fillText(room.text.height.label, room.text.height.x, room.text.height.y);
                // if buttons have to be re-rendered, reset them based on localstorage
                if (renderButtons) {
                    addRoomItemToList(room.id, room);
                }
            });
        }
    }
}

// reset deletes the rooms in the local storage
// clear canvas overlay
function reset() {
    if (confirm('Are you sure you want to reset your floor plan ?')) {
        // Reset!
        window.localStorage.removeItem("rooms");
        ctxo.clearRect(0, 0, overlay.width, overlay.height);
        document.querySelector(".rooms").innerHTML = "";
    }
}

// click on the > button on a right room list
// toggles animation based on class
function roomInfo(id) {
    var menuRoom = document.querySelector("#room" + id);
    var button = menuRoom.querySelector("button.more-info");
    if (menuRoom.classList.contains("open")) {
        menuRoom.classList.remove("open");
        button.classList.remove("open");
    } else {
        menuRoom.classList.add("open");
        button.classList.add("open");
    }
};

// delete a room from the localstorage and the menu
// render the canvas overlay
function deleteRoom(id) {
    var jsonStorage = getRooms();
    // if localstorage has only one element, reset it to empty, else, filter out the one that fits the id
    if (jsonStorage.rooms.length <= 1) {
        jsonStorage.rooms = [];
    } else {
        jsonStorage.rooms = jsonStorage.rooms.filter(x => x.id !== id);
    }
    setRooms(jsonStorage);
    document.getElementById("room" + id).remove();
    // clear canvas overlay then re-render canvas overlay
    ctxo.clearRect(0, 0, overlay.width, overlay.height);
    render(null, false);
}

// get cursor postion on canvas
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function handleMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();

    // save the starting x/y of the rectangle
    startX = parseInt(cursorPositionX - offsetX);
    startY = parseInt(cursorPositionY - offsetY);

    // set a flag indicating the drag has begun
    isDown = true;
}

// get rooms from local storage or return an empty array
// converts string data to object
function getRooms() {
    var dataString = window.localStorage.getItem('rooms');
    var data;
    if (!dataString) {
        data = {};
        data.rooms = [];
    } else {
        data = JSON.parse(dataString);
    }
    return data;
}

// update localstorage
// converts objects to string
function setRooms(data) {
    window.localStorage.setItem('rooms', JSON.stringify(data));
}

// export rooms data to an ESPresenseIPS yaml format
function exportToYaml() {
    var jsonStorage = getRooms();

    //get most left x value
    var mostLeftRoom = jsonStorage.rooms.reduce(function(prev, curr) {
        return prev.zone.x < curr.zone.x ? prev : curr;
    });

    // get highest y value
    var mostTopRoom = jsonStorage.rooms.reduce(function(prev, curr) {
        return prev.zone.y < curr.zone.y ? prev : curr;
    });

    // create an offseter
    var offsetY = mostLeftRoom.zone.y;
    var offsetX = mostTopRoom.zone.x;
    var data = {
        roomplans: []
    }
    jsonStorage.rooms.forEach((room) => {
        // first coordinate is room x minus offsetX, room y minus offsetY
        // second coordinat is (room x minus offsetX) plus room width, (room y minus offsetY) plus room height
        console.log(room.id, "x: " + (room.zone.x - offsetX) + ", y: " + (room.zone.y - offsetY));
        console.log(room.id, "x: " + ((room.zone.x - offsetX) + room.zone.width) + ", y: " + ((room.zone.y - offsetY) + room.zone.height));
        var objRoom = {
            name: room.name,
            y1: Math.abs(room.zone.x - offsetX),
            x1: Math.abs(room.zone.y - offsetY),
            y2: Math.abs((room.zone.x - offsetX) + room.zone.width),
            x2: Math.abs((room.zone.y - offsetY) + room.zone.height),
        }
        data.roomplans.push(objRoom);
    })

    exportedValue = objToYaml(data);
    var modal = document.querySelector(".modal");
    modal.querySelector(".text").innerHTML = exportedValue.replaceAll("\n", "<br />").replaceAll("\t", "&nbsp;&nbsp;&nbsp;&nbsp;");
    modal.classList.add("visible");
    console.log(exportedValue);
}

function closeModal() {
    var modal = document.querySelector(".modal");
    modal.classList.remove("visible");
}

function copyYaml() {
    navigator.clipboard.writeText(exportedValue);
}

function objToYaml(obj) {
    var string = "roomplans: \n"
    obj.roomplans.forEach(obj => {
        string += "\t- name: " + obj.name + "\n";
        string += "\t\ty1: " + obj.y1 + "\n";
        string += "\t\tx1: " + obj.x1 + "\n";
        string += "\t\ty2: " + obj.y2 + "\n";
        string += "\t\tx2: " + obj.x2 + "\n";
    });
    return string;
}

// when user lets go of mouse click //finises drawing the room//
function handleMouseUp(e) {
    e.preventDefault();
    e.stopPropagation();

    if (prevWidth && prevHeight) {
        var data = getRooms();
        // generate a room object and set its data
        var room = {
            name: "",
            id: data.rooms.length ? data.rooms[data.rooms.length - 1].id + 1 : 1,
            zone: {
                x: prevWidth < 0 ? prevStartX + prevWidth : prevStartX,
                y: prevHeight < 0 ? prevStartY + prevHeight : prevStartY,
                width: Math.abs(prevWidth),
                height: Math.abs(prevHeight),
            },
            text: {
                width: {
                    label: 'width : ' + Math.abs(prevWidth / 100) + 'm',
                    x: (prevStartX + (prevWidth / 2)),
                    y: (prevStartY + (prevHeight / 2)) - 10,
                },
                height: {
                    label: 'height : ' + Math.abs(prevHeight / 100) + 'm',
                    x: (prevStartX + (prevWidth / 2)),
                    y: (prevStartY + (prevHeight / 2)) + 10,
                }
            }
        };
        // add room to rooms and save to local storage
        data.rooms.push(room);
        setRooms(data);
        // add a new room in the list
        addRoomItemToList(room.id, room);

        // the drag is over, clear the dragging flag
        isDown = false;
        ctxo.clearRect(0, 0, overlay.width, overlay.height);

        render(null, false);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        prevWidth = 0;
        prevHeight = 0;
    }
}

function hightlightRoom(id) {
    var rooms = document.querySelector(".rooms");
    var theRoom = rooms.querySelector("#room" + id);
    theRoom.style.backgroundColor = "black";
    theRoom.style.color = "white";
    ctxo.clearRect(0, 0, overlay.width, overlay.height);
    render(id, false);
}

function unhightlightRoom(id) {
    var rooms = document.querySelector(".rooms");
    var theRoom = rooms.querySelector("#room" + id);
    theRoom.style.backgroundColor = "transparent";
    theRoom.style.color = "black";
    ctxo.clearRect(0, 0, overlay.width, overlay.height);
    render(null, false);
}

function setRoomName(id, name) {
    var jsonStorage = getRooms();
    var room = jsonStorage.rooms.find(x => x.id === id);
    room.name = name;
    setRooms(jsonStorage);
    document.querySelector("#room" + id).querySelector(".label").innerHTML = name;
    render(null, false);
}

function addRoomItemToList(id, room) {
    var storageRoom = selfStorage.querySelector(".room").cloneNode(true);
    storageRoom.id = "room" + id;
    storageRoom.onmouseover = function() {
        hightlightRoom(id);
    }
    storageRoom.onmouseout = function() {
        unhightlightRoom(id);
    }
    var button = storageRoom.querySelector("button#delete");
    button.onclick = function() {
        deleteRoom(id);
    }
    var input = storageRoom.querySelector("input");
    input.value = room.name ? room.name : "";
    input.addEventListener("keyup", (event) => {
        setRoomName(id, event.target.value);
    });
    storageRoom.querySelector(".label").innerHTML = room.name ? room.name : "[" + id + "] Room";
    var mesures = storageRoom.querySelector(".mesures");
    mesures.querySelector(".width").innerHTML = room.text.width.label;
    mesures.querySelector(".height").innerHTML = room.text.height.label;
    var buttonMore = storageRoom.querySelector("button#more");
    buttonMore.onclick = function() {
        roomInfo(id);
    }
    document.querySelector(".rooms").append(storageRoom);
}

function handleMouseOut(e) {
    e.preventDefault();
    e.stopPropagation();

    // the drag is over, clear the dragging flag
    isDown = false;
}

const threshold = 50;
var cursorPositionX = 0;
var cursorPositionY = 0;

function addText(startX, startY, width, height, value, baseLine = "middle") {
    ctx.font = "15px Helvetica";
    ctx.textAlign = "center";
    ctx.textBaseline = baseLine;
    ctx.fillStyle = "#000000";
    ctx.fillText(value, (startX + (width / 2)), (startY + (height / 2)) - 10);
}

function handleMouseMove(e) {
    e.preventDefault();
    e.stopPropagation();
    //console.log(pos);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var pos = getMousePos(canvas, e);
    ctx.beginPath();
    cursorPositionX = pos.x;
    cursorPositionY = pos.y;
    var data = getRooms();
    data.rooms.forEach((room) => {
        if (
            (room.zone.x <= pos.x + threshold && room.zone.x >= pos.x - threshold) &&
            (pos.y >= room.zone.y && pos.y <= room.zone.y + room.zone.height)
        ) {
            if (room.zone.x <= pos.x + threshold && room.zone.x >= pos.x) {
                ctx.beginPath();
                ctx.moveTo(room.zone.x - 15, room.zone.y);
                ctx.lineTo(room.zone.x - 15, pos.y);
                ctx.stroke();
                addText(room.zone.x - 50, room.zone.y, 1, (pos.y - room.zone.y), ((pos.y - room.zone.y) / 100) + "m", "right");

                ctx.beginPath();
                ctx.moveTo(room.zone.x - 15, room.zone.y + room.zone.height);
                ctx.lineTo(room.zone.x - 15, pos.y);
                ctx.stroke();
                addText(room.zone.x - 50, pos.y, 1, ((room.zone.y + room.zone.height) - pos.y), (((room.zone.y + room.zone.height) - pos.y) / 100) + "m", "right");
            }
            cursorPositionX = room.zone.x;
        } else if (
            (room.zone.x + room.zone.width <= pos.x + threshold && room.zone.x + room.zone.width >= pos.x - threshold) &&
            (pos.y >= room.zone.y && pos.y <= room.zone.y + room.zone.height)
        ) {
            if (room.zone.x + room.zone.width <= pos.x && room.zone.x + room.zone.width >= pos.x - threshold) {
                ctx.beginPath();
                ctx.moveTo((room.zone.x + room.zone.width) + 15, room.zone.y);
                ctx.lineTo((room.zone.x + room.zone.width) + 15, pos.y);
                ctx.stroke();
                addText((room.zone.x + room.zone.width) + 50, room.zone.y, 1, (pos.y - room.zone.y), ((pos.y - room.zone.y) / 100) + "m", "left");

                ctx.beginPath();
                ctx.moveTo((room.zone.x + room.zone.width) + 15, room.zone.y + room.zone.height);
                ctx.lineTo((room.zone.x + room.zone.width) + 15, pos.y);
                ctx.stroke();
                addText((room.zone.x + room.zone.width) + 50, pos.y, 1, ((room.zone.y + room.zone.height) - pos.y), (((room.zone.y + room.zone.height) - pos.y) / 100) + "m", "left");
            }
            cursorPositionX = room.zone.x + room.zone.width;
        } else if (
            (room.zone.y <= pos.y + threshold && room.zone.y >= pos.y - threshold) &&
            (pos.x >= room.zone.x && pos.x <= room.zone.x + room.zone.width)
        ) {
            if (room.zone.y <= pos.y + threshold && room.zone.y >= pos.y) {
                ctx.beginPath();
                ctx.moveTo(room.zone.x, room.zone.y - 15);
                ctx.lineTo(pos.x, room.zone.y - 15);
                ctx.stroke();
                addText(room.zone.x, room.zone.y - 15, (pos.x - room.zone.x), 1, ((pos.x - room.zone.x) / 100) + "m", "right");

                ctx.beginPath();
                ctx.moveTo(room.zone.x + room.zone.width, room.zone.y - 15);
                ctx.lineTo(pos.x, room.zone.y - 15);
                ctx.stroke();
                addText(pos.x, room.zone.y - 15, ((room.zone.x + room.zone.width) - pos.x), 1, ((room.zone.x + room.zone.width) - pos.x) + "m", "right");
            }
            cursorPositionY = room.zone.y;
        } else if (
            (room.zone.y + room.zone.height <= pos.y + threshold && room.zone.y + room.zone.height >= pos.y - threshold) &&
            (pos.x >= room.zone.x && pos.x <= room.zone.x + room.zone.width)
        ) {
            if (room.zone.y + room.zone.height <= pos.y && room.zone.y + room.zone.height >= pos.y - threshold) {
                ctx.beginPath();
                ctx.moveTo(room.zone.x, room.zone.y + room.zone.height + 15);
                ctx.lineTo(pos.x, room.zone.y + room.zone.height + 15);
                ctx.stroke();
                addText(room.zone.x, room.zone.y + room.zone.height + 50, (pos.x - room.zone.x), 1, ((pos.x - room.zone.x) / 100) + "m", "right");

                ctx.beginPath();
                ctx.moveTo(room.zone.x + room.zone.width, room.zone.y + room.zone.height + 15);
                ctx.lineTo(pos.x, room.zone.y + room.zone.height + 15);
                ctx.stroke();
                addText(pos.x, room.zone.y + room.zone.height + 50, ((room.zone.x + room.zone.width) - pos.x), 1, ((room.zone.x + room.zone.width) - pos.x) + "m", "right");
            }
            cursorPositionY = room.zone.y + room.zone.height;
        }
    });
    ctx.arc(cursorPositionX, cursorPositionY, 2, 0, 2 * Math.PI);
    ctx.stroke();

    // if we're not dragging, just return
    if (!isDown) {
        render(null, false);
        return;
    }

    // get the current mouse position
    mouseX = cursorPositionX; //parseInt(e.clientX - offsetX);
    mouseY = cursorPositionY; //parseInt(e.clientY - offsetY);

    // Put your mousemove stuff here



    // calculate the rectangle width/height based
    // on starting vs current mouse position
    var width = mouseX - startX;
    var height = mouseY - startY;

    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw a new rect from the start position 
    // to the current mouse position
    ctx.strokeRect(startX, startY, width, height);
    ctx.font = "15px Helvetica";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000000";
    ctx.fillText('width : ' + Math.abs(width / 100) + 'm', (startX + (width / 2)), (startY + (height / 2)) - 10);
    ctx.fillText('height : ' + Math.abs(height / 100) + 'm', (startX + (width / 2)), (startY + (height / 2)) + 10);

    prevStartX = startX;
    prevStartY = startY;

    prevWidth = width;
    prevHeight = height;
}

// listen for mouse events
document.querySelector("#canvas").addEventListener("mousedown", function(e) {
    handleMouseDown(e);
});
document.querySelector("#canvas").addEventListener("mousemove", function(e) {
    handleMouseMove(e);
});
document.querySelector("#canvas").addEventListener("mouseup", function(e) {
    handleMouseUp(e);
});
document.querySelector("#canvas").addEventListener("mouseout", function(e) {
    handleMouseOut(e);
});
