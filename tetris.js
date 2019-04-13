const STEP_INTERVAL_MS = 500 // ms

const initialState = {
  activeBlock: null,
  isPaused: true,
  rows: [
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
  ]
}

const possibleBlocks = [
  // Square
  {
    start: [0, 4],
    color: "red",
    shape: [[0, 0], [0, 1], [1, 0], [1, 1]],
    rotations: [[[0, 0], [0, 1], [1, 0], [1, 1]]]
  },

  // L
  {
    start: [0, 4],
    color: "yellow",
    shape: [[0, 0], [1, 0], [2, 0], [2, 1]],
    rotations: [
      [[0, 0], [1, 0], [2, 0], [2, 1]],
      [[0, 0], [0, 1], [0, 2], [1, 0]],
      [[0, 0], [0, 1], [1, 1], [2, 1]],
      [[0, 2], [1, 0], [1, 1], [1, 2]]
    ]
  },

  // Backwards L
  {
    start: [0, 4],
    color: "green",
    shape: [[0, 1], [1, 1], [2, 0], [2, 1]],
    rotations: [
      [[0, 1], [1, 1], [2, 0], [2, 1]],
      [[0, 0], [1, 0], [1, 1], [1, 2]],
      [[0, 0], [0, 1], [1, 0], [2, 0]],
      [[0, 0], [0, 1], [0, 2], [1, 2]]
    ]
  },

  // S
  {
    start: [0, 4],
    color: "aqua",
    shape: [[0, 0], [1, 0], [1, 1], [2, 1]],
    rotations: [
      [[0, 0], [1, 0], [1, 1], [2, 1]],
      [[0, 1], [0, 2], [1, 0], [1, 1]]
    ]
  },

  // Z
  {
    start: [0, 4],
    color: "blue",
    shape: [[0, 1], [1, 0], [1, 1], [2, 0]],
    rotations: [
      [[0, 1], [1, 0], [1, 1], [2, 0]],
      [[0, 0], [0, 1], [1, 1], [1, 2]]
    ]
  },

  // T
  {
    start: [0, 4],
    color: "purple",
    shape: [[0, 1], [1, 0], [1, 1], [2, 1]],
    rotations: [
      [[0, 1], [1, 0], [1, 1], [2, 1]],
      [[0, 1], [1, 0], [1, 1], [1, 2]],
      [[0, 0], [1, 0], [1, 1], [2, 0]],
      [[0, 0], [0, 1], [0, 2], [1, 1]]
    ]
  },

  // |
  {
    start: [0, 4],
    color: "grey",
    shape: [[0, 0], [1, 0], [2, 0], [3, 0]],
    rotations: [
      [[0, 0], [1, 0], [2, 0], [3, 0]],
      [[0, 0], [0, 1], [0, 2], [0, 3]]
    ]
  }
]

const rootNode = document.getElementById("root")

const render = () => rootNode.innerHTML = `
  ${state.isPaused ? renderButton() : ''}
  ${renderGrid(getMergedRows())}
`

const renderButton = () =>
  `<div class="play-button-wrapper">
    <button class="play-button" onclick="unpause()" type="button">▶️</button>
  </div>`

const renderGrid = rows =>
  `<div class="grid ${state.isPaused ? 'blurred' : ''}">
    ${rows.map(row => renderRow(row)).join("")}
  </div>`

const renderRow = row =>
  `<div class="row">
    ${row.map(cell => renderCell(cell)).join("")}
  </div>`

const renderCell = cell => `<div class="cell ${getCellColorClassName(cell)}"></div>`

const getCellColorClassName = cell => (cell.color ? `cell--${cell.color}` : "")

const pause = () => {
  state = { ...state, isPaused: true }
  render()
}

const unpause = () => {
  state = { ...state, isPaused: false }
  render()
}

const moveDown = () => {
  if (!state.activeBlock) {
    return
  }

  const blockCellPositions = getActiveBlockCellPositions()

  for (let cellPosition of blockCellPositions) {
    const [row, column] = cellPosition

    if (row === state.rows.length - 1) {
      mergeBlock()
      return
    }

    const cellBelow = state.rows[row + 1][column]

    if (cellBelow.color) {
      mergeBlock()
      return
    }
  }

  state.activeBlock.start[0] += 1
}

