
const cl = console.log;


let addItemfrm = document.getElementById('addItemfrm');
const enterItemCtrl = document.getElementById('enterItem');
const itemListContainer = document.getElementById('itemListContainer');
const updateItemBtn = document.getElementById('updateItemBtn');
const addItemBtn = document.getElementById('addItemBtn');
const clearBtn = document.getElementById('clearBtn');
const filterItemCtrl = document.getElementById('filterItem');
const itemCount = document.getElementById('itemCount');


let itemsArr = [];
cl(itemsArr.length)



if (JSON.parse(localStorage.getItem('itemsArr'))) {
    itemsArr = JSON.parse(localStorage.getItem('itemsArr'))
    templating(itemsArr)
} else {
    templating(itemsArr)
}

function itemDispToggle() {
    if (itemsArr.length !== 0) {
        filterItemCtrl.classList.remove('d-none')
        clearBtn.classList.remove('d-none')
        itemCount.innerHTML = `Total Number of items in Cart : ${itemsArr.length}`
        itemCount.style.color = "green"


    }else{
        filterItemCtrl.classList.add('d-none')
        clearBtn.classList.add('d-none')
        itemCount.style.color = "red"
        itemCount.innerHTML = "Add items In Cart"

    }
}
itemDispToggle()





// #### UUID GENERATOR FUNCTION #####

function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if (d > 0) {//Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

const onCloseItem = (item) => {
    cl(item)
    let deletId = item.closest('div').getAttribute('data-id')
    cl(deletId)
    let conf = confirm(`Do yo really want to clear this item`)
    if (conf) {
        itemsArr = itemsArr.filter(item => {
            return item.itemId != deletId
        })


        filterItemCtrl.value = "";

        itemDispToggle()
        Swal.fire({
            icon: 'error',
            title: 'Item deleted Succesfully',
            timer: 2000,
        })
    }
    localStorage.setItem("itemsArr", JSON.stringify(itemsArr))
    templating(itemsArr)

}


//  ########  TEMPLATING FUNCTIONALITY  ###########
function templating(itemsArr) {
    // itemDispToggle()

    let result = "";

    itemsArr.forEach(item => {
        result += `
                    <div class="col-6 mb-2" id = "${item.itemId}">
                            <div class="p-2 item d-flex justify-content-between item-border  font-weight-bold " data-id = "${item.itemId}">
                                <p class="m-0 text-capitalize " onclick = editItem(this)>${item.itemName}</p>
                                <button type="button" class="close text-danger" aria-label="Close" onclick = "onCloseItem(this)">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                    </div>
                `
    })

    itemListContainer.innerHTML = result;
}



//  ########  EDIT FUNCTIONALITY  ###########
const editItem = (eve) => {
    let editItemId = eve.closest('div').getAttribute("data-id");

    let updateObject;
    let conf = confirm("Do you want to Edit this Item")
    if (conf) {
        itemsArr.forEach(item => {
            if (item.itemId === editItemId) {
                updateObject = item;
                enterItemCtrl.value = item.itemName;
            }
        })
        updateItemBtn.classList.remove("d-none")
        addItemBtn.classList.add("d-none")
    }
    localStorage.setItem("updateObject", JSON.stringify(updateObject))
}

//  ########  ADD FUNCTIONALITY  ###########

let OnaddItemfrm = (eve) => {
    eve.preventDefault();
    let enteredItemVal = enterItemCtrl.value;

    let itemObj = {
        itemName: enteredItemVal,
        itemId: generateUUID()
    }
    itemsArr.unshift(itemObj)
    localStorage.setItem('itemsArr', JSON.stringify(itemsArr))
    itemDispToggle()
    templating(itemsArr);

    Swal.fire({
        icon: 'success',
        title: 'Item Added Succesfully',
    })
    enterItemCtrl.value = "";

}


const onUpdateBtn = () => {
    // cl("update btn clicked")
    let updateObject = JSON.parse(localStorage.getItem("updateObject"))

    updateObject.itemName = enterItemCtrl.value;

    for (let i = 0; i < itemsArr.length; i++) {
        if (itemsArr[i].itemId === updateObject.itemId) {
            itemsArr[i].itemName = updateObject.itemName;
            break;
        }
    }
    localStorage.setItem("itemsArr", JSON.stringify(itemsArr))
    // let targetItem = document.getElementById(updateObject.itemId)
    // targetItem.firstElementChild.innerHTML = updateObject.itemName;
    templating(itemsArr)
    updateItemBtn.classList.add("d-none")
    addItemBtn.classList.remove("d-none")
    enterItemCtrl.value = "";
    Swal.fire({
        icon: 'success',
        title: 'Item Updated Succesfully',
        timer: 2000,

    })
}

const onClearBtn = () => {
    cl("clear button clicked")
    let conf = confirm("Do you want to clear items")
    if (conf) {
        itemsArr = []
        itemDispToggle()

        Swal.fire({
            icon: 'error',
            title: 'All Items deleted Succesfully',
            timer: 2000,

        })
    }

    itemsArr = itemsArr.splice(0);
    localStorage.setItem("itemsArr", JSON.stringify(itemsArr))


    // localStorage.removeItem("itemsArr")
    // clearBtn.classList.add("d-none")
    templating(itemsArr)
}

const onKeyUpFilterItem = (keys) => {

    let filtKeys = filterItemCtrl.value.toLowerCase()
    cl(filtKeys)

    let filtArr = itemsArr.filter((item) => {
        return item.itemName.toLowerCase().includes(filtKeys)
    })
    cl(filtArr)
    templating(filtArr)
}


filterItemCtrl.addEventListener("keyup", onKeyUpFilterItem)
updateItemBtn.addEventListener("click", onUpdateBtn)
addItemfrm.addEventListener("submit", OnaddItemfrm);
clearBtn.addEventListener("click", onClearBtn)







