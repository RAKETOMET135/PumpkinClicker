//definition
var play = document.getElementById("Play")
var clickPumpkin = document.getElementById("ClickImage")
var boostDisplay = document.getElementById("BoostAmount")
var endGame = document.getElementById("EndGameButton")
var saveBtn = document.getElementById("Save")
var resetDataBtn = document.getElementById("ResetData")

var pumpkinText = document.getElementById("CurrencyAmount")
var pumpkins = 0
var abbrevitationMaxDigits = 50

var upgrades = document.getElementById("Upgrades")

let upgradePrice = []
const upgradeBoost = []
let upgradePurchase = []
const upgradePriceIncrease = []
var upgradeCount = 0
var upgradeValue = 1

var dataLoaded = false


//startup
UpdateCurrency()
var game = document.getElementById("Game")
var endScreen = document.getElementById("EndScreen")
game.setAttribute("style", "visibility: hidden")
endScreen.setAttribute("style", "visibility: hidden")

//json file open + creating upgrades
let http = new XMLHttpRequest();
http.open('get', 'upgrades.json', true)
http.send()
http.onload = function(){
    if (this.readyState == 4 && this.status == 200){
        data = JSON.parse(this.responseText)
        upg = data

        var t = 0

        for (var upgrade of data.upgrades){
            var u = document.createElement("div")
            upgrades.appendChild(u)
            u.style.backgroundColor = '#e48a02'
            u.style.width = 500 + 'px' 
            u.style.height = 150 + 'px'

            var name = document.createElement("h2")
            u.appendChild(name)
            name.innerText = upgrade.name
            name.style.fontFamily = 'Roboto'

            var purchase = document.createElement("button")
            u.appendChild(purchase)
            purchase.style.width = 250 + 'px'
            purchase.style.height = 25 + 'px'
            purchase.innerText = "Purchase upgrade for " + AbbrNumber(upgrade.price) + " pumpkins"
            purchase.style.fontSize = 10 + 'px'
            purchase.style.position = 'Relative'
            purchase.style.left = 250
            purchase.style.top = 75
            purchase.style.borderRadius = 5 + 'px'
            purchase.style.backgroundColor = '#ff0000'
            purchase.id = "Purchase:" + t
            purchase.type = "button"
            purchase.className = "UpgradeButton"

            var desc = document.createElement("p")
            u.appendChild(desc)
            desc.innerText = upgrade.name + " gives x" + AbbrNumber(upgrade.upgrade) + " pumpkins per click"
            desc.style.fontFamily = 'Roboto'
            desc.style.fontSize = 25 + 'px'
            desc.style.position = 'Relative'
            desc.style.top = -50
            u.id = "Upgrade:" + t

            if (!dataLoaded){
                upgradePrice.push(upgrade.price)
                upgradePurchase.push(0)
            }
            upgradeBoost.push(upgrade.upgrade)
            upgradePriceIncrease.push(upgrade.price_increase)
            t++
            upgradeCount++
        }

        let uButtons = document.querySelectorAll(".UpgradeButton")
        for (let i = 0; i < uButtons.length; i++){
            uButtons[i].addEventListener("click", function(){
                var thisId = this.id.substring(9, this.id.length)
                thisId = thisId.toString()
                var price = upgradePrice[thisId]
                if (pumpkins >= price){
                    pumpkins -= price
                    upgradeValue += upgradeBoost[thisId]
                    upgradePurchase[thisId] = upgradePurchase[thisId] +1
                    upgradePrice[thisId] = Math.round(upgradePrice[thisId] * (upgradePurchase[thisId] * upgradePriceIncrease[thisId]))
                    this.innerText = "Purchase upgrade for " + AbbrNumber(upgradePrice[thisId]) + " pumpkins"
                }
                else{
                    alert("You need " + AbbrNumber(price-pumpkins) + " more pumpkins to buy this upgrade!")
                }
                UpdateCurrency()
            })
        }
    }
}


//functions
function SaveData(){
    localStorage.setItem("Pumpkins", pumpkins)
    localStorage.setItem("UpgradeValue", upgradeValue)
    localStorage.setItem("UpgradePurchase", JSON.stringify(upgradePurchase))
    localStorage.setItem("UpgradePrice", JSON.stringify(upgradePrice))
}

function LoadData(){
    if (localStorage.getItem("Pumpkins") != null){
        var testPumpkins = parseInt(localStorage.getItem("Pumpkins"))
        if (testPumpkins != null){
            pumpkins = testPumpkins
        }
        var testUpgradeValue = parseInt(localStorage.getItem("UpgradeValue"))
        if (testUpgradeValue != null){
            upgradeValue = testUpgradeValue
        }
        //upgradePurchase = JSON.parse(localStorage.getItem("UpgradePurchase"))
        let a = JSON.parse(localStorage.getItem("UpgradePurchase"))
        if (a != null){
            upgradePurchase = a
        }
        let b = JSON.parse(localStorage.getItem("UpgradePrice"))
        if (b != null){
            upgradePrice = b
        }
        dataLoaded = true

        UpdateCurrency()
    }
}

