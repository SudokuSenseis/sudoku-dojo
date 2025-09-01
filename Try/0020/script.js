// Test if script is loading
console.log('Script loading test - if you see this, the script is working');

// Initialize error counter
let errorCount = 5; // Start with 5 errors

// Global state for highlight pencil marks setting
let highlightPencilMarksState = false;

// Function to update the highlight pencil marks setting in localStorage
function updateHighlightPencilMarksSetting(value) {
  try {
    highlightPencilMarksState = value;
    const savedSettings = localStorage.getItem('sudokuSettings');
    const settings = savedSettings ? JSON.parse(savedSettings) : {};
    settings.highlightPencilMarks = value;
    localStorage.setItem('sudokuSettings', JSON.stringify(settings));
    
    // Update the global settings object
    if (!window.sudokuSettings) window.sudokuSettings = {};
    window.sudokuSettings.highlightPencilMarks = value;
    
    // Toggle the highlight-pencil-marks class on the body
    if (value) {
      document.body.classList.add('highlight-pencil-marks');
    } else {
      document.body.classList.remove('highlight-pencil-marks');
      // Clear any existing pencil mark highlights
      document.querySelectorAll('.highlight-same-number').forEach(cell => {
        cell.classList.remove('highlight-same-number');
      });
    }
    
    // Update UI to reflect the change
    const highlightPencilMarksOnBtn = document.getElementById('highlightPencilMarksOn');
    const highlightPencilMarksOffBtn = document.getElementById('highlightPencilMarksOff');
    
    if (highlightPencilMarksOnBtn && highlightPencilMarksOffBtn) {
      if (value) {
        highlightPencilMarksOnBtn.classList.add('active');
        highlightPencilMarksOffBtn.classList.remove('active');
      } else {
        highlightPencilMarksOnBtn.classList.remove('active');
        highlightPencilMarksOffBtn.classList.add('active');
      }
    }
    
    console.log('Updated highlightPencilMarks setting to:', value);
  } catch (e) {
    console.error('Error updating highlightPencilMarks setting:', e);
  }
}

// Add event listeners for the highlight pencil marks toggle buttons
document.addEventListener('DOMContentLoaded', function() {
  const highlightPencilMarksOnBtn = document.getElementById('highlightPencilMarksOn');
  const highlightPencilMarksOffBtn = document.getElementById('highlightPencilMarksOff');
  
  if (highlightPencilMarksOnBtn && highlightPencilMarksOffBtn) {
    // Set initial state
    const isOn = getHighlightPencilMarksSetting();
    if (isOn) {
      highlightPencilMarksOnBtn.style.background = '#4CAF50';
      highlightPencilMarksOnBtn.style.color = 'white';
      highlightPencilMarksOffBtn.style.background = '#f1f1f1';
      highlightPencilMarksOffBtn.style.color = '#666';
    } else {
      highlightPencilMarksOnBtn.style.background = '#f1f1f1';
      highlightPencilMarksOnBtn.style.color = '#666';
      highlightPencilMarksOffBtn.style.background = '#f44336';
      highlightPencilMarksOffBtn.style.color = 'white';
    }
    
    // Add click handlers
    highlightPencilMarksOnBtn.addEventListener('click', function() {
      if (!getHighlightPencilMarksSetting()) {
        updateHighlightPencilMarksSetting(true);
      }
    });
    
    highlightPencilMarksOffBtn.addEventListener('click', function() {
      if (getHighlightPencilMarksSetting()) {
        updateHighlightPencilMarksSetting(false);
      }
    });
  }
});

// Function to get the current highlight pencil marks setting
function getHighlightPencilMarksSetting() {
  // Use global settings object if available, otherwise fall back to previous method
  return (window.sudokuSettings && window.sudokuSettings.highlightPencilMarks === true) || highlightPencilMarksState;
}

// Function to highlight a cell based on its type and settings
function highlightCell(cell, highlightPencilMarks = null) {
  if (!cell) return;
  
  // If highlightPencilMarks is not provided, get it from settings
  if (highlightPencilMarks === null) {
    highlightPencilMarks = getHighlightPencilMarksSetting();
  }

  // If it's a pencil mark and highlighting is off, do nothing
  if ((cell.classList.contains('subcell') || cell.classList.contains('center-number'))) {
    if (!highlightPencilMarks) {
      cell.classList.remove('selected');
      cell.classList.remove('highlight-same-number');
      return;
    }
  }

  // For all other cases (regular cells or pencil marks with highlighting on)
  cell.classList.add('selected');
}

// Initialize the highlightPencilMarksState from localStorage on page load
(function() {
  try {
    // Initialize global settings object
    if (!window.sudokuSettings) window.sudokuSettings = {};
    
    const savedSettings = localStorage.getItem('sudokuSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if ('highlightPencilMarks' in settings) {
        highlightPencilMarksState = settings.highlightPencilMarks === true;
        window.sudokuSettings.highlightPencilMarks = highlightPencilMarksState;
        // Update the body class based on the setting
        if (highlightPencilMarksState) {
          document.body.classList.add('highlight-pencil-marks');
        } else {
          document.body.classList.remove('highlight-pencil-marks');
        }
        console.log('Initialized highlightPencilMarksState from localStorage:', highlightPencilMarksState);
      }
    }
  } catch (e) {
    console.error('Error initializing highlightPencilMarksState:', e);
  }
})();

// Function to update the error counter display
function updateErrorCounterDisplay() {
  const ecButton = document.getElementById('ecBtn');
  if (ecButton) {
    // Always show the current error count
    ecButton.textContent = errorCount;
    
    // Update button appearance and tooltip based on error count
    if (errorCount <= 0) {
      ecButton.style.color = 'red';
      ecButton.style.fontWeight = 'bold';
      ecButton.title = 'No red stripe. Practice this puzzle again.';
      
      // Disable the half red stripe in the grading belt
      const halfStripe = document.querySelector('.stripe-bottom[style*="background: red"]');
      if (halfStripe) {
        halfStripe.style.display = 'none';
      }
    } else {
      ecButton.style.color = '';
      ecButton.style.fontWeight = '';
      ecButton.title = 'Error Counter (If the counter is 0 you will not promote)';
      
      // Re-enable the half red stripe if error count is not zero
      const halfStripe = document.querySelector('.stripe-bottom[style*="background: red"]');
      if (halfStripe) {
        halfStripe.style.display = 'block';
      }
    }
    
    // Also update the belt grading display if the error count reaches zero
    if (errorCount <= 0) {
      // Find and disable the half red stripe in the belt grading
      const halfStripes = document.querySelectorAll('.stripe-bottom');
      halfStripes.forEach(stripe => {
        if (stripe.style.background === 'red' || stripe.style.backgroundColor === 'red') {
          stripe.style.display = 'none';
        }
      });
    }
  }
  
  // Also update the belt grading display if the error count reaches zero
  if (errorCount <= 0) {
    // Find and disable the half red stripe in the belt grading
    const halfStripes = document.querySelectorAll('.stripe-bottom');
    halfStripes.forEach(stripe => {
      if (stripe.style.background === 'red' || stripe.style.backgroundColor === 'red') {
        stripe.style.display = 'none';
      }
    });
  }
}

// Select grid container
const grid = document.getElementById('sudoku-grid');
let selectedCell = null;
let currentSubcellPosition = 0; // 0 = none, 1-9 = subcell positions
const cornerSubcellOrder = [1, 3, 7, 9]; // Order for corner subcells
const centerSubcellOrder = [4, 5, 6]; // Subcells to merge for center mode
let centerPencilMarks = []; // Store center pencil marks for the selected cell
// Always treat puzzle as saved since we removed the Save button
let isPuzzleSaved = true;
// Not using preSaveNumbers since we always treat numbers as post-save
const preSaveNumbers = new Set();

// Action history for undo/redo functionality
let actionHistory = [];
let historyIndex = -1;

// Timer functionality
let timerInterval;
let seconds = 0;
let isPaused = false;
let timerDisplay;
let pauseBtn;

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

function updateTimer() {
  if (!isPaused && timerDisplay) {
    seconds++;
    timerDisplay.textContent = formatTime(seconds);
  }
}

// Start the timer
function startTimer() {
  if (!timerInterval) {
    timerInterval = setInterval(updateTimer, 1000);
  }
}

// Stop the timer
function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// Reset the timer to 00:00
function resetTimer() {
  seconds = 0;
  if (timerDisplay) {
    timerDisplay.textContent = formatTime(seconds);
  }
}

// Initialize timer as paused
let isTimerStarted = false;

// Global click timer for handling single/double clicks
let clickTimer = null;

// Make timer variables and functions globally accessible
window.isTimerStarted = isTimerStarted;
window.startTimer = startTimer;
window.stopTimer = stopTimer;

// Initialize timer elements and functionality when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  timerDisplay = document.getElementById('timer');
  pauseBtn = document.getElementById('pauseBtn');
  
  if (!timerDisplay || !pauseBtn) {
    console.error('Timer elements not found');
    return;
  }

  // Set initial pause button state based on whether timer is already started
  function updatePauseButtonState() {
    if (isTimerStarted && !isPaused) {
      // Timer is running
      pauseBtn.textContent = '⏸️';
      pauseBtn.title = 'Pause';
    } else if (isTimerStarted && isPaused) {
      // Timer is paused
      pauseBtn.textContent = '▶️';
      pauseBtn.title = 'Resume';
    } else {
      // Timer not started
      pauseBtn.textContent = '⏸️';
      pauseBtn.title = 'Start Timer';
    }
  }

  // Initial button state update
  updatePauseButtonState();

  // Check periodically if timer state has changed (for auto-start scenarios)
  const stateCheckInterval = setInterval(() => {
    if (window.isTimerStarted !== isTimerStarted) {
      isTimerStarted = window.isTimerStarted;
      updatePauseButtonState();
    }
  }, 100);

  // Pause/Resume functionality
  pauseBtn.addEventListener('click', () => {
    if (!isTimerStarted) {
      // If timer hasn't started yet, start it
      isTimerStarted = true;
      window.isTimerStarted = true;
      startTimer();
      isPaused = false;
    } else {
      // Toggle pause/resume
      isPaused = !isPaused;
      if (isPaused) {
        stopTimer();
      } else {
        startTimer();
      }
    }
    
    const sudokuGrid = document.getElementById('sudoku-grid');
    const pauseTextOverlay = document.getElementById('pauseTextOverlay');
    
    if (isPaused) {
      // Pause: Add blur, disable interactions, and show text overlay
      sudokuGrid.classList.add('blurred');
      if (pauseTextOverlay) {
        pauseTextOverlay.style.display = 'block';
      }
      pauseBtn.textContent = '▶️';
      pauseBtn.title = 'Resume';
    } else {
      // Resume: Remove blur, enable interactions, and hide text overlay
      sudokuGrid.classList.remove('blurred');
      if (pauseTextOverlay) {
        pauseTextOverlay.style.display = 'none';
      }
      pauseBtn.textContent = '⏸️';
      pauseBtn.title = 'Pause';
    }
  });
  
  // Initialize number pad button states
  updateNumberPadStates();
});

// Function to save current cell state for history
function saveCellState(cell) {
  const cellIndex = Array.from(grid.children).indexOf(cell);
  const hasSubcells = cell.querySelectorAll('.subcell').length > 0;
  const hasCenterMarks = cell.querySelectorAll('.center-number').length > 0;
  
  const state = {
    cellIndex: cellIndex,
    // Only save text content if there are no subcells or center marks
    textContent: (hasSubcells || hasCenterMarks) ? '' : cell.textContent,
    isPreset: cell.classList.contains('preset'),
    subcells: [],
    centerMarks: []
  };
  
  // Save subcells (corner marks)
  const subcells = cell.querySelectorAll('.subcell');
  subcells.forEach(subcell => {
    const position = subcell.className.replace('subcell sc', '');
    state.subcells.push({
      position: position,
      content: subcell.textContent
    });
  });
  
  // Save center marks
  const centerNumbers = cell.querySelectorAll('.center-number');
  centerNumbers.forEach(centerNum => {
    state.centerMarks.push(centerNum.textContent);
  });
  
  return state;
}

// Function to restore cell state from history
function restoreCellState(state) {
  const cell = grid.children[state.cellIndex];
  if (!cell) return; // Safety check
  
  console.log(`Restoring cell ${state.cellIndex} with state:`, state);
  
  // Clear current content
  cell.textContent = '';
  const existingElements = cell.querySelectorAll('.subcell, .merged-center, .center-number');
  existingElements.forEach(el => el.remove());
  
  // Restore preset class
  if (state.isPreset) {
    cell.classList.add('preset');
    cell.style.color = 'black';
  } else {
    cell.classList.remove('preset');
    cell.style.color = 'blue';
  }
  
  // Restore text content
  if (state.textContent) {
    cell.textContent = state.textContent;
    cell.style.fontWeight = 'normal';
    cell.style.fontSize = '1.5em';
  }
  
  // Restore subcells (corner marks)
  state.subcells.forEach(subcellData => {
    const subcell = document.createElement('div');
    subcell.className = `subcell sc${subcellData.position}`;
    subcell.textContent = subcellData.content;
    cell.appendChild(subcell);
  });
  
  // Restore center marks
  if (state.centerMarks.length > 0) {
    // Update centerPencilMarks if this is the selected cell
    if (cell === selectedCell) {
      centerPencilMarks = [...state.centerMarks];
      updateCenterPencilMarks();
    } else {
      // Manually recreate center marks for non-selected cells
      const mergedCenter = document.createElement('div');
      mergedCenter.className = 'merged-center';
      mergedCenter.style.position = 'absolute';
      mergedCenter.style.top = '33.33%';
      mergedCenter.style.left = '0';
      mergedCenter.style.width = '100%';
      mergedCenter.style.height = '33.33%';
      mergedCenter.style.display = 'flex';
      mergedCenter.style.alignItems = 'center';
      mergedCenter.style.justifyContent = 'center';
      mergedCenter.style.flexWrap = 'nowrap';
      mergedCenter.style.fontSize = state.centerMarks.length >= 6 ? '0.35em' : '0.5em';
      mergedCenter.style.color = '#666';
      mergedCenter.style.zIndex = '1';
      mergedCenter.style.overflow = 'hidden';
      mergedCenter.style.boxSizing = 'border-box';
      mergedCenter.style.padding = '0px';
      
      const numbersContainer = document.createElement('div');
      numbersContainer.style.display = 'flex';
      numbersContainer.style.flexWrap = 'nowrap';
      numbersContainer.style.justifyContent = 'center';
      numbersContainer.style.alignItems = 'center';
      
      let gap = '0px';
      if (state.centerMarks.length <= 1) gap = '1px';
      else if (state.centerMarks.length <= 2) gap = '0.8px';
      else if (state.centerMarks.length <= 3) gap = '0.6px';
      else if (state.centerMarks.length <= 4) gap = '0.4px';
      else if (state.centerMarks.length <= 5) gap = '0.2px';
      
      numbersContainer.style.gap = gap;
      numbersContainer.style.width = '100%';
      numbersContainer.style.height = '100%';
      numbersContainer.style.maxWidth = '100%';
      numbersContainer.style.maxHeight = '100%';
      numbersContainer.style.overflow = 'hidden';
      
      state.centerMarks.forEach(mark => {
        const numElement = document.createElement('span');
        numElement.className = 'center-number';
        numElement.textContent = mark;
        numElement.style.fontSize = 'inherit';
        numElement.style.lineHeight = '0.9';
        numElement.style.margin = '0';
        numElement.style.padding = '0';
        numElement.style.whiteSpace = 'nowrap';
        numElement.style.flexShrink = '0';
        numElement.style.letterSpacing = state.centerMarks.length >= 4 ? '-0.05em' : 'normal';
        numElement.style.width = 'auto';
        numElement.style.textAlign = 'center';
        numbersContainer.appendChild(numElement);
      });
      
      mergedCenter.appendChild(numbersContainer);
      cell.style.position = 'relative';
      cell.appendChild(mergedCenter);
    }
  }
}

