export const SHAPE_TYPES = {
  RECT: 'rect',
  CIRCLE: 'circle',
};

export const DEFAULTS = {
  RECT: {
    STROKE: '#000000',
    FILL: '#ffffff',
    WIDTH: 150,
    HEIGHT: 100,
    ROTATION: 0,
  },
  CIRCLE: {
    STROKE: '#000000',
    FILL: '#ffffff',
    RADIUS: 50,
  },
};

export const CANVAS_WIDTH = window.innerWidth - 400;
export const CANVAS_HEIGHT = window.innerHeight;
export const GRID_LENGTH = 8;
export const GRID_HEIGHT = 8;
export const BLOCK_WIDTH = CANVAS_WIDTH / GRID_LENGTH;
export const BLOCK_HEIGHT = CANVAS_HEIGHT / GRID_HEIGHT;

export const LIMITS = {
  RECT: {
    MAX: 1000,
    MIN: 100,
    MIN_WIDTH: BLOCK_WIDTH,
    MIN_HEIGHT: BLOCK_HEIGHT,
  },
  CIRCLE: {
    MAX: 500,
    MIN: 5,
  },
};

export const DRAG_DATA_KEY = '__drag_data_payload__';
