const navContainer = document.querySelector(".nav-container")
navContainer.childNodes.forEach((item) => {
  item.addEventListener("click", (event) => {
    const itemIndex = Array.from(navContainer.children).indexOf(
      event.currentTarget
    )

    //! OPCIONAL!!
    //! const smoothTrasition = false
    //! translateSpaceship(itemIndex, smoothTrasition)

    translateSpaceship(itemIndex)
    activeItemStyle(navContainer, event.currentTarget)
  })
})

function activeItemStyle(navContainer, target) {
  const activeItem = navContainer.querySelector(".item-active")
  if (!!activeItem) activeItem.classList.remove("item-active")
  target.classList.add("item-active")
}

// Todo -> Atribui os valores que controlam a animação
setCSSPropertiesDefaltValues([
  ["--default-translate-duration", "250ms"],
  ["--animation-duration", "125ms"],
])

//! Desabilita a funcção enquanto o timeout estiver ativo para não interromper a animação
let clickDisabled = false
// Todo -> Usamos para saber quantos itens de distancia deveremos transitar
let lastIndexClicked = 0

function translateSpaceship(itemIndex, smoothTrasition = true) {
  if (clickDisabled) return
  clickDisabled = true

  const root = document.querySelector(":root")
  const rootVariables = getComputedStyle(root)
  const menuWrapper = document.querySelector(".menu-wrapper")
  const navContainer = menuWrapper.querySelector(".nav-container")
  const spaceshipBox = menuWrapper.querySelector(".spaceship-box")
  const numberOfItems = navContainer.childElementCount
  const clickedElementIndex = itemIndex

  menuWrapper.style.cursor = "not-allowed"

  //* Get CSS variable values
  const defaultLeftTranslateDuration = getCSSPropertyStringValue(
    rootVariables,
    "--default-translate-duration",
    "ms"
  )
  const animationDuration = getCSSPropertyStringValue(
    rootVariables,
    "--animation-duration",
    "ms"
  )
  //* Fim get CSS variable values

  //* Define CSS variable values
  // Todo -> Para manter uma velocidade constante pegamos o tempo que leva para transitar de
  // Todo -- um item para outro e multiplicamos pelo numero de itens teremos de transitar
  const leftTranslateTotalDuration = Math.abs(
    defaultLeftTranslateDuration *
      (smoothTrasition ? Math.abs(clickedElementIndex - lastIndexClicked) : 1)
  )

  // Todo -> Tempo que leva para a animação que acende a luz da nave se inicia
  const animationDelay = `${Math.abs(
    animationDuration - leftTranslateTotalDuration
  ).toString()}ms`

  // Todo -> Descobrimos a porcentagem que cada item ocupa
  // Todo -- e muntiplicamos por quandos itens devemos transitar para ter a posição final do item
  const translatePercentage = (100 / numberOfItems) * clickedElementIndex
  root.style.setProperty("--left-translate", `${translatePercentage}%`)
  //* Fim define CSS variable values

  //* Set CSS variable values
  root.style.setProperty(
    "--translate-duration",
    `${leftTranslateTotalDuration}ms`
  )
  // root.style.setProperty("--animation-duration", `${animationDuration}ms`)
  root.style.setProperty("--animation-delay", animationDelay)
  //* Fim set CSS variable values

  //* Handle light animation class
  if (spaceshipBox.classList.contains("animate"))
    spaceshipBox.classList.remove("animate")
  spaceshipBox.classList.add("animate")

  const time = leftTranslateTotalDuration

  //Todo -> Remove classe após o fim da transição e reactiva a interação
  setTimeout(() => {
    spaceshipBox.classList.remove("animate")
    clickDisabled = false
    menuWrapper.style.cursor = "pointer"
  }, time)
  //* Fim handle toggle light animation class

  lastIndexClicked = clickedElementIndex
}

function getCSSPropertyStringValue(rootVariables, variable, unit) {
  return parseInt(rootVariables.getPropertyValue(variable).replace(unit, ""))
}
function getCSSPropertyDeciamalNumberValue(rootVariables, variable) {
  return parseFloat(rootVariables.getPropertyValue(variable))
}

function setCSSPropertiesDefaltValues(varArray) {
  const root = document.querySelector(":root")
  varArray.forEach((variables) => {
    const variableName = variables[0]
    const variableValue = variables[1]
    root.style.setProperty(variableName, variableValue)
  })
}