// Function to add action to history
function addToHistory(beforeState, afterState, actionType) {
  // Remove any actions after current position (for when we're in middle of history)
  actionHistory = actionHistory.slice(0, historyIndex + 1);
  
  actionHistory.push({
    before: beforeState,
    after: afterState,
    type: actionType,
    timestamp: Date.now()
  });
  
  historyIndex = actionHistory.length - 1;
  
  // Limit history size to prevent memory issues
  if (actionHistory.length > 100) {
    actionHistory.shift();
    historyIndex--;
  }
  
  console.log(`Action added to history: ${actionType}, History size: ${actionHistory.length}, Index: ${historyIndex}`);
}

// Function to perform undo
function performUndo() {
  // Check if there are actions to undo
  if (actionHistory.length === 0) {
    console.log('No actions to undo');
    return;
  }
  
  // If we're at the beginning of the history, we can't undo further
  if (historyIndex < 0) {
    console.log('Already at the beginning of history');
    return;
  }
  
  console.log(`Performing undo. Current index: ${historyIndex}, History length: ${actionHistory.length}`);
  
  try {
    // Get the current action
    const currentAction = actionHistory[historyIndex];
    
    if (!currentAction || !currentAction.before) {
      console.error('Invalid action in history:', currentAction);
      return;
    }
    
    // Get the affected cell
    const affectedCell = grid.children[currentAction.before.cellIndex];
    
    // Log the undo action for debugging
    console.log(`Undoing action on cell ${currentAction.before.cellIndex} with value:`, currentAction.before.textContent);
    
    // Restore the before state
    restoreCellState(currentAction.before);
    
    // Update centerPencilMarks if the affected cell is currently selected
    if (affectedCell === selectedCell) {
      centerPencilMarks = [...currentAction.before.centerMarks];
    }
    
    // Move history index back
    historyIndex--;
    
    console.log(`Undo completed. New index: ${historyIndex}`);
    // After undo, re-check for duplicates to update cell colors immediately
    checkForDuplicates();
  } catch (error) {
    console.error('Error during undo:', error);
  }
}

// Function to perform redo
function performRedo() {
  // Check if there are actions to redo
  if (actionHistory.length === 0) {
    console.log('No actions to redo');
    return;
  }
  
  // If we're at the end of the history, we can't redo
  if (historyIndex >= actionHistory.length - 1) {
    console.log('Already at the end of history');
    return;
  }
  
  console.log(`Performing redo. Current index: ${historyIndex}, History length: ${actionHistory.length}`);
  
  try {
    // Move to the next action
    historyIndex++;
    
    // Get the action to redo
    const actionToRedo = actionHistory[historyIndex];
    
    if (!actionToRedo || !actionToRedo.after) {
      console.error('Invalid action in history:', actionToRedo);
      return;
    }
    
    // Restore the after state
    restoreCellState(actionToRedo.after);
    
    // Update centerPencilMarks if the affected cell is currently selected
    const affectedCell = grid.children[actionToRedo.after.cellIndex];
    if (affectedCell === selectedCell) {
      centerPencilMarks = [...actionToRedo.after.centerMarks];
    }
    
    console.log(`Redo completed. New index: ${historyIndex}`);
  } catch (error) {
    console.error('Error during redo:', error);
  }
}

// Function to handle keyboard input
function handleKeyDown(e) {
  if (!selectedCell) return;
  
  const key = e.key;
  
  // Handle number input (1-9) from both top row and number pad
  if (/^[1-9]$/.test(key) || 
      (e.code && e.code.startsWith('Numpad') && /^[1-9]$/.test(e.code.slice(6)))) {
    e.preventDefault();
    
    // Get the number from either key or code (for numpad)
    const number = parseInt(key) || parseInt(e.code.slice(6));
    
    // Save state before action for history
    const beforeState = saveCellState(selectedCell);
    
    const isSolidMode = window.selectedButton && window.selectedButton.textContent.trim() === 'Solid';
    const isCornerMode = window.selectedButton && window.selectedButton.textContent.trim() === 'Corner';
    const isCenterMode = window.selectedButton && window.selectedButton.textContent.trim() === 'Center';
    
    // Protection: Prevent pencil marks from being added to cells with blue solid numbers (preset numbers)
    if ((isCornerMode || isCenterMode) && selectedCell.classList.contains('preset')) {
      // Don't allow pencil marks on preset cells - give visual feedback
      selectedCell.style.border = '2px solid red';
      setTimeout(() => {
        selectedCell.style.border = '';
      }, 500);
      return;
    }
    
    // Protection: Prevent pencil marks from being added to cells with ANY solid number
    if ((isCornerMode || isCenterMode) && hasSolidNumber(selectedCell)) {
      // Don't allow pencil marks on cells with solid numbers - give visual feedback
      selectedCell.style.border = '2px solid red';
      setTimeout(() => {
        selectedCell.style.border = '';
      }, 500);
      return;
    }
    
    // Protection: Prevent solid numbers from replacing blue solid numbers (preset numbers)
    if (isSolidMode && selectedCell.classList.contains('preset')) {
      // Don't allow solid number replacement on preset cells - give visual feedback
      selectedCell.style.border = '2px solid red';
      setTimeout(() => {
        selectedCell.style.border = '';
      }, 500);
      return;
    }
    
    if (isSolidMode) {
      // Check if the cell already contains the same number - if so, delete it
      if (selectedCell.textContent === number.toString()) {
        // Clear the cell content
        selectedCell.textContent = '';
        selectedCell.style.color = '';
        selectedCell.style.fontWeight = '';
        selectedCell.style.fontSize = '';
        
        // Remove from preSaveNumbers set if it was there
        const cellIndex = Array.from(grid.children).indexOf(selectedCell);
        preSaveNumbers.delete(cellIndex);
        
        // Clear any existing subcells and center marks
        const existingSubcells = selectedCell.querySelectorAll('.subcell, .merged-center, .center-number');
        existingSubcells.forEach(el => el.remove());
        
        // Clear center pencil marks array
        centerPencilMarks = [];
      } else {
        // Clear any existing subcells and center marks when in Solid mode
        const existingSubcells = selectedCell.querySelectorAll('.subcell, .merged-center, .center-number');
        existingSubcells.forEach(el => el.remove());
        
        // Clear center pencil marks array
        centerPencilMarks = [];
        
        selectedCell.textContent = number;
        // FIXED: Color logic for pre-save and post-save numbers
        if (!isPuzzleSaved) {
          // Before save button is clicked - all solid numbers are black
          const cellIndex = Array.from(grid.children).indexOf(selectedCell);
          preSaveNumbers.add(cellIndex);
          selectedCell.style.color = 'black';
        } else {
          // After save button is clicked - new solid numbers are blue
          selectedCell.style.color = 'blue';
        }
        selectedCell.style.fontWeight = 'normal';
      }
      selectedCell.style.fontSize = '1.5em';
    } 
    else if (isCornerMode) {
      // Handle corner mode
      const existingCenterMarks = selectedCell.querySelectorAll('.center-number');
      centerPencilMarks = Array.from(existingCenterMarks).map(el => el.textContent);
      
      // Get all current pencil marks
      const pencilMarks = [];
      const subcells = selectedCell.querySelectorAll('.subcell');
      
      // Collect existing pencil marks
      subcells.forEach(cell => {
        if (cell.textContent) {
          pencilMarks.push(parseInt(cell.textContent, 10));
        }
      });
      
      // Toggle the number - add if not present, remove if present
      if (number) {
        const num = parseInt(number, 10);
        const index = pencilMarks.indexOf(num);
        if (index === -1) {
          // Number not present - add it
          pencilMarks.push(num);
          pencilMarks.sort((a, b) => a - b);
        } else {
          // Number already present - remove it
          pencilMarks.splice(index, 1);
        }
      }
      
      // Clear all subcells
      subcells.forEach(cell => cell.remove());
      
      // Clear any text content
      const textNodes = Array.from(selectedCell.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
      textNodes.forEach(node => node.remove());
      
      // Redistribute sorted numbers to corner subcells
      for (let i = 0; i < pencilMarks.length && i < cornerSubcellOrder.length; i++) {
        const subcell = document.createElement('div');
        const position = cornerSubcellOrder[i];
        subcell.className = `subcell sc${position}`;
        subcell.textContent = pencilMarks[i];
        selectedCell.appendChild(subcell);
      }
    }
    else if (isCenterMode) {
      // Handle center mode
      const numStr = number.toString();
      const index = centerPencilMarks.indexOf(numStr);
      
      if (index === -1) {
        // Add number if not already in center marks
        centerPencilMarks.push(numStr);
      } else {
        // Remove number if already in center marks
        centerPencilMarks.splice(index, 1);
      }
      
      // Update the display
      updateCenterPencilMarks();
    }
    
    // Save state after action for history
    const afterState = saveCellState(selectedCell);
    addToHistory(beforeState, afterState, 'number_input');
    
    // Start timer on first move
    if (!isTimerStarted) {
      isTimerStarted = true;
      window.isTimerStarted = true;
      startTimer();
      // Update pause button to show pause state
      if (pauseBtn) {
        pauseBtn.textContent = '⏸️';
        pauseBtn.title = 'Pause';
      }
    }
    
    // Check for duplicates and pencil mark conflicts after number is entered
    checkForDuplicates();
    checkPencilMarkConflicts();
    
    return;
  }
  
  // Handle navigation with arrow keys
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(key)) {
    e.preventDefault();
    
    const currentIndex = Array.from(grid.children).indexOf(selectedCell);
    let newIndex = currentIndex;
    const row = Math.floor(currentIndex / 9);
    const col = currentIndex % 9;
    
    switch (key) {
      case 'ArrowUp':
        newIndex = Math.max(0, currentIndex - 9);
        break;
      case 'ArrowDown':
        newIndex = Math.min(80, currentIndex + 9);
        break;
      case 'ArrowLeft':
        newIndex = Math.max(0, currentIndex - 1);
        // Skip to the end of the previous row if at the start of a row
        if (col === 0 && row > 0) {
          newIndex = (row * 9) - 1;
        }
        break;
      case 'ArrowRight':
        newIndex = Math.min(80, currentIndex + 1);
        // Skip to the start of the next row if at the end of a row
        if (col === 8 && row < 8) {
          newIndex = (row + 1) * 9;
        }
        break;
      case 'Tab':
        if (e.shiftKey) {
          // Shift+Tab: move to the previous cell
          newIndex = (currentIndex - 1 + 81) % 81;
        } else {
          // Tab: move to the next cell
          newIndex = (currentIndex + 1) % 81;
        }
        break;
      case 'Enter':
        // Move down one row, or to the top of the next column if at the bottom
        newIndex = (currentIndex + 9) % 81;
        break;
    }
    
    // Select the new cell
    const newCell = grid.children[newIndex];
    if (newCell) {
      newCell.click();
    }
    return;
  }
  
  // Handle delete - clear the selected cell like Del3 button
  if (key === 'Delete') {
    e.preventDefault();
    if (selectedCell) {
      // Save state before action for history
      const beforeState = saveCellState(selectedCell);
      
      // Clear the cell content
      selectedCell.textContent = '';
      
      // Clear any subcells (corner marks)
      const subcells = selectedCell.querySelectorAll('.subcell');
      subcells.forEach(subcell => subcell.remove());
      
      // Clear any center marks
      const centerMarks = selectedCell.querySelectorAll('.center-number, .merged-center');
      centerMarks.forEach(mark => mark.remove());
      
      // Clear center pencil marks array
      centerPencilMarks = [];
      
      // Save state after action for history
      const afterState = saveCellState(selectedCell);
      addToHistory(beforeState, afterState, 'clear_cell');
      
      // Update conflicts
      checkForDuplicates();
      checkPencilMarkConflicts();
    }
    return;
  }
  
  // Handle backspace - same as Undo (Z key)
  if (key === 'Backspace') {
    e.preventDefault();
    performUndo();
    return;
  }
  
  // Handle 'R' key for Redo
  if (key === 'r' || key === 'R') {
    e.preventDefault();
    performRedo();
    return;
  }
  
  // Toggle pencil mode with space
  if (key === ' ') {
    e.preventDefault();
    // Toggle between solid and pencil mode
    const pencilButton = document.querySelector('.pencil-btn');
    if (pencilButton) {
      pencilButton.click();
    }
    return;
  }
}

// Handle mouse up anywhere on the document to end drag selection
document.addEventListener('mouseup', (e) => {
  // If we were dragging, finalize the selection
  if (isDragging) {
    const selectedCount = document.querySelectorAll('.cell.selected').length;
    hasMultipleSelections = selectedCount > 1;
  }
  
  isMouseDown = false;
  // Don't immediately reset isDragging here - let the click handler check it first
  startCell = null;
});

// Handle clicks outside selected cells to clear selection when Ctrl is held
document.addEventListener('click', (e) => {
  // Only clear selection if Ctrl is actively being held down (not in persistent multi-selection state)
  if (isCtrlMultiSelectMode && !hasMultipleSelections) {
    const clickedElement = e.target;
    
    // Check if the clicked element is not a cell or inside a cell
    const isCell = clickedElement.classList.contains('cell');
    const isInsideCell = clickedElement.closest('.cell');
    
    // If clicked outside any cell, clear all selections
    if (!isCell && !isInsideCell) {
      document.querySelectorAll('.cell.selected').forEach(cell => {
        cell.classList.remove('selected');
      });
      selectedCell = null;
      hasMultipleSelections = false;
    }
  }
});