const step = () => {
  if (state.isPaused) {
    return
  }

  const fullRowsExist = getFullRowsExist()

  if (fullRowsExist) {
    clearFullRows()
  } else if (!state.activeBlock) {
    state.activeBlock = getNewBlock()
  } else {
    moveDown()
  }

  render()
}

const getNewBlock = () => getCopy(getRandomItem(possibleBlocks))

const getRandomItem = array => array[Math.floor(Math.random() * array.length)]

const getBlockCellPositions = block =>
  block.shape.map(([relativeRow, relativeColumn]) => [
    relativeRow + block.start[0],
    relativeColumn + block.start[1]
  ])

const getActiveBlockCellPositions = () =>
  getBlockCellPositions(state.activeBlock)

const getCopy = object => JSON.parse(JSON.stringify(object))

const getMergedRows = () => {
  const mergedRows = getCopy(state.rows)

  if (state.activeBlock) {
    const blockCellPositions = getActiveBlockCellPositions()

    for (let cellPosition of blockCellPositions) {
      const [row, column] = cellPosition
      mergedRows[row][column] = { color: state.activeBlock.color }
    }
  }

  return mergedRows
}

const getRowIsFull = row => row.every(cell => cell.color)

const getFullRowsExist = () => state.rows.some(getRowIsFull)

const mergeBlock = () => {
  state.rows = getMergedRows()
  state.activeBlock = null
}

const moveHorizontal = amount => {
  if (!state.activeBlock) {
    return
  }

  const blockCellPositions = getActiveBlockCellPositions()

  const movedBlockCellPositions = blockCellPositions.map(([row, column]) => [
    row,
    column + amount
  ])

  const blockWouldOverlap = movedBlockCellPositions.some(
    ([row, column]) =>
      column < 0 ||
      column >= state.rows[0].length ||
      state.rows[row][column].color
  )

  if (blockWouldOverlap) {
    return
  } else {
    state.activeBlock.start[1] += amount
  }

  render()
}

const moveLeft = () => moveHorizontal(-1)

const moveRight = () => moveHorizontal(1)

const rotate = () => {
  if (!state.activeBlock) {
    return
  }

  const newBlock = getCopy(state.activeBlock)

  for (let index = 0; index < state.activeBlock.rotations.length; index += 1) {
    const rotation = state.activeBlock.rotations[index]

    const rotationIsCurrent =
      JSON.stringify(state.activeBlock.shape) === JSON.stringify(rotation)

    if (rotationIsCurrent) {
      const newIndex = (index + 1) % state.activeBlock.rotations.length
      newBlock.shape = state.activeBlock.rotations[newIndex]
      const newBlockCellPositions = getBlockCellPositions(newBlock)

      const blockWouldOverlap = newBlockCellPositions.some(
        ([row, column]) =>
          column < 0 ||
          column >= state.rows[0].length ||
          row < 0 ||
          row >= state.rows.length ||
          state.rows[row][column].color
      )

      if (!blockWouldOverlap) {
        state.activeBlock = newBlock
        return
      }
    }
  }
}

const clearFullRows = () => {
  let newRows = getCopy(state.rows).filter(row => !getRowIsFull(row))
  newRows = getCopy(initialState.rows).concat(newRows)
  state.rows = newRows.slice(newRows.length - initialState.rows.length)
}

const handleKeyDown = event => {
  if (event.keyCode == "38") { // up
    rotate()
    render()
  } else if (event.keyCode == "40") { // down
    moveDown()
    render()
  } else if (event.keyCode == "37") { // left
    moveLeft()
  } else if (event.keyCode == "39") { // right
    moveRight()
  } else if (event.keyCode == '80') { // P
    state.isPaused ? unpause() : pause()
  }
}

let state = getCopy(initialState)
render()
step()
setInterval(step, STEP_INTERVAL_MS)
document.onkeydown = handleKeyDown
