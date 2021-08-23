// Canvas.js
import React, { useRef, useCallback, useEffect } from 'react';
import { Layer, Stage, Line, Rect } from 'react-konva';

import { useShapes, clearSelection, createCircle, createRectangle, saveDiagram, reset, generateJSON, loadDiagram } from './state';
import { DRAG_DATA_KEY, SHAPE_TYPES, CANVAS_WIDTH, CANVAS_HEIGHT, GRID_LENGTH, GRID_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT } from './constants';
import { Shape } from './Shape';
import Konva from 'konva';

const handleDragOver = (event) => event.preventDefault();

export function Canvas() {
  const shapes = useShapes((state) => Object.entries(state.shapes));

  const stageRef = useRef();

  const uploadBtn = useRef(null);

  const uploadClick = () => {
    uploadBtn.current.click();
  };

  const onFilePicked = (e) => {
    const files = e.target.files;
    console.log(files);
    if (files[0] !== undefined) {
      const reader = new FileReader();
      reader.readAsText(files[0]);
      reader.onload = (event) => {
        console.log(JSON.parse(event.target.result));
        loadDiagram(event.target.result);
      };
    }
  };

  const handleDrop = useCallback((event) => {
    const draggedData = event.nativeEvent.dataTransfer.getData(DRAG_DATA_KEY);

    if (draggedData) {
      const { offsetX, offsetY, type, clientHeight, clientWidth } = JSON.parse(draggedData);

      stageRef.current.setPointersPositions(event);

      const coords = stageRef.current.getPointerPosition();

      if (type === SHAPE_TYPES.RECT) {
        // rectangle x, y is at the top,left corner
        createRectangle({
          x: coords.x - offsetX,
          y: coords.y - offsetY,
        });
      } else if (type === SHAPE_TYPES.CIRCLE) {
        // circle x, y is at the center of the circle
        createCircle({
          x: coords.x - (offsetX - clientWidth / 2),
          y: coords.y - (offsetY - clientHeight / 2),
        });
      }
    }
  }, []);

  const alertJSON = () => alert(generateJSON());

  const logCanvasChild = () => console.log('👺 canvasChild', shapes);

  const downloadJSON = () => {
    const download = document.createElement('a');
    download.setAttribute('href', 'data:text/json;charset=utf-8, ' + encodeURIComponent(generateJSON()));
    download.setAttribute('download', 'lockey_floorplan.json');
    document.body.appendChild(download);

    download.click();
    document.body.removeChild(download);
  };

  const gridLayerRef = useRef(null);

  const addGridBlocks = () => {
    for (let i = 0; i < GRID_LENGTH; i++) {
      for (let j = 0; j < GRID_HEIGHT; j++) {
        gridLayerRef.current.add(
          new Konva.Rect({
            x: BLOCK_WIDTH * i,
            y: BLOCK_HEIGHT * j,
            width: BLOCK_WIDTH,
            height: BLOCK_HEIGHT,
            stroke: 'lightgray',
            strokeWidth: 0.5,
          })
        );
      }
    }
  };

  useEffect(() => {
    addGridBlocks();
  }, []);

  return (
    <>
      <main className='canvas' onDrop={handleDrop} onDragOver={handleDragOver}>
        <div className='buttons'>
          <button onClick={saveDiagram}>Save Local</button>
          <button onClick={reset}>Reset</button>
          <button onClick={alertJSON}>Generate JSON</button>
          <button onClick={logCanvasChild}>Log It!</button>
          <button onClick={downloadJSON}>Download</button>
          <input ref={uploadBtn} type='file' style={{ display: 'none' }} onChange={onFilePicked} />
          <button onClick={uploadClick}>load File</button>
        </div>
        <Stage ref={stageRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} onClick={clearSelection}>
          <Layer ref={gridLayerRef}></Layer>
          <Layer>
            {shapes.map(([key, shape]) => (
              <Shape key={key} shape={{ ...shape, id: key }} />
            ))}
          </Layer>
        </Stage>
      </main>
    </>
  );
}