// Add keyboard event listeners
document.addEventListener('keydown', (e) => {
  // Handle Ctrl+A to select all Sudoku cells
  if (e.ctrlKey && e.key.toLowerCase() === 'a') {
    e.preventDefault(); // Prevent browser's default select all behavior
    
    // Only select cells within the Sudoku grid
    const grid = document.getElementById('sudoku-grid');
    if (grid) {
      const cells = grid.querySelectorAll('.cell');
      cells.forEach(cell => {
        cell.classList.add('selected');
      });
      hasMultipleSelections = true; // Mark that we have multiple selections
    }
    return;
  }
  
  // Handle 'z' key press for Center mode (was Control)
  if (e.key === 'z' || e.key === 'Z') {
    const centerButton = Array.from(document.querySelectorAll('.side-btn.merged-fg')).find(btn => 
      btn.textContent.trim() === 'Center'
    );
    const solidButton = Array.from(document.querySelectorAll('.side-btn.merged-fg')).find(btn => 
      btn.textContent.trim() === 'Solid'
    );
    
    if (centerButton && solidButton) {
      // Select Center button
      document.querySelectorAll('.side-btn.merged-fg').forEach(btn => {
        btn.classList.remove('selected');
        btn.style.borderColor = '';
        btn.style.boxShadow = '';
      });
      
      centerButton.classList.add('selected');
      centerButton.style.borderColor = '#0078d7';
      centerButton.style.boxShadow = '0 0 0 2px #0078d7';
      window.selectedButton = centerButton;
      
      // Set center mode
      currentSubcellPosition = 0;
      if (selectedCell) {
        const existingCenterMarks = selectedCell.querySelectorAll('.center-number');
        centerPencilMarks = Array.from(existingCenterMarks).map(el => el.textContent);
      }
    }
  }
  // Handle 'a' key press for Corner mode (was Shift)
  else if (e.key === 'a' || e.key === 'A') {
    const cornerButton = Array.from(document.querySelectorAll('.side-btn.merged-fg')).find(btn => 
      btn.textContent.trim() === 'Corner'
    );
    const solidButton = Array.from(document.querySelectorAll('.side-btn.merged-fg')).find(btn => 
      btn.textContent.trim() === 'Solid'
    );
    
    if (cornerButton && solidButton) {
      // Select Corner button
      document.querySelectorAll('.side-btn.merged-fg').forEach(btn => {
        btn.classList.remove('selected');
        btn.style.borderColor = '';
        btn.style.boxShadow = '';
      });
      
      cornerButton.classList.add('selected');
      cornerButton.style.borderColor = '#0078d7';
      cornerButton.style.boxShadow = '0 0 0 2px #0078d7';
      window.selectedButton = cornerButton;
      
      // Set corner mode
      currentSubcellPosition = cornerSubcellOrder[0];
      if (selectedCell) {
        const existingSubcells = selectedCell.querySelectorAll('.subcell');
        // Load existing corner marks if any
      }
    }
  }
  
  // Handle 's' key for multi-select mode
  if (e.key === 's' || e.key === 'S') {
    isMultiSelectMode = true;
    return; // Don't process further to prevent 's' from being treated as input
  }
  
  // Handle Ctrl key for multi-select mode
  if (e.key === 'Control' || e.ctrlKey) {
    isCtrlMultiSelectMode = true;
  }
  
  // Call the original keydown handler
  handleKeyDown(e);
});

// Add keyup event listener to restore Solid mode when Control or Shift is released
document.addEventListener('keyup', (e) => {
  // Handle 's' key release
  if (e.key === 's' || e.key === 'S') {
    isMultiSelectMode = false;
    return;
  }
  
  // Handle Ctrl key release
  if (e.key === 'Control') {
    isCtrlMultiSelectMode = false;
  }
  
  if (e.key === 'z' || e.key === 'Z' || e.key === 'a' || e.key === 'A') {
    const solidButton = Array.from(document.querySelectorAll('.side-btn.merged-fg')).find(btn => 
      btn.textContent.trim() === 'Solid'
    );
    
    if (solidButton) {
      // Switch back to Solid mode
      // Select Solid button
      document.querySelectorAll('.side-btn.merged-fg').forEach(btn => {
        btn.classList.remove('selected');
        btn.style.borderColor = '';
        btn.style.boxShadow = '';
      });
      
      solidButton.classList.add('selected');
      solidButton.style.borderColor = '#0078d7';
      solidButton.style.boxShadow = '0 0 0 2px #0078d7';
      window.selectedButton = solidButton;
        
      // Set solid mode but preserve pencil marks
      currentSubcellPosition = 0;
      
      // Keep the existing marks in the cell, just switch the mode
      if (selectedCell) {
        // For center marks
        const existingCenterMarks = selectedCell.querySelectorAll('.center-number');
        centerPencilMarks = Array.from(existingCenterMarks).map(el => el.textContent);
        
        // For corner marks
        const existingCornerMarks = selectedCell.querySelectorAll('.subcell');
        // Corner marks are already in the DOM, no need to update anything
      }
    }
  }
});

// Global variables for selection
let isMouseDown = false;
let isDragging = false;
let startCell = null;
let isMultiSelectMode = false; // Tracks if 's' key is being held down
let isCtrlMultiSelectMode = false; // Tracks if Ctrl key is being held down for multi-selection
let hasMultipleSelections = false; // Tracks if we have multiple cells selected (maintains state after Ctrl release)

// Function to highlight a cell based on its type and settings
function highlightCell(cell, highlightPencilMarks = null) {
  if (!cell) return;
  
  // If highlightPencilMarks is not provided, get it from settings
  if (highlightPencilMarks === null) {
    highlightPencilMarks = getHighlightPencilMarksSetting();
  }
  
  // If it's a pencil mark and highlighting is off, do nothing
  if ((cell.classList.contains('subcell') || cell.classList.contains('center-number'))) {
    if (!highlightPencilMarks) {
      cell.classList.remove('selected');
      cell.classList.remove('highlight-same-number');
      return;
    }
  }
  
  // For all other cases (regular cells or pencil marks with highlighting on)
  cell.classList.add('selected');
}

// Function to handle cell selection
function selectCell(cell, isMultiSelect = false, isDrag = false) {
  if (!cell) return;
  
  // Don't clear highlights when selecting a cell - only clear on explicit actions
  // or when clicking outside highlighted cells (handled in click handler)
  
  // Special case: If clicking on an unselected cell while having multiple selections 
  // and NOT actively holding Ctrl or 's', clear all selections and select only the new cell
  if (hasMultipleSelections && !isCtrlMultiSelectMode && !isMultiSelectMode && !isDrag && !cell.classList.contains('selected')) {
    // Clear all selections
    document.querySelectorAll('.cell.selected, .subcell.selected, .center-number.selected').forEach(c => {
      c.classList.remove('selected');
    });
    
    // Select only the clicked cell with proper highlighting
    highlightCell(cell);
    
    selectedCell = cell;
    hasMultipleSelections = false;
    cell.focus();
    return;
  }
  
  // If Ctrl is actively held down, add cell to selection (never remove)
  if (isCtrlMultiSelectMode && !isDrag) {
    if (!cell.classList.contains('selected')) {
      highlightCell(cell);
    }
    // Update multiple selection state
    const selectedCount = document.querySelectorAll('.cell.selected').length;
    hasMultipleSelections = selectedCount > 1;
    selectedCell = cell;
    if (!isDrag) {
      cell.focus();
    }
    return;
  }
  
  // If 's' key is held down, toggle selection
  if (isMultiSelectMode && !isDrag) {
    if (cell.classList.contains('selected')) {
      cell.classList.remove('selected');
    } else {
      highlightCell(cell);
    }
    // Update multiple selection state
    const selectedCount = document.querySelectorAll('.cell.selected').length;
    hasMultipleSelections = selectedCount > 1;
    selectedCell = cell;
    if (!isDrag) {
      cell.focus();
    }
    return;
  }
  
  // If we have persistent multiple selections but not actively multi-selecting, 
  // clicking on a selected cell removes it, clicking on unselected adds it
  if (hasMultipleSelections && !isCtrlMultiSelectMode && !isMultiSelectMode && !isDrag) {
    if (cell.classList.contains('selected')) {
      // Remove the cell from selection
      cell.classList.remove('selected');
      // Update selected cell reference
      if (cell === selectedCell) {
        const allSelected = document.querySelectorAll('.cell.selected');
        selectedCell = allSelected.length > 0 ? allSelected[allSelected.length - 1] : null;
      }
      // Update multiple selection state
      const selectedCount = document.querySelectorAll('.cell.selected').length;
      hasMultipleSelections = selectedCount > 1;
      return;
    } else {
      // This case is already handled above - clicking unselected cell clears all and selects only that cell
    }
  }
  
  // Handle drag selection (always multi-select during drag)
  if (isDrag) {
    if (!cell.classList.contains('selected')) {
      highlightCell(cell);
    }
    const selectedCount = document.querySelectorAll('.cell.selected').length;
    hasMultipleSelections = selectedCount > 1;
    selectedCell = cell;
    return;
  }
  
  // Normal single cell selection (clear all others and select this one)
  document.querySelectorAll('.cell.selected, .subcell.selected, .center-number.selected').forEach(c => {
    c.classList.remove('selected');
  });
  
  // Use highlightCell to handle the highlighting based on settings
  highlightCell(cell);
  
  selectedCell = cell;
  hasMultipleSelections = false;
  cell.focus();
}

// 🎯 Generate 9×9 grid dynamically
for (let row = 0; row < 9; row++) {
  for (let col = 0; col < 9; col++) {
    const cell = document.createElement('div');
    cell.tabIndex = 0; // Make cell focusable
    cell.classList.add('cell');
    // Add data attributes for conflict detection
    cell.dataset.row = row;
    cell.dataset.col = col;

    // Add bold borders for blocks
    if (row % 3 === 0) cell.classList.add('block-top');
    if (col % 3 === 0) cell.classList.add('block-left');
    if (row === 8) cell.classList.add('block-bottom');
    if (col === 8) cell.classList.add('block-right');

        // Track selection
    let isHighlighted = false;
    let mouseDownHandled = false;
    
    // Mouse down event - start selection
    cell.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // Only left mouse button
      
      e.preventDefault();
      e.stopPropagation();
      isMouseDown = true;
      startCell = cell;
      mouseDownHandled = false;
      isDragging = false; // Reset dragging state
      
      // If Ctrl or 's' is held, handle selection immediately and mark as handled
      if (isCtrlMultiSelectMode || isMultiSelectMode) {
        selectCell(cell, false, false);
        mouseDownHandled = true;
      } else {
        // For normal drag selection, immediately select the starting cell
        selectCell(cell, false, false);
      }
    });
    
    // Mouse enter event - handle drag selection
    cell.addEventListener('mouseenter', (e) => {
      if (isMouseDown && startCell && startCell !== cell) {
        e.preventDefault();
        isDragging = true;
        const isMultiSelect = true; // Always multi-select during drag
        selectCell(cell, isMultiSelect, true);
      }
    });
    
    // Prevent default drag behavior on cells
    cell.addEventListener('dragstart', (e) => {
      e.preventDefault();
    });
    
    cell.addEventListener('selectstart', (e) => {
      e.preventDefault();
    });
    
    // Track click state
    let clickTimer = null;
    let lastClickTime = 0;
    
    // Handle cell clicks
    cell.addEventListener('click', (e) => {
      e.preventDefault();
      
      // If we were dragging, don't process the click but reset the drag state
      if (isDragging) {
        isDragging = false;
        return;
      }
      
      // If mousedown already handled this (Ctrl or 's' was held), skip click processing
      if (mouseDownHandled) {
        mouseDownHandled = false;
        return;
      }
      
      const currentTime = new Date().getTime();
      const isDoubleClick = (currentTime - lastClickTime) < 300; // 300ms threshold for double click
      lastClickTime = currentTime;
      
      // Clear any pending single click
      if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
      }
      
      // Handle double click for highlighting same numbers
      if (isDoubleClick) {
        // Get the target number from the cell's content or its pencil marks
        let targetNumber = '';
        const cellText = cell.textContent.trim();
        
        // Check if it's a solid number
        if (cellText && /^[1-9]$/.test(cellText) && cell.childElementCount === 0) {
          targetNumber = cellText;
        } 
        // Otherwise check for pencil marks
        else {
          const pencilMark = cell.querySelector('*');
          if (pencilMark) {
            targetNumber = pencilMark.textContent.trim();
          }
        }
        
        if (targetNumber && /^[1-9]$/.test(targetNumber)) {
          // Toggle highlight if already highlighted
          if (cell.classList.contains('highlight-same-number')) {
            clearHighlights();
          } else {
            clearHighlights();
            const highlightPencilMarks = getHighlightPencilMarksSetting();
            const hasPencilMarks = cell.querySelector('*') !== null;
            const isSolidNumber = cellText === targetNumber && cell.childElementCount === 0;
            
            console.log('Double click on cell:', {
              targetNumber,
              cellText,
              hasPencilMarks,
              isSolidNumber,
              highlightPencilMarks,
              childElementCount: cell.childElementCount
            });
            
            // Always call highlightSameNumberCells, it will handle the logic
            highlightSameNumberCells(cell, true, highlightPencilMarks);
            selectCell(cell, false, false);
          }
        }
        return;
      }
      
      // Handle single click with a small delay to check for double click
      clickTimer = setTimeout(() => {
        // Clear all highlights and selections first
        clearHighlights();
        
        // Select the clicked cell
        selectCell(cell, false, false);
        
        // Handle YBG specific behavior if needed
        const ybgCell = document.querySelector('.ybg');
        const isYBGSelected = ybgCell && ybgCell.classList.contains('selected');
        const allStripesFilled = ybgCell && ybgCell.querySelectorAll('.red-stripe').length >= 2;
        
        if (isYBGSelected && allStripesFilled) {
          const wbgCell = ybgCell.previousElementSibling || ybgCell.nextElementSibling;
          if (wbgCell) {
            selectCell(wbgCell, false, false);
            highlightSameNumberCells(wbgCell, true);
            return;
          }
        }
        
        // Handle mode-specific initialization
        if (window.selectedButton) {
          const mode = window.selectedButton.textContent.trim();
          if (mode === 'Corner') {
            currentSubcellPosition = cornerSubcellOrder[0];
          } else if (mode === 'Center') {
            const centerMarks = cell.querySelectorAll('.center-number');
            centerPencilMarks = Array.from(centerMarks).map(el => el.textContent);
            currentSubcellPosition = 0;
          }
        } else {
          currentSubcellPosition = 0;
        }
      }, 200); // 200ms delay for single click
    });

    grid.appendChild(cell);
  }
}

// Always treat puzzle as saved since we removed the Save button
let isPostSaveMode = true;

// Function to get the current subcell position (for potential future use)
function getCurrentSubcellPosition() {
  return currentSubcellPosition;
}