function ResetData(){
    localStorage.clear()
}

function UpdatePrice(){
    let uButtons = document.querySelectorAll(".UpgradeButton")
    for (let i = 0; i < uButtons.length; i++){
        var thisId = uButtons[i].id.substring(9, uButtons[i].id.length)
        thisId = thisId.toString()
        uButtons[i].innerText = "Purchase upgrade for " + AbbrNumber(upgradePrice[thisId]) + " pumpkins"
    }
}

function HoverEnter(btn, hColor){
    btn.setAttribute("style", hColor)
}
function HoverExit(btn, hColor){
    btn.setAttribute("style", hColor)
}

function EndGame(){
    if (pumpkins >= 75000000000){
        endScreen.setAttribute("style", "visibility: visible")
        game.setAttribute("style", "visibility: hidden")
    }
    else{
        alert("You need " + AbbrNumber(75000000000 - pumpkins) + " more pumpkins to buy The Pumpkin Lord!")
    }
}

function Play(){
    var mainMenu = document.getElementById("Menu")
    mainMenu.setAttribute("style", "visibility: hidden")
    game.setAttribute("style", "visibility: visible")
    LoadData()
    UpdatePrice()
}

function PumpkinHoverEnter(){
    clickPumpkin.setAttribute("style", "width: 550px")
}
function PumpkinHoverExit(){
    clickPumpkin.setAttribute("style", "width: 500px")
}
function PumpkinClick(){
    pumpkins += 1 * upgradeValue
    
    UpdateCurrency()
}

function AbbrNumber(number){
    var pumpkin = BigInt(number)
    var p = pumpkin.toString()
    var finalNumber = ""
    var finalString = ""

    const availableDigits = []
    for (var i = 0; i < abbrevitationMaxDigits; i++){
        var newAvailableDigit = 3 * (i+1)
        availableDigits.push(newAvailableDigit)
    }
    var digits = p.length 
    var zeroesToAdd
    for (var digit of availableDigits){
        if (digit == digits){
            zeroesToAdd = 0
        }
        if (digit -1 == digits){
            zeroesToAdd = 1
        }
        if (digit -2 == digits){
            zeroesToAdd = 2
        }
    }
    for (var i = 0; i < zeroesToAdd; i ++){
        finalNumber = finalNumber + "0"
    }
    finalNumber += p
    var t = 3
    for (var i = 0; i < finalNumber.length; i++){
        var n = finalNumber.substring(i, i+1)
        if (t == 0){
            t = 3
            finalString += "," + n
        }
        else{
            finalString += n
        }
        t -= 1
    }
    finalString = finalString.substring(zeroesToAdd, finalString.length)
    return finalString
}

function UpdatePriceColors(){
    for (var i = 0; i < upgradeCount; i++){
        var u = document.getElementById("Upgrade:" + i)
        var buy = document.getElementById("Purchase:" + i)
        var price = upgradePrice[i]
        if (pumpkins < price){
            buy.style.backgroundColor = "#ff0000"
        }
        else{
           buy.style.backgroundColor = "#00ff00"
        }
    }
}

function UpdateCurrency(){
    pumpkinText.innerText = AbbrNumber(pumpkins)
    boostDisplay.innerText = "Your current pumpkin boost is x" + AbbrNumber(upgradeValue)
    UpdatePriceColors()
}


//events
document.body.onload = function(){
   // LoadData()
}
play.onmouseenter = function(){
    HoverEnter(play, "background-color: #fca015")
}
play.onmouseleave = function(){
    HoverExit(play, "background-color: #e48a02")
}
play.onclick = function(){
    Play()
}
endGame.onmouseenter = function(){
    HoverEnter(endGame, "background-color: #fca015")
}
endGame.onmouseleave = function(){
    HoverExit(endGame, "background-color: #e48a02")
}
endGame.onclick = function(){
    EndGame()
}
saveBtn.onmouseenter = function(){
    HoverEnter(saveBtn, "background-color: #fca015")
}
saveBtn.onmouseleave = function(){
    HoverExit(saveBtn, "background-color: #e48a02")
}
saveBtn.onclick = function(){
    SaveData()
}
resetDataBtn.onmouseenter = function(){
    HoverEnter(resetDataBtn, "background-color: #fca015")
}
resetDataBtn.onmouseleave = function(){
    HoverExit(resetDataBtn, "background-color: #e48a02")
}
resetDataBtn.onclick = function(){
    ResetData()
}
clickPumpkin.onmouseenter = function(){
    PumpkinHoverEnter()
}
clickPumpkin.onmouseleave = function(){
    PumpkinHoverExit()
}
clickPumpkin.onclick = function(){
    PumpkinClick()
}