// Function to convert array of numbers to ranges (e.g., [1,2,3,5,7,8,9] -> ["1-3", "5", "7-9"])
function convertToRanges(numbers) {
  if (numbers.length === 0) return [];
  
  const ranges = [];
  let start = parseInt(numbers[0]);
  let end = start;
  
  for (let i = 1; i < numbers.length; i++) {
    const current = parseInt(numbers[i]);
    
    if (current === end + 1) {
      // Consecutive number, extend range
      end = current;
    } else {
      // Non-consecutive, save current range and start new one
      if (start === end) {
        ranges.push(start.toString());
      } else if (end === start + 1) {
        // Only two consecutive numbers, show as "1 2" not "1-2"
        ranges.push(start.toString());
        ranges.push(end.toString());
      } else {
        // Three or more consecutive numbers, show as range "1-3"
        ranges.push(`${start}-${end}`);
      }
      start = current;
      end = current;
    }
  }
  
  // Handle the last range
  if (start === end) {
    ranges.push(start.toString());
  } else if (end === start + 1) {
    // Only two consecutive numbers, show as "1 2" not "1-2"
    ranges.push(start.toString());
    ranges.push(end.toString());
  } else {
    // Three or more consecutive numbers, show as range "1-3"
    ranges.push(`${start}-${end}`);
  }
  
  return ranges;
}

// Function to update center pencil marks display (constrained to mc area only)
function updateCenterPencilMarks() {
  if (!selectedCell) return;
  
  // Remove existing center marks ONLY (preserve corner subcells)
  const existingCenterMarks = selectedCell.querySelectorAll('.merged-center, .center-number');
  existingCenterMarks.forEach(el => el.remove());
  
  // Clear any text content that might interfere
  const textNodes = Array.from(selectedCell.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
  textNodes.forEach(node => node.remove());
  
  if (centerPencilMarks.length === 0) return;
  
  // Create merged center container that spans ONLY sc4, sc5, sc6 (mc area)
  const mergedCenter = document.createElement('div');
  mergedCenter.className = 'merged-center';
  
  // Position it to cover ONLY the merged center area (mc) - horizontally across sc4, sc5, sc6
  mergedCenter.style.position = 'absolute';
  mergedCenter.style.top = '33.33%';     // Middle row vertically
  mergedCenter.style.left = '0';         // Start from left edge
  mergedCenter.style.width = '100%';     // Span full width horizontally (sc4+sc5+sc6)
  mergedCenter.style.height = '33.33%';  // Only middle row height
  mergedCenter.style.display = 'flex';
  mergedCenter.style.alignItems = 'center';
  mergedCenter.style.justifyContent = 'center';
  mergedCenter.style.flexWrap = 'nowrap'; // Keep all on one line
  
  // Keep font size constant for longer, only reduce when really necessary
  let fontSize;
  if (centerPencilMarks.length >= 9) {
    fontSize = '0.32em'; // Very small for 9 marks
  } else if (centerPencilMarks.length >= 8) {
    fontSize = '0.38em'; // Small for 8 marks
  } else {
    fontSize = '0.5em'; // Normal size for 1-7 marks
  }
  
  mergedCenter.style.fontSize = fontSize;
  mergedCenter.style.color = '#666';
  mergedCenter.style.zIndex = '1';
  mergedCenter.style.overflow = 'hidden'; // Strictly prevent overflow outside mc
  mergedCenter.style.boxSizing = 'border-box';
  mergedCenter.style.padding = '0px';     // Remove padding for maximum space
  
  // Sort the pencil marks
  centerPencilMarks.sort((a, b) => a - b);
  
  // Convert to ranges if more than 5 marks
  let displayMarks;
  if (centerPencilMarks.length > 5) {
    displayMarks = convertToRanges(centerPencilMarks);
  } else {
    displayMarks = centerPencilMarks;
  }
  
  // Create a container for all numbers with strict size constraints
  const numbersContainer = document.createElement('div');
  numbersContainer.style.display = 'flex';
  numbersContainer.style.flexWrap = 'nowrap'; // Keep all numbers on one line
  numbersContainer.style.justifyContent = 'center';
  numbersContainer.style.alignItems = 'center';
  
  // Progressive spacing reduction - tighter gaps for more marks
  let gap;
  if (displayMarks.length <= 1) {
    gap = '1px';
  } else if (displayMarks.length <= 2) {
    gap = '0.8px';
  } else if (displayMarks.length <= 3) {
    gap = '0.6px';
  } else if (displayMarks.length <= 4) {
    gap = '0.4px';
  } else if (displayMarks.length <= 5) {
    gap = '0.2px'; // Still small gap for 5 marks
  } else {
    gap = '0px'; // No gap for 6+ marks
  }
  
  numbersContainer.style.gap = gap;
  numbersContainer.style.width = '100%';     // Fill the mc area
  numbersContainer.style.height = '100%';    // Fill the mc area
  numbersContainer.style.maxWidth = '100%';  // Strict width limit
  numbersContainer.style.maxHeight = '100%'; // Strict height limit
  numbersContainer.style.overflow = 'hidden'; // No overflow allowed
  
  // Add each number to the container
  displayMarks.forEach((mark, index) => {
    const numElement = document.createElement('span');
    numElement.className = 'center-number';
    numElement.textContent = mark;
    numElement.style.fontSize = 'inherit';
    numElement.style.lineHeight = '0.9';   // Tight line height for better fit
    numElement.style.margin = '0';         // No margin
    numElement.style.padding = '0';        // No padding to save maximum space
    numElement.style.whiteSpace = 'nowrap'; // Prevent wrapping
    numElement.style.flexShrink = '0';     // Prevent shrinking
    numElement.style.letterSpacing = displayMarks.length >= 4 ? '-0.05em' : 'normal'; // Tighter letter spacing for 4+ marks
    numElement.style.width = 'auto';       // Let width be minimal
    numElement.style.textAlign = 'center'; // Center the number within its minimal width
    numbersContainer.appendChild(numElement);
  });
  
  mergedCenter.appendChild(numbersContainer);
  
  // Ensure the cell has relative positioning for absolute positioning to work
  selectedCell.style.position = 'relative';
  selectedCell.appendChild(mergedCenter);
}

// Function to get center pencil marks for a specific cell
function getCenterPencilMarks(cell) {
  const existingCenterMarks = cell.querySelectorAll('.center-number');
  return Array.from(existingCenterMarks).map(el => el.textContent);
}

// Function to update center pencil marks for a specific cell
function updateCenterPencilMarksForCell(cell, marks) {
  // Remove existing center marks
  const existingMarks = cell.querySelectorAll('.merged-center, .center-number');
  existingMarks.forEach(el => el.remove());
  
  // Clear any text content
  const textNodes = Array.from(cell.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
  textNodes.forEach(node => node.remove());
  
  if (marks.length === 0) return;
  
  // Create merged center container that spans the full width
  const mergedCenter = document.createElement('div');
  mergedCenter.className = 'merged-center';
  
  // Position it to cover the merged center area - horizontally across full width
  mergedCenter.style.position = 'absolute';
  mergedCenter.style.top = '33.33%';     // Middle row vertically
  mergedCenter.style.left = '0';         // Start from left edge
  mergedCenter.style.width = '100%';     // Span full width horizontally
  mergedCenter.style.height = '33.33%';  // Only middle row height
  mergedCenter.style.display = 'flex';
  mergedCenter.style.alignItems = 'center';
  mergedCenter.style.justifyContent = 'center';
  mergedCenter.style.flexWrap = 'nowrap'; // Keep all on one line
  
  // Keep font size constant for longer, only reduce when really necessary
  let fontSize;
  if (marks.length >= 9) {
    fontSize = '0.32em'; // Very small for 9 marks
  } else if (marks.length >= 8) {
    fontSize = '0.38em'; // Small for 8 marks
  } else {
    fontSize = '0.5em'; // Normal size for 1-7 marks
  }
  
  mergedCenter.style.fontSize = fontSize;
  mergedCenter.style.color = '#666';
  mergedCenter.style.zIndex = '1';
  mergedCenter.style.overflow = 'hidden'; // Strictly prevent overflow
  mergedCenter.style.boxSizing = 'border-box';
  mergedCenter.style.padding = '0px';     // Remove padding for maximum space
  
  // Create a container for all numbers with strict size constraints
  const numbersContainer = document.createElement('div');
  numbersContainer.style.display = 'flex';
  numbersContainer.style.flexWrap = 'nowrap'; // Keep all numbers on one line
  numbersContainer.style.justifyContent = 'center';
  numbersContainer.style.alignItems = 'center';
  
  // Progressive spacing reduction - tighter gaps for more marks
  let gap;
  if (marks.length <= 1) {
    gap = '1px';
  } else if (marks.length <= 2) {
    gap = '0.8px';
  } else if (marks.length <= 3) {
    gap = '0.6px';
  } else if (marks.length <= 4) {
    gap = '0.4px';
  } else if (marks.length <= 5) {
    gap = '0.2px'; // Still small gap for 5 marks
  } else {
    gap = '0px'; // No gap for 6+ marks
  }
  
  numbersContainer.style.gap = gap;
  numbersContainer.style.width = '100%';     // Fill the area
  numbersContainer.style.height = '100%';    // Fill the area
  numbersContainer.style.maxWidth = '100%';  // Strict width limit
  numbersContainer.style.maxHeight = '100%'; // Strict height limit
  numbersContainer.style.overflow = 'hidden'; // No overflow allowed
  
  // Sort the marks
  const sortedMarks = [...marks].sort((a, b) => parseInt(a) - parseInt(b));
  
  // Convert to ranges if more than 5 marks
  let displayMarks;
  if (sortedMarks.length > 5) {
    displayMarks = convertToRanges(sortedMarks);
  } else {
    displayMarks = sortedMarks;
  }
  
  // Add each number to the container
  displayMarks.forEach(mark => {
    const numElement = document.createElement('span');
    numElement.className = 'center-number';
    numElement.textContent = mark;
    numElement.style.fontSize = 'inherit';
    numElement.style.lineHeight = '0.9';   // Tight line height for better fit
    numElement.style.margin = '0';         // No margin
    numElement.style.padding = '0';        // No padding to save maximum space
    numElement.style.whiteSpace = 'nowrap'; // Prevent wrapping
    numElement.style.flexShrink = '0';     // Prevent shrinking
    numElement.style.letterSpacing = displayMarks.length >= 4 ? '-0.05em' : 'normal'; // Tighter letter spacing for 4+ marks
    numElement.style.width = 'auto';       // Let width be minimal
    numElement.style.textAlign = 'center'; // Center the number within its minimal width
    numbersContainer.appendChild(numElement);
  });
  
  mergedCenter.appendChild(numbersContainer);
  
  // Ensure the cell has relative positioning for absolute positioning to work
  cell.style.position = 'relative';
  cell.appendChild(mergedCenter);
}

// Function to check for conflicts and update cell colors
function checkForConflicts() {
  console.log('--- Checking for conflicts ---');
  let conflictDetected = false;
  
  // First, reset all solid number cells to their original colors
  document.querySelectorAll('.cell').forEach(cell => {
    const hasMainNumber = cell.textContent.trim() && 
                         !cell.querySelector('.subcell') && 
                         !cell.querySelector('.center-number');
    
    if (hasMainNumber) {
      // Reset to original color based on preset status
      if (cell.classList.contains('preset')) {
        cell.style.color = 'black';
      } else {
        cell.style.color = 'blue';
      }
    }
  });

  // Check each row, column, and block for conflicts
  for (let i = 0; i < 9; i++) {
    // Check row i
    const rowCells = getRowCells(i);
    console.log(`\nChecking row ${i}:`, rowCells.map((c, idx) => `${idx}:${c.textContent.trim() || '.'}`).join(' '));
    const rowHasConflict = checkGroupForConflicts(rowCells, `Row ${i}`);
    if (rowHasConflict) {
      console.log(`  ^^^ CONFLICT DETECTED in row ${i} ^^^`);
      conflictDetected = true;
    }
    
    // Check column i
    const colCells = getColumnCells(i);
    console.log(`\nChecking column ${i}:`, colCells.map((c, idx) => `${idx}:${c.textContent.trim() || '.'}`).join(' '));
    const colHasConflict = checkGroupForConflicts(colCells, `Column ${i}`);
    if (colHasConflict) {
      console.log(`  ^^^ CONFLICT DETECTED in column ${i} ^^^`);
      conflictDetected = true;
    }
  }
  
  // Check all 9 blocks (3x3 grid of blocks)
  for (let blockRow = 0; blockRow < 3; blockRow++) {
    for (let blockCol = 0; blockCol < 3; blockCol++) {
      const startRow = blockRow * 3;
      const startCol = blockCol * 3;
      const blockCells = getBlockCells(startRow, startCol);
      console.log(`\nChecking block starting at (${startRow},${startCol}):`);
      const blockHasConflict = checkGroupForConflicts(blockCells, `Block (${startRow},${startCol})`);
      if (blockHasConflict) {
        console.log(`  ^^^ CONFLICT DETECTED in block (${startRow},${startCol}) ^^^`);
        conflictDetected = true;
      }
    }
  }
  
  // Decrement error counter if conflicts were found
  if (conflictDetected && errorCount > 0) {
    errorCount--;
    console.log(`\n=== DECREMENTING ERROR COUNTER to ${errorCount} ===`);
    updateErrorCounterDisplay();
  } else if (conflictDetected) {
    console.log('\n=== CONFLICT DETECTED but error counter already at 0 ===');
  } else {
    console.log('\n=== NO CONFLICTS DETECTED ===');
  }
  
  return conflictDetected;
}

// Helper function to check a group of cells (row, column, or block) for conflicts
function checkGroupForConflicts(cells, groupName = '') {
  console.log(`  Checking group: ${groupName}`);
  const valueCounts = {};
  const cellsByValue = {};
  
  // Count occurrences of each solid number value in the group and group cells by their values
  cells.forEach(cell => {
    const cellText = cell.textContent.trim();
    const hasSubcells = cell.querySelector('.subcell');
    const hasCenterNumbers = cell.querySelector('.center-number');
    
    // Only check cells with main text content (solid numbers), ignore pencil marks
    const hasMainNumber = cellText && !hasSubcells && !hasCenterNumbers;
    
    if (hasMainNumber) {
      const value = cellText;
      if (!valueCounts[value]) {
        valueCounts[value] = 0;
        cellsByValue[value] = [];
      }
      valueCounts[value]++;
      cellsByValue[value].push(cell);
      console.log(`    Cell at (${cell.dataset.row},${cell.dataset.col}): ${value} (SOLID NUMBER)`);
    } else if (cellText) {
      console.log(`    Cell at (${cell.dataset.row},${cell.dataset.col}): has pencil marks, skipping`);
    } else {
      console.log(`    Cell at (${cell.dataset.row},${cell.dataset.col}): empty`);
    }
  });
  
  // Debug: Log all values and their counts
  console.log(`  Value counts for ${groupName}:`, JSON.stringify(valueCounts, null, 2));
  
  // For each value that appears more than once, highlight all cells with that value in red
  let hasConflicts = false;
  
  // Check for any conflicts in this group
  Object.entries(valueCounts).forEach(([value, count]) => {
    if (count > 1) {
      hasConflicts = true;
      console.log(`  *** CONFLICT FOUND *** ${count} occurrences of solid number ${value} in ${groupName}`);
      cellsByValue[value].forEach(cell => {
        console.log(`    *** HIGHLIGHTING *** cell at (${cell.dataset.row},${cell.dataset.col}) in red`);
        cell.style.color = 'red';
      });
    }
  });
  
  if (hasConflicts) {
    console.log(`  ^^^ FOUND CONFLICTS in ${groupName} ^^^`);
  } else {
    console.log(`  No conflicts found in ${groupName}`);
  }
  
  return hasConflicts;
}

// Helper functions to get cells in a row, column, or block
function getRowCells(row) {
  return Array.from(document.querySelectorAll(`.cell[data-row='${row}']`));
}

function getColumnCells(col) {
  return Array.from(document.querySelectorAll(`.cell[data-col='${col}']`));
}

function getBlockCells(startRow, startCol) {
  const blockCells = [];
  console.log(`\n=== GETTING BLOCK starting at row ${startRow}, col ${startCol} ===`);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const row = startRow + i;
      const col = startCol + j;
      const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
      if (cell) {
        const cellValue = cell.textContent.trim();
        const hasSubcells = cell.querySelector('.subcell') !== null;
        const hasCenterNumbers = cell.querySelector('.center-number') !== null;
        const isSolidNumber = cellValue && !hasSubcells && !hasCenterNumbers;
        
        console.log(`  Cell at (${row},${col}): "${cellValue}" | ` +
                   `Solid: ${isSolidNumber} | ` +
                   `Has subcells: ${hasSubcells} | ` +
                   `Has center numbers: ${hasCenterNumbers}`);
                    
        blockCells.push(cell);
      } else {
        console.log(`  No cell found at (${row},${col})`);
      }
    }
  }
  console.log(`=== FOUND ${blockCells.length} cells in block (${startRow},${startCol}) ===`);
  return blockCells;
}

// Smart pencil mark logic for multiple selected cells
function processSmartPencilMarks(selectedCells, number, isCornerMode, isCenterMode) {
  // Check if smart pencil marks setting is enabled
  const settings = window.sudokuSettings || {};
  const smartPencilMarks = settings.smartPencilMarks !== undefined ? settings.smartPencilMarks : true;
  
  if (!smartPencilMarks || selectedCells.length <= 1) {
    // Fall back to original behavior for single cells or if setting is disabled
    selectedCells.forEach(cell => {
      if (!cell.classList.contains('preset')) {
        processNumberInput(cell, number, false, isCornerMode, isCenterMode);
      }
    });
    return;
  }
  
  // Multi-cell smart logic
  const num = parseInt(number, 10);
  let cellsWithMark = 0;
  let totalValidCells = 0;
  
  // Analyze all selected cells
  selectedCells.forEach(cell => {
    // Skip preset cells
    if (cell.classList.contains('preset')) return;
    
    // Skip cells with solid numbers
    if (hasSolidNumber(cell)) return;
    
    totalValidCells++;
    
    if (isCornerMode) {
      // Check corner marks
      const subcells = cell.querySelectorAll('.subcell');
      const hasCornerMark = Array.from(subcells).some(subcell => 
        parseInt(subcell.textContent, 10) === num
      );
      if (hasCornerMark) cellsWithMark++;
    } else if (isCenterMode) {
      // Check center marks
      const centerMarks = getCenterPencilMarks(cell);
      const hasCenterMark = centerMarks.includes(number.toString());
      if (hasCenterMark) cellsWithMark++;
    }
  });
  
  // Decide action based on analysis
  let shouldRemove = false;
  if (cellsWithMark === totalValidCells && totalValidCells > 0) {
    // ALL valid cells have the mark -> Remove it
    shouldRemove = true;
  } else {
    // SOME or NO cells have the mark -> Add it (only to cells that don't have it)
    shouldRemove = false;
  }
  
  // Apply the decision consistently
  selectedCells.forEach(cell => {
    // Skip preset cells
    if (cell.classList.contains('preset')) {
      // Give visual feedback for preset cells
      cell.style.border = '2px solid red';
      setTimeout(() => {
        cell.style.border = '';
      }, 500);
      return;
    }
    
    // Skip cells with solid numbers
    if (hasSolidNumber(cell)) {
      // Give visual feedback for solid number cells
      cell.style.border = '2px solid red';
      setTimeout(() => {
        cell.style.border = '';
      }, 500);
      return;
    }
    
    // Apply smart logic
    if (isCornerMode) {
      processSmartCornerMark(cell, num, shouldRemove);
    } else if (isCenterMode) {
      processSmartCenterMark(cell, number, shouldRemove);
    }
  });
}

// Helper function for smart corner mark processing
function processSmartCornerMark(cell, num, shouldRemove) {
  // Save state before action for history
  const beforeState = saveCellState(cell);
  
  // PRESERVE existing center marks
  const existingCenterMarks = getCenterPencilMarks(cell);
  
  // Get current corner marks
  const pencilMarks = [];
  const subcells = cell.querySelectorAll('.subcell');
  subcells.forEach(subcell => {
    if (subcell.textContent) {
      pencilMarks.push(parseInt(subcell.textContent, 10));
    }
  });
  
  // Apply smart logic
  const index = pencilMarks.indexOf(num);
  if (shouldRemove && index !== -1) {
    // Remove the mark
    pencilMarks.splice(index, 1);
  } else if (!shouldRemove && index === -1) {
    // Add the mark
    pencilMarks.push(num);
    pencilMarks.sort((a, b) => a - b);
  }
  // If shouldRemove is true but mark doesn't exist, or if !shouldRemove but mark exists, do nothing
  
  // Clear all subcells
  subcells.forEach(subcell => subcell.remove());
  
  // Clear any text content
  const textNodes = Array.from(cell.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
  textNodes.forEach(node => node.remove());
  
  // Redistribute sorted numbers to corner subcells
  for (let i = 0; i < pencilMarks.length && i < cornerSubcellOrder.length; i++) {
    const subcell = document.createElement('div');
    const position = cornerSubcellOrder[i];
    subcell.className = `subcell sc${position}`;
    subcell.textContent = pencilMarks[i];
    cell.appendChild(subcell);
  }
  
  // RESTORE center marks
  if (existingCenterMarks.length > 0) {
    updateCenterPencilMarksForCell(cell, existingCenterMarks);
  }
  
  // Save state after action for history
  const afterState = saveCellState(cell);
  addToHistory(beforeState, afterState, 'smart_corner_mark');
}

// Helper function for smart center mark processing  
function processSmartCenterMark(cell, number, shouldRemove) {
  // Save state before action for history
  const beforeState = saveCellState(cell);
  
  // Get current center marks for this cell
  let marks = getCenterPencilMarks(cell);
  
  // Apply smart logic
  const numStr = number.toString();
  const index = marks.indexOf(numStr);
  
  if (shouldRemove && index !== -1) {
    // Remove the mark
    marks.splice(index, 1);
  } else if (!shouldRemove && index === -1) {
    // Add the mark
    marks.push(numStr);
  }
  // If shouldRemove is true but mark doesn't exist, or if !shouldRemove but mark exists, do nothing
  
  // Update the display
  updateCenterPencilMarksForCell(cell, marks);
  
  // Save state after action for history
  const afterState = saveCellState(cell);
  addToHistory(beforeState, afterState, 'smart_center_mark');
}

// Function to process number input for a single cell
// Helper function to check if a cell has a solid number (not just pencil marks)
function hasSolidNumber(cell) {
  // If cell has subcells/center marks, then any textContent beyond those is a solid number
  const hasSubcells = cell.querySelectorAll('.subcell, .merged-center, .center-number').length > 0;
  
  if (hasSubcells) {
    // Cell has pencil marks - in a properly structured cell, there should be no solid number mixed with pencil marks
    // The game design should prevent this, so if there are subcells, assume no solid number
    return false;
  } else {
    // No pencil marks - check if there's a solid number
    const textContent = cell.textContent.trim();
    return textContent !== '' && /^[1-9]$/.test(textContent);
  }
}

function processNumberInput(cell, number, isSolidMode, isCornerMode, isCenterMode) {
  // Protection: Prevent pencil marks from being added to cells with blue solid numbers (preset numbers)
  if ((isCornerMode || isCenterMode) && cell.classList.contains('preset')) {
    // Don't allow pencil marks on preset cells - give visual feedback
    cell.style.border = '2px solid red';
    setTimeout(() => {
      cell.style.border = '';
    }, 500);
    return;
  }
  
  // Protection: Prevent pencil marks from being added to cells with ANY solid number
  if ((isCornerMode || isCenterMode) && hasSolidNumber(cell)) {
    // Don't allow pencil marks on cells with solid numbers - give visual feedback
    cell.style.border = '2px solid red';
    setTimeout(() => {
      cell.style.border = '';
    }, 500);
    return;
  }
  
  // Protection: Prevent solid numbers from replacing blue solid numbers (preset numbers)
  if (isSolidMode && cell.classList.contains('preset')) {
    // Don't allow solid number replacement on preset cells - give visual feedback
    cell.style.border = '2px solid red';
    setTimeout(() => {
      cell.style.border = '';
    }, 500);
    return;
  }
  
  // Save state before action for history
  const beforeState = saveCellState(cell);
  
  if (isSolidMode) {
    // For solid mode, always clear pencil marks first and then add the solid number
    // Clear any existing subcells and center marks when in Solid mode
    const existingSubcells = cell.querySelectorAll('.subcell, .merged-center, .center-number');
    existingSubcells.forEach(el => el.remove());
    
    // Check if the cell already contains the same solid number - if so, delete it (only for user-entered numbers)
    const currentText = cell.textContent.trim();
    if (currentText === number.toString() && !cell.classList.contains('preset')) {
      // Clear the cell content (only if it's not a preset number)
      cell.textContent = '';
      cell.style.color = '';
      cell.style.fontWeight = '';
      cell.style.fontSize = '';
      
      // Remove from preSaveNumbers set if it was there
      const cellIndex = Array.from(grid.children).indexOf(cell);
      preSaveNumbers.delete(cellIndex);
    } else if (!cell.classList.contains('preset')) {
      // Set the solid number (only if it's not a preset cell)
      cell.textContent = number;
      // Always set color based on preset class
      if (cell.classList.contains('preset')) {
        cell.style.color = 'black';
      } else {
        cell.style.color = 'blue';
      }
      // Make sure to remove preset class for user-filled numbers
      if (number && !cell.classList.contains('preset')) {
        cell.classList.remove('preset');
      }
      // Track the cell index for potential future use
      const cellIndex = Array.from(grid.children).indexOf(cell);
      preSaveNumbers.add(cellIndex);
      cell.style.fontWeight = 'normal';
      cell.style.fontSize = '1.5em';
      
      // Check for conflicts after updating the cell
      checkForDuplicates();
    }
  } 
  else if (isCornerMode) {
    // PRESERVE existing center marks - don't clear them
    const existingCenterMarks = getCenterPencilMarks(cell);
    
    // Get all current pencil marks
    const pencilMarks = [];
    const subcells = cell.querySelectorAll('.subcell');
    
    // Collect existing pencil marks
    subcells.forEach(subcell => {
      if (subcell.textContent) {
        pencilMarks.push(parseInt(subcell.textContent, 10));
      }
    });
    
    // Toggle the number - add if not present, remove if present
    if (number) {
      const num = parseInt(number, 10);
      const index = pencilMarks.indexOf(num);
      if (index === -1) {
        // Number not present - add it
        pencilMarks.push(num);
        pencilMarks.sort((a, b) => a - b);
      } else {
        // Number already present - remove it
        pencilMarks.splice(index, 1);
      }
    }
    
    // Clear all subcells
    subcells.forEach(subcell => subcell.remove());
    
    // Clear any text content
    const textNodes = Array.from(cell.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
    textNodes.forEach(node => node.remove());
    
    // Redistribute sorted numbers to corner subcells
    for (let i = 0; i < pencilMarks.length && i < cornerSubcellOrder.length; i++) {
      const subcell = document.createElement('div');
      const position = cornerSubcellOrder[i];
      subcell.className = `subcell sc${position}`;
      subcell.textContent = pencilMarks[i];
      cell.appendChild(subcell);
    }
    
    // RESTORE center marks after adding corner marks
    if (existingCenterMarks.length > 0) {
      updateCenterPencilMarksForCell(cell, existingCenterMarks);
    }
  }
  // Handle Center mode - strictly within mc area
  else if (isCenterMode) {
    // Get current center marks for this cell
    let marks = getCenterPencilMarks(cell);
    
    // Toggle the number in center marks
    const num = parseInt(number, 10);
    if (!isNaN(num)) {
      const numStr = num.toString();
      const index = marks.indexOf(numStr);
      
      if (index === -1) {
        // Add the number if it's not already there
        marks.push(numStr);
      } else {
        // Remove the number if it's already there (toggle behavior)
        marks.splice(index, 1);
      }
      
      // Update center marks for this cell
      updateCenterPencilMarksForCell(cell, marks);
    }
  }
  
  // Save state after action for history
  const afterState = saveCellState(cell);
  const actionType = isSolidMode ? 'solid' : (isCornerMode ? 'corner' : 'center');
  addToHistory(beforeState, afterState, actionType);
  
  // Check for duplicates and pencil mark conflicts after number is entered
  checkForDuplicates();
  checkPencilMarkConflicts();
  
  // Update number pad button states
  updateNumberPadStates();
}

// 🔢 Insert number on number pad button click
document.querySelectorAll('.number-pad-btn').forEach(button => {
  button.addEventListener('click', () => {
    const number = button.textContent;
    const isSolidMode = window.selectedButton && window.selectedButton.textContent.trim() === 'Solid';
    const isCornerMode = window.selectedButton && window.selectedButton.textContent.trim() === 'Corner';
    const isCenterMode = window.selectedButton && window.selectedButton.textContent.trim() === 'Center';
    
    // Get all selected cells
    const selectedCells = document.querySelectorAll('.cell.selected');
    
    if (selectedCells.length === 0) {
      // If no cells are selected, select the first empty cell if available
      const emptyCell = document.querySelector('.cell:not(.preset):not(:has(> *))');
      if (emptyCell) {
        selectCell(emptyCell);
        processNumberInput(emptyCell, number, isSolidMode, isCornerMode, isCenterMode);
      }
      return;
    }
    
    // Use smart pencil mark logic for corner and center modes
    if (isCornerMode || isCenterMode) {
      processSmartPencilMarks(selectedCells, number, isCornerMode, isCenterMode);
    } else {
      // Process solid mode
      selectedCells.forEach(cell => {
        // Skip preset cells (black solid numbers - core puzzle)
        if (cell.classList.contains('preset')) {
          return;
        }
        
        // For single cell selection, allow deletion of existing solid numbers
        // For multiple cell selection, skip cells that already have solid numbers
        if (selectedCells.length > 1 && hasSolidNumber(cell)) {
          return;
        }
        
        // Process the cell (allows deletion when single cell, or insertion when empty)
        processNumberInput(cell, number, isSolidMode, isCornerMode, isCenterMode);
      });
    }
    
    // Check for conflicts after updating cells
    checkForDuplicates();
    checkPencilMarkConflicts();
    
    // Update number pad button states
    updateNumberPadStates();
  });
});

// Initialize button functionality after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing buttons...');
  
  // Del3 button functionality - Clear selected cell's content (solid number and pencil marks)
  const del3Button = document.getElementById('del3Btn');
  
  if (del3Button) {
    console.log('Del3 button found:', del3Button);
    del3Button.addEventListener('click', () => {
      console.log('Del3 button clicked');
      
      if (selectedCell) {
        // Save state for undo
        const beforeState = saveCellState(selectedCell);
        
        // Clear the cell's content
        selectedCell.textContent = ''; // Clear solid number
        
        // Remove all pencil marks (center and corner)
        const marksToRemove = selectedCell.querySelectorAll('.center-number, .subcell');
        marksToRemove.forEach(mark => mark.remove());
        
        // Clear any highlights
        clearHighlights();
        
        // Check for conflicts after deletion
        checkForDuplicates();
        checkPencilMarkConflicts();
        
        // Save state after changes
        const afterState = saveCellState(selectedCell);
        
        // Add to history for undo functionality
        addToHistory(beforeState, afterState, 'delete');
        checkPencilMarkConflicts();
        
        // Update number pad button states
        updateNumberPadStates();
      }
    });
  } else {
    console.log('Del3 button not found');
  }
  
  // Undo button functionality
  const undoButton = document.getElementById('undoBtn');
  
  if (undoButton) {
    console.log('Undo button found:', undoButton);
    undoButton.addEventListener('click', () => {
      console.log('Undo button clicked');
      performUndo();
    });
  } else {
    console.log('Undo button not found');
  }
  
  // Redo button functionality
  const redoButton = document.getElementById('redoBtn');
  
  if (redoButton) {
    console.log('Redo button found:', redoButton);
    redoButton.addEventListener('click', () => {
      console.log('Redo button clicked');
      performRedo();
    });
  } else {
    console.log('Redo button not found');
  }
});

// 💾 FIXED: Handle Save button click behavior with proper color management
document.getElementById('saveBtn').addEventListener('click', () => {
  const saveBtn = document.getElementById('saveBtn');
  const openB1Btn = document.getElementById('openB1Btn');
  const colorButtons = document.getElementById('color-buttons');

  // Mark all current solid numbers as preset (imported)
  document.querySelectorAll('.cell').forEach((cell, index) => {
    // Only mark cells with main text content (solid numbers) as preset
    if (cell.textContent && !cell.querySelector('.subcell, .merged-center, .center-number')) {
      cell.classList.add('preset');
      // Keep imported numbers black
      cell.style.color = 'black';
    }
  });
  
  // Set the puzzle as saved - future solid numbers will be blue
  isPuzzleSaved = true;
  isPostSaveMode = true;

  // Hide/show appropriate buttons
  if (saveBtn) saveBtn.style.visibility = 'hidden';
  if (openB1Btn) openB1Btn.style.visibility = 'hidden';
  if (colorButtons) colorButtons.style.display = 'flex';
  
  // Start the timer when save is clicked
  if (!isTimerStarted) {
    isTimerStarted = true;
    startTimer();
  }
  
  console.log('Puzzle saved. Pre-save numbers remain black, new numbers will be blue.');
});

// FIXED: Function to check for and highlight conflicting pencil marks with solid numbers ONLY
function checkPencilMarkConflicts() {
  console.log('=== START checkPencilMarkConflicts ===');
  
  // First, reset all pencil marks to default color
  const allPencilMarks = document.querySelectorAll('.subcell, .center-number');
  allPencilMarks.forEach(el => {
    if (el.textContent) {
      el.classList.remove('conflict');
      el.style.color = '';  // Reset to default color
    }
  });
  
  // FIXED: Get all cells with solid numbers (cells with main text content)
  const solidCells = Array.from(document.querySelectorAll('.cell')).filter(cell => {
    // Check if cell has main text content (solid number)
    const mainText = cell.textContent ? cell.textContent.trim() : '';
    const hasMainNumber = mainText !== '' && /^[1-9]$/.test(mainText);
    return hasMainNumber;
  });
  
  console.log(`Found ${solidCells.length} cells with solid numbers`);
  
  // Create a map to store all solid numbers and their positions
  const solidNumbersMap = new Map();
  
  // Process each solid cell and store its number and position
  solidCells.forEach(cell => {
    const cellIndex = Array.from(grid.children).indexOf(cell);
    const value = cell.textContent.trim();
    if (value && /^[1-9]$/.test(value)) {
      solidNumbersMap.set(cellIndex, value);
      console.log(`Solid number ${value} found at cell ${cellIndex}`);
    }
  });
  
  // Create maps to track pencil mark counts in each row, column, and block
  const rowCornerMarks = Array(9).fill().map(() => new Map());
  const colCornerMarks = Array(9).fill().map(() => new Map());
  const boxCornerMarks = Array(9).fill().map(() => new Map());
  const rowCenterMarks = Array(9).fill().map(() => new Map());
  const colCenterMarks = Array(9).fill().map(() => new Map());
  const boxCenterMarks = Array(9).fill().map(() => new Map());
  
  // First pass: count all pencil marks in each row, column, and block
  document.querySelectorAll('.cell').forEach((cell, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);
    
    // Count corner pencil marks
    const cornerMarks = cell.querySelectorAll('.subcell');
    cornerMarks.forEach(mark => {
      const num = mark.textContent.trim();
      if (!num) return;
      
      // Count in row, column, and box
      rowCornerMarks[row].set(num, (rowCornerMarks[row].get(num) || 0) + 1);
      colCornerMarks[col].set(num, (colCornerMarks[col].get(num) || 0) + 1);
      boxCornerMarks[box].set(num, (boxCornerMarks[box].get(num) || 0) + 1);
    });
    
    // Count center pencil marks
    const centerMarks = cell.querySelectorAll('.center-number');
    centerMarks.forEach(mark => {
      const num = mark.textContent.trim();
      if (!num) return;
      
      // Count in row, column, and box
      rowCenterMarks[row].set(num, (rowCenterMarks[row].get(num) || 0) + 1);
      colCenterMarks[col].set(num, (colCenterMarks[col].get(num) || 0) + 1);
      boxCenterMarks[box].set(num, (boxCenterMarks[box].get(num) || 0) + 1);
    });
  });
  
  // Second pass: highlight duplicate pencil marks
  document.querySelectorAll('.cell').forEach((cell, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);
    
    // Highlight corner marks
    const cornerMarks = cell.querySelectorAll('.subcell');
    cornerMarks.forEach(mark => {
      const num = mark.textContent.trim();
      if (!num) return;
      
      // Check if this corner mark appears more than once in any group
      if ((rowCornerMarks[row].get(num) > 1) ||
          (colCornerMarks[col].get(num) > 1) ||
          (boxCornerMarks[box].get(num) > 1)) {
        mark.style.color = 'blue';
      }
    });
    
    // Highlight center marks
    const centerMarks = cell.querySelectorAll('.center-number');
    centerMarks.forEach(mark => {
      const num = mark.textContent.trim();
      if (!num) return;
      
      // Check if this center mark appears more than once in any group
      if ((rowCenterMarks[row].get(num) > 1) ||
          (colCenterMarks[col].get(num) > 1) ||
          (boxCenterMarks[box].get(num) > 1)) {
        mark.style.color = 'blue';
      }
    });
  });
  
  // Third pass: check for conflicts with solid numbers (for all pencil marks)
  let totalConflicts = 0;
  document.querySelectorAll('.cell').forEach(cell => {
    // Get all pencil marks in this cell
    const pencilMarks = cell.querySelectorAll('.subcell, .center-number');
    
    if (pencilMarks.length === 0) return; // Skip cells without pencil marks
    
    const cellIndex = Array.from(grid.children).indexOf(cell);
    const row = Math.floor(cellIndex / 9);
    const col = cellIndex % 9;
    const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);
    
    // Get all related cells (same row, column, or box)
    const relatedCells = getRelatedCells(cell);
    
    // Check each related cell for solid numbers
    relatedCells.forEach(relatedCell => {
      const relatedIndex = Array.from(grid.children).indexOf(relatedCell);
      const solidValue = solidNumbersMap.get(relatedIndex);
      
      if (solidValue) {
        // Check each pencil mark in the current cell
        pencilMarks.forEach(mark => {
          const markValue = mark.textContent.trim();
          if (markValue !== solidValue) return;
          
          const isCornerMark = mark.classList.contains('subcell');
          const isCenterMark = mark.classList.contains('center-number');
          
          // Check if this is a duplicate mark that should be blue instead of red
          const isDuplicateMark = 
            (isCornerMark && (
              (rowCornerMarks[row].get(markValue) > 1) ||
              (colCornerMarks[col].get(markValue) > 1) ||
              (boxCornerMarks[box].get(markValue) > 1)
            )) ||
            (isCenterMark && (
              (rowCenterMarks[row].get(markValue) > 1) ||
              (colCenterMarks[col].get(markValue) > 1) ||
              (boxCenterMarks[box].get(markValue) > 1)
            ));
          
          // If it's a duplicate mark, keep it blue, otherwise mark as conflict (red)
          if (isDuplicateMark) {
            mark.style.color = 'blue';
          } else {
            mark.classList.add('conflict');
            mark.style.color = 'red';
            totalConflicts++;
            console.log(`Found conflict: Pencil mark ${solidValue} in cell ${cellIndex} conflicts with solid number in cell ${relatedIndex}`);
          }
        });
      }
    });
  });
  
  console.log(`Total conflicts found: ${totalConflicts}`);
  console.log('=== END checkPencilMarkConflicts ===\n');
}

// Function to clear all number highlights and selections
function clearHighlights() {
  // Clear highlights from all cells
  document.querySelectorAll('.cell').forEach(cell => {
    cell.classList.remove('highlight-same-number');
    cell.classList.remove('selected');
  });
  // Also clear any selected subcells or center numbers
  document.querySelectorAll('.subcell.selected, .center-number.selected').forEach(el => {
    el.classList.remove('selected');
  });
  selectedCell = null;
  hasMultipleSelections = false;
}

// Helper function to get all numbers from a cell (solid number + pencil marks)
function getAllNumbersFromCell(cell) {
  const numbers = new Set();
  
  // Get solid number (main text content)
  const mainText = cell.textContent ? cell.textContent.trim() : '';
  if (mainText !== '' && /^[1-9]$/.test(mainText)) {
    numbers.add(mainText);
  }
  
  // Get corner marks (subcells)
  const cornerMarks = cell.querySelectorAll('.subcell');
  cornerMarks.forEach(mark => {
    const num = mark.textContent.trim();
    if (num && /^[1-9]$/.test(num)) {
      numbers.add(num);
    }
  });
  
  // Get center marks
  const centerMarks = cell.querySelectorAll('.center-number');
  centerMarks.forEach(mark => {
    const num = mark.textContent.trim();
    if (num && /^[1-9]$/.test(num)) {
      numbers.add(num);
    }
  });
  
  return Array.from(numbers);
}

// Function to update number pad button states based on completion
function updateNumberPadStates() {
  const cells = document.querySelectorAll('.cell');
  
  // Count solid numbers for each value (1-9)
  const solidCounts = {};
  for (let i = 1; i <= 9; i++) {
    solidCounts[i] = 0;
  }
  
  cells.forEach(cell => {
    if (hasSolidNumber(cell)) {
      const number = cell.textContent.trim();
      if (number && /^[1-9]$/.test(number)) {
        solidCounts[parseInt(number)]++;
      }
    }
  });
  
  // Update number pad button styles
  for (let i = 1; i <= 9; i++) {
    // Find button by class and text content instead of ID
    const buttons = document.querySelectorAll('.number-pad-btn');
    const button = Array.from(buttons).find(btn => btn.textContent.trim() === i.toString());
    
    if (button) {
      if (solidCounts[i] >= 9) {
        button.style.backgroundColor = '#d3d3d3'; // Light grey
        button.style.color = '#888';
      } else {
        // Reset to default styles
        button.style.backgroundColor = '';
        button.style.color = '';
      }
    }
  }
}

// Function to check if puzzle is completed and stop timer
function checkPuzzleCompletion() {
  const cells = document.querySelectorAll('.cell');
  
  // Check if all 81 cells have solid numbers
  let solidNumberCount = 0;
  let hasConflicts = false;
  
  cells.forEach(cell => {
    if (hasSolidNumber(cell)) {
      solidNumberCount++;
      
      // Check if this cell has a red color (conflict)
      if (cell.style.color === 'red' || cell.classList.contains('duplicate')) {
        hasConflicts = true;
      }
    }
  });
  
  // If all 81 cells are filled with solid numbers and no conflicts exist
  if (solidNumberCount === 81 && !hasConflicts) {
    console.log('🎉 Puzzle completed! Stopping timer...');
    
    // Stop the timer
    stopTimer();
    
    // Update pause button to show completion state
    const pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn) {
      pauseBtn.textContent = '✅';
      pauseBtn.title = 'Puzzle Completed!';
      pauseBtn.style.backgroundColor = '#4CAF50';
      pauseBtn.style.color = 'white';
    }
    
    // Optional: Show completion message
    setTimeout(() => {
      alert('🎉 Congratulations! Puzzle completed successfully! 🎉');
    }, 500);
    
    return true; // Puzzle is completed
  }
  
  return false; // Puzzle is not completed
}

// Function to reset pause button to normal state
function resetPauseButton() {
  const pauseBtn = document.getElementById('pauseBtn');
  if (pauseBtn) {
    pauseBtn.textContent = '⏸️';
    pauseBtn.title = 'Pause';
    pauseBtn.style.backgroundColor = '';
    pauseBtn.style.color = '';
  }
}

// Debug function to log current settings
function logCurrentSettings() {
  console.log('--- CURRENT SETTINGS ---');
  console.log('window.sudokuSettings:', window.sudokuSettings);
  
  const savedSettings = localStorage.getItem('sudokuSettings');
  console.log('localStorage sudokuSettings:', savedSettings);
  
  try {
    const parsedSettings = savedSettings ? JSON.parse(savedSettings) : {};
    console.log('Parsed settings:', parsedSettings);
    console.log('highlightPencilMarks from localStorage:', parsedSettings.highlightPencilMarks);
  } catch (e) {
    console.error('Error parsing settings:', e);
  }
  
  const checkbox = document.getElementById('highlightPencilMarks');
  console.log('Checkbox state - checked:', checkbox ? checkbox.checked : 'not found');
  console.log('------------------------');
}

// Function to highlight cells with the same number as the clicked cell
function highlightSameNumberCells(clickedCell, fromDoubleClick = false, highlightPencilMarks = null) {
  console.log('--- highlightSameNumberCells called ---');
  logCurrentSettings(); // Log current settings state
  
  // Get the current setting - prioritize the parameter, then global state
  const shouldHighlightPencilMarks = highlightPencilMarks !== null 
    ? highlightPencilMarks 
    : getHighlightPencilMarksSetting();
  
  console.log('Highlight Pencil Marks setting (from state):', shouldHighlightPencilMarks);
  
  // Get the cell content
  const cellText = clickedCell.textContent.trim();
  const isSolidNumber = /^[1-9]$/.test(cellText);
  
  // If we're not highlighting pencil marks and the clicked cell is not a solid number, ignore it
  if (!shouldHighlightPencilMarks && !isSolidNumber) {
    console.log('Clicked cell has no solid number and pencil marks are disabled - ignoring');
    return;
  }
  
  // If the cell is empty, return
  if (!cellText || cellText === '') return;

  // Check if we're toggling off the highlight for this number
  if (clickedCell.classList.contains('highlight-same-number')) {
    clearHighlights();
    return;
  }
  
  // Clear previous highlights
  clearHighlights();
  
  // Clear all selections first
  document.querySelectorAll('.cell.selected').forEach(c => {
    c.classList.remove('selected');
  });
  
  // Select the clicked cell
  clickedCell.classList.add('selected');
  selectedCell = clickedCell;
  
  // Find and highlight all cells that contain the same number
  const allCells = document.querySelectorAll('.cell');
  let foundMatchingCells = false;
  const targetNumber = cellText;
  
  console.log('--- Highlighting Debug ---');
  console.log('Clicked cell content:', clickedCell.textContent.trim());
  console.log('Looking for number:', targetNumber);
  console.log('Highlight Pencil Marks setting:', shouldHighlightPencilMarks);
  console.log('Is solid number:', isSolidNumber);
  
  allCells.forEach((cell, index) => {
    if (cell === clickedCell) {
      console.log(`Skipping clicked cell at index ${index}`);
      return; // Skip the clicked cell
    }
    
    const cellContent = cell.textContent.trim();
    const isCellSolidNumber = /^[1-9]$/.test(cellContent);
    
    console.log(`Cell ${index}:`, {
      cellContent: cellContent || '(empty)',
      isCellSolidNumber,
      hasPencilMarks: cell.querySelectorAll('.subcell, .center-number').length > 0
    });
    
    // Always highlight solid numbers that match
    if (isCellSolidNumber && cellContent === targetNumber) {
      cell.classList.add('highlight-same-number');
      foundMatchingCells = true;
      console.log(`  ✓ Highlighting SOLID number ${cellContent} in cell ${index}`);
      return; // Move to next cell
    }
    
    // If pencil mark highlighting is off, skip the rest
    if (!shouldHighlightPencilMarks) {
      return;
    }
    
    // Check for pencil marks if we get here (pencil marks are enabled)
    if (!isCellSolidNumber) {
      // Check corner marks
      const cornerMarks = cell.querySelectorAll('.subcell');
      for (const mark of cornerMarks) {
        if (mark.textContent.trim() === targetNumber) {
          cell.classList.add('highlight-same-number');
          foundMatchingCells = true;
          console.log(`  ✓ Highlighting CORNER pencil mark ${targetNumber} in cell ${index}`);
          return; // Found a match, move to next cell
        }
      }
      
      // Check center marks if no corner mark found
      const centerMarks = cell.querySelectorAll('.center-number');
      for (const mark of centerMarks) {
        if (mark.textContent.trim() === targetNumber) {
          cell.classList.add('highlight-same-number');
          foundMatchingCells = true;
          console.log(`  ✓ Highlighting CENTER pencil mark ${targetNumber} in cell ${index}`);
          return; // Found a match, move to next cell
        }
      }
    }
  });
  
  // If no matching cells found, just highlight the clicked cell
  if (!foundMatchingCells) {
    clickedCell.classList.add('highlight-same-number');
  }
}

// Function to get all cells in the same row, column, and block as the given cell
function getRelatedCells(cell) {
    const cells = [];
    const index = Array.from(grid.children).indexOf(cell);
    const row = Math.floor(index / 9);
    const col = index % 9;
    
    // Get all cells in the same row
    for (let c = 0; c < 9; c++) {
        const cellIndex = row * 9 + c;
        if (cellIndex !== index) {
            cells.push(grid.children[cellIndex]);
        }
    }
    
    // Get all cells in the same column
    for (let r = 0; r < 9; r++) {
        const cellIndex = r * 9 + col;
        if (cellIndex !== index) {
            cells.push(grid.children[cellIndex]);
        }
    }
    
    // Get all cells in the same 3x3 box
    const boxStartRow = Math.floor(row / 3) * 3;
    const boxStartCol = Math.floor(col / 3) * 3;
    
    for (let r = boxStartRow; r < boxStartRow + 3; r++) {
        for (let c = boxStartCol; c < boxStartCol + 3; c++) {
            const cellIndex = r * 9 + c;
            if (cellIndex !== index) {
                cells.push(grid.children[cellIndex]);
            }
        }
    }
    
    return cells;
}

// Function to check for and highlight duplicate numbers
function checkForDuplicates() {
    console.log('=== RUNNING checkForDuplicates ===');
    
    // First reset ALL cells to their original colors and remove duplicate class
    document.querySelectorAll('.cell').forEach(cell => {
        // Remove duplicate class from all cells
        cell.classList.remove('duplicate');
        
        // Only reset color for cells with solid numbers (main text content)
        const hasMainNumber = cell.textContent.trim() && 
                             !cell.querySelector('.subcell') && 
                             !cell.querySelector('.center-number');
        
        if (hasMainNumber) {
            // Reset to original color based on preset status
            if (cell.classList.contains('preset')) {
                cell.style.color = 'black';
            } else {
                cell.style.color = 'blue';
            }
        }
    });
    
    let foundDuplicates = false;
    const processedCells = new Set(); // Track processed cells to avoid double-counting
    
    // Check each cell with solid numbers
    document.querySelectorAll('.cell').forEach((cell, index) => {
        // Only check cells with main text content (solid numbers)
        const hasMainNumber = cell.textContent.trim() && 
                             !cell.querySelector('.subcell') && 
                             !cell.querySelector('.center-number');
        
        if (hasMainNumber && !processedCells.has(cell)) {
            const value = cell.textContent.trim();
            console.log(`Checking cell ${index} with value: ${value}`);
            const relatedCells = getRelatedCells(cell);
            
            // Check if any related cell has the same value
            const duplicates = relatedCells.filter(relatedCell => {
                if (processedCells.has(relatedCell)) return false; // Skip already processed cells
                
                const relatedHasMainNumber = relatedCell.textContent.trim() && 
                                           !relatedCell.querySelector('.subcell') && 
                                           !relatedCell.querySelector('.center-number');
                return relatedHasMainNumber && relatedCell.textContent.trim() === value;
            });
            
            if (duplicates.length > 0) {
                foundDuplicates = true;
                console.log(`*** DUPLICATE FOUND *** Cell ${index} (value: ${value}) has ${duplicates.length} duplicates`);
                
                // Highlight this cell and all its duplicates in red
                cell.style.color = 'red';
                cell.classList.add('duplicate');
                processedCells.add(cell);
                console.log(`Set cell ${index} to red`);
                
                duplicates.forEach((dup) => {
                    const dupCellIndex = Array.from(grid.children).indexOf(dup);
                    dup.style.color = 'red';
                    dup.classList.add('duplicate');
                    processedCells.add(dup);
                    console.log(`Set duplicate cell ${dupCellIndex} to red`);
                });
                
                // Decrement error counter for each new conflict found
                if (errorCount > 0) {
                    errorCount--;
                    console.log(`Decrementing error counter to ${errorCount}`);
                    updateErrorCounterDisplay();
                }
            }
            
            // Mark this cell as processed
            processedCells.add(cell);
        }
    });
    
    if (!foundDuplicates) {
        console.log('No duplicates found');
    }
    
    console.log('=== END checkForDuplicates ===');
    
    // Check if puzzle is completed after checking for duplicates
    checkPuzzleCompletion();
}

// Button selection functionality for Solid, Corner, and Center buttons
function initializeButtonSelection() {
  console.log('Initializing button selection...');
  const buttons = document.querySelectorAll('.side-btn.merged-fg');
  console.log('Found buttons:', buttons.length);
  
  if (buttons.length === 0) {
    console.log('No buttons found, retrying in 500ms...');
    setTimeout(initializeButtonSelection, 500);
    return;
  }
  
  buttons.forEach((button, index) => {
    console.log(`Setting up button ${index + 1}:`, button.textContent.trim());
    
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const buttonText = this.textContent.trim();
      console.log('Button clicked:', buttonText);
      
      // Remove selected class from all buttons first
      buttons.forEach(btn => {
        btn.classList.remove('selected');
        btn.style.borderColor = '';
        btn.style.boxShadow = '';
      });
      
      // Select the clicked button
      this.classList.add('selected');
      this.style.borderColor = '#0078d7';
      this.style.boxShadow = '0 0 0 2px #0078d7';
      window.selectedButton = this;
      
      // Handle mode-specific initialization
      if (buttonText === 'Corner') {
        // Reset to first corner position
        currentSubcellPosition = cornerSubcellOrder[0];
        // DON'T clear center pencil marks when switching to Corner mode
        // Load existing center marks if they exist
        if (selectedCell) {
          const existingCenterMarks = selectedCell.querySelectorAll('.center-number');
          centerPencilMarks = Array.from(existingCenterMarks).map(el => el.textContent);
        }
      } else if (buttonText === 'Center') {
        // Initialize center mode
        currentSubcellPosition = 0;
        // DON'T clear existing corner subcells when switching to Center mode
        // Load existing center marks if they exist
        if (selectedCell) {
          const existingCenterMarks = selectedCell.querySelectorAll('.center-number');
          centerPencilMarks = Array.from(existingCenterMarks).map(el => el.textContent);
        }
      } else if (buttonText === 'Solid') {
        // Clear any subcell highlights when switching to Solid mode
        currentSubcellPosition = 0;
        centerPencilMarks = [];
      }
      
      console.log('Button selected:', buttonText);
    });
  });
  
  // Auto-select Solid button on page load
  const solidButton = Array.from(buttons).find(btn => btn.textContent.trim() === 'Solid');
  if (solidButton) {
    solidButton.classList.add('selected');
    solidButton.style.borderColor = '#0078d7';
    solidButton.style.boxShadow = '0 0 0 2px #0078d7';
    window.selectedButton = solidButton;
    console.log('Auto-selected Solid button');
  } else {
    console.log('Solid button not found!');
  }
}

// Variables to store the grid state for toggling
let gridState = [];
let isGridCleared = false;

// Function to save the current grid state
function saveGridState() {
  gridState = [];
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    // Skip cells that are preset (black numbers)
    if (cell.classList.contains('preset')) return;
    
    // Save cell state
    const cellState = {
      cell: cell,
      textContent: cell.textContent,
      color: cell.style.color,
      fontWeight: cell.style.fontWeight,
      fontSize: cell.style.fontSize,
      subcells: [],
      centerMarks: []
    };
    
    // Save subcells (corner pencil marks)
    const subcells = cell.querySelectorAll('.subcell');
    subcells.forEach(subcell => {
      cellState.subcells.push({
        className: subcell.className,
        textContent: subcell.textContent
      });
    });
    
    // Save center pencil marks
    const centerMarks = cell.querySelectorAll('.center-number');
    centerMarks.forEach(mark => {
      cellState.centerMarks.push({
        className: mark.className,
        textContent: mark.textContent
      });
    });
    
    gridState.push(cellState);
  });
}

// Function to restore the grid state
function restoreGridState() {
  if (gridState.length === 0) return;
  
  gridState.forEach(state => {
    const cell = state.cell;
    
    // First, clear the cell completely
    cell.textContent = '';
    cell.style.color = state.color;
    cell.style.fontWeight = state.fontWeight;
    cell.style.fontSize = state.fontSize;
    
    // Only set the main cell text if it's a solid number (not a pencil mark)
    if (state.textContent && 
        (state.color === 'blue' || state.color === 'rgb(0, 0, 255)' || 
         state.color === 'black' || state.color === 'rgb(0, 0, 0)')) {
      cell.textContent = state.textContent;
    }
    
    // Clear existing subcells and center marks
    const existingSubcells = cell.querySelectorAll('.subcell');
    existingSubcells.forEach(subcell => subcell.remove());
    
    const existingCenterMarks = cell.querySelectorAll('.center-number');
    existingCenterMarks.forEach(mark => mark.remove());
    
    // Restore subcells (corner pencil marks)
    state.subcells.forEach(subcellState => {
      if (subcellState.textContent) {  // Only restore if there was content
        const subcell = document.createElement('div');
        subcell.className = subcellState.className;
        subcell.textContent = subcellState.textContent;
        cell.appendChild(subcell);
      }
    });
    
    // Restore center marks
    state.centerMarks.forEach(markState => {
      if (markState.textContent) {  // Only restore if there was content
        const mark = document.createElement('div');
        mark.className = markState.className;
        mark.textContent = markState.textContent;
        cell.appendChild(mark);
      }
    });
  });
  
  // Update center pencil marks display if needed
  if (selectedCell) {
    updateCenterPencilMarks();
  }
}

// FIXED: Function to toggle clear/restore grid
function toggleClearGrid() {
  const clearGridBtn = document.getElementById('clearGridBtn');
  
  if (!isGridCleared) {
    // First click: save state and clear the grid
    saveGridState();
    
    // Reset the timer to 00:00
    resetTimer();
    
    // Reset pause button to normal state
    resetPauseButton();
    
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
      // Skip cells that are preset (black numbers) - FIXED: Added return statement
      if (cell.classList.contains('preset')) return;
      
      // Clear blue solid numbers
      if (cell.style.color === 'blue' || cell.style.color === 'rgb(0, 0, 255)') {
        cell.textContent = '';
        cell.style.color = '';
        cell.style.fontWeight = '';
        cell.style.fontSize = '';
      }
      
      // Clear all subcells (corner pencil marks)
      const subcells = cell.querySelectorAll('.subcell');
      subcells.forEach(subcell => {
        subcell.textContent = '';
      });
      
      // Clear center pencil marks
      const centerMarks = cell.querySelectorAll('.center-number');
      centerMarks.forEach(mark => mark.remove());
    });
    
    // Keep CG text and change tooltip instead
    clearGridBtn.title = 'Restore Grid';
    isGridCleared = true;
  } else {
    // Second click: restore the grid
    restoreGridState();
    clearGridBtn.title = 'Clear Grid and reset timer to 00:00';
    isGridCleared = false;
  }
}

// Function to check for and highlight conflicting pencil marks with solid numbers
function checkPencilMarkConflicts() {
  // Don't reset colors in this function - let processNumberInput handle colors
  const allCells = document.querySelectorAll('.cell');
  
  // Check for conflicts in pencil marks only
  allCells.forEach((cell, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    const block = Math.floor(row / 3) * 3 + Math.floor(col / 3);

    // Skip if this is a solid number cell
    if (cell.textContent.trim() && !cell.querySelector('.subcell') && !cell.querySelector('.center-number')) {
      return;
    }

    // Only process cells with pencil marks
    const pencilMarks = cell.querySelectorAll('.subcell, .center-number');
    if (pencilMarks.length === 0) return;

    // Check each pencil mark for conflicts with solid numbers
    pencilMarks.forEach(mark => {
      const num = mark.textContent.trim();
      if (!num) return;
      
      let hasConflict = false;
      
      // Check all cells in the same row, column, and block
      for (let i = 0; i < 81; i++) {
        if (i === index) continue;
        
        const otherCell = allCells[i];
        const otherValue = otherCell.textContent.trim();
        const isOtherSolid = otherValue && !otherCell.querySelector('.subcell') && !otherCell.querySelector('.center-number');
        
        if (!isOtherSolid) continue;
        
        const r = Math.floor(i / 9);
        const c = i % 9;
        const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
        
        if ((r === row || c === col || b === block) && otherValue === num) {
          hasConflict = true;
          break;
        }
      }
      
      // Only update the pencil mark color
      mark.style.color = hasConflict ? 'red' : 'blue';
    });
  });
}

// Function to get the actual number from a cell, checking both direct text and any potential sub-elements
function getCellNumber(cell) {
  // First check if the cell has a direct text node with a number
  const directText = cell.textContent.trim();
  if (directText && /^[1-9]$/.test(directText)) {
    return directText;
  }
  
  // Check if there's a number in the main cell content (not in subcells)
  for (const node of cell.childNodes) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() && /^[1-9]$/.test(node.textContent.trim())) {
      return node.textContent.trim();
    }
  }
  
  return '0';
}

// Function to copy text to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
}

// Function to save the current puzzle to a file
function savePuzzleToFile() {
  try {
    console.log('Starting to save puzzle...');
    // Get puzzle data
    const cells = document.querySelectorAll('.cell');
    let puzzleString = '';
    
    console.log('Processing cells...');
    // Convert grid to string (0 for empty cells)
    cells.forEach((cell, index) => {
      // Get the cell's number value
      const cellValue = getCellNumber(cell);
      puzzleString += cellValue;
      
      console.log(`Cell ${index}: value = ${cellValue}`);
      
      // If this cell has a number, mark it as preset
      if (cellValue !== '0') {
        cell.classList.add('preset');
        cell.style.color = 'black';
        cell.style.fontWeight = 'bold';
      }
    });
    
    // Get puzzle metadata
    const title = document.getElementById('puzzleTitle')?.value || 'Untitled Puzzle';
    const author = document.getElementById('puzzleAuthor')?.value || 'Anonymous';
    const difficulty = document.getElementById('puzzleDifficulty')?.value || 'medium';
    const notes = document.getElementById('puzzleNotes')?.value || '';
    
    console.log('Creating puzzle data object...');
    // Create puzzle object
    const puzzleData = {
      version: '1.0',
      title: title,
      author: author,
      difficulty: difficulty,
      date: new Date().toISOString(),
      notes: notes,
      puzzle: puzzleString
    };
    
    console.log('Puzzle data:', puzzleData);
    
    // Format the data for the Solver Version
    const formattedData = `const EMBEDDED_PUZZLE = ${JSON.stringify(puzzleData, null, 2)};`;
    
    // Show the copy to clipboard dialog
    const userConfirmed = confirm('Puzzle saved!\n\n1. Open Solver Version\\index.html in a text editor\n2. Replace the EMBEDDED_PUZZLE section with the copied code\n3. Save the file\n\nClick OK to copy the puzzle data to clipboard.');
    
    if (userConfirmed) {
      // Copy to clipboard
      copyToClipboard(formattedData).then(success => {
        if (success) {
          alert('Puzzle data copied to clipboard!\n\nPaste it into the Solver Version\\index.html file.');
        } else {
          // Fallback if clipboard API fails
          prompt('Copy this code to Solver Version\\index.html:', formattedData);
        }
      });
    }
    
    // Still save the file as before
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(puzzleData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    
    // Create a filename with timestamp
    const timestamp = new Date().getTime();
    const filename = `sudoku_puzzle_${timestamp}.sdk`;
    downloadAnchorNode.setAttribute('download', filename);
    
    // Make sure the link is not displayed
    downloadAnchorNode.style.display = 'none';
    
    // Add to the document
    document.body.appendChild(downloadAnchorNode);
    
    console.log('Triggering download...');
    // Trigger the download
    downloadAnchorNode.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(downloadAnchorNode);
      console.log('Download cleanup complete');
    }, 100);
    
    console.log('Puzzle saved successfully as', filename);
    return true;
  } catch (error) {
    console.error('Error saving puzzle:', error);
    alert('Error saving puzzle: ' + error.message);
    return false;
  }
}

// Test function to manually check for conflicts from the browser console
window.testConflictDetection = function() {
  console.log('--- MANUAL CONFLICT DETECTION TEST ---');
  checkForDuplicates();
};

// Add event listener for Save button
document.getElementById('saveBtn').addEventListener('click', () => {
  // Mark all current solid numbers as preset to keep them black
  document.querySelectorAll('.cell').forEach(cell => {
    if (cell.textContent && !cell.querySelector('.subcell, .merged-center, .center-number')) {
      cell.classList.add('preset');
      cell.style.color = 'black';
    }
  });
  
  // Save the puzzle
  if (savePuzzleToFile()) {
    // Hide Save and Open buttons after saving
    const saveBtn = document.getElementById('saveBtn');
    const openBtn = document.getElementById('openB1Btn');
    if (saveBtn) saveBtn.style.visibility = 'hidden';
    if (openBtn) openBtn.style.visibility = 'hidden';
    
    // Start the timer
    if (!isTimerStarted) {
      isTimerStarted = true;
      window.isTimerStarted = true;
      startTimer();
    }
  }
});

// Add event listener for Clear Grid button
document.addEventListener('DOMContentLoaded', () => {
  // Add event listener for Clear Grid button
  const clearGridBtn = document.getElementById('clearGridBtn');
  if (clearGridBtn) {
    clearGridBtn.addEventListener('click', toggleClearGrid);
  }
});

// Initialize immediately and also set up backup initialization
setTimeout(initializeButtonSelection, 100);
setTimeout(initializeButtonSelection, 1000);

// Debug function to test conflict detection manually
window.debugConflicts = function() {
  console.log('=== MANUAL CONFLICT DEBUG ===');
  
  // Check all cells and their data attributes
  document.querySelectorAll('.cell').forEach((cell, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    const value = cell.textContent.trim();
    const hasMainNumber = value && !cell.querySelector('.subcell') && !cell.querySelector('.center-number');
    
    if (hasMainNumber) {
      console.log(`Cell ${index} (${row},${col}): "${value}" - data-row="${cell.dataset.row}", data-col="${cell.dataset.col}", preset=${cell.classList.contains('preset')}`);
    }
  });
  
  console.log('Calling checkForDuplicates...');
  checkForDuplicates();
  console.log('=== END CONFLICT DEBUG ===');
};

// Auto-test function to verify specific cells
window.testSpecificConflict = function(row1, col1, row2, col2, value) {
  console.log(`=== TESTING CONFLICT: (${row1},${col1}) and (${row2},${col2}) with value "${value}" ===`);
  
  const cell1 = document.querySelector(`.cell[data-row='${row1}'][data-col='${col1}']`);
  const cell2 = document.querySelector(`.cell[data-row='${row2}'][data-col='${col2}']`);
  
  if (!cell1 || !cell2) {
    console.log('One or both cells not found!');
    return;
  }
  
  // Set the values
  cell1.textContent = value;
  cell1.style.color = 'blue';
  cell1.classList.remove('preset');
  
  cell2.textContent = value;
  cell2.style.color = 'blue';
  cell2.classList.remove('preset');
  
  console.log(`Set cell (${row1},${col1}) to "${value}"`);
  console.log(`Set cell (${row2},${col2}) to "${value}"`);
  
  // Run conflict detection
  checkForDuplicates();
  
  console.log(`After conflict check:`);
  console.log(`Cell (${row1},${col1}) color: ${cell1.style.color}`);
  console.log(`Cell (${row2},${col2}) color: ${cell2.style.color}`);
  console.log('=== END TEST ===');
};

// Simple test to create an obvious conflict
window.createTestConflict = function() {
  console.log('=== CREATING TEST CONFLICT ===');
  
  // Clear the grid first
  document.querySelectorAll('.cell').forEach(cell => {
    cell.textContent = '';
    cell.style.color = '';
    cell.classList.remove('preset');
    const marks = cell.querySelectorAll('.subcell, .center-number, .merged-center');
    marks.forEach(mark => mark.remove());
  });
  
  // Create a simple conflict: two 5's in the same row
  const cell1 = document.querySelector('.cell[data-row="0"][data-col="0"]');
  const cell2 = document.querySelector('.cell[data-row="0"][data-col="1"]');
  
  if (cell1 && cell2) {
    cell1.textContent = '5';
    cell1.style.color = 'blue';
    cell1.classList.remove('preset');
    
    cell2.textContent = '5';
    cell2.style.color = 'blue';
    cell2.classList.remove('preset');
    
    console.log('Created two 5s in row 0, positions (0,0) and (0,1)');
    console.log('Running conflict detection...');
    checkForDuplicates();
    
    console.log(`Cell (0,0) color after check: ${cell1.style.color}`);
    console.log(`Cell (0,1) color after check: ${cell2.style.color}`);
  } else {
    console.log('Could not find cells for test');
  }
  
  console.log('=== END CREATE TEST ===');
};

// Test function to check specific cells for conflicts
function testSpecificConflict() {
  console.log('=== TESTING SPECIFIC CONFLICT ===');
  
  // Get the two cells in question
  const cell1 = document.querySelector('.cell[data-row="4"][data-col="6"]'); // r5c7 (0-based: 4,6)
  const cell2 = document.querySelector('.cell[data-row="4"][data-col="8"]'); // r5c9 (0-based: 4,8)
  
  console.log('Cell r5c7 (4,6):', {
    text: cell1?.textContent.trim(),
    hasSubcells: cell1?.querySelector('.subcell') !== null,
    hasCenterNumbers: cell1?.querySelector('.center-number') !== null,
    isSolidNumber: cell1?.textContent.trim() && 
                  !cell1?.querySelector('.subcell') && 
                  !cell1?.querySelector('.center-number')
  });
  
  console.log('Cell r5c9 (4,8):', {
    text: cell2?.textContent.trim(),
    hasSubcells: cell2?.querySelector('.subcell') !== null,
    hasCenterNumbers: cell2?.querySelector('.center-number') !== null,
    isSolidNumber: cell2?.textContent.trim() && 
                  !cell2?.querySelector('.subcell') && 
                  !cell2?.querySelector('.center-number')
  });
  
  // Manually check for conflicts in their row
  console.log('\n=== CHECKING ROW 5 ===');
  const rowCells = getRowCells(4); // 0-based row 4 = row 5
  const rowValues = rowCells.map(cell => ({
    row: cell.dataset.row,
    col: cell.dataset.col,
    value: cell.textContent.trim() || '.',
    isSolid: cell.textContent.trim() && 
             !cell.querySelector('.subcell') && 
             !cell.querySelector('.center-number')
  }));
  console.log('Row 5 values:', rowValues);
  
  // Manually check for conflicts in their block
  console.log('\n=== CHECKING BLOCK (3,6) ===');
  const blockCells = getBlockCells(3, 6); // Block starting at row 3, col 6 (0-based)
  const blockValues = blockCells.map(cell => ({
    row: cell.dataset.row,
    col: cell.dataset.col,
    value: cell.textContent.trim() || '.',
    isSolid: cell.textContent.trim() && 
             !cell.querySelector('.subcell') && 
             !cell.querySelector('.center-number')
  }));
  console.log('Block values:', blockValues);
  
  // Force a conflict check
  console.log('\n=== FORCING CONFLICT CHECK ===');
  checkForConflicts();
}

// Add event listener for delete button (red X button) to prevent deleting solid numbers
document.addEventListener('DOMContentLoaded', function() {
    const del3Btn = document.getElementById('del3Btn');
    if (!del3Btn) {
        console.error('del3Btn not found!');
        return;
    }
    
    // Remove any existing event listeners to prevent duplicates
    const newDel3Btn = del3Btn.cloneNode(true);
    del3Btn.parentNode.replaceChild(newDel3Btn, del3Btn);
    
    newDel3Btn.addEventListener('click', function(e) {
        console.log('del3Btn clicked!');
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        if (!selectedCell) {
            console.log('No cell selected');
            return;
        }
        
        console.log('Selected cell:', {
            classList: Array.from(selectedCell.classList),
            textContent: selectedCell.textContent,
            hasSolidNumber: hasSolidNumber(selectedCell)
        });
        
        // Check if the cell has a solid number or is a preset cell (blue or black)
        const isPreset = selectedCell.classList.contains('preset');
        const hasSolid = hasSolidNumber(selectedCell);
        const isBlackNumber = selectedCell.style.color === 'black' || 
                            window.getComputedStyle(selectedCell).color === 'rgb(0, 0, 0)' ||
                            selectedCell.style.color === '#000000';
        
        if (hasSolid || isPreset || (selectedCell.textContent.trim() !== '' && isBlackNumber)) {
            console.log('Preventing deletion of solid/preset number');
            // Visual feedback
            const originalBorder = selectedCell.style.border;
            selectedCell.style.border = '2px solid red';
            setTimeout(() => {
                selectedCell.style.border = originalBorder;
            }, 300);
            return false; // Prevent deletion
        }
        
        console.log('Proceeding with deletion');
        // Proceed with normal delete behavior for non-solid cells
        const beforeState = saveCellState(selectedCell);
        selectedCell.textContent = '';
        selectedCell.style.color = '';
        selectedCell.style.fontWeight = '';
        selectedCell.style.fontSize = '';
        
        // Clear any subcells or center marks
        const existingSubcells = selectedCell.querySelectorAll('.subcell, .merged-center, .center-number, .subcell-highlight');
        existingSubcells.forEach(el => el.remove());
        
        // Save state after action for history
        const afterState = saveCellState(selectedCell);
        addToHistory(beforeState, afterState, 'delete');
        
        // Update conflicts and highlights
        checkForConflicts();
        checkPencilMarkConflicts();
        
        return false;
    });
    
    console.log('del3Btn event listener added successfully');
});

// Final test to ensure script loads completely
console.log('Script loaded completely - all functions should be available');

// Add test function to window for easy access
window.testConflict = testSpecificConflict;